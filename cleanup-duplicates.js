const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://eszzeisfvnfpvvpvluam.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzenplaXNmdm5mcHZ2cHZsdWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwMDkwNTAsImV4cCI6MjA0NzU4NTA1MH0.nI2heLB8K89LqebnjprEPNtqXSp0YJ7m52wwzglCDNU'
);

(async() => {
    console.log('🔍 Finding duplicate variants...\n');

    // Get all products
    const { data: products } = await supabase
        .from('products')
        .select('id, name');

    if (!products || products.length === 0) {
        console.log('No products found');
        return;
    }

    for (const product of products) {
        const { data: variants } = await supabase
            .from('variants')
            .select('*')
            .eq('product_id', product.id)
            .order('created_at', { ascending: true });

        // Group variants by color+storage combination
        const uniqueMap = new Map();
        const duplicates = [];

        variants.forEach(variant => {
            const key = `${variant.color}-${variant.storage}`;
            if (uniqueMap.has(key)) {
                // This is a duplicate - mark for deletion
                duplicates.push(variant.id);
                console.log(`❌ Duplicate found: ${product.name} - ${variant.color} ${variant.storage}GB (ID: ${variant.id.substring(0, 8)})`);
            } else {
                // Keep the first one (oldest)
                uniqueMap.set(key, variant);
                console.log(`✅ Keeping: ${product.name} - ${variant.color} ${variant.storage}GB (ID: ${variant.id.substring(0, 8)})`);
            }
        });

        // Delete duplicates
        if (duplicates.length > 0) {
            console.log(`\n🗑️  Deleting ${duplicates.length} duplicate variant(s) for ${product.name}...`);
            for (const dupId of duplicates) {
                const { error } = await supabase
                    .from('variants')
                    .delete()
                    .eq('id', dupId);

                if (error) {
                    console.error(`   Error deleting ${dupId}:`, error.message);
                } else {
                    console.log(`   ✓ Deleted ${dupId.substring(0, 8)}`);
                }
            }
        }
        console.log('');
    }

    console.log('✅ Cleanup complete!');
})();