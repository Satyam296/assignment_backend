import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testEmiInsert() {
  const { data: products } = await supabase.from('products').select('id').limit(1);
  if (!products || products.length === 0) return;
  
  const productId = products[0].id;
  
  // Test minimal insert
  const { data, error } = await supabase
    .from('emi_plans')
    .insert([{
      product_id: productId,
      tenure: 3,
      interest_rate: 0
    }])
    .select();
  
  console.log('Success:', data);
  console.log('Error:', error);
  
  if (data && data[0]) {
    await supabase.from('emi_plans').delete().eq('id', data[0].id);
  }
  process.exit(0);
}

testEmiInsert();
