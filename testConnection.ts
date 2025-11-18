import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

console.log('🔍 Testing Supabase connection...\n');

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

console.log('URL:', supabaseUrl);
console.log('Key exists:', !!supabaseKey);
console.log('Key length:', supabaseKey?.length);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test 1: Count products
    const { count: productCount, error: productError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    console.log('\n✅ Products table:', productCount, 'rows');
    if (productError) console.log('❌ Error:', productError);

    // Test 2: Fetch one product with relations
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Error fetching product:', error);
      return;
    }

    if (products && products.length > 0) {
      const product = products[0];
      console.log(`\n📱 Sample Product: ${product.name}`);
      
      // Get variants
      const { data: variants } = await supabase
        .from('variants')
        .select('*')
        .eq('product_id', product.id);
      
      console.log('   Variants:', variants?.length || 0);
      
      // Get EMI plans
      const { data: emiPlans } = await supabase
        .from('emi_plans')
        .select('*')
        .eq('product_id', product.id);
      
      console.log('   EMI Plans:', emiPlans?.length || 0);

      if (variants && variants.length > 0) {
        console.log('\n   Sample variant:', JSON.stringify(variants[0], null, 2));
      }

      if (emiPlans && emiPlans.length > 0) {
        console.log('\n   Sample EMI plan:', JSON.stringify(emiPlans[0], null, 2));
      }
    }

    console.log('\n✅ Database is connected and working!');
  } catch (err) {
    console.error('❌ Connection test failed:', err);
  }
  process.exit(0);
}

testConnection();
