import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MobileShell from './components/layout/MobileShell';
import DesktopShell from './components/layout/DesktopShell';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { MapProvider } from './context/MapContext';
import LocationOnboardingScreen from './components/onboarding/LocationOnboardingScreen';
import LocationPickerModal from './components/onboarding/LocationPickerModal';
import ScrollToTopButton from './components/ui/ScrollToTopButton';
import { scrollToTop } from './utils/scrollUtils';
import './components/onboarding/LocationOnboarding.css';
import PropWiseLogo from './components/common/PropWiseLogo';

import { ErrorBoundary } from './components/ui/ErrorBoundary';

// Pages
import Home from './pages/Home';
import MapPage from './pages/Map';
import ExploreProperties from './pages/ExploreProperties';
import PropertyDetail from './pages/PropertyDetail';
import AIAnalysis from './pages/AIAnalysis';
import FuturePotential from './pages/FuturePotential';
import AIDesign from './pages/AIDesign';
import AIAdvisor from './pages/AIAdvisor';
import MarketInsights from './pages/MarketInsights';
import MyProperties from './pages/MyProperties';
import Saved from './pages/Saved';
import Messages from './pages/Messages';
import LandCalculator from './pages/LandCalculator';
import LandRecords from './pages/LandRecords';
import Profile from './pages/Profile';
import HelpSupport from './pages/HelpSupport';
import Signup from './pages/Signup';
import AuthCallback from './pages/AuthCallback';

type Page =
  | 'home'
  | 'map'
  | 'explore'
  | 'advisor'
  | 'insights'
  | 'my-properties'
  | 'saved'
  | 'messages'
  | 'detail'
  | 'analysis'
  | 'future-potential'
  | 'ai-design'
  | 'land-calculator'
  | 'land-records'
  | 'jamabandi'
  | 'planning-maps'
  | 'settings'
  | 'help'
  | 'signup'
  | 'signin'
  | 'auth-callback';

// ─── Splash Screen ─────────────────────────────────────────────────────────────
function SplashScreen({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const t = setTimeout(onFinish, 2000);
    return () => clearTimeout(t);
  }, [onFinish]);

  return (
    <motion.div
      className="splash-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      style={{
        background: 'linear-gradient(135deg, #0B132B 0%, #0F172A 50%, #09101F 100%)',
      }}
    >
      {/* Dynamic Luxury Animated Logo */}
      <motion.div
        className="splash-icon-wrap"
        initial={{ opacity: 0, y: 24, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ background: 'transparent', boxShadow: 'none' }}
      >
        <PropWiseLogo size="xl" variant="dark" showText={false} />
      </motion.div>

      {/* Brand name */}
      <motion.div
        className="splash-brand"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <span style={{ color: '#F8FAFC', fontWeight: 900 }}>Plot</span>
        <span style={{
          background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 50%, #3B82F6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 950,
          marginLeft: '1px',
        }}>IX</span>
      </motion.div>

      {/* Tagline */}
      <motion.div
        className="splash-tagline"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{
          color: '#94A3B8',
          letterSpacing: '0.14em',
          fontWeight: 800,
          fontSize: '11px',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span>DISCOVER</span>
        <span style={{ color: '#10B981' }}>•</span>
        <span>ANALYZE</span>
        <span style={{ color: '#06B6D4' }}>•</span>
        <span>INVEST</span>
      </motion.div>

      {/* Loading bar */}
      <motion.div
        className="splash-line"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 1.5, ease: 'easeInOut' }}
        style={{
          background: 'linear-gradient(90deg, #10B981 0%, #3B82F6 100%)'
        }}
      />
    </motion.div>
  );
}

// ─── useIsMobile hook ──────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : true
  );

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return isMobile;
}

