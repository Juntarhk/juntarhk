import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRoute, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { AppLayout } from "@/components/layout/AppLayout";
import { getGetActivityQueryKey } from "@workspace/api-client-react";
import { useGetActivity } from "@/hooks/use-activities";
import { Clock, Users, MapPin, Tag, Share2, ChevronLeft, ChevronRight, Check, Target, ListOrdered, BookOpen, MessageCircle, ArrowRight, CalendarDays, CheckCircle2, Box } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { EnquiryModal } from "@/components/EnquiryModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { PROGRAMME_MAP } from "@/data/programmes-data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

function DescriptionRenderer({ text }: { text: string }) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let bulletBuffer: string[] = [];
  let sectionKey = 0;

  const flushBullets = () => {
    if (bulletBuffer.length > 0) {
      elements.push(
        <div key={`bullets-${sectionKey++}`} className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 mb-4">
          {bulletBuffer.map((b, i) => {
            const [name, ...rest] = b.replace(/^•\s*/, '').split(' — ');
            const detail = rest.join(' — ');
            return (
              <div key={i} className="flex items-start gap-3 bg-muted/20 px-4 py-3 rounded-xl border border-border/40">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                <span className="text-sm leading-snug">
                  <span className="font-semibold text-foreground">{name}</span>
                  {detail && <span className="text-muted-foreground"> — {detail}</span>}
                </span>
              </div>
            );
          })}
        </div>
      );
      bulletBuffer = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith('【') && line.includes('】')) {
      flushBullets();
      const header = line.replace(/^【(.+?)】.*$/, '$1');
      elements.push(
        <h4 key={`h-${sectionKey++}`} className="font-display text-lg font-bold text-primary mt-6 mb-3 pb-1.5 border-b border-primary/20">
          {header}
        </h4>
      );
    } else if (line.startsWith('•')) {
      bulletBuffer.push(line);
    } else if (line.trim() === '') {
      flushBullets();
    } else {
      flushBullets();
      elements.push(
        <p key={`p-${sectionKey++}`} className="text-base text-foreground/75 leading-relaxed mb-3">
          {line}
        </p>
      );
    }
  }
  flushBullets();
  return <div>{elements}</div>;
}

