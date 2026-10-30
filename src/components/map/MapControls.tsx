import { Plus, Minus, Maximize, Navigation, Map, Layers, Eye, Loader2 } from 'lucide-react';
import { useMapContext } from '../../context/MapContext';
import { hasMapboxToken } from '../../config/mapProviders';

export default function MapControls() {
  const { 
    mapMode, setMapMode, mapInstance, 
    satelliteSource, setSatelliteSource,
    isStreetViewMode, enterStreetViewMode, exitStreetViewMode,
    selectedLocation, isPolygonComplete, drawingPoints,
    isLocating, fetchLiveGpsLocation
  } = useMapContext();

  const handleZoom = (direction: 'in' | 'out') => {
    if (!mapInstance) return;
    if (direction === 'in') {
      mapInstance.zoomIn();
    } else {
      mapInstance.zoomOut();
    }
  };

  const toggleFullscreen = () => {
    const mapWrapper = document.querySelector('.map-page-wrapper');
    if (!mapWrapper) return;

    if (!document.fullscreenElement) {
      mapWrapper.requestFullscreen().catch(err => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleCurrentLocation = () => {
    fetchLiveGpsLocation(true);
  };

  const handleStreetViewClick = () => {
    if (isStreetViewMode) {
      exitStreetViewMode();
      return;
    }

    // If a polygon plot is completed, enter street view mode and open that plot directly
    if (isPolygonComplete && drawingPoints.length >= 3) {
      const centerLat = drawingPoints.reduce((acc, p) => acc + p[0], 0) / drawingPoints.length;
      const centerLng = drawingPoints.reduce((acc, p) => acc + p[1], 0) / drawingPoints.length;
      enterStreetViewMode({
        lat: centerLat,
        lng: centerLng,
        title: 'Selected Property Plot',
        subtitle: selectedLocation?.city ? `${selectedLocation.city}, ${selectedLocation.state}` : 'Drawn Plot Area',
        source: 'plot'
      });
      return;
    }

    // Otherwise, enter Street View Exploration Mode (shows Google Map + Blue Coverage Layer)
    enterStreetViewMode();
  };

  return (
    <div className="map-controls-container">
      <div className="map-btn-group">
        <button 
          className="map-icon-btn toggle-view-btn" 
          onClick={() => setMapMode(mapMode === 'satellite' ? 'map' : 'satellite')}
          title={mapMode === 'satellite' ? "Switch to Map" : "Switch to Satellite"}
        >
          <div className={`toggle-icon-wrap ${mapMode === 'satellite' ? 'sat' : 'map'}`}>
            <Map size={18} />
          </div>
          <span className="toggle-label">{mapMode === 'satellite' ? 'Map' : 'Sat'}</span>
        </button>
      </div>

      {/* Satellite Provider Toggle (Only if Mapbox is configured and we are in satellite mode) */}
      {mapMode === 'satellite' && hasMapboxToken && (
        <div className="map-btn-group" style={{ position: 'relative' }}>
          <button 
            className="map-icon-btn toggle-view-btn" 
            onClick={() => setSatelliteSource(satelliteSource === 'mapboxSatellite' ? 'esriSatellite' : 'mapboxSatellite')}
            title="Toggle HD Satellite"
            style={{ width: '40px' }}
          >
            <div className={`toggle-icon-wrap ${satelliteSource === 'mapboxSatellite' ? 'sat' : 'map'}`}>
              <Layers size={18} />
            </div>
            <span className="toggle-label">{satelliteSource === 'mapboxSatellite' ? 'HD' : 'Esri'}</span>
          </button>
        </div>
      )}

      {/* Street View Control (Toggles Street Exploration Mode with Blue Coverage) */}
      <div className="map-btn-group">
        <button 
          className={`map-icon-btn ${isStreetViewMode ? 'active' : ''}`}
          onClick={handleStreetViewClick} 
          title={isStreetViewMode ? "Exit Street Explorer" : "Explore Street View"}
        >
          <Eye size={18} className={isStreetViewMode ? 'text-primary' : ''} />
        </button>
      </div>

      <div className="map-btn-group">
        <button 
          className={`map-icon-btn ${isLocating ? 'locating active' : ''}`} 
          onClick={handleCurrentLocation} 
          title="Current GPS Location"
          style={isLocating ? { color: '#2563eb' } : {}}
        >
          {isLocating ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Navigation size={18} />
          )}
        </button>
      </div>

      <div className="map-btn-group">
        <button className="map-icon-btn" onClick={() => handleZoom('in')} title="Zoom In">
          <Plus size={18} />
        </button>
        <div className="map-btn-divider" />
        <button className="map-icon-btn" onClick={() => handleZoom('out')} title="Zoom Out">
          <Minus size={18} />
        </button>
      </div>

      <div className="map-btn-group">
        <button className="map-icon-btn" onClick={toggleFullscreen} title="Fullscreen">
          <Maximize size={18} />
        </button>
      </div>
    </div>
  );
}
