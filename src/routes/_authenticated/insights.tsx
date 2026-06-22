import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, MessageSquare, Sparkles, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/insights")({
  head: () => ({ meta: [{ title: "Insights — ResearchMind AI" }] }),
  component: InsightsPage,
});

type Stats = {
  papers: number;
  questions: number;
  recentPapers: { id: string; title: string; uploaded_at: string }[];
  recentQs: { question: string; created_at: string; paper_id: string }[];
};

function InsightsPage() {
  const [s, setS] = useState<Stats | null>(null);

  useEffect(() => {
    (async () => {
      const [{ count: papers }, { count: questions }, recentPapers, recentQs] =
        await Promise.all([
          supabase.from("papers").select("*", { count: "exact", head: true }),
          supabase.from("conversations").select("*", { count: "exact", head: true }),
          supabase.from("papers").select("id, title, uploaded_at").order("uploaded_at", { ascending: false }).limit(5),
          supabase.from("conversations").select("question, created_at, paper_id").order("created_at", { ascending: false }).limit(5),
        ]);
      setS({
        papers: papers ?? 0,
        questions: questions ?? 0,
        recentPapers: recentPapers.data ?? [],
        recentQs: recentQs.data ?? [],
      });
    })();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Insights</h1>
      <p className="mt-1 text-sm text-muted-foreground">Your research activity at a glance.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={FileText} label="Papers uploaded" value={s?.papers ?? "—"} />
        <StatCard icon={MessageSquare} label="Questions asked" value={s?.questions ?? "—"} />
        <StatCard icon={TrendingUp} label="Avg Qs / paper" value={s && s.papers ? (s.questions / s.papers).toFixed(1) : "—"} />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Panel title="Recent papers">
          {s?.recentPapers.length === 0 ? (
            <Empty text="Upload a paper to get started." />
          ) : (
            <ul className="space-y-2">
              {s?.recentPapers.map((p) => (
                <li key={p.id}>
                  <Link to="/paper/$id" params={{ id: p.id }} className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card/50 p-3 hover:border-primary/60">
                    <span className="line-clamp-2 text-sm">{p.title}</span>
                    <span className="flex-shrink-0 text-xs text-muted-foreground">{new Date(p.uploaded_at).toLocaleDateString()}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Recent questions">
          {s?.recentQs.length === 0 ? (
            <Empty text="Ask your first AI question on a paper." />
          ) : (
            <ul className="space-y-2">
              {s?.recentQs.map((q, i) => (
                <li key={i}>
                  <Link to="/paper/$id" params={{ id: q.paper_id }} className="block rounded-lg border border-border bg-card/50 p-3 hover:border-primary/60">
                    <div className="line-clamp-2 text-sm"><Sparkles className="mr-1 inline h-3 w-3 text-primary" />{q.question}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{new Date(q.created_at).toLocaleString()}</div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </main>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-sm text-muted-foreground">{text}</p>;
}
