import { useTranslation } from "react-i18next";
import { Button } from "../atoms/button";
import { DownloadIcon } from "lucide-react";

export function GloWPaVersion() {
  const { t } = useTranslation();

  const handleClick = () => {
    window.open("https://git.wur.nl/glowpa/glowpa-r/-/archive/main/glowpa-r-main.zip", "_blank");
  }

  return (
    <div className="bg-wpBrown rounded-2xl w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center p-10 w-full gap-10">
        <div className="flex flex-col sm:w-1/2">
          <span className="font-outfit font-extrabold text-[2rem] text-wpBlue">
            {t("glowpa.title")}
          </span>
          <span className="font-inter text-base text-wpBlue">
            {t("glowpa.subtitle")}
          </span>
        </div>
        <Button
          onClick={handleClick}
          variant={"primary"}
          className="rounded-[8px] font-inter font-bold text-xs w-64 flex  gap-2 items-center"
        >
          <DownloadIcon />{t("glowpa.button")}
        </Button>
      </div>
    </div>
  );
}
