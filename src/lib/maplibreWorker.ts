import { getWorkerUrl, setWorkerUrl } from "maplibre-gl";
// Self-contained worker bundle produced by scripts/build-worker.mjs (gitignored, rebuilt on every build).
import workerSource from "@/generated/maplibre-gl-worker.js?raw";

let registered = false;

/**
 * Points MapLibre at a worker that ships inside this bundle.
 *
 * MapLibre resolves its worker relative to the script that loaded it (`./maplibre-gl-worker.mjs`),
 * which does not exist at that location once the tool is bundled into a host application.
 * Call this before the first map is created; it is idempotent.
 */
export function registerMaplibreWorker(): void {
  if (registered || typeof window === "undefined") return;
  registered = true;
  if (getWorkerUrl().startsWith("blob:")) return;
  const blob = new Blob([workerSource], { type: "text/javascript" });
  setWorkerUrl(URL.createObjectURL(blob));
}
