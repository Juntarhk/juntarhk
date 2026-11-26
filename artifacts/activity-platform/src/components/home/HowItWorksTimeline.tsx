import { motion } from "framer-motion";
import { MessageSquare, FileText, Settings, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function HowItWorksTimeline() {
  const { lang } = useLanguage();
  const zh = lang === "zh";

  const STEPS = [
    {
      icon: MessageSquare,
      title: zh ? "聯絡我們，了解需要" : "Contact Us — Understand Your Needs",
      desc: zh
        ? "透過網上表格或 WhatsApp 聯絡我們，告訴我們課程目標及學生年級。"
        : "Contact us via the enquiry form or WhatsApp and tell us your programme goals and student levels.",
    },
    {
      icon: FileText,
      title: zh ? "度身訂製課程建議書" : "Tailored Course Proposal",
      desc: zh
        ? "我們提供課程大綱、學習成果框架、排期建議及預算，供學校內部審批。"
        : "We provide a course outline, learning outcome framework, schedule and budget for your school's internal approval.",
    },
    {
      icon: Settings,
      title: zh ? "安排導師及器材" : "Arrange Instructor & Equipment",
      desc: zh
        ? "確認後安排合適導師及所需器材，全部 SCRC 查核，並備有公眾責任保險。"
        : "Once confirmed, we arrange the right SCRC-checked instructors and equipment, all covered by public liability insurance.",
    },
    {
      icon: Award,
      title: zh ? "課程執行及成果報告" : "Deliver Programme & Outcomes Report",
      desc: zh
        ? "專業導師到校執行課程，完成後提交學生作品、學習報告及評估資料。"
        : "Professional instructors deliver on-site. Afterwards, we submit student work, a learning report and evaluation data.",
    },
  ];

  return (
    <section className="py-24 bg-[#1A3D4A] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(61,139,137,0.25),transparent_70%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block bg-white/10 text-white/70 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
            {zh ? "合作流程" : "How We Work"}
          </span>
          <h2 className="font-display text-4xl font-extrabold">
            {zh ? "四個步驟，開始合作" : "Four Steps to Get Started"}
          </h2>
        </div>

        {/* Vertical timeline on mobile, horizontal on desktop */}
        <div className="relative">
          {/* Desktop connector line */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-transparent via-[#E8A020]/50 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 lg:gap-4">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative flex lg:flex-col items-start lg:items-center gap-5 lg:gap-0 pb-10 lg:pb-0 last:pb-0"
                >
                  {/* Mobile: vertical connector */}
                  {i < STEPS.length - 1 && (
                    <div className="lg:hidden absolute left-5 top-14 bottom-0 w-0.5 bg-[#E8A020]/30" />
                  )}

                  {/* Step icon + number */}
                  <div className="flex justify-center mb-0 lg:mb-6 shrink-0">
                    <div className="relative">
                      <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-gradient-to-br from-[#E8A020] to-[#c8841a] flex items-center justify-center shadow-xl">
                        <Icon className="w-9 h-9 lg:w-10 lg:h-10 text-[#1A3D4A]" />
                      </div>
                      <div className="absolute -top-3 -left-3 w-9 h-9 rounded-full bg-white text-[#1A3D4A] flex items-center justify-center font-extrabold text-base shadow-lg">
                        {i + 1}
                      </div>
                    </div>
                  </div>

                  {/* Text */}
                  <div className="text-left lg:text-center lg:px-3 flex-1">
                    <h3 className="font-display text-lg font-extrabold mb-2 leading-tight text-white">{s.title}</h3>
                    <p className="text-sm text-white/70 leading-relaxed">{s.desc}</p>
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
