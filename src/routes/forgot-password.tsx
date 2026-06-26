import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Brain, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot Password — ResearchMind AI" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password",
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failedToSend"));
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

        {sent ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-500/10 text-green-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-semibold">{t("checkYourEmail")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("checkEmailBody")}
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/auth" search={{ mode: "login" }}>
                <ArrowLeft className="mr-2 h-4 w-4" /> {t("backToSignIn")}
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold">{t("forgotYourPassword")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("forgotSubtitle")}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">{t("email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    placeholder={t("emailPlaceholder")}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("sendingLink") : t("sendResetLink")}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {t("rememberedIt")}{" "}
              <Link to="/auth" search={{ mode: "login" }} className="text-primary hover:underline">
                {t("backToSignIn")}
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
