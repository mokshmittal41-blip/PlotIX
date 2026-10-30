import fs from 'fs';
import path from 'path';

export interface BackendUser {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  password?: string;
  avatarUrl?: string | null;
  role: string;
  authProvider: 'email' | 'phone' | 'google' | 'supabase';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(__dirname, '../../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf8');
}

export function readUsers(): BackendUser[] {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function writeUsers(users: BackendUser[]): void {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

export function findUserByIdentifier(identifier: string): BackendUser | undefined {
  const clean = identifier.trim().toLowerCase();
  const digits = clean.replace(/\D/g, '');
  const is10Digit = /^[6-9]\d{9}$/.test(digits);

  const users = readUsers();
  return users.find(u => {
    if (u.email && u.email.toLowerCase() === clean) return true;
    if (is10Digit && u.phone && u.phone.replace(/\D/g, '').endsWith(digits)) return true;
    if (u.phone && u.phone.toLowerCase() === clean) return true;
    return false;
  });
}

export function createBackendUser(userData: {
  fullName: string;
  identifier: string;
  password?: string;
  authProvider: 'email' | 'phone' | 'google';
  avatarUrl?: string;
  role?: string;
}): { success: boolean; user?: BackendUser; error?: string } {
  const existing = findUserByIdentifier(userData.identifier);
  if (existing) {
    return {
      success: false,
      error: 'An account with this email address or phone number already exists. Please sign in instead.'
    };
  }

  const clean = userData.identifier.trim();
  const digits = clean.replace(/\D/g, '');
  const isPhone = /^[6-9]\d{9}$/.test(digits);

  const newUser: BackendUser = {
    id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    fullName: userData.fullName || (isPhone ? `User ${digits.slice(-4)}` : clean.split('@')[0]),
    email: isPhone ? null : clean.toLowerCase(),
    phone: isPhone ? `+91 ${digits}` : null,
    password: userData.password,
    avatarUrl: userData.avatarUrl || null,
    role: userData.role || 'Property Pro',
    authProvider: userData.authProvider,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const users = readUsers();
  users.push(newUser);
  writeUsers(users);

  return { success: true, user: newUser };
}

export function upsertGoogleUser(googleData: {
  fullName: string;
  email: string;
  avatarUrl?: string;
}): BackendUser {
  const users = readUsers();
  const existingIndex = users.findIndex(u => u.email && u.email.toLowerCase() === googleData.email.toLowerCase());

  if (existingIndex >= 0) {
    const existing = users[existingIndex];
    const updated: BackendUser = {
      ...existing,
      fullName: googleData.fullName || existing.fullName,
      avatarUrl: googleData.avatarUrl || existing.avatarUrl,
      authProvider: 'google',
      isVerified: true,
      updatedAt: new Date().toISOString()
    };
    users[existingIndex] = updated;
    writeUsers(users);
    return updated;
  }

  const newUser: BackendUser = {
    id: `usr-g-${Date.now()}`,
    fullName: googleData.fullName || googleData.email.split('@')[0],
    email: googleData.email.toLowerCase(),
    phone: null,
    avatarUrl: googleData.avatarUrl || null,
    role: 'Verified Google Investor',
    authProvider: 'google',
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  users.push(newUser);
  writeUsers(users);
  return newUser;
}
