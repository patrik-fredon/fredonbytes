#!/usr/bin/env node

// Vercel deployment optimization script
// This script ensures optimal build and deployment for Vercel

import fs from "fs";
import path from "path";

console.log("🚀 Starting Vercel deployment optimization...\n");

// 1. Check for environment variables
function checkEnvironmentSetup() {
  console.log("📋 Checking environment configuration...");

  const envExample = path.join(process.cwd(), ".env.example");
  const envLocal = path.join(process.cwd(), ".env.local");
  const envProduction = path.join(process.cwd(), ".env.production");

  if (!fs.existsSync(envExample)) {
    console.warn("⚠️  .env.example file not found");
  } else {
    console.log("✅ .env.example file exists");
  }

  if (!fs.existsSync(envLocal) && !fs.existsSync(envProduction)) {
    console.warn(
      "⚠️  No environment files found. Make sure to set up environment variables in Vercel dashboard"
    );
  } else {
    console.log("✅ Environment file found");
  }
}

// 2. Check Next.js configuration
function checkNextConfig() {
  console.log("\n🔧 Checking Next.js configuration...");

  const nextConfig = path.join(process.cwd(), "next.config.ts");

  if (!fs.existsSync(nextConfig)) {
    console.error("❌ next.config.ts not found");
    return false;
  }

  const configContent = fs.readFileSync(nextConfig, "utf-8");

  // Check for important optimizations
  const hasImageOptimization = configContent.includes("images:");
  const hasHeaders = configContent.includes("headers()");
  const hasOutput = configContent.includes("output:");

  console.log(
    `${hasImageOptimization ? "✅" : "⚠️"} Image optimization ${hasImageOptimization ? "configured" : "missing"}`
  );
  console.log(
    `${hasHeaders ? "✅" : "⚠️"} Security headers ${hasHeaders ? "configured" : "missing"}`
  );
  console.log(
    `${hasOutput ? "✅" : "⚠️"} Output configuration ${hasOutput ? "set" : "missing"}`
  );

  return true;
}

// 3. Check Vercel configuration
function checkVercelConfig() {
  console.log("\n⚙️ Checking Vercel configuration...");

  const vercelConfig = path.join(process.cwd(), "vercel.json");

  if (!fs.existsSync(vercelConfig)) {
    console.warn("⚠️  vercel.json not found");
    return false;
  }

  try {
    const config = JSON.parse(fs.readFileSync(vercelConfig, "utf-8"));

    console.log(
      `✅ Vercel config version: ${config.version || "not specified"}`
    );
    console.log(
      `${config.regions ? "✅" : "⚠️"} Regions ${config.regions ? "configured" : "not specified"}`
    );
    console.log(
      `${config.headers ? "✅" : "⚠️"} Headers ${config.headers ? "configured" : "not configured"}`
    );
    console.log(
      `${config.functions ? "✅" : "⚠️"} Functions ${config.functions ? "configured" : "not configured"}`
    );

    return true;
  } catch (error) {
    console.error("❌ Error parsing vercel.json:", error.message);
    return false;
  }
}

// 4. Check package.json scripts
function checkPackageScripts() {
  console.log("\n📦 Checking package.json scripts...");

  const packagePath = path.join(process.cwd(), "package.json");

  if (!fs.existsSync(packagePath)) {
    console.error("❌ package.json not found");
    return false;
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, "utf-8"));
    const scripts = pkg.scripts || {};

    const requiredScripts = ["build", "start", "dev"];
    const optimizationScripts = [
      "lint",
      "type-check",
      "pre-deploy",
      "vercel-build",
    ];

    requiredScripts.forEach((script) => {
      console.log(
        `${scripts[script] ? "✅" : "❌"} ${script} script ${scripts[script] ? "exists" : "missing"}`
      );
    });

    optimizationScripts.forEach((script) => {
      console.log(
        `${scripts[script] ? "✅" : "⚠️"} ${script} script ${scripts[script] ? "exists" : "missing"}`
      );
    });

    return true;
  } catch (error) {
    console.error("❌ Error parsing package.json:", error.message);
    return false;
  }
}

// 5. Check translation completeness
function checkTranslations() {
  console.log("\n🌐 Checking translations...");

  const localesPath = path.join(process.cwd(), "src", "app", "locales");

  if (!fs.existsSync(localesPath)) {
    console.warn("⚠️  Locales directory not found");
    return false;
  }

  const languages = fs.readdirSync(localesPath);
  console.log(
    `📚 Found ${languages.length} languages: ${languages.join(", ")}`
  );

  languages.forEach((lang) => {
    const commonFile = path.join(localesPath, lang, "common.json");
    if (fs.existsSync(commonFile)) {
      try {
        const content = fs.readFileSync(commonFile, "utf-8");
        const todoCount = (content.match(/TODO:/g) || []).length;
        console.log(
          `${todoCount === 0 ? "✅" : "⚠️"} ${lang.toUpperCase()}: ${todoCount} TODO items remaining`
        );
      } catch (error) {
        console.error(`❌ Error reading ${lang} translations:`, error.message);
      }
    }
  });

  return true;
}

// 6. Generate deployment recommendations
function generateRecommendations() {
  console.log("\n💡 Deployment Recommendations:");

  const recommendations = [
    {
      category: "Performance",
      items: [
        "Ensure all images are optimized (WebP/AVIF)",
        "Use dynamic imports for heavy components",
        "Implement proper caching strategies",
        "Monitor Core Web Vitals",
      ],
    },
    {
      category: "Security",
      items: [
        "Set up proper CSP headers",
        "Use HTTPS everywhere",
        "Validate all environment variables",
        "Implement rate limiting for API routes",
      ],
    },
    {
      category: "SEO",
      items: [
        "Complete all missing translations",
        "Ensure proper meta tags for all pages",
        "Implement structured data",
        "Set up proper redirects",
      ],
    },
    {
      category: "Monitoring",
      items: [
        "Set up error tracking (Sentry)",
        "Configure analytics properly",
        "Monitor build times",
        "Set up performance monitoring",
      ],
    },
  ];

  recommendations.forEach(({ category, items }) => {
    console.log(`\n${category}:`);
    items.forEach((item) => {
      console.log(`  • ${item}`);
    });
  });
}

// Main execution
function main() {
  try {
    checkEnvironmentSetup();
    checkNextConfig();
    checkVercelConfig();
    checkPackageScripts();
    checkTranslations();
    generateRecommendations();

    console.log("\n✨ Optimization check completed!");
    console.log("\n📋 Next Steps:");
    console.log("  1. Complete remaining translations");
    console.log("  2. Set environment variables in Vercel dashboard");
    console.log("  3. Test build locally: npm run build");
    console.log("  4. Deploy to Vercel: vercel --prod");
  } catch (error) {
    console.error("❌ Optimization check failed:", error.message);
    process.exit(1);
  }
}

main();
