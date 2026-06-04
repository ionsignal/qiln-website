import type { NavigationLink } from "@/types";

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
    "navigation.buttonLabel": "Request a reserved workspace",
    "subscription.label": "Request a Reserved Workspace",
    "integration.relatedIntegrationSectionTitle":
      "Vivamus sit amet **varius felis**",
    "integration.backToIntegration": "Browse",
    "footer.quickLinks": "Community",
    "footer.legal": "Legal",
    "footer.resources": "Resources",
    "footer.description":
      "Qiln gives founders, artists, and teams persistent ComfyUI workspaces on reserved high-VRAM GPUs.",
    "footer.copyright":
      "Copyright {{ year }} / All Rights Reserved By IonSignal, Inc.",
    main: [
      { enable: true, name: "Home", weight: 1, url: "/#home" },
      { enable: true, name: "Reserved GPU", weight: 3, url: "/#gpu" },
      { enable: true, name: "Model Vaults", weight: 4, url: "/#storage" },
      {
        enable: true,
        name: "Blueprints",
        weight: 5,
        url: "/#blueprint-section",
      },
      // { enable: true, name: "Use Cases", weight: 5, url: "/#features" },
      // { enable: true, name: "FAQ", weight: 6, url: "/#faq" },
    ] as NavigationLink[],
    footerMenu: [] as NavigationLink[],
    footerMenuQuickLink: [
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
    ] as NavigationLink[],
    footerMenuResources: [
      { enable: true, name: "Documentation", url: "#" },
    ] as NavigationLink[],
    footerMenuLegal: [
      { enable: true, name: "Privacy Policy", url: "/privacy-policy" },
      { enable: true, name: "Terms of Service", url: "/terms-of-service" },
    ] as NavigationLink[],
  },
};
