/**
 * Canonical programme tag data — single source of truth for searchable
 * taxonomy tags used by the JuntarHK programme catalogue.
 *
 * This module is consumed by:
 *   - artifacts/activity-platform  (frontend, sets `tags` on each Programme)
 *   - artifacts/api-server          (backend, syncs `tags` column in the DB on startup)
 *
 * MAINTENANCE: to add or rename a tag, change only this file.
 * The frontend picks up the new value at build time; the api-server
 * writes it to the DB on the next startup or via POST /api/admin/sync-programme-tags.
 *
 * Slugs without an entry here have no tags (empty array by default).
 */
export const PROGRAMME_TAGS: Record<string, string[]> = {
  "campus-reporter-tv":               ["校園記者", "校園電視台", "影片製作", "採訪"],
  "mobile-photography-video":         ["手機攝影", "影片製作", "攝影作品集"],
  "ai-animation-production":          ["AI動畫", "AI圖像", "數碼故事"],
  "ai-image-visual-storytelling":     ["AI圖像", "手機攝影", "手機攝影×AI圖像", "影片剪輯"],
  "ai-chinese-culture-digital-story": ["AI動畫", "中華文化", "AI+學科", "數碼故事"],
};
