import React, { useState, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { useSeoSettings } from "@/contexts/SeoSettingsContext";
import {
  Camera, Award, Shield, Map, Trees, GraduationCap, Users,
  ExternalLink, Mountain, Tent, Sparkles, Heart, Compass,
  ChevronLeft, ChevronRight, Bot, BookOpen, ArrowRight, Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "wouter";
import {
  FOUNDER_EXPERIENCE_YEARS,
  FOUNDING_YEAR,
  WHATSAPP_URL,
} from "@/config/business-facts";

const kingstonImage = "/founder-photo.jpg";
const bulaLandVideo = "/api/storage/public-objects/bulaland.mp4";
import bulaPhoto1 from "@assets/WhatsApp_Image_2026-03-30_at_00.05.55_(1)_1774800433493.jpeg";
import bulaPhoto2 from "@assets/WhatsApp_Image_2026-03-30_at_00.05.55_(2)_1774800433494.jpeg";
import bulaPhoto3 from "@assets/WhatsApp_Image_2026-03-30_at_00.05.55_(3)_1774800433494.jpeg";
import bulaPhoto4 from "@assets/WhatsApp_Image_2026-03-30_at_00.05.55_1774800433494.jpeg";
import bulaPhoto5 from "@assets/WhatsApp_Image_2026-03-30_at_00.05.56_1774800433495.jpeg";
import felixImg from "@assets/team-2_1774800905098.jpg";
import hinImg from "@assets/Hin_1774800905099.jpg";
import nathanImg from "@assets/Nathan_1774800905101.jpg";
import rubyImg from "@assets/Ruby_1774800905102.jpg";
import ivanImg from "@assets/Ivan_so_1774801422217.jpg";
import sophiaImg from "@assets/image_1774845430073.jpg";

export default function About() {
  const [photoIndex, setPhotoIndex] = useState(0);
  const bulaPhotos = [bulaPhoto1, bulaPhoto2, bulaPhoto3, bulaPhoto4, bulaPhoto5];
  const teamScrollRef = useRef<HTMLDivElement>(null);
  const { t, lang } = useLanguage();
  const seoSettings = useSeoSettings();
  const a = t.about;
  const isZh = lang === "zh";

  const nextPhoto = () => setPhotoIndex((p) => (p + 1) % bulaPhotos.length);
  const prevPhoto = () => setPhotoIndex((p) => (p - 1 + bulaPhotos.length) % bulaPhotos.length);
  const scrollTeamLeft = () => teamScrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollTeamRight = () => teamScrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });

  return (
    <AppLayout>
      <SEO
        title={isZh
          ? (seoSettings["seo_page_about_title_zh"] || "關於JuntarHK｜攝影、校園媒體及AI教育及創作")
          : (seoSettings["seo_page_about_title_en"] || "About JuntarHK | Photography, School Media & AI Education & Creation")}
        description={isZh
          ? (seoSettings["seo_page_about_description_zh"] || "JuntarHK 由攝影師兼教育工作者 Kingston Chan（KC）創辦，為香港中小學提供攝影教育、校園媒體及 AI 創作課程。")
          : (seoSettings["seo_page_about_description_en"] || "JuntarHK was founded by photographer-educator Kingston Chan (KC) to deliver photography, school media and AI creation courses for Hong Kong schools.")}
        keywords={seoSettings["seo_page_about_keywords"] || "關於JuntarHK,攝影教育,AI教育,校園媒體,Kingston Chan,about JuntarHK,school photography education HK,AI creation course Hong Kong"}
        path="/about"
        lang={lang}
      />

      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden bg-[#1B3D4A] text-white">
        <div className="absolute inset-0 z-0">
          <img
            src={`${import.meta.env.BASE_URL}images/about-hero.jpg`}
            alt="JuntarHK 攝影及教育課程"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1B3D4A]/80 via-[#1B3D4A]/60 to-[#1B3D4A]" />
        </div>
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-md"
          >
            {a.heroTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl font-medium mx-auto text-white/90 leading-relaxed"
          >
            {a.heroSub.split("\n").map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </motion.p>
        </div>
      </section>

      {/* ── 2. Current Positioning ──────────────────────────────────────── */}
      <section className="py-24 bg-[#F5F5DC]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-14">
            <span className="inline-block bg-[#1A3D4A]/10 text-[#1A3D4A] text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
              {a.storyBadge}
            </span>
            <h2 className="font-display text-4xl font-extrabold text-[#1A3D4A] mb-5">{a.storyTitle}</h2>
            <div className="max-w-3xl mx-auto space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>{a.storyP1}</p>
              <p>
                {a.storyP2.split("{strong}")[0]}
                <strong className="text-[#1A3D4A]">{a.storyP2strong}</strong>
                {a.storyP2.split("{strong}")[1]}
              </p>
            </div>
          </div>

          {/* Three service pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {([Camera, Bot, Trees] as React.ElementType[]).map((Icon, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 text-center shadow-sm border border-[#1A3D4A]/8 hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 ${i === 1 ? "bg-[#E8A020]" : "bg-[#1A3D4A]"} text-white rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-[#1A3D4A]">
                  {i === 0 ? a.value1 : i === 1 ? a.value2 : a.value3}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {i === 0 ? a.value1Desc : i === 1 ? a.value2Desc : a.value3Desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Founder Story ────────────────────────────────────────────── */}
      <section className="py-32 bg-[#1A3D4A] text-white" id="founder">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <span className="inline-block bg-white/10 border border-white/20 text-white/80 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
              {a.founderBadge}
            </span>
            <h2 className="font-display text-5xl font-extrabold text-white mb-4">{a.founderName}</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">{a.founderSub}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 relative"
            >
              <img
                src={kingstonImage}
                alt="JuntarHK 創辦人 Kingston Chan 陳先生"
                className="rounded-2xl shadow-2xl relative z-10 w-full object-cover"
              />
              <div className="absolute inset-0 border-4 border-[#E8A020] rounded-2xl translate-x-4 translate-y-4 -z-0" />
              {/* Founder stats */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="bg-white/10 p-4 rounded-xl border border-white/20 text-center">
                  <p className="text-2xl font-extrabold text-[#E8A020]">{FOUNDER_EXPERIENCE_YEARS}</p>
                  <p className="text-xs text-white/60 mt-1">{isZh ? "年攝影教育經驗" : "yrs photo+education exp."}</p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl border border-white/20 text-center">
                  <p className="text-2xl font-extrabold text-[#E8A020]">{FOUNDING_YEAR}</p>
                  <p className="text-xs text-white/60 mt-1">{isZh ? "年創辦" : "founded"}</p>
                </div>
              </div>
              <div className="mt-3 bg-white/10 p-5 rounded-xl border border-white/20">
                <p className="text-sm text-white/70 italic">{a.founderCaption}</p>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3 space-y-8"
            >
              <div className="space-y-4">
                <h3 className="font-display text-2xl font-extrabold text-white">{a.founderBioTitle}</h3>
                <div className="space-y-4 text-white/75 leading-relaxed text-lg">
                  <p>
                    {a.founderBioP1.split(a.founderBioP1Strong)[0]}
                    <strong className="text-white">{a.founderBioP1Strong}</strong>
                    {a.founderBioP1.split(a.founderBioP1Strong)[1]}
                  </p>
                  <p>{a.founderBioP2}</p>
                </div>
              </div>

              {/* Philosophy */}
              <div className="bg-white/10 p-8 rounded-2xl border-l-4 border-[#E8A020]">
                <div className="flex gap-4">
                  <Heart className="w-6 h-6 text-[#E8A020] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white mb-2">{a.philoTitle}</h4>
                    <p className="text-white/75">
                      {a.philoDesc.split(a.philoDescStrong)[0]}
                      <strong className="text-white">{a.philoDescStrong}</strong>
                      {a.philoDesc.split(a.philoDescStrong)[1]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vision */}
              <div className="border-t border-white/20 pt-8">
                <div className="flex gap-3">
                  <Compass className="w-6 h-6 text-[#E8A020] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white mb-2">{a.visionTitle}</h4>
                    <p className="text-white/70 italic">{a.visionQuote}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 4. Photography & Visual Media Experience ─────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 bg-[#1A3D4A] text-white rounded-2xl flex items-center justify-center mb-6">
                <Camera className="w-7 h-7" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#1A3D4A] mb-4">
                {a.photoExpTitle}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">{a.photoExpDesc}</p>
              <ul className="space-y-3">
                {a.photoExpPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-gray-700 leading-relaxed">{pt}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex gap-3 flex-wrap">
                {a.credPhotoItems.map((c, i) => (
                  <div key={i} className="inline-flex items-center gap-2 bg-[#1A3D4A]/5 border border-[#1A3D4A]/15 rounded-lg px-4 py-3">
                    <Award className="w-4 h-4 text-[#E8A020] shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#1A3D4A] leading-tight">{c.title}</p>
                      <p className="text-xs text-gray-500">{c.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#1A3D4A] rounded-2xl p-8 text-white space-y-5"
            >
              <p className="text-white/80 text-base leading-relaxed mb-6">
                {isZh
                  ? "由攝影、採訪到影片製作，培養學生的視覺敘事及媒體素養。"
                  : "From photography and interviewing to video production, developing students' visual storytelling and media literacy."}
              </p>
              <Link
                href="/photography"
                className="inline-flex items-center gap-2 font-bold text-[#E8A020] hover:text-white transition-colors text-sm"
              >
                {isZh ? "了解影像及校園媒體教育" : "View Photography & School Media"} <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 5. AI Education Approach ─────────────────────────────────────── */}
      <section className="py-24 bg-[#0F2A33] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              {/* AI course cards */}
              <div className="grid grid-cols-2 gap-4">
                {(a.aiApproachPoints ?? []).map((pt, i) => (
                  <div key={i} className="bg-white/10 border border-white/15 rounded-xl p-5">
                    <div className="w-8 h-8 bg-[#E8A020]/20 rounded-lg flex items-center justify-center mb-3">
                      <Bot className="w-4 h-4 text-[#E8A020]" />
                    </div>
                    <p className="text-sm text-white/90 font-semibold leading-snug">{pt}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/ai-education"
                className="inline-flex items-center gap-2 mt-6 font-bold text-[#E8A020] hover:text-white transition-colors text-sm"
              >
                {isZh ? "查看 AI 課程" : "View AI Programmes"} <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="w-14 h-14 bg-[#E8A020] text-white rounded-2xl flex items-center justify-center mb-6">
                <Bot className="w-7 h-7" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white mb-4">
                {a.aiApproachTitle}
              </h2>
              <p className="text-white/75 text-lg leading-relaxed">{a.aiApproachDesc}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 6. Experiential / Outdoor Background ────────────────────────── */}
      <section className="py-20 bg-[#F5F5DC]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/3 flex justify-center">
              <div className="w-32 h-32 bg-[#1A3D4A] text-white rounded-3xl flex items-center justify-center shadow-xl">
                <Mountain className="w-16 h-16 text-[#E8A020]" />
              </div>
            </div>
            <div className="md:w-2/3">
              <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3 block">{isZh ? "體驗學習背景" : "Experiential Learning"}</span>
              <h2 className="font-display text-3xl font-extrabold text-[#1A3D4A] mb-4">{a.outdoorBgTitle}</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{a.outdoorBgDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Qualifications — 3 ARIA Accordions ───────────────────────── */}
      <section className="py-24 bg-white" aria-label={isZh ? "專業認證與成就" : "Professional Credentials & Achievements"}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#1A3D4A]">
              {a.credTitle}
            </h2>
          </div>

          <div className="space-y-4">
            {/* Accordion 1: Photography & Image Achievements */}
            <Accordion type="single" collapsible className="bg-[#FAF7F2] rounded-2xl border border-[#1A3D4A]/10 overflow-hidden">
              <AccordionItem value="photo" className="border-0">
                <AccordionTrigger className="px-6 py-5 text-left text-lg font-bold text-[#1A3D4A] hover:text-primary hover:no-underline [&[data-state=open]]:text-primary">
                  <span className="flex items-center gap-3">
                    <Camera className="w-5 h-5 text-[#E8A020] shrink-0" />
                    {a.credAccordionPhotoTitle}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {a.credPhotoItems.map((c, i) => (
                      <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-[#1A3D4A]/8">
                        <Award className="w-4 h-4 text-[#E8A020] shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-bold text-[#1A3D4A]">{c.title}</p>
                          <p className="text-xs text-gray-500">{c.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Accordion 2: Education & Training */}
            <Accordion type="single" collapsible className="bg-[#FAF7F2] rounded-2xl border border-[#1A3D4A]/10 overflow-hidden">
              <AccordionItem value="training" className="border-0">
                <AccordionTrigger className="px-6 py-5 text-left text-lg font-bold text-[#1A3D4A] hover:text-primary hover:no-underline [&[data-state=open]]:text-primary">
                  <span className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-[#E8A020] shrink-0" />
                    {a.credAccordionTrainingTitle}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {a.credTrainingItems.map((c, i) => (
                      <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-[#1A3D4A]/8">
                        <GraduationCap className="w-4 h-4 text-[#E8A020] shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-bold text-[#1A3D4A]">{c.title}</p>
                          <p className="text-xs text-gray-500">{c.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Accordion 3: Outdoor & Adventure */}
            <Accordion type="single" collapsible className="bg-[#FAF7F2] rounded-2xl border border-[#1A3D4A]/10 overflow-hidden">
              <AccordionItem value="outdoor" className="border-0">
                <AccordionTrigger className="px-6 py-5 text-left text-lg font-bold text-[#1A3D4A] hover:text-primary hover:no-underline [&[data-state=open]]:text-primary">
                  <span className="flex items-center gap-3">
                    <Mountain className="w-5 h-5 text-[#E8A020] shrink-0" />
                    {a.credAccordionOutdoorTitle}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {a.credOutdoorItems.map((c, i) => (
                      <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-[#1A3D4A]/8">
                        <Mountain className="w-4 h-4 text-[#E8A020] shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-bold text-[#1A3D4A]">{c.title}</p>
                          <p className="text-xs text-gray-500">{c.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* ── 8. Team ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#F5F5DC]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-extrabold text-[#1A3D4A] mb-4">{a.teamTitle}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{a.teamSub}</p>
          </div>

          <div className="relative group">
            <motion.button
              onClick={scrollTeamLeft}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isZh ? "向左捲動" : "Scroll left"}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-primary/20 backdrop-blur-sm p-3 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-6 h-6 text-primary" />
            </motion.button>

            <div
              ref={teamScrollRef}
              className="overflow-x-auto pb-4 px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <div className="flex gap-4 min-w-min px-2">
                {[
                  { img: felixImg, name: "Felix", alt: "Felix" },
                  { img: rubyImg, name: "Ruby", alt: "Ruby" },
                  { img: nathanImg, name: "Nathan", alt: "Nathan" },
                  { img: hinImg, name: "Hin Leung", alt: "Hin Leung 梁先生" },
                  { img: ivanImg, name: "Ivan So", alt: "Ivan So 蘇先生" },
                  { img: sophiaImg, name: "Sophia Man", alt: "Sophia Man 文小姐" },
                ].map((member, i) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex-shrink-0 w-48"
                  >
                    <img
                      src={member.img}
                      alt={`JuntarHK 團隊成員 ${member.alt}`}
                      className="w-full aspect-square object-cover"
                      style={member.name === "Sophia Man" ? { objectPosition: "center 15%" } : undefined}
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-base text-[#1A3D4A] mb-1">{member.name}</h3>
                      <p className="text-primary text-xs font-semibold mb-2">{a.teamMembers[i].role}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{a.teamMembers[i].bio}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.button
              onClick={scrollTeamRight}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isZh ? "向右捲動" : "Scroll right"}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-primary/20 backdrop-blur-sm p-3 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-6 h-6 text-primary" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* ── 9. Bula Land ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#1B3D4A] text-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary/20 border border-primary/40 text-primary text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
              {isZh ? "姊妹公司 Sister Company" : "Sister Company"}
            </span>
            <h2 className="font-display text-4xl font-extrabold mb-4">{a.bulaTitle}</h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              {a.bulaDesc.split("{bula}")[0]}<strong className="text-white">Bula Land</strong>{a.bulaDesc.split("{bula}")[1]}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden shadow-2xl"
            >
              <video
                src={bulaLandVideo}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="w-full aspect-[4/3] object-cover bg-black"
                aria-label="Bula Land 營地實景影片"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5">
                <span className="font-display font-extrabold text-2xl text-white drop-shadow">Bula Land</span>
                <p className="text-white/80 text-sm">{a.bulaLocation}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([Tent, Users, Mountain, Sparkles] as React.ElementType[]).map((Icon, i) => (
                  <div key={i} className="bg-white/10 border border-white/10 rounded-xl p-5">
                    <Icon className="w-6 h-6 text-primary mb-3" />
                    <h4 className="font-bold text-white mb-1">{a.bulaFeatures[i].title}</h4>
                    <p className="text-white/60 text-xs leading-relaxed">{a.bulaFeatures[i].desc}</p>
                  </div>
                ))}
              </div>
              <a
                href="https://www.bulahk.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-full transition-colors shadow-md shadow-primary/30"
              >
                {a.bulaBtn} <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          </div>

          {/* Photo gallery */}
          <div className="mt-20">
            <h3 className="font-display text-3xl font-extrabold text-white mb-8 text-center">{a.bulaGallery}</h3>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={bulaPhotos[photoIndex]}
                alt={`JuntarHK Bula Land 自家營地實景 ${photoIndex + 1}`}
                className="w-full aspect-[16/9] object-cover"
              />
              <button
                onClick={prevPhoto}
                aria-label={isZh ? "上一張" : "Previous photo"}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors backdrop-blur-sm z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextPhoto}
                aria-label={isZh ? "下一張" : "Next photo"}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors backdrop-blur-sm z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold" aria-live="polite">
                {photoIndex + 1} / {bulaPhotos.length}
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label={isZh ? "營地照片" : "Campsite photos"}>
              {bulaPhotos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPhotoIndex(idx)}
                  role="tab"
                  aria-selected={idx === photoIndex}
                  aria-label={`${isZh ? "第" : "Photo"} ${idx + 1} ${isZh ? "張" : ""}`}
                  className={`h-2 rounded-full transition-all ${idx === photoIndex ? "bg-primary w-8" : "bg-white/30 w-2 hover:bg-white/50"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. Final CTA ────────────────────────────────────────────────── */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center text-white">
          <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-4">{a.finalCtaTitle}</h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">{a.finalCtaDesc}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-full hover:bg-white/90 transition-colors shadow-lg text-lg"
            >
              {a.finalCtaBtn}
            </Link>
            <a
              href={`${WHATSAPP_URL}?text=${encodeURIComponent(isZh ? "你好，我想了解 JuntarHK 的課程" : "Hi, I'd like to learn more about JuntarHK programmes")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold px-8 py-4 rounded-full border border-white/30 transition-colors text-lg"
            >
              {a.finalCtaWa}
            </a>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
