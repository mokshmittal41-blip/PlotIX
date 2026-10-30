import { useEffect, useRef, useState } from 'react';
import { Viewer } from 'mapillary-js';
import 'mapillary-js/dist/mapillary.css';
import { useMapContext } from '../../../context/MapContext';
import { 
  findNearestMapillaryImage, 
  getMapillaryToken, 
  type StreetImageResult 
} from '../../../services/mapillaryService';
import { 
  X, Compass, MapPin, Loader2, ArrowLeft, 
  Maximize2, Minimize2, Sparkles, Navigation, 
  Calendar, AlertCircle
} from 'lucide-react';

export function StreetViewViewer() {
  const { 
    isStreetViewActive, 
    streetViewLocation, 
    setStreetViewPanoMarker,
    closeStreetView 
  } = useMapContext();

  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageInfo, setActiveImageInfo] = useState<StreetImageResult | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const loc = streetViewLocation;
  const isPlot = loc?.source === 'plot';

  useEffect(() => {
    if (!isStreetViewActive || !loc) return;

    let isCancelled = false;
    setLoading(true);
    setError(null);

    async function initMapillaryViewer() {
      if (!loc) return;
      const token = getMapillaryToken();

      try {
        // Step 1: Find nearest genuine Mapillary image ID
        let targetImageId = loc.id;
        let imageResult: StreetImageResult | null = null;

        if (!targetImageId) {
          imageResult = await findNearestMapillaryImage(loc.lat, loc.lng, 350);
          if (!imageResult.available || !imageResult.id) {
            if (!isCancelled) {
              setError(imageResult.error || 'No street-level imagery available nearby. Try selecting a blue-covered street.');
              setLoading(false);
            }
            return;
          }
          targetImageId = imageResult.id;
        }

        if (isCancelled) return;

        setActiveImageInfo(imageResult || {
          available: true,
          id: targetImageId,
          lat: loc.lat,
          lng: loc.lng,
          compassAngle: loc.heading
        });

        // Set initial camera marker on the map
        const activeLat = imageResult?.lat ?? loc.lat;
        const activeLng = imageResult?.lng ?? loc.lng;
        const activeHeading = loc.heading ?? imageResult?.compassAngle ?? 0;
        setStreetViewPanoMarker({
          lat: activeLat,
          lng: activeLng,
          heading: activeHeading
        });

        // Step 2: Initialize official MapillaryJS WebGL Viewer
        if (containerRef.current) {
          // Dispose any previous viewer instance
          if (viewerRef.current) {
            viewerRef.current.remove();
            viewerRef.current = null;
          }

          const viewer = new Viewer({
            accessToken: token,
            container: containerRef.current,
            imageId: targetImageId,
            component: {
              cover: false,
              spatial: true,
              sequence: true,
              direction: true,
              zoom: true,
              bearing: true
            }
          });

          viewerRef.current = viewer;

          // Listen to spatial/sequence navigation events
          viewer.on('image', (evt: any) => {
            const img = evt.image;
            if (img) {
              const lngLat = img.computedLngLat || img.lngLat;
              const headingVal = img.compassAngle || 0;

              if (lngLat) {
                setStreetViewPanoMarker({
                  lat: lngLat.lat,
                  lng: lngLat.lng,
                  heading: Math.round(headingVal)
                });
              }

              setActiveImageInfo({
                available: true,
                id: img.id,
                lat: lngLat?.lat,
                lng: lngLat?.lng,
                capturedAt: img.capturedAt ? new Date(img.capturedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : undefined,
                compassAngle: Math.round(headingVal),
                isPano: Boolean(img.isPano),
                sequenceId: img.sequenceId
              });
            }
          });

          viewer.on('load', () => {
            if (!isCancelled) {
              setLoading(false);
            }
          });

          // Fallback timer if load event takes a second
          setTimeout(() => {
            if (!isCancelled) setLoading(false);
          }, 1200);
        }
      } catch (err) {
        console.error('Error initializing MapillaryJS viewer:', err);
        if (!isCancelled) {
          setError('Street imagery could not be loaded at this location.');
          setLoading(false);
        }
      }
    }

    initMapillaryViewer();

    return () => {
      isCancelled = true;
      if (viewerRef.current) {
        try {
          viewerRef.current.remove();
        } catch (e) {
          console.warn('Error disposing viewer:', e);
        }
        viewerRef.current = null;
      }
    };
  }, [isStreetViewActive, loc, setStreetViewPanoMarker]);

  if (!isStreetViewActive || !loc) return null;

  const heading = activeImageInfo?.compassAngle ?? loc.heading ?? 0;
  const currentLat = activeImageInfo?.lat ?? loc.lat;
  const currentLng = activeImageInfo?.lng ?? loc.lng;

  return (
    <div className={`street-explorer-container ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      
      {/* Contextual Header */}
      <div className="street-view-header">
        <div className="street-view-header-left">
          <div className={`street-view-tag ${isPlot ? 'plot-mode' : 'colony-mode'}`}>
            <Sparkles size={13} />
            <span>{isPlot ? 'PROPERTY STREET EXPLORER' : 'STREET EXPLORER'}</span>
          </div>

          <h3 className="street-view-title">
            {loc.title || (isPlot ? 'Selected Property Plot' : 'Locality Street View')}
          </h3>

          <div className="street-view-meta-row">
            <span className="meta-item">
              <MapPin size={12} />
              <span>{loc.subtitle || `${currentLat.toFixed(5)}° N, ${currentLng.toFixed(5)}° E`}</span>
            </span>

            {loc.estimatedValue && (
              <span className="meta-badge value-badge">
                <strong>Estimated Value:</strong> {loc.estimatedValue}
              </span>
            )}

            {loc.frontFacing && (
              <span className="meta-badge direction-badge">
                <Compass size={12} />
                <span>Facing: <strong>{loc.frontFacing}</strong> ({heading}°)</span>
              </span>
            )}

            {activeImageInfo?.capturedAt && (
              <span className="meta-item text-muted">
                <Calendar size={11} />
                <span>{activeImageInfo.capturedAt}</span>
              </span>
            )}

            <span className="meta-badge mapillary-badge">
              Imagery © Mapillary
            </span>
          </div>
        </div>

        <div className="street-view-header-actions">
          <button 
            className="sv-action-btn"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button 
            className="sv-action-btn close-btn"
            onClick={closeStreetView}
            title="Close Street Explorer"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main MapillaryJS WebGL Viewport */}
      <div className="street-explorer-viewport">
        {loading && (
          <div className="street-explorer-loading">
            <Loader2 className="animate-spin text-primary" size={36} />
            <p className="loading-text">Loading Street Imagery…</p>
            <p className="text-xs text-muted">Connecting to Mapillary street network</p>
          </div>
        )}

        {!loading && error && (
          <div className="street-explorer-error-card">
            <div className="error-icon-box">
              <AlertCircle size={32} className="text-warning" />
            </div>
            <h4 className="error-title">No Street-Level Imagery Available</h4>
            <p className="error-desc">{error}</p>
            <button className="btn btn-primary btn-return-map" onClick={closeStreetView}>
              <ArrowLeft size={16} />
              <span>Return to Map</span>
            </button>
          </div>
        )}

        {/* Official MapillaryJS WebGL Canvas Container */}
        <div 
          ref={containerRef} 
          className="mapillary-canvas-container"
          style={{ display: !error ? 'block' : 'none' }}
        />
      </div>

      {/* Bottom Status Bar */}
      <div className="street-view-footer">
        <div className="footer-info">
          <Navigation size={13} className="text-primary" />
          <span className="footer-coords">
            {currentLat.toFixed(5)}° N, {currentLng.toFixed(5)}° E • Heading {heading}°
          </span>
        </div>

        <div className="footer-actions">
          <button className="btn btn-sm btn-outline sv-return-btn" onClick={closeStreetView}>
            <ArrowLeft size={14} />
            <span>Return to Map</span>
          </button>
        </div>
      </div>

    </div>
  );
}

export default StreetViewViewer;
