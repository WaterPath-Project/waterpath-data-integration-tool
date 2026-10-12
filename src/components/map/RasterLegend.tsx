import { RasterColorScale, legendTicks, normaliseValue, scaleRgba } from "./colorScales";

type RasterLegendProps = {
  colorScale: RasterColorScale;
  /** Raster maximum; the scale runs up to this value. */
  max: number;
  title?: string;
};

const formatCount = (value: number) => {
  if (value >= 1e6) return `${Number((value / 1e6).toPrecision(2))}M`;
  if (value >= 1e3) return `${Number((value / 1e3).toPrecision(2))}k`;
  return `${Math.round(value)}`;
};

/** Numeric value a formatted label stands for ("1.2k" -> 1200). */
const labelValue = (label: string) => {
  const unit = label.endsWith("M") ? 1e6 : label.endsWith("k") ? 1e3 : 1;
  return parseFloat(label) * unit;
};

/**
 * One tick per distinct label. When rounding makes several ticks share a label,
 * the tick whose value is closest to what the label says is kept, so the label
 * sits where that value really is on the scale.
 */
export function uniqueTicks(ticks: number[], format: (value: number) => string): { tick: number; label: string }[] {
  const byLabel = new Map<string, number>();
  for (const tick of ticks) {
    const label = format(tick);
    const current = byLabel.get(label);
    if (current === undefined || Math.abs(tick - labelValue(label)) < Math.abs(current - labelValue(label))) {
      byLabel.set(label, tick);
    }
  }
  return Array.from(byLabel, ([label, tick]) => ({ tick, label })).sort((a, b) => a.tick - b.tick);
}

/**
 * Horizontal legend for a raster layer: the same colour ramp and alpha as the
 * layer, with ticks placed by the scale (powers of ten or quarters).
 */
export function RasterLegend({ colorScale, max, title }: RasterLegendProps) {
  const steps = 24;
  const gradient = Array.from({ length: steps + 1 }, (_, i) => scaleRgba(colorScale, i / steps)).join(", ");
  const ticks = uniqueTicks(legendTicks(colorScale, max), formatCount);

  return (
    <div className="flex flex-col gap-1">
      {title && <span className="font-inter text-xs font-semibold text-wpBlue">{title}</span>}
      <div
        className="h-3 w-full rounded-full border border-wpGray-200"
        style={{ backgroundImage: `linear-gradient(to right, ${gradient})` }}
        aria-hidden="true"
      />
      <div className="relative h-4 w-full font-inter text-[10px] text-wpBlue">
        {ticks.map(({ tick, label }) => {
          const left = normaliseValue(colorScale, tick, max) * 100;
          // Labels near either edge are anchored inwards so they stay inside the bar.
          const transform = left < 5 ? "none" : left > 95 ? "translateX(-100%)" : undefined;
          return (
            <span key={tick} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${left}%`, transform }}>
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
