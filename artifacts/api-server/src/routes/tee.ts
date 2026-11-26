import { Router, type IRouter } from "express";
import { db, teeOrdersTable } from "@workspace/db";
import { CreateTeeCheckoutBody } from "@workspace/api-zod";
import { sql, eq, desc } from "drizzle-orm";
import { getUncachableStripeClient } from "../stripeClient";
import { isAdminAuthorized } from "./admin";
import { logger } from "../lib/logger";

const router: IRouter = Router();

/**
 * Look up the live "Teambuilding Tee" unit price from the synced stripe schema.
 * Server-side pricing only — client-submitted amounts are never trusted.
 */
async function getTeeUnitPrice(): Promise<{ priceId: string; unitAmount: number; currency: string } | null> {
  try {
    const result = await db.execute(sql`
      SELECT pr.id, pr.unit_amount, pr.currency
      FROM stripe.prices pr
      JOIN stripe.products p ON pr.product = p.id
      WHERE p.active = true
        AND pr.active = true
        AND p.metadata->>'key' = 'teambuilding-tee'
      ORDER BY pr.created DESC
      LIMIT 1
    `);
    const row = result.rows?.[0] as { id: string; unit_amount: string | number; currency: string } | undefined;
    if (!row) return null;
    return { priceId: row.id, unitAmount: Number(row.unit_amount), currency: row.currency };
  } catch (err) {
    logger.error({ err }, "Failed to query tee price from stripe schema");
    return null;
  }
}

/**
 * Build the redirect base for Stripe success/cancel URLs from a strict
 * allowlist. The request Origin header is only honoured when it matches a
 * known site domain — never trusted blindly (open-redirect protection).
 */
function siteBaseUrl(req: { get(name: string): string | undefined }): string {
  const allowedHosts = new Set<string>(["www.juntarhk.com", "juntarhk.com"]);
  for (const d of process.env.REPLIT_DOMAINS?.split(",") ?? []) {
    const trimmed = d.trim();
    if (trimmed) allowedHosts.add(trimmed);
  }
  const devDomain = process.env.REPLIT_DEV_DOMAIN?.trim();
  if (devDomain) allowedHosts.add(devDomain);

  const origin = req.get("origin");
  if (origin) {
    try {
      const url = new URL(origin);
      if (allowedHosts.has(url.host)) {
        return `${url.protocol}//${url.host}`;
      }
    } catch {
      // fall through to canonical default
    }
  }
  const domain = process.env.REPLIT_DOMAINS?.split(",")[0]?.trim();
  return domain ? `https://${domain}` : "https://www.juntarhk.com";
}

router.get("/tee/product", async (req, res) => {
  const price = await getTeeUnitPrice();
  if (!price) {
    return res.status(503).json({ error: "Tee product not available yet" });
  }
  return res.json({ unitAmount: price.unitAmount, currency: price.currency });
});

router.post("/tee/checkout", async (req, res) => {
  try {
    const parsed = CreateTeeCheckoutBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ error: "Invalid input", details: parsed.error.issues });
    }
    const body = parsed.data;

    const price = await getTeeUnitPrice();
    if (!price) {
      return res.status(503).json({ error: "Payments not available yet" });
    }

    const stripe = await getUncachableStripeClient();
    const base = siteBaseUrl(req);
    const langPrefix = body.lang === "en" ? "/en" : "";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: price.priceId, quantity: body.quantity }],
      success_url: `${base}${langPrefix}/teambuilding-tee/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}${langPrefix}/teambuilding-tee?cancelled=1`,
      metadata: {
        kind: "teambuilding-tee",
        color: body.color,
        size: body.size,
        quantity: String(body.quantity),
        teamName: body.teamName,
        printText: body.printText ?? "",
        designNotes: body.designNotes ?? "",
        contactName: body.contactName ?? "",
        contactPhone: body.contactPhone ?? "",
      },
    });

    if (!session.url) {
      return res.status(503).json({ error: "Failed to create checkout session" });
    }

    await db.insert(teeOrdersTable).values({
      stripeSessionId: session.id,
      status: "pending",
      color: body.color,
      size: body.size,
      quantity: body.quantity,
      unitAmount: price.unitAmount,
      totalAmount: price.unitAmount * body.quantity,
      currency: price.currency,
      teamName: body.teamName,
      printText: body.printText || null,
      designNotes: body.designNotes || null,
      contactName: body.contactName || null,
      contactPhone: body.contactPhone || null,
    });

    return res.json({ url: session.url });
  } catch (err) {
    req.log.error({ err }, "Failed to create tee checkout session");
    return res.status(500).json({ error: "Failed to create checkout session" });
  }
});

