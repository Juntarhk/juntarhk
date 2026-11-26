import express from "express";
import compression from "compression";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 18504;
const NODE_ENV = process.env.NODE_ENV || "production";
const PRIMARY_HOST = "www.juntarhk.com";

const publicDir = path.resolve(__dirname, "dist", "public");
if (!fs.existsSync(publicDir)) {
  console.error(`[server] dist/public not found at ${publicDir}. Did you run "pnpm build"?`);
  process.exit(1);
}

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", true);

app.use(compression({ threshold: 0 }));

app.use((req, res, next) => {
  if (NODE_ENV !== "production") return next();

  const rawHost = req.get("host") || "";
  const hostname = rawHost.split(":")[0].toLowerCase();
  const proto = (req.get("x-forwarded-proto") || req.protocol || "").toLowerCase();

  // Replit deployment / preview domains → redirect to canonical so crawlers
  // never index the *.replit.app or *.replit.dev origins.
  if (hostname.endsWith(".replit.app") || hostname.endsWith(".replit.dev")) {
    return res.redirect(301, `https://${PRIMARY_HOST}${req.originalUrl}`);
  }

  // Non-www (any protocol) → canonical www + HTTPS (one hop)
  if (hostname === "juntarhk.com") {
    return res.redirect(301, `https://${PRIMARY_HOST}${req.originalUrl}`);
  }

  // www + HTTP → www + HTTPS (one hop)
  if (hostname === PRIMARY_HOST && proto === "http") {
    return res.redirect(301, `https://${PRIMARY_HOST}${req.originalUrl}`);
  }

  next();
});

const ONE_YEAR = 60 * 60 * 24 * 365;
const ONE_MONTH = 60 * 60 * 24 * 30;
const ONE_HOUR = 60 * 60;

function setCacheHeaders(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const rel = path.relative(publicDir, filePath).replace(/\\/g, "/");

  if (rel.startsWith("assets/")) {
    res.setHeader("Cache-Control", `public, max-age=${ONE_YEAR}, immutable`);
    return;
  }

  if (filePath.endsWith("index.html")) {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    return;
  }

  const longCacheExts = [".webp", ".jpg", ".jpeg", ".png", ".gif", ".svg", ".ico", ".woff", ".woff2", ".ttf", ".otf", ".mp4", ".webm"];
  if (longCacheExts.includes(ext)) {
    res.setHeader("Cache-Control", `public, max-age=${ONE_MONTH}`);
    return;
  }

  if (ext === ".txt") {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", `public, max-age=${ONE_HOUR}`);
    return;
  }

  if (ext === ".xml") {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", `public, max-age=${ONE_HOUR}`);
    return;
  }

  if (ext === ".json") {
    res.setHeader("Cache-Control", `public, max-age=${ONE_HOUR}`);
    return;
  }
}


// Redirect the SPA shell filename to the canonical root before static serving
// would otherwise return index.html directly with a 200.
app.get("/index.html", (req, res) => res.redirect(301, "/"));

// Serve real static assets only (index: false + redirect: false so that
// extensionless route requests fall through to the prerender-aware handlers
// below instead of being auto-served or 301-redirected to a trailing slash).
app.use(
  express.static(publicDir, {
    etag: true,
    lastModified: true,
    index: false,
    redirect: false,
    setHeaders: setCacheHeaders,
  }),
);

function sendHtml(res, relFile, status) {
  res.status(status);
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.sendFile(path.join(publicDir, relFile));
}

function send404(res) {
  const notFound = path.join(publicDir, "404.html");
  sendHtml(res, fs.existsSync(notFound) ? "404.html" : "index.html", 404);
}

