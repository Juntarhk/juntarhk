/**
 * Post-build prerender step for the JuntarHK activity platform (SEO).
 *
 * Vite outputs a single SPA shell (dist/public/index.html) that hard-codes the
 * home page metadata. Crawlers that do not execute JavaScript therefore receive
 * home metadata for every route. This script templates the built shell into a
 * dedicated HTML file per public route with route-specific <title>, description,
 * canonical, Open Graph tags, JSON-LD and a crawler-visible <h1> + fallback body
 * (React replaces the fallback on mount). It also regenerates sitemap.xml from
 * live activity/category data so the published sitemap matches the catalogue.
 *
 * The database step is optional: if DATABASE_URL is unavailable or the query
 * fails, static route pages are still emitted and the build never fails.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "dist", "public");
const BASE_URL = "https://www.juntarhk.com";
const DEFAULT_OG_IMAGE = `${BASE_URL}/opengraph.jpg`;

const templatePath = path.join(publicDir, "index.html");
if (!fs.existsSync(templatePath)) {
  console.error(`[prerender] ${templatePath} not found. Run "vite build" first.`);
  process.exit(1);
}
const template = fs.readFileSync(templatePath, "utf8");

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function replaceAttr(html, regex, replacement) {
  return regex.test(html) ? html.replace(regex, replacement) : html;
}

/**
 * Produce a route-specific HTML document from the built shell.
 *
 * `lang` is "zh" (default, root path) or "en" (/en). `hreflangZh` / `hreflangEn`
 * are the reciprocal locale URLs so every generated page advertises a valid,
 * bidirectional hreflang cluster. `canonical` is this page's own locale URL.
 */
