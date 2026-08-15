import { PubSub } from "@google-cloud/pubsub";

export type OrderConfirmationPayload = {
  orderId: string;
  language: string;
  userEmail: string;
  totalPrice: number | string;
  itemsPrice: number | string;
  shippingPrice: number | string;
  paidAt?: string;
  storeName?: string;
};

/**
 * When ORDER_CONFIRMATION_TOPIC is set (Google Cloud), publish and return true.
 * On OVH leave the topic empty — caller sends SMTP directly.
 */
export async function tryEnqueueOrderConfirmation(
  payload: OrderConfirmationPayload
): Promise<boolean> {
  const topicName = process.env.ORDER_CONFIRMATION_TOPIC?.trim();
  if (!topicName) {
    console.log(
      "[OrderConfirmation] ORDER_CONFIRMATION_TOPIC not set — Cloud Function will not be invoked; using in-process SMTP"
    );
    return false;
  }

  const projectId = process.env.GCS_PROJECT_ID?.trim() || undefined;
  const pubsub = new PubSub(projectId ? { projectId } : undefined);
  const dataBuffer = Buffer.from(JSON.stringify(payload));
  console.log(
    `[OrderConfirmation] Publishing to Pub/Sub topic "${topicName}" (triggers Cloud Function), orderId=${payload.orderId}, email=${payload.userEmail}`
  );
  const messageId = await pubsub.topic(topicName).publishMessage({
    data: dataBuffer,
  });
  console.log(
    `[OrderConfirmation] Pub/Sub message published (Cloud Function enqueue OK), messageId=${messageId}, orderId=${payload.orderId}`
  );
  return true;
}
