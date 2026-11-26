import { Helmet } from "react-helmet-async";
import { useSeoSettings } from "@/contexts/SeoSettingsContext";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  path?: string;
  ogImage?: string;
  lang?: string;
}

const SITE_NAME = "JuntarHK";
const BASE_URL = "https://www.juntarhk.com";
const DEFAULT_OG_IMAGE = `${BASE_URL}/opengraph.jpg`;

const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": `${BASE_URL}/#organization`,
  name: "JuntarHK",
  alternateName: "Juntar HK",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/logo.png`,
    width: 512,
    height: 512,
  },
  image: `${BASE_URL}/opengraph.jpg`,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+852-9728-9412",
    contactType: "customer service",
    areaServed: "HK",
    availableLanguage: ["Chinese", "English"],
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Unit 79, 7/F, Woon Lee Commercial Building, 7-9 Austin Avenue",
    addressLocality: "Tsim Sha Tsui, Kowloon",
    addressCountry: "HK",
    addressRegion: "Hong Kong",
  },
  areaServed: {
    "@type": "Country",
    name: "Hong Kong",
  },
  sameAs: [
    "https://wa.me/85297289412",
  ],
  // VERIFY: owner to confirm school count figure
  description: "JuntarHK 為香港中小學提供攝影教育、影片製作、校園媒體（校園記者、校園電視台）及 AI 創作課程，同時提供歷奇及體驗學習活動。由攝影師兼教育工作者創辦，課程以學生完成真實作品為核心目標。",
};

const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "JuntarHK",
  description: "JuntarHK 香港中小學攝影教育及 AI 創作課程",
  publisher: { "@id": `${BASE_URL}/#organization` },
  inLanguage: ["zh-HK", "en-HK"],
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/activities?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export function SEO({ title, description, keywords, path = "", ogImage, lang }: SEOProps) {
  const seoSettings = useSeoSettings();

  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  // Reciprocal locale URLs: zh-HK lives at the root path, en-HK under /en. Both
  // are distinct, independently crawlable addresses so search engines can build
  // a valid hreflang cluster.
  const zhUrl = `${BASE_URL}${path}`;
  const enUrl = `${BASE_URL}${path === "/" ? "/en" : `/en${path}`}`;
  const canonical = lang === "en" ? enUrl : zhUrl;
  const resolvedOgImage = ogImage ?? (seoSettings.seo_og_image || DEFAULT_OG_IMAGE);
  const resolvedKeywords = keywords ?? (seoSettings.seo_keywords || undefined);
  const htmlLang = lang === "en" ? "en-HK" : "zh-HK";
  const altLang = lang === "en" ? "zh-HK" : "en-HK";

  return (
    <Helmet>
      <html lang={htmlLang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {resolvedKeywords && <meta name="keywords" content={resolvedKeywords} />}
      <link rel="canonical" href={canonical} />

      {/* hreflang for bilingual site — reciprocal, distinct URLs per locale */}
      <link rel="alternate" hrefLang="zh-HK" href={zhUrl} />
      <link rel="alternate" hrefLang="en-HK" href={enUrl} />
      <link rel="alternate" hrefLang="x-default" href={zhUrl} />

      {/* Google Search Console verification */}
      {seoSettings.seo_google_verification && (
        <meta name="google-site-verification" content={seoSettings.seo_google_verification} />
      )}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={seoSettings.seo_og_title || fullTitle} />
      <meta property="og:description" content={seoSettings.seo_og_description || description} />
      <meta property="og:image" content={resolvedOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="JuntarHK 香港中小學攝影及 AI 教育課程" />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={htmlLang.replace("-", "_")} />
      <meta property="og:locale:alternate" content={altLang.replace("-", "_")} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoSettings.seo_og_title || fullTitle} />
      <meta name="twitter:description" content={seoSettings.seo_og_description || description} />
      <meta name="twitter:image" content={resolvedOgImage} />
      <meta name="twitter:image:alt" content="JuntarHK 香港中小學攝影及 AI 教育課程" />

      {/* Robots */}
      <meta name="robots" content="index, follow" />

      {/* Organization JSON-LD (every page) */}
      <script type="application/ld+json">
        {JSON.stringify(ORGANIZATION_JSONLD)}
      </script>

      {/* WebSite JSON-LD with SearchAction (every page) */}
      <script type="application/ld+json">
        {JSON.stringify(WEBSITE_JSONLD)}
      </script>
    </Helmet>
  );
}
