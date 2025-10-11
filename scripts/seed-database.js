#!/usr/bin/env node

/**
 * Database Seeding Script
 * Seeds the form questions into Supabase database
 * 
 * Usage: node scripts/seed-database.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'seed-form-questions.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('📄 SQL file loaded successfully');
    console.log('⚠️  Note: This script uses the Supabase JS client which has limitations.');
    console.log('   For best results, run the SQL directly in Supabase Dashboard.\n');

    // Since Supabase JS client doesn't support raw SQL execution,
    // we'll provide instructions instead
    console.log('📋 To seed your database:');
    console.log('');
    console.log('1. Go to: https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Click "SQL Editor" in the sidebar');
    console.log('4. Click "New query"');
    console.log('5. Copy the contents of: scripts/seed-form-questions.sql');
    console.log('6. Paste into the SQL Editor');
    console.log('7. Click "Run" or press Ctrl+Enter');
    console.log('');
    console.log('✨ Your database will be seeded with 7 survey questions!');
    console.log('');
    console.log('Alternatively, if you have psql installed:');
    console.log('');
    console.log('  psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres" < scripts/seed-form-questions.sql');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedDatabase();
