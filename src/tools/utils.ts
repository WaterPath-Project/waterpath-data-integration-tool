import { AdminstrativeLevelEnum, GADMAreas } from "@/types";

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