import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import type { LocationResult } from '../types/location';
import { locationService } from '../services/locationService';

export type MapMode = 'map' | 'satellite';
export type ActivePanel = 'none' | 'before-after' | 'future' | 'intelligence';
export type ExploreMode = 'selection' | 'land' | 'place';

// Point is now a geographic coordinate: [latitude, longitude]
export type Point = [number, number];

interface MapContextType {
  // Leaflet Map Instance
  mapInstance: LeafletMap | null;
  setMapInstance: (map: LeafletMap | null) => void;

  // Map State
  exploreMode: ExploreMode;
  setExploreMode: (mode: ExploreMode) => void;
  mapMode: MapMode;
  setMapMode: (mode: MapMode) => void;
  satelliteSource: string;
  setSatelliteSource: (source: string) => void;
  searchedLocation: string;
  setSearchedLocation: (loc: string) => void;
  selectedLocation: LocationResult | null;
  setSelectedLocation: (loc: LocationResult | null) => void;
  searchMarker: Point | null;
  setSearchMarker: (pt: Point | null) => void;
  activeLayers: Set<string>;
  toggleLayer: (layer: string) => void;

  // Drawing State
  isDrawingMode: boolean;
  setIsDrawingMode: (val: boolean) => void;
  drawingPoints: Point[];
  setDrawingPoints: React.Dispatch<React.SetStateAction<Point[]>>;
  isPolygonComplete: boolean;
  setIsPolygonComplete: (val: boolean) => void;
  cursorPosition: Point | null;
  setCursorPosition: (pt: Point | null) => void;
  activeDragVertex: number | null;
  setActiveDragVertex: (val: number | null) => void;
  snapEnabled: boolean;
  setSnapEnabled: (val: boolean) => void;

  // User Live GPS Location
  userGpsLocation: Point | null;
  setUserGpsLocation: (pt: Point | null) => void;
  isLocating: boolean;
  setIsLocating: (val: boolean) => void;
  fetchLiveGpsLocation: (forceFly?: boolean) => Promise<Point | null>;

  // Selection & Panels
  selectedMarkerId: string | null;
  setSelectedMarkerId: (id: string | null) => void;
  activePanel: ActivePanel;
  setActivePanel: (panel: ActivePanel) => void;
  onboardingDismissed: boolean;
  setOnboardingDismissed: (val: boolean) => void;

  // Place Sub-mode (Colony Insights vs Analyze a Plot)
  placeSubMode: 'colony' | 'plot';
  setPlaceSubMode: (mode: 'colony' | 'plot') => void;

  // Street View State (Hybrid Architecture)
  isStreetViewMode: boolean;
  setIsStreetViewMode: (mode: boolean) => void;
  isStreetViewActive: boolean;
  setIsStreetViewActive: (active: boolean) => void;
  streetViewLocation: StreetViewLocation | null;
  setStreetViewLocation: (loc: StreetViewLocation | null) => void;
  streetViewPanoMarker: { lat: number; lng: number; heading?: number } | null;
  setStreetViewPanoMarker: (marker: { lat: number; lng: number; heading?: number } | null) => void;
  enterStreetViewMode: (initialLoc?: StreetViewLocation) => void;
  exitStreetViewMode: () => void;
  openStreetView: (loc: StreetViewLocation) => void;
  closeStreetView: () => void;
}

