import { RadioGroup, RadioGroupItem } from "@/components/atoms/radio-group";
import { cn } from "@/lib/utils";
import { useDITStore } from "@/store/DITStore";
import { AdminstrativeLevelEnum } from "@/types";
import { useTranslation } from "react-i18next";

export function AdminstrativeLevelRadio() {
  const { t } = useTranslation();
  const { adminLevel, countries, setAdminLevel } = useDITStore();

  const smallestLevel = countries.reduce((min, country) => {
    return Math.min(min, country.ADMIN_LABELS.length);
  }, 5);

  const options = [
    {
      value: AdminstrativeLevelEnum.Level1,
      label: t("customizeModel.adminstrativeLevels.level1"),
      id: "level1",
    },
    {
      value: AdminstrativeLevelEnum.Level2,
      label: t("customizeModel.adminstrativeLevels.level2"),
      id: "level2",
    },
    {
      value: AdminstrativeLevelEnum.Level3,
      label: t("customizeModel.adminstrativeLevels.level3"),
      id: "level3",
    },
    {
      value: AdminstrativeLevelEnum.Level4,
      label: t("customizeModel.adminstrativeLevels.level4"),
      id: "level4",
    },
    {
      value: AdminstrativeLevelEnum.Level5,
      label: t("customizeModel.adminstrativeLevels.level5"),
      id: "level5",
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className={"flex flex-col"}>
        <span className="inter text-sm font-semibold text-wpBlue">
          {t("customizeModel.adminstrativeLevelsTitle")}
        </span>
        <span className="inter text-xs text-wpBlue-200">
          {t("customizeModel.adminstrativeLevelsSubtitle")}
        </span>
      </div>
      <RadioGroup
        value={adminLevel}
        className="w-full flex flex-row gap-2 flex-wrap"
      >
        {options.map((option, index) => (
          <button
            key={option.value}
            disabled={index > smallestLevel}
            className={cn(
              "flex items-center gap-2  p-2 text-xs font-bold font-inter text-wpBlue border border-wpBlue-100 rounded-[8px] disabled:opacity-50",
              {
                "bg-wpGreen border border-wpGreen": adminLevel === option.value,
              }
            )}
            onClick={() => setAdminLevel(option.value)}
          >
            <RadioGroupItem value={option.value} id={option.id} />
            <label htmlFor={option.id}>{option.label}</label>
          </button>
        ))}
      </RadioGroup>
    </div>
  );
}
