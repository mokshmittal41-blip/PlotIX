import { Check, Sparkles, Building2, Layers } from 'lucide-react';
import type { NakshaConfiguration, FloorOption, FutureExpansion } from '../types';

interface Props {
  config: NakshaConfiguration;
  onChange: (updates: Partial<NakshaConfiguration>) => void;
}

const FLOOR_OPTIONS: Array<{ id: FloorOption; floors: string; title: string; desc: string }> = [
  { id: 'Single Floor', floors: '1', title: 'Ground Floor', desc: 'Single level living' },
  { id: 'G+1', floors: 'G+1', title: '2 Floors', desc: 'Duplex / Independent living' },
  { id: 'G+2', floors: 'G+2', title: '3 Floors', desc: 'Multi-generation residence' },
  { id: 'G+3', floors: 'G+3', title: '4 Floors', desc: 'Maximum built-up utilization' }
];

const EXPANSION_CHOICES: Array<{ id: FutureExpansion; title: string; desc: string }> = [
  { id: 'Yes', title: 'Yes, Plan Expansion', desc: 'AI reserves staircase & column space for future floors' },
  { id: 'No', title: 'Current Footprint Only', desc: 'Maximize present floor area without structural reserves' },
  { id: 'Let AI decide', title: '✨ Let AI Decide', desc: 'Balanced structural efficiency with flexible rooftop access' }
];

export default function HomeStep({ config, onChange }: Props) {
  const home = config.home;

  const updateHome = (updates: Partial<typeof home>) => {
    onChange({ home: { ...home, ...updates } });
  };

  const isMultiStory = home.floors !== 'Single Floor';

  return (
    <div className="naksha-step-body animate-fadeIn">
      <div className="step-intro-header">
        <span className="step-tag">STEP 02</span>
        <h2 className="step-main-title">How do you want to build?</h2>
        <p className="step-sub-title">Choose the scale, number of floors, and structural expansion for your home.</p>
      </div>

      {/* Floors Selector */}
      <div className="form-section-card">
        <label className="section-label">
          <Building2 size={15} className="text-primary mr-1" />
          Number of Floors
        </label>
        
        <div className="floors-card-grid">
          {FLOOR_OPTIONS.map(opt => {
            const isSelected = home.floors === opt.id;
            return (
              <div 
                key={opt.id}
                className={`floor-choice-card ${isSelected ? 'selected' : ''}`}
                onClick={() => updateHome({ floors: opt.id })}
              >
                <div className="floor-level-badge">{opt.floors}</div>
                <div className="floor-text-wrap">
                  <h4 className="floor-title">{opt.title}</h4>
                  <p className="floor-desc">{opt.desc}</p>
                </div>
                {isSelected && <span className="check-indicator"><Check size={14} /></span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Future Expansion */}
      <div className="form-section-card">
        <label className="section-label">
          <Layers size={15} className="text-primary mr-1" />
          Do you want to keep space for future expansion?
        </label>
        
        <div className="expansion-options-list">
          {EXPANSION_CHOICES.map(choice => {
            const isSelected = home.futureExpansion === choice.id;
            return (
              <div 
                key={choice.id}
                className={`expansion-card ${isSelected ? 'selected' : ''}`}
                onClick={() => updateHome({ futureExpansion: choice.id })}
              >
                <div className="radio-circle">
                  {isSelected && <div className="radio-dot" />}
                </div>
                <div className="expansion-info">
                  <span className="expansion-title">{choice.title}</span>
                  <span className="expansion-desc">{choice.desc}</span>
                </div>
                {choice.id === 'Let AI decide' && (
                  <span className="ai-chip-tag">
                    <Sparkles size={11} /> AI Smart
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Conditional: Staircase Placement Preference if Multi-Story */}
      {isMultiStory && (
        <div className="form-section-card animate-fadeIn">
          <label className="section-label">Staircase Access Style</label>
          <div className="segmented-control-3">
            {(['Internal', 'External', 'AI decides'] as const).map(style => {
              const isSelected = home.staircaseType === style;
              return (
                <button
                  key={style}
                  type="button"
                  className={`segment-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => updateHome({ staircaseType: style })}
                >
                  {style === 'Internal' && 'Internal (Duplex)'}
                  {style === 'External' && 'External (Independent)'}
                  {style === 'AI decides' && '✨ Let AI Decide'}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
