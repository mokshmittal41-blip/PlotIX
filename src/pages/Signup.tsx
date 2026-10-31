import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Eye, EyeOff, Lock, Mail, Phone, ArrowRight, 
  ShieldCheck, Sparkles, Building2, Layers, TrendingUp,
  CheckCircle2, AlertCircle, Loader2, ExternalLink,
  MapPin, Star, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import PropWiseLogo from '../components/common/PropWiseLogo';
import './Signup.css';

interface SignupProps {
  initialMode?: 'signup' | 'signin';
  onNavigate?: (page: string, propertyId?: string) => void;
  onComplete?: () => void;
}

// ─── Floating Particles Background ──────────────────────────────────────────────
function FloatingOrbs() {
  return (
    <div className="pw-orbs-container" aria-hidden="true">
      <div className="pw-orb pw-orb-1" />
      <div className="pw-orb pw-orb-2" />
      <div className="pw-orb pw-orb-3" />
      <div className="pw-orb pw-orb-4" />
      <div className="pw-grid-overlay" />
    </div>
  );
}

// ─── Animated Counter Stat ──────────────────────────────────────────────────────
function AnimatedStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const duration = 1800;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="pw-stat-item" ref={ref}>
      <div className="pw-stat-value">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="pw-stat-label">{label}</div>
    </div>
  );
}

