/**
 * GloWPaQMRA drinking-water treatment codes.
 * Port of `07-risk-treatment/treatmentCodes.js` from waterpath-reporting-suite.
 */
export type TreatmentCodeInfo = { label: string; steps: string[]; color: string };
export type TreatmentLegendEntry = TreatmentCodeInfo & { code: number; present: boolean };

export const TREATMENT_CODE_INFO: Record<number, TreatmentCodeInfo> = {
  0: { label: "No treatment", steps: [], color: "#d1d5db" },
  1: { label: "No treatment", steps: [], color: "#d1d5db" },
  2: { label: "No treatment", steps: [], color: "#d1d5db" },
  3: { label: "No treatment", steps: [], color: "#d1d5db" },
  4: { label: "No treatment", steps: [], color: "#d1d5db" },
  5: {
    label: "Basic treatment",
    steps: ["Chlorination", "Coagulation/flocculation", "Rapid sand filtration"],
    color: "#bfdbfe",
  },
  6: {
    label: "Conventional treatment",
    steps: ["Chlorination", "Coagulation/flocculation", "GAC", "Chlorination"],
    color: "#60a5fa",
  },
  7: {
    label: "Advanced treatment",
    steps: ["Coagulation/flocculation", "Ozonation", "Rapid sand filtration", "GAC", "Chlorination"],
    color: "#2563eb",
  },
  8: {
    label: "Advanced treatment (MF)",
    steps: ["Microfiltration", "Coagulation/flocculation", "RSF", "UV", "GAC", "Microfiltration", "Chlorination"],
    color: "#1e3a8a",
  },
};

export const UNKNOWN_CODE_COLOR = "#94a3b8";

export const DEFAULT_CODE_COLORS: Record<number, string> = Object.fromEntries(
  Object.entries(TREATMENT_CODE_INFO).map(([code, info]) => [Number(code), info.color]),
);

export function createTreatmentLegend(presentCodes: number[] = []): TreatmentLegendEntry[] {
  const present = new Set(presentCodes.map(Number));
  const knownCodes = Object.keys(TREATMENT_CODE_INFO).map(Number);
  const allCodes = [...new Set([...knownCodes, ...present])].sort((a, b) => a - b);
  return allCodes.map((code) => {
    const info = TREATMENT_CODE_INFO[code] ?? { label: `Unknown (code ${code})`, steps: [], color: UNKNOWN_CODE_COLOR };
    return { code, ...info, present: present.has(code) };
  });
}
