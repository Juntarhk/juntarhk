import { Link } from "wouter";
import { Home, Search, Compass, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";

const COPY = {
  zh: {
    metaTitle: "找不到頁面 (404) | JuntarHK",
    metaDesc:
      "您要找的頁面不存在或已被移除。返回 JuntarHK 首頁，瀏覽我們為香港中小學提供的課外活動、野外歷險及STEAM課程。",
    badge: "404",
    title: "找不到此頁面",
    subtitle:
      "您要找的頁面可能已搬遷、改名或暫時無法存取。以下是一些熱門連結，協助您繼續探索 JuntarHK 的課程方案。",
    backHome: "返回首頁",
    browseActivities: "瀏覽全部活動",
    quickLinksTitle: "熱門頁面",
    quickLinks: [
      { href: "/", icon: Home, label: "首頁", desc: "了解 JuntarHK 服務" },
      { href: "/activities", icon: Search, label: "活動課程", desc: "ECA、STEAM、野外歷險" },
      { href: "/about", icon: Compass, label: "關於我們", desc: "團隊與營地介紹" },
      { href: "/contact", icon: Mail, label: "聯絡我們", desc: "查詢度身訂造方案" },
    ],
    helpText: "需要協助？",
    contactCta: "立即聯絡我們",
  },
  en: {
    metaTitle: "Page Not Found (404) | JuntarHK",
    metaDesc:
      "The page you're looking for doesn't exist or has been moved. Return to JuntarHK home to explore our extracurricular, outdoor and STEAM programmes for Hong Kong schools.",
    badge: "404",
    title: "Page Not Found",
    subtitle:
      "The page you're looking for may have been moved, renamed, or is temporarily unavailable. Try one of the popular links below to continue exploring JuntarHK.",
    backHome: "Back to Home",
    browseActivities: "Browse Activities",
    quickLinksTitle: "Popular Pages",
    quickLinks: [
      { href: "/", icon: Home, label: "Home", desc: "Learn about JuntarHK" },
      { href: "/activities", icon: Search, label: "Activities", desc: "ECA, STEAM, outdoor" },
      { href: "/about", icon: Compass, label: "About Us", desc: "Team & campsite" },
      { href: "/contact", icon: Mail, label: "Contact", desc: "Custom programmes" },
    ],
    helpText: "Need help?",
    contactCta: "Contact Us",
  },
};

export default function NotFound() {
  const { lang } = useLanguage();
  const c = COPY[lang === "en" ? "en" : "zh"];

  return (
    <AppLayout>
      <SEO
        title={c.metaTitle}
        description={c.metaDesc}
        path="/404"
        lang={lang}
      />
      <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#F5F5DC]/40 via-white to-[#1A3D4A]/5 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#1A3D4A] text-white font-bold text-sm mb-8 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {c.badge}
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#1A3D4A] mb-6 leading-tight">
              {c.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
              {c.subtitle}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 h-14 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl"
              >
                <Link href="/">
                  <ArrowLeft className="mr-2 w-5 h-5" />
                  {c.backHome}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 h-14 text-lg font-bold border-2 border-[#1A3D4A] text-[#1A3D4A] hover:bg-[#1A3D4A] hover:text-white"
              >
                <Link href="/activities">{c.browseActivities}</Link>
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 border border-muted-foreground/10">
            <h2 className="font-display text-2xl font-bold text-[#1A3D4A] mb-6 text-center">
              {c.quickLinksTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {c.quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-start gap-4 p-5 rounded-2xl bg-[#F5F5DC]/30 hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center shrink-0 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-[#1A3D4A] mb-1 group-hover:text-primary transition-colors">
                        {link.label}
                      </p>
                      <p className="text-sm text-muted-foreground">{link.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-8 pt-6 border-t border-muted-foreground/10 text-center">
              <span className="text-sm text-muted-foreground">{c.helpText}</span>{" "}
              <Link
                href="/contact"
                className="text-sm font-bold text-primary hover:underline"
              >
                {c.contactCta} →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
