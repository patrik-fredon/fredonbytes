#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Deployment Readiness Checker for Fredonbytes
 * Comprehensive check before Coolify deployment
 */

class DeploymentReadiness {
  constructor() {
    this.rootPath = path.join(__dirname, "..");
    this.checks = [];
    this.warnings = [];
    this.errors = [];
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

  checkRequired(name, path, isRequired = true) {
    const exists = fs.existsSync(path);
    const status = exists ? "✅" : isRequired ? "❌" : "⚠️";
    const message = `${status} ${name}: ${exists ? "Found" : "Missing"}`;

    this.checks.push({ name, exists, required: isRequired, message });

    if (!exists && isRequired) {
      this.errors.push(`Missing required file: ${name}`);
    } else if (!exists && !isRequired) {
      this.warnings.push(`Optional file missing: ${name}`);
    }

    return exists;
  }

  checkEnvironmentFiles() {
    this.log("\n📋 Checking Environment Configuration...", "info");

    this.checkRequired(
      "Environment Example",
      path.join(this.rootPath, ".env.example"),
      true
    );
    this.checkRequired(
      "Environment Local",
      path.join(this.rootPath, ".env.local"),
      false
    );
    this.checkRequired(
      "Environment Production",
      path.join(this.rootPath, ".env.production"),
      false
    );
  }

  checkDeploymentFiles() {
    this.log("\n🐳 Checking Deployment Files...", "info");

    this.checkRequired(
      "Dockerfile",
      path.join(this.rootPath, "Dockerfile"),
      true
    );
    this.checkRequired(
      "Docker Ignore",
      path.join(this.rootPath, ".dockerignore"),
      true
    );
    this.checkRequired(
      "Git Ignore",
      path.join(this.rootPath, ".gitignore"),
      true
    );
  }

  checkConfigurationFiles() {
    this.log("\n⚙️ Checking Configuration Files...", "info");

    this.checkRequired(
      "Next.js Config",
      path.join(this.rootPath, "next.config.ts"),
      true
    );
    this.checkRequired(
      "TypeScript Config",
      path.join(this.rootPath, "tsconfig.json"),
      true
    );
    this.checkRequired(
      "ESLint Config",
      path.join(this.rootPath, "eslint.config.mjs"),
      true
    );
    this.checkRequired(
      "Package.json",
      path.join(this.rootPath, "package.json"),
      true
    );
  }

  checkSEOFiles() {
    this.log("\n🔍 Checking SEO Configuration...", "info");

    this.checkRequired(
      "Robots.txt",
      path.join(this.rootPath, "public/robots.txt"),
      true
    );
    this.checkRequired(
      "Sitemap",
      path.join(this.rootPath, "src/app/sitemap.ts"),
      true
    );
    this.checkRequired(
      "Favicon",
      path.join(this.rootPath, "public/favicon.ico"),
      false
    );
    this.checkRequired(
      "Apple Touch Icon",
      path.join(this.rootPath, "public/apple-touch-icon.png"),
      false
    );
  }

  checkAPIRoutes() {
    this.log("\n🔗 Checking API Routes...", "info");

    this.checkRequired(
      "Health Check",
      path.join(this.rootPath, "src/app/api/health/route.ts"),
      true
    );
    this.checkRequired(
      "Contact API",
      path.join(this.rootPath, "src/app/api/contact/route.ts"),
      false
    );
  }

  checkDocumentation() {
    this.log("\n📚 Checking Documentation...", "info");

    this.checkRequired("README", path.join(this.rootPath, "README.md"), true);
    this.checkRequired(
      "Deployment Guide",
      path.join(this.rootPath, "docs/COOLIFY_DEPLOYMENT_GUIDE.md"),
      true
    );
    this.checkRequired(
      "Optimization Plan",
      path.join(this.rootPath, "docs/COOLIFY_DEPLOYMENT_OPTIMIZATION_PLAN.md"),
      true
    );
  }

  checkPackageJson() {
    this.log("\n📦 Checking Package.json Configuration...", "info");

    const packageJsonPath = path.join(this.rootPath, "package.json");
    if (!fs.existsSync(packageJsonPath)) {
      this.errors.push("package.json not found");
      return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    // Check required scripts
    const requiredScripts = ["build", "start", "lint", "type-check"];
    requiredScripts.forEach((script) => {
      if (packageJson.scripts[script]) {
        this.log(`✅ Script '${script}': Found`, "success");
      } else {
        this.errors.push(`Missing required script: ${script}`);
        this.log(`❌ Script '${script}': Missing`, "error");
      }
    });

    // Check for production optimization scripts
    const optimizationScripts = [
      "build:production",
      "pre-deploy",
      "performance:audit",
    ];
    optimizationScripts.forEach((script) => {
      if (packageJson.scripts[script]) {
        this.log(`✅ Optimization script '${script}': Found`, "success");
      } else {
        this.warnings.push(`Optional script missing: ${script}`);
        this.log(`⚠️ Optimization script '${script}': Missing`, "warn");
      }
    });
  }

  checkNextConfig() {
    this.log("\n⚡ Checking Next.js Configuration...", "info");

    const nextConfigPath = path.join(this.rootPath, "next.config.ts");
    if (!fs.existsSync(nextConfigPath)) {
      this.errors.push("next.config.ts not found");
      return;
    }

    const content = fs.readFileSync(nextConfigPath, "utf8");

    const checks = [
      {
        name: "Compression enabled",
        pattern: /compress:\s*true/,
        required: true,
      },
      { name: "Security headers", pattern: /headers\(\)/, required: true },
      { name: "Image optimization", pattern: /images:\s*{/, required: true },
      {
        name: "Bundle analyzer",
        pattern: /withBundleAnalyzer/,
        required: false,
      },
      {
        name: "Standalone output",
        pattern: /output:\s*["']standalone["']/,
        required: true,
      },
    ];

    checks.forEach((check) => {
      if (check.pattern.test(content)) {
        this.log(`✅ ${check.name}: Configured`, "success");
      } else if (check.required) {
        this.errors.push(`Next.js config missing: ${check.name}`);
        this.log(`❌ ${check.name}: Not configured`, "error");
      } else {
        this.warnings.push(`Next.js optimization missing: ${check.name}`);
        this.log(`⚠️ ${check.name}: Not configured`, "warn");
      }
    });
  }

  checkTypeScriptConfig() {
    this.log("\n🔧 Checking TypeScript Configuration...", "info");

    const tsConfigPath = path.join(this.rootPath, "tsconfig.json");
    if (!fs.existsSync(tsConfigPath)) {
      this.errors.push("tsconfig.json not found");
      return;
    }

    const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, "utf8"));

    if (tsConfig.compilerOptions.strict) {
      this.log("✅ Strict mode: Enabled", "success");
    } else {
      this.warnings.push("TypeScript strict mode not enabled");
      this.log("⚠️ Strict mode: Disabled", "warn");
    }

    if (tsConfig.compilerOptions.paths) {
      this.log("✅ Path aliases: Configured", "success");
    } else {
      this.warnings.push("Path aliases not configured");
      this.log("⚠️ Path aliases: Not configured", "warn");
    }
  }

  checkDockerfile() {
    this.log("\n🐳 Checking Dockerfile Configuration...", "info");

    const dockerfilePath = path.join(this.rootPath, "Dockerfile");
    if (!fs.existsSync(dockerfilePath)) {
      this.errors.push("Dockerfile not found");
      return;
    }

    const content = fs.readFileSync(dockerfilePath, "utf8");

    const checks = [
      { name: "Multi-stage build", pattern: /FROM.*AS\s+\w+/, required: true },
      { name: "Non-root user", pattern: /USER\s+(?!root)/, required: true },
      { name: "Health check", pattern: /HEALTHCHECK/, required: false },
      { name: "Environment variables", pattern: /ENV/, required: true },
      {
        name: "Proper port exposure",
        pattern: /EXPOSE\s+3000/,
        required: true,
      },
    ];

    checks.forEach((check) => {
      if (check.pattern.test(content)) {
        this.log(`✅ ${check.name}: Configured`, "success");
      } else if (check.required) {
        this.errors.push(`Dockerfile missing: ${check.name}`);
        this.log(`❌ ${check.name}: Not configured`, "error");
      } else {
        this.warnings.push(`Dockerfile optimization missing: ${check.name}`);
        this.log(`⚠️ ${check.name}: Not configured`, "warn");
      }
    });
  }

  checkSecurityConfiguration() {
    this.log("\n🔒 Checking Security Configuration...", "info");

    // Check for sensitive files that shouldn't be committed
    const sensitiveFiles = [".env", ".env.local", ".env.production"];
    sensitiveFiles.forEach((file) => {
      const filePath = path.join(this.rootPath, file);
      if (fs.existsSync(filePath)) {
        this.warnings.push(
          `Sensitive file found: ${file} (ensure it's in .gitignore)`
        );
        this.log(`⚠️ ${file}: Found (check .gitignore)`, "warn");
      }
    });

    // Check .gitignore
    const gitignorePath = path.join(this.rootPath, ".gitignore");
    if (fs.existsSync(gitignorePath)) {
      const content = fs.readFileSync(gitignorePath, "utf8");

      const patterns = [".env", "node_modules", ".next"];
      patterns.forEach((pattern) => {
        if (content.includes(pattern)) {
          this.log(`✅ .gitignore includes: ${pattern}`, "success");
        } else {
          this.warnings.push(`.gitignore missing pattern: ${pattern}`);
          this.log(`⚠️ .gitignore missing: ${pattern}`, "warn");
        }
      });
    }
  }

  generateReadinessScore() {
    const totalChecks = this.checks.length;
    const passedChecks = this.checks.filter((check) => check.exists).length;
    const score = Math.round((passedChecks / totalChecks) * 100);

    return {
      score,
      total: totalChecks,
      passed: passedChecks,
      errors: this.errors.length,
      warnings: this.warnings.length,
    };
  }

  generateReport() {
    const readiness = this.generateReadinessScore();

    this.log("\n=== DEPLOYMENT READINESS REPORT ===\n", "info");

    this.log(
      `📊 Readiness Score: ${readiness.score}% (${readiness.passed}/${readiness.total})`,
      "info"
    );

    if (readiness.errors === 0) {
      this.log("✅ Ready for deployment!", "success");
    } else {
      this.log("❌ Issues must be resolved before deployment", "error");
    }

    if (this.errors.length > 0) {
      this.log("\n🚨 Critical Issues:", "error");
      this.errors.forEach((error) => {
        this.log(`  • ${error}`, "error");
      });
    }

    if (this.warnings.length > 0) {
      this.log("\n⚠️ Warnings:", "warn");
      this.warnings.forEach((warning) => {
        this.log(`  • ${warning}`, "warn");
      });
    }

    this.log("\n=== PRE-DEPLOYMENT CHECKLIST ===\n", "info");
    this.log("□ All environment variables configured in Coolify", "info");
    this.log("□ Domain and SSL certificate ready", "info");
    this.log("□ Database connections tested (if applicable)", "info");
    this.log("□ External services configured (email, analytics)", "info");
    this.log("□ Backup strategy in place", "info");
    this.log("□ Monitoring and logging configured", "info");
    this.log("□ Team notified of deployment", "info");

    return readiness;
  }

  run() {
    this.log("🚀 Starting Deployment Readiness Check...", "info");

    this.checkEnvironmentFiles();
    this.checkDeploymentFiles();
    this.checkConfigurationFiles();
    this.checkSEOFiles();
    this.checkAPIRoutes();
    this.checkDocumentation();
    this.checkPackageJson();
    this.checkNextConfig();
    this.checkTypeScriptConfig();
    this.checkDockerfile();
    this.checkSecurityConfiguration();

    return this.generateReport();
  }
}

// Run the readiness check if this script is executed directly
if (require.main === module) {
  const checker = new DeploymentReadiness();
  const result = checker.run();

  process.exit(result.errors === 0 ? 0 : 1);
}

module.exports = DeploymentReadiness;
