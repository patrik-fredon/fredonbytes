# Project Gallery Images Guide

## Overview

This guide explains how to manage images for the project gallery, including adding new images, optimizing them, and updating project records.

## Image Requirements

### Technical Specifications

- **Format**: WebP (preferred), PNG, or JPEG
- **Dimensions**: 
  - Recommended: 1200x800px (3:2 aspect ratio)
  - Minimum: 800x533px
  - Maximum: 2400x1600px
- **File Size**: < 500KB (optimized)
- **Color Space**: sRGB
- **Naming Convention**: `project-{slug}-{variant}.{ext}`
  - Example: `project-fredonbytes-website-hero.webp`

### Visual Guidelines

- Use high-quality screenshots or mockups
- Ensure consistent aspect ratio across all projects
- Include branding elements when appropriate
- Avoid text-heavy images (use description instead)
- Consider dark mode compatibility

## Image Storage Options

### Option 1: Local Storage (Current)

Store images in the `/public` folder:

```
public/
├── projects/
│   ├── project-fredonbytes-website.webp
│   ├── project-cloud-infrastructure.webp
│   ├── project-ecommerce-migration.webp
│   └── ...
```

**Pros:**
- Simple deployment
- No external dependencies
- Fast local development

**Cons:**
- Increases repository size
- Limited optimization options
- No automatic resizing

**Usage in database:**
```sql
image_url = '/projects/project-fredonbytes-website.webp'
```

### Option 2: CDN Storage (Recommended for Production)

Use a CDN service like Cloudinary, Vercel Blob, or Supabase Storage:

**Pros:**
- Automatic optimization
- Responsive images
- Global distribution
- Reduced repository size

**Cons:**
- External dependency
- Potential costs
- Requires configuration

**Usage in database:**
```sql
image_url = 'https://cdn.example.com/projects/project-fredonbytes-website.webp'
```

### Option 3: Supabase Storage (Integrated)

Store images in Supabase Storage buckets:

**Setup:**
```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true);

-- Set up RLS policy
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-images');
```

**Usage in database:**
```sql
image_url = 'https://{project-ref}.supabase.co/storage/v1/object/public/project-images/project-fredonbytes-website.webp'
```

## Adding New Project Images

### Step 1: Prepare the Image

1. **Capture/Create the Image**
   - Take a screenshot of the live project
   - Create a mockup in Figma/Sketch
   - Use a professional photo

2. **Optimize the Image**
   ```bash
   # Using ImageMagick
   convert input.png -resize 1200x800^ -gravity center -extent 1200x800 -quality 85 output.webp
   
   # Using cwebp (WebP encoder)
   cwebp -q 85 -resize 1200 800 input.png -o output.webp
   
   # Using online tools
   # - TinyPNG (https://tinypng.com/)
   # - Squoosh (https://squoosh.app/)
   # - Cloudinary (https://cloudinary.com/tools/image-optimizer)
   ```

3. **Verify Quality**
   - Check file size (< 500KB)
   - Verify dimensions (1200x800px)
   - Test on different devices

### Step 2: Upload the Image

**For Local Storage:**
```bash
# Copy to public folder
cp optimized-image.webp public/projects/project-{slug}.webp

# Commit to repository
git add public/projects/project-{slug}.webp
git commit -m "Add project image for {project-name}"
```

**For Supabase Storage:**
```bash
# Using Supabase CLI
supabase storage upload project-images project-{slug}.webp

# Or via Supabase Dashboard:
# 1. Navigate to Storage
# 2. Select 'project-images' bucket
# 3. Click 'Upload file'
# 4. Select your optimized image
```

**For CDN (Cloudinary example):**
```bash
# Using Cloudinary CLI
cloudinary upload project-{slug}.webp --folder projects

# Or via web interface
```

### Step 3: Update Database

```sql
-- Update existing project
UPDATE projects
SET image_url = '/projects/project-{slug}.webp',
    updated_at = NOW()
WHERE id = '{project-id}';

-- Or insert new project with image
INSERT INTO projects (
  title,
  description,
  short_description,
  image_url,
  -- ... other fields
) VALUES (
  '{"en": "Project Title", "cs": "...", "de": "..."}'::jsonb,
  '{"en": "Description", "cs": "...", "de": "..."}'::jsonb,
  '{"en": "Short desc", "cs": "...", "de": "..."}'::jsonb,
  '/projects/project-{slug}.webp',
  -- ... other values
);
```

## Image Optimization Best Practices

### 1. Use Next.js Image Component

The project gallery already uses Next.js Image component for automatic optimization:

```tsx
<Image
  src={project.image_url}
  alt={project.title[locale]}
  width={1200}
  height={800}
  className="..."
  loading="lazy"
/>
```