export interface StreetViewLocation {
  id?: string;
  lat: number;
  lng: number;
  heading?: number;
  pitch?: number;
  title?: string;
  subtitle?: string;
  source?: 'control' | 'colony' | 'plot' | 'map-click';
  estimatedValue?: string;
  frontFacing?: string;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: ReactNode }) {
  const [mapInstance, setMapInstance] = useState<LeafletMap | null>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  useEffect(() => {
    mapInstanceRef.current = mapInstance;
  }, [mapInstance]);

  const hasAutoCenteredRef = useRef(false);

  const [exploreMode, setExploreMode] = useState<ExploreMode>('land');
  const [placeSubMode, setPlaceSubMode] = useState<'colony' | 'plot'>('colony');
  
  // Default to satellite view as requested
  const [mapMode, setMapMode] = useState<MapMode>('satellite');
  // Read from .env if we have Mapbox, else Esri
  const initialSource = import.meta.env.VITE_MAPBOX_TOKEN ? 'mapboxSatellite' : 'esriSatellite';
  const [satelliteSource, setSatelliteSource] = useState(initialSource);
  const [searchedLocation, setSearchedLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);
  const [searchMarker, setSearchMarker] = useState<Point | null>(null);
  const [activeLayers, setActiveLayers] = useState<Set<string>>(new Set(['properties', 'roads']));

  // Live GPS tracking
  const [userGpsLocation, setUserGpsLocation] = useState<Point | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const [isDrawingMode, setIsDrawingMode] = useState(true);
  const [drawingPoints, setDrawingPoints] = useState<Point[]>([]);
  const [isPolygonComplete, setIsPolygonComplete] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<Point | null>(null);
  const [activeDragVertex, setActiveDragVertex] = useState<number | null>(null);
  const [snapEnabled, setSnapEnabled] = useState(false);

  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<ActivePanel>('none');
  const [onboardingDismissed, setOnboardingDismissed] = useState(true);

  // Street View States (Hybrid Architecture)
  const [isStreetViewMode, setIsStreetViewMode] = useState(false);
  const [isStreetViewActive, setIsStreetViewActive] = useState(false);
  const [streetViewLocation, setStreetViewLocation] = useState<StreetViewLocation | null>(null);
  const [streetViewPanoMarker, setStreetViewPanoMarker] = useState<{ lat: number; lng: number; heading?: number } | null>(null);

  // Live Geolocation with Unified Multi-Tier Detection & Reverse Geocoding
  const fetchLiveGpsLocation = useCallback(async (forceFly = false): Promise<Point | null> => {
    setIsLocating(true);

    try {
      const unified = await locationService.getUnifiedCurrentLocation();
      const coords: Point = unified.coordinates;
      setUserGpsLocation(coords);
      setIsLocating(false);

      const currentMap = mapInstanceRef.current;
      // Only auto-fly ONCE on initial startup or when user explicitly taps "Locate Me" (forceFly === true)
      if (currentMap && (forceFly || !hasAutoCenteredRef.current)) {
        hasAutoCenteredRef.current = true;
        try {
          const container = typeof currentMap.getContainer === 'function' ? currentMap.getContainer() : null;
          const isAttached = container && document.body.contains(container) && container.clientWidth > 0 && container.clientHeight > 0;
          const isReady = isAttached && (currentMap as any)._mapPane && (currentMap as any)._loaded;

          if (isReady && typeof currentMap.flyTo === 'function') {
            currentMap.stop();
            currentMap.flyTo(coords, 16, { duration: 1.2 });
          } else if (typeof currentMap.setView === 'function') {
            currentMap.setView(coords, 16);
          }
        } catch {
          try { currentMap.setView(coords, 16); } catch {}
        }
      }

      const locResult: LocationResult = {
        id: 'current-location',
        name: unified.displayName || `${unified.locality}, ${unified.city}`,
        type: unified.source === 'gps' ? 'Current GPS Location' : 'Network Detected Location',
        locality: unified.locality,
        city: unified.city,
        state: unified.state,
        coordinates: coords
      };
      setSelectedLocation(locResult);
      setSearchedLocation(unified.displayName);

      return coords;
    } catch (err) {
      console.warn('Map live location error:', err);
      setIsLocating(false);
      return null;
    }
  }, []);

  const enterStreetViewMode = useCallback((initialLoc?: StreetViewLocation) => {
    setIsStreetViewMode(true);
    if (initialLoc) {
      setStreetViewLocation(initialLoc);
      setIsStreetViewActive(true);
      setStreetViewPanoMarker({ lat: initialLoc.lat, lng: initialLoc.lng, heading: initialLoc.heading || 0 });
    }
  }, []);

  const exitStreetViewMode = useCallback(() => {
    setIsStreetViewMode(false);
    setIsStreetViewActive(false);
    setStreetViewLocation(null);
    setStreetViewPanoMarker(null);
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 150);
  }, []);

  const openStreetView = useCallback((loc: StreetViewLocation) => {
    setIsStreetViewMode(true);
    setStreetViewLocation(loc);
    setIsStreetViewActive(true);
    setStreetViewPanoMarker({ lat: loc.lat, lng: loc.lng, heading: loc.heading || 0 });
  }, []);

  const closeStreetView = useCallback(() => {
    setIsStreetViewActive(false);
    setStreetViewLocation(null);
    setStreetViewPanoMarker(null);
  }, []);

  const toggleLayer = useCallback((layer: string) => {
    setActiveLayers(prev => {
      const next = new Set(prev);
      if (next.has(layer)) next.delete(layer);
      else next.add(layer);
      return next;
    });
  }, []);

  return (
    <MapContext.Provider
      value={{
        mapInstance, setMapInstance,
        exploreMode, setExploreMode,
        placeSubMode, setPlaceSubMode,
        mapMode, setMapMode,
        satelliteSource, setSatelliteSource,
        searchedLocation, setSearchedLocation,
        selectedLocation, setSelectedLocation,
        searchMarker, setSearchMarker,
        activeLayers, toggleLayer,
        isDrawingMode, setIsDrawingMode,
        drawingPoints, setDrawingPoints,
        isPolygonComplete, setIsPolygonComplete,
        cursorPosition, setCursorPosition,
        activeDragVertex, setActiveDragVertex,
        snapEnabled, setSnapEnabled,
        selectedMarkerId, setSelectedMarkerId,
        activePanel, setActivePanel,
        onboardingDismissed, setOnboardingDismissed,
        userGpsLocation, setUserGpsLocation,
        isLocating, setIsLocating,
        fetchLiveGpsLocation,
        isStreetViewMode, setIsStreetViewMode,
        isStreetViewActive, setIsStreetViewActive,
        streetViewLocation, setStreetViewLocation,
        streetViewPanoMarker, setStreetViewPanoMarker,
        enterStreetViewMode, exitStreetViewMode,
        openStreetView, closeStreetView,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function useMapContext() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
}
