# Database Migration Guide

## Complete Database Reset

The `00_complete_database_reset.sql` script provides a complete database setup for the FredonBytes project.

### ⚠️ WARNING
This script will **DELETE ALL DATA** in your database! Only use this for:
- Initial setup
- Development environment resets
- When you need a clean slate

### What This Script Does

1. **Drops all existing tables** (clean slate)
2. **Creates all tables** with proper structure:
   - Form system (questions, question_options, form_sessions, form_responses)
   - Survey system (survey_questions, survey_question_options, survey_sessions, survey_responses)
   - Contact submissions
   - Newsletter subscribers
   - Cookie consents
   - Projects gallery
3. **Sets up Row Level Security (RLS)** policies
4. **Seeds sample data**:
   - 4 form questions with translations (en, cs, de)
   - 5 survey questions with translations (en, cs, de)
   - Test sessions for development

### How to Run

#### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the entire contents of `00_complete_database_reset.sql`
5. Click **Run** or press `Ctrl+Enter`
6. Wait for completion (should take 5-10 seconds)
7. Check the results panel for verification output

#### Option 2: Supabase CLI

```bash
# Make sure you're in the project root
cd /path/to/fredonbytes-1

# Run the migration
supabase db reset

# Or apply specific migration
supabase db push
```

### Verification

After running the script, you should see output showing table counts:

```
table_name                  | row_count
---------------------------+----------
contact_submissions         | 1
cookie_consents            | 0
form_responses             | 0
form_sessions              | 3
newsletter_subscribers     | 0
projects                   | 0
question_options           | 10
questions                  | 4
survey_question_options    | 10
survey_questions           | 5
survey_responses           | 0
survey_sessions            | 3
```

### Test URLs

After running the migration, you can test with these URLs:

#### Form (Standalone)
- English: http://localhost:3000/en/form
- Czech: http://localhost:3000/cs/form
- German: http://localhost:3000/de/form

#### Survey (Post-Contact)
- English: http://localhost:3000/en/survey/55555555-5555-5555-5555-555555555555
- Czech: http://localhost:3000/cs/survey/66666666-6666-6666-6666-666666666666
- German: http://localhost:3000/de/survey/77777777-7777-7777-7777-777777777777

### Database Structure

#### Form System
- **questions**: Multilingual form questions (JSONB)
- **question_options**: Options for choice-based questions
- **form_sessions**: Tracks form completion sessions
- **form_responses**: Individual question responses

#### Survey System
- **survey_questions**: Multilingual survey questions (JSONB)
- **survey_question_options**: Options for choice-based survey questions
- **survey_sessions**: Tracks survey sessions (linked to contact submissions)
- **survey_responses**: Individual survey responses

#### Supporting Tables
- **contact_submissions**: Contact form submissions
- **newsletter_subscribers**: Newsletter subscription management
- **cookie_consents**: GDPR cookie consent tracking
- **projects**: Project gallery with multilingual support

### Multilingual Support

All questions use JSONB format for translations:

```json
{
  "en": "English text",
  "cs": "Czech text",
  "de": "German text"
}
```

### Security

- All tables have Row Level Security (RLS) enabled
- Public users can:
  - Read active questions
  - Create sessions and responses
  - Read visible projects
- Admin operations require service key

### Troubleshooting

#### Error: "relation does not exist"
- The migration hasn't been run yet
- Solution: Run the migration script

#### Error: "duplicate key value"
- Tables already exist with data
- Solution: The script handles this with `DROP TABLE IF EXISTS`

#### Error: "permission denied"
- Insufficient database permissions
- Solution: Use Supabase dashboard or ensure you have admin access

#### Form/Survey returns 404
- No questions in database
- Solution: Run the migration to seed sample questions

#### Session validation error
- Survey session doesn't exist
- Solution: Either create via contact form or use test session IDs

### Next Steps

1. **Restart your dev server**: `npm run dev`
2. **Test the form**: Visit http://localhost:3000/en/form
3. **Test the survey**: Use test URLs above
4. **Customize questions**: Update the seed data in the migration script
5. **Deploy to production**: Run the same script in your production Supabase instance

### Production Deployment

For production, you may want to:

1. Remove the test data section (Step 11)
2. Customize the sample questions
3. Add your own project gallery items
4. Review and adjust RLS policies for your security requirements

### Support

If you encounter issues:
1. Check the Supabase logs in the dashboard
2. Verify your environment variables are set correctly
3. Ensure your Supabase project is active
4. Check the browser console for client-side errors

---

**Last Updated**: January 10, 2025
**Database Version**: 1.0.0
**Compatible with**: Next.js 15.3.3, Supabase latest
