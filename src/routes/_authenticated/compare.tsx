import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  GitCompare, Loader2, Sparkles, Plus, Search, Pencil, Trash2, Send, MessageSquare,
  Mic, MicOff,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import {
  createComparison, askComparison, renameComparison, deleteComparison,
} from "@/lib/compare.functions";
import { ModeSelector, ActiveModeBadge, useAIMode } from "@/components/ModeSelector";
import { toast } from "sonner";
import { TTSSpeaker } from "@/components/TTSSpeaker";
import { useVoiceInput } from "@/hooks/use-voice-input";
import { useLanguage } from "@/components/LanguageProvider";

export const Route = createFileRoute("/_authenticated/compare")({
  head: () => ({ meta: [{ title: "Compare papers — ResearchMind AI" }] }),
  component: ComparePage,
});

type Paper = { id: string; title: string };
type Comparison = { id: string; title: string; updated_at: string };
type Msg = { role: "user" | "assistant"; content: string };

function ComparePage() {
  const createFn = useServerFn(createComparison);
  const askFn = useServerFn(askComparison);
  const renameFn = useServerFn(renameComparison);
  const deleteFn = useServerFn(deleteComparison);
  const { t, bcp47 } = useLanguage();

  const [papers, setPapers] = useState<Paper[]>([]);
  const [history, setHistory] = useState<Comparison[]>([]);
  const [search, setSearch] = useState("");

  // New comparison form
  const [showNew, setShowNew] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [focus, setFocus] = useState("");
  const [creating, setCreating] = useState(false);

  // Active comparison
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useAIMode();

  const voice = useVoiceInput({
    lang: bcp47,
    onTranscript: (txt) => setInput((prev) => prev ? prev + " " + txt : txt),
  });

  async function loadPapers() {
    const { data } = await supabase
      .from("papers").select("id, title").order("uploaded_at", { ascending: false });
    setPapers(data ?? []);
  }
  async function loadHistory() {
    const { data } = await supabase
      .from("comparisons").select("id, title, updated_at").order("updated_at", { ascending: false });
    setHistory(data ?? []);
  }
  useEffect(() => { loadPapers(); loadHistory(); }, []);

  async function openComparison(id: string) {
    setActiveId(id);
    setShowNew(false);
    const { data } = await supabase
      .from("comparison_messages")
      .select("role, content")
      .eq("comparison_id", id)
      .order("created_at", { ascending: true });
    setMessages((data ?? []) as Msg[]);
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  function toggleSelected(id: string) {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    if (next.size > 5) return toast.error("Pick up to 5 papers");
    setSelected(next);
  }

  async function startNew() {
    if (selected.size < 2) return toast.error("Select at least 2 papers");
    setCreating(true);
    try {
      const res = await createFn({
        data: { paperIds: Array.from(selected), focus: focus || undefined, mode },
      });
      toast.success("Comparison created");
      setSelected(new Set()); setFocus(""); setShowNew(false);
      await loadHistory();
      await openComparison(res.id);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Comparison failed");
    } finally { setCreating(false); }
  }

  async function send() {
    if (!activeId || !input.trim() || sending) return;
    const q = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content: q }]);
    setSending(true);
    try {
      const res = await askFn({ data: { comparisonId: activeId, question: q, mode } });
      setMessages((m) => [...m, { role: "assistant", content: res.answer }]);
      loadHistory();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "AI request failed");
      setMessages((m) => m.slice(0, -1));
    } finally { setSending(false); }
  }

  async function rename(c: Comparison) {
    const title = window.prompt("Rename comparison", c.title);
    if (!title || title === c.title) return;
    try {
      await renameFn({ data: { id: c.id, title } });
      await loadHistory();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Rename failed"); }
  }
  async function remove(c: Comparison) {
    if (!window.confirm(`Delete "${c.title}"? This can't be undone.`)) return;
    try {
      await deleteFn({ data: { id: c.id } });
      if (activeId === c.id) { setActiveId(null); setMessages([]); }
      await loadHistory();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Delete failed"); }
  }

  const filtered = history.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-[1400px] gap-3 px-3 py-3">
      {/* Sidebar: history */}
      <aside className="hidden w-72 flex-shrink-0 flex-col rounded-2xl border border-border bg-sidebar p-3 md:flex">
        <Button
          className="mb-3"
          onClick={() => { setShowNew(true); setActiveId(null); setMessages([]); }}
        >
          <Plus className="mr-2 h-4 w-4" /> {t("newComparison")}
        </Button>
        <div className="relative mb-2">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchHistory")} className="h-9 pl-7"
          />
        </div>
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("history")}</div>
        <div className="mt-2 flex-1 space-y-1 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="px-1 py-4 text-xs text-muted-foreground">{t("noComparisons")}</p>
          )}
          {filtered.map((c) => (
            <div
              key={c.id}
              className={`group flex items-start gap-1 rounded-lg px-2 py-2 text-sm ${
                activeId === c.id ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/60"
              }`}
            >
              <button
                onClick={() => openComparison(c.id)}
                className="flex min-w-0 flex-1 items-start gap-2 text-left"
              >
                <MessageSquare className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                <span className="line-clamp-2 break-words">{c.title}</span>
              </button>
              <div className="flex flex-shrink-0 opacity-0 transition group-hover:opacity-100">
                <button
                  onClick={() => rename(c)} aria-label="Rename"
                  className="rounded p-1 hover:bg-background/60"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => remove(c)} aria-label="Delete"
                  className="rounded p-1 text-destructive hover:bg-background/60"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main panel */}
      <section className="flex min-w-0 flex-1 flex-col rounded-2xl border border-border bg-card/40">
        {/* New comparison form */}
        {(showNew || (!activeId && history.length === 0)) && (
          <div className="overflow-y-auto p-5">
            <h1 className="flex items-center gap-2 text-2xl font-semibold">
              <GitCompare className="h-6 w-6 text-primary" /> New comparison
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Pick 2–5 papers. We'll save it so you can continue the chat later.</p>
            <div className="mt-4 rounded-xl border border-border bg-card/60 p-3">
              {papers.length === 0 ? (
                <p className="p-3 text-sm text-muted-foreground">Upload some papers first.</p>
              ) : (
                <ul className="grid gap-2">
                  {papers.map((p) => (
                    <li key={p.id}>
                      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card/60 p-3 hover:border-primary/60">
                        <Checkbox
                          checked={selected.has(p.id)}
                          onCheckedChange={() => toggleSelected(p.id)}
                          className="mt-0.5"
                        />
                        <span className="text-sm">{p.title}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Input
                value={focus} onChange={(e) => setFocus(e.target.value)}
                placeholder="Optional focus (e.g. 'datasets', 'accuracy')"
              />
              <Button onClick={startNew} disabled={creating || selected.size < 2}>
                {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Compare {selected.size > 0 ? `(${selected.size})` : ""}
              </Button>
            </div>
          </div>
        )}

        {/* Active comparison chat */}
        {activeId && !showNew && (
          <>
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-foreground"
                  }`}>
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                        <TTSSpeaker text={m.content} />
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    )}
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
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="border-t border-border p-3"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <ActiveModeBadge mode={mode} />
                <ModeSelector mode={mode} onChange={setMode} />
              </div>

              <div className="flex items-end gap-2">
                <Button type="button" size="icon"
                  variant={voice.state === "listening" ? "default" : "outline"}
                  className={`h-11 w-11 flex-shrink-0 ${voice.state === "listening" ? "animate-pulse" : ""}`}
                  onClick={voice.toggle}
                  disabled={voice.state === "unsupported"}
                  title={voice.state === "listening" ? "Listening… click to stop" : "Voice input"}>
                  {voice.state === "listening" ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Textarea
                  value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder="Ask a follow-up about these papers... (e.g. 'Which dataset is better?')"
                  rows={1} className="max-h-40 min-h-[44px] resize-none" disabled={sending}
                />
                <Button type="submit" disabled={sending || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </>
        )}

        {/* Empty state when history exists but nothing selected */}
        {!activeId && !showNew && history.length > 0 && (
          <div className="flex flex-1 items-center justify-center p-10 text-center">
            <div>
              <Sparkles className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">Open a comparison from the sidebar, or start a new one.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
