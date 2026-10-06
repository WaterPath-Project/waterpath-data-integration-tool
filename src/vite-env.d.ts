/// <reference types="./vite-env-override.d.ts" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend origin for the standalone site (defaults to the development backend). */
  readonly VITE_API_BASE_URL?: string;
}
