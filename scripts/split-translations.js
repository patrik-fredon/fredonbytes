/**
 * Split Translation Files Script
 * Splits large monolithic translation files into modular structure
 * for better performance and maintainability
 */

const fs = require("node:fs");
const path = require("node:path");

const LOCALES = ["en", "cs", "de"];
const BASE_PATH = path.join(__dirname, "../src/messages");

// Define the split structure
const SPLIT_CONFIG = {
  common: [
    "navigation",
    "footer",
    "metadata",
    "manifest",
    "breadcrumb",
    "common",
    "notFound",
  ],
  "pages/home": ["homepage", "hero"],
  "pages/about": ["about", "aboutPage"],
  "pages/services": ["services"],
  "pages/contact": ["contact"],
  "pages/pricing": ["pricing"],
  "pages/projects": ["projects"],
  "pages/links": ["linktree"],
  "components/cookies": ["cookies"],
  "components/form": ["form"],
  "components/survey": ["survey"],
  "components/faq": ["faq"],
  "seo/meta": ["seo", "title", "description"],
  "seo/schemas": ["jsonLd"],
  external: ["external", "emails", "company", "pages"],
};

function splitTranslations(locale) {
  console.log(`\n📦 Splitting translations for: ${locale.toUpperCase()}`);

  // Read the original file
  const originalPath = path.join(BASE_PATH, `${locale}.json`);
  const originalData = JSON.parse(fs.readFileSync(originalPath, "utf-8"));

  const totalSize = JSON.stringify(originalData).length;
  const processedKeys = new Set();

  // Process each split configuration
  for (const [targetFile, keys] of Object.entries(SPLIT_CONFIG)) {
    const targetData = {};

    // Extract keys into target object
    for (const key of keys) {
      if (Object.hasOwn(originalData, key)) {
        targetData[key] = originalData[key];
        processedKeys.add(key);
      }
    }

    if (Object.keys(targetData).length > 0) {
      // Create directory if needed
      const targetPath = path.join(BASE_PATH, locale, `${targetFile}.json`);
      const targetDir = path.dirname(targetPath);

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Write the split file
      fs.writeFileSync(
        targetPath,
        JSON.stringify(targetData, null, 2),
        "utf-8",
      );

      const fileSize = JSON.stringify(targetData).length;
      const percentage = ((fileSize / totalSize) * 100).toFixed(1);
      console.log(
        `  ✅ ${targetFile}.json - ${(fileSize / 1024).toFixed(1)}KB (${percentage}%)`,
      );
    }
  }

  // Check for unprocessed keys
  const allKeys = Object.keys(originalData);
  const unprocessedKeys = allKeys.filter((key) => !processedKeys.has(key));

  if (unprocessedKeys.length > 0) {
    console.log(`  ⚠️  Unprocessed keys: ${unprocessedKeys.join(", ")}`);

    // Save unprocessed keys to a separate file for review
    const unprocessedData = {};
    for (const key of unprocessedKeys) {
      unprocessedData[key] = originalData[key];
    }

    const unprocessedPath = path.join(BASE_PATH, locale, "unprocessed.json");
    fs.writeFileSync(
      unprocessedPath,
      JSON.stringify(unprocessedData, null, 2),
      "utf-8",
    );
    console.log(`  📝 Saved unprocessed keys to: ${locale}/unprocessed.json`);
  }

  const originalSizeKB = (totalSize / 1024).toFixed(1);
  console.log(`\n  📊 Original file: ${originalSizeKB}KB`);
  console.log(`  📊 Processed keys: ${processedKeys.size} / ${allKeys.length}`);
}

// Main execution
console.log("🚀 Starting translation file splitting...\n");
console.log("Target structure:");
console.log("  - common/ (loaded on every page)");
console.log("  - pages/ (page-specific)");
console.log("  - components/ (reusable components)");
console.log("  - seo/ (SEO & metadata)");
console.log("  - external.json (external services)");

for (const locale of LOCALES) {
  try {
    splitTranslations(locale);
  } catch (error) {
    console.error(`\n❌ Error processing ${locale}:`, error.message);
  }
}

console.log("\n✅ Translation splitting complete!\n");
console.log("Next steps:");
console.log("  1. Review split files in src/messages/{locale}/");
console.log("  2. Check unprocessed.json files if any");
console.log("  3. Create index.ts files for each locale");
console.log("  4. Update next-intl configuration");
