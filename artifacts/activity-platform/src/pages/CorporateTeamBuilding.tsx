import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import { CorporateCaseCard } from "@/components/corporate/CorporateCaseCard";
import { CorporateEnquiryForm } from "@/components/corporate/CorporateEnquiryForm";
import { corporateCases } from "@/data/corporate-cases";
import { ArrowDownRight, Users, MapPin, Target, Settings, MessageCircle, FileText, CheckCircle2, Flag, RotateCcw } from "lucide-react";
import { gtagEvent } from "@/lib/gtag";

export default function CorporateTeamBuilding() {
  const { lang } = useLanguage();

  const handleWhatsAppClick = () => {
    gtagEvent("click_whatsapp", { category: "corporate_hero" });
    window.open("https://wa.me/85297289412?text=Hello%20JuntarHK,%20I%20would%20like%20to%20enquire%20about%20Corporate%20Team%20Building.", "_blank");
  };

  const handleEmailClick = () => {
    gtagEvent("click_email", { category: "corporate_contact" });
    window.location.href = "mailto:info@juntarhk.com";
  };

  const scrollToSection = (id: string) => {
    gtagEvent("click_anchor", { target: id });
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const t = {
    metaTitle: lang === "zh" ? "香港企業Team Building及團隊培訓｜JuntarHK" : "Corporate Team Building & Training Hong Kong | JuntarHK",
    metaDesc: lang === "zh" 
      ? "JuntarHK為香港企業提供度身訂造Team Building及團隊培訓，結合體驗式任務、專業引導及Debrief，支援小組至大型企業活動。" 
      : "JuntarHK provides tailored Corporate Team Building and Training in Hong Kong, combining experiential tasks, professional facilitation and debriefs for small to large enterprise events.",
    
    heroEyebrow: "JUNTARHK CORPORATE EXPERIENCES",
    heroTitle: lang === "zh" ? "唔止一日好玩，而係令團隊合作真正有改變" : "More than a fun day — create real change in how your team works",
    heroBody: lang === "zh"
      ? "我哋按企業目標、人數、場地及團隊狀況度身設計體驗式Team Building，結合主題任務、專業引導及結構化Debrief，將活動體驗連結到日常工作。"
      : "We design experiential team building around your business objectives, group size, venue and team dynamics—combining themed challenges, professional facilitation and structured debriefs that connect the experience back to everyday work.",
    heroCTA1: lang === "zh" ? "WhatsApp 查詢" : "WhatsApp Us",
    heroCTA2: lang === "zh" ? "查看案例" : "View Cases",

    proofItems: [
      {
        icon: Users,
        title: lang === "zh" ? "小組至大型團隊方案" : "Small to Large Group Solutions",
      },
      {
        icon: MapPin,
        title: lang === "zh" ? "室內、戶外及夥伴場地安排" : "Indoor, Outdoor & Partner Venues",
      },
      {
        icon: MessageCircle,
        title: lang === "zh" ? "主題活動結合專業引導反思" : "Themed Activities with Professional Debrief",
      },
      {
        icon: Target,
        title: lang === "zh" ? "針對企業目標度身訂造" : "Tailored to Corporate Objectives",
      }
    ],

    casesTitle: lang === "zh" ? "團隊培訓案例" : "Featured Cases",
    
    needsTitle: lang === "zh" ? "針對核心團隊需求" : "Addressing Core Team Needs",
    needs: [
      lang === "zh" ? "溝通" : "Communication",
      lang === "zh" ? "信任及心理安全感" : "Trust & psychological safety",
      lang === "zh" ? "角色清晰" : "Role clarity",
      lang === "zh" ? "執行力" : "Execution",
      lang === "zh" ? "跨部門協作" : "Cross-department collaboration",
      lang === "zh" ? "領導及共同目標" : "Leadership & shared goals"
    ],

    formatsTitle: lang === "zh" ? "培訓活動形式" : "Programme Formats",
    formats: [
      { title: lang === "zh" ? "2–3小時主題活動" : "2–3 Hour Themed Activity", desc: lang === "zh" ? "適合會議、部門聚會或短時段團隊連結。" : "A focused format for meetings, department gatherings or short team connection." },
      { title: lang === "zh" ? "半日工作坊" : "Half-Day Workshop", desc: lang === "zh" ? "結合體驗任務、引導反思及團隊行動重點。" : "Experiential tasks, facilitated reflection and practical team actions." },
      { title: lang === "zh" ? "全日方案" : "Full-Day Programme", desc: lang === "zh" ? "以較完整流程深入處理團隊目標及協作模式。" : "A fuller journey to explore team objectives and collaboration patterns." },
      { title: lang === "zh" ? "大型Kick-off或員工活動" : "Large Kick-off or Staff Event", desc: lang === "zh" ? "為大型團隊設計具主題、節奏及共同目標嘅參與體驗。" : "A themed, well-paced shared experience designed for larger teams." },
    ],
    formatsDisclaimer: lang === "zh" ? "每個方案按需要報價；場地、餐飲、攝影攝錄及其他附加服務會分開列明。" : "Every programme is quoted to scope; venue, catering, photo/video coverage and other add-ons are listed separately.",

    processTitle: lang === "zh" ? "度身訂造設計流程" : "Custom Design Process",
    process: [
      { icon: MessageCircle, title: lang === "zh" ? "了解需要" : "Understand Needs" },
      { icon: FileText, title: lang === "zh" ? "設計目標及活動" : "Design Objectives & Activities" },
      { icon: Settings, title: lang === "zh" ? "確認流程、安全及場地" : "Confirm Logistics, Safety & Venue" },
      { icon: Flag, title: lang === "zh" ? "活動執行及引導" : "Delivery & Facilitation" },
      { icon: RotateCcw, title: lang === "zh" ? "Debrief及跟進" : "Debrief & Follow-up" }
    ],

    formTitle: lang === "zh" ? "聯絡我們" : "Contact Us",
    emailCTA: lang === "zh" ? "電郵查詢: info@juntarhk.com" : "Email us: info@juntarhk.com",

    faqTitle: lang === "zh" ? "常見問題" : "Common Questions",
    faqs: [
      {
        q: lang === "zh" ? "活動適合多少人參與？" : "What is the participant size?",
        a: lang === "zh" ? "我們可根據企業需求，設計適合小型團隊至大型企業規模的活動方案。" : "We design solutions suitable for small teams to large enterprise groups based on corporate needs."
      },
      {
        q: lang === "zh" ? "可唔可以室內或戶外進行？" : "Can programmes run indoors or outdoors?",
        a: lang === "zh" ? "可以。我哋會按目標、人數、天氣風險及場地條件建議室內、戶外或混合方案。" : "Yes. We recommend an indoor, outdoor or blended format based on objectives, group size, weather risk and venue constraints."
      },
      {
        q: lang === "zh" ? "可以加入公司主題嗎？" : "Can you customise a company theme?",
        a: lang === "zh" ? "可以。方案可按公司文化、年度主題、共同目標或指定活動概念度身設計。" : "Yes. The programme can be shaped around company culture, an annual theme, shared objectives or a specific event concept."
      },
      {
        q: lang === "zh" ? "報價包括啲咩？" : "What does the quotation cover?",
        a: lang === "zh" ? "報價會按方案列明活動設計、所需人手、物資及已確認嘅執行範圍，方便逐項審閱。" : "The quotation itemises the programme design, staffing, materials and confirmed delivery scope for review."
      },
      {
        q: lang === "zh" ? "遇到惡劣天氣點安排？" : "What happens in bad weather?",
        a: lang === "zh" ? "戶外方案會在籌備階段協議天氣應變安排，包括改期、調整流程或可行嘅室內替代方案。" : "Outdoor programmes include an agreed weather contingency, such as rescheduling, an adjusted flow or a feasible indoor alternative."
      },
      {
        q: lang === "zh" ? "有咩附加服務？" : "What add-on services are available?",
        a: lang === "zh" ? "可按需要另行報價場地、餐飲、攝影攝錄或其他活動支援；實際可提供項目以方案確認為準。" : "Venue, catering, photo/video coverage and other event support can be quoted separately, subject to confirmation in the proposal."
      }
    ]
  };

  const schemaService = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": t.metaTitle,
    "provider": {
      "@type": "Organization",
      "name": "JuntarHK"
    },
    "description": t.metaDesc
  };

  const schemaFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": t.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <AppLayout darkHero={true}>
      <SEO title={t.metaTitle} description={t.metaDesc} lang={lang} path="/corporate-team-building" />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schemaService)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaFAQ)}</script>
      </Helmet>
      
      <div className="bg-[#0B1220] text-white min-h-screen selection:bg-[#4C9AFF]/30 selection:text-[#4C9AFF]">
        
        {/* 1. HERO */}
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[#0B1220]/80 z-10 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-[#0B1220]/90 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent z-10" />
            <img 
              src="/wargame-3.jpg" 
              alt={lang === "zh" ? "JuntarHK 企業團隊培訓與體驗式任務" : "JuntarHK Corporate Team Building and Experiential Tasks"} 
              className="w-full h-full object-cover grayscale-[30%] object-center scale-105" 
            />
          </div>

          <div className="container mx-auto px-6 relative z-20 max-w-[1120px]">
            <div className="max-w-3xl">
              <p className="mb-6 text-sm font-bold tracking-[0.2em] text-[#4C9AFF]">{t.heroEyebrow}</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-[1.2] whitespace-pre-line text-white">
                {t.heroTitle}
              </h1>
              <p className="text-[#9CA3AF] text-lg leading-relaxed mb-10 max-w-2xl">
                {t.heroBody}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleWhatsAppClick}
                  className="flex items-center justify-center h-12 md:h-14 px-8 bg-[#FF8A3D] hover:bg-[#E6752D] text-white font-bold text-lg rounded-xl transition-colors border-none min-w-[200px]"
                >
                  {t.heroCTA1}
                </button>
                <button 
                  onClick={() => scrollToSection('cases')}
                  className="flex items-center justify-center h-12 md:h-14 px-8 bg-[#162033] hover:bg-[#1E2D4A] border border-[#4C9AFF]/30 text-white font-bold text-lg rounded-xl transition-colors min-w-[200px]"
                >
                  {t.heroCTA2}
                  <ArrowDownRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. PROOF STRIP */}
        <section className="border-y border-[#162033] bg-[#0B1220] relative z-20">
          <div className="container mx-auto px-6 max-w-[1120px]">
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#162033]">
              {t.proofItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="py-8 md:px-6 flex flex-col items-center text-center">
                    <Icon className="w-8 h-8 text-[#4C9AFF] mb-4" />
                    <h3 className="text-white font-medium text-base leading-snug">{item.title}</h3>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. FEATURED CASES */}
        <section id="cases" className="py-24 md:py-32 relative">
          <div className="container mx-auto px-6 max-w-[1120px]">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                {t.casesTitle}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {corporateCases.map(cs => (
                <CorporateCaseCard key={cs.slug} caseStudy={cs} />
              ))}
            </div>
          </div>
        </section>

        {/* 4. SIX TEAM NEEDS */}
        <section className="py-20 md:py-28 bg-[#162033]">
          <div className="container mx-auto px-6 max-w-[1120px]">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
              {t.needsTitle}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {t.needs.map((need, i) => (
                <div key={i} className="bg-[#0B1220] border border-[#1E2D4A] p-6 rounded-xl flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-[#4C9AFF] mr-3 shrink-0" />
                  <span className="text-white font-medium text-lg">{need}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. FOUR PROGRAMME FORMATS & DISCLAIMER */}
        <section className="py-24 md:py-32 relative">
          <div className="container mx-auto px-6 max-w-[1120px]">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
              {t.formatsTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {t.formats.map((format, i) => (
                <div key={i} className="p-8 border border-[#162033] rounded-xl bg-[#0B1220] hover:border-[#4C9AFF]/50 transition-colors">
                  <h3 className="text-xl font-bold text-[#4C9AFF] mb-3">{format.title}</h3>
                  <p className="text-[#9CA3AF] text-lg">{format.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-[#9CA3AF] text-sm italic">{t.formatsDisclaimer}</p>
          </div>
        </section>

        {/* 6. FIVE-STEP DESIGN PROCESS */}
        <section className="py-20 md:py-28 bg-[#162033]">
          <div className="container mx-auto px-6 max-w-[1120px]">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">
              {t.processTitle}
            </h2>
            <div className="flex flex-col md:flex-row justify-between items-center relative space-y-8 md:space-y-0">
              {/* Desktop connecting line */}
              <div className="hidden md:block absolute top-6 left-12 right-12 h-px bg-[#1E2D4A] z-0" />
              
              {t.process.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex flex-col items-center relative z-10 w-full md:w-1/5 text-center">
                    <div className="w-12 h-12 rounded-full bg-[#0B1220] border-2 border-[#4C9AFF] flex items-center justify-center mb-4 text-[#4C9AFF]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-white font-medium text-lg mb-1">{step.title}</span>
                    <span className="text-[#4C9AFF] font-bold text-sm opacity-50">0{i + 1}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. CONTACT CTA / FORM */}
        <section id="enquiry-form" className="py-24 md:py-32 relative">
          <div className="container mx-auto px-6 max-w-[1120px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  {t.formTitle}
                </h2>
                <p className="text-[#9CA3AF] text-lg mb-8">
                  {lang === "zh" ? "歡迎填寫表格或直接透過 WhatsApp / 電郵與我們聯絡。" : "Please fill out the form or contact us directly via WhatsApp / Email."}
                </p>
                <div className="space-y-4 mb-12">
                  <button onClick={handleWhatsAppClick} className="flex items-center text-[#4C9AFF] font-medium text-lg hover:underline underline-offset-4">
                    <MessageCircle className="w-5 h-5 mr-3" />
                    {t.heroCTA1}
                  </button>
                  <button onClick={handleEmailClick} className="flex items-center text-[#4C9AFF] font-medium text-lg hover:underline underline-offset-4">
                    <MessageCircle className="w-5 h-5 mr-3" />
                    {t.emailCTA}
                  </button>
                </div>
              </div>
              <div className="lg:-mt-4 relative">
                <CorporateEnquiryForm />
              </div>
            </div>
          </div>
        </section>

        {/* 8. SIX REQUIRED FAQs */}
        <section className="py-24 md:py-32 bg-[#162033] border-t border-[#1E2D4A]">
          <div className="container mx-auto px-6 max-w-[1120px]">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
              {t.faqTitle}
            </h2>
            <div className="space-y-4 max-w-3xl">
              {t.faqs.map((faq, i) => (
                <details key={i} className="group bg-[#0B1220] border border-[#1E2D4A] rounded-xl p-6 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#4C9AFF] focus-visible:outline-none [&_summary::-webkit-details-marker]:hidden">
                  <summary className="text-lg font-bold text-white list-none flex justify-between items-center pr-2">
                    {faq.q}
                    <span className="text-[#4C9AFF] text-2xl group-open:rotate-45 transition-transform duration-300 motion-reduce:transition-none">+</span>
                  </summary>
                  <div className="mt-4 pt-4 border-t border-[#1E2D4A] text-[#9CA3AF] text-base leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
        
      </div>
    </AppLayout>
  );
}