export default function Signup({ initialMode = 'signup', onNavigate, onComplete }: SignupProps) {
  const { signup, login, loginWithGoogle } = useAuth();
  const { addToast } = useApp();

  const [mode, setMode] = useState<'signup' | 'signin'>(initialMode);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Identifier detection
  const identifierType = useMemo<'email' | 'phone' | 'unknown'>(() => {
    const clean = identifier.trim();
    if (!clean) return 'unknown';
    const digitsOnly = clean.replace(/\D/g, '');
    if (/^[6-9]\d{9}$/.test(digitsOnly)) return 'phone';
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return 'email';
    return 'unknown';
  }, [identifier]);

  // Password Strength
  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthClass = ['weak', 'fair', 'good', 'strong'][Math.max(0, passwordStrength - 1)] || 'weak';

  const handleToggleMode = (newMode: 'signup' | 'signin') => {
    setMode(newMode);
    setErrorMessage(null);
    setTouched(false);
    setIdentifier('');
    setPassword('');
  };

  const handleGoBack = () => {
    if (onComplete) {
      onComplete();
    } else if (onNavigate) {
      onNavigate('home');
    } else {
      window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'home' }));
    }
  };

  // Sync mode if initialMode prop changes
  useEffect(() => {
    if (initialMode) setMode(initialMode);
  }, [initialMode]);

  // Reset loading states on browser Back / BFCache / focus
  useEffect(() => {
    const handleRestore = () => {
      setIsSubmitting(false);
      setIsGoogleLoading(false);
    };
    window.addEventListener('pageshow', handleRestore);
    window.addEventListener('focus', handleRestore);
    return () => {
      window.removeEventListener('pageshow', handleRestore);
      window.removeEventListener('focus', handleRestore);
    };
  }, []);

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setErrorMessage(null);

    const cleanId = identifier.trim();
    if (!cleanId) { setErrorMessage('Please enter your phone number or email address.'); return; }
    if (identifierType === 'unknown') { setErrorMessage('Please enter a valid email or 10-digit Indian mobile number.'); return; }
    if (!password) { setErrorMessage('Please enter your password.'); return; }
    if (mode === 'signup' && password.length < 6) { setErrorMessage('Password must be at least 6 characters.'); return; }

    setIsSubmitting(true);
    try {
      if (mode === 'signup') {
        const res = await signup(cleanId, password);
        if (res.success) {
          addToast('Account created successfully! Welcome to PlotIX.', 'success');
          if (onComplete) onComplete();
          else handleGoBack();
        } else {
          setErrorMessage(res.error || 'Failed to create account.');
        }
      } else {
        const res = await login(cleanId, password);
        if (res.success) {
          addToast('Welcome back to PlotIX!', 'success');
          if (onComplete) onComplete();
          else handleGoBack();
        } else {
          setErrorMessage(res.error || 'Invalid credentials.');
        }
      }
    } catch (err: any) { setErrorMessage(err.message || 'An unexpected error occurred.'); }
    finally { setIsSubmitting(false); }
  };

  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);
    const timer = setTimeout(() => setIsGoogleLoading(false), 7000);
    try {
      const res = await loginWithGoogle();
      if (!res.success) { clearTimeout(timer); setIsGoogleLoading(false); setErrorMessage(res.error || 'Google authentication failed.'); }
    } catch (err: any) { clearTimeout(timer); setIsGoogleLoading(false); setErrorMessage(err.message || 'Google authentication failed.'); }
  };

  const isFormBusy = isSubmitting || isGoogleLoading;

  return (
    <div className="pw-auth-root">
      <FloatingOrbs />

      {/* ─── Navigation Bar ─── */}
      <header className="pw-auth-nav">
        <button type="button" className="pw-nav-brand" onClick={handleGoBack} title="Back to PlotIX Home">
          <PropWiseLogo size="md" variant="dark" />
        </button>

        <div className="pw-nav-actions">
          <button type="button" className="pw-nav-guest-btn" onClick={handleGoBack}>
            <span>Explore as Guest</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="pw-auth-main">
        <div className="pw-auth-grid">

          {/* ─── LEFT: Showcase Panel ─── */}
          <section className="pw-showcase" aria-label="PlotIX Features">
            <motion.div 
              className="pw-showcase-inner"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Badge */}
              <div className="pw-showcase-badge">
                <Zap size={13} />
                <span>India's #1 Real Estate Intelligence Platform</span>
              </div>

              {/* Headline */}
              <h1 className="pw-showcase-headline">
                Make Every<br />
                Property Decision<br />
                <span className="pw-headline-gradient">Data-Driven.</span>
              </h1>

              <p className="pw-showcase-desc">
                AI-powered land records, market valuations, and architectural 
                planning — trusted by 15,000+ investors across Punjab, Haryana & Chandigarh.
              </p>

              {/* Stats Row */}
              <div className="pw-stats-row">
                <AnimatedStat value={15000} suffix="+" label="Active Investors" />
                <div className="pw-stats-divider" />
                <AnimatedStat value={50000} suffix="+" label="Properties Analyzed" />
                <div className="pw-stats-divider" />
                <AnimatedStat value={98} suffix="%" label="Accuracy Rate" />
              </div>

              {/* Feature Pills */}
              <div className="pw-features-grid">
                <div className="pw-feature-pill">
                  <div className="pw-pill-icon"><Sparkles size={16} /></div>
                  <div className="pw-pill-content">
                    <span className="pw-pill-title">AI Naksha™ Floor Plans</span>
                    <span className="pw-pill-sub">Vastu-aligned 2D & 3D architectural layouts</span>
                  </div>
                </div>

                <div className="pw-feature-pill">
                  <div className="pw-pill-icon pw-pill-blue"><Layers size={16} /></div>
                  <div className="pw-pill-content">
                    <span className="pw-pill-title">Verified Land Records</span>
                    <span className="pw-pill-sub">Official revenue data & circle rates</span>
                  </div>
                </div>

                <div className="pw-feature-pill">
                  <div className="pw-pill-icon pw-pill-amber"><TrendingUp size={16} /></div>
                  <div className="pw-pill-content">
                    <span className="pw-pill-title">Market Intelligence</span>
                    <span className="pw-pill-sub">Real-time valuations & appreciation forecasts</span>
                  </div>
                </div>

                <div className="pw-feature-pill">
                  <div className="pw-pill-icon pw-pill-violet"><MapPin size={16} /></div>
                  <div className="pw-pill-content">
                    <span className="pw-pill-title">Precision Mapping</span>
                    <span className="pw-pill-sub">Satellite overlay with plot boundaries</span>
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="pw-testimonial">
                <div className="pw-testimonial-stars">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />)}
                </div>
                <p className="pw-testimonial-quote">
                  "PlotIX completely changed how I evaluate land in Mohali. The AI valuations 
                  and instant GIS land verification saved me lakhs on my last investment."
                </p>
                <div className="pw-testimonial-author">
                  <div className="pw-testimonial-avatar">RK</div>
                  <div>
                    <div className="pw-testimonial-name">Rajesh Kumar</div>
                    <div className="pw-testimonial-role">Property Investor & Builder • Chandigarh</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* ─── RIGHT: Auth Card ─── */}
          <div className="pw-auth-card-wrapper">
            <motion.div 
              className="pw-auth-card"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              {/* Glow Effect */}
              <div className="pw-card-glow" />

              {/* Mode Tabs */}
              <div className="pw-mode-tabs" role="tablist">
                <button
                  type="button"
                  className={`pw-mode-tab ${mode === 'signin' ? 'active' : ''}`}
                  onClick={() => handleToggleMode('signin')}
                  role="tab"
                  aria-selected={mode === 'signin'}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`pw-mode-tab ${mode === 'signup' ? 'active' : ''}`}
                  onClick={() => handleToggleMode('signup')}
                  role="tab"
                  aria-selected={mode === 'signup'}
                >
                  Create Account
                </button>
                <div className={`pw-tab-indicator ${mode === 'signup' ? 'right' : 'left'}`} />
              </div>

              {/* Header */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={mode}
                  className="pw-card-header"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="pw-card-title">
                    {mode === 'signup' ? 'Create your account' : 'Welcome back'}
                  </h2>
                  <p className="pw-card-subtitle">
                    {mode === 'signup' 
                      ? 'Start making smarter property decisions today.' 
                      : 'Enter your credentials to access your dashboard.'}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Google Auth Button (Top Position - Industry Standard) */}
              <button
                type="button"
                className="pw-google-btn"
                onClick={handleGoogleAuth}
                disabled={isFormBusy}
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Connecting to Google...</span>
                  </>
                ) : (
                  <>
                    <svg className="pw-google-icon" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="pw-divider">
                <span>or continue with email</span>
              </div>

              {/* Error Banner */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div 
                    className="pw-error-banner"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <AlertCircle size={16} />
                    <div className="pw-error-body">
                      <p>{errorMessage}</p>
                      {errorMessage.includes('PAUSED') && (
                        <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="pw-error-link">
                          <span>Open Supabase Dashboard</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form className="pw-form" onSubmit={handleSubmit} noValidate>
                {/* Email / Phone Field */}
                <div className={`pw-field ${focusedField === 'identifier' ? 'focused' : ''} ${touched && errorMessage && !identifier ? 'error' : ''}`}>
                  <label htmlFor="pw-identifier" className="pw-field-label">
                    <span>{mode === 'signup' ? 'Email or Phone Number' : 'Email or Phone'}</span>
                    {identifier.trim().length > 0 && identifierType !== 'unknown' && (
                      <span className="pw-field-badge">
                        {identifierType === 'phone' ? '📱 +91' : '✉️ Email'}
                      </span>
                    )}
                  </label>
                  <div className="pw-input-wrap">
                    <span className="pw-input-icon">
                      {identifierType === 'phone' ? <Phone size={17} /> : <Mail size={17} />}
                    </span>
                    <input
                      id="pw-identifier"
                      type="text"
                      className="pw-input"
                      placeholder="name@example.com or 10-digit mobile"
                      value={identifier}
                      onChange={(e) => { setIdentifier(e.target.value); if (errorMessage) setErrorMessage(null); }}
                      onFocus={() => setFocusedField('identifier')}
                      onBlur={() => setFocusedField(null)}
                      autoComplete="username"
                      disabled={isFormBusy}
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className={`pw-field ${focusedField === 'password' ? 'focused' : ''} ${touched && errorMessage && !password ? 'error' : ''}`}>
                  <div className="pw-field-header">
                    <label htmlFor="pw-password" className="pw-field-label">
                      <span>Password</span>
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        className="pw-forgot-link"
                        onClick={() => addToast('Password reset link sent to your registered contact.', 'info')}
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="pw-input-wrap">
                    <span className="pw-input-icon">
                      <Lock size={17} />
                    </span>
                    <input
                      id="pw-password"
                      type={showPassword ? 'text' : 'password'}
                      className="pw-input pw-input-has-toggle"
                      placeholder={mode === 'signup' ? 'Create a strong password' : 'Enter your password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); if (errorMessage) setErrorMessage(null); }}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                      disabled={isFormBusy}
                      required
                    />
                    <button
                      type="button"
                      className="pw-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>

                  {/* Password Strength */}
                  {mode === 'signup' && password.length > 0 && (
                    <div className="pw-strength">
                      <div className="pw-strength-track">
                        {[1,2,3,4].map(level => (
                          <div key={level} className={`pw-strength-seg ${passwordStrength >= level ? strengthClass : ''}`} />
                        ))}
                      </div>
                      <span className={`pw-strength-text ${strengthClass}`}>
                        {strengthLabels[Math.max(0, passwordStrength - 1)] || 'Weak'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button type="submit" className="pw-submit-btn" disabled={isFormBusy}>
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>

              {/* Mode Switch */}
              <div className="pw-mode-switch">
                {mode === 'signup' ? (
                  <span>Already have an account?{' '}
                    <button type="button" className="pw-switch-btn" onClick={() => handleToggleMode('signin')}>Sign In</button>
                  </span>
                ) : (
                  <span>Don't have an account?{' '}
                    <button type="button" className="pw-switch-btn" onClick={() => handleToggleMode('signup')}>Create Account</button>
                  </span>
                )}
              </div>

              {/* Guest Direct Skip */}
              <div style={{ textAlign: 'center', marginTop: '12px', marginBottom: '8px' }}>
                <button
                  type="button"
                  onClick={handleGoBack}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    fontSize: '12.5px',
                    fontWeight: 650,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                    transition: 'color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#10B981'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
                >
                  Continue as Guest to Language & Location →
                </button>
              </div>

              {/* Trust Strip */}
              <div className="pw-trust-strip">
                <div className="pw-trust-item">
                  <ShieldCheck size={13} />
                  <span>256-Bit SSL</span>
                </div>
                <div className="pw-trust-dot" />
                <div className="pw-trust-item">
                  <CheckCircle2 size={13} />
                  <span>RERA Verified</span>
                </div>
                <div className="pw-trust-dot" />
                <div className="pw-trust-item">
                  <Building2 size={13} />
                  <span>Govt. Data Sources</span>
                </div>
              </div>

              {/* Terms */}
              <p className="pw-terms">
                By continuing, you agree to PlotIX's{' '}
                <a href="#terms" onClick={(e) => { e.preventDefault(); addToast('Terms of Service: PlotIX Land Intelligence Suite', 'info'); }}>Terms</a>{' '}
                and{' '}
                <a href="#privacy" onClick={(e) => { e.preventDefault(); addToast('Privacy Policy: Your data remains strictly confidential.', 'info'); }}>Privacy Policy</a>.
              </p>

            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
}
