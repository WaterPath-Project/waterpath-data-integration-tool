import { RampStop, makeRampColorFn, rampGradientCss } from "./colorRamps";

/** Port of `02-hydrology/hydroColorRamps.js` from waterpath-reporting-suite. */

// Cold blue -> yellow-green -> hot red (river_temperature).
export const TEMP_STOPS: RampStop[] = [
  [0.0, [10, 100, 180]],
  [0.3, [80, 170, 220]],
  [0.5, [200, 230, 160]],
  [0.7, [240, 180, 50]],
  [1.0, [200, 30, 20]],
];

// Near-white -> deep navy (runoff).
export const RUNOFF_STOPS: RampStop[] = [
  [0.0, [240, 248, 255]],
  [0.3, [100, 180, 240]],
  [0.65, [30, 100, 200]],
  [1.0, [5, 30, 120]],
];

// Near-black -> amber -> gold (ssrd, solar radiation).
export const SSRD_STOPS: RampStop[] = [
  [0.0, [20, 20, 40]],
  [0.35, [100, 60, 20]],
  [0.65, [220, 150, 20]],
  [1.0, [255, 235, 90]],
];

export const tempColorFromNorm = makeRampColorFn(TEMP_STOPS);
export const runoffColorFromNorm = makeRampColorFn(RUNOFF_STOPS, 0.8);
export const ssrdColorFromNorm = makeRampColorFn(SSRD_STOPS);

export const TEMP_LEGEND_GRADIENT = rampGradientCss(TEMP_STOPS);
export const RUNOFF_LEGEND_GRADIENT = rampGradientCss(RUNOFF_STOPS);
export const SSRD_LEGEND_GRADIENT = rampGradientCss(SSRD_STOPS);

// Flow arrows: pale cyan (low discharge) -> wpTeal -> dark teal (high).
export const FLOW_LEGEND_GRADIENT = "linear-gradient(to right, #a1ebe3, #18B6A3, #0d6b63)";
