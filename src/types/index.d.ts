import type { ImageMetadata } from "astro";

export type MarqueeConfig = {
  pauseOnHover: boolean;
  reverse?: "reverse" | "";
  duration: string;
};

export type MarqueeListItem = {
  src: string | ImageMetadata;
  alt: string;
};

export type VideoConfig = {
  src: string;
  type?: string;
  provider?: string;
  poster?: string;
  autoplay?: boolean;
  id?: string;
};

export type NavButton = {
  enable: boolean;
  label: string;
  url: string;
  type?: string;
  rel?: string;
  target?: string;
  icon?: string;
  variant?: string;
};

export type SocialLink = {
  enable: boolean;
  label: string;
  icon: string;
  url: string;
};

export type Social = {
  enable: boolean;
  list: SocialLink[];
};

export type GlobalValues =
  "inherit" | "initial" | "revert" | "revert-layer" | "unset";

export interface Source {
  path?: string;
  preload?: boolean;
  css?: Record<string, string>;
  style:
    | "normal"
    | "italic"
    | "oblique"
    | `oblique ${number}deg`
    | GlobalValues
    | (string & {});
  weight?:
    | "normal"
    | "bold"
    | "lighter"
    | "bolder"
    | GlobalValues
    | 100
    | 200
    | 300
    | 400
    | 500
    | 600
    | 700
    | 800
    | 900
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900"
    | (string & {})
    | (number & {});
}

export interface FontConfig {
  name: string;
  src: Source[];
  fetch?: boolean;
  verbose?: boolean;
  selector?: string;
  preload?: boolean;
  cacheDir?: string;
  basePath?: string;
  fallbackName?: string;
  googleFontsURL?: string;
  cssVariable?: string | boolean;
  fallback: "serif" | "sans-serif" | "monospace";
  display: "auto" | "block" | "swap" | "fallback" | "optional" | (string & {});
  provider?: "local-hosted" | "google-fonts";
}

export interface Badge {
  enable: boolean;
  label?: string;
  color: "primary" | "success" | "danger" | "warning" | string;
  type: "dot" | "text";
}

export interface NavigationLinkCTA {
  enable: boolean;
  image: string;
  title: string;
  description: string;
  ctaBtn: NavButton;
}

export interface ChildNavigationLink {
  enable: boolean;
  name: string;
  description?: string;
  icon?: string;
  weight?: number;
  url?: string;
  rel?: string;
  target?: string;
  hasChildren?: boolean;
  badge?: Badge;
  children?: ChildNavigationLink[];
}

export interface NavigationLink extends ChildNavigationLink {
  hasMegaMenu?: boolean;
  cta?: NavigationLinkCTA;
  menus?: NavigationLink[];
}

export interface RemarkMetadata {
  minutesRead?: string;
  lastModified?: string;
}
