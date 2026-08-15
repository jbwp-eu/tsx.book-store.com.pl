/** Typed access to Vite env vars with deploy-target Stripe selection. */

export type DeployTarget = "ovh" | "google";

const deployTarget: DeployTarget =
  import.meta.env.VITE_DEPLOY_TARGET === "google" ? "google" : "ovh";

const stripeKeyByTarget = {
  ovh: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_TEST_MODE_OVH,
  google: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_TEST_MODE_GOOGLE,
} as const;

const confirmByTarget = {
  ovh: import.meta.env.VITE_STRIPE_CONFIRMPAYMENT_URL_OVH,
  google: import.meta.env.VITE_STRIPE_CONFIRMPAYMENT_URL_GOOGLE,
} as const;

const backendByTarget = {
  ovh: import.meta.env.VITE_BACKEND_URL_OVH,
  google: import.meta.env.VITE_BACKEND_URL_GOOGLE,
} as const;

export const env = {
  port: Number(import.meta.env.VITE_PORT) || 5173,
  deployTarget,
  backendUrl: import.meta.env.DEV
    ? (import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3003/api")
    : (backendByTarget[deployTarget] ??
      import.meta.env.VITE_BACKEND_URL ??
      "https://tsx.book-store.com.pl/api"),
  assetUrl:
    import.meta.env.VITE_ASSET_URL ?? "https://tsx.book-store.com.pl",
  appName: import.meta.env.VITE_APP_NAME ?? "BookStore",
  language: import.meta.env.VITE_LANGUAGE === "en" ? "en" : "pl",
  currency: import.meta.env.VITE_CURRENCY ?? "pln",
  tax: Number(import.meta.env.VITE_TAX) || 0,
  stripePublishableKey:
    stripeKeyByTarget[deployTarget] ??
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_TEST_MODE,
  stripeConfirmPaymentUrl: import.meta.env.DEV
    ? (import.meta.env.VITE_STRIPE_CONFIRMPAYMENT_URL ??
      "http://localhost:5173")
    : (confirmByTarget[deployTarget] ??
      import.meta.env.VITE_STRIPE_CONFIRMPAYMENT_URL ??
      "https://tsx.book-store.com.pl"),
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() || "",
  googleMapsMapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID?.trim() || "undefined",
  storeName: import.meta.env.VITE_STORE_NAME?.trim() || "BookStore",
  storeLatitude: (() => {
    const raw = import.meta.env.VITE_STORE_LATITUDE?.trim();
    if (!raw) return undefined;
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
  })(),
  storeLongitude: (() => {
    const raw = import.meta.env.VITE_STORE_LONGITUDE?.trim();
    if (!raw) return undefined;
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
  })(),
} as const;

export type AppLanguage = (typeof env)["language"];
