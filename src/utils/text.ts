import { marked } from "marked";

const renderer = new marked.Renderer();
renderer.link = (link) => {
  const isExternal = link.href.startsWith("http");
  const targetAttrs = link.href.includes("getastrothemes")
    ? `target="_blank" rel="noopener"`
    : isExternal
      ? `target="_blank" rel="noopener noreferrer nofollow"`
      : "";
  return `<a href="${link.href}" ${targetAttrs}>${link.text}</a>`;
};

marked.use({ renderer });

function getSynchronousMarkdown(result: string | Promise<string>): string {
  if (typeof result !== "string") {
    throw new TypeError(
      "Asynchronous Markdown rendering is not supported by this utility.",
    );
  }
  return result;
}

export const markdownify = (content?: string, container?: boolean) => {
  if (!content) return "";
  return container
    ? getSynchronousMarkdown(marked.parse(content))
    : getSynchronousMarkdown(marked.parseInline(content));
};

export const humanize = (content: string) => {
  if (content) {
    return content
      .replace(/^[\s_]+|[\s_]+$/g, "")
      .replace(/[_\s]+/g, " ")
      .replace(/[-\s]+/g, " ")
      .replace(/^[a-z]/, (match) => match.toUpperCase());
  }
};

export const titleify = (content: string) => {
  if (!content) {
    console.warn("No content provided to titleify " + content);
    return "";
  }
  const humanized = humanize(content) || "";
  return humanized
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const plainify = (content?: string) => {
  if (!content) return "";
  const parsedMarkdown = getSynchronousMarkdown(marked.parse(content));
  const withoutTags = parsedMarkdown.replace(/<\/?[^>]+(>|$)/gm, "");
  const withoutBlankLines = withoutTags.replace(/[\r\n]\s*[\r\n]/gm, "");
  return htmlEntityDecoder(withoutBlankLines);
};

const htmlEntityDecoder = (htmlWithEntities: string) => {
  const entityList: Record<string, string> = {
    "&nbsp;": " ",
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&#39;": "'",
  };
  return htmlWithEntities.replace(
    /(&nbsp;|&amp;|&lt;|&gt;|&quot;|&#39;)/g,
    (entity) => entityList[entity] ?? entity,
  );
};

export const toSentenceCase = (content: string) => {
  if (!content) {
    console.warn("No content provided to toSentenceCase " + content);
    return "";
  }
  const lowercased = content.toLowerCase();
  return lowercased.charAt(0).toUpperCase() + lowercased.slice(1);
};

export function removeWhitespace(text: string) {
  return text.replace(/\s+/g, " ").trim();
}