**Benefits:**
- Automatic format conversion (WebP, AVIF)
- Responsive image sizes
- Lazy loading
- Blur placeholder

### 2. Provide Multiple Sizes

For CDN storage, provide multiple sizes:

```
project-{slug}-sm.webp   (400x267)
project-{slug}-md.webp   (800x533)
project-{slug}-lg.webp   (1200x800)
project-{slug}-xl.webp   (2400x1600)
```

### 3. Use Blur Placeholders

Generate blur placeholders for better UX:

```bash
# Generate base64 blur placeholder
convert input.webp -resize 20x13 -blur 0x2 txt:- | \
  convert txt:- -resize 20x13! blur-placeholder.webp
```

## Placeholder Image Strategy

### Current Placeholder

The project currently uses `/placeholder-project-fredon.png` for all sample projects.

### Creating Custom Placeholders

**Option 1: Branded Placeholder**
```bash
# Create a branded placeholder with logo
convert -size 1200x800 xc:#1a1a1a \
  -gravity center \
  logo.png -composite \
  -pointsize 48 -fill white -gravity south \
  -annotate +0+100 "Project Image Coming Soon" \
  placeholder-branded.webp
```

**Option 2: Category-Specific Placeholders**
```
placeholder-web-development.webp
placeholder-mobile-app.webp
placeholder-infrastructure.webp
placeholder-data-analytics.webp
```

**Option 3: Dynamic Placeholders**
Use a service like:
- https://placehold.co/1200x800/1a1a1a/ffffff?text=Project+Name
- https://via.placeholder.com/1200x800/1a1a1a/ffffff?text=Project+Name

## Updating Existing Projects

### Bulk Update Script

```sql
-- Update all projects using placeholder to new images
UPDATE projects
SET image_url = CASE display_order
  WHEN 1 THEN '/projects/project-fredonbytes-website.webp'
  WHEN 2 THEN '/projects/project-cloud-infrastructure.webp'
  WHEN 3 THEN '/projects/project-ecommerce-migration.webp'
  WHEN 4 THEN '/projects/project-analytics-dashboard.webp'
  WHEN 5 THEN '/projects/project-mobile-banking.webp'
  WHEN 6 THEN '/projects/project-devops-monitoring.webp'
  WHEN 7 THEN '/projects/project-ai-cms.webp'
  WHEN 8 THEN '/projects/project-blockchain-supply.webp'
  ELSE image_url
END,
updated_at = NOW()
WHERE image_url = '/placeholder-project-fredon.png';
```

## Testing Images

### Local Testing

```bash
# Start development server
npm run dev

# Navigate to projects page
open http://localhost:3000/projects

# Check browser console for image loading errors
# Verify responsive behavior at different screen sizes
```

### Production Testing

```bash
# Build and test production bundle
npm run build
npm run start

# Test with Lighthouse
npm run lighthouse -- http://localhost:3000/projects

# Check image optimization scores
```

### Accessibility Testing

- Verify alt text is descriptive
- Check color contrast for overlays
- Test keyboard navigation
- Verify screen reader compatibility

## Troubleshooting

### Image Not Loading

1. **Check file path**
   ```sql
   SELECT id, title->>'en', image_url FROM projects;
   ```

2. **Verify file exists**
   ```bash
   ls -la public/projects/
   ```

3. **Check browser console** for 404 errors

4. **Verify Next.js Image domains** (for external URLs)
   ```typescript
   // next.config.ts
   images: {
     domains: ['cdn.example.com', 'supabase.co'],
   }
   ```

### Image Quality Issues

1. **Check original resolution** (should be at least 1200x800)
2. **Verify compression settings** (quality 80-90 for WebP)
3. **Test on different devices** (mobile, tablet, desktop)
4. **Check Next.js Image optimization** in Network tab

### Performance Issues

1. **Reduce image file sizes** (< 500KB)
2. **Enable lazy loading** (already implemented)
3. **Use CDN** for faster delivery
4. **Implement blur placeholders** for better perceived performance

## Future Enhancements

### Planned Features

1. **Admin Dashboard** for image uploads
2. **Automatic Image Optimization** pipeline
3. **Multiple Image Variants** per project (hero, thumbnail, gallery)
4. **Image Cropping Tool** in admin interface
5. **Automatic Alt Text Generation** using AI
6. **Image Analytics** (views, load times)

### Migration to Supabase Storage

When ready to migrate to Supabase Storage:

1. Create storage bucket
2. Upload all images
3. Update database URLs
4. Set up RLS policies
5. Configure CDN (optional)
6. Test thoroughly
7. Remove images from `/public` folder

## Resources

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [WebP Image Format](https://developers.google.com/speed/webp)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Image Optimization Best Practices](https://web.dev/fast/#optimize-your-images)
