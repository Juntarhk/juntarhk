import { ServiceSubPage } from "@/components/ServiceSubPage";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles, Film, Image as ImageIcon, Wand2, Layers, Palette, BookOpen, Trophy, Video } from "lucide-react";

export default function AiAnimation() {
  const { lang } = useLanguage();
  const isZh = lang === "zh";

  return (
    <ServiceSubPage
      lang={lang}
      theme="ai"
      path="/ai-education/animation"
      breadcrumbLabel={isZh ? "AI 動畫創作" : "AI Animation Production"}
      breadcrumbParentLabel={isZh ? "AI 教育及培訓" : "AI Education & Training"}
      breadcrumbParentHref="/ai-education"
      gtagName="ai-animation"
      content={{
        seoTitle: isZh
          ? "AI 動畫創作課程｜香港中小學 | JuntarHK"
          : "AI Animation Production Course | Hong Kong Schools | JuntarHK",
        seoDescription: isZh
          ? "JuntarHK AI 動畫創作課程，適合香港小學至中學，4–8 節。學生以 AI 工具創作動畫短片或數碼故事，由構思到完成真實作品。"
          : "JuntarHK AI animation production course for Hong Kong primary to secondary schools, 4–8 sessions. Students use AI tools to create animation clips or digital stories — from concept to finished work.",
        heroImage: "/ai/ai-animation-04.jpg",
        badge: isZh ? "AI 動畫創作" : "AI Animation Production",
        h1: isZh ? "AI 動畫創作" : "AI Animation Production",
        heroSub: isZh
          ? "讓學生由 AI 使用者成為 AI 創作者。用 AI 工具設計角色、生成動畫場景、完成一套真實的動畫短片或數碼故事。"
          : "Transform students from AI users into AI creators. Use AI tools to design characters, generate animated scenes and complete a real animation clip or digital story.",
        highlights: [
          { icon: Sparkles, label: isZh ? "AI 工具認識與素養" : "AI Tools & Literacy" },
          { icon: Wand2, label: isZh ? "AI 圖像生成" : "AI Image Generation" },
          { icon: Layers, label: isZh ? "AI 動畫場景設計" : "AI Animation Scene Design" },
          { icon: Palette, label: isZh ? "角色設計與視覺風格" : "Character Design & Visual Style" },
          { icon: Film, label: isZh ? "動畫短片製作流程" : "Animation Production Workflow" },
          { icon: Video, label: isZh ? "AI 輔助影片企劃" : "AI-assisted Video Planning" },
          { icon: ImageIcon, label: isZh ? "AI 倫理及版權" : "AI Ethics & Copyright" },
          { icon: Trophy, label: isZh ? "作品展示及分享" : "Work Showcase & Sharing" },
          { icon: BookOpen, label: isZh ? "創作反思與 Portfolio" : "Creative Reflection & Portfolio" },
        ],
        photos: [
          {
            src: "/ai/ai-animation.jpg",
            altZh: "香港小學生在課堂上觀看 iPad 上 AI 生成的動畫角色",
            altEn: "Hong Kong primary school student watching AI-generated animated character on iPad in class",
          },
          {
            src: "/ai/ai-animation-02.jpg",
            altZh: "學生在紙上繪製角色草圖，旁邊的 iPad 顯示 AI 生成的角色設計",
            altEn: "Student sketching character designs on paper beside an iPad showing AI-generated characters",
          },
          {
            src: "/ai/ai-animation-03.jpg",
            altZh: "兩位香港學生一同欣賞平板電腦上 AI 生成的動畫場景",
            altEn: "Two Hong Kong school students looking excitedly at an AI-animated scene on a tablet",
          },
          {
            src: "/ai/ai-animation-04.jpg",
            altZh: "老師在課室大螢幕前展示學生的 AI 動畫作品",
            altEn: "Teacher pointing at classroom screen displaying student AI animation work",
          },
          {
            src: "/ai/ai-thinking-07.jpg",
            altZh: "學生在 iPad 上查看 AI 生成的彩色角色圖像創作",
            altEn: "Student reviewing colourful AI-generated character artwork on iPad",
          },
        ],
        photosTitle: {
          zh: "課堂實況",
          en: "Inside the Classroom",
        },
        outcomesTitle: isZh ? "學生完成什麼？" : "What will students produce?",
        outcomes: [
          { icon: Film, label: isZh ? "AI 動畫短片" : "AI Animation Clip" },
          { icon: ImageIcon, label: isZh ? "AI 生成角色及場景系列" : "AI-generated Character & Scene Series" },
          { icon: Trophy, label: isZh ? "校內作品展示活動" : "In-school Showcase Event" },
        ],
        programmeSlug: "ai-animation-production",
        programmeCtaLabel: isZh ? "查看完整課程詳情" : "View Full Programme Details",
        enquiryTitle: isZh ? "查詢 AI 動畫課程" : "Enquire About This Course",
        enquiryActivity: isZh ? "AI 動畫創作" : "AI Animation Production",
      }}
    />
  );
}
