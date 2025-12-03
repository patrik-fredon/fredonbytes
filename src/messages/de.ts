/**
 * German translations - Modular structure
 * Dynamically imports split translation files for better code splitting
 * and performance optimization
 */

// Import common translations (always loaded)
import common from "./de/common.json";
// Import component translations
import cookiesTranslations from "./de/components/cookies.json";
import faqTranslations from "./de/components/faq.json";
import formTranslations from "./de/components/form.json";
import surveyTranslations from "./de/components/survey.json";
import uploadTranslations from "./de/components/upload.json";
import external from "./de/external.json";
import aboutTranslations from "./de/pages/about.json";
import contactTranslations from "./de/pages/contact.json";
// Import page-specific translations (lazy loaded by webpack)
import homeTranslations from "./de/pages/home.json";
import linksTranslations from "./de/pages/links.json";
import pricingTranslations from "./de/pages/pricing.json";
import projectsTranslations from "./de/pages/projects.json";
import servicesTranslations from "./de/pages/services.json";

// Import SEO translations
import seoMetaTranslations from "./de/seo/meta.json";
import seoSchemasTranslations from "./de/seo/schemas.json";

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
