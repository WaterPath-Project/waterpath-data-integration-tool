/**
 * Colour-ramp helpers shared by the raster layers.
 * Port of `shared/colorRamps.js` from waterpath-reporting-suite.
 *
 * A ramp is a list of stops: [[t, [r, g, b]], ...] with t ascending in 0..1.
 */
export type RampStop = [number, [number, number, number]];

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Interpolate a ramp at norm (0..1) -> [r, g, b]. */
export function rampRgb(stops: RampStop[], norm: number): [number, number, number] {
  for (let i = 0; i < stops.length - 1; i += 1) {
    const [t0, c0] = stops[i];
    const [t1, c1] = stops[i + 1];
    if (norm >= t0 && norm <= t1) {
      const t = t1 === t0 ? 0 : (norm - t0) / (t1 - t0);
      return [Math.round(lerp(c0[0], c1[0], t)), Math.round(lerp(c0[1], c1[1], t)), Math.round(lerp(c0[2], c1[2], t))];
    }
  }
  return stops[norm < stops[0][0] ? 0 : stops.length - 1][1];
}

/** Returns a (norm) => CSS colour function for a ramp. */
export function makeRampColorFn(stops: RampStop[], alpha: number | null = null): (norm: number) => string {
  return (norm) => {
    const [r, g, b] = rampRgb(stops, norm);
    return alpha == null ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${alpha})`;
  };
}

/** CSS linear-gradient for a legend bar. */
export function rampGradientCss(stops: RampStop[], direction = "to right"): string {
  return `linear-gradient(${direction},${stops
    .map(([t, [r, g, b]]) => `rgb(${r},${g},${b}) ${(t * 100).toFixed(0)}%`)
    .join(",")})`;
}
