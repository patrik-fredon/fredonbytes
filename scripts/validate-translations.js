#!/usr/bin/env node

/**
 * Translation Validation Script
 * Validates translation files for syntax errors, missing keys, and completeness
 */

const fs = require("fs");
const path = require("path");

const LOCALES_DIR = path.join(__dirname, "..", "src", "app", "locales");
const SUPPORTED_LOCALES = ["en", "cs", "de"];

class TranslationValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.translations = {};
  }

  /**
   * Main validation runner
   */
  async validate() {
    console.log("🔍 Starting Translation Validation\n");

    // Load and validate JSON syntax
    this.loadTranslations();

    // Validate structure consistency
    this.validateStructure();

    // Check for missing keys
    this.checkMissingKeys();

    // Validate TODO items
    this.validateTodoItems();

    // Validate SEO metadata completeness
    this.validateSEOMetadata();

    // Validate variable placeholders
    this.validateVariablePlaceholders();

    // Generate report
    this.generateReport();

    // Exit with appropriate code
    return this.errors.length === 0;
  }

  /**
   * Load and validate JSON syntax for all translation files
   */
  loadTranslations() {
    for (const locale of SUPPORTED_LOCALES) {
      const filePath = path.join(LOCALES_DIR, locale, "common.json");

      try {
        if (!fs.existsSync(filePath)) {
          this.errors.push(`Missing translation file: ${filePath}`);
          continue;
        }

        const content = fs.readFileSync(filePath, "utf8");
        const translations = JSON.parse(content);

        this.translations[locale] = translations;
        console.log(`✅ ${locale.toUpperCase()}: JSON syntax valid`);
      } catch (error) {
        this.errors.push(
          `${locale.toUpperCase()}: JSON syntax error - ${error.message}`
        );
        console.log(`❌ ${locale.toUpperCase()}: JSON syntax error`);
      }
    }
  }

  /**
   * Validate that all locales have the same structure
   */
  validateStructure() {
    if (!this.translations.en) {
      this.errors.push("English translation file is required as reference");
      return;
    }

    const referenceKeys = this.getAllKeys(this.translations.en);

    for (const locale of SUPPORTED_LOCALES) {
      if (locale === "en" || !this.translations[locale]) continue;

      const localeKeys = this.getAllKeys(this.translations[locale]);
      const missingKeys = [];
      const extraKeys = [];

      referenceKeys.forEach((key) => {
        if (!localeKeys.has(key)) {
          missingKeys.push(key);
        }
      });

      localeKeys.forEach((key) => {
        if (!referenceKeys.has(key)) {
          extraKeys.push(key);
        }
      });

      if (missingKeys.length > 0) {
        this.errors.push(
          `${locale.toUpperCase()}: Missing keys: ${missingKeys
            .slice(0, 5)
            .join(", ")}${missingKeys.length > 5 ? "..." : ""}`
        );
      }

      if (extraKeys.length > 0) {
        this.warnings.push(
          `${locale.toUpperCase()}: Extra keys: ${extraKeys
            .slice(0, 5)
            .join(", ")}${extraKeys.length > 5 ? "..." : ""}`
        );
      }
    }
  }

  /**
   * Check for missing translation keys across locales
   */
  checkMissingKeys() {
    const allKeys = {};
    const missing = {};

    // Collect all keys from all locales
    for (const locale of SUPPORTED_LOCALES) {
      if (this.translations[locale]) {
        allKeys[locale] = this.getAllKeys(this.translations[locale]);
      } else {
        allKeys[locale] = new Set();
      }
    }

    // Find missing keys for each locale
    for (const locale of SUPPORTED_LOCALES) {
      if (!this.translations[locale]) continue;

      missing[locale] = new Set();

      // Compare with English (reference locale)
      if (locale !== "en" && this.translations.en) {
        const enKeys = allKeys.en;
        const localeKeys = allKeys[locale];

        enKeys.forEach((key) => {
          if (!localeKeys.has(key)) {
            missing[locale].add(key);
          }
        });
      }
    }

    // Report missing keys
    for (const [locale, missingKeys] of Object.entries(missing)) {
      if (missingKeys.size > 0) {
        this.errors.push(
          `${locale.toUpperCase()}: ${
            missingKeys.size
          } missing translation keys`
        );
      }
    }
  }

  /**
   * Validate TODO items and count them
   */
  validateTodoItems() {
    for (const locale of SUPPORTED_LOCALES) {
      if (!this.translations[locale]) continue;

      const todoCount = this.countTodoItems(this.translations[locale]);

      if (todoCount > 0) {
        if (locale === "en") {
          this.errors.push(
            `${locale.toUpperCase()}: ${todoCount} TODO items found (English should be complete)`
          );
        } else {
          this.warnings.push(
            `${locale.toUpperCase()}: ${todoCount} TODO items remaining`
          );
        }
      }
    }
  }

  /**
   * Validate SEO metadata completeness
   */
  validateSEOMetadata() {
    const requiredSEOKeys = [
      "seo.defaultTitle",
      "seo.defaultDescription",
      "seo.keywords",
      "pages.home.title",
      "pages.about.title",
      "pages.services.title",
      "pages.contact.title",
    ];

    for (const locale of SUPPORTED_LOCALES) {
      if (!this.translations[locale]) continue;

      for (const key of requiredSEOKeys) {
        const value = this.getNestedValue(this.translations[locale], key);

        if (!value || typeof value !== "string") {
          this.errors.push(`${locale.toUpperCase()}: Missing SEO key: ${key}`);
        } else if (value.includes("TODO")) {
          this.warnings.push(
            `${locale.toUpperCase()}: SEO key contains TODO: ${key}`
          );
        }
      }
    }
  }

  /**
   * Validate variable placeholders consistency
   */
  validateVariablePlaceholders() {
    if (!this.translations.en) return;

    const enKeys = this.getAllKeys(this.translations.en);

    enKeys.forEach((key) => {
      const enValue = this.getNestedValue(this.translations.en, key);

      if (typeof enValue === "string") {
        const enVariables = this.extractVariables(enValue);

        if (enVariables.length > 0) {
          for (const locale of SUPPORTED_LOCALES) {
            if (locale === "en" || !this.translations[locale]) continue;

            const localeValue = this.getNestedValue(
              this.translations[locale],
              key
            );

            if (
              typeof localeValue === "string" &&
              !localeValue.includes("TODO")
            ) {
              const localeVariables = this.extractVariables(localeValue);

              const missingVars = enVariables.filter(
                (v) => !localeVariables.includes(v)
              );
              const extraVars = localeVariables.filter(
                (v) => !enVariables.includes(v)
              );

              if (missingVars.length > 0) {
                this.errors.push(
                  `${locale.toUpperCase()}: Missing variables in ${key}: ${missingVars.join(
                    ", "
                  )}`
                );
              }

              if (extraVars.length > 0) {
                this.warnings.push(
                  `${locale.toUpperCase()}: Extra variables in ${key}: ${extraVars.join(
                    ", "
                  )}`
                );
              }
            }
          }
        }
      }
    });
  }

  /**
   * Extract variable placeholders from a string
   */
  extractVariables(text) {
    const matches = text.match(/{(\w+)}/g);
    return matches ? matches.map((match) => match.slice(1, -1)) : [];
  }

  /**
   * Get all keys recursively from an object
   */
  getAllKeys(obj, prefix = "") {
    const keys = new Set();

    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      keys.add(fullKey);

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        const nestedKeys = this.getAllKeys(value, fullKey);
        nestedKeys.forEach((k) => keys.add(k));
      }
    }

    return keys;
  }

  /**
   * Get nested value from object using dot notation
   */
  getNestedValue(obj, path) {
    const keys = path.split(".");
    let current = obj;

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }

    return current;
  }

  /**
   * Count TODO items in translations
   */
  countTodoItems(obj) {
    let count = 0;

    const traverse = (value) => {
      if (typeof value === "string" && value.includes("TODO")) {
        count++;
      } else if (typeof value === "object" && value !== null) {
        Object.values(value).forEach(traverse);
      } else if (Array.isArray(value)) {
        value.forEach(traverse);
      }
    };

    traverse(obj);
    return count;
  }

  /**
   * Generate validation report
   */
  generateReport() {
    console.log("\n" + "=".repeat(60));
    console.log("📋 TRANSLATION VALIDATION REPORT");
    console.log("=".repeat(60));

    // Summary
    const totalFiles = SUPPORTED_LOCALES.length;
    const loadedFiles = Object.keys(this.translations).length;

    console.log(`\n📊 Summary:`);
    console.log(`   Files processed: ${loadedFiles}/${totalFiles}`);
    console.log(`   Errors: ${this.errors.length}`);
    console.log(`   Warnings: ${this.warnings.length}`);

    // Errors
    if (this.errors.length > 0) {
      console.log(`\n❌ Errors (${this.errors.length}):`);
      this.errors.forEach((error) => {
        console.log(`   • ${error}`);
      });
    }

    // Warnings
    if (this.warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${this.warnings.length}):`);
      this.warnings.forEach((warning) => {
        console.log(`   • ${warning}`);
      });
    }

    // Success message
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log("\n✅ All translation files are valid and complete!");
    } else if (this.errors.length === 0) {
      console.log(
        "\n✅ All translation files are valid (warnings can be addressed)"
      );
    } else {
      console.log(
        "\n❌ Translation validation failed - please fix the errors above"
      );
    }

    // File statistics
    console.log("\n📈 Translation Statistics:");
    for (const locale of SUPPORTED_LOCALES) {
      if (this.translations[locale]) {
        const keyCount = this.getAllKeys(this.translations[locale]).size;
        const todoCount = this.countTodoItems(this.translations[locale]);
        const completeness =
          todoCount === 0
            ? "100%"
            : `${(((keyCount - todoCount) / keyCount) * 100).toFixed(1)}%`;

        console.log(
          `   ${locale.toUpperCase()}: ${keyCount} keys, ${todoCount} TODOs, ${completeness} complete`
        );
      } else {
        console.log(`   ${locale.toUpperCase()}: File not loaded`);
      }
    }
  }
}

// Run validation if called directly
if (require.main === module) {
  (async () => {
    try {
      const validator = new TranslationValidator();
      const success = await validator.validate();
      process.exit(success ? 0 : 1);
    } catch (error) {
      console.error("Validation failed:", error);
      process.exit(1);
    }
  })();
}

module.exports = TranslationValidator;
