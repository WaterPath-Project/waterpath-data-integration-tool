import React from "react";
import { Printer } from "lucide-react";
import { SummarizeMetric, SummarizeResponse, SummarizeScenario } from "@/types";
import {
    DRIVER_META,
    computeMetricDelta,
    formatDeltaValue,
    formatMetricValue,
    isMetricApplicableForScenario,
} from "@/lib/driverMetricUtils";

type SummaryOfChangesTableProps = {
    /** Response of GET /api/data/input/summarize. */
    data: SummarizeResponse | null | undefined;
    loading?: boolean;
    error?: string;
    /** Header text (default "Summary of changes"). */
    title?: string;
};

type ViewMode = "delta" | "values";

type MetricGroup = { driver: string; rows: SummarizeMetric[] };

const escapeHtml = (s: unknown) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

/**
 * "Summary of changes" table: one column per scenario, one row per driver metric,
 * grouped by driver. Shows each scenario's change vs the baseline (Deltas) or raw Values.
 *
 * Ported from `05-summary-of-changes/SummaryOfChangesTable.jsx` in
 * https://github.com/WaterPath-Project/waterpath-reporting-suite.
 */
export function SummaryOfChangesTable({ data, loading = false, error = "", title = "Summary of changes" }: SummaryOfChangesTableProps) {
    const [viewMode, setViewMode] = React.useState<ViewMode>("delta");
    const [selectedSsp, setSelectedSsp] = React.useState("all");
    const tableRef = React.useRef<HTMLTableElement>(null);

    const scenarios = React.useMemo(() => data?.scenarios ?? [], [data]);
    const metrics = React.useMemo(() => data?.metrics ?? [], [data]);
    const baselineId = data?.baseline_scenario_id ?? null;
    const baselineScenario = scenarios.find((s) => s.id === baselineId) ?? null;
    const baselineMetrics = baselineScenario?.metrics ?? null;

    const sspOptions = React.useMemo(() => {
        const seen = new Set<string>();
        scenarios.forEach((sc) => {
            const ssp = (sc.ssp ?? "").trim();
            if (ssp) seen.add(ssp);
        });
        return [...seen].sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
    }, [scenarios]);

    // Baseline first, then by year, then by name. The baseline is kept under every SSP filter.
    const orderedScenarios = React.useMemo(() => {
        const selected = selectedSsp === "all" ? null : selectedSsp;
        return scenarios
            .filter((sc) => sc.id === baselineId || !selected || (sc.ssp ?? "").trim() === selected)
            .slice()
            .sort((a, b) => {
                if (a.id === baselineId) return -1;
                if (b.id === baselineId) return 1;
                const yearA = Number(a.year);
                const yearB = Number(b.year);
                const safeYearA = Number.isFinite(yearA) ? yearA : Number.POSITIVE_INFINITY;
                const safeYearB = Number.isFinite(yearB) ? yearB : Number.POSITIVE_INFINITY;
                if (safeYearA !== safeYearB) return safeYearA - safeYearB;
                return String(a.name ?? "").localeCompare(String(b.name ?? ""), undefined, { numeric: true, sensitivity: "base" });
            });
    }, [scenarios, baselineId, selectedSsp]);

    const groupedMetrics = React.useMemo(() => {
        const groups: MetricGroup[] = [];
        const byDriver = new Map<string, MetricGroup>();
        metrics.forEach((m) => {
            let group = byDriver.get(m.driver);
            if (!group) {
                group = { driver: m.driver, rows: [] };
                byDriver.set(m.driver, group);
                groups.push(group);
            }
            group.rows.push(m);
        });
        return groups;
    }, [metrics]);

    const handlePrintTable = () => {
        if (!tableRef.current) return;
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;
        printWindow.opener = null;
        printWindow.document.write(`<!doctype html>
      <html><head><title>${escapeHtml(title)}</title><style>
        @page { size: landscape; margin: 10mm; }
        body { margin: 0; color: #1f2937; font-family: Arial, sans-serif; }
        h1 { margin: 0 0 4px; color: #0B4159; font-size: 18px; }
        p { margin: 0 0 14px; color: #6b7280; font-size: 11px; }
        table { width: 100%; border-collapse: collapse; font-size: 9px; }
        th, td { padding: 5px 6px; border: 1px solid #d1d5db; text-align: center; }
        th:first-child, th:nth-child(2), td:first-child, td:nth-child(2) { text-align: left; }
        thead { background: #EEF2F5; color: #0B4159; }
        img { display: none; }
      </style></head><body>
      <h1>${escapeHtml(title)}</h1>
      <p>${baselineScenario ? `Baseline: ${escapeHtml(baselineScenario.name)}` : ""}</p>
      ${tableRef.current.outerHTML}
      </body></html>`);
        printWindow.document.close();
        printWindow.addEventListener(
            "load",
            () => {
                printWindow.focus();
                printWindow.print();
                printWindow.close();
            },
            { once: true },
        );
    };

    const metricValue = (scenario: SummarizeScenario | null, key: string): number | null => {
        const value = (scenario?.metrics as Record<string, number | null | undefined> | null | undefined)?.[key];
        return value ?? null;
    };

    return (
        <div className="flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0 flex items-center justify-between gap-4">
                <h2 className="text-base font-semibold text-wpBlue font-inter">{title}</h2>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handlePrintTable}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-wpGreen px-3 py-1.5 text-sm font-semibold text-wpBlue shadow-sm hover:bg-gray-50"
                        title="Print summary table"
                    >
                        <Printer size={14} /> Print table
                    </button>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                        <span className="uppercase tracking-wide">Select SSP:</span>
                        <select
                            value={selectedSsp}
                            onChange={(e) => setSelectedSsp(e.target.value)}
                            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-wpBlue shadow-sm focus:border-wpBlue focus:outline-none"
                        >
                            <option value="all">All SSPs</option>
                            {sspOptions.map((ssp) => (
                                <option key={ssp} value={ssp}>
                                    {ssp}
                                </option>
                            ))}
                        </select>
                    </label>
                    <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden text-sm font-semibold">
                        <button
                            type="button"
                            onClick={() => setViewMode("delta")}
                            className={`px-3 py-1.5 ${viewMode === "delta" ? "bg-wpBlue text-white" : "bg-white text-wpBlue hover:bg-gray-50"}`}
                        >
                            Deltas
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("values")}
                            className={`px-3 py-1.5 ${viewMode === "values" ? "bg-wpBlue text-white" : "bg-white text-wpBlue hover:bg-gray-50"}`}
                        >
                            Values
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-6 py-5">
                {loading && <p className="text-sm text-gray-500 italic">Loading driver comparison…</p>}
                {!loading && error && <p className="text-sm text-red-500">{error}</p>}
                {!loading && !error && scenarios.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No scenarios available.</p>
                )}

                {!loading && !error && scenarios.length > 0 && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table ref={tableRef} className="text-sm" style={{ minWidth: "100%" }}>
                                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                    <tr>
                                        <th className="text-left px-3 py-2 min-w-[170px] text-sm uppercase tracking-wide text-gray-500">Category</th>
                                        <th className="text-left px-3 py-2 min-w-[260px] text-sm uppercase tracking-wide text-gray-500">Metric</th>
                                        {orderedScenarios.map((sc) => (
                                            <th key={sc.id} className="text-center px-3 py-2 min-w-[150px]">
                                                <div className="font-semibold text-wpBlue leading-tight font-inter">{sc.name}</div>
                                                <div className="text-[11px] text-gray-500 mt-0.5 font-inter">
                                                    {sc.year || "—"}
                                                    {sc.id === baselineId ? " · Baseline" : ""}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedMetrics.map((group) => {
                                        const meta = DRIVER_META[group.driver] ?? null;
                                        // Changes in these drivers are neither good nor bad by themselves.
                                        const neutralDriver = group.driver === "Hydrology" || group.driver === "Exposure pathways";
                                        return group.rows.map((metric, idx) => (
                                            <tr key={metric.key} className="border-b border-gray-100 last:border-b-0">
                                                {idx === 0 && (
                                                    <td rowSpan={group.rows.length} className="px-3 py-2 text-gray-700 align-top border-r border-gray-100 bg-wpWhite">
                                                        <div className="flex items-center gap-2 pt-1">
                                                            {meta?.icon && <img src={meta.icon} alt={meta.label} className="w-8 h-8 shrink-0" />}
                                                            <span className="text-sm uppercase tracking-wide text-gray-600 font-semibold">{meta?.label ?? group.driver}</span>
                                                        </div>
                                                    </td>
                                                )}
                                                <td className="px-3 py-2 text-gray-700 font-inter">
                                                    {metric.label}
                                                    {group.driver === "Exposure pathways" ? " (events/year)" : ""}
                                                </td>
                                                {orderedScenarios.map((sc) => {
                                                    const cellKey = `${metric.key}-${sc.id}`;
                                                    if (!isMetricApplicableForScenario(metric.key, sc)) {
                                                        return (
                                                            <td key={cellKey} className="px-3 py-2 text-center">
                                                                <span className="text-gray-400">—</span>
                                                            </td>
                                                        );
                                                    }
                                                    const val = metricValue(sc, metric.key);
                                                    if (viewMode === "values" || sc.id === baselineId) {
                                                        return (
                                                            <td key={cellKey} className="px-3 py-2 text-center">
                                                                <span className={`font-semibold font-inter ${!neutralDriver && sc.id === baselineId ? "text-wpBlue" : "text-gray-700"}`}>
                                                                    {formatMetricValue(val, metric.value_format)}
                                                                </span>
                                                            </td>
                                                        );
                                                    }
                                                    const base = isMetricApplicableForScenario(metric.key, baselineScenario) && baselineMetrics
                                                        ? metricValue(baselineScenario, metric.key)
                                                        : null;
                                                    const deltaMode = metric.delta_mode || "relative_pct";
                                                    const delta = computeMetricDelta(base, val, deltaMode);
                                                    const direction = metric.color_direction || "positive_good";
                                                    let deltaColor = "text-gray-700";
                                                    if (!neutralDriver && delta !== null && delta !== 0) {
                                                        if (direction === "neutral") deltaColor = "text-wpBlue";
                                                        else if (direction === "positive_good") deltaColor = delta > 0 ? "text-green-700" : "text-red-600";
                                                        else if (direction === "negative_good") deltaColor = delta > 0 ? "text-red-600" : "text-green-700";
                                                    }
                                                    return (
                                                        <td key={cellKey} className="px-3 py-2 text-center">
                                                            {delta === null ? (
                                                                <span className="text-gray-400">—</span>
                                                            ) : (
                                                                <span className={`font-semibold font-inter ${deltaColor}`}>{formatDeltaValue(delta, deltaMode)}</span>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ));
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
