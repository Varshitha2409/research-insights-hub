/**
 * useVoiceInput — Browser Speech Recognition hook.
 * Works with Web Speech API (Chrome, Edge, Safari 17+).
 * Supports any language/locale the browser supports.
 */

import { useCallback, useEffect, useRef, useState } from "react";

export type VoiceInputState = "idle" | "listening" | "unsupported";

interface UseVoiceInputOptions {
  /** BCP-47 language tag, e.g. "en-US", "kn-IN", "hi-IN". Default: "en-US" */
  lang?: string;
  /** Called whenever a transcript segment is finalised */
  onTranscript: (text: string) => void;
}

export function useVoiceInput({ lang = "en-US", onTranscript }: UseVoiceInputOptions) {
  const [state, setState] = useState<VoiceInputState>("idle");
  const recRef = useRef<SpeechRecognition | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  useEffect(() => {
    if (!isSupported) setState("unsupported");
  }, [isSupported]);

  const start = useCallback(() => {
    if (!isSupported) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    const rec: SpeechRecognition = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = lang;

    rec.onresult = (e: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) transcript += e.results[i][0].transcript;
      }
      if (transcript) onTranscript(transcript);
    };

    rec.onerror = () => setState("idle");
    rec.onend = () => setState("idle");

    recRef.current = rec;
    rec.start();
    setState("listening");
  }, [isSupported, lang, onTranscript]);

  const stop = useCallback(() => {
    recRef.current?.stop();
    recRef.current = null;
    setState("idle");
  }, []);

  const toggle = useCallback(() => {
    if (state === "listening") stop();
    else start();
  }, [state, start, stop]);

  useEffect(() => () => { recRef.current?.stop(); }, []);

  return { state, toggle, start, stop, isSupported };
}
