import config from ".astro/config.generated.json";
import { formatUrl } from "@/utils/core";
import { plainify, removeWhitespace } from "@/utils/text";
import type {
  ResolvedSeoMetadata,
  SeoProps,
  SeoResolutionContext,
} from "@/types/seo";

function normalizeSeoText(value?: string): string {
  return removeWhitespace(plainify(value));
}

function resolveFirstNonemptyText(
  ...values: Array<string | undefined>
): string {
  for (const value of values) {
    const normalizedValue = normalizeSeoText(value);
    if (normalizedValue) return normalizedValue;
  }
  return "";
}

function resolveCanonicalUrl(
  canonical: string | undefined,
  context: SeoResolutionContext,
  baseUrl: URL,
): string {
  const canonicalSource =
    canonical?.trim() || `${context.url.pathname}${context.url.search}`;
  const isAbsoluteHttpUrl = /^https?:\/\//i.test(canonicalSource);
  const canonicalUrl = new URL(
    isAbsoluteHttpUrl ? canonicalSource : formatUrl(canonicalSource),
    baseUrl,
  );
  canonicalUrl.hash = "";
  return canonicalUrl.href;
}

/**
 * Resolves shared metadata at build time. Renderers and the JSON-LD generator
 * consume this contract without reading configuration or resolving URLs again.
 */
export function resolveSeoMetadata(
  props: SeoProps,
  context: SeoResolutionContext,
): ResolvedSeoMetadata {
  const baseUrl = context.site ?? new URL(context.url.origin);
  const siteUrl = new URL("/", baseUrl).href;
  const siteTitle = normalizeSeoText(config.site.title);
  const siteDescription = normalizeSeoText(config.site.description);
  const siteTagline = normalizeSeoText(config.site.tagline);
  const siteTaglineSeparator = config.site.taglineSeparator ?? " | ";
  const taglineSeparator = props.taglineSeparator ?? siteTaglineSeparator;
  const baseTitle = resolveFirstNonemptyText(
    props.metaTitle,
    props.title,
    config.site.title,
  );
  const title =
    siteTagline && !props.disableTagline
      ? `${baseTitle}${taglineSeparator}${siteTagline}`
      : baseTitle;
  const description = resolveFirstNonemptyText(
    props.metaDescription,
    props.description,
    config.site.description,
  );
  const selectedImage = props.image ?? config.opengraph.image;
  const imageSource =
    typeof selectedImage === "string" ? selectedImage : selectedImage?.src;
  const normalizedImageSource = imageSource?.trim();
  const publisherLogoSource = config.site.logo?.trim();
  const pageType = normalizeSeoText(props.pageType) || "WebPage";
  const rawHeadline = props.structuredData?.headline;
  const headline =
    pageType === "BlogPosting" && typeof rawHeadline === "string"
      ? normalizeSeoText(rawHeadline) || undefined
      : undefined;
  const keywords = (props.keywords ?? config.seo.keywords)
    .map(normalizeSeoText)
    .filter(Boolean)
    .join(", ");
  const author =
    normalizeSeoText(props.author ?? config.seo.author) || undefined;
  const robots =
    normalizeSeoText(props.robots ?? config.seo.robots) || undefined;
  const twitter =
    normalizeSeoText(props.twitter ?? config.opengraph.twitter) || undefined;
  const twitterCard =
    normalizeSeoText(props.twitterCard ?? config.opengraph.twitterCard) ||
    undefined;
  const ogType =
    normalizeSeoText(props.ogType ?? config.opengraph.ogType) || undefined;
  const ogLocale =
    normalizeSeoText(props.ogLocale ?? config.opengraph.ogLocale) || undefined;
  return {
    title,
    description,
    canonical: resolveCanonicalUrl(props.canonical, context, baseUrl),
    image: normalizedImageSource
      ? new URL(normalizedImageSource, baseUrl).href
      : undefined,
    keywords,
    author,
    robots,
    twitter,
    twitterCard,
    ogType,
    ogLocale,
    pageType,
    structuredData: props.structuredData,
    headline,
    language:
      normalizeSeoText(config.settings.multilingual.defaultLanguage) || "en",
    site: {
      name: siteTagline
        ? `${siteTitle}${siteTaglineSeparator}${siteTagline}`
        : siteTitle,
      description: siteDescription,
      url: siteUrl,
    },
    publisher: {
      name: normalizeSeoText(config.seo.author),
      url: siteUrl,
      logo: publisherLogoSource
        ? new URL(publisherLogoSource, baseUrl).href
        : undefined,
      sameAs: (config.social?.main || [])
        .filter((social) => social.enable)
        .map((social) => social.url),
    },
  };
}
