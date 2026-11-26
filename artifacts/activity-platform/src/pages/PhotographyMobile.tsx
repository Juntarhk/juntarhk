import { ServiceSubPage } from "@/components/ServiceSubPage";
import { useLanguage } from "@/contexts/LanguageContext";
import { Smartphone, Camera, Film, Image, Share2, Crop, Sliders, Video, BookOpen } from "lucide-react";

export default function PhotographyMobile() {
  const { lang } = useLanguage();
  const isZh = lang === "zh";

  return (
    <ServiceSubPage
      lang={lang}
      theme="photography"
      path="/photography/mobile"
      breadcrumbLabel={isZh ? "手機攝影及短片製作" : "Mobile Photography & Video"}
      breadcrumbParentLabel={isZh ? "影像及校園媒體" : "Photography & School Media"}
      breadcrumbParentHref="/photography"
      gtagName="photography-mobile"
      content={{
        seoTitle: isZh
          ? "手機攝影及短片製作課程｜香港中小學 | JuntarHK"
          : "Mobile Photography & Video Production Course | Hong Kong Schools | JuntarHK",
        seoDescription: isZh
          ? "JuntarHK 手機攝影及短片製作課程，適合香港小學至中學，4–8 節。學生以手機完成個人攝影作品集或主題短片，可按校本主題訂製。"
          : "JuntarHK mobile photography and short video course for Hong Kong primary to secondary schools, 4–8 sessions. Students complete a photo portfolio or themed short film using their own phones.",
        heroImage: "/photo-mobile-1.jpg",
        badge: isZh ? "手機攝影及短片製作" : "Mobile Photography & Video",
        h1: isZh ? "手機攝影及短片製作" : "Mobile Photography & Short Video",
        heroSub: isZh
          ? "用同學人人都有的手機，學習構圖、光線、剪接，完成一套真正屬於自己的攝影集或主題短片。"
          : "Using the smartphone every student carries — learn composition, lighting and editing, and complete a real personal photo portfolio or themed short film.",
        highlights: [
          { icon: Smartphone, label: isZh ? "手機攝影構圖與光線" : "Smartphone Composition & Lighting" },
          { icon: Camera, label: isZh ? "拍攝技巧與視角" : "Shooting Techniques & Angles" },
          { icon: Film, label: isZh ? "手機短片拍攝" : "Mobile Short Video Shooting" },
          { icon: Sliders, label: isZh ? "手機剪接與後期" : "Mobile Editing & Post-processing" },
          { icon: Image, label: isZh ? "主題攝影企劃" : "Themed Photography Planning" },
          { icon: Share2, label: isZh ? "社交媒體內容製作" : "Social Media Content Creation" },
          { icon: Crop, label: isZh ? "畫面比例與裁剪" : "Framing & Cropping" },
          { icon: Video, label: isZh ? "校本主題短片" : "School-themed Short Film" },
          { icon: BookOpen, label: isZh ? "學生攝影反思" : "Student Photography Reflection" },
        ],
        outcomesTitle: isZh ? "學生完成什麼？" : "What will students produce?",
        outcomes: [
          { icon: Image, label: isZh ? "個人攝影作品集" : "Personal Photo Portfolio" },
          { icon: Film, label: isZh ? "主題短片" : "Themed Short Film" },
          { icon: Share2, label: isZh ? "可用於校內展覽或校刊的作品" : "Work ready for school exhibitions or publications" },
        ],
        programmeSlug: "mobile-photography-video",
        programmeCtaLabel: isZh ? "查看完整課程詳情" : "View Full Programme Details",
        enquiryTitle: isZh ? "查詢手機攝影課程" : "Enquire About This Course",
        enquiryActivity: isZh ? "手機攝影及短片製作" : "Mobile Photography & Short Video",
      }}
    />
  );
}
