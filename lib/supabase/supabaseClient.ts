import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_DATABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
