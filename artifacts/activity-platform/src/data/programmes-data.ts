import { PROGRAMME_TAGS } from "@workspace/programmes-data";

export interface Programme {
  slug: string;
  category: "photography" | "ai";
  /** Show this programme on the homepage featured grid */
  featured?: boolean;
  /** Searchable taxonomy tags (e.g. "AI動畫", "校園記者") */
  tags?: string[];
  /** One-sentence value proposition shown on homepage ProgrammeCard */
  valueProp?: { zh: string; en: string };
  zh: string;
  en: string;
  descZh: string;
  descEn: string;
  targetAge: { zh: string; en: string };
  sessions: { zh: string; en: string };
  duration: { zh: string; en: string };
  classSize: { zh: string; en: string };
  equipment: { zh: string; en: string };
  output: { zh: string; en: string };
  /** Override the generic "學生作品" / "Student Output" label for this programme */
  outputLabel?: { zh: string; en: string };
  customise: { zh: string; en: string };
  fundingNote: { zh: string; en: string };
  skills: { zh: string; en: string }[];
  /** 4–5 learning objectives */
  learningObjectives: { zh: string; en: string }[];
  /** Suggested session-by-session structure */
  lessonStructure: { step: number; titleZh: string; titleEn: string; descZh: string; descEn: string }[];
  /** 3–5 FAQ items */
  faq: { qZh: string; qEn: string; aZh: string; aEn: string }[];
  /** Anonymised case study placeholder (null = none yet) */
  relatedCaseStudy: { zh: string; en: string } | null;
}

const fundingNote = {
  zh: "可提供課程建議書、學習成果框架及預算，協助學校規劃相關撥款項目。實際撥款用途及審批須以教育局最新指引及校本程序為準。",
  en: "We can provide curriculum proposals, learning outcome frameworks and budget estimates to help schools plan funding applications. Actual use and approval of funding is subject to the latest EDB guidelines and school-based procedures."
};

const caseStudyAnon = {
  zh: "（案例資料已匿名處理）某本港學校於 2024–25 學年引入本課程後，學生完成了完整的成果作品，並於全校師生面前展示。校方反映學生的參與度、自信心及創作能力均顯著提升，並計劃延續相關課程。如需了解詳情，歡迎聯絡我們索取課程建議書。",
  en: "(Case details anonymised) A Hong Kong school introduced this programme in the 2024–25 school year. Students completed a finished output that was showcased school-wide. Teachers reported significant improvements in student engagement, confidence and creativity, and planned to continue the programme. Contact us for a detailed programme proposal."
};

