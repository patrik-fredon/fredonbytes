#!/usr/bin/env node

/**
 * Performance Testing Script for Project Gallery
 * 
 * This script helps verify the performance optimizations implemented in task 5.6:
 * - Lazy loading with Next.js Image
 * - Intersection observer for animation triggers
 * - Dynamic imports for bundle size optimization
 * 
 * Usage:
 *   node scripts/test-performance.js
 * 
 * Requirements:
 *   - Development server must be running (npm run dev)
 *   - Chrome/Chromium browser installed
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Project Gallery Performance Testing\n');

// Check if development server is running
console.log('📋 Pre-flight checks:');
try {
  execSync('curl -s http://localhost:3000 > /dev/null', { stdio: 'ignore' });
  console.log('✅ Development server is running');
} catch (error) {
  console.error('❌ Development server is not running');
  console.error('   Please start it with: npm run dev');
  process.exit(1);
}

// Check if Lighthouse is installed
console.log('\n📊 Performance Analysis:');
try {
  execSync('which lighthouse', { stdio: 'ignore' });
  console.log('✅ Lighthouse CLI is available');
  
  console.log('\n🔍 Running Lighthouse audit on /projects page...');
  console.log('   This may take a minute...\n');
  
  const outputPath = path.join(__dirname, '../.lighthouse-results.json');
  
  try {
    execSync(
      `lighthouse http://localhost:3000/projects --output=json --output-path=${outputPath} --chrome-flags="--headless" --quiet`,
      { stdio: 'inherit' }
    );
    
    // Read and parse results
    const results = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    const categories = results.categories;
    
    console.log('\n📈 Lighthouse Results:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Performance:    ${Math.round(categories.performance.score * 100)}/100`);
    console.log(`Accessibility:  ${Math.round(categories.accessibility.score * 100)}/100`);
    console.log(`Best Practices: ${Math.round(categories['best-practices'].score * 100)}/100`);
    console.log(`SEO:            ${Math.round(categories.seo.score * 100)}/100`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Check Core Web Vitals
    const audits = results.audits;
    console.log('\n⚡ Core Web Vitals:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (audits['largest-contentful-paint']) {
      const lcp = audits['largest-contentful-paint'].numericValue / 1000;
      const lcpStatus = lcp < 2.5 ? '✅' : lcp < 4.0 ? '⚠️' : '❌';
      console.log(`${lcpStatus} LCP: ${lcp.toFixed(2)}s (target: < 2.5s)`);
    }
    
    if (audits['first-input-delay']) {
      const fid = audits['first-input-delay'].numericValue;
      const fidStatus = fid < 100 ? '✅' : fid < 300 ? '⚠️' : '❌';
      console.log(`${fidStatus} FID: ${fid.toFixed(0)}ms (target: < 100ms)`);
    }
    
    if (audits['cumulative-layout-shift']) {
      const cls = audits['cumulative-layout-shift'].numericValue;
      const clsStatus = cls < 0.1 ? '✅' : cls < 0.25 ? '⚠️' : '❌';
      console.log(`${clsStatus} CLS: ${cls.toFixed(3)} (target: < 0.1)`);
    }
    
    if (audits['total-blocking-time']) {
      const tbt = audits['total-blocking-time'].numericValue;
      const tbtStatus = tbt < 200 ? '✅' : tbt < 600 ? '⚠️' : '❌';
      console.log(`${tbtStatus} TBT: ${tbt.toFixed(0)}ms (target: < 200ms)`);
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Check image optimization
    console.log('\n🖼️  Image Optimization:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (audits['modern-image-formats']) {
      const score = audits['modern-image-formats'].score;
      const status = score === 1 ? '✅' : score > 0.5 ? '⚠️' : '❌';
      console.log(`${status} Modern image formats: ${Math.round(score * 100)}%`);
    }
    
    if (audits['offscreen-images']) {
      const score = audits['offscreen-images'].score;
      const status = score === 1 ? '✅' : score > 0.5 ? '⚠️' : '❌';
      console.log(`${status} Lazy loading images: ${Math.round(score * 100)}%`);
    }
    
    if (audits['uses-optimized-images']) {
      const score = audits['uses-optimized-images'].score;
      const status = score === 1 ? '✅' : score > 0.5 ? '⚠️' : '❌';
      console.log(`${status} Optimized images: ${Math.round(score * 100)}%`);
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Check JavaScript optimization
    console.log('\n📦 JavaScript Bundle:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (audits['unused-javascript']) {
      const score = audits['unused-javascript'].score;
      const status = score === 1 ? '✅' : score > 0.5 ? '⚠️' : '❌';
      const savings = audits['unused-javascript'].details?.overallSavingsBytes || 0;
      console.log(`${status} Unused JavaScript: ${Math.round(score * 100)}% (${(savings / 1024).toFixed(0)} KB potential savings)`);
    }
    
    if (audits['total-byte-weight']) {
      const bytes = audits['total-byte-weight'].numericValue;
      const kb = (bytes / 1024).toFixed(0);
      const status = bytes < 1024 * 1024 ? '✅' : bytes < 2 * 1024 * 1024 ? '⚠️' : '❌';
      console.log(`${status} Total page weight: ${kb} KB`);
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n✨ Full report saved to: .lighthouse-results.json');
    console.log('   View in browser: https://googlechrome.github.io/lighthouse/viewer/');
    
    // Overall assessment
    const perfScore = categories.performance.score * 100;
    console.log('\n📊 Overall Assessment:');
    if (perfScore >= 90) {
      console.log('✅ Excellent! Performance optimizations are working well.');
    } else if (perfScore >= 70) {
      console.log('⚠️  Good, but there\'s room for improvement.');
    } else {
      console.log('❌ Performance needs attention. Review the recommendations above.');
    }
    
  } catch (error) {
    console.error('❌ Failed to run Lighthouse audit');
    console.error('   Error:', error.message);
    process.exit(1);
  }
  
} catch (error) {
  console.log('⚠️  Lighthouse CLI not found');
  console.log('   Install with: npm install -g lighthouse');
  console.log('\n📝 Manual Testing Checklist:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('1. ✓ Open http://localhost:3000/projects in Chrome');
  console.log('2. ✓ Open DevTools (F12) → Network tab');
  console.log('3. ✓ Verify images load lazily (only when scrolling)');
  console.log('4. ✓ Check that first 3 images load with priority');
  console.log('5. ✓ Verify animations trigger when cards enter viewport');
  console.log('6. ✓ Open Performance tab and record page load');
  console.log('7. ✓ Check for smooth 60fps animations');
  console.log('8. ✓ Test on mobile device or DevTools mobile emulation');
  console.log('9. ✓ Verify reduced motion preference is respected');
  console.log('10. ✓ Check bundle size in Network tab (should be optimized)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

console.log('\n✅ Performance testing complete!\n');
