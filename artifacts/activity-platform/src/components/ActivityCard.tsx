import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "wouter";
import { Clock, Users, MapPin, ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Activity } from "@workspace/api-client-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ActivityCardProps {
  activity: Activity;
}

const TARGET_GROUP_LABELS_ZH: Record<string, string> = {
  kindergarten: "幼稚園",
  primary: "小學",
  secondary: "中學",
  all: "全適合"
};

const TARGET_GROUP_LABELS_EN: Record<string, string> = {
  kindergarten: "Kindergarten",
  primary: "Primary",
  secondary: "Secondary",
  all: "All Ages"
};


const DURATION_NAMES_EN: Record<string, string> = {
  "半天至全天": "Half day to full day",
  "半天": "Half day",
  "全天": "Full day",
  "1-2小時": "1–2 hours",
  "1.5-2小時": "1.5–2 hours",
  "2-3小時": "2–3 hours",
  "3-4小時": "3–4 hours",
  "1小時": "1 hour",
  "2小時": "2 hours",
  "3小時": "3 hours",
  "90分鐘": "90 minutes",
  "60-90分鐘": "60–90 minutes",
  "45-60分鐘": "45–60 minutes",
  "30-60分鐘": "30–60 minutes",
  "按需定制": "Customisable",
  "可按學校需要調整": "Flexible (school-arranged)",
  "1天": "1 day",
  "2天1夜": "2 days 1 night",
};

