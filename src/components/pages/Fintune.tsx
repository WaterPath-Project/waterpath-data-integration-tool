import { BasicLayout } from "../templates";
import { useTranslation } from "react-i18next";
import DynamicBreadcrumb from "../molecules/DynamicBreadcrumb";
import classNames from "classnames";
import { useDITStore } from "@/store/DITStore";
import { DocumentationAction } from "../molecules/DocumentationAction";
import { DocumentCategoryEnum } from "@/types";
import { Button } from "../atoms/button";
import { Loader } from "../atoms/Loader";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import api from "@/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { FastForwardIcon } from "lucide-react";

export function Finetune() {
    const { t } = useTranslation();
    const { documentation, setDocumentation } = useDITStore();
    const { session_id } = useParams();
    const navigate = useNavigate()

    const breadcrumbItems = [
        { name: t("breadcrumb.home"), url: "/" },
        { name: t("breadcrumb.finetune") },
    ];

    const getSessionData = async () => {
        const result = await api.get(
            `https://dev.waterpath.venthic.com/api/session?session_id=${session_id}`,
        );
        return result.data.resources;
    };

    const { data, isFetching, isSuccess, isError } = useQuery({
        queryKey: ["getSessionData", session_id],
        queryFn: getSessionData,
        enabled: session_id !== undefined && documentation.length === 0,
    });

    const downloadDocumentation = async () => {
        const result = await api.get(
            `https://dev.waterpath.venthic.com/api/data/input/download?session_id=${session_id}`,
            {
                responseType: 'blob'
            }
        );
        return result.data;
    };

    const { isFetching: isActive, refetch } = useQuery({
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
            navigate(`/success/${session_id}`);
        }
    };

    useEffect(() => {
        if (isSuccess && data) {
            setDocumentation(data);
        }
        if (isError) {
            toast.error(t("customizeModel.errorMessage"));
            navigate(`/`);
        }
    }, [isSuccess, isError, data]);

    if (isFetching) {
        return (
            <></>
        );
    }

    return (
        <>
            {isActive && (
                <Loader message={t("loader.finishProcess")} />
            )}
            <div className="relative h-full min-h-screen">
                <BasicLayout>
                    <div className="mx-4">
                        <DynamicBreadcrumb items={breadcrumbItems} />
                        <div className="flex flex-col gap-8 mt-10">
                            <div className={classNames("bg-wpGray-100 rounded-2xl p-10 flex flex-col gap-8 ")}>
                                <span className="font-outfit font-extrabold text-[2rem] text-wpBlue mb-8">
                                    {t("finetune.title")}
                                </span>
                                {documentation.map((doc, index) => (
                                    <div key={doc.name} className="flex flex-col">
                                        <DocumentationAction
                                            documentCategory={doc.name as DocumentCategoryEnum} sessionId={session_id ?? null} />
                                        {index !== documentation.length - 1 && (
                                            <div className="border border-wpBlue-500 mt-4"></div>)}
                                    </div>
                                ))}
                            </div>
                            <Button
                                onClick={handleClick}
                                variant={"secondary"}
                                className="rounded-[8px] font-inter font-bold text-xs w-64 flex  gap-2 items-center"
                            >
                                <FastForwardIcon />{t("finetune.finishButton")}
                            </Button>
                        </div>
                    </div>
                </BasicLayout>
            </div>
        </>
    );
}