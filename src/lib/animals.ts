/**
 * Livestock species offered by the geodata preview (`dimension` parameter of
 * POST /api/geodata/preview with file=livestock-distribution).
 * Labels live in i18n under `finetune.mapPreview.animals.<key>`.
 */
export const LIVESTOCK_ANIMALS = [
  "asses",
  "buffaloes",
  "camels",
  "cattle",
  "chickens",
  "donkeys",
  "ducks",
  "goats",
  "horses",
] as const;
export type LivestockAnimal = (typeof LIVESTOCK_ANIMALS)[number];
