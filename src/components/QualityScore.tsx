/**
 * QualityScore — Displays AI-generated research quality scores as radial charts.
 * Scores are parsed from the AI's reviewer-mode structured response.
 */

import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, Cell } from "recharts";
import { useLanguage, type TranslationKey } from "@/components/LanguageProvider";

export interface ScoreData {
  novelty: number;
  impact: number;
  methodology: number;
  dataset: number;
  citation: number;
  overall: number;
}

interface ScoreCardProps {
  label: string;
  value: number;
  color: string;
}

function ScoreCard({ label, value, color }: ScoreCardProps) {
  const data = [{ value, fill: color }];
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="h-20 w-20">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%" cy="50%"
            innerRadius="60%" outerRadius="90%"
            barSize={8}
            data={data}
            startAngle={90} endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 10]} angleAxisId={0} tick={false} />
            <RadialBar background dataKey="value" cornerRadius={4} angleAxisId={0}>
              <Cell fill={color} />
            </RadialBar>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold" style={{ color }}>{value}<span className="text-xs text-muted-foreground">/10</span></div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

const SCORE_META_DEFS: { key: keyof ScoreData; labelKey: TranslationKey; color: string }[] = [
  { key: "novelty",     labelKey: "novelty",        color: "#818cf8" },
  { key: "impact",      labelKey: "impact",         color: "#34d399" },
  { key: "methodology", labelKey: "methodology",    color: "#f59e0b" },
  { key: "dataset",     labelKey: "dataset",        color: "#60a5fa" },
  { key: "citation",    labelKey: "citationQuality",color: "#e879f9" },
  { key: "overall",     labelKey: "overall",        color: "#fb923c" },
];

interface QualityScoreProps {
  scores: ScoreData;
}

export function QualityScore({ scores }: QualityScoreProps) {
  const { t } = useLanguage();
  const overall = scores.overall;
  const verdictKey: TranslationKey =
    overall >= 8 ? "excellent"
    : overall >= 6 ? "good"
    : overall >= 4 ? "fair"
    : "weak";

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {t("researchQualityScore")}
      </h3>
      <div className="mb-4 grid grid-cols-3 gap-4 sm:grid-cols-6">
        {SCORE_META_DEFS.map(({ key, labelKey, color }) => (
          <ScoreCard key={key} label={t(labelKey)} value={scores[key]} color={color} />
        ))}
      </div>
      <div className="rounded-lg border border-border bg-muted/20 px-4 py-2 text-center text-sm">
        <span className="font-semibold" style={{ color: overall >= 6 ? "#34d399" : "#f59e0b" }}>
          {t(verdictKey)}
        </span>
      </div>
    </div>
  );
}

/** Parse scores from an AI text response that contains "Scores" block */
export function parseScores(text: string): ScoreData | null {
  const get = (label: string) => {
    const m = new RegExp(`${label}[^\\d]*(\\d+(?:\\.\\d+)?)`, "i").exec(text);
    return m ? Math.min(10, parseFloat(m[1])) : 0;
  };
  const overall = get("Overall") || get("overall score");
  if (!overall) return null;
  return {
    novelty:     get("Novelty"),
    impact:      get("Research Impact") || get("Impact"),
    methodology: get("Methodology"),
    dataset:     get("Dataset Quality") || get("Dataset"),
    citation:    get("Technical Soundness") || get("Citation") || get("Feasibility"),
    overall,
  };
}
