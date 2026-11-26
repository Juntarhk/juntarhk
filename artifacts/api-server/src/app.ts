import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import sitemapRouter from "./routes/sitemap";
import { logger } from "./lib/logger";
import { WebhookHandlers } from "./webhookHandlers";
import { markTeeOrderPaidFromWebhook } from "./routes/tee";

const app: Express = express();

// Stripe webhook must be registered BEFORE express.json() — it needs the raw
// Buffer body for signature verification.
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];
    if (!signature) {
      return res.status(400).json({ error: "Missing stripe-signature" });
    }

    try {
      const sig = Array.isArray(signature) ? signature[0] : signature;

      if (!Buffer.isBuffer(req.body)) {
        logger.error(
          "STRIPE WEBHOOK ERROR: req.body is not a Buffer — express.json() ran before this route.",
        );
        return res.status(500).json({ error: "Webhook processing error" });
      }

      await WebhookHandlers.processWebhook(req.body as Buffer, sig!);

      // Signature already verified by processWebhook above — safe to parse and
      // react to the event for application-level order recording.
      try {
        const event = JSON.parse(req.body.toString("utf8"));
        if (event?.type === "checkout.session.completed") {
          await markTeeOrderPaidFromWebhook(event.data?.object);
        }
      } catch (err) {
        logger.error({ err }, "Failed to record paid tee order from webhook");
      }

      return res.status(200).json({ received: true });
    } catch (error) {
      logger.error({ err: error }, "Stripe webhook error");
      return res.status(400).json({ error: "Webhook processing error" });
    }
  },
);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(sitemapRouter);
app.use("/api", router);

export default app;
