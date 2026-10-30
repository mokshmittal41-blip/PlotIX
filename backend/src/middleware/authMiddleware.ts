import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { env } from '../config/env';

// Extend Express Request type to attach authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        phone?: string;
        user_metadata?: Record<string, any>;
        role?: string;
        aud?: string;
        created_at?: string;
      };
      token?: string;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized: Missing or malformed Authorization header with Bearer token.'
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized: Access token is missing.'
      });
      return;
    }

    if (!supabaseAdmin) {
      res.status(503).json({
        success: false,
        error: 'Service Unavailable: Supabase credentials are not configured on the server. Please check backend/.env.'
      });
      return;
    }

    // Verify token with Supabase Auth API
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({
        success: false,
        error: `Unauthorized: ${error?.message || 'Invalid or expired session token.'}`
      });
      return;
    }

    // Attach verified user payload to request
    req.user = user as any;
    req.token = token;
    next();
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: `Internal Authentication Error: ${err.message || 'Failed to authenticate request.'}`
    });
  }
}
