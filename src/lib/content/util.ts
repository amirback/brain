import type { L } from "../types";

/** Three-language string. */
export const t = (ru: string, kk: string, en: string): L => ({ ru, kk, en });

/**
 * Same text in every language. Used for formulas, numbers, and for content
 * that is already in the subject's own language (an English sentence stays
 * English whatever the interface language is).
 */
export const n = (s: string): L => ({ ru: s, kk: s, en: s });
