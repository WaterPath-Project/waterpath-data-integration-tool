import { useTranslation } from "react-i18next";
import { DataCategory } from "@/lib/dataCategories";
import { Scenario } from "@/lib/scenarios";
import { DocumentationAction } from "../molecules/DocumentationAction";
import { GeodataMapPreview } from "../molecules/GeodataMapPreview";

type DataCategorySectionProps = {
  category: DataCategory;
  sessionId: string | null;
  /** Projection scenario whose files are shown; omit for the baseline. */
  scenario?: Scenario;
};

/**
 * Body of one input-data category (e.g. "Human emissions"): its description
 * followed by the subcategories with download / preview actions. Categories
 * with a `mapPreview` split the space with a map preview on the right.
 */
export function DataCategorySection({ category, sessionId, scenario }: DataCategorySectionProps) {
  const { t } = useTranslation();

  const content = (
    <>
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
    </>
  );

  if (!category.mapPreview) {
    return <section className="flex flex-col gap-8">{content}</section>;
  }

  return (
    <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
      <div className="flex min-w-0 flex-col gap-8">{content}</div>
      <GeodataMapPreview
        sessionId={sessionId}
        preview={category.mapPreview}
        scenario={scenario}
        className="min-w-0 lg:sticky lg:top-6"
      />
    </section>
  );
}
