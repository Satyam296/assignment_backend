import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function addVariantIdColumn() {
  console.log('🔧 Adding variant_id column to variants table...\n');
  
  // Add the variant_id column using Supabase's SQL RPC or direct query
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: 'ALTER TABLE variants ADD COLUMN IF NOT EXISTS variant_id VARCHAR(50);'
  });
  
  if (error) {
    console.log('❌ Could not use RPC method');
    console.log('Error:', error.message);
    console.log('\n📋 You need to run this SQL in Supabase Dashboard:');
    console.log('---');
    console.log('ALTER TABLE variants ADD COLUMN variant_id VARCHAR(50);');
    console.log('ALTER TABLE emi_plans ADD COLUMN IF NOT EXISTS plan_id VARCHAR(50);');
    console.log('---');
  } else {
    console.log('✅ Column added successfully!');
  }
}

addVariantIdColumn().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
