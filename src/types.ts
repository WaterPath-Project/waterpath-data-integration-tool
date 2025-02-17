/*
 * API Requests / Responses Type
 */

//countries.json
export type GADMCountries = {
  NAME_0: string;
  GID_0: string;
  ALPHA_2: string;
  COUNTRY_CODE: number;
  REGION: string;
  SUB_REGION: string;
  INTERMEDIATE_REGION: string;
  MAX_LEVEL: number;
  ADMIN_LABELS: string[];
};

/*
 * Component
 */
export type Option = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export enum AreaOptionEnum {
  EntireCountries = "EntireCountries",
  SpecificAreas = "SpecificAreas",
}

export enum AdminstrativeLevelEnum {
  Level1 = "Level1",
  Level2 = "Level2",
  Level3 = "Level3",
  Level4 = "Level4",
  Level5 = "Level25",
}
