import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Search, 
  Navigation, 
  X, 
  History, 
  ChevronRight, 
  RotateCw, 
  AlertCircle,
  Check,
  Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { locationHierarchyService } from '../../services/locationHierarchyService';
import { 
  INDIAN_STATES, 
  PAN_INDIA_ZONES, 
  type PanIndiaZone, 
  getCoordinatesForCity,
  searchIndianLocations
} from '../../data/indiaStatesAndCities';
import type { LocationSearchResult, ActiveLocation } from '../../types/locationHierarchy';

export default function LocationPickerModal() {
  const { language } = useLanguage();
  const { 
    activeLocation, 
    isLocationModalOpen, 
    setIsLocationModalOpen, 
    switchLocation, 
    recentLocations 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');

  // Zone & State browse tab inside modal
  const [selectedZone, setSelectedZone] = useState<PanIndiaZone>('All India');
  const [selectedState, setSelectedState] = useState<string>('All');

  // Search input live handler
  useEffect(() => {
    let isMounted = true;
    if (searchQuery.trim().length >= 2) {
      setIsSearching(true);
      
      // 1. Search local hierarchy first
      locationHierarchyService.searchLocations(searchQuery).then(results => {
        if (!isMounted) return;
        
        // 2. Supplement with Pan-India state/city index
        const panIndiaMatches = searchIndianLocations(searchQuery);
        const mappedPanIndia: LocationSearchResult[] = panIndiaMatches.map(m => ({
          id: `loc-pan-india-${m.city.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          name: m.city,
          title: `${m.city}, ${m.state}`,
          subtitle: `${m.state} • ${m.zone} India`,
          hierarchyBreadcrumb: `India → ${m.state} → ${m.city}`,
          level: 'city',
          district: m.city,
          state: m.state,
          coordinates: m.coordinates,
          source: 'search',
          defaultScope: 'city',
          isVerified: true,
          matchScore: 90
        }));

        // Deduplicate
        const existingNames = new Set(results.map(r => r.name.toLowerCase()));
        const combined = [...results];
        mappedPanIndia.forEach(item => {
          if (!existingNames.has(item.name.toLowerCase())) {
            combined.push(item);
          }
        });

        setSearchResults(combined);
        setIsSearching(false);
      });
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
    return () => { isMounted = false; };
  }, [searchQuery]);

  // Reset states on open/close
  useEffect(() => {
    if (!isLocationModalOpen) {
      setSearchQuery('');
      setSearchResults([]);
      setGpsError('');
      setSelectedZone('All India');
      setSelectedState('All');
    }
  }, [isLocationModalOpen]);

  // Available states for selected zone
  const availableStates = useMemo(() => {
    if (selectedZone === 'All India') return INDIAN_STATES;
    return INDIAN_STATES.filter(s => s.zone === selectedZone);
  }, [selectedZone]);

  // Available cities for selected state / zone
  const availableCities = useMemo(() => {
    if (selectedState !== 'All') {
      const stateObj = INDIAN_STATES.find(s => s.name === selectedState);
      return stateObj ? stateObj.cities.map(c => ({ city: c, state: stateObj.name, zone: stateObj.zone })) : [];
    }
    const list: { city: string; state: string; zone: string }[] = [];
    availableStates.forEach(s => {
      s.popularCities.forEach(c => {
        if (!list.some(item => item.city === c)) {
          list.push({ city: c, state: s.name, zone: s.zone });
        }
      });
    });
    return list.slice(0, 18);
  }, [selectedState, availableStates]);

  if (!isLocationModalOpen) return null;

  const handleUseGps = async () => {
    setIsGpsLoading(true);
    setGpsError('');

    const res = await locationHierarchyService.detectCurrentGpsLocation();
    setIsGpsLoading(false);

    if (res.location) {
      switchLocation(res.location);
    } else {
      setGpsError(res.error || 'Failed to access current location. Please search manually.');
    }
  };

  const handleSelectSearchResult = (result: LocationSearchResult) => {
    const activeLoc = locationHierarchyService.createActiveLocationFromSearchResult(result);
    switchLocation(activeLoc);
  };

  const handleSelectRecent = (loc: ActiveLocation) => {
    switchLocation(loc);
  };

  const handleSelectCityItem = (c: { city: string; state: string; zone: string }) => {
    const coords = getCoordinatesForCity(c.city, c.state);
    const activeLoc: ActiveLocation = {
      id: `loc-city-${c.city.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: c.city,
      displayName: `${c.city}, ${c.state}`,
      shortName: `${c.city}, ${c.state.slice(0, 2).toUpperCase()}`,
      coordinates: coords,
      latitude: coords[0],
      longitude: coords[1],
      placeName: c.city,
      district: c.city,
      state: c.state,
      country: 'India',
      source: 'search',
      scope: 'city',
      hierarchy: ['India', c.state, `${c.city} District`],
      detectedAt: new Date().toISOString(),
      isVerified: true
    };
    switchLocation(activeLoc);
  };

  return (
    <AnimatePresence>
      <div className="location-modal-backdrop" onClick={() => setIsLocationModalOpen(false)}>
        <motion.div 
          className="location-modal-card glass-panel"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{ maxWidth: '640px' }}
        >
          {/* Header */}
          <div className="modal-header-row">
            <div className="modal-title-group">
              <div className="modal-icon-badge">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="modal-title">
                  {language === 'pa' ? 'ਆਪਣਾ ਇਲਾਕਾ / ਸ਼ਹਿਰ ਚੁਣੋ' : (language === 'hi' ? 'अपनी लोकेशन / शहर चुनें' : 'Select Location in India')}
                </h3>
                <p className="modal-subtitle">
                  {language === 'pa' ? 'ਚਾਲੂ ਇਲਾਕਾ: ' : (language === 'hi' ? 'सक्रिय लोकेशन: ' : 'Currently active: ')}
                  <strong style={{ color: '#059669' }}>{activeLocation.name}</strong> ({activeLocation.district}, {activeLocation.state})
                </p>
              </div>
            </div>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setIsLocationModalOpen(false)}
              aria-label="Close location selector"
            >
              <X size={18} />
            </button>
          </div>

          {/* GPS Quick Trigger */}
          <div className="modal-gps-wrapper">
            <button
              type="button"
              className="modal-gps-action-btn"
              onClick={handleUseGps}
              disabled={isGpsLoading}
            >
              {isGpsLoading ? (
                <RotateCw size={18} className="spin-icon" style={{ color: '#059669' }} />
              ) : (
                <Navigation size={18} style={{ color: '#059669' }} />
              )}
              <div className="gps-action-text">
                <span className="gps-action-main">
                  {isGpsLoading 
                    ? (language === 'pa' ? 'GPS ਲੱਭ ਰਿਹਾ ਹੈ...' : (language === 'hi' ? 'GPS खोज रहा है...' : 'Detecting current GPS...'))
                    : (language === 'pa' ? 'ਮੇਰੀ ਮੌਜੂਦਾ ਲੋਕੇਸ਼ਨ ਲਵੋ' : (language === 'hi' ? 'मेरी वर्तमान लोकेशन लें' : 'Use My Current Location'))}
                </span>
                <span className="gps-action-sub">
                  {language === 'pa' ? 'ਪਿੰਡ, ਤਹਿਸੀਲ ਤੇ ਜ਼ਿਲ੍ਹਾ ਆਟੋ-ਡਿਟੈਕਟ ਕਰੋ' : (language === 'hi' ? 'गांव, तहसील और जिले का स्वतः पता लगाएं' : 'Auto-detect Village, Tehsil, and District')}
                </span>
              </div>
            </button>

            {gpsError && (
              <div className="modal-gps-error">
                <AlertCircle size={15} />
                <span>{gpsError}</span>
              </div>
            )}
          </div>

          {/* Search Box */}
          <div className="modal-search-wrapper">
            <div className="modal-search-input-box">
              <Search size={17} className="search-icon" />
              <input
                type="text"
                className="modal-search-field"
                placeholder={language === 'pa' ? 'ਕੋਈ ਵੀ ਭਾਰਤੀ ਸ਼ਹਿਰ, ਪਿੰਡ, ਤਹਿਸੀਲ ਜਾਂ ਰਾਜ ਲੱਭੋ...' : (language === 'hi' ? 'कोई भी भारतीय शहर, कस्बा, तहसील या राज्य खोजें...' : 'Search any city, town, district, or state across India...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button type="button" className="clear-text-btn" onClick={() => setSearchQuery('')}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Live Search Results in Modal */}
            {searchQuery.trim().length >= 2 && (
              <div className="modal-search-dropdown">
                {isSearching ? (
                  <div className="modal-dropdown-loading">
                    <RotateCw size={16} className="spin-icon" />
                    <span>{language === 'pa' ? 'ਇਲਾਕੇ ਲੱਭ ਰਹੇ ਹਾਂ...' : (language === 'hi' ? 'स्थान खोजे जा रहे हैं...' : 'Searching locations...')}</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="modal-results-list">
                    {searchResults.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className="modal-result-item"
                        onClick={() => handleSelectSearchResult(item)}
                      >
                        <div className="result-loc-pin">
                          <MapPin size={16} />
                        </div>
                        <div className="result-details">
                          <div className="result-main-line">
                            <span className="result-name-bold">{item.name}</span>
                            <span className="result-scope-tag">{item.level}</span>
                          </div>
                          <div className="result-breadcrumb-line">{item.hierarchyBreadcrumb}</div>
                        </div>
                        <ChevronRight size={14} className="result-arrow" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="modal-dropdown-empty">
                    <span>{language === 'pa' ? `"${searchQuery}" ਲਈ ਕੋਈ ਇਲਾਕਾ ਨਹੀਂ ਮਿਲਿਆ।` : (language === 'hi' ? `"${searchQuery}" के लिए कोई परिणाम नहीं मिला।` : `No results found for "${searchQuery}".`)}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recent Locations (if any) */}
          {recentLocations.length > 0 && !searchQuery && (
            <div className="modal-recent-section">
              <div className="modal-section-title">
                <History size={14} />
                <span>{language === 'pa' ? 'ਹਾਲ ਹੀ ਵਿੱਚ ਵੇਖੇ ਗਏ ਇਲਾਕੇ' : (language === 'hi' ? 'हाल ही में देखी गई लोकेशन' : 'Recently Viewed Locations')}</span>
              </div>
              <div className="modal-recent-grid">
                {recentLocations.map((loc) => {
                  const isCurrent = loc.id === activeLocation.id || loc.name === activeLocation.name;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      className={`modal-recent-card ${isCurrent ? 'active-current' : ''}`}
                      onClick={() => handleSelectRecent(loc)}
                    >
                      <div className="recent-card-top">
                        <span className="recent-place">{loc.name}</span>
                        {isCurrent && <Check size={14} className="current-check" />}
                      </div>
                      <span className="recent-sub">{loc.district}, {loc.state}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pan-India Zone & State Browser */}
          {!searchQuery && (
            <div className="modal-popular-section" style={{ marginTop: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <div className="modal-section-title" style={{ margin: 0 }}>
                  <Globe size={14} style={{ color: '#059669' }} />
                  <span>Pan-India Real Estate Markets</span>
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {PAN_INDIA_ZONES.map(z => {
                    const isZoneActive = selectedZone === z;
                    return (
                      <button
                        key={z}
                        type="button"
                        onClick={() => {
                          setSelectedZone(z);
                          setSelectedState('All');
                        }}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '999px',
                          border: isZoneActive ? '1.5px solid #059669' : '1px solid #E2E8F0',
                          background: isZoneActive ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : '#F8FAFC',
                          color: isZoneActive ? '#FFFFFF' : '#475569',
                          fontSize: '11px',
                          fontWeight: 750,
                          cursor: 'pointer',
                          boxShadow: isZoneActive ? '0 2px 6px rgba(16, 185, 129, 0.3)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {z}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* State dropdown */}
              <div style={{ marginBottom: '12px' }}>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#0F172A',
                    fontSize: '13px',
                    fontWeight: 650,
                    cursor: 'pointer',
                    outline: 'none',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
                  }}
                >
                  <option value="All">All States in {selectedZone} ({availableStates.length} states & UTs)</option>
                  {availableStates.map(s => (
                    <option key={s.code} value={s.name}>{s.name} ({s.cities.length} cities)</option>
                  ))}
                </select>
              </div>

              {/* City chips */}
              <div className="modal-chips-row" style={{ maxHeight: '130px', overflowY: 'auto' }}>
                {availableCities.map(c => (
                  <button
                    key={`${c.city}-${c.state}`}
                    type="button"
                    className="modal-chip-btn"
                    onClick={() => handleSelectCityItem(c)}
                  >
                    <span>{c.city}</span>
                    <span style={{ fontSize: '9.5px', color: '#059669', marginLeft: '4px', fontWeight: 700 }}>({c.state.slice(0, 2).toUpperCase()})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