export const PROGRAMMES: Programme[] = [
  {
    slug: "campus-reporter-tv",
    category: "photography",
    featured: true,
    tags: PROGRAMME_TAGS["campus-reporter-tv"],
    valueProp: {
      zh: "訓練學生成為校園記者，完成真實校園新聞短片及採訪報道",
      en: "Train students as campus reporters to produce real campus news clips and interviews",
    },
    zh: "校園記者及校園電視台訓練",
    en: "Campus Reporter & Campus TV Training",
    descZh: "訓練學生成為校園記者，掌握採訪、報道及影片製作技能。課程涵蓋新聞採訪技巧、鏡頭前表達、影片拍攝及後期製作，最終讓學生完成真實的校園新聞短片或採訪報道。",
    descEn: "Train students as campus reporters with skills in interviewing, news reporting and video production. The programme covers interviewing techniques, on-camera presentation, filming and post-production, culminating in real campus news clips or interview reports.",
    targetAge: { zh: "小學至中學", en: "Primary to Secondary" },
    sessions: { zh: "6–12 節", en: "6–12 sessions" },
    duration: { zh: "60–90 分鐘", en: "60–90 min" },
    classSize: { zh: "最多 30 人", en: "Up to 30 students" },
    equipment: { zh: "學校提供基本設備，或可借用器材", en: "Basic equipment from school, or borrow from us" },
    output: { zh: "校園新聞短片 / 採訪報道", en: "Campus news clip / interview report" },
    customise: { zh: "可加入新聞採訪、主播訓練或直播元素；可按校慶、開學日、全方位活動等校本主題訂製", en: "Can include news interviewing, anchor training or livestreaming; customisable around school events such as anniversaries or orientation days" },
    fundingNote,
    skills: [
      { zh: "新聞採訪技巧", en: "News interviewing techniques" },
      { zh: "鏡頭前表達", en: "On-camera presentation" },
      { zh: "影片拍攝", en: "Video filming" },
      { zh: "短片剪接", en: "Video editing" },
      { zh: "主播訓練", en: "Anchor training" },
      { zh: "現場直播入門", en: "Livestreaming basics" },
    ],
    learningObjectives: [
      { zh: "掌握基本新聞採訪流程及提問技巧", en: "Understand the basic news interviewing process and questioning techniques" },
      { zh: "建立鏡頭前的自信表達及主播形象", en: "Build on-camera confidence and anchor presentation skills" },
      { zh: "學習影片拍攝的構圖、鏡頭運用及現場採音", en: "Learn video composition, camera movement and on-location audio" },
      { zh: "掌握基本影片剪接工具，完成短片後期製作", en: "Use basic video editing tools to complete post-production" },
      { zh: "完成一套完整的校園新聞短片或採訪報道", en: "Complete a finished campus news clip or interview report" },
    ],
    lessonStructure: [
      {
        step: 1,
        titleZh: "新聞與校園媒體概論",
        titleEn: "Introduction to News & School Media",
        descZh: "了解新聞採訪的基本架構、校園電視台的運作模式及學生記者的角色",
        descEn: "Learn the basics of news reporting, how a campus TV station works and the role of student journalists",
      },
      {
        step: 2,
        titleZh: "鏡頭前表達及主播訓練",
        titleEn: "On-Camera Presentation & Anchor Training",
        descZh: "練習鏡頭前語言表達、站姿、眼神及臨場應對，模擬真實播報場景",
        descEn: "Practise on-camera speech, posture, eye contact and real-time responses in simulated broadcast scenarios",
      },
      {
        step: 3,
        titleZh: "影片拍攝技巧與外出採訪",
        titleEn: "Filming Techniques & Location Shoots",
        descZh: "學習拍攝構圖、採訪佈景及現場收音技巧，進行校園實地採訪練習",
        descEn: "Learn composition, interview setups and on-site audio, then practise with real on-campus location shoots",
      },
      {
        step: 4,
        titleZh: "短片剪接及後期製作",
        titleEn: "Video Editing & Post-Production",
        descZh: "使用剪接軟件完成影片拼合、加入字幕及背景音樂，製作完整短片",
        descEn: "Use editing software to cut footage, add subtitles and background music to complete the short film",
      },
      {
        step: 5,
        titleZh: "成品發佈及作品分享",
        titleEn: "Publication & Showcase",
        descZh: "完成校園新聞短片或採訪報道，並於全校師生面前播放或展示",
        descEn: "Complete the campus news clip or interview report and screen or present it school-wide",
      },
    ],
    faq: [
      {
        qZh: "學生需要有影片製作或攝影經驗嗎？",
        qEn: "Do students need prior video or photography experience?",
        aZh: "不需要。課程由零基礎開始，導師會逐步引導學生掌握所有技能。只需一部智能手機即可開始。",
        aEn: "No. The programme starts from scratch and instructors guide students through all skills step by step. A smartphone is all that's needed to begin.",
      },
      {
        qZh: "學校需要提供什麼器材？",
        qEn: "What equipment does the school need to provide?",
        aZh: "學生自備智能手機即可，亦可向 JuntarHK 借用相機及拍攝設備（視乎人數及課程安排）。",
        aEn: "Students' own smartphones are sufficient. Cameras and filming equipment can also be borrowed from JuntarHK subject to availability.",
      },
      {
        qZh: "最終成品會如何呈現給學校？",
        qEn: "How will the final output be presented to the school?",
        aZh: "視乎課程設計，可以安排於全校師生面前播放、上載至學校平台，或製作成影片存檔供學校留存。",
        aEn: "Depending on the programme design, outputs can be screened school-wide, uploaded to the school platform, or archived as video files for the school to keep.",
      },
      {
        qZh: "課程可以配合全方位學習活動或 LWLF 計劃嗎？",
        qEn: "Can this programme be linked to OLAR or LWLF plans?",
        aZh: "可以。我們可提供課程建議書、學習成果框架及預算，協助學校規劃相關撥款。撥款事宜須以教育局最新指引為準。",
        aEn: "Yes. We can provide curriculum proposals, learning outcome frameworks and budgets to help schools plan related funding. Funding is subject to the latest EDB guidelines.",
      },
    ],
    relatedCaseStudy: caseStudyAnon,
  },
  {
    slug: "mobile-photography-video",
    category: "photography",
    featured: true,
    tags: PROGRAMME_TAGS["mobile-photography-video"],
    valueProp: {
      zh: "以學生手機為工具，完成個人攝影作品集或校本主題短片",
      en: "Using students' own phones to build a personal photo portfolio or themed short film",
    },
    zh: "手機攝影與短片製作",
    en: "Mobile Photography & Short Video",
    descZh: "以學生手機為工具，學習攝影構圖、光線運用及短片拍攝技巧，並完成個人攝影作品集或主題短片。課程可配合任何校本主題靈活訂製。",
    descEn: "Using students' own phones, learn photography composition, lighting and short video skills, completing a personal photo portfolio or themed short film. The programme can be flexibly tailored to any school-based theme.",
    targetAge: { zh: "小學至中學", en: "Primary to Secondary" },
    sessions: { zh: "4–8 節", en: "4–8 sessions" },
    duration: { zh: "60–90 分鐘", en: "60–90 min" },
    classSize: { zh: "最多 35 人", en: "Up to 35 students" },
    equipment: { zh: "學生自備手機", en: "Students bring own phones" },
    output: { zh: "個人攝影作品集 / 主題短片", en: "Personal photo portfolio / themed short film" },
    customise: { zh: "可按主題訂製（校慶、旅行、運動日、中華文化等）；可加入戶外實拍或社區攝影元素", en: "Customisable by theme (anniversary, excursion, sports day, Chinese culture); can include outdoor or community photography shoots" },
    fundingNote,
    skills: [
      { zh: "攝影構圖基礎", en: "Photography composition basics" },
      { zh: "自然光及人工光運用", en: "Natural and artificial lighting" },
      { zh: "手機短片拍攝", en: "Mobile video filming" },
      { zh: "基本剪接", en: "Basic video editing" },
      { zh: "主題創作", en: "Thematic creative work" },
    ],
    learningObjectives: [
      { zh: "掌握手機攝影的構圖法則及視覺美感基礎", en: "Master mobile photography composition rules and visual aesthetics" },
      { zh: "了解光線運用、黃金時段及不同光源的拍攝技巧", en: "Understand lighting, golden hour and shooting in different lighting conditions" },
      { zh: "學習手機短片拍攝的鏡頭語言及拍攝流程", en: "Learn mobile video language and filming workflow" },
      { zh: "掌握簡易剪接工具，將素材整理成完整作品", en: "Use simple editing tools to turn raw footage into a complete work" },
      { zh: "完成個人攝影作品集或主題短片，並能講解創作概念", en: "Complete a personal photo portfolio or themed short film and explain the creative concept behind it" },
    ],
    lessonStructure: [
      {
        step: 1,
        titleZh: "攝影眼與構圖法則",
        titleEn: "Photographer's Eye & Composition Rules",
        descZh: "認識三分法、對角線、引導線等構圖技巧，在校園內進行即時練習",
        descEn: "Explore rule of thirds, diagonal lines, leading lines and other composition techniques with immediate in-school practice",
      },
      {
        step: 2,
        titleZh: "光線運用與主題策劃",
        titleEn: "Lighting & Theme Planning",
        descZh: "學習自然光、室內光及閃光燈的運用，並確立個人主題拍攝方向",
        descEn: "Learn natural light, indoor light and flash use, then establish the direction of each student's personal theme shoot",
      },
      {
        step: 3,
        titleZh: "外出實拍",
        titleEn: "Location Shoot",
        descZh: "按照已定主題於校園或校外指定地點進行實地拍攝，獲取最終作品素材",
        descEn: "Shoot on location — on campus or an agreed off-campus site — to capture the final portfolio material",
      },
      {
        step: 4,
        titleZh: "後期製作、作品集策展及分享",
        titleEn: "Post-Production, Curation & Sharing",
        descZh: "進行相片篩選、基礎修圖及排版，完成個人作品集或主題短片，並於班內互相分享",
        descEn: "Select, lightly edit and lay out photos; complete the portfolio or short film; share and discuss in class",
      },
    ],
    faq: [
      {
        qZh: "使用什麼手機型號都可以嗎？",
        qEn: "Does any smartphone model work?",
        aZh: "絕大多數現代智能手機均可。課程不需要高階攝影設備，重點是培養觀察力及構圖技巧。",
        aEn: "Most modern smartphones work well. The programme focuses on developing observation and composition skills, not on high-end equipment.",
      },
      {
        qZh: "課程可以配合學校的主題日或校慶嗎？",
        qEn: "Can the programme be tied to a school theme day or anniversary?",
        aZh: "可以。課程可以配合學校任何主題，例如校慶、旅行、運動日、文化主題等，作品亦可作為學校宣傳材料使用。",
        aEn: "Yes. The programme can align with any school theme — anniversary, excursion, sports day, cultural events — and the output can be used as school promotional material.",
      },
      {
        qZh: "學生沒有攝影基礎可以參加嗎？",
        qEn: "Can students with no photography background join?",
        aZh: "當然可以。課程特別為零基礎學生設計，由最基本的構圖知識開始，循序漸進。",
        aEn: "Absolutely. The programme is designed for beginners and builds from the most basic composition knowledge step by step.",
      },
      {
        qZh: "最終作品可以印刷成實體作品集嗎？",
        qEn: "Can the final work be printed as a physical portfolio?",
        aZh: "可以。如有需要，我們可協助安排印刷成實體作品集，費用另議。",
        aEn: "Yes. We can help arrange printing as a physical portfolio if needed; costs are quoted separately.",
      },
    ],
    relatedCaseStudy: caseStudyAnon,
  },
  {
    slug: "basic-photography-course",
    category: "photography",
    zh: "基礎攝影及視覺故事",
    en: "Basic Photography & Visual Storytelling",
    descZh: "以攝影為語言，引導學生透過相片說故事。從鏡頭認識、構圖法則到主題拍攝，最終完成一套有完整敘事的攝影系列作品。課程可結合校本主題或戶外實拍。",
    descEn: "Using photography as language, students learn to tell stories through images. From camera basics and composition to thematic shooting, the programme ends with a complete narrative photography series. Can incorporate school themes or outdoor shoots.",
    targetAge: { zh: "小學至中學", en: "Primary to Secondary" },
    sessions: { zh: "4–6 節", en: "4–6 sessions" },
    duration: { zh: "60–90 分鐘", en: "60–90 min" },
    classSize: { zh: "最多 30 人", en: "Up to 30 students" },
    equipment: { zh: "可借用相機或使用手機", en: "Cameras available to borrow or use phones" },
    output: { zh: "攝影系列作品 / 故事相冊", en: "Photography series / story photo album" },
    customise: { zh: "可結合校本主題或戶外實拍；可配合視覺藝術、中文、常識等學科", en: "Can incorporate school themes or outdoor shoots; can align with Visual Arts, Chinese or General Studies" },
    fundingNote,
    skills: [
      { zh: "相機及手機攝影基礎", en: "Camera and mobile photography basics" },
      { zh: "構圖法則", en: "Composition rules" },
      { zh: "視覺敘事", en: "Visual storytelling" },
      { zh: "主題創作", en: "Thematic creative work" },
      { zh: "作品整理與展示", en: "Portfolio curation and display" },
    ],
    learningObjectives: [
      { zh: "認識基本相機及手機攝影操作", en: "Understand basic camera and smartphone photography operation" },
      { zh: "掌握構圖法則，運用視覺元素表達情感與意義", en: "Apply composition rules to convey emotion and meaning through visual elements" },
      { zh: "理解視覺敘事的概念，學習用相片串連故事", en: "Understand visual storytelling and how to connect images into a narrative sequence" },
      { zh: "完成主題攝影系列，呈現有結構的視覺故事", en: "Complete a thematic photography series with a structured visual narrative" },
      { zh: "策展及展示個人作品集，向同學分享創作概念", en: "Curate and present a personal portfolio and explain the creative concept to classmates" },
    ],
    lessonStructure: [
      {
        step: 1,
        titleZh: "攝影眼與基礎操作",
        titleEn: "Photographer's Eye & Camera Basics",
        descZh: "了解相機及手機攝影基本操作，培養觀察力，練習以不同角度拍攝同一物件",
        descEn: "Learn basic camera and phone operation, develop visual observation, practise shooting the same subject from different angles",
      },
      {
        step: 2,
        titleZh: "構圖與視覺語言",
        titleEn: "Composition & Visual Language",
        descZh: "學習構圖法則（三分法、對稱、框架等）及如何運用光線與色彩傳達情感",
        descEn: "Study composition rules (rule of thirds, symmetry, framing) and how to use light and colour to convey emotion",
      },
      {
        step: 3,
        titleZh: "故事策劃與主題拍攝",
        titleEn: "Story Planning & Theme Shoot",
        descZh: "確立個人攝影主題，策劃視覺故事架構，並進行主題實拍",
        descEn: "Define a personal photography theme, plan the visual narrative structure and execute the theme shoot",
      },
      {
        step: 4,
        titleZh: "作品策展、排版及展示",
        titleEn: "Curation, Layout & Exhibition",
        descZh: "篩選最佳作品，進行排版設計，完成故事相冊或攝影系列，並進行班內展示",
        descEn: "Select the best images, lay out the work, complete the story album or photography series and hold a class exhibition",
      },
    ],
    faq: [
      {
        qZh: "學生可以用手機還是需要相機？",
        qEn: "Can students use phones or do they need cameras?",
        aZh: "兩者均可。JuntarHK 可提供相機借用（視乎人數及安排），學生亦可直接使用自備手機完成課程。",
        aEn: "Both work. JuntarHK can provide cameras to borrow (subject to numbers and arrangements), or students can use their own smartphones throughout.",
      },
      {
        qZh: "課程可以配合視覺藝術科教學嗎？",
        qEn: "Can this programme complement Visual Arts teaching?",
        aZh: "可以。課程強調視覺美感、構圖語言及創意表達，可與視覺藝術、中文、常識等學科主題整合。",
        aEn: "Yes. The programme emphasises visual aesthetics, composition language and creative expression — easy to integrate with Visual Arts, Chinese or General Studies themes.",
      },
      {
        qZh: "最終作品可以用作學校展覽嗎？",
        qEn: "Can the final output be used in a school exhibition?",
        aZh: "可以。課程設計本來就以作品展示為目標，成品可以印刷成展版、投影或製成電子相冊，供學校展覽使用。",
        aEn: "Yes. The programme is designed with a public showcase in mind. Outputs can be printed as exhibition panels, projected or made into digital albums.",
      },
      {
        qZh: "幾節課可以完成一套作品？",
        qEn: "How many sessions are needed to complete a full set of work?",
        aZh: "一般情況下，4 節課可完成基礎主題攝影系列；6 節或以上則可加入更豐富的故事策劃及後期製作。",
        aEn: "As a guide, 4 sessions is enough for a basic thematic photography series. Six or more sessions allow for richer story planning and post-production.",
      },
    ],
    relatedCaseStudy: caseStudyAnon,
  },
  {
    slug: "ai-animation-production",
    category: "ai",
    featured: true,
    tags: PROGRAMME_TAGS["ai-animation-production"],
    valueProp: {
      zh: "引導學生使用 AI 工具創作動畫短片，由 AI 使用者成為真正的創作者",
      en: "Guide students to create AI animation clips, moving from AI users to genuine creators",
    },
    zh: "AI 動畫創作",
    en: "AI Animation Production",
    descZh: "帶領學生使用 AI 工具創作動畫短片或數碼故事，涵蓋 AI 圖像生成、動畫合成及故事腳本設計。課程可結合中華文化、環保或學校主題，學生最終完成一套完整的 AI 動畫作品。",
    descEn: "Guide students in using AI tools to create animated clips or digital stories, covering AI image generation, animation composition and storyboard design. Can be themed around Chinese culture, eco or school topics. Students complete a full AI animation project.",
    targetAge: { zh: "小學至中學", en: "Primary to Secondary" },
    sessions: { zh: "4–8 節", en: "4–8 sessions" },
    duration: { zh: "60–90 分鐘", en: "60–90 min" },
    classSize: { zh: "最多 30 人", en: "Up to 30 students" },
    equipment: { zh: "需要電腦室", en: "Computer room required" },
    output: { zh: "AI 動畫短片 / 數碼故事", en: "AI animation clip / digital story" },
    customise: { zh: "可結合中華文化、環保或校本主題；可配合中史、常識、視覺藝術等學科", en: "Combine with Chinese culture, eco or school themes; can align with Chinese History, General Studies or Visual Arts" },
    fundingNote,
    skills: [
      { zh: "AI 圖像生成", en: "AI image generation" },
      { zh: "動畫合成工具", en: "Animation composition tools" },
      { zh: "故事腳本設計", en: "Storyboard design" },
      { zh: "AI 素養（版權、倫理）", en: "AI literacy (copyright, ethics)" },
      { zh: "數碼作品呈現", en: "Digital work presentation" },
    ],
    learningObjectives: [
      { zh: "了解 AI 圖像生成工具的原理及正確使用方法", en: "Understand how AI image generation tools work and how to use them responsibly" },
      { zh: "掌握動畫合成工具，將 AI 圖像合成為連貫動畫片段", en: "Use animation composition tools to turn AI images into cohesive animation sequences" },
      { zh: "學習故事腳本設計，規劃完整的數碼故事架構", en: "Learn storyboard design to plan a complete digital story structure" },
      { zh: "認識 AI 素養，包括版權、倫理及資訊核實的基本概念", en: "Develop AI literacy including basic concepts of copyright, ethics and fact verification" },
      { zh: "完成一套原創 AI 動畫短片或數碼故事，並於班內分享", en: "Complete an original AI animation clip or digital story and present it to the class" },
    ],
    lessonStructure: [
      {
        step: 1,
        titleZh: "AI 工具認識與 AI 素養",
        titleEn: "AI Tool Introduction & AI Literacy",
        descZh: "介紹課程所用的 AI 圖像及動畫工具，討論 AI 創作的版權、倫理及負責任使用",
        descEn: "Introduce the AI image and animation tools used in the programme; discuss copyright, ethics and responsible AI use",
      },
      {
        step: 2,
        titleZh: "故事腳本設計",
        titleEn: "Storyboard Design",
        descZh: "學生確立主題及故事大綱，繪製或規劃分鏡腳本，為 AI 圖像生成做準備",
        descEn: "Students choose a theme and story outline, then sketch or plan a storyboard in preparation for AI image generation",
      },
      {
        step: 3,
        titleZh: "AI 圖像生成與素材製作",
        titleEn: "AI Image Generation & Asset Creation",
        descZh: "使用 AI 工具生成動畫所需的場景、角色及物件圖像，並進行整理",
        descEn: "Use AI tools to generate scene, character and object images needed for the animation, then organise the assets",
      },
      {
        step: 4,
        titleZh: "動畫合成、配樂及後期製作",
        titleEn: "Animation Compositing, Sound & Post-Production",
        descZh: "將 AI 圖像合成為動畫片段，加入配樂及文字，完成完整的 AI 動畫短片",
        descEn: "Composite AI images into animation sequences, add music and text, and complete the full AI animation clip",
      },
    ],
    faq: [
      {
        qZh: "學生需要有程式設計或編碼經驗嗎？",
        qEn: "Do students need programming or coding experience?",
        aZh: "不需要。課程使用的 AI 創作工具均以視覺化介面為主，無需任何程式設計基礎。",
        aEn: "No. The AI creative tools used in the programme have visual interfaces and require no coding background.",
      },
      {
        qZh: "學校需要提供什麼設備？",
        qEn: "What equipment does the school need to provide?",
        aZh: "需要一間備有電腦及網絡連接的電腦室，每位或每兩位學生有一台電腦。",
        aEn: "A computer room with internet access is needed — ideally one computer per student or one per two students.",
      },
      {
        qZh: "AI 創作的作品版權歸誰？",
        qEn: "Who owns the copyright to AI-generated work?",
        aZh: "課程會介紹 AI 作品的版權討論及目前的行業慣例。學生作品的使用權歸學校及學生，我們不會使用學生作品作商業用途。",
        aEn: "The programme covers copyright discussions and current industry practice around AI work. Usage rights to student outputs belong to the school and students; we do not use student work commercially.",
      },
      {
        qZh: "課程可以配合中史、常識或其他學科嗎？",
        qEn: "Can this programme be integrated with Chinese History, General Studies or other subjects?",
        aZh: "可以。AI 動畫課程可以配合任何學科主題，包括中華文化、環保、STEM、歷史等，內容可按老師的教學目標訂製。",
        aEn: "Yes. The AI animation programme can integrate with any subject theme including Chinese culture, environment, STEM and history; content is customised to the teacher's learning objectives.",
      },
    ],
    relatedCaseStudy: caseStudyAnon,
  },
  {
    slug: "ai-image-visual-storytelling",
    category: "ai",
    featured: true,
    tags: PROGRAMME_TAGS["ai-image-visual-storytelling"],
    valueProp: {
      zh: "以手機攝影為起點，結合 AI 圖像編輯工具，讓學生創作出具個人風格的視覺故事",
      en: "Starting from smartphone photography, use AI image tools to help students create visual stories with a personal style",
    },
    zh: "手機攝影 × AI 圖像製作",
    en: "Mobile Photography × AI Image Creation",
    descZh: "以手機為工具，學習攝影構圖、鏡頭應用及人像攝影技巧，再結合免費 AI 圖像工具進行背景修改、特效創作及影片後期製作，完成具個人風格的數碼視覺故事作品。",
    descEn: "Using smartphones as the primary tool, students learn photography composition, lens techniques and portrait photography, then apply free AI image tools for background editing, effects and video post-production — completing a personal digital visual story.",
    targetAge: { zh: "小學至中學", en: "Primary to Secondary" },
    sessions: { zh: "4–6 節", en: "4–6 sessions" },
    duration: { zh: "60–90 分鐘", en: "60–90 min" },
    classSize: { zh: "最多 30 人", en: "Up to 30 students" },
    equipment: { zh: "學生自備手機；需要 WiFi 連接", en: "Students' own smartphones; WiFi required" },
    output: { zh: "AI 編輯相片作品集 / AI 特效短片", en: "AI-edited photo portfolio / AI effects short video" },
    customise: { zh: "可按學校主題訂製（校慶、旅遊、社區攝影等）；可針對不同社交平台或校刊用途優化", en: "Customisable by school theme (anniversary, excursion, community photography); can be optimised for different platforms or school publications" },
    fundingNote,
    skills: [
      { zh: "手機攝影基礎及 AI 相機功能", en: "Smartphone photography and AI camera features" },
      { zh: "構圖技巧（黃金三分法、引導線）", en: "Composition techniques (rule of thirds, leading lines)" },
      { zh: "人像攝影與模式設定", en: "Portrait photography and mode settings" },
      { zh: "AI 背景修改、移除與生成擴展", en: "AI background modification, removal and generative expansion" },
      { zh: "圖像及影片 AI 後期製作", en: "AI-powered image and video post-production" },
    ],
    learningObjectives: [
      { zh: "認識並善用手機內置相機的各項功能，包括內置 AI 功能", en: "Understand and use smartphone camera functions including built-in AI features" },
      { zh: "掌握構圖技巧，包括黃金三分法、引導線及人像攝影構圖", en: "Master composition techniques including the rule of thirds, leading lines and portrait framing" },
      { zh: "運用 AI 工具為相片進行背景修改、移除及特效處理", en: "Use AI tools to modify, remove and enhance photo backgrounds and apply effects" },
      { zh: "學習使用圖像及影片編輯應用程式，加入 AI 效果、字幕及自動剪輯功能", en: "Use image and video editing apps to apply AI effects, subtitles and auto-editing features" },
      { zh: "完成 AI 編輯相片作品集或 AI 特效短片，並能說明創作概念", en: "Complete an AI-edited photo portfolio or AI effects short video and explain the creative concept" },
    ],
    lessonStructure: [
      {
        step: 1,
        titleZh: "手機攝影基礎",
        titleEn: "Smartphone Photography Fundamentals",
        descZh: "認識手機相機功能、鏡頭特性及內置 AI 功能；介紹 AI 使用的版權與倫理",
        descEn: "Explore smartphone camera functions, lens characteristics and built-in AI features; introduce copyright and ethics of AI use",
      },
      {
        step: 2,
        titleZh: "構圖技巧與人像攝影",
        titleEn: "Composition & Portrait Photography",
        descZh: "學習黃金三分法、引導線構圖及人像模式設定，進行主題實拍練習",
        descEn: "Learn the rule of thirds, leading line composition and portrait mode settings; practise thematic photo shoots",
      },
      {
        step: 3,
        titleZh: "AI 圖像編輯與特效",
        titleEn: "AI Image Editing & Effects",
        descZh: "使用 AI 工具進行背景替換、移除與生成擴展，加入 AI 特效，完善相片作品",
        descEn: "Use AI tools for background replacement, removal and generative expansion; add AI-generated effects to enhance photos",
      },
      {
        step: 4,
        titleZh: "影片後期製作與作品展示",
        titleEn: "Video Post-Production & Showcase",
        descZh: "使用編輯應用程式剪裁影片、加入 AI 字幕及濾鏡，完成作品並於班內展示",
        descEn: "Use editing apps to trim video, add AI subtitles and filters; finalise work and present to the class",
      },
    ],
    faq: [
      {
        qZh: "學生需要專業相機或特定手機嗎？",
        qEn: "Do students need a professional camera or a specific phone model?",
        aZh: "不需要。課程以學生自備手機為主，大部分現代智能手機均適用。課程重點是培養觀察力和構圖能力，而非依賴高端設備。",
        aEn: "No. The programme uses students' own smartphones — most modern models work well. The focus is on developing observation and composition skills, not high-end equipment.",
      },
      {
        qZh: "課程會用到哪些 AI 工具？",
        qEn: "Which AI tools will the programme use?",
        aZh: "課程以免費及適合學生使用的 AI 圖像及影片編輯工具為主，同時介紹工具的版權、倫理及正確使用方法。",
        aEn: "The programme uses free, student-friendly AI image and video editing tools, alongside guidance on copyright, ethics and responsible use.",
      },
      {
        qZh: "課程是否適合沒有攝影基礎的學生？",
        qEn: "Is this suitable for students with no photography experience?",
        aZh: "完全適合。課程從手機攝影基礎開始，循序漸進帶領學生掌握構圖技巧和 AI 工具，無需任何先備知識。",
        aEn: "Absolutely. The programme starts from smartphone photography basics and guides students step by step — no prior knowledge needed.",
      },
      {
        qZh: "課程可以配合學校活動或主題嗎？",
        qEn: "Can the programme tie into school events or themes?",
        aZh: "可以。課程可按校本主題訂製，例如校慶攝影、旅行記錄、社區故事或跨學科項目。",
        aEn: "Yes. The programme can be customised around school themes such as anniversary photography, excursion documentation, community stories or cross-subject projects.",
      },
    ],
    relatedCaseStudy: caseStudyAnon,
  },
  {
    slug: "ai-chinese-culture-digital-story",
    category: "ai",
    featured: true,
    tags: PROGRAMME_TAGS["ai-chinese-culture-digital-story"],
    valueProp: {
      zh: "結合 AI 創作工具與中華文化，跨學科創作數碼故事及動畫",
      en: "Blend AI tools with Chinese cultural themes for cross-subject digital stories",
    },
    zh: "AI＋中華文化數碼故事",
    en: "AI + Chinese Culture Digital Story",
    descZh: "結合 AI 創作工具與中華文化主題，引導學生創作數碼故事或動畫。課程可配合中史、常識、德育等學科，讓學生以現代 AI 工具重新詮釋傳統文化故事。",
    descEn: "Combine AI creative tools with Chinese cultural themes, guiding students to create digital stories or animations. Can align with Chinese History, General Studies or moral education, letting students reinterpret traditional cultural stories through modern AI tools.",
    targetAge: { zh: "小學至中學", en: "Primary to Secondary" },
    sessions: { zh: "4–6 節", en: "4–6 sessions" },
    duration: { zh: "60–90 分鐘", en: "60–90 min" },
    classSize: { zh: "最多 30 人", en: "Up to 30 students" },
    equipment: { zh: "需要電腦室", en: "Computer room required" },
    output: { zh: "AI 數碼故事 / 中華文化主題動畫", en: "AI digital story / Chinese culture animation" },
    customise: { zh: "可配合中史、常識或德育課題；主題可選擇傳統節日、歷史人物、神話故事或當代中華文化議題", en: "Can align with Chinese History, General Studies or moral education; themes can include traditional festivals, historical figures, mythology or contemporary Chinese culture topics" },
    fundingNote,
    skills: [
      { zh: "AI 圖像及動畫工具", en: "AI image and animation tools" },
      { zh: "中華文化主題研究", en: "Chinese cultural theme research" },
      { zh: "數碼故事創作", en: "Digital storytelling" },
      { zh: "跨學科整合", en: "Cross-subject integration" },
      { zh: "AI 倫理及版權認識", en: "AI ethics and copyright awareness" },
    ],
    learningObjectives: [
      { zh: "深化對中華文化或相關主題的認識與理解", en: "Deepen knowledge and appreciation of Chinese culture or related themes" },
      { zh: "學習數碼故事的結構，掌握有效的敘事方式", en: "Learn digital story structure and effective narrative techniques" },
      { zh: "使用 AI 工具將文化主題轉化為視覺化數碼作品", en: "Use AI tools to transform cultural themes into visual digital works" },
      { zh: "了解 AI 在文化傳承與創新表達中的角色及倫理考量", en: "Understand the role of AI in cultural preservation and creative expression, along with ethical considerations" },
      { zh: "完成原創 AI 中華文化數碼故事或動畫，向全班展示", en: "Complete an original AI Chinese culture digital story or animation and present to the class" },
    ],
    lessonStructure: [
      {
        step: 1,
        titleZh: "文化主題探索與故事選題",
        titleEn: "Cultural Theme Exploration & Story Selection",
        descZh: "探索中華文化主題（傳統節日、歷史故事、神話傳說等），學生選定故事方向並研究資料",
        descEn: "Explore Chinese cultural themes (festivals, historical stories, myths and legends); students choose a story direction and research background information",
      },
      {
        step: 2,
        titleZh: "數碼故事結構與腳本設計",
        titleEn: "Digital Story Structure & Script",
        descZh: "學習數碼故事的敘事結構，撰寫故事腳本並規劃視覺呈現方式",
        descEn: "Learn narrative structure for digital storytelling; write a script and plan how the story will be visualised",
      },
      {
        step: 3,
        titleZh: "AI 圖像生成與視覺設計",
        titleEn: "AI Image Generation & Visual Design",
        descZh: "運用 AI 工具生成符合中華文化主題的場景、人物及道具圖像，並進行視覺調整",
        descEn: "Use AI tools to generate culturally themed scene, character and prop images, then adjust visuals for consistency",
      },
      {
        step: 4,
        titleZh: "動畫合成、配音及完成作品",
        titleEn: "Animation, Narration & Final Output",
        descZh: "將圖像合成動畫，加入配音、字幕及背景音樂，完成完整的文化數碼故事",
        descEn: "Composite images into animation, add narration, subtitles and background music to complete the digital cultural story",
      },
    ],
    faq: [
      {
        qZh: "課程可以配合學校的中史或常識課嗎？",
        qEn: "Can this programme complement Chinese History or General Studies classes?",
        aZh: "可以。課程設計本來就以跨學科整合為目標，可以完全配合中史、常識、德育、中文等學科的教學主題。",
        aEn: "Yes. The programme is designed for cross-subject integration and can fully align with Chinese History, General Studies, Moral Education and Chinese Language teaching themes.",
      },
      {
        qZh: "文化主題可以由學校老師指定嗎？",
        qEn: "Can the school teacher specify the cultural theme?",
        aZh: "可以。主題完全可以由老師根據課程需要決定，例如傳統節日、歷史人物、神話故事或當代中華文化議題。",
        aEn: "Yes. The theme can be entirely decided by the teacher based on curriculum needs — traditional festivals, historical figures, myths or contemporary Chinese culture topics.",
      },
      {
        qZh: "學生需要有中文寫作能力嗎？",
        qEn: "Do students need strong Chinese writing skills?",
        aZh: "不需要。課程重點在於視覺創作，文字內容可以簡短，導師會協助學生以圖像及視覺元素表達文化主題。",
        aEn: "No. The focus is on visual creation. Text content can be brief, and instructors will help students express cultural themes through imagery and visual elements.",
      },
      {
        qZh: "完成的作品可以作為學校的文化活動成果嗎？",
        qEn: "Can the completed work be used as an output for a school cultural event?",
        aZh: "可以。完成的 AI 數碼故事可以在文化活動、校慶、學科展覽或全校師生面前播放展示。",
        aEn: "Yes. The finished AI digital story can be screened at cultural events, school anniversaries, subject exhibitions or in front of the whole school.",
      },
    ],
    relatedCaseStudy: caseStudyAnon,
  },
  {
    slug: "teacher-ai-workflow",
    category: "ai",
    zh: "教師 AI 教材及行政工作流",
    en: "Teacher AI Productivity & Workflow",
    descZh: "專為教師設計的 AI 應用培訓，涵蓋 AI 備課工具、自動化行政工作流及 Canva AI / Gamma 等實用平台。可按科目或行政需要訂製工作流，助教師節省時間、提升工作效能。",
    descEn: "AI productivity training designed for teachers, covering AI lesson prep tools, automated admin workflows and practical platforms like Canva AI and Gamma. Customisable by subject or administrative function to help teachers save time and work more efficiently.",
    targetAge: { zh: "教師培訓", en: "Teacher Training" },
    sessions: { zh: "1–3 節", en: "1–3 sessions" },
    duration: { zh: "90–180 分鐘", en: "90–180 min" },
    classSize: { zh: "不限", en: "No limit" },
    equipment: { zh: "電腦或平板電腦", en: "Computer or tablet" },
    output: { zh: "AI 備課工具、教材範本及行政工作流程", en: "AI lesson prep tools, teaching material templates and admin workflows" },
    outputLabel: { zh: "培訓成果", en: "Training Outcomes" },
    customise: { zh: "可按科目（中文、英文、STEM 等）或行政功能（通告撰寫、評估設計等）訂製工作流", en: "Customisable by subject (Chinese, English, STEM etc.) or admin function (notice writing, assessment design etc.)" },
    fundingNote,
    skills: [
      { zh: "AI 備課工具（ChatGPT、Gemini 等）", en: "AI lesson prep tools (ChatGPT, Gemini, etc.)" },
      { zh: "Canva AI 設計工作流", en: "Canva AI design workflow" },
      { zh: "Gamma 簡報生成", en: "Gamma presentation generation" },
      { zh: "自動化行政工作流", en: "Automated admin workflows" },
      { zh: "AI 素養及資訊核實", en: "AI literacy and fact verification" },
    ],
    learningObjectives: [
      { zh: "了解主流 AI 工具（ChatGPT、Gemini、Copilot 等）的功能及在教育中的應用場景", en: "Understand mainstream AI tools (ChatGPT, Gemini, Copilot) and their applications in education" },
      { zh: "掌握 AI 備課技巧，包括課程大綱生成、練習題設計及評估框架撰寫", en: "Apply AI lesson prep techniques including generating outlines, designing exercises and writing assessment frameworks" },
      { zh: "學習使用 Canva AI 及 Gamma 製作教材及簡報，大幅縮短設計時間", en: "Use Canva AI and Gamma to create teaching materials and presentations, significantly reducing design time" },
      { zh: "建立個人化的 AI 行政工作流，處理通告、家長信件及學生評估報告", en: "Build personalised AI admin workflows for notices, parent letters and student assessment reports" },
      { zh: "培養批判性 AI 素養，識別 AI 輸出的限制並進行有效核實", en: "Develop critical AI literacy to identify limitations in AI outputs and verify information effectively" },
    ],
    lessonStructure: [
      {
        step: 1,
        titleZh: "AI 工具概覽與備課應用",
        titleEn: "AI Tool Overview & Lesson Prep Applications",
        descZh: "介紹主流 AI 工具、示範如何用 AI 生成課程大綱、練習題及差異化教學材料",
        descEn: "Introduce mainstream AI tools; demonstrate using AI to generate lesson outlines, exercises and differentiated teaching materials",
      },
      {
        step: 2,
        titleZh: "教材設計與簡報製作",
        titleEn: "Teaching Material Design & Presentation Creation",
        descZh: "使用 Canva AI 及 Gamma 製作視覺化教材及課堂簡報，實際操作練習",
        descEn: "Hands-on use of Canva AI and Gamma to create visual teaching materials and class presentations",
      },
      {
        step: 3,
        titleZh: "行政工作流自動化及 AI 素養",
        titleEn: "Admin Workflow Automation & AI Literacy",
        descZh: "建立個人化行政工作流，討論 AI 輸出核實方法、版權考量及負責任使用原則",
        descEn: "Build personal admin workflows; discuss AI output verification, copyright considerations and principles of responsible use",
      },
    ],
    faq: [
      {
        qZh: "培訓適合對 AI 認識有限的老師嗎？",
        qEn: "Is this training suitable for teachers with little AI knowledge?",
        aZh: "非常適合。培訓由最基礎的 AI 工具介紹開始，著重實際操作而非理論，確保每位老師都能即時上手應用。",
        aEn: "Very much so. Training starts with the most basic AI tool introductions and focuses on hands-on practice rather than theory, ensuring every teacher can apply the tools immediately.",
      },
      {
        qZh: "培訓可以配合學校的科目範疇嗎？",
        qEn: "Can the training be customised for specific subject departments?",
        aZh: "可以。培訓可以按科組（例如中文、英文、STEM、視覺藝術）或行政功能訂製，確保工作流直接應用於老師的日常工作。",
        aEn: "Yes. Training can be customised for subject departments (Chinese, English, STEM, Visual Arts) or admin functions, ensuring workflows directly apply to teachers' daily work.",
      },
      {
        qZh: "老師在培訓後能馬上使用這些工具嗎？",
        qEn: "Can teachers use these tools immediately after training?",
        aZh: "可以。每節培訓均以即時實踐為主，老師在課堂上完成的工作流及範本可直接帶走使用。",
        aEn: "Yes. Each session prioritises immediate practice. Teachers leave with workflows and templates completed during the session, ready to use straight away.",
      },
      {
        qZh: "培訓可以在學校內進行嗎？",
        qEn: "Can the training be held at the school?",
        aZh: "可以。我們提供到校培訓服務，亦可根據學校的教師發展日（TDD）時段靈活安排。",
        aEn: "Yes. We offer school-visit training that can be flexibly scheduled around the school's Teacher Development Day (TDD).",
      },
    ],
    relatedCaseStudy: {
      zh: "（案例資料已匿名處理）某本港中學於 2025 年安排全體科任教師參加為期一天的 AI 工作坊。培訓後，老師反映備課時間平均節省約 30–40%，並成功建立了通告撰寫及評估設計的 AI 工作流範本供全科使用。如需了解詳情，歡迎聯絡我們索取培訓建議書。",
      en: "(Case details anonymised) A Hong Kong secondary school arranged a full-day AI workshop for all subject teachers in 2025. After training, teachers reported saving around 30–40% of lesson prep time on average, and successfully established AI workflow templates for notice writing and assessment design for use across departments. Contact us for a detailed training proposal.",
    },
  },
  {
    slug: "ai-thinking-communication-course",
    category: "ai",
    zh: "AI思維與溝通課",
    en: "AI Thinking & Communication",
    descZh: "以 Prompt 工程為核心，帶領學生學習如何與 AI 溝通，創作 AI 漫畫故事、AI 圖像系列，並透過「AI vs 真實」對比練習培養批判性思考。課程以真實動手操作為主，適合小學一至六年級。",
    descEn: "With prompt engineering at its core, this programme teaches students how to communicate with AI to create AI comic strips, image series and develop critical thinking through 'AI vs reality' comparison activities. Hands-on throughout and designed for Primary 1 to 6.",
    targetAge: { zh: "小一至小六", en: "Primary 1 to 6" },
    sessions: { zh: "4–6 節", en: "4–6 sessions" },
    duration: { zh: "60–90 分鐘", en: "60–90 min" },
    classSize: { zh: "最多 30 人", en: "Up to 30 students" },
    equipment: { zh: "iPad 或電腦（需有網絡連接）", en: "iPad or computer with internet access" },
    output: { zh: "AI 漫畫故事冊 / AI 圖像作品集 / Prompt Portfolio", en: "AI comic story book / AI image portfolio / Prompt Portfolio" },
    customise: { zh: "可配合主題訂製（品德教育、環保、傳統文化、科學等）；可與中文、常識、視覺藝術等學科結合；Prompt 難度可按年級調整", en: "Customisable by theme (moral education, environment, traditional culture, science); integrates with Chinese, General Studies or Visual Arts; prompt complexity adjustable by year group" },
    fundingNote,
    skills: [
      { zh: "Prompt 設計（角色、場景、動作、風格、主題）", en: "Prompt design (character, scene, action, style, theme)" },
      { zh: "AI 圖像生成工具操作", en: "AI image generation tool operation" },
      { zh: "AI 漫畫創作與視覺敘事", en: "AI comic creation and visual storytelling" },
      { zh: "批判性思考（AI vs 真實對比）", en: "Critical thinking (AI vs reality comparison)" },
      { zh: "數碼創作與故事結構", en: "Digital creation and story structure" },
      { zh: "AI 素養及倫理", en: "AI literacy and ethics" },
    ],
    learningObjectives: [
      { zh: "認識 AI 圖像生成工具的基本操作，了解 AI 如何「讀懂」文字指令", en: "Learn the basic operation of AI image generation tools and how AI 'reads' text prompts" },
      { zh: "掌握結構化 Prompt 設計技巧，以角色、場景、動作、風格等元素引導 AI 創作", en: "Apply structured prompt design using character, scene, action and style to guide AI output" },
      { zh: "運用 AI 工具創作多格漫畫，將圖像按故事結構排列成完整故事冊", en: "Use AI tools to create a multi-panel comic strip arranged into a complete narrative story book" },
      { zh: "透過「AI vs 真實」對比練習，培養批判性觀察力，理解 AI 輸出的特性與限制", en: "Develop critical observation through 'AI vs reality' comparisons to understand the characteristics and limitations of AI output" },
      { zh: "認識 AI 創作的倫理考量，包括版權、責任使用及資訊核實", en: "Understand ethical considerations in AI creation including copyright, responsible use and fact verification" },
    ],
    lessonStructure: [
      {
        step: 1,
        titleZh: "AI 工具認識與 Prompt 基礎",
        titleEn: "AI Tool Introduction & Prompt Basics",
        descZh: "認識 AI 圖像生成工具，學習 Prompt「5元素框架」（角色、背景、動作、風格、主題），進行首次圖像生成練習",
        descEn: "Explore AI image generation tools and learn the '5-element prompt framework' (character, background, action, style, theme); complete first image generation practice",
      },
      {
        step: 2,
        titleZh: "Prompt 進階：AI vs 真實對比練習",
        titleEn: "Advanced Prompting: AI vs Reality Comparison",
        descZh: "設計多種 Prompt 並比較 AI 生成結果；以真實物件對比 AI 生成版本，培養批判性觀察力，討論 AI 素養及負責任使用",
        descEn: "Design multiple prompts and compare AI outputs; compare AI-generated images with real objects to build critical observation, then discuss AI literacy and responsible use",
      },
      {
        step: 3,
        titleZh: "AI 漫畫故事創作",
        titleEn: "AI Comic Story Creation",
        descZh: "按故事結構（起承轉合）策劃漫畫腳本，以 Prompt 引導 AI 逐格生成圖像，加入對話泡及文字說明，組成完整多格漫畫",
        descEn: "Plan a comic script with narrative structure (beginning, development, climax, resolution); use prompts to generate each panel image, add speech bubbles and captions to form a complete comic strip",
      },
      {
        step: 4,
        titleZh: "作品整理、Prompt Portfolio 與分享",
        titleEn: "Curation, Prompt Portfolio & Showcase",
        descZh: "整理 AI 漫畫成品及 Prompt Portfolio，進行班內展示及創作反思，分享各自的 Prompt 設計心得",
        descEn: "Compile the finished AI comic and Prompt Portfolio; hold a class showcase and creative reflection session sharing the thinking behind each prompt design",
      },
    ],
    faq: [
      {
        qZh: "課程適合幾歲的小朋友？",
        qEn: "What age group is this course for?",
        aZh: "課程適合小一至小六。低年級（P1–P3）會有更多結構化引導框架及導師支援；高年級（P4–P6）則鼓勵更自主的創作探索。",
        aEn: "The course suits Primary 1 to 6. Lower years (P1–P3) receive more structured guidance and instructor support; upper years (P4–P6) are encouraged toward more independent creative exploration.",
      },
      {
        qZh: "學生需要學過編程或有 AI 經驗嗎？",
        qEn: "Do students need coding or AI experience?",
        aZh: "完全不需要。課程以視覺化介面為主，專為 AI 零基礎學生設計，重點是培養創意思維及溝通能力，而非技術操作。",
        aEn: "Not at all. The programme uses visual interfaces and is designed for students with no AI background; the focus is on creative thinking and communication skills rather than technical operation.",
      },
      {
        qZh: "課程可以配合學科主題嗎？",
        qEn: "Can the course align with subject themes?",
        aZh: "可以。課程可配合中文、常識、品德教育、視覺藝術等學科，漫畫主題亦可按老師指定的學科內容訂製。",
        aEn: "Yes. The course can align with Chinese, General Studies, moral education or Visual Arts, and the comic theme can be customised to match teacher-specified subject content.",
      },
    ],
    relatedCaseStudy: caseStudyAnon,
  },
];

export const PROGRAMME_MAP = PROGRAMMES.reduce((acc, p) => {
  acc[p.slug] = p;
  return acc;
}, {} as Record<string, Programme>);
