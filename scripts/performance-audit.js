#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Performance Audit Script for Fredonbytes
 * Checks for common performance issues and optimization opportunities
 */

class PerformanceAuditor {
  constructor() {
    this.issues = [];
    this.suggestions = [];
    this.rootPath = path.join(__dirname, "..");
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

  checkFileSize(filePath, maxSize) {
    try {
      const stats = fs.statSync(filePath);
      const sizeInMB = stats.size / (1024 * 1024);
      if (sizeInMB > maxSize) {
        this.issues.push(
          `Large file detected: ${filePath} (${sizeInMB.toFixed(2)}MB)`
        );
      }
    } catch (error) {
      // File doesn't exist, skip
    }
  }

  checkImageOptimization() {
    this.log("Checking image optimization...", "info");

    const publicDir = path.join(this.rootPath, "public");
    if (!fs.existsSync(publicDir)) return;

    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];
    const files = fs.readdirSync(publicDir, { recursive: true });

    files.forEach((file) => {
      const ext = path.extname(file).toLowerCase();
      if (imageExtensions.includes(ext)) {
        const filePath = path.join(publicDir, file);
        this.checkFileSize(filePath, 1); // 1MB limit for images

        // Check if WebP alternative exists
        const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, ".webp");
        if (!fs.existsSync(webpPath) && ext !== ".webp") {
          this.suggestions.push(`Consider creating WebP version of ${file}`);
        }
      }
    });
  }

  checkBundleSize() {
    this.log("Checking bundle configuration...", "info");

    const nextConfigPath = path.join(this.rootPath, "next.config.ts");
    if (fs.existsSync(nextConfigPath)) {
      const content = fs.readFileSync(nextConfigPath, "utf8");

      if (!content.includes("withBundleAnalyzer")) {
        this.suggestions.push(
          'Bundle analyzer is configured - run "npm run build:analyze" to check bundle size'
        );
      }

      if (!content.includes("compress: true")) {
        this.issues.push("Compression should be enabled in next.config.ts");
      }
    }
  }

  checkDependencies() {
    this.log("Checking dependencies...", "info");

    const packageJsonPath = path.join(this.rootPath, "package.json");
    if (!fs.existsSync(packageJsonPath)) return;

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    // Check for heavy dependencies
    const heavyDeps = ["moment", "lodash", "jquery"];
    heavyDeps.forEach((dep) => {
      if (dependencies[dep]) {
        this.suggestions.push(`Consider lighter alternative to ${dep}`);
      }
    });

    // Check for duplicate functionality
    if (dependencies["axios"] && dependencies["fetch"]) {
      this.suggestions.push(
        "You have both axios and fetch - consider using only one"
      );
    }
  }

  checkCodeSplitting() {
    this.log("Checking code splitting opportunities...", "info");

    const srcDir = path.join(this.rootPath, "src");
    if (!fs.existsSync(srcDir)) return;

    // Check for large component files
    const checkDir = (dir) => {
      const files = fs.readdirSync(dir, { withFileTypes: true });

      files.forEach((file) => {
        const filePath = path.join(dir, file.name);

        if (file.isDirectory()) {
          checkDir(filePath);
        } else if (file.name.endsWith(".tsx") || file.name.endsWith(".ts")) {
          this.checkFileSize(filePath, 0.1); // 100KB limit for components
        }
      });
    };

    checkDir(srcDir);
  }

  checkSEOOptimization() {
    this.log("Checking SEO optimization...", "info");

    // Check for robots.txt
    const robotsPath = path.join(this.rootPath, "public", "robots.txt");
    if (!fs.existsSync(robotsPath)) {
      this.issues.push("robots.txt file is missing");
    }

    // Check for sitemap
    const sitemapPath = path.join(this.rootPath, "src", "app", "sitemap.ts");
    if (!fs.existsSync(sitemapPath)) {
      this.issues.push("sitemap.ts file is missing");
    }

    // Check for favicon
    const faviconPath = path.join(this.rootPath, "public", "favicon.ico");
    if (!fs.existsSync(faviconPath)) {
      this.suggestions.push("Consider adding favicon.ico to public directory");
    }
  }

  checkSecurityHeaders() {
    this.log("Checking security configuration...", "info");

    const nextConfigPath = path.join(this.rootPath, "next.config.ts");
    if (fs.existsSync(nextConfigPath)) {
      const content = fs.readFileSync(nextConfigPath, "utf8");

      const securityHeaders = [
        "X-Content-Type-Options",
        "X-Frame-Options",
        "X-XSS-Protection",
        "Referrer-Policy",
      ];

      securityHeaders.forEach((header) => {
        if (!content.includes(header)) {
          this.issues.push(`Security header missing: ${header}`);
        }
      });
    }
  }

  checkEnvironmentConfig() {
    this.log("Checking environment configuration...", "info");

    const envExamplePath = path.join(this.rootPath, ".env.example");
    if (!fs.existsSync(envExamplePath)) {
      this.issues.push(".env.example file is missing");
    }

    const dockerfilePath = path.join(this.rootPath, "Dockerfile");
    if (!fs.existsSync(dockerfilePath)) {
      this.issues.push("Dockerfile is missing for production deployment");
    }

    const dockerignorePath = path.join(this.rootPath, ".dockerignore");
    if (!fs.existsSync(dockerignorePath)) {
      this.issues.push(".dockerignore file is missing");
    }
  }

  generateReport() {
    this.log("\n=== PERFORMANCE AUDIT REPORT ===\n", "info");

    if (this.issues.length === 0) {
      this.log("✅ No critical issues found!", "success");
    } else {
      this.log("❌ Issues found:", "error");
      this.issues.forEach((issue) => {
        this.log(`  • ${issue}`, "error");
      });
    }

    if (this.suggestions.length > 0) {
      this.log("\n💡 Suggestions for improvement:", "warn");
      this.suggestions.forEach((suggestion) => {
        this.log(`  • ${suggestion}`, "warn");
      });
    }

    this.log("\n=== OPTIMIZATION CHECKLIST ===\n", "info");
    this.log("□ Run bundle analyzer: npm run build:analyze", "info");
    this.log("□ Test performance: run Lighthouse audit", "info");
    this.log("□ Check image optimization: ensure WebP formats", "info");
    this.log("□ Verify security headers in production", "info");
    this.log("□ Monitor Core Web Vitals", "info");
    this.log("□ Test mobile performance", "info");

    return {
      issues: this.issues.length,
      suggestions: this.suggestions.length,
      status: this.issues.length === 0 ? "PASS" : "NEEDS_ATTENTION",
    };
  }

  run() {
    this.log("Starting performance audit...", "info");

    this.checkImageOptimization();
    this.checkBundleSize();
    this.checkDependencies();
    this.checkCodeSplitting();
    this.checkSEOOptimization();
    this.checkSecurityHeaders();
    this.checkEnvironmentConfig();

    return this.generateReport();
  }
}

// Run the audit if this script is executed directly
if (require.main === module) {
  const auditor = new PerformanceAuditor();
  const result = auditor.run();

  process.exit(result.status === "PASS" ? 0 : 1);
}

module.exports = PerformanceAuditor;
