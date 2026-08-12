import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";
import { toString } from "mdast-util-to-string";
import getReadingTime from "reading-time";
import type { Root } from "mdast";
import type { RemarkMetadata } from "@/types";

type FrontmatterData = Record<string, unknown>;

interface RemarkFile {
  history?: string[];
  data: {
    astro?: {
      frontmatter?: FrontmatterData;
    };
  };
}

function ensureFrontmatter(file: RemarkFile): FrontmatterData {
  file.data.astro ??= {};
  file.data.astro.frontmatter ??= {};
  return file.data.astro.frontmatter;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function getRemarkMetadata(value: unknown): RemarkMetadata {
  if (!isRecord(value)) return {};
  return {
    minutesRead:
      typeof value.minutesRead === "string" ? value.minutesRead : undefined,
    lastModified:
      typeof value.lastModified === "string" ? value.lastModified : undefined,
  };
}

/**
 * Calculates reading time from the Markdown AST and injects it into the
 * frontmatter exposed by Astro's render result.
 */
export function remarkReadingTime() {
  return (tree: Root, file: RemarkFile): void => {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    const frontmatter = ensureFrontmatter(file);
    frontmatter.minutesRead = readingTime.text;
  };
}

/**
 * Resolves the last modified time using Git, the filesystem, and finally the
 * current build time so builds remain stable across CI environments.
 */
export function remarkModifiedTime() {
  return (_tree: Root, file: RemarkFile): void => {
    const filepath = file.history?.[0];
    const frontmatter = ensureFrontmatter(file);
    if (!filepath) {
      frontmatter.lastModified = new Date().toISOString();
      return;
    }
    try {
      const result = execFileSync(
        "git",
        ["log", "-1", "--pretty=format:%cI", "--", filepath],
        {
          encoding: "utf8",
          stdio: ["ignore", "pipe", "ignore"],
        },
      ).trim();
      if (result) {
        frontmatter.lastModified = result;
        return;
      }
    } catch {
      // Git metadata is not guaranteed in shallow or source-only builds.
    }
    try {
      const stats = statSync(filepath);
      frontmatter.lastModified = stats.mtime.toISOString();
    } catch {
      frontmatter.lastModified = new Date().toISOString();
    }
  };
}
