import { Bell, Globe, ChevronLeft, UserPlus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import type { Language } from '../../translations/translations';
import PropWiseLogo from '../common/PropWiseLogo';

interface MobileHeaderProps {
  currentPage: string;
  onMenuOpen?: () => void;
  onNavigate?: (page: string) => void;
}

const PAGE_BACK_ROUTES: Record<string, string> = {
  detail: 'explore',
  analysis: 'detail',
  'future-potential': 'detail',
  'planning-maps': 'home',
  'advisor': 'home',
  'land-calculator': 'home',
  'messages': 'settings',
  'explore': 'home',
};

export default function MobileHeader({ currentPage, onNavigate }: MobileHeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();
  const isHome = currentPage === 'home';
  const pageMeta = t.header.titles[currentPage];
  const title = pageMeta ? pageMeta.title : (
    currentPage === 'my-properties' 
      ? (language === 'pa' ? 'ਮੇਰੀ ਜਾਇਦਾਦ' : (language === 'hi' ? 'मेरी प्रॉपर्टी' : 'My Property'))
      : (currentPage === 'settings' 
          ? (language === 'pa' ? 'ਪ੍ਰੋਫਾਈਲ ਤੇ ਸੈਟਿੰਗਾਂ' : (language === 'hi' ? 'प्रोफ़ाइल व सेटिंग्स' : 'Profile & Settings'))
          : (currentPage === 'ai-design'
              ? 'AI Naksha™ Studio'
              : 'PlotIX'))
  );

  const nextLang: Record<Language, Language> = {
    en: 'hi',
    hi: 'pa',
    pa: 'en',
  };

  const langLabels: Record<Language, string> = {
    en: 'EN',
    hi: 'हि',
    pa: 'ਪੰ',
  };

  const handleBack = () => {
    const target = PAGE_BACK_ROUTES[currentPage] || 'home';
    if (onNavigate) {
      onNavigate(target);
    } else {
      window.dispatchEvent(new CustomEvent('navigate-to', { detail: target }));
    }
  };

  const handleProfileClick = () => {
    if (onNavigate) {
      onNavigate('settings');
    } else {
      window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'settings' }));
    }
  };

  return (
    <header className="mobile-header-pro">
      <div className="mobile-header-left">
        {isHome ? (
          <div className="mobile-brand-wrapper" onClick={() => onNavigate && onNavigate('home')} style={{ cursor: 'pointer' }}>
            <PropWiseLogo size="sm" />
          </div>
        ) : (
          <div className="mobile-nav-title-group">
            <button
              className="mobile-header-back-btn"
              aria-label="Go back"
              onClick={handleBack}
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
            <div className="mobile-title-text-wrap">
              <span className="mobile-header-page-title">{title}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mobile-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {/* Language Quick Toggle */}
        <button
          type="button"
          className="mobile-action-pill mobile-lang-pill"
          onClick={() => setLanguage(nextLang[language])}
          title="Switch Language (English / Hindi / Punjabi)"
          aria-label="Toggle language"
        >
          <Globe size={12} className="lang-globe-icon" />
          <span className="lang-code-text">{langLabels[language]}</span>
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="mobile-action-pill mobile-notif-btn"
          title="Market & Property Alerts"
          aria-label="Notifications"
          onClick={() => onNavigate && onNavigate('messages')}
        >
          <Bell size={15} strokeWidth={2} />
          <span className="mobile-pulse-notif-dot" />
        </button>

        {/* Profile Avatar or Sign Up */}
        {user ? (
          <button
            type="button"
            className="mobile-avatar-pill"
            title="Profile Workspace"
            aria-label="Open profile workspace"
            onClick={handleProfileClick}
          >
            <span className="avatar-initial">{user.name.charAt(0).toUpperCase()}</span>
          </button>
        ) : (
          <button
            type="button"
            className="mobile-header-auth-pill"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '11.5px',
              fontWeight: 800,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
            onClick={() => {
              if (onNavigate) onNavigate('signup');
              else window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'signup' }));
            }}
          >
            <UserPlus size={12} strokeWidth={2.5} />
            <span>Sign Up</span>
          </button>
        )}
      </div>
    </header>
  );
}
