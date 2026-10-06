import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, useMap } from "react-leaflet";
import L, { type PathOptions } from "leaflet";
import classNames from "classnames";
import RiveComponent from "@rive-app/react-canvas";
import "leaflet/dist/leaflet.css";
import loaderRiv from "@/components/assets/animations/loader.riv";
import { AreaOverlay, OpenFreeMapLayer } from "../map";
import { fetchSelectedAreaGeometries } from "@/lib/areaGeometries";

/** Map height in px; the selected-areas list matches it on large screens. */
export const SELECTED_AREAS_MAP_HEIGHT = 420;

type SelectedAreasMapProps = {
  /** Whether the map is shown; it slides in when true and out when false. */
  open: boolean;
  /** GADM ids of the selected areas (e.g. "UGA.1_1"). */
  gids: string[];
  /** GID_0 of the selected countries; the map opens centred on them. */
  countryGids: string[];
  /** Map height in px (default 420). */
  height?: number;
  className?: string;
};

const SLIDE_MS = 300;

/** Keeps Leaflet's size in sync with its container (the column it sits in is animated). */
function InvalidateOnResize() {
  const map = useMap();
  React.useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize({ animate: false }));
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);
  return null;
}

const SELECTED_AREA_STYLE: PathOptions = {
  color: "#0B4159",
  weight: 1.5,
  opacity: 0.9,
  fillColor: "#0B4159",
  fillOpacity: 0.25,
};

const COUNTRY_STYLE: PathOptions = {
  color: "#0B4159",
  weight: 1,
  opacity: 0.5,
  fill: false,
};

/**
 * Map of the areas picked on the Specify areas step. Opens centred on the
 * selected countries (their outlines are drawn for context), then draws the
 * selected areas fetched from the geometries endpoint and zooms to fit them;
 * it stays open and redraws as the selection changes. While anything loads the
 * Rive loader animation covers the map.
 */
export function SelectedAreasMap({ open, gids, countryGids, height = SELECTED_AREAS_MAP_HEIGHT, className }: SelectedAreasMapProps) {
  const { t } = useTranslation();
  const sortedGids = React.useMemo(() => [...gids].sort(), [gids]);
  const sortedCountries = React.useMemo(() => [...countryGids].sort(), [countryGids]);

  // Mounted while open or sliding out; `shown` drives the slide classes one frame after
  // mount; `settled` is true once the slide-in has finished, so Leaflet is only created
  // when its column has reached full width.
  const [mounted, setMounted] = React.useState(open);
  const [shown, setShown] = React.useState(false);
  const [settled, setSettled] = React.useState(false);
  React.useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => setShown(true));
      const timer = window.setTimeout(() => setSettled(true), SLIDE_MS);
      return () => {
        cancelAnimationFrame(frame);
        window.clearTimeout(timer);
      };
    }
    setShown(false);
    setSettled(false);
    const timer = window.setTimeout(() => setMounted(false), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  // Consuming `signal` makes TanStack Query abort a request as soon as its key is
  // superseded, so with rapid selection changes only the latest request completes.
  const countries = useQuery({
    queryKey: ["countryGeometries", ...sortedCountries],
    queryFn: ({ signal }) => fetchSelectedAreaGeometries(sortedCountries, signal),
    enabled: mounted && sortedCountries.length > 0,
    retry: false,
    staleTime: Infinity,
  });

  const areas = useQuery({
    queryKey: ["selectedAreaGeometries", ...sortedGids],
    queryFn: ({ signal }) => fetchSelectedAreaGeometries(sortedGids, signal),
    enabled: mounted && sortedGids.length > 0,
    retry: false,
    staleTime: Infinity,
    // Previous polygons stay on the map (under the loader) until the new ones arrive.
    placeholderData: (previous) => previous,
  });

  const countryBounds = React.useMemo(() => {
    if (!countries.data?.features?.length) return null;
    const bounds = L.geoJSON(countries.data).getBounds();
    return bounds.isValid() ? bounds : null;
  }, [countries.data]);

  if (!mounted) return null;

  const loading = countries.isFetching || areas.isFetching || !settled;
  const isError = countries.isError || areas.isError;

  return (
    <div
      className={classNames(
        "flex flex-col gap-3 transition-all duration-300 ease-out",
        shown ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0",
        className,
      )}
      aria-hidden={!open}
    >
      <div style={{ height, position: "relative" }} className="overflow-hidden rounded-[8px] bg-wpGray-200">
        {settled && countryBounds && (
          <MapContainer
            bounds={countryBounds}
            boundsOptions={{ padding: [20, 20] }}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
          >
            <InvalidateOnResize />
            <OpenFreeMapLayer styleId="bright" />
            <AreaOverlay geojson={countries.data} fit={false} style={COUNTRY_STYLE} />
            {/* Fits the view to the painted areas once they are loaded. */}
            <AreaOverlay geojson={areas.data} fit style={SELECTED_AREA_STYLE} />
          </MapContainer>
        )}
        {loading && (
          <div
            style={{ position: "absolute", inset: 0, zIndex: 650 }}
            className="flex flex-col items-center justify-center bg-wpBlue-900/60 backdrop-blur-[1px]"
          >
            <div className="h-32 w-32">
              <RiveComponent src={loaderRiv} />
            </div>
            <span className="font-inter text-sm font-semibold text-wpGreen-900">{t("areaSelector.map.loading")}</span>
            <span className="mt-1 font-inter text-xs text-wpWhite/80">{t("areaSelector.map.loadingHint")}</span>
          </div>
        )}
      </div>
      {isError && <p className="font-inter text-xs text-red-600">{t("areaSelector.map.error")}</p>}
    </div>
  );
}
