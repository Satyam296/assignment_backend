import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEmiSchema() {
  const { data: products } = await supabase.from('products').select('id').limit(1);
  if (!products || products.length === 0) return;
  
  const productId = products[0].id;
  
  // Try different column combinations
  console.log('Testing EMI plan schema...\n');
  
  const { data, error } = await supabase
    .from('emi_plans')
    .insert([{
      product_id: productId,
      plan_id: 'test',
      tenure: 3,
      interest_rate: 0,
      cashback: 0
    }])
    .select();
  
  if (data) {
    console.log('✅ Insert successful!');
    console.log('Columns in returned data:', Object.keys(data[0]));
    console.log('Full record:', JSON.stringify(data[0], null, 2));
    
    // Clean up
    await supabase.from('emi_plans').delete().eq('id', data[0].id);
  } else {
    console.log('❌ Error:', error);
  }
  
  process.exit(0);
}

checkEmiSchema();
