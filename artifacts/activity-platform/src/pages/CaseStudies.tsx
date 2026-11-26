import { Helmet } from "react-helmet-async";
import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { Breadcrumb } from "@/components/Breadcrumb";
import { motion } from "framer-motion";
import { School, ArrowRight, Camera, Sparkles, Mountain, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CASE_STUDIES, type CaseStudy } from "@/data/case-studies-data";

const CATEGORY_META: Record<
  CaseStudy["category"],
  { icon: typeof Camera; labelZh: string; labelEn: string; badge: string }
> = {
  photography: {
    icon: Camera,
    labelZh: "影像及校園媒體",
    labelEn: "Photography & School Media",
    badge: "bg-primary/10 text-primary",
  },
  ai: {
    icon: Sparkles,
    labelZh: "AI 教育及創作",
    labelEn: "AI Education & Creation",
    badge: "bg-amber-100 text-amber-700",
  },
  adventure: {
    icon: Mountain,
    labelZh: "歷奇及體驗學習",
    labelEn: "Adventure & Experiential Learning",
    badge: "bg-muted text-muted-foreground",
  },
};

const LEVEL_LABEL: Record<CaseStudy["schoolLevel"], { zh: string; en: string }> = {
  primary:   { zh: "小學", en: "Primary" },
  secondary: { zh: "中學", en: "Secondary" },
  both:      { zh: "小學及中學", en: "Primary & Secondary" },
};

export default function CaseStudies() {
  const { t, lang } = useLanguage();
  const isZh = lang === "zh";

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: isZh ? "JuntarHK 學校案例" : "JuntarHK School Case Studies",
    description: isZh
      ? "JuntarHK 與本港多所學校及機構合作的課程成果案例（已匿名）"
      : "Anonymised case studies from JuntarHK school programme partnerships in Hong Kong",
    url: "https://www.juntarhk.com/case-studies",
    itemListElement: CASE_STUDIES.map((cs, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://www.juntarhk.com/case-studies/${cs.slug}`,
      name: isZh ? cs.headline.zh : cs.headline.en,
    })),
  };

  return (
    <AppLayout>
      <SEO
        title={
          isZh
            ? "學校案例 | JuntarHK 學校課程服務"
            : "School Case Studies | JuntarHK School Programmes"
        }
        description={
          isZh
            ? "JuntarHK 與本港多所學校及機構合作。閱讀我們的匿名學校案例，了解課程對學生的真實影響。"
            : "JuntarHK works with Hong Kong schools across all levels. Read our anonymised school case studies to see the real impact of our programmes on students."
        }
        path="/case-studies"
        lang={lang}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(itemListJsonLd)}</script>
      </Helmet>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="pt-40 pb-24 bg-[#3D8B89] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/pattern.svg')]" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <Breadcrumb items={[{ label: t.nav.caseStudies }]} />

          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 mt-8">
            <School className="w-4 h-4" />
            <span>{t.nav.caseStudies}</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            {isZh ? "學校合作案例" : "School Case Studies"}
          </h1>

          <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
            {isZh
              ? "以下為 JuntarHK 與香港學校合作的真實課程成果。所有資料已匿名處理，以保障師生私隱。"
              : "Real programme outcomes from JuntarHK's school partnerships in Hong Kong. All details have been anonymised to protect student and staff privacy."}
          </p>
        </div>
      </section>

      {/* ── Case study cards ─────────────────────────────────────────────── */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

          {/* Anonymisation notice */}
          <div className="flex items-center gap-3 bg-white border border-border rounded-xl px-5 py-3 mb-12 max-w-xl mx-auto">
            <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
            <p className="text-sm text-muted-foreground">
              {isZh
                ? "所有學校案例均已匿名處理，不包含任何可識別的學校或個人資料。"
                : "All case studies are anonymised and contain no identifiable school or personal information."}
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {CASE_STUDIES.map((cs, i) => {
              const meta = CATEGORY_META[cs.category];
              const CategoryIcon = meta.icon;
              const level = LEVEL_LABEL[cs.schoolLevel];

              return (
                <motion.article
                  key={cs.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
                >
                  {/* Card header accent */}
                  <div className="h-1 w-full bg-primary" />

                  <div className="p-7 flex flex-col flex-1">
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${meta.badge}`}>
                        <CategoryIcon className="w-3.5 h-3.5" />
                        {isZh ? meta.labelZh : meta.labelEn}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1A3D4A]/8 text-[#1A3D4A]">
                        <School className="w-3.5 h-3.5" />
                        {isZh ? level.zh : level.en}
                      </span>
                    </div>

                    {/* Programme name */}
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      {isZh ? cs.programme.zh : cs.programme.en}
                    </p>

                    {/* Headline */}
                    <h2 className="font-display text-xl font-extrabold text-[#1A3D4A] leading-snug mb-5 group-hover:text-primary transition-colors">
                      {isZh ? cs.headline.zh : cs.headline.en}
                    </h2>

                    {/* Metric highlight */}
                    <div className="bg-[#FAF7F2] rounded-xl px-5 py-4 flex items-center gap-4 mb-5">
                      <p className="font-display text-4xl font-extrabold text-primary leading-none shrink-0">
                        {cs.metric.value}
                      </p>
                      <p className="text-sm text-muted-foreground leading-tight">
                        {isZh ? cs.metric.label.zh : cs.metric.label.en}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                      {isZh ? cs.description.zh : cs.description.en}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground/60">{cs.year}</span>
                      <Link
                        href={`/case-studies/${cs.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
                      >
                        {isZh ? "閱讀案例" : "Read Case Study"}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Coming soon note */}
          <div className="bg-white rounded-2xl border border-dashed border-border p-8 text-center max-w-2xl mx-auto mb-20">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-[#1A3D4A] mb-2">
              {isZh ? "更多案例即將發布" : "More case studies coming soon"}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isZh
                ? "我們正在聯絡各合作學校確認授權，以保障師生私隱。更多案例將陸續更新。"
                : "We are confirming consent with our partner schools to protect student and staff privacy. More case studies will be added in due course."}
            </p>
          </div>

          {/* CTA */}
          <div className="text-center bg-[#1A3D4A] text-white rounded-3xl p-10 md:p-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {isZh
                ? "想了解 JuntarHK 如何協助貴校？"
                : "Want to find out how JuntarHK can help your school?"}
            </h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto text-sm leading-relaxed">
              {isZh
                ? "每個課程均可按學校目標及學生年級度身訂製。歡迎聯絡我們索取課程建議書。"
                : "Every programme can be tailored to your school's goals and student levels. Contact us for a detailed proposal."}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 font-bold bg-primary hover:bg-primary/90 text-primary-foreground h-14"
              >
                <Link href="/contact">
                  {isZh ? "聯絡我們" : "Contact Us"}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-8 font-bold h-14 bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                <a href="https://wa.me/85297289412" target="_blank" rel="noopener noreferrer">
                  {isZh ? "WhatsApp 查詢" : "WhatsApp Enquiry"}
                </a>
              </Button>
            </div>
          </div>

        </div>
      </section>
    </AppLayout>
  );
}
