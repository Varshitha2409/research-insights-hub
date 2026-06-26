/**
 * TTSSpeaker — Inline speaker icon attached to an AI response bubble.
 * Shows play/pause/resume/stop controls and a popover for voice & speed selection.
 */

import { useEffect, useRef, useState } from "react";
import { Volume2, Square, Pause, Play } from "lucide-react";
import { useTTS } from "@/hooks/use-tts";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/components/LanguageProvider";

interface TTSSpeakerProps {
  text: string;
}

export function TTSSpeaker({ text }: TTSSpeakerProps) {
  const { lang, t } = useLanguage();
  const { state, voices, selectedVoice, setSelectedVoice, rate, setRate, speak, pause, resume, stop, isSupported } = useTTS();
  const [open, setOpen] = useState(false);
  const hasSpokenRef = useRef(false);

  // suppress unused warning — hasSpokenRef is used for side-effect tracking
  void hasSpokenRef;

  if (!isSupported) return null;

  function handleMain() {
    if (state === "idle") {
      hasSpokenRef.current = true;
      speak(text, lang);
    } else if (state === "playing") {
      pause();
    } else if (state === "paused") {
      resume();
    }
  }

  const Icon = state === "playing" ? Pause : state === "paused" ? Play : Volume2;
  const label = state === "playing" ? t("pause") : state === "paused" ? t("resume") : t("readAloud");

  return (
    <div className="mt-1.5 flex items-center gap-1">
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 text-muted-foreground hover:text-foreground"
        onClick={handleMain}
        title={label}
        aria-label={label}
      >
        <Icon className="h-3.5 w-3.5" />
      </Button>

      {(state === "playing" || state === "paused") && (
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={stop}
          title={t("stop")}
          aria-label={t("stop")}
        >
          <Square className="h-3.5 w-3.5" />
        </Button>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            title={t("voiceSettings")}
            aria-label={t("voiceSettings")}
          >
            <span className="text-[10px] font-semibold leading-none">⚙</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-3 text-sm" side="top" align="start">
          <p className="mb-2 font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t("voiceSettings")}</p>

          {/* Speed slider */}
          <div className="mb-3">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span>{t("speed")}</span>
              <span className="text-muted-foreground">{rate.toFixed(1)}×</span>
            </div>
            <Slider
              min={0.5} max={2} step={0.1}
              value={[rate]}
              onValueChange={([v]) => setRate(v)}
            />
          </div>

          {/* Voice selector */}
          {voices.length > 0 && (
            <div>
              <p className="mb-1 text-xs">{t("voice")}</p>
              <Select
                value={selectedVoice?.name ?? "__auto__"}
                onValueChange={(v) => {
                  if (v === "__auto__") setSelectedVoice(null);
                  else setSelectedVoice(voices.find((x) => x.name === v) ?? null);
                }}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder={t("auto")} />
                </SelectTrigger>
                <SelectContent className="max-h-52">
                  <SelectItem value="__auto__">{t("auto")}</SelectItem>
                  {voices.map((v) => (
                    <SelectItem key={v.name} value={v.name} className="text-xs">
                      {v.name} ({v.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
