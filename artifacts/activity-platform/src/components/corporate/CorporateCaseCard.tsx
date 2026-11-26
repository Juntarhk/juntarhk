import { CorporateCase } from "@/data/corporate-cases";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users, MapPin, Target, Shapes } from "lucide-react";

interface Props {
  caseStudy: CorporateCase;
}

export function CorporateCaseCard({ caseStudy }: Props) {
  const { lang } = useLanguage();
  
  const title = lang === "zh" ? caseStudy.publicTitleZh : caseStudy.publicTitleEn;
  const venue = caseStudy.venue[lang];
  const category = caseStudy.category[lang];
  const activities = caseStudy.activities;
  const imageAlt = caseStudy.imageAlt[lang];
  const approvedImages = caseStudy.imageApproved
    ? (caseStudy.images?.length ? caseStudy.images : [caseStudy.image]).filter(Boolean)
    : [];
  
  return (
    <div className="group relative overflow-hidden bg-[#162033] border border-[#162033] hover:border-[#4C9AFF] transition-colors duration-500 rounded-xl flex flex-col h-full shadow-lg">
      <div className="aspect-[4/3] relative overflow-hidden rounded-t-xl bg-[#0B1220]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#162033] via-[#162033]/40 to-transparent z-10" />
        {approvedImages.length > 0 ? (
          <div className="absolute inset-0 flex gap-px bg-[#0B1220]">
            <img
              src={approvedImages[0]}
              alt={imageAlt}
              loading="lazy"
              className={`${approvedImages.length > 1 ? "w-2/3" : "w-full"} h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out motion-reduce:transition-none`}
            />
            {approvedImages.length > 1 && (
              <div className={`w-1/3 h-full grid gap-px ${approvedImages.length > 5 ? "grid-cols-2 grid-rows-3" : approvedImages.length > 3 ? "grid-cols-2 grid-rows-2" : "grid-cols-1 grid-rows-2"}`}>
                {approvedImages.slice(1, 6).map((image) => (
                  <img
                    key={image}
                    src={image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="w-full h-full min-h-0 object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_70%_30%,rgba(76,154,255,0.16),transparent_42%),linear-gradient(135deg,#0B1220,#162033)]" aria-hidden="true">
            <Shapes className="h-16 w-16 text-[#4C9AFF]/25" />
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap gap-2 justify-between items-end">
          <span className="text-[11px] font-bold tracking-wider uppercase text-white bg-[#4C9AFF] px-2 py-1 rounded">
            {category}
          </span>
        </div>
      </div>
      
      <div className="p-6 md:p-8 flex-grow flex flex-col">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight">
          {title}
        </h3>
        
        <div className="space-y-2 mb-6">
          {caseStudy.scaleApproved && caseStudy.participantRange && (
            <div className="flex items-center text-[#9CA3AF] text-sm">
              <Users className="w-4 h-4 mr-2 text-[#4C9AFF]" />
              {caseStudy.participantRange} {lang === "zh" ? "人" : "Pax"}
            </div>
          )}
          <div className="flex items-center text-[#9CA3AF] text-sm">
            <MapPin className="w-4 h-4 mr-2 text-[#4C9AFF]" />
            {venue}
          </div>
        </div>

        {activities.length > 0 && (
          <div className="border-t border-[#0B1220] pt-5 mt-auto">
            <div className="flex items-start mb-3">
              <Target className="w-4 h-4 text-[#FF8A3D] mr-2 mt-0.5 shrink-0" />
              <span className="text-xs font-semibold uppercase tracking-wider text-white">
                {lang === "zh" ? "活動元素" : "Key Activities"}
              </span>
            </div>
            <ul className="space-y-2">
              {activities.map((act, i) => (
                <li key={i} className="text-[#9CA3AF] text-sm flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A3D] mr-2 mt-1.5 shrink-0" />
                  {act[lang]}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}