#!/usr/bin/env node

/**
 * Translation Management Script
 * Handles translation file analysis, merging, cleaning, and validation
 */

const fs = require("fs");
const path = require("path");

const LOCALES_DIR = path.join(__dirname, "..", "src", "app", "locales");
const SUPPORTED_LOCALES = ["en", "cs", "de"];

class TranslationManager {
  constructor() {
    this.translations = {};
    this.loadTranslations();
  }

  /**
   * Load all translation files
   */
  loadTranslations() {
    for (const locale of SUPPORTED_LOCALES) {
      const filePath = path.join(LOCALES_DIR, locale, "common.json");
      try {
        const content = fs.readFileSync(filePath, "utf8");
        // Remove Git merge conflict markers and fix JSON
        const cleanContent = this.cleanMergeConflicts(content);
        this.translations[locale] = JSON.parse(cleanContent);
      } catch (error) {
        console.error(`Error loading ${locale} translations:`, error.message);
        this.translations[locale] = {};
      }
    }
  }

  /**
   * Clean Git merge conflict markers from JSON content
   */
  cleanMergeConflicts(content) {
    return (
      content
        // Remove Git conflict markers
        .replace(/^<<<<<<< HEAD.*$/gm, "")
        .replace(/^=======.*$/gm, "")
        .replace(/^>>>>>>> .*$/gm, "")
        // Fix trailing commas and formatting issues
        .replace(/,(\s*[}\]])/g, "$1")
        // Remove duplicate entries by keeping the last occurrence
        .split("\n")
        .filter((line) => line.trim() !== "")
        .join("\n")
    );
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
   * Find missing keys by comparing locales
   */
  findMissingKeys() {
    const allKeys = {};
    const missing = {};

    // Collect all keys from all locales
    for (const locale of SUPPORTED_LOCALES) {
      allKeys[locale] = this.getAllKeys(this.translations[locale]);
    }

    // Find missing keys for each locale
    for (const locale of SUPPORTED_LOCALES) {
      missing[locale] = new Set();

      // Compare with English (reference locale)
      if (locale !== "en") {
        const enKeys = allKeys.en;
        const localeKeys = allKeys[locale];

        enKeys.forEach((key) => {
          if (!localeKeys.has(key)) {
            missing[locale].add(key);
          }
        });
      }
    }

    return missing;
  }

  /**
   * Set nested value in object using dot notation
   */
  setNestedValue(obj, path, value) {
    const keys = path.split(".");
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== "object") {
        current[key] = {};
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
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
   * Add missing keys with TODO placeholders
   */
  addMissingKeys() {
    const missing = this.findMissingKeys();

    for (const [locale, missingKeys] of Object.entries(missing)) {
      if (missingKeys.size === 0) continue;

      console.log(`\nAdding ${missingKeys.size} missing keys to ${locale}:`);

      missingKeys.forEach((key) => {
        const enValue = this.getNestedValue(this.translations.en, key);
        let todoValue;

        if (typeof enValue === "string") {
          todoValue = `TODO: Translate "${enValue}"`;
        } else if (Array.isArray(enValue)) {
          todoValue = enValue.map((item) => `TODO: Translate "${item}"`);
        } else {
          todoValue = `TODO: Translate`;
        }

        this.setNestedValue(this.translations[locale], key, todoValue);
        console.log(`  - ${key}`);
      });
    }
  }

  /**
   * Add page-specific SEO metadata structure
   */
  addSEOMetadata() {
    const seoStructure = {
      pages: {
        home: {
          title: "TODO: Translate home page title",
          description: "TODO: Translate home page description",
          keywords: "TODO: Translate home page keywords",
        },
        about: {
          title: "TODO: Translate about page title",
          description: "TODO: Translate about page description",
          keywords: "TODO: Translate about page keywords",
        },
        services: {
          title: "TODO: Translate services page title",
          description: "TODO: Translate services page description",
          keywords: "TODO: Translate services page keywords",
        },
        projects: {
          title: "TODO: Translate projects page title",
          description: "TODO: Translate projects page description",
          keywords: "TODO: Translate projects page keywords",
        },
        pricing: {
          title: "TODO: Translate pricing page title",
          description: "TODO: Translate pricing page description",
          keywords: "TODO: Translate pricing page keywords",
        },
        contact: {
          title: "TODO: Translate contact page title",
          description: "TODO: Translate contact page description",
          keywords: "TODO: Translate contact page keywords",
        },
        links: {
          title: "TODO: Translate links page title",
          description: "TODO: Translate links page description",
          keywords: "TODO: Translate links page keywords",
        },
        "privacy-policy": {
          title: "TODO: Translate privacy policy page title",
          description: "TODO: Translate privacy policy page description",
          keywords: "TODO: Translate privacy policy page keywords",
        },
        "terms-of-service": {
          title: "TODO: Translate terms of service page title",
          description: "TODO: Translate terms of service page description",
          keywords: "TODO: Translate terms of service page keywords",
        },
        "cookie-policy": {
          title: "TODO: Translate cookie policy page title",
          description: "TODO: Translate cookie policy page description",
          keywords: "TODO: Translate cookie policy page keywords",
        },
      },
    };

    // Add English SEO content
    if (!this.translations.en.pages) {
      this.translations.en.pages = {
        home: {
          title: "Fredonbytes - Your All-in-One IT Powerhouse",
          description:
            "From code to clicks, we deliver complete digital dominance. Full-spectrum IT solutions including software development, graphic design, SEO, and social media marketing.",
          keywords:
            "web development, software development, IT solutions, graphic design, SEO, social media marketing, Brno, Czech Republic",
        },
        about: {
          title: "About Fredonbytes - Your Digital Transformation Partner",
          description:
            "Founded in 2023, Fredonbytes eliminates the need for multiple vendors by becoming your one-stop digital army, ensuring seamless, high-impact results under one roof.",
          keywords:
            "about fredonbytes, digital transformation, IT company, software development team, Brno tech",
        },
        services: {
          title: "IT Services - Software Development, Design & Marketing",
          description:
            "Comprehensive IT solutions from development to marketing. Eliminate complexity with our unified approach to software development, design, SEO, and social media management.",
          keywords:
            "IT services, software development, web development, graphic design, SEO services, social media marketing",
        },
        projects: {
          title: "Our Portfolio - Fredonbytes Project Gallery",
          description:
            "Explore our latest work and see how we've helped businesses transform their digital presence with cutting-edge solutions.",
          keywords:
            "portfolio, web development projects, software projects, design showcase, case studies",
        },
        pricing: {
          title: "Transparent Pricing Plans - Choose Your IT Solution",
          description:
            "Transparent pricing with no hidden fees. Scale your business with our flexible IT solutions from starter to enterprise plans.",
          keywords:
            "pricing, IT services cost, web development pricing, transparent pricing, business plans",
        },
        contact: {
          title: "Contact Fredonbytes - Let's Work Together",
          description:
            "Ready to transform your digital presence? Contact our team in Brno, Czech Republic for a free consultation on your next IT project.",
          keywords:
            "contact, Brno IT company, free consultation, project inquiry, Czech Republic tech",
        },
        links: {
          title: "Fredonbytes Links - Connect With Us Everywhere",
          description:
            "All our important links in one place. Connect with Fredonbytes on social media, GitHub, and our various platforms.",
          keywords:
            "social links, GitHub, LinkedIn, contact links, Fredonbytes platforms",
        },
        "privacy-policy": {
          title: "Privacy Policy - How We Protect Your Data",
          description:
            "Learn how Fredonbytes collects, uses, and protects your personal information. We are committed to maintaining your privacy and data security.",
          keywords:
            "privacy policy, data protection, GDPR compliance, personal information, data security",
        },
        "terms-of-service": {
          title: "Terms of Service - Fredonbytes Usage Agreement",
          description:
            "Terms and conditions for using Fredonbytes services. Understand your rights and obligations when working with our IT solutions.",
          keywords:
            "terms of service, usage agreement, service terms, legal terms, conditions",
        },
        "cookie-policy": {
          title: "Cookie Policy - How We Use Cookies",
          description:
            "Information about how Fredonbytes uses cookies to improve your browsing experience and analyze website usage.",
          keywords:
            "cookie policy, website cookies, tracking, analytics, user experience",
        },
      };
    }

    // Add structure to other locales with TODO placeholders
    for (const locale of ["cs", "de"]) {
      if (!this.translations[locale].pages) {
        this.translations[locale].pages = JSON.parse(
          JSON.stringify(seoStructure.pages)
        );
      }
    }
  }

  /**
   * Save all translation files
   */
  saveTranslations() {
    for (const locale of SUPPORTED_LOCALES) {
      const filePath = path.join(LOCALES_DIR, locale, "common.json");
      const content = JSON.stringify(this.translations[locale], null, 2);

      try {
        fs.writeFileSync(filePath, content, "utf8");
        console.log(`✅ Saved ${locale} translations`);
      } catch (error) {
        console.error(`❌ Error saving ${locale} translations:`, error.message);
      }
    }
  }

  /**
   * Generate translation analysis report
   */
  generateReport() {
    const missing = this.findMissingKeys();
    const enKeys = this.getAllKeys(this.translations.en);

    console.log("\n" + "=".repeat(60));
    console.log("📊 TRANSLATION ANALYSIS REPORT");
    console.log("=".repeat(60));

    console.log(`\n📋 Total keys in English (reference): ${enKeys.size}`);

    for (const locale of SUPPORTED_LOCALES) {
      const localeKeys = this.getAllKeys(this.translations[locale]);
      const missingCount = missing[locale]?.size || 0;
      const completeness = (
        ((localeKeys.size - missingCount) / enKeys.size) *
        100
      ).toFixed(1);

      console.log(`\n🌐 ${locale.toUpperCase()}:`);
      console.log(`   Total keys: ${localeKeys.size}`);
      console.log(`   Missing keys: ${missingCount}`);
      console.log(`   Completeness: ${completeness}%`);

      if (missingCount > 0) {
        console.log(
          `   Missing keys: ${Array.from(missing[locale])
            .slice(0, 5)
            .join(", ")}${missingCount > 5 ? "..." : ""}`
        );
      }
    }
  }

  /**
   * Run the complete translation management process
   */
  run() {
    console.log("🚀 Starting Translation Management Process\n");

    this.generateReport();
    this.addSEOMetadata();
    this.addMissingKeys();
    this.saveTranslations();

    console.log("\n✅ Translation management completed successfully!");
  }
}

// Run if called directly
if (require.main === module) {
  const manager = new TranslationManager();
  manager.run();
}

module.exports = TranslationManager;
