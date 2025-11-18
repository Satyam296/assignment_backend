import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('🔍 Checking variants table schema...\n');
  
  // Try to insert a minimal variant to see what columns are required
  const { data, error } = await supabase
    .from('variants')
    .insert([{ }])
    .select();
  
  console.log('Error (will show required columns):', error);
}

checkSchema().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
