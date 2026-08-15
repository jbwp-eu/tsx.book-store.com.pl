/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PORT?: string;
  readonly VITE_DEPLOY_TARGET?: "ovh" | "google";
  readonly VITE_BACKEND_URL?: string;
  readonly VITE_BACKEND_URL_OVH?: string;
  readonly VITE_BACKEND_URL_GOOGLE?: string;
  readonly VITE_ASSET_URL?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_LANGUAGE?: string;
  readonly VITE_CURRENCY?: string;
  readonly VITE_TAX?: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY_TEST_MODE?: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY_TEST_MODE_OVH?: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY_TEST_MODE_GOOGLE?: string;
  readonly VITE_STRIPE_CONFIRMPAYMENT_URL?: string;
  readonly VITE_STRIPE_CONFIRMPAYMENT_URL_OVH?: string;
  readonly VITE_STRIPE_CONFIRMPAYMENT_URL_GOOGLE?: string;
  readonly VITE_GOOGLE_MAPS_API_KEY?: string;
  readonly VITE_GOOGLE_MAPS_MAP_ID?: string;
  readonly VITE_STORE_NAME?: string;
  readonly VITE_STORE_LATITUDE?: string;
  readonly VITE_STORE_LONGITUDE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
