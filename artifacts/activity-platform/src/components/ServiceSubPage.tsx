/**
 * Shared layout for photography and AI education sub-pages.
 * Each sub-page passes its bilingual content; this component handles
 * the hero, highlights grid, student outcomes, optional programme link, and enquiry form.
 */
import { useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { Breadcrumb } from "@/components/Breadcrumb";
import { InlineEnquiryForm } from "@/components/InlineEnquiryForm";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { gtagEvent } from "@/lib/gtag";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export interface SubPagePhoto {
  src: string;
  altZh: string;
  altEn: string;
}

export interface SubPageContent {
  seoTitle: string;
  seoDescription: string;
  badge: string;
  h1: string;
  heroSub: string;
  highlights: Array<{ icon: LucideIcon; label: string }>;
  /** Optional classroom photo gallery shown between highlights and outcomes */
  photos?: SubPagePhoto[];
  /** Bilingual section heading for the photo gallery */
  photosTitle?: { zh: string; en: string };
  /** Optional hero background image path. Defaults to a generic event photo. */
  heroImage?: string;
  outcomesTitle: string;
  outcomes: Array<{ icon: LucideIcon; label: string }>;
  programmeSlug?: string;
  programmeCtaLabel: string;
  enquiryTitle: string;
  enquiryActivity: string;
}

interface ServiceSubPageProps {
  lang: "zh" | "en";
  /** "photography" → teal/green theme; "ai" → amber theme */
  theme: "photography" | "ai";
  path: string;
  breadcrumbLabel: string;
  breadcrumbParentLabel: string;
  breadcrumbParentHref: string;
  gtagName: string;
  content: SubPageContent;
}

const THEME = {
  photography: {
    accent: "#3D8B89",
    badgeBg: "bg-white/10 border-white/20 text-white",
    highlightIconBg: "bg-[#1A3D4A]/5",
    highlightIconColor: "text-[#1A3D4A]",
    outcomeBg: "bg-[#EAF3F2]",
    outcomeIconBg: "bg-primary/10",
    outcomeIconColor: "text-primary",
    ctaBg: "bg-primary hover:bg-primary/90 text-primary-foreground",
    enquirySectionBg: "bg-[#FAF7F2] border-t border-border",
    enquiryTitleColor: "text-[#1A3D4A]",
  },
  ai: {
    accent: "#E8A020",
    badgeBg: "bg-[#E8A020]/20 border-[#E8A020]/30 text-[#E8A020]",
    highlightIconBg: "bg-[#E8A020]/10",
    highlightIconColor: "text-[#E8A020]",
    outcomeBg: "bg-[#FAF7F2]",
    outcomeIconBg: "bg-[#E8A020]/10",
    outcomeIconColor: "text-[#E8A020]",
    ctaBg: "bg-[#E8A020] hover:bg-[#E8A020]/90 text-white",
    enquirySectionBg: "bg-[#1A3D4A]",
    enquiryTitleColor: "text-white",
  },
};

export function ServiceSubPage({
  lang,
  theme,
  path,
  breadcrumbLabel,
  breadcrumbParentLabel,
  breadcrumbParentHref,
  gtagName,
  content,
}: ServiceSubPageProps) {
  const th = THEME[theme];

  useEffect(() => {
    gtagEvent("service_page_view", { service_name: gtagName });
  }, [gtagName]);

  const isEn = lang === "en";
  const enquiryId = `${gtagName}-enquiry`;

  return (
    <AppLayout>
      <SEO
        title={content.seoTitle}
        description={content.seoDescription}
        path={path}
        lang={lang}
      />

      {/* Hero */}
      <section className="relative pt-40 pb-32 bg-[#1A3D4A] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A3D4A] via-[#1A3D4A]/90 to-transparent z-10" />
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
            style={{ backgroundImage: `url('${content.heroImage ?? "/event-photo-13.jpg"}')` }}
          />
        </div>

        <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <Breadcrumb
            items={[
              { label: breadcrumbParentLabel, href: breadcrumbParentHref },
              { label: breadcrumbLabel },
            ]}
          />

          <div className="max-w-3xl mt-8">
            <div
              className={`inline-flex items-center gap-2 backdrop-blur-md border px-4 py-2 rounded-full text-sm font-semibold mb-6 ${th.badgeBg}`}
            >
              <span>{content.badge}</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              {content.h1}
            </h1>

            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl">
              {content.heroSub}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className={`rounded-full px-8 font-bold h-14 ${th.ctaBg}`}
                onClick={() =>
                  document.getElementById(enquiryId)?.scrollIntoView({ behavior: "smooth" })
                }
              >
                {content.enquiryTitle}
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-8 font-bold h-14 bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                <a
                  href="https://wa.me/85297289412"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => gtagEvent("whatsapp_click", { source: gtagName })}
                >
                  {isEn ? "WhatsApp Us" : "WhatsApp 查詢"}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights grid */}
      <section className="py-24 bg-[#FAF7F2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {content.highlights.map((h, i) => {
              const Icon = h.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-border shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
                >
                  <div className={`p-3 rounded-xl ${th.highlightIconBg}`}>
                    <Icon className={`w-6 h-6 ${th.highlightIconColor}`} />
                  </div>
                  <span className="font-bold text-lg text-foreground">{h.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Classroom photo gallery */}
      {content.photos && content.photos.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            {content.photosTitle && (
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#1A3D4A] mb-10 text-center">
                {isEn ? content.photosTitle.en : content.photosTitle.zh}
              </h2>
            )}
            {/* Mobile: horizontal scroll; sm+: 2-col grid; lg+: 3-col grid */}
            <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory sm:hidden">
              {content.photos.map((photo, i) => (
                <div
                  key={i}
                  className="flex-none w-72 aspect-[4/3] rounded-2xl overflow-hidden snap-start"
                >
                  <img
                    src={photo.src}
                    alt={isEn ? photo.altEn : photo.altZh}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.photos.map((photo, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={photo.src}
                    alt={isEn ? photo.altEn : photo.altZh}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Student outcomes */}
      <section className={`py-24 ${th.outcomeBg}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#1A3D4A] mb-16">
            {content.outcomesTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.outcomes.map((o, i) => {
              const Icon = o.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-primary/10"
                >
                  <div
                    className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 ${th.outcomeIconBg}`}
                  >
                    <Icon className={`w-8 h-8 ${th.outcomeIconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold">{o.label}</h3>
                </div>
              );
            })}
          </div>

          {/* Optional link to full programme detail page */}
          {content.programmeSlug && (
            <div className="mt-16">
              <Button asChild variant="outline" className="rounded-full px-8 h-12 border-[#1A3D4A] text-[#1A3D4A] hover:bg-[#1A3D4A]/5 font-bold">
                <Link href={`/programmes/${content.programmeSlug}`}>
                  {content.programmeCtaLabel} <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Enquiry form */}
      <section
        id={enquiryId}
        className={`py-24 ${th.enquirySectionBg} scroll-mt-24`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className={`font-display text-3xl md:text-4xl font-extrabold mb-4 ${th.enquiryTitleColor}`}>
              {content.enquiryTitle}
            </h2>
            <p className={theme === "ai" ? "text-lg text-white/80" : "text-lg text-muted-foreground"}>
              {isEn
                ? "Fill in the form below and our education consultant will contact you within 2 working days with a free proposal."
                : "填寫以下表格，我們的教育顧問將於 2 個工作天內為您提供免費課程建議。"}
            </p>
          </div>

          <InlineEnquiryForm activityTitle={content.enquiryActivity} />
        </div>
      </section>

      {/* Back to parent */}
      <section className="py-8 bg-[#FAF7F2] border-t border-border text-center">
        <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
          <Link href={breadcrumbParentHref}>
            ← {isEn ? `Back to ${breadcrumbParentLabel}` : `返回${breadcrumbParentLabel}`}
          </Link>
        </Button>
      </section>
    </AppLayout>
  );
}
