import { visit } from "unist-util-visit";

function toString(node: any): string {
  if (node.value) return node.value;
  if (node.children) return node.children.map(toString).join("");
  return "";
}

/**
 * Parse markdown content
 * Add classes in markdown heading by [.class .another-class]
 * Add loading="lazy" to images
 * @returns {any}
 */
export default function remarkParseContent(): any {
  return (tree: any) => {
    // Add options to add classes in markdown heading
    // Use: [.class .another-class]
    visit(tree, "heading", (node) => {
      const headingText = toString(node);
      const classRegex = /\[([^\]]+)\]/g;
      let match;
      let classes = [];
      while ((match = classRegex.exec(headingText)) !== null) {
        const classList = match[1].split(/\s+/);
        for (const word of classList) {
          if (word.startsWith(".")) {
            classes.push(word.slice(1));
          }
        }
      }
      if (classes.length > 0) {
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        const newClass = classes.join(" ");
        if (node.data.hProperties.class) {
          node.data.hProperties.class += " " + newClass;
        } else {
          node.data.hProperties.class = newClass;
        }
        visit(node, "text", (textNode: any) => {
          textNode.value = textNode.value
            .replace(/\[([^\]]+)\]/g, "")
            .replace(/\s{2,}/g, " ")
            .trim();
        });
      }
    });
    visit(tree, "image", (node: any) => {
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      node.data.hProperties.loading = "lazy";
    });
  };
}
