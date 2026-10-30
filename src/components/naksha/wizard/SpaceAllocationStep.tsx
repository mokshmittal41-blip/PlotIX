import { 
  Plus, Minus, Layers, CheckCircle2, AlertCircle 
} from 'lucide-react';
import type { PlotGeometry, RoomRequirement, RoomCategory } from '../geometry/types';

interface Props {
  plot: PlotGeometry;
  requirements: RoomRequirement[];
  onUpdateRequirements: (reqs: RoomRequirement[]) => void;
}

const PRESETS: Record<RoomCategory, { compact: [number, number]; standard: [number, number]; spacious: [number, number] }> = {
  master_bedroom: { compact: [12, 11], standard: [14, 12], spacious: [16, 14] },
  bedroom: { compact: [11, 10], standard: [12, 11], spacious: [14, 12] },
  living: { compact: [14, 12], standard: [16, 14], spacious: [20, 16] },
  dining: { compact: [10, 8], standard: [12, 10], spacious: [14, 12] },
  kitchen: { compact: [8, 8], standard: [10, 10], spacious: [12, 12] },
  bathroom: { compact: [6, 4.5], standard: [7, 5.5], spacious: [9, 6.5] },
  puja: { compact: [5, 4], standard: [6, 6], spacious: [8, 6] },
  study: { compact: [8, 8], standard: [10, 10], spacious: [12, 11] },
  store: { compact: [6, 4], standard: [8, 6], spacious: [10, 7] },
  utility: { compact: [6, 4], standard: [8, 5], spacious: [10, 6] },
  balcony: { compact: [8, 4], standard: [10, 4.5], spacious: [14, 5] },
  parking: { compact: [10, 15], standard: [12, 16], spacious: [14, 18] },
  entrance: { compact: [8, 5], standard: [10, 6], spacious: [12, 8] },
  staircase: { compact: [7, 12], standard: [8, 14], spacious: [9, 16] },
  garden: { compact: [10, 8], standard: [12, 10], spacious: [16, 12] },
  veranda: { compact: [10, 5], standard: [12, 6], spacious: [14, 8] },
  ots: { compact: [3, 3], standard: [3.5, 4], spacious: [4, 5] },
  custom: { compact: [8, 8], standard: [10, 10], spacious: [12, 12] }
};

