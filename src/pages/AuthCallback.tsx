import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Loader2, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import PropWiseLogo from '../components/common/PropWiseLogo';
import './AuthCallback.css';

interface AuthCallbackProps {
  onNavigate?: (page: string, propertyId?: string) => void;
}

export default function AuthCallback({ onNavigate }: AuthCallbackProps) {
  const { refreshProfile } = useAuth();
  const { addToast } = useApp();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Refs to prevent race conditions and stale closure evaluation
  const isResolvedRef = useRef<boolean>(false);
  const hasExchangedRef = useRef<boolean>(false);

  const handleSuccess = useCallback(async (user: any) => {
    if (isResolvedRef.current) return;
    isResolvedRef.current = true;

    const meta = user.user_metadata || {};
    const fullName = meta.full_name || meta.name || user.email?.split('@')[0] || 'Property Investor';
    const avatarUrl = meta.avatar_url || meta.picture || null;

    try {
      await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: fullName,
        avatar_url: avatarUrl,
        role: 'Verified Google Investor',
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    } catch (profileErr) {
      console.warn('[AuthCallback] Profile upsert notice:', profileErr);
    }

    try {
      await refreshProfile();
    } catch (refreshErr) {
      console.warn('[AuthCallback] refreshProfile notice:', refreshErr);
    }

    setStatus('success');
    addToast(`Welcome, ${fullName}! Signed in successfully with Google.`, 'success');

    // Clean URL query parameters and navigate cleanly
    setTimeout(() => {
      try {
        window.history.replaceState({}, document.title, '/');
      } catch {
        // Fallback if history state restricted
      }

      if (onNavigate) {
        onNavigate('home');
      } else {
        window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'home' }));
      }
    }, 1200);
  }, [refreshProfile, addToast, onNavigate]);

  const handleError = useCallback((msg: string) => {
    if (isResolvedRef.current) return;
    isResolvedRef.current = true;
    setStatus('error');
    setErrorMessage(msg);
  }, []);

  useEffect(() => {
    let isMounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;
    let timeoutId: any = null;

    async function handleAuthCallback() {
      try {
        // 1. Check URL for direct error parameters from OAuth provider
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, '?'));

        const error = searchParams.get('error') || hashParams.get('error');
        const errorDescription = searchParams.get('error_description') || hashParams.get('error_description');

        if (error) {
          if (isMounted) {
            handleError(errorDescription || error || 'Google sign-in was canceled or failed.');
          }
          return;
        }

        // 2. Check if a session already exists (e.g. detectSessionInUrl handled it automatically)
        const { data: initialData } = await supabase.auth.getSession();
        if (initialData?.session?.user) {
          if (isMounted) {
            await handleSuccess(initialData.session.user);
          }
          return;
        }

        // 3. If PKCE auth code is in query params and no session yet, exchange it safely once
        const authCode = searchParams.get('code');
        if (authCode && !hasExchangedRef.current) {
          hasExchangedRef.current = true;
          try {
            const { data: exchangeData, error: exchangeErr } = await supabase.auth.exchangeCodeForSession(authCode);
            if (exchangeErr) {
              console.warn('[AuthCallback] exchangeCodeForSession notice:', exchangeErr.message);
            } else if (exchangeData?.session?.user && isMounted) {
              await handleSuccess(exchangeData.session.user);
              return;
            }
          } catch (codeErr) {
            console.warn('[AuthCallback] exchangeCodeForSession exception:', codeErr);
          }
        }

        // 4. Re-check session after possible exchange
        const { data: retryData } = await supabase.auth.getSession();
        if (retryData?.session?.user && isMounted) {
          await handleSuccess(retryData.session.user);
          return;
        }

        // 5. Listen to onAuthStateChange in case token exchange is still in flight
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (!isMounted || isResolvedRef.current) return;

          if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && newSession?.user) {
            await handleSuccess(newSession.user);
            subscription?.unsubscribe();
          }
        });
        authSubscription = subscription;

        // 6. Safe 15-second timeout guarded by isResolvedRef (immune to stale closures)
        timeoutId = setTimeout(() => {
          if (isMounted && !isResolvedRef.current) {
            handleError('Authentication timed out. Please try signing in again.');
            authSubscription?.unsubscribe();
          }
        }, 15000);

      } catch (err: any) {
        if (isMounted && !isResolvedRef.current) {
          handleError(err?.message || 'An unexpected error occurred during Google OAuth callback.');
        }
      }
    }

    handleAuthCallback();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      if (authSubscription) authSubscription.unsubscribe();
    };
  }, [handleSuccess, handleError]);

  const handleReturnToLogin = () => {
    try {
      window.history.replaceState({}, document.title, '/');
    } catch {}
    if (onNavigate) {
      onNavigate('signin');
    } else {
      window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'signin' }));
    }
  };

  return (
    <div className="auth-callback-root">
      <motion.div 
        className="auth-callback-card"
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="auth-callback-brand">
          <PropWiseLogo size="lg" />
        </div>

        {status === 'loading' && (
          <div className="auth-callback-body">
            <div className="auth-callback-spinner-wrap">
              <Loader2 className="animate-spin" size={40} color="#059669" />
            </div>
            <h2>Completing Google Authentication</h2>
            <p>Connecting securely to Supabase and verifying your Google session...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="auth-callback-body success">
            <div className="auth-callback-icon-wrap success">
              <CheckCircle2 size={44} color="#10B981" />
            </div>
            <h2>Authentication Verified!</h2>
            <p>Redirecting to your PropWise dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="auth-callback-body error">
            <div className="auth-callback-icon-wrap error">
              <AlertCircle size={44} color="#EF4444" />
            </div>
            <h2>Authentication Failed</h2>
            <p className="auth-callback-error-desc">{errorMessage}</p>
            <button 
              type="button" 
              className="auth-callback-action-btn"
              onClick={handleReturnToLogin}
            >
              <span>Return to Sign In</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
