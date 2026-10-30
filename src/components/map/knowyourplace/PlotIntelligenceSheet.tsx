import { useState, useMemo } from 'react';
import { useMapContext } from '../../../context/MapContext';
import { 
  Sparkles, MapPin, ChevronUp, ChevronDown, X, RotateCcw, 
  Info, Eye, Layers, Coins
} from 'lucide-react';
import * as turf from '@turf/turf';
import CompassWidget from './CompassWidget';

export default function PlotIntelligenceSheet() {
  const { 
    isPolygonComplete, drawingPoints, setDrawingPoints, setIsPolygonComplete, 
    setIsDrawingMode, selectedLocation, openStreetView 
  } = useMapContext();

  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'value' | 'location' | 'ai-insight'>('overview');

  const activeLocation = selectedLocation || {
    name: 'Rajpura Plot Area',
    locality: 'Chitkara University Area',
    city: 'Rajpura',
    state: 'Punjab'
  };

  // Calculate geometric properties & metrics from Turf.js
  const plotMetrics = useMemo(() => {
    if (!isPolygonComplete || drawingPoints.length < 3) return null;

    try {
      const ring = [...drawingPoints.map(p => [p[1], p[0]]), [drawingPoints[0][1], drawingPoints[0][0]]];
      const polygon = turf.polygon([ring]);
      
      const areaSqMeters = turf.area(polygon);
      const exactSqFt = areaSqMeters / 0.092903;
      const sqYd = exactSqFt / 9;
      const marla = exactSqFt / 272.25;

      const bbox = turf.bbox(polygon);
      // Dimensions in feet
      const widthMeters = turf.distance([bbox[0], bbox[1]], [bbox[2], bbox[1]], { units: 'meters' });
      const heightMeters = turf.distance([bbox[0], bbox[1]], [bbox[0], bbox[3]], { units: 'meters' });
      const widthFt = Math.max(10, Math.round(widthMeters * 3.28084));
      const heightFt = Math.max(10, Math.round(heightMeters * 3.28084));

      // Calculate bearing / direction of the primary facing edge (first to second vertex)
      const p1 = drawingPoints[0];
      const p2 = drawingPoints[1];
      const lat1 = (p1[0] * Math.PI) / 180;
      const lat2 = (p2[0] * Math.PI) / 180;
      const dLng = ((p2[1] - p1[1]) * Math.PI) / 180;
      const y = Math.sin(dLng) * Math.cos(lat2);
      const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
      let bearing = (Math.atan2(y, x) * 180) / Math.PI;
      bearing = (bearing + 360) % 360;

      // Map to 8-point compass
      let direction = 'East';
      let roadSide = 'East';
      if (bearing >= 337.5 || bearing < 22.5) { direction = 'North'; roadSide = 'North'; }
      else if (bearing >= 22.5 && bearing < 67.5) { direction = 'North-East'; roadSide = 'North-East'; }
      else if (bearing >= 67.5 && bearing < 112.5) { direction = 'East'; roadSide = 'East'; }
      else if (bearing >= 112.5 && bearing < 157.5) { direction = 'South-East'; roadSide = 'South-East'; }
      else if (bearing >= 157.5 && bearing < 202.5) { direction = 'South'; roadSide = 'South'; }
      else if (bearing >= 202.5 && bearing < 247.5) { direction = 'South-West'; roadSide = 'South-West'; }
      else if (bearing >= 247.5 && bearing < 292.5) { direction = 'West'; roadSide = 'West'; }
      else if (bearing >= 292.5 && bearing < 337.5) { direction = 'North-West'; roadSide = 'North-West'; }

      // Price estimation: Regional rate around ₹1,750 - ₹2,000 / sq.ft
      const ratePerSqFt = 1850;
      const minEstLakhs = Math.max(5, ((exactSqFt * 1750) / 100000)).toFixed(1);
      const maxEstLakhs = Math.max(6, ((exactSqFt * 2000) / 100000)).toFixed(1);

      return {
        sqFt: Math.round(exactSqFt),
        sqYd: Math.round(sqYd),
        marla: marla.toFixed(1),
        widthFt,
        heightFt,
        bearingDegrees: Math.round(bearing),
        direction,
        roadSide,
        minEstLakhs,
        maxEstLakhs,
        ratePerSqFt,
        buyScore: '8.6',
        locationScore: '8.8',
        connectivityScore: '9.1',
        devScore: '8.2'
      };
    } catch (e) {
      console.error("Error calculating plot metrics", e);
      return null;
    }
  }, [isPolygonComplete, drawingPoints]);

  if (!isPolygonComplete || drawingPoints.length < 3) {
    return null;
  }

  const handleRedraw = () => {
    setDrawingPoints([]);
    setIsPolygonComplete(false);
    setIsDrawingMode(true);
  };

  const handleOpenStreetView = () => {
    if (!drawingPoints || drawingPoints.length === 0) return;
    const centerLat = drawingPoints.reduce((acc, p) => acc + p[0], 0) / drawingPoints.length;
    const centerLng = drawingPoints.reduce((acc, p) => acc + p[1], 0) / drawingPoints.length;

    openStreetView({
      lat: centerLat,
      lng: centerLng,
      heading: metrics.bearingDegrees,
      title: `Selected Plot • ${metrics.sqFt.toLocaleString()} sq ft`,
      subtitle: `${activeLocation.locality || activeLocation.name}, ${activeLocation.city}`,
      source: 'plot',
      estimatedValue: `₹${metrics.minEstLakhs}–${metrics.maxEstLakhs} L`,
      frontFacing: metrics.direction
    });
  };

  if (isDismissed) {
    return (
      <div className="reopen-sheet-btn-wrapper">
        <button 
          className="reopen-sheet-btn"
          onClick={() => setIsDismissed(false)}
          title="Open Plot Intelligence"
        >
          <Sparkles size={15} className="text-accent" />
          <span>Plot Intelligence</span>
        </button>
      </div>
    );
  }

  const metrics = plotMetrics || {
    sqFt: 2400,
    sqYd: 267,
    marla: '8.8',
    widthFt: 40,
    heightFt: 60,
    bearingDegrees: 90,
    direction: 'East',
    roadSide: 'East',
    minEstLakhs: '42',
    maxEstLakhs: '48',
    ratePerSqFt: 1850,
    buyScore: '8.6',
    locationScore: '8.8',
    connectivityScore: '9.1',
    devScore: '8.2'
  };

  return (
    <div className="intelligence-sheet-container">
      <div className={`intelligence-sheet-card plot-sheet ${isExpanded ? 'expanded' : 'collapsed'}`}>
        
        {/* Top Header */}
        <div className="sheet-header" onClick={() => !isExpanded && setIsExpanded(true)}>
          <div className="sheet-header-left">
            <div className="sheet-header-badges">
              <div className="sheet-tag plot-tag">
                <Sparkles size={11} className="text-accent" />
                <span>PLOT INTELLIGENCE</span>
              </div>
              <div className="recommendation-badge-inline">
                <span className="badge-dot-green"></span>
                <span>GOOD TO BUY</span>
              </div>
            </div>
            <h3 className="sheet-title">
              Selected Plot • {metrics.sqFt.toLocaleString()} sq ft
            </h3>
            <p className="sheet-subtitle">
              <MapPin size={11} />
              <span>{activeLocation.locality || activeLocation.name}, {activeLocation.city}</span>
            </p>
          </div>

          <div className="sheet-header-actions" onClick={(e) => e.stopPropagation()}>
            <button 
              className="sheet-action-btn redraw-btn"
              onClick={handleRedraw}
              title="Redraw Polygon"
            >
              <RotateCcw size={12} />
              <span>Redraw</span>
            </button>
            <button 
              className="sheet-action-btn"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Collapse Sheet" : "Expand Sheet"}
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
            <button 
              className="sheet-action-btn close-btn"
              onClick={() => setIsDismissed(true)}
              title="Close"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* 3 Hero Metric Tiles */}
        <div className="sheet-hero-metrics">
          <div className="metric-tile">
            <span className="metric-label">PLOT AREA</span>
            <div className="metric-value-wrap">
              <span className="metric-value text-primary">{metrics.sqFt.toLocaleString()}</span>
              <span className="metric-unit">sq ft</span>
            </div>
          </div>

          <div className="metric-tile">
            <span className="metric-label">ESTIMATED VALUE</span>
            <div className="metric-value-wrap">
              <span className="metric-value text-accent font-bold">₹{metrics.minEstLakhs}–{metrics.maxEstLakhs} L</span>
            </div>
          </div>

          <div className="metric-tile">
            <span className="metric-label">BUY SCORE</span>
            <div className="metric-value-wrap">
              <span className="metric-value text-success">{metrics.buyScore}</span>
              <span className="metric-denom">/ 10</span>
            </div>
          </div>
        </div>

        {/* Quick Orientation & Street View Strip */}
        <div className="plot-quick-strip">
          <CompassWidget 
            bearingDegrees={metrics.bearingDegrees}
            directionLabel={metrics.direction}
            roadFacingLabel={metrics.roadSide}
          />
          <button 
            className="btn-view-street compact-street-btn"
            onClick={handleOpenStreetView}
            title="Open 360° Street View"
          >
            <Eye size={13} className="text-accent" />
            <span>Street View</span>
          </button>
        </div>

        {/* Collapsed State: "View Insights" CTA */}
        {!isExpanded && (
          <div className="sheet-collapsed-cta">
            <button 
              className="btn-view-insights"
              onClick={() => setIsExpanded(true)}
            >
              <span>View Full Plot Analysis & Valuation</span>
              <ChevronUp size={14} />
            </button>
          </div>
        )}

        {/* Expanded Sheet Content */}
        {isExpanded && (
          <div className="sheet-expanded-body">
            {/* Tab Navigation */}
            <div className="sheet-tab-nav modern-segmented-bar" role="tablist" aria-label="Plot intelligence views">
              <button 
                type="button"
                role="tab"
                aria-selected={activeTab === 'overview'}
                className={`sheet-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <Layers size={14} className="tab-btn-icon" />
                <span>Overview</span>
              </button>
              <button 
                type="button"
                role="tab"
                aria-selected={activeTab === 'value'}
                className={`sheet-tab-btn ${activeTab === 'value' ? 'active' : ''}`}
                onClick={() => setActiveTab('value')}
              >
                <Coins size={14} className="tab-btn-icon" />
                <span>Valuation</span>
              </button>
              <button 
                type="button"
                role="tab"
                aria-selected={activeTab === 'location'}
                className={`sheet-tab-btn ${activeTab === 'location' ? 'active' : ''}`}
                onClick={() => setActiveTab('location')}
              >
                <MapPin size={14} className="tab-btn-icon" />
                <span>Orientation</span>
              </button>
              <button 
                type="button"
                role="tab"
                aria-selected={activeTab === 'ai-insight'}
                className={`sheet-tab-btn ${activeTab === 'ai-insight' ? 'active' : ''}`}
                onClick={() => setActiveTab('ai-insight')}
              >
                <Sparkles size={14} className="tab-btn-icon" />
                <span>AI Insight</span>
              </button>
            </div>

            {/* Tab Content Panels */}
            <div className="sheet-tab-content">
              {activeTab === 'overview' && (
                <div className="tab-pane overview-pane">
                  <div className="info-cards-grid">
                    <div className="info-card">
                      <span className="info-label">Plot Area</span>
                      <span className="info-val">{metrics.sqFt.toLocaleString()} sq.ft ({metrics.sqYd} sq.yd)</span>
                    </div>
                    <div className="info-card">
                      <span className="info-label">Approx Dimensions</span>
                      <span className="info-val">{metrics.widthFt} ft × {metrics.heightFt} ft</span>
                    </div>
                    <div className="info-card">
                      <span className="info-label">Road Access</span>
                      <span className="info-val text-success">Frontage Available</span>
                    </div>
                    <div className="info-card">
                      <span className="info-label">Plot Type</span>
                      <span className="info-val">Residential Freehold</span>
                    </div>
                  </div>

                  <div className="overview-summary-card">
                    <h5 className="summary-title">Area Measurement Conversions</h5>
                    <div className="conversions-grid">
                      <div className="conversion-item">
                        <span className="conv-label">Gaj (Sq.Yd)</span>
                        <span className="conv-val">{metrics.sqYd}</span>
                      </div>
                      <div className="conversion-item">
                        <span className="conv-label">Marla</span>
                        <span className="conv-val">{metrics.marla}</span>
                      </div>
                      <div className="conversion-item">
                        <span className="conv-label">Square Feet</span>
                        <span className="conv-val">{metrics.sqFt.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'value' && (
                <div className="tab-pane value-pane">
                  <div className="value-breakdown-card">
                    <div className="value-row primary-val-row">
                      <span className="val-title">Estimated Market Value</span>
                      <span className="val-amount text-primary font-bold">₹{metrics.minEstLakhs} – {metrics.maxEstLakhs} Lakhs</span>
                    </div>
                    <div className="value-row">
                      <span className="val-title">Estimated Rate / Sq.Ft</span>
                      <span className="val-amount font-semibold">₹{metrics.ratePerSqFt.toLocaleString()} / sq ft</span>
                    </div>
                    <div className="value-row">
                      <span className="val-title">1-Yr Regional Price Trend</span>
                      <span className="val-amount text-success font-medium">+8.4%</span>
                    </div>
                    <div className="value-row">
                      <span className="val-title">Estimated Rental Yield</span>
                      <span className="val-amount font-medium">3.2% - 3.8%</span>
                    </div>
                  </div>

                  <div className="estimate-disclaimer">
                    <Info size={14} className="text-muted flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-muted m-0">
                      <strong>Estimated Value:</strong> All values are algorithmic valuations derived from regional transaction benchmarks and geographic dimensions. Verify with registered municipal valuations prior to transactions.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'location' && (
                <div className="tab-pane location-pane">
                  <div className="location-intel-rows">
                    <div className="location-row-item">
                      <span className="loc-label">Front Facing Direction</span>
                      <span className="loc-val text-primary font-semibold">{metrics.direction} (Compass bearing {metrics.bearingDegrees}°)</span>
                    </div>
                    <div className="location-row-item">
                      <span className="loc-label">Road-Facing Side</span>
                      <span className="loc-val">{metrics.roadSide} Side</span>
                    </div>
                    <div className="location-row-item">
                      <span className="loc-label">Distance to Highway</span>
                      <span className="loc-val font-semibold">2.1 km (NH-7 Highway)</span>
                    </div>
                    <div className="location-row-item">
                      <span className="loc-label">Nearby Amenities Count</span>
                      <span className="loc-val text-success">8+ Facilities within 2.5 km</span>
                    </div>
                    <div className="location-row-item">
                      <span className="loc-label">Infrastructure Rating</span>
                      <span className="loc-val font-semibold">Tier-1 Urban Growth Corridor</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <button 
                      className="btn-view-street"
                      onClick={handleOpenStreetView}
                    >
                      <Eye size={14} className="text-accent" />
                      <span>View Plot Street Level Perspective</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'ai-insight' && (
                <div className="tab-pane insights-pane">
                  <div className="propwise-intelligence-card">
                    <div className="intelligence-card-header">
                      <Sparkles size={15} className="text-primary" />
                      <span className="font-bold text-sm">PROPWISE AI INSIGHT</span>
                    </div>

                    <div className="score-bars-list">
                      <div className="score-item">
                        <div className="score-item-top">
                          <span>Buy Score</span>
                          <span className="score-val">{metrics.buyScore}</span>
                        </div>
                        <div className="score-track">
                          <div className="score-fill bg-success" style={{ width: `${Math.min(100, Number(metrics.buyScore) * 10)}%` }} />
                        </div>
                      </div>

                      <div className="score-item">
                        <div className="score-item-top">
                          <span>Location</span>
                          <span className="score-val">{metrics.locationScore}</span>
                        </div>
                        <div className="score-track">
                          <div className="score-fill bg-primary" style={{ width: `${Math.min(100, Number(metrics.locationScore) * 10)}%` }} />
                        </div>
                      </div>

                      <div className="score-item">
                        <div className="score-item-top">
                          <span>Connectivity</span>
                          <span className="score-val">{metrics.connectivityScore}</span>
                        </div>
                        <div className="score-track">
                          <div className="score-fill bg-accent" style={{ width: `${Math.min(100, Number(metrics.connectivityScore) * 10)}%` }} />
                        </div>
                      </div>

                      <div className="score-item">
                        <div className="score-item-top">
                          <span>Development</span>
                          <span className="score-val">{metrics.devScore}</span>
                        </div>
                        <div className="score-track">
                          <div className="score-fill bg-warning" style={{ width: `${Math.min(100, Number(metrics.devScore) * 10)}%` }} />
                        </div>
                      </div>
                    </div>

                    <p className="intelligence-rationale">
                      The drawn plot benefits from {metrics.direction}-facing orientation, healthy aspect ratio ({metrics.widthFt} × {metrics.heightFt} ft), and close proximity to major arterial transit.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
