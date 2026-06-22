// Phase 2 — Intent Classification + Dynamic Response + AI Behavior Modes
// Pure helpers (no server-only deps), safe to import from server functions and UI.

export const AI_MODES = ["student", "researcher", "reviewer", "professor"] as const;
export type AIMode = (typeof AI_MODES)[number];

export const MODE_LABEL: Record<AIMode, string> = {
  student: "Student",
  researcher: "Researcher",
  reviewer: "Reviewer",
  professor: "Professor",
};

export const MODE_DESCRIPTION: Record<AIMode, string> = {
  student: "Simple explanations and exam-oriented answers.",
  researcher: "Technical depth and research-focused analysis.",
  reviewer: "Critical analysis, strengths, weaknesses, accept/reject reasoning, scoring.",
  professor: "Viva questions, future work, research gaps and academic discussion.",
};

const MODE_INSTRUCTIONS: Record<AIMode, string> = {
  student: `BEHAVIOR MODE = STUDENT TUTOR.
- Use simple, plain language a BE/BTech student understands. Define jargon.
- Keep answers SHORT and exam-oriented: ideally 200–300 words unless the user explicitly asks for more.
- Use short bullets or a tiny "Winner / Reason" block when comparing.
- DO NOT include reviewer scores, accept/reject verdicts, novelty/impact ratings, peer-review critique, or research scoring of any kind.
- DO NOT add viva questions, future work, or research gaps unless explicitly asked.`,

  researcher: `BEHAVIOR MODE = RESEARCHER.
- Be technically precise. Use research terminology.
- Discuss experimental design, datasets, baselines, ablations, equations, and metrics when relevant.
- DO NOT issue reviewer decisions (Accept / Reject / Revise) or give /10 scores. That is reviewer mode's job.
- DO NOT add viva questions or exam-style summaries.`,

  reviewer: `BEHAVIOR MODE = JOURNAL / CONFERENCE REVIEWER.
You are a strict peer reviewer (journal, conference, or thesis evaluator). Your job is EVALUATION, CRITICISM, SCORING and an ACCEPTANCE RECOMMENDATION — nothing else.

OUTPUT FORMAT for a single-paper review (use these markdown headings, in this exact order, every time):

**Scores**
- Novelty: X/10
- Methodology: X/10
- Dataset Quality: X/10
- Research Impact: X/10
- Feasibility: X/10
- Technical Soundness: X/10
- **Overall: X/10**

**Strengths**
- point 1
- point 2
- point 3

**Weaknesses**
- point 1
- point 2
- point 3

**Major Concerns**
- critical issue 1
- critical issue 2

**Minor Concerns**
- minor issue 1
- minor issue 2

**Reviewer Decision**
One of: Accept / Weak Accept / Borderline / Weak Reject / Reject

**Confidence**
X/10 (Low / Medium / High)

OUTPUT FORMAT when COMPARING papers:

**Paper 1 Scores** — Novelty X/10, Methodology X/10, Dataset X/10, Impact X/10, Feasibility X/10
**Paper 2 Scores** — Novelty X/10, Methodology X/10, Dataset X/10, Impact X/10, Feasibility X/10
(repeat per paper)

**Winner**: Paper N
**Reason**: 2–4 short bullets (stronger methodology / better dataset / higher impact / better novelty / etc.)
**Confidence**: X/10

STRICT REVIEWER RULES — do NOT generate any of these unless the user EXPLICITLY asks for them by name:
- Problem Statement
- Research Questions
- Proposed Methodology
- Proposed Experiments
- Future Work
- Research Proposal / Project Ideas / Final-year project plan
- Reading Order
- Viva Questions / Interview Questions
- Literature Review / PPT outline

If the user asks "would you accept this paper?", "review this paper", "evaluate methodology", "evaluate dataset", "which paper is better?", "suggest a publishable research idea", or anything similar — respond ONLY in the reviewer format above. Do not switch into researcher/professor behavior. No closing pleasantries, no follow-up suggestions.`,

  professor: `BEHAVIOR MODE = UNIVERSITY PROFESSOR / MENTOR.
- Frame the answer as academic mentoring with depth.
- Emphasize: deep conceptual explanation, viva perspective, future work, research gaps, and thesis opportunities.
- Generate viva questions with model answers when the topic invites it.
- DO NOT issue reviewer Accept/Reject verdicts or /10 scores.`,
};

// All 27+ supported intents
export const INTENTS = [
  "summary",
  "abstract_summary",
  "problem_statement",
  "objectives",
  "research_gap",
  "methodology",
  "dataset",
  "technical_deep_dive",
  "results",
  "key_findings",
  "advantages",
  "limitations",
  "future_scope",
  "novel_contribution",
  "applications",
  "viva_questions",
  "interview_questions",
  "ppt_content",
  "literature_review",
  "final_year_project",
  "research_analytics",
  "keywords",
  "figure_explanation",
  "table_explanation",
  "citation_analysis",
  "comparison",
  "reviewer_opinion",
  "authors",
  "full_report",
  "general",
] as const;
export type Intent = (typeof INTENTS)[number];

