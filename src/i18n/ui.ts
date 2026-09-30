import type { NavigationLink } from "@/types";

const main: NavigationLink[] = [
  {
    enable: true,
    name: "Product",
    weight: 1,
    hasMegaMenu: false,
    menus: [
      {
        enable: true,
        name: "Known-good Snapshots",
        weight: 1,
        url: "/#known-good-snapshots",
      },
      {
        enable: true,
        name: "Forked Branches",
        weight: 2,
        url: "/#forked-branches",
      },
      {
        enable: true,
        name: "Capsule Diffs + Golden Tests",
        weight: 3,
        url: "/#golden-tests-and-diffs",
      },
      {
        enable: true,
        name: "Promotion + Rollback",
        weight: 4,
        url: "/#promotion-and-rollback",
      },
      {
        enable: true,
        name: "Qiln FAQ",
        weight: 5,
        url: "/#faq",
      },
    ],
  },
  { enable: true, name: "Blog", weight: 2, url: "/blog" },
  { enable: true, name: "Documentation", weight: 3, url: "/docs" },
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
    "common.paginationNext": "Next",
    "common.paginationPrevious": "Previous",
    "navigation.buttonLabel": "See the demo",
    "navigation.demoLabel": "Demo",
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
