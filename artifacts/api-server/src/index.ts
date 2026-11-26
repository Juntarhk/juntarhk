import { runMigrations } from "stripe-replit-sync";
import app from "./app";
import { logger } from "./lib/logger";
import { seedIfEmpty, patchActivityImages, patchActivitySlugs, patchActivityGalleries, patchProgrammeTags } from "./seed";
import { getStripeSync } from "./stripeClient";

/**
 * Initialize the Stripe sync schema, managed webhook and data backfill.
 * Runs in the background after the server starts listening so a transient
 * Stripe/API issue never takes the whole API server down.
 */
async function initStripe() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required for Stripe integration");
  }

  logger.info("Initializing Stripe schema...");
  await runMigrations({ databaseUrl });

  const stripeSync = await getStripeSync();

  const webhookBaseUrl = `https://${process.env.REPLIT_DOMAINS?.split(",")[0]}`;
  const webhookResult = await stripeSync.findOrCreateManagedWebhook(
    `${webhookBaseUrl}/api/stripe/webhook`,
  );
  logger.info(
    { webhookUrl: webhookResult?.url ?? "setup complete" },
    "Stripe managed webhook configured",
  );

  await stripeSync.syncBackfill();
  logger.info("Stripe data synced");
}

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  seedIfEmpty().catch((e) => logger.error({ err: e }, "Seed failed"));
  patchActivitySlugs().catch((e) => logger.error({ err: e }, "Slug patch failed"));
  patchActivityImages().catch((e) => logger.error({ err: e }, "Image patch failed"));
  patchActivityGalleries().catch((e) => logger.error({ err: e }, "Gallery patch failed"));
  patchProgrammeTags().catch((e) => logger.error({ err: e }, "Programme tags patch failed"));

  initStripe().catch((e) => logger.error({ err: e }, "Stripe initialization failed"));
});
