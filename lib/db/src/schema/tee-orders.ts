import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

/**
 * Teambuilding tee customization orders.
 *
 * A row is created with status "pending" when a Stripe Checkout Session is
 * created, and flipped to "paid" by the Stripe webhook (checkout.session.completed)
 * or by the success-page reconciliation lookup. Amounts are stored in cents
 * (Stripe's smallest-unit convention for HKD).
 */
export const teeOrdersTable = pgTable("tee_orders", {
  id: serial("id").primaryKey(),
  stripeSessionId: text("stripe_session_id").notNull().unique(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  status: text("status").notNull().default("pending"),
  color: text("color").notNull(),
  size: text("size").notNull(),
  quantity: integer("quantity").notNull(),
  unitAmount: integer("unit_amount").notNull(),
  totalAmount: integer("total_amount").notNull(),
  currency: text("currency").notNull().default("hkd"),
  teamName: text("team_name").notNull(),
  printText: text("print_text"),
  designNotes: text("design_notes"),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  paidAt: timestamp("paid_at"),
});

export const insertTeeOrderSchema = createInsertSchema(teeOrdersTable).omit({
  id: true,
  createdAt: true,
});
export type InsertTeeOrder = z.infer<typeof insertTeeOrderSchema>;
export type TeeOrder = typeof teeOrdersTable.$inferSelect;
