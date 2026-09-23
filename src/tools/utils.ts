import { AdminstrativeLevelEnum, GADMAreas, GADMCountries } from "@/types";

/**
 * Formats a raw GADM admin label (e.g. "Region|Province" or "AutonomousCommunity/Region")
 * into a short human readable form: at most two parts joined by "/", camel case split into words.
 *
 * @example
 * formatAdminLabel("AutonomousCommunity|Region"); // "Autonomous Community/Region"
 */
export function formatAdminLabel(label: string): string {
    return label
        .split(/[|/]/)
        .slice(0, 2)
        .map((part) => part.replace(/([a-z])([A-Z])/g, "$1 $2").trim())
        .join("/");
}

/**
 * Returns, for each administrative level, the unique formatted admin labels across the given countries.
 * Index 0 is left empty (the country itself); index i (i >= 1) holds the labels for Level i, e.g. "Region, Province".
 *
 * @example
 * getAdminLevelLabels(countries); // ["", "Region", "Province, Department", ...]
 */
export function getAdminLevelLabels(countries: GADMCountries[]): string[] {
    const maxLen = countries.reduce((max, c) => Math.max(max, c.ADMIN_LABELS?.length ?? 0), 0);
    const result: string[] = [""];
    for (let i = 0; i < maxLen; i++) {
        const labels = countries
            .map((c) => c.ADMIN_LABELS?.[i])
            .filter((label): label is string => Boolean(label) && label !== "NA")
            .map(formatAdminLabel);
        result.push(Array.from(new Set(labels)).join(", "));
    }
    return result;
}

/**
 * Converts an AdminstrativeLevelEnum value (e.g., "Level3") to its corresponding numeric level (e.g., 3).
 *
 * @param {AdminstrativeLevelEnum} level - The administrative level enum value to convert.
 * @returns {number} The numeric representation of the level. Returns 0 if the format is invalid.
 *
 * @example
 * levelEnumToNumber(AdminstrativeLevelEnum.Level2); // returns 2
 * levelEnumToNumber("Level5" as AdminstrativeLevelEnum); // returns 5
 */
export function levelEnumToNumber(level: AdminstrativeLevelEnum): number {
    const match = level.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
}

/**
 * Retrieves unique GADM administrative area options for the next level based on a selected GID at the current level.
 *
 * @param {GADMAreas[]} areas - The array of GADM area objects to search within.
 * @param {number} level - The current administrative level (0 to 5).
 * @param {string} selectedGID - The selected GID at the current level to filter by.
 * @returns {{ gid: string; name: string }[]} An array of unique GID-name pairs for the next level.
 *
 * @example
 * getNextLevelOptions(data, 1, "USA.1");
 * // Returns all unique Level2 GIDs and names that belong to Level1 GID "USA.1"
 */
export function getNextLevelOptions(
    areas: GADMAreas[],
    level: number,
    selectedGID: string
): { gid: string; name: string }[] {
    const gidKey = `GID_${level}` as keyof GADMAreas;
    const nextGidKey = `GID_${level + 1}` as keyof GADMAreas;
    const nextNameKey = `NAME_${level + 1}` as keyof GADMAreas;

    const filtered = areas.filter(area => area[gidKey] === selectedGID);

    const unique = new Map<string, string>();
    filtered.forEach(area => {
        const gid = area[nextGidKey];
        const name = area[nextNameKey];
        if (gid && name && !unique.has(gid)) {
            unique.set(gid as string, name as string);
        }
    });

    return Array.from(unique.entries()).map(([gid, name]) => ({ gid, name }));
}