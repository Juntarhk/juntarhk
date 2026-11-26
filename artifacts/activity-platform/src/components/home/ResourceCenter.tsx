import { Link } from "wouter";
import { motion } from "framer-motion";
import { Download, FileText, Award, ClipboardCheck, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function ResourceCenter() {
  const { lang } = useLanguage();
  const zh = lang === "zh";

  const RESOURCES = [
    {
      icon: Award,
      tag: zh ? "攝影課程" : "Photography",
      tagColor: "bg-[#E8A020] text-[#1A3D4A]",
      title: zh ? "攝影及校園媒體課程大綱樣本" : "Photography & School Media Programme Outline",
      desc: zh
        ? "基礎攝影、手機攝影、校園記者及校園電視台課程的標準大綱樣本，包括學習目標、節數分配及學生作品說明，供老師參考及提交校方審批。"
        : "Standard course outline samples for basic photography, mobile photography, campus reporter and campus TV programmes — learning objectives, session plans and student output descriptions for school approval.",
      pages: zh ? "聯絡索取" : "Request via contact",
      size: "",
    },
    {
      icon: FileText,
      tag: "AI",
      tagColor: "bg-[#3D8B89] text-white",
      title: zh ? "AI 教育課程建議書範本" : "AI Education Programme Proposal Template",
      desc: zh
        ? "AI 動畫、手機攝影 × AI 圖像製作及教師 AI 工作流課程的建議書範本，包括課程目標、學習成果、評估方式及預算框架，方便學校規劃及申請相關支援。"
        : "Proposal template for AI animation, Mobile Photography × AI Image Creation and teacher AI workflow programmes — objectives, learning outcomes, assessment and budget framework for school planning.",
      pages: zh ? "聯絡索取" : "Request via contact",
      size: "",
    },
    {
      icon: ClipboardCheck,
      tag: zh ? "校園媒體" : "Campus Media",
      tagColor: "bg-[#1A3D4A] text-white",
      title: zh ? "校園電視台開辦建議" : "Campus TV Launch Guide",
      desc: zh
        ? "為學校開設校園電視台或校園記者隊的實用指引，涵蓋設備建議、課程規劃、師生分工及第一個學期的執行時間表。"
        : "Practical guide for schools setting up a campus TV station or campus reporter team — equipment advice, curriculum planning, roles and a first-semester execution timeline.",
      pages: zh ? "聯絡索取" : "Request via contact",
      size: "",
    },
  ];

  return (
    <section className="py-24 bg-[#F5F5DC]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 lg:sticky lg:top-24"
          >
            <span className="inline-block bg-primary/20 border border-primary/40 text-primary text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
              {zh ? "Resource Center" : "Resource Center"}
            </span>
            <h2 className="font-display text-4xl font-extrabold text-[#1A3D4A] leading-tight mb-4">
              {zh ? "老師資源中心" : "Teacher Resource Centre"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {zh
                ? "我哋為老師準備咗課程大綱樣本、建議書範本及校園媒體開辦指引，方便學校規劃課程、提交審批及作撥款參考。"
                : "Course outline samples, programme proposal templates and campus media launch guides — to help schools plan, seek approval and reference for funding applications."}
            </p>
            <div className="rounded-2xl bg-white border border-border p-5 shadow-sm">
              <div className="text-sm font-bold text-[#1A3D4A] mb-2">
                {zh ? "需要更多支援？" : "Need more support?"}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {zh
                  ? "可以聯絡我哋了解課程詳情及索取文件範本，免費提供。"
                  : "Contact us to discuss course details and request document templates — free of charge."}
              </p>
              <Link href="/contact" className="block w-full h-11 leading-[2.75rem] text-center rounded-full bg-[#1A3D4A] text-white font-bold text-sm hover:bg-[#1A3D4A]/90 transition">
                {zh ? "聯絡索取資料" : "Request Materials"}
              </Link>
            </div>
          </motion.div>

          <div className="lg:col-span-8 space-y-4">
            {RESOURCES.map((r, idx) => {
              const Icon = r.icon;
              return (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="group rounded-2xl bg-white border border-border p-6 hover:border-primary/50 hover:shadow-xl transition flex flex-col sm:flex-row items-start gap-5"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-[#1A3D4A]/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Icon className="w-7 h-7 text-[#1A3D4A]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${r.tagColor}`}>{r.tag}</span>
                      <span className="text-[11px] text-muted-foreground font-semibold">{r.pages} · {r.size}</span>
                    </div>
                    <h3 className="font-display text-xl font-extrabold text-[#1A3D4A] mb-1.5 leading-tight">{r.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
                  </div>

                  <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                    <Link href="/contact" className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-[#E8A020] text-[#1A3D4A] font-bold text-sm group-hover:shadow-lg transition">
                      <Download className="w-4 h-4" /> {zh ? "聯絡索取" : "Request"}
                    </Link>
                    <Link href="/contact" className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-full text-xs font-bold text-primary hover:bg-primary/5">
                      {zh ? "預覽" : "Preview"} <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
