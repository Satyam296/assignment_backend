const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://eszzeisfvnfpvvpvluam.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzenplaXNmdm5mcHZ2cHZsdWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwMDkwNTAsImV4cCI6MjA0NzU4NTA1MH0.nI2heLB8K89LqebnjprEPNtqXSp0YJ7m52wwzglCDNU'
);

(async() => {
    const { data: product } = await supabase
        .from('products')
        .select('id, name, slug')
        .eq('slug', 'google-pixel-9-pro')
        .single();

    if (product) {
        console.log('Product:', product.name);
        const { data: variants } = await supabase
            .from('variants')
            .select('id, color, storage, name')
            .eq('product_id', product.id)
            .order('color', { ascending: true })
            .order('storage', { ascending: true });

        console.log('\nTotal variants:', variants.length);
        console.log('\nVariants:');
        variants.forEach((v, i) => {
            console.log(`${i + 1}. ${v.color} - ${v.storage} GB (ID: ${v.id.substring(0, 8)}...)`);
        });
    }
})();