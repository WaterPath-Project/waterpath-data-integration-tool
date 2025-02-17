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
