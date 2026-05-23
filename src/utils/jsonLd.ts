/**
 * JSON-LD Generator
 * Generates appropriate JSON-LD data based on the page type and provided content
 * Generates JSON-LD data that search engines like Google, Bing, and DuckDuckGo can use to better understand the content of the page.
 * This can improve the page's visibility in search engine results and provide users with additional information about the page.
 */
import type { ImageMetadata } from "astro";

// This component dynamically generates appropriate JSON-LD data based on the page type
export type JSONLDProps = {
  canonical?: string; // Canonical URL of the page, used to determine page type
  title?: string; // Title of the page
  description?: string; // Description of the page
  image?: string | ImageMetadata;
  categories?: string[]; // Categories or tags for blog posts or case studies
  author?: string; // Author for blog posts or case studies
  pageType?: string; // Page type
  [key: string]: any;
};

export default function generateJsonLd(content: JSONLDProps, Astro: any) {
  let {
    canonical = "/",
    title = "",
    description = "",
    image = "",
    pageType = "",
    config,
  } = content || {};
  const lang = config.settings.multilingual.defaultLanguage || "en";
  let jsonLdData: Record<string, any> = {
    "@context": "https://schema.org",
  };
  const imageSrc = typeof image === "object" ? image.src : image;
  switch (pageType) {
    default:
      jsonLdData["@type"] = "WebPage";
      jsonLdData.name = title;
      jsonLdData.description = description;
      jsonLdData.image = imageSrc
        ? new URL(imageSrc, Astro.site ?? Astro.url.origin).href
        : "";
      jsonLdData.url = canonical;
      if (lang) {
        jsonLdData.inLanguage = lang;
      }
  }
  const siteTitle =
    config.site.title +
    (config.site.tagline &&
      (config.site.taglineSeparator || " - ") + config.site.tagline);
  jsonLdData["isPartOf"] = {
    "@type": "WebSite",
    name: siteTitle,
    description: config.site.description,
    url: new URL("/", Astro.url.origin).href,
  };
  jsonLdData.publisher = {
    "@type": "Organization",
    name: config.seo.author,
    url: new URL("/", Astro.url.origin).href,
    sameAs: (config.social?.main || [])
      .filter((item: any) => item.enable)
      .map((item: any) => item.url),
    logo: {
      "@type": "ImageObject",
      url: new URL(config.site.logo, Astro.site ?? Astro.url.origin).href,
    },
  };
  // Utility to remove empty or undefined keys
  return jsonLdData;
}
