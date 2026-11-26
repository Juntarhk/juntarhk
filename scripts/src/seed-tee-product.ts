import { getUncachableStripeClient } from "./stripeClient";

/**
 * Creates the "Teambuilding Tee" product and its HKD unit price in Stripe.
 * Idempotent: skips creation when the product already exists.
 *
 * Run with: pnpm --filter @workspace/scripts exec tsx src/seed-tee-product.ts
 */
const PRODUCT_NAME = "Teambuilding Tee";
const UNIT_AMOUNT = 12000; // HK$120.00 per tee (Stripe HKD amounts are in cents)

async function seedTeeProduct() {
  const stripe = await getUncachableStripeClient();

  const existing = await stripe.products.search({
    query: `name:'${PRODUCT_NAME}' AND active:'true'`,
  });

  if (existing.data.length > 0) {
    const product = existing.data[0]!;
    console.log(`Product already exists: ${product.id}`);
    const prices = await stripe.prices.list({ product: product.id, active: true });
    for (const p of prices.data) {
      console.log(`  price: ${p.id} ${p.unit_amount} ${p.currency}`);
    }
    return;
  }

  const product = await stripe.products.create({
    name: PRODUCT_NAME,
    description:
      "Custom teambuilding t-shirt by JuntarHK — choose colour and size, add your team name and print text. 訂製團隊 T 恤。",
    metadata: { key: "teambuilding-tee" },
  });
  console.log(`Created product: ${product.id}`);

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: UNIT_AMOUNT,
    currency: "hkd",
    metadata: { key: "teambuilding-tee-unit" },
  });
  console.log(`Created price: ${price.id} (HK$${UNIT_AMOUNT / 100} per tee)`);
}

seedTeeProduct().catch((err) => {
  console.error("Failed to seed tee product:", err);
  process.exit(1);
});
