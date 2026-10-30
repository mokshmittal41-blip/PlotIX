import { useEffect, useState, useRef, useCallback } from 'react';
import { useMap, Polyline, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useMapContext } from '../../../context/MapContext';
import { 
  fetchMapillaryCoverage, 
  findNearestMapillaryImage, 
  type CoverageSegment 
} from '../../../services/mapillaryService';

// Custom camera marker with heading cone
const createCameraIcon = (heading = 0) => {
  return L.divIcon({
    className: 'street-camera-marker-wrap',
    html: `
      <div class="street-camera-icon" style="transform: rotate(${heading}deg);">
        <div class="camera-cone"></div>
        <div class="camera-dot"></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
};

export default function StreetCoverageLayer() {
  const map = useMap();
  const { 
    isStreetViewMode, 
    streetViewPanoMarker, 
    openStreetView, 
    selectedLocation 
  } = useMapContext();

  const [segments, setSegments] = useState<CoverageSegment[]>([]);
  const [hoveredSegmentId, setHoveredSegmentId] = useState<string | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadCoverage = useCallback(async () => {
    if (!isStreetViewMode || !map) return;
    const bounds = map.getBounds();
    const bbox = {
      south: bounds.getSouth(),
      west: bounds.getWest(),
      north: bounds.getNorth(),
      east: bounds.getEast()
    };

    const data = await fetchMapillaryCoverage(bbox);
    setSegments(data);
  }, [isStreetViewMode, map]);

  useEffect(() => {
    if (!isStreetViewMode) {
      setSegments([]);
      return;
    }

    loadCoverage();
  }, [isStreetViewMode, loadCoverage]);

  const handleLocationClick = async (lat: number, lng: number) => {
    const result = await findNearestMapillaryImage(lat, lng, 350);
    if (result.available && result.id && result.lat !== undefined && result.lng !== undefined) {
      openStreetView({
        id: result.id,
        lat: result.lat,
        lng: result.lng,
        heading: result.compassAngle || 0,
        title: selectedLocation?.name || 'Street Exploration Location',
        subtitle: `${result.lat.toFixed(5)}° N, ${result.lng.toFixed(5)}° E`,
        source: 'map-click'
      });
    } else {
      // If clicked uncovered area, open street view with coords so it shows clean no-coverage state
      openStreetView({
        lat,
        lng,
        title: selectedLocation?.name || 'Selected Location',
        subtitle: `${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E`,
        source: 'map-click'
      });
    }
  };

  useMapEvents({
    moveend() {
      if (!isStreetViewMode) return;
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        loadCoverage();
      }, 350);
    },
    click(e) {
      if (!isStreetViewMode) return;
      handleLocationClick(e.latlng.lat, e.latlng.lng);
    }
  });

  if (!isStreetViewMode) return null;

  return (
    <>
      {/* Real Blue Street Coverage Lines */}
      {segments.map((seg) => {
        const isHovered = hoveredSegmentId === seg.id;
        return (
          <Polyline
            key={seg.id}
            positions={seg.coordinates}
            pathOptions={{
              color: isHovered ? '#38bdf8' : '#2563eb',
              weight: isHovered ? 6.5 : 4,
              opacity: isHovered ? 1 : 0.85,
              lineCap: 'round',
              lineJoin: 'round',
              className: 'mapillary-blue-road'
            }}
            eventHandlers={{
              mouseover: () => setHoveredSegmentId(seg.id),
              mouseout: () => setHoveredSegmentId(null),
              click: (e) => {
                L.DomEvent.stopPropagation(e);
                handleLocationClick(e.latlng.lat, e.latlng.lng);
              }
            }}
          />
        );
      })}

      {/* Active Camera / Pegman Position Marker */}
      {streetViewPanoMarker && (
        <Marker
          position={[streetViewPanoMarker.lat, streetViewPanoMarker.lng]}
          icon={createCameraIcon(streetViewPanoMarker.heading || 0)}
          zIndexOffset={1000}
        />
      )}
    </>
  );
}
