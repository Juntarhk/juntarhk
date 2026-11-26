import { ServiceSubPage } from "@/components/ServiceSubPage";
import { useLanguage } from "@/contexts/LanguageContext";
import { Monitor, Mic, Film, Camera, Users, Radio, Settings, Trophy, BookOpen } from "lucide-react";

export default function PhotographyCampusTv() {
  const { lang } = useLanguage();
  const isZh = lang === "zh";

  return (
    <ServiceSubPage
      lang={lang}
      theme="photography"
      path="/photography/campus-tv"
      breadcrumbLabel={isZh ? "校園電視台" : "Campus TV Training"}
      breadcrumbParentLabel={isZh ? "影像及校園媒體" : "Photography & School Media"}
      breadcrumbParentHref="/photography"
      gtagName="photography-campus-tv"
      content={{
        seoTitle: isZh
          ? "校園電視台訓練課程｜香港中小學 | JuntarHK"
          : "Campus TV Training Course | Hong Kong Schools | JuntarHK",
        seoDescription: isZh
          ? "JuntarHK 校園電視台訓練課程，適合香港小學至中學，6–12 節。協助學校開辦校園電視台，包括節目策劃、主播訓練、拍攝及直播技術。"
          : "JuntarHK campus TV training for Hong Kong primary to secondary schools, 6–12 sessions. Help schools launch a campus TV station — programme planning, anchor training, shooting and live streaming.",
        heroImage: "/photography/photo-class-01.jpg",
        badge: isZh ? "校園電視台" : "Campus TV",
        h1: isZh ? "校園電視台訓練" : "Campus TV Training",
        heroSub: isZh
          ? "協助學校建立校園電視台，由節目策劃、主播訓練、攝影到直播技術一站式訓練，讓學生掌握真實媒體製作流程。"
          : "Help your school launch a campus TV station — from programme planning and anchor training to shooting and live streaming. Students learn a real media production workflow end to end.",
        highlights: [
          { icon: Monitor, label: isZh ? "校園電視台節目策劃" : "Campus TV Programme Planning" },
          { icon: Mic, label: isZh ? "主播訓練" : "Anchor Training" },
          { icon: Users, label: isZh ? "幕前幕後分工" : "On-screen & Behind-the-scenes Roles" },
          { icon: Camera, label: isZh ? "多機位拍攝" : "Multi-camera Shooting" },
          { icon: Film, label: isZh ? "剪接及後期製作" : "Editing & Post-production" },
          { icon: Radio, label: isZh ? "直播技術入門" : "Live Streaming Basics" },
          { icon: Settings, label: isZh ? "電視台技術設備操作" : "TV Studio Equipment Operation" },
          { icon: Trophy, label: isZh ? "校內節目播放" : "In-school Programme Broadcast" },
          { icon: BookOpen, label: isZh ? "媒體製作學習 Portfolio" : "Media Production Portfolio" },
        ],
        outcomesTitle: isZh ? "學生完成什麼？" : "What will students produce?",
        outcomes: [
          { icon: Monitor, label: isZh ? "完整校園電視節目" : "Complete Campus TV Programme" },
          { icon: Radio, label: isZh ? "直播示範片段" : "Live Streaming Demo Clip" },
          { icon: Trophy, label: isZh ? "校內節目播放活動" : "In-school Broadcast Event" },
        ],
        programmeSlug: "campus-reporter-tv",
        programmeCtaLabel: isZh ? "查看完整課程詳情" : "View Full Programme Details",
        enquiryTitle: isZh ? "查詢校園電視台課程" : "Enquire About This Course",
        enquiryActivity: isZh ? "校園電視台訓練" : "Campus TV Training",
      }}
    />
  );
}
