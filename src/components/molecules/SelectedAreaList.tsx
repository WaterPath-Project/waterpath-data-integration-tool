import { Card } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { useDITStore } from "@/store/DITStore";
import { GADMAreas } from "@/types";
import { useTranslation } from "react-i18next";

interface SelectedAreaListProps {
    level: number;
}

export const SelectedAreaList: React.FC<SelectedAreaListProps> = ({ level }) => {
    const { selectedAreas, downLoadedAreas, removeSelectedArea } = useDITStore();
    const { t } = useTranslation();

    const matchedAreas = selectedAreas.map(gid => {
        const matched = downLoadedAreas.find(area => {
            const gidKey = `GID_${level}` as keyof GADMAreas;
            return area[gidKey] === gid;
        });

        if (!matched) return null;

        const namePath = Array.from({ length: level + 1 }, (_, i) => {
            const key = `NAME_${i}` as keyof GADMAreas;
            return matched[key];
        }).filter(Boolean).join(", ");

        return {
            gid,
            namePath,
        };
    }).filter(Boolean);

    return (
        <Card className="min-h-40 bg-white p-4 rounded-[8px] flex flex-col gap-2 justify-center font-inter text-xs text-wpBlue-500 font-medium">
            {matchedAreas.length === 0 && <span className=" font-inter font-semibold text-2xl text-wpBlue text-center">
                {t("areaSelector.noSelectedAreas")}
            </span>}

            {matchedAreas.map((area) => (
                <div
                    key={area?.gid}
                    className="flex flex-row items-center justify-between border-b border-wpBlue-500 py-2"
                >
                    <span className="text-gray-800">{area?.namePath}</span>
                    <Button
                        className="flex border-0 items-center gap-2 font-inter font-semibold text-xs"
                        
                        onClick={() => removeSelectedArea(area?.gid ?? "")}
                    >
                        remove
                    </Button>
                </div>
            ))}
        </Card>
    );
};