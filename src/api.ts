import axios from "axios";

/** Backend used when the host does not pass an `apiBaseUrl`. */
export const DEFAULT_API_BASE_URL = "https://dev.waterpath.venthic.com";

/**
 * Shared axios instance. Every request in the tool uses a path relative to
 * `baseURL` (for example `/api/session`), so the host decides which backend the
 * tool talks to through the `apiBaseUrl` prop.
 */
const api = axios.create({ baseURL: DEFAULT_API_BASE_URL });

/** Points the shared axios instance at `baseUrl`. Safe to call on every render. */
export function configureApi(baseUrl: string = DEFAULT_API_BASE_URL): void {
  const normalized = baseUrl.replace(/\/+$/, "");
  if (api.defaults.baseURL !== normalized) {
    api.defaults.baseURL = normalized;
  }
}

/** Current backend origin, for the few places that build absolute URLs for `fetch`. */
export function getApiBaseUrl(): string {
  return api.defaults.baseURL ?? DEFAULT_API_BASE_URL;
}

export default api;
