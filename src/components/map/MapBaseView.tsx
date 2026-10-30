import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, Polyline, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useMapContext, type Point } from '../../context/MapContext';
import { useApp } from '../../context/AppContext';
import { getActiveSatelliteProvider, getActiveMapProvider } from '../../config/mapProviders';
import { locationService } from '../../services/locationService';
import StreetCoverageLayer from './streetview/StreetCoverageLayer';

// Fix for default marker icon in Leaflet + Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Clean, vibrant Green Dots on polygon corners (vertices)
const greenCornerDotIcon = L.divIcon({
  className: 'propwise-green-dot-wrapper',
  html: '<div class="green-corner-dot" title="Drag to adjust corner point"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// Clean Green Dots on polygon edges (midpoints)
const greenMidpointDotIcon = L.divIcon({
  className: 'propwise-green-midpoint-wrapper',
  html: '<div class="green-edge-dot" title="Drag or click to add a point on this edge"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

// Custom icon for search pin
const searchPinIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom pulsing GPS Blue Dot icon (like Google Maps)
const gpsPulseIcon = L.divIcon({
  className: 'gps-live-marker',
  html: `
    <div class="gps-pulse-outer">
      <div class="gps-pulse-wave"></div>
      <div class="gps-pulse-dot"></div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18]
});

// Auto-resizer subcomponent to ensure Leaflet renders all tiles instantly across all screen sizes
function MapAutoResizer() {
  const map = useMap();
  const { fetchLiveGpsLocation } = useMapContext();
  const hasGpsTriggered = useRef(false);

  useEffect(() => {
    const container = map.getContainer();
    
    // 1. Setup ResizeObserver so whenever container size changes/expands, Leaflet fills 100% of the screen
    let ro: ResizeObserver | null = null;
    if (container && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        try {
          map.invalidateSize({ pan: false });
        } catch {}
      });
      ro.observe(container);
    }

    // 2. Initial staggered invalidation across animation frames
    map.invalidateSize({ pan: false });
    const t1 = setTimeout(() => {
      try { map.invalidateSize({ pan: false }); } catch {}
    }, 100);
    const t2 = setTimeout(() => {
      try { map.invalidateSize({ pan: false }); } catch {}
    }, 300);
    const t3 = setTimeout(() => {
      try { map.invalidateSize({ pan: false }); } catch {}
    }, 600);
    const t4 = setTimeout(() => {
      try { map.invalidateSize({ pan: false }); } catch {}
    }, 1200);

    // 3. Initial GPS locate (runs once)
    let tGps: ReturnType<typeof setTimeout> | null = null;
    if (!hasGpsTriggered.current) {
      hasGpsTriggered.current = true;
      tGps = setTimeout(() => {
        fetchLiveGpsLocation(false);
      }, 400);
    }

    const handleResize = () => {
      try {
        map.invalidateSize({ pan: false });
      } catch {}
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      if (ro) ro.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      if (tGps) clearTimeout(tGps);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [map, fetchLiveGpsLocation]);

  return null;
}

// Map Location Flyer: Reacts to activeLocation changes and centers map smoothly
function MapLocationFlyer() {
  const map = useMap();
  const { activeLocation } = useApp();
  const prevCoordsRef = useRef<[number, number] | null>(null);

  useEffect(() => {
    if (!activeLocation || !activeLocation.coordinates) return;
    const [lat, lng] = activeLocation.coordinates;
    if (
      typeof lat !== 'number' || 
      typeof lng !== 'number' || 
      isNaN(lat) || 
      isNaN(lng) || 
      !isFinite(lat) || 
      !isFinite(lng)
    ) {
      return;
    }

    if (
      !prevCoordsRef.current ||
      prevCoordsRef.current[0] !== lat ||
      prevCoordsRef.current[1] !== lng
    ) {
      prevCoordsRef.current = [lat, lng];
      const zoom = activeLocation.scope === 'district' ? 11 : (activeLocation.scope === 'tehsil' ? 13 : 15);
      try {
        if (map && typeof map.flyTo === 'function' && map.getContainer()) {
          map.flyTo([lat, lng], zoom, { duration: 1.2 });
        }
      } catch (err) {
        console.warn('Map flyTo safe catch:', err);
      }
    }
  }, [map, activeLocation]);

  return null;
}

// Component to handle map clicks, double clicks, and cursor tracking for drawing
function MapEvents() {
  const { 
    exploreMode, placeSubMode,
    isDrawingMode, setIsDrawingMode, drawingPoints, setDrawingPoints, 
    isPolygonComplete, setIsPolygonComplete, setMapInstance, setCursorPosition, 
    snapEnabled, activeDragVertex,
    setSelectedLocation, setSearchMarker
  } = useMapContext();
  const map = useMap();

  const getSnappedPoint = (latlng: L.LatLng): Point => {
    if (!snapEnabled || drawingPoints.length === 0) return [latlng.lat, latlng.lng];
    
    // Check against the last drawn point
    const lastPt = drawingPoints[drawingPoints.length - 1];
    const dLat = Math.abs(latlng.lat - lastPt[0]);
    const dLng = Math.abs(latlng.lng - lastPt[1]);
    
    // Axis snapping (horizontal / vertical)
    if (dLat < dLng * 0.3) {
      return [lastPt[0], latlng.lng];
    } else if (dLng < dLat * 0.3) {
      return [latlng.lat, lastPt[1]];
    }
    
    return [latlng.lat, latlng.lng];
  };

  useEffect(() => {
    setMapInstance(map);
    return () => {
      setMapInstance(null);
    };
  }, [map, setMapInstance]);

  useMapEvents({
    click(e) {
      const canDraw = isDrawingMode || (exploreMode === 'land' && !isPolygonComplete) || (exploreMode === 'place' && placeSubMode === 'plot' && !isPolygonComplete);
      if (canDraw && !isPolygonComplete && activeDragVertex === null) {
        if (!isDrawingMode) setIsDrawingMode(true);
        const pt = getSnappedPoint(e.latlng);
        setDrawingPoints(prev => [...prev, pt]);
      } else if (exploreMode === 'place' && placeSubMode === 'colony') {
        locationService.reverseGeocode(e.latlng.lat, e.latlng.lng).then(geo => {
          setSelectedLocation({
            id: `loc-click-${Date.now()}`,
            name: geo.displayName || geo.locality || 'Selected Locality',
            type: 'Locality / Area',
            locality: geo.locality,
            city: geo.city,
            state: geo.state,
            coordinates: [e.latlng.lat, e.latlng.lng]
          });
          setSearchMarker([e.latlng.lat, e.latlng.lng]);
        });
      }
    },
    dblclick() {
      // Double click automatically completes the polygon if at least 3 points are placed
      if (drawingPoints.length >= 3 && !isPolygonComplete) {
        setIsPolygonComplete(true);
        setIsDrawingMode(false);
      }
    },
    mousemove(e) {
      if (isDrawingMode && !isPolygonComplete && activeDragVertex === null) {
        setCursorPosition(getSnappedPoint(e.latlng));
      } else if (activeDragVertex === null) {
        setCursorPosition(null);
      }
    },
    mouseout() {
      if (activeDragVertex === null) {
        setCursorPosition(null);
      }
    }
  });

  return null;
}

export default function MapBaseView() {
  const { 
    mapMode, 
    isDrawingMode, 
    drawingPoints, 
    setDrawingPoints,
    isPolygonComplete,
    setIsPolygonComplete,
    setIsDrawingMode,
    cursorPosition,
    searchMarker,
    userGpsLocation,
    setActiveDragVertex,
    setCursorPosition,
    snapEnabled,
    satelliteSource,
    isStreetViewMode
  } = useMapContext();

  const handleVertexDrag = (index: number, e: L.LeafletEvent) => {
    const marker = e.target;
    const position = marker.getLatLng();
    let pt: Point = [position.lat, position.lng];
    
    // Basic snap for drag (snap to previous vertex if enabled)
    if (snapEnabled && index > 0) {
      const prevPt = drawingPoints[index - 1];
      const dLat = Math.abs(pt[0] - prevPt[0]);
      const dLng = Math.abs(pt[1] - prevPt[1]);
      if (dLat < dLng * 0.3) pt = [prevPt[0], pt[1]];
      else if (dLng < dLat * 0.3) pt = [pt[0], prevPt[1]];
    }

    setDrawingPoints(prev => {
      const newPoints = [...prev];
      if (index >= 0 && index < newPoints.length) {
        newPoints[index] = pt;
      }
      return newPoints;
    });
    setCursorPosition(pt);
  };

  // Handle clicking a corner green dot (if start vertex and 3+ points, complete polygon)
  const handleVertexClick = (index: number, e: L.LeafletEvent) => {
    L.DomEvent.stopPropagation(e);
    if (index === 0 && drawingPoints.length >= 3 && !isPolygonComplete) {
      setIsPolygonComplete(true);
      setIsDrawingMode(false);
      setCursorPosition(null);
    }
  };

  // Insert a new vertex from a midpoint green dot
  const handleInsertMidpoint = (edgeIndex: number, atPoint?: Point) => {
    const p1 = drawingPoints[edgeIndex];
    const p2 = drawingPoints[(edgeIndex + 1) % drawingPoints.length];
    const targetPt: Point = atPoint || [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
    
    setDrawingPoints(prev => {
      const next = [...prev];
      next.splice(edgeIndex + 1, 0, targetPt);
      return next;
    });
  };

  // Calculate midpoints for all active edges
  const midpoints = useMemo(() => {
    if (drawingPoints.length < 2) return [];
    
    const count = isPolygonComplete ? drawingPoints.length : drawingPoints.length - 1;
    const list: { edgeIndex: number; midpoint: Point }[] = [];
    
    for (let i = 0; i < count; i++) {
      const p1 = drawingPoints[i];
      const p2 = drawingPoints[(i + 1) % drawingPoints.length];
      const mid: Point = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
      list.push({ edgeIndex: i, midpoint: mid });
    }
    return list;
  }, [drawingPoints, isPolygonComplete]);

  // Center of India roughly, or Chandigarh/Mohali
  const defaultCenter: [number, number] = [30.6799, 76.7221]; // Sector 82 Mohali

  // Use the provider architecture
  const satelliteProvider = getActiveSatelliteProvider(satelliteSource);
  const mapProvider = getActiveMapProvider();

  // Determine active provider for overarching maxZoom constraint
  const currentMaxZoom = mapMode === 'satellite' ? satelliteProvider.maxZoom : mapProvider.maxZoom;

  return (
    <div className={`map-container ${isDrawingMode ? 'drawing-cursor' : ''} ${isStreetViewMode ? 'street-exploration-active' : ''}`}>
      <MapContainer 
        center={defaultCenter} 
        zoom={15} 
        zoomControl={false} // We have custom zoom controls
        maxZoom={currentMaxZoom}
        style={{ width: '100%', height: '100%', zIndex: 1 }}
      >
        <MapEvents />
        <MapAutoResizer />
        <MapLocationFlyer />

        {mapMode === 'satellite' ? (
          <TileLayer
            url={satelliteProvider.url}
            attribution={satelliteProvider.attribution}
            maxZoom={satelliteProvider.maxZoom}
            maxNativeZoom={satelliteProvider.maxNativeZoom}
          />
        ) : (
          <TileLayer
            url={mapProvider.url}
            attribution={mapProvider.attribution}
            maxZoom={mapProvider.maxZoom}
            maxNativeZoom={mapProvider.maxNativeZoom}
          />
        )}

        {/* Real Blue Street Coverage Lines & Camera Marker Layer */}
        {isStreetViewMode && <StreetCoverageLayer />}

        {/* Live GPS User Location Pulse Marker */}
        {userGpsLocation && (
          <Marker position={userGpsLocation} icon={gpsPulseIcon} />
        )}

        {/* Search Marker */}
        {searchMarker && (
          <Marker position={searchMarker} icon={searchPinIcon} />
        )}

        {/* In-Progress Guide Lines */}
        {!isPolygonComplete && drawingPoints.length === 1 && cursorPosition && (
          <Polyline 
            positions={[drawingPoints[0], cursorPosition]}
            pathOptions={{
              color: '#10b981',
              weight: 3,
              dashArray: '5, 5',
              opacity: 0.9
            }}
          />
        )}

        {drawingPoints.length >= 2 && !isPolygonComplete && (
          <Polyline 
            positions={drawingPoints} 
            pathOptions={{ 
              color: '#10b981', 
              weight: 3.5, 
              dashArray: '6, 6' 
            }} 
          />
        )}

        {!isPolygonComplete && drawingPoints.length >= 2 && cursorPosition && (
          <Polyline 
            positions={[drawingPoints[drawingPoints.length - 1], cursorPosition, drawingPoints[0]]}
            pathOptions={{
              color: '#34d399',
              weight: 2.5,
              dashArray: '4, 6',
              opacity: 0.8
            }}
          />
        )}

        {/* Drawn Polygon Area */}
        {drawingPoints.length >= 3 && (
          <Polygon 
            positions={drawingPoints} 
            pathOptions={{ 
              color: '#10b981', 
              weight: isPolygonComplete ? 3.5 : 3, 
              fillColor: '#10b981', 
              fillOpacity: isPolygonComplete ? 0.32 : 0.2,
              dashArray: isPolygonComplete ? undefined : '5, 5'
            }} 
          />
        )}

        {/* Green Dots on Edges (Midpoints for extending/adjusting polygon) */}
        {midpoints.map((mid) => (
          <Marker
            key={`edge-dot-${mid.edgeIndex}-${drawingPoints.length}`}
            position={mid.midpoint}
            icon={greenMidpointDotIcon}
            draggable={true}
            eventHandlers={{
              click: (e) => {
                L.DomEvent.stopPropagation(e);
                handleInsertMidpoint(mid.edgeIndex, mid.midpoint);
              },
              dragstart: (e) => {
                L.DomEvent.stopPropagation(e);
                const pos = (e.target as L.Marker).getLatLng();
                const newPt: Point = [pos.lat, pos.lng];
                const insertIdx = mid.edgeIndex + 1;
                
                setDrawingPoints(prev => {
                  const next = [...prev];
                  next.splice(insertIdx, 0, newPt);
                  return next;
                });
                setActiveDragVertex(insertIdx);
              },
              drag: (e) => {
                L.DomEvent.stopPropagation(e);
                const pos = (e.target as L.Marker).getLatLng();
                const targetIdx = mid.edgeIndex + 1;
                setDrawingPoints(prev => {
                  const next = [...prev];
                  if (targetIdx >= 0 && targetIdx < next.length) {
                    next[targetIdx] = [pos.lat, pos.lng];
                  }
                  return next;
                });
                setCursorPosition([pos.lat, pos.lng]);
              },
              dragend: (e) => {
                L.DomEvent.stopPropagation(e);
                const pos = (e.target as L.Marker).getLatLng();
                const targetIdx = mid.edgeIndex + 1;
                setDrawingPoints(prev => {
                  const next = [...prev];
                  if (targetIdx >= 0 && targetIdx < next.length) {
                    next[targetIdx] = [pos.lat, pos.lng];
                  }
                  return next;
                });
                setActiveDragVertex(null);
                setCursorPosition(null);
              }
            }}
          />
        ))}

        {/* Green Dots on Corners (Draggable Vertices) */}
        {drawingPoints.map((pt, i) => (
          <Marker 
            key={`corner-dot-${i}`} 
            position={pt} 
            icon={greenCornerDotIcon}
            draggable={true}
            eventHandlers={{
              click: (e) => {
                handleVertexClick(i, e);
              },
              dragstart: (e) => {
                L.DomEvent.stopPropagation(e);
                setActiveDragVertex(i);
              },
              drag: (e) => {
                L.DomEvent.stopPropagation(e);
                handleVertexDrag(i, e);
              },
              dragend: (e) => {
                L.DomEvent.stopPropagation(e);
                handleVertexDrag(i, e);
                setActiveDragVertex(null);
                setCursorPosition(null);
              },
              contextmenu: (e) => {
                L.DomEvent.stopPropagation(e);
                if (drawingPoints.length > 3) {
                  setDrawingPoints(prev => prev.filter((_: Point, idx: number) => idx !== i));
                }
              }
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
