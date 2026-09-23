import React from "react";
import { useTranslation } from "react-i18next";
import { ChevronRight, Search } from "lucide-react";
import { GADMAreas } from "@/types";
import { Checkbox } from "@/components/atoms/checkbox";
import { cn } from "@/lib/utils";

interface Props {
    /** All downloaded GADM rows. */
    areas: GADMAreas[];
    /** The administrative level whose GIDs count as "selected" (leaf level). */
    leafLevel: number;
    /** Currently selected leaf GIDs. */
    selected: string[];
    /** Called with the full new list of selected leaf GIDs. */
    onChange: (selected: string[]) => void;
    /** Optional explanation per level, shown in parentheses next to "Level N" (index = level). */
    levelLabels?: string[];
}

type Option = { gid: string; name: string };
type CheckState = boolean | "indeterminate";

const ROOT = "__root__";
const gidKey = (i: number) => `GID_${i}` as keyof GADMAreas;
const nameKey = (i: number) => `NAME_${i}` as keyof GADMAreas;

/**
 * Builds two lookups in a single pass over the rows:
 *  - childrenOf: parent GID (or ROOT for level 0) -> unique child options
 *  - leavesOf:   any GID at any level -> all leaf-level GIDs underneath it
 */
function buildIndex(areas: GADMAreas[], leafLevel: number) {
    const childrenOf = new Map<string, Option[]>();
    const seenChild = new Map<string, Set<string>>();
    const leavesOf = new Map<string, Set<string>>();

    for (const area of areas) {
        const leaf = area[gidKey(leafLevel)];
        if (!leaf) continue;

        for (let i = 0; i <= leafLevel; i++) {
            const gid = area[gidKey(i)];
            if (!gid) break;

            const parent = i === 0 ? ROOT : area[gidKey(i - 1)];
            if (!seenChild.has(parent)) {
                seenChild.set(parent, new Set());
                childrenOf.set(parent, []);
            }
            if (!seenChild.get(parent)!.has(gid)) {
                seenChild.get(parent)!.add(gid);
                childrenOf.get(parent)!.push({ gid, name: area[nameKey(i)] });
            }

            if (!leavesOf.has(gid)) leavesOf.set(gid, new Set());
            leavesOf.get(gid)!.add(leaf);
        }
    }

    return { childrenOf, leavesOf };
}

/** Case-insensitive "contains" filter on the option name. */
function filterOptions(options: Option[], query: string | undefined): Option[] {
    const q = (query ?? "").trim().toLowerCase();
    if (!q) return options;
    return options.filter(opt => opt.name.toLowerCase().includes(q));
}

