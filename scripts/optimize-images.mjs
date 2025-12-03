#!/usr/bin/env node

/**
 * Image Optimization Script for FredonBytes
 * Optimizes large PNG images to WebP and AVIF formats
 * Reduces bundle size and improves Lighthouse performance scores
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "..", "public");

// Configuration for image optimization
const OPTIMIZATION_CONFIG = [
  {
    name: "Placeholder Project Image",
    input: "placeholder-project-fredon.png",
    outputs: [
      {
        name: "placeholder-project-fredon.webp",
        format: "webp",
        quality: 85,
        maxWidth: 1200,
        description: "WebP format for modern browsers",
      },
      {
        name: "placeholder-project-fredon.avif",
        format: "avif",
        quality: 80,
        maxWidth: 1200,
        description: "AVIF format for maximum compression",
      },
    ],
  },
  {
    name: "Main Logo",
    input: "FredonBytes_GraphicLogo.png",
    outputs: [
      {
        name: "FredonBytes_GraphicLogo.webp",
        format: "webp",
        quality: 90,
        maxWidth: 800,
        description: "WebP logo for header and hero",
      },
      {
        name: "FredonBytes_GraphicLogo.avif",
        format: "avif",
        quality: 85,
        maxWidth: 800,
        description: "AVIF logo for maximum quality",
      },
    ],
  },
  {
    name: "Logo with Background",
    input: "fredonbytes-logo-with-background.png",
    outputs: [
      {
        name: "fredonbytes-logo-with-background.webp",
        format: "webp",
        quality: 85,
        maxWidth: 1000,
        description: "WebP logo with background",
      },
    ],
  },
  {
    name: "OG Image",
    input: "og-image.png",
    outputs: [
      {
        name: "og-image.webp",
        format: "webp",
        quality: 80,
        maxWidth: 1200,
        description: "WebP for Open Graph meta tags",
      },
    ],
  },
  {
    name: "Desktop Screenshot",
    input: "screenshot-desktop.png",
    outputs: [
      {
        name: "screenshot-desktop.webp",
        format: "webp",
        quality: 80,
        maxWidth: 1920,
        description: "WebP desktop screenshot",
      },
    ],
  },
  {
    name: "Mobile Screenshot",
    input: "screenshot-mobile.png",
    outputs: [
      {
        name: "screenshot-mobile.webp",
        format: "webp",
        quality: 80,
        maxWidth: 768,
        description: "WebP mobile screenshot",
      },
    ],
  },
  {
    name: "Web App Manifest 512x512",
    input: "web-app-manifest-512x512.png",
    outputs: [
      {
        name: "web-app-manifest-512x512.webp",
        format: "webp",
        quality: 85,
        maxWidth: 512,
        description: "WebP PWA icon 512x512",
      },
    ],
  },
  {
    name: "Web App Manifest 384x384",
    input: "web-app-manifest-384x384.png",
    outputs: [
      {
        name: "web-app-manifest-384x384.webp",
        format: "webp",
        quality: 85,
        maxWidth: 384,
        description: "WebP PWA icon 384x384",
      },
    ],
  },
];

// Helper function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`;
}

// Helper function to calculate savings percentage
function calculateSavings(original, optimized) {
  const savings = ((original - optimized) / original) * 100;
  return Math.round(savings * 10) / 10;
}

// Main optimization function
async function optimizeImages() {
  console.log("🚀 Starting image optimization...\n");
  console.log("=".repeat(80));

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let totalProcessed = 0;
  let totalErrors = 0;

  for (const config of OPTIMIZATION_CONFIG) {
    console.log(`\n📁 Processing: ${config.name}`);
    console.log("-".repeat(80));

    const inputPath = path.join(publicDir, config.input);

    // Check if input file exists
    try {
      await fs.access(inputPath);
    } catch (error) {
      console.log(`⚠️  Input file not found: ${config.input}`);
      totalErrors++;
      continue;
    }

    // Get original file size
    const originalStats = await fs.stat(inputPath);
    const originalSize = originalStats.size;
    totalOriginalSize += originalSize;

    console.log(`📊 Original: ${formatBytes(originalSize)}`);

    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    console.log(`📐 Dimensions: ${metadata.width}x${metadata.height}px`);

    for (const output of config.outputs) {
      const outputPath = path.join(publicDir, output.name);

      try {
        // Create sharp instance
        let sharpInstance = sharp(inputPath);

        // Resize if needed
        if (output.maxWidth && metadata.width > output.maxWidth) {
          sharpInstance = sharpInstance.resize(output.maxWidth, null, {
            withoutEnlargement: true,
            fit: "inside",
          });
        }

        // Convert to specified format
        if (output.format === "webp") {
          sharpInstance = sharpInstance.webp({
            quality: output.quality,
            effort: 6, // Max compression effort
          });
        } else if (output.format === "avif") {
          sharpInstance = sharpInstance.avif({
            quality: output.quality,
            effort: 9, // Max compression effort
          });
        }

        // Save the optimized image
        await sharpInstance.toFile(outputPath);

        // Get optimized file size
        const optimizedStats = await fs.stat(outputPath);
        const optimizedSize = optimizedStats.size;
        totalOptimizedSize += optimizedSize;

        const savings = calculateSavings(originalSize, optimizedSize);

        console.log(`  ✅ ${output.name}`);
        console.log(`     Format: ${output.format.toUpperCase()}`);
        console.log(`     Size: ${formatBytes(optimizedSize)}`);
        console.log(
          `     Savings: ${savings}% (${formatBytes(originalSize - optimizedSize)} saved)`,
        );
        console.log(`     Description: ${output.description}`);

        totalProcessed++;
      } catch (error) {
        console.log(`  ❌ Failed to optimize ${output.name}`);
        console.log(`     Error: ${error.message}`);
        totalErrors++;
      }
    }
  }

  // Summary
  console.log(`\n${"=".repeat(80)}`);
  console.log("📊 OPTIMIZATION SUMMARY");
  console.log("=".repeat(80));
  console.log(`✅ Files processed: ${totalProcessed}`);
  console.log(`❌ Errors: ${totalErrors}`);
  console.log(`📦 Total original size: ${formatBytes(totalOriginalSize)}`);
  console.log(`📦 Total optimized size: ${formatBytes(totalOptimizedSize)}`);
  console.log(
    `💾 Total saved: ${formatBytes(totalOriginalSize - totalOptimizedSize)}`,
  );
  console.log(
    `📈 Overall savings: ${calculateSavings(totalOriginalSize, totalOptimizedSize)}%`,
  );
  console.log("=".repeat(80));
  console.log("\n✨ Optimization complete!\n");

  // Recommendations
  console.log("📋 NEXT STEPS:");
  console.log("1. Update Image components to use .webp or .avif files");
  console.log("2. Add fallback to original .png for older browsers");
  console.log("3. Test images in your application");
  console.log("4. Run Lighthouse to verify performance improvements\n");
}

// Run the optimization
optimizeImages().catch((error) => {
  console.error("❌ Optimization failed:", error);
  process.exit(1);
});
