# TODO

## Active Tasks
_No active tasks - all features completed._

---

## Completed in this session

### Form Image Upload Feature (Base Implementation)
- ✅ TODO-1: Database migration for image support (07_add_form_images.sql)
- ✅ TODO-2: Storage bucket setup documentation (STORAGE_SETUP.md)
- ✅ TODO-3: Image upload API endpoint (/api/form/upload)
- ✅ TODO-4: Session creation API with question preloading
- ✅ TODO-5: ImageUploadInput component
- ✅ TODO-6: QuestionStep updated to render image input
- ✅ TODO-7: Form validation supports image type
- ✅ TODO-8: Form storage tracks image sizes
- ✅ TODO-9: FormLanding caches preloaded questions
- ✅ TODO-10: FormClient uses cached questions
- ✅ TODO-11: Submit endpoint verified (no changes needed)
- ✅ TODO-12: i18n translations added (en, cs, de)
- ✅ TODO-13: Image validation utilities created

### Bug Fixes Applied
- ✅ Fixed IntlError: Moved form.image translations to correct object
- ✅ Fixed 403 CSRF validation: Changed to header-based token
- ✅ Fixed 500 after upload: Disabled RLS on form_answer_images (migration 08)
- ✅ Added missing `uploadedFile` translation key

### Multiple Image Upload Enhancement
- ✅ Modified ImageUploadInput to support multiple files
- ✅ Added gallery view with grid layout (2-3 columns)
- ✅ Individual remove buttons per image
- ✅ Sequential upload with per-file progress
- ✅ Updated validation to handle string[] for image type
- ✅ Updated translations to reflect multiple images
- ✅ Changed answer value from string to string[]

## Deployment Checklist
- [ ] Run migration 07: `supabase migration up` (add image support)
- [ ] Run migration 08: `supabase migration up` (fix form_answer_images RLS)
- [ ] Run migration 09: `supabase migration up` (fix newsletter_subscribers schema)
- [ ] Configure storage bucket per STORAGE_SETUP.md
- [ ] Test single image upload
- [ ] Test multiple image upload
- [ ] Verify 50MB session limit enforcement
- [ ] Verify 5MB per-file limit enforcement
- [ ] Test image removal functionality
- [ ] Verify blank container fix
- [ ] Test all locales (cs, de, en)