function buildPage({ title, description, canonical, ogImage, robots, extraJsonLd, fallback, lang = "zh", hreflangZh, hreflangEn }) {
  let out = template;
  const img = ogImage || DEFAULT_OG_IMAGE;
  const isEn = lang === "en";
  const zhAlt = hreflangZh || canonical;
  const enAlt = hreflangEn || canonical;

  if (isEn) {
    out = replaceAttr(out, /<html lang="[^"]*"/, `<html lang="en-HK"`);
    out = replaceAttr(out, /(<meta property="og:locale" content=")[^"]*("\s*\/?>)/, `$1en_HK$2`);
    out = replaceAttr(out, /(<meta property="og:locale:alternate" content=")[^"]*("\s*\/?>)/, `$1zh_HK$2`);
  }

  out = replaceAttr(out, /<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  out = replaceAttr(out, /(<meta name="description" content=")[^"]*("\s*\/?>)/, `$1${esc(description)}$2`);
  out = replaceAttr(out, /(<link rel="canonical" href=")[^"]*("\s*\/?>)/, `$1${canonical}$2`);
  out = replaceAttr(out, /(<link rel="alternate" hreflang="zh-HK" href=")[^"]*("\s*\/?>)/, `$1${zhAlt}$2`);
  out = replaceAttr(out, /(<link rel="alternate" hreflang="en-HK" href=")[^"]*("\s*\/?>)/, `$1${enAlt}$2`);
  out = replaceAttr(out, /(<link rel="alternate" hreflang="x-default" href=")[^"]*("\s*\/?>)/, `$1${zhAlt}$2`);

  out = replaceAttr(out, /(<meta property="og:title" content=")[^"]*("\s*\/?>)/, `$1${esc(title)}$2`);
  out = replaceAttr(out, /(<meta property="og:description" content=")[^"]*("\s*\/?>)/, `$1${esc(description)}$2`);
  out = replaceAttr(out, /(<meta property="og:url" content=")[^"]*("\s*\/?>)/, `$1${canonical}$2`);
  out = replaceAttr(out, /(<meta property="og:image" content=")[^"]*("\s*\/?>)/, `$1${img}$2`);

  out = replaceAttr(out, /(<meta name="twitter:title" content=")[^"]*("\s*\/?>)/, `$1${esc(title)}$2`);
  out = replaceAttr(out, /(<meta name="twitter:description" content=")[^"]*("\s*\/?>)/, `$1${esc(description)}$2`);
  out = replaceAttr(out, /(<meta name="twitter:image" content=")[^"]*("\s*\/?>)/, `$1${img}$2`);

  if (robots) {
    out = replaceAttr(out, /(<meta name="robots" content=")[^"]*("\s*\/?>)/, `$1${robots}$2`);
  }

  // FAQPage JSON-LD belongs only to the home page.
  out = out.replace(/\s*<!-- Structured Data: FAQPage[\s\S]*?<\/script>/, "");

  if (extraJsonLd) {
    out = out.replace(
      "</head>",
      `    <script type="application/ld+json">${JSON.stringify(extraJsonLd)}</script>\n  </head>`,
    );
  }

  // Swap the crawler fallback body inside #root with route-specific content.
  // The #root fallback contains no nested <div>, so the first </div> after the
  // opening tag is #root's own closing tag.  After a Vite build a <script> tag
  // sits between </div> and </body>, so we capture everything after </div>
  // (scripts + </body>) as $3 and preserve it unchanged.
  const rootRe = /(<div id="root">)[\s\S]*?(<\/div>)([\s\S]*?<\/body>)/;
  if (rootRe.test(out)) {
    out = out.replace(rootRe, `$1\n${fallback}\n    $2$3`);
  } else {
    console.warn("[prerender] #root fallback marker not found — body left unchanged");
  }

  return out;
}

function fallbackBody({ h1, intro, bullets = [], lang = "zh" }) {
  const isEn = lang === "en";
  const p = isEn ? "/en" : "";
  const nav = isEn
    ? [
        [`${p}`, "Home"],
        [`${p}/activities`, "Programmes"],
        [`${p}/about`, "About"],
        [`${p}/partners`, "Partners"],
        [`${p}/contact`, "Contact"],
      ]
    : [
        ["/", "首頁"],
        ["/activities", "課程目錄"],
        ["/about", "關於我們"],
        ["/partners", "合作學校"],
        ["/contact", "聯絡我們"],
      ];
  const navLabel = isEn ? "Primary pages" : "主要分頁";
  const list = bullets.length
    ? `<ul style="font-size:16px;line-height:1.8;color:#4a5560;padding-left:20px;margin:16px 0 0;">${bullets
        .map((b) => `<li>${esc(b)}</li>`)
        .join("")}</ul>`
    : "";
  const navLinks = nav
    .map(([href, label], i) => `<a href="${href || "/en"}" style="color:#3D8B89;${i < nav.length - 1 ? "margin-right:16px;" : ""}">${esc(label)}</a>`)
    .join("\n          ");
  return `      <main style="max-width:960px;margin:0 auto;padding:64px 24px;font-family:'Inter','PingFang HK','Microsoft JhengHei',system-ui,sans-serif;color:#1A3D4A;">
        <h1 style="font-size:38px;font-weight:800;line-height:1.2;margin:0 0 16px;">${esc(h1)}</h1>
        <p style="font-size:18px;line-height:1.6;color:#4a5560;margin:0;">${esc(intro)}</p>
        ${list}
        <nav aria-label="${navLabel}" style="border-top:1px solid #e5e7eb;padding-top:24px;margin-top:32px;">
          ${navLinks}
        </nav>
      </main>`;
}

function writePage(relDir, html) {
  const dir = path.join(publicDir, relDir);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html, "utf8");
}

// ---------------------------------------------------------------------------
// Static marketing / catalogue routes (zh-HK defaults mirror the React SEO).
// ---------------------------------------------------------------------------
const staticRoutes = [
  {
    dir: "activities",
    title: "香港中小學課程目錄｜攝影、AI 教育、歷奇訓練｜JuntarHK",
    description:
      "瀏覽 JuntarHK 香港中小學課程目錄，包括基礎攝影、手機攝影、校園記者、校園電視台、AI 動畫、AI 視覺故事及歷奇訓練。所有課程均可按校本主題及學生年級度身訂製。",
    fallback: {
      h1: "課程目錄",
      intro:
        "瀏覽 JuntarHK 為香港小學及中學提供的攝影教育、AI 創作及歷奇訓練課程。所有課程可按學校發展目標及學生年級度身設計。",
      bullets: [
        "影像及校園媒體 — 基礎攝影、手機攝影、校園記者、校園電視台",
        "AI 創作及 AI 素養 — AI 動畫、AI 視覺故事、AI 中華文化數碼故事",
        "歷奇及體驗學習 — 攀岩、巨人梯、繩網陣、野外定向",
      ],
    },
    titleEn: "Course Catalogue | Photography, AI Education & Adventure | JuntarHK",
    descriptionEn:
      "Browse JuntarHK's course catalogue for Hong Kong schools — basic photography, mobile photography, campus reporter, campus TV, AI animation, AI visual storytelling and adventure training. All programmes tailored by grade and school theme.",
    fallbackEn: {
      h1: "Course Catalogue",
      intro:
        "Browse JuntarHK's photography, AI creation and adventure learning programmes for Hong Kong primary and secondary schools. Every programme can be tailored to your school's goals and students' grade level.",
      bullets: [
        "Photography & School Media — basic photography, mobile photography, campus reporter, campus TV",
        "AI Education — AI animation, AI visual storytelling, AI and Chinese culture",
        "Adventure & Experiential Learning — rock climbing, giant ladder, rope courses, orienteering",
      ],
    },
    extraJsonLdZh: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          name: "香港企業Team Building及團隊培訓",
          description: "JuntarHK為香港企業提供度身訂造Team Building及團隊培訓，結合體驗式任務、專業引導及Debrief，支援小組至大型企業活動。",
          provider: { "@type": "Organization", "@id": `${BASE_URL}/#organization`, name: "JuntarHK" },
          url: `${BASE_URL}/corporate-team-building`,
        },
        {
          "@type": "FAQPage",
          mainEntity: [
            ["活動適合多少人參與？", "我們可根據企業需求，設計適合小型團隊至大型企業規模的活動方案。"],
            ["可唔可以室內或戶外進行？", "可以。我哋會按目標、人數、天氣風險及場地條件建議室內、戶外或混合方案。"],
            ["可以加入公司主題嗎？", "可以。方案可按公司文化、年度主題、共同目標或指定活動概念度身設計。"],
            ["報價包括啲咩？", "報價會按方案列明活動設計、所需人手、物資及已確認嘅執行範圍，方便逐項審閱。"],
            ["遇到惡劣天氣點安排？", "戶外方案會在籌備階段協議天氣應變安排，包括改期、調整流程或可行嘅室內替代方案。"],
            ["有咩附加服務？", "可按需要另行報價場地、餐飲、攝影攝錄或其他活動支援；實際可提供項目以方案確認為準。"],
          ].map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })),
        },
      ],
    },
    extraJsonLdEn: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          name: "Corporate Team Building & Training Hong Kong",
          description: "JuntarHK designs tailored corporate team building and training in Hong Kong, combining experiential challenges, professional facilitation and structured debriefs for groups of different sizes.",
          provider: { "@type": "Organization", "@id": `${BASE_URL}/#organization`, name: "JuntarHK" },
          url: `${BASE_URL}/en/corporate-team-building`,
        },
        {
          "@type": "FAQPage",
          mainEntity: [
            ["What is the participant size?", "We design solutions suitable for small teams to large enterprise groups based on corporate needs."],
            ["Can programmes run indoors or outdoors?", "Yes. We recommend an indoor, outdoor or blended format based on objectives, group size, weather risk and venue constraints."],
            ["Can you customise a company theme?", "Yes. The programme can be shaped around company culture, an annual theme, shared objectives or a specific event concept."],
            ["What does the quotation cover?", "The quotation itemises the programme design, staffing, materials and confirmed delivery scope for review."],
            ["What happens in bad weather?", "Outdoor programmes include an agreed weather contingency, such as rescheduling, an adjusted flow or a feasible indoor alternative."],
            ["What add-on services are available?", "Venue, catering, photo/video coverage and other event support can be quoted separately, subject to confirmation in the proposal."],
          ].map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })),
        },
      ],
    },
  },
  {
    dir: "about",
    // VERIFY: owner to confirm school count figure
    title: "關於JuntarHK｜香港學校攝影教育及 AI 課程專家",
    description:
      "JuntarHK 由攝影師兼教育工作者 Kingston Chan（KC）創辦，為香港中小學提供攝影教育、校園媒體及 AI 創作課程，同時提供歷奇及體驗學習活動。導師通過 SCRC 查核，附公眾責任保險及評估報告。",
    fallback: {
      h1: "關於 JuntarHK",
      intro:
        "JuntarHK 由攝影師兼教育工作者 Kingston Chan（KC）創辦。為香港中小學提供攝影教育、校園媒體及 AI 創作課程，以學生完成真實作品為核心目標。導師通過 SCRC 查核（如適用），附公眾責任保險。",
    },
    titleEn: "About JuntarHK | School Photography & AI Education Specialist in Hong Kong",
    descriptionEn:
      "JuntarHK was founded by photographer-educator Kingston Chan (KC) to deliver photography, school media and AI creation courses for Hong Kong schools. SCRC-checked instructors, public liability insurance and evaluation reports included.",
    fallbackEn: {
      h1: "About JuntarHK",
      intro:
        "JuntarHK was founded by photographer-educator Kingston Chan (KC). We provide photography education, school media and AI creation courses for Hong Kong primary and secondary schools — with SCRC-checked instructors and public liability insurance.",
    },
  },
  {
    dir: "partners",
    // VERIFY: owner to confirm school count figure
    title: "合作學校及機構｜香港中小學信賴 JuntarHK 攝影及 AI 教育課程",
    description:
      "JuntarHK 與香港多所幼稚園、小學、中學及社福機構合作，提供攝影教育、校園媒體及 AI 創作課程，以及歷奇及體驗學習活動。",
    fallback: {
      h1: "合作學校及機構",
      intro:
        "JuntarHK 與香港多所幼稚園、小學、中學及社福機構合作，提供攝影教育、AI 創作及歷奇訓練課程服務。",
    },
    titleEn: "Partner Schools & Organisations | JuntarHK Photography & AI Education",
    descriptionEn:
      "JuntarHK partners with Hong Kong kindergartens, primary and secondary schools and NGOs to deliver photography education, school media, AI creation and adventure learning programmes.",
    fallbackEn: {
      h1: "Partner Schools & Organisations",
      intro:
        "JuntarHK partners with Hong Kong kindergartens, primary and secondary schools and NGOs to deliver photography education, AI creation and adventure learning programmes.",
    },
  },
  {
    dir: "contact",
    title: "聯絡JuntarHK｜學校攝影及 AI 教育課程查詢",
    description:
      "歡迎香港幼稚園、小學、中學聯絡 JuntarHK 查詢攝影、影片製作、校園記者、校園電視台及 AI 創作課程。可按學校需要提供課程建議及報價。電話：+852 9728 9412。",
    fallback: {
      h1: "聯絡 JuntarHK",
      intro:
        "歡迎香港中小學聯絡我們查詢攝影教育、校園媒體及 AI 創作課程。電話 / WhatsApp：+852 9728 9412，電郵：info@juntarhk.com。",
    },
    titleEn: "Contact JuntarHK | School Photography & AI Education Enquiry",
    descriptionEn:
      "Contact JuntarHK for photography, video production, campus reporter, campus TV and AI creation courses for Hong Kong schools. Course proposals and quotations available. Call +852 9728 9412.",
    fallbackEn: {
      h1: "Contact JuntarHK",
      intro:
        "Hong Kong schools are welcome to contact us about photography education, school media and AI creation courses. Phone / WhatsApp: +852 9728 9412, email: info@juntarhk.com.",
    },
  },
  // Photography sub-pages
  {
    dir: "photography/mobile",
    title: "手機攝影及短片製作課程｜香港中小學｜JuntarHK",
    description: "JuntarHK 手機攝影及短片製作課程，適合香港小學至中學，4–8 節。學生以手機完成個人攝影作品集或主題短片，可按校本主題訂製。",
    fallback: { h1: "手機攝影及短片製作", intro: "JuntarHK 手機攝影及短片製作課程，適合香港小學至中學。學生以手機學習構圖、拍攝及剪接，完成個人攝影集或主題短片。" },
    titleEn: "Mobile Photography & Video Production Course | Hong Kong Schools | JuntarHK",
    descriptionEn: "JuntarHK mobile photography and short video course for Hong Kong primary to secondary schools, 4–8 sessions. Students complete a photo portfolio or themed short film using their own phones.",
    fallbackEn: { h1: "Mobile Photography & Short Video", intro: "JuntarHK mobile photography and short video course for Hong Kong schools. Students learn composition, shooting and editing on their phones to complete a portfolio or short film." },
    courseNameZh: "手機攝影及短片製作",
    courseNameEn: "Mobile Photography & Short Video Production",
  },
  {
    dir: "photography/video-production",
    title: "影片拍攝及剪接課程｜香港中小學｜JuntarHK",
    description: "JuntarHK 影片拍攝及剪接課程，適合香港小學至中學，4–8 節。學生從故事企劃到剪接完成校園主題短片，可按校本活動主題訂製。",
    fallback: { h1: "影片拍攝及剪接", intro: "JuntarHK 影片拍攝及剪接課程，適合香港中小學。由故事企劃、分鏡設計、現場拍攝到剪接輸出，完成校園主題短片。" },
    titleEn: "Video Production Course | Hong Kong Schools | JuntarHK",
    descriptionEn: "JuntarHK video production course for Hong Kong primary to secondary schools, 4–8 sessions. Students go from story planning to a finished school-themed short film.",
    fallbackEn: { h1: "Video Production", intro: "JuntarHK video production course for Hong Kong schools. From storyboarding and on-location shooting to editing and screening a campus short film." },
    courseNameZh: "影片拍攝及剪接",
    courseNameEn: "Video Production",
  },
  {
    dir: "photography/campus-reporter",
    title: "校園記者訓練課程｜香港中小學｜JuntarHK",
    description: "JuntarHK 校園記者訓練課程，適合香港小學至中學，6–12 節。學生學習新聞採訪、主播訓練及校園新聞短片製作，完成真實採訪報道。",
    fallback: { h1: "校園記者訓練", intro: "JuntarHK 校園記者訓練課程，適合香港中小學。學習採訪、撰稿、出鏡及製作校園新聞短片，完成真實可分享的採訪報道。" },
    titleEn: "Campus Reporter Training Course | Hong Kong Schools | JuntarHK",
    descriptionEn: "JuntarHK campus reporter training for Hong Kong primary to secondary schools, 6–12 sessions. Students learn news interviewing, anchor training and campus news video production.",
    fallbackEn: { h1: "Campus Reporter Training", intro: "JuntarHK campus reporter training for Hong Kong schools. Learn news interviewing, script writing, on-camera presenting and producing a campus news video." },
    courseNameZh: "校園記者訓練",
    courseNameEn: "Campus Reporter Training",
  },
  {
    dir: "photography/campus-tv",
    title: "校園電視台訓練課程｜香港中小學｜JuntarHK",
    description: "JuntarHK 校園電視台訓練課程，適合香港小學至中學，6–12 節。協助學校開辦校園電視台，包括節目策劃、主播訓練、拍攝及直播技術。",
    fallback: { h1: "校園電視台訓練", intro: "JuntarHK 校園電視台訓練課程，協助香港中小學建立校園電視台。由節目策劃、主播訓練、攝影到直播技術一站式訓練。" },
    titleEn: "Campus TV Training Course | Hong Kong Schools | JuntarHK",
    descriptionEn: "JuntarHK campus TV training for Hong Kong primary to secondary schools, 6–12 sessions. Help schools launch a campus TV station — programme planning, anchor training, shooting and live streaming.",
    fallbackEn: { h1: "Campus TV Training", intro: "JuntarHK campus TV training for Hong Kong schools. Launch a campus TV station with programme planning, anchor training, multi-camera shooting and live streaming." },
    courseNameZh: "校園電視台訓練",
    courseNameEn: "Campus TV Training",
  },
  // AI Education sub-pages
  {
    dir: "ai-education/animation",
    title: "AI 動畫創作課程｜香港中小學｜JuntarHK",
    description: "JuntarHK AI 動畫創作課程，適合香港小學至中學，4–8 節。學生以 AI 工具創作動畫短片或數碼故事，由構思到完成真實作品。",
    fallback: { h1: "AI 動畫創作", intro: "JuntarHK AI 動畫創作課程，適合香港中小學。學生用 AI 工具設計角色、生成場景，完成真實的動畫短片或數碼故事。" },
    titleEn: "AI Animation Production Course | Hong Kong Schools | JuntarHK",
    descriptionEn: "JuntarHK AI animation production course for Hong Kong primary to secondary schools, 4–8 sessions. Students use AI tools to create animation clips or digital stories.",
    fallbackEn: { h1: "AI Animation Production", intro: "JuntarHK AI animation production for Hong Kong schools. Students use AI tools to design characters, generate animated scenes and complete a real animation clip or digital story." },
    courseNameZh: "AI 動畫創作",
    courseNameEn: "AI Animation Production",
  },
  {
    dir: "ai-education/visual-storytelling",
    title: "AI 視覺故事課程｜香港中小學｜JuntarHK",
    description: "JuntarHK AI 視覺故事課程，適合香港小學至中學，4–6 節。學生以 AI 工具創作視覺故事，結合圖像、文字與創意，完成可分享的數碼故事作品。",
    fallback: { h1: "AI 視覺故事", intro: "JuntarHK AI 視覺故事課程，適合香港中小學。結合 AI 圖像生成與故事構思，讓學生以視覺語言說自己的故事。" },
    titleEn: "AI Visual Storytelling Course | Hong Kong Schools | JuntarHK",
    descriptionEn: "JuntarHK AI visual storytelling course for Hong Kong primary to secondary schools, 4–6 sessions. Students use AI tools to create visual stories combining images, text and creativity.",
    fallbackEn: { h1: "AI Visual Storytelling", intro: "JuntarHK AI visual storytelling for Hong Kong schools. Combine AI image generation with story ideas to create shareable visual stories." },
    courseNameZh: "AI 視覺故事",
    courseNameEn: "AI Visual Storytelling",
  },
  {
    dir: "ai-education/chinese-culture",
    title: "AI＋中華文化數碼故事課程｜香港中小學｜JuntarHK",
    description: "JuntarHK AI＋中華文化數碼故事課程，適合香港小學至中學，4–6 節。學生以 AI 工具重現中華文化故事及傳統藝術，可配合中史、常識或德育課題。",
    fallback: { h1: "AI＋中華文化數碼故事", intro: "JuntarHK AI＋中華文化數碼故事課程，適合香港中小學。用 AI 工具重現中華文化故事與傳統藝術，完成真實的數碼文化故事作品。" },
    titleEn: "AI & Chinese Culture Digital Story Course | Hong Kong Schools | JuntarHK",
    descriptionEn: "JuntarHK AI and Chinese culture digital story course for Hong Kong primary to secondary schools, 4–6 sessions. Students use AI tools to recreate Chinese cultural stories and traditional art.",
    fallbackEn: { h1: "AI & Chinese Culture Digital Story", intro: "JuntarHK AI and Chinese culture course for Hong Kong schools. Use AI tools to recreate Chinese cultural stories and traditional art, compatible with Chinese History or General Studies." },
    courseNameZh: "AI＋中華文化數碼故事",
    courseNameEn: "AI & Chinese Culture Digital Story",
  },
  {
    dir: "ai-education/teacher-training",
    title: "教師 AI 工作流培訓｜香港學校｜JuntarHK",
    description: "JuntarHK 教師 AI 工作流培訓，1–3 節，協助香港學校教師掌握 AI 備課工具及自動化行政工作流，可按科目或學校行政需要訂製。",
    fallback: { h1: "教師 AI 工作流培訓", intro: "JuntarHK 教師 AI 工作流培訓，協助香港學校教師掌握 AI 備課工具、教材設計及行政自動化工作流，節省時間專注教學。" },
    titleEn: "Teacher AI Productivity & Workflow Training | Hong Kong Schools | JuntarHK",
    descriptionEn: "JuntarHK teacher AI workflow training, 1–3 sessions. Help Hong Kong school teachers master AI lesson prep tools and automated admin workflows, customisable by subject or admin function.",
    fallbackEn: { h1: "Teacher AI Productivity & Workflow Training", intro: "JuntarHK teacher AI training for Hong Kong schools. Master AI lesson prep tools and automated admin workflows to save time and focus on teaching." },
    courseNameZh: "教師 AI 教材及行政工作流培訓",
    courseNameEn: "Teacher AI Productivity & Workflow Training",
  },
  {
    dir: "corporate-team-building",
    title: "香港企業Team Building及團隊培訓｜JuntarHK",
    description: "JuntarHK為香港企業提供度身訂造Team Building及團隊培訓，結合體驗式任務、專業引導及Debrief，支援小組至大型企業活動。",
    fallback: {
      h1: "唔止一日好玩，而係令團隊合作真正有改變",
      intro: "JuntarHK按企業目標、人數、場地及團隊狀況，設計體驗式Team Building。每個方案結合任務挑戰、專業引導及結構化Debrief。",
      bullets: [
        "大型及小組活動設計",
        "室內、戶外及場地合作方案",
        "主題活動＋專業Debrief",
        "按企業目標度身設計",
      ],
    },
    titleEn: "Corporate Team Building & Training Hong Kong | JuntarHK",
    descriptionEn: "JuntarHK designs tailored corporate team building and training in Hong Kong, combining experiential challenges, professional facilitation and structured debriefs for groups of different sizes.",
    fallbackEn: {
      h1: "More than a fun day — create real change in how your team works",
      intro: "JuntarHK designs experiential team building around your objectives, group size, venue and team dynamics, combining challenges, professional facilitation and structured debriefs.",
      bullets: [
        "Large-scale and small-group programme design",
        "Indoor, outdoor and venue-partner solutions",
        "Themed experiences with professional debriefs",
        "Tailored around corporate objectives",
      ],
    },
  },
  {
    dir: "case-studies",
    title: "學校案例｜JuntarHK 學校課程成果",
    description: "JuntarHK 與本港多所學校及機構合作，提供攝影、AI 教育及歷奇課程。閱讀我們的匿名學校案例，了解課程對學生的真實影響。",
    fallback: {
      h1: "學校合作案例",
      intro: "JuntarHK 與香港學校合作的真實課程成果。所有資料已匿名處理，以保障師生私隱。",
      bullets: [
        "校園電視台訓練課程 — 中學 — 學生完成校慶紀錄短片，於全校師生面前播放",
        "AI 動畫製作課程 — 小學 — 每位學生均完成原創 AI 動畫故事",
      ],
    },
    titleEn: "School Case Studies | JuntarHK School Programmes",
    descriptionEn: "JuntarHK works with Hong Kong schools across all levels. Read our anonymised school case studies to see the real impact of our programmes on students.",
    fallbackEn: {
      h1: "School Case Studies",
      intro: "Real programme outcomes from JuntarHK's school partnerships in Hong Kong. All details have been anonymised to protect student and staff privacy.",
      bullets: [
        "Campus TV Training — Secondary — students produced a school anniversary documentary screened school-wide",
        "AI Animation Production — Primary — every student completed an original AI animated story",
      ],
    },
  },
  // Case study detail pages — campus TV secondary school
  {
    dir: "case-studies/campus-tv-secondary",
    title: "校園電視台訓練課程 學校案例｜學生完成校慶紀錄短片｜JuntarHK",
    description: "某本港中學引入校園電視台訓練課程，逾30名學生完成校慶紀錄短片，並於全校師生面前播放。校方反映學生參與度、表達能力及自信心均有顯著進步。",
    fallback: {
      h1: "學生完成校慶紀錄短片，於全校師生面前播放",
      intro: "某本港中學引入校園電視台訓練課程，逾30名學生完成校慶紀錄短片，並於全校師生面前播放。所有資料已匿名處理。",
    },
    titleEn: "Campus TV Training Case Study — Anniversary Documentary Screened School-Wide | JuntarHK",
    descriptionEn: "A Hong Kong secondary school's campus TV programme resulted in 30+ students producing a school anniversary documentary screened to the whole school. Teachers reported significant gains in engagement, communication and confidence.",
    fallbackEn: {
      h1: "Students completed an anniversary documentary screened school-wide",
      intro: "A Hong Kong secondary school's campus TV training programme. Over 30 students produced an anniversary documentary screened to the whole school. All details anonymised.",
    },
  },
  // Case study detail pages — AI animation primary school
  {
    dir: "case-studies/ai-animation-primary",
    title: "AI 動畫製作課程 學校案例｜每位學生完成原創 AI 動畫故事｜JuntarHK",
    description: "某本港小學引入 AI 動畫製作課程，100% 學生在無繪畫基礎的情況下完成原創動畫短片，並於班內公開分享。班主任反映學生投入度極高。",
    fallback: {
      h1: "每位學生均完成原創 AI 動畫故事，並於班內公開分享",
      intro: "某本港小學引入 AI 動畫製作課程。100% 學生完成原創動畫短片，無需繪畫基礎。所有資料已匿名處理。",
    },
    titleEn: "AI Animation Production Case Study — Every Student Completed an Original Animation | JuntarHK",
    descriptionEn: "A Hong Kong primary school's AI animation programme achieved 100% completion — every student produced an original animated story with no drawing skills required. Teachers noted exceptionally high engagement.",
    fallbackEn: {
      h1: "Every student completed an original AI animation story and shared it with classmates",
      intro: "A Hong Kong primary school's AI animation production programme. 100% of students completed an original animated short — no drawing skills required. All details anonymised.",
    },
  },
  {
    dir: "programmes/campus-reporter-tv",
    title: "校園記者及校園電視台訓練｜JuntarHK",
    description: "校園記者及校園電視台訓練課程，適合小學至中學，6–12 節，學生完成校園新聞短片或採訪報道。",
    fallback: { h1: "校園記者及校園電視台訓練", intro: "校園記者及校園電視台訓練課程。" },
    titleEn: "Campus Reporter & Campus TV Training | JuntarHK",
    descriptionEn: "Campus reporter and campus TV training for primary to secondary schools, 6–12 sessions. Students complete a campus news clip or interview report.",
    fallbackEn: { h1: "Campus Reporter & Campus TV Training", intro: "Campus reporter and campus TV training programme." },
    courseNameZh: "校園記者及校園電視台訓練",
    courseNameEn: "Campus Reporter & Campus TV Training",
  },
  {
    dir: "programmes/mobile-photography-video",
    title: "手機攝影與短片製作｜JuntarHK",
    description: "手機攝影與短片製作課程，適合小學至中學，4–8 節，學生完成個人攝影作品集或主題短片。",
    fallback: { h1: "手機攝影與短片製作", intro: "手機攝影與短片製作課程。" },
    titleEn: "Mobile Photography & Short Video | JuntarHK",
    descriptionEn: "Mobile photography and short video production for primary to secondary schools, 4–8 sessions. Students complete a personal photo portfolio or themed short film.",
    fallbackEn: { h1: "Mobile Photography & Short Video", intro: "Mobile photography and short video programme." },
    courseNameZh: "手機攝影與短片製作",
    courseNameEn: "Mobile Photography & Short Video",
  },
  {
    dir: "programmes/basic-photography-visual-storytelling",
    title: "基礎攝影及視覺故事｜JuntarHK",
    description: "基礎攝影及視覺故事課程，適合小學至中學，4–6 節，學生完成攝影系列作品或故事相冊。",
    fallback: { h1: "基礎攝影及視覺故事", intro: "基礎攝影及視覺故事課程。" },
    titleEn: "Basic Photography & Visual Storytelling | JuntarHK",
    descriptionEn: "Basic photography and visual storytelling for primary to secondary schools, 4–6 sessions. Students complete a photography series or story photo album.",
    fallbackEn: { h1: "Basic Photography & Visual Storytelling", intro: "Basic photography and visual storytelling programme." },
    courseNameZh: "基礎攝影及視覺故事",
    courseNameEn: "Basic Photography & Visual Storytelling",
  },
  {
    dir: "programmes/ai-animation-production",
    title: "AI 動畫創作｜JuntarHK",
    description: "AI 動畫創作課程，適合小學至中學，4–8 節，學生完成 AI 動畫短片或數碼故事。",
    fallback: { h1: "AI 動畫創作", intro: "AI 動畫創作課程。" },
    titleEn: "AI Animation Production | JuntarHK",
    descriptionEn: "AI animation production for primary to secondary schools, 4–8 sessions. Students complete an AI animation clip or digital story.",
    fallbackEn: { h1: "AI Animation Production", intro: "AI animation production programme." },
    courseNameZh: "AI 動畫創作",
    courseNameEn: "AI Animation Production",
  },
  {
    dir: "programmes/ai-chinese-culture-digital-story",
    title: "AI＋中華文化數碼故事｜JuntarHK",
    description: "AI 與中華文化數碼故事課程，適合小學至中學，4–6 節，學生完成 AI 數碼故事或中華文化主題動畫。",
    fallback: { h1: "AI＋中華文化數碼故事", intro: "AI 與中華文化數碼故事課程。" },
    titleEn: "AI + Chinese Culture Digital Story | JuntarHK",
    descriptionEn: "AI and Chinese culture digital story programme for primary to secondary schools, 4–6 sessions. Students complete an AI digital story or Chinese culture animation.",
    fallbackEn: { h1: "AI + Chinese Culture Digital Story", intro: "AI and Chinese culture digital story programme." },
    courseNameZh: "AI＋中華文化數碼故事",
    courseNameEn: "AI + Chinese Culture Digital Story",
  },
  {
    dir: "programmes/teacher-ai-workflow",
    title: "教師 AI 教材及行政工作流｜JuntarHK",
    description: "教師 AI 教材及行政工作流培訓，1–3 節，助教師掌握 AI 備課工具及自動化工作流。",
    fallback: { h1: "教師 AI 教材及行政工作流", intro: "教師 AI 教材及行政工作流培訓課程。" },
    titleEn: "Teacher AI Productivity & Workflow | JuntarHK",
    descriptionEn: "Teacher AI productivity and workflow training, 1–3 sessions. Helps teachers master AI lesson prep tools and automated admin workflows.",
    fallbackEn: { h1: "Teacher AI Productivity & Workflow", intro: "Teacher AI productivity and workflow training programme." },
    courseNameZh: "教師 AI 教材及行政工作流培訓",
    courseNameEn: "Teacher AI Productivity & Workflow Training",
  },
];

// The corporate schemas are defined alongside the static route data above, then
// attached to the corporate route before rendering so they never leak onto the
// school catalogue page.
const activitiesRoute = staticRoutes.find((route) => route.dir === "activities");
const corporateRoute = staticRoutes.find((route) => route.dir === "corporate-team-building");
if (activitiesRoute && corporateRoute) {
  corporateRoute.extraJsonLdZh = activitiesRoute.extraJsonLdZh;
  corporateRoute.extraJsonLdEn = activitiesRoute.extraJsonLdEn;
  delete activitiesRoute.extraJsonLdZh;
  delete activitiesRoute.extraJsonLdEn;
}

/** Build a Course JSON-LD block for a programme page. */
function makeCourseSchema(name, description, url) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    url,
    provider: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "JuntarHK",
      url: BASE_URL,
    },
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
    },
  };
}

for (const r of staticRoutes) {
  const zhUrl = `${BASE_URL}/${r.dir}`;
  const enUrl = `${BASE_URL}/en/${r.dir}`;
  writePage(
    r.dir,
    buildPage({
      lang: "zh",
      title: r.title,
      description: r.description,
      canonical: zhUrl,
      hreflangZh: zhUrl,
      hreflangEn: enUrl,
      extraJsonLd: r.extraJsonLdZh ?? (r.courseNameZh
        ? makeCourseSchema(r.courseNameZh, r.description, zhUrl)
        : undefined),
      fallback: fallbackBody({ ...r.fallback, lang: "zh" }),
    }),
  );
  writePage(
    path.join("en", r.dir),
    buildPage({
      lang: "en",
      title: r.titleEn,
      description: r.descriptionEn,
      canonical: enUrl,
      hreflangZh: zhUrl,
      hreflangEn: enUrl,
      extraJsonLd: r.extraJsonLdEn ?? (r.courseNameEn
        ? makeCourseSchema(r.courseNameEn, r.descriptionEn, enUrl)
        : undefined),
      fallback: fallbackBody({ ...r.fallbackEn, lang: "en" }),
    }),
  );
}
console.log(`[prerender] wrote ${staticRoutes.length * 2} static route pages (zh + en)`);

// English home page (/en). The zh home is the built index.html shell as-is; the
// en home is templated here so /en is a real, crawlable English document.
// FAQPage mirrors the homepage "FAQ for Teachers"; keep in sync with the `en.home.faqs`
// entries in src/i18n/translations.ts (the zh FAQPage lives in index.html).
const EN_HOME_FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I book a photography or AI course for my school?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Browse our programmes on the website, then contact us via the Contact page or WhatsApp +852 9728 9412. We will respond within two working days to understand your school's needs and provide a course recommendation and quotation.",
      },
    },
    {
      "@type": "Question",
      name: "Can photography and AI courses be tailored to our school theme?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The programmes shown on our website are for reference only. Session count, difficulty, learning focus and student work theme can all be customised to match your school's development goals, school-based activity themes and students' grade level.",
      },
    },
    {
      "@type": "Question",
      name: "What will students produce at the end of the course?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every programme is built around students completing real, shareable work — including photography portfolios, themed short films, campus news interview clips, AI animation videos or AI digital stories. Schools can use these for exhibitions, school publications or social media.",
      },
    },
    {
      "@type": "Question",
      name: "Which grade levels are suitable?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our photography and AI courses are mainly designed for primary and secondary students. Some courses also suit upper kindergarten. Teacher AI training is designed for school staff. Content difficulty is adjusted based on participants' grade level.",
      },
    },
    {
      "@type": "Question",
      name: "How is pricing calculated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pricing depends on course type, number of sessions, class size and school requirements. After submitting an enquiry, we provide a free course recommendation and detailed quotation.",
      },
    },
    {
      "@type": "Question",
      name: "Can the courses support school funding applications?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We can provide curriculum proposals, learning outcomes, budget frameworks and evaluation templates to help schools plan relevant funding applications. Actual use and approval of funding is subject to the latest EDB guidelines and school-based procedures.",
      },
    },
  ],
};

writePage(
  "en",
  buildPage({
    lang: "en",
    title: "JuntarHK | School Photography, Campus TV & AI Education Courses",
    description:
      "JuntarHK provides photography, video production, campus reporter, campus TV and AI creation courses for Hong Kong schools. Tailored by grade level, sessions and school theme — from skills training to finished student work.",
    canonical: `${BASE_URL}/en`,
    hreflangZh: `${BASE_URL}/`,
    hreflangEn: `${BASE_URL}/en`,
    extraJsonLd: EN_HOME_FAQ_JSONLD,
    fallback: fallbackBody({
      lang: "en",
      h1: "Visual Storytelling and AI Education for Hong Kong Schools",
      intro:
        "JuntarHK provides photography, video production, campus reporter, campus TV and AI creation courses for Hong Kong primary and secondary schools. Every programme is built around students completing real, shareable work.",
      bullets: [
        "Photography & School Media — basic photography, mobile photography, campus reporter, campus TV",
        "AI Education — AI animation, AI visual storytelling, AI and Chinese culture, teacher AI workflow",
        "Adventure & Experiential Learning — rock climbing, giant ladder, rope courses, team building",
      ],
    }),
  }),
);
console.log("[prerender] wrote en/index.html (English home)");

// 404 page: noindex shell so crawlers do not index unknown URLs.
fs.writeFileSync(
  path.join(publicDir, "404.html"),
  buildPage({
    title: "找不到頁面 (404) | JuntarHK",
    description:
      "您要找的頁面不存在或已被移除。返回 JuntarHK 首頁，瀏覽我們為香港中小學提供的課外活動、野外歷險及 STEAM 課程。",
    canonical: `${BASE_URL}/404`,
    robots: "noindex, follow",
    fallback: fallbackBody({
      h1: "找不到此頁面",
      intro:
        "您要找的頁面可能已搬遷、改名或暫時無法存取。請返回首頁或瀏覽我們的課程目錄。",
    }),
  }),
  "utf8",
);
console.log("[prerender] wrote 404.html");

// ---------------------------------------------------------------------------
// Activity detail pages + live sitemap (requires DATABASE_URL). Optional.
// ---------------------------------------------------------------------------
function buildActivityPage(a, lang = "zh") {
  const isEn = lang === "en";
  const zhUrl = `${BASE_URL}/activities/${a.slug}`;
  const enUrl = `${BASE_URL}/en/activities/${a.slug}`;
  const canonical = isEn ? enUrl : zhUrl;
  const title = isEn
    ? (`${a.title_en || a.title}｜JuntarHK`)
    : (a.seo_title || `${a.title}｜JuntarHK`);
  const description = isEn
    ? ((a.description_en || a.description || "").slice(0, 160)).trim()
    : (a.seo_description || (a.description || "").slice(0, 160)).trim();
  const images = Array.isArray(a.images) ? a.images : [];
  const ogImage = a.image_url || (images[0] ? `${BASE_URL}${images[0]}` : DEFAULT_OG_IMAGE);
  const targetGroup = Array.isArray(a.target_group) ? a.target_group : [];
  const levelMap = { kindergarten: "Kindergarten", primary: "Primary School", secondary: "Secondary School" };

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": canonical,
    name: isEn ? (a.title_en || a.title) : a.title,
    description: (isEn ? (a.description_en || a.description || "") : (a.description || "")).slice(0, 500),
    url: canonical,
    provider: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "JuntarHK",
      url: BASE_URL,
    },
    ...(ogImage ? { image: ogImage } : {}),
    inLanguage: ["zh-HK", "en-HK"],
    educationalLevel: targetGroup.map((g) => levelMap[g] ?? g),
    courseMode: "onsite",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      location: {
        "@type": "Place",
        name: a.location_en || a.location,
        address: { "@type": "PostalAddress", addressCountry: "HK" },
      },
    },
  };

  const bullets = [];
  if (isEn) {
    const catEn = a.category_name;
    if (catEn) bullets.push(`Category: ${catEn}`);
    if (a.duration_en || a.duration) bullets.push(`Duration: ${a.duration_en || a.duration}`);
    if (a.location_en || a.location) bullets.push(`Location: ${a.location_en || a.location}`);
  } else {
    if (a.category_name) bullets.push(`類別：${a.category_name}`);
    if (a.duration) bullets.push(`活動時長：${a.duration}`);
    if (a.location) bullets.push(`地點：${a.location}`);
  }

  return buildPage({
    lang,
    title,
    description,
    canonical,
    hreflangZh: zhUrl,
    hreflangEn: enUrl,
    ogImage,
    extraJsonLd: courseJsonLd,
    fallback: fallbackBody({
      lang,
      h1: isEn ? (a.title_en || a.title) : a.title,
      intro: (isEn ? (a.description_en || a.description || "") : (a.description || "")).slice(0, 240),
      bullets,
    }),
  });
}

function xmlUrl(loc, priority, changefreq, lastmod, alternates) {
  const alt = alternates
    ? alternates
        .map((x) => `\n    <xhtml:link rel="alternate" hreflang="${x.hreflang}" href="${x.href}" />`)
        .join("")
    : "";
  return `  <url>\n    <loc>${BASE_URL}${loc}</loc>${alt}\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

/**
 * Emit both the zh and en <url> entries for a bilingual page, each carrying the
 * full reciprocal hreflang alternate set (zh-HK, en-HK, x-default).
 */
function xmlUrlPair(zhLoc, enLoc, priority, changefreq, lastmod) {
  const alternates = [
    { hreflang: "zh-HK", href: `${BASE_URL}${zhLoc}` },
    { hreflang: "en-HK", href: `${BASE_URL}${enLoc}` },
    { hreflang: "x-default", href: `${BASE_URL}${zhLoc}` },
  ];
  return [
    xmlUrl(zhLoc, priority, changefreq, lastmod, alternates),
    xmlUrl(enLoc, priority, changefreq, lastmod, alternates),
  ];
}

async function prerenderFromDb() {
  if (!process.env.DATABASE_URL) {
    console.warn("[prerender] DATABASE_URL not set — skipping activity detail pages and live sitemap. Static routes and existing sitemap.xml are unchanged.");
    return;
  }

  let pg;
  try {
    pg = (await import("pg")).default;
  } catch (err) {
    console.warn("[prerender] 'pg' module unavailable — skipping DB-backed prerender.", err?.message);
    return;
  }

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const { rows: activities } = await pool.query(
      `SELECT a.slug, a.title, a.title_en, a.description, a.description_en,
              a.duration, a.duration_en, a.location, a.location_en,
              a.image_url, a.images,
              a.target_group, a.created_at, a.seo_title, a.seo_description,
              c.name AS category_name, c.slug AS category_slug
         FROM activities a
         LEFT JOIN categories c ON a.category_id = c.id
        WHERE a.slug IS NOT NULL
        ORDER BY a.sort_order ASC, a.id ASC`,
    );
    const { rows: categories } = await pool.query(
      `SELECT slug FROM categories WHERE slug IS NOT NULL ORDER BY id ASC`,
    );

    // Only accept URL-safe slugs so generated file paths and URLs can never be
    // manipulated by malformed/attacker-controlled catalogue data.
    const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;
    const validActivities = activities.filter((a) => {
      if (SLUG_RE.test(a.slug)) return true;
      console.warn(`[prerender] skipping activity with unsafe slug: ${JSON.stringify(a.slug)}`);
      return false;
    });

    for (const a of validActivities) {
      writePage(path.join("activities", a.slug), buildActivityPage(a, "zh"));
      writePage(path.join("en", "activities", a.slug), buildActivityPage(a, "en"));
    }
    console.log(`[prerender] wrote ${validActivities.length * 2} activity detail pages (zh + en)`);

    // Manifest signals to the server that DB-backed prerender succeeded, so it
    // may enforce real 404s for unknown slugs. Without it, the server serves the
    // SPA shell (200) for detail routes so pages keep working after a DB-less build.
    fs.writeFileSync(
      path.join(publicDir, "prerender-manifest.json"),
      JSON.stringify({ generatedAt: new Date().toISOString(), slugs: validActivities.map((a) => a.slug) }),
      "utf8",
    );

    const today = new Date().toISOString().split("T")[0];
    const staticUrls = [
      ...xmlUrlPair("/", "/en", "1.0", "weekly", today),
      ...xmlUrlPair("/activities", "/en/activities", "0.9", "weekly", today),
      ...xmlUrlPair("/about", "/en/about", "0.7", "monthly", today),
      ...xmlUrlPair("/partners", "/en/partners", "0.7", "monthly", today),
      ...xmlUrlPair("/contact", "/en/contact", "0.8", "monthly", today),
      ...xmlUrlPair("/corporate-team-building", "/en/corporate-team-building", "0.8", "monthly", today),
      ...xmlUrlPair("/photography/mobile", "/en/photography/mobile", "0.8", "monthly", today),
      ...xmlUrlPair("/photography/video-production", "/en/photography/video-production", "0.8", "monthly", today),
      ...xmlUrlPair("/photography/campus-reporter", "/en/photography/campus-reporter", "0.8", "monthly", today),
      ...xmlUrlPair("/photography/campus-tv", "/en/photography/campus-tv", "0.8", "monthly", today),
      ...xmlUrlPair("/ai-education/animation", "/en/ai-education/animation", "0.8", "monthly", today),
      ...xmlUrlPair("/ai-education/visual-storytelling", "/en/ai-education/visual-storytelling", "0.8", "monthly", today),
      ...xmlUrlPair("/ai-education/chinese-culture", "/en/ai-education/chinese-culture", "0.8", "monthly", today),
      ...xmlUrlPair("/ai-education/teacher-training", "/en/ai-education/teacher-training", "0.8", "monthly", today),
      ...xmlUrlPair("/case-studies", "/en/case-studies", "0.7", "monthly", today),
      ...xmlUrlPair("/case-studies/campus-tv-secondary", "/en/case-studies/campus-tv-secondary", "0.6", "monthly", today),
      ...xmlUrlPair("/case-studies/ai-animation-primary", "/en/case-studies/ai-animation-primary", "0.6", "monthly", today),
    ];
    // Only include category filter URLs for slugs that are active in the
    // current DB and served by the site's navigation chips. Retired slugs
    // (e.g. outdoor-activities, emerging-sports, ecology-exploration,
    // global-cultural-experience, financial-literacy-career-planning) must
    // not appear in the sitemap even if a stale row still exists in the DB.
    const ACTIVE_CATEGORY_SLUGS = new Set([
      "visual-media-creation",
      "ai-campus-courses",
      "chinese-cultural-activities",
      "adventure-training",
    ]);
    const categoryUrls = categories
      .filter((c) => ACTIVE_CATEGORY_SLUGS.has(c.slug))
      .map((c) => xmlUrl(`/activities?category=${encodeURIComponent(c.slug)}`, "0.8", "weekly", today));
    const activityUrls = validActivities.flatMap((a) => {
      const lastmod = a.created_at ? new Date(a.created_at).toISOString().split("T")[0] : today;
      return xmlUrlPair(`/activities/${a.slug}`, `/en/activities/${a.slug}`, "0.7", "monthly", lastmod);
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...staticUrls, ...categoryUrls, ...activityUrls].join("\n")}
</urlset>`;
    fs.writeFileSync(path.join(publicDir, "sitemap.xml"), xml, "utf8");
    console.log(`[prerender] regenerated sitemap.xml (${staticUrls.length + categoryUrls.length + activityUrls.length} URLs)`);
  } catch (err) {
    console.warn("[prerender] DB-backed prerender failed — keeping static routes and existing sitemap.xml.", err?.message);
  } finally {
    await pool.end().catch(() => {});
  }
}

/**
 * Inject admin-set (or code-default) stat values into both home page fallback
 * bodies so crawlers see real numbers rather than a stat-less #root.
 *
 * Always runs — regardless of whether DATABASE_URL is set or the activity
 * prerender succeeded. Tries a lightweight DB query for admin overrides; falls
 * back to hardcoded code defaults if the DB is unavailable or the query fails.
 * Each write step is guarded individually so a partial failure never silently
 * leaves one locale patched and the other not.
 */
async function injectHomeStatFallbacks() {
  // Code defaults — must match the fallbacks in SocialProofRow.tsx / TrustSection.tsx
  const statValues = {
    schoolsServed:      "多所",
    activityProgrammes: "400+",
    experienceYears:    "10+",
    campsiteSqft:       "80,000",
  };

  // Best-effort: override with admin-set values from DB
  if (process.env.DATABASE_URL) {
    let pg2;
    try {
      pg2 = (await import("pg")).default;
      const statPool = new pg2.Pool({ connectionString: process.env.DATABASE_URL });
      try {
        const { rows } = await statPool.query(
          `SELECT key, value FROM app_settings WHERE key LIKE 'stat_%'`,
        );
        for (const r of rows) {
          if (r.value) {
            if (r.key === "stat_schools_served")      statValues.schoolsServed      = r.value;
            if (r.key === "stat_activity_programmes") statValues.activityProgrammes = r.value;
            if (r.key === "stat_experience_years")    statValues.experienceYears    = r.value;
            if (r.key === "stat_campsite_sqft")       statValues.campsiteSqft       = r.value;
          }
        }
        console.log("[prerender] stat values resolved:", JSON.stringify(statValues));
      } finally {
        await statPool.end().catch(() => {});
      }
    } catch (err) {
      console.warn("[prerender] stat DB query failed — using code defaults.", err?.message);
    }
  }

  // ── Patch zh home (dist/public/index.html) ────────────────────────────────
  // The Vite build output is served as-is for the zh locale. We replace its
  // #root fallback body so crawlers see the current stat values.
  try {
    const zhIndexPath = path.join(publicDir, "index.html");
    const zhIndexHtml = fs.readFileSync(zhIndexPath, "utf8");
    const zhFallback = fallbackBody({
      lang: "zh",
      h1: "JuntarHK — 學校攝影、校園媒體及 AI 教育課程",
      intro: "JuntarHK 為香港學校提供攝影教育、校園媒體及 AI 創作課程，包括校園電視台、手機攝影、AI動畫等，由技能訓練到完成學生作品。",
      bullets: [
        `${statValues.schoolsServed} 香港學校及機構`,
        `${statValues.activityProgrammes} 課程及活動項目`,
        `${statValues.experienceYears} 年攝影及教育經驗`,
        `${statValues.campsiteSqft} sq.ft. 戶外營地`,
        "影像及校園媒體 — 基礎攝影、手機攝影、校園記者、校園電視台",
        "AI 教育及創作 — AI 動畫、AI 視覺故事、AI 中華文化、教師 AI 培訓",
      ],
    });
    const homeRootRe = /(<div id="root">)[\s\S]*?(<\/div>)([\s\S]*?<\/body>)/;
    if (homeRootRe.test(zhIndexHtml)) {
      fs.writeFileSync(
        zhIndexPath,
        zhIndexHtml.replace(homeRootRe, `$1\n${zhFallback}\n    $2$3`),
        "utf8",
      );
      console.log("[prerender] patched zh home #root with stat values");
    } else {
      console.warn("[prerender] zh home #root not found — fallback not patched");
    }
  } catch (err) {
    console.warn("[prerender] zh home stat patch failed.", err?.message);
  }

  // ── Re-write en home (dist/public/en/index.html) ──────────────────────────
  // The stat-less version was already written synchronously above. Overwrite it
  // now that we have the resolved stat values.
  try {
    writePage(
      "en",
      buildPage({
        lang: "en",
        title: "JuntarHK | School Photography, Campus TV & AI Education Courses",
        description:
          "JuntarHK provides photography, video production, campus reporter, campus TV and AI creation courses for Hong Kong schools. Tailored by grade level, sessions and school theme — from skills training to finished student work.",
        canonical: `${BASE_URL}/en`,
        hreflangZh: `${BASE_URL}/`,
        hreflangEn: `${BASE_URL}/en`,
        extraJsonLd: EN_HOME_FAQ_JSONLD,
        fallback: fallbackBody({
          lang: "en",
          h1: "Visual Storytelling and AI Education for Hong Kong Schools",
          intro:
            "JuntarHK provides photography, video production, campus reporter, campus TV and AI creation courses for Hong Kong primary and secondary schools. Every programme is built around students completing real, shareable work.",
          bullets: [
            `${statValues.schoolsServed} Hong Kong schools & organisations served`,
            `${statValues.activityProgrammes} programmes and activities`,
            `${statValues.experienceYears} years photography & education experience`,
            `${statValues.campsiteSqft} sq.ft. outdoor campsite`,
            "Photography & School Media — basic photography, mobile photography, campus reporter, campus TV",
            "AI Education — AI animation, AI visual storytelling, AI and Chinese culture, teacher AI workflow",
            "Adventure & Experiential Learning — rock climbing, giant ladder, rope courses, team building",
          ],
        }),
      }),
    );
    console.log("[prerender] re-wrote en home #root with stat values");
  } catch (err) {
    console.warn("[prerender] en home stat write failed.", err?.message);
  }
}

await prerenderFromDb();
await injectHomeStatFallbacks();
console.log("[prerender] done");
