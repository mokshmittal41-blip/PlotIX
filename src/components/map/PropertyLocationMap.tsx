import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Layers, Navigation, ExternalLink, Compass } from 'lucide-react';
import type { Property } from '../../types';
import { getAccurateCoordinates, getGoogleMapsUrl, getGoogleMapsDirectionsUrl } from '../../utils/mapUtils';

// Fix for default Leaflet marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom glowing Red Property Pin Icon
const propertyPinIcon = L.divIcon({
  className: 'propwise-property-pin-marker',
  html: `
    <div style="position: relative; width: 34px; height: 34px; transform: translate(-17px, -34px); cursor: pointer;">
      <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 14px; height: 6px; background: rgba(0,0,0,0.3); border-radius: 50%; filter: blur(2px);"></div>
      <div style="position: absolute; top: 0; left: 0; width: 34px; height: 34px; background: #ef4444; border: 2.5px solid #ffffff; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4); display: flex; align-items: center; justify-content: center;">
        <div style="width: 12px; height: 12px; background: #ffffff; border-radius: 50%;"></div>
      </div>
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -36]
});

// Helper component to re-center map whenever coordinates change
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
    // Invalidate size to prevent gray tiles
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [center, zoom, map]);
  return null;
}

interface PropertyLocationMapProps {
  property: Property;
  height?: number | string;
}

export default function PropertyLocationMap({ property, height = 300 }: PropertyLocationMapProps) {
  const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets');
  const coords = getAccurateCoordinates(property);
  const googleMapsUrl = getGoogleMapsUrl(property);
  const directionsUrl = getGoogleMapsDirectionsUrl(property);

  const tileUrl = mapType === 'satellite'
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  const tileAttribution = mapType === 'satellite'
    ? '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: '14px', overflow: 'hidden', border: '1.5px solid var(--color-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
      <MapContainer
        center={coords}
        zoom={15}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%', zIndex: 1 }}
      >
        <ChangeView center={coords} zoom={15} />
        <TileLayer url={tileUrl} attribution={tileAttribution} maxZoom={19} />
        <Marker position={coords} icon={propertyPinIcon}>
          <Popup>
            <div style={{ padding: '4px', minWidth: 160 }}>
              <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block', marginBottom: '3px' }}>{property.title}</strong>
              <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '6px' }}>{property.location}</span>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11.5px',
                  color: '#0284c7',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <span>Open in Google Maps ↗</span>
              </a>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Floating Map Controls Overlay */}
      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, display: 'flex', gap: 8 }}>
        {/* Layer Switcher */}
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
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            transition: 'all 0.15s'
          }}
          title="Toggle Satellite Imagery vs Street Map"
        >
          <Layers size={13} style={{ color: '#38bdf8' }} />
          <span>{mapType === 'satellite' ? 'Street View' : 'Satellite'}</span>
        </button>

        {/* Direct Open in Google Maps */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            background: '#0284c7',
            color: '#ffffff',
            border: '1px solid #0284c7',
            borderRadius: '8px',
            fontSize: '11.5px',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)',
            transition: 'all 0.15s'
          }}
          title="Open exact pin in Google Maps web / app"
        >
          <ExternalLink size={13} />
          <span>Google Maps</span>
        </a>
      </div>

      {/* Bottom Coordinates & Directions Pill */}
      <div style={{
        position: 'absolute',
        bottom: 12,
        left: 12,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
        <div style={{
          padding: '4px 10px',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          color: '#e2e8f0',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 5
        }}>
          <Navigation size={11} style={{ color: '#10b981' }} />
          <span>{coords[0].toFixed(4)}° N, {coords[1].toFixed(4)}° E</span>
        </div>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '4px 10px',
            background: 'rgba(56, 189, 248, 0.2)',
            backdropFilter: 'blur(8px)',
            color: '#38bdf8',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
          title="Get turn-by-turn directions in Google Maps"
        >
          <Compass size={12} />
          <span>Directions</span>
        </a>
      </div>
    </div>
  );
}
