import config from "@config";
import { ui, fallbackLang } from "@/i18n/ui";

const useTrailingSlash: boolean = Boolean(config.site.trailingSlash);

type MergeableObject = Record<string, unknown>;

type WeightedItem = {
  weight?: number | null;
  children?: WeightedItem[];
  menus?: WeightedItem[];
};

function isMergeableObject(value: unknown): value is MergeableObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Safely clones an object using native structuredClone.
 * Falls back to returning the original reference if the object is non-serializable.
 */
function safeClone<T>(value: T): T {
  if (value === undefined) return value;
  try {
    return structuredClone(value);
  } catch {
    return value;
  }
}

function mergeRecords(
  target: MergeableObject,
  source: MergeableObject,
): MergeableObject {
  const result = safeClone(target);
  for (const [key, sourceValue] of Object.entries(source)) {
    const targetValue = result[key];
    if (isMergeableObject(sourceValue) && isMergeableObject(targetValue)) {
      result[key] = mergeRecords(targetValue, sourceValue);
    } else {
      result[key] = safeClone(sourceValue);
    }
  }
  return result;
}

function isUiLanguage(language: string): language is keyof typeof ui {
  return Object.prototype.hasOwnProperty.call(ui, language);
}

function getDefaultUiLanguage(): keyof typeof ui {
  const language = config.settings.multilingual.defaultLanguage;
  return isUiLanguage(language) ? language : fallbackLang;
}

/**
 * Provides O(1) synchronous dictionary lookups for the UI.
 */
export const useTranslations = (
  lang: keyof typeof ui = getDefaultUiLanguage(),
) => {
  return function t<K extends keyof (typeof ui)[typeof fallbackLang]>(key: K) {
    return ui[lang][key] || ui[fallbackLang][key];
  };
};

/**
 * Normalizes the trailing slash of an internal relative URL path according to
 * `config.site.trailingSlash`. Pure, synchronous, build-time only.
 *
 * Rules:
 * - The bare root `/` is always returned unchanged.
 * - File-extension paths (e.g. `/robots.txt`, `/sitemap-index.xml`) are exempt.
 * - Query strings and fragments are preserved; the slash is inserted/removed
 *   on the path portion only (slash before `?` or `#`).
 * - Multiple trailing slashes on the path are collapsed to a single canonical form.
 */
function normalizeTrailingSlash(path: string): string {
  if (path === "/") return path;
  const suffixIndex = path.search(/[?#]/);
  const pathname = suffixIndex === -1 ? path : path.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? "" : path.slice(suffixIndex);
  if (/\.[a-z0-9]+$/i.test(pathname)) return path;
  const trimmed = pathname.replace(/\/+$/, "");
  const base = trimmed === "" ? "/" : trimmed;
  const normalizedPath =
    base === "/" ? "/" : useTrailingSlash ? base + "/" : base;

  return normalizedPath + suffix;
}

/**
 * Strictly formats URLs for a single-page architecture.
 * Bypasses formatting for hash links (#), mailto:, and tel:.
 * Honors `config.site.trailingSlash` for internal relative paths only;
 * external/absolute URLs are passed through untouched.
 */
export const formatUrl = (url: string | undefined): string => {
  if (!url) return "/";
  if (
    url.startsWith("mailto:") ||
    url.startsWith("tel:") ||
    url.startsWith("#")
  ) {
    return url;
  }
  try {
    const isAbsolute = url.startsWith("http://") || url.startsWith("https://");
    if (isAbsolute) return new URL(url).href;
    return normalizeTrailingSlash(url);
  } catch {
    return url;
  }
};

/**
 * Resolves shared anchor attributes for navigation and other site chrome.
 * Configured values are preserved while absolute HTTP(S) links receive secure
 * defaults when no explicit `rel` or `target` value is provided.
 */
export function resolveLinkAttributes(
  url?: string,
  rel?: string,
  target?: string,
) {
  const normalizedUrl = url?.trim();
  const isExternalHttpUrl = Boolean(
    normalizedUrl && /^https?:\/\//i.test(normalizedUrl),
  );
  return {
    href: normalizedUrl ? formatUrl(normalizedUrl) : undefined,
    rel: isExternalHttpUrl ? rel || "noopener noreferrer" : rel || undefined,
    target: isExternalHttpUrl ? target || "_blank" : target || undefined,
  };
}

/**
 * Deep merges a source object into a target object using native APIs.
 */
export function overrideObjects<T extends object>(
  target: T,
  source?: Partial<T> | null,
): T {
  if (!source) return target;
  const clonedTarget = safeClone(target);
  if (!isMergeableObject(clonedTarget) || !isMergeableObject(source)) {
    return clonedTarget;
  }
  return mergeRecords(clonedTarget, source) as T;
}

/**
 * Recursively sorts an array of objects by their `weight` property.
 */
export function sortByWeight<T extends WeightedItem>(items: readonly T[]): T[] {
  return [...items]
    .sort((a, b) => {
      const aWeight = a.weight ?? Infinity;
      const bWeight = b.weight ?? Infinity;
      return aWeight - bWeight;
    })
    .map((item) => {
      const sortedItem = {
        ...item,
        ...(item.children ? { children: sortByWeight(item.children) } : {}),
        ...(item.menus ? { menus: sortByWeight(item.menus) } : {}),
      };
      return sortedItem as T;
    });
}

/**
 * Recursively filters an array of objects, removing any where `enable: false`.
 */
export function filteredEnabled<
  T extends {
    enable?: boolean;
    children?: T[];
    menus?: T[];
  },
>(items: readonly T[]): T[] {
  return safeClone(items)
    .filter((item) => item.enable !== false)
    .map((item) => {
      const filteredItem = {
        ...item,
        ...(item.children ? { children: filteredEnabled(item.children) } : {}),
        ...(item.menus ? { menus: filteredEnabled(item.menus) } : {}),
      };
      return filteredItem as T;
    });
}

/**
 * Splits a string by slashes while protecting URLs, and injects the current year.
 */
export function splitProtectedText(
  text: string,
  options?: { yearPlaceholder?: string },
): string[] {
  if (!text) return [];
  const yearPlaceholder = options?.yearPlaceholder || "{{ year }}";
  const currentYear = new Date().getFullYear().toString();
  const urlRegex = /https?:\/\/[^\s)]+/g;
  const urlPlaceholders: Record<string, string> = {};
  const protectedText = text.replace(urlRegex, (url, index) => {
    const placeholder = `__URL${index}__`;
    urlPlaceholders[placeholder] = url;
    return placeholder;
  });
  let parts = protectedText.split(/\s*\/\s*/);
  parts = parts.map((part) =>
    part.replace(/__URL\d+__/g, (match) => urlPlaceholders[match] || match),
  );
  const yearRegex = new RegExp(
    yearPlaceholder.replace(/\s+/g, "\\s*").replace(/[{}]/g, "\\$&"),
    "g",
  );
  return parts.map((part) => part.replace(yearRegex, currentYear));
}
