import { useTranslation } from "react-i18next";
import { Checkbox } from "../atoms/checkbox";
import { useDITStore } from "@/store/DITStore";

export function SimulateCheckbox() {
  const { t } = useTranslation();
  const {
    hasHumanEmissions,
    setHasHumanEmissions,
    hasLivestockEmissions,
    setHasLivestockEmissions,
    hasConcentrations,
    setHasConcentrations,
    hasRisks,
    setHasRisks,
  } = useDITStore();

  return (
    <div className="flex flex-col  text-wpBlue gap-2">
      <span className="inter text-sm font-semibold">
        {t("customizeModel.simulate")}
      </span>
      <div className="flex flex-col gap-1 sm:flex-row sm:gap-4 flex-wrap sm:items-center">
        <div className="flex flex-row gap-2 items-center">
          <Checkbox
            id="emissions"
            checked={hasHumanEmissions}
            onCheckedChange={(checked) =>
              setHasHumanEmissions(checked as boolean)
            }
          />
          <label htmlFor="emissions" className="text-sm font-inter ">
            {t("customizeModel.emissions")}
          </label>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <Checkbox
            id="livestockEmissions"
            checked={hasLivestockEmissions}
            onCheckedChange={(checked) =>
              setHasLivestockEmissions(checked as boolean)
            }
          />
          <label htmlFor="livestockEmissions" className="text-sm font-inter ">
            {t("customizeModel.livestockEmissions")}
          </label>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <Checkbox
            id="concentrations"
            checked={hasConcentrations}
            onCheckedChange={(checked) =>
              setHasConcentrations(checked as boolean)
            }
          />
          <label htmlFor="concentrations" className="text-sm font-inter ">
            {t("customizeModel.concentrations")}
          </label>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <Checkbox
            id="risk"
            checked={hasRisks}
            onCheckedChange={(checked) => setHasRisks(checked as boolean)}
          />
          <label htmlFor="risk" className="text-sm font-inter ">
            {t("customizeModel.risk")}
          </label>
        </div>
      </div>
    </div>
  );
}
