#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Accessibility Checker for Fredonbytes
 * Checks components and pages for common accessibility issues
 */

class AccessibilityChecker {
  constructor() {
    this.rootPath = path.join(__dirname, "..");
    this.issues = [];
    this.warnings = [];
    this.suggestions = [];
  }

  log(message, type = "info") {
    const colors = {
      info: "\x1b[36m",
      warn: "\x1b[33m",
      error: "\x1b[31m",
      success: "\x1b[32m",
      reset: "\x1b[0m",
    };
    console.log(`${colors[type]}${message}${colors.reset}`);
  }

  getAllTsxFiles() {
    const srcPath = path.join(this.rootPath, "src");
    const files = [];

    const walkDir = (dir) => {
      const items = fs.readdirSync(dir, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dir, item.name);

        if (item.isDirectory()) {
          walkDir(fullPath);
        } else if (item.name.endsWith(".tsx")) {
          files.push(fullPath);
        }
      }
    };

    if (fs.existsSync(srcPath)) {
      walkDir(srcPath);
    }

    return files;
  }

  checkImageAccessibility(content, filePath) {
    // Check for images without alt text
    const imgTags = content.match(/<img[^>]*>/gi) || [];
    const nextImageTags = content.match(/<Image[^>]*>/gi) || [];

    [...imgTags, ...nextImageTags].forEach((tag, index) => {
      if (!tag.includes("alt=")) {
        this.issues.push(`${filePath}: Image without alt text found`);
      } else if (tag.includes('alt=""') || tag.includes("alt=''")) {
        this.warnings.push(
          `${filePath}: Empty alt text - ensure this is decorative`
        );
      }
    });
  }

  checkButtonAccessibility(content, filePath) {
    // Check for buttons without accessible text
    const buttonTags = content.match(/<button[^>]*>.*?<\/button>/gis) || [];

    buttonTags.forEach((button) => {
      const hasAriaLabel = button.includes("aria-label=");
      const hasText = button.replace(/<[^>]*>/g, "").trim().length > 0;
      const hasAriaLabelledBy = button.includes("aria-labelledby=");

      if (!hasAriaLabel && !hasText && !hasAriaLabelledBy) {
        this.issues.push(`${filePath}: Button without accessible text found`);
      }
    });
  }

  checkFormAccessibility(content, filePath) {
    // Check for form inputs without labels
    const inputTags = content.match(/<input[^>]*>/gi) || [];

    inputTags.forEach((input) => {
      if (input.includes('type="hidden"')) return;

      const hasId = input.match(/id=["']([^"']*)["']/);
      const hasAriaLabel = input.includes("aria-label=");
      const hasAriaLabelledBy = input.includes("aria-labelledby=");

      if (hasId) {
        const id = hasId[1];
        const hasLabel = content.includes(`for="${id}"`);

        if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
          this.issues.push(
            `${filePath}: Input with id="${id}" has no associated label`
          );
        }
      } else if (!hasAriaLabel && !hasAriaLabelledBy) {
        this.warnings.push(`${filePath}: Input without id or aria-label found`);
      }
    });
  }

  checkHeadingStructure(content, filePath) {
    // Check for proper heading hierarchy
    const headings = content.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gis) || [];
    const headingLevels = headings.map((h) =>
      parseInt(h.match(/<h([1-6])/i)[1])
    );

    for (let i = 1; i < headingLevels.length; i++) {
      const current = headingLevels[i];
      const previous = headingLevels[i - 1];

      if (current > previous + 1) {
        this.warnings.push(
          `${filePath}: Heading level jump from h${previous} to h${current}`
        );
      }
    }

    // Check for missing h1
    if (
      !content.includes("<h1") &&
      !content.includes('className="text-4xl') &&
      !content.includes('className="text-5xl')
    ) {
      this.suggestions.push(
        `${filePath}: Consider adding an h1 heading for better structure`
      );
    }
  }

  checkColorContrast(content, filePath) {
    // Check for potential low contrast combinations
    const lowContrastPatterns = [
      /text-gray-300.*bg-gray-200/g,
      /text-gray-400.*bg-gray-300/g,
      /text-yellow-300.*bg-yellow-200/g,
      /text-blue-300.*bg-blue-200/g,
    ];

    lowContrastPatterns.forEach((pattern) => {
      if (pattern.test(content)) {
        this.warnings.push(
          `${filePath}: Potential low contrast color combination found`
        );
      }
    });
  }

  checkFocusManagement(content, filePath) {
    // Check for interactive elements without focus indicators
    const interactiveElements = [
      ...(content.match(/<button[^>]*>/gi) || []),
      ...(content.match(/<a[^>]*>/gi) || []),
      ...(content.match(/<input[^>]*>/gi) || []),
    ];

    const hasFocusStyles =
      content.includes("focus:") || content.includes(":focus");

    if (interactiveElements.length > 0 && !hasFocusStyles) {
      this.suggestions.push(
        `${filePath}: Consider adding focus styles for better keyboard navigation`
      );
    }
  }

  checkAriaAttributes(content, filePath) {
    // Check for proper ARIA usage
    const ariaLabelRegex = /aria-label=["']([^"']*)["']/g;
    const ariaLabels = [...content.matchAll(ariaLabelRegex)];

    ariaLabels.forEach((match) => {
      if (match[1].trim().length === 0) {
        this.issues.push(`${filePath}: Empty aria-label found`);
      }
    });

    // Check for aria-hidden on interactive elements
    const interactiveWithAriaHidden = content.match(
      /<(?:button|a|input)[^>]*aria-hidden=["']true["'][^>]*>/gi
    );
    if (interactiveWithAriaHidden) {
      this.issues.push(
        `${filePath}: Interactive element with aria-hidden="true" found`
      );
    }
  }

  checkSemanticHTML(content, filePath) {
    // Check for semantic HTML usage
    const semanticElements = [
      "main",
      "nav",
      "header",
      "footer",
      "article",
      "section",
      "aside",
    ];
    const hasSemanticElements = semanticElements.some((el) =>
      content.includes(`<${el}`)
    );

    if (!hasSemanticElements && content.length > 1000) {
      this.suggestions.push(
        `${filePath}: Consider using semantic HTML elements (main, nav, header, etc.)`
      );
    }

    // Check for generic div/span overuse
    const divCount = (content.match(/<div/g) || []).length;
    const totalElements = (content.match(/<\w+/g) || []).length;

    if (divCount > totalElements * 0.6) {
      this.suggestions.push(
        `${filePath}: High div usage - consider semantic alternatives`
      );
    }
  }

  checkKeyboardNavigation(content, filePath) {
    // Check for keyboard event handlers
    const hasClickHandlers =
      content.includes("onClick") || content.includes("onPress");
    const hasKeyboardHandlers =
      content.includes("onKeyDown") || content.includes("onKeyPress");

    if (hasClickHandlers && !hasKeyboardHandlers) {
      this.suggestions.push(
        `${filePath}: Click handlers found - ensure keyboard accessibility`
      );
    }

    // Check for tabIndex usage
    const tabIndexMatches = content.match(/tabIndex={?-?\d+}?/g);
    if (tabIndexMatches) {
      tabIndexMatches.forEach((match) => {
        if (match.includes("-1")) {
          this.warnings.push(
            `${filePath}: tabIndex="-1" found - ensure this is intentional`
          );
        }
        if (match.match(/tabIndex={?[1-9]/)) {
          this.warnings.push(
            `${filePath}: Positive tabIndex found - avoid unless necessary`
          );
        }
      });
    }
  }

  analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const relativePath = path.relative(this.rootPath, filePath);

      this.checkImageAccessibility(content, relativePath);
      this.checkButtonAccessibility(content, relativePath);
      this.checkFormAccessibility(content, relativePath);
      this.checkHeadingStructure(content, relativePath);
      this.checkColorContrast(content, relativePath);
      this.checkFocusManagement(content, relativePath);
      this.checkAriaAttributes(content, relativePath);
      this.checkSemanticHTML(content, relativePath);
      this.checkKeyboardNavigation(content, relativePath);
    } catch (error) {
      this.log(`Error reading file ${filePath}: ${error.message}`, "error");
    }
  }

  checkGlobalAccessibility() {
    // Check for global accessibility configurations
    const globalsCssPath = path.join(this.rootPath, "src/app/globals.css");

    if (fs.existsSync(globalsCssPath)) {
      const content = fs.readFileSync(globalsCssPath, "utf8");

      if (!content.includes("prefers-reduced-motion")) {
        this.suggestions.push(
          "Consider adding prefers-reduced-motion support in globals.css"
        );
      }

      if (!content.includes("focus:")) {
        this.warnings.push("No global focus styles found in globals.css");
      }

      if (!content.includes("sr-only") && !content.includes("screen-reader")) {
        this.suggestions.push(
          "Consider adding screen reader only utility classes"
        );
      }
    }
  }

  generateReport() {
    this.log("\n=== ACCESSIBILITY AUDIT REPORT ===\n", "info");

    if (this.issues.length === 0) {
      this.log("✅ No critical accessibility issues found!", "success");
    } else {
      this.log("❌ Critical issues found:", "error");
      this.issues.forEach((issue) => {
        this.log(`  • ${issue}`, "error");
      });
    }

    if (this.warnings.length > 0) {
      this.log("\n⚠️  Warnings:", "warn");
      this.warnings.forEach((warning) => {
        this.log(`  • ${warning}`, "warn");
      });
    }

    if (this.suggestions.length > 0) {
      this.log("\n💡 Suggestions for improvement:", "info");
      this.suggestions.forEach((suggestion) => {
        this.log(`  • ${suggestion}`, "info");
      });
    }

    this.log("\n=== ACCESSIBILITY CHECKLIST ===\n", "info");
    this.log("□ Test with screen reader (NVDA, JAWS, VoiceOver)", "info");
    this.log("□ Test keyboard navigation (Tab, Enter, Space)", "info");
    this.log("□ Check color contrast ratios (4.5:1 minimum)", "info");
    this.log("□ Verify images have meaningful alt text", "info");
    this.log("□ Test with browser zoom at 200%", "info");
    this.log("□ Validate HTML semantics", "info");
    this.log("□ Test focus indicators are visible", "info");
    this.log("□ Check form labels and error messages", "info");

    return {
      issues: this.issues.length,
      warnings: this.warnings.length,
      suggestions: this.suggestions.length,
      status: this.issues.length === 0 ? "PASS" : "NEEDS_ATTENTION",
    };
  }

  run() {
    this.log("Starting accessibility audit...", "info");

    const tsxFiles = this.getAllTsxFiles();

    this.log(`Analyzing ${tsxFiles.length} component files...`, "info");

    tsxFiles.forEach((file) => {
      this.analyzeFile(file);
    });

    this.checkGlobalAccessibility();

    return this.generateReport();
  }
}

// Run the accessibility check if this script is executed directly
if (require.main === module) {
  const checker = new AccessibilityChecker();
  const result = checker.run();

  process.exit(result.status === "PASS" ? 0 : 1);
}

module.exports = AccessibilityChecker;
