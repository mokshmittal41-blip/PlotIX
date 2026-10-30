import { PenTool, Check, RotateCcw, Trash2, X } from 'lucide-react';
import { useMapContext } from '../../context/MapContext';

export default function DrawPropertyTool() {
  const { 
    isDrawingMode, setIsDrawingMode,
    drawingPoints, setDrawingPoints,
    isPolygonComplete, setIsPolygonComplete,
    mapInstance,
    snapEnabled, setSnapEnabled,
  } = useMapContext();

  const handleUndo = () => {
    if (drawingPoints.length > 0) {
      setDrawingPoints(drawingPoints.slice(0, -1));
    }
  };

  const handleClear = () => {
    setDrawingPoints([]);
  };

  const handleFinish = () => {
    if (drawingPoints.length >= 3) {
      setIsPolygonComplete(true);
      setIsDrawingMode(false);
      
      // Auto-fit bounds
      if (mapInstance) {
        const lats = drawingPoints.map(p => p[0]);
        const lngs = drawingPoints.map(p => p[1]);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);
        
        const latPad = (maxLat - minLat) * 0.2;
        const lngPad = (maxLng - minLng) * 0.2;
        
        mapInstance.fitBounds([
          [minLat - latPad, minLng - lngPad],
          [maxLat + latPad, maxLng + lngPad]
        ], { padding: [50, 50], maxZoom: 19 });
      }
    }
  };

  const handleCancel = () => {
    setIsDrawingMode(false);
    setDrawingPoints([]);
    setIsPolygonComplete(false);
  };

  const handleStartDraw = () => {
    setIsDrawingMode(true);
    setDrawingPoints([]);
    setIsPolygonComplete(false);
  };

  // If already completed with polygon points, SelectedPropertyPanel is active
  if (isPolygonComplete && drawingPoints.length >= 3) {
    return null;
  }

  // If drawing mode is off, show a floating "Draw Property" button
  if (!isDrawingMode) {
    return (
      <div className="draw-toolbar-wrapper">
        <button 
          type="button" 
          className="draw-start-floating-btn"
          onClick={handleStartDraw}
          title="Start drawing property plot"
        >
          <PenTool size={15} />
          <span>Draw Property Plot</span>
        </button>
      </div>
    );
  }

  return (
    <div className="draw-toolbar-wrapper">
      <div className="draw-property-toolbar-card" role="toolbar" aria-label="Property Drawing Controls">
        {/* Row 1: Actions & Tools */}
        <div className="draw-toolbar-actions-row">
          {/* Mode / Point Count Indicator */}
          <div className="draw-toolbar-title" title={`${drawingPoints.length} points added`}>
            <PenTool size={13} className="draw-toolbar-icon" />
            <span className="pts-count">{drawingPoints.length > 0 ? `${drawingPoints.length} pts` : 'Draw'}</span>
          </div>

          <div className="draw-toolbar-divider" />

          {/* Undo button */}
          <button 
            type="button"
            className="draw-toolbar-btn undo-btn"
            onClick={handleUndo}
            disabled={drawingPoints.length === 0}
            title="Undo last point"
          >
            <RotateCcw size={13} />
            <span>Undo</span>
          </button>

          <div className="draw-toolbar-divider" />

          {/* Clear button */}
          <button 
            type="button"
            className="draw-toolbar-btn clear-btn"
            onClick={handleClear}
            disabled={drawingPoints.length === 0}
            title="Clear all points"
          >
            <Trash2 size={13} />
            <span>Clear</span>
          </button>

          <div className="draw-toolbar-divider" />

          {/* Snap to Edge toggle */}
          <label className="draw-toolbar-snap" title="Snap to nearby boundaries">
            <input 
              type="checkbox" 
              checked={snapEnabled} 
              onChange={(e) => setSnapEnabled(e.target.checked)} 
            />
            <span>Snap</span>
          </label>

          <div className="draw-toolbar-divider" />

          {/* Cancel button */}
          <button 
            type="button"
            className="draw-toolbar-btn cancel-btn"
            onClick={handleCancel}
            title="Cancel drawing"
          >
            <X size={13} />
            <span>Cancel</span>
          </button>
        </div>

        {/* Row 2: Prominent Finish Button underneath */}
        <button 
          type="button"
          className={`draw-toolbar-finish-row-btn ${drawingPoints.length >= 3 ? 'ready' : 'disabled'}`}
          onClick={handleFinish}
          disabled={drawingPoints.length < 3}
          title={drawingPoints.length < 3 ? "Click at least 3 points on the map to complete polygon" : "Finish drawing"}
        >
          <Check size={15} />
          <span>
            {drawingPoints.length >= 3 
              ? `Finish Property Plot (${drawingPoints.length} points)` 
              : `Add at least 3 points (${drawingPoints.length}/3)`}
          </span>
        </button>
      </div>
    </div>
  );
}
