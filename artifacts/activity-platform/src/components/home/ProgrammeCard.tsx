import { motion } from "framer-motion";
import { Link } from "wouter";
import { Users, CalendarDays, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { gtagEvent } from "@/lib/gtag";

export interface ProgrammeData {
  slug: string;
  zh: string;
  en: string;
  valueProp?: { zh: string; en: string };
  targetAge: { zh: string; en: string };
  sessions: { zh: string; en: string };
  classSize: { zh: string; en: string };
  output: { zh: string; en: string };
}

interface ProgrammeCardProps {
  data: ProgrammeData;
  index: number;
}

export function ProgrammeCard({ data, index }: ProgrammeCardProps) {
  const { lang } = useLanguage();
  const isZh = lang === "zh";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all h-full flex flex-col overflow-hidden group"
    >
      <div className="p-6 md:p-7 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="font-display text-xl font-extrabold text-[#1A3D4A] mb-3 group-hover:text-primary transition-colors leading-tight">
          {isZh ? data.zh : data.en}
        </h3>

        {/* One-sentence value prop (optional — not all Programme objects have it) */}
        {data.valueProp && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">
            {isZh ? data.valueProp.zh : data.valueProp.en}
          </p>
        )}

        {/* Three chips: level / sessions / class size */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-muted/60 text-foreground px-2.5 py-1.5 rounded-lg">
            <Users className="w-3.5 h-3.5 text-primary shrink-0" />
            {isZh ? data.targetAge.zh : data.targetAge.en}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-muted/60 text-foreground px-2.5 py-1.5 rounded-lg">
            <CalendarDays className="w-3.5 h-3.5 text-primary shrink-0" />
            {isZh ? data.sessions.zh : data.sessions.en}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-muted/60 text-foreground px-2.5 py-1.5 rounded-lg">
            <Users className="w-3.5 h-3.5 text-primary shrink-0" />
            {isZh ? data.classSize.zh : data.classSize.en}
          </span>
        </div>

        {/* Final output */}
        <div className="flex items-start gap-3 bg-primary/5 p-3 rounded-xl border border-primary/10 mb-6 flex-1">
          <CheckCircle2 className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5 w-5 h-5" />
          <div>
            <p className="text-[11px] font-bold text-primary mb-1 uppercase tracking-wider">
              {isZh ? "學生成果" : "Student Output"}
            </p>
            <p className="text-sm font-bold text-foreground leading-snug">
              {isZh ? data.output.zh : data.output.en}
            </p>
          </div>
        </div>

        {/* Two CTAs */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-border mt-auto">
          <Button asChild size="sm" className="flex-1 rounded-xl h-10 font-bold bg-primary text-white hover:bg-primary/90">
            <Link href="/contact" onClick={() => gtagEvent("programme_card_enquire", { programme: data.slug })}>
              {isZh ? "索取課程建議" : "Request a Proposal"}
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="flex-1 rounded-xl h-10 font-bold border-border text-foreground hover:bg-muted/50">
            <Link href={`/activities/${data.slug}`} onClick={() => gtagEvent("programme_card_view", { programme: data.slug })}>
              {isZh ? "查看課程" : "View Programme"} <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
