import { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Compass,
  Search,
  TrendingUp,
  Building2,
  Layers,
  Calculator,
  Map,
  Sparkles,
  RefreshCw,
  LocateFixed
} from 'lucide-react';
import PriceTrendChart from '../components/charts/PriceTrendChart';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { CITY_MARKET_HUBS, findNearestCityHub, type ColonyDetail } from '../data/colonyMarketData';
import { locationService } from '../services/locationService';

interface MarketInsightsProps {
  onNavigate?: (page: string, propertyId?: string) => void;
}

export default function MarketInsights({ onNavigate }: MarketInsightsProps) {
  const { language, t, translateCategory } = useLanguage();
  const { addToast, setImportedPlot, activeLocation } = useApp();

  // Location selection state
  const [selectedCityId, setSelectedCityId] = useState<string>('mohali');
  const [activeLocationMode, setActiveLocationMode] = useState<'gps' | 'search'>('search');

  // Synchronize with activeLocation
  useEffect(() => {
    if (!activeLocation) return;
    const name = (activeLocation.name || '').toLowerCase();
    const dist = (activeLocation.district || '').toLowerCase();
    if (dist.includes('rewari') || name.includes('rewari') || name.includes('bawal') || name.includes('dharuhera') || name.includes('khol') || name.includes('kosli')) {
      setSelectedCityId('rewari');
    } else if (dist.includes('gurugram') || name.includes('gurgaon') || name.includes('gurugram')) {
      setSelectedCityId('gurugram');
    } else if (dist.includes('panchkula') || name.includes('panchkula')) {
      setSelectedCityId('panchkula');
    } else if (dist.includes('chandigarh') || name.includes('chandigarh')) {
      setSelectedCityId('chandigarh');
    } else if (dist.includes('zirakpur') || name.includes('zirakpur')) {
      setSelectedCityId('zirakpur');
    } else {
      setSelectedCityId('mohali');
    }
  }, [activeLocation]);
  
  // GPS State
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [detectedCityName, setDetectedCityName] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'growth' | 'priceHigh' | 'priceLow' | 'demand'>('growth');
  
  // Map View State
  const [showInteractiveMap, setShowInteractiveMap] = useState(false);
  const [activeColonyId, setActiveColonyId] = useState<string | null>(null);

  // Sync with activeLocation if changed from topbar
  useEffect(() => {
    if (activeLocation && activeLocation.coordinates) {
      const matched = findNearestCityHub(activeLocation.coordinates[0], activeLocation.coordinates[1]);
      setSelectedCityId(matched.id);
    }
  }, [activeLocation]);

  // Current active city hub object
  const currentCity = useMemo(() => {
    return CITY_MARKET_HUBS.find(h => h.id === selectedCityId) || CITY_MARKET_HUBS[0];
  }, [selectedCityId]);

  // Handle GPS Auto-Detection with unified multi-tier engine
  const handleDetectCurrentLocation = async () => {
    setIsGpsLoading(true);
    setActiveLocationMode('gps');

    try {
      const unified = await locationService.getUnifiedCurrentLocation();
      const [lat, lng] = unified.coordinates;
      if (unified.accuracy) {
        setGpsAccuracy(Math.round(unified.accuracy));
      }

      const matchedCity = findNearestCityHub(lat, lng);
      setSelectedCityId(matchedCity.id);
      setDetectedCityName(matchedCity.name);
      setIsGpsLoading(false);

      if (addToast) {
        addToast(`📍 Market Hub: ${matchedCity.name} (${unified.displayName || unified.city})`, 'success');
      }
    } catch (error) {
      console.warn('GPS Error in Market Insights:', error);
      const fallbackCity = CITY_MARKET_HUBS[0];
      setSelectedCityId(fallbackCity.id);
      setDetectedCityName(fallbackCity.name);
      setIsGpsLoading(false);
      if (addToast) {
        addToast(language === 'pa' ? 'ਲੋਕੇਸ਼ਨ ਸੈੱਟ ਕੀਤੀ ਗਈ' : (language === 'hi' ? 'लोकेशन सेट की गई' : 'Location resolved to nearest market hub'), 'info');
      }
    }
  };

  // Filter & Sort Colonies List
  const filteredColonies = useMemo(() => {
    let list = [...currentCity.colonies];

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter(c => c.category === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.localNameHi.toLowerCase().includes(q) ||
        c.localNamePa.toLowerCase().includes(q) ||
        c.landmarks.some(l => l.toLowerCase().includes(q))
      );
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'growth') return b.growth1Yr - a.growth1Yr;
      if (sortBy === 'priceHigh') return b.avgPrice - a.avgPrice;
      if (sortBy === 'priceLow') return a.avgPrice - b.avgPrice;
      if (sortBy === 'demand') return b.demandScore - a.demandScore;
      return 0;
    });

    return list;
  }, [currentCity, selectedCategory, searchQuery, sortBy]);

  // Navigate actions
  const handleCalculateStampDuty = (colony: ColonyDetail) => {
    if (setImportedPlot) {
      setImportedPlot({
        areaSqYd: 200,
        perimeter: 60,
        polygon: [[0, 0], [10, 0], [10, 20], [0, 20]],
        location: `${colony.name}, ${currentCity.name}`
      });
    }
    if (onNavigate) {
      onNavigate('land-calculator');
    } else {
      window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'land-calculator' }));
    }
  };

  const handleAskAIAboutColony = (colony: ColonyDetail) => {
    if (setImportedPlot) {
      setImportedPlot({
        areaSqYd: 200,
        perimeter: 60,
        polygon: [[0, 0], [10, 0], [10, 20], [0, 20]],
        location: `${colony.name}, ${currentCity.name}`
      });
    }
    if (onNavigate) {
      onNavigate('advisor');
    } else {
      window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'advisor' }));
    }
  };

  const localizedCategories = [
    { id: 'all', label: language === 'pa' ? 'ਸਾਰੇ ਇਲਾਕੇ' : (language === 'hi' ? 'सभी इलाके' : 'All Localities') },
    { id: 'Approved Sector', label: language === 'pa' ? '🏛️ ਪਾਸ ਕੀਤੇ ਸੈਕਟਰ' : (language === 'hi' ? '🏛️ अप्रूव्ड सेक्टर्स' : '🏛️ Approved Sectors') },
    { id: 'Gated Township', label: language === 'pa' ? '🏡 ਗੇਟੇਡ ਟਾਊਨਸ਼ਿਪ' : (language === 'hi' ? '🏡 गेटेड टाउनशिप्स' : '🏡 Gated Townships') },
    { id: 'Freehold Colony', label: language === 'pa' ? '📜 ਫ੍ਰੀਹੋਲਡ ਕਾਲੋਨੀਆਂ' : (language === 'hi' ? '📜 फ्रीहोल्ड कालोनियां' : '📜 Freehold Colonies') },
    { id: 'Commercial Corridor', label: language === 'pa' ? '🏢 ਵਪਾਰਕ ਬੈਲਟ' : (language === 'hi' ? '🏢 कमर्शियल बेल्ट' : '🏢 Commercial Belts') },
    { id: 'High-Rise Society', label: language === 'pa' ? '🏙️ ਹਾਈ-ਰਾਈਜ਼ ਸੁਸਾਇਟੀਆਂ' : (language === 'hi' ? '🏙️ हाई-राइज़ सोसाइटीज' : '🏙️ High-Rise Societies') }
  ];

  return (
    <div className="ma-page-container">
      
      {/* ─── HERO LOCATION CONTROLLER & MODE PICKER ─── */}
      <div className="ma-hero-controller-card">
        <div className="ma-controller-top">
          <div className="ma-badge-title-group">
            <div className="ma-ai-orb-mini">
              <Compass size={18} className="color-emerald" />
            </div>
            <div>
              <h1 className="ma-hero-title">
                {language === 'pa' 
                  ? 'ਮਾਰਕੀਟ ਵਿਸ਼ਲੇਸ਼ਣ ਤੇ ਕਲੈਕਟਰ ਰੇਟ' 
                  : (language === 'hi' 
                    ? 'मार्केट एनालिटिक्स व सर्कल रेट डायरेक्टरी' 
                    : 'Real-Time Market Analytics & Locality Rate Index')}
              </h1>
              <p className="ma-hero-subtitle">
                {language === 'pa'
                  ? 'ਆਪਣੀ ਲਾਈਵ ਲੋਕੇਸ਼ਨ ਜਾਂ ਨਕਸ਼ੇ ਤੋਂ ਖੇਤਰ ਚੁਣੋ ਅਤੇ ਸਾਰੀਆਂ ਕਾਲੋਨੀਆਂ ਦੇ ਰੇਟ ਦੇਖੋ।'
                  : (language === 'hi'
                    ? 'अपनी लाइव लोकेशन या नक्शे से क्षेत्र चुनें और सभी कालोनियों व मोहल्लों के सटीक दाम देखें।'
                    : 'Select your live GPS location or search any region to view market rates, circle rates, and 3-Yr ROI across all colonies.')}
              </p>
            </div>
          </div>

          {/* 2 Primary Modes */}
          <div className="ma-primary-modes-cluster">
            <button
              className={`ma-mode-toggle-btn ${activeLocationMode === 'gps' ? 'active' : ''}`}
              onClick={handleDetectCurrentLocation}
              disabled={isGpsLoading}
            >
              <LocateFixed size={16} className={isGpsLoading ? 'spin-anim' : ''} />
              <span>
                {isGpsLoading 
                  ? (language === 'pa' ? 'GPS ਲੱਭ ਰਿਹਾ ਹੈ...' : (language === 'hi' ? 'GPS खोज रहा है...' : 'Detecting GPS...'))
                  : (language === 'pa' ? 'ਮੇਰੀ ਮੌਜੂਦਾ ਲੋਕੇਸ਼ਨ ਲਵੋ' : (language === 'hi' ? 'मेरी वर्तमान लोकेशन लें' : 'Use My Current Location'))}
              </span>
              <span className="gps-live-dot" />
            </button>

            <button
              className={`ma-mode-toggle-btn ${activeLocationMode === 'search' ? 'active' : ''}`}
              onClick={() => setActiveLocationMode('search')}
            >
              <Search size={16} />
              <span>
                {language === 'pa' ? 'ਇਲਾਕਾ ਚੁਣੋ / ਲੱਭੋ' : (language === 'hi' ? 'लोकेशन चुनें / खोजें' : 'Select / Search Location')}
              </span>
            </button>
          </div>
        </div>

        {/* GPS Live Status Ribbon */}
        {activeLocationMode === 'gps' && detectedCityName && (
          <div className="ma-gps-status-ribbon">
            <div className="gps-ribbon-left">
              <span className="pulse-beacon" />
              <span>
                {language === 'pa' ? 'ਲਾਈਵ GPS ਚਾਲੂ: ' : (language === 'hi' ? 'लाइव GPS सक्रिय: ' : 'Live GPS Active: ')}
                <strong>{detectedCityName}</strong> {gpsAccuracy && `(±${gpsAccuracy}m)`}
              </span>
            </div>
            <button className="gps-refresh-btn" onClick={handleDetectCurrentLocation}>
              <RefreshCw size={12} /> {language === 'pa' ? 'ਮੁੜ ਜਾਂਚੋ' : (language === 'hi' ? 'पुनः जांचें' : 'Recalibrate')}
            </button>
          </div>
        )}

        {/* City Quick-Pills & Search Bar */}
        <div className="ma-city-selector-bar">
          <div className="ma-city-pills-row">
            {CITY_MARKET_HUBS.map(city => (
              <button
                key={city.id}
                className={`ma-city-pill ${selectedCityId === city.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCityId(city.id);
                  setActiveLocationMode('search');
                  setActiveColonyId(null);
                }}
              >
                <MapPin size={13} className="city-pin-icon" />
                <span>{city.name}</span>
                <span className="city-growth-tag">+{city.overallGrowthYoY}%</span>
              </button>
            ))}
          </div>

          <button 
            className={`ma-map-view-toggle-btn ${showInteractiveMap ? 'active' : ''}`}
            onClick={() => setShowInteractiveMap(!showInteractiveMap)}
          >
            <Map size={15} />
            <span>
              {showInteractiveMap 
                ? (language === 'pa' ? 'ਨਕਸ਼ਾ ਛੁਪਾਓ' : (language === 'hi' ? 'नक्शा छिपाएं' : 'Hide Map Pins'))
                : (language === 'pa' ? 'ਨਕਸ਼ੇ ਤੇ ਪਿੰਨ ਵੇਖੋ' : (language === 'hi' ? 'नक्शे पर पिन देखें' : 'Interactive Map Pins'))}
            </span>
          </button>
        </div>
      </div>

      {/* ─── INTERACTIVE MAP PIN CANVASES (WHEN TOGGLED) ─── */}
      {showInteractiveMap && (
        <div className="ma-interactive-map-drawer">
          <div className="map-drawer-header">
            <div className="map-drawer-title">
              <Layers size={16} className="color-sapphire" />
              <span><strong>{currentCity.name}</strong> {language === 'pa' ? 'ਕਾਲੋਨੀ ਰੇਟ ਰਾਡਾਰ ਨਕਸ਼ਾ' : (language === 'hi' ? 'कालोनी रेट रडार मैप' : 'Colony & Micro-Location Rate Radar Map')}</span>
            </div>
            <span className="map-drawer-hint">
              {language === 'pa' ? 'ਰੇਟ ਵੇਖਣ ਲਈ ਕਿਸੇ ਵੀ ਕਾਲੋਨੀ ਪਿੰਨ ਤੇ ਟੈਪ ਕਰੋ' : (language === 'hi' ? 'रेट देखने के लिए किसी भी कालोनी पिन पर टैप करें' : 'Tap any colony pin to view rates')}
            </span>
          </div>

          <div className="ma-svg-map-canvas">
            <svg viewBox="0 0 800 280" className="ma-radar-svg">
              <defs>
                <radialGradient id="mapGridGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect x="0" y="0" width="800" height="280" fill="#f8fafc" rx="14" />
              <rect x="0" y="0" width="800" height="280" fill="url(#mapGridGlow)" />
              
              {/* Decorative Map Arterial Roads */}
              <path d="M 50 140 Q 400 60 750 140" stroke="#e2e8f0" strokeWidth="6" fill="none" strokeDasharray="6 6" />
              <path d="M 200 20 Q 400 140 600 260" stroke="#cbd5e1" strokeWidth="4" fill="none" />
              <path d="M 100 240 Q 400 180 700 40" stroke="#e2e8f0" strokeWidth="5" fill="none" />

              {/* Colony Pins */}
              {currentCity.colonies.map((colony, idx) => {
                const xPos = 120 + (idx % 4) * 180 + (idx > 3 ? 40 : 0);
                const yPos = 65 + Math.floor(idx / 4) * 110 + (idx % 2 === 0 ? 15 : -10);
                const isSelected = activeColonyId === colony.id;

                return (
                  <g
                    key={colony.id}
                    className={`svg-colony-pin ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => setActiveColonyId(colony.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle cx={xPos} cy={yPos} r={isSelected ? "22" : "16"} fill={isSelected ? "#2563eb" : "#ffffff"} stroke={isSelected ? "#1d4ed8" : "#3b82f6"} strokeWidth="3" />
                    <text x={xPos} y={yPos + 4} textAnchor="middle" fill={isSelected ? "#ffffff" : "#1d4ed8"} fontSize="11" fontWeight="800">
                      ₹{Math.round(colony.avgPrice / 1000)}k
                    </text>
                    
                    {/* Pin Label Box */}
                    <rect x={xPos - 55} y={yPos + 22} width="110" height="20" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))" />
                    <text x={xPos} y={yPos + 36} textAnchor="middle" fill="#0f172a" fontSize="9.5" fontWeight="700">
                      {colony.name.split('(')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* ─── CITY OVERVIEW KPI METRICS ─── */}
      <div className="ma-overview-grid">
        <div className="ma-kpi-card highlight-sapphire">
          <div className="kpi-top">
            <span className="kpi-label">{language === 'pa' ? 'ਔਸਤ ਮਾਰਕੀਟ ਰੇਟ' : (language === 'hi' ? 'औसत मार्केट रेट' : 'Average Market Rate')}</span>
            <span className="kpi-badge-growth">+{currentCity.overallGrowthYoY}% YoY</span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-val-main">₹{currentCity.overallAvgGaj.toLocaleString('en-IN')}</span>
            <span className="kpi-unit">/{language === 'pa' ? 'ਗਜ਼' : (language === 'hi' ? 'गज' : 'Gaj')}</span>
          </div>
          <p className="kpi-subtext">₹{Math.round(currentCity.overallAvgGaj / 9).toLocaleString('en-IN')} /{language === 'pa' ? 'ਸੁਕੇਅਰ ਫੁੱਟ' : (language === 'hi' ? 'वर्ग फुट' : 'sq.ft')}</p>
        </div>

        <div className="ma-kpi-card highlight-emerald">
          <div className="kpi-top">
            <span className="kpi-label">{language === 'pa' ? 'ਸਰਕਾਰੀ ਕਲੈਕਟਰ ਰੇਟ' : (language === 'hi' ? 'सरकारी सर्कल रेट' : 'Collector Circle Benchmark')}</span>
            <span className="kpi-badge-teal">{language === 'pa' ? 'ਤਹਿਸੀਲ 2026' : (language === 'hi' ? 'तहसील 2026' : 'Tehsil 2026')}</span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-val-main">₹{currentCity.overallCircleRate.toLocaleString('en-IN')}</span>
            <span className="kpi-unit">/{language === 'pa' ? 'ਗਜ਼' : (language === 'hi' ? 'गज' : 'Gaj')}</span>
          </div>
          <p className="kpi-subtext">{language === 'pa' ? 'ਸਰਕਾਰੀ ਰੇਟ ਤੋਂ ਪ੍ਰੀਮੀਅਮ:' : (language === 'hi' ? 'सर्कल रेट से प्रीमियम:' : 'Market premium:')} {(currentCity.overallAvgGaj / currentCity.overallCircleRate).toFixed(2)}x</p>
        </div>

        <div className="ma-kpi-card highlight-amber">
          <div className="kpi-top">
            <span className="kpi-label">{language === 'pa' ? 'ਕੁੱਲ ਦਰਜ ਕਾਲੋਨੀਆਂ' : (language === 'hi' ? 'कुल सूचीबद्ध कालोनियां' : 'Indexed Micro-Locations')}</span>
            <span className="kpi-badge-orange">100% {language === 'pa' ? 'ਕਵਰੇਜ' : (language === 'hi' ? 'कवरेज' : 'Coverage')}</span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-val-main">{currentCity.colonies.length} {language === 'pa' ? 'ਕਾਲੋਨੀਆਂ' : (language === 'hi' ? 'कालोनियां' : 'Colonies')}</span>
          </div>
          <p className="kpi-subtext">{language === 'pa' ? 'ਸੈਕਟਰ, ਸੁਸਾਇਟੀਆਂ ਤੇ ਵਪਾਰਕ ਖੇਤਰ' : (language === 'hi' ? 'सेक्टर, सोसायटियां व कमर्शियल बेल्ट' : 'Sectors, Gated Townships & Commercial belts')}</p>
        </div>

        <div className="ma-kpi-card highlight-violet">
          <div className="kpi-top">
            <span className="kpi-label">{language === 'pa' ? 'ਖਰੀਦਦਾਰਾਂ ਦੀ ਮੰਗ' : (language === 'hi' ? 'खरीदारों की मांग' : 'Buyer Demand Liquidity')}</span>
            <span className="kpi-badge-purple">{language === 'pa' ? 'ਮੋਹਰੀ ਕੋਰੀਡੋਰ' : (language === 'hi' ? 'शीर्ष कॉरिडोर' : 'Top Corridor')}</span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-val-main">{currentCity.demandRating}</span>
          </div>
          <p className="kpi-subtext">{language === 'pa' ? 'ਰਜਿਸਟਰੀਆਂ ਅਤੇ ਮੰਗ ਦੇ ਆਧਾਰ ਤੇ' : (language === 'hi' ? 'रजिस्ट्री लेनदेन व पूछताछ आधारित' : 'Based on registry transactions & inquiries')}</p>
        </div>
      </div>

      {/* ─── 12-MONTH RATE TRAJECTORY & CHART ─── */}
      <div className="ma-chart-card">
        <div className="chart-header-row">
          <div>
            <div className="chart-main-title">
              <TrendingUp size={18} className="color-emerald" />
              <span><strong>{currentCity.name}</strong> {language === 'pa' ? '12 ਮਹੀਨਿਆਂ ਦਾ ਰੇਟ ਟ੍ਰੈਂਡ' : (language === 'hi' ? '12 महीने का मूल्य रुझान' : '12-Month Rate Trajectory')}</span>
            </div>
            <p className="chart-subtitle">{language === 'pa' ? 'ਸਤੰਬਰ 2025 ਤੋਂ ਅਗਸਤ 2026 ਤੱਕ ਪ੍ਰਤੀ ਗਜ਼ ਮੁੱਲ ਵਾਧਾ' : (language === 'hi' ? 'सितंबर 2025 से अगस्त 2026 तक प्रति वर्ग गज मूल्य वृद्धि' : 'Historical appreciation curve per sq.yd. from Sep 2025 to Aug 2026')}</p>
          </div>
          <div className="chart-stat-pill">
            <span className="stat-pill-label">{language === 'pa' ? '1 ਸਾਲ ਦਾ ਵਾਧਾ:' : (language === 'hi' ? '1 वर्ष का लाभ:' : '1-Year Gain:')}</span>
            <span className="stat-pill-val color-emerald">+₹{(currentCity.overallAvgGaj - currentCity.priceHistory[0].price).toLocaleString('en-IN')}/{language === 'pa' ? 'ਗਜ਼' : (language === 'hi' ? 'गज' : 'Gaj')}</span>
          </div>
        </div>
        <div className="ma-chart-render-wrap">
          <PriceTrendChart data={currentCity.priceHistory} height={230} />
        </div>
      </div>

      {/* ─── COLONIES & MOHALLAS DIRECTORY ─── */}
      <div className="ma-colonies-section">
        
        {/* Section Header & Controls */}
        <div className="ma-colonies-header-bar">
          <div className="section-title-group">
            <Building2 size={20} className="color-sapphire" />
            <div>
              <h2 className="section-heading">
                {language === 'pa'
                  ? `${currentCity.name} ਦੀਆਂ ਸਾਰੀਆਂ ਕਾਲੋਨੀਆਂ ਅਤੇ ਮੁਹੱਲੇ`
                  : (language === 'hi'
                    ? `${currentCity.name} की सभी कालोनियां, सेक्टर व मोहल्ले`
                    : `All Colonies, Sectors & Mohallas in ${currentCity.name}`)}
              </h2>
              <span className="section-count-tag">
                {language === 'pa' 
                  ? `ਲਾਈਵ ਰੇਟਾਂ ਵਾਲੇ ${filteredColonies.length} ਇਲਾਕੇ ਉਪਲਬਧ` 
                  : (language === 'hi' 
                    ? `लाइव रेट के साथ ${filteredColonies.length} इलाके उपलब्ध` 
                    : `Showing ${filteredColonies.length} Localities with Live Rates`)}
              </span>
            </div>
          </div>

          {/* Search & Sort Dock */}
          <div className="ma-search-sort-dock">
            <div className="colony-search-box">
              <Search size={14} className="search-icon" />
              <input
                type="text"
                placeholder={language === 'pa' ? 'ਕਾਲੋਨੀ, ਸੈਕਟਰ ਜਾਂ ਲੈਂਡਮਾਰਕ ਲੱਭੋ...' : (language === 'hi' ? 'कालोनी, सेक्टर या लैंडमार्क खोजें...' : 'Search colony, sector, or landmark...')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="colony-search-input"
              />
            </div>

            <div className="sort-dropdown-wrap">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="colony-sort-select"
              >
                <option value="growth">{language === 'pa' ? 'ਤਰਤੀਬ: ਸਭ ਤੋਂ ਵੱਧ ਵਾਧਾ %' : (language === 'hi' ? 'क्रम: उच्चतम ग्रोथ %' : 'Sort: Highest Growth %')}</option>
                <option value="priceHigh">{language === 'pa' ? 'ਤਰਤੀਬ: ਸਭ ਤੋਂ ਵੱਧ ਕੀਮਤ' : (language === 'hi' ? 'क्रम: उच्चतम कीमत' : 'Sort: Highest Price')}</option>
                <option value="priceLow">{language === 'pa' ? 'ਤਰਤੀਬ: ਸਭ ਤੋਂ ਘੱਟ ਕੀਮਤ' : (language === 'hi' ? 'क्रम: न्यूनतम कीमत' : 'Sort: Lowest Price')}</option>
                <option value="demand">{language === 'pa' ? 'ਤਰਤੀਬ: ਖਰੀਦਦਾਰਾਂ ਦੀ ਮੰਗ' : (language === 'hi' ? 'क्रम: खरीदार मांग स्कोर' : 'Sort: Buyer Demand Score')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filters Strip */}
        <div className="ma-category-filter-strip">
          {localizedCategories.map(cat => (
            <button
              key={cat.id}
              className={`cat-filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Colonies Cards Grid */}
        <div className="ma-colonies-grid">
          {filteredColonies.map(colony => {
            const isHighlighted = activeColonyId === colony.id;
            const circleGapRatio = ((colony.avgPrice - colony.circleRate) / colony.circleRate * 100).toFixed(0);

            return (
              <div
                key={colony.id}
                className={`ma-colony-card ${isHighlighted ? 'highlight-active' : ''}`}
                id={`colony-${colony.id}`}
              >
                {/* Top Badge Row */}
                <div className="colony-card-top">
                  <span className={`colony-type-badge type-${colony.category.toLowerCase().replace(/[^a-z]/g, '-')}`}>
                    {translateCategory(colony.category)}
                  </span>
                  <span className={`colony-status-badge status-${colony.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {colony.status}
                  </span>
                </div>

                {/* Colony Names */}
                <div className="colony-name-block">
                  <h3 className="colony-primary-name">{colony.name}</h3>
                  <span className="colony-local-name">
                    {language === 'pa' ? colony.localNamePa : colony.localNameHi} · {colony.bylawAuthority}
                  </span>
                </div>

                {/* Price Display Block */}
                <div className="colony-price-block">
                  <div className="price-main-figure">
                    <span className="price-rupee">₹</span>
                    <span className="price-number">{colony.avgPrice.toLocaleString('en-IN')}</span>
                    <span className="price-unit">/{language === 'pa' ? 'ਗਜ਼' : (language === 'hi' ? 'गज' : 'Gaj')}</span>
                  </div>
                  <span className="price-sqft-val">₹{colony.priceSqFt.toLocaleString('en-IN')} {language === 'pa' ? 'ਪ੍ਰਤੀ ਵਰਗ ਫੁੱਟ' : (language === 'hi' ? 'प्रति वर्ग फुट' : 'per sq.ft.')}</span>
                </div>

                {/* Price Range Slider Indicator */}
                <div className="colony-range-strip">
                  <div className="range-labels">
                    <span>{language === 'pa' ? 'ਘੱਟੋ-ਘੱਟ' : (language === 'hi' ? 'न्यूनतम' : 'Min')} ₹{colony.priceRange.min.toLocaleString('en-IN')}</span>
                    <span>{language === 'pa' ? 'ਵੱਧ ਤੋਂ ਵੱਧ' : (language === 'hi' ? 'अधिकतम' : 'Max')} ₹{colony.priceRange.max.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="range-bar-bg">
                    <div className="range-bar-fill" style={{ width: `${Math.min(100, Math.max(30, (colony.avgPrice / colony.priceRange.max) * 100))}%` }} />
                  </div>
                </div>

                {/* Circle Rate & Metrics Row */}
                <div className="colony-metrics-table">
                  <div className="metric-row">
                    <span className="metric-label">{language === 'pa' ? 'ਸਰਕਾਰੀ ਕਲੈਕਟਰ ਰੇਟ' : (language === 'hi' ? 'सरकारी सर्कल रेट' : 'Govt Circle Rate')}</span>
                    <span className="metric-val bold">₹{colony.circleRate.toLocaleString('en-IN')}/{language === 'pa' ? 'ਗਜ਼' : (language === 'hi' ? 'गज' : 'Gaj')}</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">{language === 'pa' ? 'ਸਰਕਾਰੀ ਰੇਟ ਤੋਂ ਅੰਤਰ' : (language === 'hi' ? 'सर्कल रेट से अंतर' : 'Market vs Circle Gap')}</span>
                    <span className="metric-val color-amber">+{circleGapRatio}% Premium</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">{language === 'pa' ? '1-ਸਾਲ ਦਾ ਵਾਧਾ (YoY)' : (language === 'hi' ? '1-वर्षीय वृद्धि (YoY)' : '1-Year YoY Growth')}</span>
                    <span className="metric-val color-emerald bold">+{colony.growth1Yr}%</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">{language === 'pa' ? '3-ਸਾਲ ਦਾ ਸੰਭਾਵੀ ROI' : (language === 'hi' ? '3-वर्षीय अनुमानित ROI' : '3-Year ROI Forecast')}</span>
                    <span className="metric-val color-sapphire bold">+{colony.growth3Yr}%</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">{language === 'pa' ? 'ਮੰਗ ਸਕੋਰ' : (language === 'hi' ? 'मांग स्कोर' : 'Buyer Demand Index')}</span>
                    <span className="metric-val color-emerald">{colony.demandScore} / 100</span>
                  </div>
                </div>

                {/* Landmarks Tag Strip */}
                <div className="colony-landmarks-strip">
                  {colony.landmarks.map((landmark, lIdx) => (
                    <span key={lIdx} className="landmark-tag">
                      📍 {landmark}
                    </span>
                  ))}
                </div>

                {/* Action Buttons Cluster */}
                <div className="colony-actions-cluster">
                  <button
                    className="colony-action-btn btn-calc"
                    onClick={() => handleCalculateStampDuty(colony)}
                    title={language === 'pa' ? 'ਇਸ ਕਾਲੋਨੀ ਲਈ ਅਸ਼ਟਾਮ ਫੀਸ ਗਿਣੋ' : (language === 'hi' ? 'इस कालोनी के लिए स्टाम्प ड्यूटी निकालें' : 'Calculate Stamp Duty for this Colony')}
                  >
                    <Calculator size={13} />
                    <span>{t.calculator.modes.stampDuty}</span>
                  </button>

                  <button
                    className="colony-action-btn btn-ai"
                    onClick={() => handleAskAIAboutColony(colony)}
                    title={language === 'pa' ? 'AI ਸਲਾਹਕਾਰ ਨਾਲ ਪੁੱਛੋ' : (language === 'hi' ? 'AI सलाहकार से पूछें' : 'Consult AI Advisor for this Colony')}
                  >
                    <Sparkles size={13} />
                    <span>{language === 'pa' ? 'AI ਮੁਲਾਂਕਣ' : (language === 'hi' ? 'AI मूल्यांकन' : 'AI Valuation')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
