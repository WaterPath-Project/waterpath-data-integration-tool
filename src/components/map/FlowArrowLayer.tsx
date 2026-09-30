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
};

/**
 * Loads flow vectors from a URL that serves either the flow-vectors GeoJSON
 * (possibly wrapped in another object) or a D8 routing GeoTIFF.
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

type FlowArrowLayerProps = {
  /** Flow-vectors GeoJSON URL (see the 02-hydrology README), or a D8 routing GeoTIFF URL. */
  url: string;
  /** Hide cells with acc < max(acc) x minAccPct / 100 (default 0). */
  minAccPct?: number;
  onLegendData?: (legend: FlowLegendData) => void;
};

/**
 * Canvas layer drawing D8 flow-direction arrows (one per river cell, pointing downstream).
 *   colour -> discharge (m3/s, log scale): pale cyan -> wpTeal -> dark teal
 *   width  -> river depth when available, otherwise flow accumulation (log scale)
 *   size   -> ~75% of the raster cell width in screen pixels
 *
 * Port of `02-hydrology/FlowArrowLayer.jsx` from waterpath-reporting-suite. The
 * only addition is `loadFlowVectors`, which also accepts a routing GeoTIFF and
 * builds the vectors in the browser (port of `scripts/flow_vectors.py`).
 */
export function FlowArrowLayer({ url, minAccPct = 0, onLegendData }: FlowArrowLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    let rafId = 0;
    let features: FlowFeature[] = [];
    let cellDegX = 0;
    let cellDegY = 0;

    // Attached to the map container, not a pane: pane transforms would shift every
    // latLngToContainerPoint() result a second time during pan/zoom.
    const container = map.getContainer();
    const canvasEl = document.createElement("canvas");
    canvasEl.className = "leaflet-flow-arrow-layer";
    canvasEl.style.cssText = "position:absolute;top:0;left:0;pointer-events:none;z-index:590;";
    container.appendChild(canvasEl);

    const resizeCanvas = () => {
      const size = map.getSize();
      canvasEl.width = size.x;
      canvasEl.height = size.y;
    };
    resizeCanvas();
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;

    const drawArrows = () => {
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
      if (!features.length) return;

      const disVals = features.map((f) => f.properties.discharge).filter((v): v is number => v != null && v > 0);
      const maxDis = disVals.length ? Math.max(...disVals) : 1;

      const accVals = features.map((f) => f.properties.acc).filter((v): v is number => v != null && v > 0);
      const logMaxAcc = accVals.length ? Math.log10(Math.max(...accVals)) : 6;

      const hasDepth = features.some((f) => f.properties.depth != null && f.properties.depth > 0);
      const depVals = hasDepth ? features.map((f) => f.properties.depth ?? 0).filter((v) => v > 0) : [];
      const logMaxDep = hasDepth ? Math.log10(Math.max(...depVals, 0.01)) : 0;
      const logMinDep = hasDepth ? Math.log10(Math.max(Math.min(...depVals), 0.001)) : 0;

      const refFeat = features[Math.floor(features.length / 2)];
      const [refLon, refLat] = refFeat.geometry.coordinates;
      const ptRef = map.latLngToContainerPoint([refLat, refLon]);
      const ptOffX = map.latLngToContainerPoint([refLat, refLon + (cellDegX || 0.5)]);
      const ptOffY = map.latLngToContainerPoint([refLat + (cellDegY || 0.5), refLon]);
      const cellPxW = Math.abs(ptOffX.x - ptRef.x);
      const cellPxH = Math.abs(ptOffY.y - ptRef.y);
      const arrowSz = Math.max(8, Math.min(120, Math.min(cellPxW, cellPxH) * 0.75));

      const bounds = map.getBounds();

      for (const feat of features) {
        const [lon, lat] = feat.geometry.coordinates;
        if (!bounds.contains([lat, lon])) continue;

        const bearing = feat.properties.bearing ?? 0;
        const dis = feat.properties.discharge;
        const acc = feat.properties.acc ?? 1;
        const depth = feat.properties.depth;

        let arrowColor = "#18B6A3";
        if (dis != null && dis > 0) {
          const t = Math.min(1, Math.log10(Math.max(dis, 1)) / Math.log10(Math.max(maxDis, 2)));
          arrowColor = `rgb(${Math.round(161 - t * 148)},${Math.round(235 - t * 128)},${Math.round(227 - t * 128)})`;
        }

        let sizeNorm: number;
        if (hasDepth && depth != null && depth > 0) {
          const logDep = Math.log10(Math.max(depth, 0.001));
          sizeNorm = logMaxDep > logMinDep ? Math.max(0, Math.min(1, (logDep - logMinDep) / (logMaxDep - logMinDep))) : 0.5;
        } else {
          const logAcc = Math.log10(Math.max(acc, 1));
          sizeNorm = logMaxAcc > 0 ? logAcc / logMaxAcc : 0.5;
        }

        const lineWidth = (0.08 + sizeNorm * 0.22) * arrowSz;

        const pt = map.latLngToContainerPoint([lat, lon]);
        const rad = (bearing - 90) * (Math.PI / 180);
        const stemLen = arrowSz * 0.7;
        const hw = arrowSz * 0.28 * (0.5 + sizeNorm * 0.5);
        const hl = arrowSz * 0.44 * (0.5 + sizeNorm * 0.5);

        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.translate(pt.x, pt.y);
        ctx.rotate(rad);

        ctx.beginPath();
        ctx.moveTo(-stemLen / 2, 0);
        ctx.lineTo(stemLen / 2, 0);
        ctx.strokeStyle = arrowColor;
        ctx.lineWidth = Math.max(0.8, lineWidth);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(stemLen / 2, 0);
        ctx.lineTo(stemLen / 2 - hl, -hw);
        ctx.lineTo(stemLen / 2 - hl, hw);
        ctx.closePath();
        ctx.fillStyle = arrowColor;
        ctx.fill();

        ctx.restore();
      }
    };

    const scheduleRedraw = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(drawArrows);
    };

    const onMove = () => scheduleRedraw();
    const onResize = () => {
      resizeCanvas();
      scheduleRedraw();
    };
    map.on("move moveend zoomend", onMove);
    map.on("resize", onResize);

    loadFlowVectors(url)
      .then((data) => {
        if (cancelled) return;
        const all = data.features ?? [];
        // Idempotent with a server-side min_acc_pct filter: max(acc) survives filtering.
        const maxAcc = all.reduce((m, f) => Math.max(m, f.properties.acc ?? 0), 0);
        const threshold = (maxAcc * minAccPct) / 100;
        features = all.filter((f) => (f.properties.acc ?? 0) >= threshold);
        cellDegX = data.cell_deg_x ?? 0.5;
        cellDegY = data.cell_deg_y ?? 0.5;

        const disVals = features.map((f) => f.properties.discharge).filter((v): v is number => v != null && v > 0);
        onLegendData?.({
          minDis: disVals.length ? Math.min(...disVals) : null,
          maxDis: disVals.length ? Math.max(...disVals) : null,
          hasDischarge: disVals.length > 0,
          hasAcc: features.some((f) => (f.properties.acc ?? 0) > 1),
          hasDepth: features.some((f) => f.properties.depth != null && f.properties.depth > 0),
        });
        scheduleRedraw();
      })
      .catch((e) => console.error("FlowArrowLayer error:", e));

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      map.off("move moveend zoomend", onMove);
      map.off("resize", onResize);
      if (canvasEl.parentNode) canvasEl.parentNode.removeChild(canvasEl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, minAccPct, map]);

  return null;
}
