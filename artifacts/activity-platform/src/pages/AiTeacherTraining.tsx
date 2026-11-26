import { ServiceSubPage } from "@/components/ServiceSubPage";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles, GraduationCap, Settings2, Layout, FileText, Zap, BookOpen, Trophy, Users } from "lucide-react";

export default function AiTeacherTraining() {
  const { lang } = useLanguage();
  const isZh = lang === "zh";

  return (
    <ServiceSubPage
      lang={lang}
      theme="ai"
      path="/ai-education/teacher-training"
      breadcrumbLabel={isZh ? "教師 AI 工作流培訓" : "Teacher AI Workflow Training"}
      breadcrumbParentLabel={isZh ? "AI 教育及培訓" : "AI Education & Training"}
      breadcrumbParentHref="/ai-education"
      gtagName="ai-teacher-training"
      content={{
        seoTitle: isZh
          ? "教師 AI 工作流培訓｜香港學校 | JuntarHK"
          : "Teacher AI Workflow Training | Hong Kong Schools | JuntarHK",
        seoDescription: isZh
          ? "JuntarHK 教師 AI 工作流培訓，1–3 節，協助香港學校教師掌握 AI 備課工具及自動化行政工作流，可按科目或學校行政需要訂製。"
          : "JuntarHK teacher AI workflow training, 1–3 sessions. Help Hong Kong school teachers master AI lesson prep tools and automated admin workflows — customisable by subject or school admin function.",
        heroImage: "/ai/ai-teacher-training.jpg",
        badge: isZh ? "教師 AI 培訓" : "Teacher AI Training",
        h1: isZh ? "教師 AI 教材及行政工作流培訓" : "Teacher AI Productivity & Workflow Training",
        heroSub: isZh
          ? "讓老師用 AI 工具大幅提升備課效率，掌握自動化行政工作流，節省時間專注教學。可按科目或行政需要度身訂製。"
          : "Help teachers dramatically improve lesson preparation with AI tools and master automated admin workflows — saving time to focus on teaching. Customisable by subject or admin function.",
        highlights: [
          { icon: Sparkles, label: isZh ? "AI 備課工具實習" : "AI Lesson Prep Tools Practice" },
          { icon: FileText, label: isZh ? "AI 教材設計及生成" : "AI Teaching Material Design & Generation" },
          { icon: Layout, label: isZh ? "Canva AI 及 Gamma 工作流" : "Canva AI & Gamma Workflows" },
          { icon: Settings2, label: isZh ? "行政自動化工作流" : "Admin Automation Workflows" },
          { icon: Zap, label: isZh ? "AI 工作效率最佳化" : "AI Productivity Optimisation" },
          { icon: GraduationCap, label: isZh ? "按科目訂製工作流" : "Subject-specific Workflow Customisation" },
          { icon: Users, label: isZh ? "教師小組實作工作坊" : "Teacher Small Group Workshop" },
          { icon: BookOpen, label: isZh ? "AI 倫理及課堂應用指引" : "AI Ethics & Classroom Application Guide" },
          { icon: Trophy, label: isZh ? "即用工作流範本套件" : "Ready-to-use Workflow Template Kit" },
        ],
        photos: [
          {
            src: "/ai/ai-teacher-training.jpg",
            altZh: "香港教師在 AI 工作流培訓工作坊中使用電腦，背景大螢幕顯示培訓內容",
            altEn: "Hong Kong teacher using laptop in AI workflow training workshop with training content on screen behind",
          },
          {
            src: "/ai/ai-teacher-training-02.jpg",
            altZh: "老師在辦公桌前使用筆記本電腦，螢幕顯示 AI 備課助手介面",
            altEn: "Teacher at desk using laptop with an AI lesson preparation assistant interface on screen",
          },
          {
            src: "/ai/ai-teacher-training-03.jpg",
            altZh: "三位香港教師在專業發展工作坊中並排使用平板電腦及手提電腦探索 AI 工具",
            altEn: "Three Hong Kong teachers in professional development workshop using tablets and laptops to explore AI tools side by side",
          },
          {
            src: "/ai/ai-teacher-training-04.jpg",
            altZh: "老師在培訓課堂前方向同事展示 AI 生成的教學幻燈片",
            altEn: "Teacher presenting AI-generated teaching slides to colleagues during a professional development session",
          },
        ],
        photosTitle: {
          zh: "培訓實況",
          en: "Inside the Workshop",
        },
        outcomesTitle: isZh ? "教師完成什麼？" : "What will teachers take away?",
        outcomes: [
          { icon: FileText, label: isZh ? "AI 備課工具使用能力" : "AI Lesson Prep Tool Proficiency" },
          { icon: Settings2, label: isZh ? "即用行政工作流範本" : "Ready-to-use Admin Workflow Templates" },
          { icon: Zap, label: isZh ? "訂製化 AI 工作流方案" : "Customised AI Workflow Solution" },
        ],
        programmeSlug: "teacher-ai-workflow",
        programmeCtaLabel: isZh ? "查看完整課程詳情" : "View Full Programme Details",
        enquiryTitle: isZh ? "查詢教師 AI 培訓" : "Enquire About Teacher Training",
        enquiryActivity: isZh ? "教師 AI 工作流培訓" : "Teacher AI Workflow Training",
      }}
    />
  );
}
