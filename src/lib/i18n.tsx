"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Lang, L } from "./types";
import { ru, type Dict } from "./dict/ru";
import { kk } from "./dict/kk";
import { en } from "./dict/en";

const dicts: Record<Lang, Dict> = { ru, kk, en };

const LS_KEY = "brain.lang";

interface I18nCtx {
  lang: Lang;
  d: Dict;
  setLang: (l: Lang) => void;
  pick: (v: L) => string;
}

const Ctx = createContext<I18nCtx>({
  lang: "ru",
  d: ru,
  setLang: () => {},
  pick: (v) => v.ru,
});

function detect(): Lang {
  if (typeof window === "undefined") return "ru";
  const saved = window.localStorage.getItem(LS_KEY);
  if (saved === "ru" || saved === "kk" || saved === "en") return saved;
  const nav = (navigator.language || "ru").toLowerCase();
  if (nav.startsWith("kk") || nav.startsWith("kz")) return "kk";
  if (nav.startsWith("ru")) return "ru";
  return "en";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");

  useEffect(() => {
    setLangState(detect());
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem(LS_KEY, l);
  }, []);

  const pick = useCallback((v: L) => v[lang], [lang]);

  return <Ctx.Provider value={{ lang, d: dicts[lang], setLang, pick }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  return useContext(Ctx);
}
