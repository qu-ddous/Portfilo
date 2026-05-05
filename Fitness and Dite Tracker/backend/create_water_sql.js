const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function setupWaterTable() {
  console.log("Please run this SQL in Supabase Dashboard:");
  console.log(`
    CREATE TABLE IF NOT EXISTS public.water_logs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
      amount_ml INTEGER NOT NULL,
      logged_date DATE DEFAULT CURRENT_DATE,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    -- Unique constraint to handle daily totals or multiple logs per day
    -- Depending on design, we can either sum logs or have one row per day.
    -- Let's allow multiple entries per day for real-time "adding" feel.

    ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can manage their water logs" ON public.water_logs
      FOR ALL USING (auth.uid() = user_id);
    
    -- Index for performance
    CREATE INDEX IF NOT EXISTS water_logs_user_date_idx ON public.water_logs (user_id, logged_date);
  `);
}

setupWaterTable();
