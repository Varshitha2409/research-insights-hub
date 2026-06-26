import { useEffect, useState } from "react";
import { GraduationCap, Microscope, ShieldCheck, BookOpen } from "lucide-react";
import { AI_MODES, MODE_DESCRIPTION, MODE_LABEL, type AIMode } from "@/lib/aiBehavior";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useLanguage, type TranslationKey } from "@/components/LanguageProvider";

const ICONS: Record<AIMode, React.ComponentType<{ className?: string }>> = {
  student: GraduationCap,
  researcher: Microscope,
  reviewer: ShieldCheck,
  professor: BookOpen,
};

const STORAGE_KEY = "researchmind:aiMode";

export function useAIMode(): [AIMode, (m: AIMode) => void] {
  const [mode, setMode] = useState<AIMode>("student");
  useEffect(() => {
    const v = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (v && (AI_MODES as readonly string[]).includes(v)) setMode(v as AIMode);
  }, []);
  function update(m: AIMode) {
    setMode(m);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, m);
  }
  return [mode, update];
}

export function ModeSelector({
  mode, onChange, className,
}: { mode: AIMode; onChange: (m: AIMode) => void; className?: string }) {
  const { t } = useLanguage();
  const Icon = ICONS[mode];
  return (
    <div className={className}>
      <Select
        value={mode}
        onValueChange={(v) => {
          const m = v as AIMode;
          if (m !== mode) {
            onChange(m);
            toast.success(`${t("switchedToMode")} ${t(m as TranslationKey)} ${t("mode")}`);
          }
        }}
      >
        <SelectTrigger className="h-10 w-[240px] sm:w-[260px]">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Icon className="h-4 w-4 flex-shrink-0 text-primary" />
            <SelectValue>{t(mode as TranslationKey)} {t("mode")}</SelectValue>
          </span>
        </SelectTrigger>
        <SelectContent className="min-w-[320px]">
          {AI_MODES.map((m) => {
            const I = ICONS[m];
            return (
              <SelectItem key={m} value={m} className="py-2">
                <div className="flex items-start gap-2">
                  <I className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{t(m as TranslationKey)} {t("mode")}</div>
                    <div className="whitespace-normal text-xs text-muted-foreground">
                      {t(`modeDescription_${m}` as TranslationKey)}
                    </div>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

export function ActiveModeBadge({ mode }: { mode: AIMode }) {
  const { t } = useLanguage();
  const Icon = ICONS[mode];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
      <Icon className="h-3.5 w-3.5" />
      {t("currentMode")}: {t(mode as TranslationKey)} {t("mode")}
    </span>
  );
}
