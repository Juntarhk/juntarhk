import { Router } from "express";
import { db, activitiesTable, categoriesTable } from "@workspace/db";

const router = Router();

const BASE_URL = "https://www.juntarhk.com";
const TODAY = new Date().toISOString().split("T")[0];

function url(loc: string, priority: string, changefreq: string, lastmod = TODAY) {
  return `  <url>\n    <loc>${BASE_URL}${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

router.get("/sitemap.xml", async (req, res) => {
  try {
    const [activities, categories] = await Promise.all([
      db.select({ slug: activitiesTable.slug, id: activitiesTable.id, createdAt: activitiesTable.createdAt })
        .from(activitiesTable)
        .orderBy(activitiesTable.id),
      db.select({ slug: categoriesTable.slug })
        .from(categoriesTable)
        .orderBy(categoriesTable.id),
    ]);

    const staticUrls = [
      url("/", "1.0", "weekly"),
      url("/activities", "0.9", "weekly"),
      url("/about", "0.7", "monthly"),
      url("/partners", "0.7", "monthly"),
      url("/contact", "0.8", "monthly"),
      url("/photography", "0.9", "monthly"),
      url("/ai-education", "0.9", "monthly"),
      url("/case-studies", "0.7", "monthly"),
      url("/programmes/campus-reporter-tv", "0.8", "monthly"),
      url("/programmes/mobile-photography-video", "0.8", "monthly"),
      url("/programmes/basic-photography-visual-storytelling", "0.8", "monthly"),
      url("/programmes/ai-animation-production", "0.8", "monthly"),
      url("/programmes/ai-chinese-culture-digital-story", "0.8", "monthly"),
      url("/programmes/teacher-ai-workflow", "0.8", "monthly"),
    ];

    const categoryUrls = categories
      .filter(c => c.slug)
      .map(c => url(`/activities?category=${c.slug}`, "0.8", "weekly"));

    const activityUrls = activities
      .filter(a => a.slug)
      .map(a => {
        const lastmod = a.createdAt ? new Date(a.createdAt).toISOString().split("T")[0] : TODAY;
        return url(`/activities/${a.slug}`, "0.7", "monthly", lastmod);
      });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...categoryUrls, ...activityUrls].join("\n")}
</urlset>`;

    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(xml);
  } catch (err) {
    res.status(500).send("Sitemap generation failed");
  }
});

export default router;
