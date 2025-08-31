import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://sorojftjbkyngvanjsjl.supabase.co",
  "YOUR_ANON_KEY" // use anon key, NOT service role
);
