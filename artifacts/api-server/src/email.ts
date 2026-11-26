import nodemailer from "nodemailer";

const GMAIL_USER = process.env.GMAIL_USER ?? "info@juntarhk.com";
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

function getTransporter() {
  if (!GMAIL_APP_PASSWORD) return null;
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });
}

const SCHOOL_TYPE_LABELS: Record<string, string> = {
  kindergarten: "幼稚園",
  primary: "小學",
  secondary: "中學",
  university: "大學/專上院校",
  ngo: "非牟利機構",
  company: "企業/機構",
  other: "其他",
};

export async function sendEnquiryNotification(enquiry: {
  schoolName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  schoolType: string;
  message: string;
  activityInterest?: string | null;
  activityCategory?: string | null;
  plannedDate?: string | null;
  plannedParticipants?: string | null;
  createdAt: Date;
}, recipientOverride?: string) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[email] GMAIL_APP_PASSWORD not set — skipping email notification");
    return;
  }
  const recipient = recipientOverride || GMAIL_USER;

  const schoolTypeLabel = SCHOOL_TYPE_LABELS[enquiry.schoolType] ?? enquiry.schoolType;
  const date = new Date(enquiry.createdAt).toLocaleString("zh-HK", {
    timeZone: "Asia/Hong_Kong",
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: sans-serif; background: #f4f1ec; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
    <div style="background: #1A3D4A; padding: 24px 28px;">
      <h1 style="color: white; margin: 0; font-size: 20px;">📬 新查詢通知</h1>
      <p style="color: rgba(255,255,255,0.6); margin: 4px 0 0; font-size: 13px;">JuntarHK 課外活動平台 · ${date}</p>
    </div>
    <div style="padding: 24px 28px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; color: #666; width: 120px;">學校名稱</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; font-weight: 600; color: #1A3D4A;">${enquiry.schoolName}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; color: #666;">學校類型</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; color: #333;">${schoolTypeLabel}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; color: #666;">聯絡人</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; color: #333;">${enquiry.contactName}</td>
        </tr>
        ${enquiry.contactEmail ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; color: #666;">電郵</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8;"><a href="mailto:${enquiry.contactEmail}" style="color: #1A3D4A;">${enquiry.contactEmail}</a></td>
        </tr>` : ""}
        ${enquiry.contactPhone ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; color: #666;">電話</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8;"><a href="tel:${enquiry.contactPhone}" style="color: #1A3D4A;">${enquiry.contactPhone}</a></td>
        </tr>` : ""}
        ${enquiry.activityInterest ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; color: #666;">感興趣活動</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; color: #E8A020; font-weight: 500;">${enquiry.activityInterest}</td>
        </tr>` : ""}
        ${enquiry.activityCategory ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; color: #666;">活動類別</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; color: #333;">${enquiry.activityCategory}</td>
        </tr>` : ""}
        ${enquiry.plannedDate ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; color: #666;">計劃活動時間</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; color: #333;">${enquiry.plannedDate}</td>
        </tr>` : ""}
        ${enquiry.plannedParticipants ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; color: #666;">計劃人數</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; color: #333;">${enquiry.plannedParticipants} 人</td>
        </tr>` : ""}
      </table>
      <div style="margin-top: 20px;">
        <p style="color: #666; font-size: 13px; margin-bottom: 8px;">查詢內容：</p>
        <div style="background: #f8f6f2; border-radius: 10px; padding: 16px; font-size: 14px; color: #333; line-height: 1.6; white-space: pre-wrap;">${enquiry.message}</div>
      </div>
      <div style="margin-top: 20px; text-align: center;">
        <a href="https://${process.env.REPLIT_DOMAINS ?? ""}/admin" style="display: inline-block; background: #1A3D4A; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600;">查看所有查詢 →</a>
      </div>
    </div>
    <div style="padding: 16px 28px; background: #f8f6f2; text-align: center;">
      <p style="color: #aaa; font-size: 11px; margin: 0;">JuntarHK 課外活動平台 · info@juntarhk.com · +852 9728 9412</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"JuntarHK 平台" <${GMAIL_USER}>`,
    to: recipient,
    subject: `📬 新查詢：${enquiry.schoolName} — ${enquiry.contactName}`,
    html,
  });

  console.log(`[email] Notification sent for enquiry from ${enquiry.schoolName}`);
}

export async function sendEnquiryAutoReply(enquiry: {
  contactName: string;
  contactEmail: string;
  schoolName: string;
  message: string;
}) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[email] GMAIL_APP_PASSWORD not set — skipping auto-reply");
    return;
  }

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: sans-serif; background: #f4f1ec; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
    <div style="background: #1A3D4A; padding: 24px 28px;">
      <h1 style="color: white; margin: 0; font-size: 20px;">感謝您的查詢</h1>
      <p style="color: rgba(255,255,255,0.6); margin: 4px 0 0; font-size: 13px;">JuntarHK 課外活動平台</p>
    </div>
    <div style="padding: 24px 28px; font-size: 14px; color: #333; line-height: 1.8;">
      <p>親愛的 ${enquiry.contactName}，</p>
      <p>感謝您聯絡 JuntarHK！我們已成功收到您來自 <strong>${enquiry.schoolName}</strong> 的查詢。</p>
      <p>我們的團隊將盡快與您跟進，請耐心等候。</p>
      <div style="margin: 20px 0; background: #f8f6f2; border-radius: 10px; padding: 16px;">
        <p style="color: #666; font-size: 13px; margin: 0 0 8px;">您的查詢內容：</p>
        <p style="margin: 0; white-space: pre-wrap;">${enquiry.message}</p>
      </div>
      <p>如有任何查詢，請隨時聯絡我們：</p>
      <p>
        📧 <a href="mailto:info@juntarhk.com" style="color: #1A3D4A;">info@juntarhk.com</a><br>
        📞 +852 9728 9412
      </p>
      <p style="margin-top: 24px;">祝您生活愉快！<br><strong>JuntarHK 團隊</strong></p>
    </div>
    <div style="padding: 16px 28px; background: #f8f6f2; text-align: center;">
      <p style="color: #aaa; font-size: 11px; margin: 0;">JuntarHK 課外活動平台 · info@juntarhk.com · +852 9728 9412</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"JuntarHK 平台" <${GMAIL_USER}>`,
    to: enquiry.contactEmail,
    subject: `感謝您的查詢 — JuntarHK`,
    html,
  });

  console.log(`[email] Auto-reply sent to ${enquiry.contactEmail}`);
}
