import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Layers, Info, CheckCircle2 } from 'lucide-react';
import type { ParcelRecord } from '../../types/landRecords';

interface LandMapProps {
  center: [number, number];
  parcels: ParcelRecord[];
  selectedParcel: ParcelRecord | null;
  onSelectParcel: (parcel: ParcelRecord) => void;
  locationName: string;
}

// Map center updater sub-component
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    try {
      if ((map as any)._mapPane && (map as any)._loaded) {
        map.flyTo(center, 17, { duration: 1.2 });
      } else {
        map.setView(center, 17);
      }
    } catch {
      try {
        map.setView(center, 17);
      } catch {}
    }
  }, [center, map]);
  return null;
}

// Marker icon
const centerIcon = L.divIcon({
  className: 'lr-center-marker-icon',
  html: `
    <div style="
      width: 28px;
      height: 28px;
      background: #2563eb;
      border: 3px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 4px 12px rgba(37,99,235,0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 11px;
      font-weight: 800;
    ">📍</div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

export default function LandMap({
  center,
  parcels,
  selectedParcel,
  onSelectParcel,
  locationName
}: LandMapProps) {
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');

  const tileLayerUrl = mapType === 'satellite'
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const tileLayerAttribution = mapType === 'satellite'
    ? '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <div className="lr-map-card">
      <div className="lr-map-header">
        <h3 className="lr-map-title">
          <span>Cadastral &amp; Parcel Map</span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
            ({locationName})
          </span>
        </h3>

        <div className="lr-map-controls">
          <button
            type="button"
            onClick={() => setMapType('standard')}
            className={`lr-map-toggle-btn ${mapType === 'standard' ? 'active' : ''}`}
          >
            Standard Map
          </button>
          <button
            type="button"
            onClick={() => setMapType('satellite')}
            className={`lr-map-toggle-btn ${mapType === 'satellite' ? 'active' : ''}`}
          >
            <Layers size={13} /> Satellite
          </button>
        </div>
      </div>

      {/* Leaflet Map Frame */}
      <div className="lr-map-frame">
        {/* Floating Demo Layer Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          zIndex: 1000,
          background: 'rgba(11, 23, 38, 0.88)',
          color: '#38bdf8',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '8px',
          padding: '4px 10px',
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '0.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          backdropFilter: 'blur(4px)'
        }}>
          <span>DEMO CADASTRAL LAYER</span>
        </div>

        <MapContainer
          center={center}
          zoom={17}
          style={{ width: '100%', height: '100%' }}
          scrollWheelZoom={true}
        >
          <MapController center={center} />

          <TileLayer
            attribution={tileLayerAttribution}
            url={tileLayerUrl}
            maxZoom={19}
          />

          {/* Center Search Location Marker */}
          <Marker position={center} icon={centerIcon}>
            <Popup>
              <div style={{ fontSize: '12px', fontWeight: 700 }}>
                {locationName}
              </div>
            </Popup>
          </Marker>

          {/* Demo Parcel Polygons */}
          {parcels.map(parcel => {
            const isSelected = selectedParcel?.id === parcel.id;
            return (
              <Polygon
                key={parcel.id}
                positions={parcel.polygonCoordinates}
                pathOptions={{
                  color: isSelected ? '#2563eb' : '#059669',
                  weight: isSelected ? 3.5 : 2,
                  fillColor: isSelected ? '#3b82f6' : '#10b981',
                  fillOpacity: isSelected ? 0.45 : 0.22,
                  dashArray: isSelected ? undefined : '4, 4'
                }}
                eventHandlers={{
                  click: () => onSelectParcel(parcel)
                }}
              >
                <Popup>
                  <div style={{ padding: '4px', minWidth: '160px', color: '#0f172a' }}>
                    <div style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      color: '#2563eb',
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      marginBottom: '2px'
                    }}>
                      Parcel Identifier
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#0b1726' }}>
                      {parcel.id}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 10px 0' }}>
                      Area: {parcel.area?.formatted || 'Not available'}
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectParcel(parcel)}
                      style={{
                        width: '100%',
                        background: '#0b1726',
                        color: '#ffffff',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <CheckCircle2 size={13} style={{ color: '#34d399' }} />
                      <span>View Land Information</span>
                    </button>
                  </div>
                </Popup>
              </Polygon>
            );
          })}
        </MapContainer>
      </div>

      {/* Demo Cadastral Notice */}
      <div className="lr-map-demo-banner">
        <Info size={18} style={{ flexShrink: 0 }} />
        <span>
          <strong>Demo parcel boundaries:</strong> Click any parcel on the map to inspect. Official cadastral boundaries and Khasra lines will appear when the state revenue database is connected.
        </span>
      </div>
    </div>
  );
}
