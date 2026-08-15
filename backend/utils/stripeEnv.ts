/** Stripe env selection by DEPLOY_TARGET (ovh | google). */

export type DeployTarget = "ovh" | "google";

export function getDeployTarget(): DeployTarget {
  return process.env.DEPLOY_TARGET === "google" ? "google" : "ovh";
}

export function stripeEnv(
  base: "STRIPE_SECRET_KEY_TEST_MODE" | "STRIPE_WEBHOOK_SECRET_TEST_MODE"
): string | undefined {
  const suffix = getDeployTarget() === "google" ? "GOOGLE" : "OVH";
  const value = process.env[`${base}_${suffix}`];
  const trimmed = typeof value === "string" ? value.trim() : "";
  if (trimmed) {
    return trimmed;
  }
  // Local / legacy single-key fallback
  const legacy = process.env[base];
  const legacyTrimmed = typeof legacy === "string" ? legacy.trim() : "";
  return legacyTrimmed || undefined;
}

/** Local `stripe listen` secret; used in dev only. */
export function stripeWebhookSecret(): string | undefined {
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv !== "production" && nodeEnv !== "test") {
    const cli = process.env.STRIPE_WEBHOOK_SECRET_TEST_MODE_CLI?.trim();
    if (cli) {
      return cli;
    }
  }
  return stripeEnv("STRIPE_WEBHOOK_SECRET_TEST_MODE");
}

export function stripeSecretKey(): string | undefined {
  return stripeEnv("STRIPE_SECRET_KEY_TEST_MODE");
}
