import { 
  ShieldCheck, Globe, 
  Calculator, Bookmark, Sparkles, ChevronRight, 
  Check, HelpCircle, PhoneCall, 
  Info, LogOut, User
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

interface ProfileProps {
  onNavigate: (page: string) => void;
}

export default function Profile({ onNavigate }: ProfileProps) {
  const { language, setLanguage, t } = useLanguage();
  const { savedPropertyIds } = useApp();

  const { user, logout, loginWithGoogle } = useAuth();
  const displayName = user?.name || 'Guest User';
  const displayIdentifier = user?.identifier || 'Not signed in';
  const displayRole = user?.isDemo 
    ? 'SANDBOX / DEMO' 
    : (user?.authProvider === 'google' ? 'GOOGLE VERIFIED PRO' : (user?.role || '✦ TRICITY PRO'));
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="profile-page-container">
      {/* ─── Top User ID Card / Guest Sign In Card ─────────────────────────── */}
      {!user ? (
        <div className="profile-user-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '16px', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', padding: '24px', borderRadius: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
              flexShrink: 0
            }}>
              <User size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Sign In to PlotIX
              </h2>
              <p style={{ fontSize: '12px', color: '#94A3B8', margin: '3px 0 0' }}>
                Access verified land records, AI valuations, and saved properties.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
            <button
              type="button"
              onClick={loginWithGoogle}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                height: '46px',
                borderRadius: '12px',
                background: '#FFFFFF',
                color: '#1E293B',
                fontSize: '13.5px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.15s ease'
              }}
            >
              <svg style={{ width: 18, height: 18, flexShrink: 0 }} viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => onNavigate('signin')}
                style={{
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer'
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => onNavigate('signup')}
                style={{
                  height: '40px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="profile-user-card">
          <div className="profile-avatar-wrap">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={displayName} 
                className="profile-avatar-large" 
                style={{ objectFit: 'cover' }} 
              />
            ) : (
              <div className="profile-avatar-large">{initial}</div>
            )}
            <div className="profile-verified-badge" title={user?.isDemo ? "Sandbox / Demo Mode" : (user?.authProvider === 'google' ? "Google OAuth Verified" : "Identity & KYC Verified")}>
              <ShieldCheck size={16} style={{ color: user?.isDemo ? '#D97706' : '#10B981' }} />
            </div>
          </div>

          <div className="profile-user-info">
            <div className="profile-name-row">
              <h2 className="profile-name">{displayName}</h2>
              <span 
                className="profile-membership-pill"
                style={{
                  background: user?.isDemo ? 'rgba(245, 158, 11, 0.15)' : (user?.authProvider === 'google' ? 'rgba(37, 99, 235, 0.15)' : undefined),
                  color: user?.isDemo ? '#D97706' : (user?.authProvider === 'google' ? '#2563EB' : undefined),
                  borderColor: user?.isDemo ? 'rgba(245, 158, 11, 0.35)' : undefined
                }}
              >
                {displayRole}
              </span>
            </div>
            <span className="profile-email">{displayIdentifier}</span>
            <div className="profile-meta-chips">
              <span className="profile-chip">Mohali & Chandigarh</span>
              <span className={`profile-chip ${user?.isDemo ? 'demo' : 'verified'}`}>
                {user?.isDemo ? 'Demo Mode Session' : (user?.authProvider === 'google' ? 'Google OAuth 2.0' : t.profile.kycVerified)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─── Quick Stats Strip ──────────────────────────────────────────────── */}
      <div className="profile-stats-strip">
        <div className="profile-stat-box" onClick={() => onNavigate('my-properties')}>
          <Bookmark size={18} className="text-accent" />
          <span className="stat-num">{savedPropertyIds.size}</span>
          <span className="stat-lbl">{t.profile.savedProperties}</span>
        </div>

        <div className="profile-stat-box" onClick={() => onNavigate('ai-design')}>
          <Sparkles size={18} className="text-primary" />
          <span className="stat-num">2</span>
          <span className="stat-lbl">{t.profile.aiPlans}</span>
        </div>

        <div className="profile-stat-box" onClick={() => onNavigate('land-calculator')}>
          <Calculator size={18} className="text-success" />
          <span className="stat-num">1</span>
          <span className="stat-lbl">{t.nav.calculator}</span>
        </div>
      </div>

      {/* ─── 1. LANGUAGE & REGION ───────────────────────────────────────────── */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <Globe size={18} className="section-icon" />
          <h3 className="profile-section-title">{t.profile.languageSection}</h3>
        </div>

        <div className="profile-lang-selector-grid">
          <button 
            className={`profile-lang-btn ${language === 'en' ? 'active' : ''}`}
            onClick={() => setLanguage('en')}
          >
            <div className="lang-text-group">
              <span className="lang-primary-label">English</span>
              <span className="lang-secondary-label">Default Global</span>
            </div>
            {language === 'en' && <Check size={16} className="lang-check" />}
          </button>

          <button 
            className={`profile-lang-btn ${language === 'pa' ? 'active' : ''}`}
            onClick={() => setLanguage('pa')}
          >
            <div className="lang-text-group">
              <span className="lang-primary-label">ਪੰਜਾਬੀ (Punjabi)</span>
              <span className="lang-secondary-label">ਜਮਾਂਬੰਦੀ, ਫਰਦ ਤੇ ਮਿਣਤੀ</span>
            </div>
            {language === 'pa' && <Check size={16} className="lang-check" />}
          </button>

          <button 
            className={`profile-lang-btn ${language === 'hi' ? 'active' : ''}`}
            onClick={() => setLanguage('hi')}
          >
            <div className="lang-text-group">
              <span className="lang-primary-label">हिंदी (Hindi)</span>
              <span className="lang-secondary-label">जमाबंदी व संपत्ति</span>
            </div>
            {language === 'hi' && <Check size={16} className="lang-check" />}
          </button>
        </div>
      </div>

      {/* ─── 2. HELP & SUPPORT ──────────────────────────────────────────────── */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <HelpCircle size={18} className="section-icon" />
          <h3 className="profile-section-title">{t.profile.supportLegal}</h3>
        </div>

        <div className="profile-nav-links-list">
          {/* Help & Owner Contact Item */}
          <div 
            className="profile-nav-link-item highlight-help-item" 
            onClick={() => onNavigate('help')}
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.03) 100%)',
              border: '1.5px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '16px',
              padding: '14px 18px',
              marginBottom: '4px'
            }}
          >
            <div 
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
              }}
            >
              <PhoneCall size={20} />
            </div>
            <div className="nav-link-text">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                  {language === 'pa' ? 'ਸਹਾਇਤਾ ਅਤੇ ਮਾਲਕ ਸੰਪਰਕ (Help)' : (language === 'hi' ? 'सहायता एवं ओनर संपर्क (Help)' : 'Help & Owner Support')}
                </span>
                <span style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  color: '#065F46',
                  background: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  padding: '2px 8px',
                  borderRadius: '999px'
                }}>
                  DIRECT DESK
                </span>
              </div>
              <small style={{ color: '#475569', fontSize: '12.5px', marginTop: '2px', display: 'block' }}>
                {language === 'pa' 
                  ? 'ਐਪ ਮਾਲਕ ਮੋਕਸ਼ ਮਿੱਤਲ ਨਾਲ ਸਿੱਧਾ ਸੰਪਰਕ · ਕਾਲ 7658800280 · ਈਮੇਲ' 
                  : (language === 'hi' 
                      ? 'ऐप ओनर मोक्ष मित्तल से सीधा संपर्क · कॉल 7658800280 · ईमेल' 
                      : 'Connect with Moksh Mittal · Call 7658800280 · Email & WhatsApp')}
              </small>
            </div>
            <ChevronRight size={18} style={{ color: '#10B981', flexShrink: 0 }} />
          </div>

          <div className="profile-nav-link-item">
            <Info size={18} />
            <div className="nav-link-text">
              <span>{t.profile.aboutPropwise}</span>
              <small>DISCOVER.ANALYZE.INVEST</small>
            </div>
            <span className="profile-version-tag">v2.0 Pro</span>
          </div>
        </div>
      </div>

      {/* ─── 3. ACCOUNT & AUTHENTICATION ──────────────────────────────────────── */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <User size={18} className="section-icon" />
          <h3 className="profile-section-title">Account & Security</h3>
        </div>

        <div className="profile-nav-links-list">
          {user ? (
            <div 
              className="profile-nav-link-item" 
              onClick={() => {
                try {
                  sessionStorage.removeItem('plotix_dismissed_auth');
                } catch {}
                logout();
                onNavigate('signin');
              }}
            >
              <LogOut size={18} style={{ color: '#EF4444' }} />
              <div className="nav-link-text">
                <span style={{ color: '#EF4444', fontWeight: 700 }}>Sign Out / Switch Account</span>
                <small>Signed in as {user.name} ({user.identifier})</small>
              </div>
              <ChevronRight size={18} />
            </div>
          ) : (
            <div 
              className="profile-nav-link-item" 
              onClick={() => onNavigate('signin')}
            >
              <User size={18} style={{ color: '#10B981' }} />
              <div className="nav-link-text">
                <span style={{ color: '#10B981', fontWeight: 700 }}>Sign In / Register</span>
                <small>Access saved plots, valuations, and Google authentication</small>
              </div>
              <ChevronRight size={18} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
