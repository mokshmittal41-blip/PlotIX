import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, CircleMarker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Ruler,
  Maximize2,
  ExternalLink,
  ChevronLeft,
  Building,
  Compass,
  RotateCcw
} from 'lucide-react';
import type { PlanningMapRecord } from '../../data/planning/types';

// Basemap URLs
const BASEMAP_TILES = {
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Earthstar Geographics'
  },
  street: {
    name: 'Street / OSM',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  },
  blueprint: {
    name: 'Blueprint CAD',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB &mdash; PropWise CAD'
  },
  dark: {
    name: 'Dark Mode',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB &mdash; PropWise GIS'
  }
};

interface PlanningMapViewerProProps {
  mapRecord: PlanningMapRecord;
  onBack?: () => void;
  onInspectBlueprint?: (record: PlanningMapRecord) => void;
}

// Controller component to smoothly center and fit bounds
function MapViewController({ center, bounds, zoom }: { center: [number, number]; bounds?: [number, number, number, number]; zoom?: number }) {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 150);

    if (bounds && bounds.every(b => typeof b === 'number' && !isNaN(b))) {
      try {
        map.fitBounds([
          [bounds[0], bounds[1]],
          [bounds[2], bounds[3]]
        ], { padding: [50, 50], maxZoom: 16 });
      } catch (e) {
        console.warn('fitBounds error', e);
        map.setView(center, zoom || 14);
      }
    } else if (center && !isNaN(center[0])) {
      map.setView(center, zoom || 14);
    }
  }, [center, bounds, zoom, map]);

  return null;
}

// Interactive Measurement Handler Component
function MeasurementToolHandler({
  activeMode,
  setPoints
}: {
  activeMode: 'distance' | 'area' | 'none';
  setPoints: React.Dispatch<React.SetStateAction<[number, number][]>>;
}) {
  useMapEvents({
    click(e) {
      if (activeMode !== 'none') {
        setPoints(prev => [...prev, [e.latlng.lat, e.latlng.lng]]);
      }
    }
  });

  return null;
}

