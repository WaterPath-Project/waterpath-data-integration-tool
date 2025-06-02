
import { useNavigate } from "react-router";
import { Button } from "../atoms/button";
import { BasicLayout } from "../templates";
import { Trans, useTranslation } from "react-i18next";
import { BookTextIcon, RefreshCcwIcon } from "lucide-react";

export function Success() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleDocClick = () => {
        window.open('https://waterpath-toolkit.org/docs/modelling-guidelines', '_blank');
      }
    
    return (
        <BasicLayout>
            <div className="whitespace-pre-line sm:mx-4 mt-20 rounded-[10px] p-16 bg-wpBrown rounded-2xl w-full flex font-outfit flex-col gap-8 font-outfit text-wpBlue">
                <Trans className="font-extrabold text-2xl" i18nKey="success.thanks" parent="span" />
                <Trans className="font-medium" i18nKey="success.instructions" components={{
                    1: <a className="text-wpBlue-200 underline" href="https://www.google.com" target="_blank" rel="noopener noreferrer" />
                }} parent="span" />
                <div className="flex">
                <Button variant={"primary"} className="rounded-[8px] mr-2 font-inter font-bold text-xs w-64 flex  gap-2 items-center" onClick={() => handleDocClick}><BookTextIcon /> {t("success.documentationButton")}</Button>
                <Button variant={"secondary"} className="rounded-[8px] font-inter font-bold text-xs w-64 flex  gap-2 items-center" onClick={() => navigate("/")}><RefreshCcwIcon/> {t("success.backHomeButton")}</Button>
                </div>
            </div>
        </BasicLayout>
    );
}