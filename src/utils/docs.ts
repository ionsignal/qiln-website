import { getCollection, getEntry } from "astro:content";
import config from "@config";
import type {
  DocActiveTrail,
  DocCategoryEntry,
  DocEntry,
  DocNavCategoryNode,
  DocNavNode,
  DocNavPageNode,
  DocPagination,
  DocsTree,
} from "@/types/docs";

const useTrailingSlash: boolean = Boolean(config.site.trailingSlash);

/**
 * Resolves a docs entry (or its ID) to its public URL.
 * Pure & synchronous — safe to call from any template at build time.
 *
 * @example getDocPath("index")                                     // "/docs/" or "/docs"
 * @example getDocPath("getting-started/installation")              // "/docs/getting-started/installation/"
 */
export function getDocPath(idOrEntry: string | DocEntry): string {
  const id = typeof idOrEntry === "string" ? idOrEntry : idOrEntry.id;
  const trailing = useTrailingSlash ? "/" : "";
  if (id === "index") return useTrailingSlash ? "/docs/" : "/docs";
  return `/docs/${id}${trailing}`;
}

/**
 * Returns every published docs entry. In production, drafts are filtered out;
 * in development, drafts are kept so authors can preview unfinished pages.
 */
export async function getAllDocs(): Promise<DocEntry[]> {
  const entries = await getCollection("docs");
  if (import.meta.env.PROD) {
    return entries.filter((entry) => !entry.data.draft);
  }
  return entries;
}

/**
 * Looks up a single docs entry by its content collection ID.
 * Returns `undefined` for missing or draft-in-prod entries.
 */
export async function getDocBySlug(id: string): Promise<DocEntry | undefined> {
  const entry = await getEntry("docs", id);
  if (!entry) return undefined;
  if (import.meta.env.PROD && entry.data.draft) return undefined;
  return entry;
}

// Module-level memoization — the tree is deterministic for a given build.
let _treeCache: DocsTree | null = null;

/**
 * Builds the full sidebar navigation tree by joining the `docs` collection
 * with `_category.json` metadata. Top-level entries (no `/` in their ID)
 * become root page nodes; everything else is grouped under its first segment.
 *
 * Categories without a matching `_category.json` get a derived label
 * (kebab-case → Title Case), `order: 999`, and `collapsed: false`.
 *
 * Sort order is `(order asc, label asc)` at every level — fully deterministic.
 */
export async function getDocsTree(): Promise<DocsTree> {
  if (_treeCache) return _treeCache;
  const [docs, categories] = await Promise.all([
    getAllDocs(),
    getCollection("docCategories"),
  ]);
  const categoryMap = new Map<string, DocCategoryEntry>();
  for (const category of categories) {
    categoryMap.set(category.id, category);
  }
  const rootPages: DocNavPageNode[] = [];
  const groupedDocs = new Map<string, DocEntry[]>();
  for (const doc of docs) {
    const segments = doc.id.split("/");
    if (segments.length === 1) {
      // Root-level page (includes the special "index" entry).
      rootPages.push(toPageNode(doc));
      continue;
    }
    const categoryId = segments[0];
    const bucket = groupedDocs.get(categoryId);
    if (bucket) {
      bucket.push(doc);
    } else {
      groupedDocs.set(categoryId, [doc]);
    }
  }
  const categoryNodes: DocNavCategoryNode[] = [];
  for (const [categoryId, docsInCategory] of groupedDocs) {
    const meta = categoryMap.get(categoryId);
    const children = docsInCategory.map(toPageNode).sort(compareNodes);
    categoryNodes.push({
      type: "category",
      id: categoryId,
      label: meta?.data.label ?? deriveLabelFromId(categoryId),
      order: meta?.data.order ?? 999,
      icon: meta?.data.icon,
      collapsed: meta?.data.collapsed ?? false,
      children,
    });
  }
  const tree: DocsTree = [...rootPages, ...categoryNodes].sort(compareNodes);
  _treeCache = tree;
  return tree;
}

/**
 * Walks the tree to find which category & page correspond to the current
 * pathname. Comparisons are normalized to ignore trailing slashes so the
 * function works regardless of `trailingSlash` configuration.
 */
export function getActiveTrail(
  pathname: string,
  tree: DocsTree,
): DocActiveTrail {
  const target = normalizePath(pathname);
  for (const node of tree) {
    if (node.type === "page") {
      if (normalizePath(node.path) === target) {
        return { categoryId: null, pageId: node.id };
      }
      continue;
    }
    for (const child of node.children) {
      if (normalizePath(child.path) === target) {
        return { categoryId: node.id, pageId: child.id };
      }
    }
  }
  return { categoryId: null, pageId: "" };
}

/**
 * Flattens the tree into linear display order and returns the entries
 * adjacent to `currentId`. Used by `DocsPagination`.
 */
export function getPrevNext(currentId: string, tree: DocsTree): DocPagination {
  const flat = flattenTree(tree);
  const index = flat.findIndex((node) => node.id === currentId);
  if (index === -1) return {};
  const prevNode = index > 0 ? flat[index - 1] : undefined;
  const nextNode = index < flat.length - 1 ? flat[index + 1] : undefined;
  return {
    prev: prevNode ? { slug: prevNode.id, label: prevNode.label } : undefined,
    next: nextNode ? { slug: nextNode.id, label: nextNode.label } : undefined,
  };
}

function toPageNode(doc: DocEntry): DocNavPageNode {
  return {
    type: "page",
    id: doc.id,
    label: doc.data.sidebarLabel ?? doc.data.title,
    order: doc.data.order,
    path: getDocPath(doc.id),
  };
}

function compareNodes(a: DocNavNode, b: DocNavNode): number {
  if (a.order !== b.order) return a.order - b.order;
  return a.label.localeCompare(b.label);
}

function deriveLabelFromId(id: string): string {
  return id
    .split("-")
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function flattenTree(tree: DocsTree): DocNavPageNode[] {
  const out: DocNavPageNode[] = [];
  for (const node of tree) {
    if (node.type === "page") {
      out.push(node);
    } else {
      out.push(...node.children);
    }
  }
  return out;
}

function normalizePath(path: string): string {
  const trimmed = path.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}
