import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { categoriesTable } from "./categories";

export const activitiesTable = pgTable("activities", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique(),
  title: text("title").notNull(),
  titleEn: text("title_en").notNull(),
  description: text("description").notNull(),
  descriptionEn: text("description_en"),
  categoryId: integer("category_id").notNull().references(() => categoriesTable.id),
  additionalCategoryIds: integer("additional_category_ids").array().notNull().default(sql`ARRAY[]::integer[]`),
  targetGroup: text("target_group").array().notNull().default(sql`ARRAY['kindergarten', 'primary', 'secondary']`),
  duration: text("duration").notNull(),
  durationEn: text("duration_en"),
  minParticipants: integer("min_participants").notNull().default(10),
  maxParticipants: integer("max_participants").notNull().default(40),
  location: text("location").notNull(),
  locationEn: text("location_en"),
  imageUrl: text("image_url"),
  images: jsonb("images").$type<string[]>(),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  status: text("status").notNull().default("published"),
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  finalOutcome: text("final_outcome"),
  finalOutcomeLabel: text("final_outcome_label"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  seoKeywords: text("seo_keywords"),
});

export const insertActivitySchema = createInsertSchema(activitiesTable).omit({ id: true, createdAt: true });
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activitiesTable.$inferSelect;
