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

/**
 * Horizontal legend for a raster layer: the same colour ramp and alpha as the
 * layer, with ticks placed by the scale (powers of ten or quarters).
 */
export function RasterLegend({ colorScale, max, title }: RasterLegendProps) {
  const steps = 24;
  const gradient = Array.from({ length: steps + 1 }, (_, i) => scaleRgba(colorScale, i / steps)).join(", ");
  const ticks = legendTicks(colorScale, max);

  return (
    <div className="flex flex-col gap-1">
      {title && <span className="font-inter text-xs font-semibold text-wpBlue">{title}</span>}
      <div
        className="h-3 w-full rounded-full border border-wpGray-200"
        style={{ backgroundImage: `linear-gradient(to right, ${gradient})` }}
        aria-hidden="true"
      />
      <div className="relative h-4 w-full font-inter text-[10px] text-wpBlue">
        {ticks.map((tick, index) => {
          const left = normaliseValue(colorScale, tick, max) * 100;
          const last = index === ticks.length - 1;
          return (
            <span
              key={tick}
              className="absolute -translate-x-1/2 whitespace-nowrap"
              style={{ left: `${left}%`, transform: index === 0 ? "none" : last ? "translateX(-100%)" : undefined }}
            >
              {formatCount(tick)}
            </span>
          );
        })}
      </div>
    </div>
  );
}
