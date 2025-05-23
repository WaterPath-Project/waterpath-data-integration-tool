import { DocumentCategoryEnum } from "@/types";
import { useTranslation } from "react-i18next";
import { Button } from "../atoms/button";
import { DownloadIcon, EyeIcon } from "lucide-react";
import api from "@/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../atoms/dialog";

const documentCategoryContent: Record<DocumentCategoryEnum, {
    smallTitle: string;
    bigTitle: string;
    description: string;
}> = {
    [DocumentCategoryEnum.Sanitation]: {
        smallTitle: "documentation.sanitation.smallTitle",
        bigTitle: "documentation.sanitation.bigTitle",
        description: "documentation.sanitation.description",
    },
    [DocumentCategoryEnum.Population]: {
        smallTitle: "documentation.population.smallTitle",
        bigTitle: "documentation.population.bigTitle",
        description: "documentation.population.description",
    },
    [DocumentCategoryEnum.Treatment]: {
        smallTitle: "documentation.treatment.smallTitle",
        bigTitle: "documentation.treatment.bigTitle",
        description: "documentation.treatment.description",
    },
};

export function DocumentationAction({ documentCategory, sessionId }: { documentCategory: DocumentCategoryEnum, sessionId: string | null }) {
    const { t } = useTranslation();
    const { smallTitle, bigTitle, description } = documentCategoryContent[documentCategory];
    const [previewData, setPreviewData] = useState<string[][]>([]);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const downloadDocumentation = async () => {
        const result = await api.get(
            `https://dev.waterpath.venthic.com/api/data/input/download?session_id=${sessionId}&file_id=${documentCategory}`,
        );
        return result.data;
    };

    const { isFetching, refetch } = useQuery({
        queryKey: ["downloadDocumentation", documentCategory],
        queryFn: downloadDocumentation,
        enabled: false,
    });

    const handleDownload = async () => {
        const result = await refetch();
        if (result.isError || !result.data) {
            toast.error(t("customizeModel.errorMessage"));
        } else {
            toast.success(t("customizeModel.successMessage"));
            const blob = new Blob([result.data], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${documentCategory}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        }
    }

    const handlePreview = async () => {
        const result = await refetch();
        if (result.isError || !result.data) {
            toast.error(t("customizeModel.errorMessage"));
        } else {
            const csvString: string = result.data;
            const parsed = csvString
                .split('\n')
                .map(row => row.split(',').map(cell => cell.trim()))
                .filter(row => row.some(cell => cell !== ''));;
            setPreviewData(parsed);
            setIsPreviewOpen(true);
        }
    };


    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 ">
                <span className="font-inter font-semibold text-sm text-wpBlue">
                    {t(smallTitle)}
                </span>
                <span className="font-inter font-semibold text-2xl text-wpBlue">
                    {t(bigTitle)}
                </span>
                <span className="font-inter text-xs text-wpBlue">
                    {t(description)}
                </span>
            </div>
            <div className="flex flex-row gap-2 ">
                <Button
                    disabled={isFetching}
                    onClick={handleDownload}
                    className="rounded-[16px] font-inter font-bold text-xs  flex  gap-2 items-center"
                >
                    <DownloadIcon />{t("finetune.downloadButton")}
                </Button>
                <Button
                    disabled={isFetching}
                    variant="secondary"
                    onClick={handlePreview}
                    className="rounded-[16px] font-inter font-bold text-xs flex gap-2 items-center"
                >
                    <EyeIcon /> {t("finetune.previewButton")}
                </Button>
            </div>

            {/* Modal for CSV Preview */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="font-outfit text-wpBlue max-w-5xl max-h-[80vh] overflow-y-auto ">
                    <DialogHeader>
                        <DialogTitle className="font-semibold text-2xl">{t("finetune.previewTitle") + ` - ${documentCategory}.csv`}</DialogTitle>
                        <DialogDescription>
                            {t("finetune.previewDescription")}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="overflow-auto max-h-[60vh] border rounded mt-4">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100">
                                {previewData[0] && (
                                    <tr>
                                        {previewData[0].map((cell, idx) => (
                                            <th key={idx} className="px-4 py-2 font-semibold">
                                                {cell}
                                            </th>
                                        ))}
                                    </tr>
                                )}
                            </thead>
                            <tbody>
                                {previewData.slice(1).map((row, rIdx) => (
                                    <tr key={rIdx} className="border-t">
                                        {row.map((cell, cIdx) => (
                                            <td key={cIdx} className="px-4 py-2">
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </DialogContent>
            </Dialog>
        </div>

    );
}