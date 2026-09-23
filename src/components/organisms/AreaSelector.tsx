import { Button } from "../atoms/button";
import React from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { Card } from "../atoms/card";
// Previous solution (cascading dropdowns) kept for reference:
// import { DynamicDropdowns, DynamicDropdownsRef } from "../molecules/DynamicAreasDropdows";
import { MillerColumns } from "../molecules/MillerColumns";
import { useDITStore } from "@/store/DITStore";
import { getAdminLevelLabels, levelEnumToNumber } from "@/tools/utils";
import api from "@/api";
import { SelectedAreaList } from "../molecules/SelectedAreaList";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Loader } from "../atoms/Loader";
import { v4 as uuidv4 } from 'uuid';
import { getIncludedCategories } from "@/lib/dataCategories";

export function AreaSelector() {
    const { t } = useTranslation();
    const { downLoadedAreas, adminLevel, countries, selectedAreas, setSelectedAreas, setDocumentation, setIncludedCategories, setSessionId, reset, hasHumanEmissions, hasLivestockEmissions, hasConcentrations, hasRisks } = useDITStore();

    // "Level 0 (Country)", "Level 1 (Region, Province)", ... built from the selected countries' admin labels.
    const levelLabels = React.useMemo(() => {
        const labels = getAdminLevelLabels(countries);
        labels[0] = t("areaSelector.miller.country");
        return labels;
    }, [countries, t]);
    // Previous solution (cascading dropdowns):
    // const { addSelectedArea } = useDITStore();
    // const dropdownRef = React.useRef<DynamicDropdownsRef>(null);
    const navigate = useNavigate()

    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async () => {
        const newSessionId = uuidv4();
        setSessionId(newSessionId);
        setLoading(true);

        try {
            await api.post(`https://dev.waterpath.venthic.com/api/session/create/?session_id=${newSessionId}`);
            const result = await api.post(
                `https://dev.waterpath.venthic.com/api/data/input/generate?session_id=${newSessionId}&gids=${selectedAreas.join(",")}&include_livestock=${hasLivestockEmissions}&include_hydrology=${hasConcentrations}&include_qmra=${hasRisks}`
            );

            setDocumentation(result.data.resources);
            setIncludedCategories(getIncludedCategories({ hasHumanEmissions, hasLivestockEmissions, hasConcentrations, hasRisks }));
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

    // Previous solution (cascading dropdowns): add areas one at a time from the last dropdown.
    // const handleAddNewArea = (value: string | string[]) => {
    //     if (!value) return;
    //
    //     const values = Array.isArray(value) ? value : [value];
    //
    //     for (const selection of values) {
    //         if (selectedAreas.includes(selection)) {
    //             toast.warning(t("areaSelector.alreadyExists"), {
    //                 description: t("areaSelector.alreadyExistsDescription"),
    //             });
    //             continue;
    //         }
    //         addSelectedArea(selection);
    //     }
    //
    //     dropdownRef.current?.reset();
    // };

    React.useEffect(() => {
        if (loading) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [loading]);


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
                    {/* Previous solution (cascading dropdowns):
                    <DynamicDropdowns ref={dropdownRef} areas={downLoadedAreas} maxLevel={levelEnumToNumber(adminLevel) + 1} onFinalSelect={handleAddNewArea} />
                    */}
                    <MillerColumns
                        areas={downLoadedAreas}
                        leafLevel={levelEnumToNumber(adminLevel)}
                        selected={selectedAreas}
                        onChange={setSelectedAreas}
                        levelLabels={levelLabels}
                    />
                </Card>
                <div className="border border-wpBlue-500"></div>
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