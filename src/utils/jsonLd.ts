import config from ".astro/config.generated.json";
import type { SeoImage, JsonObject } from "@/types/seo";

export interface JsonLdContext {
  site?: URL;
  url: URL;
}

export interface JsonLdInput {
  canonical?: string;
  title?: string;
  description?: string;
  image?: SeoImage;
  pageType?: string;
  structuredData?: JsonObject;
}

export default function generateJsonLd(
  content: JsonLdInput,
  context: JsonLdContext,
): JsonObject {
  const {
    canonical = "/",
    title = "",
    description = "",
    image = "",
    structuredData,
  } = content;
  const baseUrl = context.site ?? new URL(context.url.origin);
  const imageSrc = typeof image === "string" ? image : image.src;
  const lang = config.settings.multilingual.defaultLanguage || "en";
  const siteTitle =
    config.site.title +
    (config.site.tagline &&
      (config.site.taglineSeparator || " - ") + config.site.tagline);
  const socialUrls = (config.social?.main || [])
    .filter((item) => item.enable)
    .map((item) => item.url);
  const jsonLdData: JsonObject = {
    ...(structuredData ?? {}),
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    image: imageSrc ? new URL(imageSrc, baseUrl).href : "",
    url: canonical,
    isPartOf: {
      "@type": "WebSite",
      name: siteTitle,
      description: config.site.description,
      url: new URL("/", baseUrl).href,
    },
    publisher: {
      "@type": "Organization",
      name: config.seo.author,
      url: new URL("/", baseUrl).href,
      sameAs: socialUrls,
      logo: {
        "@type": "ImageObject",
        url: new URL(config.site.logo, baseUrl).href,
      },
    },
  };
  if (lang) {
    jsonLdData.inLanguage = lang;
  }
  return jsonLdData;
}
