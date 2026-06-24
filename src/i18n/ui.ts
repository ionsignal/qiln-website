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
      { enable: false, name: "Home", weight: 1, url: "/#home" },
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
      {
        enable: true,
        name: "Solutions",
        weight: 3,
        hasMegaMenu: false,
        menus: [
          {
            enable: true,
            name: "Use Cases",
            description: "See how others build.",
            icon: "Briefcase",
            url: "/#features",
          },
          {
            enable: true,
            name: "FAQ",
            description: "Common questions answered.",
            icon: "HelpCircle",
            url: "/#faq",
          },
        ],
      },
      { enable: true, name: "Pricing", weight: 4, url: "/pricing" },
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
