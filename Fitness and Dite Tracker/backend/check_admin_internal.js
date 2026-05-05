const supabase = require('./config/supabase');

async function checkAdmin() {
  console.log('--- Checking Admin Users ---');
  const { data, error } = await supabase
    .from('users')
    .select('id, email, name, role')
    .eq('role', 'admin');
  
  if (error) {
    console.error('Error fetching admin:', error);
    return;
  }
  
  if (data.length === 0) {
    console.log('No admin users found.');
  } else {
    console.log('Admin Users:', JSON.stringify(data, null, 2));
  }
}

checkAdmin();
