#!/usr/bin/env node

/**
 * Simple JSON validation script
 * Validates JSON syntax for translation files
 */

const fs = require("fs");
const path = require("path");

const locales = ["en", "cs", "de"];
const localesDir = path.join(__dirname, "..", "src", "app", "locales");

let hasErrors = false;

console.log("🔍 Validating JSON syntax for translation files...\n");

locales.forEach((locale) => {
  const filePath = path.join(localesDir, locale, "common.json");

  try {
    if (!fs.existsSync(filePath)) {
      console.error(`❌ ${locale.toUpperCase()}: File not found: ${filePath}`);
      hasErrors = true;
      return;
    }

    const content = fs.readFileSync(filePath, "utf8");
    JSON.parse(content);
    console.log(`✅ ${locale.toUpperCase()}: JSON syntax valid`);
  } catch (error) {
    console.error(`❌ ${locale.toUpperCase()}: JSON syntax error`);
    console.error(`   ${error.message}`);
    hasErrors = true;
  }
});

if (hasErrors) {
  console.log("\n❌ JSON validation failed");
  process.exit(1);
} else {
  console.log("\n✅ All JSON files are valid");
  process.exit(0);
}
