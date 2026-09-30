import type { JsonObject, ResolvedSeoMetadata } from "@/types/seo";

const reservedStructuredDataFields = new Set([
  "@context",
  "@type",
  "name",
  "description",
  "image",
  "url",
  "isPartOf",
  "publisher",
  "inLanguage",
]);

const reservedBlogPostingFields = new Set(["headline", "mainEntityOfPage"]);

export default function generateJsonLd(
  metadata: ResolvedSeoMetadata,
): JsonObject {
  const isBlogPosting = metadata.pageType === "BlogPosting";
  const structuredDataExtensions: JsonObject = Object.fromEntries(
    Object.entries(metadata.structuredData ?? {}).filter(
      ([field]) =>
        !reservedStructuredDataFields.has(field) &&
        (!isBlogPosting || !reservedBlogPostingFields.has(field)),
    ),
  );
  const publisher: JsonObject = {
    "@type": "Organization",
    name: metadata.publisher.name,
    url: metadata.publisher.url,
    sameAs: metadata.publisher.sameAs,
    ...(metadata.publisher.logo
      ? {
          logo: {
            "@type": "ImageObject",
            url: metadata.publisher.logo,
          },
        }
      : {}),
  };

  return {
    ...structuredDataExtensions,
    "@context": "https://schema.org",
    "@type": metadata.pageType,
    name: metadata.title,
    description: metadata.description,
    ...(metadata.image ? { image: metadata.image } : {}),
    url: metadata.canonical,
    isPartOf: {
      "@type": "WebSite",
      name: metadata.site.name,
      description: metadata.site.description,
      url: metadata.site.url,
    },
    publisher,
    ...(metadata.language ? { inLanguage: metadata.language } : {}),
    ...(isBlogPosting
      ? {
          ...(metadata.headline ? { headline: metadata.headline } : {}),
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": metadata.canonical,
          },
        }
      : {}),
  };
}

/**
 * Escaping every opening angle bracket prevents script-ending content from
 * crossing the HTML script boundary without changing the decoded JSON values.
 */
export function serializeJsonLd(data: JsonObject): string {
  return JSON.stringify(data, null, 2).replace(/</g, "\\u003c");
}
