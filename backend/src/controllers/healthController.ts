import { Request, Response } from 'express';
import { env } from '../config/env';
import { supabaseAdmin } from '../config/supabase';

export async function getHealth(req: Request, res: Response): Promise<void> {
  let dbStatus = 'not_configured';

  if (env.isSupabaseConfigured && supabaseAdmin) {
    try {
      // Test basic query to public.profiles or system table
      const { error } = await supabaseAdmin.from('profiles').select('id').limit(1);
      dbStatus = error ? `connected (table query check: ${error.message})` : 'connected';
    } catch (e: any) {
      dbStatus = `error (${e.message})`;
    }
  }

  res.status(200).json({
    success: true,
    status: 'healthy',
    service: 'PropWise Real Estate Intelligence API',
    environment: env.NODE_ENV,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: {
      provider: 'Supabase PostgreSQL',
      status: dbStatus,
      configured: env.isSupabaseConfigured
    }
  });
}
