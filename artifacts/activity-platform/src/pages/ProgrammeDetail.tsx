import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { Breadcrumb } from "@/components/Breadcrumb";
import { InlineEnquiryForm } from "@/components/InlineEnquiryForm";
import { PROGRAMME_MAP } from "@/data/programmes-data";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRoute, Link } from "wouter";
import {
  Camera, Sparkles, CheckCircle2, Users, CalendarDays,
  Clock, Box, Info, ArrowLeft, ArrowRight, Target, ListOrdered,
  BookOpen, MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { gtagEvent } from "@/lib/gtag";
import { WHATSAPP_URL } from "@/config/business-facts";

export default function ProgrammeDetail() {
  const [match, params] = useRoute("/programmes/:slug");
  const { lang, t } = useLanguage();
  const slug = params?.slug;
  const programme = slug ? PROGRAMME_MAP[slug] : undefined;

  useEffect(() => {
    if (programme && slug) {
      gtagEvent("programme_page_view", {
        programme_slug: slug,
        programme_name: programme.zh,
      });
    }
  }, [slug, programme]);

  if (!match || !programme) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4 pt-32">
          <h1 className="text-4xl font-bold mb-4">{t.programme?.notFound || "Programme not found"}</h1>
          <Button asChild>
            <Link href="/activities">{t.activityDetail?.backToList || "Back"}</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  const isZh = lang === "zh";
  const title = isZh ? programme.zh : programme.en;
  const desc = isZh ? programme.descZh : programme.descEn;
  const parentLabel = programme.category === "photography" ? t.nav.photography : t.nav.aiEducation;
  const parentHref  = programme.category === "photography" ? "/photography" : "/ai-education";

  const seoTitle = isZh
    ? `${title} | JuntarHK 到校課程`
    : `${title} | JuntarHK School Programme`;
  const seoDesc = desc.slice(0, 150);

  const ParentIcon = programme.category === "photography" ? Camera : Sparkles;

  const outputLabel = programme.outputLabel
    ? (isZh ? programme.outputLabel.zh : programme.outputLabel.en)
    : (t.programme?.outputLabel ?? "學生作品");

  const waMessage = encodeURIComponent(
    isZh ? `想了解「${programme.zh}」課程詳情及索取建議書` : `Interested in learning more about "${programme.en}" and requesting a proposal`
  );

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": title,
    "description": desc,
    "url": `https://www.juntarhk.com/programmes/${programme.slug}`,
    "provider": {
      "@type": "Organization",
      "@id": "https://www.juntarhk.com/#organization",
      "name": "JuntarHK",
    },
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student",
    },
    "inLanguage": isZh ? "zh-HK" : "en-HK",
  };

  return (
    <AppLayout>
      <SEO
        title={seoTitle}
        description={seoDesc}
        path={`/programmes/${programme.slug}`}
        lang={lang}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(courseJsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-[#FAF7F2] pb-24 pt-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <Breadcrumb
            items={[
              { label: parentLabel, href: parentHref },
              { label: title },
            ]}
          />

          {/* ── Top dual CTA row (mobile-first, visible near header) ──── */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 mb-8 lg:hidden">
            <Button asChild size="sm" className="flex-1 h-11 rounded-xl font-bold bg-primary text-white hover:bg-primary/90">
              <Link href="#enquiry" onClick={() => gtagEvent("programme_cta_top_enquire", { programme: slug ?? "" })}>
                {isZh ? "索取課程建議" : "Request a Proposal"} <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="flex-1 h-11 rounded-xl font-bold border-border">
              <a
                href={`${WHATSAPP_URL}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => gtagEvent("programme_cta_top_whatsapp", { programme: slug ?? "" })}
              >
                {isZh ? "WhatsApp 查詢" : "WhatsApp Us"}
              </a>
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 mt-2 lg:mt-8">
            {/* ── Left main content ─────────────────────────────────── */}
            <div className="flex-1 min-w-0">
              {/* Category badge + H1 */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-semibold mb-5">
                  <ParentIcon className="w-4 h-4" />
                  <span>{parentLabel}</span>
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-extrabold text-[#1A3D4A] mb-5 leading-tight">
                  {title}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>

              {/* ── Learning objectives ──────────────────────────────── */}
              <div className="mb-10 bg-white rounded-2xl p-6 md:p-8 border border-border shadow-sm">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Target className="w-4.5 h-4.5 text-primary w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-[#1A3D4A]">
                    {isZh ? "學習目標" : "Learning Objectives"}
                  </h2>
                </div>
                <ol className="space-y-3">
                  {programme.learningObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-base text-foreground/80 leading-relaxed">
                        {isZh ? obj.zh : obj.en}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* ── Skills covered ───────────────────────────────────── */}
              <div className="mb-10">
                <h2 className="text-xl font-bold text-[#1A3D4A] mb-4">{t.programme?.skillsLabel}</h2>
                <div className="flex flex-wrap gap-2.5">
                  {programme.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-white border border-border px-4 py-2 rounded-lg text-sm font-medium shadow-sm text-foreground"
                    >
                      {isZh ? skill.zh : skill.en}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── Suggested lesson structure ───────────────────────── */}
              <div className="mb-10 bg-white rounded-2xl p-6 md:p-8 border border-border shadow-sm">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-[#1A3D4A]/10 flex items-center justify-center shrink-0">
                    <ListOrdered className="w-5 h-5 text-[#1A3D4A]" />
                  </div>
                  <h2 className="text-xl font-bold text-[#1A3D4A]">
                    {isZh ? "建議課節結構" : "Suggested Lesson Structure"}
                  </h2>
                </div>
                <div className="space-y-0">
                  {programme.lessonStructure.map((ls, i) => (
                    <div key={i} className="relative flex gap-4">
                      {/* Connector line */}
                      {i < programme.lessonStructure.length - 1 && (
                        <div className="absolute left-[18px] top-10 bottom-0 w-0.5 bg-border" />
                      )}
                      <div className="w-9 h-9 rounded-full bg-primary/10 border-2 border-primary/20 text-primary text-sm font-extrabold flex items-center justify-center shrink-0 z-10">
                        {ls.step}
                      </div>
                      <div className="pb-6">
                        <h3 className="font-bold text-foreground mb-1">
                          {isZh ? ls.titleZh : ls.titleEn}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {isZh ? ls.descZh : ls.descEn}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Customisation options ─────────────────────────────── */}
              <div className="mb-10 bg-white rounded-2xl p-6 md:p-8 border border-border shadow-sm">
                <h2 className="text-xl font-bold text-[#1A3D4A] mb-3">{t.programme?.customiseLabel}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {isZh ? programme.customise.zh : programme.customise.en}
                </p>
              </div>

              {/* ── Related case study ───────────────────────────────── */}
              {programme.relatedCaseStudy && (
                <div className="mb-10 bg-[#1A3D4A] text-white rounded-2xl p-6 md:p-8">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold">
                      {isZh ? "學校案例參考" : "School Case Study"}
                    </h2>
                  </div>
                  <p className="text-xs text-white/50 font-semibold uppercase tracking-wider mb-3">
                    {isZh ? "案例資料已匿名處理" : "Case details anonymised"}
                  </p>
                  <p className="text-white/85 leading-relaxed text-sm md:text-base">
                    {isZh ? programme.relatedCaseStudy.zh : programme.relatedCaseStudy.en}
                  </p>
                  <div className="mt-5">
                    <Link
                      href="/case-studies"
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-white/80 hover:text-white transition-colors"
                    >
                      {isZh ? "查看更多學校案例" : "View More Case Studies"}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}

              {/* ── FAQ accordion ────────────────────────────────────── */}
              {programme.faq && programme.faq.length > 0 && (
                <div className="mb-10">
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1A3D4A]">
                      {isZh ? "常見問題" : "FAQ"}
                    </h2>
                  </div>
                  <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                    <Accordion type="single" collapsible className="w-full">
                      {programme.faq.map((item, i) => (
                        <AccordionItem
                          key={i}
                          value={`faq-${i}`}
                          className="border-b border-border last:border-0 px-6"
                        >
                          <AccordionTrigger className="text-left text-base font-semibold text-[#1A3D4A] py-5 hover:no-underline hover:text-primary transition-colors">
                            {isZh ? item.qZh : item.qEn}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5 pt-0">
                            {isZh ? item.aZh : item.aEn}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </div>
              )}

              {/* ── Enquiry form ──────────────────────────────────────── */}
              <div className="mt-16 pt-8 border-t border-border" id="enquiry">
                <h2 className="text-3xl font-bold text-[#1A3D4A] mb-8">{t.programme?.enquiryTitle}</h2>
                <InlineEnquiryForm activityTitle={title} />
              </div>
            </div>

            {/* ── Right sticky sidebar ──────────────────────────────── */}
            <div className="w-full lg:w-[360px] shrink-0">
              <div className="sticky top-32 space-y-5">
                {/* Dual CTA at top of sidebar */}
                <div className="flex flex-col gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="w-full h-13 rounded-xl font-bold bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                  >
                    <Link
                      href="#enquiry"
                      onClick={() => gtagEvent("programme_cta_sidebar_enquire", { programme: slug ?? "" })}
                    >
                      {isZh ? "索取課程建議" : "Request a Proposal"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="w-full h-13 rounded-xl font-bold border-border hover:bg-muted/50"
                  >
                    <a
                      href={`${WHATSAPP_URL}?text=${waMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => gtagEvent("programme_cta_sidebar_whatsapp", { programme: slug ?? "" })}
                    >
                      {isZh ? "WhatsApp 查詢" : "WhatsApp Us"}
                    </a>
                  </Button>
                </div>

                {/* Programme spec card */}
                <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                  <div className="p-6 space-y-5">
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{t.programme?.targetAgeLabel}</p>
                        <p className="font-medium text-foreground">{isZh ? programme.targetAge.zh : programme.targetAge.en}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CalendarDays className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{t.programme?.sessionsLabel}</p>
                        <p className="font-medium text-foreground">{isZh ? programme.sessions.zh : programme.sessions.en}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{t.programme?.durationLabel}</p>
                        <p className="font-medium text-foreground">{isZh ? programme.duration.zh : programme.duration.en}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{t.programme?.classSizeLabel}</p>
                        <p className="font-medium text-foreground">{isZh ? programme.classSize.zh : programme.classSize.en}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Box className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{t.programme?.equipmentLabel}</p>
                        <p className="font-medium text-foreground">{isZh ? programme.equipment.zh : programme.equipment.en}</p>
                      </div>
                    </div>
                  </div>

                  {/* Student output highlight */}
                  <div className="bg-[#EAF3F2] p-6 border-t border-primary/10">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-primary mb-1 uppercase tracking-wider">
                          {outputLabel}
                        </p>
                        <p className="font-bold text-lg text-[#1A3D4A] leading-snug">
                          {isZh ? programme.output.zh : programme.output.en}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Funding note */}
                <div className="bg-muted/50 rounded-xl p-5 border border-border/50 flex items-start gap-3">
                  <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {isZh ? programme.fundingNote.zh : programme.fundingNote.en}
                  </p>
                </div>

                {/* Back link */}
                <Button variant="ghost" asChild className="w-full text-muted-foreground hover:text-foreground">
                  <Link href={parentHref}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {programme.category === "photography" ? t.programme?.backToPhotography : t.programme?.backToAi}
                  </Link>
                </Button>

                {/* Browse catalog link */}
                <Link
                  href={
                    programme.category === "photography"
                      ? "/activities?category=visual-media-creation"
                      : "/activities?category=ai-campus-courses"
                  }
                  className="flex items-center justify-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors py-1"
                  onClick={() => gtagEvent("catalog_link_click", { source: "programme_detail_sidebar", programme: slug ?? "" })}
                >
                  {isZh ? "在課程目錄查看同類班次" : "Browse similar sessions in catalog"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
