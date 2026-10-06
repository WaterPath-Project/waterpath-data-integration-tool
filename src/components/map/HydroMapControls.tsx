import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { FLOW_LEGEND_GRADIENT, RUNOFF_LEGEND_GRADIENT, SSRD_LEGEND_GRADIENT, TEMP_LEGEND_GRADIENT } from "./hydroColorRamps";
import type { FlowLegendData } from "./FlowArrowLayer";
import type { RasterStats } from "./HydroInputRasterLayer";

export type HydroOverlay = "flow" | "temp" | "ssrd" | "runoff";

export const LAYER_INFO: Record<HydroOverlay, string> = {
  flow: 'Flow arrows pointing downstream, one per river cell. Arrow width scales with stream size (river depth, or flow accumulation % of basin max); colour scales with discharge (m³/s). The "Streams" slider sets the minimum stream size shown — slide left to reveal headwater streams, right to show only major rivers. When only discharge is available, directions are estimated from it.',
  temp: "Monthly or annual average river water temperature (°C) from climate input data.",
  ssrd: "Surface downwelling shortwave solar radiation (MJ m⁻²). Higher radiation accelerates pathogen die-off in open water.",
  runoff: "Overland surface runoff (mm or m³/s per cell) — water that flows across the land surface before entering channels. High-runoff areas are the main pathways for flushing pathogens from land into rivers.",
};

function LayerToggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between gap-3 px-2 py-1 rounded text-xs font-medium transition-colors ${active ? "bg-wpBlue text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
    >
      <span>{label}</span>
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${active ? "bg-white/70" : "bg-gray-300"}`} />
    </button>
  );
}

function fmtDischarge(v: number | null) {
  if (v == null) return "—";
  return v >= 1000 ? `${(v / 1000).toFixed(1)} k` : v.toFixed(1);
}

type HydroMapControlsProps = {
  activeOverlay: HydroOverlay | null;
  setActiveOverlay: React.Dispatch<React.SetStateAction<HydroOverlay | null>>;
  /** "Streams" slider (0-50 %, step 5). */
  minAccPct: number;
  setMinAccPct: (value: number) => void;
  hasFlowData?: boolean;
  hasTempData?: boolean;
  hasSsrdData?: boolean;
  hasRunoffData?: boolean;
  tempStats?: RasterStats | null;
  ssrdStats?: RasterStats | null;
  runoffStats?: RasterStats | null;
  flowLegend?: FlowLegendData | null;
};

/**
 * Absolutely-positioned layer panel rendered inside <MapContainer>.
 * One overlay is active at a time.
 *
 * Port of `02-hydrology/HydroMapControls.jsx` from waterpath-reporting-suite.
 */
export function HydroMapControls({
  activeOverlay,
  setActiveOverlay,
  minAccPct,
  setMinAccPct,
  hasFlowData = true,
  hasTempData,
  hasSsrdData,
  hasRunoffData,
  tempStats,
  ssrdStats,
  runoffStats,
  flowLegend,
}: HydroMapControlsProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [infoOpen, setInfoOpen] = useState(false);

  const showFlow = activeOverlay === "flow";
  const showTemp = activeOverlay === "temp";
  const showSsrd = activeOverlay === "ssrd";
  const showRunoff = activeOverlay === "runoff";
  const toggle = (layer: HydroOverlay) => setActiveOverlay((prev) => (prev === layer ? null : layer));

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    L.DomEvent.disableClickPropagation(el);
    L.DomEvent.disableScrollPropagation(el);
  }, []);

  return (
    <div
      ref={panelRef}
      style={{ position: "absolute", bottom: 36, left: 8, zIndex: 650 }}
      className="bg-white/90 backdrop-blur-sm rounded-lg shadow border border-gray-100 px-3 py-2.5 flex flex-col gap-1.5 min-w-[168px]"
    >
      <div className="flex items-center justify-between mb-0.5">
        <div className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">Layers</div>
        <div className="relative">
          <button
            type="button"
            onMouseEnter={() => setInfoOpen(true)}
            onMouseLeave={() => setInfoOpen(false)}
            className="w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors flex-shrink-0"
          >
            i
          </button>
          {infoOpen && (
            <div
              style={{ position: "absolute", bottom: 0, left: "calc(100% + 8px)", zIndex: 700, width: 260 }}
              className="bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2.5 text-[9px] text-gray-500 leading-relaxed space-y-2"
            >
              {hasFlowData && <div><span className="font-semibold text-gray-700">Flow: </span>{LAYER_INFO.flow}</div>}
              {hasTempData && <div><span className="font-semibold text-gray-700">River temperature: </span>{LAYER_INFO.temp}</div>}
              {hasSsrdData && <div><span className="font-semibold text-gray-700">Solar radiation: </span>{LAYER_INFO.ssrd}</div>}
              {hasRunoffData && <div><span className="font-semibold text-gray-700">Runoff: </span>{LAYER_INFO.runoff}</div>}
            </div>
          )}
        </div>
      </div>

      {hasFlowData && (
        <>
          <LayerToggle label="Flow" active={showFlow} onClick={() => toggle("flow")} />
          {showFlow && (
            <div className="flex flex-col gap-1 px-1 pb-0.5">
              <div className="flex justify-between text-[9px] text-gray-400">
                <span>Streams</span>
                <span className="text-gray-300">{minAccPct}% of max</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={minAccPct}
                onChange={(e) => setMinAccPct(Number(e.target.value))}
                className="w-full h-1 cursor-pointer accent-wpBlue"
              />
              <div className="flex justify-between text-[8px] text-gray-300">
                <span>all sizes</span>
                <span>major only</span>
              </div>
              {flowLegend && (
                <div className="mt-1">
                  {flowLegend.hasDischarge ? (
                    <>
                      <div className="text-[9px] text-gray-400 mb-0.5">Discharge (m³/s)</div>
                      <div className="h-2.5 w-full rounded" style={{ background: FLOW_LEGEND_GRADIENT }} />
                      <div className="flex justify-between text-[8px] text-gray-400 mt-0.5">
                        <span>{fmtDischarge(flowLegend.minDis)}</span>
                        <span>{fmtDischarge(flowLegend.maxDis)}</span>
                      </div>
                      <div className="text-[8px] text-gray-300 mt-1">
                        {flowLegend.hasDepth
                          ? "Width = river depth"
                          : flowLegend.derivedFromDischarge
                            ? "Width = discharge"
                            : "Width = flow accumulation"}
                      </div>
                      {flowLegend.derivedFromDischarge && (
                        <div className="text-[8px] text-gray-300">Direction estimated from discharge</div>
                      )}
                    </>
                  ) : (
                    <div className="text-[9px] text-gray-300">No discharge data</div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {hasTempData && (
        <>
          <LayerToggle label="River temperature" active={showTemp} onClick={() => toggle("temp")} />
          {showTemp && (
            <div className="px-1 pb-0.5">
              <div className="h-3.5 w-full rounded" style={{ background: TEMP_LEGEND_GRADIENT }} />
              <div className="flex justify-between text-[8px] text-gray-400 mt-0.5">
                <span>{tempStats ? `${tempStats.min.toFixed(1)} °C` : "..."}</span>
                <span>{tempStats ? `${tempStats.max.toFixed(1)} °C` : "..."}</span>
              </div>
            </div>
          )}
        </>
      )}

      {hasSsrdData && (
        <>
          <LayerToggle label="Solar radiation" active={showSsrd} onClick={() => toggle("ssrd")} />
          {showSsrd && (
            <div className="px-1 pb-0.5">
              <div className="h-3.5 w-full rounded" style={{ background: SSRD_LEGEND_GRADIENT }} />
              <div className="flex justify-between text-[8px] text-gray-400 mt-0.5">
                {ssrdStats ? (
                  <>
                    <span>{(ssrdStats.min / 1e6).toFixed(1)} MJ m⁻²</span>
                    <span>{(ssrdStats.max / 1e6).toFixed(1)} MJ m⁻²</span>
                  </>
                ) : (
                  <>
                    <span>low</span>
                    <span>high (MJ m⁻²)</span>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {hasRunoffData && (
        <>
          <LayerToggle label="Runoff" active={showRunoff} onClick={() => toggle("runoff")} />
          {showRunoff && (
            <div className="px-1 pb-0.5">
              <div className="h-3.5 w-full rounded" style={{ background: RUNOFF_LEGEND_GRADIENT }} />
              <div className="flex justify-between text-[8px] text-gray-400 mt-0.5">
                <span>{runoffStats ? `${runoffStats.min.toFixed(1)} mm` : "low"}</span>
                <span>{runoffStats ? `${runoffStats.max.toFixed(1)} mm` : "high"}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
