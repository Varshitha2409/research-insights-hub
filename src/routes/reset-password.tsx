import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Brain, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { PasswordField } from "@/components/PasswordField";
import { isPasswordValid } from "@/lib/passwordStrength";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset Password — ResearchMind AI" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<"checking" | "valid" | "invalid">("checking");

  useEffect(() => {
    // Supabase puts the recovery token in the URL hash and auto-creates a session via onAuthStateChange.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setTokenStatus("valid");
    });
    // Fallback: if a session already exists from the recovery link, allow reset.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setTokenStatus((s) => (s === "checking" ? "valid" : s));
      else {
        setTimeout(() => setTokenStatus((s) => (s === "checking" ? "invalid" : s)), 1500);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isPasswordValid(pwd)) {
      toast.error("Password does not meet all requirements");
      return;
    }
    if (pwd !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pwd });
      if (error) throw error;
      // Invalidate other sessions (sign out local; user must log in again).
      await supabase.auth.signOut();
      setDone(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update password");
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
            <h1 className="text-2xl font-semibold">Password updated</h1>
            <p className="text-sm text-muted-foreground">
              Your password has been changed. Please sign in again with your new password.
            </p>
            <Button className="w-full" onClick={() => navigate({ to: "/auth", search: { mode: "login" } })}>
              Go to sign in
            </Button>
          </div>
        ) : tokenStatus === "invalid" ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-semibold">Link expired or invalid</h1>
            <p className="text-sm text-muted-foreground">
              This password reset link has expired or already been used. Please request a new one.
            </p>
            <Button asChild className="w-full">
              <Link to="/forgot-password">Request a new link</Link>
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold">Set a new password</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose a strong password you haven't used before.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <PasswordField id="pwd" label="New password" value={pwd} onChange={setPwd} showMeter autoComplete="new-password" />
              <PasswordField id="confirm" label="Confirm new password" value={confirm} onChange={setConfirm} autoComplete="new-password" />
              {confirm && pwd !== confirm && (
                <p className="text-xs text-destructive">Passwords do not match.</p>
              )}
              <Button type="submit" className="w-full" disabled={loading || tokenStatus !== "valid"}>
                {loading ? "Updating password..." : "Change password"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
