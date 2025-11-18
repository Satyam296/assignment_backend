import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testVariantInsert() {
  console.log('🔍 Testing variant insert with different column combinations...\n');
  
  // First, get a product ID
  const { data: products } = await supabase.from('products').select('id').limit(1);
  
  if (!products || products.length === 0) {
    console.log('❌ No products found');
    return;
  }
  
  const productId = products[0].id;
  console.log(`✅ Using product ID: ${productId}\n`);
  
  // Test 1: Try with variant_id column
  console.log('Test 1: Inserting with variant_id column...');
  const { data: test1, error: error1 } = await supabase
    .from('variants')
    .insert([{
      product_id: productId,
      variant_id: 'test-variant-1',
      name: 'Test Variant',
      color: 'Black',
      storage: '128GB',
      price: 50000,
      mrp: 60000,
      image: 'test.jpg'
    }])
    .select();
  
  if (error1) {
    console.log(`❌ Error: ${error1.message}\n`);
    
    // Test 2: Try without variant_id column
    console.log('Test 2: Inserting WITHOUT variant_id column...');
    const { data: test2, error: error2 } = await supabase
      .from('variants')
      .insert([{
        product_id: productId,
        name: 'Test Variant',
        color: 'Black',
        storage: '128GB',
        price: 50000,
        mrp: 60000,
        image: 'test.jpg'
      }])
      .select();
    
    if (error2) {
      console.log(`❌ Error: ${error2.message}`);
    } else {
      console.log(`✅ SUCCESS! Inserted without variant_id`);
      console.log('Data:', JSON.stringify(test2, null, 2));
      
      // Clean up
      if (test2 && test2[0]) {
        await supabase.from('variants').delete().eq('id', test2[0].id);
        console.log('🧹 Cleaned up test data');
      }
    }
  } else {
    console.log(`✅ SUCCESS! Inserted with variant_id`);
    console.log('Data:', JSON.stringify(test1, null, 2));
    
    // Clean up
    if (test1 && test1[0]) {
      await supabase.from('variants').delete().eq('id', test1[0].id);
      console.log('🧹 Cleaned up test data');
    }
  }
}

testVariantInsert().then(() => {
  console.log('\n✅ Test complete');
  process.exit(0);
}).catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
