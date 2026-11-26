import { Router, type IRouter } from "express";
import { db, activitiesTable, categoriesTable } from "@workspace/db";
import { CreateActivityBody, ListActivitiesQueryParams, UpdateActivityBody } from "@workspace/api-zod";
import { eq, ilike, or, and, arrayContains, isNull, asc, ne } from "drizzle-orm";
import { isAdminAuthorized } from "./admin";

const router: IRouter = Router();

router.get("/activities", async (req, res) => {
  try {
    const query = ListActivitiesQueryParams.parse(req.query);

    const conditions: ReturnType<typeof eq>[] = [];

    // Always exclude draft records from public catalogue
    conditions.push(ne(activitiesTable.status, "draft") as any);

    if (query.category) {
      const category = await db
        .select()
        .from(categoriesTable)
        .where(eq(categoriesTable.slug, query.category))
        .limit(1);
      if (category.length > 0) {
        const catId = category[0].id;
        conditions.push(
          or(
            eq(activitiesTable.categoryId, catId),
            arrayContains(activitiesTable.additionalCategoryIds, [catId])
          ) as any
        );
      }
    }
    if (query.targetGroup && query.targetGroup !== "all") {
      conditions.push(arrayContains(activitiesTable.targetGroup, [query.targetGroup]) as any);
    }
    if (query.search) {
      conditions.push(
        or(
          ilike(activitiesTable.title, `%${query.search}%`),
          ilike(activitiesTable.description, `%${query.search}%`),
          ilike(activitiesTable.titleEn, `%${query.search}%`)
        ) as any
      );
    }
    // AI subcategory tag filter
    const tagParam = (query as any).tag as string | undefined;
    if (tagParam) {
      conditions.push(arrayContains(activitiesTable.tags, [tagParam]) as any);
    }

    const activities = await db
      .select({
        id: activitiesTable.id,
        slug: activitiesTable.slug,
        title: activitiesTable.title,
        titleEn: activitiesTable.titleEn,
        description: activitiesTable.description,
        descriptionEn: activitiesTable.descriptionEn,
        categoryId: activitiesTable.categoryId,
        categoryName: categoriesTable.name,
        categoryNameEn: categoriesTable.nameEn,
        additionalCategoryIds: activitiesTable.additionalCategoryIds,
        targetGroup: activitiesTable.targetGroup,
        duration: activitiesTable.duration,
        durationEn: activitiesTable.durationEn,
        minParticipants: activitiesTable.minParticipants,
        maxParticipants: activitiesTable.maxParticipants,
        location: activitiesTable.location,
        locationEn: activitiesTable.locationEn,
        imageUrl: activitiesTable.imageUrl,
        images: activitiesTable.images,
        featured: activitiesTable.featured,
        status: activitiesTable.status,
        tags: activitiesTable.tags,
        finalOutcome: activitiesTable.finalOutcome,
        finalOutcomeLabel: activitiesTable.finalOutcomeLabel,
        createdAt: activitiesTable.createdAt,
        seoTitle: activitiesTable.seoTitle,
        seoDescription: activitiesTable.seoDescription,
        seoKeywords: activitiesTable.seoKeywords,
      })
      .from(activitiesTable)
      .leftJoin(categoriesTable, eq(activitiesTable.categoryId, categoriesTable.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(activitiesTable.sortOrder), asc(activitiesTable.id));

    res.json(activities);
  } catch (err) {
    req.log.error({ err }, "Failed to list activities");
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

router.get("/activities/:id", async (req, res) => {
  try {
    const param = req.params.id;
    const numericId = parseInt(param, 10);
    const isNumeric = !isNaN(numericId) && String(numericId) === param;

    const selectFields = {
      id: activitiesTable.id,
      slug: activitiesTable.slug,
      title: activitiesTable.title,
      titleEn: activitiesTable.titleEn,
      description: activitiesTable.description,
      descriptionEn: activitiesTable.descriptionEn,
      categoryId: activitiesTable.categoryId,
      categoryName: categoriesTable.name,
      categoryNameEn: categoriesTable.nameEn,
      categorySlug: categoriesTable.slug,
      additionalCategoryIds: activitiesTable.additionalCategoryIds,
      targetGroup: activitiesTable.targetGroup,
      duration: activitiesTable.duration,
      durationEn: activitiesTable.durationEn,
      minParticipants: activitiesTable.minParticipants,
      maxParticipants: activitiesTable.maxParticipants,
      location: activitiesTable.location,
      locationEn: activitiesTable.locationEn,
      imageUrl: activitiesTable.imageUrl,
      images: activitiesTable.images,
      featured: activitiesTable.featured,
      createdAt: activitiesTable.createdAt,
      status: activitiesTable.status,
      tags: activitiesTable.tags,
      finalOutcome: activitiesTable.finalOutcome,
      finalOutcomeLabel: activitiesTable.finalOutcomeLabel,
      seoTitle: activitiesTable.seoTitle,
      seoDescription: activitiesTable.seoDescription,
      seoKeywords: activitiesTable.seoKeywords,
    };

    const whereClause = isNumeric
      ? eq(activitiesTable.id, numericId)
      : eq(activitiesTable.slug, param);

    const results = await db
      .select(selectFields)
      .from(activitiesTable)
      .leftJoin(categoriesTable, eq(activitiesTable.categoryId, categoriesTable.id))
      .where(whereClause)
      .limit(1);

    if (results.length === 0) {
      res.status(404).json({ error: "Activity not found" });
      return;
    }

    res.json(results[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to get activity");
    res.status(500).json({ error: "Failed to fetch activity" });
  }
});

router.post("/activities", async (req, res) => {
  try {
    if (!(await isAdminAuthorized(req))) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const body = CreateActivityBody.parse(req.body);
    const [created] = await db.insert(activitiesTable).values(body).returning();
    
    await db
      .update(categoriesTable)
      .set({ activityCount: db.$count(activitiesTable, eq(activitiesTable.categoryId, body.categoryId)) as any })
      .where(eq(categoriesTable.id, body.categoryId));

    res.status(201).json({ ...created, categoryName: "" });
  } catch (err) {
    req.log.error({ err }, "Failed to create activity");
    res.status(500).json({ error: "Failed to create activity" });
  }
});

router.patch("/activities/:id", async (req, res) => {
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

    const parseResult = UpdateActivityBody.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: "Invalid request body", details: parseResult.error.flatten() });
      return;
    }
    const body = parseResult.data;

    // Get the current activity to know old categoryId before update
    const [existing] = await db
      .select({ categoryId: activitiesTable.categoryId })
      .from(activitiesTable)
      .where(eq(activitiesTable.id, id))
      .limit(1);

    if (!existing) {
      res.status(404).json({ error: "Activity not found" });
      return;
    }

    const oldCategoryId = existing.categoryId;

    const updateFields: Partial<typeof activitiesTable.$inferInsert> = {};
    if (body.slug !== undefined) updateFields.slug = body.slug ?? null;
    if (body.title !== undefined) updateFields.title = body.title;
    if (body.titleEn !== undefined) updateFields.titleEn = body.titleEn;
    if (body.description !== undefined) updateFields.description = body.description;
    if (body.descriptionEn !== undefined) updateFields.descriptionEn = body.descriptionEn;
    if (body.categoryId !== undefined) updateFields.categoryId = body.categoryId;
    if (body.targetGroup !== undefined) updateFields.targetGroup = body.targetGroup;
    if (body.duration !== undefined) updateFields.duration = body.duration;
    if (body.durationEn !== undefined) updateFields.durationEn = body.durationEn;
    if (body.minParticipants !== undefined) updateFields.minParticipants = body.minParticipants;
    if (body.maxParticipants !== undefined) updateFields.maxParticipants = body.maxParticipants;
    if (body.location !== undefined) updateFields.location = body.location;
    if (body.locationEn !== undefined) updateFields.locationEn = body.locationEn;
    if (body.imageUrl !== undefined) updateFields.imageUrl = body.imageUrl;
    if (body.images !== undefined) updateFields.images = body.images;
    if (body.featured !== undefined) updateFields.featured = body.featured;
    if ((body as any).status !== undefined) (updateFields as any).status = (body as any).status;
    if ((body as any).tags !== undefined) (updateFields as any).tags = (body as any).tags;
    if ((body as any).finalOutcome !== undefined) (updateFields as any).finalOutcome = (body as any).finalOutcome ?? null;
    if ((body as any).finalOutcomeLabel !== undefined) (updateFields as any).finalOutcomeLabel = (body as any).finalOutcomeLabel ?? null;
    if (body.seoTitle !== undefined) updateFields.seoTitle = body.seoTitle ?? null;
    if (body.seoDescription !== undefined) updateFields.seoDescription = body.seoDescription ?? null;
    if (body.seoKeywords !== undefined) updateFields.seoKeywords = body.seoKeywords ?? null;

    if (Object.keys(updateFields).length === 0) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }

    const [updated] = await db
      .update(activitiesTable)
      .set(updateFields)
      .where(eq(activitiesTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Activity not found" });
      return;
    }

    const newCategoryId = updated.categoryId;

    // Recalculate count for new category
    await db
      .update(categoriesTable)
      .set({ activityCount: db.$count(activitiesTable, eq(activitiesTable.categoryId, newCategoryId)) as any })
      .where(eq(categoriesTable.id, newCategoryId));

    // If category changed, also recalculate old category count
    if (body.categoryId !== undefined && oldCategoryId !== newCategoryId) {
      await db
        .update(categoriesTable)
        .set({ activityCount: db.$count(activitiesTable, eq(activitiesTable.categoryId, oldCategoryId)) as any })
        .where(eq(categoriesTable.id, oldCategoryId));
    }

    const category = await db
      .select({ name: categoriesTable.name })
      .from(categoriesTable)
      .where(eq(categoriesTable.id, newCategoryId))
      .limit(1);

    res.json({ ...updated, categoryName: category[0]?.name ?? "" });
  } catch (err) {
    req.log.error({ err }, "Failed to update activity");
    res.status(500).json({ error: "Failed to update activity" });
  }
});

router.delete("/activities/:id", async (req, res) => {
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

    const [deleted] = await db
      .delete(activitiesTable)
      .where(eq(activitiesTable.id, id))
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Activity not found" });
      return;
    }

    await db
      .update(categoriesTable)
      .set({ activityCount: db.$count(activitiesTable, eq(activitiesTable.categoryId, deleted.categoryId)) as any })
      .where(eq(categoriesTable.id, deleted.categoryId));

    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete activity");
    res.status(500).json({ error: "Failed to delete activity" });
  }
});

export default router;
