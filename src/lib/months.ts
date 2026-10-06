/**
 * Months offered by the hydrology map preview (`dimension` parameter of
 * POST /api/geodata/preview for the hydrology-* files), plus "avg" for the
 * yearly average, which is requested by sending no dimension at all.
 * Labels live in i18n under `finetune.mapPreview.months.<key>`.
 */
export const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec", "avg"] as const;
export type Month = (typeof MONTHS)[number];
