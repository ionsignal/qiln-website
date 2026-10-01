function failValidation(fieldPath, expectation) {
  throw new TypeError(`${fieldPath}: expected ${expectation}.`);
}

function validateString(value, fieldPath) {
  if (typeof value !== "string") {
    failValidation(fieldPath, "a string");
  }
}

function validateNonemptyString(value, fieldPath) {
  validateString(value, fieldPath);
  if (!value.trim()) {
    failValidation(fieldPath, "a nonempty string");
  }
}

function validateBoolean(value, fieldPath) {
  if (typeof value !== "boolean") {
    failValidation(fieldPath, "a boolean");
  }
}

function validatePositiveInteger(value, fieldPath) {
  if (!Number.isInteger(value) || value < 1) {
    failValidation(fieldPath, "a positive integer");
  }
}

function validateFiniteNumber(value, fieldPath) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    failValidation(fieldPath, "a finite number");
  }
}

function validateHttpUrl(value, fieldPath) {
  validateNonemptyString(value, fieldPath);
  let parsedUrl;
  try {
    parsedUrl = new URL(value);
  } catch {
    failValidation(fieldPath, "an absolute HTTP(S) URL");
  }
  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    failValidation(fieldPath, "an absolute HTTP(S) URL");
  }
}

function validateDefaultLanguage(value, fieldPath) {
  // The current UI dictionary only provides English; this does not enable routing.
  if (value !== "en") {
    failValidation(fieldPath, '"en", the currently supported UI language');
  }
}

function optional(validateValue) {
  return (value, fieldPath) => {
    if (value !== undefined) {
      validateValue(value, fieldPath);
    }
  };
}

function arrayOf(validateItem) {
  return (value, fieldPath) => {
    if (!Array.isArray(value)) {
      failValidation(fieldPath, "an array");
    }
    value.forEach((item, index) => {
      validateItem(item, `${fieldPath}[${index}]`);
    });
  };
}

function objectOf(fields) {
  return (value, fieldPath) => {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      failValidation(fieldPath, "an object");
    }
    for (const [fieldName, validateField] of Object.entries(fields)) {
      const childPath = fieldPath ? `${fieldPath}.${fieldName}` : fieldName;
      validateField(value[fieldName], childPath);
    }
  };
}

const validateConfiguration = objectOf({
  site: objectOf({
    title: validateNonemptyString,
    description: validateString,
    tagline: validateString,
    taglineSeparator: optional(validateString),
    baseUrl: validateHttpUrl,
    logo: validateString,
    logoHoverAnimation: validateBoolean,
    logoText: validateString,
    trailingSlash: validateBoolean,
    favicon: objectOf({
      path: validateNonemptyString,
      image: validateNonemptyString,
    }),
  }),
  seo: objectOf({
    author: validateString,
    keywords: arrayOf(validateString),
    robots: validateString,
    robotsTxt: objectOf({
      enable: validateBoolean,
      disallow: optional(arrayOf(validateString)),
    }),
    sitemap: objectOf({
      enable: validateBoolean,
      exclude: optional(arrayOf(validateString)),
    }),
  }),
  settings: objectOf({
    pagination: validatePositiveInteger,
    stickyHeader: validateBoolean,
    copyright: objectOf({
      enable: validateBoolean,
      text: optional(validateString),
    }),
    multilingual: objectOf({
      enable: validateBoolean,
      defaultLanguage: validateDefaultLanguage,
      disableLanguages: arrayOf(validateNonemptyString),
      showDefaultLangInUrl: validateBoolean,
      languages: arrayOf(
        objectOf({
          languageName: validateNonemptyString,
          languageCode: validateNonemptyString,
          contentDir: validateNonemptyString,
          weight: validateFiniteNumber,
        }),
      ),
    }),
    headerDemoButton: objectOf({
      enable: validateBoolean,
      url: validateString,
      rel: optional(validateString),
      target: optional(validateString),
    }),
  }),
  opengraph: objectOf({
    image: validateString,
    ogLocale: validateString,
    ogType: validateString,
    twitter: validateString,
    twitterCard: validateString,
  }),
  social: objectOf({
    main: arrayOf(
      objectOf({
        enable: validateBoolean,
        label: validateNonemptyString,
        icon: validateNonemptyString,
        url: validateHttpUrl,
      }),
    ),
  }),
  head: optional(
    objectOf({
      content: optional(validateString),
    }),
  ),
});

export function validateSiteConfig(configuration) {
  validateConfiguration(configuration, "config");
  return configuration;
}
