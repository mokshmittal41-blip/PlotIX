import React, { createContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured, normalizeAuthIdentifier, supabaseUrl, supabaseAnonKey, getAuthRedirectUrl } from '../lib/supabaseClient';
import { apiClient } from '../services/apiClient';

export interface UserProfile {
  id: string;
  name: string;
  identifier: string; // email or formatted phone
  type: 'email' | 'phone' | 'google';
  authProvider: 'supabase' | 'google' | 'demo';
  isDemo: boolean;
  isVerified: boolean;
  avatar?: string;
  memberSince: string;
  role?: string;
  backendSynced?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCloudConfigured: boolean;
  signup: (identifier: string, password?: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  login: (identifier: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (demoProfile: { name: string; email: string; role?: string; avatar?: string }) => void;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const STORAGE_KEY_AUTH = 'propwise_auth_user';

export const AuthContext = createContext<AuthContextType | null>(null);

export { useAuth } from './useAuth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY_AUTH);
        if (stored) {
          return JSON.parse(stored);
        }
      }
    } catch (e) {
      console.error('Failed to load user from localStorage:', e);
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(true);

  // Helper to construct UserProfile from Supabase user and profile data
  const buildUserProfile = useCallback((supabaseUser: any, profileData?: any): UserProfile => {
    const isGoogle = supabaseUser.app_metadata?.provider === 'google' || 
                     supabaseUser.identities?.some((id: any) => id.provider === 'google');
    
    const email = supabaseUser.email || '';
    const isInternalPhone = email.includes('@phone.propwise.');
    const rawPhone = profileData?.phone || supabaseUser.user_metadata?.phone || (isInternalPhone ? email.split('@')[0] : null);
    const cleanEmail = isInternalPhone ? null : email;
    const cleanPhone = rawPhone && !rawPhone.startsWith('+91') && /^\d{10}$/.test(rawPhone) ? `+91 ${rawPhone}` : rawPhone;

    const googleName = supabaseUser.user_metadata?.full_name || 
                       supabaseUser.user_metadata?.name || 
                       supabaseUser.user_metadata?.user_name;

    const fallbackName = cleanEmail ? cleanEmail.split('@')[0] : (cleanPhone ? `User ${cleanPhone.slice(-4)}` : 'Property Pro');
    const fullName = profileData?.full_name || googleName || fallbackName;
    const formattedName = fullName.charAt(0).toUpperCase() + fullName.slice(1);

    const authType: 'email' | 'phone' | 'google' = isGoogle 
      ? 'google' 
      : (isInternalPhone ? 'phone' : 'email');

    const avatarUrl = profileData?.avatar_url || 
                      supabaseUser.user_metadata?.avatar_url || 
                      supabaseUser.user_metadata?.picture;

    return {
      id: supabaseUser.id,
      name: formattedName,
      identifier: (authType === 'phone' ? cleanPhone : cleanEmail) || 'Google User',
      type: authType,
      authProvider: isGoogle ? 'google' : 'supabase',
      isDemo: false,
      isVerified: true,
      avatar: avatarUrl,
      memberSince: new Date(supabaseUser.created_at || Date.now()).getFullYear().toString(),
      role: profileData?.role || (isGoogle ? 'Verified Google Investor' : 'Property Pro'),
      backendSynced: !!profileData
    };
  }, []);

  // Fetch Supabase public.profiles table or backend auxiliary profile
  const fetchUserProfile = useCallback(async (supabaseUser: any) => {
    try {
      // 1. First attempt to fetch from Supabase public.profiles table
      let profileData: any = null;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', supabaseUser.id)
          .maybeSingle();

        if (!error && data) {
          profileData = data;
        }
      } catch (err) {
        console.warn('[Supabase Profiles] Note on fetching profile from public.profiles:', err);
      }

      // 2. Build profile and store
      const profile = buildUserProfile(supabaseUser, profileData);
      setUser(profile);
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(profile));

      // 3. Inform Express backend of user context for additional application data
      try {
        apiClient.getMe().catch(() => null);
      } catch {
        // Backend optional auxiliary call
      }
    } catch {
      const fallback = buildUserProfile(supabaseUser);
      setUser(fallback);
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(fallback));
    }
  }, [buildUserProfile]);

  // Reset loading state on browser Back button restore (bfcache) or window focus
  useEffect(() => {
    const handleRestore = () => {
      setIsLoading(false);
    };
    window.addEventListener('pageshow', handleRestore);
    return () => window.removeEventListener('pageshow', handleRestore);
  }, []);

  // Initialize Supabase Auth Session listener
  useEffect(() => {
    let mounted = true;

    // Safety timeout: never let initial auth check block the app for more than 2 seconds
    const safetyTimer = setTimeout(() => {
      if (mounted) setIsLoading(false);
    }, 2000);

    async function initAuth() {
      if (!isSupabaseConfigured) {
        clearTimeout(safetyTimer);
        setIsLoading(false);
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('[Supabase Auth] Session getSession notice:', error.message);
        }

        if (session?.user && mounted) {
          await fetchUserProfile(session.user);
        } else if (mounted) {
          const storedAuth = localStorage.getItem(STORAGE_KEY_AUTH);
          if (storedAuth) {
            try {
              const parsed = JSON.parse(storedAuth);
              // Only keep demo sessions if not authenticated in Supabase
              if (parsed?.isDemo) {
                setUser(parsed);
              } else {
                // If stored auth is not demo and no active Supabase session, clear it
                setUser(null);
                localStorage.removeItem(STORAGE_KEY_AUTH);
              }
            } catch {
              setUser(null);
              localStorage.removeItem(STORAGE_KEY_AUTH);
            }
          }
        }
      } catch (err: any) {
        console.warn('[Supabase Auth] Init notice:', err?.message);
      } finally {
        clearTimeout(safetyTimer);
        if (mounted) setIsLoading(false);
      }
    }

    initAuth();

    // Subscribe to Supabase auth state changes (OAuth redirects, logins, signouts)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (session?.user) {
          // If user signed in or updated, ensure profile exists in public.profiles
          if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
            try {
              const meta = session.user.user_metadata || {};
              await supabase.from('profiles').upsert({
                id: session.user.id,
                email: session.user.email,
                full_name: meta.full_name || meta.name || session.user.email?.split('@')[0],
                avatar_url: meta.avatar_url || meta.picture,
                updated_at: new Date().toISOString()
              }, { onConflict: 'id' });
            } catch {
              // Ignore if table schema not initialized yet
            }
          }

          await fetchUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem(STORAGE_KEY_AUTH);
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchUserProfile]);

  /**
   * Authoritative Supabase Auth Signup
   * Flow: Signup.tsx -> AuthContext.tsx -> supabase.auth.signUp() -> auth.users -> public.profiles
   */
  const signup = useCallback(async (
    identifier: string, 
    password?: string, 
    name?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Supabase credentials are not configured. Please check your .env file.'
      };
    }

    const { authEmail, type, rawPhone } = normalizeAuthIdentifier(identifier);

    if (!password || password.length < 6) {
      setIsLoading(false);
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    if (type === 'phone' && !rawPhone) {
      setIsLoading(false);
      return { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
    }

    const defaultName = name || (type === 'email' ? authEmail.split('@')[0] : `User ${rawPhone?.slice(-4)}`);
    const formattedName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);

    try {
      // 1. Direct Supabase Auth SignUp -> creates record in Supabase auth.users
      const { data, error } = await supabase.auth.signUp({
        email: authEmail,
        password: password,
        options: {
          emailRedirectTo: getAuthRedirectUrl(),
          data: {
            full_name: formattedName,
            phone: rawPhone || null,
            name: formattedName
          }
        }
      });

      if (error) {
        setIsLoading(false);
        const msg = error.message.toLowerCase();
        if (msg.includes('already registered') || msg.includes('user already exists') || msg.includes('duplicate')) {
          return { 
            success: false, 
            error: 'An account with this email address or phone number already exists. Please sign in instead.' 
          };
        }
        if (msg.includes('failed to fetch') || msg.includes('network') || msg.includes('name not resolved')) {
          return {
            success: false,
            error: 'Unable to reach Supabase project. Please verify that your Supabase Project URL in .env is valid and active.'
          };
        }
        return { success: false, error: error.message };
      }

      if (!data.user) {
        setIsLoading(false);
        return { success: false, error: 'User registration failed. No user was returned by Supabase.' };
      }

      // 2. Insert or Upsert into Supabase public.profiles table
      try {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: data.user.email,
          phone: rawPhone || null,
          full_name: formattedName,
          role: 'Property Pro',
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      } catch (profileErr) {
        console.warn('[Supabase Profiles] Notice upserting profile in public.profiles:', profileErr);
      }

      // 3. Build authenticated user profile & establish session
      const newProfile = buildUserProfile(data.user, {
        full_name: formattedName,
        phone: rawPhone
      });

      setUser(newProfile);
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newProfile));
      setIsLoading(false);
      return { success: true };

    } catch (err: any) {
      setIsLoading(false);
      const errText = err?.message || String(err);
      if (errText.includes('Failed to fetch') || errText.includes('NetworkError')) {
        return {
          success: false,
          error: 'Network connection to Supabase failed. Please verify your internet connection and Supabase Project URL.'
        };
      }
      return { success: false, error: errText || 'Registration failed.' };
    }
  }, [buildUserProfile]);

  /**
   * Authoritative Supabase Auth Login
   * Flow: Signup.tsx/Login.tsx -> AuthContext.tsx -> supabase.auth.signInWithPassword() -> Supabase Auth
   */
  const login = useCallback(async (
    identifier: string, 
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Supabase credentials are not configured. Please check your .env file.'
      };
    }

    const { authEmail } = normalizeAuthIdentifier(identifier);

    if (!password) {
      setIsLoading(false);
      return { success: false, error: 'Please enter your password.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: password
      });

      if (error) {
        setIsLoading(false);
        const msg = error.message.toLowerCase();
        if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
          return { success: false, error: 'Invalid email/phone or password. Please check your credentials.' };
        }
        if (msg.includes('email not confirmed')) {
          return { 
            success: false, 
            error: 'Email confirmation is currently enabled in your Supabase project. Please confirm your email or disable "Confirm email" under Authentication ➔ Providers ➔ Email in Supabase Dashboard.' 
          };
        }
        if (msg.includes('failed to fetch') || msg.includes('network')) {
          return { success: false, error: 'Unable to reach Supabase project. Please check your connection and .env URL.' };
        }
        return { success: false, error: error.message };
      }

      if (data.user) {
        await fetchUserProfile(data.user);
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: 'Login did not return a valid user.' };
    } catch (err: any) {
      setIsLoading(false);
      const errText = err?.message || String(err);
      if (errText.includes('Failed to fetch')) {
        return { success: false, error: 'Network error connecting to Supabase Auth.' };
      }
      return { success: false, error: errText || 'Login failed.' };
    }
  }, [fetchUserProfile]);

  /**
   * Authoritative Google OAuth through Supabase
   * Flow: Supabase OAuth -> Google Cloud Consent -> /auth/callback -> Supabase auth.users
   */
  const loginWithGoogle = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Supabase is not configured with a valid project URL.'
      };
    }

    try {
      // 1. Pre-flight check: verify Supabase backend is reachable and not paused
      // Prevents browser from redirecting into an unresolvable DNS_PROBE_FINISHED_NXDOMAIN crash
      const pingController = new AbortController();
      const pingTimer = setTimeout(() => pingController.abort(), 3500);
      try {
        await fetch(`${supabaseUrl}/auth/v1/health`, {
          method: 'GET',
          headers: { apikey: supabaseAnonKey },
          signal: pingController.signal
        });
        clearTimeout(pingTimer);
      } catch {
        clearTimeout(pingTimer);
        setIsLoading(false);
        return {
          success: false,
          error: 'Your Supabase project is currently PAUSED or unreachable. Free-tier Supabase projects automatically pause after 7 days of inactivity. Please go to https://supabase.com/dashboard and click "Restore project" to unpause it.'
        };
      }

      // 2. Trigger real Supabase Google OAuth
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getAuthRedirectUrl(),
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account'
          }
        }
      });

      if (error) {
        setIsLoading(false);
        const msg = error.message.toLowerCase();
        if (msg.includes('unsupported provider') || msg.includes('not enabled')) {
          return {
            success: false,
            error: 'Google Sign-In is not enabled yet in your Supabase project. Please enable Google provider in Supabase Dashboard ➔ Authentication ➔ Providers ➔ Google.'
          };
        }
        return { success: false, error: error.message };
      }

      // Supabase signInWithOAuth redirects browser directly to Google OAuth page
      // Safety reset: if user presses browser "Back" from Google, ensure auth state isn't stuck loading
      setTimeout(() => setIsLoading(false), 2000);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Google authentication failed.' };
    }
  }, []);

  // Sandbox Demo Mode Profile Switcher
  const loginAsDemo = useCallback((demoProfile: {
    name: string;
    email: string;
    role?: string;
    avatar?: string;
  }) => {
    setIsLoading(true);
    const demoUser: UserProfile = {
      id: `usr-demo-${Date.now()}`,
      name: demoProfile.name,
      identifier: demoProfile.email,
      type: 'email',
      authProvider: 'demo',
      isDemo: true,
      isVerified: false,
      avatar: demoProfile.avatar,
      memberSince: new Date().getFullYear().toString(),
      role: demoProfile.role || 'Property Investor (Demo Sandbox)',
      backendSynced: false
    };

    setUser(demoUser);
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(demoUser));
    setIsLoading(false);
  }, []);

  // Logout handler
  const logout = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut().catch(() => null);
    }
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_AUTH);
  }, []);

  // Refresh profile
  const refreshProfile = useCallback(async () => {
    if (isSupabaseConfigured) {
      const { data: { user: sUser } } = await supabase.auth.getUser();
      if (sUser) {
        await fetchUserProfile(sUser);
      }
    }
  }, [fetchUserProfile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isCloudConfigured: isSupabaseConfigured,
        signup,
        login,
        loginWithGoogle,
        loginAsDemo,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
