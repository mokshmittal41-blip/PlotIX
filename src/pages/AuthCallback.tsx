import { useEffect, useState, useRef } from 'react';
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

// Module-level set of authorization codes currently exchanging or already exchanged.
// Survives React component remounts (including React StrictMode double-mount).
const processedCodes = new Set<string>();

export default function AuthCallback({ onNavigate }: AuthCallbackProps) {
  const { refreshProfile } = useAuth();
  const { addToast } = useApp();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Keep latest callbacks in refs so the useEffect never re-triggers due to dependency changes
  const onNavigateRef = useRef(onNavigate);
  onNavigateRef.current = onNavigate;

  const refreshProfileRef = useRef(refreshProfile);
  refreshProfileRef.current = refreshProfile;

  const addToastRef = useRef(addToast);
  addToastRef.current = addToast;

  // Single-resolution guard for this component instance
  const isResolvedRef = useRef<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: any = null;

    const navigateToHome = () => {
      try {
        window.history.replaceState({}, document.title, '/');
      } catch {}

      if (onNavigateRef.current) {
        onNavigateRef.current('home');
      } else {
        window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'home' }));
      }
    };

    const handleSuccess = async (user: any) => {
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
        if (refreshProfileRef.current) {
          await refreshProfileRef.current();
        }
      } catch (refreshErr) {
        console.warn('[AuthCallback] refreshProfile notice:', refreshErr);
      }

      if (isMounted) {
        setStatus('success');
        if (addToastRef.current) {
          addToastRef.current(`Welcome, ${fullName}! Signed in successfully with Google.`, 'success');
        }

        // Clean URL query parameters and redirect to dashboard
        setTimeout(() => {
          if (isMounted) {
            navigateToHome();
          }
        }, 1000);
      }
    };

    const handleError = (msg: string) => {
      if (isResolvedRef.current) return;
      isResolvedRef.current = true;
      if (isMounted) {
        setStatus('error');
        setErrorMessage(msg);
      }
    };

    async function processAuth() {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, '?'));

        // 1. Direct error in URL from OAuth provider (e.g. user canceled Google consent)
        const errorParam = searchParams.get('error') || hashParams.get('error');
        const errorDescParam = searchParams.get('error_description') || hashParams.get('error_description');

        if (errorParam) {
          // Clean error parameters from URL
          try {
            window.history.replaceState({}, document.title, window.location.pathname);
          } catch {}
          handleError(errorDescParam || errorParam || 'Google sign-in was canceled.');
          return;
        }

        const authCode = searchParams.get('code');

        // 2. If NO code parameter in URL, check if an active session already exists
        if (!authCode) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && isMounted) {
            await handleSuccess(session.user);
          } else if (isMounted) {
            handleError('No authentication authorization code found.');
          }
          return;
        }

        // 3. Prevent duplicate code exchange:
        // Check module-level Set AND sessionStorage lock
        const sessionLockKey = `sb_pkce_${authCode}`;
        const alreadyProcessed = processedCodes.has(authCode) || (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(sessionLockKey));

        if (alreadyProcessed) {
          // Already exchanging or exchanged this code: check current session
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && isMounted) {
            await handleSuccess(session.user);
          }
          return;
        }

        // Mark as being processed immediately
        processedCodes.add(authCode);
        try {
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(sessionLockKey, 'true');
          }
        } catch {}

        // Immediately scrub ?code= from the browser URL bar so it cannot be read again
        try {
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch {}

        // 4. Manually exchange the PKCE authorization code for a session (EXACTLY ONCE)
        const { data: exchangeData, error: exchangeErr } = await supabase.auth.exchangeCodeForSession(authCode);

        if (exchangeErr) {
          // Check if session was already established despite error
          const { data: existingSessionData } = await supabase.auth.getSession();
          if (existingSessionData?.session?.user && isMounted) {
            await handleSuccess(existingSessionData.session.user);
            return;
          }

          if (isMounted) {
            handleError(exchangeErr.message || 'Failed to exchange authorization code for session.');
          }
          return;
        }

        if (exchangeData?.session?.user && isMounted) {
          await handleSuccess(exchangeData.session.user);
          return;
        }

        // Fallback session verification
        const { data: finalSessionData } = await supabase.auth.getSession();
        if (finalSessionData?.session?.user && isMounted) {
          await handleSuccess(finalSessionData.session.user);
        } else if (isMounted) {
          handleError('Authentication completed but no active user session was established.');
        }

      } catch (err: any) {
        if (isMounted) {
          handleError(err?.message || 'An unexpected error occurred during Google authentication.');
        }
      }
    }

    // Set a safety timeout (12s) in case of extreme network latency
    timeoutId = setTimeout(() => {
      if (isMounted && !isResolvedRef.current) {
        handleError('Authentication timed out. Please try signing in again.');
      }
    }, 12000);

    processAuth();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []); // Run strictly ONCE on mount

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
