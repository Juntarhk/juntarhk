import { useEffect, useRef } from "react";
import { useSearch, useLocation } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { useSeoSettings } from "@/contexts/SeoSettingsContext";
import { ActivityCard } from "@/components/ActivityCard";
import { useListActivities } from "@/hooks/use-activities";
import { useListCategories } from "@/hooks/use-categories";
import { Search, Filter, GraduationCap, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListActivitiesTargetGroup } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

// ─── Stable DB category slugs ─────────────────────────────────────────────────
// These match the slugs seeded in categoriesTable. Update here if the DB changes.
const DB_SLUGS = {
  photography:    "visual-media-creation",         // 影像創作
  ai:             "ai-campus-courses",              // AI 到校課程
  chineseCulture: "chinese-cultural-activities",   // 中華文化活動
  adventure:      "adventure-training",             // 歷奇訓練
} as const;

// ─── Sort priority: exact DB categoryName → order (lower = earlier) ───────────
const CATEGORY_NAME_PRIORITY: Record<string, number> = {
  "影像及校園媒體": 0,
  "影像創作": 0,           // legacy alias
  "AI教育及創作": 1,
  "AI 到校課程": 1,        // legacy alias
  "AI Education & Creation": 1,
  "中華文化活動": 2,
  "歷奇訓練": 3,
  "野外活動": 3,
};

// ─── AI subcategory chips ──────────────────────────────────────────────────────
const AI_TAG_CHIPS = [
  { zh: "全部AI課程", en: "All AI Courses", tag: "" },
  { zh: "AI素養",     en: "AI Literacy",    tag: "AI素養" },
  { zh: "AI影像創作", en: "AI Visual",      tag: "AI影像創作" },
  { zh: "AI＋學科",   en: "AI & Subjects",  tag: "AI＋學科" },
  { zh: "AI媒體素養", en: "Media Literacy", tag: "AI媒體素養" },
  { zh: "教師培訓",   en: "Teacher CPD",    tag: "教師培訓" },
] as const;

function getCategoryPriority(categoryName: string | null | undefined): number {
  if (!categoryName) return 99;
  return CATEGORY_NAME_PRIORITY[categoryName] ?? 4;
}

// ─── Alias map: display names → DB slugs (supports incoming links from service pages) ──
const DISPLAY_NAME_TO_SLUG: Record<string, string> = {
  "影像及校園媒體":   "visual-media-creation",
  "AI教育及創作":     "ai-campus-courses",
  "AI 教育及創作":    "ai-campus-courses",
  "AI教育及培訓":     "ai-campus-courses",
  "AI 教育及培訓":    "ai-campus-courses",
  "影像創作":         "visual-media-creation",
  "AI到校課程":       "ai-campus-courses",
  "AI 到校課程":      "ai-campus-courses",
  "中華文化":         "chinese-cultural-activities",
  "中華文化活動":     "chinese-cultural-activities",
  "歷奇及戶外活動":   "adventure-training",
  "歷奇訓練":         "adventure-training",
} as const;

// ─── Category shortcut chips ──────────────────────────────────────────────────
const CHIP_CONFIG = [
  { emoji: "📷", zh: "影像及校園媒體", en: "Photography & School Media", slug: DB_SLUGS.photography },
  { emoji: "🤖", zh: "AI 教育及創作",  en: "AI Education & Creation",   slug: DB_SLUGS.ai },
  { emoji: "🏮", zh: "中華文化",        en: "Chinese Culture",            slug: DB_SLUGS.chineseCulture },
  { emoji: "💪", zh: "歷奇及戶外活動",  en: "Adventure & Outdoor",        slug: DB_SLUGS.adventure },
] as const;

// ─── URL query-param helpers ──────────────────────────────────────────────────
function useQueryParams() {
  const search = useSearch();
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(search);

  const get = (key: string) => params.get(key) ?? undefined;

  const set = (updates: Record<string, string | undefined>) => {
    const next = new URLSearchParams(search);
    Object.entries(updates).forEach(([k, v]) => {
      if (!v || v === "all") {
        next.delete(k);
      } else {
        next.set(k, v);
      }
    });
    const qs = next.toString();
    setLocation("/activities" + (qs ? "?" + qs : ""), { replace: true });
  };

  return { get, set };
}

