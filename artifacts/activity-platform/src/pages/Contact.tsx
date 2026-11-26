import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  ShieldCheck,
  Award,
  FileCheck,
  Sparkles,
  MessageCircle,
  CalendarDays,
  ArrowRight,
  PenLine,
  ChevronDown,
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { useSeoSettings } from "@/contexts/SeoSettingsContext";
import { InlineEnquiryForm } from "@/components/InlineEnquiryForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { WHATSAPP_URL, FOUNDER_EXPERIENCE_YEARS } from "@/config/business-facts";

const PHONE = "9728 9412";
const PHONE_TEL = "+85297289412";
const EMAIL = "info@juntarhk.com";

export default function Contact() {
  const { t, lang } = useLanguage();
  const seoSettings = useSeoSettings();
  const c = t.contact;
  const isZh = lang === "zh";
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const waEnquiryMsg = encodeURIComponent(
    isZh ? "你好，我想了解 JuntarHK 的課程" : "Hi, I'd like to learn more about JuntarHK programmes"
  );

  // Trust badges — only verified/approved labels; values imported from business-facts
  const trustBadges = isZh
    ? [
        { icon: ShieldCheck, label: "SCRC 性罪行紀錄查核" },
        { icon: FileCheck, label: "校本訂製課程" },
        { icon: Award, label: "課程資助諮詢支援" },
        { icon: Sparkles, label: `攝影師兼教育工作者創辦 · ${FOUNDER_EXPERIENCE_YEARS} 年經驗`, accent: true },
      ]
    : [
        { icon: ShieldCheck, label: "SCRC Sex-Conviction Checked" },
        { icon: FileCheck, label: "School-tailored Courses" },
        { icon: Award, label: "Funding Application Advice" },
        { icon: Sparkles, label: `Founded by photographer-educator · ${FOUNDER_EXPERIENCE_YEARS} years`, accent: true },
      ];

  return (
    <AppLayout>
      <SEO
        title={isZh
          ? (seoSettings["seo_page_contact_title_zh"] || "聯絡JuntarHK｜攝影、校園媒體及AI課程查詢")
          : (seoSettings["seo_page_contact_title_en"] || "Contact JuntarHK | Photography, School Media & AI Course Enquiry")}
        description={isZh
          ? (seoSettings["seo_page_contact_description_zh"] || "歡迎香港中小學聯絡 JuntarHK 查詢攝影、影片製作、校園記者、校園電視台及 AI 創作課程。可按學校需要提供課程建議及報價。電話：+852 9728 9412。")
          : (seoSettings["seo_page_contact_description_en"] || "Contact JuntarHK for photography, video production, campus reporter, campus TV and AI creation courses for Hong Kong schools. Course proposals and quotations available. Call +852 9728 9412.")}
        keywords={
          seoSettings["seo_page_contact_keywords"] ||
          "聯絡JuntarHK,攝影課程查詢,AI教育查詢,校園電視台課程,contact JuntarHK,school photography enquiry Hong Kong,AI education course Hong Kong"
        }
        path="/contact"
        lang={lang}
      />

      <div className="bg-[#0F2A33] text-slate-800">
        {/* ── Dark hero ─────────────────────────────────────────────────── */}
        <section className="relative bg-gradient-to-br from-[#0F2A33] via-[#1A3D4A] to-[#234d5c] text-white overflow-hidden pt-24 pb-56 sm:pb-64">
          {/* Decorative blobs */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-[#3D8B89]/25 blur-3xl" />
            <div className="absolute top-20 -left-32 w-[26rem] h-[26rem] rounded-full bg-[#E8A020]/15 blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
                backgroundSize: "32px 32px",
              }}
            />
          </div>

          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wider uppercase bg-[#E8A020]/15 text-[#FFCB6B] border border-[#E8A020]/30 mb-6 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              {c.directoryEyebrow}
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 tracking-tight leading-[1.1]">
              {c.directoryTitle}
            </h1>
            <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              {c.directorySub}
            </p>
          </div>
        </section>

        {/* ── 2 PRIMARY PATH CARDS (overlap hero) ──────────────────────── */}
        <section className="relative px-4 sm:px-6 -mt-44 sm:-mt-52 z-10">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Path 1: WhatsApp quick contact */}
              <a
                href={`${WHATSAPP_URL}?text=${waEnquiryMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col bg-white rounded-2xl p-7 border border-[#25D366]/30 ring-2 ring-[#25D366]/20 shadow-2xl shadow-black/[0.15] hover:shadow-[0_32px_64px_-12px_rgba(37,211,102,0.35)] hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#25D366] rounded-t-2xl" aria-hidden="true" />
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#25D366]/8 to-transparent pointer-events-none" aria-hidden="true" />
                <span className="absolute top-4 right-4 inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#25D366]/15 text-[#1B8A4A]">
                  {isZh ? "最快回覆" : "Fastest reply"}
                </span>

                <div className="relative w-14 h-14 rounded-xl flex items-center justify-center mb-5 bg-[#25D366]/12" style={{ boxShadow: "0 8px 24px -8px rgba(37,211,102,0.4)" }}>
                  {/* WhatsApp logo */}
                  <svg className="w-7 h-7" fill="#25D366" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>

                <p className="relative text-xs font-bold uppercase tracking-wider text-[#1B8A4A] mb-1">{c.path1Title}</p>
                <h2 className="relative text-xl font-extrabold text-[#1A3D4A] mb-2">{c.path1Cta}</h2>
                <p className="relative text-slate-500 text-sm mb-6 flex-grow leading-relaxed">{c.path1Desc}</p>
                <div className="relative flex items-center font-semibold text-sm text-[#1B8A4A]">
                  <span className="mr-2">{isZh ? "立即 WhatsApp" : "WhatsApp Now"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>

              {/* Path 2: Enquiry form */}
              <a
                href="#enquiry-form"
                className="group relative flex flex-col bg-white rounded-2xl p-7 border border-[#E8A020]/30 shadow-2xl shadow-black/[0.10] hover:shadow-2xl hover:shadow-[#E8A020]/15 hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#E8A020] rounded-t-2xl" aria-hidden="true" />
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#E8A020]/8 to-transparent pointer-events-none" aria-hidden="true" />

                <div className="relative w-14 h-14 rounded-xl flex items-center justify-center mb-5 bg-[#E8A020]/12" style={{ boxShadow: "0 8px 24px -8px rgba(232,160,32,0.4)" }}>
                  <PenLine className="w-7 h-7 text-[#E8A020]" />
                </div>

                <p className="relative text-xs font-bold uppercase tracking-wider text-[#B87C10] mb-1">{c.path2Title}</p>
                <h2 className="relative text-xl font-extrabold text-[#1A3D4A] mb-2">{c.path2Cta}</h2>
                <p className="relative text-slate-500 text-sm mb-6 flex-grow leading-relaxed">{c.path2Desc}</p>
                <div className="relative flex items-center font-semibold text-sm text-[#B87C10]">
                  <span className="mr-2">{isZh ? "填寫查詢表" : "Fill in the form"}</span>
                  <ArrowRight className="w-4 h-4 rotate-90 group-hover:translate-y-0.5 transition-transform" />
                </div>
              </a>
            </div>

            {/* Secondary options row */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Phone */}
              <a
                href={`tel:${PHONE_TEL}`}
                className="group flex items-center gap-4 bg-white/80 backdrop-blur rounded-xl p-4 border border-slate-100 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-[#3D8B89]/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#3D8B89]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{c.cards.phoneTitle}</p>
                  <p className="font-bold text-[#1A3D4A] text-sm tabular-nums">{PHONE}</p>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${EMAIL}?subject=${encodeURIComponent(isZh ? "課程查詢" : "Programme Enquiry")}`}
                className="group flex items-center gap-4 bg-white/80 backdrop-blur rounded-xl p-4 border border-slate-100 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-[#3D8B89]/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#3D8B89]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{c.cards.formTitle}</p>
                  <p className="font-bold text-[#1A3D4A] text-sm break-all">{EMAIL}</p>
                </div>
              </a>

              {/* Meeting */}
              <a
                href={`mailto:${EMAIL}?subject=${encodeURIComponent(isZh ? "預約到校開會 / 參觀營地" : "Book a school meeting / campsite tour")}`}
                className="group flex items-center gap-4 bg-white/80 backdrop-blur rounded-xl p-4 border border-slate-100 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-[#E8A020]/10 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-5 h-5 text-[#E8A020]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{c.cards.meetingTitle}</p>
                  <p className="font-bold text-[#1A3D4A] text-sm">{c.cards.meetingCta}</p>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* ── Trust badges row ──────────────────────────────────────────── */}
        <section className="bg-[#FAF7F2] pt-16 pb-10 mt-12">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-center text-[10px] font-bold tracking-[0.2em] uppercase text-[#3D8B89] mb-5">
              {isZh ? "受信任的合作夥伴" : "Trusted credentials"}
            </p>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 md:gap-x-14">
              {trustBadges.map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={i} className="flex items-center gap-2.5">
                    <Icon className={`w-5 h-5 ${b.accent ? "text-[#E8A020]" : "text-[#3D8B89]"}`} />
                    <span className="font-semibold text-[#1A3D4A] text-sm">{b.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Form + sidebar ────────────────────────────────────────────── */}
        <section
          id="enquiry-form"
          className="relative bg-[#FAF7F2] py-16 px-4 sm:px-6 scroll-mt-24"
        >
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            aria-hidden="true"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(26,61,74,0.7) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Form */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-2xl shadow-[#1A3D4A]/[0.08]">
              <div className="flex items-center mb-2">
                <span className="w-9 h-9 rounded-xl bg-[#E8A020]/15 flex items-center justify-center mr-3 shrink-0">
                  <PenLine className="w-4 h-4 text-[#E8A020]" />
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-extrabold text-[#1A3D4A]">
                  {c.formTitle}
                </h2>
              </div>
              <p className="text-sm text-slate-500 mb-7 ml-12">{c.formSub}</p>
              <InlineEnquiryForm />
              <p className="mt-5 text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3D8B89]" />
                {c.ctaDisclaimer}
              </p>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact info */}
              <div className="relative bg-gradient-to-br from-[#1A3D4A] to-[#0F2A33] rounded-3xl p-7 text-white shadow-2xl shadow-[#1A3D4A]/30 overflow-hidden">
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#3D8B89]/20 blur-2xl pointer-events-none" aria-hidden="true" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[#E8A020]/10 blur-2xl pointer-events-none" aria-hidden="true" />
                <h3 className="relative text-xs font-bold tracking-[0.18em] uppercase text-[#E8A020] mb-6">
                  {c.infoTitle}
                </h3>

                <div className="relative space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-[#E8A020]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-0.5">{c.phone}</p>
                      <a href={`tel:${PHONE_TEL}`} className="font-bold text-white hover:text-[#E8A020] transition-colors text-base tabular-nums">
                        +852 {PHONE}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-[#E8A020]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-0.5">{c.email}</p>
                      <a href={`mailto:${EMAIL}`} className="font-bold text-white hover:text-[#E8A020] transition-colors text-sm break-all">
                        {EMAIL}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-[#E8A020]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-0.5">{c.address}</p>
                      <p className="font-medium text-white/90 text-sm whitespace-pre-line leading-relaxed">{c.addressValue}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-[#E8A020]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-0.5">{c.hours}</p>
                      <p className="font-medium text-white/90 text-sm whitespace-pre-line leading-relaxed">{c.hoursValue}</p>
                      <div className="mt-2 inline-flex items-center px-2.5 py-1 rounded-md bg-[#3D8B89]/30 border border-[#3D8B89]/40 text-[#9DD8D6] text-xs font-semibold">
                        {c.replyPromise}
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-white/10">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-3">{c.socialFollow}</p>
                    <div className="flex gap-2.5">
                      <a href="https://www.facebook.com/juntarhk" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                        <Facebook className="w-5 h-5" />
                      </a>
                      <a href="https://www.instagram.com/juntarhk" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                        <Instagram className="w-5 h-5" />
                      </a>
                      <a href={`${WHATSAPP_URL}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-10 h-10 rounded-xl bg-[#25D366] hover:bg-[#1fbb5a] flex items-center justify-center transition-colors shadow-lg shadow-[#25D366]/30">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ — custom accessible accordion; answers always in DOM for crawlers */}
              <div className="bg-white rounded-3xl p-6 md:p-7 border border-slate-100 shadow-xl shadow-[#1A3D4A]/[0.06]">
                <h3 className="text-lg font-bold text-[#1A3D4A] mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-5 rounded-full bg-[#E8A020]" />
                  {c.faqTitle}
                </h3>
                <div className="w-full divide-y divide-slate-100">
                  {c.faq.map((item, i) => {
                    const panelId = `faq-panel-${i}`;
                    const btnId = `faq-btn-${i}`;
                    const isOpen = openFaqIdx === i;
                    return (
                      <div key={i}>
                        <button
                          id={btnId}
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => setOpenFaqIdx(isOpen ? null : i)}
                          className="w-full text-left font-semibold text-slate-800 hover:text-[#3D8B89] text-sm py-4 flex items-center justify-between gap-2 transition-colors"
                        >
                          <span>{item.q}</span>
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                        {/* Answer always rendered in DOM; visual collapse via max-height only */}
                        <div
                          id={panelId}
                          role="region"
                          aria-labelledby={btnId}
                          className="overflow-hidden transition-[max-height] duration-200 ease-in-out"
                          style={{ maxHeight: isOpen ? "32rem" : "0px" }}
                        >
                          <p className="text-slate-500 leading-relaxed text-sm pb-4">{item.a}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
