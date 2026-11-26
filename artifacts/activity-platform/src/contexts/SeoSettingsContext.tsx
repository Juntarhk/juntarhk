import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface SeoSettings {
  seo_title_zh: string;
  seo_title_en: string;
  seo_description_zh: string;
  seo_description_en: string;
  seo_keywords: string;
  seo_og_title: string;
  seo_og_description: string;
  seo_og_image: string;
  seo_google_verification: string;
  [key: string]: string;
}

const defaults: SeoSettings = {
  seo_title_zh: "",
  seo_title_en: "",
  seo_description_zh: "",
  seo_description_en: "",
  seo_keywords: "",
  seo_og_title: "",
  seo_og_description: "",
  seo_og_image: "",
  seo_google_verification: "",
};

const SeoSettingsContext = createContext<SeoSettings>(defaults);

export function SeoSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SeoSettings>(defaults);

  useEffect(() => {
    fetch("/api/seo-settings")
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === "object") {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <SeoSettingsContext.Provider value={settings}>
      {children}
    </SeoSettingsContext.Provider>
  );
}

export function useSeoSettings() {
  return useContext(SeoSettingsContext);
}
