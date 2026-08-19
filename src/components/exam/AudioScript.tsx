"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ListeningScript } from "@/lib/exam/types";
import { Bar } from "@/components/ui";

/**
 * Plays a Listening script with the browser's speech synthesis, giving each speaker
 * a different English voice so a two-person conversation is followable.
 *
 * Why synthesis rather than audio files: a static site with no backend cannot ship
 * an hour of recordings without dominating the bundle, and a generated voice is
 * available offline and in any browser. The trade-off is honest — synthesis is
 * clearer than an exam recording, so this trains the question types, note-taking
 * and pacing rather than accent discrimination.
 */

interface Labels {
  play: string;
  replay: string;
  stop: string;
  speaking: string;
  note: string;
}

export function AudioScript({
  scripts, labels, autoPlay,
}: {
  scripts: ListeningScript[];
  labels: Labels;
  autoPlay?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(false);
  const [turn, setTurn] = useState(0);
  const [supported, setSupported] = useState(true);
  const voices = useRef<SpeechSynthesisVoice[]>([]);
  const cancelled = useRef(false);

  const flat = scripts.flatMap((s) =>
    s.turns.map((t) => ({ ...t, scriptTitle: s.title, setting: s.setting }))
  );

  useEffect(() => {
    // Feature detection has to happen after hydration: the page is prerendered, so
    // reading `window` during render would make the server and client disagree.
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSupported(false);
      return;
    }
    const load = () => {
      voices.current = window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith("en"));
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", load);
      window.speechSynthesis.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    cancelled.current = true;
    window.speechSynthesis.cancel();
    setPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (!supported) return;
    cancelled.current = false;
    window.speechSynthesis.cancel();
    setPlaying(true);
    setPlayed(true);
    setTurn(0);

    // Chrome drops queued utterances that were created before the voice list
    // resolved, so the queue is built at press time rather than up front.
    const list = voices.current;
    const pickVoice = (v?: "a" | "b" | "c") => {
      if (list.length === 0) return undefined;
      const i = v === "b" ? 1 : v === "c" ? 2 : 0;
      return list[Math.min(i, list.length - 1)];
    };

    flat.forEach((t, i) => {
      const u = new SpeechSynthesisUtterance(t.text);
      const voice = pickVoice(t.voice);
      if (voice) u.voice = voice;
      u.lang = voice?.lang ?? "en-GB";
      u.rate = 0.95;
      u.pitch = t.voice === "b" ? 1.1 : t.voice === "c" ? 0.92 : 1;
      u.onstart = () => {
        if (!cancelled.current) setTurn(i);
      };
      if (i === flat.length - 1) {
        u.onend = () => {
          if (!cancelled.current) setPlaying(false);
        };
      }
      window.speechSynthesis.speak(u);
    });
  }, [flat, supported]);

  // Starting playback is a command to an external system (the synthesis queue);
  // the state it sets mirrors that system rather than deriving render state.
  // `played` guards it to once per set and is deliberately not a dependency.
  useEffect(() => {
    if (!autoPlay || !supported || played) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, supported]);

  if (!supported) {
    return (
      <div className="rounded-2xl border border-amber/40 bg-amber/8 px-4 py-3">
        <p className="text-[13px] leading-relaxed text-mute">{labels.note}</p>
        <div className="mt-3 flex flex-col gap-2">
          {flat.map((t, i) => (
            <p key={i} className="text-[13.5px] leading-relaxed">
              <span className="font-bold text-brand">{t.speaker}: </span>
              <span className="text-mute">{t.text}</span>
            </p>
          ))}
        </div>
      </div>
    );
  }

  const current = flat[turn];

  return (
    <div className="rounded-2xl border border-line bg-card px-4 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={playing ? stop : play}
          className="press grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand text-ink"
          aria-label={playing ? labels.stop : labels.play}
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <rect x="2" y="2" width="3.5" height="10" rx="1" />
              <rect x="8.5" y="2" width="3.5" height="10" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M3 1.8v10.4a.6.6 0 0 0 .92.5l8.2-5.2a.6.6 0 0 0 0-1L3.92 1.3A.6.6 0 0 0 3 1.8Z" />
            </svg>
          )}
        </button>
        <div className="min-w-0 flex-1">
          <div className="text-[10.5px] font-bold uppercase tracking-wider text-dim">
            {playing ? `${labels.speaking}: ${current?.speaker ?? ""}` : played ? labels.replay : labels.play}
          </div>
          <div className="truncate text-[13px] font-semibold">{current?.scriptTitle ?? ""}</div>
          <div className="mt-1.5">
            <Bar value={flat.length > 0 ? (turn + 1) / flat.length : 0} h={3} tone={playing ? "brand" : "dim"} />
          </div>
        </div>
      </div>
      {!played && current?.setting && (
        <p className="mt-2.5 border-t border-line pt-2.5 text-[12.5px] leading-relaxed text-mute">{current.setting}</p>
      )}
    </div>
  );
}
