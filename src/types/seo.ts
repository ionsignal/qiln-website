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
  pageType?: string;
  structuredData?: JsonObject;
  taglineSeparator?: string;
  lang?: string;
  twitter?: string;
  twitterCard?: string;
  ogType?: string;
  ogLocale?: string;
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
