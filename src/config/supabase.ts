import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.log('Please set SUPABASE_URL and SUPABASE_ANON_KEY in .env file');
  console.log('Current SUPABASE_URL:', supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseKey);
