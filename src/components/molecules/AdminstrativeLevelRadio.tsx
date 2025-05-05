import { RadioGroup, RadioGroupItem } from "@/components/atoms/radio-group";
import { cn } from "@/lib/utils";
import { useDITStore } from "@/store/DITStore";
import { AdminstrativeLevelEnum } from "@/types";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

export function AdminstrativeLevelRadio() {
  const { t } = useTranslation();
  const { adminLevel, countries, setAdminLevel } = useDITStore();

  // Memoize minLevel
  const minLevel = useMemo(() => {
    return countries.reduce((min, country) => {
      return Math.min(min, country.MAX_LEVEL);
    }, 5);
  }, [countries]);

  // Memoize spans
  const spans = useMemo(() => {
    const result = [];

    const splitLabel = (label: string) => {
      // Split by pipe or slash
      const parts = label.split(/[|/]/).slice(0, 2);
      return parts.map(part =>
        part.replace(/([a-z])([A-Z])/g, '$1 $2').trim()
      ).join('/');
    };

    for (let i = 0; i < minLevel; i++) {
      const rawLabels = countries
        .map(c => c.ADMIN_LABELS[i])
        .filter(label => label && label !== "NA");

      const formattedLabels = rawLabels.map(splitLabel);

      // Deduplicate
      const uniqueLabels = Array.from(new Set(formattedLabels));

      if (uniqueLabels.length > 0) {
        const text = `Level ${i + 1}: ${uniqueLabels.join(', ')}`;
        result.push(
          <span key={i} className="inter text-xs text-wpBlue-200">
            {text}
          </span>
        );
      }
    }

    return result;
  }, [countries, minLevel]);

  useEffect(() => {
    if (countries.length > 0) {
      setAdminLevel(AdminstrativeLevelEnum.Level1);
    }
  }, [minLevel])

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
        {spans}
      </div>
      <RadioGroup
        value={adminLevel}
        className="w-full flex flex-row gap-2 flex-wrap"
      >
        {options.map((option, index) => (
          <button
            key={option.value}
            disabled={index > minLevel - 1}
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
