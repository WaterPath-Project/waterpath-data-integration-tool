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
  /**
   * Set when the vectors were derived in the browser from a discharge raster
   * (no routing data available): bearings are estimated and `acc` is the discharge.
   */
  derived_from?: "discharge";
};

// Degrees clockwise from north for each D8 code.
const ESRI_BEARING: Record<number, number> = { 1: 90, 2: 135, 4: 180, 8: 225, 16: 270, 32: 315, 64: 0, 128: 45 };
const TAUDEM_BEARING: Record<number, number> = { 1: 90, 2: 45, 3: 0, 4: 315, 5: 270, 6: 225, 7: 180, 8: 135 };
const D8_CODES = new Set([1, 2, 3, 4, 5, 6, 7, 8, 16, 32, 64, 128]);

// The 8 neighbours as [dRow, dCol, bearing] (bearing from the cell towards the neighbour).
const NEIGHBOURS: ReadonlyArray<readonly [number, number, number]> = [
  [-1, 0, 0], [-1, 1, 45], [0, 1, 90], [1, 1, 135], [1, 0, 180], [1, -1, 225], [0, -1, 270], [-1, -1, 315],
];

/** The georaster fields the port needs (georaster ships no types). */
export type FlowGeoraster = {
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

const isValid = (v: number | null | undefined, nodata: number | null): v is number =>
  v != null && Number.isFinite(v) && v !== nodata;

/** True when every valid cell of the band holds a D8 direction code (ESRI or TauDEM). */
export function isD8Raster(band: ArrayLike<number>[], nodata: number | null): boolean {
  let seen = 0;
  for (const row of band) {
    for (let c = 0; c < row.length; c += 1) {
      const v = row[c];
      if (!isValid(v, nodata)) continue;
      if (!Number.isInteger(v) || !D8_CODES.has(v)) return false;
      seen += 1;
    }
  }
  return seen > 0;
}

/**
 * Builds the flow vectors from a raster the API serves for the flow layer:
 * a D8 routing raster (band 1 direction, optional band 2 accumulation), or,
 * when the values are not direction codes, a discharge raster, from which the
 * downstream direction is estimated (see `buildFlowVectorsFromDischarge`).
 */
export function buildFlowVectorsFromGeoraster(georaster: unknown): FlowVectors {
  const gr = georaster as FlowGeoraster;
  const nodata = gr.noDataValue ?? null;
  if (!isD8Raster(gr.values[0], nodata)) return buildFlowVectorsFromDischarge(coarsenResampledRaster(gr));
  return buildFlowVectorsFromRouting(gr);
}

/** Most common value of a list and the share of entries holding it. */
function mode(values: number[]): { value: number; share: number } {
  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  let best = 0;
  let bestCount = 0;
  for (const [v, n] of counts) {
    if (n > bestCount) {
      best = v;
      bestCount = n;
    }
  }
  return { value: best, share: values.length ? bestCount / values.length : 0 };
}

/**
 * Detects a raster that was resampled from a coarser grid: values are then
 * constant over aligned k x k blocks. Returns the block size `k` (1 when not
 * resampled) and the `shift` (0..k-1) to add to the row/column index so that
 * `Math.floor((index + shift) / k)` is the block index.
 */
export function detectBlockFactor(gr: FlowGeoraster): { k: number; shiftR: number; shiftC: number } {
  const nodata = gr.noDataValue ?? null;
  const runsOf = (line: (i: number) => number | null | undefined, length: number) => {
    const runs: { start: number; len: number }[] = [];
    let start = -1;
    let prev = NaN;
    for (let i = 0; i <= length; i += 1) {
      const v = i < length ? line(i) : null;
      const valid = isValid(v, nodata);
      if (valid && v === prev) continue;
      if (start >= 0) runs.push({ start, len: i - start });
      start = valid ? i : -1;
      prev = valid ? v : NaN;
    }
    return runs;
  };
  const band = gr.values[0];
  const rowRuns = Array.from({ length: gr.height }, (_, r) => runsOf((c) => band[r][c], gr.width)).flat();
  const colRuns = Array.from({ length: gr.width }, (_, c) => runsOf((r) => band[r][c], gr.height)).flat();
  // Runs touching the raster edge may be partial blocks; use interior runs for the size.
  const interior = (runs: { start: number; len: number }[], length: number) =>
    runs.filter((run) => run.start > 0 && run.start + run.len < length).map((run) => run.len);
  const kRow = mode(interior(rowRuns, gr.width));
  const kCol = mode(interior(colRuns, gr.height));
  if (kRow.value < 2 || kRow.value !== kCol.value || kRow.share < 0.5 || kCol.share < 0.5) {
    return { k: 1, shiftR: 0, shiftC: 0 };
  }
  const k = kRow.value;
  const shiftFor = (runs: { start: number; len: number }[]) =>
    (k - mode(runs.filter((run) => run.len === k).map((run) => run.start % k)).value) % k;
  return { k, shiftR: shiftFor(colRuns), shiftC: shiftFor(rowRuns) };
}

/**
 * Collapses a resampled raster back to its native grid (one value per block),
 * so the flow layer draws one arrow per real cell rather than per block edge.
 * Returns the raster unchanged when no block structure is detected.
 */
export function coarsenResampledRaster(gr: FlowGeoraster): FlowGeoraster {
  const { k, shiftR, shiftC } = detectBlockFactor(gr);
  if (k === 1) return gr;
  const nodata = gr.noDataValue ?? null;
  const band = gr.values[0];
  const height = Math.floor((gr.height - 1 + shiftR) / k) + 1;
  const width = Math.floor((gr.width - 1 + shiftC) / k) + 1;
  const coarse: number[][] = Array.from({ length: height }, () => new Array<number>(width).fill(NaN));
  for (let r = 0; r < gr.height; r += 1) {
    const bi = Math.floor((r + shiftR) / k);
    for (let c = 0; c < gr.width; c += 1) {
      const v = band[r][c];
      if (!isValid(v, nodata)) continue;
      const bj = Math.floor((c + shiftC) / k);
      if (Number.isNaN(coarse[bi][bj])) coarse[bi][bj] = v;
    }
  }
  return {
    values: [coarse],
    noDataValue: NaN,
    xmin: gr.xmin - shiftC * gr.pixelWidth,
    ymax: gr.ymax + shiftR * gr.pixelHeight,
    pixelWidth: gr.pixelWidth * k,
    pixelHeight: gr.pixelHeight * k,
    width,
    height,
  };
}

/**
 * Discharge increases downstream, so a river cell drains towards the neighbour
 * with the largest discharge above its own. Cells with no larger neighbour are
 * outlets: their arrow continues the direction of their largest inflow. `acc`
 * is set to the discharge so the density slider and arrow width still work.
 */
export function buildFlowVectorsFromDischarge(gr: FlowGeoraster): FlowVectors {
  const nodata = gr.noDataValue ?? null;
  const band = gr.values[0];
  const at = (r: number, c: number): number | null => {
    if (r < 0 || c < 0 || r >= gr.height || c >= gr.width) return null;
    const v = band[r][c];
    return isValid(v, nodata) && v > 0 ? v : null;
  };

  const features: FlowFeature[] = [];
  for (let r = 0; r < gr.height; r += 1) {
    for (let c = 0; c < gr.width; c += 1) {
      const q = at(r, c);
      if (q === null) continue;

      let bestOut = -Infinity;
      let bearing: number | null = null;
      let bestIn = -Infinity;
      let inflowBearing: number | null = null;
      for (const [dr, dc, b] of NEIGHBOURS) {
        const n = at(r + dr, c + dc);
        if (n === null) continue;
        if (n > q && n > bestOut) {
          bestOut = n;
          bearing = b;
        } else if (n < q && n > bestIn) {
          bestIn = n;
          inflowBearing = (b + 180) % 360;
        }
      }
      const finalBearing = bearing ?? inflowBearing;
      if (finalBearing === null) continue;

      const lon = gr.xmin + (c + 0.5) * gr.pixelWidth;
      const lat = gr.ymax - (r + 0.5) * gr.pixelHeight;
      features.push({
        type: "Feature",
        geometry: { type: "Point", coordinates: [lon, lat] },
        properties: { bearing: finalBearing, acc: q, discharge: q },
      });
    }
  }

  return {
    type: "FeatureCollection",
    features,
    cell_deg_x: Math.abs(gr.pixelWidth),
    cell_deg_y: Math.abs(gr.pixelHeight),
    derived_from: "discharge",
  };
}

/**
 * Routing raster: band 1 holds the D8 flow direction and, when present, band 2
 * the flow accumulation. Without an accumulation band every cell gets acc = 1
 * (uniform arrow width).
 */
export function buildFlowVectorsFromRouting(gr: FlowGeoraster): FlowVectors {
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
