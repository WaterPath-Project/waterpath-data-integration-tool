import { useEffect } from "react";
import { useMap } from "react-leaflet";
import parseGeoraster from "georaster";
import "@/lib/proj4Setup";
import { FlowFeature, FlowVectors, buildFlowVectorsFromGeoraster, findFeatureCollection } from "@/lib/flowVectors";

export type FlowLegendData = {
  minDis: number | null;
  maxDis: number | null;
  hasDischarge: boolean;
  hasAcc: boolean;
  hasDepth: boolean;
  /** Bearings estimated from a discharge raster (no routing data served). */
  derivedFromDischarge: boolean;
};

/**
 * Loads flow vectors from a URL that serves either the flow-vectors GeoJSON
 * (possibly wrapped in another object) or a GeoTIFF (D8 routing, or discharge
 * from which the directions are estimated).
 */
const loadFlowVectors = async (url: string): Promise<FlowVectors> => {
  const ab = await fetch(url).then((r) => r.arrayBuffer());
  const head = new TextDecoder().decode(ab.slice(0, 32)).trimStart();
  if (head.startsWith("{") || head.startsWith("[")) {
    const payload: unknown = JSON.parse(new TextDecoder().decode(ab));
    const collection = findFeatureCollection(payload);
    if (!collection) throw new Error("Flow response contains no FeatureCollection");
    return collection;
  }
  const georaster = await parseGeoraster(ab);
  return buildFlowVectorsFromGeoraster(georaster);
};

/** One arrow with everything that does not depend on the viewport precomputed. */
type Arrow = {
  lat: number;
  lon: number;
  /** Rotation in radians (canvas x axis = downstream). */
  rad: number;
  color: string;
  /** 0..1, drives stroke width and head size. */
  sizeNorm: number;
};

const positive = (v: number | null | undefined): v is number => v != null && Number.isFinite(v) && v > 0;

/** Discharge (log scale) -> pale cyan .. wpTeal .. dark teal; neutral teal when unknown. */
function dischargeColor(dis: number | null | undefined, maxDis: number): string {
  if (!positive(dis)) return "#18B6A3";
  const t = Math.min(1, Math.log10(Math.max(dis, 1)) / Math.log10(Math.max(maxDis, 2)));
  return `rgb(${Math.round(161 - t * 148)},${Math.round(235 - t * 128)},${Math.round(227 - t * 128)})`;
}

/**
 * Precomputes colour (discharge) and size (depth when available, otherwise flow
 * accumulation; both log scale) for every feature. Loops instead of spreads so
 * large grids do not overflow the call stack.
 */
function prepareArrows(features: FlowFeature[]): Arrow[] {
  let maxDis = 0;
  let maxAcc = 0;
  let minDep = Infinity;
  let maxDep = 0;
  for (const f of features) {
    const { discharge, acc, depth } = f.properties;
    if (positive(discharge) && discharge > maxDis) maxDis = discharge;
    if (positive(acc) && acc > maxAcc) maxAcc = acc;
    if (positive(depth)) {
      if (depth > maxDep) maxDep = depth;
      if (depth < minDep) minDep = depth;
    }
  }
  const hasDepth = maxDep > 0;
  const logMaxAcc = maxAcc > 0 ? Math.log10(maxAcc) : 6;
  const logMaxDep = hasDepth ? Math.log10(Math.max(maxDep, 0.01)) : 0;
  const logMinDep = hasDepth ? Math.log10(Math.max(minDep, 0.001)) : 0;

  return features.map((f) => {
    const [lon, lat] = f.geometry.coordinates;
    const { bearing = 0, discharge, acc = 1, depth } = f.properties;
    let sizeNorm: number;
    if (hasDepth && positive(depth)) {
      const logDep = Math.log10(Math.max(depth, 0.001));
      sizeNorm = logMaxDep > logMinDep ? Math.max(0, Math.min(1, (logDep - logMinDep) / (logMaxDep - logMinDep))) : 0.5;
    } else {
      const logAcc = Math.log10(Math.max(acc, 1));
      sizeNorm = logMaxAcc > 0 ? Math.max(0, Math.min(1, logAcc / logMaxAcc)) : 0.5;
    }
    return { lat, lon, rad: (bearing - 90) * (Math.PI / 180), color: dischargeColor(discharge, maxDis), sizeNorm };
  });
}

type FlowArrowLayerProps = {
  /** Flow-vectors GeoJSON URL (see the 02-hydrology README), or a GeoTIFF URL. */
  url: string;
  /** Hide cells with acc < max(acc) x minAccPct / 100 (default 0). */
  minAccPct?: number;
  onLegendData?: (legend: FlowLegendData) => void;
};

/**
 * Canvas layer drawing flow arrows (one per river cell, pointing downstream).
 *   colour -> discharge (m3/s, log scale): pale cyan -> wpTeal -> dark teal
 *   width  -> river depth when available, otherwise flow accumulation (log scale)
 *   size   -> ~75% of the raster cell width in screen pixels
 *
 * The canvas is attached to the map container, not to a Leaflet pane, and is
 * redrawn on move, zoom and resize. Per-arrow styling is computed once per load;
 * each redraw only projects the arrows inside the current viewport.
 *
 * Port of `02-hydrology/FlowArrowLayer.jsx` from waterpath-reporting-suite.
 */
