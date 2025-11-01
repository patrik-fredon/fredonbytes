#!/usr/bin/env node

/**
 * Icon Generation Script for PWA Manifest
 *
 * This script generates the missing icon sizes for the PWA manifest
 * from the existing 512x512 icon using Sharp (Node.js image processing)
 *
 * Usage: npm run generate-icons
 * Requirements: npm install sharp
 */

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const publicDir = path.join(__dirname, '..', 'public')
const sourceIcon = path.join(publicDir, 'web-app-manifest-512x512.png')

// Icon sizes needed for optimal PWA support
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512]

async function generateIcons() {
  console.log('🔄 Generating PWA icons from 512x512 source...')

  // Check if source icon exists
  if (!fs.existsSync(sourceIcon)) {
    console.error('❌ Source icon not found:', sourceIcon)
    console.log('Please ensure web-app-manifest-512x512.png exists in the public directory')
    process.exit(1)
  }

  try {
    // Load the source image
    const image = sharp(sourceIcon)

    // Generate each icon size
    for (const size of iconSizes) {
      const outputPath = path.join(publicDir, `web-app-manifest-${size}x${size}.png`)

      // Skip if file already exists (except for 512x512 which is our source)
      if (size !== 512 && fs.existsSync(outputPath)) {
        console.log(`⏭️  Skipping ${size}x${size} (already exists)`)
        continue
      }

      // Skip processing the source file itself
      if (size === 512) {
        console.log(`⏭️  Skipping ${size}x${size} (source file)`)
        continue
      }

      await image
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 } // transparent background
        })
        .png()
        .toFile(outputPath)

      console.log(`✅ Generated ${size}x${size} icon`)
    }

    console.log('🎉 All icons generated successfully!')
    console.log('📝 Update your manifest.json to include all icon sizes for optimal PWA support')

  } catch (error) {
    console.error('❌ Error generating icons:', error.message)
    process.exit(1)
  }
}

// Alternative method using ImageMagick if Sharp is not available
function generateIconsWithImageMagick() {
  console.log('🔄 Generating icons using ImageMagick...')

  const { execSync } = require('child_process')

  try {
    // Check if ImageMagick is installed
    execSync('which convert', { stdio: 'pipe' })

    for (const size of iconSizes) {
      if (size === 512) continue // Skip source

      const outputPath = path.join(publicDir, `web-app-manifest-${size}x${size}.png`)

      if (fs.existsSync(outputPath)) {
        console.log(`⏭️  Skipping ${size}x${size} (already exists)`)
        continue
      }

      execSync(`convert "${sourceIcon}" -resize ${size}x${size} "${outputPath}"`)
      console.log('✅ Generated ${size}x${size} icon')
    }

    console.log('🎉 All icons generated successfully!')

  } catch (error) {
    console.error('❌ ImageMagick not found or error occurred')
    console.log('💡 Install ImageMagick: sudo apt-get install imagemagick (Linux)')
    console.log('💡 Or use the Sharp method: npm install sharp')
  }
}

// Run the generation
if (require.main === module) {
  // Check if Sharp is available
  try {
    require('sharp')
    generateIcons()
  } catch (error) {
    console.log('⚠️  Sharp not found, trying ImageMagick...')
    generateIconsWithImageMagick()
  }
}

module.exports = { generateIcons, generateIconsWithImageMagick }