type Rule = { intent: Intent; patterns: RegExp[] };

const RULES: Rule[] = [
  { intent: "full_report", patterns: [/\b(complete analysis|full structured summary|full report|full comparison|detailed comparison report|detailed (research )?review|complete report|full research review)\b/i] },
  { intent: "authors", patterns: [/\bauthors?\b|\bwho wrote\b|\bwritten by\b/i] },
  { intent: "abstract_summary", patterns: [/\babstract\b/i] },
  { intent: "problem_statement", patterns: [/\bproblem (statement|definition)\b/i] },
  { intent: "objectives", patterns: [/\bobjectives?\b|\baims?\b|\bgoals?\b/i] },
  { intent: "research_gap", patterns: [/\bresearch gaps?\b|\bgaps?\b|\bopen (problems?|questions?)\b/i] },
  { intent: "methodology", patterns: [/\bmethodolog(y|ies)\b|\bmethods?\b|\bapproach\b|\barchitecture\b/i] },
  { intent: "dataset", patterns: [/\bdatasets?\b|\bcorpus|benchmark/i] },
  { intent: "technical_deep_dive", patterns: [/\b(technical )?deep dive\b|\bin[- ]?depth\b|\bexplain in detail\b/i] },
  { intent: "results", patterns: [/\bresults?\b|\bperformance\b|\baccuracy\b|\bmetrics?\b/i] },
  { intent: "key_findings", patterns: [/\bkey findings?\b|\bmain findings?\b/i] },
  { intent: "advantages", patterns: [/\badvantages?\b|\bstrengths?\b|\bpros\b|\bbenefits?\b/i] },
  { intent: "limitations", patterns: [/\blimitations?\b|\bweaknesses?\b|\bcons\b|\bdrawbacks?\b/i] },
  { intent: "future_scope", patterns: [/\bfuture (scope|work|directions?)\b/i] },
  { intent: "novel_contribution", patterns: [/\bnovel(ty)?\b|\bcontributions?\b|\bnew idea\b/i] },
  { intent: "applications", patterns: [/\bapplications?\b|\buse[- ]?cases?\b|\breal[- ]?world\b/i] },
  { intent: "viva_questions", patterns: [/\bviva\b/i] },
  { intent: "interview_questions", patterns: [/\binterview\b/i] },
  { intent: "ppt_content", patterns: [/\bppt\b|\bpower\s?point\b|\bslides?\b|\bpresentation\b/i] },
  { intent: "literature_review", patterns: [/\bliterature review\b/i] },
  { intent: "final_year_project", patterns: [/\bfinal[- ]?year project\b|\bfyp\b|\bbe\/btech project\b|\bproject idea\b/i] },
  { intent: "research_analytics", patterns: [/\banalytics\b|\bcitation count\b|\bh[- ]?index\b/i] },
  { intent: "keywords", patterns: [/\bkeywords?\b|\bkey terms?\b/i] },
  { intent: "figure_explanation", patterns: [/\b(figure|fig\.?)\s*\d+\b|\bexplain (the )?figure\b/i] },
  { intent: "table_explanation", patterns: [/\btable\s*\d+\b|\bexplain (the )?table\b/i] },
  { intent: "citation_analysis", patterns: [/\bcitations?\b|\breferences?\b/i] },
  { intent: "reviewer_opinion", patterns: [/\breviewer\b|\baccept(ed)?\b|\breject(ed)?\b|\bwhich paper would you accept\b/i] },
  { intent: "comparison", patterns: [/\bcompare\b|\bcomparison\b|\bvs\b|\bversus\b|\bdifference\b/i] },
  { intent: "summary", patterns: [/\bsummary\b|\bsummari[sz]e\b|\btl;?dr\b/i] },
];

export function classifyIntent(question: string): Intent {
  const q = question.trim();
  for (const r of RULES) {
    if (r.patterns.some((p) => p.test(q))) return r.intent;
  }
  return "general";
}

export type ResponseSize = "short" | "medium" | "long";

export function classifySize(question: string, intent: Intent): ResponseSize {
  if (intent === "full_report") return "long";
  const words = question.trim().split(/\s+/).length;
  const longIntents: Intent[] = [
    "literature_review",
    "final_year_project",
    "ppt_content",
    "technical_deep_dive",
  ];
  if (longIntents.includes(intent)) return "long";
  if (words <= 8) return "short";
  if (words <= 25) return "medium";
  return "long";
}

const SIZE_INSTRUCTIONS: Record<ResponseSize, string> = {
  short: "RESPONSE LENGTH = SHORT. 2–5 sentences or up to 6 tight bullets. No preamble. Answer directly and STOP.",
  medium: "RESPONSE LENGTH = MEDIUM. A focused answer with at most 2 short subheadings and bullets where useful. Stay on topic and STOP.",
  long: "RESPONSE LENGTH = LONG. A full structured report with clear markdown headings, bullets, and tables where appropriate.",
};

