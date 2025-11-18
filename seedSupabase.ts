import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('specifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('emi_plans').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('variants').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('admins').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Create admin
    console.log('👤 Creating admin...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .insert({
        email: 'satyamchhetri629@gmail.com',
        password: hashedPassword
      })
      .select()
      .single();

    if (adminError) throw adminError;
    console.log('✅ Admin created:', admin.email);

    // Product 1: iPhone 17 Pro
    console.log('📱 Creating iPhone 17 Pro...');
    const { data: iphone, error: iphoneError } = await supabase
      .from('products')
      .insert({
        slug: 'iphone-17-pro',
        name: 'iPhone 17 Pro',
        category: 'Smartphones',
        description: 'Latest iPhone with advanced features'
      })
      .select()
      .single();

    if (iphoneError) throw iphoneError;

    // iPhone variants - All 6 variants with 3 colors (Silver, Cosmic Orange, Deep Blue) and 2 storage options each
    const { error: iphoneVariantsError } = await supabase.from('variants').insert([
      {
        product_id: iphone.id,
        name: 'Silver 256GB',
        color: 'Silver',
        storage: '256',
        price: 134900,
        mrp: 149900,
        image: 'https://images.snapmint.com/product_assets/images/001/154/806/large/open-uri20251021-2855301-v0364x?1761017558',
        images: [
          'https://images.snapmint.com/product_assets/images/001/154/806/large/open-uri20251021-2855301-v0364x?1761017558',
          'https://images.snapmint.com/product_assets/images/001/154/807/large/open-uri20251021-2855301-1w6zv?1761017558',
          'https://images.snapmint.com/product_assets/images/001/154/808/large/open-uri20251021-2855301-4vhtc4?1761017558',
          'https://images.snapmint.com/product_assets/images/001/154/809/large/open-uri20251021-2855301-dn3u82?1761017558',
          'https://images.snapmint.com/product_assets/images/001/154/810/large/open-uri20251021-2855301-rptlrs?1761017558',
          'https://images.snapmint.com/product_assets/images/001/154/811/large/open-uri20251021-2855301-15vrhwi?1761017559',
          'https://images.snapmint.com/product_assets/images/001/154/812/large/open-uri20251021-2855301-ejci3q?1761017559'
        ],
        stock: 8,
        available_emi_plans: ['3mo', '6mo', '9mo', '12mo']
      },
      {
        product_id: iphone.id,
        name: 'Silver 512GB',
        color: 'Silver',
        storage: '512',
        price: 154900,
        mrp: 169900,
        image: 'https://images.snapmint.com/product_assets/images/001/154/806/large/open-uri20251021-2855301-v0364x?1761017558',
        images: [
          'https://images.snapmint.com/product_assets/images/001/154/806/large/open-uri20251021-2855301-v0364x?1761017558',
          'https://images.snapmint.com/product_assets/images/001/154/807/large/open-uri20251021-2855301-1w6zv?1761017558',
          'https://images.snapmint.com/product_assets/images/001/154/808/large/open-uri20251021-2855301-4vhtc4?1761017558',
          'https://images.snapmint.com/product_assets/images/001/154/809/large/open-uri20251021-2855301-dn3u82?1761017558',
          'https://images.snapmint.com/product_assets/images/001/154/810/large/open-uri20251021-2855301-rptlrs?1761017558',
          'https://images.snapmint.com/product_assets/images/001/154/811/large/open-uri20251021-2855301-15vrhwi?1761017559',
          'https://images.snapmint.com/product_assets/images/001/154/812/large/open-uri20251021-2855301-ejci3q?1761017559'
        ],
        stock: 10,
        available_emi_plans: ['3mo', '6mo', '9mo', '12mo']
      },
      {
        product_id: iphone.id,
        name: 'Cosmic Orange 256GB',
        color: 'Cosmic Orange',
        storage: '256',
        price: 139900,
        mrp: 149900,
        image: 'https://images.snapmint.com/product_assets/images/001/154/792/large/open-uri20251021-2855301-1lwknri?1761017541',
        images: [
          'https://images.snapmint.com/product_assets/images/001/154/792/large/open-uri20251021-2855301-1lwknri?1761017541',
          'https://images.snapmint.com/product_assets/images/001/154/793/large/open-uri20251021-2855301-14q9hu6?1761017541',
          'https://images.snapmint.com/product_assets/images/001/154/794/large/open-uri20251021-2855301-151nlj6?1761017541',
          'https://images.snapmint.com/product_assets/images/001/154/795/thumb/open-uri20251021-2855301-140js9k?1761017541',
          'https://images.snapmint.com/product_assets/images/001/154/796/large/open-uri20251021-2855301-1ekq5ib?1761017541',
          'https://images.snapmint.com/product_assets/images/001/154/797/large/open-uri20251021-2855301-1t6xkcw?1761017541',
          'https://images.snapmint.com/product_assets/images/001/154/798/thumb/open-uri20251021-2855301-osqdu7?1761017541'
        ],
        stock: 12,
        available_emi_plans: ['3mo', '6mo', '9mo', '12mo']
      },
      {
        product_id: iphone.id,
        name: 'Cosmic Orange 512GB',
        color: 'Cosmic Orange',
        storage: '512',
        price: 159900,
        mrp: 169900,
        image: 'https://images.snapmint.com/product_assets/images/001/154/792/large/open-uri20251021-2855301-1lwknri?1761017541',
        images: [
          'https://images.snapmint.com/product_assets/images/001/154/792/large/open-uri20251021-2855301-1lwknri?1761017541',
          'https://images.snapmint.com/product_assets/images/001/154/793/large/open-uri20251021-2855301-14q9hu6?1761017541',
          'https://images.snapmint.com/product_assets/images/001/154/794/large/open-uri20251021-2855301-151nlj6?1761017541',
          'https://images.snapmint.com/product_assets/images/001/154/795/thumb/open-uri20251021-2855301-140js9k?1761017541',
          'https://images.snapmint.com/product_assets/images/001/154/796/large/open-uri20251021-2855301-1ekq5ib?1761017541',
          'https://images.snapmint.com/product_assets/images/001/154/797/large/open-uri20251021-2855301-1t6xkcw?1761017541',
          'https://images.snapmint.com/product_assets/images/001/154/798/thumb/open-uri20251021-2855301-osqdu7?1761017541'
        ],
        stock: 10,
        available_emi_plans: ['3mo', '6mo', '9mo', '12mo']
      },
      {
        product_id: iphone.id,
        name: 'Deep Blue 256GB',
        color: 'Deep Blue',
        storage: '256',
        price: 136900,
        mrp: 149900,
        image: 'https://images.snapmint.com/product_assets/images/001/154/799/large/open-uri20251021-2855301-1u2r5zo?1761017549',
        images: [
          'https://images.snapmint.com/product_assets/images/001/154/799/large/open-uri20251021-2855301-1u2r5zo?1761017549',
          'https://images.snapmint.com/product_assets/images/001/154/800/large/open-uri20251021-2855301-9rqvoi?1761017549',
          'https://images.snapmint.com/product_assets/images/001/154/801/large/open-uri20251021-2855301-swkfff?1761017549',
          'https://images.snapmint.com/product_assets/images/001/154/802/large/open-uri20251021-2855301-1v24c0v?1761017549',
          'https://images.snapmint.com/product_assets/images/001/154/803/large/open-uri20251021-2855301-4r63e4?1761017550',
          'https://images.snapmint.com/product_assets/images/001/154/804/large/open-uri20251021-2855301-1p4q298?1761017550',
          'https://images.snapmint.com/product_assets/images/001/154/805/large/open-uri20251021-2855301-12nmluz?1761017550'
        ],
        stock: 10,
        available_emi_plans: ['3mo', '6mo', '9mo', '12mo']
      },
      {
        product_id: iphone.id,
        name: 'Deep Blue 512GB',
        color: 'Deep Blue',
        storage: '512',
        price: 156900,
        mrp: 169900,
        image: 'https://images.snapmint.com/product_assets/images/001/154/799/large/open-uri20251021-2855301-1u2r5zo?1761017549',
        images: [
          'https://images.snapmint.com/product_assets/images/001/154/799/large/open-uri20251021-2855301-1u2r5zo?1761017549',
          'https://images.snapmint.com/product_assets/images/001/154/800/large/open-uri20251021-2855301-9rqvoi?1761017549',
          'https://images.snapmint.com/product_assets/images/001/154/801/large/open-uri20251021-2855301-swkfff?1761017549',
          'https://images.snapmint.com/product_assets/images/001/154/802/large/open-uri20251021-2855301-1v24c0v?1761017549',
          'https://images.snapmint.com/product_assets/images/001/154/803/large/open-uri20251021-2855301-4r63e4?1761017550',
          'https://images.snapmint.com/product_assets/images/001/154/804/large/open-uri20251021-2855301-1p4q298?1761017550',
          'https://images.snapmint.com/product_assets/images/001/154/805/large/open-uri20251021-2855301-12nmluz?1761017550'
        ],
        stock: 10,
        available_emi_plans: ['3mo', '6mo', '9mo', '12mo']
      }
    ]);
    
    if (iphoneVariantsError) {
      console.error('❌ iPhone Variants Error:', iphoneVariantsError);
      throw iphoneVariantsError;
    }
    console.log('✅ iPhone variants created');

    // iPhone EMI plans
    const { error: iphoneEmiError } = await supabase.from('emi_plans').insert([
      {
        product_id: iphone.id,
        plan_id: '3mo',
        tenure: 3,
        interest_rate: 0,
        cashback: 0
      },
      {
        product_id: iphone.id,
        plan_id: '6mo',
        tenure: 6,
        interest_rate: 1.73,
        cashback: 500
      },
      {
        product_id: iphone.id,
        plan_id: '9mo',
        tenure: 9,
        interest_rate: 1.88,
        cashback: 1000
      },
      {
        product_id: iphone.id,
        plan_id: '12mo',
        tenure: 12,
        interest_rate: 1.89,
        cashback: 1500
      }
    ]);
    if (iphoneEmiError) {
      console.error('❌ iPhone EMI Plans Error:', iphoneEmiError);
      throw iphoneEmiError;
    }
    console.log('✅ iPhone EMI plans created');

    // iPhone specifications
    await supabase.from('specifications').insert([
      { product_id: iphone.id, key: 'Display', value: '6.7" Super Retina XDR' },
      { product_id: iphone.id, key: 'Processor', value: 'A18 Pro Chip' },
      { product_id: iphone.id, key: 'Camera', value: '48MP + 12MP + 12MP' },
      { product_id: iphone.id, key: 'Battery', value: '4500 mAh' },
      { product_id: iphone.id, key: 'OS', value: 'iOS 18' }
    ]);

    console.log('✅ iPhone 17 Pro created');

    // Product 2: Samsung S24 Ultra
    console.log('📱 Creating Samsung S24 Ultra...');
    const { data: samsung, error: samsungError } = await supabase
      .from('products')
      .insert({
        slug: 'samsung-s24-ultra',
        name: 'Samsung Galaxy S24 Ultra',
        category: 'Smartphones',
        description: 'Premium Samsung flagship phone'
      })
      .select()
      .single();

    if (samsungError) throw samsungError;

    await supabase.from('variants').insert([
      {
        product_id: samsung.id,
        name: 'Titanium Gray 256GB',
        color: 'Titanium Gray',
        storage: '256',
        price: 129900,
        mrp: 144900,
        image: 'https://images.snapmint.com/product_assets/images/000/939/165/large/open-uri20240226-25016-16vtfke?1708944894',
        images: [
          'https://images.snapmint.com/product_assets/images/000/939/165/large/open-uri20240226-25016-16vtfke?1708944894',
          'https://images.snapmint.com/product_assets/images/000/939/166/large/open-uri20240226-25016-3va3rh?1708944894',
          'https://images.snapmint.com/product_assets/images/000/939/167/large/open-uri20240226-25016-agxann?1708944894',
          'https://images.snapmint.com/product_assets/images/000/939/168/large/open-uri20240226-25016-jnsxay?1708944895',
          'https://images.snapmint.com/product_assets/images/000/939/169/large/data?1708944895',
          'https://images.snapmint.com/product_assets/images/000/939/172/large/open-uri20240226-25016-1nqvwjd?1708944898',
          'https://images.snapmint.com/product_assets/images/000/939/173/large/open-uri20240226-25016-smj74t?1708944898'
        ],
        stock: 10,
        available_emi_plans: ['3mo', '6mo', '9mo', '12mo']
      },
      {
        product_id: samsung.id,
        name: 'Titanium Gray 512GB',
        color: 'Titanium Gray',
        storage: '512',
        price: 139900,
        mrp: 154900,
        image: 'https://images.snapmint.com/product_assets/images/000/939/165/large/open-uri20240226-25016-16vtfke?1708944894',
        images: [
          'https://images.snapmint.com/product_assets/images/000/939/165/large/open-uri20240226-25016-16vtfke?1708944894',
          'https://images.snapmint.com/product_assets/images/000/939/166/large/open-uri20240226-25016-3va3rh?1708944894',
          'https://images.snapmint.com/product_assets/images/000/939/167/large/open-uri20240226-25016-agxann?1708944894',
          'https://images.snapmint.com/product_assets/images/000/939/168/large/open-uri20240226-25016-jnsxay?1708944895',
          'https://images.snapmint.com/product_assets/images/000/939/169/large/data?1708944895',
          'https://images.snapmint.com/product_assets/images/000/939/172/large/open-uri20240226-25016-1nqvwjd?1708944898',
          'https://images.snapmint.com/product_assets/images/000/939/173/large/open-uri20240226-25016-smj74t?1708944898'
        ],
        stock: 10,
        available_emi_plans: ['3mo', '6mo', '9mo', '12mo']
      },
      {
        product_id: samsung.id,
        name: 'Titanium Violet 256GB',
        color: 'Titanium Violet',
        storage: '256',
        price: 139900,
        mrp: 154900,
        image: 'https://images.snapmint.com/product_assets/images/000/939/174/large/open-uri20240226-25016-disn3u?1708944904',
        images: [
          'https://images.snapmint.com/product_assets/images/000/939/174/large/open-uri20240226-25016-disn3u?1708944904',
          'https://images.snapmint.com/product_assets/images/000/939/175/large/open-uri20240226-25016-1wpdnep?1708944904',
          'https://images.snapmint.com/product_assets/images/000/939/176/large/open-uri20240226-25016-16wa7w8?1708944904',
          'https://images.snapmint.com/product_assets/images/000/939/177/large/open-uri20240226-25016-1w2kkzw?1708944904',
          'https://images.snapmint.com/product_assets/images/000/939/178/large/data?1708944905',
          'https://images.snapmint.com/product_assets/images/000/939/180/large/data?1708944906',
          'https://images.snapmint.com/product_assets/images/000/939/181/large/open-uri20240226-25016-1aetpvv?1708944906'
        ],
        stock: 10,
        available_emi_plans: ['3mo', '6mo', '9mo', '12mo']
      },
      {
        product_id: samsung.id,
        name: 'Titanium Violet 512GB',
        color: 'Titanium Violet',
        storage: '512',
        price: 149900,
        mrp: 164900,
        image: 'https://images.snapmint.com/product_assets/images/000/939/174/large/open-uri20240226-25016-disn3u?1708944904',
        images: [
          'https://images.snapmint.com/product_assets/images/000/939/174/large/open-uri20240226-25016-disn3u?1708944904',
          'https://images.snapmint.com/product_assets/images/000/939/175/large/open-uri20240226-25016-1wpdnep?1708944904',
          'https://images.snapmint.com/product_assets/images/000/939/176/large/open-uri20240226-25016-16wa7w8?1708944904',
          'https://images.snapmint.com/product_assets/images/000/939/177/large/open-uri20240226-25016-1w2kkzw?1708944904',
          'https://images.snapmint.com/product_assets/images/000/939/178/large/data?1708944905',
          'https://images.snapmint.com/product_assets/images/000/939/180/large/data?1708944906',
          'https://images.snapmint.com/product_assets/images/000/939/181/large/open-uri20240226-25016-1aetpvv?1708944906'
        ],
        stock: 10,
        available_emi_plans: ['3mo', '6mo', '9mo', '12mo']
      },
      {
        product_id: samsung.id,
        name: 'Titanium Black 256GB',
        color: 'Titanium Black',
        storage: '256',
        price: 132900,
        mrp: 144900,
        image: 'https://images.snapmint.com/product_assets/images/000/939/183/large/open-uri20240226-25016-r7xqys?1708944912',
        images: [
          'https://images.snapmint.com/product_assets/images/000/939/183/large/open-uri20240226-25016-r7xqys?1708944912',
          'https://images.snapmint.com/product_assets/images/000/939/184/large/open-uri20240226-25016-1pt8w5z?1708944912',
          'https://images.snapmint.com/product_assets/images/000/939/185/large/open-uri20240226-25016-nvmf70?1708944912',
          'https://images.snapmint.com/product_assets/images/000/939/186/large/open-uri20240226-25016-1jt9n3t?1708944913',
          'https://images.snapmint.com/product_assets/images/000/939/188/large/data?1708944914',
          'https://images.snapmint.com/product_assets/images/000/939/189/large/data?1708944915',
          'https://images.snapmint.com/product_assets/images/000/939/191/large/open-uri20240226-25016-1uzbepv?1708944916'
        ],
        stock: 10,
        available_emi_plans: ['3mo', '6mo', '9mo', '12mo']
      },
      {
        product_id: samsung.id,
        name: 'Titanium Black 512GB',
        color: 'Titanium Black',
        storage: '512',
        price: 142900,
        mrp: 154900,
        image: 'https://images.snapmint.com/product_assets/images/000/939/183/large/open-uri20240226-25016-r7xqys?1708944912',
        images: [
          'https://images.snapmint.com/product_assets/images/000/939/183/large/open-uri20240226-25016-r7xqys?1708944912',
          'https://images.snapmint.com/product_assets/images/000/939/184/large/open-uri20240226-25016-1pt8w5z?1708944912',
          'https://images.snapmint.com/product_assets/images/000/939/185/large/open-uri20240226-25016-nvmf70?1708944912',
          'https://images.snapmint.com/product_assets/images/000/939/186/large/open-uri20240226-25016-1jt9n3t?1708944913',
          'https://images.snapmint.com/product_assets/images/000/939/188/large/data?1708944914',
          'https://images.snapmint.com/product_assets/images/000/939/189/large/data?1708944915',
          'https://images.snapmint.com/product_assets/images/000/939/191/large/open-uri20240226-25016-1uzbepv?1708944916'
        ],
        stock: 10,
        available_emi_plans: ['3mo', '6mo', '9mo', '12mo']
      }
    ]);

    await supabase.from('emi_plans').insert([
      { product_id: samsung.id, plan_id: '3mo', tenure: 3, interest_rate: 0, cashback: 0 },
      { product_id: samsung.id, plan_id: '6mo', tenure: 6, interest_rate: 1.73, cashback: 500 },
      { product_id: samsung.id, plan_id: '9mo', tenure: 9, interest_rate: 1.88, cashback: 1000 },
      { product_id: samsung.id, plan_id: '12mo', tenure: 12, interest_rate: 1.89, cashback: 1500 }
    ]);

    await supabase.from('specifications').insert([
      { product_id: samsung.id, key: 'Display', value: '6.8" Dynamic AMOLED 2X' },
      { product_id: samsung.id, key: 'Processor', value: 'Snapdragon 8 Gen 3' },
      { product_id: samsung.id, key: 'Camera', value: '200MP + 50MP + 12MP + 10MP' },
      { product_id: samsung.id, key: 'Battery', value: '5000 mAh' },
      { product_id: samsung.id, key: 'OS', value: 'Android 14' }
    ]);

    console.log('✅ Samsung S24 Ultra created');

    // Product 3: Google Pixel 9 Pro
    console.log('📱 Creating Google Pixel 9 Pro...');
    const { data: pixel, error: pixelError } = await supabase
      .from('products')
      .insert({
        slug: 'google-pixel-9-pro',
        name: 'Google Pixel 9 Pro',
        category: 'Smartphones',
        description: 'Google flagship with advanced AI features'
      })
      .select()
      .single();

    if (pixelError) throw pixelError;

    await supabase.from('variants').insert([
      {
        product_id: pixel.id,
        name: 'Obsidian 256GB',
        color: 'Obsidian',
        storage: '256',
        price: 109999,
        mrp: 124999,
        image: 'https://images.snapmint.com/product_assets/images/001/069/754/large/open-uri20250319-28213-e8k1n1?1742389860',
        images: [
          'https://images.snapmint.com/product_assets/images/001/069/754/large/open-uri20250319-28213-e8k1n1?1742389860',
          'https://images.snapmint.com/product_assets/images/001/069/755/large/open-uri20250319-28213-1obpw25?1742389860',
          'https://images.snapmint.com/product_assets/images/001/069/756/large/open-uri20250319-28213-12r4zln?1742389860',
          'https://images.snapmint.com/product_assets/images/001/069/757/large/open-uri20250319-28213-i9aqg1?1742389861',
          'https://images.snapmint.com/product_assets/images/001/069/758/large/open-uri20250319-28213-8sm256?1742389861',
          'https://images.snapmint.com/product_assets/images/001/069/759/large/open-uri20250319-28213-s38oid?1742389861',
          'https://images.snapmint.com/product_assets/images/001/069/761/large/open-uri20250319-28213-60dlr0?1742389862'
        ],
        stock: 10,
        available_emi_plans: ['3mo', '6mo', '9mo', '12mo']
      },
      {
        product_id: pixel.id,
        name: 'Obsidian 512GB',
        color: 'Obsidian',
        storage: '512',
        price: 119999,
        mrp: 134999,
        image: 'https://images.snapmint.com/product_assets/images/001/069/754/large/open-uri20250319-28213-e8k1n1?1742389860',
        images: [
          'https://images.snapmint.com/product_assets/images/001/069/754/large/open-uri20250319-28213-e8k1n1?1742389860',
          'https://images.snapmint.com/product_assets/images/001/069/755/large/open-uri20250319-28213-1obpw25?1742389860',
          'https://images.snapmint.com/product_assets/images/001/069/756/large/open-uri20250319-28213-12r4zln?1742389860',
          'https://images.snapmint.com/product_assets/images/001/069/757/large/open-uri20250319-28213-i9aqg1?1742389861',
          'https://images.snapmint.com/product_assets/images/001/069/758/large/open-uri20250319-28213-8sm256?1742389861',
          'https://images.snapmint.com/product_assets/images/001/069/759/large/open-uri20250319-28213-s38oid?1742389861',
          'https://images.snapmint.com/product_assets/images/001/069/761/large/open-uri20250319-28213-60dlr0?1742389862'
        ],
        stock: 10,
        available_emi_plans: ['3mo', '6mo', '9mo', '12mo']
      },
      {
        product_id: pixel.id,
        name: 'Porcelain 256GB',
        color: 'Porcelain',
        storage: '256',
        price: 119999,
        mrp: 134999,
        image: 'https://images.snapmint.com/product_assets/images/001/069/763/large/open-uri20250319-28213-4p59v4?1742389873',
        images: [
          'https://images.snapmint.com/product_assets/images/001/069/763/large/open-uri20250319-28213-4p59v4?1742389873',
          'https://images.snapmint.com/product_assets/images/001/069/764/large/open-uri20250319-28213-50a05l?1742389874',
          'https://images.snapmint.com/product_assets/images/001/069/765/large/open-uri20250319-28213-hsnxng?1742389874',
          'https://images.snapmint.com/product_assets/images/001/069/766/large/open-uri20250319-28213-9cljpw?1742389874',
          'https://images.snapmint.com/product_assets/images/001/069/767/large/open-uri20250319-28213-1ivfdcu?1742389874',
          'https://images.snapmint.com/product_assets/images/001/069/768/large/open-uri20250319-28213-1skqg2t?1742389875',
          'https://images.snapmint.com/product_assets/images/001/069/770/large/open-uri20250319-28213-1sdz2ub?1742389875'
        ],
        stock: 10,
        available_emi_plans: ['3mo', '6mo', '9mo', '12mo']
      },
      {
        product_id: pixel.id,
        name: 'Porcelain 512GB',
        color: 'Porcelain',
        storage: '512',
        price: 129999,
        mrp: 144999,
        image: 'https://images.snapmint.com/product_assets/images/001/069/763/large/open-uri20250319-28213-4p59v4?1742389873',
        images: [
          'https://images.snapmint.com/product_assets/images/001/069/763/large/open-uri20250319-28213-4p59v4?1742389873',
          'https://images.snapmint.com/product_assets/images/001/069/764/large/open-uri20250319-28213-50a05l?1742389874',
          'https://images.snapmint.com/product_assets/images/001/069/765/large/open-uri20250319-28213-hsnxng?1742389874',
          'https://images.snapmint.com/product_assets/images/001/069/766/large/open-uri20250319-28213-9cljpw?1742389874',
          'https://images.snapmint.com/product_assets/images/001/069/767/large/open-uri20250319-28213-1ivfdcu?1742389874',
          'https://images.snapmint.com/product_assets/images/001/069/768/large/open-uri20250319-28213-1skqg2t?1742389875',
          'https://images.snapmint.com/product_assets/images/001/069/770/large/open-uri20250319-28213-1sdz2ub?1742389875'
        ],
        stock: 10,
        available_emi_plans: ['3mo', '6mo', '9mo', '12mo']
      },
      {
        product_id: pixel.id,
        name: 'Hazel 256GB',
        color: 'Hazel',
        storage: '256',
        price: 112999,
        mrp: 124999,
        image: 'https://images.snapmint.com/product_assets/images/001/069/745/large/open-uri20250319-28213-1s0x4bg?1742389842',
        images: [
          'https://images.snapmint.com/product_assets/images/001/069/745/large/open-uri20250319-28213-1s0x4bg?1742389842',
          'https://images.snapmint.com/product_assets/images/001/069/746/large/open-uri20250319-28213-1qk1s16?1742389842',
          'https://images.snapmint.com/product_assets/images/001/069/747/large/open-uri20250319-28213-p13r5q?1742389844',
          'https://images.snapmint.com/product_assets/images/001/069/748/large/open-uri20250319-28213-cq5z9u?1742389844',
          'https://images.snapmint.com/product_assets/images/001/069/750/large/open-uri20250319-28213-juceox?1742389846',
          'https://images.snapmint.com/product_assets/images/001/069/751/large/open-uri20250319-28213-1gorwa7?1742389847',
          'https://images.snapmint.com/product_assets/images/001/069/752/large/open-uri20250319-28213-2qgbo6?1742389850'
        ],
        stock: 10,
        available_emi_plans: ['3mo', '6mo', '9mo', '12mo']
      },
      {
        product_id: pixel.id,
        name: 'Hazel 512GB',
        color: 'Hazel',
        storage: '512',
        price: 122999,
        mrp: 134999,
        image: 'https://images.snapmint.com/product_assets/images/001/069/745/large/open-uri20250319-28213-1s0x4bg?1742389842',
        images: [
          'https://images.snapmint.com/product_assets/images/001/069/745/large/open-uri20250319-28213-1s0x4bg?1742389842',
          'https://images.snapmint.com/product_assets/images/001/069/746/large/open-uri20250319-28213-1qk1s16?1742389842',
          'https://images.snapmint.com/product_assets/images/001/069/747/large/open-uri20250319-28213-p13r5q?1742389844',
          'https://images.snapmint.com/product_assets/images/001/069/748/large/open-uri20250319-28213-cq5z9u?1742389844',
          'https://images.snapmint.com/product_assets/images/001/069/750/large/open-uri20250319-28213-juceox?1742389846',
          'https://images.snapmint.com/product_assets/images/001/069/751/large/open-uri20250319-28213-1gorwa7?1742389847',
          'https://images.snapmint.com/product_assets/images/001/069/752/large/open-uri20250319-28213-2qgbo6?1742389850'
        ],
        stock: 10,
        available_emi_plans: ['3mo', '6mo', '9mo', '12mo']
      },
      {
        product_id: pixel.id,
        name: 'Hazel 512GB',
        color: 'Hazel',
        storage: '512',
        price: 122999,
        mrp: 134999,
        image: 'https://images.snapmint.com/product_assets/images/001/069/745/large/open-uri20250319-28213-1s0x4bg?1742389842',
        images: [
          'https://images.snapmint.com/product_assets/images/001/069/745/large/open-uri20250319-28213-1s0x4bg?1742389842',
          'https://images.snapmint.com/product_assets/images/001/069/746/large/open-uri20250319-28213-1qk1s16?1742389842',
          'https://images.snapmint.com/product_assets/images/001/069/747/large/open-uri20250319-28213-p13r5q?1742389844',
          'https://images.snapmint.com/product_assets/images/001/069/748/large/open-uri20250319-28213-cq5z9u?1742389844',
          'https://images.snapmint.com/product_assets/images/001/069/750/large/open-uri20250319-28213-juceox?1742389846',
          'https://images.snapmint.com/product_assets/images/001/069/751/large/open-uri20250319-28213-1gorwa7?1742389847',
          'https://images.snapmint.com/product_assets/images/001/069/752/large/open-uri20250319-28213-2qgbo6?1742389850'
        ],
        stock: 10,
        available_emi_plans: ['3mo', '6mo', '9mo', '12mo']
      }
    ]);

    await supabase.from('emi_plans').insert([
      { product_id: pixel.id, plan_id: '3mo', tenure: 3, interest_rate: 0, cashback: 0 },
      { product_id: pixel.id, plan_id: '6mo', tenure: 6, interest_rate: 1.73, cashback: 500 },
      { product_id: pixel.id, plan_id: '9mo', tenure: 9, interest_rate: 1.88, cashback: 1000 },
      { product_id: pixel.id, plan_id: '12mo', tenure: 12, interest_rate: 1.89, cashback: 1500 }
    ]);

    await supabase.from('specifications').insert([
      { product_id: pixel.id, key: 'Display', value: '6.7" LTPO OLED' },
      { product_id: pixel.id, key: 'Processor', value: 'Google Tensor G4' },
      { product_id: pixel.id, key: 'Camera', value: '50MP + 48MP + 48MP' },
      { product_id: pixel.id, key: 'Battery', value: '5050 mAh' },
      { product_id: pixel.id, key: 'OS', value: 'Android 15' }
    ]);

    console.log('✅ Google Pixel 9 Pro created');
    console.log('🎉 Database seeded successfully!');
    
  } catch (error: any) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
