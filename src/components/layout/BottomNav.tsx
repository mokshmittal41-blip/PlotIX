import { Home, Map, Building2, Sparkles, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const { language } = useLanguage();
  const { savedPropertyIds } = useApp();

  const getLabel = (id: string) => {
    switch (id) {
      case 'home':
        return language === 'pa' ? 'ਹੋਮ' : (language === 'hi' ? 'होम' : 'Home');
      case 'map':
        return language === 'pa' ? 'ਨਕਸ਼ਾ' : (language === 'hi' ? 'GIS मैप' : 'GIS Map');
      case 'my-properties':
        return language === 'pa' ? 'ਲਿਸਟ ਕਰੋ' : (language === 'hi' ? 'लिस्ट प्लॉट' : 'List Plot');
      case 'ai-design':
        return 'AI Naksha';
      case 'settings':
        return language === 'pa' ? 'ਪ੍ਰੋਫਾਈਲ' : (language === 'hi' ? 'प्रोफ़ाइल' : 'Profile');
      default:
        return id;
    }
  };

  const navItems = [
    {
      id: 'home',
      label: getLabel('home'),
      icon: (active: boolean) => <Home size={21} strokeWidth={active ? 2.4 : 1.9} />,
      isCenter: false,
    },
    {
      id: 'map',
      label: getLabel('map'),
      icon: (active: boolean) => <Map size={21} strokeWidth={active ? 2.4 : 1.9} />,
      isCenter: false,
    },
    {
      id: 'my-properties',
      label: getLabel('my-properties'),
      icon: (active: boolean) => <Building2 size={22} strokeWidth={active ? 2.5 : 2.1} />,
      isCenter: true,
      badge: savedPropertyIds.size > 0 ? savedPropertyIds.size : undefined,
    },
    {
      id: 'ai-design',
      label: getLabel('ai-design'),
      icon: (active: boolean) => <Sparkles size={21} strokeWidth={active ? 2.4 : 1.9} />,
      isCenter: false,
      flagshipBadge: 'AI',
    },
    {
      id: 'settings',
      label: getLabel('settings'),
      icon: (active: boolean) => <User size={21} strokeWidth={active ? 2.4 : 1.9} />,
      isCenter: false,
    },
  ];

  return (
    <div className="bottom-nav-outer-container">
      <nav className="bottom-nav-dock" role="navigation" aria-label="Primary mobile navigation">
        {navItems.map((item) => {
          const isActive = currentPage === item.id || 
            (item.id === 'my-properties' && (currentPage === 'saved' || currentPage === 'my-properties')) ||
            (item.id === 'ai-design' && (currentPage === 'ai-design' || currentPage === 'planning-maps'));

          if (item.isCenter) {
            return (
              <button
                key={item.id}
                type="button"
                className={`bottom-nav-btn bottom-nav-center-hero ${isActive ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="center-hero-pill">
                  <div className="center-hero-glow" />
                  <div className="center-hero-icon-box">
                    {item.icon(isActive)}
                    {item.badge !== undefined && (
                      <span className="center-hero-badge">{item.badge}</span>
                    )}
                  </div>
                </div>
                <span className="bottom-nav-label center-label">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              className={`bottom-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="bottom-nav-icon-container">
                {isActive && <div className="bottom-nav-active-indicator" />}
                <div className="bottom-nav-icon-glyph">
                  {item.icon(isActive)}
                  {item.flagshipBadge && !isActive && (
                    <span className="bottom-nav-ai-dot" />
                  )}
                </div>
              </div>
              <span className="bottom-nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
