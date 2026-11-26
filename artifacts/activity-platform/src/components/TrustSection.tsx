import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSeoSettings } from "@/contexts/SeoSettingsContext";
import { SCHOOLS_SERVED, FOUNDER_EXPERIENCE_YEARS } from "@/config/business-facts";

const SCHOOLS = [
  { name: "保良局陳黎惠蓮幼稚園", nameEn: "PLK Chan Lai Wai Lin Kindergarten", color: "border-amber-500/30 text-amber-900 bg-amber-500/10" },
  { name: "東華三院王胡麗明幼稚園", nameEn: "TWGHs Wong Wu Lai Ming Kindergarten", color: "border-amber-500/30 text-amber-900 bg-amber-500/10" },
  { name: "優才（楊殷有娣）書院", nameEn: "G.T. (Ellen Yeung) College", color: "border-sky-500/30 text-sky-900 bg-sky-500/10" },
  { name: "青年會書院", nameEn: "YMCA College", color: "border-violet-500/30 text-violet-900 bg-violet-500/10" },
  { name: "喇沙書院", nameEn: "La Salle College", color: "border-violet-500/30 text-violet-900 bg-violet-500/10" },
  { name: "嘉諾撒聖心書院", nameEn: "Sacred Heart Canossian College", color: "border-violet-500/30 text-violet-900 bg-violet-500/10" },
  { name: "救恩書院", nameEn: "Kau Yan College", color: "border-violet-500/30 text-violet-900 bg-violet-500/10" },
  { name: "聖公會林護紀念中學", nameEn: "S.K.H. Lam Woo Memorial Secondary School", color: "border-violet-500/30 text-violet-900 bg-violet-500/10" },
  { name: "香港大學", nameEn: "The University of Hong Kong", color: "border-rose-500/30 text-rose-900 bg-rose-500/10" },
  { name: "浸會大學", nameEn: "Hong Kong Baptist University", color: "border-rose-500/30 text-rose-900 bg-rose-500/10" },
  { name: "香港都會大學", nameEn: "Hong Kong Metropolitan University", color: "border-rose-500/30 text-rose-900 bg-rose-500/10" },
  { name: "香港青年協會", nameEn: "HKFYG", color: "border-emerald-500/30 text-emerald-900 bg-emerald-500/10" },
  { name: "香港小童群益會", nameEn: "BGCA", color: "border-emerald-500/30 text-emerald-900 bg-emerald-500/10" },
  { name: "聯合國兒童基金會", nameEn: "UNICEF Hong Kong", color: "border-emerald-500/30 text-emerald-900 bg-emerald-500/10" },
];

export function TrustSection() {
  const { t, lang } = useLanguage();
  const tr = t.trust;
  const settings = useSeoSettings();

  // Fall back to business-facts constants when admin hasn't set a value yet
  const statValues = [
    settings["stat_schools_served"]        || SCHOOLS_SERVED,
    settings["stat_activity_programmes"]   || "400+",
    settings["stat_experience_years"]      || FOUNDER_EXPERIENCE_YEARS,
    settings["stat_campsite_sqft"]         || "80,000",
  ];

  return (
    <section className="bg-[#F5F5DC] py-20 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Section A — Logo Wall */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#1A3D4A]/10 text-[#1A3D4A] text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
              {tr.sectionLabel}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#1A3D4A] mb-4">
              {tr.sectionTitle}
            </h2>
            <p className="text-[#1A3D4A]/70 text-lg">{tr.sectionSub}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-4xl mx-auto">
            {tr.stats.map((label, idx) => (
              <div
                key={idx}
                className="bg-[#1A3D4A] rounded-2xl p-6 text-center border border-[#1A3D4A]/20 shadow-lg"
              >
                <div className="font-display text-3xl md:text-4xl font-black text-primary mb-1 drop-shadow-sm">
                  {statValues[idx]}
                </div>
                <div className="text-[#F5F5DC]/80 text-sm font-medium">{label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
            {SCHOOLS.map((school, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className={`flex flex-col items-center justify-center px-5 py-2.5 rounded-full border-2 shadow-sm transition-all cursor-default ${school.color}`}
              >
                <span className="font-bold text-[#1A3D4A] text-sm md:text-base leading-tight">
                  {lang === "en" ? school.nameEn : school.name}
                </span>
                <span className="text-[10px] md:text-xs text-[#1A3D4A]/60 font-medium leading-tight mt-0.5">
                  {lang === "en" ? school.name : school.nameEn}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section B — Testimonials */}
        <div>
          <div className="text-center mb-16">
            <span className="inline-block bg-[#E8A020]/20 text-[#E8A020] text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
              {tr.testimonialsLabel}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#1A3D4A]">
              {tr.testimonialsTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tr.testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative flex flex-col h-full border border-black/5"
              >
                <Quote className="absolute top-6 right-8 w-12 h-12 text-primary/10" />

                <div className="flex-grow mb-8 relative z-10 pt-2">
                  <p className="text-[#1A3D4A]/80 text-base leading-relaxed font-medium">
                    {testimonial.quote}
                  </p>
                </div>

                <div className="mt-auto pt-6 border-t border-black/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1A3D4A] flex items-center justify-center text-[#F5F5DC] font-display font-bold text-xl shadow-inner">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-[#1A3D4A]">{testimonial.name}</div>
                      <div className="text-xs text-[#1A3D4A]/60 font-medium">{testimonial.role} · {testimonial.school}</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 mt-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#E8A020] text-[#E8A020]" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section C — Real on-site photos */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#3D8B89]/15 text-[#3D8B89] text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
              {tr.photosLabel}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A3D4A]">
              {tr.photosTitle}
            </h2>
            <p className="text-[#1A3D4A]/60 mt-3 max-w-2xl mx-auto">
              {tr.photosSub}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-6xl mx-auto">
            {EVENT_PHOTOS.map((src, idx) => (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-2xl group ${
                  idx === 0 || idx === 5 ? "md:row-span-2 md:col-span-1" : ""
                }`}
                style={{ aspectRatio: idx === 0 || idx === 5 ? "1 / 2" : "1 / 1" }}
              >
                <img
                  src={src}
                  alt={`JuntarHK 現場活動照片 ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A3D4A]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const EVENT_PHOTOS = [
  "/event-photo-03.jpg",
  "/event-photo-01.jpg",
  "/event-photo-07.jpg",
  "/event-photo-12.jpg",
  "/event-photo-15.jpg",
  "/event-photo-20.jpg",
  "/event-photo-25.jpg",
  "/event-photo-09.jpg",
  "/event-photo-18.jpg",
  "/event-photo-30.jpg",
];
