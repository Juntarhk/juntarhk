import { ServiceSubPage } from "@/components/ServiceSubPage";
import { useLanguage } from "@/contexts/LanguageContext";
import { Film, Video, Mic, Clapperboard, Sliders, Camera, Share2, BookOpen, Trophy } from "lucide-react";

export default function PhotographyVideo() {
  const { lang } = useLanguage();
  const isZh = lang === "zh";

  return (
    <ServiceSubPage
      lang={lang}
      theme="photography"
      path="/photography/video-production"
      breadcrumbLabel={isZh ? "影片拍攝及剪接" : "Video Production"}
      breadcrumbParentLabel={isZh ? "影像及校園媒體" : "Photography & School Media"}
      breadcrumbParentHref="/photography"
      gtagName="photography-video-production"
      content={{
        seoTitle: isZh
          ? "影片拍攝及剪接課程｜香港中小學 | JuntarHK"
          : "Video Production Course | Hong Kong Schools | JuntarHK",
        seoDescription: isZh
          ? "JuntarHK 影片拍攝及剪接課程，適合香港小學至中學，4–8 節。學生從故事企劃到剪接完成校園主題短片，可按校本活動主題訂製。"
          : "JuntarHK video production course for Hong Kong primary to secondary schools, 4–8 sessions. Students go from story planning to a finished school-themed short film, customisable by school activity theme.",
        heroImage: "/photo-video-prod-1.jpg",
        badge: isZh ? "影片拍攝及剪接" : "Video Production",
        h1: isZh ? "影片拍攝及剪接" : "Video Production",
        heroSub: isZh
          ? "從故事企劃、分鏡設計、現場拍攝到剪接輸出，完成一套真實可放映的校園短片。"
          : "From story planning and storyboarding to on-location shooting and editing — complete a real, screenable campus short film.",
        highlights: [
          { icon: Clapperboard, label: isZh ? "故事企劃與分鏡" : "Story Planning & Storyboarding" },
          { icon: Camera, label: isZh ? "鏡頭運用與構圖" : "Camera Angles & Composition" },
          { icon: Mic, label: isZh ? "收音與聲音設計" : "Sound Recording & Design" },
          { icon: Film, label: isZh ? "現場拍攝實習" : "On-location Shooting Practice" },
          { icon: Sliders, label: isZh ? "基礎剪接技術" : "Basic Editing Techniques" },
          { icon: Video, label: isZh ? "色彩調整與輸出" : "Colour Grading & Export" },
          { icon: Share2, label: isZh ? "校本主題訂製" : "School Theme Customisation" },
          { icon: Trophy, label: isZh ? "作品放映及分享" : "Film Screening & Sharing" },
          { icon: BookOpen, label: isZh ? "創作反思與 Portfolio" : "Creative Reflection & Portfolio" },
        ],
        outcomesTitle: isZh ? "學生完成什麼？" : "What will students produce?",
        outcomes: [
          { icon: Film, label: isZh ? "完整校園主題短片" : "Complete Campus Short Film" },
          { icon: Clapperboard, label: isZh ? "分鏡故事板及製作文件" : "Storyboard & Production Documents" },
          { icon: Trophy, label: isZh ? "校內放映活動" : "In-school Film Screening" },
        ],
        programmeSlug: "mobile-photography-video",
        programmeCtaLabel: isZh ? "查看完整課程詳情" : "View Full Programme Details",
        enquiryTitle: isZh ? "查詢影片拍攝課程" : "Enquire About This Course",
        enquiryActivity: isZh ? "影片拍攝及剪接" : "Video Production",
      }}
    />
  );
}
