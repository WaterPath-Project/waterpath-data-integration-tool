import { Button } from "../atoms/button";
import { useRef, useState } from "react";

import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { Card } from "../atoms/card";
import { DynamicDropdowns, DynamicDropdownsRef } from "../molecules/DynamicAreasDropdows";
import { useDITStore } from "@/store/DITStore";
import { levelEnumToNumber } from "@/tools/utils";
import api from "@/api";
import { SelectedAreaList } from "../molecules/SelectedAreaList";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Loader } from "../atoms/Loader";
import { v4 as uuidv4 } from 'uuid';

export function AreaSelector() {
    const { t } = useTranslation();
    const { downLoadedAreas, adminLevel, selectedAreas, addSelectedArea, setDocumentation, setSessionId, reset } = useDITStore();
    const dropdownRef = useRef<DynamicDropdownsRef>(null);
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const newSessionId = uuidv4();
        setSessionId(newSessionId);
        setLoading(true);

        try {
            await api.post(`https://dev.waterpath.venthic.com/api/session/create/?session_id=${newSessionId}`);
            const result = await api.post(
                `https://dev.waterpath.venthic.com/api/data/input/generate?session_id=${newSessionId}&gids=${selectedAreas.join(",")}`
            );

            setDocumentation(result.data.resources);
            reset();
            toast.success(t("customizeModel.successMessage"));
            navigate(`/finetune/${newSessionId}`);
        } catch (error) {
            console.error("Error:", error);
            toast.error(t("customizeModel.errorMessage"));
        } finally {
            setLoading(false);
        }
    };

    // Function to handle adding a new area
    const handleAddNewArea = (value: string | string[]) => {
        if (!value) return;

        const values = Array.isArray(value) ? value : [value];

        for (const selection of values) {
            if (selectedAreas.includes(selection)) {
                toast.warning(t("areaSelector.alreadyExists"), {
                    description: t("areaSelector.alreadyExistsDescription"),
                });
                continue;
            }
            addSelectedArea(selection);
        }

        dropdownRef.current?.reset();
    };


    return (
        <>
            {loading && (
                <Loader message={t("loader.generateAreasData")} />
            )}
            <div className={classNames("bg-wpGray-100 rounded-2xl p-10 flex flex-col gap-4 ")}>
                <span className="font-outfit font-extrabold text-[2rem] text-wpBlue">
                    {t("areaSelector.title")}
                </span>
                <Card className="flex flex-row gap-4 items-center justify-between bg-white p-4 rounded-[8px]">
                    <DynamicDropdowns ref={dropdownRef} areas={downLoadedAreas} maxLevel={levelEnumToNumber(adminLevel) + 1} onFinalSelect={handleAddNewArea} />
                </Card>
                <div className="border border-wpBlue-500"></div>
                <span className="font-outfit font-extrabold text-[2rem] text-wpBlue">
                    {t("areaSelector.selectedAreasTitle")}
                </span>
                <SelectedAreaList level={levelEnumToNumber(adminLevel)} />
                <Button
                    onClick={handleSubmit}
                    disabled={selectedAreas.length === 0}
                    variant={"secondary"}
                    className=" rounded-[8px] font-inter font-bold text-xs w-64"
                >
                    {t("customizeModel.nextStepCountriesButton")}
                </Button>
            </div>
        </>)
}