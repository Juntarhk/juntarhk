import { Router, type IRouter } from "express";
import { db, appSettingsTable } from "@workspace/db";
import { eq, inArray, like, or } from "drizzle-orm";

const router: IRouter = Router();

const SEO_GLOBAL_KEYS = [
  "seo_title_zh",
  "seo_title_en",
  "seo_description_zh",
  "seo_description_en",
  "seo_keywords",
  "seo_og_title",
  "seo_og_description",
  "seo_og_image",
  "seo_google_verification",
] as const;

const SEO_PAGES = ["home", "activities", "about", "partners", "contact"] as const;
const SEO_PAGE_FIELDS = ["title_zh", "title_en", "description_zh", "description_en", "keywords"] as const;

const SEO_PAGE_KEYS: string[] = SEO_PAGES.flatMap((page) =>
  SEO_PAGE_FIELDS.map((field) => `seo_page_${page}_${field}`)
);

// Admin-editable stats displayed in the trust/social-proof sections
const STAT_KEYS = [
  "stat_schools_served",
  "stat_activity_programmes",
  "stat_experience_years",
  "stat_campsite_sqft",
] as const;

const ALL_SEO_KEYS: string[] = [...SEO_GLOBAL_KEYS, ...SEO_PAGE_KEYS, ...STAT_KEYS];

async function getAdminPassword(): Promise<string> {
  try {
    const [row] = await db
      .select()
      .from(appSettingsTable)
      .where(eq(appSettingsTable.key, "admin_password"));
    if (row) return row.value;
  } catch {}
  return process.env.ADMIN_PASSWORD ?? "";
}

async function isAdminAuthorized(req: any): Promise<boolean> {
  const stored = await getAdminPassword();
  if (!stored) return false;
  const authHeader = req.headers.authorization ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  return token === stored;
}

router.post("/admin/password", async (req, res) => {
  if (!(await isAdminAuthorized(req))) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { newPassword } = req.body ?? {};
  if (!newPassword || typeof newPassword !== "string" || newPassword.length < 4) {
    return res.status(400).json({ error: "新密碼最少4個字元" });
  }
  try {
    await db
      .insert(appSettingsTable)
      .values({ key: "admin_password", value: newPassword })
      .onConflictDoUpdate({
        target: appSettingsTable.key,
        set: { value: newPassword, updatedAt: new Date() },
      });
    return res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to change admin password");
    return res.status(500).json({ error: "Failed to update password" });
  }
});

// Public endpoint — frontend reads these to apply meta tags
router.get("/seo-settings", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(appSettingsTable)
      .where(inArray(appSettingsTable.key, ALL_SEO_KEYS));
    const settings: Record<string, string> = {};
    for (const row of rows) settings[row.key] = row.value;
    return res.json(settings);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch SEO settings");
    return res.status(500).json({ error: "Failed to fetch SEO settings" });
  }
});

// Protected endpoint — admin saves SEO settings
router.post("/admin/seo-settings", async (req, res) => {
  if (!(await isAdminAuthorized(req))) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const fields = req.body ?? {};
  try {
    for (const key of ALL_SEO_KEYS) {
      const value = fields[key];
      if (typeof value !== "string") continue;
      await db
        .insert(appSettingsTable)
        .values({ key, value })
        .onConflictDoUpdate({
          target: appSettingsTable.key,
          set: { value, updatedAt: new Date() },
        });
    }
    return res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to save SEO settings");
    return res.status(500).json({ error: "Failed to save SEO settings" });
  }
});

const NOTIFICATION_KEYS = [
  "enquiry_email_enabled",
  "enquiry_email_recipient",
  "enquiry_auto_reply_enabled",
] as const;

router.get("/admin/notification-settings", async (req, res) => {
  if (!(await isAdminAuthorized(req))) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const rows = await db
      .select()
      .from(appSettingsTable)
      .where(inArray(appSettingsTable.key, [...NOTIFICATION_KEYS]));
    const settings: Record<string, string> = {
      enquiry_email_enabled: "true",
      enquiry_email_recipient: "info@juntarhk.com",
      enquiry_auto_reply_enabled: "false",
    };
    for (const row of rows) settings[row.key] = row.value;
    return res.json(settings);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch notification settings");
    return res.status(500).json({ error: "Failed to fetch notification settings" });
  }
});

router.post("/admin/notification-settings", async (req, res) => {
  if (!(await isAdminAuthorized(req))) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const fields = req.body ?? {};
  try {
    for (const key of NOTIFICATION_KEYS) {
      const value = fields[key];
      if (typeof value !== "string") continue;
      await db
        .insert(appSettingsTable)
        .values({ key, value })
        .onConflictDoUpdate({
          target: appSettingsTable.key,
          set: { value, updatedAt: new Date() },
        });
    }
    return res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to save notification settings");
    return res.status(500).json({ error: "Failed to save notification settings" });
  }
});

// Sync programme tags from the shared @workspace/programmes-data source into the DB
router.post("/admin/sync-programme-tags", async (req, res) => {
  if (!(await isAdminAuthorized(req))) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const { patchProgrammeTags } = await import("../seed");
    const result = await patchProgrammeTags();
    if (result.failed.length > 0) {
      return res
        .status(500)
        .json({ ok: false, ...result, error: `${result.failed.length} slug(s) failed to update` });
    }
    return res.json({ ok: true, ...result });
  } catch (err) {
    req.log.error({ err }, "Failed to sync programme tags");
    return res.status(500).json({ error: "Failed to sync programme tags" });
  }
});

// IndexNow ping — notifies search engines of updated pages
router.post("/admin/indexnow-ping", async (req, res) => {
  if (!(await isAdminAuthorized(req))) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const INDEXNOW_KEY = "5d831204cdf4400681047d5ebd51b078";
  const HOST = "www.juntarhk.com";
  const urlList = [
    "https://www.juntarhk.com/",
    "https://www.juntarhk.com/activities",
    "https://www.juntarhk.com/about",
    "https://www.juntarhk.com/partners",
    "https://www.juntarhk.com/contact",
  ];
  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    });
    return res.json({ ok: true, status: response.status });
  } catch (err) {
    req.log.error({ err }, "IndexNow ping failed");
    return res.status(500).json({ error: "IndexNow ping failed" });
  }
});

export { isAdminAuthorized };
export default router;
