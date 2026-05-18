import type { NavigationLink } from "@/types";

export const defaultLang = "en";
export const ui = {
  en: {
    // Flattened Strings (from en.json)
    "common.readMore": "Read More",
    "common.category": "Category",
    "common.publishedOn": "Published On",
    "common.learnMoreAbout": "Learn more about",
    "common.emailPlaceholder": "Email Address",
    "common.paginationNext": "Next",
    "common.paginationPrevious": "Previous",
    "navigation.buttonLabel": "Join Early Testers",
    "subscription.label": "Join our early testers group",
    "integration.relatedIntegrationSectionTitle":
      "Vivamus sit amet **varius felis**",
    "integration.backToIntegration": "Browse",
    "footer.quickLinks": "Nullam Lacus",
    "footer.legal": "Vestibulum",
    "footer.resources": "Praesent",
    "footer.description":
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc scelerisque erat non vehicula cursus. Pellentesque sit amet tempus dui, ut posuere elit. Etiam volutpat rhoncus mollis.",
    "footer.copyright":
      "Copyright {{ year }} / All Rights Reserved By IonSignal, Inc.",
    main: [
      { enable: true, name: "Home", weight: 1, url: "/#home" },
      { enable: true, name: "Features", weight: 2, url: "/#features" },
      { enable: true, name: "FAQ", weight: 3, url: "/#faq" },
      { enable: true, name: "Get Started", weight: 4, url: "/#cta" },
      { enable: true, name: "Documentation", weight: 5, url: "/docs/" },
    ] as NavigationLink[],
    footerMenu: [] as NavigationLink[],
    footerMenuQuickLink: [] as NavigationLink[],
    footerMenuResources: [] as NavigationLink[],
    footerMenuLegal: [] as NavigationLink[],
  },
};
