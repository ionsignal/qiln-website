import {
  getCollection,
  getEntry,
  type CollectionEntry,
  type CollectionKey,
} from "astro:content";

type DraftableData = {
  draft?: boolean;
};

function isDraft(data: unknown): boolean {
  return (
    typeof data === "object" &&
    data !== null &&
    "draft" in data &&
    (data as DraftableData).draft === true
  );
}

export async function fetchCollection<C extends CollectionKey>(
  collectionName: C,
): Promise<CollectionEntry<C>[]> {
  const entries = await getCollection(
    collectionName,
    (entry) => !entry.id.endsWith("-index"),
  );
  if (import.meta.env.PROD) {
    return entries.filter((entry) => !isDraft(entry.data));
  }
  return entries;
}

export function fetchEntry<C extends CollectionKey>(
  collectionName: C,
  entryId: string,
): Promise<CollectionEntry<C> | undefined>;

export async function fetchEntry(
  collectionName: CollectionKey,
  entryId: string,
) {
  const entry = await getEntry(collectionName, entryId);
  if (!entry || (import.meta.env.PROD && isDraft(entry.data))) {
    return undefined;
  }
  return entry;
}

export async function fetchRequiredEntry<C extends CollectionKey>(
  collectionName: C,
  entryId: string,
): Promise<CollectionEntry<C>> {
  const entry = await fetchEntry(collectionName, entryId);
  if (!entry) {
    throw new Error(
      `[content] Required entry "${entryId}" was not found in the "${collectionName}" collection or is not published.`,
    );
  }
  return entry;
}

export async function getPublishedBlogPosts() {
  const posts = await fetchCollection("blog");
  return posts
    .slice()
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
