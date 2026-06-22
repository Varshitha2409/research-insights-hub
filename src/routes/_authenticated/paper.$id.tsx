import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  FileText, Send, Loader2, Sparkles, ListChecks, Lightbulb,
  GraduationCap, Presentation, Rocket,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { askPaper } from "@/lib/chat.functions";
import { ModeSelector, ActiveModeBadge, useAIMode } from "@/components/ModeSelector";
import { toast } from "sonner";


type Paper = { id: string; title: string; uploaded_at: string };
type Msg = { role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/_authenticated/paper/$id")({
  head: () => ({ meta: [{ title: "Paper — ResearchMind AI" }] }),
  component: Workspace,
});

const QUICK_ACTIONS = [
  { label: "Summary", icon: ListChecks, prompt: "Give me a complete structured summary of this paper (problem, methodology, key results, limitations, conclusion)." },
  { label: "Gaps", icon: Lightbulb, prompt: "List the research gaps and open problems in this paper that a BE/BTech student could explore." },
  { label: "Viva Prep", icon: GraduationCap, prompt: "Prepare me for a viva on this paper. Give 10 likely questions with concise, confident answers." },
  { label: "PPT", icon: Presentation, prompt: "Draft a 10-slide PPT outline (slide title + 3-5 bullet points each) covering this paper for a class presentation." },
  { label: "Project Converter", icon: Rocket, prompt: "Convert the ideas in this paper into a concrete BE/BTech final-year project plan: problem statement, modules, tech stack, datasets, milestones, and novelty." },
];

function Workspace() {
  const { id } = Route.useParams();
  const ask = useServerFn(askPaper);

  const [paper, setPaper] = useState<Paper | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useAIMode();


  useEffect(() => {
    (async () => {
      const { data: p } = await supabase.from("papers").select("id, title, uploaded_at").eq("id", id).maybeSingle();
      setPaper(p);
      const { data: convs } = await supabase
        .from("conversations").select("question, answer")
        .eq("paper_id", id).order("created_at", { ascending: true });
      const initial: Msg[] = [];
      (convs ?? []).forEach((c) => {
        initial.push({ role: "user", content: c.question });
        initial.push({ role: "assistant", content: c.answer });
      });
      setMessages(initial);
    })();
  }, [id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function send(question: string) {
    if (!question.trim() || sending) return;
    setSending(true);
    setMessages((m) => [...m, { role: "user", content: question }]);
    setInput("");
    try {
      const res = await ask({ data: { paperId: id, question, mode } });
      setMessages((m) => [...m, { role: "assistant", content: res.answer }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "AI request failed");
      setMessages((m) => m.slice(0, -1));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-[1400px] gap-3 px-3 py-3">
      {/* Left sidebar */}
      <aside className="hidden w-64 flex-shrink-0 flex-col rounded-2xl border border-border bg-sidebar p-4 lg:flex">
        <Link to="/dashboard" className="mb-3 text-xs text-muted-foreground hover:text-foreground">← Back to dashboard</Link>
        <div className="flex items-start gap-2">
          <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
            <FileText className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <div className="line-clamp-3 text-sm font-semibold">{paper?.title ?? "Loading..."}</div>
            <div className="mt-1 text-xs text-muted-foreground">{paper && new Date(paper.uploaded_at).toLocaleDateString()}</div>
          </div>
        </div>
        <div className="mt-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">Quick actions</div>
        <div className="mt-2 grid gap-1.5">
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a.label}
              onClick={() => send(a.prompt)}
              disabled={sending || !paper}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent disabled:opacity-50"
            >
              <a.icon className="h-4 w-4 text-primary" /> {a.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Center chat */}
      <section className="flex min-w-0 flex-1 flex-col rounded-2xl border border-border bg-card/40">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.length === 0 && !sending && (
            <div className="mx-auto mt-10 max-w-md text-center">
              <Sparkles className="mx-auto h-8 w-8 text-primary" />
              <h2 className="mt-3 text-lg font-semibold">Ask anything about this paper</h2>
              <p className="mt-1 text-sm text-muted-foreground">Try a quick action on the left, or type a question below.</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground"
              }`}>
                {m.role === "assistant"
                  ? <div className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"><ReactMarkdown>{m.content}</ReactMarkdown></div>
                  : <div className="whitespace-pre-wrap">{m.content}</div>}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
              </div>
            </div>
          )}
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="border-t border-border p-3"
        >
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <ActiveModeBadge mode={mode} />
            <ModeSelector mode={mode} onChange={setMode} />
          </div>

          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder="Ask anything about this paper..."
              rows={1}
              className="max-h-40 min-h-[44px] resize-none"
              disabled={sending || !paper}
            />
            <Button type="submit" disabled={sending || !input.trim() || !paper}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
