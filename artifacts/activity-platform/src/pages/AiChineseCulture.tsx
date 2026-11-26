import { ServiceSubPage } from "@/components/ServiceSubPage";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles, Landmark, Image as ImageIcon, Film, BookOpen, Wand2, Layers, Trophy, FileText } from "lucide-react";

export default function AiChineseCulture() {
  const { lang } = useLanguage();
  const isZh = lang === "zh";

  return (
    <ServiceSubPage
      lang={lang}
      theme="ai"
      path="/ai-education/chinese-culture"
      breadcrumbLabel={isZh ? "AI＋中華文化數碼故事" : "AI & Chinese Culture"}
      breadcrumbParentLabel={isZh ? "AI 教育及培訓" : "AI Education & Training"}
      breadcrumbParentHref="/ai-education"
      gtagName="ai-chinese-culture"
      content={{
        seoTitle: isZh
          ? "AI＋中華文化數碼故事課程｜香港中小學 | JuntarHK"
          : "AI & Chinese Culture Digital Story Course | Hong Kong Schools | JuntarHK",
        seoDescription: isZh
          ? "JuntarHK AI＋中華文化數碼故事課程，適合香港小學至中學，4–6 節。學生以 AI 工具重現中華文化故事及傳統藝術，可配合中史、常識或德育課題。"
          : "JuntarHK AI and Chinese culture digital story course for Hong Kong primary to secondary schools, 4–6 sessions. Students use AI tools to recreate Chinese cultural stories and traditional art — compatible with Chinese History, General Studies or moral education.",
        heroImage: "/ai/ai-chinese-culture.jpg",
        badge: isZh ? "AI＋中華文化" : "AI & Chinese Culture",
        h1: isZh ? "AI＋中華文化數碼故事" : "AI & Chinese Culture Digital Story",
        heroSub: isZh
          ? "用 AI 工具重現中華文化故事與傳統藝術，讓學生在創作中深入了解文化根源，完成真實的數碼文化故事作品。"
          : "Use AI tools to recreate Chinese cultural stories and traditional art — helping students understand cultural roots through creation and completing real digital cultural story works.",
        highlights: [
          { icon: Landmark, label: isZh ? "中華文化主題選取" : "Chinese Culture Theme Selection" },
          { icon: Wand2, label: isZh ? "AI 生成文化視覺素材" : "AI-generated Cultural Visuals" },
          { icon: ImageIcon, label: isZh ? "傳統藝術風格詮釋" : "Traditional Art Style Interpretation" },
          { icon: FileText, label: isZh ? "文化故事腳本創作" : "Cultural Story Script Creation" },
          { icon: Film, label: isZh ? "AI 數碼故事製作" : "AI Digital Story Production" },
          { icon: Layers, label: isZh ? "圖文整合與呈現" : "Image-Text Integration" },
          { icon: Sparkles, label: isZh ? "AI 倫理及文化尊重" : "AI Ethics & Cultural Respect" },
          { icon: BookOpen, label: isZh ? "可配合中史、常識或德育" : "Compatible with Chinese History, GS or Moral Education" },
          { icon: Trophy, label: isZh ? "學生文化作品展示" : "Student Cultural Work Exhibition" },
        ],
        photos: [
          {
            src: "/ai/ai-chinese-culture.jpg",
            altZh: "香港學生使用 iPad 生成 AI 水墨畫風格的中國山水圖像",
            altEn: "Hong Kong student using iPad to generate AI Chinese ink-painting landscape artwork",
          },
          {
            src: "/ai/ai-chinese-culture-02.jpg",
            altZh: "學生使用 iPad 以 AI 生成中國新年賀年圖像，旁邊放有傳統文化參考書",
            altEn: "Student using iPad to generate AI Chinese New Year imagery with a traditional culture reference book beside them",
          },
          {
            src: "/ai/ai-chinese-culture-03.jpg",
            altZh: "一組香港學生圍觀課室螢幕上展示的 AI 中華文化數碼故事作品",
            altEn: "Group of Hong Kong school students gathered around a classroom screen displaying their AI Chinese culture digital story",
          },
          {
            src: "/ai/ai-chinese-culture-04.jpg",
            altZh: "學生手持自己製作的 AI 中華文化數碼故事小冊子",
            altEn: "Student holding their completed AI Chinese culture digital story booklet",
          },
        ],
        photosTitle: {
          zh: "課堂實況",
          en: "Inside the Classroom",
        },
        outcomesTitle: isZh ? "學生完成什麼？" : "What will students produce?",
        outcomes: [
          { icon: Film, label: isZh ? "AI 中華文化數碼故事" : "AI Chinese Culture Digital Story" },
          { icon: ImageIcon, label: isZh ? "文化主題 AI 動畫" : "Culture-themed AI Animation" },
          { icon: Trophy, label: isZh ? "可用於校內展覽或跨科活動的作品" : "Work for exhibitions or cross-subject activities" },
        ],
        programmeSlug: "ai-chinese-culture-digital-story",
        programmeCtaLabel: isZh ? "查看完整課程詳情" : "View Full Programme Details",
        enquiryTitle: isZh ? "查詢 AI 中華文化課程" : "Enquire About This Course",
        enquiryActivity: isZh ? "AI＋中華文化數碼故事" : "AI & Chinese Culture Digital Story",
      }}
    />
  );
}
