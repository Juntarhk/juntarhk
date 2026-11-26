import { ShieldCheck, Award, BadgeCheck, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function HeroTrustBadges() {
  const { lang } = useLanguage();
  const zh = lang === "zh";

  const BADGES = [
    {
      icon: ShieldCheck,
      label: zh ? "SCRC 查核" : "SCRC Checked",
      sub: zh ? "全部導師通過查核" : "All instructors verified",
    },
    {
      icon: Award,
      label: zh ? "校本訂製課程" : "School-tailored",
      sub: zh ? "按年級及主題度身設計" : "Tailored by grade & theme",
    },
    {
      icon: BadgeCheck,
      label: zh ? "課程資助諮詢" : "Funding Advice",
      // VERIFY: safe framing — no automatic eligibility claim
      sub: zh ? "可協助規劃撥款申請" : "Help plan funding applications",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-2xl mt-8">
      {BADGES.map((b) => {
        const Icon = b.icon;
        return (
          <div
            key={b.label}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/8 border border-white/15 backdrop-blur-sm"
          >
            <div className="w-9 h-9 rounded-lg bg-[#E8A020]/20 border border-[#E8A020]/40 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-[#E8A020]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-bold leading-tight text-white whitespace-nowrap">{b.label}</div>
              <div className="hidden sm:block text-[10px] text-white/60 leading-tight mt-0.5 truncate">{b.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function HeroFloatingStat() {
  const { lang } = useLanguage();
  const zh = lang === "zh";

  return (
    <div className="hidden lg:flex absolute right-8 top-28 z-20 items-start gap-3 bg-white/95 backdrop-blur text-[#1A3D4A] rounded-2xl px-4 py-3 shadow-xl border border-white/30 max-w-[280px]">
      <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
        <Sparkles className="w-5 h-5 text-primary" />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
            {zh ? "近期項目" : "Recent booking"}
          </div>
        </div>
        <div className="text-sm font-extrabold leading-tight mt-1">
          {zh ? "STEM 工作坊 × 中學" : "STEM Workshop × Sec. School"}
        </div>
        <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">
          {zh ? "120 學生 · 攝影課程" : "120 students · Photography"}
        </div>
      </div>
    </div>
  );
}

export function FeaturedTrustStrip() {
  const { lang } = useLanguage();
  const zh = lang === "zh";

  // VERIFY: safe framing — no automatic eligibility claim; funding copy per audit guidelines
  const ITEMS = [
    { label: zh ? "校本訂製課程" : "School-tailored Courses", color: "bg-[#E8A020] text-[#1A3D4A]" },
    { label: zh ? "課程資助諮詢" : "Funding Advice", color: "bg-[#3D8B89] text-white" },
    { label: zh ? "SCRC 查核導師" : "SCRC-checked Instructors", color: "bg-[#1A3D4A] text-white" },
    { label: zh ? "公眾責任保險" : "Public Liability Insurance", color: "bg-[#1A3D4A] text-white" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
      <span className="text-sm text-muted-foreground font-semibold mr-2">
        {zh ? "所有活動均符合：" : "All programmes meet:"}
      </span>
      {ITEMS.map((it) => (
        <span
          key={it.label}
          className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold shadow-sm ${it.color}`}
        >
          {it.label}
        </span>
      ))}
    </div>
  );
}
