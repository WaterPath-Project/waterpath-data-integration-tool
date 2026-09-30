import { useQuery } from "@tanstack/react-query";
import { useDITStore } from "@/store/DITStore";
import { fetchAreaGeometries } from "@/lib/areaGeometries";

/** Outlines of the areas the session was generated for (from the store), cached for the session. */
export function useAreaGeometries() {
  const selectedAreaGids = useDITStore((state) => state.selectedAreaGids);
  const { data } = useQuery({
    queryKey: ["areaGeometries", ...selectedAreaGids],
    queryFn: () => fetchAreaGeometries(selectedAreaGids),
    enabled: selectedAreaGids.length > 0,
    retry: false,
    staleTime: Infinity,
  });
  return data ?? null;
}
