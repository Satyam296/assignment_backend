import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkVariants() {
  console.log('🔍 Checking all variants in database...\n');
  
  const { data: variants, error, count } = await supabase
    .from('variants')
    .select('*', { count: 'exact' });
  
  console.log(`📊 Total variants count: ${count}`);
  console.log('📦 All Variants:', JSON.stringify(variants, null, 2));
  console.log('❌ Error:', error);
}

checkVariants().then(() => {
  console.log('\n✅ Check complete');
  process.exit(0);
}).catch(err => {
  console.error('❌ Check failed:', err);
  process.exit(1);
});
