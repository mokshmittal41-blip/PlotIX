import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const rawAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const supabaseUrl = rawUrl;
export const supabaseAnonKey = rawAnonKey;

const isPlaceholder = (val: string) => 
  !val || val.includes('your-') || val.includes('PASTE_YOUR') || val.includes('placeholder');

export const isSupabaseConfigured = Boolean(
  rawUrl && 
  !isPlaceholder(rawUrl) && 
  rawAnonKey && 
  !isPlaceholder(rawAnonKey)
);

// Safe logging: print ONLY the resolved hostname (never keys or secrets)
if (isSupabaseConfigured) {
  try {
    const urlObj = new URL(rawUrl);
    console.log(`[Supabase Client] Configured host: ${urlObj.hostname}`);
  } catch {
    console.warn('[Supabase Client] Invalid URL format in VITE_SUPABASE_URL:', rawUrl);
  }
}

// Internal domain used exclusively for phone-number based password accounts
export const PHONE_AUTH_INTERNAL_DOMAIN = '@phone.propwise.in';

/**
 * Normalizes input identifier (Email or 10-Digit Indian Mobile Number)
 * for Supabase Authentication
 */
export function normalizeAuthIdentifier(input: string): {
  authEmail: string;
  type: 'email' | 'phone';
  rawPhone?: string;
  formattedDisplay: string;
} {
  const clean = input.trim();
  const digitsOnly = clean.replace(/\D/g, '');

  // Check if valid 10-digit Indian mobile number
  if (/^[6-9]\d{9}$/.test(digitsOnly)) {
    return {
      authEmail: `${digitsOnly}${PHONE_AUTH_INTERNAL_DOMAIN}`,
      type: 'phone',
      rawPhone: `+91 ${digitsOnly}`,
      formattedDisplay: `+91 ${digitsOnly}`
    };
  }

  // Otherwise treat as standard email
  return {
    authEmail: clean.toLowerCase(),
    type: 'email',
    formattedDisplay: clean
  };
}

// Initialize Supabase browser client
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured ? rawUrl : 'https://placeholder-project.supabase.co',
  isSupabaseConfigured ? rawAnonKey : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
);

