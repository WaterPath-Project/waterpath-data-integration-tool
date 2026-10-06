import { useQueries } from "@tanstack/react-query";
import DynamicBreadcrumb from "../molecules/DynamicBreadcrumb";
import { AreaSelector } from "../organisms/AreaSelector";
import { BasicLayout } from "../templates";
import { useDITStore } from "@/store/DITStore";
import { levelEnumToNumber } from "@/tools/utils";
import api from "@/api";
import React from "react";
import { GADMAreas } from "@/types";
import { Loader } from "../atoms/Loader";
import { useTranslation, } from "react-i18next";
import { useNavigate } from "react-router";


export function Areas() {
    const { countries, adminLevel, selectedAreas, setDownLoadedAreas, setSelectedAreas } = useDITStore();
    const { t } = useTranslation();

    // Redirect to home if no countries are available
    const navigate = useNavigate();

    React.useEffect(() => {
        if (countries.length === 0) {
            navigate("/");
        }
    }, []);

    const breadcrumbItems = [
        { name: t("breadcrumb.home"), url: "/" },
        { name: t("breadcrumb.areas") },
    ];

    const fetchAreasByCountry = async (countryId: string, adminLevel: number) => {
        const result = await api.get(
            `https://dev.waterpath.venthic.com/api/geodata/get-areas?country_code=${countryId}&level=${adminLevel}`,
        );
        return result.data;
    };

    const areasByCountryQueries = useQueries({
        queries: countries.map((country) => {
            return {
                queryKey: ['area', country.GID_0, levelEnumToNumber(adminLevel)],
                queryFn: () => fetchAreasByCountry(country.GID_0, levelEnumToNumber(adminLevel)),
            }
        }),
    })

    const isFetching = areasByCountryQueries.some(query => query.isFetching);

    const allFetched = areasByCountryQueries.every(q => q.isSuccess);

    React.useEffect(() => {
        if (allFetched) {
            const combinedData: GADMAreas[] = areasByCountryQueries
                .map(q => q.data) // array of GADMAreas[]
                .flat(); // flatten into GADMAreas[]

            setDownLoadedAreas(combinedData);

            // Keep only selections that still exist for the current countries and level,
            // so stale picks are dropped when the user changes either and comes back.
            const leafKey = `GID_${levelEnumToNumber(adminLevel)}` as keyof GADMAreas;
            const available = new Set(combinedData.map((area) => area[leafKey]));
            const stillValid = selectedAreas.filter((gid) => available.has(gid));
            if (stillValid.length !== selectedAreas.length) {
                setSelectedAreas(stillValid);
            }
        }
    }, [allFetched]);

    return (
        <div className="relative h-full min-h-screen">
            {isFetching && (
                <Loader message={t("loader.loadingAllTheAreas")} />
            )}
            <BasicLayout>
                <div className="mx-4">
                    <DynamicBreadcrumb items={breadcrumbItems} />
                    <div className="flex flex-col gap-8 mt-10">
                        <AreaSelector />
                    </div>
                </div>
            </BasicLayout>
        </div>
    );
}
