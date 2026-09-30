/**
 * Colour scales for the raster previews. A scale maps a cell value to a colour
 * (with alpha) and drives the legend, so layer and legend always agree.
 */
export type RasterColorScale = {
  /** Ramp stops, evenly spaced over the normalised range 0..1. */
  ramp: number[][];
  /** "log": log10 between 1 and the raster max. "linear": 0 to the raster max. */
  scale: "log" | "linear";
  /** Alpha at the low and high end of the range. */
  alpha: [number, number];
  /** Ceiling used when the raster reports no maximum. */
  defaultMax: number;
};

/**
 * Population: multi-hue log10 ramp built from WaterPath brand tokens, pale
 * yellow through the greens and light blues into the darkest wpBlue. Near-zero
 * cells are almost transparent, dense cells solid.
 */
export const POPULATION_SCALE: RasterColorScale = {
  ramp: [
    [255, 229, 151], // #FFE597 wpBrown-500
    [154, 224, 165], // #9AE0A5 wpGreen-900
    [98, 178, 125], // #62B27D wpGreen-800
    [113, 175, 202], // #71AFCA wpBlue-200
    [9, 104, 144], // #096890 wpBlue-300
    [11, 65, 89], // #0B4159 wpBlue
    [13, 40, 52], // #0D2834 wpBlue-900
  ],
  scale: "log",
  alpha: [0.12, 0.95],
  defaultMax: 1e5,
};

/**
 * Livestock heads: the reference's linear scale against the raster maximum,
 * white (few heads) -> peach -> orange-red rgb(255,100,0), alpha 0.85
 * (`03-animal-distribution/HeadsRasterLayer.jsx` in waterpath-reporting-suite).
 */
export const LIVESTOCK_SCALE: RasterColorScale = {
  ramp: [
    [255, 255, 255],
    [255, 100, 0],
  ],
  scale: "linear",
  alpha: [0.85, 0.85],
  defaultMax: 1,
};

const rampRgb = (ramp: number[][], norm: number) => {
  const pos = Math.min(1, Math.max(0, norm)) * (ramp.length - 1);
  const i = Math.min(ramp.length - 2, Math.floor(pos));
  const t = pos - i;
  return ramp[i].map((v, c) => Math.round(v + (ramp[i + 1][c] - v) * t));
};

/** Normalised position (0..1) of a value on the scale, given the raster maximum. */
export function normaliseValue(scale: RasterColorScale, value: number, max: number): number {
  if (scale.scale === "log") {
    const logMax = Math.max(1, Math.log10(max));
    return Math.min(1, Math.log10(Math.max(1, value)) / logMax);
  }
  return Math.min(1, value / Math.max(max, Number.EPSILON));
}

/** CSS colour for a normalised position (0..1). */
export function scaleRgba(scale: RasterColorScale, norm: number): string {
  const [r, g, b] = rampRgb(scale.ramp, norm);
  const alpha = scale.alpha[0] + (scale.alpha[1] - scale.alpha[0]) * norm;
  return `rgba(${r},${g},${b},${alpha.toFixed(2)})`;
}

/** Legend tick values: powers of ten for log scales, quarters for linear ones. */
export function legendTicks(scale: RasterColorScale, max: number): number[] {
  if (scale.scale === "log") {
    const ticks: number[] = [];
    for (let exp = 0; exp <= Math.floor(Math.log10(Math.max(1, max))); exp += 1) ticks.push(10 ** exp);
    if (max > ticks[ticks.length - 1] * 1.5) ticks.push(max);
    return ticks;
  }
  return [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);
}
