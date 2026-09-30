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
      const result = await api.post<FeatureCollection>(`https://dev.waterpath.venthic.com/api/geodata/geometries?${params.toString()}`);
      const features = (result.data?.features ?? []) as Feature[];
      const gidKey = `GID_${level}`;
      return features.filter((feature) => wanted.has(String(feature.properties?.[gidKey] ?? "")));
    }),
  );
  return { type: "FeatureCollection", features: collections.flat() };
};
