import { 
  RotateCcw, Trash2, ChevronRight, X, MapPin, Ruler, Calculator
} from 'lucide-react';
import { useMapContext, type Point } from '../../context/MapContext';
import { useApp } from '../../context/AppContext';
import { useState, useMemo } from 'react';
import * as turf from '@turf/turf';

export default function SelectedPropertyPanel() {
  const { 
    drawingPoints, 
    isPolygonComplete,
    setIsPolygonComplete, 
    setIsDrawingMode, 
    setDrawingPoints,
    selectedLocation
  } = useMapContext();

  const { setImportedPlot } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Calculate polygon metrics using Turf.js
  const metrics = useMemo(() => {
    if (drawingPoints.length < 3) return null;
    try {
      const ring = [...drawingPoints.map((p: Point) => [p[1], p[0]]), [drawingPoints[0][1], drawingPoints[0][0]]];
      const polygon = turf.polygon([ring]);
      
      const areaSqMeters = turf.area(polygon);
      const perimeterMeters = turf.length(polygon, { units: 'meters' });

      // Constants:
      // sq.ft = sq.m / 0.092903
      const exactSqFt = areaSqMeters / 0.092903;
      const sqYards = exactSqFt / 9;
      const perimeterFeet = perimeterMeters * 3.28084;

      const marla = exactSqFt / 272.25;
      const kanal = exactSqFt / 5445;
      const acre = exactSqFt / 43560;
      const hectare = exactSqFt / 107639.104;
      const bighaPb = exactSqFt / 21780;
      const biswa = exactSqFt / 1361.25;

      // Estimated rate ~₹1,850/sq.ft
      const estimatedValueLakhs = ((exactSqFt * 1850) / 100000).toFixed(1);

      return {
        sqYards: Math.round(sqYards),
        sqFt: Math.round(exactSqFt),
        perimeter: Math.round(perimeterFeet),
        perimeterMeters: Math.round(perimeterMeters),
        marla,
        kanal,
        acre,
        hectare,
        bighaPb,
        biswa,
        sqMeters: areaSqMeters,
        sqYd: sqYards,
        estimatedValueLakhs
      };
    } catch (e) {
      console.error("Error calculating polygon metrics", e);
      return null;
    }
  }, [drawingPoints]);

  // ONLY render when user has explicitly finished drawing (isPolygonComplete === true)
  if (!isPolygonComplete || drawingPoints.length < 3 || !metrics) return null;

  const handleRedraw = () => {
    setDrawingPoints([]);
    setIsPolygonComplete(false);
    setIsDrawingMode(true);
  };

  const handleClear = () => {
    setDrawingPoints([]);
    setIsPolygonComplete(false);
    setIsDrawingMode(false);
  };

  const handleOpenCalculator = () => {
    if (setImportedPlot) {
      setImportedPlot({
        areaSqYd: Math.round(metrics.sqYd),
        perimeter: metrics.perimeter,
        polygon: drawingPoints,
        location: selectedLocation?.name || 'Selected Map Plot'
      });
    }
    window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'land-calculator' }));
  };

  if (isCollapsed) {
    return (
      <div 
        className="land-details-collapsed-badge"
        onClick={() => setIsCollapsed(false)}
        title="Click to view plot details"
      >
        <div className="green-status-dot" />
        <span className="collapsed-text">
          {metrics.marla.toFixed(2)} Marla · {metrics.acre.toFixed(3)} Acre ({metrics.sqYards} Gaj)
        </span>
        <ChevronRight size={16} />
      </div>
    );
  }

  return (
    <div className="land-details-new-div card">
      {/* 1. Header Bar */}
      <div className="land-details-header">
        <div className="header-left">
          <div className="header-icon-box">
            <Ruler size={18} />
          </div>
          <div>
            <h3 className="header-title">Land Measurement Details</h3>
            <div className="header-location">
              <MapPin size={12} />
              <span>{selectedLocation?.name || 'Selected Plot Area'}</span>
            </div>
          </div>
        </div>

        <button 
          className="close-panel-btn" 
          onClick={() => setIsCollapsed(true)} 
          title="Minimize Details"
        >
          <X size={16} />
        </button>
      </div>

      {/* 2. Primary Highlight Row: Marla & Acre */}
      <div className="land-hero-metrics-row">
        <div className="hero-metric-card primary-marla">
          <div className="metric-label">Marle (Marla)</div>
          <div className="metric-value">
            {metrics.marla.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Standard Punjab/HR (272.25 sq.ft)</div>
        </div>

        <div className="hero-metric-card primary-acre">
          <div className="metric-label">Acre / Killa</div>
          <div className="metric-value">
            {metrics.acre.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 4 })}
          </div>
          <div className="metric-sub">43,560 sq.ft</div>
        </div>
      </div>

      {/* 3. Full Units Grid: Kanal, Gaj, Sq.Ft, Bigha, Sq.Metres, Hectare */}
      <div className="land-units-grid-title">All Land Conversions</div>
      <div className="land-units-grid">
        <div className="unit-card">
          <span className="unit-title">Kanal</span>
          <span className="unit-number">{metrics.kanal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>

        <div className="unit-card">
          <span className="unit-title">Gaj (Sq. Yards)</span>
          <span className="unit-number">{metrics.sqYards.toLocaleString('en-IN')}</span>
        </div>

        <div className="unit-card">
          <span className="unit-title">Square Feet</span>
          <span className="unit-number">{metrics.sqFt.toLocaleString('en-IN')}</span>
        </div>

        <div className="unit-card">
          <span className="unit-title">Bigha (PB)</span>
          <span className="unit-number">{metrics.bighaPb.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}</span>
        </div>

        <div className="unit-card">
          <span className="unit-title">Sq. Metres</span>
          <span className="unit-number">{metrics.sqMeters.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
        </div>

        <div className="unit-card">
          <span className="unit-title">Hectare</span>
          <span className="unit-number">{metrics.hectare.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</span>
        </div>
      </div>

      {/* 4. Perimeter & Boundary Stats */}
      <div className="land-stats-strip">
        <div className="stat-pill">
          <span className="stat-label">Total Perimeter:</span>
          <span className="stat-val">{metrics.perimeter.toLocaleString('en-IN')} ft ({metrics.perimeterMeters} m)</span>
        </div>
        <div className="stat-pill">
          <span className="stat-label">Boundary Dots:</span>
          <span className="stat-val">{drawingPoints.length} Green Dots</span>
        </div>
      </div>

      {/* 5. Action Buttons */}
      <div className="land-actions-row">
        <button 
          className="btn-calc-action"
          onClick={handleOpenCalculator}
          title="Open Stamp Duty & Land Value Calculator"
        >
          <Calculator size={14} />
          <span>Stamp Duty & Valuation</span>
        </button>

        <button 
          className="btn-secondary-action"
          onClick={handleRedraw}
          title="Redraw Boundary"
        >
          <RotateCcw size={13} />
          <span>Redraw</span>
        </button>

        <button 
          className="btn-clear-action"
          onClick={handleClear}
          title="Clear Boundary"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
