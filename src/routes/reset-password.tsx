import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Brain, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { PasswordField } from "@/components/PasswordField";
import { isPasswordValid } from "@/lib/passwordStrength";
import { useLanguage } from "@/components/LanguageProvider";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset Password — ResearchMind AI" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<"checking" | "valid" | "invalid">("checking");

  useEffect(() => {
    // Parse the token from the URL hash/query params that Supabase sends
    // The recovery token comes as #access_token=...&type=recovery OR as ?code=... (PKCE)
    const hash = window.location.hash;
    const params = new URLSearchParams(window.location.search);

    // Handle PKCE flow (code in query string)
    if (params.get("code")) {
      supabase.auth.exchangeCodeForSession(params.get("code")!).then(({ error }) => {
        if (!error) setTokenStatus("valid");
        else setTokenStatus("invalid");
      });
      return;
    }

    // Handle implicit flow (token in hash)
    if (hash.includes("type=recovery") || hash.includes("access_token")) {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) setTokenStatus("valid");
        else setTokenStatus("invalid");
      });
      return;
    }

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setTokenStatus("valid");
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setTokenStatus((s) => (s === "checking" ? "valid" : s));
      else setTimeout(() => setTokenStatus((s) => (s === "checking" ? "invalid" : s)), 2000);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isPasswordValid(pwd)) {
      toast.error(t("passwordRequirements"));
      return;
    }
    if (pwd !== confirm) {
      toast.error(t("passwordsDoNotMatch"));
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pwd });
      if (error) throw error;
      await supabase.auth.signOut();
      toast.success(t("passwordUpdatedSuccess"));
      setDone(true);
      // Auto-redirect to login after 2 seconds
      setTimeout(() => navigate({ to: "/auth", search: { mode: "login" } }), 2000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failedToUpdatePassword"));
    } finally {
      setLoading(false);
    }
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

        {done ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-500/10 text-green-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-semibold">{t("passwordUpdated")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("passwordUpdatedBody")}
            </p>
            <Button className="w-full" onClick={() => navigate({ to: "/auth", search: { mode: "login" } })}>
              {t("goToSignIn")}
            </Button>
          </div>
        ) : tokenStatus === "invalid" ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-semibold">{t("linkExpired")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("linkExpiredBody")}
            </p>
            <Button asChild className="w-full">
              <Link to="/forgot-password">{t("requestNewLink")}</Link>
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold">{t("setNewPassword")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("chooseStrongPassword")}
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <PasswordField id="pwd" label={t("newPassword")} value={pwd} onChange={setPwd} showMeter autoComplete="new-password" />
              <PasswordField id="confirm" label={t("confirmNewPassword")} value={confirm} onChange={setConfirm} autoComplete="new-password" />
              {confirm && pwd !== confirm && (
                <p className="text-xs text-destructive">{t("passwordsDoNotMatch")}</p>
              )}
              <Button type="submit" className="w-full" disabled={loading || tokenStatus !== "valid"}>
                {loading ? t("updatingPassword") : t("changePassword")}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
