import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, FileText, Sparkles, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ResearchMind AI — Instant research paper insights" },
      { name: "description", content: "Upload a research paper. Get complete insights instantly — summaries, research gaps, viva prep, and more." },
      { property: "og:title", content: "ResearchMind AI" },
      { property: "og:description", content: "Upload a research paper. Get complete insights instantly." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2 font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/20 text-primary">
            <Brain className="h-5 w-5" />
          </span>
          ResearchMind <span className="text-primary">AI</span>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="ghost"><Link to="/auth" search={{ mode: "login" }}>Log in</Link></Button>
          <Button asChild><Link to="/auth" search={{ mode: "signup" }}>Sign up</Link></Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-16 text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Built for BE/BTech students
        </div>
        <h1 className="mx-auto max-w-3xl text-balance text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
          Upload a research paper. <span className="bg-gradient-to-r from-primary to-fuchsia-400 bg-clip-text text-transparent">Get complete insights instantly.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
          Summaries, research gaps, viva prep, PPT outlines and project conversions — all from one PDF.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg"><Link to="/auth" search={{ mode: "signup" }}>Get started free</Link></Button>
          <Button asChild size="lg" variant="outline"><Link to="/auth" search={{ mode: "login" }}>I already have an account</Link></Button>
        </div>

        <div className="mx-auto mt-20 grid max-w-5xl gap-4 sm:grid-cols-3">
          {[
            { icon: FileText, title: "One-click summary", body: "Get the paper's essence — problem, method, results — in seconds." },
            { icon: Brain, title: "Find research gaps", body: "Discover open problems you can turn into your own project." },
            { icon: MessageSquare, title: "Chat & viva prep", body: "Ask anything about the paper and rehearse for viva questions." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-card/60 p-6 text-left">
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