export default function Activities() {
  const { get, set } = useQueryParams();
  const { t, lang } = useLanguage();
  const seoSettings = useSeoSettings();
  const ac = t.activities;
  const isZh = lang === "zh";

  const search     = get("search") ?? get("q") ?? "";
  const rawCategory = get("category");
  // Resolve display-name aliases (e.g. "影像及校園媒體" → "visual-media-creation")
  const resolvedCategory = rawCategory
    ? (DISPLAY_NAME_TO_SLUG[rawCategory] ?? rawCategory)
    : undefined;
  const targetGroup = get("targetGroup") as ListActivitiesTargetGroup | undefined;
  const activeTag   = get("tag");
  const isAiActive  = resolvedCategory === DB_SLUGS.ai;

  const { data: categories } = useListCategories();

  const { data: activities, isLoading, isError } = useListActivities({
    search: search || undefined,
    category: resolvedCategory,
    targetGroup: targetGroup,
    tag: isAiActive && activeTag ? activeTag : undefined,
  });

  // ── Client-side sort by category priority (stable DB-name key) ─────────────
  const sortedActivities = activities
    ? [...activities].sort((a, b) =>
        getCategoryPriority(a.categoryName) - getCategoryPriority(b.categoryName)
      )
    : undefined;

  // ── Active filter state ────────────────────────────────────────────────────
  const hasFilter = !!(search || rawCategory || targetGroup || activeTag);
  const clearFilters = () => set({ search: undefined, category: undefined, targetGroup: undefined, tag: undefined });

  // ─ Chip active: resolved slug equality ─────────────────────────────────────
  const isChipActive = (slug: string) => resolvedCategory === slug;

  const handleChipClick = (slug: string) => {
    // Toggle: click active chip → clear category filter; also clear AI tag
    set({ category: resolvedCategory === slug ? undefined : slug, tag: undefined });
  };

  const handleTagChipClick = (tag: string) => {
    set({ tag: activeTag === tag ? undefined : (tag || undefined) });
  };

  // ── Auto-scroll to #programme-results when arriving with a category filter ─
  const hasScrolledRef = useRef<string | null>(null);
  useEffect(() => {
    if (!resolvedCategory || !sortedActivities) return;
    const scrollKey = resolvedCategory + (activeTag ?? "");
    if (hasScrolledRef.current === scrollKey) return;
    hasScrolledRef.current = scrollKey;
    const el = document.getElementById("programme-results");
    if (!el) return;
    const timer = setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 250);
    return () => clearTimeout(timer);
  }, [resolvedCategory, activeTag, sortedActivities]);

  // ── SEO ────────────────────────────────────────────────────────────────────
  const activeCat  = resolvedCategory ? categories?.find(c => (c.slug ?? "") === resolvedCategory) : undefined;
  const catNameZh  = activeCat?.name;
  const catNameEn  = activeCat?.nameEn;

  return (
    <AppLayout>
      <SEO
        title={activeCat
          ? (isZh
              ? `${catNameZh}課程｜JuntarHK`
              : `${catNameEn} Programmes | JuntarHK`)
          : (isZh
              ? (seoSettings["seo_page_activities_title_zh"] || "香港中小學課程目錄｜攝影、AI教育及創作、中華文化及歷奇｜JuntarHK")
              : (seoSettings["seo_page_activities_title_en"] || "HK School Programme Catalogue | Photography, AI Education & Creation, Chinese Culture & Adventure | JuntarHK"))}
        description={activeCat
          ? (isZh
              ? `瀏覽 JuntarHK ${catNameZh}課程，適合香港中小學，可按學生年級及校本主題度身設計。`
              : `Browse JuntarHK's ${catNameEn} programmes for Hong Kong schools. All courses can be tailored to your school's grade level and theme.`)
          : (isZh
              ? (seoSettings["seo_page_activities_description_zh"] || "瀏覽JuntarHK為香港中小學提供的攝影、校園媒體、AI教育及創作、中華文化、歷奇及戶外活動課程，所有課程可按校本需要訂製。")
              : (seoSettings["seo_page_activities_description_en"] || "Browse JuntarHK's programme catalogue for Hong Kong schools — photography, school media, AI Education & Creation, Chinese culture, adventure and outdoor activities. All courses tailored to your school's needs."))}
        keywords={seoSettings["seo_page_activities_keywords"] || "攝影課程目錄,AI教育課程,校園電視台,校園記者,手機攝影,AI動畫,歷奇訓練,香港中小學課程,school photography Hong Kong,AI education course,campus TV training,campus reporter,adventure learning HK"}
        path={activeCat ? `/activities?category=${resolvedCategory}${activeTag ? `&tag=${encodeURIComponent(activeTag)}` : ""}` : "/activities"}
        lang={lang}
      />

      {/* ── Header + filter bar ──────────────────────────────────────────── */}
      <div className="bg-[#1A3D4A] pt-32 pb-20 text-white border-b border-primary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="mb-10 text-center">
            <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">{ac.title}</h1>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              {ac.sub.split(ac.subStrong)[0]}<strong>{ac.subStrong}</strong>{ac.sub.split(ac.subStrong)[1]}
            </p>
          </div>

          {/* Category shortcut chips — horizontally scrollable on mobile */}
          <div
            className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
            aria-label={isZh ? "快速類別篩選" : "Quick category filters"}
          >
            {CHIP_CONFIG.map(chip => {
              const active = isChipActive(chip.slug);
              return (
                <button
                  key={chip.slug}
                  onClick={() => handleChipClick(chip.slug)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold border transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
                    active
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/30"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40"
                  }`}
                >
                  <span aria-hidden="true">{chip.emoji}</span>
                  {isZh ? chip.zh : chip.en}
                </button>
              );
            })}
          </div>

          {/* AI subcategory chips — shown only when AI Education & Creation is selected */}
          {isAiActive && (
            <div
              className="flex gap-2 overflow-x-auto pb-2 mt-3 -mx-1 px-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
              aria-label={isZh ? "AI課程細分篩選" : "AI sub-category filters"}
            >
              {AI_TAG_CHIPS.map(chip => {
                const active = chip.tag === "" ? !activeTag : activeTag === chip.tag;
                return (
                  <button
                    key={chip.tag || "all"}
                    onClick={() => handleTagChipClick(chip.tag)}
                    aria-pressed={active}
                    className={`inline-flex items-center whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
                      active
                        ? "bg-white text-primary border-white shadow-sm"
                        : "bg-white/10 border-white/20 text-white/80 hover:bg-white/20 hover:text-white hover:border-white/40"
                    }`}
                  >
                    {isZh ? chip.zh : chip.en}
                  </button>
                );
              })}
            </div>
          )}

          {/* Filter controls */}
          <div className="bg-white p-4 rounded-xl shadow-2xl flex flex-col gap-3 mx-auto max-w-5xl">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder={isZh ? "搜尋攝影、AI、校園記者、中華文化……" : "Search photography, AI, campus reporter, Chinese culture…"}
                className="pl-10 h-12 rounded-lg bg-muted/30 border-border focus-visible:ring-primary/50 text-foreground"
                value={search}
                onChange={(e) => set({ search: e.target.value || undefined })}
              />
            </div>

            {/* Category + target group + clear */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={resolvedCategory ?? "all"} onValueChange={(v) => set({ category: v })}>
                <SelectTrigger className="flex-1 h-11 rounded-lg border-border text-foreground">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-primary" />
                    <SelectValue placeholder={ac.allCategories} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{ac.allCategories}</SelectItem>
                  {categories?.map(c => (
                    <SelectItem key={c.id} value={c.slug ?? c.name}>
                      {isZh ? c.name : (c.nameEn ?? c.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={targetGroup ?? "all"} onValueChange={(v) => set({ targetGroup: v })}>
                <SelectTrigger className="flex-1 h-11 rounded-lg border-border text-foreground">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    <SelectValue placeholder={ac.allGroups} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{ac.allGroups}</SelectItem>
                  <SelectItem value="kindergarten">{ac.targetKindergarten}</SelectItem>
                  <SelectItem value="primary">{ac.targetPrimary}</SelectItem>
                  <SelectItem value="secondary">{ac.targetSecondary}</SelectItem>
                </SelectContent>
              </Select>

              {hasFilter && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="h-11 px-4 rounded-lg border-border text-foreground hover:bg-destructive/5 hover:border-destructive/30 hover:text-destructive font-semibold shrink-0"
                >
                  <X className="w-4 h-4 mr-1.5" />
                  {ac.clearFilters}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Results ────────────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 max-w-7xl bg-white min-h-[50vh]">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[420px] rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20 bg-destructive/5 rounded-xl border border-destructive/20 text-destructive">
            <h3 className="text-xl font-bold mb-2">{ac.loadError}</h3>
            <p>{ac.loadErrorSub}</p>
          </div>
        ) : sortedActivities?.length === 0 ? (
          <div className="text-center py-32 bg-muted/20 rounded-xl border-2 border-dashed border-border flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-[#1A3D4A]">{ac.noResults}</h3>
            <p className="text-muted-foreground mb-6">{ac.noResultsSub}</p>
            <Button variant="outline" onClick={clearFilters}>
              {ac.clearFilters}
            </Button>
          </div>
        ) : (
          <>
            {/* Anchor for smooth-scroll from service page CTAs */}
            <div id="programme-results" className="scroll-mt-6">
            {/* Result count + inline clear */}
            <div className="mb-8 flex items-center gap-3 flex-wrap">
              <span className="text-muted-foreground font-medium text-sm">
                {isZh
                  ? `找到 ${sortedActivities?.length ?? 0} 個課程`
                  : `${sortedActivities?.length ?? 0} programme${(sortedActivities?.length ?? 0) !== 1 ? "s" : ""} found`}
              </span>
              {hasFilter && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/15 px-3 py-1 rounded-full transition-colors"
                >
                  <X className="w-3 h-3" />
                  {ac.clearFilters}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedActivities?.map((activity, idx) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.04, 0.5) }}
                >
                  <ActivityCard activity={activity} />
                </motion.div>
              ))}
            </div>
            </div>{/* /programme-results */}
          </>
        )}
      </div>
    </AppLayout>
  );
}
