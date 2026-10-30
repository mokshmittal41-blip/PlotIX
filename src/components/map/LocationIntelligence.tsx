import { Info } from 'lucide-react';
import { useMapContext } from '../../context/MapContext';
import { useMemo } from 'react';
import * as turf from '@turf/turf';

export default function LocationIntelligence() {
  const { isPolygonComplete, drawingPoints } = useMapContext();

  const metrics = useMemo(() => {
    if (!isPolygonComplete || drawingPoints.length < 3) return null;

    try {
      const ring = [...drawingPoints.map(p => [p[1], p[0]]), [drawingPoints[0][1], drawingPoints[0][0]]];
      const polygon = turf.polygon([ring]);
      
      const areaSqMeters = turf.area(polygon);
      
      // Calculate based on exact constants from prompt
      // sq.ft → sq.m: sqft × 0.092903
      // Therefore, sqft = sq.m / 0.092903
      const exactSqFt = areaSqMeters / 0.092903;
      
      const sqYd = exactSqFt / 9;
      const marla = exactSqFt / 272.25;
      const kanal = exactSqFt / 5445;
      const acre = exactSqFt / 43560;
      const hectare = exactSqFt / 107639.104;

      return {
        sqFt: exactSqFt,
        sqMeters: areaSqMeters,
        sqYd: sqYd,
        marla: marla,
        kanal: kanal,
        acre: acre,
        hectare: hectare
      };
    } catch (e) {
      console.error("Error calculating exact metrics", e);
      return null;
    }
  }, [isPolygonComplete, drawingPoints]);

  if (!isPolygonComplete) return null;

  return (
    <div className="land-measurements-panel card mobile-bottom-sheet">
      <div className="land-measurements-header">
        <h4 className="land-measurements-title">Land Measurements</h4>
        <p className="land-measurements-subtitle">Common Indian land units</p>
      </div>

      <div className="land-measurements-body">
        {!metrics ? (
          <div className="intel-empty" style={{ textAlign: 'center', padding: '16px' }}>
            <p className="text-muted" style={{ fontSize: '13px', margin: 0 }}>Draw a property on the map to see land measurements.</p>
          </div>
        ) : (
          <>
            <div className="land-measurements-grid">
              <div className="measure-card">
                <div className="text-xs text-muted font-medium mb-1">Marla</div>
                <div className="font-semibold text-primary">{metrics.marla.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
              </div>
              
              <div className="measure-card">
                <div className="text-xs text-muted font-medium mb-1">Kanal</div>
                <div className="font-semibold text-primary">{metrics.kanal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
              </div>
              
              <div className="measure-card">
                <div className="text-xs text-muted font-medium mb-1">Acre</div>
                <div className="font-semibold text-primary">{metrics.acre.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
              </div>
              
              <div className="measure-card">
                <div className="text-xs text-muted font-medium mb-1">Hectare</div>
                <div className="font-semibold text-primary">{metrics.hectare.toLocaleString('en-US', {minimumFractionDigits: 4, maximumFractionDigits: 4})}</div>
              </div>
              
              <div className="measure-card">
                <div className="text-xs text-muted font-medium mb-1">Sq.Metre</div>
                <div className="font-semibold text-primary">{metrics.sqMeters.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
              </div>
              
              <div className="measure-card">
                <div className="text-xs text-muted font-medium mb-1">Gaj <span style={{fontSize: '9px'}}>(Sq.Yd)</span></div>
                <div className="font-semibold text-primary">{metrics.sqYd.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
              </div>
            </div>

            <div className="flex align-start gap-2 bg-surface-2 p-3 rounded-lg" style={{ marginTop: '12px' }}>
              <Info size={16} className="text-muted mt-0.5" style={{ flexShrink: 0 }} />
              <p className="text-xs text-muted m-0" style={{ lineHeight: '1.4' }}>
                Conversions are calculated from the selected property's estimated geographic area. 
                <br/><br/>
                Area is estimated from the selected map boundary. Verify dimensions before using for legal or construction purposes.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
