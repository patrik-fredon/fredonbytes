#!/usr/bin/env node

/**
 * Test script to verify gzip/brotli compression is enabled on deployed site
 * Usage: node scripts/test-compression.js [url]
 */

const https = require('https');
const http = require('http');

const testUrl = process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL || 'https://fredonbytes.cloud';

console.log(`\n🔍 Testing compression for: ${testUrl}\n`);

function testCompression(url, encoding) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'GET',
      headers: {
        'Accept-Encoding': encoding,
        'User-Agent': 'Mozilla/5.0 (compression test)'
      }
    };

    const req = protocol.request(options, (res) => {
      const contentEncoding = res.headers['content-encoding'];
      const contentLength = res.headers['content-length'];
      const contentType = res.headers['content-type'];
      
      let data = [];
      res.on('data', (chunk) => data.push(chunk));
      res.on('end', () => {
        const totalLength = Buffer.concat(data).length;
        resolve({
          encoding,
          contentEncoding,
          contentLength,
          actualLength: totalLength,
          contentType,
          statusCode: res.statusCode
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

async function runTests() {
  const tests = [
    { encoding: 'gzip', name: 'Gzip' },
    { encoding: 'br', name: 'Brotli' },
    { encoding: 'identity', name: 'No compression' }
  ];

  const results = [];

  for (const test of tests) {
    try {
      console.log(`Testing ${test.name}...`);
      const result = await testCompression(testUrl, test.encoding);
      results.push({ ...result, name: test.name });
      
      const compressed = result.contentEncoding === test.encoding;
      const icon = compressed ? '✅' : '❌';
      
      console.log(`${icon} ${test.name}: ${compressed ? 'ENABLED' : 'NOT DETECTED'}`);
      console.log(`   Content-Encoding: ${result.contentEncoding || 'none'}`);
      console.log(`   Response size: ${result.actualLength} bytes`);
      console.log(`   Status: ${result.statusCode}\n`);
    } catch (error) {
      console.error(`❌ ${test.name} test failed:`, error.message, '\n');
    }
  }

  // Summary
  console.log('📊 Summary:');
  console.log('─'.repeat(50));
  
  const gzipResult = results.find(r => r.encoding === 'gzip');
  const brotliResult = results.find(r => r.encoding === 'br');
  const noCompressionResult = results.find(r => r.encoding === 'identity');

  if (gzipResult && gzipResult.contentEncoding === 'gzip') {
    console.log('✅ Gzip compression is ENABLED');
  } else {
    console.log('⚠️  Gzip compression is NOT detected');
  }

  if (brotliResult && brotliResult.contentEncoding === 'br') {
    console.log('✅ Brotli compression is ENABLED');
  } else {
    console.log('⚠️  Brotli compression is NOT detected');
  }

  if (gzipResult && noCompressionResult) {
    const savings = ((1 - gzipResult.actualLength / noCompressionResult.actualLength) * 100).toFixed(1);
    console.log(`\n💾 Compression savings: ~${savings}% reduction in size`);
  }

  console.log('\n📝 Note: Vercel automatically enables gzip and brotli compression');
  console.log('   for all responses. No additional configuration needed.');
  console.log('\n✨ Compression verification complete!\n');
}

runTests().catch(console.error);
