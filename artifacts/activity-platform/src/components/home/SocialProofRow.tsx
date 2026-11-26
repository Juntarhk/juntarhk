import { motion } from "framer-motion";
import { Quote, Star, School, Activity, Award, Tent } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSeoSettings } from "@/contexts/SeoSettingsContext";
import { SCHOOLS_SERVED, FOUNDER_EXPERIENCE_YEARS } from "@/config/business-facts";

export function SocialProofRow() {
  const { lang } = useLanguage();
  const zh = lang === "zh";
  const settings = useSeoSettings();

  const MICRO_STATS = [
    {
      icon: School,
      value: settings["stat_schools_served"] || SCHOOLS_SERVED,
      label: zh ? "合作學校及機構" : "Partner Schools",
      sub: zh ? "幼稚園、小學、中學、大學及非牟利機構" : "Kindergarten to university and NGOs",
    },
    {
      icon: Activity,
      value: settings["stat_activity_programmes"] || "400+",
      label: zh ? "活動及課程" : "Activities & Courses",
      sub: zh ? "攝影、AI 教育及歷奇訓練" : "Photography, AI education & adventure",
    },
    {
      icon: Award,
      value: settings["stat_experience_years"] || FOUNDER_EXPERIENCE_YEARS,
      label: zh ? "年攝影及教育經驗" : "Years Photography & Education",
      sub: zh ? "由攝影師兼教育工作者創辦" : "Founded by a photographer-educator",
    },
    {
      icon: Tent,
      value: settings["stat_campsite_sqft"] || "80,000",
      label: zh ? "sq.ft. 自家營地" : "sq.ft. Owned Campsite",
      sub: zh ? "粉嶺沙頭角 · 3 大分區" : "Fanling Sha Tau Kok · 3 zones",
    },
  ];

  return (
    <section className="py-24 bg-[#FAF7F2]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-14">
          <span className="inline-block bg-primary/20 border border-primary/40 text-primary text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
            {zh ? "Trusted by HK Schools" : "Trusted by HK Schools"}
          </span>
          <h2 className="font-display text-4xl font-extrabold text-[#1A3D4A]">
            {zh ? "老師同學校點睇我哋" : "What teachers and schools say"}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-[#1A3D4A] to-[#3D8B89] text-white p-8 md:p-10 relative overflow-hidden shadow-xl"
          >
            <Quote className="absolute -top-2 -left-2 w-32 h-32 text-white/10" strokeWidth={1} />
            <div className="relative">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#E8A020] text-[#E8A020]" />
                ))}
              </div>
              <p className="text-xl md:text-2xl font-medium leading-relaxed mb-8">
                {zh
                  ? "「JuntarHK 嘅導師全部都有 SCRC 查核，行政手續好簡單，幫我哋慳咗好多時間。學生學得開心，我哋老師可以專心教學，非常放心交托俾佢哋。」"
                  : "\"JuntarHK's instructors are all SCRC-checked, the admin is straightforward and saves us a lot of time. Students enjoy learning and we teachers can focus on teaching — we trust them completely.\""}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#E8A020] text-[#1A3D4A] flex items-center justify-center font-extrabold text-xl shadow-lg">
                  {zh ? "陳" : "C"}
                </div>
                <div>
                  <div className="font-extrabold text-lg">{zh ? "陳老師" : "Ms. Chan"}</div>
                  <div className="text-sm text-white/75">
                    {zh ? "課外活動主任 · 青年會書院" : "ECA Coordinator · YMCA College"}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {MICRO_STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl bg-[#F5F5DC] border border-border p-5 hover:shadow-lg transition flex flex-col"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#E8A020]/15 border border-[#E8A020]/30 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-[#c8841a]" />
                  </div>
                  <div className="font-display text-3xl font-extrabold text-[#1A3D4A] leading-none mb-1">{s.value}</div>
                  <div className="text-sm font-bold text-foreground">{s.label}</div>
                  <div className="text-[11px] text-muted-foreground mt-1 leading-tight">{s.sub}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
