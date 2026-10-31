import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Search, 
  Navigation, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  X,
  RotateCw,
  ChevronRight,
  ShieldCheck,
  Globe,
  Check,
  Smartphone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { locationHierarchyService } from '../../services/locationHierarchyService';
import type { Language } from '../../translations/translations';
import type { LocationSearchResult, ActiveLocation } from '../../types/locationHierarchy';
import PropWiseLogo from '../common/PropWiseLogo';

interface LocationOnboardingScreenProps {
  onComplete?: () => void;
}

interface LanguageOption {
  id: Language;
  flag: string;
  nativeTitle: string;
  englishTitle: string;
  desc: string;
  scriptLabel: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    id: 'en',
    flag: '🇬🇧',
    nativeTitle: 'English',
    englishTitle: 'English',
    desc: 'Real Estate, GIS & Land Intelligence',
    scriptLabel: 'Latin',
  },
  {
    id: 'hi',
    flag: '🇮🇳',
    nativeTitle: 'हिन्दी',
    englishTitle: 'Hindi',
    desc: 'ज़मीन नाप, रजिस्ट्री व रियल एस्टेट',
    scriptLabel: 'देवनागरी',
  },
  {
    id: 'pa',
    flag: '🌾',
    nativeTitle: 'ਪੰਜਾਬੀ',
    englishTitle: 'Punjabi',
    desc: 'ਜ਼ਮੀਨ ਰਿਕਾਰਡ, ਨਕਸ਼ਾ ਤੇ ਰੀਅਲ ਅਸਟੇਟ',
    scriptLabel: 'ਗੁਰਮੁਖੀ',
  },
];

