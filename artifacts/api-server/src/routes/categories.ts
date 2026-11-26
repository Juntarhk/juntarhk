import { Router, type IRouter } from "express";
import { db, categoriesTable, activitiesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { isAdminAuthorized } from "./admin";

const router: IRouter = Router();

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

router.get("/categories", async (req, res) => {
  try {
    const categories = await db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
        nameEn: categoriesTable.nameEn,
        slug: categoriesTable.slug,
        icon: categoriesTable.icon,
        color: categoriesTable.color,
        activityCount: sql<number>`cast(count(${activitiesTable.id}) as int)`,
      })
      .from(categoriesTable)
      .leftJoin(activitiesTable, eq(activitiesTable.categoryId, categoriesTable.id))
      .groupBy(categoriesTable.id);

    res.json(categories);
  } catch (err) {
    req.log.error({ err }, "Failed to list categories");
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.post("/categories", async (req, res) => {
  try {
    if (!(await isAdminAuthorized(req))) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { name, nameEn, slug, icon, color } = req.body ?? {};
    if (!name || typeof name !== "string" || !name.trim()) {
      res.status(400).json({ error: "類別名稱（中文）為必填" });
      return;
    }
    if (!nameEn || typeof nameEn !== "string" || !nameEn.trim()) {
      res.status(400).json({ error: "Category name (English) is required" });
      return;
    }
    const finalSlug = (typeof slug === "string" && slug.trim()) ? slug.trim() : toSlug(nameEn.trim());
    const [created] = await db
      .insert(categoriesTable)
      .values({
        name: name.trim(),
        nameEn: nameEn.trim(),
        slug: finalSlug,
        icon: (icon ?? "🎯").trim() || "🎯",
        color: (color ?? "#4CAF50").trim() || "#4CAF50",
        activityCount: 0,
      })
      .returning();
    res.status(201).json({ ...created, activityCount: 0 });
  } catch (err) {
    req.log.error({ err }, "Failed to create category");
    res.status(500).json({ error: "Failed to create category" });
  }
});

router.patch("/categories/:id", async (req, res) => {
  try {
    if (!(await isAdminAuthorized(req))) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const { name, nameEn, slug, icon, color } = req.body ?? {};
    const updateFields: any = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (nameEn !== undefined) updateFields.nameEn = nameEn.trim();
    if (slug !== undefined) updateFields.slug = slug.trim() || toSlug((nameEn ?? "").trim());
    if (icon !== undefined) updateFields.icon = icon.trim() || "🎯";
    if (color !== undefined) updateFields.color = color.trim() || "#4CAF50";

    if (Object.keys(updateFields).length === 0) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }
    const [updated] = await db
      .update(categoriesTable)
      .set(updateFields)
      .where(eq(categoriesTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update category");
    res.status(500).json({ error: "Failed to update category" });
  }
});

router.delete("/categories/:id", async (req, res) => {
  try {
    if (!(await isAdminAuthorized(req))) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const activities = await db
      .select({ id: activitiesTable.id })
      .from(activitiesTable)
      .where(eq(activitiesTable.categoryId, id))
      .limit(1);

    if (activities.length > 0) {
      res.status(409).json({ error: "此類別仍有課程，請先移除或更改課程類別後再刪除" });
      return;
    }
    const [deleted] = await db
      .delete(categoriesTable)
      .where(eq(categoriesTable.id, id))
      .returning();
    if (!deleted) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete category");
    res.status(500).json({ error: "Failed to delete category" });
  }
});

export default router;
