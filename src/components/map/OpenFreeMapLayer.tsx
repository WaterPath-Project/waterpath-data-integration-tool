import React from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import type { StyleSpecification } from "maplibre-gl";
import "@maplibre/maplibre-gl-leaflet";
import "maplibre-gl/dist/maplibre-gl.css";
import { createMinimalStyle } from "./minimalStyle";

/**
 * OpenFreeMap vector basemap for react-leaflet (render inside <MapContainer>).
 * Ported from `01-basemap/OpenFreeMapLayer.jsx` in waterpath-reporting-suite.
 * MapLibre's worker is bundled inline, so no worker URL is configured.
 */
export const BASEMAP_STYLES = [
  { id: "bright", label: "Bright" },
  { id: "positron", label: "Positron" },
  { id: "liberty", label: "Liberty" },
  { id: "dark", label: "Dark" },
  { id: "minimal", label: "Minimal" },
] as const;
export type BasemapStyleId = (typeof BASEMAP_STYLES)[number]["id"];

const STYLE_BASE_URL = "https://tiles.openfreemap.org/styles";
const CONTEXT_PANE = "basemapContextPane";
const ATTRIBUTION =
  '&copy; <a href="https://openfreemap.org/">OpenFreeMap</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

type MaplibreLayerOptions = Parameters<typeof L.maplibreGL>[0] & { attribution?: string; pane?: string };

// Labels, boundaries and waterways only; drawn above data overlays.
function contextStyle(style: StyleSpecification): StyleSpecification {
  return {
    ...style,
    layers: style.layers.filter((layer) => {
      if (layer.type === "symbol") return true;
      const sourceLayer = "source-layer" in layer ? layer["source-layer"] : undefined;
      return sourceLayer === "boundary" || (layer.type === "line" && sourceLayer === "waterway");
    }),
  };
}

type OpenFreeMapLayerProps = {
  styleId?: BasemapStyleId;
};

export function OpenFreeMapLayer({ styleId = "bright" }: OpenFreeMapLayerProps) {
  const map = useMap();

  React.useEffect(() => {
    const isMinimal = styleId === "minimal";
    const styleUrl = `${STYLE_BASE_URL}/${styleId}`;
    const controller = new AbortController();
    const baseOptions: MaplibreLayerOptions = {
      style: isMinimal ? createMinimalStyle() : styleUrl,
      attribution: ATTRIBUTION,
    };
    const baseLayer = L.maplibreGL(baseOptions).addTo(map);

    let active = true;
    let foregroundLayer: L.Layer | null = null;
    if (!map.getPane(CONTEXT_PANE)) {
      const pane = map.createPane(CONTEXT_PANE);
      pane.style.zIndex = "550";
      pane.style.pointerEvents = "none";
    }

    const stylePromise: Promise<StyleSpecification> = isMinimal
      ? Promise.resolve(createMinimalStyle())
      : fetch(styleUrl, { signal: controller.signal }).then((response) => {
          if (!response.ok) throw new Error(`Unable to load basemap style (${response.status})`);
          return response.json() as Promise<StyleSpecification>;
        });

    stylePromise
      .then((style) => {
        if (!active) return;
        const foregroundOptions: MaplibreLayerOptions = {
          style: contextStyle(style),
          pane: CONTEXT_PANE,
          attribution: "",
          interactive: false,
        };
        foregroundLayer = L.maplibreGL(foregroundOptions).addTo(map);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        console.error("Unable to load basemap context layer", error);
      });

    return () => {
      active = false;
      controller.abort();
      if (foregroundLayer) map.removeLayer(foregroundLayer);
      map.removeLayer(baseLayer);
    };
  }, [map, styleId]);

  return null;
}
