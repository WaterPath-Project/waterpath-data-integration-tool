import React from "react";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@/components/atoms/breadcrumb";
import { useNavigate } from "react-router";

type Crumb = {
    name: string;
    url?: string;
}

type DynamicBreadcrumbProps = {
    items: Crumb[];
}

const DynamicBreadcrumb: React.FC<DynamicBreadcrumbProps> = ({ items }) => {
    const navigate = useNavigate();
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <React.Fragment key={index}>
                            <BreadcrumbItem >
                                {isLast || !item.url ? (
                                    <BreadcrumbPage className="text-wpBlue font-bold text-sm">{item.name}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink className="text-wpBlue font-bold text-sm hover:cursor-pointer" onClick={() => navigate(item?.url ?? "/")}>{item.name}</BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator className="text-wpBlue font-bold text-xl" />}
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default DynamicBreadcrumb;