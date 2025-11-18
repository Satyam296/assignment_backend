import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
  console.log('🔍 Checking what tables exist in Supabase...\n');
  
  const tables = ['products', 'variants', 'emi_plans', 'specifications', 'orders', 'admins'];
  
  for (const table of tables) {
    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log(`❌ ${table}: Does NOT exist or no access`);
      console.log(`   Error: ${error.message}`);
    } else {
      console.log(`✅ ${table}: EXISTS (${count} rows)`);
    }
  }
}

listTables().then(() => {
  console.log('\n✅ Check complete');
  process.exit(0);
}).catch(err => {
  console.error('❌ Check failed:', err);
  process.exit(1);
});
