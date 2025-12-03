/**
 * English translations - Modular structure
 * Dynamically imports split translation files for better code splitting
 * and performance optimization
 */

// Import common translations (always loaded)
import common from "./en/common.json";
// Import component translations
import cookiesTranslations from "./en/components/cookies.json";
import faqTranslations from "./en/components/faq.json";
import formTranslations from "./en/components/form.json";
import surveyTranslations from "./en/components/survey.json";
import uploadTranslations from "./en/components/upload.json";
import external from "./en/external.json";
import aboutTranslations from "./en/pages/about.json";
import contactTranslations from "./en/pages/contact.json";
// Import page-specific translations (lazy loaded by webpack)
import homeTranslations from "./en/pages/home.json";
import linksTranslations from "./en/pages/links.json";
import pricingTranslations from "./en/pages/pricing.json";
import projectsTranslations from "./en/pages/projects.json";
import servicesTranslations from "./en/pages/services.json";

// Import SEO translations
import seoMetaTranslations from "./en/seo/meta.json";
import seoSchemasTranslations from "./en/seo/schemas.json";

// Merge all translations into a single object
// Webpack will code-split these automatically
const translations = {
  ...common,
  ...homeTranslations,
  ...aboutTranslations,
  ...servicesTranslations,
  ...contactTranslations,
  ...pricingTranslations,
  ...projectsTranslations,
  ...linksTranslations,
  ...cookiesTranslations,
  ...formTranslations,
  ...surveyTranslations,
  ...uploadTranslations,
  ...faqTranslations,
  ...seoMetaTranslations,
  ...seoSchemasTranslations,
  ...external,
};

export default translations;