router.get("/tee/orders", async (req, res) => {
  if (!(await isAdminAuthorized(req))) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const orders = await db.select().from(teeOrdersTable).orderBy(desc(teeOrdersTable.createdAt));
    return res.json(orders);
  } catch (err) {
    req.log.error({ err }, "Failed to list tee orders");
    return res.status(500).json({ error: "Failed to fetch tee orders" });
  }
});

/**
 * Public confirmation payload — deliberately excludes contact details and
 * Stripe payment identifiers. Session IDs are unguessable but this endpoint
 * is public, so only surface what the success page needs to render.
 */
function publicOrderView(order: typeof teeOrdersTable.$inferSelect) {
  return {
    id: order.id,
    stripeSessionId: order.stripeSessionId,
    status: order.status,
    color: order.color,
    size: order.size,
    quantity: order.quantity,
    unitAmount: order.unitAmount,
    totalAmount: order.totalAmount,
    currency: order.currency,
    teamName: order.teamName,
    printText: order.printText,
    designNotes: order.designNotes,
    createdAt: order.createdAt,
    paidAt: order.paidAt,
  };
}

router.get("/tee/orders/by-session/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    return res.status(404).json({ error: "Not found" });
  }
  try {
    const [order] = await db
      .select()
      .from(teeOrdersTable)
      .where(eq(teeOrdersTable.stripeSessionId, sessionId));
    if (!order) return res.status(404).json({ error: "Not found" });

    // Reconcile with Stripe if the webhook hasn't landed yet.
    if (order.status === "pending") {
      try {
        const stripe = await getUncachableStripeClient();
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === "paid") {
          const [updated] = await db
            .update(teeOrdersTable)
            .set({
              status: "paid",
              paidAt: new Date(),
              stripePaymentIntentId:
                typeof session.payment_intent === "string"
                  ? session.payment_intent
                  : (session.payment_intent?.id ?? null),
              contactEmail: order.contactEmail ?? session.customer_details?.email ?? null,
            })
            .where(eq(teeOrdersTable.stripeSessionId, sessionId))
            .returning();
          if (updated) return res.json(publicOrderView(updated));
        }
      } catch (err) {
        req.log.error({ err }, "Failed to reconcile tee order with Stripe");
      }
    }

    return res.json(publicOrderView(order));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch tee order");
    return res.status(500).json({ error: "Failed to fetch order" });
  }
});

/**
 * Called from the raw Stripe webhook route (app.ts) after signature
 * verification, for checkout.session.completed events.
 */
export async function markTeeOrderPaidFromWebhook(session: {
  id?: string;
  payment_status?: string;
  payment_intent?: string | { id?: string } | null;
  customer_details?: { email?: string | null } | null;
  metadata?: Record<string, string> | null;
} | undefined): Promise<void> {
  if (!session?.id) return;
  if (session.metadata?.kind !== "teambuilding-tee") return;
  if (session.payment_status && session.payment_status !== "paid") return;

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent?.id ?? null);

  await db
    .update(teeOrdersTable)
    .set({
      status: "paid",
      paidAt: new Date(),
      stripePaymentIntentId: paymentIntentId,
      contactEmail: sql`COALESCE(${teeOrdersTable.contactEmail}, ${session.customer_details?.email ?? null})`,
    })
    .where(eq(teeOrdersTable.stripeSessionId, session.id));

  logger.info({ sessionId: session.id }, "Tee order marked paid via webhook");
}

export default router;
