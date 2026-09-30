import { useTranslation } from "react-i18next";
import { DataCategory } from "@/lib/dataCategories";
import { Scenario } from "@/lib/scenarios";
import { DocumentationAction } from "../molecules/DocumentationAction";

type DataCategorySectionProps = {
  category: DataCategory;
  sessionId: string | null;
  /** Projection scenario whose files are shown; omit for the baseline. */
  scenario?: Scenario;
};

/**
 * Body of one input-data category (e.g. "Human emissions"): its description
 * followed by the subcategories with download / preview actions.
 */
export function DataCategorySection({ category, sessionId, scenario }: DataCategorySectionProps) {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col gap-8">
      <p className="font-inter text-xl text-wpBlue">
        {t(`dataCategories.${category.machineName}.description`)}
      </p>
      <div className="border border-wpBlue-500"></div>
      {category.subcategories.map((subcategory, index) => (
        <div key={subcategory.machineName} className="flex flex-col">
          <DocumentationAction
            subcategory={subcategory}
            sessionId={sessionId}
            fileId={subcategory.fileId ?? null}
            scenario={scenario}
          />
          {index !== category.subcategories.length - 1 && (
            <div className="border border-wpBlue-500 mt-8"></div>
          )}
        </div>
      ))}
    </section>
  );
}
