import { useTranslation } from "react-i18next";
import { MONTHS, Month } from "@/lib/months";
import { OptionSelect } from "./OptionSelect";

type MonthSelectProps = {
  value: Month;
  onChange: (month: Month) => void;
  className?: string;
};

/** Controlled month picker for the hydrology map preview. */
export function MonthSelect({ value, onChange, className }: MonthSelectProps) {
  const { t } = useTranslation();
  return (
    <OptionSelect
      value={value}
      onChange={onChange}
      label={t("finetune.mapPreview.monthLabel")}
      options={MONTHS.map((month) => ({ value: month, label: t(`finetune.mapPreview.months.${month}`) }))}
      className={className ?? "h-9 w-36 font-inter text-sm text-wpBlue"}
    />
  );
}
