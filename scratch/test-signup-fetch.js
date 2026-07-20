const SUPABASE_URL = 'https://fsdabodejiudrgpiwvcc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_GH40OBg_sBQgq2XVIwE1kg_bUkRM1BN';

async function testSignup() {
  console.log('Sending request to', `${SUPABASE_URL}/auth/v1/signup`);
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: '+380507771935',
        password: 'Password123!',
        data: { first_name: 'Test', last_name: 'User' }
      })
    });
    
    const text = await res.text();
    console.log('Response Status:', res.status);
    console.log('Response Body:', text);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testSignup();
