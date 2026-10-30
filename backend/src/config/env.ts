import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

export interface AppEnv {
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  FRONTEND_URL: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  isSupabaseConfigured: boolean;
  APIFY_API_KEY?: string;
  APIFY_ACTOR_ID?: string;
  AUTO_SYNC_ENABLED: boolean;
  AUTO_SYNC_INTERVAL_HOURS: number;
}

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const isPlaceholder = (val: string) => 
  !val || val.includes('your-') || val.includes('PASTE_YOUR') || val.includes('placeholder');

export const env: AppEnv = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: (process.env.NODE_ENV as AppEnv['NODE_ENV']) || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5174',
  SUPABASE_URL: supabaseUrl,
  SUPABASE_ANON_KEY: supabaseAnonKey,
  SUPABASE_SERVICE_ROLE_KEY: supabaseServiceKey,
  isSupabaseConfigured: Boolean(
    supabaseUrl && 
    !isPlaceholder(supabaseUrl) && 
    supabaseServiceKey && 
    !isPlaceholder(supabaseServiceKey)
  ),
  APIFY_API_KEY: process.env.APIFY_API_KEY || '',
  APIFY_ACTOR_ID: process.env.APIFY_ACTOR_ID || 'epctex/magicbricks-scraper',
  AUTO_SYNC_ENABLED: process.env.AUTO_SYNC_ENABLED !== 'false',
  AUTO_SYNC_INTERVAL_HOURS: parseInt(process.env.AUTO_SYNC_INTERVAL_HOURS || '12', 10)
};