export default function PlanningMapViewerPro({
  mapRecord,
  onBack,
  onInspectBlueprint
}: PlanningMapViewerProProps) {
  const [basemapKey, setBasemapKey] = useState<keyof typeof BASEMAP_TILES>('street');

  // Layer Toggles
  const [showZoning, setShowZoning] = useState(true);
  const [showCadastre, setShowCadastre] = useState(true);
  const [showRoads, setShowRoads] = useState(true);

  // Measurement State
  const [measureMode, setMeasureMode] = useState<'distance' | 'area' | 'none'>('none');
  const [measurePoints, setMeasurePoints] = useState<[number, number][]>([]);
  const [areaUnit, setAreaUnit] = useState<'sqyd' | 'acres' | 'bigha' | 'kanal' | 'guntha'>('sqyd');

  // Fullscreen container ref
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.warn(err));
    } else {
      document.exitFullscreen().catch(err => console.warn(err));
    }
  };

  // Distance calculation helper (Haversine formula in meters)
  const calculateTotalDistance = (): number => {
    if (measurePoints.length < 2) return 0;
    let dist = 0;
    for (let i = 0; i < measurePoints.length - 1; i++) {
      const [lat1, lon1] = measurePoints[i];
      const [lat2, lon2] = measurePoints[i + 1];
      const R = 6371e3; // meters
      const phi1 = (lat1 * Math.PI) / 180;
      const phi2 = (lat2 * Math.PI) / 180;
      const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
      const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      dist += R * c;
    }
    return dist;
  };

  // Polygon area calculation helper (approximate planar area in sq meters)
  const calculatePolygonArea = (): number => {
    if (measurePoints.length < 3) return 0;
    let area = 0;
    const R = 6378137; // Earth's radius in meters
    const radPoints = measurePoints.map(([lat, lon]) => [
      (lon * Math.PI * R * Math.cos((lat * Math.PI) / 180)) / 180,
      (lat * Math.PI * R) / 180
    ]);

    for (let i = 0; i < radPoints.length; i++) {
      const j = (i + 1) % radPoints.length;
      area += radPoints[i][0] * radPoints[j][1];
      area -= radPoints[j][0] * radPoints[i][1];
    }
    return Math.abs(area) / 2;
  };

  const distanceMeters = calculateTotalDistance();
  const areaSqMeters = calculatePolygonArea();

  // Converted area output string
  const formatArea = () => {
    if (areaSqMeters === 0) return '0';
    const sqYds = areaSqMeters * 1.19599;
    switch (areaUnit) {
      case 'sqyd':
        return `${sqYds.toLocaleString('en-IN', { maximumFractionDigits: 1 })} Sq. Yds (Gaj)`;
      case 'acres':
        return `${(sqYds / 4840).toFixed(3)} Acres`;
      case 'bigha':
        return `${(sqYds / 1008).toFixed(2)} Pucca Bigha`;
      case 'kanal':
        return `${(sqYds / 605).toFixed(2)} Kanal`;
      case 'guntha':
        return `${(sqYds / 121).toFixed(2)} Guntha`;
      default:
        return `${sqYds.toFixed(1)} Sq. Yds`;
    }
  };

  // Generate simulated geometric bounding boxes for zoning & cadastral parcels around center
  const [centerLat, centerLon] = mapRecord.center;
  const delta = 0.008;

  // Realistic zoning polygon samples
  const residentialPolygon: [number, number][] = [
    [centerLat - delta * 0.8, centerLon - delta * 0.8],
    [centerLat + delta * 0.4, centerLon - delta * 0.8],
    [centerLat + delta * 0.4, centerLon + delta * 0.2],
    [centerLat - delta * 0.8, centerLon + delta * 0.2]
  ];

  const commercialPolygon: [number, number][] = [
    [centerLat + delta * 0.4, centerLon - delta * 0.8],
    [centerLat + delta * 0.9, centerLon - delta * 0.8],
    [centerLat + delta * 0.9, centerLon + delta * 0.9],
    [centerLat + delta * 0.4, centerLon + delta * 0.9]
  ];

  const greenParkPolygon: [number, number][] = [
    [centerLat - delta * 0.8, centerLon + delta * 0.2],
    [centerLat + delta * 0.4, centerLon + delta * 0.2],
    [centerLat + delta * 0.4, centerLon + delta * 0.9],
    [centerLat - delta * 0.8, centerLon + delta * 0.9]
  ];

  return (
    <div ref={containerRef} className="w-full h-full relative flex flex-col bg-slate-900 overflow-hidden font-sans" style={{ minHeight: '600px' }}>
      
      {/* ─── TOP CONTROL BAR ─── */}
      <div className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between text-white z-[500] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors flex-shrink-0"
              title="Back to Explorer"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                {mapRecord.category} Map
              </span>
              <span className="text-slate-400 text-xs font-semibold truncate">
                {mapRecord.authorityShort} &bull; {mapRecord.cityOrTehsil}, {mapRecord.state}
              </span>
            </div>
            <h1 className="text-sm md:text-base font-extrabold text-white truncate m-0">
              {mapRecord.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onInspectBlueprint && (
            <button
              onClick={() => onInspectBlueprint(mapRecord)}
              className="hidden sm:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
            >
              <Building size={14} /> Blueprint Layout
            </button>
          )}

          {mapRecord.sourceUrl && (
            <a
              href={mapRecord.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border border-slate-700"
            >
              <ExternalLink size={14} /> Official Portal
            </a>
          )}

          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* ─── LEAFLET GIS CANVAS ─── */}
      <div className="flex-1 relative w-full h-full">
        <MapContainer
          center={mapRecord.center}
          zoom={mapRecord.zoomLevel || 14}
          className="w-full h-full z-0"
          zoomControl={false}
        >
          {/* Basemap Switcher */}
          <TileLayer
            url={BASEMAP_TILES[basemapKey].url}
            attribution={BASEMAP_TILES[basemapKey].attribution}
          />

          <MapViewController center={mapRecord.center} bounds={mapRecord.bounds} zoom={mapRecord.zoomLevel} />
          
          <MeasurementToolHandler
            activeMode={measureMode}
            setPoints={setMeasurePoints}
          />

          {/* Master Plan Land-Use Zoning Layer */}
          {showZoning && (
            <>
              <Polygon
                positions={residentialPolygon}
                pathOptions={{
                  color: '#eab308',
                  fillColor: '#eab308',
                  fillOpacity: 0.35,
                  weight: 2,
                  dashArray: '4, 4'
                }}
              >
                <Popup className="naksha-popup">
                  <div style={{ padding: '6px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#eab308', textTransform: 'uppercase' }}>
                      Master Plan Zone: Residential (R)
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: '4px 0' }}>
                      {mapRecord.title} - Sector Plotted Area
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      Permissible FAR: 2.5 - 3.5 &bull; Ground Coverage: 65%
                    </div>
                  </div>
                </Popup>
              </Polygon>

              <Polygon
                positions={commercialPolygon}
                pathOptions={{
                  color: '#ef4444',
                  fillColor: '#ef4444',
                  fillOpacity: 0.38,
                  weight: 2
                }}
              >
                <Popup className="naksha-popup">
                  <div style={{ padding: '6px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase' }}>
                      Commercial / SCO Complex (C)
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: '4px 0' }}>
                      High-Intensity Mixed Commercial Corridor
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      Permissible FAR: 4.0 &bull; Fronting 100ft/200ft Master Road
                    </div>
                  </div>
                </Popup>
              </Polygon>

              <Polygon
                positions={greenParkPolygon}
                pathOptions={{
                  color: '#10b981',
                  fillColor: '#10b981',
                  fillOpacity: 0.35,
                  weight: 2
                }}
              >
                <Popup className="naksha-popup">
                  <div style={{ padding: '6px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>
                      Green Buffer & Regional Park (P)
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: '4px 0' }}>
                      Public Open Space / Green Belt
                    </div>
                  </div>
                </Popup>
              </Polygon>
            </>
          )}

          {/* Cadastral / Aks Shajra Khasra Points */}
          {showCadastre && mapRecord.cadastralParcels?.map(parcel => (
            <CircleMarker
              key={parcel.id}
              center={[
                centerLat + (Math.random() - 0.5) * 0.006,
                centerLon + (Math.random() - 0.5) * 0.006
              ]}
              radius={8}
              pathOptions={{
                color: '#3b82f6',
                fillColor: '#60a5fa',
                fillOpacity: 0.9,
                weight: 2
              }}
            >
              <Popup className="naksha-popup">
                <div style={{ padding: '6px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
                    Cadastral Aks Shajra Parcel
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', margin: '3px 0' }}>
                    Khasra No: {parcel.khasraOrSurveyNo}
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569' }}>
                    Classification: {parcel.landClassification}
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569' }}>
                    Area: {parcel.areaInUnits}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* User Measurement Points & Polygons */}
          {measurePoints.length > 0 && (
            <>
              {measurePoints.map((pt, idx) => (
                <CircleMarker
                  key={idx}
                  center={pt}
                  radius={5}
                  pathOptions={{ color: '#f59e0b', fillColor: '#ffffff', fillOpacity: 1, weight: 2 }}
                />
              ))}

              {measureMode === 'distance' && measurePoints.length > 1 && (
                <Polygon
                  positions={measurePoints}
                  pathOptions={{ color: '#f59e0b', weight: 3, dashArray: '6, 6' }}
                />
              )}

              {measureMode === 'area' && measurePoints.length > 2 && (
                <Polygon
                  positions={measurePoints}
                  pathOptions={{
                    color: '#f59e0b',
                    fillColor: '#f59e0b',
                    fillOpacity: 0.4,
                    weight: 2
                  }}
                />
              )}
            </>
          )}
        </MapContainer>

        {/* ─── FLOATING TOP-LEFT HUD (Basemap & Layer Switcher) ─── */}
        <div className="gis-floating-hud-top-left">
          {/* Basemap Switcher */}
          <div className="hud-glass-panel">
            <div className="hud-panel-title">Basemap Style</div>
            <div className="hud-basemap-pills">
              {(['street', 'satellite', 'blueprint', 'dark'] as const).map(key => (
                <button
                  key={key}
                  onClick={() => setBasemapKey(key)}
                  className={`basemap-pill-btn ${basemapKey === key ? 'active' : ''}`}
                >
                  {BASEMAP_TILES[key].name}
                </button>
              ))}
            </div>
          </div>

          {/* GIS Layer Overlays */}
          <div className="hud-glass-panel">
            <div className="hud-panel-title">GIS Layers</div>
            <div className="flex flex-col gap-1">
              <label className="hud-layer-checkbox-row">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  Land-Use Master Zoning
                </span>
                <input
                  type="checkbox"
                  checked={showZoning}
                  onChange={e => setShowZoning(e.target.checked)}
                />
              </label>

              <label className="hud-layer-checkbox-row">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                  Cadastral / Khasra Grids
                </span>
                <input
                  type="checkbox"
                  checked={showCadastre}
                  onChange={e => setShowCadastre(e.target.checked)}
                />
              </label>

              <label className="hud-layer-checkbox-row">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  Road Networks & Arterials
                </span>
                <input
                  type="checkbox"
                  checked={showRoads}
                  onChange={e => setShowRoads(e.target.checked)}
                />
              </label>
            </div>
          </div>
        </div>

        {/* ─── FLOATING TOP-RIGHT HUD (Measurement Tools) ─── */}
        <div className="gis-floating-hud-top-right">
          <div className="hud-glass-panel" style={{ minWidth: '220px' }}>
            <div className="hud-panel-title flex items-center justify-between">
              <span>Measurement Tools</span>
              {measureMode !== 'none' && (
                <button
                  onClick={() => {
                    setMeasureMode('none');
                    setMeasurePoints([]);
                  }}
                  className="text-[10px] font-bold text-red-500 hover:text-red-700 flex items-center gap-0.5"
                >
                  <RotateCcw size={10} /> Clear
                </button>
              )}
            </div>

            <div className="flex gap-2 mb-2">
              <button
                onClick={() => {
                  setMeasureMode('distance');
                  setMeasurePoints([]);
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors flex items-center justify-center gap-1 ${
                  measureMode === 'distance'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Ruler size={13} /> Distance
              </button>

              <button
                onClick={() => {
                  setMeasureMode('area');
                  setMeasurePoints([]);
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors flex items-center justify-center gap-1 ${
                  measureMode === 'area'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Compass size={13} /> Area Polygon
              </button>
            </div>

            {measureMode !== 'none' && (
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs">
                <div className="text-[10px] text-slate-500 font-semibold mb-1">
                  Click anywhere on the map to add points
                </div>
                {measureMode === 'distance' && (
                  <div className="font-extrabold text-blue-600">
                    Distance: {(distanceMeters / 1000).toFixed(2)} km ({(distanceMeters * 3.28084).toFixed(0)} ft)
                  </div>
                )}
                {measureMode === 'area' && (
                  <div>
                    <div className="font-extrabold text-blue-600 mb-1.5">{formatArea()}</div>
                    <div className="flex gap-1 flex-wrap">
                      {(['sqyd', 'acres', 'bigha', 'kanal', 'guntha'] as const).map(u => (
                        <button
                          key={u}
                          onClick={() => setAreaUnit(u)}
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            areaUnit === u ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ─── BOTTOM FLOATING BAR ─── */}
        <div className="gis-floating-hud-bottom-center">
          <span className="text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {mapRecord.status}
          </span>
          <span className="text-slate-500 font-bold">&bull;</span>
          <span className="text-xs text-slate-300 font-medium">{mapRecord.totalAreaText}</span>
          {mapRecord.approvalOrderNo && (
            <>
              <span className="text-slate-500 font-bold">&bull;</span>
              <span className="text-xs text-slate-400 font-mono">{mapRecord.approvalOrderNo}</span>
            </>
          )}
        </div>

      </div>

    </div>
  );
}
