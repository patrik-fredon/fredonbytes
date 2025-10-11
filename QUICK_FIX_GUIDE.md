# Quick Fix Guide - RLS Policy & Metadata Issues

## 🔴 Critical: Fix RLS Policy Error (Do This First!)

Your form submission is failing because of Row Level Security policies. 

### Fix Steps:

1. **Go to Supabase Dashboard:**
   - Visit https://supabase.com/dashboard
   - Select your project
   - Click **"SQL Editor"** → **"New query"**

2. **Run the fix script:**
   - Copy the entire content from `scripts/fix-rls-policies.sql`
   - Paste into SQL Editor
   - Click **"Run"**

3. **Verify the fix:**
   - You should see a list of policies at the bottom
   - Look for policies with `TO public` (not `TO anon`)

### What Changed:

The original policies used `TO anon` which is too restrictive. The fix changes them to `TO public` which allows both anonymous and authenticated users.

**Before:**
```sql
CREATE POLICY "Public can create sessions"
ON form_sessions FOR INSERT
TO anon  -- ❌ Too restrictive
WITH CHECK (true);
```

**After:**
```sql
CREATE POLICY "Public can create sessions"
ON form_sessions FOR INSERT
TO public  -- ✅ Correct
WITH CHECK (true);
```

---

## ⚠️ Next.js Metadata Warnings (Already Fixed in Code)

The metadata warnings have been fixed in the code. Changes made:

### Files Updated:

1. **`src/app/layout.tsx`**
   - Moved `viewport` and `themeColor` to separate `viewport` export
   - Added `metadataBase` for proper Open Graph image resolution

2. **`src/app/form/[session_id]/page.tsx`**
   - Added `viewport` export with proper configuration

### What This Fixes:

- ✅ Removes all viewport/themeColor warnings
- ✅ Fixes Open Graph image resolution
- ✅ Follows Next.js 15 best practices

---

## 🧪 Testing After Fixes

### 1. Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### 2. Test Form Submission

1. Go to http://localhost:3000/form
2. Fill out the survey
3. Submit the form
4. You should see: "Thank you for your feedback!"

### 3. Check for Errors

**Before Fix:**
```
Error upserting form session: {code: '42501', message: 'new row violates row-level security policy'}
```

**After Fix:**
```
POST /api/form/submit 200 in XXXms  ✅
```

---

## 📋 Summary of All Changes

### Database (Supabase)
- ✅ Fixed RLS policies to use `TO public` instead of `TO anon`
- ✅ Allows anonymous form submissions

### Code (Already Applied)
- ✅ Moved viewport config to separate export
- ✅ Added metadataBase for Open Graph
- ✅ Fixed all Next.js 15 metadata warnings

---

## 🚀 Next Steps

1. **Run the RLS fix script** in Supabase (critical!)
2. **Restart dev server** to see the changes
3. **Test form submission** to verify it works
4. **Deploy to production** when ready

---

## 🆘 If Still Having Issues

### Issue: Form still fails with 500 error

**Check:**
1. Did you run `scripts/fix-rls-policies.sql` in Supabase?
2. Are you using the correct Supabase URL and anon key in `.env`?
3. Check browser console for detailed error messages

**Verify RLS policies:**
```sql
SELECT tablename, policyname, roles 
FROM pg_policies 
WHERE tablename = 'form_sessions';
```

Should show `roles = {public}` not `roles = {anon}`

### Issue: Metadata warnings still appear

**Solution:**
- Restart your dev server completely
- Clear Next.js cache: `rm -rf .next`
- Run `npm run dev` again

---

## ✅ Expected Results

After applying all fixes:

1. **No RLS errors** - Form submissions work
2. **No metadata warnings** - Clean console output
3. **Form works end-to-end** - Data saved to Supabase
4. **Email sent** - Admin receives notification (if SMTP configured)

---

## 📞 Support

If you're still stuck:
1. Check the error message in terminal
2. Check browser console (F12)
3. Check Supabase logs in dashboard
4. Verify all environment variables are set
