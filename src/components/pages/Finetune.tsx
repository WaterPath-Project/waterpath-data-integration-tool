import { BasicLayout } from "../templates";
import { useTranslation } from "react-i18next";
import DynamicBreadcrumb from "../molecules/DynamicBreadcrumb";
import { useDITStore } from "@/store/DITStore";
import { DataCategoryTabs } from "../organisms/DataCategoryTabs";
import { dataCategories, isCategoryIncluded } from "@/lib/dataCategories";
import { Button } from "../atoms/button";
import { Loader } from "../atoms/Loader";
import React from "react";
import { useNavigate, useParams } from "react-router";
import api from "@/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { FastForwardIcon, PlusIcon, Table2Icon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../atoms/tabs";
import { NewScenarioDialog } from "../organisms/NewScenarioDialog";
import { SummaryOfChangesTable } from "../organisms/SummaryOfChangesTable";
import { Scenario, scenarioId } from "@/lib/scenarios";
import { Documentation, SummarizeResponse } from "@/types";
import classNames from "classnames";
import { useIsWrapped } from "@/hooks/useIsWrapped";
import { fetchSessionAreaGids } from "@/lib/sessionAreas";

export function Finetune() {
    const { t } = useTranslation();
    const { documentation, setDocumentation, includedCategories, selectedAreaGids, setSelectedAreaGids } = useDITStore();
    const { session_id } = useParams();
    const navigate = useNavigate()
    const [isNewOpen, setIsNewOpen] = React.useState(false);
    const [scenarios, setScenarios] = React.useState<Scenario[]>([]);
    const [activeTab, setActiveTab] = React.useState("baseline");
    const { ref: scenarioListRef, isWrapped: isScenarioListWrapped } = useIsWrapped<HTMLDivElement>([scenarios.length]);

    const visibleCategories = dataCategories.filter((category) =>
        isCategoryIncluded(category, includedCategories, documentation),
    );

    const scenarioLabel = (scenario: Scenario) =>
        `${t(`finetune.sspScenarios.${scenario.ssp}`)}-${scenario.year}`;

    const breadcrumbItems = [
        { name: t("breadcrumb.home"), url: "/" },
        { name: t("breadcrumb.finetune") },
    ];

    // The session endpoint returns a flat list of file names (e.g. "population.csv"), not the
    // datapackage `resources` the generate endpoint returns. Only `name` is read downstream
    // (see isCategoryIncluded), and it must match a subcategory fileId, i.e. the file name
    // without its extension. Returning undefined here would make TanStack Query throw.
    const getSessionData = async (): Promise<Documentation[]> => {
        const result = await api.get<string[] | { resources?: Documentation[] }>(
            `https://dev.waterpath.venthic.com/api/session/?session_id=${session_id}`,
        );
        const data = result.data;
        if (!Array.isArray(data)) {
            return data?.resources ?? [];
        }
        const names = new Set(data.map((file) => file.replace(/\.[^.]+$/, "")));
        return Array.from(names).map((name) => ({ name }) as Documentation);
    };

    const { data, isFetching, isSuccess, isError } = useQuery({
        queryKey: ["getSessionData", session_id],
        queryFn: getSessionData,
        enabled: session_id !== undefined && documentation.length === 0,
    });

    // Area ids drive the map outlines and clipping. They are set when generating, but lost
    // on refresh, so recover them from the session's population file when the store is empty.
    const { data: sessionAreaGids } = useQuery({
        queryKey: ["sessionAreaGids", session_id],
        queryFn: () => fetchSessionAreaGids(session_id as string),
        enabled: session_id !== undefined && selectedAreaGids.length === 0,
        retry: false,
        staleTime: Infinity,
    });

    React.useEffect(() => {
        if (sessionAreaGids && sessionAreaGids.length > 0 && selectedAreaGids.length === 0) {
            setSelectedAreaGids(sessionAreaGids);
        }
    }, [sessionAreaGids]);

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

    const summarizeInput = async (): Promise<SummarizeResponse> => {
        const result = await api.get<SummarizeResponse>(
            `https://dev.waterpath.venthic.com/api/data/input/summarize?session_id=${session_id}`,
        );
        return result.data;
    };

    const { data: summaryData, isFetching: isSummarizing, isError: isSummaryError, refetch: refetchSummary } = useQuery({
        queryKey: ["summarizeInput", session_id],
        queryFn: summarizeInput,
        enabled: false,
        retry: false,
    });

    const [isSummaryOpen, setIsSummaryOpen] = React.useState(false);

    const handleScenarioCreated = (scenario: Scenario) => {
        setScenarios((prev) => [...prev, scenario]);
        setActiveTab(scenarioId(scenario));
        if (isSummaryOpen) {
            void refetchSummary();
        }
    };

    // Toggles the summary table; opening it refreshes the data so new scenarios show up.
    const handleToggleSummary = async () => {
        if (isSummaryOpen) {
            setIsSummaryOpen(false);
            return;
        }
        setIsSummaryOpen(true);
        const result = await refetchSummary();
        if (result.isError) {
            console.error("Error:", result.error);
            toast.error(t("finetune.errorMessage"));
        }
    };

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

    React.useEffect(() => {
        if (isActive) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [isActive]);

    React.useEffect(() => {
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
                            <div className="flex flex-col gap-1">
                                <h1 className="font-outfit font-extrabold text-[2rem] text-wpBlue">
                                    {t("finetune.title")}
                                </h1>
                                <span className="font-inter text-base text-wpBlue">
                                    {t("finetune.subtitle")}
                                </span>
                            </div>
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-8">
                                <div className="flex flex-row items-center gap-2">
                                    <TabsList
                                        ref={scenarioListRef}
                                        className={classNames(
                                            "h-auto w-fit max-w-full flex flex-row flex-wrap justify-start gap-2 bg-wpGray-200 p-3 text-wpBlue",
                                            isScenarioListWrapped ? "rounded-2xl" : "rounded-3xl",
                                        )}
                                    >
                                        <TabsTrigger
                                            value="baseline"
                                            className="shrink-0 rounded-full px-4 py-1.5 font-outfit font-bold text-sm text-wpBlue shadow-none hover:bg-white/50 data-[state=active]:bg-white data-[state=active]:text-wpBlue focus-visible:ring-0 focus-visible:ring-offset-0"
                                        >
                                            {t("finetune.baselineTab")}
                                        </TabsTrigger>
                                        {scenarios.map((scenario) => (
                                            <TabsTrigger
                                                key={scenarioId(scenario)}
                                                value={scenarioId(scenario)}
                                                className="shrink-0 rounded-full px-4 py-1.5 font-outfit font-bold text-sm text-wpBlue shadow-none hover:bg-white/50 data-[state=active]:bg-white data-[state=active]:text-wpBlue focus-visible:ring-0 focus-visible:ring-offset-0"
                                            >
                                                {scenarioLabel(scenario)}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                    <Button
                                        type="button"
                                        variant="primary"
                                        size="sm"
                                        onClick={() => setIsNewOpen(true)}
                                        className="shrink-0 rounded-full px-4 font-outfit font-bold text-sm"
                                    >
                                        <PlusIcon />
                                        {t("finetune.newTab")}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={isSummaryOpen ? "secondary" : "default"}
                                        size="sm"
                                        disabled={scenarios.length === 0}
                                        onClick={handleToggleSummary}
                                        aria-pressed={isSummaryOpen}
                                        aria-expanded={isSummaryOpen}
                                        aria-controls="summary-of-changes"
                                        className="shrink-0 rounded-full px-4 font-outfit font-bold text-sm"
                                    >
                                        <Table2Icon />
                                        {t("finetune.scenariosTableButton")}
                                    </Button>
                                </div>
                                <div
                                    id="summary-of-changes"
                                    aria-hidden={!isSummaryOpen}
                                    className={classNames(
                                        "grid transition-all duration-300 ease-out",
                                        isSummaryOpen
                                            ? "grid-rows-[1fr] opacity-100 translate-y-0"
                                            : "grid-rows-[0fr] opacity-0 -translate-y-3 pointer-events-none",
                                    )}
                                >
                                    <div className="min-h-0 overflow-hidden">
                                        <div className="rounded-2xl border border-wpGray-200 bg-white overflow-hidden">
                                            <SummaryOfChangesTable
                                                data={summaryData}
                                                loading={isSummarizing}
                                                error={isSummaryError ? t("finetune.errorMessage") : ""}
                                                title={t("finetune.summaryTitle")}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <TabsContent value="baseline" className="mt-0">
                                    <DataCategoryTabs
                                        categories={visibleCategories}
                                        sessionId={session_id ?? null}
                                    />
                                </TabsContent>
                                {scenarios.map((scenario) => (
                                    <TabsContent key={scenarioId(scenario)} value={scenarioId(scenario)} className="mt-0">
                                        <DataCategoryTabs
                                            categories={visibleCategories}
                                            sessionId={session_id ?? null}
                                            scenario={scenario}
                                        />
                                    </TabsContent>
                                ))}
                            </Tabs>
                            <NewScenarioDialog
                                open={isNewOpen}
                                onOpenChange={setIsNewOpen}
                                sessionId={session_id ?? null}
                                categories={visibleCategories}
                                scenarios={scenarios}
                                onCreated={handleScenarioCreated}
                            />
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