export default function LocationOnboardingScreen({ onComplete }: LocationOnboardingScreenProps) {
  const { setHasCompletedOnboarding, switchLocation } = useApp();
  const { language, setLanguage, detectedLanguage, t } = useLanguage();

  // Primary Phase: 'language' -> 'location'
  const [phase, setPhase] = useState<'language' | 'location'>('language');

  // Location Step Mode: 'select' | 'detecting' | 'error' | 'confirm'
  const [step, setStep] = useState<'select' | 'detecting' | 'error' | 'confirm'>('select');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pendingLocation, setPendingLocation] = useState<ActiveLocation | null>(null);

  // Live search query
  useEffect(() => {
    let isMounted = true;
    if (searchQuery.trim().length >= 2) {
      setIsSearching(true);
      locationHierarchyService.searchLocations(searchQuery).then(results => {
        if (isMounted) {
          setSearchResults(results);
          setIsSearching(false);
        }
      });
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
    return () => { isMounted = false; };
  }, [searchQuery]);

  // Handle GPS detection
  const handleUseGps = async () => {
    setStep('detecting');
    setErrorMessage('');
    
    const result = await locationHierarchyService.detectCurrentGpsLocation();

    if (result.location) {
      setPendingLocation(result.location);
      setStep('confirm');
    } else {
      setErrorMessage(result.error || t.onboarding.gpsErrorDesc);
      setStep('error');
    }
  };

  // Handle Location Selection from Search
  const handleSelectSearchResult = (result: LocationSearchResult) => {
    const activeLoc = locationHierarchyService.createActiveLocationFromSearchResult(result);
    setPendingLocation(activeLoc);
    setStep('confirm');
  };

  // Final confirmation: Set context & complete onboarding
  const handleStartExploring = () => {
    if (pendingLocation) {
      switchLocation(pendingLocation);
      setHasCompletedOnboarding(true);
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="location-onboarding-wrapper">
      {/* ─── Floating Aurora Lighting Orbs (Matching Sign-Up Theme) ─── */}
      <div className="pw-onboarding-orbs">
        <div className="pw-onb-orb pw-onb-orb-1" />
        <div className="pw-onb-orb pw-onb-orb-2" />
        <div className="pw-onb-orb pw-onb-orb-3" />
        <div className="pw-onb-orb pw-onb-orb-4" />
      </div>
      <div className="pw-onboarding-grid" />

      <div className="onboarding-container">
        {/* Top Brand & Status Bar */}
        <motion.div 
          className="onboarding-brand-bar"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: '20px'
          }}
        >
          <div className="onboarding-logo-badge">
            <PropWiseLogo size="md" animated variant="light" />
          </div>

          <div className="onboarding-top-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="onboarding-signin-btn"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'signin' }));
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                color: '#F8FAFC',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s ease',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className="onboarding-signup-btn"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'signup' }));
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 15px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.35)',
                transition: 'all 0.2s ease',
              }}
            >
              Sign Up Free
            </button>
          </div>
        </motion.div>

        {/* ─── PHASE 1: SELECT LANGUAGE ─── */}
        <AnimatePresence mode="wait">
          {phase === 'language' && (
            <motion.div 
              key="phase-language"
              className="onboarding-card"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="onboarding-headline-section">
                <span className="onboarding-pill-tag">
                  <Globe size={13} className="pill-icon-sparkle" />
                  {language === 'pa' ? 'ਭਾਸ਼ਾ ਚੋਣ' : (language === 'hi' ? 'भाषा चयन' : 'Language Preference')}
                </span>
                <h1 className="onboarding-main-title">
                  {t.onboarding.selectLanguageTitle}
                </h1>
                <p className="onboarding-sub-title">
                  {t.onboarding.selectLanguageSubtitle}
                </p>
              </div>

              {/* Language Cards Grid */}
              <div className="onboarding-lang-grid">
                {LANGUAGE_OPTIONS.map((opt, idx) => {
                  const isSelected = language === opt.id;
                  const isDeviceSuggested = detectedLanguage === opt.id;

                  return (
                    <motion.button
                      key={opt.id}
                      type="button"
                      whileHover={{ y: -3, scale: 1.012 }}
                      whileTap={{ scale: 0.985 }}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08, duration: 0.3 }}
                      className={`lang-select-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setLanguage(opt.id)}
                      id={`btn-lang-${opt.id}`}
                    >
                      <div className="lang-card-left">
                        <div className="lang-card-flag-wrap">
                          <span className="lang-card-flag">{opt.flag}</span>
                          <span className="lang-flag-glow" />
                        </div>
                        <div className="lang-card-text">
                          <div className="lang-card-title-row">
                            <span className="lang-native-title">{opt.nativeTitle}</span>
                            {opt.englishTitle !== opt.nativeTitle && (
                              <span className="lang-eng-sub">({opt.englishTitle})</span>
                            )}
                            <span className="lang-script-badge">{opt.scriptLabel}</span>
                            {isDeviceSuggested && (
                              <div className="lang-device-badge" title="Detected from device">
                                <span className="lang-beacon-pulse" />
                                <Smartphone size={11} />
                                <span>{t.onboarding.phoneDetectedBadge}</span>
                              </div>
                            )}
                          </div>
                          <div className="lang-card-desc">{opt.desc}</div>
                        </div>
                      </div>

                      <div className="lang-card-right">
                        <div className={`lang-checkbox-circle ${isSelected ? 'checked' : ''}`}>
                          {isSelected ? (
                            <motion.div
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                            >
                              <Check size={14} strokeWidth={3.5} />
                            </motion.div>
                          ) : (
                            <span className="checkbox-empty-dot" />
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Continue Button with light shimmer */}
              <div className="onboarding-lang-actions">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="confirm-start-btn lang-continue-btn"
                  onClick={() => setPhase('location')}
                  id="btn-lang-continue"
                >
                  <span className="btn-shimmer-sweep" />
                  <span className="btn-label-text">
                    {language === 'pa' 
                      ? 'ਪੰਜਾਬੀ ਵਿੱਚ ਅੱਗੇ ਵਧੋ' 
                      : (language === 'hi' 
                          ? 'हिंदी में आगे बढ़ें' 
                          : 'Continue in English')}
                  </span>
                  <ArrowRight size={19} className="btn-arrow-icon" />
                </motion.button>
              </div>

              {/* Reassurance Note */}
              <div className="onboarding-footer-note">
                <ShieldCheck size={15} className="footer-shield-icon" />
                <span>
                  {language === 'pa'
                    ? 'ਤੁਸੀਂ ਐਪ ਵਿੱਚ ਕਿਸੇ ਵੀ ਸਮੇਂ ਉੱਪਰਲੇ ਬਟਨ ਤੋਂ ਆਪਣੀ ਭਾਸ਼ਾ ਬਦਲ ਸਕਦੇ ਹੋ।'
                    : (language === 'hi'
                        ? 'आप ऐप में कभी भी ऊपर दिए गए भाषा बटन से इसे बदल सकते हैं।'
                        : 'You can change your language anytime from the top bar.')}
                </span>
              </div>
            </motion.div>
          )}

          {/* ─── PHASE 2: LOCATION ONBOARDING ─── */}
          {phase === 'location' && (
            <React.Fragment key="phase-location">
              {/* STEP 1: INITIAL LOCATION SELECTION */}
              {step === 'select' && (
                <motion.div 
                  key="step-select"
                  className="onboarding-card"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="onboarding-headline-section">
                    <span className="onboarding-pill-tag">
                      <Sparkles size={13} className="pill-icon-sparkle" />
                      {t.onboarding.smartDiscovery}
                    </span>
                    <h1 className="onboarding-main-title">
                      {t.onboarding.locationTitle}
                    </h1>
                    <p className="onboarding-sub-title">
                      {t.onboarding.locationSubtitle}
                    </p>
                  </div>

                  {/* 📍 Option 1: Use Current Location */}
                  <div className="onboarding-action-group">
                    <motion.button
                      type="button"
                      whileHover={{ y: -3, scale: 1.012 }}
                      whileTap={{ scale: 0.985 }}
                      className="onboarding-gps-btn"
                      onClick={handleUseGps}
                      id="btn-use-current-location"
                    >
                      <div className="gps-btn-icon-wrapper">
                        <Navigation size={22} className="gps-icon-nav" />
                        <span className="gps-ripple-ring ring-1" />
                        <span className="gps-ripple-ring ring-2" />
                      </div>
                      <div className="gps-btn-text-content">
                        <div className="gps-instant-tag">
                          <span className="beacon-dot" />
                          <span>INSTANT GPS DETECTION</span>
                        </div>
                        <div className="gps-btn-title">{t.onboarding.useGpsTitle}</div>
                        <div className="gps-btn-subtitle">{t.onboarding.useGpsSubtitle}</div>
                      </div>
                      <div className="action-arrow-box">
                        <ChevronRight size={20} className="gps-btn-arrow" />
                      </div>
                    </motion.button>

                    <div className="onboarding-divider">
                      <span className="divider-line" />
                      <span className="divider-text">{t.onboarding.orSearch}</span>
                      <span className="divider-line" />
                    </div>

                    {/* 🔎 Option 2: Search Input */}
                    <div className="onboarding-search-box">
                      <motion.div 
                        whileHover={{ y: -2 }}
                        className="search-input-inner"
                        onClick={() => document.getElementById('input-onboarding-location-search')?.focus()}
                        style={{ cursor: 'text' }}
                      >
                        <div className="search-input-icon-wrapper">
                          <Search size={22} className="search-box-icon" />
                        </div>
                        <div className="search-input-text-content">
                          <div className="search-box-title">{t.onboarding.searchBoxTitle}</div>
                          <input
                            type="text"
                            className="onboarding-search-input"
                            placeholder={t.onboarding.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            id="input-onboarding-location-search"
                          />
                        </div>
                        {searchQuery ? (
                          <button 
                            type="button" 
                            className="search-clear-btn" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSearchQuery('');
                            }}
                            aria-label="Clear search"
                          >
                            <X size={16} />
                          </button>
                        ) : (
                          <div className="action-arrow-box">
                            <ChevronRight size={20} className="search-btn-arrow" />
                          </div>
                        )}
                      </motion.div>

                      {/* Autocomplete Search Results */}
                      {searchQuery.trim().length >= 2 && (
                        <motion.div 
                          className="onboarding-search-results-dropdown"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {isSearching ? (
                            <div className="search-dropdown-loading">
                              <RotateCw size={18} className="spin-icon" />
                              <span>{t.onboarding.searching}</span>
                            </div>
                          ) : searchResults.length > 0 ? (
                            <div className="search-results-list">
                              {searchResults.map((item) => (
                                <button
                                  key={item.id}
                                  type="button"
                                  className="search-result-row"
                                  onClick={() => handleSelectSearchResult(item)}
                                >
                                  <div className="result-icon-box">
                                    <MapPin size={18} />
                                  </div>
                                  <div className="result-text-box">
                                    <div className="result-name-row">
                                      <span className="result-name">{item.name}</span>
                                      <span className="result-level-badge">{item.level.toUpperCase()}</span>
                                    </div>
                                    <div className="result-hierarchy-breadcrumb">
                                      {item.hierarchyBreadcrumb}
                                    </div>
                                  </div>
                                  <ChevronRight size={16} className="result-chevron" />
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="search-dropdown-empty">
                              <span>{t.onboarding.noMatchesFound}</span>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Reassurance Note */}
                  <div className="onboarding-footer-note">
                    <ShieldCheck size={15} className="footer-shield-icon" />
                    <span>{t.onboarding.privacyNote}</span>
                  </div>

                  {/* Clean Non-Overlapping Change Language Option */}
                  <div className="onboarding-change-lang-footer">
                    <button
                      type="button"
                      className="onboarding-change-lang-link"
                      onClick={() => {
                        setPhase('language');
                        setStep('select');
                      }}
                    >
                      <Globe size={13} />
                      <span>{t.onboarding.changeLanguageTitle}</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: GPS DETECTING RADAR STATE */}
              {step === 'detecting' && (
                <motion.div 
                  key="step-detecting"
                  className="onboarding-card glass-panel text-center-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div className="radar-animation-container">
                    <div className="radar-wave wave-1" />
                    <div className="radar-wave wave-2" />
                    <div className="radar-wave wave-3" />
                    <div className="radar-center-pin">
                      <Navigation size={28} className="radar-nav-icon" />
                    </div>
                  </div>

                  <h2 className="detecting-title">{t.onboarding.detectingTitle}</h2>
                  <p className="detecting-subtitle">{t.onboarding.detectingSubtitle}</p>

                  <button
                    type="button"
                    className="cancel-detecting-btn"
                    onClick={() => setStep('select')}
                  >
                    {t.onboarding.searchManuallyInstead}
                  </button>
                </motion.div>
              )}

              {/* STEP 3: GPS ERROR FALLBACK STATE */}
              {step === 'error' && (
                <motion.div 
                  key="step-error"
                  className="onboarding-card glass-panel text-center-card error-card-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div className="error-icon-box">
                    <AlertCircle size={36} />
                  </div>

                  <h2 className="error-title">{t.onboarding.gpsErrorTitle}</h2>
                  <p className="error-description">
                    {errorMessage || t.onboarding.gpsErrorDesc}
                  </p>

                  <div className="error-actions-row">
                    <button
                      type="button"
                      className="error-btn-retry"
                      onClick={handleUseGps}
                    >
                      <RotateCw size={16} />
                      <span>{t.onboarding.tryAgain}</span>
                    </button>
                    <button
                      type="button"
                      className="error-btn-search"
                      onClick={() => setStep('select')}
                    >
                      <Search size={16} />
                      <span>{t.onboarding.searchLocationBtn}</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: LOCATION CONFIRMATION STATE */}
              {step === 'confirm' && pendingLocation && (
                <motion.div 
                  key="step-confirm"
                  className="onboarding-card glass-panel confirmation-card"
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="confirm-badge-row">
                    <div className="confirm-icon-pulse">
                      <MapPin size={24} />
                    </div>
                    <span className="confirm-status-text">
                      {pendingLocation.source === 'gps' ? t.onboarding.locationDetected : t.onboarding.locationSelected}
                    </span>
                  </div>

                  <div className="confirm-main-body">
                    <span className="confirm-subheading">{t.onboarding.youAreExploring}</span>
                    <h1 className="confirm-place-name">{pendingLocation.name}</h1>
                    <div className="confirm-hierarchy-string">
                      {pendingLocation.district}, {pendingLocation.state}
                    </div>

                    {/* Breadcrumb pills */}
                    <div className="confirm-breadcrumb-pill-row">
                      {pendingLocation.hierarchy.map((seg, idx) => (
                        <React.Fragment key={idx}>
                          <span className="confirm-crumb-pill">{seg}</span>
                          {idx < pendingLocation.hierarchy.length - 1 && (
                            <ChevronRight size={12} className="crumb-divider-icon" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Scope capabilities list */}
                    <div className="confirm-capabilities-box">
                      <div className="cap-item">
                        <CheckCircle2 size={16} className="cap-check" />
                        <span>{t.onboarding.verifiedPropertiesCap}</span>
                      </div>
                      <div className="cap-item">
                        <CheckCircle2 size={16} className="cap-check" />
                        <span>{t.onboarding.localTehsilsCap}</span>
                      </div>
                      <div className="cap-item">
                        <CheckCircle2 size={16} className="cap-check" />
                        <span>{t.onboarding.circleRatesCap}</span>
                      </div>
                    </div>
                  </div>

                  <div className="confirm-actions-wrap">
                    <button
                      type="button"
                      className="confirm-start-btn"
                      onClick={handleStartExploring}
                      id="btn-confirm-start-exploring"
                    >
                      <span>{t.onboarding.startExploringBtn}</span>
                      <ArrowRight size={18} />
                    </button>

                    <button
                      type="button"
                      className="confirm-change-btn"
                      onClick={() => setStep('select')}
                    >
                      {t.onboarding.chooseDifferentLocationBtn}
                    </button>
                  </div>
                </motion.div>
              )}
            </React.Fragment>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

