import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, Mail, LogOut, Trash2, AlertTriangle, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PasswordField } from "@/components/PasswordField";
import { isPasswordValid } from "@/lib/passwordStrength";
import { useLanguage } from "@/components/LanguageProvider";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — ResearchMind AI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [paperCount, setPaperCount] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdBusy, setPwdBusy] = useState(false);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    if (!isPasswordValid(newPwd)) return toast.error(t("passwordDoesNotMeet"));
    if (newPwd !== confirmPwd) return toast.error(t("passwordsDoNotMatch"));
    setPwdBusy(true);
    try {
      // Verify current password by re-authenticating.
      const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password: currentPwd });
      if (signInErr) throw new Error(t("incorrectCurrentPassword"));
      const { error } = await supabase.auth.updateUser({ password: newPwd });
      if (error) throw error;
      toast.success(t("passwordUpdatedSuccess"));
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failedToUpdatePassword"));
    } finally {
      setPwdBusy(false);
    }
  }

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);
      setCreatedAt(data.user?.created_at ?? null);
      const { count } = await supabase.from("papers").select("*", { count: "exact", head: true });
      setPaperCount(count ?? 0);
    })();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  async function clearAllPapers() {
    if (!confirm(t("deleteAllConfirm"))) return;
    setBusy(true);
    const { error } = await supabase.from("papers").delete().not("id", "is", null);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(t("allPapersDeleted"));
    setPaperCount(0);
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-semibold">{t("settingsTitle")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("settingsSubtitle")}</p>

      <section className="mt-8 rounded-2xl border border-border bg-card/60 p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t("account")}</h2>
        <Row icon={Mail} label={t("email")} value={email ?? "—"} />
        <Row icon={User} label={t("memberSince")} value={createdAt ? new Date(createdAt).toLocaleDateString() : "—"} />
        <Row icon={User} label={t("papers")} value={paperCount ?? "—"} />
        <Button variant="outline" className="mt-4" onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" /> {t("signOut")}
        </Button>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card/60 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <KeyRound className="h-4 w-4" /> {t("changePassword")}
        </h2>
        <form onSubmit={changePassword} className="space-y-4">
          <PasswordField id="current-pwd" label={t("currentPassword")} value={currentPwd} onChange={setCurrentPwd} autoComplete="current-password" />
          <PasswordField id="new-pwd" label={t("newPassword")} value={newPwd} onChange={setNewPwd} showMeter autoComplete="new-password" />
          <PasswordField id="confirm-pwd" label={t("confirmPassword")} value={confirmPwd} onChange={setConfirmPwd} autoComplete="new-password" />
          {confirmPwd && newPwd !== confirmPwd && (
            <p className="text-xs text-destructive">{t("passwordsDoNotMatch")}</p>
          )}
          <Button type="submit" disabled={pwdBusy || !currentPwd || !newPwd || !confirmPwd}>
            {pwdBusy ? t("updatingPassword") : t("updatePassword")}
          </Button>
        </form>
      </section>

      <section className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-destructive">
          <AlertTriangle className="h-4 w-4" /> {t("dangerZone")}
        </h2>
        <p className="text-sm text-muted-foreground">{t("dangerZoneBody")}</p>
        <Button variant="destructive" className="mt-4" onClick={clearAllPapers} disabled={busy || paperCount === 0}>
          <Trash2 className="mr-2 h-4 w-4" /> {t("deleteAllPapers")}
        </Button>
      </section>
    </main>
  );
}

function Row({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 py-3 last:border-0">
      <span className="flex items-center gap-2 text-sm text-muted-foreground"><Icon className="h-4 w-4" /> {label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
