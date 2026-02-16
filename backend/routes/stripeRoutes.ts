import express from "express";
import Stripe from "stripe";
import { sendPurchaseReceipt } from "../utils/purchaseReceipt";
import Order from "../models/order";

const router = express.Router();

router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const language: string = "en";

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST_MODE!);
    const signature = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_TEST_MODE!;

    try {
      const event = stripe.webhooks.constructEvent(
        req.body as Buffer,
        signature as string,
        endpointSecret
      );

      if (event.type === "charge.succeeded") {
        const { object } = event.data;

        const order = await Order.findByPk(object.metadata.orderId as string);

        if (!order) {
          res.status(404);
          throw new Error(
            language === "pl" ? "Nie znaleziono zamówienia" : "Order not found"
          );
        }
        if (order) {
          const paidCorrectAmount =
            Number(order.totalPrice).toFixed(2) === (object.amount / 100).toFixed(2);

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
            id: object.id,
            status: "COMPLETED",
            update_time: object.created,
            email_address: object.billing_details?.email,
          };
          const updatedOrder = await order.save();

          if (!updatedOrder) {
            res.status(401);
            throw new Error(
              language === "pl"
                ? "Nie znaleziono zamówienia"
                : "Order not found"
            );
          }

          await sendPurchaseReceipt(updatedOrder.id, language, res, next);
        }
      } else {
        console.log(`Unhandled event type ${event.type}`);
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
);

export default router;
