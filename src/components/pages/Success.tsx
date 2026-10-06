
import { useNavigate, useParams } from "react-router";
import { Button } from "../atoms/button";
import { BasicLayout } from "../templates";
import { useTranslation } from "react-i18next";
import { BookTextIcon, RefreshCcwIcon, RotateCcwIcon } from "lucide-react";
import api from "@/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader } from "../atoms/Loader";
import React from "react";
import { useDITStore } from "@/store/DITStore";
import DynamicBreadcrumb from "../molecules/DynamicBreadcrumb";

export function Success(): React.ReactElement {
    const { session_id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { reset, resetAreaNDocumentation, setSessionId } = useDITStore();

    const breadcrumbItems = [
        { name: t("breadcrumb.home"), url: "/" },
        { name: t("breadcrumb.finetune"), url: `/finetune/${session_id ?? ""}` },
        { name: t("breadcrumb.success") },
    ];

    const downloadDocumentation = async () => {
        const result = await api.get(
            `https://dev.waterpath.venthic.com/api/data/input/download?session_id=${session_id}`,
            {
                responseType: 'blob'
            }
        );
        return result.data;
    };

    const { isFetching, refetch } = useQuery({
        queryKey: ["downloadDocumentation", session_id],
        queryFn: downloadDocumentation,
        enabled: false,
    });

    const handleClick = async () => {
        const result = await refetch();
        if (result.isError || !result.data) {
            toast.error(t("finetune.errorMessage"));
        } else {
            toast.success(t("finetune.successMessage"));
            const blob = new Blob([result.data], { type: 'application/zip' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'session.zip');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }
    };

    React.useEffect(() => {
        if (isFetching) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [isFetching]);

    const handleDocClick = () => {
        window.open('https://waterpath-toolkit.org/docs/example-dataset/', '_blank');
    }

    // Clears the wizard state and returns to the first screen.
    const handleStartAgain = () => {
        reset();
        resetAreaNDocumentation();
        setSessionId(null);
        navigate('/');
    };

    return (
        <>
            {isFetching && (
                <Loader message={t("loader.finishProcess")} />
            )}
            <BasicLayout>
                <div className="mx-4">
                    <DynamicBreadcrumb items={breadcrumbItems} />
                    <div className="whitespace-pre-line mt-10 p-16 bg-wpBrown rounded-2xl w-full flex flex-col gap-8 font-outfit text-wpBlue">
                        <span className="font-extrabold text-2xl">{t("success.thanks")}</span>
                        <span className="font-medium">{t("success.instructions")}</span>
                        <div className="flex">
                            <Button variant={"primary"} className="rounded-[8px] mr-2 font-inter font-bold text-xs w-64 flex  gap-2 items-center" onClick={handleDocClick}><BookTextIcon /> {t("success.documentationButton")}</Button>
                            <Button variant={"secondary"} className="rounded-[8px] mr-2 font-inter font-bold text-xs w-64 flex  gap-2 items-center" onClick={handleStartAgain}><RotateCcwIcon /> {t("success.startAgainButton")}</Button>
                            <Button variant={"link"} className="rounded-[8px] px-0 font-inter font-bold text-xs flex  gap-2 items-center" onClick={handleClick}><RefreshCcwIcon /> {t("success.backHomeButton")}</Button>
                        </div>
                    </div>
                </div>
            </BasicLayout>
        </>
    );
}
