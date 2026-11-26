export interface CorporateCase {
  slug: string;
  internalName: string;
  publicTitleZh: string;
  publicTitleEn: string;
  clientName: string;
  clientApproved: boolean;
  logoApproved: boolean;
  imageApproved: boolean;
  scaleApproved: boolean;
  date: string;
  participantRange: string;
  venue: { zh: string; en: string };
  category: { zh: string; en: string };
  challenge: { zh: string; en: string }[];
  solution: { zh: string; en: string }[];
  activities: { zh: string; en: string }[];
  outcomes: { zh: string; en: string }[];
  image: string;
  images?: string[];
  imageAlt: { zh: string; en: string };
}

export const corporateCases: CorporateCase[] = [
  {
    slug: "financial-f1-teambuilding",
    internalName: "private-case-001",
    publicTitleZh: "金融企業F1主題Team Building",
    publicTitleEn: "Financial Enterprise F1 Themed Team Building",
    clientName: "",
    clientApproved: false,
    logoApproved: false,
    imageApproved: true,
    scaleApproved: false,
    date: "",
    participantRange: "",
    venue: { zh: "大型室內場地", en: "Large Indoor Venue" },
    category: { zh: "大型企業培訓", en: "Large-Scale Corporate Training" },
    challenge: [],
    solution: [],
    activities: [
      { zh: "F1賽車工程挑戰", en: "F1 Racing Engineering Challenge" },
      { zh: "跨部門分工協作", en: "Cross-Departmental Collaboration" },
      { zh: "團隊競速賽", en: "Team Racing Competition" }
    ],
    outcomes: [],
    image: "/corporate-cases/f1-1.webp",
    images: [
      "/corporate-cases/f1-1.webp",
      "/corporate-cases/f1-2.webp",
      "/corporate-cases/f1-3.webp",
      "/corporate-cases/f1-4.webp",
      "/corporate-cases/f1-5.webp",
      "/corporate-cases/f1-6.webp"
    ],
    imageAlt: { zh: "大型室內企業培訓活動", en: "Large-scale indoor corporate training event" }
  },
  {
    slug: "chamber-moving-machine",
    internalName: "private-case-002",
    publicTitleZh: "商會會員協作及Moving Machine Power Day",
    publicTitleEn: "Chamber Member Collaboration & Moving Machine Power Day",
    clientName: "",
    clientApproved: false,
    logoApproved: false,
    imageApproved: true,
    scaleApproved: false,
    date: "",
    participantRange: "",
    venue: { zh: "待定", en: "Pending" },
    category: { zh: "會員協作日", en: "Member Collaboration Day" },
    challenge: [],
    solution: [],
    activities: [
      { zh: "Moving Machine 骨牌效應挑戰", en: "Moving Machine Domino Effect Challenge" },
      { zh: "策略解難任務", en: "Strategic Problem Solving" }
    ],
    outcomes: [],
    image: "/corporate-cases/moving-machine-1.webp",
    images: [
      "/corporate-cases/moving-machine-1.webp",
      "/corporate-cases/moving-machine-2.webp",
      "/corporate-cases/moving-machine-3.webp",
      "/corporate-cases/moving-machine-4.webp"
    ],
    imageAlt: { zh: "團隊解難與協作活動", en: "Team problem solving and collaboration activity" }
  },
  {
    slug: "financial-mindfulness-outdoor",
    internalName: "private-case-003",
    publicTitleZh: "金融機構正念及戶外團隊體驗日",
    publicTitleEn: "Financial Institution Mindfulness & Outdoor Team Experience Day",
    clientName: "",
    clientApproved: false,
    logoApproved: false,
    imageApproved: true,
    scaleApproved: false,
    date: "",
    participantRange: "",
    venue: { zh: "戶外夥伴場地", en: "Outdoor Partner Venue" },
    category: { zh: "身心健康與凝聚", en: "Wellness & Cohesion" },
    challenge: [],
    solution: [],
    activities: [
      { zh: "正念體驗與減壓", en: "Mindfulness & De-stress Experience" },
      { zh: "戶外團隊任務", en: "Outdoor Team Tasks" }
    ],
    outcomes: [],
    image: "/corporate-cases/mindfulness-outdoor-1.webp",
    images: [
      "/corporate-cases/mindfulness-outdoor-1.webp",
      "/corporate-cases/mindfulness-outdoor-2.webp",
      "/corporate-cases/mindfulness-outdoor-3.webp",
      "/corporate-cases/mindfulness-outdoor-4.webp",
      "/corporate-cases/mindfulness-outdoor-5.webp",
      "/corporate-cases/mindfulness-outdoor-6.webp"
    ],
    imageAlt: { zh: "戶外正念與團隊活動", en: "Outdoor mindfulness and team activity" }
  },
  {
    slug: "partnership-innovative-experience",
    internalName: "private-case-004",
    publicTitleZh: "企業聯乘創新主題體驗",
    publicTitleEn: "Corporate Partnership Innovative Themed Experience",
    clientName: "",
    clientApproved: false,
    logoApproved: false,
    imageApproved: true,
    scaleApproved: false,
    date: "Pending",
    participantRange: "Custom",
    venue: { zh: "室內遊樂體驗館", en: "Indoor Entertainment Venue" },
    category: { zh: "創新體驗培訓", en: "Innovative Experiential Training" },
    challenge: [],
    solution: [],
    activities: [
      { zh: "沉浸式實境挑戰", en: "Immersive Reality Challenges" },
      { zh: "主題任務解謎", en: "Themed Mission Solving" }
    ],
    outcomes: [],
    image: "/corporate-cases/partnership-innovative-1.webp",
    images: [
      "/corporate-cases/partnership-innovative-1.webp",
      "/corporate-cases/partnership-innovative-2.webp",
      "/corporate-cases/partnership-innovative-3.webp",
      "/corporate-cases/partnership-innovative-4.webp",
      "/corporate-cases/partnership-innovative-5.webp"
    ],
    imageAlt: { zh: "室內創新體驗活動", en: "Indoor innovative experience activity" }
  },
  {
    slug: "brand-creative-racing",
    internalName: "private-case-005",
    publicTitleZh: "跨國品牌創意賽車協作日",
    publicTitleEn: "Multinational Brand Creative Racing Collaboration Day",
    clientName: "",
    clientApproved: false,
    logoApproved: false,
    imageApproved: true,
    scaleApproved: false,
    date: "Pending",
    participantRange: "Custom",
    venue: { zh: "客製化場地", en: "Custom Venue" },
    category: { zh: "創意與解難", en: "Creativity & Problem Solving" },
    challenge: [],
    solution: [],
    activities: [
      { zh: "創意賽車設計與製作", en: "Creative Racing Car Design & Production" },
      { zh: "團隊資源管理", en: "Team Resource Management" }
    ],
    outcomes: [],
    image: "/corporate-cases/creative-racing-1.webp",
    images: [
      "/corporate-cases/creative-racing-1.webp",
      "/corporate-cases/creative-racing-2.webp",
      "/corporate-cases/creative-racing-3.webp",
      "/corporate-cases/creative-racing-4.webp",
      "/corporate-cases/creative-racing-5.webp"
    ],
    imageAlt: { zh: "團隊創意製作與競賽", en: "Team creative production and competition" }
  },
  {
    slug: "fb-team-cohesion",
    internalName: "private-case-006",
    publicTitleZh: "餐飲團隊凝聚與服務升級工作坊",
    publicTitleEn: "F&B Team Cohesion & Service Upgrade Workshop",
    clientName: "",
    clientApproved: false,
    logoApproved: false,
    imageApproved: true,
    scaleApproved: false,
    date: "Pending",
    participantRange: "Custom",
    venue: { zh: "室內培訓空間", en: "Indoor Training Space" },
    category: { zh: "行業專屬培訓", en: "Industry-Specific Training" },
    challenge: [],
    solution: [],
    activities: [
      { zh: "團隊角色模擬", en: "Team Role Simulation" },
      { zh: "服務優化引導反思", en: "Service Optimization Debriefing" }
    ],
    outcomes: [],
    image: "/corporate-cases/fb-team-cohesion-1.webp",
    images: [
      "/corporate-cases/fb-team-cohesion-1.webp",
      "/corporate-cases/fb-team-cohesion-2.webp",
      "/corporate-cases/fb-team-cohesion-3.webp"
    ],
    imageAlt: { zh: "團隊凝聚與服務工作坊", en: "Team cohesion and service workshop" }
  }
];