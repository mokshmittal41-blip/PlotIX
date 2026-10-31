import React from 'react';
import { motion } from 'framer-motion';
import {
  Home, MessageCircle, Building2, Bookmark, Settings, Map,
  Sparkles, Calculator, BarChart2, Search,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import PropWiseLogo from '../common/PropWiseLogo';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { t } = useLanguage();

  const discoverNav = [
    { id: 'home', label: t.nav.home, icon: <Home size={18} strokeWidth={2} /> },
    { id: 'explore', label: t.nav.explore, icon: <Search size={18} strokeWidth={2} />, badge: t.nav.activePlotsBadge },
    { id: 'map', label: t.nav.map, icon: <Map size={18} strokeWidth={2} /> },
  ];

  const intelligenceNav = [
    { 
      id: 'ai-design', 
      label: t.nav.naksha, 
      icon: <Sparkles size={18} strokeWidth={2.2} />, 
      badge: t.nav.flagshipBadge,
      isFlagship: true 
    },
    { id: 'advisor', label: t.nav.advisor, icon: <MessageCircle size={18} strokeWidth={2} /> },
    { id: 'insights', label: t.nav.insights, icon: <BarChart2 size={18} strokeWidth={2} /> },
  ];

  const toolsNav = [
    { id: 'land-calculator', label: t.nav.calculator, icon: <Calculator size={18} strokeWidth={2} /> },
  ];

  const personalNav = [
    { id: 'saved', label: t.nav.saved, icon: <Bookmark size={18} strokeWidth={2} /> },
    { id: 'my-properties', label: t.nav.myProperties, icon: <Building2 size={18} strokeWidth={2} /> },
    { id: 'messages', label: t.nav.messages, icon: <MessageCircle size={18} strokeWidth={2} /> },
    { id: 'settings', label: t.nav.settings, icon: <Settings size={18} strokeWidth={2} /> },
  ];

  const NavItem = ({ item }: { item: { id: string; label: string; icon: React.ReactNode; badge?: string; isFlagship?: boolean } }) => {
    const isActive = currentPage === item.id;
    return (
      <button
        className={`sidebar-nav-item ${isActive ? 'active' : ''} ${item.isFlagship ? 'sidebar-nav-flagship' : ''}`}
        onClick={() => onNavigate(item.id)}
        aria-label={item.label}
        aria-current={isActive ? 'page' : undefined}
        title={item.label}
      >
        {isActive && (
          <motion.div
            layoutId="sidebar-active-pill"
            className="sidebar-active-pill"
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          />
        )}
        <span className={`sidebar-icon ${item.isFlagship ? 'flagship-icon' : ''}`}>{item.icon}</span>
        <span className="sidebar-nav-label">{item.label}</span>
        {item.badge && (
          <span className={`sidebar-badge ${item.isFlagship ? 'sidebar-badge-ai' : ''}`}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  const { user } = useAuth();
  const displayName = user?.name || 'Sign In';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <aside className="sidebar floating-sidebar" role="navigation" aria-label="Sidebar navigation">
      {/* Brand Logo Header */}
      <div className="sidebar-logo" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
        <PropWiseLogo size="md" />
      </div>

      {/* Main Navigation Scroll Area */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">{t.nav.discoverSection}</div>
        {discoverNav.map(item => <NavItem key={item.id} item={item} />)}

        <div className="sidebar-section-label">{t.nav.intelligenceSection}</div>
        {intelligenceNav.map(item => <NavItem key={item.id} item={item} />)}

        <div className="sidebar-section-label">{t.nav.toolsSection}</div>
        {toolsNav.map(item => <NavItem key={item.id} item={item} />)}

        <div className="sidebar-section-label">{t.nav.personalSection}</div>
        {personalNav.map(item => <NavItem key={item.id} item={item} />)}
      </nav>

      {/* Bottom User Profile Section */}
      <div className="sidebar-bottom">
        <div className="sidebar-divider" />

        {user ? (
          <div 
            style={{ 
              padding: '10px 12px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 10, 
              borderRadius: 'var(--radius-lg)', 
              cursor: 'pointer', 
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              transition: 'all var(--transition-fast)' 
            }}
            onClick={() => onNavigate('settings')}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={displayName}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  flexShrink: 0,
                  border: '1.5px solid var(--color-border)'
                }}
              />
            ) : (
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: user?.isDemo 
                  ? 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)' 
                  : 'linear-gradient(135deg, #10B981 0%, #059669 100%)', 
                color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 800, flexShrink: 0,
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.35)'
              }}>
                {initial}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {displayName}
                </span>
                <ShieldCheck size={13} style={{ color: user?.isDemo ? '#D97706' : 'var(--color-accent)' }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500 }}>
                {user.isDemo ? 'Demo Mode Session' : (user.type === 'phone' ? user.identifier : (user.role || t.profile.kycVerified))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                height: 38,
                fontSize: 12.5,
                fontWeight: 800,
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                borderColor: '#10B981',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
              }}
              onClick={() => onNavigate('signup')}
            >
              Sign Up Free
            </button>
            <button
              type="button"
              className="btn btn-outline"
              style={{
                width: '100%',
                justifyContent: 'center',
                height: 36,
                fontSize: 12,
                fontWeight: 700
              }}
              onClick={() => onNavigate('signin')}
            >
              Sign In
            </button>
          </div>
        )}
      </div>

    </aside>
  );
}
