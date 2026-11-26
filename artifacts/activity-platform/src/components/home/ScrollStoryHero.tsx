/**
 * ScrollStoryHero — GSAP ScrollTrigger scroll-scrubbed video hero
 *
 * Architecture:
 *  - CSS `position: sticky` handles the viewport pinning (avoids GSAP pin jump)
 *  - GSAP ScrollTrigger + scrub: 0.8 drives video.currentTime via a proxy tween
 *  - All opacity/transform updates go straight to the DOM (no React state) so
 *    there are zero re-renders per scroll frame
 *  - prefers-reduced-motion → static poster + step list (no animation, no pin)
 */

import { useRef, useLayoutEffect, useCallback, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "wouter";
import { ArrowRight, ChevronDown, Camera, Award, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gtagEvent } from "@/lib/gtag";
import { WHATSAPP_URL, FOUNDER_EXPERIENCE_YEARS, SCHOOLS_SERVED } from "@/config/business-facts";
import { useSeoSettings } from "@/contexts/SeoSettingsContext";

gsap.registerPlugin(ScrollTrigger);

// ─── Scene data ──────────────────────────────────────────────────────────────
const SCENES = [
  {
    id: 1,
    range: [0, 0.16] as [number, number],
    eyebrowZh: "第一步", eyebrowEn: "Step 1",
    headlineZh: "先學習觀察", headlineEn: "Learn to Observe",
    copyZh: "從校園及日常生活中，發現值得記錄的人、事與故事。",
    copyEn: "Discover the people, events, and stories worth capturing — from school life and everyday moments.",
    rightAlign: false,
    isAI: false,
    captionZh: null as string | null,
    captionEn: null as string | null,
  },
  {
    id: 2,
    range: [0.16, 0.32] as [number, number],
    eyebrowZh: "第二步", eyebrowEn: "Step 2",
    headlineZh: "再用影像記錄", headlineEn: "Capture with Images",
    copyZh: "掌握構圖、光線及拍攝技巧，將觀察轉化成清晰畫面。",
    copyEn: "Master composition, lighting and techniques to turn what you notice into clear images.",
    rightAlign: false,
    isAI: false,
    captionZh: null,
    captionEn: null,
  },
  {
    id: 3,
    range: [0.32, 0.46] as [number, number],
    eyebrowZh: "第三步", eyebrowEn: "Step 3",
    headlineZh: "用問題理解世界", headlineEn: "Ask Questions to Understand",
    copyZh: "透過資料整理、討論及採訪思維，培養表達與溝通能力。",
    copyEn: "Build communication and expression skills through research, discussion and journalistic thinking.",
    rightAlign: false,
    isAI: false,
    captionZh: null,
    captionEn: null,
  },
  {
    id: 4,
    range: [0.46, 0.65] as [number, number],
    eyebrowZh: "第四步", eyebrowEn: "Step 4",
    headlineZh: "將素材變成故事", headlineEn: "Turn Footage into Story",
    copyZh: "由選材、剪接、字幕到聲音設計，建立完整的視覺敘事。",
    copyEn: "From shot selection and editing to subtitles and sound — build a complete visual narrative.",
    rightAlign: true,
    isAI: false,
    captionZh: null,
    captionEn: null,
  },
  {
    id: 5,
    range: [0.65, 0.83] as [number, number],
    eyebrowZh: "第五步", eyebrowEn: "Step 5",
    headlineZh: "用 AI 延伸創意", headlineEn: "Extend Creativity with AI",
    copyZh: "以 AI 作為創作工具，同時學習比較、修改、查證、版權及使用倫理。",
    copyEn: "Use AI as a creative tool while learning to evaluate, edit, verify, respect rights and apply ethics.",
    rightAlign: false,
    isAI: true,
    captionZh: "決定權仍然在學生手上",
    captionEn: "Students retain full creative ownership",
  },
  {
    id: 6,
    range: [0.83, 0.96] as [number, number],
    eyebrowZh: "學習成果", eyebrowEn: "Student Outcomes",
    headlineZh: "由學習技能，到完成作品", headlineEn: "From Skills to Finished Work",
    copyZh: "學生完成攝影作品、校園短片或 AI 數碼故事，並向師生展示成果。",
    copyEn: "Students complete a photography portfolio, campus film, or AI digital story — then present to the whole school.",
    rightAlign: false,
    isAI: false,
    captionZh: null,
    captionEn: null,
  },
] as const;

const CTA_RANGE: [number, number] = [0.96, 1.0];

// ─── Props ───────────────────────────────────────────────────────────────────
interface Props {
  isZh: boolean;
}

// ─── Reduced-motion static fallback ─────────────────────────────────────────
function ReducedMotionHero({ isZh }: Props) {
  const waHref = `${WHATSAPP_URL}?text=${encodeURIComponent(
    isZh ? "想了解攝影及 AI 課程建議" : "Interested in photography and AI course proposals"
  )}`;
  return (
    <section
      aria-labelledby="story-title-static"
      className="relative bg-[#0A1E23] text-white overflow-hidden"
    >
      <img
        src="/images/juntarhk-scroll-poster.webp"
        alt=""
        aria-hidden="true"
        width={1280}
        height={720}
        className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,30,35,0.7) 0%, rgba(10,30,35,0.85) 100%)",
        }}
      />
      <div className="relative z-10 container mx-auto px-6 py-20 md:py-28 max-w-3xl">
        <h1
          id="story-title-static"
          className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4"
        >
          {isZh
            ? "讓學生用影像觀察世界，用 AI 創造作品"
            : "Visual Storytelling and AI Education for HK Schools"}
        </h1>
        <p className="text-white/80 text-lg mb-12 max-w-xl leading-relaxed">
          {isZh
            ? "攝影、校園媒體及 AI 創作課程，可按年級、節數及校本主題訂製。"
            : "Photography, campus media and AI creation courses — tailored to your school's year group, session count and theme."}
        </p>

        <ol className="space-y-7 mb-14">
          {SCENES.map((scene) => (
            <li key={scene.id} className="flex gap-5 items-start">
              <span
                className={[
                  "shrink-0 text-xs font-extrabold tracking-widest uppercase mt-1 px-2.5 py-1 rounded-full border",
                  scene.isAI
                    ? "text-[#E8A020] border-[#E8A020]/40 bg-[#E8A020]/10"
                    : "text-primary border-primary/40 bg-primary/10",
                ].join(" ")}
              >
                {isZh ? scene.eyebrowZh : scene.eyebrowEn}
              </span>
              <div>
                <h2 className="font-bold text-white text-lg leading-snug">
                  {isZh ? scene.headlineZh : scene.headlineEn}
                </h2>
                <p className="text-white/65 text-sm mt-1 leading-relaxed">
                  {isZh ? scene.copyZh : scene.copyEn}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 h-14 text-base font-bold bg-primary text-white hover:bg-primary/90"
          >
            <Link href="/activities">
              {isZh ? "查看學校課程" : "View School Programmes"}{" "}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full px-8 h-14 text-base font-bold border-2 border-white/40 text-white hover:bg-white hover:text-[#1A3D4A] bg-transparent"
          >
            <a href={waHref} target="_blank" rel="noopener noreferrer">
              {isZh ? "WhatsApp 索取課程建議" : "WhatsApp for Course Advice"}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export function ScrollStoryHero({ isZh }: Props) {
  const seoSettings = useSeoSettings();
  const experienceYears = seoSettings["stat_experience_years"] || FOUNDER_EXPERIENCE_YEARS;
  const schoolsServed = seoSettings["stat_schools_served"] || SCHOOLS_SERVED;
  const activityProgrammes = seoSettings["stat_activity_programmes"] || "50+";

  // ── Reduced-motion detection (client-side only) ──
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── Refs ──────────────────────────────────────────
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressCounterRef = useRef<HTMLSpanElement>(null);
  const progressLabelRef = useRef<HTMLSpanElement>(null);
  const mobileDotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const hintHidden = useRef(false);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const statsFooterRef = useRef<HTMLDivElement>(null);
  const finalOverlayRef = useRef<HTMLDivElement>(null);

  // ── Scene/DOM updater (no React state, pure DOM) ──
  const updateScene = useCallback(
    (p: number) => {
      // Hide scroll hint after first scroll movement
      if (!hintHidden.current && p > 0.008 && scrollHintRef.current) {
        hintHidden.current = true;
        gsap.to(scrollHintRef.current, { opacity: 0, duration: 0.4, pointerEvents: "none" });
      }

      // Determine active scene index
      let activeIdx = -1;
      SCENES.forEach((scene, i) => {
        const [s, e] = scene.range;
        if (p >= s && p < e) activeIdx = i;
      });
      if (p >= 0.96) activeIdx = 5; // keep scene 6 label in final CTA

      // Update each scene panel
      SCENES.forEach((scene, i) => {
        const el = sceneRefs.current[i];
        if (!el) return;
        const [s, e] = scene.range;
        const span = e - s;

        let opacity = 0;
        let ty = 20;

        if (p < s) {
          // Before scene
          opacity = 0;
          ty = 20;
        } else if (p >= s && p < e) {
          const fadeInEnd = s + span * 0.22;
          const fadeOutStart = e - span * 0.22;
          if (p < fadeInEnd) {
            const t = (p - s) / (fadeInEnd - s);
            opacity = t;
            ty = (1 - t) * 20;
          } else if (p > fadeOutStart) {
            const t = (p - fadeOutStart) / (e - fadeOutStart);
            opacity = 1 - t;
            ty = 0;
          } else {
            opacity = 1;
            ty = 0;
          }
        } else {
          // After scene
          opacity = 0;
          ty = -8;
        }

        el.style.opacity = String(Math.max(0, Math.min(1, opacity)));
        el.style.transform = `translateY(${ty}px)`;
        el.style.pointerEvents = opacity > 0.4 ? "auto" : "none";
      });

      // Desktop: expand left panel at end of scroll; Mobile: show CTA overlay
      const onDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
      if (onDesktop) {
        // Left panel expands from 360px → 100vw over the final 8% of scroll
        if (leftPanelRef.current) {
          if (p >= 0.92) {
            const t = Math.min((p - 0.92) / 0.08, 1);
            const vw = window.innerWidth;
            leftPanelRef.current.style.width = `${360 + (vw - 360) * t}px`;
          } else {
            leftPanelRef.current.style.width = "360px";
          }
        }
        // Right panel fades out as left panel expands
        if (rightPanelRef.current) {
          if (p >= 0.92) {
            const t = Math.min((p - 0.92) / 0.08, 1);
            rightPanelRef.current.style.opacity = String(1 - t);
          } else {
            rightPanelRef.current.style.opacity = "1";
          }
        }
        // Left panel content + stats footer fade out → centered final overlay fades in
        if (leftContentRef.current && finalOverlayRef.current) {
          if (p >= 0.92) {
            const t = Math.min((p - 0.92) / 0.08, 1);
            leftContentRef.current.style.opacity = String(1 - t);
            if (statsFooterRef.current) statsFooterRef.current.style.opacity = String(1 - t);
            finalOverlayRef.current.style.opacity = String(t);
            finalOverlayRef.current.style.pointerEvents = t > 0.5 ? "auto" : "none";
          } else {
            leftContentRef.current.style.opacity = "1";
            if (statsFooterRef.current) statsFooterRef.current.style.opacity = "1";
            finalOverlayRef.current.style.opacity = "0";
            finalOverlayRef.current.style.pointerEvents = "none";
          }
        }
        // CTA panel suppressed on desktop (CTA always visible in left panel)
        if (ctaRef.current) {
          ctaRef.current.style.opacity = "0";
          ctaRef.current.style.pointerEvents = "none";
        }
      } else {
        // Mobile: existing CTA overlay
        if (ctaRef.current) {
          const [cs] = CTA_RANGE;
          if (p >= cs) {
            const t = Math.min((p - cs) / (1 - cs), 1);
            ctaRef.current.style.opacity = String(t);
            ctaRef.current.style.transform = `translateY(${(1 - t) * 20}px)`;
            ctaRef.current.style.pointerEvents = t > 0.3 ? "auto" : "none";
          } else {
            ctaRef.current.style.opacity = "0";
            ctaRef.current.style.transform = "translateY(20px)";
            ctaRef.current.style.pointerEvents = "none";
          }
        }
      }

      // Desktop progress counter + label
      const displayIdx = Math.max(0, activeIdx);
      if (progressCounterRef.current) {
        progressCounterRef.current.textContent = `0${displayIdx + 1}`;
      }
      if (progressLabelRef.current) {
        const scene = SCENES[displayIdx];
        if (scene) {
          progressLabelRef.current.textContent = isZh
            ? scene.headlineZh
            : scene.headlineEn;
        }
      }
      // Desktop vertical fill bar (covers scenes 0-0.96)
      if (progressBarRef.current) {
        const fill = Math.min(p / 0.96, 1) * 100;
        progressBarRef.current.style.height = `${fill}%`;
      }

      // Mobile dots
      mobileDotRefs.current.forEach((dot, i) => {
        if (!dot) return;
        dot.style.background =
          i === displayIdx ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)";
        dot.style.transform = i === displayIdx ? "scale(1.4)" : "scale(1)";
      });
    },
    [isZh]
  );

  // ── GSAP ScrollTrigger setup ──────────────────────
  useLayoutEffect(() => {
    if (reducedMotion) return;

    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const ctx = gsap.context(() => {
      const proxy = { t: 0 };

      const setup = () => {
        const dur = video.duration || 10.005;

        gsap.to(proxy, {
          t: dur,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate(self) {
              // Use readyState >= 1 so iOS seeks as soon as metadata exists
              if (video.readyState >= 1) {
                video.currentTime = proxy.t;
              }
              updateScene(self.progress);
            },
          },
        });

        // Refresh after all assets settle
        ScrollTrigger.refresh();
        window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
      };

      // ── iOS Safari fix ───────────────────────────────────────────────────
      // iOS ignores preload="auto" and won't fire loadedmetadata until play()
      // is called. Muted + playsInline videos are allowed to play without a
      // user gesture on iOS 10+, so we immediately play→pause to force the
      // browser to load video metadata and enable currentTime seeking.
      video
        .play()
        .then(() => {
          video.pause();
          video.currentTime = 0;
        })
        .catch(() => {
          // AbortError or NotAllowedError — fall through to event listener
        });

      if (video.readyState >= 1) {
        setup();
      } else {
        video.addEventListener("loadedmetadata", setup, { once: true });
      }
    }, section);

    return () => ctx.revert();
  }, [reducedMotion, updateScene]);

  // ── Early return for reduced motion ──────────────
  if (reducedMotion) return <ReducedMotionHero isZh={isZh} />;

  const waHref = `${WHATSAPP_URL}?text=${encodeURIComponent(
    isZh ? "想了解攝影及 AI 課程建議" : "Interested in photography and AI course proposals"
  )}`;

  return (
    <>
      {/*
       * Outer section is tall to provide scroll travel.
       * Heights:   mobile 500vh  |  tablet 580vh  |  desktop 650vh
       * The inner sticky div stays at 100svh for the entire scroll.
       */}
      <section
        ref={sectionRef}
        aria-labelledby="scroll-story-title"
        className="relative h-[500vh] md:h-[580vh] lg:h-[650vh]"
      >
        {/* ── Hidden H1 always in DOM for SEO ── */}
        <h1 id="scroll-story-title" className="sr-only">
          {isZh
            ? "讓學生用影像觀察世界，用 AI 創造作品"
            : "Visual Storytelling and AI Education for Hong Kong Schools"}
        </h1>

        {/* ── Sticky pinned viewport ── */}
        <div
          className="sticky top-0 w-full overflow-hidden"
          style={{ height: "100svh", minHeight: "100vh" }}
        >
          {/* ══════════════════════════════════════════
              LEFT PANEL — absolutely positioned, fixed 360px
          ══════════════════════════════════════════ */}
          <div
            ref={leftPanelRef}
            className="hidden md:flex absolute left-0 top-0 h-full flex-col overflow-hidden"
            style={{ width: "360px", background: "#1A3D4A", zIndex: 30 }}
            aria-hidden="true"
          >
            {/* Radial glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 90% 60% at 15% 115%, rgba(61,139,137,0.20) 0%, transparent 70%)" }}
            />
            {/* Split divider line */}
            <div
              className="absolute right-0 top-0 h-full w-px pointer-events-none"
              style={{ background: "linear-gradient(to bottom, transparent, rgba(61,139,137,0.45), transparent)" }}
            />

            {/* ── Main content — spacer guarantees eyebrow always clears fixed navbar ── */}
            <div ref={leftContentRef} className="relative z-10 flex-1 flex flex-col px-12">
              {/* Fixed-height spacer = navbar height (py-4×2 + h-16) = 96px + 8px breathing room */}
              <div className="shrink-0" style={{ height: 104 }} />
              <div className="flex-1 flex flex-col justify-center">
              {/* Eyebrow */}
              <div className="flex items-center gap-[10px] mb-[22px]">
                <div className="w-7 h-[2px] rounded-full bg-primary" />
                <span className="text-[10.5px] font-extrabold tracking-[0.13em] uppercase text-primary">
                  {isZh ? "香港中小學課程合作夥伴" : "Hong Kong School Programme Partner"}
                </span>
              </div>

              {/* Headline — 42px to match prototype */}
              <p
                className="font-display font-black text-white leading-[1.12] tracking-[-0.03em] mb-[18px]"
                style={{ fontSize: 42 }}
              >
                {isZh
                  ? <>讓學生用影像<br />觀察世界，<br />用 AI 創造作品</>
                  : <>Visual Storytelling<br />and AI Education<br />for HK Schools</>}
              </p>

              {/* Sub-copy */}
              <p className="text-[14.5px] leading-[1.75] mb-8 max-w-[280px]" style={{ color: "rgba(255,255,255,0.58)" }}>
                {isZh
                  ? "攝影、校園媒體及 AI 創作課程，可按年級、節數及校本主題訂製。"
                  : "Photography, campus media and AI creation — tailored to your school's year group and theme."}
              </p>

              {/* CTAs */}
              <div className="flex flex-col gap-3 mb-10">
                <button
                  className="rounded-full flex items-center gap-2 w-fit text-white font-bold text-[14px] cursor-pointer"
                  style={{ background: "#3D8B89", border: "none", padding: "14px 28px" }}
                  onClick={() => { gtagEvent("split_hero_cta_click", { cta: "view_programmes" }); window.location.href = "/activities"; }}
                >
                  {isZh ? "查看學校課程" : "View School Programmes"}
                  <ArrowRight className="w-4 h-4 opacity-70" />
                </button>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full w-fit text-white font-bold text-[14px] cursor-pointer no-underline flex items-center"
                  style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.28)", padding: "13px 28px" }}
                  onClick={() => gtagEvent("whatsapp_click", { source: "split_hero_left" })}
                >
                  {isZh ? "💬 WhatsApp 索取課程建議" : "💬 WhatsApp for Course Advice"}
                </a>
              </div>

              {/* USP bullets */}
              <div className="border-t border-white/[0.09] pt-7">
                {([
                  { Icon: Award,        zh: "逾十年攝影及教育經驗",           en: "10+ years photography & education" },
                  { Icon: CheckCircle2, zh: "課程按學校年級及主題全面訂製",     en: "Tailored to your school" },
                  { Icon: Camera,       zh: "每個課程以真實學生作品為目標",     en: "Real student work every time" },
                  { Icon: ShieldCheck,  zh: "具資格及查核導師 · 公眾責任保險", en: "Qualified instructors · Insurance" },
                ] as const).map(({ Icon, zh, en }, i, arr) => (
                  <div key={i} className="flex items-center gap-3" style={{ marginBottom: i < arr.length - 1 ? 13 : 0 }}>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "rgba(61,139,137,0.15)" }}
                    >
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-[12.5px] font-medium leading-snug" style={{ color: "rgba(255,255,255,0.60)" }}>
                      {isZh ? zh : en}
                    </span>
                  </div>
                ))}
              </div>
              </div>{/* closes flex-1 justify-center inner wrapper */}
            </div>{/* closes leftContentRef */}

            {/* ── Stats footer ── */}
            <div
              ref={statsFooterRef}
              className="relative z-10 flex shrink-0 gap-8 border-t border-white/[0.07]"
              style={{ padding: "18px 48px 24px" }}
            >
              {[
                { value: experienceYears, label: isZh ? "年攝影及教育經驗" : "yrs experience" },
                { value: activityProgrammes, label: isZh ? "活動課程" : "programmes" },
                { value: schoolsServed, label: isZh ? "所學校" : "schools served" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-[24px] font-light leading-none mb-1" style={{ color: "rgba(255,255,255,0.82)" }}>{s.value}</div>
                  <div className="text-[9.5px] font-bold tracking-[0.1em] uppercase" style={{ color: "rgba(255,255,255,0.32)" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* ── Final centered overlay — fades in as panel expands to full width ── */}
            <div
              ref={finalOverlayRef}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
              style={{ zIndex: 40, opacity: 0, pointerEvents: "none" }}
              aria-hidden="true"
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-[10px] mb-5 justify-center">
                <div className="w-7 h-[2px] rounded-full bg-primary" />
                <span className="text-[10.5px] font-extrabold tracking-[0.13em] uppercase text-primary">
                  {isZh ? "香港中小學課程合作夥伴" : "Hong Kong School Programme Partner"}
                </span>
                <div className="w-7 h-[2px] rounded-full bg-primary" />
              </div>

              {/* Big centered headline */}
              <p
                className="font-display font-black text-white leading-[1.1] tracking-[-0.03em] mb-5 max-w-2xl"
                style={{ fontSize: "clamp(42px, 4vw, 64px)" }}
              >
                {isZh
                  ? <>讓學生用影像<br />觀察世界，<br />用 AI 創造作品</>
                  : <>Visual Storytelling<br />and AI Education<br />for HK Schools</>}
              </p>

              {/* Sub-copy */}
              <p className="text-[15px] leading-[1.75] mb-10 max-w-md" style={{ color: "rgba(255,255,255,0.58)" }}>
                {isZh
                  ? "攝影、校園媒體及 AI 創作課程，可按年級、節數及校本主題訂製。"
                  : "Photography, campus media and AI creation — tailored to your school's year group and theme."}
              </p>

              {/* CTAs side by side */}
              <div className="flex flex-row gap-3 justify-center">
                <button
                  className="rounded-full flex items-center gap-2 text-white font-bold text-[14px] cursor-pointer"
                  style={{ background: "#3D8B89", border: "none", padding: "14px 32px" }}
                  onClick={() => { gtagEvent("split_hero_final_cta", { cta: "view_programmes" }); window.location.href = "/activities"; }}
                >
                  {isZh ? "查看學校課程" : "View School Programmes"}
                  <ArrowRight className="w-4 h-4 opacity-70" />
                </button>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full text-white font-bold text-[14px] cursor-pointer no-underline flex items-center"
                  style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.28)", padding: "13px 32px" }}
                  onClick={() => gtagEvent("whatsapp_click", { source: "split_hero_final" })}
                >
                  {isZh ? "💬 WhatsApp 索取課程建議" : "💬 WhatsApp for Course Advice"}
                </a>
              </div>

              {/* Stats row — centred, replaces the bottom-left footer */}
              <div className="flex gap-12 mt-10 pt-8 border-t border-white/[0.10]">
                {[
                  { value: experienceYears, label: isZh ? "年攝影及教育經驗" : "yrs experience" },
                  { value: activityProgrammes, label: isZh ? "活動課程" : "programmes" },
                  { value: schoolsServed, label: isZh ? "所學校" : "schools served" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-[28px] font-light leading-none mb-1" style={{ color: "rgba(255,255,255,0.85)" }}>{s.value}</div>
                    <div className="text-[10px] font-bold tracking-[0.1em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* ══════════════════════════════════════════
              RIGHT PANEL — absolute, starts at 360px on desktop.
              Video is scoped here so object-cover centres naturally.
          ══════════════════════════════════════════ */}
          <div
            ref={rightPanelRef}
            className="absolute inset-0 md:left-[360px] overflow-hidden"
          >
            {/* Video — scoped to right panel: object-cover centres correctly */}
            <video
              ref={videoRef}
              aria-hidden="true"
              muted
              playsInline
              preload="auto"
              poster="/images/juntarhk-scroll-poster.webp"
              width={1280}
              height={720}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{ zIndex: 0 }}
            >
              <source src="/videos/juntarhk-scroll-story-optimised.mp4" type="video/mp4" />
              <source src="/videos/juntarhk-scroll-story.mp4" type="video/mp4" />
            </video>

            {/* Base overlay */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                zIndex: 1,
                background: [
                  "linear-gradient(to right, rgba(10,30,35,0.55) 0%, rgba(10,30,35,0.25) 55%, rgba(10,30,35,0.10) 100%)",
                  "linear-gradient(to bottom, rgba(10,30,35,0.35) 0%, transparent 30%, transparent 60%, rgba(10,30,35,0.65) 100%)",
                ].join(", "),
              }}
            />

            {/* ── Scene panels — scoped to right panel, no offset hack needed ── */}
            {SCENES.map((scene, i) => (
              <div
                key={scene.id}
                aria-hidden="true"
                ref={(el) => { sceneRefs.current[i] = el; }}
                className={[
                  "absolute inset-0 flex flex-col",
                  "justify-end pb-[190px] px-5",
                  scene.rightAlign
                    ? "md:justify-center md:pb-0 md:px-0 md:items-end md:pr-10"
                    : "md:justify-center md:pb-0 md:px-0 md:items-start md:pl-10",
                ].join(" ")}
                style={{ zIndex: 10, opacity: 0, transform: "translateY(20px)", willChange: "opacity, transform", pointerEvents: "none", transition: "none" }}
              >
                <div className={scene.rightAlign ? "md:max-w-md md:text-right" : "md:max-w-md"}>
                  <span
                    className={[
                      "inline-block text-xs font-extrabold tracking-widest uppercase mb-3 px-3 py-1.5 rounded-full border",
                      scene.isAI
                        ? "text-[#E8A020] border-[#E8A020]/50 bg-[#E8A020]/10"
                        : "text-primary border-primary/50 bg-primary/10",
                    ].join(" ")}
                  >
                    {isZh ? scene.eyebrowZh : scene.eyebrowEn}
                  </span>
                  <h2
                    className="font-display font-extrabold text-white leading-[1.1] mb-[10px] drop-shadow-md text-2xl sm:text-4xl"
                    style={{ letterSpacing: "-0.02em", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
                  >
                    <span className="md:hidden">{isZh ? scene.headlineZh : scene.headlineEn}</span>
                    <span className="hidden md:inline" style={{ fontSize: 34 }}>{isZh ? scene.headlineZh : scene.headlineEn}</span>
                  </h2>
                  <p
                    className="text-white/85 text-sm sm:text-base leading-relaxed font-medium max-w-sm md:max-w-full md:text-[14px] md:leading-[1.65]"
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
                  >
                    {isZh ? scene.copyZh : scene.copyEn}
                  </p>
                  {scene.captionZh && (
                    <p className="mt-3 text-sm font-semibold text-[#E8A020]/90">
                      {isZh ? scene.captionZh : scene.captionEn}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* ── Final CTA panel (mobile only — desktop always sees left panel CTA) ── */}
            <div
              ref={ctaRef}
              className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
              style={{ zIndex: 20, opacity: 0, transform: "translateY(20px)", pointerEvents: "none", willChange: "opacity, transform" }}
            >
              <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: "rgba(10,30,35,0.70)", zIndex: 0 }} />
              <div className="relative z-10 max-w-2xl w-full">
                <p className="font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg" aria-hidden="true">
                  {isZh ? "讓學生用影像觀察世界，用 AI 創造作品" : "Visual Storytelling and AI Education for HK Schools"}
                </p>
                <p className="text-white/85 text-base mb-8 max-w-xl mx-auto leading-relaxed">
                  {isZh ? "攝影、校園媒體及 AI 創作課程，可按年級、節數及校本主題訂製。" : "Photography, campus media and AI creation courses — tailored by year group, session count and school theme."}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild size="lg" className="rounded-full px-8 h-14 text-base font-bold shadow-xl bg-primary text-white hover:bg-primary/90 transition-all"
                    onClick={() => gtagEvent("scroll_story_cta_click", { cta: "view_programmes" })}>
                    <Link href="/activities">{isZh ? "查看學校課程" : "View School Programmes"} <ArrowRight className="ml-2 w-5 h-5" /></Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-full px-8 h-14 text-base font-bold border-2 border-white/40 text-white hover:bg-white hover:text-[#1A3D4A] bg-transparent transition-all"
                    onClick={() => gtagEvent("whatsapp_click", { source: "scroll_story_cta" })}>
                    <a href={waHref} target="_blank" rel="noopener noreferrer">{isZh ? "WhatsApp 索取課程建議" : "WhatsApp for Course Advice"}</a>
                  </Button>
                </div>
              </div>
            </div>

            {/* ── Desktop progress indicator (right edge of right panel) ── */}
            <div
              className="hidden md:flex absolute right-7 top-1/2 -translate-y-1/2 flex-col items-center gap-2"
              style={{ zIndex: 20 }}
              aria-hidden="true"
            >
              <span ref={progressCounterRef} className="font-display text-white font-bold text-sm tabular-nums leading-none">01</span>
              <span className="text-white/40 text-xs font-bold leading-none">/ 06</span>
              <div className="relative w-[2px] h-20 bg-white/20 rounded-full overflow-hidden mt-0.5">
                <div ref={progressBarRef} className="absolute top-0 left-0 w-full bg-primary rounded-full" style={{ height: "0%", transition: "height 0.08s linear" }} />
              </div>
              <span ref={progressLabelRef} className="text-white/55 text-[10px] font-semibold mt-0.5 max-w-[72px] text-center leading-snug" />
            </div>

            {/* ── Mobile progress dots ── */}
            <div className="flex md:hidden absolute bottom-[100px] left-1/2 -translate-x-1/2 gap-2 items-center" style={{ zIndex: 20 }} aria-hidden="true">
              {SCENES.map((_, i) => (
                <div key={i} ref={(el) => { mobileDotRefs.current[i] = el; }} className="w-1.5 h-1.5 rounded-full"
                  style={{ background: i === 0 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)", transition: "background 0.3s, transform 0.3s" }} />
              ))}
            </div>

            {/* ── Scroll hint ── */}
            <div
              ref={scrollHintRef}
              className="absolute bottom-[135px] md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none select-none"
              style={{ zIndex: 20 }}
              aria-label={isZh ? "向下滾動，觀看學生由觀察到創作的過程" : "Scroll down to follow students' creative journey"}
            >
              <span className="text-white/60 text-[11px] font-medium text-center max-w-[180px] leading-relaxed">
                {isZh ? "向下滾動，觀看學生由觀察到創作的過程" : "Scroll to follow the students' creative journey"}
              </span>
              <ChevronDown aria-hidden="true" className="w-4 h-4 text-white/50 animate-bounce" />
            </div>
          </div>
        </div>

        {/* ── SEO / a11y: crawlable text always in DOM ── */}
        <div className="sr-only">
          {SCENES.map((scene) => (
            <div key={scene.id}>
              <h2>{isZh ? scene.headlineZh : scene.headlineEn}</h2>
              <p>{isZh ? scene.copyZh : scene.copyEn}</p>
            </div>
          ))}
          <p>
            {isZh
              ? "攝影、校園媒體及 AI 創作課程，可按年級、節數及校本主題訂製。"
              : "Photography, campus media and AI creation courses tailored to your school."}
          </p>
        </div>
      </section>
    </>
  );
}
