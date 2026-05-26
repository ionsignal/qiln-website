import { execSync } from "child_process";
import { statSync } from "fs";
import { toString } from "mdast-util-to-string";
import getReadingTime from "reading-time";

/**
 * Calculates reading time from the Markdown AST and injects it
 * into the frontmatter.
 */
export function remarkReadingTime() {
  return function (tree: any, file: any) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    file.data.astro = file.data.astro || {};
    file.data.astro.frontmatter = file.data.astro.frontmatter || {};
    file.data.astro.frontmatter.minutesRead = readingTime.text;
  };
}

/**
 * Grabs the last modified time of the file using a Tri-State
 * fallback (Git -> FS -> Runtime Date) to ensure build stability
 * across different CI/CD environments.
 */
export function remarkModifiedTime() {
  return function (_: any, file: any) {
    const filepath = file.history ? file.history[0] : undefined;
    file.data.astro = file.data.astro || {};
    file.data.astro.frontmatter = file.data.astro.frontmatter || {};
    if (!filepath) {
      file.data.astro.frontmatter.lastModified = new Date().toISOString();
      return;
    }
    try {
      const result = execSync(
        `git log -1 --pretty="format:%cI" "${filepath}"`,
        {
          encoding: "utf-8",
          stdio: ["pipe", "pipe", "ignore"],
        },
      ).trim();
      if (result) {
        file.data.astro.frontmatter.lastModified = result;
        return;
      }
    } catch (e) {
      // Silently catch Git failures (e.g., shallow clones, uncommitted files)
    }
    try {
      const stats = statSync(filepath);
      file.data.astro.frontmatter.lastModified = stats.mtime.toISOString();
    } catch (e) {
      file.data.astro.frontmatter.lastModified = new Date().toISOString();
    }
  };
}
