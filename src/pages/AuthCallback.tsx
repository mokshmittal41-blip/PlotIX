import { useEffect, useState } from 'react';
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

  useEffect(() => {
    let isMounted = true;

    async function handleAuthCallback() {
      try {
        // 1. Check URL for direct error parameters from OAuth provider
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));

        const error = searchParams.get('error') || hashParams.get('error');
        const errorDescription = searchParams.get('error_description') || hashParams.get('error_description');

        if (error) {
          if (isMounted) {
            setStatus('error');
            setErrorMessage(errorDescription || error || 'Google sign-in was canceled or failed.');
          }
          return;
        }

        // 2. If PKCE auth code is in query params, exchange it for session
        const authCode = searchParams.get('code');
        if (authCode) {
          try {
            await supabase.auth.exchangeCodeForSession(authCode);
          } catch (codeErr) {
            console.warn('[AuthCallback] exchangeCodeForSession notice:', codeErr);
          }
        }

        // 3. Fetch session from Supabase PKCE / URL session handler
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          if (isMounted) {
            setStatus('error');
            setErrorMessage(sessionError.message || 'Failed to retrieve authenticated session.');
          }
          return;
        }

        if (session?.user) {
          const user = session.user;
          const meta = user.user_metadata || {};
          const fullName = meta.full_name || meta.name || user.email?.split('@')[0] || 'Property Investor';
          const avatarUrl = meta.avatar_url || meta.picture || null;

          // 3. Upsert authentic user profile in Supabase public.profiles
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

          // 4. Refresh AuthContext state
          await refreshProfile();

          if (isMounted) {
            setStatus('success');
            addToast(`Welcome, ${fullName}! Signed in successfully with Google.`, 'success');

            // Clean URL query parameters and navigate to home
            setTimeout(() => {
              window.history.replaceState({}, document.title, window.location.pathname.replace(/\/auth\/callback.*/, '/'));
              if (onNavigate) {
                onNavigate('home');
              } else {
                window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'home' }));
              }
            }, 1000);
          }
          return;
        }

        // 5. Listen to onAuthStateChange in case token exchange is still in flight
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (!isMounted) return;

          if (event === 'SIGNED_IN' && newSession?.user) {
            const user = newSession.user;
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
            } catch {}

            await refreshProfile();

            setStatus('success');
            addToast(`Welcome, ${fullName}! Signed in successfully with Google.`, 'success');

            setTimeout(() => {
              window.history.replaceState({}, document.title, window.location.pathname.replace(/\/auth\/callback.*/, '/'));
              if (onNavigate) {
                onNavigate('home');
              } else {
                window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'home' }));
              }
            }, 1000);

            subscription?.unsubscribe();
          }
        });

        // Timeout fallback after 6 seconds
        const timeout = setTimeout(() => {
          if (isMounted && status === 'loading') {
            setStatus('error');
            setErrorMessage('Authentication timed out. Please try signing in again.');
            subscription?.unsubscribe();
          }
        }, 6000);

        return () => {
          clearTimeout(timeout);
          subscription?.unsubscribe();
        };

      } catch (err: any) {
        if (isMounted) {
          setStatus('error');
          setErrorMessage(err.message || 'An unexpected error occurred during Google OAuth callback.');
        }
      }
    }

    handleAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [refreshProfile, addToast, onNavigate]);

  const handleReturnToLogin = () => {
    window.history.replaceState({}, document.title, '/');
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
