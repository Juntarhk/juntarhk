import { useState, useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";
import { useSeoSettings } from "@/contexts/SeoSettingsContext";
import {
  ArrowRight, Camera, ShieldCheck, FileText, School,
  Sparkles, Mountain, Video, Award, CheckCircle2,
  ChevronLeft, ChevronRight, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { HowItWorksTimeline } from "@/components/home/HowItWorksTimeline";
import { MobileStickyCTA } from "@/components/home/MobileStickyCTA";
import { ScrollStoryHero } from "@/components/home/ScrollStoryHero";
import { ProgrammeCard } from "@/components/home/ProgrammeCard";
import { PROGRAMMES } from "@/data/programmes-data";
import { InlineEnquiryForm } from "@/components/InlineEnquiryForm";
import { gtagEvent } from "@/lib/gtag";
import {
  SCHOOLS_SERVED,
  FOUNDER_EXPERIENCE_YEARS,
  WHATSAPP_URL,
  FUNDING_DISCLAIMER_ZH,
  FUNDING_DISCLAIMER_EN,
} from "@/config/business-facts";

// ─── Gallery photos (8 images, photography/media/AI subjects prioritised) ───

// ─── Gallery photos (8 images, photography/media/AI subjects prioritised) ───
const GALLERY_PHOTOS = [
  { src: "/event-photo-03.jpg", alt: "學生攝影課程實拍練習，JuntarHK 到校" },
  { src: "/event-photo-07.jpg", alt: "校園媒體製作課堂現場" },
  { src: "/event-photo-13.jpg", alt: "JuntarHK 導師帶領課程" },
  { src: "/event-photo-16.jpg", alt: "學生拍攝校慶活動花絮" },
  { src: "/event-photo-18.jpg", alt: "影片製作課程學生作品分享" },
  { src: "/event-photo-23.jpg", alt: "JuntarHK 視覺教育課程" },
  { src: "/event-photo-01.jpg", alt: "師生互動攝影工作坊" },
  { src: "/event-photo-05.jpg", alt: "課程成果展示現場" },
];

// ─── Student outcomes (4 items) ──────────────────────────────────────────────
const OUTCOMES = [
  {
    icon: Camera,
    zh: "校園攝影作品集",
    en: "School Photography Portfolio",
    descZh: "學生親自拍攝並策展的精選相冊，展示真實的視覺敘事能力",
    descEn: "Curated photo albums shot and edited by students, showcasing real visual storytelling",
  },
  {
    icon: Video,
    zh: "校園主題短片",
    en: "Campus Theme Short Film",
    descZh: "從故事策劃到拍攝剪接的完整影片作品，學生全程參與製作",
    descEn: "Complete videos from concept to edit — students are involved in every production step",
  },
  {
    icon: Sparkles,
    zh: "AI 動畫或數碼故事",
    en: "AI Animation or Digital Story",
    descZh: "結合 AI 工具的原創數碼作品，展現學生的創意及 AI 素養",
    descEn: "Original AI-assisted digital work that demonstrates student creativity and AI literacy",
  },
  {
    icon: Award,
    zh: "校內作品展及成果分享",
    en: "School Exhibition & Showcase",
    descZh: "學生策劃並主持成果展，向全校師生展示課程學習成果",
    descEn: "Students plan and host a school showcase, presenting their work to the whole school",
  },
];

export default function Home() {
  const { t, lang } = useLanguage();
  const seoSettings = useSeoSettings();
  const h = t.home;
  const isZh = lang === "zh";

  // Gallery state
  const [galleryIndex, setGalleryIndex] = useState(0);
  const GALLERY_VISIBLE = 4; // 4 at a time on desktop
  const totalPages = Math.ceil(GALLERY_PHOTOS.length / GALLERY_VISIBLE);
  const galleryStart = galleryIndex * GALLERY_VISIBLE;
  const visiblePhotos = GALLERY_PHOTOS.slice(galleryStart, galleryStart + GALLERY_VISIBLE);
  const prevGallery = () => setGalleryIndex(i => Math.max(0, i - 1));
  const nextGallery = () => setGalleryIndex(i => Math.min(totalPages - 1, i + 1));

  return (
    <AppLayout>
      <SEO
        title={lang === "en"
          ? (seoSettings["seo_page_home_title_en"] || "JuntarHK | Photography, School Media & AI Education Courses for HK Schools")
          : (seoSettings["seo_page_home_title_zh"] || "JuntarHK｜學校攝影、校園媒體及AI教育課程")}
        description={lang === "en"
          ? (seoSettings["seo_page_home_description_en"] || "Specialist school programme partner for Hong Kong primary and secondary schools. Photography, video production, campus media and AI creation courses — from skills training to finished student work.")
          : (seoSettings["seo_page_home_description_zh"] || "JuntarHK 為香港學校提供攝影教育、校園媒體及 AI 創作課程，包括校園電視台、手機攝影、AI動畫等，由技能訓練到完成學生作品。")}
        keywords={seoSettings["seo_page_home_keywords"] || "校園電視台,攝影課程,AI教育,學生作品,校園媒體,JuntarHK"}
        path="/"
        lang={lang}
      />

      {/* ── 1. Hero — scroll-scrubbed video story ───────────────────────────── */}
      <ScrollStoryHero isZh={isZh} />

      {/* ── 2. Trust bar ────────────────────────────────────────────────────── */}
      <section className="bg-[#FAF7F2] relative z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl shadow-black/5 -mt-10 p-5 md:p-7 border border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0 divide-y sm:divide-y-0 sm:divide-x-0 lg:divide-x divide-border">
              {[
                { icon: Camera, label: isZh ? `${FOUNDER_EXPERIENCE_YEARS} 年攝影及教育經驗` : `${FOUNDER_EXPERIENCE_YEARS} years photography & education` },
                { icon: School, label: isZh ? "曾服務本港多所學校及機構" : "Hong Kong schools & organisations served" },
                { icon: CheckCircle2, label: isZh ? "校本訂製課程" : "School-tailored programmes" },
                { icon: ShieldCheck, label: isZh ? "按活動性質安排具資格及查核導師" : "Qualified, background-checked instructors" },
                { icon: FileText, label: isZh ? "公眾責任保險" : "Public liability insurance" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 lg:py-2 justify-start lg:justify-center">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4.5 h-4.5 text-primary w-5 h-5" />
                    </div>
                    <span className="font-semibold text-foreground text-sm leading-tight">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Three service pillars ────────────────────────────────────────── */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#1A3D4A] mb-3">
              {isZh ? "三大服務範疇" : "Three Service Areas"}
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              {isZh ? "所有課程均可按學校目標及學生年級度身訂製" : "All programmes can be tailored to your school's goals and student levels"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pillar 1 — Photography (dominant) */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex">
              <div className="bg-primary text-white rounded-3xl p-8 flex flex-col h-full w-full shadow-lg shadow-primary/20 relative overflow-hidden group hover:shadow-xl transition-all">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6 border border-white/20">
                  <Camera className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display text-2xl font-extrabold mb-3">{isZh ? "影像及校園媒體" : "Photography & School Media"}</h3>
                <p className="text-white/80 text-sm font-medium leading-relaxed mb-4 flex-1">
                  {isZh
                    ? "由觀察、拍攝、採訪到剪接，培養學生的視覺敘事、媒體素養及表達能力。"
                    : "From observation to filming, interviewing and editing — building students' visual storytelling, media literacy and communication skills."}
                </p>
                <ul className="text-white/70 text-xs space-y-1.5 mb-6">
                  {[
                    isZh ? "攝影作品集" : "Photography portfolio",
                    isZh ? "校園新聞或主題短片" : "Campus news or themed short film",
                    isZh ? "校園媒體製作經驗" : "School media production experience",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 shrink-0 text-white/50" />{item}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="w-full bg-white text-primary border-none hover:bg-white/90 h-11 rounded-xl font-bold">
                  <Link href="/activities?category=visual-media-creation" onClick={() => gtagEvent("pillar_click", { pillar: "photography" })}>
                    {isZh ? "查看攝影及校園媒體課程" : "Browse Photography & School Media"} <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Pillar 2 — AI (dominant) */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="flex">
              <div className="bg-[#1A3D4A] text-white rounded-3xl p-8 flex flex-col h-full w-full shadow-lg shadow-[#1A3D4A]/20 relative overflow-hidden group hover:shadow-xl transition-all">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6 border border-white/10">
                  <Sparkles className="w-7 h-7 text-[#E8A020]" />
                </div>
                <h3 className="font-display text-2xl font-extrabold mb-3">{isZh ? "AI 教育及創作" : "AI Education & Creation"}</h3>
                <p className="text-white/70 text-sm font-medium leading-relaxed mb-4 flex-1">
                  {isZh
                    ? "由AI溝通、資料查證到動畫及數碼故事創作，讓學生由工具使用者成為具判斷力的創作者。"
                    : "From AI communication and fact-checking to animation and digital storytelling — transforming students from tool users into critical, creative thinkers."}
                </p>
                <ul className="text-white/50 text-xs space-y-1.5 mb-6">
                  {[
                    isZh ? "AI 創作作品集" : "AI creation portfolio",
                    isZh ? "AI 動畫或數碼故事" : "AI animation or digital story",
                    isZh ? "批判思考及 AI 素養" : "Critical thinking & AI literacy",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 shrink-0 text-[#E8A020]/60" />{item}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="w-full bg-[#E8A020] text-[#1A3D4A] border-none hover:bg-[#E8A020]/90 h-11 rounded-xl font-bold">
                  <Link href="/activities?category=ai-campus-courses" onClick={() => gtagEvent("pillar_click", { pillar: "ai_education" })}>
                    {isZh ? "查看AI教育及創作課程" : "Browse AI Education & Creation"} <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Pillar 3 — Adventure (secondary) */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex">
              <div className="bg-white border border-border text-foreground rounded-3xl p-8 flex flex-col h-full w-full hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-6">
                  <Mountain className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-extrabold mb-3">{isZh ? "中華文化、歷奇及體驗學習" : "Chinese Culture, Adventure & Experiential Learning"}</h3>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8 flex-1">
                  {isZh
                    ? "配合學校活動日、價值觀教育及跨學科學習需要，提供可訂製的文化及體驗課程。"
                    : "Flexible cultural and experiential programmes for school activity days, values education and cross-subject learning needs."}
                </p>
                <Link href="/activities" className="text-primary font-bold inline-flex items-center text-sm hover:text-primary/80 transition-colors" onClick={() => gtagEvent("pillar_click", { pillar: "adventure" })}>
                  {isZh ? "瀏覽其他課程" : "Browse Other Programmes"} <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Corporate offer remains secondary to the school-focused service pillars. */}
      <section className="bg-[#FAF7F2] pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="relative overflow-hidden rounded-2xl border border-[#162033]/15 bg-[#0B1220] px-6 py-8 md:px-10 md:py-9 text-white">
            <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(76,154,255,0.18),transparent_70%)]" aria-hidden="true" />
            <div className="relative flex flex-col md:flex-row md:items-center gap-7">
              <div className="flex-1">
                <p className="mb-2 text-xs font-bold tracking-[0.18em] uppercase text-[#4C9AFF]">
                  JuntarHK Corporate Experiences
                </p>
                <h2 className="font-display text-2xl font-extrabold mb-3">
                  {isZh ? "企業 Team Building及團隊培訓" : "Corporate Team Building & Training"}
                </h2>
                <p className="max-w-3xl text-sm md:text-base leading-relaxed text-white/68">
                  {isZh
                    ? "為企業及機構設計具主題、具目標，並能連結日常工作嘅體驗式Team Building，涵蓋團隊溝通、角色分工、共同目標及領導協作。"
                    : "Purposeful experiential team building for companies and organisations, connecting communication, role clarity, shared goals and leadership collaboration to everyday work."}
                </p>
              </div>
              <Link
                href="/corporate-team-building"
                onClick={() => gtagEvent("corporate_teaser_click", { source: "home_services" })}
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-[#FF8A3D] px-6 py-3 text-sm font-extrabold text-[#0B1220] transition hover:bg-[#ff9d5f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {isZh ? "查看企業案例及方案" : "View Corporate Cases & Solutions"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Featured programmes ──────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-14">
            <span className="inline-block bg-primary/10 text-primary font-semibold text-xs px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">
              {isZh ? "精選課程" : "Featured Programmes"}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#1A3D4A] mb-3">
              {isZh ? "精選作品導向課程" : "Featured Output-Driven Programmes"}
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              {isZh ? "由技能訓練到完成學生作品，以下課程可按年級、節數及校本主題訂製。" : "From skills training to finished student work — each programme can be tailored by grade, sessions and school theme."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROGRAMMES.filter(p => p.featured).map((prog, i) => (
              <ProgrammeCard key={prog.slug} data={prog} index={i} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 h-12 font-bold border-[#1A3D4A] text-[#1A3D4A] hover:bg-[#1A3D4A]/5">
              <Link href="/activities">
                {isZh ? "瀏覽完整課程目錄" : "Browse Full Programme Catalogue"} <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── 5. Secondary adventure banner ───────────────────────────────────── */}
      <section className="py-12 bg-[#FAF7F2] border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-white rounded-2xl p-6 md:p-8 border border-border shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center shrink-0">
              <Mountain className="w-7 h-7 text-muted-foreground" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-bold text-foreground text-lg mb-1">
                {isZh ? "歷奇訓練、中華文化及新興運動" : "Adventure Training, Chinese Culture & Emerging Sports"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isZh
                  ? "飛索、繩網陣、中華文化嘉年華、新興運動——可到校或於 Bula Land 自家營地舉辦。"
                  : "Zip-lines, ropes courses, Chinese culture carnivals, emerging sports — on-school or at our own Bula Land campsite."}
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-full px-6 h-11 font-bold border-border text-foreground hover:bg-muted/50 shrink-0">
              <Link href="/activities">
                {isZh ? "瀏覽所有活動" : "Browse All Activities"} <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── 6. Student outcomes (4 items) ───────────────────────────────────── */}
      <section className="py-24 bg-[#FAF7F2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#1A3D4A] mb-3">
              {isZh ? "學生可以完成的成果" : "What Students Can Create"}
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              {isZh ? "每個課程均以真實學生成品為目標" : "Every programme ends with a real, tangible student output"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {OUTCOMES.map((outcome, i) => {
              const Icon = outcome.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex flex-col gap-4 p-6 rounded-2xl bg-white border border-border hover:border-primary/20 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2 text-base group-hover:text-primary transition-colors">
                      {isZh ? outcome.zh : outcome.en}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {isZh ? outcome.descZh : outcome.descEn}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 7. Case study placeholder ───────────────────────────────────────── */}
      <section className="py-20 bg-[#1A3D4A] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-10">
            <span className="inline-block bg-white/10 text-white/70 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
              {isZh ? "學校案例" : "School Case Study"}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold">
              {isZh ? "學校如何善用 JuntarHK 課程" : "How Schools Use JuntarHK Programmes"}
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/10 rounded-2xl p-8 border border-white/20 mb-8"
          >
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">
              {isZh ? "案例資料已匿名處理" : "Case details anonymised"}
            </p>
            <p className="text-lg text-white/90 leading-relaxed mb-4">
              {isZh
                ? "某本港中學引入校園電視台訓練課程，學生完成採訪及製作校慶紀錄短片，並於全校師生面前播放。"
                : "A Hong Kong secondary school introduced a campus TV training programme. Students completed an anniversary documentary that was screened school-wide."}
            </p>
            <p className="text-base text-white/70 leading-relaxed">
              {isZh
                ? "校方反映學生在參與度、表達能力及自信心各方面均有所進步。"
                : "Teachers reported positive development in student engagement, communication skills and confidence."}
            </p>
          </motion.div>

          <div className="text-center">
            <Button asChild variant="outline" className="rounded-full px-8 h-12 border-white/30 text-white hover:bg-white/10 font-bold bg-transparent">
              <Link href="/case-studies">
                {isZh ? "查看更多學校案例" : "View More School Case Studies"} <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── 8. Founder intro (concise) ──────────────────────────────────────── */}
      <section className="py-16 bg-[#FAF7F2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-5 text-center">
              {isZh ? "關於創辦人" : "About the Founder"}
            </h2>
            <div className="bg-white p-8 rounded-3xl border border-border shadow-sm">
              <p className="text-base md:text-lg text-foreground font-medium leading-relaxed relative">
                <span className="absolute -top-3 -left-1 text-5xl text-primary/10 font-serif select-none">"</span>
                <span className="relative">
                  {isZh
                    ? "JuntarHK 由 Kingston Chan（KC）創辦。KC 為恒生大學攝影學會創辦人，擁有逾十年攝影及教育經驗，曾於 2014 年入圍國家地理攝影大賽決賽，並於 2015 年獲得會德豐香港攝影大賽縮時攝影組亞軍。"
                    : "JuntarHK was founded by Kingston Chan (KC) — founder of the Hang Seng University Photography Society, with over ten years of photography and education experience, National Geographic photography competition finalist (2014), and Wheelock Hong Kong photography competition runner-up (2015)."}
                </span>
                <span className="absolute -bottom-6 -right-1 text-5xl text-primary/10 font-serif select-none">"</span>
              </p>
              <div className="mt-8">
                <Link href="/about" className="text-primary font-bold text-sm inline-flex items-center hover:text-primary/80 transition-colors">
                  {isZh ? "認識 Kingston 及 JuntarHK" : "Learn about Kingston & JuntarHK"} <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 9. Collaboration process (4 steps, vertical on mobile) ──────────── */}
      <HowItWorksTimeline />

      {/* ── 10. Funding statement ───────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="w-14 h-14 mx-auto bg-[#E8A020]/10 rounded-2xl flex items-center justify-center mb-5">
              <CheckCircle2 className="w-7 h-7 text-[#E8A020]" />
            </div>
            <h2 className="font-display text-2xl font-extrabold text-[#1A3D4A] mb-4">
              {isZh ? "課程資助查詢" : "School Funding Enquiries"}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-base">
              {isZh ? FUNDING_DISCLAIMER_ZH : FUNDING_DISCLAIMER_EN}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 11. Gallery (8 images, manual controls, respects prefers-reduced-motion) */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary/10 text-primary font-semibold text-xs px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">
              {isZh ? "活動花絮" : "Event Highlights"}
            </span>
            <h2 className="font-display text-3xl font-extrabold text-[#1A3D4A] mb-3">
              {isZh ? "真實現場照片" : "Real Event Photos"}
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              {isZh ? "每一張照片都是學生投入參與的真實時刻" : "Every photo is a genuine moment of student engagement"}
            </p>
          </div>

          {/* Mobile: stacked 2×2 grid; Desktop: 4×2 with page controls */}
          <div className="block lg:hidden">
            <div className="grid grid-cols-2 gap-3">
              {GALLERY_PHOTOS.slice(0, 6).map((photo, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-sm">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    width={600}
                    height={600}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="grid grid-cols-4 gap-4 mb-6">
              {visiblePhotos.map((photo, i) => (
                <div key={`${galleryIndex}-${i}`} className="aspect-square rounded-2xl overflow-hidden shadow-sm">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    width={600}
                    height={600}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>

            {/* Manual navigation controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={prevGallery}
                disabled={galleryIndex === 0}
                aria-label={isZh ? "上一組照片" : "Previous photos"}
                className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setGalleryIndex(i)}
                    aria-label={isZh ? `第 ${i + 1} 組` : `Page ${i + 1}`}
                    className={`w-2 h-2 rounded-full transition-colors ${i === galleryIndex ? "bg-primary" : "bg-border"}`}
                  />
                ))}
              </div>
              <button
                onClick={nextGallery}
                disabled={galleryIndex >= totalPages - 1}
                aria-label={isZh ? "下一組照片" : "Next photos"}
                className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 11b. Student work videos ─────────────────────────────────────────── */}
      <section className="py-20 bg-[#1A3D4A]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold text-xs px-4 py-1.5 rounded-full mb-5 tracking-wide uppercase">
              <Video className="w-3.5 h-3.5" />
              {isZh ? "學生真實作品" : "Real Student Work"}
            </span>
            <h2 className="font-display text-3xl font-extrabold text-white mb-3">
              {isZh ? "學生在課程中完成的影片" : "Videos Produced by Students in Class"}
            </h2>
            <p className="text-white/70 text-base max-w-xl mx-auto">
              {isZh
                ? "以下片段均由參與 JuntarHK 攝影及校園媒體課程的學生拍攝及剪接完成。"
                : "Every clip below was shot and edited by students who took part in JuntarHK photography and school media programmes."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {[
              { src: "/photography/class-video-01.mp4", labelZh: "學生習作 1", labelEn: "Student work 1" },
              { src: "/photography/class-video-02.mp4", labelZh: "學生習作 2", labelEn: "Student work 2" },
            ].map((v, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-black/30 border border-white/10">
                <video
                  src={v.src}
                  controls
                  preload="metadata"
                  playsInline
                  className="w-full aspect-video object-cover"
                  aria-label={isZh ? v.labelZh : v.labelEn}
                />
                <p className="text-white/50 text-xs text-center py-2 px-4">
                  {isZh ? v.labelZh : v.labelEn}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden bg-black/30 border border-white/10">
            <video
              src="/photography/class-video-03.mp4"
              controls
              preload="metadata"
              playsInline
              className="w-full aspect-video object-cover"
              aria-label={isZh ? "學生習作 3（完整版）" : "Student work 3 (full-length)"}
            />
            <p className="text-white/50 text-xs text-center py-2 px-4">
              {isZh ? "學生習作 3（完整版）" : "Student work 3 (full-length)"}
            </p>
          </div>
        </div>
      </section>

      {/* ── 12. Final CTA with enquiry form ─────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#1A3D4A] mb-4">
              {isZh ? "正在規劃攝影、校園電視台或 AI 課程？" : "Planning a Photography, Campus TV or AI Programme?"}
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto mb-6">
              {isZh
                ? "填寫以下表格，我們會於下一個工作天內聯絡您提供課程建議。"
                : "Fill in the form below and we'll contact you within the next working day with a course proposal."}
            </p>
            <a
              href={`${WHATSAPP_URL}?text=${encodeURIComponent(isZh ? "想了解攝影及 AI 課程建議" : "Interested in photography and AI course proposals")}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => gtagEvent("whatsapp_click", { source: "final_cta" })}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors font-bold text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {isZh ? "或直接 WhatsApp 查詢" : "Or WhatsApp us directly"}
            </a>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <InlineEnquiryForm />
          </motion.div>
        </div>
      </section>

      <MobileStickyCTA />
    </AppLayout>
  );
}
