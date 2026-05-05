const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY); // Use service role for DDL

async function createTable() {
  // Since we can't run raw SQL directly via supabase client easily without a stored proc,
  // we usually rely on the user running it in the dashboard.
  // BUT, I can try to do a dummy insert which will fail but give me info, 
  // OR I can use the API to check if I can run SQL (if enabled).
  
  console.log("Please run the following SQL in your Supabase Dashboard SQL Editor:");
  console.log(`
    CREATE TABLE IF NOT EXISTS public.chat_messages (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
      receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    -- Enable RLS
    ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

    -- Create Policy
    CREATE POLICY "Users can see their own messages" ON public.chat_messages
      FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

    CREATE POLICY "Users can insert their own messages" ON public.chat_messages
      FOR INSERT WITH CHECK (auth.uid() = sender_id);
  `);
}

createTable();
