import { useTranslation } from "react-i18next";
import { SimulateCheckbox } from "../molecules";

export function CustomizeModel() {
  const { t } = useTranslation();
  return (
    <div className="bg-wpGray-100 rounded-2xl p-10 flex flex-col">
      <div className="flex flex-row justify justify-between gap-10">
        <div className="flex flex-col ">
          <span className="font-outfit font-extrabold text-[2rem] text-wpBlue">
            {t("customizeModel.title")}
          </span>
          <span className="font-inter text-base text-wpBlue">
            {t("customizeModel.subtitle")}
          </span>
        </div>
        <div className="w-96 h-96 flex bg-wpBlue-100 justify-center align-middle rounded-2xl">
          <span className="place-self-center font-inter font-bold text-xs text-wpBlue">
            MAP
          </span>
        </div>
      </div>
      <div className="border border-wpBlue-500 my-6"></div>
      <SimulateCheckbox />
    </div>
  );
}
