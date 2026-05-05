const supabase = require('./config/supabase');

async function checkSchema() {
  console.log('--- Checking Database Schema ---');
  
  // Try to fetch one record to see available columns
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .limit(1);
    
  if (error) {
    console.error('Schema check failed:', error);
    return;
  }
  
  const columns = Object.keys(data[0] || {});
  console.log('Available Columns in "users" table:', columns);
  
  const required = ['phone', 'avatar', 'system_settings'];
  const missing = required.filter(col => !columns.includes(col));
  
  if (missing.length > 0) {
    console.log('⚠️ Missing Columns:', missing);
  } else {
    console.log('✅ All columns are present!');
  }
}

checkSchema();
