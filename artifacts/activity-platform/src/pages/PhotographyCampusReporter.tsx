import { ServiceSubPage } from "@/components/ServiceSubPage";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mic, Film, Camera, FileText, Video, Users, Megaphone, BookOpen, Trophy } from "lucide-react";

export default function PhotographyCampusReporter() {
  const { lang } = useLanguage();
  const isZh = lang === "zh";

  return (
    <ServiceSubPage
      lang={lang}
      theme="photography"
      path="/photography/campus-reporter"
      breadcrumbLabel={isZh ? "校園記者訓練" : "Campus Reporter Training"}
      breadcrumbParentLabel={isZh ? "影像及校園媒體" : "Photography & School Media"}
      breadcrumbParentHref="/photography"
      gtagName="photography-campus-reporter"
      content={{
        seoTitle: isZh
          ? "校園記者訓練課程｜香港中小學 | JuntarHK"
          : "Campus Reporter Training Course | Hong Kong Schools | JuntarHK",
        seoDescription: isZh
          ? "JuntarHK 校園記者訓練課程，適合香港小學至中學，6–12 節。學生學習新聞採訪、主播訓練及校園新聞短片製作，完成真實採訪報道。"
          : "JuntarHK campus reporter training for Hong Kong primary to secondary schools, 6–12 sessions. Students learn news interviewing, anchor training and campus news video production.",
        heroImage: "/photo-journalist-1.jpg",
        badge: isZh ? "校園記者訓練" : "Campus Reporter Training",
        h1: isZh ? "校園記者訓練" : "Campus Reporter Training",
        heroSub: isZh
          ? "讓學生成為真正的校園記者，學習採訪、撰稿、出鏡及製作校園新聞短片，完成真實可分享的採訪報道。"
          : "Train students as real campus reporters — learn interviewing, script writing, on-camera presenting and producing a campus news video that can genuinely be shared.",
        highlights: [
          { icon: Mic, label: isZh ? "新聞採訪技巧" : "News Interviewing Skills" },
          { icon: FileText, label: isZh ? "新聞稿撰寫" : "News Script Writing" },
          { icon: Users, label: isZh ? "主播及出鏡訓練" : "Anchor & On-camera Training" },
          { icon: Camera, label: isZh ? "採訪拍攝實習" : "Interview Shooting Practice" },
          { icon: Film, label: isZh ? "校園新聞短片製作" : "Campus News Video Production" },
          { icon: Video, label: isZh ? "剪接及後期製作" : "Editing & Post-production" },
          { icon: Megaphone, label: isZh ? "新聞播報訓練" : "News Broadcasting Training" },
          { icon: Trophy, label: isZh ? "作品發布及分享" : "Publishing & Sharing Work" },
          { icon: BookOpen, label: isZh ? "媒體素養教育" : "Media Literacy Education" },
        ],
        outcomesTitle: isZh ? "學生完成什麼？" : "What will students produce?",
        outcomes: [
          { icon: Film, label: isZh ? "校園新聞短片" : "Campus News Video" },
          { icon: Mic, label: isZh ? "真實採訪報道" : "Real Interview Report" },
          { icon: Megaphone, label: isZh ? "主播出鏡示範片段" : "On-camera Anchor Clip" },
        ],
        programmeSlug: "campus-reporter-tv",
        programmeCtaLabel: isZh ? "查看完整課程詳情" : "View Full Programme Details",
        enquiryTitle: isZh ? "查詢校園記者訓練課程" : "Enquire About This Course",
        enquiryActivity: isZh ? "校園記者訓練" : "Campus Reporter Training",
      }}
    />
  );
}