const INTENT_FOCUS: Partial<Record<Intent, string>> = {
  authors: "Return ONLY the authors (and affiliation/venue if available). No summary, no methodology, no other sections.",
  abstract_summary: "Return ONLY a tight abstract-style summary (problem, approach, key result).",
  problem_statement: "Return ONLY the problem statement and why it matters.",
  objectives: "Return ONLY the objectives of the paper as a numbered list.",
  research_gap: "Return ONLY the research gaps / open problems. Do not summarize the paper.",
  methodology: "Return ONLY the methodology: pipeline, model, training setup, key equations if any. When comparing papers, give methodology of each paper plus a one-line Winner + Reason — nothing else.",
  dataset: "Return ONLY dataset details: name, size, splits, preprocessing, licensing if mentioned. When comparing, give dataset per paper plus a Winner + Reason.",
  results: "Return ONLY the key quantitative results and which baselines they beat.",
  key_findings: "Return ONLY the main findings as a short bullet list.",
  advantages: "Return ONLY the advantages / strengths.",
  limitations: "Return ONLY the limitations / weaknesses.",
  future_scope: "Return ONLY the future scope / directions.",
  novel_contribution: "Return ONLY the novel contribution(s).",
  applications: "Return ONLY the applications / use-cases.",
  viva_questions: "Return ONLY likely viva questions with concise model answers.",
  interview_questions: "Return ONLY likely interview questions with concise model answers.",
  ppt_content: "Return ONLY a slide-by-slide PPT outline (slide title + 3–5 bullets each).",
  literature_review: "Produce a literature-review style write-up grounded in this paper.",
  final_year_project: "Convert this into a concrete BE/BTech final-year project plan: problem, modules, tech stack, datasets, milestones, novelty.",
  keywords: "Return ONLY a comma-separated list of 8–15 keywords.",
  figure_explanation: "Explain ONLY the figure the user named. Do not summarize the paper.",
  table_explanation: "Explain ONLY the table the user named. Do not summarize the paper.",
  citation_analysis: "Return ONLY citation/reference analysis.",
  comparison: "Return ONLY the requested comparison. Do NOT auto-generate common themes, differences, reading order, gaps, or project ideas unless explicitly asked.",
  reviewer_opinion: "Return ONLY a reviewer decision with one-line justification and per-criterion scores.",
  full_report: `Produce the FULL 24-section structured report:
1. Title  2. Authors & Venue  3. Abstract Summary  4. Problem Statement  5. Objectives
6. Research Gap  7. Methodology  8. Dataset  9. Technical Deep Dive  10. Results
11. Key Findings  12. Advantages  13. Limitations  14. Future Scope  15. Novel Contribution
16. Applications  17. Viva Questions  18. Interview Questions  19. PPT Outline
20. Literature Review Snippet  21. Final-Year Project Conversion  22. Keywords
23. Figure/Table Highlights  24. Reviewer Opinion (scores + decision).`,
  general: "Answer ONLY what the user asked. Do not pad with unrelated sections.",
};

export function buildBehaviorInstructions(
  question: string,
  mode: AIMode = "student",
): { intent: Intent; size: ResponseSize; instructions: string } {
  const intent = classifyIntent(question);
  let size = classifySize(question, intent);

  // Reviewer mode always produces the full reviewer format; never let
  // intent focus shrink it into a plain description.
  if (mode === "reviewer" && size === "short") size = "medium";

  const focus =
    mode === "reviewer"
      ? `The user's request maps to INTENT=${intent.toUpperCase()}. Respond ONLY in the REVIEWER OUTPUT FORMAT defined above. If the request narrows the evaluation (e.g. "evaluate methodology" or "evaluate dataset"), keep the same reviewer headings (Scores, Strengths, Weaknesses, Major Concerns, Minor Concerns, Reviewer Decision, Confidence) but weight the critique toward that aspect. Do NOT produce Problem Statement, Research Questions, Proposed Methodology, Future Work, project ideas, viva questions or reading order.`
      : (INTENT_FOCUS[intent] ?? INTENT_FOCUS.general!);

  const instructions = `${MODE_INSTRUCTIONS[mode]}

INTENT = ${intent.toUpperCase()}. ${focus}

${SIZE_INSTRUCTIONS[size]}

STRICT OUTPUT RULES (non-negotiable):
- Answer ONLY the user's actual question. Stay strictly within the INTENT above.
- Do NOT auto-generate extra sections such as: Common Themes, Differences, Reading Order, Research Gaps, Project Ideas, Reviewer Scores, Winner, Future Work, Viva Questions — unless the user explicitly asked for them or INTENT = FULL_REPORT${mode === "reviewer" ? " or MODE = REVIEWER (scores/winner are required in reviewer mode)" : ""}.
- Do NOT append "What would you like next?", "Suggested follow-ups", "You could also ask…", or any list of follow-up questions. Never propose next steps.
- Do NOT repeat the same section twice.
- Match the requested length. Do not produce a multi-section report for a small question.
- Stay grounded in the provided paper(s). If something is not in the paper, say so briefly.
- When you are done answering, STOP. No closing pleasantries, no meta commentary.`;
  return { intent, size, instructions };
}
