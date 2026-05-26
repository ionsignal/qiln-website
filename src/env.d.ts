/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module "aos";

/*
 * Preline's scoped packages currently lack proper TypeScript mappings
 * for their `/non-auto` exports. We explicitly declare them here
 * to maintain strict typing and avoid 'any' errors.
 */
declare module "@preline/accordion/non-auto" {
  const HSAccordion: { autoInit: () => void };
  export default HSAccordion;
}

declare module "@preline/collapse/non-auto" {
  const HSCollapse: { autoInit: () => void };
  export default HSCollapse;
}

declare module "@preline/overlay/non-auto" {
  const HSOverlay: { autoInit: () => void };
  export default HSOverlay;
}

declare module "@preline/tabs/non-auto" {
  const HSTabs: { autoInit: () => void };
  export default HSTabs;
}

declare module "@preline/scrollspy/non-auto" {
  const HSScrollspy: { autoInit: () => void };
  export default HSScrollspy;
}
