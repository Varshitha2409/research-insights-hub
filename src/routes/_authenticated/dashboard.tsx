import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Paper = { id: string; title: string; uploaded_at: string };

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — ResearchMind AI" }] }),
  component: Dashboard,
});

function Dashboard() {
  const [papers, setPapers] = useState<Paper[] | null>(null);

  async function load() {
    const { data, error } = await supabase
      .from("papers")
      .select("id, title, uploaded_at")
      .order("uploaded_at", { ascending: false });
    if (error) { toast.error(error.message); return; }
    setPapers(data ?? []);
  }
  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm("Delete this paper and all its conversations?")) return;
    const { error } = await supabase.from("papers").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setPapers((p) => p?.filter((x) => x.id !== id) ?? null);
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Your papers</h1>
          <p className="mt-1 text-sm text-muted-foreground">Open a paper to chat, summarise, or prep for viva.</p>
        </div>
        <Button asChild><Link to="/upload"><Plus className="mr-1 h-4 w-4" /> Upload paper</Link></Button>
      </div>

      {papers === null ? (
        <div className="grid gap-3">
          {[0,1,2].map(i => <div key={i} className="h-20 animate-pulse rounded-xl border border-border bg-card/40" />)}
        </div>
      ) : papers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 font-semibold">No papers yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">Upload your first research paper to get started.</p>
          <Button asChild className="mt-6"><Link to="/upload">Upload paper</Link></Button>
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
                  <div className="text-xs text-muted-foreground">Uploaded {new Date(p.uploaded_at).toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild size="sm"><Link to="/paper/$id" params={{ id: p.id }}>Open</Link></Button>
                <Button size="sm" variant="ghost" onClick={() => remove(p.id)} aria-label="Delete">
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
