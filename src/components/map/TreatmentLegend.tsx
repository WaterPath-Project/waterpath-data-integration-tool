import type { TreatmentLegendEntry } from "./treatmentCodes";

/**
 * Treatment-code legend. Present codes are listed first; absent treatment codes
 * 5-8 follow dimmed so the full set of available regimes stays discoverable.
 * Port of `07-risk-treatment/TreatmentLegend.jsx` from waterpath-reporting-suite.
 */
export function TreatmentLegend({ legend }: { legend: TreatmentLegendEntry[] }) {
  if (!legend?.length) return null;
  const present = legend.filter((entry) => entry.present);
  const absentTreatment = legend.filter((entry) => !entry.present && entry.code >= 5 && entry.code <= 8);
  const entries = present.length > 0 ? [...present, ...absentTreatment] : legend.filter((entry) => entry.code >= 5 && entry.code <= 8);

  return (
    <div className="mt-3">
      <p className="text-xs font-semibold text-gray-600 mb-2">Treatment levels (GloWPaQMRA codes)</p>
      <div className="flex flex-col gap-1">
        {entries.map((entry) => (
          <div key={entry.code} className={`flex items-start gap-2.5 ${entry.present ? "" : "opacity-35"}`}>
            <span className="flex-shrink-0 w-5 h-5 rounded border border-gray-300 mt-0.5" style={{ background: entry.color }} />
            <div className="min-w-0">
              <span className="text-xs font-medium text-gray-800">
                {entry.code} — {entry.label}
              </span>
              {entry.steps.length > 0 && <span className="text-xs text-gray-500 ml-1.5">({entry.steps.join(" → ")})</span>}
              {!entry.present && <span className="text-xs text-gray-400 ml-1.5 italic">not in this dataset</span>}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Cells with no treatment (codes 0–4) are gray and receive no log-reduction in the QMRA model.
      </p>
    </div>
  );
}
