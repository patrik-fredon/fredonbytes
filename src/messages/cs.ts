/**
 * Czech translations - Modular structure
 * Dynamically imports split translation files for better code splitting
 * and performance optimization
 */

// Import common translations (always loaded)
import common from './cs/common.json';
import external from './cs/external.json';

// Import page-specific translations (lazy loaded by webpack)
import homeTranslations from './cs/pages/home.json';
import aboutTranslations from './cs/pages/about.json';
import servicesTranslations from './cs/pages/services.json';
import contactTranslations from './cs/pages/contact.json';
import pricingTranslations from './cs/pages/pricing.json';
import projectsTranslations from './cs/pages/projects.json';
import linksTranslations from './cs/pages/links.json';

// Import component translations
import cookiesTranslations from './cs/components/cookies.json';
import formTranslations from './cs/components/form.json';
import surveyTranslations from './cs/components/survey.json';
import faqTranslations from './cs/components/faq.json';

// Import SEO translations
import seoMetaTranslations from './cs/seo/meta.json';
import seoSchemasTranslations from './cs/seo/schemas.json';

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
  ...faqTranslations,
  ...seoMetaTranslations,
  ...seoSchemasTranslations,
  ...external,
};

export default translations;
