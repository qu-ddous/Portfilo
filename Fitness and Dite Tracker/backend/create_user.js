require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function createUser() {
  const email    = 'mquddous@gmail.com';
  const password = 'qudodus4293';
  const name     = 'Muhammad Quddous';

  // Check if already exists
  const { data: existing } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', email)
    .single();

  if (existing) {
    console.log('⚠️  User already exists:', existing.email);
    // Reset password instead
    const hash = await bcrypt.hash(password, 12);
    const { error } = await supabase
      .from('users')
      .update({ password_hash: hash })
      .eq('email', email);
    if (error) { console.error('Reset error:', error); return; }
    console.log('✅ Password reset successfully for:', email);
    return;
  }

  // Create new user
  const password_hash = await bcrypt.hash(password, 12);
  const { data, error } = await supabase
    .from('users')
    .insert([{ name, email, password_hash, role: 'user' }])
    .select('id, email, role');

  if (error) { console.error('Create error:', error); return; }
  console.log('✅ User created successfully!');
  console.log('  Email:', data[0].email);
  console.log('  ID:', data[0].id);
  console.log('  Role:', data[0].role);
  console.log('\nYou can now login with:');
  console.log('  Email:', email);
  console.log('  Password:', password);
}

createUser();
