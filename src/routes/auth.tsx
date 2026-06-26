import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Brain } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";

const search = z.object({ mode: z.enum(["login", "signup"]).catch("login") });

export const Route = createFileRoute("/auth")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "Sign in — ResearchMind AI" }] }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + "/auth?mode=login" },
        });
        if (error) throw error;
        toast.success(t("accountCreated"));
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("authFailed"));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/dashboard" },
    });
    if (error) { toast.error(error.message ?? t("googleFailed")); setLoading(false); }
    // On success, Supabase redirects the browser — no further action needed.
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card/70 p-8 shadow-xl backdrop-blur">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/20 text-primary">
            <Brain className="h-4 w-4" />
          </span>
          ResearchMind <span className="text-primary">AI</span>
        </Link>
        <h1 className="text-2xl font-semibold">{mode === "signup" ? t("createAccount") : t("welcomeBack")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signup" ? t("signUpSubtitle") : t("signInSubtitle")}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">{t("email")}</Label>
            <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t("password")}</Label>
              {mode === "login" && (
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  {t("forgotPassword")}
                </Link>
              )}
            </div>
            <Input id="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("pleaseWait") : mode === "signup" ? t("createAccount") : t("signIn")}
          </Button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> {t("orSeparator")} <div className="h-px flex-1 bg-border" />
        </div>

        <Button type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
          {t("continueWithGoogle")}
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signup" ? (
            <>{t("alreadyHaveAccount")} <Link to="/auth" search={{ mode: "login" }} className="text-primary hover:underline">{t("signIn")}</Link></>
          ) : (
            <>{t("newHere")} <Link to="/auth" search={{ mode: "signup" }} className="text-primary hover:underline">{t("createAccount")}</Link></>
          )}
        </p>
      </div>
    </div>
  );
}
