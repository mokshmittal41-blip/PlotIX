import { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  X,
  Crosshair,
  Sparkles
} from 'lucide-react';
import type {
  LocationHierarchy,
  LocationSuggestion,
  ParcelRecord,
  LandRecordData,
  LandRecordStatus
} from '../types/landRecords';
import {
  DEMO_POPULAR_LOCATIONS,
  landRecordsService
} from '../services/landRecordsService';
import { locationService } from '../services/locationService';
import LocationBreadcrumb from '../components/landRecords/LocationBreadcrumb';
import LandMap from '../components/landRecords/LandMap';
import SearchByKhasra from '../components/landRecords/SearchByKhasra';
import LandRecordPanel from '../components/landRecords/LandRecordPanel';
import '../components/landRecords/LandRecords.css';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

interface LandRecordsProps {
  onNavigate?: (page: string) => void;
}

export default function LandRecords({ onNavigate: _onNavigate }: LandRecordsProps) {
  const { activeLocation: globalActiveLocation } = useApp();
  const { language, t } = useLanguage();

  // Search query & dropdown state
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>(DEMO_POPULAR_LOCATIONS);
  const [isLocating, setIsLocating] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Active Location State
  const [activeLocation, setActiveLocation] = useState<LocationHierarchy>({
    state: globalActiveLocation?.state || 'Haryana',
    district: globalActiveLocation?.district || 'Rewari',
    tehsil: globalActiveLocation?.tehsil || globalActiveLocation?.name || 'Bawal',
    village: globalActiveLocation?.village || globalActiveLocation?.name || 'Bawal',
    locality: globalActiveLocation?.name || 'Bawal',
    coordinates: globalActiveLocation?.coordinates || [28.0837, 76.5847]
  });

  useEffect(() => {
    if (globalActiveLocation) {
      setActiveLocation({
        state: globalActiveLocation.state,
        district: globalActiveLocation.district,
        tehsil: globalActiveLocation.tehsil || globalActiveLocation.name,
        village: globalActiveLocation.village || globalActiveLocation.name,
        locality: globalActiveLocation.name,
        coordinates: globalActiveLocation.coordinates
      });
    }
  }, [globalActiveLocation]);

  // Parcels & Selected Parcel State
  const [parcels, setParcels] = useState<ParcelRecord[]>([]);
  const [selectedParcel, setSelectedParcel] = useState<ParcelRecord | null>(null);

  // Land Record Data State
  const [recordData, setRecordData] = useState<LandRecordData | null>(null);
  const [status, setStatus] = useState<LandRecordStatus>('data_unavailable');
  const [statusMessage, setStatusMessage] = useState<string>(
    'Official cadastral data and ownership records will be retrieved when the state revenue database is connected.'
  );

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch search suggestions as user types
  useEffect(() => {
    let active = true;
    const fetchSuggestions = async () => {
      const results = await landRecordsService.searchLocations(searchQuery);
      if (active) {
        setSuggestions(results);
      }
    };

    const timer = setTimeout(fetchSuggestions, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Load parcels whenever location changes
  useEffect(() => {
    let active = true;
    const loadParcels = async () => {
      const generated = await landRecordsService.getParcelsByLocation(activeLocation);
      if (active) {
        setParcels(generated);
        const defaultParcel = generated[4] || generated[0]; // Center parcel
        setSelectedParcel(defaultParcel);

        const rec = await landRecordsService.getLandRecordByParcel(defaultParcel, activeLocation);
        if (active) {
          setRecordData(rec);
          setStatus('data_unavailable');
          setStatusMessage(
            `Official records for ${defaultParcel.id} (${activeLocation.village || activeLocation.locality}, ${activeLocation.district}) will appear upon backend connection.`
          );
        }
      }
    };

    loadParcels();
    return () => { active = false; };
  }, [activeLocation]);

  // Handle Location Selection
  const handleSelectLocation = (loc: LocationSuggestion) => {
    setActiveLocation({
      state: loc.state,
      district: loc.district,
      tehsil: loc.tehsil || 'Central Sub-Division',
      village: loc.village || loc.title,
      locality: loc.locality || loc.subtitle,
      coordinates: loc.coordinates
    });
    setSearchQuery(`${loc.title}, ${loc.district}`);
    setIsDropdownOpen(false);
  };

  // Handle Parcel Click on Map
  const handleSelectParcel = async (parcel: ParcelRecord) => {
    setSelectedParcel(parcel);
    setStatus('loading');
    setStatusMessage(`Retrieving attributes for parcel ${parcel.id}...`);

    const rec = await landRecordsService.getLandRecordByParcel(parcel, activeLocation);
    setRecordData(rec);
    setStatus('data_unavailable');
    setStatusMessage(
      `Demo parcel ${parcel.id} selected. Official revenue data is awaiting API integration.`
    );
  };

  // Handle Khasra / Survey Lookup
  const handleKhasraSearch = async (khasra: string) => {
    setStatus('loading');
    setStatusMessage(`Searching for Khasra / Survey number: ${khasra}...`);

    const res = await landRecordsService.getLandRecordByKhasra(khasra, activeLocation);
    if (res.record) {
      setRecordData(res.record);
      setSelectedParcel(res.record.parcel);
      setStatus(res.status);
      setStatusMessage(res.message);
    }
  };

  // Handle Auto-Detect GPS Location
  const handleDetectLocation = async () => {
    setIsLocating(true);
    try {
      const unified = await locationService.getUnifiedCurrentLocation();
      const [latitude, longitude] = unified.coordinates;
      setActiveLocation({
        state: unified.state,
        district: unified.district || unified.city,
        tehsil: unified.tehsil || unified.district || 'Central Tehsil',
        village: unified.locality || unified.city || 'Current Area',
        locality: unified.displayName,
        coordinates: [latitude, longitude]
      });
      setSearchQuery(unified.displayName || `${unified.locality}, ${unified.city}`);
    } catch (err) {
      console.warn('Land records auto-detect location error:', err);
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className="lr-page-container">
      
      {/* ─── 1. HERO SECTION ─── */}
      <section className="lr-hero-card">
        <div className="lr-hero-badge">
          <Sparkles size={12} />
          <span>{language === 'pa' ? 'ਸਰਕਾਰੀ ਮਾਲ ਰਿਕਾਰਡ ਪ੍ਰਣਾਲੀ' : (language === 'hi' ? 'सरकारी भू-अभिलेख प्रणाली' : 'India Land Records Architecture')}</span>
        </div>

        <div>
          <h1 className="lr-hero-title">{t.landRecords.title}</h1>
          <p className="lr-hero-subtitle">{t.landRecords.subtitle}</p>
        </div>

        {/* Primary Search Box */}
        <div className="lr-search-wrapper" ref={searchContainerRef}>
          <div className="lr-search-bar">
            <Search size={20} className="lr-search-icon" />
            <input
              type="text"
              placeholder={t.landRecords.searchPlaceholder}
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              className="lr-search-input"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="lr-clear-btn"
                title={t.common.clear}
              >
                <X size={16} />
              </button>
            )}

            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="lr-locate-btn"
              title={t.landRecords.useGps}
            >
              <Crosshair size={15} className={isLocating ? 'animate-spin' : ''} />
              <span>{isLocating ? (language === 'pa' ? 'ਲੱਭ ਰਿਹਾ ਹੈ...' : (language === 'hi' ? 'खोज रहा है...' : 'Locating...')) : t.landRecords.useGps}</span>
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && (
            <div className="lr-autocomplete-dropdown">
              <div className="lr-dropdown-header">
                {searchQuery.trim() ? (language === 'pa' ? 'ਮਿਲਦੇ ਇਲਾਕੇ' : (language === 'hi' ? 'मिलते-जुलते स्थान' : 'Matched Locations')) : (language === 'pa' ? 'ਪ੍ਰਮੁੱਖ ਇਲਾਕੇ' : (language === 'hi' ? 'लोकप्रिय खोज स्थान' : 'Popular Search Locations'))}
              </div>

              {suggestions.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleSelectLocation(item)}
                  className="lr-suggestion-item"
                >
                  <div className="lr-suggestion-left">
                    <MapPin size={16} className="lr-suggestion-pin" />
                    <div>
                      <div className="lr-suggestion-title">{item.title}</div>
                      <div className="lr-suggestion-sub">{item.subtitle}</div>
                    </div>
                  </div>

                  {item.isDemo && (
                    <span className="lr-demo-badge">{language === 'pa' ? 'ਨਮੂਨਾ ਇਲਾਕਾ' : (language === 'hi' ? 'डेमो स्थान' : 'Demo Location')}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular Locations Quick Pills */}
        <div className="lr-popular-row">
          <span className="lr-popular-label">{language === 'pa' ? 'ਮੁੱਖ ਇਲਾਕੇ:' : (language === 'hi' ? 'लोकप्रिय स्थान:' : 'Popular Locations:')}</span>
          {DEMO_POPULAR_LOCATIONS.slice(0, 5).map(loc => (
            <button
              key={loc.id}
              type="button"
              onClick={() => handleSelectLocation(loc)}
              className="lr-popular-pill"
            >
              📍 {loc.title}
            </button>
          ))}
        </div>
      </section>

      {/* ─── 2. LOCATION BREADCRUMB ─── */}
      <LocationBreadcrumb location={activeLocation} />

      {/* ─── 3. TWO-COLUMN MAIN WORKSPACE ─── */}
      <div className="lr-main-grid">
        
        {/* ─── LEFT COLUMN: MAP & KHASRA SEARCH ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <LandMap
            center={activeLocation.coordinates || [30.6698, 76.7214]}
            parcels={parcels}
            selectedParcel={selectedParcel}
            onSelectParcel={handleSelectParcel}
            locationName={`${activeLocation.village || activeLocation.locality || 'Area'}, ${activeLocation.district}`}
          />

          <SearchByKhasra
            onSearch={handleKhasraSearch}
            isLoading={status === 'loading'}
          />
        </div>

        {/* ─── RIGHT COLUMN: LAND INFORMATION PANEL ─── */}
        <div>
          <LandRecordPanel
            record={recordData}
            status={status}
            statusMessage={statusMessage}
          />
        </div>

      </div>

    </div>
  );
}
