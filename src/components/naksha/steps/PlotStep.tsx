import { Check, Compass } from 'lucide-react';
import type { NakshaConfiguration, PlotShape, RoadFacing } from '../types';

interface Props {
  config: NakshaConfiguration;
  onChange: (updates: Partial<NakshaConfiguration>) => void;
}

const SHAPES: Array<{ id: PlotShape; title: string; desc: string; icon: string }> = [
  { id: 'Rectangle', title: 'Rectangle', desc: 'Standard residential plot', icon: '▭' },
  { id: 'Square', title: 'Square', desc: 'Equal width & depth', icon: '□' },
  { id: 'Irregular', title: 'Irregular', desc: 'Angular or skewed boundary', icon: '╱──╲' }
];

const ROADS: Array<{ id: RoadFacing; title: string; desc: string; iconAngle: string }> = [
  { id: 'North', title: 'North Facing', desc: 'Road on North side', iconAngle: '↑' },
  { id: 'East', title: 'East Facing', desc: 'Morning sun & road on East', iconAngle: '→' },
  { id: 'South', title: 'South Facing', desc: 'Road on South side', iconAngle: '↓' },
  { id: 'West', title: 'West Facing', desc: 'Road on West side', iconAngle: '←' },
  { id: 'Corner Plot', title: 'Corner Plot', desc: 'Dual roads on corner', iconAngle: '↗' },
  { id: 'Two-Side Road', title: 'Two-Side Road', desc: 'Front & rear access', iconAngle: '↕' }
];

export default function PlotStep({ config, onChange }: Props) {
  const plot = config.plot;

  const updatePlot = (updates: Partial<typeof plot>) => {
    const nextPlot = { ...plot, ...updates };
    if (updates.frontageFt || updates.depthFt) {
      const area = Math.round(((nextPlot.frontageFt * nextPlot.depthFt) / 9) * 10) / 10;
      nextPlot.areaSqYd = area;
    }
    onChange({ plot: nextPlot });
  };

  const totalSqFt = (plot.frontageFt || 0) * (plot.depthFt || 0);

  return (
    <div className="naksha-step-body animate-fadeIn">
      <div className="step-intro-header">
        <span className="step-tag">STEP 01</span>
        <h2 className="step-main-title">Let's start with your plot.</h2>
        <p className="step-sub-title">Tell us the basic shape, dimensions, and road orientation of your land.</p>
      </div>

      {/* Plot Shape */}
      <div className="form-section-card">
        <label className="section-label">Plot Shape</label>
        <div className="plot-shape-grid">
          {SHAPES.map(shape => {
            const isSelected = plot.shape === shape.id;
            return (
              <div 
                key={shape.id}
                className={`choice-card ${isSelected ? 'selected' : ''}`}
                onClick={() => updatePlot({ shape: shape.id })}
              >
                <div className="choice-card-header">
                  <span className="shape-icon-symbol">{shape.icon}</span>
                  {isSelected && <span className="check-badge"><Check size={12} /></span>}
                </div>
                <h4 className="choice-title">{shape.title}</h4>
                <p className="choice-desc">{shape.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dimensions & Live Visualization */}
      <div className="form-section-card">
        <label className="section-label">Plot Dimensions</label>
        
        {/* Interactive Dimension Box */}
        <div className="plot-visual-canvas">
          <div className="plot-diagram-box">
            <span className="dim-badge top-dim">{plot.frontageFt} ft width</span>
            <span className="dim-badge left-dim">{plot.depthFt} ft depth</span>
            
            <div className="plot-inner-fill">
              <span className="plot-area-label">{totalSqFt.toLocaleString()} sq ft</span>
              <span className="plot-sqyd-label">({plot.areaSqYd} sq yd)</span>
            </div>
            
            <div className={`road-border-indicator road-${plot.roadFacing.toLowerCase().replace(/\s+/g, '-')}`}>
              <span className="road-text">ROAD ACCESS</span>
            </div>
          </div>
        </div>

        <div className="dimension-inputs-row">
          <div className="dim-input-group">
            <span className="dim-label">Frontage (Width)</span>
            <div className="numeric-input-wrap">
              <input 
                type="number"
                min={10}
                max={250}
                value={plot.frontageFt || ''}
                onChange={(e) => updatePlot({ frontageFt: Number(e.target.value) || 0 })}
                placeholder="Width in ft"
              />
              <span className="unit-suffix">ft</span>
            </div>
          </div>

          <div className="dim-separator">×</div>

          <div className="dim-input-group">
            <span className="dim-label">Depth (Length)</span>
            <div className="numeric-input-wrap">
              <input 
                type="number"
                min={15}
                max={400}
                value={plot.depthFt || ''}
                onChange={(e) => updatePlot({ depthFt: Number(e.target.value) || 0 })}
                placeholder="Length in ft"
              />
              <span className="unit-suffix">ft</span>
            </div>
          </div>
        </div>
      </div>

      {/* Road Facing / Orientation */}
      <div className="form-section-card">
        <div className="section-header-flex">
          <label className="section-label">
            <Compass size={15} className="text-primary mr-1" />
            Which side faces the road?
          </label>
        </div>

        <div className="road-facing-grid">
          {ROADS.map(road => {
            const isSelected = plot.roadFacing === road.id;
            return (
              <button
                key={road.id}
                type="button"
                className={`road-chip-btn ${isSelected ? 'active' : ''}`}
                onClick={() => updatePlot({ roadFacing: road.id })}
              >
                <span className="road-dir-arrow">{road.iconAngle}</span>
                <span className="road-dir-name">{road.title}</span>
                {isSelected && <Check size={13} className="ml-auto text-primary" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
