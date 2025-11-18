import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEmiPlans() {
  const { data, count, error } = await supabase
    .from('emi_plans')
    .select('*', { count: 'exact' });
  
  console.log('EMI Plans count:', count);
  console.log('Sample plans:', JSON.stringify(data?.slice(0, 3), null, 2));
  console.log('Error:', error);
  process.exit(0);
}

checkEmiPlans();
