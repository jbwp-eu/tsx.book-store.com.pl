import express from "express";
import Stripe from "stripe";
import { sendPurchaseReceipt } from "../utils/purchaseReceipt.js";
import { stripeSecretKey, stripeWebhookSecret } from "../utils/stripeEnv.js";
import Order from "../models/order.js";
import { clientIp } from "../utils/clientIp.js";

const router = express.Router();

async function markOrderPaidFromPaymentIntent(
  paymentIntent: Stripe.PaymentIntent,
  language: string,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  const orderId = paymentIntent.metadata?.orderId;
  if (!orderId) {
    console.warn(
      `[Stripe] payment_intent.succeeded: missing metadata.orderId (pi=${paymentIntent.id})`
    );
    res.status(200).json({ received: true });
    return;
  }

  const order = await Order.findByPk(orderId);
  if (!order) {
    console.warn(
      `[Stripe] payment_intent.succeeded: order not found (orderId=${orderId}, pi=${paymentIntent.id})`
    );
    res.status(200).json({ received: true });
    return;
  }

  if (order.isPaid) {
    console.log(
      `[Stripe] payment_intent.succeeded: order already paid (orderId=${orderId})`
    );
    res.status(200).json({ received: true });
    return;
  }

  const paidCorrectAmount =
    Number(order.totalPrice).toFixed(2) ===
    (paymentIntent.amount / 100).toFixed(2);

  if (!paidCorrectAmount) {
    res.status(401);
    throw new Error(
      language === "pl"
        ? "Zapłacona została nieprawidłowa kwota"
        : "Incorrect amount paid"
    );
  }

  order.isPaid = true;
  order.paidAt = new Date();
  order.paymentResult = {
    id: paymentIntent.id,
    status: "COMPLETED",
    update_time: paymentIntent.created,
    email_address: paymentIntent.receipt_email,
  };
  const updatedOrder = await order.save();

  console.log(
    `[Stripe] Order marked paid via payment_intent.succeeded (orderId=${updatedOrder.id}, pi=${paymentIntent.id})`
  );
  await sendPurchaseReceipt(updatedOrder.id, language, res, next);
}

router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const language: string = "en";

    const secretKey = stripeSecretKey();
    const endpointSecret = stripeWebhookSecret();
    if (!secretKey || !endpointSecret) {
      res.status(500);
      next(new Error("Stripe keys are not configured for DEPLOY_TARGET"));
      return;
    }

    const stripe = new Stripe(secretKey);
    const signature = req.headers["stripe-signature"];

    try {
      const event = stripe.webhooks.constructEvent(
        req.body as Buffer,
        signature as string,
        endpointSecret
      );

      console.log(`[Stripe] webhook received: ${event.id} (${event.type}) ip=${clientIp(req)}`);

      switch (event.type) {
        case "payment_intent.succeeded": {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          await markOrderPaidFromPaymentIntent(
            paymentIntent,
            language,
            res,
            next
          );
          break;
        }
        case "payment_intent.payment_failed":
        case "payment_intent.canceled": {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          const orderId = paymentIntent.metadata?.orderId;
          console.log(
            `[Stripe] ${event.type}: pi=${paymentIntent.id}, orderId=${orderId ?? "n/a"} — order left unpaid`
          );
          res.status(200).json({ received: true });
          break;
        }
        default: {
          console.log(`[Stripe] Unhandled event type ${event.type}`);
          res.status(200).json({ received: true });
          break;
        }
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
);

export default router;
