import { Trans, useTranslation } from "react-i18next";
import { InfoIcon } from "lucide-react";
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
 * Links available inside category notices. A notice string wraps its link text in
 * the matching tag, e.g. "<isimip4>ISIMIP4 simulation round</isimip4>".
 */
const NOTICE_LINKS: Record<string, string> = {
  isimip4: "https://protocol4.isimip.org/#/ISIMIP4a",
};

const noticeLinkComponents = Object.fromEntries(
  Object.entries(NOTICE_LINKS).map(([tag, href]) => [
    tag,
    <a href={href} target="_blank" rel="noreferrer" className="underline underline-offset-2" />,
  ]),
);

/**
 * Body of one input-data category (e.g. "Human emissions"): an optional notice
 * (i18n `dataCategories.<name>.notice`), its description, then the subcategories
 * with download / preview actions. Categories with a `mapPreview` split the
 * space with a map preview on the right.
 */
export function DataCategorySection({ category, sessionId, scenario }: DataCategorySectionProps) {
  const { t, i18n } = useTranslation();
  const noticeKey = `dataCategories.${category.machineName}.notice`;
  const hasNotice = i18n.exists(noticeKey);

  const content = (
    <>
      {hasNotice && (
        <div role="note" className="flex flex-row items-start gap-3 rounded-[8px] bg-wpBrown-200 p-4 font-inter text-sm text-wpBlue">
          <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            <Trans i18nKey={noticeKey} components={noticeLinkComponents} />
          </p>
        </div>
      )}
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
