import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), 'apps/product-core/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignUp() {
  console.log('Attempting sign up...');
  const { data, error } = await supabase.auth.signUp({
    phone: '+380507771935',
    password: 'Password123!',
    options: {
      data: { first_name: 'Test', last_name: 'User' },
    },
  });

  if (error) {
    console.error('Signup Error:', error);
  } else {
    console.log('Signup Success:', data);
  }
}

testSignUp().catch(console.error);