export function FlowArrowLayer({ url, minAccPct = 0, onLegendData }: FlowArrowLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    let rafId = 0;
    let arrows: Arrow[] = [];
    let cellDegX = 0.5;
    let cellDegY = 0.5;

    // Attached to the map container, not a pane: pane transforms would shift every
    // latLngToContainerPoint() result a second time during pan/zoom.
    const container = map.getContainer();
    const canvasEl = document.createElement("canvas");
    canvasEl.className = "leaflet-flow-arrow-layer";
    canvasEl.style.cssText = "position:absolute;top:0;left:0;pointer-events:none;z-index:590;";
    container.appendChild(canvasEl);
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;

    // Backing store at device pixel ratio for crisp strokes; drawing stays in CSS pixels.
    const resizeCanvas = () => {
      const size = map.getSize();
      const dpr = window.devicePixelRatio || 1;
      canvasEl.width = Math.max(1, Math.round(size.x * dpr));
      canvasEl.height = Math.max(1, Math.round(size.y * dpr));
      canvasEl.style.width = `${size.x}px`;
      canvasEl.style.height = `${size.y}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();

    const drawArrows = () => {
      const size = map.getSize();
      ctx.clearRect(0, 0, size.x, size.y);
      if (!arrows.length) return;

      // Arrow size from the cell footprint at the current zoom, measured at the map centre.
      const centre = map.getCenter();
      const ptRef = map.latLngToContainerPoint(centre);
      const ptOffX = map.latLngToContainerPoint([centre.lat, centre.lng + cellDegX]);
      const ptOffY = map.latLngToContainerPoint([centre.lat + cellDegY, centre.lng]);
      const cellPx = Math.min(Math.abs(ptOffX.x - ptRef.x), Math.abs(ptOffY.y - ptRef.y));
      const arrowSz = Math.max(8, Math.min(120, cellPx * 0.75));
      const stemLen = arrowSz * 0.7;

      const bounds = map.getBounds().pad(0.05);
      ctx.globalAlpha = 0.85;

      for (const arrow of arrows) {
        if (!bounds.contains([arrow.lat, arrow.lon])) continue;
        const pt = map.latLngToContainerPoint([arrow.lat, arrow.lon]);
        const hw = arrowSz * 0.28 * (0.5 + arrow.sizeNorm * 0.5);
        const hl = arrowSz * 0.44 * (0.5 + arrow.sizeNorm * 0.5);

        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(arrow.rad);

        ctx.beginPath();
        ctx.moveTo(-stemLen / 2, 0);
        ctx.lineTo(stemLen / 2, 0);
        ctx.strokeStyle = arrow.color;
        ctx.lineWidth = Math.max(0.8, (0.08 + arrow.sizeNorm * 0.22) * arrowSz);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(stemLen / 2, 0);
        ctx.lineTo(stemLen / 2 - hl, -hw);
        ctx.lineTo(stemLen / 2 - hl, hw);
        ctx.closePath();
        ctx.fillStyle = arrow.color;
        ctx.fill();

        ctx.restore();
      }
    };

    const scheduleRedraw = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(drawArrows);
    };
    const onResize = () => {
      resizeCanvas();
      scheduleRedraw();
    };
    map.on("move zoom moveend zoomend viewreset", scheduleRedraw);
    map.on("resize", onResize);

    loadFlowVectors(url)
      .then((data) => {
        if (cancelled) return;
        const all = data.features ?? [];
        // Idempotent with a server-side min_acc_pct filter: max(acc) survives filtering.
        let maxAcc = 0;
        for (const f of all) if (positive(f.properties.acc) && f.properties.acc > maxAcc) maxAcc = f.properties.acc;
        const threshold = (maxAcc * minAccPct) / 100;
        const features = all.filter((f) => (f.properties.acc ?? 0) >= threshold);
        cellDegX = data.cell_deg_x ?? 0.5;
        cellDegY = data.cell_deg_y ?? 0.5;
        arrows = prepareArrows(features);

        let minDis: number | null = null;
        let maxDis: number | null = null;
        for (const f of features) {
          const dis = f.properties.discharge;
          if (!positive(dis)) continue;
          minDis = minDis === null ? dis : Math.min(minDis, dis);
          maxDis = maxDis === null ? dis : Math.max(maxDis, dis);
        }
        onLegendData?.({
          minDis,
          maxDis,
          hasDischarge: maxDis !== null,
          hasAcc: features.some((f) => (f.properties.acc ?? 0) > 1),
          hasDepth: features.some((f) => positive(f.properties.depth)),
          derivedFromDischarge: data.derived_from === "discharge",
        });
        scheduleRedraw();
      })
      .catch((e) => console.error("FlowArrowLayer error:", e));

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      map.off("move zoom moveend zoomend viewreset", scheduleRedraw);
      map.off("resize", onResize);
      if (canvasEl.parentNode) canvasEl.parentNode.removeChild(canvasEl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, minAccPct, map]);

  return null;
}
