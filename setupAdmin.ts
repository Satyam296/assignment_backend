import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

const setupAdmin = async () => {
  try {
    console.log('👤 Setting up admin account...');

    const email = 'satyamchhetri629@gmail.com';
    const password = 'admin123';

    // Check if admin exists
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('id, email')
      .eq('email', email)
      .single();
    
    if (existingAdmin) {
      console.log("✅ Admin user already exists!");
      console.log("📧 Email:", email);
      console.log("🔑 Password: admin123");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin
    const { data: admin, error } = await supabase
      .from('admins')
      .insert({
        email,
        password: hashedPassword,
        name: 'Admin'
      })
      .select()
      .single();

    if (error) throw error;

    console.log("✅ Admin user created successfully!");
    console.log("====================================");
    console.log("📧 Email:", email);
    console.log("🔑 Password: admin123");
    console.log("====================================");
    console.log("⚠️  IMPORTANT: Change the password in production!");

    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error setting up admin:", error.message);
    process.exit(1);
  }
};

setupAdmin();
