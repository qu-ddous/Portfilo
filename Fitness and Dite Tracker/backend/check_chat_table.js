const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkTable() {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error selecting from chat_messages:', error);
  } else {
    console.log('Successfully selected from chat_messages. Columns:', Object.keys(data[0] || {}));
  }
}

checkTable();
