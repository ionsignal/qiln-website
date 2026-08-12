import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";
import type { Heading, Image, Root, Text } from "mdast";

/**
 * Parses Markdown content, adds classes to headings using
 * `[.class .another-class]`, and applies lazy loading to Markdown images.
 */
export default function remarkParseContent() {
  return (tree: Root): void => {
    visit(tree, "heading", (node: Heading) => {
      const headingText = toString(node);
      const classRegex = /\[([^\]]+)\]/g;
      const classes: string[] = [];
      let match: RegExpExecArray | null;
      while ((match = classRegex.exec(headingText)) !== null) {
        const classList = match[1].split(/\s+/);
        for (const word of classList) {
          if (word.startsWith(".")) {
            classes.push(word.slice(1));
          }
        }
      }
      if (classes.length === 0) return;
      node.data ??= {};
      node.data.hProperties ??= {};
      const newClass = classes.join(" ");
      const existingClass = node.data.hProperties.class;
      node.data.hProperties.class =
        typeof existingClass === "string" && existingClass
          ? `${existingClass} ${newClass}`
          : newClass;
      visit(node, "text", (textNode: Text) => {
        textNode.value = textNode.value
          .replace(/\[([^\]]+)\]/g, "")
          .replace(/\s{2,}/g, " ")
          .trim();
      });
    });
    visit(tree, "image", (node: Image) => {
      node.data ??= {};
      node.data.hProperties ??= {};
      node.data.hProperties.loading = "lazy";
    });
  };
}
