import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { POI } from '../../services/geoService';

// Fix for default Leaflet icon in React/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom colored icons for categories
const createCustomIcon = (colorCode: string) => {
  return new L.DivIcon({
    className: 'custom-poi-marker',
    html: `<div style="background-color: ${colorCode}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
};

const CATEGORY_COLORS: Record<POI['category'], string> = {
  School: '#3b82f6', // blue-500
  Hospital: '#ef4444', // red-500
  Park: '#22c55e', // green-500
  Market: '#eab308', // yellow-500
  Bank: '#059669', // emerald-600
  Police: '#334155', // slate-700
  College: '#6366f1', // indigo-500
  Transport: '#4b5563', // gray-600
  Other: '#9ca3af' // gray-400
};

const ICONS = {
  School: createCustomIcon(CATEGORY_COLORS.School),
  Hospital: createCustomIcon(CATEGORY_COLORS.Hospital),
  Park: createCustomIcon(CATEGORY_COLORS.Park),
  Market: createCustomIcon(CATEGORY_COLORS.Market),
  Bank: createCustomIcon(CATEGORY_COLORS.Bank),
  Police: createCustomIcon(CATEGORY_COLORS.Police),
  College: createCustomIcon(CATEGORY_COLORS.College),
  Transport: createCustomIcon(CATEGORY_COLORS.Transport),
  Other: createCustomIcon(CATEGORY_COLORS.Other)
};

// Component to handle map view updates when coordinates change
const MapUpdater = ({ center, bounds }: { center: [number, number], bounds?: [number, number, number, number] }) => {
  const map = useMap();
  useEffect(() => {
    // Force a resize check in case container size was initially 0
    setTimeout(() => map.invalidateSize(), 100);

    if (bounds && bounds.every(b => typeof b === 'number' && !isNaN(b))) {
      try {
        map.fitBounds([
          [bounds[0], bounds[2]],
          [bounds[1], bounds[3]]
        ], { padding: [50, 50] });
      } catch (e) {
        console.warn("fitBounds failed", e);
        map.setView(center, 15);
      }
    } else if (center && !isNaN(center[0]) && !isNaN(center[1])) {
      try {
        // Use setView instead of flyTo to avoid NaN animation issues on zero-height containers
        map.setView(center, 15);
      } catch (e) {
        console.warn("setView failed", e);
      }
    }
  }, [center, bounds, map]);
  return null;
};

interface NakshaMapProps {
  center: [number, number];
  bounds?: [number, number, number, number];
  pois: POI[];
  activeLayers: Set<POI['category']>;
}

export default function NakshaMap({ center, bounds, pois, activeLayers }: NakshaMapProps) {
  // Filter POIs based on active layers
  const visiblePois = pois.filter(poi => activeLayers.has(poi.category));

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={center} 
        zoom={14} 
        className="w-full h-full"
        zoomControl={false} // We will use custom placement if needed, or default but hide it from css
      >
        <ZoomControl position="bottomright" />
        
        {/* OpenStreetMap standard tiles - premium styling can be done by using a different tile provider if API keys were available, but OSM is standard */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />

        <MapUpdater center={center} bounds={bounds} />

        {visiblePois.map(poi => (
          <Marker 
            key={poi.id} 
            position={[poi.lat, poi.lon]}
            icon={ICONS[poi.category] || ICONS.Other}
          >
            <Popup className="naksha-popup">
              <div className="p-1">
                <span className="text-xs font-bold uppercase tracking-wider text-primary mb-1 block">
                  {poi.category}
                </span>
                <h4 className="font-semibold text-gray-800 text-sm">{poi.name}</h4>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
