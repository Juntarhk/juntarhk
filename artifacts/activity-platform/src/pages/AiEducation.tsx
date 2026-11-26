import { useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { Breadcrumb } from "@/components/Breadcrumb";
import { InlineEnquiryForm } from "@/components/InlineEnquiryForm";
import { Sparkles, ShieldCheck, GraduationCap, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { gtagEvent } from "@/lib/gtag";

export default function AiEducation() {
  const { t, lang } = useLanguage();
  const zh = lang === "zh";

  useEffect(() => {
    gtagEvent("service_page_view", { service_name: "ai-education" });
  }, []);

  return (
    <AppLayout>
      <SEO
        title={zh ? "學校AI教育及創作課程｜JuntarHK" : "AI Education & Creation Programmes for HK Schools | JuntarHK"}
        description={zh
          ? "為香港中小學提供AI素養、AI動畫、手機攝影 × AI 圖像製作、AI＋學科及教師AI培訓，涵蓋創作、查證、版權及使用倫理。"
          : "AI literacy, AI animation, Mobile Photography × AI Image Creation, AI + subject integration and teacher AI training for Hong Kong schools — covering creation, verification, copyright and responsible use."}
        path="/ai-education"
        lang={lang}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-32 bg-[#1A3D4A] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A3D4A] via-[#1A3D4A]/90 to-[#1A3D4A]/40 z-10" />
          <img
            src="/ai/ai-thinking-03.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
            width={1920}
            height={1080}
          />
        </div>

        <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <Breadcrumb items={[{ label: t.nav.aiEducation }]} />

          <div className="max-w-3xl mt-8">
            <div className="inline-flex items-center gap-2 bg-[#E8A020]/20 text-[#E8A020] border border-[#E8A020]/30 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              <span>{zh ? "AI 教育及創作" : "AI Education & Creation"}</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              {t.aiEducation?.heroTitle}
            </h1>

            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl">
              {t.aiEducation?.heroSub}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="rounded-full px-8 font-bold bg-[#E8A020] hover:bg-[#E8A020]/90 text-white h-14">
                <Link
                  href="/activities?category=AI教育及創作#programme-results"
                  onClick={() => gtagEvent("catalog_cta_click", { source: "ai_education_hero" })}
                >
                  {zh ? "查看AI教育及創作課程" : "View AI Programmes"} <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 font-bold h-14 bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white">
                <a
                  href="https://wa.me/85297289412"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => gtagEvent("whatsapp_click", { source: "ai_education_hero" })}
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
            {zh ? "AI教育及創作" : "AI Education & Creation"}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            {zh
              ? "AI課程不應只教學生操作工具。JuntarHK 讓學生以批判思考的方式使用 AI——理解工具的局限、辨別可信內容，最終以 AI 作為創作媒介，完成屬於自己的真實作品。"
              : "AI programmes should teach more than how to operate tools. JuntarHK helps students become thoughtful users: understanding a tool's limits, evaluating outputs critically, and ultimately using AI as a creative medium to produce genuine work of their own."}
          </p>
        </div>
      </section>

      {/* ── Four-step AI learning process ────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-[#1A3D4A]">
              {zh ? "學生如何學習" : "How Students Learn"}
            </h2>
          </div>
          {/* Horizontal on desktop, vertical on mobile */}
          <div className="relative">
            <div className="hidden md:block absolute top-[22px] left-[14%] right-[14%] h-0.5 bg-[#E8A020]/20" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
              {[
                {
                  num: "01",
                  zh: "提問", en: "Question",
                  desc_zh: "將想法轉化成清晰指令及創作目標。",
                  desc_en: "Transform ideas into clear prompts and creative goals.",
                },
                {
                  num: "02",
                  zh: "比較", en: "Compare",
                  desc_zh: "比較不同生成結果，分析內容是否合適。",
                  desc_en: "Compare generated outputs and evaluate their suitability.",
                },
                {
                  num: "03",
                  zh: "查證", en: "Verify",
                  desc_zh: "檢查事實、版權、偏見及資訊來源。",
                  desc_en: "Check facts, copyright, bias and information sources.",
                },
                {
                  num: "04",
                  zh: "創作", en: "Create",
                  desc_zh: "完成AI動畫、手機攝影 × AI 圖像製作或跨學科作品。",
                  desc_en: "Complete an AI animation, Mobile Photography × AI Image Creation or cross-subject project.",
                },
              ].map((step) => (
                <div key={step.num} className="flex md:flex-col items-start md:items-center gap-4 md:gap-0 md:text-center relative z-10">
                  <div className="w-11 h-11 shrink-0 rounded-full bg-[#E8A020] text-white font-extrabold text-base flex items-center justify-center md:mb-6">
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
      <section className="py-20 bg-[#FAF7F2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#1A3D4A] mb-12 text-center">
            {zh ? "學生完成的作品" : "What Students Create"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: Sparkles,     zh: "AI創作作品集",       en: "AI creation portfolio" },
              { icon: BookOpen,     zh: "AI動畫或數碼故事",   en: "AI animation or digital story" },
              { icon: GraduationCap, zh: "AI＋學科專題作品",  en: "AI + subject project" },
              { icon: ShieldCheck,  zh: "批判思考及AI素養",   en: "Critical thinking & AI literacy" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8A020]/15 text-center flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#E8A020]/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#E8A020]" />
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

      {/* ── Responsible AI callout ────────────────────────────────────────── */}
      <section className="py-16 bg-[#1A3D4A] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="md:shrink-0 w-14 h-14 rounded-2xl bg-[#E8A020]/20 border border-[#E8A020]/30 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-[#E8A020]" />
            </div>
            <div>
              <h2 className="font-display text-xl md:text-2xl font-extrabold text-white mb-3">
                {zh ? "AI是創作工具，決定權仍然在學生手上" : "AI is a creative tool — students stay in control"}
              </h2>
              <p className="text-white/75 leading-relaxed text-base">
                {zh
                  ? "課程同時涵蓋資料查證、版權、私隱、偏見及使用倫理，避免學生只追求快速生成結果。"
                  : "Every programme also covers fact verification, copyright, privacy, bias and responsible use — ensuring students think critically rather than just generating quickly."}
              </p>
            </div>
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
              { src: "/ai/ai-thinking-04.jpg", alt_zh: "學生使用平板電腦配合 AI 指令工作紙進行 Prompt 練習",    alt_en: "Student working on AI prompt exercises with tablet and worksheet" },
              { src: "/ai/ai-thinking-03.jpg", alt_zh: "學生閱讀 AI Prompt 魔法式資料，學習指令設計思維",      alt_en: "Student reading AI Prompt reference sheet and learning prompt design" },
              { src: "/ai/ai-thinking-01.jpg", alt_zh: "學生展示 iPad 上 AI 生成的圖像，旁邊放有真實物件作對比", alt_en: "Student showing AI-generated image on iPad beside a real object for comparison" },
              { src: "/ai/ai-thinking-06.jpg", alt_zh: "學生專注使用 iPad 學習 AI，桌上放有 Prompt 工作紙",    alt_en: "Student focused on iPad with AI Prompt worksheet on the table" },
              { src: "/ai/ai-thinking-07.jpg", alt_zh: "學生查看 iPad 上 AI 生成的香港主題圖像創作",           alt_en: "Student reviewing AI-generated Hong Kong-themed artwork on iPad" },
              { src: "/ai/ai-thinking-02.jpg", alt_zh: "學生展示平板電腦上的 AI 圖像創作成果",                  alt_en: "Student presenting AI image creation results on tablet" },
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

      {/* ── CTA to Programme Catalogue ────────────────────────────────────── */}
      <section className="py-20 bg-[#E8A020]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white mb-4">
            {zh ? "查看AI教育及創作課程" : "View AI Education & Creation Programmes"}
          </h2>
          <p className="text-white/85 mb-10 max-w-xl mx-auto text-base">
            {zh
              ? "瀏覽完整課程目錄，所有課程均可按學校年級、節數及主題訂製。"
              : "Browse the full programme catalogue — all courses can be tailored to your school's grade, sessions and theme."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full px-8 font-bold bg-white text-[#1A3D4A] hover:bg-white/90 h-14">
              <Link
                href="/activities?category=AI教育及創作#programme-results"
                onClick={() => gtagEvent("catalog_cta_click", { source: "ai_education_cta" })}
              >
                {zh ? "查看AI教育及創作課程" : "View AI Programmes"} <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 font-bold h-14 bg-transparent border-white/50 text-white hover:bg-white/10 hover:text-white">
              <a
                href="https://wa.me/85297289412"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => gtagEvent("whatsapp_click", { source: "ai_education_cta" })}
              >
                {zh ? "WhatsApp索取課程建議" : "WhatsApp for a Proposal"}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Enquiry Form ──────────────────────────────────────────────────── */}
      <section id="ai-enquiry" className="py-24 bg-[#1A3D4A]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white mb-4">
              {t.aiEducation?.enquiryTitle}
            </h2>
            <p className="text-lg text-white/80">
              {zh
                ? "填寫以下表格，我們的教育顧問將於 2 個工作天內為您提供免費課程建議。"
                : "Fill in the form below and our education consultant will contact you within 2 working days with a free proposal."}
            </p>
          </div>
          <InlineEnquiryForm activityTitle={zh ? "AI 教育及創作" : "AI Education & Creation"} />
        </div>
      </section>

    </AppLayout>
  );
}
