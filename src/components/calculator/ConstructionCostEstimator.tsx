import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Building2,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Info,
  Sliders,
  Printer,
  Search,
  Crosshair,
  Sparkles,
  Loader2,
  Edit3,
  TrendingUp,
  HardHat,
  Clock,
  Hammer
} from 'lucide-react';
import type { ConstructionQualityTier, ConstructionInputParams } from '../../data/construction/types';
import { INDIA_STATES_DATA } from '../../data/planning/indiaStatesData';
import { COLONY_RATES_DATABASE } from '../../data/construction/constructionRatesData';
import { calculateConstructionCost, formatINRRange } from '../../services/constructionCostService';
import { locationService } from '../../services/locationService';
import { useLanguage } from '../../context/LanguageContext';
import './ConstructionCostEstimator.css';

interface ConstructionCostEstimatorProps {
  initialPlotArea?: number;
  initialPlotUnit?: 'sqft' | 'sqyd' | 'marla' | 'kanal' | 'bigha' | 'acre';
  initialBuiltUpArea?: number;
  initialFloors?: number;
  initialState?: string;
  initialCity?: string;
  initialColony?: string;
  onCostCalculated?: (costMin: number, costMax: number, tier: ConstructionQualityTier) => void;
  compactMode?: boolean;
}

interface SearchItem {
  id: string;
  name: string;
  subTitle: string;
  state: string;
  city: string;
  colony: string;
  ratePreview?: string;
  isOnline?: boolean;
}

