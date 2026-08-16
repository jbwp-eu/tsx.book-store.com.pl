import { cloudEvent } from "@google-cloud/functions-framework";
import nodemailer from "nodemailer";

/**
 * Cloud Function (2nd gen) — Pub/Sub / Eventarc trigger.
 * Entry point: orderConfirmation
 *
 * Env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, DOMAIN, TO_3, STORE_NAME
 *
 * Message JSON (from backend tryEnqueueOrderConfirmation):
 * { orderId, language, userEmail, totalPrice, itemsPrice, shippingPrice, paidAt?, storeName? }
 *
 * Eventarc CUSTOM_PUBSUB often hits this as HTTP: Express `req` with
 * `req.body.message.data` (base64). CloudEvent shape: `event.data.message.data`.
 */

function asObject(value) {
  if (value == null) return null;
  if (
    typeof value === "object" &&
    !Buffer.isBuffer(value) &&
    !(value instanceof Uint8Array)
  ) {
    return value;
  }
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  if (Buffer.isBuffer(value) || value instanceof Uint8Array) {
    try {
      return JSON.parse(Buffer.from(value).toString("utf8"));
    } catch {
      return null;
    }
  }
  return null;
}

function decodeMessageData(raw) {
  if (raw == null) return null;
  if (
    typeof raw === "object" &&
    !Buffer.isBuffer(raw) &&
    !(raw instanceof Uint8Array)
  ) {
    return raw;
  }

  let text;
  if (Buffer.isBuffer(raw) || raw instanceof Uint8Array) {
    text = Buffer.from(raw).toString("utf8");
  } else {
    text = String(raw);
  }

  const trimmed = text.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return null;
    }
  }

  try {
    return JSON.parse(Buffer.from(trimmed, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

function isExpressRequest(input) {
  return !!(
    input &&
    typeof input === "object" &&
    (input.method || input.rawBody != null || input.headers) &&
    ("body" in input || "query" in input)
  );
}

function extractFromRoot(root) {
  const obj = asObject(root) ?? root;
  const message =
    asObject(obj)?.message ??
    asObject(obj)?.Message ??
    obj?.message ??
    obj?.Message;

  const candidates = [
    message?.data,
    message?.Data,
    asObject(obj)?.data,
    typeof obj === "string" || Buffer.isBuffer(obj) || obj instanceof Uint8Array
      ? obj
      : null,
    asObject(obj)?.orderId ? obj : null,
  ].filter((v) => v != null && v !== "");

  for (const candidate of candidates) {
    const payload = decodeMessageData(candidate);
    if (
      payload &&
      typeof payload === "object" &&
      (payload.orderId || payload.userEmail)
    ) {
      return payload;
    }
  }
  return null;
}

function extractOrderPayload(input) {
  if (!input) return null;

  if (isExpressRequest(input)) {
    const fromBody = extractFromRoot(input.body);
    if (fromBody) return fromBody;
    if (input.rawBody) {
      const fromRaw = extractFromRoot(input.rawBody);
      if (fromRaw) return fromRaw;
    }
  }

  const fromData = extractFromRoot(input.data);
  if (fromData) return fromData;

  if (input.data_base64) {
    try {
      const decoded = Buffer.from(String(input.data_base64), "base64").toString(
        "utf8"
      );
      const fromB64 = extractFromRoot(decoded);
      if (fromB64) return fromB64;
    } catch {
      /* continue */
    }
  }

  return extractFromRoot(input);
}

function logInputShape(input) {
  try {
    if (isExpressRequest(input)) {
      console.error("[CloudFunction] input: Express Request (HTTP signature)");
      console.error(
        "[CloudFunction] body preview:",
        JSON.stringify(input.body)?.slice(0, 500)
      );
      return;
    }
    console.error("[CloudFunction] input keys:", Object.keys(input || {}));
    const data = input?.data;
    console.error(
      "[CloudFunction] data type:",
      data == null ? "null" : Buffer.isBuffer(data) ? "Buffer" : typeof data
    );
    console.error(
      "[CloudFunction] data preview:",
      typeof data === "string"
        ? data.slice(0, 500)
        : Buffer.isBuffer(data) || data instanceof Uint8Array
          ? Buffer.from(data).toString("utf8").slice(0, 500)
          : JSON.stringify(data)?.slice(0, 500)
    );
  } catch (err) {
    console.error("[CloudFunction] failed to log input shape:", err);
  }
}

async function processOrderConfirmation(input) {
  console.log("[CloudFunction] orderConfirmation invoked (Pub/Sub trigger)");

  const payload = extractOrderPayload(input);
  if (!payload) {
    logInputShape(input);
    console.error("[CloudFunction] Missing Pub/Sub message data");
    throw new Error("Missing Pub/Sub message data");
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
    console.error(
      "[CloudFunction] Invalid message: orderId and userEmail required"
    );
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
    console.error(
      "[CloudFunction] Missing SMTP_* or DOMAIN environment variables"
    );
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

  console.log(
    `[CloudFunction] Sending confirmation email for order ${orderId} to ${to}`
  );
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

// CloudEvent registration (preferred for Pub/Sub 2nd gen). Arity must be 1.
cloudEvent("orderConfirmation", (event) => processOrderConfirmation(event));

/**
 * HTTP / export entry — used when the platform invokes with Express (req, res),
 * which is what Eventarc CUSTOM_PUBSUB currently does in this project.
 */
export async function orderConfirmation(req, res) {
  try {
    await processOrderConfirmation(req);
    if (res && typeof res.status === "function" && !res.headersSent) {
      res.status(204).send("");
    }
  } catch (err) {
    if (res && typeof res.status === "function" && !res.headersSent) {
      res.status(500).send(err?.message || "error");
      return;
    }
    throw err;
  }
}
