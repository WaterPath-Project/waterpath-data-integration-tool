import React from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
import { DataCategory } from "@/lib/dataCategories";
import { Button } from "../atoms/button";
import { Loader } from "../atoms/Loader";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../atoms/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../atoms/select";
import {
    PROJECTION_SCHEMAS,
    SCENARIO_YEARS,
    SSP_SCENARIOS,
    Scenario,
    ScenarioYear,
    SspScenario,
    scenarioExists,
    sspParam,
} from "@/lib/scenarios";

type NewScenarioDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sessionId: string | null;
    /** Categories shown on the page; mapped to the API's `schema` parameter. */
    categories: DataCategory[];
    /** Scenarios that already exist; their SSP/year combinations are disabled. */
    scenarios: Scenario[];
    /** Called after the projections API accepted the new scenario. */
    onCreated: (scenario: Scenario) => void;
};

/**
 * Modal form for creating a new projection scenario: one SSP dropdown and a
 * year button group. On Create it calls the projections generate API, shows a
 * loader meanwhile, and reports the scenario back through `onCreated`.
 * Selections reset whenever the dialog closes.
 */
export function NewScenarioDialog({ open, onOpenChange, sessionId, categories, scenarios, onCreated }: NewScenarioDialogProps) {
    const { t } = useTranslation();
    const [ssp, setSsp] = React.useState<SspScenario | "">("");
    const [year, setYear] = React.useState<ScenarioYear | "">("");

    const generateProjection = async () => {
        if (!sessionId || !ssp || !year) throw new Error("Scenario is incomplete");
        const schema = categories
            .map((category) => PROJECTION_SCHEMAS[category.machineName])
            .filter((value): value is string => value !== undefined)
            .join(",");
        const params = new URLSearchParams({
            session_id: sessionId,
            schema,
            year,
            ssp: sspParam(ssp),
        });
        const result = await api.post(
            `https://dev.waterpath.venthic.com/api/data/projections/generate?${params.toString()}`,
        );
        return result.data;
    };

    const { isFetching: isCreating, refetch } = useQuery({
        queryKey: ["generateProjection", sessionId, ssp, year],
        queryFn: generateProjection,
        enabled: false,
        retry: false,
    });

    const isSspDisabled = (candidate: SspScenario) =>
        year
            ? scenarioExists(scenarios, candidate, year)
            : SCENARIO_YEARS.every((y) => scenarioExists(scenarios, candidate, y));
    const isYearDisabled = (candidate: ScenarioYear) =>
        ssp
            ? scenarioExists(scenarios, ssp, candidate)
            : SSP_SCENARIOS.every((s) => scenarioExists(scenarios, s, candidate));

    const canCreate = !isCreating && ssp !== "" && year !== "" && !scenarioExists(scenarios, ssp, year);

    const handleOpenChange = (nextOpen: boolean) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
            setSsp("");
            setYear("");
        }
    };

    const handleCreate = async () => {
        if (!canCreate || !ssp || !year || !sessionId) return;
        const scenario: Scenario = { ssp, year };
        const result = await refetch();
        if (result.isError) {
            console.error("Error:", result.error);
            toast.error(t("finetune.errorMessage"));
            return;
        }
        toast.success(t("finetune.newModalSuccessMessage"));
        handleOpenChange(false);
        onCreated(scenario);
    };

    return (
        <>
            {isCreating && <Loader message={t("loader.generateScenarioData")} className="z-[60]" />}
            <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="font-outfit text-wpBlue">
                <DialogHeader>
                    <DialogTitle className="font-semibold text-2xl">{t("finetune.newModalTitle")}</DialogTitle>
                    <DialogDescription>{t("finetune.newModalDescription")}</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-6 py-2">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="new-scenario-ssp" className="font-inter font-bold text-sm text-wpBlue">
                            {t("finetune.newModalScenarioLabel")}
                        </label>
                        <Select value={ssp} onValueChange={(value) => setSsp(value as SspScenario)}>
                            <SelectTrigger id="new-scenario-ssp" className="font-inter text-wpBlue">
                                <SelectValue placeholder={t("finetune.newModalScenarioPlaceholder")} />
                            </SelectTrigger>
                            <SelectContent>
                                {SSP_SCENARIOS.map((candidate) => (
                                    <SelectItem
                                        key={candidate}
                                        value={candidate}
                                        disabled={isSspDisabled(candidate)}
                                        className="cursor-pointer transition-all duration-150 hover:bg-wpGray-100 hover:pl-9 data-[highlighted]:bg-wpGray-200"
                                    >
                                        {t(`finetune.sspScenarios.${candidate}`)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="font-inter font-bold text-sm text-wpBlue">
                            {t("finetune.newModalYearLabel")}
                        </span>
                        <div role="radiogroup" aria-label={t("finetune.newModalYearLabel")} className="flex flex-row gap-2">
                            {SCENARIO_YEARS.map((candidate) => {
                                const selected = year === candidate;
                                return (
                                    <Button
                                        key={candidate}
                                        type="button"
                                        role="radio"
                                        aria-checked={selected}
                                        disabled={isYearDisabled(candidate)}
                                        variant={selected ? "secondary" : "default"}
                                        onClick={() => setYear(candidate)}
                                        className={classNames("flex-1 rounded-full font-inter font-bold text-sm", {
                                            "border border-wpBlue": selected,
                                        })}
                                    >
                                        {candidate}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="primary"
                        disabled={!canCreate}
                        onClick={handleCreate}
                        className="rounded-full px-6 font-outfit font-bold text-sm"
                    >
                        {t("finetune.newModalCreate")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    );
}
