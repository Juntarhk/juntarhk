import { ServiceSubPage } from "@/components/ServiceSubPage";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles, Image as ImageIcon, BookOpen, Layers, Film, Wand2, Share2, Trophy, Camera, CheckCircle2 } from "lucide-react";

export default function AiVisualStorytelling() {
  const { lang } = useLanguage();
  const isZh = lang === "zh";

  return (
    <ServiceSubPage
      lang={lang}
      theme="ai"
      path="/ai-education/visual-storytelling"
      breadcrumbLabel={isZh ? "手機攝影 × AI 圖像製作" : "Mobile Photography × AI Image Creation"}
      breadcrumbParentLabel={isZh ? "AI 教育及培訓" : "AI Education & Training"}
      breadcrumbParentHref="/ai-education"
      gtagName="ai-visual-storytelling"
      content={{
        seoTitle: isZh
          ? "手機攝影 × AI 圖像製作課程｜香港中小學 | JuntarHK"
          : "Mobile Photography & AI Image Creation | Hong Kong Schools | JuntarHK",
        seoDescription: isZh
          ? "JuntarHK 手機攝影 × AI 圖像製作課程，適合香港小學至中學，4–6 節。學生掌握手機攝影構圖技巧，再以 AI 工具進行背景修改、特效創作及影片剪輯，完成可展示的數碼視覺故事作品。"
          : "JuntarHK mobile photography and AI image creation course for Hong Kong primary to secondary schools, 4–6 sessions. Students learn smartphone composition then use AI tools for background editing, effects and video production.",
        heroImage: "/ai/ai-visual-storytelling.jpg",
        badge: isZh ? "手機攝影 × AI 圖像製作" : "Mobile Photography × AI Image Creation",
        h1: isZh ? "手機攝影 × AI 圖像製作" : "Mobile Photography × AI Image Creation",
        heroSub: isZh
          ? "以手機為工具，掌握攝影構圖及鏡頭應用，再結合 AI 圖像工具進行背景修改、特效創作及影片剪輯，完成具個人風格的視覺故事作品。"
          : "Using smartphones as the tool, master photography composition and lens techniques, then apply AI image tools for background editing, effects and video production — completing a personal visual story portfolio.",
        highlights: [
          { icon: Camera,       label: isZh ? "手機攝影技巧"            : "Smartphone Photography" },
          { icon: Layers,       label: isZh ? "構圖與鏡頭應用"          : "Composition & Lens Use" },
          { icon: ImageIcon,    label: isZh ? "人像攝影與模式設定"       : "Portrait Photography" },
          { icon: Wand2,        label: isZh ? "AI 背景修改與特效"        : "AI Background & Effects" },
          { icon: Sparkles,     label: isZh ? "AI 生成擴展"              : "AI Generative Expansion" },
          { icon: Film,         label: isZh ? "圖像影片後期製作"         : "Image & Video Editing" },
          { icon: CheckCircle2, label: isZh ? "AI 字幕與自動剪片"       : "AI Subtitles & Auto-Edit" },
          { icon: BookOpen,     label: isZh ? "AI 素養：版權與倫理"      : "AI Literacy: Ethics & Copyright" },
          { icon: Share2,       label: isZh ? "作品分享與社交媒體優化"   : "Publishing & Social Media" },
        ],
        photos: [
          {
            src: "/ai/ai-visual-storytelling.jpg",
            altZh: "香港學生使用 iPad 拍攝及編輯相片，旁邊放有故事分鏡工作紙",
            altEn: "Hong Kong student using iPad to shoot and edit photos with storyboard planning sheet beside her",
          },
          {
            src: "/ai/ai-visual-storytelling-02.jpg",
            altZh: "學生用手機拍攝校園照片，並以 AI 工具進行背景修改及特效",
            altEn: "Student shooting campus photos on smartphone then editing with AI background and effects tools",
          },
          {
            src: "/ai/ai-visual-storytelling-03.jpg",
            altZh: "香港學生手持自己製作的 AI 圖像故事作品，面帶笑容",
            altEn: "Hong Kong school students proudly holding their completed AI image story portfolios",
          },
          {
            src: "/ai/ai-thinking-08.jpg",
            altZh: "學生 iPad 上顯示 AI 編輯及特效處理後的多格相片故事作品",
            altEn: "Student's iPad showing AI-edited multi-panel photo story with applied effects",
          },
        ],
        photosTitle: {
          zh: "課堂實況",
          en: "Inside the Classroom",
        },
        outcomesTitle: isZh ? "學生完成什麼？" : "What will students produce?",
        outcomes: [
          { icon: ImageIcon,    label: isZh ? "AI 編輯相片作品集"                    : "AI-edited Photo Portfolio" },
          { icon: Film,         label: isZh ? "AI 特效短片"                           : "AI Effects Short Video" },
          { icon: Trophy,       label: isZh ? "可用於社交媒體、校刊或校內展覽的數碼內容" : "Social-ready digital content for publications or school exhibition" },
        ],
        programmeSlug: "ai-visual-storytelling",
        programmeCtaLabel: isZh ? "查看完整課程詳情" : "View Full Programme Details",
        enquiryTitle: isZh ? "查詢手機攝影 × AI 圖像製作課程" : "Enquire About This Course",
        enquiryActivity: isZh ? "手機攝影 × AI 圖像製作" : "Mobile Photography × AI Image Creation",
      }}
    />
  );
}
