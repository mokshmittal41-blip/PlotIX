import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

let supabaseAdmin: SupabaseClient | null = null;
let supabaseClient: SupabaseClient | null = null;

if (env.isSupabaseConfigured) {
  // Admin client with service_role key - used only on server for trusted DB access and user management
  supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // Regular client with anon key
  supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
} else {
  console.warn(
    '[Supabase] Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not configured or set to placeholder. Backend will start in setup mode.'
  );
}

export { supabaseAdmin, supabaseClient };



