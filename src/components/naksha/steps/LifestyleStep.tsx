import { 
  Sun, Wind, Lock, Maximize2, TreePine, 
  Car, Users, Briefcase, Sparkles, Check, 
  IndianRupee, Compass 
} from 'lucide-react';
import type { 
  NakshaConfiguration, 
  VastuPreference, 
  LightLevel, 
  VentilationLevel, 
  BudgetRange 
} from '../types';

interface Props {
  config: NakshaConfiguration;
  onChange: (updates: Partial<NakshaConfiguration>) => void;
}

const LIFESTYLE_PRIORITIES: Array<{ id: string; title: string; desc: string; icon: any }> = [
  { id: 'Natural Light', title: 'Natural Light', desc: 'Maximum daylight & window placement', icon: Sun },
  { id: 'Cross Ventilation', title: 'Cross Ventilation', desc: 'Fresh continuous airflow through rooms', icon: Wind },
  { id: 'Privacy', title: 'Zoned Privacy', desc: 'Bedrooms isolated from guest traffic', icon: Lock },
  { id: 'Spacious Living', title: 'Spacious Living', desc: 'Expansive open social & dining zones', icon: Maximize2 },
  { id: 'Open Space', title: 'Green / Open Area', desc: 'Courtyards, sit-outs & green pockets', icon: TreePine },
  { id: 'Easy Parking', title: 'Easy Parking', desc: 'Direct wide driveway & vehicle clearance', icon: Car },
  { id: 'Family Friendly', title: 'Family Friendly', desc: 'Interconnected family lounge & play areas', icon: Users },
  { id: 'Work From Home', title: 'Work From Home', desc: 'Quiet, acoustically shielded work corner', icon: Briefcase }
];

const BUDGET_RANGES: BudgetRange[] = [
  '₹20–30L', '₹30–50L', '₹50–75L', '₹75L–1Cr', '₹1Cr+', 'Not decided'
];

export default function LifestyleStep({ config, onChange }: Props) {
  const lifestyle = config.lifestyle;

  const updateLifestyle = (updates: Partial<typeof lifestyle>) => {
    onChange({ lifestyle: { ...lifestyle, ...updates } });
  };

  const togglePriority = (pId: string) => {
    const current = lifestyle.priorities;
    if (current.includes(pId)) {
      updateLifestyle({ priorities: current.filter(id => id !== pId) });
    } else {
      if (current.length < 4) {
        updateLifestyle({ priorities: [...current, pId] });
      }
    }
  };

  return (
    <div className="naksha-step-body animate-fadeIn">
      <div className="step-intro-header">
        <span className="step-tag">STEP 04</span>
        <h2 className="step-main-title">How do you want your home to feel?</h2>
        <p className="step-sub-title">Choose what matters most. Our AI engine will optimize the layout around your priorities.</p>
      </div>

      {/* Priorities Selection (Max 4) */}
      <div className="form-section-card">
        <div className="section-header-flex">
          <label className="section-label">
            <Sparkles size={15} className="text-primary mr-1" />
            Top Priorities
          </label>
          <span className="selection-counter-badge">
            {lifestyle.priorities.length} / 4 Selected
          </span>
        </div>

        <div className="priorities-grid">
          {LIFESTYLE_PRIORITIES.map(item => {
            const isSelected = lifestyle.priorities.includes(item.id);
            const Icon = item.icon;
            const isDisabled = !isSelected && lifestyle.priorities.length >= 4;

            return (
              <div 
                key={item.id}
                className={`priority-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                onClick={() => togglePriority(item.id)}
              >
                <div className="priority-icon-wrap">
                  <Icon size={18} />
                </div>
                <div className="priority-details">
                  <h4 className="priority-title">{item.title}</h4>
                  <p className="priority-desc">{item.desc}</p>
                </div>
                {isSelected && <span className="check-badge-small"><Check size={12} /></span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Vastu Planning Preference */}
      <div className="form-section-card">
        <label className="section-label">
          <Compass size={15} className="text-primary mr-1" />
          Vastu Planning Preference
        </label>

        <div className="vastu-choices-grid">
          {([
            { id: 'No preference', title: 'Modern Flow (No Vastu)', desc: 'Pure architectural & space optimization' },
            { id: 'Vastu-friendly', title: 'Vastu-Friendly (Recommended)', desc: 'Major zones (Kitchen, Master Bed, Puja) aligned' },
            { id: 'Strong Vastu preference', title: 'Strict Vastu Compliant', desc: 'Strict quadrant, entrance, and water source rules' }
          ] as const).map(opt => {
            const isSelected = lifestyle.vastu === opt.id;
            return (
              <div 
                key={opt.id}
                className={`vastu-choice-card ${isSelected ? 'selected' : ''}`}
                onClick={() => updateLifestyle({ vastu: opt.id as VastuPreference })}
              >
                <div className="radio-circle">
                  {isSelected && <div className="radio-dot" />}
                </div>
                <div className="vastu-text">
                  <span className="vastu-title">{opt.title}</span>
                  <span className="vastu-desc">{opt.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Light & Ventilation Sliders */}
      <div className="form-section-card">
        <label className="section-label">Light & Air Circulation Focus</label>
        
        <div className="two-col-controls">
          <div className="control-box">
            <span className="control-title">
              <Sun size={13} className="text-accent" /> Natural Light Target
            </span>
            <div className="segmented-control-3">
              {(['Standard', 'Balanced', 'Maximum'] as LightLevel[]).map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  className={`segment-btn ${lifestyle.naturalLight === lvl ? 'active' : ''}`}
                  onClick={() => updateLifestyle({ naturalLight: lvl })}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="control-box">
            <span className="control-title">
              <Wind size={13} className="text-primary" /> Ventilation Target
            </span>
            <div className="segmented-control-3">
              {(['Standard', 'Cross Ventilation', 'Maximum'] as VentilationLevel[]).map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  className={`segment-btn ${lifestyle.ventilation === lvl ? 'active' : ''}`}
                  onClick={() => updateLifestyle({ ventilation: lvl })}
                >
                  {lvl === 'Cross Ventilation' ? 'Cross Air' : lvl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Construction Budget */}
      <div className="form-section-card">
        <label className="section-label">
          <IndianRupee size={15} className="text-primary mr-1" />
          Approximate Construction Budget
        </label>
        <p className="section-subtext">This helps the AI recommend appropriate structural spans and finishes.</p>

        <div className="budget-chips-grid">
          {BUDGET_RANGES.map(b => {
            const isSelected = lifestyle.budget === b;
            return (
              <button
                key={b}
                type="button"
                className={`budget-chip-btn ${isSelected ? 'active' : ''}`}
                onClick={() => updateLifestyle({ budget: b })}
              >
                {b}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