const LOCATION_NAMES_EN: Record<string, string> = {
  "學校 / 戶外場地": "School / Outdoor venue",
  "學校": "School",
  "戶外": "Outdoor",
  "室內 / 戶外": "Indoor / Outdoor",
  "室內攀石場": "Indoor climbing gym",
  "西貢海域": "Sai Kung Waters",
  "農場": "Farm",
  "紅樹林 / 生態中心": "Mangrove / Ecology Centre",
  "學校操場 / 禮堂": "School playground / Hall",
  "學校操場": "School playground",
  "學校禮堂": "School hall",
  "學校禮堂 / 操場": "School hall / Playground",
  "學校禮堂 / 課室": "School hall / Classroom",
  "戶外 / 學校": "Outdoor / School",
  "郊野 / 學校": "Countryside / School",
  "學校 / 室內場地": "School / Indoor venue",
  "學校 / 郊野公園": "School / Country Park",
  "南生圍 BulaLand": "Nam Sang Wai – BulaLand",
  "BulaLand 南生圍": "BulaLand, Nam Sang Wai",
  "戶外 / 室內": "Outdoor / Indoor",
  "可來校": "School visit available",
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80&fit=crop";

function ActivityImageSlider({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { lang } = useLanguage();

  const count = images.length;

  const next = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setCurrent(c => (c + 1) % count);
  }, [count]);

  const prev = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent(c => (c - 1 + count) % count);
  }, [count]);

  const goTo = useCallback((i: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent(i);
  }, []);

  useEffect(() => {
    if (count <= 1) return;
    if (isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % count);
    }, 3000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [count, isHovered]);

  return (
    <div
      className="relative aspect-[4/3] overflow-hidden bg-muted"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`${title} ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            i === current ? "opacity-100" : "opacity-0"
          } ${count === 1 ? "group-hover:scale-105 transition-transform duration-700" : ""}`}
        />
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A2B4A]/80 via-black/0 to-transparent opacity-80 pointer-events-none" />

      {/* Prev / Next arrows — only if multiple images */}
      {count > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label={lang === "en" ? "Previous" : "上一張"}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => next(e)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label={lang === "en" ? "Next" : "下一張"}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-1.5 z-20">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => goTo(i, e)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  i === current ? "bg-white scale-125" : "bg-white/50"
                }`}
                aria-label={lang === "en" ? `Photo ${i + 1}` : `第 ${i + 1} 張`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const { lang } = useLanguage();

  const allImages: string[] = (() => {
    if (activity.images && activity.images.length > 0) {
      return activity.images;
    }
    return [activity.imageUrl || FALLBACK_IMAGE];
  })();

  const displayTitle = lang === "en" && activity.titleEn ? activity.titleEn : activity.title;
  const categoryLabel = lang === "en"
    ? (((activity as any).categoryNameEn as string | null | undefined) ?? activity.categoryName ?? "")
    : (activity.categoryName ?? "");
  const groups = Array.isArray(activity.targetGroup) ? activity.targetGroup : [activity.targetGroup];
  const ALL_LEVELS = ["kindergarten", "primary", "secondary"];
  const isAllGroups = ALL_LEVELS.every((g) => (groups as string[]).includes(g));
  const targetLabel = isAllGroups
    ? (lang === "en" ? "All Ages" : "全學層")
    : groups.map((g: string) => lang === "en" ? (TARGET_GROUP_LABELS_EN[g] ?? g) : (TARGET_GROUP_LABELS_ZH[g] ?? g)).join(" · ");
  const suitableLabel = lang === "en" ? "Suitable for:" : "適合:";
  const featuredLabel = lang === "en" ? "Featured" : "精選課程";
  const photosLabel = lang === "en"
    ? `${allImages.length} Photos`
    : `${allImages.length} 張相片`;
  const participantsLabel = lang === "en"
    ? `${activity.minParticipants}–${activity.maxParticipants} pax`
    : `${activity.minParticipants}-${activity.maxParticipants} 人`;

  const descriptionDisplay = lang === "en" && activity.descriptionEn
    ? activity.descriptionEn
    : activity.description;

  const durationDisplay = lang === "en"
    ? (activity.durationEn || activity.duration)
    : activity.duration;

  const locationDisplay = lang === "en"
    ? (activity.locationEn || activity.location)
    : activity.location;

  return (
    <Link href={activity.slug ? `/activities/${activity.slug}` : `/activities/${activity.id}`}>
      <div className="group flex flex-col h-full bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-border">

        {/* Image / Slider */}
        <div className="relative">
          <ActivityImageSlider images={allImages} title={displayTitle} />

          {/* Badges overlaid on slider */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
            <Badge variant="secondary" className="bg-white text-[#1A2B4A] hover:bg-gray-100 border-none font-bold shadow-sm rounded-md px-3 py-1">
              {categoryLabel}
            </Badge>
          </div>

          {activity.featured && (
            <Badge className="absolute top-4 right-4 z-10 bg-accent text-accent-foreground border-none font-bold shadow-sm rounded-md px-3 py-1 pointer-events-none">
              {featuredLabel}
            </Badge>
          )}

          {allImages.length > 1 && (
            <div className="absolute top-4 right-4 z-10 pointer-events-none">
              {!activity.featured && (
                <span className="bg-black/50 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  {photosLabel}
                </span>
              )}
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4 text-white z-10 pointer-events-none">
            <h3 className="font-display font-bold text-xl mb-1 line-clamp-1 group-hover:text-primary transition-colors drop-shadow-md">
              {displayTitle}
            </h3>
            {lang === "zh" && activity.titleEn && (
              <p className="text-xs font-medium text-white/90 line-clamp-1 uppercase tracking-wider drop-shadow-md">
                {activity.titleEn}
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <p className="text-sm text-foreground/80 line-clamp-2 mb-5 flex-grow">
            {descriptionDisplay}
          </p>

          {/* Meta specs */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="text-xs bg-muted/30 border-border font-medium text-muted-foreground rounded-md">
              {suitableLabel} {targetLabel}
            </Badge>
          </div>

          {activity.finalOutcome && (
            <div className="flex items-start gap-2 py-3 px-3 bg-primary/5 rounded-lg border border-primary/10 mb-3">
              <Trophy className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-primary/80 mb-0.5">
                  {lang === "en" ? (activity.finalOutcomeLabel ?? "Student Outcome") : (activity.finalOutcomeLabel ?? "學生成果")}
                </p>
                <p className="text-xs text-foreground/70 line-clamp-2">{activity.finalOutcome}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-y-3 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-medium">{durationDisplay}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4 text-secondary" />
              <span className="font-medium">{participantsLabel}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground col-span-2">
              <MapPin className="w-4 h-4 text-accent shrink-0" />
              <span className="truncate">{locationDisplay}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
