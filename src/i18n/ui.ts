import type { NavigationLink } from "@/types";

const main: NavigationLink[] = [
  {
    enable: true,
    name: "Product",
    weight: 3,
    hasMegaMenu: false,
    menus: [
      {
        enable: true,
        name: "What Qiln Protects",
        weight: 1,
        url: "/#gpu",
      },
      {
        enable: true,
        name: "Agent-Safe Branches",
        weight: 2,
        url: "/#storage",
      },
      {
        enable: true,
        name: "Qiln Blueprints",
        weight: 3,
        url: "/#blueprint-section",
      },
      {
        enable: true,
        name: "Qiln FAQ",
        weight: 4,
        url: "/#faq",
      },
    ],
  },
  { enable: true, name: "Blog", weight: 3, url: "/blog" },
  { enable: true, name: "Documentation", weight: 3, url: "/docs" },
  /*
  {
    enable: true,
    name: "Product",
    weight: 2,
    hasMegaMenu: true,
    menus: [
      {
        enable: true,
        name: "Workspaces",
        description: "Persistent visual AI workspaces on reserved GPUs.",
        icon: "Monitor",
        url: "/#gpu",
      },
      {
        enable: true,
        name: "Model Vaults",
        description: "Secure, instant-access storage for your models.",
        icon: "Database",
        url: "/#storage",
      },
      {
        enable: true,
        name: "Blueprints",
        description: "Pre-configured generative AI creation workflows.",
        icon: "Workflow",
        url: "/#blueprint-section",
      },
    ],
    cta: {
      enable: true,
      title: "Start Building",
      description: "Get access to high-VRAM GPUs today.",
      image: "",
      ctaBtn: {
        enable: true,
        label: "Request Access",
        url: "/#early-testers",
      },
    },
  },
   */
];

const footerMenu: NavigationLink[] = [];

const footerMenuQuickLink: NavigationLink[] = [
  {
    enable: true,
    name: "GitHub",
    url: "https://github.com/ionsignal/qiln",
    rel: "noopener noreferrer",
    target: "_blank",
  },
  {
    enable: true,
    name: "Discord",
    url: "https://discord.gg/eNaxauuyZ6",
    rel: "noopener noreferrer",
    target: "_blank",
  },
];

const footerMenuResources: NavigationLink[] = [
  { enable: true, name: "Documentation", url: "#" },
];

const footerMenuLegal: NavigationLink[] = [
  { enable: true, name: "Privacy Policy", url: "/privacy-policy" },
  { enable: true, name: "Terms of Service", url: "/terms-of-service" },
];

export const defaultLang = "en";

export const ui = {
  en: {
    "common.readMore": "Read More",
    "common.category": "Category",
    "common.publishedOn": "Published On",
    "common.learnMoreAbout": "Learn more about",
    "common.emailPlaceholder": "Email Address",
    "common.paginationNext": "Next",
    "common.paginationPrevious": "Previous",
    "navigation.buttonLabel": "Let us migrate your workflow →",
    "subscription.label": "Let us migrate your workflow →",
    "integration.relatedIntegrationSectionTitle":
      "Vivamus sit amet **varius felis**",
    "integration.backToIntegration": "Browse",
    "footer.quickLinks": "Community",
    "footer.legal": "Legal",
    "footer.resources": "Resources",
    "footer.description":
      "Qiln makes an AI workflow system durable, branchable, and reviewable.",
    "footer.copyright":
      "Copyright {{ year }} / All Rights Reserved By IonSignal, Inc.",
    main,
    footerMenu,
    footerMenuQuickLink,
    footerMenuResources,
    footerMenuLegal,
  },
};
