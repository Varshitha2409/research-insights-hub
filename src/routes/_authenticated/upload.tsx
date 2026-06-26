import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { extractPdfText } from "@/lib/pdf-extract";
import { toast } from "sonner";
import { useLanguage } from "@/components/LanguageProvider";

export const Route = createFileRoute("/_authenticated/upload")({
  head: () => ({ meta: [{ title: "Upload paper — ResearchMind AI" }] }),
  component: UploadPage,
});

function UploadPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState("");

  async function handleFile(file: File) {
    if (file.type !== "application/pdf") return toast.error(t("notPdf"));
    if (file.size > 25 * 1024 * 1024) return toast.error(t("tooLarge"));

    setBusy(true);
    try {
      setStage(t("extractingText"));
      const text = await extractPdfText(file);
      if (!text.trim()) throw new Error(t("noTextExtracted"));

      setStage(t("uploadingFile"));
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error(t("notSignedIn"));
      const path = `${u.user.id}/${crypto.randomUUID()}-${file.name}`;
      const up = await supabase.storage.from("papers").upload(path, file, { contentType: "application/pdf" });
      if (up.error) throw up.error;

      setStage(t("savingPaper"));
      const title = file.name.replace(/\.pdf$/i, "");
      const { data: inserted, error } = await supabase
        .from("papers")
        .insert({ user_id: u.user.id, title, file_url: up.data.path, extracted_text: text })
        .select("id")
        .single();
      if (error) throw error;

      toast.success(t("paperUploaded"));
      navigate({ to: "/paper/$id", params: { id: inserted.id } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("uploadFailed"));
    } finally {
      setBusy(false); setStage("");
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold">{t("uploadPageTitle")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("uploadPageSubtitle")}</p>

      <label
        htmlFor="rm-file-input"
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault(); setDragOver(false);
          const f = e.dataTransfer.files?.[0]; if (f) handleFile(f);
        }}
        className={`mt-8 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center transition ${
          dragOver ? "border-primary bg-primary/5" : "border-border bg-card/40 hover:border-primary/50"
        } ${busy ? "pointer-events-none opacity-70" : ""}`}
      >
        {busy ? (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 font-medium">{stage}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("dontCloseTab")}</p>
          </>
        ) : (
          <>
            <UploadCloud className="h-10 w-10 text-primary" />
            <p className="mt-4 font-medium">{t("dragDrop")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("orClickBrowse")}</p>
            <span className="mt-6 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
              {t("chooseFile")}
            </span>
          </>
        )}
        <input
          ref={inputRef}
          id="rm-file-input"
          type="file" accept="application/pdf,.pdf" className="sr-only"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
        />
      </label>
    </main>
  );
}
