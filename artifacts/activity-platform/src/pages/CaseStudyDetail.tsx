import { Helmet } from "react-helmet-async";
import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRoute, Link } from "wouter";
import { CASE_STUDY_MAP, type CaseStudy } from "@/data/case-studies-data";
import {
  Camera, Sparkles, Mountain, ArrowRight, ArrowLeft,
  BookOpen, School, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_URL } from "@/config/business-facts";

const CATEGORY_META: Record<
  CaseStudy["category"],
  { icon: typeof Camera; labelZh: string; labelEn: string }
> = {
  photography: { icon: Camera,    labelZh: "影像及校園媒體",      labelEn: "Photography & School Media" },
  ai:          { icon: Sparkles,  labelZh: "AI 教育及創作",       labelEn: "AI Education & Creation" },
  adventure:   { icon: Mountain,  labelZh: "歷奇及體驗學習",      labelEn: "Adventure & Experiential Learning" },
};

const LEVEL_LABEL: Record<CaseStudy["schoolLevel"], { zh: string; en: string }> = {
  primary:   { zh: "小學",       en: "Primary School" },
  secondary: { zh: "中學",       en: "Secondary School" },
  both:      { zh: "小學及中學", en: "Primary & Secondary" },
};

export default function CaseStudyDetail() {
  const [match, params] = useRoute("/case-studies/:slug");
  const { lang, t } = useLanguage();
  const isZh = lang === "zh";

  const slug = params?.slug ?? "";
  const cs = CASE_STUDY_MAP[slug];

  if (!match || !cs) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4 pt-32">
          <h1 className="text-4xl font-bold mb-4">
            {isZh ? "找不到此案例" : "Case study not found"}
          </h1>
          <Button asChild className="mt-4">
            <Link href="/case-studies">
              {isZh ? "返回學校案例" : "Back to Case Studies"}
            </Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  const catMeta  = CATEGORY_META[cs.category];
  const CategoryIcon = catMeta.icon;
  const level    = LEVEL_LABEL[cs.schoolLevel];
  const headline = isZh ? cs.headline.zh : cs.headline.en;
  const programme = isZh ? cs.programme.zh : cs.programme.en;
  const paragraphs = (isZh ? cs.details.zh : cs.details.en).split("\n\n");
  const metricLabel = isZh ? cs.metric.label.zh : cs.metric.label.en;
  const pageDesc = isZh ? cs.description.zh : cs.description.en;

  const pageTitle = isZh
    ? `${programme} 學校案例 | JuntarHK`
    : `${programme} — School Case Study | JuntarHK`;

  const waMsg = encodeURIComponent(
    isZh
      ? `想了解「${programme}」課程詳情及索取建議書`
      : `Interested in learning more about "${programme}" and requesting a proposal`
  );

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description: pageDesc,
    url: `https://www.juntarhk.com/case-studies/${cs.slug}`,
    inLanguage: isZh ? "zh-HK" : "en-HK",
    publisher: {
      "@type": "Organization",
      "@id": "https://www.juntarhk.com/#organization",
      name: "JuntarHK",
    },
    about: { "@type": "Course", name: programme },
  };

  return (
    <AppLayout>
      <SEO title={pageTitle} description={pageDesc} path={`/case-studies/${cs.slug}`} lang={lang} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
      </Helmet>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="pt-40 pb-16 bg-[#3D8B89] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/pattern.svg')]" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Breadcrumb
            items={[
              { label: t.nav.caseStudies, href: "/case-studies" },
              { label: programme },
            ]}
          />
          <div className="mt-8 flex flex-wrap items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white">
              <CategoryIcon className="w-3.5 h-3.5" />
              {isZh ? catMeta.labelZh : catMeta.labelEn}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white">
              <School className="w-3.5 h-3.5" />
              {isZh ? level.zh : level.en}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white/70">
              {cs.year}
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            {headline}
          </h1>
          <p className="text-white/70 text-sm font-semibold uppercase tracking-wider">
            {isZh ? "案例資料已匿名處理" : "Case details anonymised"}
          </p>
        </div>
      </section>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="bg-[#FAF7F2] pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">

          {/* Metric callout — overlaps hero bottom */}
          <div className="bg-[#1A3D4A] text-white rounded-2xl px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 -mt-8 mb-12 shadow-lg">
            <div className="text-center shrink-0">
              <p className="font-display text-5xl font-extrabold text-primary leading-none">
                {cs.metric.value}
              </p>
              <p className="text-sm text-white/70 mt-1 leading-tight">{metricLabel}</p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-white/20 shrink-0" />
            <p className="text-white/80 text-sm leading-relaxed">{pageDesc}</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">

            {/* ── Left: narrative ──────────────────────────────────────── */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl border border-border shadow-sm p-8 md:p-10 mb-8">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-[#1A3D4A]">
                    {isZh ? "案例詳情" : "Case Details"}
                  </h2>
                </div>
                <div className="space-y-5">
                  {paragraphs.map((para, i) => (
                    <p key={i} className="text-base text-foreground/80 leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Related programme link */}
              <div className="bg-white rounded-2xl border border-border shadow-sm p-6 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                    {isZh ? "相關課程" : "Related Programme"}
                  </p>
                  <p className="font-bold text-[#1A3D4A] leading-snug">{programme}</p>
                </div>
                <Button asChild variant="outline" size="sm" className="rounded-lg font-bold shrink-0">
                  <Link href={`/activities/${cs.programmeSlug}`}>
                    {isZh ? "查看課程" : "View Programme"}
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* ── Right: sticky sidebar ─────────────────────────────── */}
            <div className="w-full lg:w-[280px] shrink-0">
              <div className="sticky top-32 space-y-4">
                <div className="bg-[#1A3D4A] text-white rounded-2xl p-6">
                  <CheckCircle2 className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-bold text-lg mb-2">
                    {isZh ? "索取課程建議書" : "Request a Proposal"}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-5">
                    {isZh
                      ? "了解如何為貴校度身訂製同類課程"
                      : "Find out how a similar programme can be tailored for your school"}
                  </p>
                  <div className="flex flex-col gap-2.5">
                    <Button asChild className="w-full h-11 rounded-xl font-bold bg-primary hover:bg-primary/90">
                      <Link href="/contact">
                        {isZh ? "聯絡我們" : "Contact Us"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full h-11 rounded-xl font-bold bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white"
                    >
                      <a href={`${WHATSAPP_URL}?text=${waMsg}`} target="_blank" rel="noopener noreferrer">
                        WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>

                <Button variant="ghost" asChild className="w-full text-muted-foreground hover:text-foreground">
                  <Link href="/case-studies">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {isZh ? "返回學校案例" : "All Case Studies"}
                  </Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
