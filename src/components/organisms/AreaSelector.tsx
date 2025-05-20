import { Button } from "../atoms/button";
import { useRef, useState } from "react";
import { PlusCircleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { Card } from "../atoms/card";
import { DynamicDropdowns, DynamicDropdownsRef } from "../molecules/DynamicAreasDropdows";
import { useDITStore } from "@/store/DITStore";
import { levelEnumToNumber } from "@/tools/utils";
import api from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/context/SessionProvider";

export function AreaSelector() {
    const { t } = useTranslation();
    const { sessionId } = useSession();
    const { downLoadedAreas, adminLevel, selectedAreas, addSelectedArea } = useDITStore();
    const [finalSelection, setFinalSelection] = useState<string>('');
    const dropdownRef = useRef<DynamicDropdownsRef>(null);


    const generateData = async () => {
        const result = await api.post(
            `https://dev.waterpath.venthic.com/api/data/input/generate?session_id=${sessionId}&gids=${selectedAreas.join(",")}`,
        );
        return result.data;
    };

    const { isFetching, /*refetch*/ } = useQuery({
        queryKey: ["generateData"],
        queryFn: generateData,
        enabled: false,
    });

    const handleFinalSelect = (value: string) => {
        setFinalSelection(value);
    };

    const handleSubmit = () => {
        const selection = finalSelection;
        addSelectedArea(selection);
        dropdownRef.current?.reset();
        setFinalSelection('');
    };

    if (isFetching) {
        return (<>Hello world</>)
    }

    return (<div className={classNames("bg-wpGray-100 rounded-2xl p-10 flex flex-col gap-4 ")}>
        <span className="font-outfit font-extrabold text-[2rem] text-wpBlue">
            {t("areaSelector.title")}
        </span>
        <Card className="flex flex-row gap-4 items-center justify-between bg-white p-4 rounded-[8px]">
            <DynamicDropdowns ref={dropdownRef} areas={downLoadedAreas} maxLevel={levelEnumToNumber(adminLevel) + 1} onFinalSelect={handleFinalSelect} />
        </Card>
        <Button
            variant={"primary"}
            onClick={handleSubmit}
            disabled={!finalSelection}
            className="rounded-[8px] flex items-center gap-2 font-inter font-semibold text-xs w-64 text-wpWhite"
        ><PlusCircleIcon />{t("areaSelector.addButton")}</Button>
        <div className="border border-wpBlue-500"></div>
        <span className="font-outfit font-extrabold text-[2rem] text-wpBlue">
            {t("areaSelector.selectedAreasTitle")}
        </span>
        {
            selectedAreas.length > 0 ? (
                <Card className="min-h-40 flex flex-row gap-4 items-center justify-between bg-white p-4 rounded-[8px]">
                    {selectedAreas.join(", ")}
                </Card>
            ) : (
                <span className="font-inter font-semibold text-2xl text-wpBlue text-center min-h-40">
                    {t("areaSelector.noSelectedAreas")}
                </span>
            )
        }
        <Button
            variant={"secondary"}
            className=" rounded-[8px] font-inter font-bold text-xs w-64"
        >
            {t("customizeModel.nextStepCountriesButton")}
        </Button>
    </div>)
}