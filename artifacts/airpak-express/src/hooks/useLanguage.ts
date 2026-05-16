import { useState, useCallback } from "react";

export type Lang = "en" | "zh" | "ms" | "ar";

const STORAGE_KEY = "airpak-lang";

export const LANGUAGES: Record<Lang, { label: string; flag: string; dir: "ltr" | "rtl" }> = {
  en: { label: "English", flag: "EN", dir: "ltr" },
  zh: { label: "中文", flag: "ZH", dir: "ltr" },
  ms: { label: "Bahasa", flag: "MY", dir: "ltr" },
  ar: { label: "العربية", flag: "AR", dir: "rtl" },
};

export function useLanguage() {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEY) as Lang) || "en";
    } catch {
      return "en";
    }
  });

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {}
    document.documentElement.setAttribute("lang", newLang);
    document.documentElement.setAttribute("dir", LANGUAGES[newLang].dir);
  }, []);

  return { lang, setLang, langInfo: LANGUAGES[lang] };
}
