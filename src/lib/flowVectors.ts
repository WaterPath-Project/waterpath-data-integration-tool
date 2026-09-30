/**
 * Flow-vectors GeoJSON consumed by `FlowArrowLayer` (format in the 02-hydrology
 * README of waterpath-reporting-suite), and a browser port of its
 * `scripts/flow_vectors.py` for when the API serves the routing raster itself.
 */

export type FlowFeature = {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: { bearing: number; acc: number; discharge?: number | null; depth?: number | null };
};

export type FlowVectors = {
  type: "FeatureCollection";
  features: FlowFeature[];
  cell_deg_x?: number;
  cell_deg_y?: number;
  encoding?: "esri" | "taudem";
};

// Degrees clockwise from north for each D8 code.
const ESRI_BEARING: Record<number, number> = { 1: 90, 2: 135, 4: 180, 8: 225, 16: 270, 32: 315, 64: 0, 128: 45 };
const TAUDEM_BEARING: Record<number, number> = { 1: 90, 2: 45, 3: 0, 4: 315, 5: 270, 6: 225, 7: 180, 8: 135 };

/** The georaster fields the port needs (georaster ships no types). */
type FlowGeoraster = {
  values: ArrayLike<number>[][];
  noDataValue?: number | null;
  xmin: number;
  ymax: number;
  pixelWidth: number;
  pixelHeight: number;
  width: number;
  height: number;
};

/** 'esri' (powers of two) or 'taudem' (1-8) from the codes present. */
export function detectD8Encoding(flowdir: ArrayLike<number>[], nodata: number | null): "esri" | "taudem" {
  const present = new Set<number>();
  for (const row of flowdir) {
    for (let c = 0; c < row.length; c += 1) {
      const v = row[c];
      if (v == null || v === nodata || !(v > 0 && v <= 255)) continue;
      present.add(Math.round(v));
    }
  }
  if ([3, 5, 6, 7].some((code) => present.has(code))) return "taudem";
  if ([16, 32, 64, 128].some((code) => present.has(code))) return "esri";
  // Only {1,2,4,8} present: ambiguous, ESRI is the safer default.
  return "esri";
}

/**
 * Builds the flow vectors from a parsed routing raster: band 1 holds the D8
 * flow direction and, when present, band 2 the flow accumulation. Without an
 * accumulation band every cell gets acc = 1 (uniform arrow width).
 */
export function buildFlowVectorsFromGeoraster(georaster: unknown): FlowVectors {
  const gr = georaster as FlowGeoraster;
  const nodata = gr.noDataValue ?? null;
  const flowdir = gr.values[0];
  const flowacc = gr.values.length > 1 ? gr.values[1] : null;
  const encoding = detectD8Encoding(flowdir, nodata);
  const lookup = encoding === "esri" ? ESRI_BEARING : TAUDEM_BEARING;

  const features: FlowFeature[] = [];
  for (let r = 0; r < gr.height; r += 1) {
    const dirRow = flowdir[r];
    const accRow = flowacc?.[r];
    for (let c = 0; c < gr.width; c += 1) {
      const raw = dirRow[c];
      if (raw == null || raw === nodata || !Number.isFinite(raw)) continue;
      const bearing = lookup[Math.round(raw)];
      if (bearing === undefined) continue;
      let acc = 1;
      if (accRow) {
        const a = accRow[c];
        if (a == null || a === nodata || !Number.isFinite(a) || a < 0) continue;
        acc = a;
      }
      // Cell centres; assumes a north-up raster.
      const lon = gr.xmin + (c + 0.5) * gr.pixelWidth;
      const lat = gr.ymax - (r + 0.5) * gr.pixelHeight;
      features.push({
        type: "Feature",
        geometry: { type: "Point", coordinates: [lon, lat] },
        properties: { bearing, acc },
      });
    }
  }

  return {
    type: "FeatureCollection",
    features,
    cell_deg_x: Math.abs(gr.pixelWidth),
    cell_deg_y: Math.abs(gr.pixelHeight),
    encoding,
  };
}

/** Finds a FeatureCollection anywhere in a JSON payload (top level or nested). */
export function findFeatureCollection(value: unknown, depth = 0): FlowVectors | null {
  if (!value || typeof value !== "object" || depth > 4) return null;
  const record = value as Record<string, unknown>;
  if (record.type === "FeatureCollection" && Array.isArray(record.features)) return value as FlowVectors;
  for (const nested of Object.values(record)) {
    const found = findFeatureCollection(nested, depth + 1);
    if (found) return found;
  }
  return null;
}
