import { useTranslation } from "react-i18next";
import { Checkbox } from "../atoms/checkbox";

export function SimulateCheckbox() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col  text-wpBlue gap-2">
      <span className="inter text-sm font-semibold">
        {t("customizeModel.simulate")}
      </span>
      <div className="flex flex-col gap-1 sm:flex-row sm:gap-4 flex-wrap sm:items-center">
        <div className="flex flex-row gap-2 items-center">
          <Checkbox id="emmisions" />
          <label htmlFor="emmisions" className="text-sm font-inter ">
            {t("customizeModel.emissions")}
          </label>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <Checkbox id="livestockEmissions" />
          <label htmlFor="livestockEmissions" className="text-sm font-inter ">
            {t("customizeModel.livestockEmissions")}
          </label>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <Checkbox id="concentrations" />
          <label htmlFor="concentrations" className="text-sm font-inter ">
            {t("customizeModel.concentrations")}
          </label>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <Checkbox id="risk" />
          <label htmlFor="risk" className="text-sm font-inter ">
            {t("customizeModel.risk")}
          </label>
        </div>
      </div>
    </div>
  );
}
