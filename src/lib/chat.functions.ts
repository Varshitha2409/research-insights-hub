import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { RESEARCH_MIND_PROMPT } from "@/config/systemPrompt";
import { AI_MODES, buildBehaviorInstructions } from "@/lib/aiBehavior";

const Input = z.object({
  paperId: z.string().uuid(),
  question: z.string().min(1).max(4000),
  mode: z.enum(AI_MODES).optional().default("student"),
});

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

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI is not configured");

    const context_text = (paper.extracted_text ?? "").slice(0, 120_000);
    const { instructions, intent, size } = buildBehaviorInstructions(data.question, data.mode);

    const systemPrompt = `${RESEARCH_MIND_PROMPT}

${instructions}`;

    const userMsg = `Paper title: ${paper.title}

--- PAPER TEXT (may be truncated) ---
${context_text}
--- END PAPER ---

Student question: ${data.question}`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMsg },
        ],
      }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      if (resp.status === 429) throw new Error("AI rate limit reached. Try again shortly.");
      if (resp.status === 402) throw new Error("AI credits exhausted. Please add credits in Lovable.");
      throw new Error(`AI error: ${resp.status} ${txt.slice(0, 200)}`);
    }

    const json = (await resp.json()) as { choices: { message: { content: string } }[] };
    const answer = (json.choices?.[0]?.message?.content ?? "").trim();

    await supabase.from("conversations").insert({
      paper_id: data.paperId,
      user_id: userId,
      question: data.question,
      answer,
    });

    return { answer, suggestions: [] as string[], intent, size, mode: data.mode };
  });