// ─── App Inner (needs context) ─────────────────────────────────────────────────
function AppInner() {
  const isOAuthRedirect = typeof window !== 'undefined' && (
    window.location.pathname.startsWith('/auth/callback') ||
    window.location.search.includes('code=') ||
    window.location.hash.includes('access_token=') ||
    window.location.search.includes('error=')
  );

  const [showSplash, setShowSplash] = useState(!isOAuthRedirect);
  const [currentPage, setCurrentPage] = useState<Page>(
    isOAuthRedirect ? 'auth-callback' : 'signin'
  );
  const { currentPropertyId, setCurrentPropertyId, hasCompletedOnboarding } = useApp();
  const isMobile = useIsMobile();

  const navigate = (page: string, propertyId?: string) => {
    if (propertyId) setCurrentPropertyId(propertyId);
    setCurrentPage(page as Page);
    scrollToTop(true);
  };

  // Scroll to top on every page or property detail transition
  useEffect(() => {
    scrollToTop(false);
    const timer = setTimeout(() => scrollToTop(false), 20);
    return () => clearTimeout(timer);
  }, [currentPage, currentPropertyId]);

  useEffect(() => {
    const handleNavigate = (e: CustomEvent<string>) => {
      navigate(e.detail);
    };
    window.addEventListener('navigate-to', handleNavigate as EventListener);
    return () => window.removeEventListener('navigate-to', handleNavigate as EventListener);
  }, []);

  const renderPage = () => {
    const pid = currentPropertyId || 'prop-001';
    switch (currentPage) {
      case 'home': return <Home onNavigate={navigate} />;
      case 'map': return <MapPage />;
      case 'explore': return <ExploreProperties onNavigate={navigate} />;
      case 'detail': return <PropertyDetail propertyId={pid} onNavigate={navigate} />;
      case 'analysis': return <AIAnalysis propertyId={pid} onNavigate={navigate} />;
      case 'future-potential': return <FuturePotential propertyId={pid} onNavigate={navigate} />;
      case 'ai-design': return <AIDesign onNavigate={navigate} />;
      case 'land-calculator': return <LandCalculator />;
      case 'land-records': return <LandRecords onNavigate={navigate} />;
      case 'jamabandi': return <LandRecords onNavigate={navigate} />;
      case 'planning-maps': return <MapPage />;
      case 'advisor': return <AIAdvisor onNavigate={navigate} />;
      case 'insights': return <MarketInsights />;
      case 'my-properties': return <MyProperties onNavigate={navigate} />;
      case 'saved': return <Saved onNavigate={navigate} />;
      case 'messages': return <Messages />;
      case 'settings': return <Profile onNavigate={navigate} />;
      case 'help': return <HelpSupport onNavigate={navigate} />;
      case 'signup': return <Signup key="signup" initialMode="signup" onNavigate={navigate} />;
      case 'signin': return <Signup key="signin" initialMode="signin" onNavigate={navigate} />;
      case 'auth-callback': return <AuthCallback onNavigate={navigate} />;
      default: return <Home onNavigate={navigate} />;
    }
  };

  if (showSplash && !isOAuthRedirect) {
    return (
      <AnimatePresence>
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </AnimatePresence>
    );
  }

  // If OAuth callback route or params detected, render callback handler
  if (currentPage === 'auth-callback' || isOAuthRedirect) {
    return <AuthCallback onNavigate={navigate} />;
  }

  // If user navigated directly to signup or signin, present full-page SaaS auth canvas
  if (currentPage === 'signup' || currentPage === 'signin') {
    return <Signup key={currentPage} initialMode={currentPage === 'signin' ? 'signin' : 'signup'} onNavigate={navigate} />;
  }

  // If the user has not onboarded location yet, show the Location Selection Screen
  if (!hasCompletedOnboarding) {
    return <LocationOnboardingScreen />;
  }

  return (
    <>
      {isMobile ? (
        <MobileShell currentPage={currentPage} onNavigate={navigate}>
          {renderPage()}
        </MobileShell>
      ) : (
        <DesktopShell currentPage={currentPage} onNavigate={navigate}>
          {renderPage()}
        </DesktopShell>
      )}
      <LocationPickerModal />
      <ScrollToTopButton />
    </>
  );
}

// ─── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ErrorBoundary fallbackTitle="PlotIX App Encountered an Issue">
      <AuthProvider>
        <LanguageProvider>
          <AppProvider>
            <MapProvider>
              <AppInner />
            </MapProvider>
          </AppProvider>
        </LanguageProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
