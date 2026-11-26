/**
 * Case Studies data — single source of truth.
 *
 * MAINTENANCE: add new entries to the CASE_STUDIES array below.
 * Each entry becomes a card on /case-studies and a full detail page at
 * /case-studies/:slug.  All case details must remain anonymised (no real
 * school names, staff names or identifiable photos) until written consent
 * is confirmed.
 */

export type CaseStudyCategory = "photography" | "ai" | "adventure";
export type SchoolLevel = "primary" | "secondary" | "both";

export interface CaseStudy {
  /** URL slug — used for /case-studies/:slug */
  slug: string;
  category: CaseStudyCategory;
  schoolLevel: SchoolLevel;
  /** Name of the JuntarHK programme delivered */
  programme: { zh: string; en: string };
  /** Slug of the matching activity in the catalogue (for the "view programme" link) */
  programmeSlug: string;
  /** One-line outcome statement shown prominently on the card */
  headline: { zh: string; en: string };
  /** Key metric highlight — e.g. "30+" + "學生參與製作" */
  metric: { value: string; label: { zh: string; en: string } };
  /** 2–3 sentence summary shown on the index card */
  description: { zh: string; en: string };
  /** Full anonymised narrative shown on the detail page (use \n\n for paragraphs) */
  details: { zh: string; en: string };
  year: number;
  anonymised: true; // always true — this field acts as a reminder
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "campus-tv-secondary",
    category: "photography",
    schoolLevel: "secondary",
    programme: { zh: "校園電視台訓練課程", en: "Campus TV Training Programme" },
    programmeSlug: "campus-reporter-tv",
    headline: {
      zh: "學生完成校慶紀錄短片，於全校師生面前播放",
      en: "Students completed an anniversary documentary screened school-wide",
    },
    metric: {
      value: "30+",
      label: { zh: "學生參與製作", en: "students in production" },
    },
    description: {
      zh: "某本港中學引入校園電視台訓練課程，涵蓋採訪技巧、攝影構圖及剪輯製作。學生以小組形式完成校慶紀錄短片，並於全校師生面前播放。校方反映學生在參與度、表達能力及自信心各方面均有顯著進步。",
      en: "A Hong Kong secondary school introduced a campus TV training programme covering interviewing, composition and video editing. Students produced an anniversary documentary screened school-wide. Teachers reported significant improvement in student engagement, communication skills and confidence.",
    },
    details: {
      zh: "某本港中學引入校園電視台訓練課程，涵蓋採訪技巧、攝影構圖、鏡頭操作及剪輯製作。整個課程共八節，每節九十分鐘，全程於校內進行。學生以小組形式分工合作，由採訪策劃、外景拍攝到後期剪接，全程獨立完成校慶紀錄短片，並於全校師生面前播放。\n\n課程完結後，校方反映學生在參與度、表達能力及自信心各方面均有顯著進步。部分學生更主動申請於下學年繼續參與媒體製作活動。學校其後決定將校園電視台課程納入正式課外活動計劃，並邀請 JuntarHK 於下學年繼續合作。\n\n如需了解詳情或索取課程建議書，歡迎聯絡我們。",
      en: "A Hong Kong secondary school introduced a campus TV training programme covering interviewing, composition, camera operation and video editing. The programme ran over eight sessions of ninety minutes each, held entirely on campus. Students worked in production groups — from interview planning and location shooting to post-production — independently completing a school anniversary documentary that was screened school-wide.\n\nFollowing the programme, teachers reported significant improvement in student engagement, communication skills and confidence. Some students proactively requested to continue participating in media production activities in the following school year. The school subsequently incorporated the campus TV programme into its formal extracurricular plan and invited JuntarHK to continue the partnership.\n\nFor enquiries or to request a programme proposal, please contact us.",
    },
    year: 2025,
    anonymised: true,
  },
  {
    slug: "ai-animation-primary",
    category: "ai",
    schoolLevel: "primary",
    programme: { zh: "AI 動畫製作課程", en: "AI Animation Production Programme" },
    programmeSlug: "ai-animation-production",
    headline: {
      zh: "每位學生均完成原創 AI 動畫故事，並於班內公開分享",
      en: "Every student completed an original AI animation story and shared it with classmates",
    },
    metric: {
      value: "100%",
      label: { zh: "學生完成個人動畫作品", en: "students with completed animations" },
    },
    description: {
      zh: "某本港小學於課外活動時段引入 AI 動畫製作課程，讓學生在無需任何繪畫基礎的情況下，以 AI 工具完成原創動畫短片。班主任反映學生投入度極高，部分學生課後仍主動繼續創作。",
      en: "A Hong Kong primary school ran an AI animation programme during extracurricular periods, allowing students to produce original animated shorts using AI tools — no drawing skills required. Teachers noted exceptionally high engagement, with some students continuing to create independently after class.",
    },
    details: {
      zh: "某本港小學於課外活動時段引入 AI 動畫製作課程，讓學生在無需任何繪畫基礎的情況下，以 AI 工具完成原創動畫短片。課程共六節，每節六十至九十分鐘，全程於校內進行。\n\n課程涵蓋故事構思、角色設計、場景創作、動畫製作及配音錄製各環節。每位學生均能在課程完結時提交個人完整動畫作品，並於班內公開分享。\n\n班主任反映學生投入度極高，部分學生課後仍主動繼續創作，並自發分享作品予家長。學校反映課程有效提升學生的創意思維及數碼素養，並有意安排下學年繼續合作。\n\n如需了解詳情或索取課程建議書，歡迎聯絡我們。",
      en: "A Hong Kong primary school introduced an AI animation production programme during extracurricular activity periods, allowing students to complete original animated shorts using AI tools — no drawing skills required. The programme ran over six sessions of sixty to ninety minutes each, held entirely on campus.\n\nThe course covered story planning, character design, scene creation, animation production and voice-over recording. Every student submitted a complete personal animated work by the end of the programme and shared it with classmates in a class presentation.\n\nClass teachers noted exceptionally high engagement, with some students continuing to create independently after class and sharing their work spontaneously with parents. The school reported that the programme effectively enhanced students' creative thinking and digital literacy, and expressed interest in continuing the partnership in the following school year.\n\nFor enquiries or to request a programme proposal, please contact us.",
    },
    year: 2025,
    anonymised: true,
  },
];

export const CASE_STUDY_MAP = CASE_STUDIES.reduce<Record<string, CaseStudy>>(
  (acc, cs) => { acc[cs.slug] = cs; return acc; },
  {}
);
