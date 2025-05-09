import { GADMAreas } from "@/types";
import { Button } from "../atoms/button";
import { useState } from "react";
import { PlusCircleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { Card } from "../atoms/card";

export function AreaSelector() {
    const { t } = useTranslation();
    const [selectedArea, setSelectedArea] = useState<GADMAreas | null>(null);
    return (<div className={classNames("bg-wpGray-100 rounded-2xl p-10 flex flex-col gap-4 ")}>
        <span className="font-outfit font-extrabold text-[2rem] text-wpBlue">
            {t("areaSelector.title")}
        </span>
        <Card className="flex flex-row gap-4 items-center justify-between bg-white p-4 rounded-[8px]">
            Test
        </Card>
        <Button
            className="w- bg-wpGreen text-white hover:bg-wpGreen/90 rounded-[10px] flex items-center gap-2 font-inter font-bold text-xs w-64"
            onClick={() => {
                setSelectedArea(null);
            }}><PlusCircleIcon />{t("areaSelector.addButton")}</Button>
        <div className="border border-wpBlue-500"></div>
        <span className="font-outfit font-extrabold text-[2rem] text-wpBlue">
            {t("areaSelector.selectedAreasTitle")}
        </span>
        {
            selectedArea ? (
                <Card className="flex flex-row gap-4 items-center justify-between bg-white p-4 rounded-[8px]">
                    {selectedArea.NAME_0}
                </Card>
            ) : (
                <span className="font-inter font-semibold text-2xl text-wpBlue text-center py-20">
                    {t("areaSelector.noSelectedAreas")}
                </span>
            )
        }
        <Button
            className="bg-wpBlue text-wpWhite hover:bg-wpBlue/80 rounded-[8px] font-inter font-bold text-xs w-64"
        >
            {t("customizeModel.nextStepCountriesButton")}
        </Button>
    </div>)
}