import { Request, Response } from 'express';
import { 
  findUserByIdentifier, 
  createBackendUser, 
  upsertGoogleUser, 
  readUsers 
} from '../db/userStore';

export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const { identifier, password, fullName } = req.body;

    if (!identifier || !identifier.trim()) {
      res.status(400).json({ success: false, error: 'Phone number or email address is required.' });
      return;
    }

    if (!password || password.length < 6) {
      res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
      return;
    }

    const clean = identifier.trim();
    const digitsOnly = clean.replace(/\D/g, '');
    const isPhone = /^[6-9]\d{9}$/.test(digitsOnly);
    const authProvider = isPhone ? 'phone' : 'email';

    // Duplicate account check
    const existing = findUserByIdentifier(clean);
    if (existing) {
      res.status(409).json({ 
        success: false, 
        error: 'An account with this email address or phone number already exists. Please sign in instead.' 
      });
      return;
    }

    const result = createBackendUser({
      identifier: clean,
      password,
      fullName: fullName || (isPhone ? `User ${digitsOnly.slice(-4)}` : clean.split('@')[0]),
      authProvider
    });

    if (!result.success || !result.user) {
      res.status(400).json({ success: false, error: result.error || 'Failed to create user account.' });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'Account created successfully in backend database.',
      data: {
        id: result.user.id,
        fullName: result.user.fullName,
        email: result.user.email,
        phone: result.user.phone,
        role: result.user.role,
        authProvider: result.user.authProvider,
        avatarUrl: result.user.avatarUrl,
        isVerified: result.user.isVerified
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error during signup.' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      res.status(400).json({ success: false, error: 'Identifier and password are required.' });
      return;
    }

    const user = findUserByIdentifier(identifier);
    if (!user) {
      res.status(404).json({ 
        success: false, 
        error: 'No account found with this email or phone number. Please sign up first.' 
      });
      return;
    }

    if (user.password && user.password !== password) {
      res.status(401).json({ success: false, error: 'Invalid password. Please check your credentials.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        authProvider: user.authProvider,
        avatarUrl: user.avatarUrl,
        isVerified: user.isVerified
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error during login.' });
  }
}

export async function googleAuth(req: Request, res: Response): Promise<void> {
  try {
    const { email, fullName, avatarUrl } = req.body;

    if (!email || !email.trim()) {
      res.status(400).json({ success: false, error: 'Valid Google email is required.' });
      return;
    }

    const user = upsertGoogleUser({
      email: email.trim().toLowerCase(),
      fullName: fullName || email.split('@')[0],
      avatarUrl
    });

    res.status(200).json({
      success: true,
      message: 'Google authentication successful and saved to backend.',
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        authProvider: 'google',
        avatarUrl: user.avatarUrl,
        isVerified: true
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Google authentication failed on backend.' });
  }
}

export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = readUsers().map(u => ({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      phone: u.phone,
      role: u.role,
      authProvider: u.authProvider,
      isVerified: u.isVerified,
      createdAt: u.createdAt
    }));

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}
