#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Cleanup Script for Fredonbytes
 * Identifies unused dependencies, files, and optimization opportunities
 */

class ProjectCleanup {
  constructor() {
    this.rootPath = path.join(__dirname, "..");
    this.unusedDependencies = [];
    this.unusedFiles = [];
    this.largeFolders = [];
    this.recommendations = [];
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

  getAllFiles(dir, extensions = [".ts", ".tsx", ".js", ".jsx"]) {
    let files = [];

    try {
      const items = fs.readdirSync(dir, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dir, item.name);

        if (item.isDirectory()) {
          // Skip node_modules, .next, .git directories
          if (
            !["node_modules", ".next", ".git", "dist", "out"].includes(
              item.name
            )
          ) {
            files = files.concat(this.getAllFiles(fullPath, extensions));
          }
        } else if (extensions.some((ext) => item.name.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory doesn't exist or no permission
    }

    return files;
  }

  analyzeImports() {
    this.log("Analyzing imports and dependencies...", "info");

    const packageJsonPath = path.join(this.rootPath, "package.json");
    if (!fs.existsSync(packageJsonPath)) {
      this.log("package.json not found", "error");
      return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    const allDependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    const sourceFiles = this.getAllFiles(path.join(this.rootPath, "src"));
    const scriptFiles = this.getAllFiles(path.join(this.rootPath, "scripts"));
    const configFiles = [
      "next.config.ts",
      "tailwind.config.js",
      "postcss.config.js",
      "eslint.config.mjs",
    ]
      .map((file) => path.join(this.rootPath, file))
      .filter(fs.existsSync);

    const allFiles = [...sourceFiles, ...scriptFiles, ...configFiles];
    const usedDependencies = new Set();

    // Analyze each file for imports
    allFiles.forEach((filePath) => {
      try {
        const content = fs.readFileSync(filePath, "utf8");

        // Match import statements
        const importMatches = content.match(
          /(?:import.*from\s+['"`]([^'"`]+)['"`]|require\(['"`]([^'"`]+)['"`]\))/g
        );

        if (importMatches) {
          importMatches.forEach((match) => {
            const moduleMatch = match.match(/['"`]([^'"`]+)['"`]/);
            if (moduleMatch) {
              const moduleName = moduleMatch[1];

              // Extract package name (handle scoped packages)
              let packageName = moduleName;
              if (moduleName.startsWith("@")) {
                const parts = moduleName.split("/");
                packageName = parts.slice(0, 2).join("/");
              } else {
                packageName = moduleName.split("/")[0];
              }

              if (allDependencies[packageName]) {
                usedDependencies.add(packageName);
              }
            }
          });
        }
      } catch (error) {
        // Skip files that can't be read
      }
    });

    // Find unused dependencies
    Object.keys(allDependencies).forEach((dep) => {
      if (!usedDependencies.has(dep)) {
        // Check for special cases that might not be directly imported
        const specialCases = [
          "typescript", // Used by TypeScript compiler
          "eslint", // Used by linting
          "prettier", // Used by formatting
          "@types/", // TypeScript type definitions
          "tailwindcss", // Used by PostCSS
          "@next/bundle-analyzer", // Used conditionally
        ];

        const isSpecialCase = specialCases.some((special) =>
          dep.includes(special)
        );

        if (!isSpecialCase) {
          this.unusedDependencies.push(dep);
        }
      }
    });
  }

  analyzeUnusedFiles() {
    this.log("Analyzing potentially unused files...", "info");

    const commonUnusedPatterns = [
      "*.test.js",
      "*.test.ts",
      "*.test.tsx",
      "*.spec.js",
      "*.spec.ts",
      "*.spec.tsx",
      "*.stories.js",
      "*.stories.ts",
      "*.stories.tsx",
      "README.md",
      "CHANGELOG.md",
      "LICENSE",
      ".github/",
      ".vscode/",
      "docs/",
    ];

    const publicDir = path.join(this.rootPath, "public");
    if (fs.existsSync(publicDir)) {
      const publicFiles = fs.readdirSync(publicDir, { recursive: true });

      publicFiles.forEach((file) => {
        const fullPath = path.join(publicDir, file);
        const stats = fs.statSync(fullPath);

        if (stats.isFile()) {
          const sizeInMB = stats.size / (1024 * 1024);
          if (sizeInMB > 5) {
            // Files larger than 5MB
            this.largeFolders.push(`${file} (${sizeInMB.toFixed(2)}MB)`);
          }
        }
      });
    }
  }

  analyzeFolderSizes() {
    this.log("Analyzing folder sizes...", "info");

    const checkFolderSize = (folderPath) => {
      try {
        const items = fs.readdirSync(folderPath, { withFileTypes: true });
        let totalSize = 0;

        for (const item of items) {
          const itemPath = path.join(folderPath, item.name);

          if (item.isDirectory()) {
            totalSize += checkFolderSize(itemPath);
          } else {
            totalSize += fs.statSync(itemPath).size;
          }
        }

        return totalSize;
      } catch (error) {
        return 0;
      }
    };

    const foldersToCheck = ["src", "public", "scripts", "docs"];

    foldersToCheck.forEach((folder) => {
      const folderPath = path.join(this.rootPath, folder);
      if (fs.existsSync(folderPath)) {
        const size = checkFolderSize(folderPath);
        const sizeInMB = size / (1024 * 1024);

        if (sizeInMB > 10) {
          // Folders larger than 10MB
          this.largeFolders.push(`${folder}/ (${sizeInMB.toFixed(2)}MB)`);
        }
      }
    });
  }

  generateRecommendations() {
    this.log("Generating optimization recommendations...", "info");

    // Check for Next.js specific optimizations
    const nextConfigPath = path.join(this.rootPath, "next.config.ts");
    if (fs.existsSync(nextConfigPath)) {
      const content = fs.readFileSync(nextConfigPath, "utf8");

      if (!content.includes('output: "standalone"')) {
        this.recommendations.push(
          "Consider enabling standalone output for Docker deployments"
        );
      }

      if (!content.includes("experimental")) {
        this.recommendations.push(
          "Consider enabling experimental optimizations in Next.js config"
        );
      }
    }

    // Check for image optimization opportunities
    const publicDir = path.join(this.rootPath, "public");
    if (fs.existsSync(publicDir)) {
      const imageFiles = fs
        .readdirSync(publicDir, { recursive: true })
        .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file));

      if (imageFiles.length > 0) {
        this.recommendations.push(
          `Consider converting ${imageFiles.length} images to WebP format`
        );
      }
    }

    // Check for bundle optimization
    const packageJsonPath = path.join(this.rootPath, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

      if (!packageJson.scripts["build:analyze"]) {
        this.recommendations.push(
          "Add bundle analyzer script for size optimization"
        );
      }
    }
  }

  generateReport() {
    this.log("\n=== CLEANUP ANALYSIS REPORT ===\n", "info");

    if (this.unusedDependencies.length > 0) {
      this.log("📦 Potentially unused dependencies:", "warn");
      this.unusedDependencies.forEach((dep) => {
        this.log(`  • ${dep}`, "warn");
      });
      this.log(
        "\nTo remove: npm uninstall " + this.unusedDependencies.join(" "),
        "info"
      );
    } else {
      this.log("✅ No unused dependencies detected", "success");
    }

    if (this.largeFolders.length > 0) {
      this.log("\n📁 Large files/folders to review:", "warn");
      this.largeFolders.forEach((item) => {
        this.log(`  • ${item}`, "warn");
      });
    }

    if (this.recommendations.length > 0) {
      this.log("\n💡 Optimization recommendations:", "info");
      this.recommendations.forEach((rec) => {
        this.log(`  • ${rec}`, "info");
      });
    }

    this.log("\n=== CLEANUP CHECKLIST ===\n", "info");
    this.log("□ Review and remove unused dependencies", "info");
    this.log("□ Optimize large images (convert to WebP)", "info");
    this.log("□ Remove unused files and assets", "info");
    this.log("□ Run bundle analyzer to check code splitting", "info");
    this.log("□ Clean up old git branches and commits", "info");
    this.log("□ Review and update documentation", "info");

    return {
      unusedDependencies: this.unusedDependencies.length,
      largeItems: this.largeFolders.length,
      recommendations: this.recommendations.length,
    };
  }

  run() {
    this.log("Starting cleanup analysis...", "info");

    this.analyzeImports();
    this.analyzeUnusedFiles();
    this.analyzeFolderSizes();
    this.generateRecommendations();

    return this.generateReport();
  }
}

// Run the cleanup analysis if this script is executed directly
if (require.main === module) {
  const cleanup = new ProjectCleanup();
  cleanup.run();
}

module.exports = ProjectCleanup;
