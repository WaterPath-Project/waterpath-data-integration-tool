import type { Feature, FeatureCollection } from "geojson";
import api from "@/api";

/** GADM ids: "UGA" is level 0, "UGA.1_1" level 1, "UGA.1.2_1" level 2. */
const gidCountry = (gid: string) => gid.split(".")[0];
const gidLevel = (gid: string) => gid.split(".").length - 1;

/**
 * Outlines of the selected areas as one FeatureCollection (the format
 * `shared/README.md` of waterpath-reporting-suite describes). Polygons are
 * fetched per country and admin level from /api/geodata/geometries and
 * filtered to the selected GADM ids.
 */
/**
 * Polygons of specific GADM ids (e.g. ["UGA.1_1", "UGA.2_1"]) from
 * POST /api/geodata/get-geometries, which takes the ids as its JSON body and
 * returns one Feature per id. Used by the Specify areas map.
 */
export const fetchSelectedAreaGeometries = async (gids: string[], signal?: AbortSignal): Promise<FeatureCollection> => {
  if (gids.length === 0) return { type: "FeatureCollection", features: [] };
  const result = await api.post<FeatureCollection>("/api/geodata/get-geometries", gids, { signal });
  return result.data;
};

export const fetchAreaGeometries = async (gids: string[]): Promise<FeatureCollection> => {
  const groups = new Map<string, { country: string; level: number; gids: Set<string> }>();
  gids.forEach((gid) => {
    const country = gidCountry(gid);
    const level = gidLevel(gid);
    const key = `${country}:${level}`;
    const group = groups.get(key) ?? { country, level, gids: new Set<string>() };
    group.gids.add(gid);
    groups.set(key, group);
  });

  const collections = await Promise.all(
    [...groups.values()].map(async ({ country, level, gids: wanted }) => {
      const params = new URLSearchParams({ admin: country, level: String(level) });
      const result = await api.post<FeatureCollection>(`/api/geodata/geometries?${params.toString()}`);
      const features = (result.data?.features ?? []) as Feature[];
      const gidKey = `GID_${level}`;
      return features.filter((feature) => wanted.has(String(feature.properties?.[gidKey] ?? "")));
    }),
  );
  return { type: "FeatureCollection", features: collections.flat() };
};
