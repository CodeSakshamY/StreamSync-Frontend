import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://sorojftjbkyngvanjsjl.supabase.co",
  "YOUR_ANON_KEY" // use anon key, NOT service role
);
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