function DetailImageGallery({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = images.length;

  const next = useCallback(() => setCurrent(c => (c + 1) % count), [count]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + count) % count), [count]);

  useEffect(() => {
    if (count <= 1) return;
    timerRef.current = setInterval(next, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [count, next]);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 4000);
  };

  return (
    <div className="space-y-3">
      <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-lg border border-border group">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${title} ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i === current ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        {count > 1 && (
          <>
            <button
              onClick={() => { prev(); resetTimer(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => { next(); resetTimer(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrent(i); resetTimer(); }}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${i === current ? "bg-white scale-125" : "bg-white/50"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => { setCurrent(i); resetTimer(); }}
              className={`flex-none w-20 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                i === current ? "border-primary shadow-md scale-105" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={src} alt={`${title} - 縮圖 ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ActivityDetail() {
  const [match, params] = useRoute("/activities/:slug");
  const activitySlug = match ? params.slug : "";
  const { t, lang } = useLanguage();
  const ad = t.activityDetail;
  const [copied, setCopied] = useState(false);
  const programme = PROGRAMME_MAP[activitySlug];
  const isZh = lang === "zh";

  // Redirect old slugs to their new programme-aligned equivalents
  const SLUG_REDIRECTS: Record<string, string> = {
    "mobile-photography-course": "mobile-photography-video",
    "school-reporter-programme": "campus-reporter-tv",
    "ai-animation-production-course": "ai-animation-production",
    "ai-chinese-culture-history": "ai-chinese-culture-digital-story",
  };
  const redirectTarget = SLUG_REDIRECTS[activitySlug];
  const [, setLocation] = useLocation();
  useEffect(() => {
    if (redirectTarget) {
      setLocation(`/activities/${redirectTarget}`, { replace: true } as any);
    }
  }, [redirectTarget, setLocation]);

  const { data: activity, isLoading, isError } = useGetActivity(activitySlug, {
    query: { queryKey: getGetActivityQueryKey(activitySlug), enabled: !!activitySlug }
  });

  const TARGET_GROUP_LABELS: Record<string, string> = {
    kindergarten: ad.targetKindergarten,
    primary: ad.targetPrimary,
    secondary: ad.targetSecondary,
    all: ad.targetAll,
  };

  if (isLoading) {
    return (
      <AppLayout darkHero={false}>
        <div className="pt-32 container mx-auto px-4"><div className="h-96 bg-muted rounded-3xl animate-pulse" /></div>
      </AppLayout>
    );
  }

  if (isError || !activity) {
    return (
      <AppLayout darkHero={false}>
        <div className="pt-40 container mx-auto text-center px-4">
          <h2 className="text-2xl font-bold mb-4">{ad.notFound}</h2>
          <Button asChild><Link href="/activities">{ad.backToList}</Link></Button>
        </div>
      </AppLayout>
    );
  }

  const galleryImages: string[] = (activity.images && activity.images.length > 0)
    ? activity.images
    : [activity.imageUrl || "https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&q=80&fit=crop"];

  const CATEGORY_NAMES_EN: Record<string, string> = {
    "野外活動": "Outdoor Activities",
    "鄒戲運動": "Sports & Games",
    "中華文化活動": "Chinese Cultural Activities",
    "藝術創作": "Arts & Crafts",
    "STEM活動": "STEM Activities",
    "生態探索": "Ecology Exploration",
    "歷奇訓練": "Adventure Training",
    "多元文化": "Multicultural",
    "STEAM工作坊": "STEAM Workshops",
    "體育活動": "Sports & PE",
    "環球文化體驗": "Global Cultural Experience",
    "財商及生涯規劃": "Financial Literacy & Career Planning",
    "新興運動": "Emerging Sports",
    "影像及校園媒體": "Photography & School Media",
    "影像創作": "Photography & School Media",
    "AI教育及創作": "AI Education & Creation",
    "AI 到校課程": "AI Education & Creation",
  };

  const LOCATION_NAMES_EN: Record<string, string> = {
    "學校 / 戶外場地": "School / Outdoor Venue",
    "學校操場 / 禮堂": "School Playground / Hall",
    "學校操場 / 禮堂 / 戶外場地": "School Playground / Hall / Outdoor Venue",
    "學校操場 / 體育館": "School Playground / Sports Hall",
    "學校禮堂 / 操場": "School Hall / Playground",
    "學校禮堂 / 課室": "School Hall / Classroom",
    "學校花園/公園": "School Garden / Park",
    "室內攀石場": "Indoor Climbing Gym",
    "室內攀石牆": "Indoor Climbing Wall",
    "戶外": "Outdoor",
    "戶外 / 室內": "Outdoor / Indoor",
    "戶外 / Bula Land": "Outdoor / Bula Land",
    "Bula Land / 戶外場地": "Bula Land / Outdoor Venue",
    "Bula Land / 戶外繩網場地": "Bula Land / Outdoor Ropes Course",
    '"Bula Land, 粉嶺沙頭角"': "Bula Land, Sha Tau Kok, Fanling",
    "Bula Land, 粉嶺沙頭角": "Bula Land, Sha Tau Kok, Fanling",
    "新界農場": "New Territories Farm",
    "本港各大營地": "Campsites across Hong Kong",
    "校園": "School Campus",
    "校外": "Off-campus",
    "森林/大自然": "Forest / Nature",
    "自然生態教育徑": "Nature Ecology Trail",
    "西貢海域": "Sai Kung Waters",
  };

  const DURATION_NAMES_EN: Record<string, string> = {
    "1-2小時": "1–2 hours",
    "1-2日": "1–2 days",
    "1.5小時": "1.5 hours",
    "2-3小時": "2–3 hours",
    "3-4小時": "3–4 hours",
    "3小時": "3 hours",
    "3小時 / 3 Hours": "3 hours",
    "4-5小時": "4–5 hours",
    "6堂（每堂1至2小時）": "6 sessions (1–2 hrs each)",
    "全日": "Full day",
    "半天": "Half day",
    "半天 / 全天": "Half day / Full day",
    "半天 / 全天可選": "Half day / Full day (flexible)",
    "半天至全天": "Half day to full day",
    "半日": "Half day",
    "半日 / 全天": "Half day / Full day",
    "半日至全日": "Half day to full day",
    "學期計劃": "Term programme",
  };

  const displayTitle = lang === "en" && activity.titleEn ? activity.titleEn : activity.title;
  const displaySubtitle = lang === "en" ? activity.title : activity.titleEn;
  const displayDescription = lang === "en"
    ? (activity.descriptionEn || null)
    : activity.description;
  const displayDuration = lang === "en"
    ? (activity.durationEn || activity.duration)
    : activity.duration;
  const displayLocation = lang === "en"
    ? (activity.locationEn || activity.location)
    : activity.location;

  const categoryDisplay = lang === "en"
    ? (CATEGORY_NAMES_EN[activity.categoryName ?? ""] ?? activity.categoryName ?? "")
    : (activity.categoryName ?? "");

  const BASE_URL = "https://www.juntarhk.com";

  const seoTitle = activity.seoTitle
    || (lang === "en" ? `${activity.titleEn} | JuntarHK` : `${activity.title}｜JuntarHK`);
  const seoDescription = activity.seoDescription
    || (lang === "en"
      ? (activity.descriptionEn || activity.description).slice(0, 160)
      : activity.description.slice(0, 160));
  const seoKeywords = activity.seoKeywords || "";
  const slugOrId = activity.slug ?? activity.id;
  const zhUrl = `${BASE_URL}/activities/${slugOrId}`;
  const enUrl = `${BASE_URL}/en/activities/${slugOrId}`;
  const canonical = lang === "en" ? enUrl : zhUrl;
  const ogImage = activity.imageUrl
    ?? (activity.images?.[0] ? `${BASE_URL}${activity.images[0]}` : undefined);

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": canonical,
    name: activity.titleEn || activity.title,
    description: (activity.descriptionEn || activity.description).slice(0, 500),
    url: canonical,
    provider: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "JuntarHK",
      url: BASE_URL,
    },
    ...(ogImage ? { image: ogImage } : {}),
    inLanguage: ["zh-HK", "en-HK"],
    educationalLevel: (() => {
      const groups = Array.isArray(activity.targetGroup) ? activity.targetGroup : [activity.targetGroup];
      const map: Record<string, string> = {
        kindergarten: "Kindergarten",
        primary: "Primary School",
        secondary: "Secondary School",
      };
      return groups.map(g => map[g] ?? g);
    })(),
    courseMode: "onsite",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      location: {
        "@type": "Place",
        name: activity.locationEn || activity.location,
        address: { "@type": "PostalAddress", addressCountry: "HK" },
      },
    },
  };

  return (
    <AppLayout darkHero={false}>
      <Helmet>
        <html lang={lang === "en" ? "en-HK" : "zh-HK"} />
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        {seoKeywords && <meta name="keywords" content={seoKeywords} />}
        <link rel="canonical" href={canonical} />
        <link rel="alternate" hrefLang="zh-HK" href={zhUrl} />
        <link rel="alternate" hrefLang="en-HK" href={enUrl} />
        <link rel="alternate" hrefLang="x-default" href={zhUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={lang === "en" ? "en_HK" : "zh_HK"} />
        <meta property="og:locale:alternate" content={lang === "en" ? "zh_HK" : "en_HK"} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={canonical} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
        <script type="application/ld+json">{JSON.stringify(courseJsonLd)}</script>
      </Helmet>
      <div className="bg-background pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          <Breadcrumb items={[
            { label: lang === "en" ? "Programme Catalogue" : "課程目錄", href: "/activities" },
            ...(activity.categoryName ? [{
              label: categoryDisplay,
              href: `/activities?category=${(activity as any).categorySlug ?? ""}`,
            }] : []),
            { label: displayTitle },
          ]} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="flex gap-2 mb-3">
                  <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground border-none font-bold px-4 py-1.5 shadow-md">
                    {categoryDisplay}
                  </Badge>
                  {activity.featured && (
                    <Badge className="bg-accent text-accent-foreground border-none font-bold px-4 py-1.5 shadow-md">
                      {ad.featured}
                    </Badge>
                  )}
                </div>
                <DetailImageGallery images={galleryImages} title={displayTitle} />
              </div>

              <div>
                <h1 className="font-display text-4xl md:text-5xl font-extrabold text-foreground mb-3">
                  {displayTitle}
                </h1>
                {displaySubtitle && (
                  <p className="text-xl text-muted-foreground font-medium mb-6">
                    {displaySubtitle}
                  </p>
                )}
                <div className="flex flex-wrap gap-3 pb-8 border-b border-border">
                  {(() => {
                    const groups = Array.isArray(activity.targetGroup) ? activity.targetGroup : [activity.targetGroup];
                    const ALL_LEVELS = ["kindergarten", "primary", "secondary"];
                    const isAllGroups = ALL_LEVELS.every((g) => (groups as string[]).includes(g));
                    return isAllGroups ? (
                      <Badge variant="outline" className="text-sm px-3 py-1 bg-muted/30">
                        <Tag className="w-3 h-3 mr-2" /> {TARGET_GROUP_LABELS["all"] || "全學層"}
                      </Badge>
                    ) : groups.map((g) => (
                      <Badge key={g} variant="outline" className="text-sm px-3 py-1 bg-muted/30">
                        <Tag className="w-3 h-3 mr-2" /> {TARGET_GROUP_LABELS[g] || g}
                      </Badge>
                    ));
                  })()}
                </div>
              </div>

              <div className="max-w-none text-foreground/80 leading-loose">
                <h3 className="font-display text-2xl font-bold text-foreground mb-4">{ad.descTitle}</h3>
                {displayDescription ? (
                  <DescriptionRenderer text={displayDescription} />
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground italic mb-3">{ad.enContentMissing}</p>
                    <DescriptionRenderer text={activity.description} />
                  </div>
                )}
              </div>

              {/* ── Rich programme content (when a matching programme exists) ──── */}
              {programme && (
                <>
                  {/* Learning Objectives */}
                  <div className="bg-white rounded-2xl p-6 md:p-8 border border-border shadow-sm">
                    <div className="flex items-center gap-2.5 mb-5">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Target className="w-5 h-5 text-primary" />
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

                  {/* Skills covered */}
                  <div>
                    <h2 className="text-xl font-bold text-[#1A3D4A] mb-4">
                      {isZh ? "涵蓋技能" : "Skills Covered"}
                    </h2>
                    <div className="flex flex-wrap gap-2.5">
                      {programme.skills.map((skill, i) => (
                        <span key={i} className="bg-white border border-border px-4 py-2 rounded-lg text-sm font-medium shadow-sm text-foreground">
                          {isZh ? skill.zh : skill.en}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Lesson structure */}
                  <div className="bg-white rounded-2xl p-6 md:p-8 border border-border shadow-sm">
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

                  {/* Customisation options */}
                  <div className="bg-white rounded-2xl p-6 md:p-8 border border-border shadow-sm">
                    <h2 className="text-xl font-bold text-[#1A3D4A] mb-3">
                      {isZh ? "訂製選項" : "Customisation Options"}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {isZh ? programme.customise.zh : programme.customise.en}
                    </p>
                  </div>

                  {/* Related case study */}
                  {programme.relatedCaseStudy && (
                    <div className="bg-[#1A3D4A] text-white rounded-2xl p-6 md:p-8">
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

                  {/* FAQ accordion */}
                  {programme.faq && programme.faq.length > 0 && (
                    <div>
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
                            <AccordionItem key={i} value={`faq-${i}`} className="border-b border-border last:border-0 px-6">
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
                </>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-32 bg-card rounded-[2rem] p-8 shadow-xl border border-border">
                <h3 className="font-display font-bold text-2xl mb-6 pb-4 border-b border-border/50">{ad.sidebarTitle}</h3>

                {programme ? (
                  /* Programme spec — shown when a rich programme entry exists */
                  <div className="space-y-5 mb-6">
                    {[
                      { Icon: Users, label: isZh ? "適合學層" : "Target Level", value: isZh ? programme.targetAge.zh : programme.targetAge.en },
                      { Icon: CalendarDays, label: isZh ? "建議課節" : "Sessions", value: isZh ? programme.sessions.zh : programme.sessions.en },
                      { Icon: Clock, label: isZh ? "每節時長" : "Duration per Session", value: isZh ? programme.duration.zh : programme.duration.en },
                      { Icon: Users, label: isZh ? "班級人數" : "Class Size", value: isZh ? programme.classSize.zh : programme.classSize.en },
                      { Icon: Box, label: isZh ? "所需設備" : "Equipment", value: isZh ? programme.equipment.zh : programme.equipment.en },
                    ].map(({ Icon, label, value }, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground font-medium">{label}</p>
                          <p className="font-semibold text-foreground">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* DB fields fallback */
                  <div className="space-y-6 mb-8">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">{ad.durationLabel}</p>
                        <p className="font-semibold text-foreground">{displayDuration}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">{ad.participantsLabel}</p>
                        <p className="font-semibold text-foreground">
                          {activity.minParticipants} - {activity.maxParticipants} {ad.participantsUnit}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">{ad.locationLabel}</p>
                        <p className="font-semibold text-foreground">{displayLocation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Student output highlight — shown when a rich programme entry exists */}
                {programme && (
                  <div className="bg-[#EAF3F2] rounded-xl p-5 border border-primary/10 mb-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                          {isZh ? "學生成果" : "Student Output"}
                        </p>
                        <p className="font-bold text-foreground leading-snug">
                          {isZh ? programme.output.zh : programme.output.en}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-6 border-t border-border/50">
                  <EnquiryModal
                    activityTitle={activity.title}
                    trigger={
                      <Button size="lg" className="w-full rounded-xl h-14 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all">
                        {ad.enquireBtn}
                      </Button>
                    }
                  />

                  <Button
                    variant="outline"
                    size="lg"
                    className={`w-full rounded-xl h-14 font-semibold border-2 transition-all ${copied ? "border-green-500 text-green-600 bg-green-50" : ""}`}
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(window.location.href);
                      } catch {
                        const el = document.createElement("textarea");
                        el.value = window.location.href;
                        document.body.appendChild(el);
                        el.select();
                        document.execCommand("copy");
                        document.body.removeChild(el);
                      }
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                  >
                    {copied
                      ? <><Check className="w-4 h-4 mr-2" />{lang === "en" ? "Copied!" : "已複製!"}</>
                      : <><Share2 className="w-4 h-4 mr-2" />{ad.shareBtn}</>
                    }
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
