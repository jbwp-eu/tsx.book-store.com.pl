import nodemailer from "nodemailer";

/**
 * Cloud Function (2nd gen) — Pub/Sub trigger.
 * Entry point: orderConfirmation
 *
 * Env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, DOMAIN, TO_3, STORE_NAME
 *
 * Message JSON (from backend tryEnqueueOrderConfirmation):
 * { orderId, language, userEmail, totalPrice, itemsPrice, shippingPrice, paidAt?, storeName? }
 */
export async function orderConfirmation(cloudEvent) {
  console.log("[CloudFunction] orderConfirmation invoked (Pub/Sub trigger)");

  const encoded = cloudEvent?.data?.message?.data;
  if (!encoded) {
    console.error("[CloudFunction] Missing Pub/Sub message data");
    throw new Error("Missing Pub/Sub message data");
  }

  let payload;
  try {
    payload = JSON.parse(Buffer.from(encoded, "base64").toString("utf8"));
  } catch {
    console.error("[CloudFunction] Invalid Pub/Sub message: not JSON");
    throw new Error("Invalid Pub/Sub message: not JSON");
  }

  console.log(
    `[CloudFunction] Payload received: orderId=${payload?.orderId}, email=${payload?.userEmail}, language=${payload?.language}`
  );

  const {
    orderId,
    language = "en",
    userEmail,
    totalPrice,
    itemsPrice,
    shippingPrice,
    paidAt,
    storeName,
  } = payload;

  if (!orderId || !userEmail) {
    console.error("[CloudFunction] Invalid message: orderId and userEmail required");
    throw new Error("Invalid message: orderId and userEmail required");
  }

  const {
    SMTP_HOST,
    SMTP_PORT = "465",
    SMTP_USER,
    SMTP_PASSWORD,
    DOMAIN,
    TO_3,
    STORE_NAME = "BookStore",
  } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !DOMAIN) {
    console.error("[CloudFunction] Missing SMTP_* or DOMAIN environment variables");
    throw new Error("Missing SMTP_* or DOMAIN environment variables");
  }

  const ln = language === "pl" ? "pl" : "en";
  const date = paidAt
    ? new Date(paidAt).toLocaleString()
    : new Date().toLocaleString();
  const shippingNum =
    typeof shippingPrice === "string"
      ? parseFloat(shippingPrice)
      : Number(shippingPrice) || 0;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 465,
    requireTLS: true,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });

  const name = storeName || STORE_NAME;
  const from = `"${name}" <tsx@${DOMAIN}>`;
  const to = TO_3 ? `<${userEmail}>,<${TO_3}>` : `<${userEmail}>`;
  const subject =
    ln === "pl" ? "Potwierdzenie zamówienia" : "Order confirmation";
  const idShort = String(orderId).slice(-6);

  console.log(`[CloudFunction] Sending confirmation email for order ${orderId} to ${to}`);
  await transporter.sendMail({
    from,
    to,
    subject,
    html: `<h2>${subject}</h2>
      <table>
        <tr><th>${ln === "pl" ? "Nr zamówienia" : "Order ID"}</th><td>...${idShort}</td></tr>
        <tr><th>${ln === "pl" ? "Data" : "Date"}</th><td>${date}</td></tr>
        <tr><th>${ln === "pl" ? "Pozycje" : "Items"}</th><td>${itemsPrice}; PLN</td></tr>
        <tr><th>${ln === "pl" ? "Dostawa" : "Shipping"}</th><td>${shippingNum.toFixed(2)}; PLN</td></tr>
        <tr><th>${ln === "pl" ? "Zapłacono" : "Paid"}</th><td><b>${totalPrice}; PLN</b></td></tr>
      </table>`,
  });

  console.log(
    `[CloudFunction] orderConfirmation completed successfully, orderId=${orderId}`
  );
}
