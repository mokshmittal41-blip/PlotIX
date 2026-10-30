import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';

export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    if (!supabaseAdmin) {
      res.status(503).json({ success: false, error: 'Supabase is not configured on server.' });
      return;
    }

    // Query profiles table for linked PostgreSQL record
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('[getMe] Error fetching user profile:', error);
    }

    const email = user.email || '';
    const isInternalPhoneEmail = email.includes('@phone.propwise.');

    const cleanEmail = isInternalPhoneEmail ? null : email;
    const cleanPhone = profile?.phone || user.user_metadata?.phone || (isInternalPhoneEmail ? email.split('@')[0] : null);

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        fullName: profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || 'Property Pro',
        email: cleanEmail,
        phone: cleanPhone,
        avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url || null,
        role: profile?.role || 'Property Pro',
        authProvider: user.user_metadata?.iss ? 'google' : (isInternalPhoneEmail ? 'phone' : 'email'),
        createdAt: profile?.created_at || user.created_at,
        updatedAt: profile?.updated_at || user.created_at
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch user data.' });
  }
}

export async function getProfile(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user;

    if (!user || !supabaseAdmin) {
      res.status(401).json({ success: false, error: 'Unauthorized or Supabase not configured.' });
      return;
    }

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      res.status(500).json({ success: false, error: error.message });
      return;
    }

    if (!profile) {
      // If profile doesn't exist yet, return user metadata
      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          fullName: user.user_metadata?.full_name || 'Property Pro',
          email: user.email?.includes('@phone.propwise.') ? null : user.email,
          phone: user.user_metadata?.phone || null,
          avatarUrl: user.user_metadata?.avatar_url || null,
          role: 'Property Pro'
        }
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user;
    const { fullName, phone, avatarUrl } = req.body;

    if (!user || !supabaseAdmin) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    if (fullName !== undefined) updates.full_name = fullName;
    if (avatarUrl !== undefined) updates.avatar_url = avatarUrl;
    if (phone !== undefined) {
      // Basic normalization of 10-digit Indian phone
      const cleanDigits = phone.replace(/\D/g, '');
      if (cleanDigits.length === 10) {
        updates.phone = `+91 ${cleanDigits}`;
      } else {
        updates.phone = phone;
      }
    }

    const { data: updatedProfile, error } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: user.id,
        ...updates
      })
      .select('*')
      .single();

    if (error) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: updatedProfile
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function syncProfile(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user;
    const { fullName, phone } = req.body;

    if (!user || !supabaseAdmin) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const email = user.email || '';
    const isInternalPhone = email.includes('@phone.propwise.');

    const cleanEmail = isInternalPhone ? null : email;
    const cleanPhone = phone || user.user_metadata?.phone || (isInternalPhone ? email.split('@')[0] : null);
    const cleanFullName = fullName || user.user_metadata?.full_name || user.user_metadata?.name || 'Property Pro';

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: cleanFullName,
        email: cleanEmail,
        phone: cleanPhone,
        avatar_url: user.user_metadata?.avatar_url || null,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })
      .select('*')
      .single();

    if (error) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Profile synced with cloud database.',
      data
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}
