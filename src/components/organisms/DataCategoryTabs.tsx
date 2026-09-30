import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../atoms/tabs";
import { categoryIcons } from "@/components/assets/categoryIcons";
import { DataCategory, hasAvailableFiles } from "@/lib/dataCategories";
import { useDITStore } from "@/store/DITStore";
import { Scenario } from "@/lib/scenarios";
import { DataCategorySection } from "./DataCategorySection";

type DataCategoryTabsProps = {
  categories: DataCategory[];
  sessionId: string | null;
  /** Projection scenario whose files are shown; omit for the baseline. */
  scenario?: Scenario;
};

/**
 * Tabbed view of the input-data categories on the Preview data page.
 * Categories without any downloadable file are shown as disabled tabs.
 */
export function DataCategoryTabs({ categories, sessionId, scenario }: DataCategoryTabsProps) {
  const { t } = useTranslation();
  const includedCategories = useDITStore((state) => state.includedCategories);
  // A category is usable when it has downloadable files or was selected on the first screen.
  const isAvailable = (category: DataCategory) =>
    hasAvailableFiles(category) || includedCategories.includes(category.machineName);
  const defaultCategory = categories.find(isAvailable) ?? categories[0];

  if (!defaultCategory) {
    return null;
  }

  return (
    <div className="bg-wpGray-100 rounded-2xl p-6 flex flex-col gap-8">
      <Tabs defaultValue={defaultCategory.machineName}>
        <TabsList className="h-auto w-fit max-w-full inline-flex flex-row flex-wrap justify-start gap-2 rounded-2xl bg-wpGray-200 p-2 text-wpBlue">
          {categories.map((category) => {
            const available = isAvailable(category);
            return (
              <span
                key={category.machineName}
                className={classNames("relative group", { "cursor-not-allowed": !available })}
              >
                <TabsTrigger
                  value={category.machineName}
                  disabled={!available}
                  className="flex flex-row items-center gap-3 rounded-xl px-4 py-2 font-outfit font-bold text-lg text-wpBlue shadow-none hover:bg-white/50 data-[state=active]:bg-white data-[state=active]:text-wpBlue focus-visible:ring-0 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50"
                >
                  <img
                    src={categoryIcons[category.icon]}
                    alt=""
                    aria-hidden="true"
                    className="h-10 w-10 shrink-0"
                  />
                  <span>{t(`dataCategories.${category.machineName}.title`)}</span>
                </TabsTrigger>
                {!available && (
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-wpBlue px-3 py-1.5 font-inter text-xs text-wpWhite opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    {t("finetune.notAvailable")}
                  </span>
                )}
              </span>
            );
          })}
        </TabsList>
        {categories.map((category) => (
          <TabsContent key={category.machineName} value={category.machineName} className="mt-8">
            <DataCategorySection category={category} sessionId={sessionId} scenario={scenario} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
