import { ServiceSubPage } from "@/components/ServiceSubPage";
import { useLanguage } from "@/contexts/LanguageContext";
import { Brain, Sparkles, Image as ImageIcon, MessageSquare, Layers, BookOpen, ShieldCheck, Trophy, Lightbulb } from "lucide-react";

export default function AiThinkingCommunication() {
  const { lang } = useLanguage();
  const isZh = lang === "zh";

  return (
    <ServiceSubPage
      lang={lang}
      theme="ai"
      path="/ai-education/thinking-communication"
      breadcrumbLabel={isZh ? "AI 思維與溝通課" : "AI Thinking & Communication"}
      breadcrumbParentLabel={isZh ? "AI 教育及培訓" : "AI Education & Training"}
      breadcrumbParentHref="/ai-education"
      gtagName="ai-thinking-communication"
      content={{
        seoTitle: isZh
          ? "AI 思維與溝通課｜小學 AI 漫畫創作 Prompt 設計 | JuntarHK"
          : "AI Thinking & Communication | Primary School AI Comics & Prompt Design | JuntarHK",
        seoDescription: isZh
          ? "JuntarHK AI 思維與溝通課，適合小一至小六，4–6 節。學生學習 Prompt 設計，創作 AI 漫畫故事冊，並透過「AI vs 真實」對比練習培養批判性思考。"
          : "JuntarHK AI Thinking & Communication for Primary 1–6, 4–6 sessions. Students learn prompt design, create AI comic story books and develop critical thinking through 'AI vs reality' comparison activities.",
        badge: isZh ? "AI 思維與溝通" : "AI Thinking & Communication",
        h1: isZh ? "AI 思維與溝通課" : "AI Thinking & Communication",
        heroSub: isZh
          ? "教小朋友學懂與 AI「對話」。透過 Prompt 設計、AI 漫畫創作及真實物件對比，讓學生由 AI 使用者進化成 AI 思考者。"
          : "Teach students to 'talk' to AI. Through prompt design, AI comic creation and real-object comparisons, students evolve from AI users into AI thinkers.",
        highlights: [
          { icon: Brain, label: isZh ? "Prompt 設計思維" : "Prompt Design Thinking" },
          { icon: Sparkles, label: isZh ? "AI 圖像生成" : "AI Image Generation" },
          { icon: MessageSquare, label: isZh ? "AI 漫畫故事創作" : "AI Comic Storytelling" },
          { icon: Layers, label: isZh ? "多格漫畫腳本設計" : "Multi-panel Comic Scripting" },
          { icon: ImageIcon, label: isZh ? "AI vs 真實對比練習" : "AI vs Reality Comparison" },
          { icon: Lightbulb, label: isZh ? "批判性思考訓練" : "Critical Thinking Training" },
          { icon: ShieldCheck, label: isZh ? "AI 素養及倫理" : "AI Literacy & Ethics" },
          { icon: Trophy, label: isZh ? "Prompt Portfolio 整理" : "Prompt Portfolio Curation" },
          { icon: BookOpen, label: isZh ? "跨學科主題訂製" : "Cross-subject Theme Customisation" },
        ],
        photos: [
          {
            src: "/ai/ai-thinking-01.jpg",
            altZh: "學生展示 iPad 上 AI 生成的招財貓圖像，旁邊放有真實擺設作對比",
            altEn: "Student showing AI-generated lucky cat image on iPad beside a real figurine",
          },
          {
            src: "/ai/ai-thinking-02.jpg",
            altZh: "學生展示平板電腦上的 AI 圖像創作成果",
            altEn: "Student presenting AI image creation results on tablet",
          },
          {
            src: "/ai/ai-thinking-03.jpg",
            altZh: "學生閱讀「AI Prompt 魔法式」參考資料，旁邊放有 iPad 及 AI 學習材料",
            altEn: "Student reading AI Prompt reference sheet with iPad and learning materials",
          },
          {
            src: "/ai/ai-thinking-04.jpg",
            altZh: "學生使用平板電腦配合「AI 指令魔法公式」工作紙進行 Prompt 練習",
            altEn: "Student working on AI prompt exercises with tablet and instruction worksheet",
          },
          {
            src: "/ai/ai-thinking-05.jpg",
            altZh: "學生在課室使用 iPad 進行 AI 學習活動",
            altEn: "Student using iPad for AI learning activities in classroom",
          },
          {
            src: "/ai/ai-thinking-06.jpg",
            altZh: "學生專注使用 iPad，桌上放有 AI Prompt 魔法式工作紙",
            altEn: "Student focused on iPad with AI Prompt worksheet spread on the table",
          },
          {
            src: "/ai/ai-thinking-07.jpg",
            altZh: "學生查看 iPad 上 AI 生成的香港風格圖像創作",
            altEn: "Student reviewing AI-generated Hong Kong-themed artwork on iPad",
          },
          {
            src: "/ai/ai-thinking-08.jpg",
            altZh: "AI 思維與溝通課課堂實況",
            altEn: "Inside the AI Thinking & Communication classroom",
          },
        ],
        photosTitle: {
          zh: "課堂實況",
          en: "Inside the Classroom",
        },
        outcomesTitle: isZh ? "學生完成什麼？" : "What will students produce?",
        outcomes: [
          { icon: MessageSquare, label: isZh ? "AI 漫畫故事冊" : "AI Comic Story Book" },
          { icon: ImageIcon, label: isZh ? "AI 圖像作品集" : "AI Image Portfolio" },
          { icon: Brain, label: isZh ? "個人 Prompt Portfolio" : "Personal Prompt Portfolio" },
        ],
        programmeSlug: "ai-thinking-communication-course",
        programmeCtaLabel: isZh ? "查看完整課程詳情" : "View Full Programme Details",
        enquiryTitle: isZh ? "查詢 AI 思維與溝通課" : "Enquire About This Course",
        enquiryActivity: isZh ? "AI 思維與溝通課" : "AI Thinking & Communication",
      }}
    />
  );
}
