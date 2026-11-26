import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Lang, translations } from "@/i18n/translations";

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof translations["zh"];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const RAW_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const EN_PREFIX = `${RAW_BASE}/en`;

/** Strip the base + optional /en prefix from a pathname → canonical zh path ("/..."). */
function toBasePath(pathname: string): string {
  let p = pathname;
  if (p === EN_PREFIX) return "/";
  if (p.startsWith(`${EN_PREFIX}/`)) p = p.slice(EN_PREFIX.length);
  else if (RAW_BASE && p.startsWith(RAW_BASE)) p = p.slice(RAW_BASE.length);
  if (!p.startsWith("/")) p = `/${p}`;
  return p || "/";
}

/** Build a full pathname for a given locale from a canonical zh path. */
function localeHref(basePath: string, l: Lang): string {
  if (l === "en") return `${EN_PREFIX}${basePath === "/" ? "" : basePath}` || "/en";
  return `${RAW_BASE}${basePath}` || "/";
}

export function LanguageProvider({
  children,
  initialLang = "zh",
}: {
  children: ReactNode;
  initialLang?: Lang;
}) {
  const [lang] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en-HK" : "zh-HK";
    localStorage.setItem("juntarhk_lang", lang);
  }, [lang]);

  // Language selection lives in the URL (/ = zh-HK, /en = en-HK) so each locale
  // is independently crawlable. Switching locale is a hard boundary (different
  // wouter base), so navigate with a full load to the equivalent localized URL.
  const setLang = (l: Lang) => {
    if (l === lang) return;
    const basePath = toBasePath(window.location.pathname);
    const target = localeHref(basePath, l) + window.location.search + window.location.hash;
    window.location.assign(target);
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
