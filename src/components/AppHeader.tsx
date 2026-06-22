import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Brain, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/upload", label: "Upload" },
  { to: "/compare", label: "Compare" },
  { to: "/insights", label: "Insights" },
  { to: "/settings", label: "Settings" },
] as const;

export function AppHeader() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/20 text-primary">
            <Brain className="h-4 w-4" />
          </span>
          <span>ResearchMind <span className="text-primary">AI</span></span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="hidden rounded-md px-3 py-1.5 text-muted-foreground hover:bg-accent hover:text-foreground md:inline-block"
              activeProps={{ className: "hidden md:inline-block bg-accent text-foreground rounded-md px-3 py-1.5" }}
            >
              {n.label}
            </Link>
          ))}
          {email && <span className="hidden text-xs text-muted-foreground lg:inline">{email}</span>}
          <Button variant="ghost" size="sm" onClick={signOut} className="hidden md:inline-flex">
            <LogOut className="mr-1 h-4 w-4" /> Sign out
          </Button>
          <details className="relative md:hidden">
            <summary className="grid h-9 w-9 cursor-pointer list-none place-items-center rounded-md hover:bg-accent"><Menu className="h-4 w-4" /></summary>
            <div className="absolute right-0 z-40 mt-1 w-44 rounded-lg border border-border bg-popover p-1 shadow-lg">
              {NAV.map((n) => (
                <Link key={n.to} to={n.to} className="block rounded px-3 py-2 text-sm hover:bg-accent">{n.label}</Link>
              ))}
              <button onClick={signOut} className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-accent">Sign out</button>
            </div>
          </details>
        </nav>
      </div>
    </header>
  );
}
