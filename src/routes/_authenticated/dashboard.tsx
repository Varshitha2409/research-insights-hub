import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Plus, Trash2, BarChart2, BookOpen, MessageSquare, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";
import { useLanguage } from "@/components/LanguageProvider";

type Paper = { id: string; title: string; uploaded_at: string };
type Stats = { papers: number; questions: number; comparisons: number };

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — ResearchMind AI" }] }),
  component: Dashboard,
});

function Dashboard() {
  const [papers, setPapers] = useState<Paper[] | null>(null);
  const [stats, setStats] = useState<Stats>({ papers: 0, questions: 0, comparisons: 0 });
  const [chartData, setChartData] = useState<{ date: string; uploads: number }[]>([]);
  const { t } = useLanguage();

  async function load() {
    const { data, error } = await supabase
      .from("papers").select("id, title, uploaded_at")
      .order("uploaded_at", { ascending: false });
    if (error) { toast.error(error.message); return; }
    setPapers(data ?? []);

    // Stats
    const [{ count: qCount }, { count: cCount }] = await Promise.all([
      supabase.from("conversations").select("*", { count: "exact", head: true }),
      supabase.from("comparisons").select("*", { count: "exact", head: true }),
    ]);
    setStats({ papers: (data ?? []).length, questions: qCount ?? 0, comparisons: cCount ?? 0 });

    // Chart: uploads per day (last 7 days)
    const last7: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      last7[d.toLocaleDateString("en", { month:"short", day:"numeric" })] = 0;
    }
    (data ?? []).forEach((p) => {
      const k = new Date(p.uploaded_at).toLocaleDateString("en", { month:"short", day:"numeric" });
      if (k in last7) last7[k]++;
    });
    setChartData(Object.entries(last7).map(([date, uploads]) => ({ date, uploads })));
  }

  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm("Delete this paper and all its conversations?")) return;
    const { error } = await supabase.from("papers").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setPapers((p) => p?.filter((x) => x.id !== id) ?? null);
    setStats((s) => ({ ...s, papers: Math.max(0, s.papers - 1) }));
  }

  const STAT_CARDS = [
    { label: t("papersUploaded"), value: stats.papers,    icon: BookOpen,      color: "#818cf8" },
    { label: t("questionsAsked"), value: stats.questions,  icon: MessageSquare, color: "#34d399" },
    { label: "Comparisons",       value: stats.comparisons, icon: BarChart2,    color: "#f59e0b" },
    { label: t("avgPerPaper"),    value: stats.papers ? (stats.questions/stats.papers).toFixed(1) : "—",
      icon: TrendingUp, color: "#60a5fa" },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-border bg-card/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
              <Icon className="h-4 w-4" style={{ color }} />
            </div>
            <div className="mt-2 text-3xl font-bold" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Upload activity chart */}
      <div className="mb-6 rounded-2xl border border-border bg-card/60 p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Uploads — Last 7 days
        </h2>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 8%)" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "oklch(0.72 0.02 260)" }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "oklch(0.72 0.02 260)" }} />
            <Tooltip
              contentStyle={{ background: "oklch(0.22 0.04 270)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 8 }}
              labelStyle={{ color: "oklch(0.98 0.005 250)" }}
              itemStyle={{ color: "#818cf8" }}
            />
            <Bar dataKey="uploads" radius={[4,4,0,0]}>
              {chartData.map((_, i) => <Cell key={i} fill="#818cf8" fillOpacity={0.8} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Papers list */}
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t("yourPapers")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Open a paper to chat, summarise, or prep for viva.</p>
        </div>
        <Button asChild>
          <Link to="/upload"><Plus className="mr-1 h-4 w-4" /> {t("uploadPaper")}</Link>
        </Button>
      </div>

      {papers === null ? (
        <div className="grid gap-3">
          {[0,1,2].map(i => <div key={i} className="h-20 animate-pulse rounded-xl border border-border bg-card/40" />)}
        </div>
      ) : papers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 font-semibold">{t("noPapersYet")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">Upload your first research paper to get started.</p>
          <Button asChild className="mt-6"><Link to="/upload">{t("uploadPaper")}</Link></Button>
        </div>
      ) : (
        <ul className="grid gap-3">
          {papers.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-4 transition hover:border-primary/60">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                  <FileText className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <div className="truncate font-medium">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{t("uploadedOn")} {new Date(p.uploaded_at).toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild size="sm"><Link to="/paper/$id" params={{ id: p.id }}>{t("open")}</Link></Button>
                <Button size="sm" variant="ghost" onClick={() => remove(p.id)} aria-label={t("delete")}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
