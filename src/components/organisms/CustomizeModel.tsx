import { useTranslation } from "react-i18next";
import {
  CountriesOfInterestMultiSelect,
  SimulateCheckbox,
  CountriesAreaRadio,
  AdminstrativeLevelRadio,
} from "../molecules";
import { Button } from "../atoms/button";
import { AdminstrativeAreaWizard } from "./AdminstrativeAreaDialog";
import { useState } from "react";
import { useDITStore } from "@/store/DITStore";
import { AreaOptionEnum } from "@/types";
import { Transition } from "@headlessui/react";

export function CustomizeModel() {
  const { t } = useTranslation();
  const [dialogStatus, setDialogStatus] = useState<boolean>(false);
  const { countries, area } = useDITStore();

  return (
    <div className="bg-wpGray-100 rounded-2xl p-10 flex flex-col">
      <div className="flex flex-col sm:flex-row justify justify-between gap-10">
        <div className="flex flex-col sm:w-3/5  ">
          <span className="font-outfit font-extrabold text-[2rem] text-wpBlue">
            {t("customizeModel.title")}
          </span>
          <span className="font-inter text-base text-wpBlue">
            {t("customizeModel.subtitle")}
          </span>
          <div className=" mt-4 flex flex-col gap-8">
            <SimulateCheckbox />
            <div className="flex flex-col gap-2">
              <CountriesOfInterestMultiSelect />
              <CountriesAreaRadio />
            </div>
            <div className="h-20">
              <Transition
                show={
                  countries.length > 0 && area === AreaOptionEnum.SpecificAreas
                }
              >
                <div className="transition duration-200 ease-in data-[closed]:opacity-0">
                  <AdminstrativeLevelRadio />
                </div>
              </Transition>
            </div>
          </div>
        </div>
        <div className="w-full sm:w-2/5 h-96 flex bg-wpBlue-100 justify-center align-middle rounded-2xl">
          <span className="place-self-center font-inter font-bold text-xs text-wpBlue">
            MAP
          </span>
        </div>
      </div>
      <div className="border border-wpBlue-500 my-6"></div>
      <Button
        disabled={countries.length === 0}
        onClick={() =>
          area === AreaOptionEnum.SpecificAreas &&
          setDialogStatus((prev) => !prev)
        }
        className="bg-wpBlue text-wpWhite hover:bg-wpBlue/80 rounded-[8px] font-inter font-bold text-xs w-64"
      >
        {t("customizeModel.nextStepButton")}
      </Button>
      <AdminstrativeAreaWizard
        status={dialogStatus}
        setStatus={setDialogStatus}
      />
    </div>
  );
}
