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
* API Responses
*/

//Get areas by country
export type GADMAreas = {
  GID_0: string;
  GID_1: string;
  GID_2: string;
  GID_3: string;
  GID_4: string;
  GID_5: string;
  NAME_0: string;
  NAME_1: string;
  NAME_2: string,
  NAME_3: string;
  NAME_4: string;
  NAME_5: string;
}

//Get documentation
export type Documentation = {
  name: string
  type: string
  path: string
  scheme: string
  format: string
  mediatype: string
  encoding: string
  schema: Schema
}

export type Schema = {
  fields: Field[]
}

export type Field = {
  name: string
  type: string
}


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
  Level5 = "Level5",
}

export enum DocumentCategoryEnum {
  Sanitation = "sanitation",
  Population = "population",
  Treatment = "treatment",
}
