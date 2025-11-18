import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuery() {
  console.log('🔍 Testing Supabase queries...\n');
  
  // Get all products
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*');
  
  console.log('📦 Products:', products);
  console.log('❌ Products Error:', productsError);
  
  if (products && products.length > 0) {
    const firstProduct = products[0];
    console.log(`\n🔍 Fetching variants for ${firstProduct.name} (${firstProduct.id})...`);
    
    // Get variants for first product
    const { data: variants, error: variantsError } = await supabase
      .from('variants')
      .select('*')
      .eq('product_id', firstProduct.id);
    
    console.log('📦 Variants:', variants);
    console.log('❌ Variants Error:', variantsError);
  }
}

testQuery().then(() => {
  console.log('\n✅ Test complete');
  process.exit(0);
}).catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
