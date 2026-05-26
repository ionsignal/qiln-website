import {
  getCollection,
  getEntry,
  type CollectionEntry,
  type CollectionKey,
} from "astro:content";

type HasDraft = { draft?: boolean };

export const fetchCollection = async <C extends CollectionKey>(
  collectionName: C,
): Promise<CollectionEntry<C>[]> => {
  const pages: CollectionEntry<C>[] = (await getCollection(
    collectionName,
    (item: CollectionEntry<C>) => {
      return !item.id.endsWith("-index");
    },
  )) as CollectionEntry<C>[];
  if (import.meta.env.PROD) {
    return pages.filter((page) => !(page.data as HasDraft).draft);
  }
  return pages;
};

export const fetchEntry = async <C extends CollectionKey>(
  collectionName: C,
  subCollectionName: string,
): Promise<CollectionEntry<C>> => {
  const entry = await getEntry(collectionName, subCollectionName);
  if (import.meta.env.PROD && (entry?.data as HasDraft | undefined)?.draft) {
    return undefined as unknown as CollectionEntry<C>;
  }
  return entry as CollectionEntry<C>;
};

export const getPublishedBlogPosts = async () => {
  const posts = await fetchCollection("blog");
  return posts
    .slice()
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
};
