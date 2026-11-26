import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Rocket, Tent } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function PackagedSolutions() {
  const { lang } = useLanguage();
  const zh = lang === "zh";

  // VERIFY: safe framing — no automatic LWLF/QEF eligibility claims; funding copy per audit guidelines
  const PACKAGES = [
    {
      icon: Sparkles,
      badge: zh ? "影像及校園媒體" : "Photography & Media",
      badgeColor: "bg-[#E8A020] text-[#1A3D4A]",
      title: zh ? "攝影及校園媒體課程方案" : "Photography & School Media Package",
      sub: zh ? "Photography · Campus Reporter · Campus TV" : "Photography · Campus Reporter · Campus TV",
      desc: zh
        ? "度身訂製攝影及校園媒體課程套裝，包括課程大綱、學習成果框架及報告範本，協助學校規劃及提交審批。可按學校發展需要諮詢相關撥款規劃，實際申請及審批以教育局指引為準。"
        : "Tailored photography and school media course packages including outline, learning outcomes and report templates. We can advise on funding planning — actual approval subject to EDB guidelines.",
      bullets: zh
        ? ["課程大綱及學習成果", "學生作品展示支援", "課程資助諮詢"]
        : ["Curriculum outline & outcomes", "Student showcase support", "Funding application advice"],
      image: "/event-archery.jpg",
      price: zh ? "由 HK$ 8,000 起" : "From HK$ 8,000",
      cta: zh ? "查詢課程詳情" : "Request Details",
    },
    {
      icon: Rocket,
      badge: zh ? "AI 教育" : "AI Education",
      badgeColor: "bg-[#3D8B89] text-white",
      title: zh ? "AI 創作教育課程方案" : "AI Creation Education Package",
      sub: zh ? "AI Animation · Mobile Photo × AI Image · Chinese Culture" : "AI Animation · Mobile Photo × AI Image · Chinese Culture",
      desc: zh
        ? "AI 動畫創作、手機攝影 × AI 圖像製作或 AI 中華文化數碼故事課程套裝，附學生作品展示日，讓學生由 AI 使用者成為 AI 創作者。可按需要提供課程建議書及評估框架。"
        : "AI animation, Mobile Photography × AI Image Creation or AI and Chinese culture course packages with student showcase — transforming students from AI users to AI creators. Proposal and evaluation framework available on request.",
      bullets: zh
        ? ["完整 AI 創作課程", "學生作品展示日", "課程建議書支援"]
        : ["Full AI creation curriculum", "Student showcase day", "Proposal & framework support"],
      image: "/event-cornhole.jpg",
      price: zh ? "由 HK$ 16,000 起" : "From HK$ 16,000",
      cta: zh ? "了解課程詳情" : "Learn More",
    },
    {
      icon: Tent,
      badge: zh ? "歷奇及體驗學習" : "Adventure Learning",
      badgeColor: "bg-[#1A3D4A] text-white",
      title: zh ? "80,000 sq.ft. 歷奇營" : "80,000 sq.ft. Adventure Camp",
      sub: zh ? "Adventure Camp" : "Adventure Camp",
      desc: zh
        ? "1-3 日校外歷奇訓練，攀石、Zip-line、繩網陣、團隊解難，自家營地夠大、教練 SCRC 認證、保險全包。"
        : "1-3 day adventure training: rock climbing, zip-line, rope course, team challenges. Our own large campsite, SCRC-checked instructors, full insurance.",
      bullets: zh
        ? ["1-3 日靈活組合", "公眾責任保險全包", "SCRC 查核教練"]
        : ["Flexible 1-3 day options", "Full public liability insurance", "SCRC-checked instructors"],
      image: "/event-climbing.jpg",
      price: zh ? "由 HK$ 480/位 起" : "From HK$ 480/pax",
      cta: zh ? "預約場地參觀" : "Book Site Visit",
    },
  ];

  return (
    <section className="py-24 bg-[#FAF7F2]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-14">
          <span className="inline-block bg-primary/20 border border-primary/40 text-primary text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
            {zh ? "即用方案" : "Packaged Solutions"}
          </span>
          <h2 className="font-display text-4xl font-extrabold text-[#1A3D4A] mb-3">
            {zh ? "三大課程方案 · 按需度身設計" : "Three course packages — tailored to your school"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {zh
              ? "攝影及媒體、AI 教育、歷奇訓練，按學生年級及校本主題度身訂製，附課程大綱及學習成果報告。"
              : "Photography & media, AI education and adventure learning — customised by grade and school theme, with course outlines and outcome reports."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PACKAGES.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group rounded-3xl overflow-hidden bg-white border border-border shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col"
              >
                <div className="relative aspect-[16/9] bg-cover bg-center" style={{ backgroundImage: `url(${p.image})` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className={`absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold ${p.badgeColor} shadow-lg`}>
                    <Icon className="w-3.5 h-3.5" /> {p.badge}
                  </div>
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-white/95 text-[#1A3D4A] text-xs font-extrabold shadow-lg">
                    {p.price}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="text-[11px] font-bold tracking-wider text-primary uppercase mb-1">{p.sub}</div>
                  <h3 className="font-display text-2xl font-extrabold text-[#1A3D4A] mb-3 leading-tight">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{p.desc}</p>

                  <ul className="space-y-2 mb-6">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-sm text-foreground/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E8A020]" /> {b}
                      </li>
                    ))}
                  </ul>

                  <Link href="/contact" className="mt-auto inline-flex items-center justify-between gap-2 h-12 px-5 rounded-full bg-[#1A3D4A] group-hover:bg-primary text-white font-bold transition">
                    <span>{p.cta}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
