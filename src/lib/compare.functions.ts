import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { RESEARCH_MIND_PROMPT } from "@/config/systemPrompt";
import { AI_MODES, buildBehaviorInstructions } from "@/lib/aiBehavior";



const AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

async function callGemini(messages: { role: string; content: string }[]) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("AI is not configured");
  const resp = await fetch(AI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: "google/gemini-2.5-flash", messages }),
  });
  if (!resp.ok) {
    const txt = await resp.text();
    if (resp.status === 429) throw new Error("AI rate limit reached.");
    if (resp.status === 402) throw new Error("AI credits exhausted.");
    throw new Error(`AI error: ${resp.status} ${txt.slice(0, 200)}`);
  }
  const json = (await resp.json()) as { choices: { message: { content: string } }[] };
  return json.choices?.[0]?.message?.content ?? "";
}

async function buildPaperBundle(
  supabase: any,
  paperIds: string[],
): Promise<{ bundle: string; titles: string[] }> {
  const { data: papers, error } = await supabase
    .from("papers")
    .select("id, title, extracted_text")
    .in("id", paperIds);
  if (error) throw new Error(error.message);
  if (!papers || papers.length < 2) throw new Error("Need at least 2 papers");
  const perPaper = Math.floor(110_000 / papers.length);
  const bundle = papers
    .map(
      (p: any, i: number) =>
        `### PAPER ${i + 1}: ${p.title}\n${(p.extracted_text ?? "").slice(0, perPaper)}`,
    )
    .join("\n\n---\n\n");
  return { bundle, titles: papers.map((p: any) => p.title) };
}

/** Create a comparison: runs initial AI compare, saves it, returns the new id. */
export const createComparison = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        paperIds: z.array(z.string().uuid()).min(2).max(5),
        focus: z.string().max(500).optional(),
        mode: z.enum(AI_MODES).optional().default("researcher"),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { bundle, titles } = await buildPaperBundle(supabase, data.paperIds);

    // Treat focus as the user's question. If no focus, default to full report.
    const focusText = (data.focus ?? "").trim();
    const effectiveQuestion =
      focusText.length > 0 ? focusText : "Full comparison report";
    const { instructions, intent, size } = buildBehaviorInstructions(
      effectiveQuestion,
      data.mode,
    );

    const fullReportBlock = `Produce a structured comparison with:
1. Side-by-side table (Problem | Methodology | Dataset | Key Result | Limitations)
2. Common themes
3. Key differences and contradictions
4. Combined research gaps a BE/BTech student could exploit
5. Recommended reading order
6. Reviewer-style scores per paper (Methodology, Dataset, Novelty, Impact, Implementation — each /10) and a final Winner with confidence /10.`;

    const focusedBlock = `Answer ONLY the focused request below across the provided papers. Do NOT generate a side-by-side problem/methodology/dataset/results table, common themes, differences, reading order, research gaps, reviewer scores, or a winner unless the request explicitly asks for them.

FOCUSED REQUEST: ${focusText}`;

    const reviewerBlock = `Produce a REVIEWER COMPARISON across the provided papers using the reviewer output format defined in your behavior instructions. For each paper give Novelty/Methodology/Dataset/Impact/Feasibility scores (/10), then a Winner with 2–4 bullet reasons, then Confidence /10. Do NOT generate Common Themes, Reading Order, Research Gaps, Project Ideas, Future Work or Viva Questions.

${focusText ? `FOCUS: ${focusText}` : ""}`;

    const taskBlock =
      data.mode === "reviewer"
        ? reviewerBlock
        : intent === "full_report"
          ? fullReportBlock
          : focusedBlock;

    const userMsg = `Compare the following research papers.

${taskBlock}

${bundle}`;

    const answer = await callGemini([
      { role: "system", content: `${RESEARCH_MIND_PROMPT}\n\n${instructions}` },
      { role: "user", content: userMsg },
    ]);

    const title = `Compare: ${titles.map((t) => t.slice(0, 40)).join(" vs ")}`.slice(0, 200);

    const { data: comp, error: insErr } = await supabase
      .from("comparisons")
      .insert({
        user_id: userId,
        title,
        paper_ids: data.paperIds,
        focus: data.focus ?? null,
        initial_result: answer,
      })
      .select("id")
      .single();
    if (insErr || !comp) throw new Error(insErr?.message ?? "Could not save comparison");

    await supabase.from("comparison_messages").insert([
      {
        comparison_id: comp.id,
        user_id: userId,
        role: "user",
        content: focusText
          ? `Compare these papers (focus: ${focusText})`
          : "Compare these papers",
      },
      { comparison_id: comp.id, user_id: userId, role: "assistant", content: answer },
    ]);

    return { id: comp.id as string, answer, intent, size };
  });

/** Ask a follow-up question on an existing comparison; preserves paper + chat context. */
export const askComparison = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        comparisonId: z.string().uuid(),
        question: z.string().min(1).max(4000),
        mode: z.enum(AI_MODES).optional().default("student"),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: comp, error: cErr } = await supabase
      .from("comparisons")
      .select("id, paper_ids, focus")
      .eq("id", data.comparisonId)
      .maybeSingle();
    if (cErr || !comp) throw new Error("Comparison not found");

    const { bundle } = await buildPaperBundle(supabase, comp.paper_ids as string[]);

    const { data: history } = await supabase
      .from("comparison_messages")
      .select("role, content")
      .eq("comparison_id", data.comparisonId)
      .order("created_at", { ascending: true });

    const { instructions, intent, size } = buildBehaviorInstructions(data.question, data.mode);

    const systemPrompt = `${RESEARCH_MIND_PROMPT}

${instructions}

You are continuing an existing multi-paper comparison session. The selected papers are provided below — answer ONLY what the student asks. Do NOT auto-generate Common Themes, Differences, Reading Order, Research Gaps or Project Ideas unless explicitly requested.

--- SELECTED PAPERS ---
${bundle}
--- END PAPERS ---`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(history ?? []).map((m: any) => ({ role: m.role, content: m.content })),
      { role: "user", content: data.question },
    ];

    const answer = await callGemini(messages);

    await supabase.from("comparison_messages").insert([
      { comparison_id: data.comparisonId, user_id: userId, role: "user", content: data.question },
      { comparison_id: data.comparisonId, user_id: userId, role: "assistant", content: answer },
    ]);

    return { answer, intent, size, mode: data.mode };
  });

export const renameComparison = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), title: z.string().min(1).max(200) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("comparisons")
      .update({ title: data.title })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteComparison = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("comparisons").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
