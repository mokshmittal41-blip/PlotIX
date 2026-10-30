import { useState } from 'react';
import { Bell, Search, Command, Globe, ChevronDown, Check, PlusCircle, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import type { Language } from '../../translations/translations';

interface FullHeaderProps {
  currentPage: string;
  actions?: React.ReactNode;
}

const LANGUAGES: { id: Language; label: string; flag: string; nativeName: string }[] = [
  { id: 'en', label: 'English', flag: '🇬🇧', nativeName: 'English' },
  { id: 'hi', label: 'Hindi', flag: '🇮🇳', nativeName: 'हिंदी' },
  { id: 'pa', label: 'Punjabi', flag: '🌾', nativeName: 'ਪੰਜਾਬੀ' },
];

export default function Header({ currentPage, actions }: FullHeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const { activeLocation, setIsLocationModalOpen } = useApp();
  const { user } = useAuth();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const meta = t.header.titles[currentPage] || { title: 'PlotIX', subtitle: 'DISCOVER.ANALYZE.INVEST' };
  const currentLangObj = LANGUAGES.find(l => l.id === language) || LANGUAGES[0];

  return (
    <header className="floating-header">
      <div className="header-title-section">
        <motion.h2 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          key={meta.title + language}
        >
          {meta.title}
        </motion.h2>
        {meta.subtitle && (
          <motion.div 
            className="header-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={meta.subtitle + language}
          >
            {meta.subtitle}
          </motion.div>
        )}
      </div>

      <div className="header-actions">
        {actions}

        {/* 📍 Active Location Badge & Quick Switcher */}
        <button
          type="button"
          className="header-active-loc-btn"
          onClick={() => setIsLocationModalOpen(true)}
          title={`Active Market: ${activeLocation.name}, ${activeLocation.district}, ${activeLocation.state} (Click to switch)`}
          id="btn-header-active-location"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.03) 100%)',
            border: '1.5px solid rgba(16, 185, 129, 0.28)',
            color: 'var(--color-text)',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <span style={{ 
            position: 'relative',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: '#ffffff',
            boxShadow: '0 2px 6px rgba(16, 185, 129, 0.35)'
          }}>
            <MapPin size={12} strokeWidth={2.5} />
            <span style={{
              position: 'absolute',
              top: -1,
              right: -1,
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#34D399',
              boxShadow: '0 0 6px #34D399'
            }} />
          </span>
          <span style={{ color: 'var(--color-text)', fontWeight: 800, letterSpacing: '-0.2px' }}>{activeLocation.name}</span>
          <span style={{ 
            fontSize: '10px', 
            color: '#059669', 
            background: 'rgba(16, 185, 129, 0.12)', 
            padding: '2px 8px', 
            borderRadius: '999px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.4px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            {t.header.changeLocation}
          </span>
        </button>
        
        {/* List Property Free Top Action */}
        <button
          type="button"
          className="header-list-property-btn"
          onClick={() => {
            window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'my-properties' }));
          }}
          title={t.header.listPropertyFree}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 16px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            color: '#ffffff',
            border: 'none',
            fontSize: '12.5px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <PlusCircle size={15} strokeWidth={2.4} />
          <span>{t.header.listPropertyFree}</span>
        </button>

        <button 
          className="global-search-btn" 
          title={t.common.search}
          onClick={() => setIsLocationModalOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '7px 16px',
            borderRadius: '999px',
            background: 'rgba(241, 245, 249, 0.85)',
            border: '1.5px solid rgba(226, 232, 240, 0.9)',
            color: 'var(--color-text-muted)',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            minWidth: '220px',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.03)'
          }}
        >
          <Search size={15} style={{ color: '#64748B' }} />
          <span style={{ color: '#475569', flex: 1, textAlign: 'left' }}>{t.header.searchIn} {activeLocation.name}...</span>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px',
            padding: '2px 6px',
            borderRadius: '6px',
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            fontSize: '10px',
            fontWeight: 800,
            color: '#64748B',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
          }}>
            <Command size={10} />
            <span>K</span>
          </div>
        </button>

        {/* ─── Modern Multi-Language Switcher ─── */}
        <div className="header-lang-wrapper" style={{ position: 'relative' }}>
          <button 
            className="header-lang-btn"
            onClick={() => setShowLangMenu(!showLangMenu)}
            title="Change Language / भाषा बदलें / ਭਾਸ਼ਾ ਬਦਲੋ"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: '#FFFFFF',
              border: '1.5px solid rgba(226, 232, 240, 0.95)',
              borderRadius: '999px',
              fontSize: '12.5px',
              fontWeight: 700,
              color: 'var(--color-text)',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#059669'
            }}>
              <Globe size={12} strokeWidth={2.4} />
            </span>
            <span style={{ fontWeight: 750 }}>{currentLangObj.flag} {currentLangObj.nativeName}</span>
            <ChevronDown size={13} style={{ color: '#94A3B8', transform: showLangMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          <AnimatePresence>
            {showLangMenu && (
              <motion.div 
                className="header-lang-dropdown"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '210px',
                  background: '#FFFFFF',
                  border: '1px solid rgba(226, 232, 240, 0.95)',
                  borderRadius: '16px',
                  padding: '8px',
                  boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.04)',
                  backdropFilter: 'blur(20px)',
                  zIndex: 1000,
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '6px 10px 8px', 
                  borderBottom: '1px solid #F1F5F9',
                  marginBottom: '4px'
                }}>
                  <span style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.6px' }}>
                    {t.header.selectLanguage}
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#10B981', background: 'rgba(16, 185, 129, 0.12)', padding: '1px 6px', borderRadius: '4px' }}>
                    3 Active
                  </span>
                </div>
                {LANGUAGES.map(lang => {
                  const isSelected = language === lang.id;
                  return (
                    <button
                      key={lang.id}
                      onClick={() => {
                        setLanguage(lang.id);
                        setShowLangMenu(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '10px',
                        border: isSelected ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
                        background: isSelected ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                        color: isSelected ? '#047857' : '#1E293B',
                        fontSize: '13px',
                        fontWeight: isSelected ? 800 : 600,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s',
                        marginBottom: '2px'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '16px' }}>{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                        <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>({lang.label})</span>
                      </span>
                      {isSelected && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: '#10B981',
                          color: '#FFFFFF'
                        }}>
                          <Check size={11} strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button className="header-icon-btn" title={t.header.notifications}>
          <Bell size={20} strokeWidth={1.5} />
          <span className="notif-dot" />
        </button>

        {/* User Account / Sign In Action */}
        <button
          type="button"
          className="header-auth-btn"
          onClick={() => {
            if (user) {
              window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'settings' }));
            } else {
              window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'signin' }));
            }
          }}
          title={user ? `Signed in as ${user.name} (${user.identifier})` : "Sign In to PlotIX"}
          id="btn-header-auth"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: user ? '5px 14px' : '7px 18px',
            borderRadius: '999px',
            background: user 
              ? '#FFFFFF' 
              : 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            border: user 
              ? '1.5px solid rgba(226, 232, 240, 0.95)' 
              : '1px solid rgba(16, 185, 129, 0.4)',
            color: user ? '#0F172A' : '#FFFFFF',
            fontSize: '12.5px',
            fontWeight: 750,
            cursor: 'pointer',
            boxShadow: user 
              ? '0 1px 3px rgba(0, 0, 0, 0.05)' 
              : '0 4px 14px rgba(15, 23, 42, 0.25), 0 0 10px rgba(16, 185, 129, 0.2)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {user ? (
            <>
              <span style={{
                position: 'relative',
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 800,
                boxShadow: '0 2px 5px rgba(16, 185, 129, 0.3)'
              }}>
                {user.name.charAt(0).toUpperCase()}
                <span style={{
                  position: 'absolute',
                  bottom: -1,
                  right: -1,
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#10B981',
                  border: '1.5px solid #FFFFFF'
                }} />
              </span>
              <span style={{ fontWeight: 750 }}>{user.name}</span>
            </>
          ) : (
            <>
              <span style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#10B981',
                boxShadow: '0 0 8px #10B981',
              }} />
              <span>Sign In</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
