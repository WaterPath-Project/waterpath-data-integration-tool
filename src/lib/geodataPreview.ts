import parseGeoraster from "georaster";
import api from "@/api";
import { findFeatureCollection } from "@/lib/flowVectors";
import { GeodataPreviewFile, Scenario, sspParam } from "@/lib/scenarios";

/** One call to POST /api/geodata/preview. */
export type PreviewRequest = {
  sessionId: string;
  file: GeodataPreviewFile;
  /** Active projection scenario; omitted on the baseline (no year / SSP sent). */
  scenario?: Scenario;
  /** `dimension` parameter (species, month, ...). */
  dimension?: string | null;
};

/**
 * What the endpoint gave us: a URL to fetch, the GeoTIFF bytes themselves, or a
 * JSON document that is the data (e.g. the flow-vectors GeoJSON).
 */
export type PreviewResult = { url: string } | { bytes: ArrayBuffer } | { json: unknown };

export const previewQueryKey = ({ sessionId, file, scenario, dimension }: PreviewRequest) => [
  "geodataPreview",
  sessionId,
  file,
  dimension ?? null,
  scenario?.ssp ?? null,
  scenario?.year ?? null,
];

const URL_KEYS = ["url", "tif_url", "file_url", "href", "download_url"];
const BASE64_KEYS = ["data", "content", "base64", "tif"];

const looksLikeUrl = (value: string) => /^(https?:\/\/|\/|blob:|data:)/.test(value) || /\.tiff?(\?|$)/i.test(value);

/** Finds the first raster URL in an arbitrary JSON payload (preferred keys first, then any string). */
function findRasterUrl(value: unknown): string | null {
  if (typeof value === "string") return looksLikeUrl(value) ? value : null;
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findRasterUrl(item);
      if (found) return found;
    }
    return null;
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of URL_KEYS) {
      const candidate = record[key];
      if (typeof candidate === "string" && looksLikeUrl(candidate)) return candidate;
    }
    for (const nested of Object.values(record)) {
      const found = findRasterUrl(nested);
      if (found) return found;
    }
  }
  return null;
}

/** Finds a base64-encoded GeoTIFF in a JSON payload and decodes it. */
function findRasterBase64(value: unknown): ArrayBuffer | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  for (const key of BASE64_KEYS) {
    const candidate = record[key];
    if (typeof candidate === "string" && candidate.length > 100 && !looksLikeUrl(candidate)) {
      try {
        const binary = atob(candidate.replace(/^data:[^,]*,/, ""));
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
        return bytes.buffer;
      } catch {
        return null;
      }
    }
  }
  return null;
}

/** POST /api/geodata/preview, resolved to a raster URL, its bytes, or the JSON data itself. */
export const fetchPreview = async ({ sessionId, file, scenario, dimension }: PreviewRequest): Promise<PreviewResult> => {
  const params = new URLSearchParams({ session_id: sessionId, file });
  if (scenario) {
    params.set("year", scenario.year);
    params.set("SSP", sspParam(scenario.ssp));
  }
  if (dimension) params.set("dimension", dimension);
  const result = await api.post<ArrayBuffer>(
    `https://dev.waterpath.venthic.com/api/geodata/preview?${params.toString()}`,
    null,
    { responseType: "arraybuffer" },
  );
  const contentType = String(result.headers["content-type"] ?? "");
  if (!contentType.includes("json")) return { bytes: result.data };

  const payload: unknown = JSON.parse(new TextDecoder().decode(result.data));
  const collection = findFeatureCollection(payload);
  if (collection) return { json: collection };
  const url = findRasterUrl(payload);
  if (url) return { url };
  const bytes = findRasterBase64(payload);
  if (bytes) return { bytes };
  throw new Error("Geodata preview response contains no raster");
};

/** True when a raster preview has at least one positive cell (mirrors `animal_totals.py` in the reference). */
export const rasterHasValues = async (preview: PreviewResult): Promise<boolean> => {
  if ("json" in preview) return false;
  const bytes = "bytes" in preview ? preview.bytes : await fetch(preview.url).then((r) => r.arrayBuffer());
  // georaster transfers the buffer to a worker, which detaches it. Parse a copy so the
  // original bytes stay usable for the map layer.
  const georaster = await parseGeoraster(bytes.slice(0));
  const max = (georaster as { maxs?: number[] }).maxs?.[0];
  return typeof max === "number" && max > 0;
};
