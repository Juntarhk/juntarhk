import { Router, type IRouter } from "express";
import { db, enquiriesTable, appSettingsTable } from "@workspace/db";
import { SubmitEnquiryBody } from "@workspace/api-zod";
import { sendEnquiryNotification, sendEnquiryAutoReply } from "../email";
import { isAdminAuthorized } from "./admin";
import { eq, inArray } from "drizzle-orm";

const router: IRouter = Router();

router.post("/enquiries", async (req, res) => {
  try {
    const raw = { ...req.body };
    if (raw.contactEmail === "") raw.contactEmail = null;
    if (raw.contactPhone === "") raw.contactPhone = null;
    const body = SubmitEnquiryBody.parse(raw);
    if (!body.contactPhone && !body.contactEmail) {
      res.status(422).json({ error: "At least one of contactPhone or contactEmail is required" });
      return;
    }
    const [enquiry] = await db.insert(enquiriesTable).values(body).returning();
    res.status(201).json(enquiry);

    (async () => {
      try {
        const settingKeys = ["enquiry_email_enabled", "enquiry_email_recipient", "enquiry_auto_reply_enabled"];
        const settingRows = await db
          .select()
          .from(appSettingsTable)
          .where(inArray(appSettingsTable.key, settingKeys));
        const settings: Record<string, string> = {
          enquiry_email_enabled: "true",
          enquiry_email_recipient: "info@juntarhk.com",
          enquiry_auto_reply_enabled: "false",
        };
        for (const row of settingRows) settings[row.key] = row.value;

        if (settings.enquiry_email_enabled === "true") {
          await sendEnquiryNotification({ ...enquiry, contactEmail: enquiry.contactEmail ?? "", contactPhone: enquiry.contactPhone ?? "" }, settings.enquiry_email_recipient);
        }

        if (settings.enquiry_auto_reply_enabled === "true" && enquiry.contactEmail) {
          await sendEnquiryAutoReply({ ...enquiry, contactEmail: enquiry.contactEmail });
        }
      } catch (err) {
        req.log.error({ err }, "Failed to send enquiry email notification");
      }
    })();
  } catch (err) {
    req.log.error({ err }, "Failed to submit enquiry");
    res.status(500).json({ error: "Failed to submit enquiry" });
  }
});

router.get("/enquiries", async (req, res) => {
  if (!(await isAdminAuthorized(req))) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const enquiries = await db.select().from(enquiriesTable).orderBy(enquiriesTable.createdAt);
    return res.json(enquiries);
  } catch (err) {
    req.log.error({ err }, "Failed to list enquiries");
    return res.status(500).json({ error: "Failed to fetch enquiries" });
  }
});

router.patch("/enquiries/:id/notes", async (req, res) => {
  if (!(await isAdminAuthorized(req))) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const id = Number(req.params.id);
  const { notes } = req.body ?? {};
  if (typeof notes !== "string") {
    return res.status(400).json({ error: "notes must be a string" });
  }
  try {
    const [updated] = await db
      .update(enquiriesTable)
      .set({ notes: notes.trim() || null })
      .where(eq(enquiriesTable.id, id))
      .returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    return res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update enquiry notes");
    return res.status(500).json({ error: "Failed to update notes" });
  }
});

router.patch("/enquiries/:id/status", async (req, res) => {
  if (!(await isAdminAuthorized(req))) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const id = Number(req.params.id);
  const { status } = req.body ?? {};
  const validStatuses = ["pending", "contacted", "completed", "cancelled"];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  try {
    const [updated] = await db
      .update(enquiriesTable)
      .set({ status })
      .where(eq(enquiriesTable.id, id))
      .returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    return res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update enquiry status");
    return res.status(500).json({ error: "Failed to update status" });
  }
});

router.delete("/enquiries/:id", async (req, res) => {
  if (!(await isAdminAuthorized(req))) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const id = Number(req.params.id);
  try {
    const [deleted] = await db
      .delete(enquiriesTable)
      .where(eq(enquiriesTable.id, id))
      .returning();
    if (!deleted) return res.status(404).json({ error: "Not found" });
    return res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete enquiry");
    return res.status(500).json({ error: "Failed to delete enquiry" });
  }
});

export default router;
