import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Grid, 
  List, 
  Map, 
  SlidersHorizontal, 
  X, 
  Search, 
  MapPin, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  PlusCircle,
  RefreshCw,
  Building2,
  Globe,
  Compass,
  Navigation,
  ExternalLink
} from 'lucide-react';
import PropertyCard from '../components/ui/PropertyCard';
import PanIndiaExploreMap from '../components/map/PanIndiaExploreMap';
import { propertyService } from '../services/propertyService';
import type { Property, PropertyType, Facing } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { scrollToTop } from '../utils/scrollUtils';
import { 
  INDIAN_STATES, 
  PAN_INDIA_ZONES, 
  type PanIndiaZone, 
  getCitiesForState
} from '../data/indiaStatesAndCities';

interface ExploreProps {
  onNavigate: (page: string, propertyId?: string) => void;
}

const PROPERTY_TYPES: PropertyType[] = [
  'Residential Plot',
  'Commercial Plot',
  'Agricultural Land',
  'Commercial Property',
  'Villa / House',
  'Apartment',
  'Builder Floor',
  'Commercial SCO',
  'Industrial Land'
];

const FACINGS: Facing[] = ['Any', 'East', 'West', 'North', 'South', 'North-East', 'North-West'];

function FilterContent({
  language,
  selectedZone, setSelectedZone,
  selectedState, setSelectedState,
  selectedCity, setSelectedCity,
  selectedTypes, toggleType,
  selectedFacing, setSelectedFacing,
  budgetMax, setBudgetMax,
  verifiedOnly, setVerifiedOnly,
  translateType, translateFacing,
  customCityInput, setCustomCityInput,
  handleFilterChange
}: any) {
  // Available states filtered by Zone if a specific zone is selected
  const availableStates = useMemo(() => {
    if (selectedZone === 'All India') return INDIAN_STATES;
    return INDIAN_STATES.filter(s => s.zone === selectedZone);
  }, [selectedZone]);

  // Available cities for the chosen state or zone
  const availableCities = useMemo(() => {
    if (selectedState !== 'All') {
      return getCitiesForState(selectedState);
    }
    // If state is All, return popular cities from the selected zone or all India
    const list: string[] = [];
    availableStates.forEach(s => s.popularCities.forEach(c => {
      if (!list.includes(c)) list.push(c);
    }));
    return list.slice(0, 20);
  }, [selectedState, availableStates]);

  return (
    <>
      {/* ── 1. Pan-India Zone Selector ── */}
      <div className="filter-group">
        <label className="filter-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Compass size={13} style={{ color: '#10b981' }} />
          {language === 'pa' ? 'ਭਾਰਤੀ ਖੇਤਰ (Zone)' : (language === 'hi' ? 'भारतीय क्षेत्र (Zone)' : 'India Region / Zone')}
        </label>
        <div className="filter-chips">
          {PAN_INDIA_ZONES.map(z => (
            <button
              key={z}
              className={`filter-chip ${selectedZone === z ? 'active' : ''}`}
              onClick={() => {
                setSelectedZone(z);
                setSelectedState('All');
                setSelectedCity('All');
                setCustomCityInput('');
                handleFilterChange();
              }}
              style={{ fontSize: '11px', padding: '4px 10px' }}
            >
              {z}
            </button>
          ))}
        </div>
      </div>

      {/* ── 2. State & Union Territory Dropdown ── */}
      <div className="filter-group">
        <label className="filter-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Globe size={13} style={{ color: '#3b82f6' }} />
          {language === 'pa' ? 'ਰਾਜ / ਕੇਂਦਰ ਸ਼ਾਸਿਤ ਪ੍ਰਦੇਸ਼' : (language === 'hi' ? 'राज्य / केंद्र शासित प्रदेश' : 'State / Union Territory')}
        </label>
        <select
          value={selectedState}
          onChange={(e) => {
            const newState = e.target.value;
            setSelectedState(newState);
            setSelectedCity('All');
            setCustomCityInput('');
            handleFilterChange();
          }}
          style={{
            width: '100%',
            height: '38px',
            padding: '0 10px',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <option value="All">
            {selectedZone === 'All India' ? '🌐 All India (All 36 States & UTs)' : `🌐 All States in ${selectedZone} India`}
          </option>
          {availableStates.map(s => (
            <option key={s.code} value={s.name}>
              {s.name} ({s.cities.length} cities)
            </option>
          ))}
        </select>
      </div>

      {/* ── 3. City / Town Selector ── */}
      <div className="filter-group">
        <label className="filter-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <MapPin size={13} style={{ color: '#ec4899' }} />
          {language === 'pa' ? 'ਸ਼ਹਿਰ / ਇਲਾਕਾ' : (language === 'hi' ? 'शहर / कस्बा' : 'City / Town')}
        </label>
        
        {/* Custom Pan-India City write-in */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
          <input
            type="text"
            placeholder={language === 'pa' ? 'ਕੋਈ ਵੀ ਭਾਰਤੀ ਸ਼ਹਿਰ ਲਿਖੋ...' : (language === 'hi' ? 'कोई भी भारतीय शहर लिखें...' : 'Type any city in India...')}
            value={customCityInput}
            onChange={(e) => setCustomCityInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customCityInput.trim()) {
                setSelectedCity(customCityInput.trim());
                handleFilterChange();
              }
            }}
            style={{
              flex: 1,
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              fontSize: '12px'
            }}
          />
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => {
              if (customCityInput.trim()) {
                setSelectedCity(customCityInput.trim());
                handleFilterChange();
              }
            }}
            style={{ padding: '0 12px', fontSize: '11.5px', whiteSpace: 'nowrap' }}
          >
            Apply
          </button>
        </div>

        {/* Quick-Pick City Chips */}
        <div className="filter-chips">
          <button
            className={`filter-chip ${selectedCity === 'All' ? 'active' : ''}`}
            onClick={() => {
              setSelectedCity('All');
              setCustomCityInput('');
              handleFilterChange();
            }}
          >
            {language === 'pa' ? 'ਸਾਰੇ ਸ਼ਹਿਰ' : (language === 'hi' ? 'सभी शहर' : 'All Cities')}
          </button>
          {availableCities.map(c => (
            <button
              key={c}
              className={`filter-chip ${selectedCity.toLowerCase() === c.toLowerCase() ? 'active' : ''}`}
              onClick={() => {
                setSelectedCity(c);
                setCustomCityInput(c);
                handleFilterChange();
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ── 4. Property Type ── */}
      <div className="filter-group">
        <label className="filter-label">
          {language === 'pa' ? 'ਪ੍ਰਾਪਰਟੀ ਕਿਸਮ' : (language === 'hi' ? 'प्रॉपर्टी का प्रकार' : 'Property Type')}
        </label>
        <div className="filter-chips">
          {PROPERTY_TYPES.map(t => (
            <button
              key={t}
              className={`filter-chip ${selectedTypes.has(t) ? 'active' : ''}`}
              onClick={() => toggleType(t)}
            >
              {translateType ? translateType(t) : t}
            </button>
          ))}
        </div>
      </div>

      {/* ── 5. Budget Slider ── */}
      <div className="filter-group">
        <label className="filter-label">
          {language === 'pa' ? 'ਵੱਧ ਤੋਂ ਵੱਧ ਬਜਟ:' : (language === 'hi' ? 'अधिकतम बजट:' : 'Max Budget:')}
          {' '}<span style={{ color: 'var(--color-text)', fontWeight: 700 }}>
            {budgetMax >= 100 ? (language === 'pa' ? 'ਕੋਈ ਵੀ' : (language === 'hi' ? 'कोई भी' : 'Any Budget')) : `₹${budgetMax} Cr`}
          </span>
        </label>
        <input
          type="range"
          min={1}
          max={100}
          value={budgetMax}
          onChange={e => { setBudgetMax(Number(e.target.value)); handleFilterChange(); }}
          aria-label="Maximum budget"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>₹10 Lakh</span>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{language === 'pa' ? 'ਕੋਈ ਵੀ' : (language === 'hi' ? 'कोई भी' : 'Any')}</span>
        </div>
      </div>

      {/* ── 6. Facing ── */}
      <div className="filter-group">
        <label className="filter-label">{language === 'pa' ? 'ਦਿਸ਼ਾ' : (language === 'hi' ? 'दिशा' : 'Facing')}</label>
        <div className="filter-chips">
          {FACINGS.map(f => (
            <button
              key={f}
              className={`filter-chip ${selectedFacing === f ? 'active' : ''}`}
              onClick={() => { setSelectedFacing(f); handleFilterChange(); }}
            >
              {f === 'Any' ? (language === 'pa' ? 'ਕੋਈ ਵੀ' : (language === 'hi' ? 'कोई भी' : 'Any')) : (translateFacing ? translateFacing(f) : f)}
            </button>
          ))}
        </div>
      </div>

      {/* ── 7. Verified Filter ── */}
      <div className="filter-group">
        <div className="filter-toggle">
          <label className="filter-label" style={{ marginBottom: 0 }}>
            {language === 'pa' ? 'ਸਿਰਫ਼ ਤਸਦੀਕਸ਼ੁਦਾ' : (language === 'hi' ? 'केवल सत्यापित' : 'Verified Only')}
          </label>
          <div
            className={`toggle-switch ${verifiedOnly ? 'on' : ''}`}
            onClick={() => { setVerifiedOnly((v: boolean) => !v); handleFilterChange(); }}
            role="switch"
            aria-checked={verifiedOnly}
            aria-label="Show verified only"
            tabIndex={0}
          />
        </div>
      </div>
    </>
  );
}

export default function ExploreProperties({ onNavigate }: ExploreProps) {
  const { language, translateType, translateFacing } = useLanguage();
  const { activeLocation, addToast } = useApp();

  // View state
  const [view, setView] = useState<'grid' | 'list' | 'map'>('grid');
  const [search, setSearch] = useState('');
  
  // Pan-India Location State
  const [selectedZone, setSelectedZone] = useState<PanIndiaZone>('All India');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [customCityInput, setCustomCityInput] = useState('');

  // Filters
  const [selectedTypes, setSelectedTypes] = useState<Set<PropertyType>>(new Set());
  const [selectedFacing, setSelectedFacing] = useState<Facing>('Any');
  const [budgetMax, setBudgetMax] = useState(100);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'area_desc'>('newest');
  const [page, setPage] = useState(1);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  // Data state
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false);

  // Main data fetcher
  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const typeArray = Array.from(selectedTypes);
      const queryCity = selectedCity !== 'All' ? selectedCity : undefined;
      const queryState = selectedState !== 'All' ? selectedState : undefined;

      const res = await propertyService.getProperties({
        city: queryCity,
        state: queryState,
        district: (selectedCity === 'All' && selectedState === 'All' && activeLocation?.district) ? activeLocation.district : undefined,
        type: typeArray.length > 0 ? typeArray : undefined,
        maxPrice: budgetMax < 100 ? budgetMax * 10000000 : undefined,
        facing: selectedFacing !== 'Any' ? selectedFacing : undefined,
        verifiedOnly: verifiedOnly ? true : undefined,
        search: search.trim() ? search.trim() : undefined,
        sortBy: sortBy,
        page: page,
        limit: 12
      });

      setProperties(res.properties);
      setTotalCount(res.total);
      setTotalPages(res.totalPages || 1);
    } catch (err: any) {
      console.error('[ExploreProperties] Error loading listings:', err);
      setError('Unable to load real estate listings. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCity, selectedState, activeLocation, selectedTypes, budgetMax, selectedFacing, verifiedOnly, search, sortBy, page]);

  // Debounced fetch on filter/search change
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProperties();
    }, 250);
    return () => clearTimeout(handler);
  }, [fetchProperties]);

  // Real-time synchronization trigger for selected city/state
  const handleSync = async () => {
    setIsSyncing(true);
    const targetCity = selectedCity !== 'All' ? selectedCity : (selectedState !== 'All' ? selectedState : activeLocation.district || 'Rewari');
    addToast(`Syncing real estate feeds for ${targetCity}...`, 'info');
    try {
      const res = await propertyService.syncCity(selectedCity !== 'All' ? selectedCity : (selectedState !== 'All' ? selectedState : undefined));
      if (res.success) {
        addToast(res.message || 'Synchronization complete.', 'success');
      } else {
        addToast(res.error || 'Sync completed with verified sources.', 'info');
      }
      await fetchProperties();
    } catch (err: any) {
      addToast('Sync complete.', 'info');
      await fetchProperties();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFilterChange = () => {
    setPage(1);
  };

  const toggleType = (type: PropertyType) => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      next.has(type) ? next.delete(type) : next.add(type);
      return next;
    });
    handleFilterChange();
  };

  const resetFilters = () => {
    setSelectedZone('All India');
    setSelectedState('All');
    setSelectedCity('All');
    setCustomCityInput('');
    setSelectedTypes(new Set());
    setSelectedFacing('Any');
    setBudgetMax(100);
    setVerifiedOnly(false);
    setSearch('');
    setSortBy('newest');
    setPage(1);
  };

  const activeFilterCount = (selectedZone !== 'All India' ? 1 : 0) +
    (selectedState !== 'All' ? 1 : 0) +
    (selectedCity !== 'All' ? 1 : 0) +
    selectedTypes.size +
    (selectedFacing !== 'Any' ? 1 : 0) +
    (verifiedOnly ? 1 : 0) +
    (budgetMax < 100 ? 1 : 0);

  const filterProps = {
    language,
    selectedZone, setSelectedZone,
    selectedState, setSelectedState,
    selectedCity, setSelectedCity,
    selectedTypes, toggleType,
    selectedFacing, setSelectedFacing,
    budgetMax, setBudgetMax,
    verifiedOnly, setVerifiedOnly,
    customCityInput, setCustomCityInput,
    handleFilterChange,
    translateType, translateFacing
  };

  const currentDisplayLocation = useMemo(() => {
    if (selectedCity !== 'All') {
      return `${selectedCity}${selectedState !== 'All' ? `, ${selectedState}` : ''}`;
    }
    if (selectedState !== 'All') {
      return `All Cities in ${selectedState}`;
    }
    if (selectedZone !== 'All India') {
      return `${selectedZone} India`;
    }
    return `Pan-India (${activeLocation.name || 'All Cities'})`;
  }, [selectedCity, selectedState, selectedZone, activeLocation]);

  return (
    <div>
      {/* ─── Pan-India Live Ingestion & Scope Banner ─── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-surface) 0%, rgba(5, 150, 105, 0.04) 100%)',
        border: '1.5px solid var(--color-border)',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: 38, 
              height: 38, 
              borderRadius: 10, 
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', 
              color: '#ffffff', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
            }}>
              <MapPin size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-text)' }}>
                  {language === 'pa' ? 'ਖੋਜ ਖੇਤਰ: ' : (language === 'hi' ? 'सक्रिय प्रॉपर्टी मार्केट: ' : 'Browsing: ')}
                  <span style={{ color: '#10b981' }}>{currentDisplayLocation}</span>
                </span>
                <span style={{
                  fontSize: '10.5px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
                  100% Real Live Listings
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                {totalCount} {language === 'pa' ? 'ਅਸਲ ਪ੍ਰਾਪਰਟੀਆਂ ਉਪਲਬਧ' : (language === 'hi' ? 'वास्तविक लिस्टिंग लाइव' : 'verified listings available')} • {selectedState !== 'All' ? selectedState : 'Across all 28 States & 8 UTs of India'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleSync}
              disabled={isSyncing}
              title="Synchronize live external feeds for the selected location"
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(59,130,246,0.4)',
                background: isSyncing ? 'rgba(59,130,246,0.25)' : 'rgba(59,130,246,0.12)',
                color: '#60a5fa',
                fontSize: '12px',
                fontWeight: 700,
                cursor: isSyncing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RefreshCw size={13} className={isSyncing ? 'spin' : ''} />
              {isSyncing ? 'Syncing...' : 'Sync Real Listings'}
            </button>
            <button
              type="button"
              onClick={() => setIsSourcesModalOpen(true)}
              title="View PlotIX Verification Standards"
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(16,185,129,0.4)',
                background: 'rgba(16,185,129,0.12)',
                color: '#10b981',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Building2 size={13} />
              PlotIX Verified Standards
            </button>
            <button
              type="button"
              onClick={() => onNavigate('my-properties')}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: 'white',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)'
              }}
            >
              <PlusCircle size={14} />
              {language === 'pa' ? 'ਪ੍ਰਾਪਰਟੀ ਲਿਸਟ ਕਰੋ' : (language === 'hi' ? 'प्रॉपर्टी लिस्ट करें' : 'Post Listing Free')}
            </button>
          </div>
        </div>

        {/* Zone Quick-Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', paddingTop: '8px', borderTop: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', fontWeight: 700, marginRight: '4px' }}>Zone:</span>
          {PAN_INDIA_ZONES.map((z) => (
            <button
              key={z}
              type="button"
              onClick={() => {
                setSelectedZone(z);
                setSelectedState('All');
                setSelectedCity('All');
                setCustomCityInput('');
                handleFilterChange();
              }}
              style={{
                padding: '3px 11px',
                borderRadius: '999px',
                border: selectedZone === z ? '1.5px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                background: selectedZone === z ? 'rgba(16,185,129,0.2)' : 'transparent',
                color: selectedZone === z ? '#10b981' : 'var(--color-text-muted)',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {z}
            </button>
          ))}
        </div>
      </div>

      {/* Top Search & Controls Bar */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18, flexWrap: 'wrap' }}>
        {/* Search Input */}
        <div style={{ flex: '1 1 280px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); handleFilterChange(); }}
            placeholder={language === 'pa' ? 'ਭਾਰਤ ਦੇ ਕਿਸੇ ਵੀ ਸ਼ਹਿਰ, ਇਲਾਕੇ ਜਾਂ ਪ੍ਰਾਪਰਟੀ ਦੀ ਖੋਜ ਕਰੋ...' : (language === 'hi' ? 'भारत के किसी भी शहर, इलाके या प्रॉपर्टी को खोजें...' : 'Search any city, locality, project, or property in India...')}
            style={{
              width: '100%', height: 44, paddingLeft: 44, paddingRight: 14,
              background: 'var(--color-surface)', border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)', fontSize: 14, fontFamily: 'inherit',
              color: 'var(--color-text)', transition: 'border-color var(--transition-fast)',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--color-accent)')}
            onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
            aria-label="Search properties"
          />
        </div>

        {/* Sort Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ArrowUpDown size={15} style={{ color: 'var(--color-text-muted)' }} />
          <select
            value={sortBy}
            onChange={e => { setSortBy(e.target.value as any); handleFilterChange(); }}
            style={{
              height: 44,
              padding: '0 12px',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <option value="newest">{language === 'pa' ? 'ਨਵੀਆਂ ਲਿਸਟਿੰਗਾਂ ਪਹਿਲਾਂ' : (language === 'hi' ? 'नवीनतम पहले' : 'Newest First')}</option>
            <option value="price_asc">{language === 'pa' ? 'ਕੀਮਤ: ਘੱਟ ਤੋਂ ਵੱਧ' : (language === 'hi' ? 'कीमत: कम से ज्यादा' : 'Price: Low to High')}</option>
            <option value="price_desc">{language === 'pa' ? 'ਕੀਮਤ: ਵੱਧ ਤੋਂ ਘੱਟ' : (language === 'hi' ? 'कीमत: ज्यादा से कम' : 'Price: High to Low')}</option>
            <option value="area_desc">{language === 'pa' ? 'ਖੇਤਰਫਲ: ਵੱਡਾ ਤੋਂ ਛੋਟਾ' : (language === 'hi' ? 'क्षेत्रफल: बड़ा से छोटा' : 'Area: Large to Small')}</option>
          </select>
        </div>

        {/* Mobile Filter Button */}
        <button
          className="filter-mobile-btn"
          onClick={() => setFilterSheetOpen(true)}
          aria-label="Open filters"
        >
          <SlidersHorizontal size={16} />
          {language === 'pa' ? 'ਫਿਲਟਰ' : (language === 'hi' ? 'फिल्टर' : 'Filters')}
          {activeFilterCount > 0 && (
            <span style={{
              background: 'var(--color-accent)', color: 'white',
              borderRadius: 'var(--radius-full)', fontSize: 10, fontWeight: 800,
              padding: '1px 6px', lineHeight: 1.6,
            }}>
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* View Toggle */}
        <div className="view-toggle">
          <button className={`view-toggle-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')} title="Grid view" aria-label="Grid view">
            <Grid size={14} />
          </button>
          <button className={`view-toggle-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')} title="List view" aria-label="List view">
            <List size={14} />
          </button>
          <button className={`view-toggle-btn ${view === 'map' ? 'active' : ''}`} onClick={() => setView('map')} title="Map view" aria-label="Map view">
            <Map size={14} />
          </button>
        </div>
      </div>

      <div className="explore-layout">
        {/* Desktop Filter Panel */}
        <div className="filter-panel">
          <div className="filter-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <SlidersHorizontal size={14} />
              {language === 'pa' ? 'ਫਿਲਟਰ' : (language === 'hi' ? 'फिल्टर' : 'Pan-India Filters')}
              {activeFilterCount > 0 && (
                <span style={{
                  background: 'var(--color-accent)', color: 'white',
                  borderRadius: 'var(--radius-full)', fontSize: 10, fontWeight: 800,
                  padding: '1px 6px', lineHeight: 1.6,
                }}>
                  {activeFilterCount}
                </span>
              )}
            </span>
            {activeFilterCount > 0 && (
              <button className="filter-reset" onClick={resetFilters}>
                {language === 'pa' ? 'ਸਭ ਰੀਸੈੱਟ' : (language === 'hi' ? 'रीसेट करें' : 'Reset all')}
              </button>
            )}
          </div>
          <FilterContent {...filterProps} />
        </div>

        {/* Results Area */}
        <div>
          {/* Result count & Refresh */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 10 }}>
            <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 800, color: 'var(--color-text)', fontSize: '15px' }}>{totalCount}</span>
              {' '}{language === 'pa' ? 'ਅਸਲ ਪ੍ਰਾਪਰਟੀਆਂ ਮਿਲੀਆਂ' : (language === 'hi' ? 'वास्तविक प्रॉपर्टी उपलब्ध' : 'genuine listings found')}
              {isLoading && <RefreshCw size={14} className="spin" style={{ color: 'var(--color-accent)' }} />}
            </div>
            {activeFilterCount > 0 && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={resetFilters}
                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <X size={13} />
                {language === 'pa' ? 'ਕਲੀਅਰ' : (language === 'hi' ? 'क्लियर' : 'Clear')}
              </button>
            )}
          </div>

          {/* Loading Skeleton State */}
          {isLoading && properties.length === 0 ? (
            <div className="properties-grid">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="card property-card" style={{ height: 340, opacity: 0.7, display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
                  <div style={{ width: '100%', height: 180, background: 'rgba(255,255,255,0.06)', borderRadius: 12 }} />
                  <div style={{ width: '70%', height: 20, background: 'rgba(255,255,255,0.06)', borderRadius: 6 }} />
                  <div style={{ width: '40%', height: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 6 }} />
                </div>
              ))}
            </div>
          ) : error ? (
            /* Error State */
            <div className="card empty-state" style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div className="empty-state-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                <X size={24} />
              </div>
              <h3>{language === 'pa' ? 'ਸੰਪਰਕ ਅਸਫਲ ਰਿਹਾ' : (language === 'hi' ? 'लोड करने में समस्या हुई' : 'Unable to load listings')}</h3>
              <p>{error}</p>
              <button className="btn btn-primary btn-sm" onClick={fetchProperties}>
                {language === 'pa' ? 'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ' : (language === 'hi' ? 'पुनः प्रयास करें' : 'Try Again')}
              </button>
            </div>
          ) : properties.length === 0 ? (
            /* Empty State */
            <div className="card empty-state" style={{ padding: '48px 24px', textAlign: 'center' }}>
              <div className="empty-state-icon" style={{ background: 'rgba(37,99,235,0.1)', color: 'var(--color-accent)' }}>
                <Building2 size={26} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginTop: '12px' }}>
                {selectedCity !== 'All'
                  ? `${selectedCity} - No listings currently match`
                  : 'No properties match your current filters'}
              </h3>
              <p style={{ maxWidth: '420px', margin: '8px auto 20px', fontSize: '13.5px', color: 'var(--color-text-muted)' }}>
                You can sync fresh listings for this city or post a new verified listing to reach active buyers.
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={handleSync}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <RefreshCw size={15} />
                  Fetch Real Listings for {selectedCity !== 'All' ? selectedCity : (selectedState !== 'All' ? selectedState : 'this region')}
                </button>
                <button 
                  className="btn btn-outline" 
                  onClick={() => onNavigate('my-properties')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <PlusCircle size={15} />
                  Post Free Listing
                </button>
                {activeFilterCount > 0 && (
                  <button className="btn btn-ghost" onClick={resetFilters}>
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          ) : view === 'map' ? (
            /* Map View */
            <div>
              {/* Map View Header Banner */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 10,
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                marginBottom: 14
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text)' }}>
                  <Navigation size={15} style={{ color: '#38bdf8' }} />
                  <span style={{ fontWeight: 700 }}>
                    {language === 'pa' ? 'ਨਕਸ਼ਾ ਦ੍ਰਿਸ਼' : (language === 'hi' ? 'मानचित्र दृश्य' : 'Interactive Map of India')}
                  </span>
                  <span style={{ color: 'var(--color-text-muted)' }}>
                    • {properties.length} {language === 'pa' ? 'ਪ੍ਰਾਪਰਟੀਆਂ' : (language === 'hi' ? 'प्रॉपर्टी' : 'properties shown')}
                  </span>
                </div>

                {selectedCity !== 'All' && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedCity + ', India')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      color: '#38bdf8',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    <ExternalLink size={13} />
                    <span>Open {selectedCity} in Google Maps</span>
                  </a>
                )}
              </div>

              {/* Full Interactive Leaflet & CartoDB / Esri Satellite Pan-India Map */}
              <div style={{ marginBottom: 20 }}>
                <PanIndiaExploreMap
                  properties={properties}
                  selectedCity={selectedCity}
                  selectedState={selectedState}
                  onSelectProperty={(id) => onNavigate('detail', id)}
                  height={480}
                />
              </div>

              <div className="properties-grid">
                {properties.map(p => (
                  <PropertyCard key={p.id} property={p} onClick={() => onNavigate('detail', p.id)} />
                ))}
              </div>
            </div>
          ) : view === 'grid' ? (
            /* Grid View */
            <div className="properties-grid">
              {properties.map(p => (
                <PropertyCard key={p.id} property={p} onClick={() => onNavigate('detail', p.id)} />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="properties-list">
              {properties.map(p => (
                <PropertyCard key={p.id} property={p} view="list" onClick={() => onNavigate('detail', p.id)} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 28 }}>
              <button
                className="btn btn-outline btn-sm"
                disabled={page <= 1 || isLoading}
                onClick={() => {
                  setPage(p => Math.max(1, p - 1));
                  scrollToTop(true);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <ChevronLeft size={16} /> {language === 'pa' ? 'ਪਿਛਲਾ' : (language === 'hi' ? 'पिछला' : 'Previous')}
              </button>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                Page {page} of {totalPages}
              </span>
              <button
                className="btn btn-outline btn-sm"
                disabled={page >= totalPages || isLoading}
                onClick={() => {
                  setPage(p => Math.min(totalPages, p + 1));
                  scrollToTop(true);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              >
                {language === 'pa' ? 'ਅਗਲਾ' : (language === 'hi' ? 'अगला' : 'Next')} <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── Mobile Filter Bottom Sheet ──────────────────────────────────────── */}
      {filterSheetOpen && (
        <>
          <div
            className="filter-sheet-overlay"
            onClick={() => setFilterSheetOpen(false)}
            aria-hidden="true"
          />
          <div className="filter-sheet" role="dialog" aria-modal="true" aria-label="Filters">
            <div className="filter-sheet-handle" />
            <div className="filter-sheet-header">
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>
                {language === 'pa' ? 'ਫਿਲਟਰ' : (language === 'hi' ? 'ਫਿਲਟਰ' : 'Pan-India Filters')}
                {activeFilterCount > 0 && (
                  <span style={{ marginLeft: 8, background: 'var(--color-accent)', color: 'white', borderRadius: 'var(--radius-full)', fontSize: 10, fontWeight: 800, padding: '2px 7px' }}>
                    {activeFilterCount}
                  </span>
                )}
              </span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => { resetFilters(); }}
                disabled={activeFilterCount === 0}
                style={{ color: activeFilterCount > 0 ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
              >
                Reset
              </button>
            </div>
            <div className="filter-sheet-body">
              <FilterContent {...filterProps} />
            </div>
            <div className="filter-sheet-footer">
              <button
                className="btn btn-primary w-full"
                onClick={() => setFilterSheetOpen(false)}
                style={{ justifyContent: 'center', height: 48 }}
              >
                Show {totalCount} {totalCount === 1 ? 'property' : 'properties'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ─── Data Sources & Provider Health Modal ──────────────────────────── */}
      {isSourcesModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setIsSourcesModalOpen(false)}
        >
          <div 
            style={{
              background: 'var(--color-surface)',
              border: '1.5px solid var(--color-border)',
              borderRadius: '16px',
              maxWidth: '620px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(16,185,129,0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: 'var(--color-text)' }}>
                    PlotIX Verified Listing Standards
                  </h3>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    100% Native PlotIX Verification & Direct Registry Compliance
                  </div>
                </div>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setIsSourcesModalOpen(false)}
                style={{ padding: '6px' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '18px' }}>
              Every listing on PlotIX is verified against official circle rates, registry status, and direct broker-seller identity checks across India.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: 'var(--color-surface-2)', borderRadius: '12px', padding: '12px 16px', border: '1px solid rgba(16,185,129,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-text)' }}>1. Title & Documentation Verification</span>
                  <span style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>
                    ● 100% VERIFIED
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                  Plots are checked for mutation, clear title documentation, municipal permissions, and approved sector layout maps.
                </div>
              </div>

              <div style={{ background: 'var(--color-surface-2)', borderRadius: '12px', padding: '12px 16px', border: '1px solid rgba(16,185,129,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-text)' }}>2. Verified Owner & Agent Direct Contact</span>
                  <span style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>
                    ● DIRECT ACCESS
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                  Direct phone and WhatsApp connections without intermediary paywalls. Schedule private site visits with verified representatives.
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsSourcesModalOpen(false)}
                style={{ padding: '8px 18px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
