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
import { SelectedAreaList } from "../molecules/SelectedAreaList";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Loader } from "../atoms/Loader";

export function AreaSelector() {
    const { t } = useTranslation();
    const { sessionId } = useSession();
    const { downLoadedAreas, adminLevel, selectedAreas, addSelectedArea, setDocumentation, reset } = useDITStore();
    const [finalSelection, setFinalSelection] = useState<string>('');
    const dropdownRef = useRef<DynamicDropdownsRef>(null);
    const navigate = useNavigate()

    const generateData = async () => {
        const result = await api.post(
            `https://dev.waterpath.venthic.com/api/data/input/generate?session_id=${sessionId}&gids=${selectedAreas.join(",")}`,
        );
        return result.data.resources;
    };

    const { isFetching, refetch } = useQuery({
        queryKey: ["generateData"],
        queryFn: generateData,
        enabled: false,
    });

    const handleFinalSelect = (value: string) => {
        setFinalSelection(value);
    };

    const handleAddNewArea = () => {
        const selection = finalSelection;

        // Check for duplicate
        if (selectedAreas.includes(selection)) {
            toast.warning(t("areaSelector.alreadyExists"), {
                description: t("areaSelector.alreadyExistsDescription"),
            });
            return;
        }

        addSelectedArea(selection);
        dropdownRef.current?.reset();
        setFinalSelection('');
    };

    const handleSubmit = async () => {
        const result = await refetch();
        if (result.isError) {
            toast.error(t("customizeModel.errorMessage"));
        } else {
            toast.success(t("customizeModel.successMessage"));
            reset();
            setDocumentation(result.data);
            navigate("/success")
        }
    }

    return (
        <>
            {isFetching && (
                <Loader message={t("loader.generateAreasData")} />
            )}
            <div className={classNames("bg-wpGray-100 rounded-2xl p-10 flex flex-col gap-4 ")}>
                <span className="font-outfit font-extrabold text-[2rem] text-wpBlue">
                    {t("areaSelector.title")}
                </span>
                <Card className="flex flex-row gap-4 items-center justify-between bg-white p-4 rounded-[8px]">
                    <DynamicDropdowns ref={dropdownRef} areas={downLoadedAreas} maxLevel={levelEnumToNumber(adminLevel) + 1} onFinalSelect={handleFinalSelect} />
                </Card>
                <Button
                    variant={"primary"}
                    onClick={handleAddNewArea}
                    disabled={!finalSelection}
                    className="rounded-[8px] flex items-center gap-2 font-inter font-semibold text-xs w-64 text-wpWhite"
                ><PlusCircleIcon />{t("areaSelector.addButton")}</Button>
                <div className="border border-wpBlue-500"></div>
                <span className="font-outfit font-extrabold text-[2rem] text-wpBlue">
                    {t("areaSelector.selectedAreasTitle")}
                </span>
                <SelectedAreaList level={levelEnumToNumber(adminLevel)} />
                <Button
                    onClick={handleSubmit}
                    variant={"secondary"}
                    className=" rounded-[8px] font-inter font-bold text-xs w-64"
                >
                    {t("customizeModel.nextStepCountriesButton")}
                </Button>
            </div>
        </>)
}