export function MillerColumns({ areas, leafLevel, selected, onChange, levelLabels }: Props) {
    const { t } = useTranslation();
    // path[i] is the GID expanded in column i (drives which children column i+1 shows).
    const [path, setPath] = React.useState<string[]>([]);
    // queries[i] is the search text typed in column i.
    const [queries, setQueries] = React.useState<string[]>([]);

    const { childrenOf, leavesOf } = React.useMemo(() => buildIndex(areas, leafLevel), [areas, leafLevel]);
    const selectedSet = React.useMemo(() => new Set(selected), [selected]);

    const optionsAt = React.useCallback(
        (level: number, currentPath: string[]): Option[] => {
            const parent = level === 0 ? ROOT : currentPath[level - 1];
            if (level > 0 && !parent) return [];
            return childrenOf.get(parent) ?? [];
        },
        [childrenOf]
    );

    const visibleOptionsAt = React.useCallback(
        (level: number, currentPath: string[], currentQueries: string[]): Option[] =>
            filterOptions(optionsAt(level, currentPath), currentQueries[level]),
        [optionsAt]
    );

    // Reset navigation and searches when the underlying data changes.
    React.useEffect(() => { setPath([]); setQueries([]); }, [childrenOf]);

    // Auto-expand columns that have exactly one visible option.
    React.useEffect(() => {
        let next = path;
        for (let i = 0; i < leafLevel; i++) {
            const opts = visibleOptionsAt(i, next, queries);
            if (opts.length === 1 && next[i] !== opts[0].gid) {
                next = [...next.slice(0, i), opts[0].gid];
            } else if (!next[i]) {
                break;
            }
        }
        if (next !== path) setPath(next);
    }, [path, queries, leafLevel, visibleOptionsAt]);

    const stateOf = (gid: string): CheckState => {
        const leaves = leavesOf.get(gid);
        if (!leaves || leaves.size === 0) return false;
        let count = 0;
        for (const leaf of leaves) if (selectedSet.has(leaf)) count++;
        if (count === 0) return false;
        if (count === leaves.size) return true;
        return "indeterminate";
    };

    const toggle = (gid: string) => {
        const leaves = leavesOf.get(gid);
        if (!leaves) return;
        const fullySelected = stateOf(gid) === true;
        const next = new Set(selectedSet);
        for (const leaf of leaves) {
            if (fullySelected) next.delete(leaf);
            else next.add(leaf);
        }
        onChange(Array.from(next));
    };

    const expand = (level: number, gid: string) => {
        if (level >= leafLevel) return;
        setPath(prev => [...prev.slice(0, level), gid]);
        // Deeper columns now show different content, so their searches no longer apply.
        setQueries(prev => prev.slice(0, level + 1));
    };

    const search = (level: number, value: string) => {
        const nextQueries = [...queries];
        nextQueries[level] = value;
        setQueries(nextQueries);

        // If the expanded item of this column is filtered out, reset this column
        // and everything to its right to the initial (nothing expanded) state.
        const active = path[level];
        if (active && !visibleOptionsAt(level, path, nextQueries).some(opt => opt.gid === active)) {
            setPath(prev => prev.slice(0, level));
            setQueries(prev => prev.slice(0, level + 1));
        }
    };

    const renderColumn = (level: number) => {
        const hasParent = level === 0 || Boolean(path[level - 1]);
        const allOptions = optionsAt(level, path);
        const options = filterOptions(allOptions, queries[level]);
        const isLeafColumn = level === leafLevel;
        const explanation = levelLabels?.[level];

        return (
            <div
                key={level}
                className="flex flex-col min-w-56 max-w-72 shrink-0 border border-wpBrown-100 rounded-[8px] bg-wpWhite overflow-hidden"
            >
                <div className="px-3 py-2 border-b border-wpBrown-100 font-inter font-semibold text-xs text-wpBlue uppercase tracking-wide truncate">
                    {t("areaSelector.miller.level", { level })}
                    {explanation && (
                        <span className="normal-case font-medium text-wpBlue-200"> ({explanation})</span>
                    )}
                </div>
                <div className="relative border-b border-wpBrown-100">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-wpBlue-200 pointer-events-none" />
                    <input
                        type="text"
                        value={queries[level] ?? ""}
                        disabled={!hasParent}
                        onChange={e => search(level, e.target.value)}
                        placeholder={t("areaSelector.miller.search")}
                        aria-label={t("areaSelector.miller.search")}
                        className="w-full pl-7 pr-2 py-1.5 font-inter text-xs text-wpBlue bg-transparent placeholder:text-wpBlue-200 focus:outline-none focus:bg-wpBlue-100/30 disabled:cursor-not-allowed"
                    />
                </div>
                <div className="flex flex-col overflow-y-auto max-h-80">
                    {!hasParent && (
                        <span className="px-3 py-4 font-inter text-xs text-wpBlue-500 italic">
                            {t("areaSelector.miller.pickParent")}
                        </span>
                    )}
                    {hasParent && allOptions.length > 0 && options.length === 0 && (
                        <span className="px-3 py-4 font-inter text-xs text-wpBlue-500 italic">
                            {t("areaSelector.miller.noMatches")}
                        </span>
                    )}
                    {options.map(opt => {
                        const state = stateOf(opt.gid);
                        const isActive = path[level] === opt.gid;
                        return (
                            <div
                                key={opt.gid}
                                role={isLeafColumn ? undefined : "button"}
                                onClick={() => expand(level, opt.gid)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 font-inter text-sm text-wpBlue select-none",
                                    !isLeafColumn && "cursor-pointer hover:bg-wpBlue-100/40",
                                    isActive && "bg-wpBlue-100"
                                )}
                            >
                                <Checkbox
                                    id={`miller-${opt.gid}`}
                                    checked={state}
                                    onCheckedChange={() => toggle(opt.gid)}
                                    onClick={e => e.stopPropagation()}
                                />
                                <label
                                    htmlFor={isLeafColumn ? `miller-${opt.gid}` : undefined}
                                    className={cn("flex-1 truncate", isLeafColumn && "cursor-pointer")}
                                    onClick={e => { if (isLeafColumn) e.stopPropagation(); }}
                                >
                                    {opt.name}
                                </label>
                                {!isLeafColumn && <ChevronRight className="h-4 w-4 shrink-0 opacity-60" />}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full flex flex-row gap-2 overflow-x-auto pb-1">
            {Array.from({ length: leafLevel + 1 }).map((_, i) => renderColumn(i))}
        </div>
    );
}
