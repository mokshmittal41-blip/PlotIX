import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useMapContext } from '../../context/MapContext';
import { getActiveSatelliteProvider } from '../../config/mapProviders';

// Syncs the magnifier map center with the current cursor geographic position
function MagnifierSync() {
  const { cursorPosition, satelliteSource } = useMapContext();
  const map = useMap();

  const satelliteProvider = getActiveSatelliteProvider(satelliteSource);

  useEffect(() => {
    if (cursorPosition) {
      map.setView(cursorPosition, satelliteProvider.maxNativeZoom, { animate: false });
    }
  }, [cursorPosition, map, satelliteProvider.maxNativeZoom]);

  return null;
}

export default function PrecisionMagnifier() {
  const { isDrawingMode, cursorPosition, activeDragVertex, satelliteSource } = useMapContext();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const satelliteProvider = getActiveSatelliteProvider(satelliteSource);
  
  // Track mouse screen coordinates for positioning the floating magnifier
  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      if (containerRef.current) {
        // Offset slightly from cursor so it doesn't block it
        const x = e.clientX + 20;
        const y = e.clientY - 140; // Above and to the right
        containerRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };
    
    // Only track if magnifier should be visible
    if (isDrawingMode || activeDragVertex !== null) {
      window.addEventListener('mousemove', updatePosition);
    }
    
    return () => {
      window.removeEventListener('mousemove', updatePosition);
    };
  }, [isDrawingMode, activeDragVertex]);

  // Show if actively drawing (placing points) or actively dragging a vertex
  const isVisible = Boolean(cursorPosition) && (isDrawingMode || activeDragVertex !== null);

  if (!isVisible) return null;

  return (
    <div 
      ref={containerRef}
      className="precision-magnifier"
    >
      <div className="magnifier-crosshair"></div>
      <MapContainer 
        center={cursorPosition!} 
        zoom={satelliteProvider.maxNativeZoom} 
        zoomControl={false} 
        attributionControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        keyboard={false}
        style={{ width: '100%', height: '100%' }}
      >
        <MagnifierSync />
        <TileLayer
          url={satelliteProvider.url}
          maxZoom={satelliteProvider.maxZoom}
          maxNativeZoom={satelliteProvider.maxNativeZoom}
        />
      </MapContainer>
    </div>
  );
}
