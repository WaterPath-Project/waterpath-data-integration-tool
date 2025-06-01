
import { useNavigate } from "react-router";
import { Button } from "../atoms/button";
import { BasicLayout } from "../templates";
import { Trans, useTranslation } from "react-i18next";

export function Success() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <BasicLayout>
            <div className="whitespace-pre-line sm:mx-4 mt-20 border-4 rounded-[10px] p-6 border-wpBlue-300 flex font-outfit flex-col items-center gap-8 text-wpBlue-300 text-2xl font-bold text-center">
                <Trans i18nKey="success.thanks" components={{
                    1: <a className="text-wpBlue-200 underline" href="https://www.google.com" target="_blank" rel="noopener noreferrer" />
                }} parent="span" />
                <Button variant={"secondary"} className="rounded-[8px] font-inter font-bold text-xs w-64 flex  gap-2 items-center" onClick={() => navigate("/")}>{t("success.backHomeButton")}</Button>
            </div>
        </BasicLayout>
    );
}