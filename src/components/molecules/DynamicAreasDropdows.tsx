import { forwardRef, useImperativeHandle, useState } from 'react';
import { GADMAreas } from '@/types';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/atoms/select";
import { getNextLevelOptions } from '@/tools/utils';
import { useTranslation } from 'react-i18next';
import { SelectedAreaList } from './SelectedAreaList';
import { useDITStore } from "@/store/DITStore";

interface Props {
    areas: GADMAreas[];
    maxLevel: number;
    onFinalSelect?: (value: string | string[]) => void;
}

export interface DynamicDropdownsRef {
    reset: () => void;
}

export const DynamicDropdowns = forwardRef<DynamicDropdownsRef, Props>(


    ({ areas, maxLevel, onFinalSelect }, ref) => {
        const { t } = useTranslation();
        const [selectedGIDs, setSelectedGIDs] = useState<string[]>([]);

        const handleChange = (level: number, gid: string) => {
            const updated = [...selectedGIDs.slice(0, level), gid];
            setSelectedGIDs(updated);
            if (level === maxLevel - 1 && gid) {
                if (gid === "__SELECT_ALL__") {
                    const parentGID = selectedGIDs[level - 1] || '';
                    const options = getNextLevelOptions(areas, level - 1, parentGID);
                    const allGIDs = options.map(opt => opt.gid);
                    onFinalSelect?.(allGIDs);
                } else {
                    onFinalSelect?.(gid);
                }
            } else if (level < maxLevel - 1) {
                onFinalSelect?.('');
            }
        };

        useImperativeHandle(ref, () => ({
            reset: () => {
                setSelectedGIDs(prev => {
                    if (prev.length === 0) return [];
                    const updated = [...prev];
                    updated[updated.length - 1] = '';
                    return updated;
                });
                onFinalSelect?.('');
            },
        }));

        const renderDropdown = (level: number) => {
            const { selectedAreas } = useDITStore();
            const parentGID = selectedGIDs[level - 1] || '';
            const options =
                level === 0
                    ? Array.from(new Map(areas.map(a => [a.GID_0, a.NAME_0])).entries())
                        .map(([gid, name]) => ({ gid, name }))
                    : getNextLevelOptions(areas, level - 1, parentGID);

            const currentValue = selectedGIDs[level] || '';
            const isDisabled = level !== 0 && !selectedGIDs[level - 1];

            // Auto-select if only one option and not already selected
            if (options.length === 1 && currentValue !== options[0].gid) {
                setTimeout(() => handleChange(level, options[0].gid), 0); // avoid rendering issues
            }

            return (
                <Select
                    key={level}
                    value={currentValue}
                    onValueChange={(value) => handleChange(level, value)}
                >
                    <SelectTrigger disabled={isDisabled}>
                        <SelectValue placeholder={`Select Level ${level}`} />
                    </SelectTrigger>
                    <SelectContent>
                        {level === maxLevel - 1 && (
                            <>
                                <SelectItem className='mt-2' key="__SELECT_ALL__" value="__SELECT_ALL__">
                                    {t("areaSelector.dropdown.selectAll")}
                                </SelectItem>
                                <div
                                    className="border border-wpBlue-500 m-2"
                                >
                                </div>
                            </>
                        )}
                        {options.map(opt => (
                            <SelectItem disabled={selectedAreas.includes(opt.gid)} key={opt.gid} value={opt.gid}>
                                {opt.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        };

        return (
            <div className="w-full flex flex-row gap-2">
                {Array.from({ length: maxLevel }).map((_, i) => renderDropdown(i))}
            </div>
        );
    });

