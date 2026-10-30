export interface MapProviderConfig {
  id: string;
  name: string;
  url: string;
  attribution: string;
  maxZoom: number;
  maxNativeZoom: number;
  // Future-proofing for providers that need access tokens (e.g., Mapbox, Google Maps API)
  requiresAuth?: boolean;
  accessToken?: string; 
}

// Current prototype providers
export const MAP_PROVIDERS: Record<string, MapProviderConfig> = {
  // Google Hybrid (Satellite + Labels)
  esriSatellite: {
    id: 'esriSatellite',
    name: 'Google Satellite',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '&copy; Google',
    maxZoom: 70,        
    maxNativeZoom: 22,  
  },
  // Mapbox Satellite (30cm-50cm Maxar imagery, goes up to z22)
  mapboxSatellite: {
    id: 'mapboxSatellite',
    name: 'Mapbox Satellite (Premium)',
    url: `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}@2x?access_token=${import.meta.env.VITE_MAPBOX_TOKEN || ''}`,
    attribution: '© Mapbox © Maxar',
    maxZoom: 70,
    maxNativeZoom: 22,
    requiresAuth: true
  },
  // Transparent labels overlay for satellite mode
  cartoLabels: {
    id: 'cartoLabels',
    name: 'CartoDB Labels',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 70,
    maxNativeZoom: 18,
  },
  // Modern premium map view (Google Streets)
  osm: {
    id: 'osm',
    name: 'Google Map',
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    attribution: '&copy; Google',
    maxZoom: 70,
    maxNativeZoom: 22,
  },
  
  // ==========================================
  // FUTURE PRODUCTION PROVIDERS (PLACEHOLDERS)
  // ==========================================
  
  // Mapbox Satellite Example
  // mapboxSatellite: {
  //   id: 'mapboxSatellite',
  //   name: 'Mapbox Satellite (Premium)',
  //   url: 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}@2x?access_token={accessToken}',
  //   attribution: '© Mapbox © Maxar',
  //   maxZoom: 22,
  //   maxNativeZoom: 22,
  //   requiresAuth: true
  // },

  // Google Maps Platform Example (2D Map Tiles API)
  // Requires generating session tokens dynamically in production, not a simple XYZ URL.
  // googleSatellite: {
  //   id: 'googleSatellite',
  //   name: 'Google Maps Platform',
  //   url: 'https://tile.googleapis.com/v1/2dtiles/{z}/{x}/{y}?session={sessionToken}&key={apiKey}',
  //   attribution: '© Google',
  //   maxZoom: 21,
  //   maxNativeZoom: 21,
  //   requiresAuth: true
  // }
};

// Check if Mapbox is configured
export const hasMapboxToken = Boolean(import.meta.env.VITE_MAPBOX_TOKEN);

// Helpers to get the current active configurations
// Default to Mapbox if token is provided, otherwise fallback to Esri
export const getActiveSatelliteProvider = (providerId?: string) => {
  if (providerId && MAP_PROVIDERS[providerId]) return MAP_PROVIDERS[providerId];
  return hasMapboxToken ? MAP_PROVIDERS.mapboxSatellite : MAP_PROVIDERS.esriSatellite;
};
export const getActiveMapProvider = () => MAP_PROVIDERS.osm;
export const getActiveLabelsProvider = () => MAP_PROVIDERS.cartoLabels;