// Known routes → prerendered HTML (falls back to the SPA shell if the
// prerender step did not emit a file, e.g. a build without DB access).
const STATIC_ROUTES = {
  "/": "index.html",
  "/activities": "activities/index.html",
  "/about": "about/index.html",
  "/partners": "partners/index.html",
  "/contact": "contact/index.html",
  "/corporate-team-building": "corporate-team-building/index.html",
  "/teambuilding-tee": "teambuilding-tee/index.html",
  "/case-studies": "case-studies/index.html",
  // English (en-HK) locale — independently crawlable prerendered documents.
  "/en": "en/index.html",
  "/en/activities": "en/activities/index.html",
  "/en/about": "en/about/index.html",
  "/en/partners": "en/partners/index.html",
  "/en/contact": "en/contact/index.html",
  "/en/corporate-team-building": "en/corporate-team-building/index.html",
  "/en/teambuilding-tee": "en/teambuilding-tee/index.html",
  "/en/case-studies": "en/case-studies/index.html",
};

// English shell fallback for DB-less builds where a specific en page is missing.
const EN_SHELL = fs.existsSync(path.join(publicDir, "en", "index.html")) ? "en/index.html" : "index.html";

function resolveRoute(relFile, shell = "index.html") {
  return fs.existsSync(path.join(publicDir, relFile)) ? relFile : shell;
}

for (const [route, file] of Object.entries(STATIC_ROUTES)) {
  const shell = route.startsWith("/en") ? EN_SHELL : "index.html";
  app.get(route, (req, res) => sendHtml(res, resolveRoute(file, shell), 200));
}

// Admin is a client-only SPA view (noindex); serve the shell directly.
app.get("/admin", (req, res) => sendHtml(res, "index.html", 200));
app.get("/en/admin", (req, res) => sendHtml(res, EN_SHELL, 200));

// Tee checkout success is a client-only view (noindex); serve the shell.
app.get("/teambuilding-tee/success", (req, res) => sendHtml(res, "index.html", 200));
app.get("/en/teambuilding-tee/success", (req, res) => sendHtml(res, EN_SHELL, 200));

// The manifest is written only when the build-time DB prerender succeeded. Its
// presence means every valid slug has a prerendered page, so unknown slugs can
// safely 404. If it is absent (a DB-less build), we must NOT hard-404 detail
// routes — serve the SPA shell (200) so activity pages still work at runtime.
const dbPrerendered = fs.existsSync(path.join(publicDir, "prerender-manifest.json"));

// Activity detail: serve the prerendered page when the slug exists. Otherwise
// return a real 404 (when DB prerender ran) or the SPA shell (fallback build).
app.get("/activities/:slug", (req, res) => {
  const rel = path.join("activities", req.params.slug, "index.html");
  if (fs.existsSync(path.join(publicDir, rel))) {
    return sendHtml(res, rel, 200);
  }
  if (dbPrerendered) {
    return send404(res);
  }
  return sendHtml(res, "index.html", 200);
});

// English activity detail — mirrors the zh handler but serves the en-HK page.
app.get("/en/activities/:slug", (req, res) => {
  const rel = path.join("en", "activities", req.params.slug, "index.html");
  if (fs.existsSync(path.join(publicDir, rel))) {
    return sendHtml(res, rel, 200);
  }
  if (dbPrerendered) {
    return send404(res);
  }
  return sendHtml(res, EN_SHELL, 200);
});

// Case study detail pages — static data, always prerendered at build time.
// Falls back to SPA shell so React can client-render if prerender step was skipped.
app.get("/case-studies/:slug", (req, res) => {
  const rel = path.join("case-studies", req.params.slug, "index.html");
  if (fs.existsSync(path.join(publicDir, rel))) {
    return sendHtml(res, rel, 200);
  }
  return sendHtml(res, "index.html", 200);
});

app.get("/en/case-studies/:slug", (req, res) => {
  const rel = path.join("en", "case-studies", req.params.slug, "index.html");
  if (fs.existsSync(path.join(publicDir, rel))) {
    return sendHtml(res, rel, 200);
  }
  return sendHtml(res, EN_SHELL, 200);
});

// Anything else is an unknown URL → real 404.
app.get(/.*/, (req, res) => send404(res));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[server] juntarhk listening on :${PORT} (${NODE_ENV})`);
});
