import { Card } from "@/components/atoms/card";
import { Chip } from "@/components/atoms/chip";
import { useDITStore } from "@/store/DITStore";
import { GADMAreas } from "@/types";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronRight } from "lucide-react";
import React from "react";

interface SelectedAreaListProps {
    level: number;
}

type Leaf = { gid: string; name: string };

type GroupNode = {
    gid: string;
    name: string;
    children: Map<string, GroupNode>;
    leaves: Leaf[];
};

const gidKey = (i: number) => `GID_${i}` as keyof GADMAreas;
const nameKey = (i: number) => `NAME_${i}` as keyof GADMAreas;

/**
 * Builds a tree from the selected areas: one node per ancestor level (0..level-1),
 * with the selected areas themselves stored as leaves on the deepest node.
 */
function buildTree(selectedAreas: string[], downLoadedAreas: GADMAreas[], level: number): GroupNode {
    const root: GroupNode = { gid: "root", name: "", children: new Map(), leaves: [] };

    for (const gid of selectedAreas) {
        const matched = downLoadedAreas.find(area => area[gidKey(level)] === gid);
        if (!matched) continue;

        let node = root;
        for (let i = 0; i < level; i++) {
            const childGid = matched[gidKey(i)];
            let child = node.children.get(childGid);
            if (!child) {
                child = { gid: childGid, name: matched[nameKey(i)], children: new Map(), leaves: [] };
                node.children.set(childGid, child);
            }
            node = child;
        }
        node.leaves.push({ gid, name: matched[nameKey(level)] });
    }

    return root;
}

/** Collects the gids of every row-level node (depth < level - 1), i.e. every collapsible node. */
function collectRowGids(node: GroupNode, depth: number, level: number, out: string[]): string[] {
    for (const child of node.children.values()) {
        if (depth < level - 1) {
            out.push(child.gid);
            collectRowGids(child, depth + 1, level, out);
        }
    }
    return out;
}

export const SelectedAreaList: React.FC<SelectedAreaListProps> = ({ level }) => {
    const { selectedAreas, downLoadedAreas, removeSelectedArea } = useDITStore();
    const { t } = useTranslation();

    // Everything is expanded by default; this set holds the gids of collapsed rows.
    const [collapsed, setCollapsed] = React.useState<Set<string>>(new Set());

    const tree = React.useMemo(
        () => buildTree(selectedAreas, downLoadedAreas, level),
        [selectedAreas, downLoadedAreas, level]
    );

    const rowGids = React.useMemo(() => collectRowGids(tree, 0, level, []), [tree, level]);

    const isEmpty = tree.children.size === 0 && tree.leaves.length === 0;
    const hasRows = rowGids.length > 0;
    const anyCollapsed = rowGids.some(gid => collapsed.has(gid));

    const toggleRow = (gid: string) => {
        setCollapsed(prev => {
            const next = new Set(prev);
            if (next.has(gid)) next.delete(gid);
            else next.add(gid);
            return next;
        });
    };

    const toggleAll = () => {
        setCollapsed(anyCollapsed ? new Set() : new Set(rowGids));
    };

    const renderChips = (leaves: Leaf[]) => (
        <div className="flex flex-wrap items-center gap-2">
            {leaves.map(leaf => (
                <Chip key={leaf.gid} onRemove={() => removeSelectedArea(leaf.gid)}>
                    {leaf.name}
                </Chip>
            ))}
        </div>
    );

    // Level `level - 1` is rendered as a box holding the chips; every level above it is a collapsible row/subrow.
    const renderNode = (node: GroupNode, depth: number): React.ReactNode => {
        const isBox = depth === level - 1;

        if (isBox) {
            return (
                <div key={node.gid} className="border border-wpBlue-500 rounded-[8px] p-3 flex flex-col gap-2">
                    <span className="font-inter font-semibold text-sm text-wpBlue">{node.name}</span>
                    {renderChips(node.leaves)}
                </div>
            );
        }

        const isExpanded = !collapsed.has(node.gid);
        const ChevronIcon = isExpanded ? ChevronDown : ChevronRight;

        return (
            <div key={node.gid} className="flex flex-col gap-2">
                <button
                    type="button"
                    onClick={() => toggleRow(node.gid)}
                    aria-expanded={isExpanded}
                    className="flex items-center gap-1 text-left font-outfit font-bold text-base text-wpBlue"
                >
                    <ChevronIcon className="h-4 w-4 shrink-0" />
                    {node.name}
                </button>
                {isExpanded && (
                    <div className="flex flex-col gap-2 pl-4 border-l-2 border-wpBlue-100">
                        {Array.from(node.children.values()).map(child => renderNode(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <div className="flex flex-row items-center justify-between gap-4">
                <span className="font-outfit font-extrabold text-[2rem] text-wpBlue">
                    {t("areaSelector.selectedAreasTitle")}
                </span>
                {!isEmpty && hasRows && (
                    <button
                        type="button"
                        onClick={toggleAll}
                        className="font-inter font-semibold text-sm text-wpBlue underline underline-offset-2 hover:opacity-80"
                    >
                        {anyCollapsed ? t("areaSelector.expandAll") : t("areaSelector.collapseAll")}
                    </button>
                )}
            </div>
            <Card className="min-h-40 bg-white p-4 rounded-[8px] flex flex-col justify-center gap-3">
                {isEmpty && <span className=" font-inter font-semibold text-2xl text-wpBlue text-center">
                    {t("areaSelector.noSelectedAreas")}
                </span>}

                {!isEmpty && level === 0 && renderChips(tree.leaves)}

                {!isEmpty && level > 0 &&
                    Array.from(tree.children.values()).map(child => renderNode(child, 0))}
            </Card>
        </>
    );
};
