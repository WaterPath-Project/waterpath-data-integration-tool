import { useQueries } from "@tanstack/react-query";
import DynamicBreadcrumb from "../molecules/DynamicBreadcrumb";
import { AreaSelector } from "../organisms/AreaSelector";
import { BasicLayout } from "../templates";
import { useDITStore } from "@/store/DITStore";
import { levelEnumToNumber } from "@/tools/utils";
import api from "@/api";
import { useEffect } from "react";
import { GADMAreas } from "@/types";
import { Loader } from "../atoms/Loader";

const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Areas" },
];

export function Areas() {
    const { countries, adminLevel, addDownLoadedAreas } = useDITStore();

    const fetchAreasByCountry = async (countryId: string, adminLevel: number) => {
        const result = await api.get(
            `https://dev.waterpath.venthic.com/api/geodata/get-areas?country_code=${countryId}&level=${adminLevel}`,
        );
        console.log(result.data);
        return result.data;
    };

    const areasByCountryQueries = useQueries({
        queries: countries.map((country) => {
            return {
                queryKey: ['area', country.GID_0],
                queryFn: () => fetchAreasByCountry(country.GID_0, levelEnumToNumber(adminLevel)),
            }
        }),
    })

    const isFetching = areasByCountryQueries.some(query => query.isFetching);
    //const isError = areasByCountryQueries.some(query => query.isError);

    const allFetched = areasByCountryQueries.every(q => q.isSuccess);

    useEffect(() => {
        if (allFetched) {
            const combinedData: GADMAreas[] = areasByCountryQueries
                .map(q => q.data) // array of GADMAreas[]
                .flat(); // flatten into GADMAreas[]

            addDownLoadedAreas(combinedData);
        }
    }, [allFetched]);

    return (
        <div className="relative h-full min-h-screen">
            {isFetching && (
                <Loader message={"Loading all the areas"} />
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
