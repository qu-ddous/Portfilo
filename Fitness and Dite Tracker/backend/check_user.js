require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkUser() {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, password_hash, role')
    .ilike('email', '%mquddous%');
  
  if (error) { console.error('Error:', error); return; }
  
  if (!data || data.length === 0) {
    console.log('❌ No user found with that email!');
  } else {
    data.forEach(u => {
      console.log('✅ Found user:');
      console.log('  ID:', u.id);
      console.log('  Name:', u.name);
      console.log('  Email:', u.email);
      console.log('  Role:', u.role);
      console.log('  Active:', u.is_active);
      console.log('  Password hash exists:', !!u.password_hash);
    });
  }
}

checkUser();
