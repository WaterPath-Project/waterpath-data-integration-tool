import { useTranslation } from "react-i18next";
import {
  CountriesOfInterestMultiSelect,
  SimulateCheckbox,
  CountriesAreaRadio,
  AdminstrativeLevelRadio,
} from "../molecules";
import { Button } from "../atoms/button";
import { useDITStore } from "@/store/DITStore";
import { AreaOptionEnum } from "@/types";
import { Transition } from "@headlessui/react";
import api from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/context/SessionProvider";
import classNames from "classnames";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export function CustomizeModel() {
  const { t } = useTranslation();
  const { sessionId } = useSession();
  const { countries, area } = useDITStore();
  const navigate = useNavigate()

  const generateData = async () => {
    const result = await api.post(
      `https://dev.waterpath.venthic.com//api/data/input/generate?session_id=${sessionId}&gids=${countries.map(country => country.GID_0).join(",")}`,
    );
    return result.data;
  };

  const { isFetching, refetch } = useQuery({
    queryKey: ["generateData"],
    queryFn: generateData,
    enabled: false,
  });


  const handleClick = async () => {
    if (area === AreaOptionEnum.SpecificAreas) {
      navigate("/areas")
    }
    else {
      const result = await refetch();
      if (result.isError) {
        toast.error(t("customizeModel.errorMessage"));
      } else {
        toast.success(t("customizeModel.successMessage"));
        navigate("/success")
      }
    }
  }


  return (
    <div className={classNames("bg-wpGray-100 rounded-2xl p-10 flex flex-col", {
      "opacity-50 pointer-events-none": isFetching,
      "opacity-100 pointer-events-auto": !isFetching,
    })}>
      <div className="flex flex-col sm:flex-row justify justify-between gap-10 mb-10">
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
            <div className="h-30">
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
      <div className="border border-wpBlue-500 mb-6"></div>
      <Button
        disabled={countries.length === 0 || isFetching}
        onClick={handleClick}
        className="bg-wpBlue text-wpWhite hover:bg-wpBlue/80 rounded-[8px] font-inter font-bold text-xs w-64"
      >
        {area === AreaOptionEnum.SpecificAreas ? t("customizeModel.nextStepAreasButton") : t("customizeModel.nextStepCountriesButton")}
      </Button>
    </div >
  );
}
