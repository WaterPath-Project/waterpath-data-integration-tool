import { useTranslation } from "react-i18next";
import {
  CountriesOfInterestMultiSelect,
  // SimulateCheckbox,
  CountriesAreaRadio,
  AdminstrativeLevelRadio,
} from "../molecules";
import { Button } from "../atoms/button";
import { useDITStore } from "@/store/DITStore";
import { AreaOptionEnum } from "@/types";
import { Transition } from "@headlessui/react";
import api from "@/api";
import classNames from "classnames";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Loader } from "../atoms/Loader";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export function CustomizeModel() {
  const { t } = useTranslation();
  const { countries, area, setDocumentation, reset, resetAreaNDocumentation, setSessionId } = useDITStore();
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);

  useEffect(() => { resetAreaNDocumentation() }, [])

  const handleClick = async () => {
    if (area === AreaOptionEnum.SpecificAreas) {
      navigate("/areas");
      return;
    }

    setLoading(true);
    const newSessionId = uuidv4();
    setSessionId(newSessionId);

    try {
      await api.post(`https://dev.waterpath.venthic.com/api/session/create/?session_id=${newSessionId}`);
      const result = await api.post(
        `https://dev.waterpath.venthic.com/api/data/input/generate?session_id=${newSessionId}&gids=${countries.map(country => country.GID_0).join(",")}`
      );

      setDocumentation(result.data.resources);
      reset();
      toast.success(t("customizeModel.successMessage"));
      navigate(`/finetune/${newSessionId}`);
    } catch (error) {
      console.error("Error during session/data generation:", error);
      toast.error(t("customizeModel.errorMessage"));
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {loading && (
        <Loader message={t("loader.generateCountriesData")} />
      )}
      <div className={classNames("bg-wpGray-100 rounded-2xl p-10 flex flex-col")}>
        <div className="flex flex-col sm:flex-row justify justify-between gap-10 ">
          <div className="flex flex-col ">
            <span className="font-outfit font-extrabold text-[2rem] text-wpBlue">
              {t("customizeModel.title")}
            </span>
            <span className="font-inter text-base text-wpBlue">
              {t("customizeModel.subtitle")}
            </span>
            <div className=" mt-4 flex flex-col gap-8">
              {/* <SimulateCheckbox /> */}
              <div className="flex flex-col gap-2">
                <CountriesOfInterestMultiSelect />
                <CountriesAreaRadio />
              </div>
              <div className={classNames({ "block": countries.length > 0 && area === AreaOptionEnum.SpecificAreas },
                { "hidden": countries.length <= 0 || area !== AreaOptionEnum.SpecificAreas }
              )}>
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
        </div>
        <div className="border border-wpBlue-500 my-4"></div>
        <Button
          disabled={countries.length === 0 || loading}
          onClick={handleClick}
          variant={"secondary"}
          className="rounded-[8px] font-inter font-bold text-xs w-64"
        >
          {area === AreaOptionEnum.SpecificAreas ? t("customizeModel.nextStepAreasButton") : t("customizeModel.nextStepCountriesButton")}
        </Button>
      </div >
    </>
  );
}
