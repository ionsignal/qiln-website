import type { CollectionEntry } from "astro:content";

export type DeckContent = CollectionEntry<"decks">["data"];
export type DeckSlideKey = keyof DeckContent["slides"];
export type DeckSlideContent = DeckContent["slides"][DeckSlideKey];
export type DeckVariant = DeckContent["variants"][string];
