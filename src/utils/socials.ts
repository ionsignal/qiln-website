import config from ".astro/config.generated.json";
import type { SocialLink } from "@/types";

const HEADER_PLATFORMS = ["github", "discord"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSocialLink(value: unknown): value is SocialLink {
  if (!isRecord(value)) return false;
  return (
    typeof value.enable === "boolean" &&
    typeof value.label === "string" &&
    typeof value.icon === "string" &&
    typeof value.url === "string"
  );
}

function isHeaderPlatform(label: string): boolean {
  const normalizedLabel = label.toLowerCase();
  return HEADER_PLATFORMS.some((platform) => platform === normalizedLabel);
}

/**
 * Curated list of social links to render in the header chip slot.
 * Filters by enabled state and platform whitelist; preserves the order
 * defined in `config.toml`.
 */
export const headerSocials: SocialLink[] = (
  Array.isArray(config.social?.main) ? config.social.main : []
)
  .filter(isSocialLink)
  .filter((link) => link.enable && isHeaderPlatform(link.label));
