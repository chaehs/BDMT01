import { createClient } from '@supabase/supabase-js'

// Vite exposes environment variables on the import.meta.env object.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create and export the Supabase client.
// This assumes you have a .env file in the root of your project with:
// VITE_SUPABASE_URL=https://your-project-url.supabase.co
// VITE_SUPABASE_ANON_KEY=your-public-anon-key
export const supabase = createClient(supabaseUrl, supabaseKey);