export default function ConstructionCostEstimator({
  initialPlotArea = 200,
  initialPlotUnit = 'sqyd',
  initialBuiltUpArea,
  initialFloors = 2,
  initialState = 'Punjab',
  initialCity = 'SAS Nagar (Mohali)',
  initialColony = 'Sector 82 / JLPL Industrial & Plotted',
  onCostCalculated,
  compactMode = false
}: ConstructionCostEstimatorProps) {
  const { language } = useLanguage();

  // Location State
  const [state, setState] = useState(initialState);
  const [city, setCity] = useState(initialCity);
  const [colonyOrSector, setColonyOrSector] = useState(initialColony);
  const [isCustomColony, setIsCustomColony] = useState(false);

  // Search & Geolocation State
  const [colonySearchQuery, setColonySearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [onlineResults, setOnlineResults] = useState<SearchItem[]>([]);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Dimension & Area State
  const [plotAreaValue, setPlotAreaValue] = useState(initialPlotArea);
  const [plotAreaUnit, setPlotAreaUnit] = useState<'sqft' | 'sqyd' | 'marla' | 'kanal' | 'bigha' | 'acre'>(initialPlotUnit);
  const [floorsCount, setFloorsCount] = useState(initialFloors);
  const [hasBasement, setHasBasement] = useState<'none' | 'partial' | 'full'>('none');
  const [isManualBuiltUp, setIsManualBuiltUp] = useState(!!initialBuiltUpArea);
  const [manualBuiltUpSqFt, setManualBuiltUpSqFt] = useState(initialBuiltUpArea || 1800);

  // Quality Tier Selection
  const [qualityTier, setQualityTier] = useState<ConstructionQualityTier>('standard');

  // Custom Preferences
  const [smartHome, setSmartHome] = useState(false);
  const [solarPanels, setSolarPanels] = useState(false);
  const [elevationCladding, setElevationCladding] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showFullBreakdown, setShowFullBreakdown] = useState(true);

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Online Nominatim Search with Debounce across entire India
  useEffect(() => {
    if (!colonySearchQuery.trim() || colonySearchQuery.trim().length < 3) {
      setOnlineResults([]);
      setIsSearchingOnline(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingOnline(true);
      try {
        const results = await locationService.searchLocation(colonySearchQuery);
        const mapped: SearchItem[] = results.map(r => {
          const colonyName = r.locality || r.name;
          const cityName = r.city || r.locality || 'District Zone';
          const stateName = r.state || 'India';
          return {
            id: `online-${r.id}`,
            name: r.name,
            subTitle: `${r.locality ? r.locality + ', ' : ''}${cityName}, ${stateName}`,
            state: stateName,
            city: cityName,
            colony: colonyName,
            isOnline: true
          };
        });
        setOnlineResults(mapped);
      } catch (err) {
        console.error('Location search error:', err);
      } finally {
        setIsSearchingOnline(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [colonySearchQuery]);

  // Combined Search Results (Local Pre-loaded Database + Live All-India Nominatim Results)
  const combinedSearchResults = useMemo(() => {
    if (!colonySearchQuery.trim()) return [];
    const q = colonySearchQuery.toLowerCase().trim();

    // 1. Local database search
    const localMatches: SearchItem[] = COLONY_RATES_DATABASE.filter(item => {
      const colonyMatch = (item.colonyOrSector || '').toLowerCase().includes(q);
      const localityMatch = (item.locality || '').toLowerCase().includes(q);
      const cityMatch = item.districtOrCity.toLowerCase().includes(q);
      const stateMatch = item.state.toLowerCase().includes(q);
      return colonyMatch || localityMatch || cityMatch || stateMatch;
    }).slice(0, 8).map(item => ({
      id: item.id,
      name: item.colonyOrSector || item.locality || 'Prime Locality',
      subTitle: `${item.districtOrCity}, ${item.state} • ${item.locality || item.districtOrCity}`,
      state: item.state,
      city: item.districtOrCity,
      colony: item.colonyOrSector || item.locality || 'General Zone',
      ratePreview: `₹${item.tiers.standard.minRatePerSqFt}–₹${item.tiers.standard.maxRatePerSqFt}/sqft`,
      isOnline: false
    }));

    // 2. Merge with online results avoiding duplicates
    const combined = [...localMatches];
    for (const online of onlineResults) {
      if (!combined.some(c => c.name.toLowerCase() === online.name.toLowerCase())) {
        combined.push(online);
      }
    }

    return combined.slice(0, 10);
  }, [colonySearchQuery, onlineResults]);

  // Active state data from INDIA_STATES_DATA
  const activeStateData = useMemo(() => {
    return INDIA_STATES_DATA.find(s => s.name.toLowerCase() === state.toLowerCase()) || INDIA_STATES_DATA[0];
  }, [state]);

  // Available Cities/Districts based on State selection
  const availableDistricts = useMemo(() => {
    return activeStateData.districts;
  }, [activeStateData]);

  // Available Colonies for the selected State and City
  const availableColonies = useMemo(() => {
    return COLONY_RATES_DATABASE.filter(
      r => r.state.toLowerCase() === state.toLowerCase() &&
           (r.districtOrCity.toLowerCase().includes(city.toLowerCase()) || city.toLowerCase().includes(r.districtOrCity.toLowerCase()))
    );
  }, [state, city]);

  // Derived Built-Up Area if not manual
  const computedBuiltUpSqFt = useMemo(() => {
    if (isManualBuiltUp && manualBuiltUpSqFt > 0) {
      return manualBuiltUpSqFt;
    }
    // Default: 200 Gaj (1800 sq ft) * 0.70 Ground coverage * floors
    let baseSqFt = plotAreaValue;
    if (plotAreaUnit === 'sqyd') baseSqFt = plotAreaValue * 9;
    else if (plotAreaUnit === 'marla') baseSqFt = plotAreaValue * 225;
    else if (plotAreaUnit === 'kanal') baseSqFt = plotAreaValue * 4500;
    else if (plotAreaUnit === 'bigha') baseSqFt = plotAreaValue * 9072;
    else if (plotAreaUnit === 'acre') baseSqFt = plotAreaValue * 43560;

    const groundFootprint = baseSqFt * 0.70; // 70% standard coverage
    return Math.round(groundFootprint * Math.max(1, floorsCount));
  }, [isManualBuiltUp, manualBuiltUpSqFt, plotAreaValue, plotAreaUnit, floorsCount]);

  // Calculate construction estimate
  const estimate = useMemo(() => {
    const params: ConstructionInputParams = {
      plotAreaValue,
      plotAreaUnit,
      builtUpAreaSqFt: computedBuiltUpSqFt,
      floorsCount,
      hasBasement,
      qualityTier,
      state,
      city,
      colonyOrSector,
      customPreferences: {
        smartHome,
        solarPanels,
        elevationCladding
      }
    };
    const res = calculateConstructionCost(params);
    if (onCostCalculated) {
      onCostCalculated(res.minEstimatedCost, res.maxEstimatedCost, qualityTier);
    }
    return res;
  }, [
    plotAreaValue,
    plotAreaUnit,
    computedBuiltUpSqFt,
    floorsCount,
    hasBasement,
    qualityTier,
    state,
    city,
    colonyOrSector,
    smartHome,
    solarPanels,
    elevationCladding,
    onCostCalculated
  ]);

  // Specific colony benchmark calculations (Ongoing builder rates in this colony)
  const colonyBenchmark = useMemo(() => {
    // Standard builder kothi rate in this colony
    const stdTier = estimate.allTiersComparison['standard'];
    const minRate = stdTier.minRate;
    const maxRate = stdTier.maxRate;
    const avgRate = Math.round((minRate + maxRate) / 2);

    // Grey structure (civil + masonry + steel + cement + bricks = 52%)
    const greyMinRate = Math.round(minRate * 0.52);
    const greyMaxRate = Math.round(maxRate * 0.52);

    // Standard popular plot configurations in this colony
    const plotBenchmarks = [
      { gaj: 100, sqft: 900, label: '100 Gaj (Small Plot)', floors: 'G+1 Duplex' },
      { gaj: 150, sqft: 1350, label: '150 Gaj (Standard)', floors: 'G+1 Kothi' },
      { gaj: 200, sqft: 1800, label: '200 Gaj (Most Popular)', floors: 'G+1 / G+2 Kothi' },
      { gaj: 250, sqft: 2250, label: '250 Gaj (Luxury Plot)', floors: 'G+2 Kothi' },
      { gaj: 500, sqft: 4500, label: '500 Gaj (1 Kanal)', floors: 'Luxury Villa' }
    ].map(p => {
      const minTotal = Math.round(p.sqft * minRate);
      const maxTotal = Math.round(p.sqft * maxRate);
      return {
        ...p,
        minTotal,
        maxTotal,
        formattedTotal: formatINRRange(minTotal, maxTotal)
      };
    });

    return {
      minRate,
      maxRate,
      avgRate,
      formattedRate: stdTier.formattedRateRange,
      greyStructureRate: `₹${greyMinRate.toLocaleString('en-IN')}–₹${greyMaxRate.toLocaleString('en-IN')} / sq ft`,
      deliveryTime: '7 to 10 Months (Turnkey Ready)',
      plotBenchmarks,
      labourWage: '₹800–₹950 / day skilled mason',
      bylawsAuthority: activeStateData.primaryAuthorities.join(', ') || 'Local Municipal Town Planning'
    };
  }, [estimate, activeStateData]);

  const handleStateChange = (newState: string) => {
    setState(newState);
    const stData = INDIA_STATES_DATA.find(s => s.name.toLowerCase() === newState.toLowerCase());
    const firstDistrict = stData?.districts[0] || 'Main District';
    setCity(firstDistrict);

    const colonyMatch = COLONY_RATES_DATABASE.find(r => r.state.toLowerCase() === newState.toLowerCase());
    if (colonyMatch) {
      setColonyOrSector(colonyMatch.colonyOrSector || 'General Sector Zone');
    } else {
      setColonyOrSector(`Central ${firstDistrict} Zone`);
    }
  };

  const handleSelectSearchResult = (item: SearchItem) => {
    // Check if state matches any state in our database
    const matchedState = INDIA_STATES_DATA.find(s =>
      s.name.toLowerCase().includes(item.state.toLowerCase()) ||
      item.state.toLowerCase().includes(s.name.toLowerCase())
    );

    if (matchedState) {
      setState(matchedState.name);
      const matchedDistrict = matchedState.districts.find(d =>
        d.toLowerCase().includes(item.city.toLowerCase()) ||
        item.city.toLowerCase().includes(d.toLowerCase())
      );
      setCity(matchedDistrict || item.city || matchedState.districts[0]);
    } else {
      setState(item.state);
      setCity(item.city);
    }

    setColonyOrSector(item.colony || item.name);
    setColonySearchQuery(`${item.name}, ${item.city}`);
    setIsSearchOpen(false);
    setLocationStatus(`📍 Selected ${item.name} (${item.city}, ${item.state})`);
    setTimeout(() => setLocationStatus(null), 5000);
  };

  const handleDetectLocation = async () => {
    setIsDetectingLocation(true);
    setLocationStatus('Detecting high-precision location across India...');

    const applyDetectedLocation = (stateFound: string, cityFound: string, colonyFound: string) => {
      const cleanState = (stateFound || '').toLowerCase();
      const matchedState = INDIA_STATES_DATA.find(s =>
        s.name.toLowerCase().includes(cleanState) ||
        cleanState.includes(s.name.toLowerCase())
      ) || INDIA_STATES_DATA[0];

      setState(matchedState.name);
      const cleanCity = (cityFound || '').toLowerCase();
      const matchedDistrict = matchedState.districts.find(d =>
        d.toLowerCase().includes(cleanCity) ||
        cleanCity.includes(d.toLowerCase())
      ) || cityFound || matchedState.districts[0];

      setCity(matchedDistrict);
      const finalColony = colonyFound || `Central ${matchedDistrict} Zone`;
      setColonyOrSector(finalColony);
      setColonySearchQuery(`${finalColony}, ${matchedDistrict}`);
      setLocationStatus(`📍 Auto-Detected: ${finalColony}, ${matchedDistrict} (${matchedState.name})`);
    };

    try {
      const unified = await locationService.getUnifiedCurrentLocation();
      applyDetectedLocation(unified.state, unified.district || unified.city, unified.locality || unified.city);
    } catch (err) {
      console.warn('Location detection failed in estimator:', err);
      setLocationStatus('📍 Could not detect location. Please select manually.');
    } finally {
      setIsDetectingLocation(false);
      setTimeout(() => setLocationStatus(null), 5000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="cce-container">
      
      {/* ─── 1. ESTIMATOR TOP HEADER ─── */}
      <div className="cce-header">
        <div className="cce-header-top">
          <div className="cce-header-left">
            <div className="cce-icon-badge">
              <Building2 size={26} />
            </div>
            <div>
              <div className="cce-badge-row">
                <span className="cce-pill-badge">
                  <Sparkles size={12} /> All-India Pan-State Engine 2026
                </span>
                <span className="cce-subtitle">
                  28 States • 8 UTs • 700+ Districts &amp; Colony Rates
                </span>
              </div>
              <h2 className="cce-main-title">
                {language === 'pa'
                  ? 'ਮਕਾਨ ਉਸਾਰੀ ਖਰਚਾ ਤੇ ਕਲੋਨੀ ਰੇਟ ਅੰਦਾਜ਼ਾ'
                  : language === 'hi'
                  ? 'मकान निर्माण व कॉलोनी अनुसार लागत कैलकुलेटर'
                  : 'All-India House Construction & Colony Rate Calculator'}
              </h2>
            </div>
          </div>

          <div>
            <button
              onClick={handlePrint}
              className="cce-print-btn"
              title="Print Estimate Summary"
            >
              <Printer size={15} /> Print Summary
            </button>
          </div>
        </div>

        {/* ─── 2. INSTANT SEARCH & AUTO-DETECT COLONY BAR (ALL OVER INDIA) ─── */}
        <div className="cce-search-card">
          <div className="cce-search-header">
            <div className="cce-search-label">
              <MapPin size={16} style={{ color: '#2563eb' }} />
              <span>Search Any Colony, Sector, Village, or City in India:</span>
            </div>
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isDetectingLocation}
              className="cce-detect-btn"
              title="Auto-detect current GPS location"
            >
              <Crosshair size={14} className={isDetectingLocation ? 'animate-spin' : ''} />
              <span>{isDetectingLocation ? 'Locating...' : 'Auto-Detect My Location'}</span>
            </button>
          </div>

          <div className="cce-search-input-wrap" ref={searchRef}>
            {isSearchingOnline ? (
              <Loader2 size={18} className="cce-search-icon animate-spin" style={{ color: '#2563eb' }} />
            ) : (
              <Search size={18} className="cce-search-icon" />
            )}
            <input
              type="text"
              placeholder="Type any colony/sector across India (e.g. Indiranagar Bengaluru, DLF Phase 5 Gurgaon, Gomti Nagar Lucknow, Bandra West, Sector 82 Mohali)..."
              value={colonySearchQuery}
              onChange={e => {
                setColonySearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="cce-search-input"
            />

            {/* Dropdown Suggestions */}
            {isSearchOpen && (
              <div className="cce-search-dropdown">
                {combinedSearchResults.length > 0 ? (
                  combinedSearchResults.map(item => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectSearchResult(item)}
                      className="cce-search-item"
                    >
                      <div>
                        <div className="cce-search-item-colony">
                          {item.name}
                        </div>
                        <div className="cce-search-item-city">
                          {item.subTitle}
                        </div>
                      </div>
                      {item.ratePreview ? (
                        <div className="cce-search-item-rate">
                          {item.ratePreview}
                        </div>
                      ) : (
                        <div className="cce-search-item-rate" style={{ background: '#f1f5f9', color: '#475569' }}>
                          Live Map Match
                        </div>
                      )}
                    </div>
                  ))
                ) : colonySearchQuery.trim().length >= 3 ? (
                  <div style={{ padding: '12px 14px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                    {isSearchingOnline ? 'Searching across India map...' : 'No exact match found. You can select your state & district below or enter a custom colony name.'}
                  </div>
                ) : (
                  <div style={{ padding: '8px 12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Popular Colonies Across India
                    </div>
                    {COLONY_RATES_DATABASE.slice(0, 6).map(item => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectSearchResult({
                          id: item.id,
                          name: item.colonyOrSector || item.locality || 'Prime Locality',
                          subTitle: `${item.districtOrCity}, ${item.state}`,
                          state: item.state,
                          city: item.districtOrCity,
                          colony: item.colonyOrSector || item.locality || 'General Zone'
                        })}
                        className="cce-search-item"
                      >
                        <div>
                          <div className="cce-search-item-colony">
                            {item.colonyOrSector}
                          </div>
                          <div className="cce-search-item-city">
                            {item.districtOrCity}, {item.state}
                          </div>
                        </div>
                        <div className="cce-search-item-rate">
                          ₹{item.tiers.standard.minRatePerSqFt}–₹{item.tiers.standard.maxRatePerSqFt}/sqft
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {locationStatus && (
            <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#047857', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>{locationStatus}</span>
            </div>
          )}
        </div>

        {/* ─── 3. STATE, DISTRICT & COLONY SELECTION (ALL 36 STATES & UTs) ─── */}
        <div className="cce-location-bar">
          {/* State / UT */}
          <div className="cce-loc-field">
            <label>State / UT (All India)</label>
            <select
              value={state}
              onChange={e => handleStateChange(e.target.value)}
              className="cce-loc-select"
            >
              {INDIA_STATES_DATA.map(st => (
                <option key={st.code} value={st.name}>
                  {st.name} ({st.type})
                </option>
              ))}
            </select>
          </div>

          {/* City / District */}
          <div className="cce-loc-field">
            <label>City / District ({availableDistricts.length} Districts)</label>
            <select
              value={city}
              onChange={e => {
                setCity(e.target.value);
                const colMatch = availableColonies.find(c => c.districtOrCity === e.target.value);
                if (colMatch) {
                  setColonyOrSector(colMatch.colonyOrSector || 'General City Zone');
                } else {
                  setColonyOrSector(`General ${e.target.value} Zone`);
                }
              }}
              className="cce-loc-select"
            >
              {availableDistricts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Colony / Sector / Custom Input */}
          <div className="cce-loc-field">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label>Colony / Locality / Sector</label>
              <button
                type="button"
                onClick={() => setIsCustomColony(!isCustomColony)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <Edit3 size={11} /> {isCustomColony ? 'Select Preset' : 'Type Custom'}
              </button>
            </div>

            {isCustomColony ? (
              <input
                type="text"
                placeholder="Enter colony or sector name..."
                value={colonyOrSector}
                onChange={e => setColonyOrSector(e.target.value)}
                className="cce-loc-select"
                style={{ cursor: 'text' }}
              />
            ) : (
              <select
                value={colonyOrSector}
                onChange={e => {
                  if (e.target.value === '__custom__') {
                    setIsCustomColony(true);
                  } else {
                    setColonyOrSector(e.target.value);
                  }
                }}
                className="cce-loc-select"
              >
                {availableColonies.map(c => (
                  <option key={c.id} value={c.colonyOrSector || c.locality || 'General'}>
                    {c.colonyOrSector || c.locality}
                  </option>
                ))}
                <option value={`General ${city} Zone`}>General {city} Zone</option>
                <option value="__custom__">➕ Type Custom Colony Name...</option>
              </select>
            )}
          </div>
        </div>

        {/* Rate Hierarchy Transparency Indicator */}
        <div className="cce-status-row">
          <div className="cce-status-left">
            <span className="cce-verified-badge">
              <ShieldCheck size={14} /> {estimate.resolvedLevel} Level Rate ({estimate.locationLabel})
            </span>
            <span className="cce-status-text">Confidence: <strong>{estimate.confidence}</strong></span>
            <span className="cce-status-text">&bull; Last Updated: <strong>{estimate.lastUpdated}</strong></span>
          </div>
          <span className="cce-methodology-citation">
            Source: {estimate.sourceMethodology}
          </span>
        </div>

      </div>

      {/* ─── 4. USER INPUT CONTROLS SECTION ─── */}
      <div className="cce-controls-section">
        <div className="cce-controls-grid">
          
          {/* Plot Size */}
          <div className="cce-ctrl-card">
            <div className="cce-ctrl-label-row">
              <label className="cce-ctrl-label">
                1. Plot Size &amp; Unit
              </label>
            </div>
            <div className="cce-input-group">
              <input
                type="number"
                min="10"
                value={plotAreaValue}
                onChange={e => setPlotAreaValue(parseFloat(e.target.value) || 0)}
                className="cce-num-input"
              />
              <select
                value={plotAreaUnit}
                onChange={e => setPlotAreaUnit(e.target.value as any)}
                className="cce-select-unit"
              >
                <option value="sqyd">Gaj (Sq.Yards)</option>
                <option value="sqft">Sq. Feet</option>
                <option value="marla">Marla</option>
                <option value="kanal">Kanal</option>
                <option value="bigha">Bigha</option>
                <option value="acre">Acre</option>
              </select>
            </div>
            <div className="cce-hint-text">
              ≈ {estimate.plotAreaSqFt.toLocaleString()} sq.ft plot footprint
            </div>
          </div>

          {/* Built-Up Area (Primary Cost Driver) */}
          <div className="cce-ctrl-card">
            <div className="cce-ctrl-label-row">
              <label className="cce-ctrl-label">
                2. Built-Up Area (Slab)
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsManualBuiltUp(!isManualBuiltUp);
                  if (!isManualBuiltUp) setManualBuiltUpSqFt(computedBuiltUpSqFt);
                }}
                className="cce-toggle-btn"
              >
                {isManualBuiltUp ? 'Auto 70%' : 'Custom Area'}
              </button>
            </div>

            {isManualBuiltUp ? (
              <div className="cce-input-group">
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={manualBuiltUpSqFt}
                  onChange={e => setManualBuiltUpSqFt(parseFloat(e.target.value) || 0)}
                  className="cce-num-input"
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-text-muted)' }}>sq.ft</span>
              </div>
            ) : (
              <div className="cce-stat-display">
                <span className="cce-stat-val">
                  {computedBuiltUpSqFt.toLocaleString()} sq.ft
                </span>
                <span className="cce-stat-badge">
                  70% coverage
                </span>
              </div>
            )}
            <div className="cce-hint-text">
              Total slab &amp; floor construction area
            </div>
          </div>

          {/* Number of Floors */}
          <div className="cce-ctrl-card">
            <div className="cce-ctrl-label-row">
              <label className="cce-ctrl-label">
                3. Proposed Storeys
              </label>
            </div>
            <div className="cce-button-group">
              {[
                { val: 1, label: 'G (1)' },
                { val: 2, label: 'G+1 (2)' },
                { val: 3, label: 'G+2 (3)' },
                { val: 4, label: 'Stilt+4' }
              ].map(f => (
                <button
                  key={f.val}
                  type="button"
                  onClick={() => setFloorsCount(f.val)}
                  className={`cce-btn-choice ${floorsCount === f.val ? 'active' : ''}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="cce-hint-text">
              Ground + Upper floor levels
            </div>
          </div>

          {/* Basement Option */}
          <div className="cce-ctrl-card">
            <div className="cce-ctrl-label-row">
              <label className="cce-ctrl-label">
                4. Basement
              </label>
            </div>
            <div className="cce-button-group tri">
              {[
                { val: 'none', label: 'None' },
                { val: 'partial', label: 'Half' },
                { val: 'full', label: 'Full' }
              ].map(b => (
                <button
                  key={b.val}
                  type="button"
                  onClick={() => setHasBasement(b.val as any)}
                  className={`cce-btn-choice ${hasBasement === b.val ? 'active-indigo' : ''}`}
                >
                  {b.label}
                </button>
              ))}
            </div>
            <div className="cce-hint-text">
              {hasBasement !== 'none' ? '+18% RCC waterproofing' : 'Standard ground footing'}
            </div>
          </div>

        </div>
      </div>

      {/* ─── 5. PRIMARY 4 QUALITY TIERS COMPARISON ─── */}
      <div className="cce-body-section">
        <div className="cce-sec-header">
          <div>
            <h3 className="cce-sec-title">
              Select Construction Quality Tier (Your Customized Build)
            </h3>
            <p className="cce-sec-subtitle">
              Calculated for <strong>{estimate.builtUpAreaSqFt.toLocaleString()} sq.ft</strong> in <strong>{estimate.locationLabel}</strong>
            </p>
          </div>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Click card to inspect</span>
        </div>

        <div className="cce-tiers-grid">
          {(['basic', 'standard', 'premium', 'luxury'] as ConstructionQualityTier[]).map(tierKey => {
            const t = estimate.allTiersComparison[tierKey];
            const isSelected = qualityTier === tierKey;

            return (
              <div
                key={tierKey}
                onClick={() => setQualityTier(tierKey)}
                className={`cce-tier-card ${isSelected ? 'selected' : ''}`}
              >
                <div>
                  <div className="cce-tier-top-row">
                    <span
                      className="cce-tier-badge"
                      style={{ background: t.badgeColor }}
                    >
                      {t.name}
                    </span>
                    {isSelected && (
                      <span className="cce-selected-tag">
                        <CheckCircle2 size={15} /> Selected
                      </span>
                    )}
                  </div>

                  <div className="cce-tier-price">
                    {t.formattedRange}
                  </div>
                  <div className="cce-tier-rate">
                    {t.formattedRateRange}
                  </div>

                  <p className="cce-tier-desc">
                    {t.description}
                  </p>
                </div>

                <div className="cce-tier-benchmark">
                  {tierKey === 'basic' && '₹20–30L national baseline'}
                  {tierKey === 'standard' && '₹35–50L national baseline'}
                  {tierKey === 'premium' && '₹60–90L national baseline'}
                  {tierKey === 'luxury' && '₹1 Cr+ national baseline'}
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── 6. PRIMARY SELECTED RESULT HERO CARD ─── */}
        <div className="cce-hero-card">
          <div className="cce-hero-top">
            <div>
              <div className="cce-hero-loc-pill">
                <MapPin size={15} />
                <span>
                  {estimate.locationLabel} &bull; Plot: {plotAreaValue} {plotAreaUnit} ({estimate.plotAreaSqFt} sq.ft) &bull; Built-Up: {estimate.builtUpAreaSqFt} sq.ft &bull; {floorsCount} Floors
                </span>
              </div>
              <div className="cce-hero-label">
                Estimated Total Construction Budget ({estimate.allTiersComparison[qualityTier].name} Tier)
              </div>
              <div className="cce-hero-amount">
                {estimate.allTiersComparison[qualityTier].formattedRange}
              </div>
            </div>

            <div className="cce-hero-rate-box">
              <div className="cce-hero-rate-label">
                {colonyOrSector} Rate
              </div>
              <div className="cce-hero-rate-val">
                {estimate.allTiersComparison[qualityTier].formattedRateRange}
              </div>
              <div className="cce-hero-rate-foot">
                Adjusted for {estimate.resolvedLevel} Index
              </div>
            </div>
          </div>

          {/* Key Specifications Pill List */}
          <div className="cce-specs-wrap">
            <div className="cce-specs-title">
              Included Specifications for {estimate.allTiersComparison[qualityTier].name} Tier:
            </div>
            <div className="cce-specs-grid">
              {estimate.allTiersComparison[qualityTier].specs.map((spec, i) => (
                <div key={i} className="cce-spec-pill">
                  <CheckCircle2 size={14} style={{ color: '#34d399', flexShrink: 0 }} />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── 7. PREVAILING COLONY CONSTRUCTION BENCHMARK & ONGOING BUILDER RATES ─── */}
        <div className="cce-colony-benchmark-card">
          <div className="cce-benchmark-header">
            <div className="cce-benchmark-title-wrap">
              <div className="cce-benchmark-icon-badge">
                <HardHat size={24} />
              </div>
              <div>
                <h3 className="cce-benchmark-title">
                  Prevailing Colony Market Benchmark — {colonyOrSector}
                </h3>
                <p className="cce-benchmark-sub">
                  Current turnkey contractor rates at which houses &amp; kothis are actively constructed in {colonyOrSector}, {city}
                </p>
              </div>
            </div>
            <span className="cce-benchmark-badge">
              <TrendingUp size={13} /> Active Colony Pulse
            </span>
          </div>

          {/* 3 Key Benchmark Metric Cards */}
          <div className="cce-benchmark-metrics-grid">
            <div className="cce-benchmark-metric-item highlight">
              <div className="cce-benchmark-metric-label">
                Active Builder Rate in {colonyOrSector}
              </div>
              <div className="cce-benchmark-metric-val" style={{ color: '#2563eb' }}>
                {colonyBenchmark.formattedRate}
              </div>
              <div className="cce-benchmark-metric-sub">
                Turnkey with Material (Standard / Popular Kothi Tier)
              </div>
            </div>

            <div className="cce-benchmark-metric-item">
              <div className="cce-benchmark-metric-label">
                Grey Structure Only Rate
              </div>
              <div className="cce-benchmark-metric-val" style={{ color: '#0f766e' }}>
                {colonyBenchmark.greyStructureRate}
              </div>
              <div className="cce-benchmark-metric-sub" style={{ color: '#0f766e' }}>
                RCC + Brickwork + Plaster (52% of total build)
              </div>
            </div>

            <div className="cce-benchmark-metric-item">
              <div className="cce-benchmark-metric-label">
                Average Turnkey Timeline
              </div>
              <div className="cce-benchmark-metric-val" style={{ color: '#b45309' }}>
                <Clock size={18} style={{ display: 'inline', marginRight: '6px' }} />
                {colonyBenchmark.deliveryTime}
              </div>
              <div className="cce-benchmark-metric-sub" style={{ color: '#b45309' }}>
                Excavation to Move-in Handover
              </div>
            </div>
          </div>

          {/* Standard Plot Sizes Ready House Delivery Cost in this Colony */}
          <div className="cce-plot-benchmark-wrap">
            <div className="cce-plot-benchmark-title">
              <Hammer size={15} style={{ color: '#2563eb' }} />
              <span>Turnkey Move-in Ready House Cost in {colonyOrSector} (Standard Plot Sizes):</span>
            </div>

            <div className="cce-plot-sizes-grid">
              {colonyBenchmark.plotBenchmarks.map(p => (
                <div key={p.gaj} className="cce-plot-size-card">
                  <div className="cce-plot-size-label">{p.label}</div>
                  <div className="cce-plot-size-dim">
                    {p.sqft.toLocaleString()} sq.ft slab • {p.floors}
                  </div>
                  <div className="cce-plot-size-price">{p.formattedTotal}</div>
                  <div className="cce-plot-size-status">Turnkey Ready</div>
                </div>
              ))}

              {/* Active User Plot */}
              <div className="cce-plot-size-card active-card">
                <div className="cce-plot-size-label">Your Plot: {plotAreaValue} {plotAreaUnit}</div>
                <div className="cce-plot-size-dim">
                  {estimate.builtUpAreaSqFt.toLocaleString()} sq.ft slab • {floorsCount} Floors
                </div>
                <div className="cce-plot-size-price" style={{ color: '#059669' }}>
                  {estimate.allTiersComparison['standard'].formattedRange}
                </div>
                <div className="cce-plot-size-status">Your Configured Budget</div>
              </div>
            </div>
          </div>

          {/* Colony Factors Chips */}
          <div className="cce-colony-factors-row">
            <div className="cce-factor-chip">
              <strong>Labour Wage:</strong> {colonyBenchmark.labourWage}
            </div>
            <div className="cce-factor-chip">
              <strong>Material Logistics:</strong> Direct Mandi Transit (Standard)
            </div>
            <div className="cce-factor-chip">
              <strong>Bylaws Authority:</strong> {colonyBenchmark.bylawsAuthority}
            </div>
          </div>
        </div>

        {/* ─── 8. 15-ITEM DETAILED TRADE COST BREAKDOWN ─── */}
        {!compactMode && (
          <div className="cce-breakdown-card">
            <div className="cce-sec-header">
              <div>
                <h4 className="cce-sec-title">
                  Detailed Trade-Wise Cost Breakdown (15 Categories)
                </h4>
                <p className="cce-sec-subtitle">
                  Approximate material &amp; labour allocation based on prevailing CPWD schedules.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFullBreakdown(!showFullBreakdown)}
                className="cce-toggle-btn"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
              >
                {showFullBreakdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {showFullBreakdown ? 'Collapse Table' : 'Expand Table'}
              </button>
            </div>

            {/* Visual Multi-Color Stacked Bar */}
            <div className="cce-breakdown-bar">
              {estimate.breakdown.map((item, idx) => {
                const colors = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#84cc16'];
                return (
                  <div
                    key={item.id}
                    style={{ width: `${item.percentage}%`, background: colors[idx % colors.length] }}
                    title={`${item.category}: ${item.percentage}%`}
                  />
                );
              })}
            </div>

            {/* Expandable Breakdown Table */}
            {showFullBreakdown && (
              <div className="cce-table-wrap">
                <table className="cce-table">
                  <thead>
                    <tr>
                      <th>Trade / Work Category</th>
                      <th>Material &amp; Scope Details</th>
                      <th style={{ textAlign: 'right' }}>Share (%)</th>
                      <th style={{ textAlign: 'right' }}>Estimated Cost Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estimate.breakdown.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div className="cce-trade-name">{item.category}</div>
                          <div className="cce-trade-sub">{item.subTitle}</div>
                        </td>
                        <td className="cce-material-spec" style={{ maxWidth: '320px' }}>
                          {item.materialDetails}
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 900, color: 'var(--color-text)' }}>
                          {item.percentage}%
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 800, color: '#2563eb' }}>
                          {formatINRRange(item.minAmount, item.maxAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="cce-table-foot">
                      <td colSpan={2} style={{ textTransform: 'uppercase' }}>Total Estimated Construction Cost</td>
                      <td style={{ textAlign: 'right' }}>100%</td>
                      <td style={{ textAlign: 'right', fontSize: '14px', color: '#1d4ed8' }}>
                        {estimate.allTiersComparison[qualityTier].formattedRange}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ─── 9. OPTIONAL CUSTOM FINISHING PREFERENCES ─── */}
        <div className="cce-prefs-box">
          <button
            type="button"
            onClick={() => setShowPreferences(!showPreferences)}
            className="cce-prefs-toggle"
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={16} style={{ color: '#2563eb' }} />
              Optional Material &amp; Add-on Preferences
            </span>
            {showPreferences ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showPreferences && (
            <div className="cce-prefs-grid">
              <label className="cce-pref-card">
                <input
                  type="checkbox"
                  checked={smartHome}
                  onChange={e => setSmartHome(e.target.checked)}
                  style={{ accentColor: '#2563eb', marginTop: '3px', cursor: 'pointer' }}
                />
                <div>
                  <div className="cce-pref-title">Smart Home Automation (+4%)</div>
                  <div className="cce-pref-sub">KNX/Lutron lighting &amp; digital locks</div>
                </div>
              </label>

              <label className="cce-pref-card">
                <input
                  type="checkbox"
                  checked={solarPanels}
                  onChange={e => setSolarPanels(e.target.checked)}
                  style={{ accentColor: '#2563eb', marginTop: '3px', cursor: 'pointer' }}
                />
                <div>
                  <div className="cce-pref-title">Rooftop Solar Plant (+3%)</div>
                  <div className="cce-pref-sub">5kW on-grid solar with net metering</div>
                </div>
              </label>

              <label className="cce-pref-card">
                <input
                  type="checkbox"
                  checked={elevationCladding}
                  onChange={e => setElevationCladding(e.target.checked)}
                  style={{ accentColor: '#2563eb', marginTop: '3px', cursor: 'pointer' }}
                />
                <div>
                  <div className="cce-pref-title">Designer HPL Facade (+3%)</div>
                  <div className="cce-pref-sub">Fundermax wood panels &amp; double-height glass</div>
                </div>
              </label>
            </div>
          )}
        </div>

        {/* ─── 10. TRANSPARENCY & STATUTORY DISCLAIMER ─── */}
        <div className="cce-notice-card">
          <Info size={18} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
          <p style={{ margin: 0, fontWeight: 500 }}>
            <strong>Transparent Data Notice:</strong> {estimate.disclaimer} Rate Level: <strong>{estimate.resolvedLevel}</strong> &bull; Methodology: <strong>{estimate.sourceMethodology}</strong>.
          </p>
        </div>

      </div>

    </div>
  );
}
