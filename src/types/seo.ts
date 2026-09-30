import type { ImageMetadata } from "astro";

export type SeoImage = string | ImageMetadata;

export type JsonPrimitive = string | number | boolean | null;

export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

export interface JsonObject {
  [key: string]: JsonValue;
}

export interface SeoProps {
  title?: string;
  metaTitle?: string;
  description?: string;
  metaDescription?: string;
  canonical?: string;
  keywords?: string[];
  disableTagline?: boolean;
  author?: string;
  robots?: string;
  image?: SeoImage;
  categories?: string[];
  /** Schema.org type; independent of the Open Graph `ogType`. */
  pageType?: string;
  /** Additive extensions; generator-controlled fields cannot be overridden. */
  structuredData?: JsonObject;
  /** Page override → site setting → " | "; an empty string is intentional. */
  taglineSeparator?: string;
  lang?: string;
  twitter?: string;
  twitterCard?: string;
  /** Open Graph type; independent of the Schema.org `pageType`. */
  ogType?: string;
  ogLocale?: string;
}

export interface SeoResolutionContext {
  site?: URL;
  url: URL;
}

export interface ResolvedSeoMetadata {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  keywords: string;
  author?: string;
  robots?: string;
  twitter?: string;
  twitterCard?: string;
  ogType?: string;
  ogLocale?: string;
  pageType: string;
  structuredData?: JsonObject;
  /** Normalized editorial article title, without the site tagline. */
  headline?: string;
  language: string;
  site: {
    name: string;
    description: string;
    url: string;
  };
  publisher: {
    name: string;
    url: string;
    logo?: string;
    sameAs: string[];
  };
}

export interface LayoutProps extends SeoProps {
  class?: string;
  homepage?: boolean;
  fitToScreen?: boolean;
  draft?: boolean;
  excludeFromSitemap?: boolean;
  customSlug?: string;
  status?: number;
  sectionSpacing?: "md" | "lg";
}
