import { BasicLayout } from "../templates";
import { useTranslation } from "react-i18next";
import DynamicBreadcrumb from "../molecules/DynamicBreadcrumb";
import classNames from "classnames";
import { useDITStore } from "@/store/DITStore";
import { DocumentationAction } from "../molecules/DocumentationAction";
import { DocumentCategoryEnum } from "@/types";

export function Success() {
    const { t } = useTranslation();
    const { documentation } = useDITStore();

    const breadcrumbItems = [
        { name: t("breadcrumb.home"), url: "/" },
        { name: t("breadcrumb.finetune") },
    ];

    return (
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
                                        documentCategory={doc.name as DocumentCategoryEnum} />
                                    {index !== documentation.length - 1 && (
                                        <div className="border border-wpBlue-500 mt-4"></div>)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </BasicLayout>
        </div>
    );
}