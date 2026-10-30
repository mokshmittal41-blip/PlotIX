import { Search, Navigation, Loader2, MapPin } from 'lucide-react';
import { useMapContext } from '../../context/MapContext';
import { useApp } from '../../context/AppContext';
import { useState, useEffect, useRef } from 'react';
import { locationService } from '../../services/locationService';
import type { LocationResult } from '../../types/location';

export default function MapSearch() {
  const { 
    searchedLocation, 
    setSearchedLocation, 
    setSelectedLocation, 
    mapInstance, 
    setSearchMarker,
    fetchLiveGpsLocation,
    isLocating
  } = useMapContext();
  const { switchLocation } = useApp();
  const [inputValue, setInputValue] = useState(searchedLocation || '');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<LocationResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync input value with external context updates (e.g. from GPS) without triggering search
  useEffect(() => {
    setInputValue(searchedLocation || '');
  }, [searchedLocation]);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (!val.trim() || val.length < 2) {
      setResults([]);
      setShowDropdown(false);
      setHasSearched(false);
      setError(null);
      setSearchMarker(null);
      setSelectedLocation(null);
      return;
    }

    setIsSearching(true);
    setError(null);

    // Debounce the API call
    debounceTimer.current = setTimeout(async () => {
      try {
        const data = await locationService.searchLocation(val);
        setResults(data);
        setShowDropdown(true);
        setHasSearched(true);
      } catch {
        setError('Unable to fetch locations');
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  // Safe Leaflet navigation helper to prevent _leaflet_pos animation errors
  const safeFlyTo = (coords: [number, number], zoom = 16, duration = 1.2) => {
    if (!mapInstance) return;
    try {
      const container = typeof mapInstance.getContainer === 'function' ? mapInstance.getContainer() : null;
      const isAttached = container && document.body.contains(container) && container.clientWidth > 0 && container.clientHeight > 0;
      const isReady = isAttached && (mapInstance as any)._mapPane && (mapInstance as any)._loaded;

      if (isReady && typeof mapInstance.flyTo === 'function') {
        mapInstance.stop();
        mapInstance.flyTo(coords, zoom, { duration });
      } else if (typeof mapInstance.setView === 'function') {
        mapInstance.setView(coords, zoom);
      }
    } catch {
      try {
        if (typeof mapInstance.setView === 'function') {
          mapInstance.setView(coords, zoom);
        }
      } catch {}
    }
  };

  const handleSelectResult = (result: LocationResult) => {
    if (!mapInstance) return;
    
    // Update input text
    setInputValue(result.name);
    setSearchedLocation(result.name);
    setShowDropdown(false);
    
    // Fly to location and set marker safely
    const zoom = result.type.toLowerCase().includes('city') || result.type.toLowerCase().includes('administrative') ? 13 : 16;
    safeFlyTo(result.coordinates, zoom, 1.5);
    
    setSearchMarker(result.coordinates);
    
    // Set Single Source of Truth in MapContext
    setSelectedLocation(result);

    // Sync to AppContext Active Location
    switchLocation({
      id: result.id,
      name: result.locality || result.name,
      displayName: result.name,
      shortName: `${result.locality || result.city || result.name}`,
      coordinates: result.coordinates,
      latitude: result.coordinates[0],
      longitude: result.coordinates[1],
      placeName: result.locality || result.name,
      locality: result.locality,
      district: result.city,
      state: result.state,
      country: 'India',
      source: 'search',
      scope: result.type.toLowerCase().includes('city') ? 'city' : 'local',
      hierarchy: ['India', result.state, result.city, result.name],
      isVerified: true
    });
  };

  // Safe geolocation trigger on mount (non-intrusive, no blocking alerts)
  useEffect(() => {
    if (mapInstance && !searchedLocation && !hasSearched) {
      if ("geolocation" in navigator) {
        const timer = setTimeout(() => {
          fetchLiveGpsLocation(false);
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [mapInstance]);

  const handleCurrentLocation = () => {
    fetchLiveGpsLocation(true);
  };

  return (
    <div className="map-search-container">
      <div className="map-search-wrapper" style={{ position: 'relative', flex: 1 }}>
        <div className="map-search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search a city, locality, property or landmark..." 
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => {
              if (results.length > 0 || hasSearched || error) setShowDropdown(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && results.length > 0) {
                handleSelectResult(results[0]);
              }
            }}
          />
          {!isSearching && (
            <div className="shortcut-hint" style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.6, fontSize: '12px', fontWeight: 500, border: '1px solid var(--color-border)', padding: '2px 6px', borderRadius: '4px' }}>
              <span>⌘</span>
              <span>K</span>
            </div>
          )}
          {isSearching && <Loader2 size={16} className="animate-spin text-muted" />}
        </div>

        {/* Autocomplete Dropdown */}
        {showDropdown && (
          <div className="search-dropdown">
            {results.length > 0 ? (
              results.map((res) => {
                const subName = [res.city, res.state].filter(Boolean).join(', ');
                
                return (
                  <button 
                    key={res.id} 
                    className="search-dropdown-item"
                    onClick={() => handleSelectResult(res)}
                  >
                    <MapPin size={14} className="text-primary" />
                    <div className="search-item-text">
                      <div className="search-item-main">
                        {res.name} <span style={{fontSize: '11px', color: '#ffffff', marginLeft: '6px', background: 'var(--color-primary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600}}>{res.type}</span>
                      </div>
                      {subName && <div className="search-item-sub">{subName}</div>}
                    </div>
                  </button>
                );
              })
            ) : hasSearched && !isSearching ? (
              <div className="search-dropdown-item" style={{ padding: '12px', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                {error ? error : "Location not found"}
              </div>
            ) : isSearching ? (
              <div className="search-dropdown-item" style={{ padding: '12px', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                Searching...
              </div>
            ) : null}
          </div>
        )}
      </div>
      
      <button 
        className="map-current-location-btn" 
        title="Current Location"
        onClick={handleCurrentLocation}
      >
        {isLocating ? <Loader2 size={18} className="animate-spin" /> : <Navigation size={18} />}
      </button>
    </div>
  );
}
