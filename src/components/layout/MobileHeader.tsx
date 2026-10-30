import { Bell, Globe, ChevronLeft, PlusCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
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
  'jamabandi': 'land-records',
  'planning-maps': 'home',
  'advisor': 'home',
  'land-calculator': 'home',
  'messages': 'settings',
  'explore': 'home',
};

export default function MobileHeader({ currentPage, onNavigate }: MobileHeaderProps) {
  const { language, setLanguage, t } = useLanguage();
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

      <div className="mobile-header-actions">
        {/* List Property Free Top Action (shown on Home where space is ample) */}
        {isHome && (
          <button
            type="button"
            className="mobile-header-list-free-btn"
            title={t.header.listPropertyFree}
            aria-label={t.header.listPropertyFree}
            onClick={() => {
              if (onNavigate) {
                onNavigate('my-properties');
              } else {
                window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'my-properties' }));
              }
            }}
          >
            <PlusCircle size={12} strokeWidth={2.4} />
            <span>{language === 'pa' ? 'ਲਿਸਟ ਕਰੋ' : (language === 'hi' ? 'लिस्ट करें' : 'List Free')}</span>
          </button>
        )}

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

        {/* Profile Avatar */}
        <button
          type="button"
          className="mobile-avatar-pill"
          title="Profile Workspace"
          aria-label="Open profile workspace"
          onClick={handleProfileClick}
        >
          <span className="avatar-initial">M</span>
        </button>
      </div>
    </header>
  );
}
