/**
 * useTTS — Browser Text-to-Speech hook using the Web Speech API.
 * Supports play / pause / resume / stop and voice / speed selection.
 */

import { useCallback, useEffect, useRef, useState } from "react";

export type TTSState = "idle" | "playing" | "paused" | "unsupported";

export function useTTS() {
  const [state, setState] = useState<TTSState>("idle");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(1);
  const uttRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  // Load available voices (async in some browsers)
  useEffect(() => {
    if (!isSupported) { setState("unsupported"); return; }
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) setVoices(v);
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, [isSupported]);

  const speak = useCallback(
    (text: string, lang?: string) => {
      if (!isSupported) return;
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.rate = rate;
      if (selectedVoice) utt.voice = selectedVoice;
      else if (lang) {
        const match = voices.find((v) => v.lang.startsWith(lang));
        if (match) utt.voice = match;
      }
      utt.onstart = () => setState("playing");
      utt.onpause = () => setState("paused");
      utt.onresume = () => setState("playing");
      utt.onend = () => setState("idle");
      utt.onerror = () => setState("idle");
      uttRef.current = utt;
      window.speechSynthesis.speak(utt);
    },
    [isSupported, rate, selectedVoice, voices],
  );

  const pause = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.pause();
    setState("paused");
  }, [isSupported]);

  const resume = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.resume();
    setState("playing");
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setState("idle");
  }, [isSupported]);

  useEffect(() => () => { window.speechSynthesis?.cancel(); }, []);

  return {
    state,
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    speak,
    pause,
    resume,
    stop,
    isSupported,
  };
}
