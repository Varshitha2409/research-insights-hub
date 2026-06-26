import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { RESEARCH_MIND_PROMPT } from "@/config/systemPrompt";
import { AI_MODES, buildBehaviorInstructions, buildLanguageInstruction } from "@/lib/aiBehavior";

const Input = z.object({
  paperId: z.string().uuid(),
  question: z.string().min(1).max(4000),
  mode: z.enum(AI_MODES).optional().default("student"),
  /** Full English name of the UI language, e.g. "Hindi", "Kannada", "English" */
  lang: z.string().optional().default("English"),
});

// Direct Gemini API — no Lovable credits needed.
async function callGeminiDirect(messages: { role: string; content: string }[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("AI is not configured. Set GEMINI_API_KEY in your environment.");

  const resp = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: "gemini-2.5-flash", messages }),
    },
  );

  if (!resp.ok) {
    const txt = await resp.text();
    if (resp.status === 429) throw new Error("AI rate limit reached. Try again shortly.");
    if (resp.status === 403) throw new Error("Invalid Gemini API key. Check your GEMINI_API_KEY.");
    throw new Error(`AI error: ${resp.status} ${txt.slice(0, 200)}`);
  }

  const json = (await resp.json()) as { choices: { message: { content: string } }[] };
  return (json.choices?.[0]?.message?.content ?? "").trim();
}

export const askPaper = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: paper, error } = await supabase
      .from("papers")
      .select("id, title, extracted_text")
      .eq("id", data.paperId)
      .maybeSingle();

    if (error || !paper) throw new Error("Paper not found");

    const context_text = (paper.extracted_text ?? "").slice(0, 120_000);

    // Pass the UI language into behavior instructions so the language directive
    // is embedded at the top of the system prompt.
    const { instructions, intent, size } = buildBehaviorInstructions(
      data.question,
      data.mode,
      data.lang,
    );

    // Also build a standalone language reminder appended to the user message,
    // reinforcing the instruction in case the system prompt is deprioritised.
    const langReminder =
      data.lang && data.lang !== "English"
        ? `\n\n[REMINDER: Your entire response MUST be in ${data.lang}. Do not use English except for proper nouns and technical terms that have no ${data.lang} equivalent.]`
        : "";

    const systemPrompt = `${RESEARCH_MIND_PROMPT}

${instructions}`;

    const userMsg = `Paper title: ${paper.title}

--- PAPER TEXT (may be truncated) ---
${context_text}
--- END PAPER ---

Student question: ${data.question}${langReminder}`;

    const answer = await callGeminiDirect([
      { role: "system", content: systemPrompt },
      { role: "user", content: userMsg },
    ]);

    await supabase.from("conversations").insert({
      paper_id: data.paperId,
      user_id: userId,
      question: data.question,
      answer,
    });

    return { answer, suggestions: [] as string[], intent, size, mode: data.mode };
  });
