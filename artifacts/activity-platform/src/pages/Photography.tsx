import { useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { Breadcrumb } from "@/components/Breadcrumb";
import { InlineEnquiryForm } from "@/components/InlineEnquiryForm";
import { Camera, Film, Mic, Trophy, ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { gtagEvent } from "@/lib/gtag";

export default function Photography() {
  const { t, lang } = useLanguage();
  const zh = lang === "zh";

  useEffect(() => {
    gtagEvent("service_page_view", { service_name: "photography" });
  }, []);

  return (
    <AppLayout>
      <SEO
        title={zh ? "學校攝影及校園媒體課程｜JuntarHK" : "Photography & School Media Programmes for HK Schools | JuntarHK"}
        description={zh
          ? "為香港中小學提供攝影、影片製作、校園記者及校園電視台課程，培養學生視覺敘事、媒體素養及表達能力。"
          : "Photography, video production, campus reporter and campus TV programmes for Hong Kong schools — building students' visual storytelling, media literacy and communication skills."}
        path="/photography"
        lang={lang}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-32 bg-[#1A3D4A] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A3D4A] via-[#1A3D4A]/90 to-transparent z-10" />
          <img
            src="/photography/photo-hero.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
            width={1920}
            height={1080}
          />
        </div>

        <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <Breadcrumb items={[{ label: t.nav.photography }]} />

          <div className="max-w-3xl mt-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Camera className="w-4 h-4" />
              <span>{zh ? "影像及校園媒體" : "Photography & School Media"}</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              {t.photography?.heroTitle}
            </h1>

            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl">
              {t.photography?.heroSub}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="rounded-full px-8 font-bold bg-primary hover:bg-primary/90 text-primary-foreground h-14">
                <Link
                  href="/activities?category=影像及校園媒體#programme-results"
                  onClick={() => gtagEvent("catalog_cta_click", { source: "photography_hero" })}
                >
                  {zh ? "查看攝影及校園媒體課程" : "View Photography Programmes"} <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 font-bold h-14 bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white">
                <a
                  href="https://wa.me/85297289412"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => gtagEvent("whatsapp_click", { source: "photography_hero" })}
                >
                  {zh ? "WhatsApp索取課程建議" : "WhatsApp for a Proposal"}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Introduction ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#1A3D4A] mb-6">
            {zh ? "影像及校園媒體教育" : "Photography & School Media Education"}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            {zh
              ? "攝影不只是學習操作相機，更是訓練學生觀察、選擇、提問及表達。JuntarHK 的課程以真實作品為核心——每位學生離開課堂時都帶著可以展示及分享的成果，而不只是一組待用的技巧。"
              : "Photography is more than learning to operate a camera — it trains students to observe, choose, question and express. JuntarHK programmes are built around real student output: every learner leaves with a finished work they can exhibit and share, not just techniques filed away for later."}
          </p>
        </div>
      </section>

      {/* ── Four-step learning process ────────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-[#1A3D4A]">
              {zh ? "學生如何學習" : "How Students Learn"}
            </h2>
          </div>
          {/* Horizontal on desktop, vertical on mobile */}
          <div className="relative">
            <div className="hidden md:block absolute top-[22px] left-[14%] right-[14%] h-0.5 bg-[#1A3D4A]/15" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
              {[
                {
                  num: "01",
                  zh: "觀察", en: "Observe",
                  desc_zh: "從校園及生活中發現值得記錄的故事。",
                  desc_en: "Discover stories worth capturing in school and everyday life.",
                },
                {
                  num: "02",
                  zh: "拍攝", en: "Capture",
                  desc_zh: "掌握構圖、光線、攝錄及收音技巧。",
                  desc_en: "Master composition, lighting, filming and sound recording.",
                },
                {
                  num: "03",
                  zh: "敘事", en: "Narrate",
                  desc_zh: "透過採訪、選材及剪接整理故事。",
                  desc_en: "Shape the story through interviews, selection and editing.",
                },
                {
                  num: "04",
                  zh: "展示", en: "Present",
                  desc_zh: "完成攝影作品集、校園新聞或主題短片。",
                  desc_en: "Complete a photo portfolio, campus news or themed short film.",
                },
              ].map((step) => (
                <div key={step.num} className="flex md:flex-col items-start md:items-center gap-4 md:gap-0 md:text-center relative z-10">
                  <div className="w-11 h-11 shrink-0 rounded-full bg-[#1A3D4A] text-white font-extrabold text-base flex items-center justify-center md:mb-6">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-xl text-[#1A3D4A] mb-2">
                      {zh ? step.zh : step.en}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {zh ? step.desc_zh : step.desc_en}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Student outcomes ──────────────────────────────────────────────── */}
      <section className="py-20 bg-[#EAF3F2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#1A3D4A] mb-12 text-center">
            {zh ? "學生完成的作品" : "What Students Create"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: Camera, zh: "校園攝影作品集",      en: "Campus photo portfolio" },
              { icon: Film,   zh: "校園新聞或主題短片",   en: "Campus news or themed short film" },
              { icon: Mic,    zh: "採訪及媒體製作經驗",   en: "Interview & media production experience" },
              { icon: Trophy, zh: "校內成果展示",         en: "In-school showcase" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-primary/10 text-center flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#1A3D4A]/8 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#1A3D4A]" />
                  </div>
                  <p className="font-semibold text-[#1A3D4A] text-sm leading-snug">
                    {zh ? item.zh : item.en}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Authentic photo gallery ───────────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-[#1A3D4A] mb-10 text-center">
            {zh ? "課堂及學生作品" : "Classroom & Student Work"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {[
              { src: "/photography/photo-class-01.jpg", alt_zh: "學生攝影課堂，學習構圖技巧",          alt_en: "Students in photography class learning composition" },
              { src: "/photography/photo-class-02.jpg", alt_zh: "學生透過相機取景器認真拍攝",          alt_en: "Student looking through DSLR camera viewfinder" },
              { src: "/photography/photo-class-03.jpg", alt_zh: "學生進行校園記者及影片製作",          alt_en: "Students working on school video production project" },
              { src: "/photography/photo-class-04.jpg", alt_zh: "學生在電腦上檢視及討論攝影作品",      alt_en: "Students reviewing photos on laptop with teacher" },
              { src: "/photography/photo-class-05.jpg", alt_zh: "學生展示攝影作品集",                  alt_en: "Student showcasing photo portfolio" },
              { src: "/photography/photo-class-06.jpg", alt_zh: "學生學習攝影打燈及布光技巧",          alt_en: "Students learning photography lighting techniques" },
            ].map((img, i) => (
              <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#F0EDE8]">
                <img
                  src={img.src}
                  alt={zh ? img.alt_zh : img.alt_en}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  width={600}
                  height={450}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA band → filtered Programme Catalogue ──────────────────────── */}
      <section className="py-20 bg-[#1A3D4A] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold mb-4">
            {zh ? "查看攝影及校園媒體課程" : "View Photography & School Media Programmes"}
          </h2>
          <p className="text-white/80 mb-10 max-w-xl mx-auto text-base">
            {zh
              ? "瀏覽完整課程目錄，所有課程均可按學校年級、節數及主題訂製。"
              : "Browse the full programme catalogue — all courses can be tailored to your school's grade, sessions and theme."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full px-8 font-bold bg-white text-[#1A3D4A] hover:bg-white/90 h-14">
              <Link
                href="/activities?category=影像及校園媒體#programme-results"
                onClick={() => gtagEvent("catalog_cta_click", { source: "photography_cta" })}
              >
                {zh ? "查看攝影及校園媒體課程" : "View Photography Programmes"} <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 font-bold h-14 bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white">
              <a
                href="https://wa.me/85297289412"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => gtagEvent("whatsapp_click", { source: "photography_cta" })}
              >
                {zh ? "WhatsApp索取課程建議" : "WhatsApp for a Proposal"}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── About Instructor ──────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-muted text-muted-foreground px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <span>{t.photography?.instructorTitle}</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-[#1A3D4A] mb-8 leading-relaxed italic">
            {zh
              ? "「JuntarHK 由 Kingston Chan（KC）創辦。KC 為恒生大學攝影學會創辦人，擁有 10 年以上攝影及教育經驗，曾於 2014 年入圍國家地理攝影大賽決賽，並於 2015 年獲得會德豐香港攝影大賽縮時攝影組亞軍。攝影教育課程由 KC 親身設計及帶領。」"
              : "\"JuntarHK was founded by Kingston Chan (KC) — founder of the Hang Seng University Photography Society, with over ten years of photography and education experience. National Geographic photography competition finalist (2014) and Wheelock Hong Kong Photography Competition runner-up (2015, time-lapse category). Photography programmes are designed and led by KC personally.\""}
          </h2>

          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <span className="bg-[#1A3D4A] text-white px-4 py-2 rounded-lg text-sm font-medium">
              {zh ? "國家地理攝影大賽決賽 2014" : "National Geographic Finalist 2014"}
            </span>
            <span className="bg-[#1A3D4A] text-white px-4 py-2 rounded-lg text-sm font-medium">
              {zh ? "會德豐攝影大賽亞軍 2015" : "Wheelock Photography Runner-up 2015"}
            </span>
          </div>

          <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            {zh
              ? "按活動性質安排已完成相關查核及具合適資格的導師，並提供所需保險及活動文件。"
              : "Qualified, background-checked instructors arranged per activity type, with required insurance and documentation."}
          </p>
        </div>
      </section>

      {/* ── Enquiry Form ──────────────────────────────────────────────────── */}
      <section id="photography-enquiry" className="py-24 bg-[#FAF7F2] border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#1A3D4A] mb-4">
              {t.photography?.enquiryTitle}
            </h2>
            <p className="text-lg text-muted-foreground">
              {zh
                ? "填寫以下表格，我們的教育顧問將於 2 個工作天內為您提供免費課程建議。"
                : "Fill in the form below and our education consultant will contact you within 2 working days with a free proposal."}
            </p>
          </div>
          <InlineEnquiryForm activityTitle={zh ? "影像及校園媒體" : "Photography & School Media"} />
        </div>
      </section>

    </AppLayout>
  );
}