export default function SpaceAllocationStep({
  plot,
  requirements,
  onUpdateRequirements
}: Props) {
  const usableWidth = Math.max(0, plot.width - (plot.setbacks.left + plot.setbacks.right));
  const usableDepth = Math.max(0, plot.depth - (plot.setbacks.front + plot.setbacks.rear));
  const usableArea = usableWidth * usableDepth;

  const totalAllocatedArea = requirements.reduce(
    (sum, r) => sum + (r.widthFt * r.heightFt * (r.count || 1)),
    0
  );

  const coveragePercent = Math.round((totalAllocatedArea / usableArea) * 100);

  const handleDimensionChange = (id: string, field: 'widthFt' | 'heightFt', val: number) => {
    const safeVal = Math.max(4, Math.min(60, val));
    onUpdateRequirements(
      requirements.map(r => r.id === id ? { ...r, [field]: safeVal, preset: 'custom' } : r)
    );
  };

  const handleApplyPreset = (id: string, category: RoomCategory, presetType: 'compact' | 'standard' | 'spacious') => {
    const config = PRESETS[category] || PRESETS.custom;
    const [w, h] = config[presetType];
    onUpdateRequirements(
      requirements.map(r => r.id === id ? { ...r, widthFt: w, heightFt: h, preset: presetType } : r)
    );
  };

  return (
    <div className="animate-fadeIn">
      
      {/* ─── Header ───────────────────────────────────────────────────────────── */}
      <div className="step-intro-header">
        <div>
          <span className="step-pill-tag">Step 02 of 03 • Space Allocation</span>
        </div>
        <h2 className="step-main-title">How much space should each area get?</h2>
        <p className="step-sub-desc">
          Adjust the width and height of each room. Pick from standard architectural presets or customize exact dimensions in feet.
        </p>
      </div>

      {/* ─── Usable Area Utilization Meter ────────────────────────────────────── */}
      <div className="allocation-meter-card">
        <div className="allocation-meter-header">
          <div className="allocation-meter-title">
            <Layers size={16} color="#2563eb" />
            <span>Total Building Footprint</span>
          </div>
          <span className="plot-area-badge">
            {totalAllocatedArea.toLocaleString()} / {usableArea.toLocaleString()} sq ft ({coveragePercent}%)
          </span>
        </div>

        <div className="allocation-track">
          <div 
            className={`allocation-progress-fill ${coveragePercent > 100 ? 'warning' : ''}`}
            style={{ width: `${Math.min(100, coveragePercent)}%` }}
          />
        </div>

        <div className="allocation-meter-footer">
          <span>Envelope Coverage: {coveragePercent}%</span>
          {coveragePercent > 100 ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#d97706', fontWeight: 700 }}>
              <AlertCircle size={13} /> May require multi-floor G+1 layout
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#16a34a', fontWeight: 700 }}>
              <CheckCircle2 size={13} /> Perfectly sized for single-floor footprint
            </span>
          )}
        </div>
      </div>

      {/* ─── Space Cards List ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
        {requirements.map((req) => {
          const area = Math.round(req.widthFt * req.heightFt * 10) / 10;
          const totalRoomArea = req.count > 1 ? area * req.count : area;

          return (
            <div key={req.id} className="alloc-room-card">
              
              {/* Left Title & Info */}
              <div className="alloc-room-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 className="alloc-room-title">{req.name}</h4>
                  {req.count > 1 && (
                    <span style={{ fontSize: '11px', background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '9999px', fontWeight: 800 }}>
                      × {req.count}
                    </span>
                  )}
                </div>
                <div className="alloc-room-area-pill">
                  <span>{area} sq ft</span>
                  {req.count > 1 && <span style={{ color: '#64748b', marginLeft: '6px' }}>(Total: {totalRoomArea} sq ft)</span>}
                </div>
              </div>

              {/* Middle Dimension Adjusters */}
              <div className="alloc-dim-controls">
                {/* Width control */}
                <div className="dim-input-group">
                  <span className="dim-label">W:</span>
                  <button
                    type="button"
                    className="dim-btn-stepper"
                    onClick={() => handleDimensionChange(req.id, 'widthFt', req.widthFt - 1)}
                  >
                    <Minus size={13} />
                  </button>
                  <input
                    type="number"
                    min={4}
                    max={60}
                    value={req.widthFt}
                    onChange={(e) => handleDimensionChange(req.id, 'widthFt', parseFloat(e.target.value) || 4)}
                  />
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, paddingRight: '4px' }}>ft</span>
                  <button
                    type="button"
                    className="dim-btn-stepper"
                    onClick={() => handleDimensionChange(req.id, 'widthFt', req.widthFt + 1)}
                  >
                    <Plus size={13} />
                  </button>
                </div>

                <span style={{ color: '#94a3b8', fontWeight: 800 }}>×</span>

                {/* Height control */}
                <div className="dim-input-group">
                  <span className="dim-label">H:</span>
                  <button
                    type="button"
                    className="dim-btn-stepper"
                    onClick={() => handleDimensionChange(req.id, 'heightFt', req.heightFt - 1)}
                  >
                    <Minus size={13} />
                  </button>
                  <input
                    type="number"
                    min={4}
                    max={60}
                    value={req.heightFt}
                    onChange={(e) => handleDimensionChange(req.id, 'heightFt', parseFloat(e.target.value) || 4)}
                  />
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, paddingRight: '4px' }}>ft</span>
                  <button
                    type="button"
                    className="dim-btn-stepper"
                    onClick={() => handleDimensionChange(req.id, 'heightFt', req.heightFt + 1)}
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              {/* Right Presets: Compact / Standard / Spacious */}
              <div className="alloc-presets-group">
                {(['compact', 'standard', 'spacious'] as const).map(p => {
                  const isActive = req.preset === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      className={`alloc-preset-btn ${isActive ? 'active' : ''}`}
                      onClick={() => handleApplyPreset(req.id, req.category, p)}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
