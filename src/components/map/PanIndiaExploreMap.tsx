import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Layers, Navigation, MapPin } from 'lucide-react';
import type { Property } from '../../types';
import { getAccurateCoordinates, openGoogleMaps } from '../../utils/mapUtils';
import { formatPrice } from '../../data/dummyData';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom price pill pin icon generator
function createPricePinIcon(property: Property, isSelected: boolean) {
  const label = property.price >= 10000000 
    ? `₹${(property.price / 10000000).toFixed(2)} Cr`
    : `₹${(property.price / 100000).toFixed(0)} L`;

  const bg = isSelected ? '#0284c7' : '#059669';
  const border = isSelected ? '#38bdf8' : '#34d399';

  return L.divIcon({
    className: 'propwise-price-marker',
    html: `
      <div style="position: relative; cursor: pointer; transform: translate(-50%, -100%);">
        <div style="background: ${bg}; color: #ffffff; padding: 4px 8px; border-radius: 999px; font-size: 11px; font-weight: 800; border: 2px solid ${border}; box-shadow: 0 4px 14px rgba(0,0,0,0.35); white-space: nowrap; display: flex; align-items: center; gap: 3px;">
          <span>📍 ${label}</span>
        </div>
        <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid ${bg}; margin: 0 auto;"></div>
      </div>
    `,
    iconSize: [60, 30],
    iconAnchor: [30, 30],
    popupAnchor: [0, -32]
  });
}

function MapAutoBounds({ properties, selectedCity, selectedState }: { properties: Property[]; selectedCity?: string; selectedState?: string }) {
  const map = useMap();

  useEffect(() => {
    if (properties.length > 0) {
      const bounds = L.latLngBounds(
        properties.map(p => getAccurateCoordinates(p))
      );
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    } else {
      // Default Pan-India view
      map.setView([22.9734, 78.6569], 5);
    }

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [properties, selectedCity, selectedState, map]);

  return null;
}

interface PanIndiaExploreMapProps {
  properties: Property[];
  selectedCity?: string;
  selectedState?: string;
  onSelectProperty?: (propertyId: string) => void;
  height?: number | string;
}

export default function PanIndiaExploreMap({
  properties,
  selectedCity,
  selectedState,
  onSelectProperty,
  height = 480
}: PanIndiaExploreMapProps) {
  const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets');
  const [activePropertyId, setActivePropertyId] = useState<string | null>(null);

  const tileUrl = mapType === 'satellite'
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  const tileAttribution = mapType === 'satellite'
    ? '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: '14px', overflow: 'hidden', border: '1.5px solid var(--color-border)', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}>
      <MapContainer
        center={[22.9734, 78.6569]}
        zoom={5}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', zIndex: 1 }}
      >
        <MapAutoBounds properties={properties} selectedCity={selectedCity} selectedState={selectedState} />
        <TileLayer url={tileUrl} attribution={tileAttribution} maxZoom={19} />

        {properties.map(p => {
          const coords = getAccurateCoordinates(p);
          const isSelected = p.id === activePropertyId;
          const icon = createPricePinIcon(p, isSelected);

          return (
            <Marker
              key={p.id}
              position={coords}
              icon={icon}
              eventHandlers={{
                click: () => {
                  setActivePropertyId(p.id);
                }
              }}
            >
              <Popup>
                <div style={{ padding: '6px', minWidth: 200 }}>
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 6, marginBottom: 6 }}
                  />
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>
                    {formatPrice(p.price)}
                  </div>
                  <strong style={{ fontSize: '12px', color: '#334155', display: 'block', lineHeight: 1.3, marginBottom: 4 }}>
                    {p.title}
                  </strong>
                  <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: 3, marginBottom: 8 }}>
                    <MapPin size={11} style={{ color: '#ef4444' }} />
                    <span>{p.location}</span>
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    {onSelectProperty && (
                      <button
                        type="button"
                        onClick={() => onSelectProperty(p.id)}
                        style={{
                          flex: 1,
                          padding: '5px 8px',
                          background: '#059669',
                          color: 'white',
                          border: 'none',
                          borderRadius: 6,
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        View Property
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => openGoogleMaps(p, e as any)}
                      style={{
                        padding: '5px 8px',
                        background: 'rgba(56, 189, 248, 0.15)',
                        color: '#0284c7',
                        border: '1px solid rgba(56, 189, 248, 0.4)',
                        borderRadius: 6,
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3
                      }}
                      title="Open in Google Maps"
                    >
                      <Navigation size={11} />
                      <span>Maps ↗</span>
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Top Floating Controls */}
      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, display: 'flex', gap: 8 }}>
        <button
          type="button"
          onClick={() => setMapType(m => m === 'streets' ? 'satellite' : 'streets')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            fontSize: '11.5px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}
          title="Toggle Satellite vs Street View"
        >
          <Layers size={13} style={{ color: '#38bdf8' }} />
          <span>{mapType === 'satellite' ? 'Street View' : 'Satellite'}</span>
        </button>
      </div>
    </div>
  );
}
