import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../atoms";
import { useState } from "react";

export function GloWPaVersion() {
  const { t } = useTranslation();
  const [value, setValue] = useState<string>("Version 1.0");

  return (
    <div className="bg-wpBrown rounded-2xl w-full">
      <div className="flex justify-between items-center p-10 w-full gap-10">
        <div className="flex flex-col w-1/2">
          <span className="font-outfit font-extrabold text-[2rem] text-wpBlue">
            {t("glowpa.title")}
          </span>
          <span className="font-inter text-base text-wpBlue">
            {t("glowpa.subtitle")}
          </span>
        </div>
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger className="max-w-[346px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Version 1.0">Version 1.0</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
