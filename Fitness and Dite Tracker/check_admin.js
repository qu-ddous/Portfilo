const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });
const { createClient } = require('@supabase/supabase-client');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function checkAdmin() {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, name, role')
    .eq('role', 'admin');
  
  if (error) {
    console.error('Error fetching admin:', error);
    return;
  }
  
  console.log('Admin Users Found:', data);
}

checkAdmin();
