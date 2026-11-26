/**
 * Central source of truth for all verified business facts and approved copy strings.
 * Import from this file instead of hard-coding values across components.
 *
 * Lines marked // OWNER VERIFICATION REQUIRED must be confirmed by the business owner
 * before the next public deployment. Use the conservative figure until confirmed.
 */

// ─── Business identity ────────────────────────────────────────────────────────

export const FOUNDER_NAME = "Kingston Chan (KC)";
export const FOUNDING_YEAR = 2023;

/**
 * KC's personal experience in photography and education.
 * OWNER VERIFICATION REQUIRED: confirm exact number of years.
 * Using conservative 10+ until confirmed.
 */
export const FOUNDER_EXPERIENCE_YEARS = "10+"; // OWNER VERIFICATION REQUIRED

/**
 * Schools and organisations served since founding.
 * Displayed as a non-numeric stat until the exact figure is owner-verified.
 */
export const SCHOOLS_SERVED = "多所"; // replace with verified figure when confirmed

// ─── Contact details ─────────────────────────────────────────────────────────

export const PHONE = "+852 9728 9412";
export const PHONE_RAW = "85297289412";
export const WHATSAPP_URL = `https://wa.me/${PHONE_RAW}`;
export const EMAIL = "info@juntarhk.com";
export const ADDRESS_ZH =
  "香港九龍尖沙咀柯士甸路7-9號\n煥利商業大廈7樓79室";
export const ADDRESS_EN =
  "Unit 79, 7/F, Woon Lee Commercial Building,\n7-9 Austin Avenue, Tsim Sha Tsui, Kowloon, Hong Kong";

// ─── Approved CTA labels ─────────────────────────────────────────────────────

/** Primary action — request a tailored course proposal */
export const CTA_PRIMARY_ZH = "索取課程建議";
export const CTA_PRIMARY_EN = "Request a Course Proposal";

/** Secondary action — browse or view programmes */
export const CTA_SECONDARY_ZH = "查看課程";
export const CTA_SECONDARY_EN = "View Programmes";

/** Instant contact via WhatsApp */
export const CTA_WHATSAPP_ZH = "WhatsApp 查詢";
export const CTA_WHATSAPP_EN = "WhatsApp Us";

// ─── Approved funding disclaimer ─────────────────────────────────────────────

/**
 * Use this exact wording wherever LWLF / QEF funding is mentioned.
 * Do NOT claim automatic eligibility.
 */
export const FUNDING_DISCLAIMER_ZH =
  "可按學校發展需要提供課程建議、學習成果、預算及評估框架，協助學校規劃相關撥款項目。實際撥款用途及審批須以教育局最新指引及校本程序為準。";
export const FUNDING_DISCLAIMER_EN =
  "We can provide curriculum proposals, learning outcome frameworks and budget estimates to help schools plan funding applications. Actual use and approval of funding is subject to the latest EDB guidelines and school-based procedures.";
