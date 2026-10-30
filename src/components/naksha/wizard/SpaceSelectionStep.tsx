import { useState } from 'react';
import { 
  Bed, Sofa, UtensilsCrossed, Bath, Sparkles, 
  BookOpen, Archive, Waves, Car, DoorOpen, 
  Maximize, Trees, Plus, Minus, Compass, Check
} from 'lucide-react';
import type { PlotGeometry, RoomRequirement, RoomCategory } from '../geometry/types';

interface Props {
  plot: PlotGeometry;
  onUpdatePlot: (updates: Partial<PlotGeometry>) => void;
  requirements: RoomRequirement[];
  onUpdateRequirements: (reqs: RoomRequirement[]) => void;
}

interface PredefinedCard {
  category: RoomCategory;
  name: string;
  desc: string;
  defaultW: number;
  defaultH: number;
  icon: any;
  allowCount?: boolean;
}

const AVAILABLE_SPACES: PredefinedCard[] = [
  { category: 'master_bedroom', name: 'Master Bedroom', desc: 'Primary suite with space for king bed & wardrobe', defaultW: 14, defaultH: 12, icon: Bed, allowCount: false },
  { category: 'bedroom', name: 'Bedroom', desc: 'Secondary bedroom for children or guests', defaultW: 12, defaultH: 11, icon: Bed, allowCount: true },
  { category: 'living', name: 'Living Room', desc: 'Main social lounge & entertaining space', defaultW: 16, defaultH: 14, icon: Sofa, allowCount: false },
  { category: 'dining', name: 'Dining Room', desc: 'Dedicated space for family meal dining table', defaultW: 12, defaultH: 10, icon: UtensilsCrossed, allowCount: false },
  { category: 'kitchen', name: 'Kitchen', desc: 'Cooking area with counter, hob & sink', defaultW: 10, defaultH: 10, icon: UtensilsCrossed, allowCount: false },
  { category: 'bathroom', name: 'Bathroom', desc: 'Attached or common toilet & washroom', defaultW: 7, defaultH: 5, icon: Bath, allowCount: true },
  { category: 'puja', name: 'Puja Room', desc: 'Spiritual mandir altar space', defaultW: 6, defaultH: 6, icon: Sparkles, allowCount: false },
  { category: 'study', name: 'Study Room / Home Office', desc: 'Quiet work & reading room with desk', defaultW: 10, defaultH: 10, icon: BookOpen, allowCount: false },
  { category: 'store', name: 'Store Room', desc: 'Storage for household supplies', defaultW: 8, defaultH: 6, icon: Archive, allowCount: false },
  { category: 'utility', name: 'Utility & Washing', desc: 'Washer, dryer & outdoor sink area', defaultW: 8, defaultH: 5, icon: Waves, allowCount: false },
  { category: 'balcony', name: 'Balcony', desc: 'Open sit-out balcony with railing', defaultW: 10, defaultH: 4, icon: Maximize, allowCount: false },
  { category: 'parking', name: 'Car Parking / Porch', desc: 'Covered vehicular parking driveway', defaultW: 12, defaultH: 16, icon: Car, allowCount: false },
  { category: 'entrance', name: 'Entrance Veranda', desc: 'Covered entrance porch & greeting area', defaultW: 10, defaultH: 6, icon: DoorOpen, allowCount: false },
  { category: 'garden', name: 'Garden / Open Courtyard', desc: 'Green landscaped open space', defaultW: 12, defaultH: 10, icon: Trees, allowCount: false }
];

export default function SpaceSelectionStep({
  plot,
  onUpdatePlot,
  requirements,
  onUpdateRequirements
}: Props) {
  const [customName, setCustomName] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  const totalPlotArea = plot.width * plot.depth;
  const usableWidth = Math.max(0, plot.width - (plot.setbacks.left + plot.setbacks.right));
  const usableDepth = Math.max(0, plot.depth - (plot.setbacks.front + plot.setbacks.rear));
  const usableArea = usableWidth * usableDepth;

  const isSelected = (category: RoomCategory) => {
    return requirements.some(r => r.category === category);
  };

  const getCount = (category: RoomCategory) => {
    const item = requirements.find(r => r.category === category);
    return item ? item.count : 0;
  };

  const toggleCategory = (card: PredefinedCard) => {
    if (isSelected(card.category)) {
      onUpdateRequirements(requirements.filter(r => r.category !== card.category));
    } else {
      const newItem: RoomRequirement = {
        id: `req_${card.category}_${Date.now()}`,
        name: card.name,
        category: card.category,
        count: 1,
        widthFt: card.defaultW,
        heightFt: card.defaultH,
        preset: 'standard',
        description: card.desc
      };
      onUpdateRequirements([...requirements, newItem]);
    }
  };

  const adjustCount = (category: RoomCategory, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const existing = requirements.find(r => r.category === category);
    if (!existing) return;

    const nextCount = existing.count + delta;
    if (nextCount <= 0) {
      onUpdateRequirements(requirements.filter(r => r.category !== category));
    } else {
      onUpdateRequirements(
        requirements.map(r => r.category === category ? { ...r, count: nextCount } : r)
      );
    }
  };

  const handleAddCustomSpace = () => {
    if (!customName.trim()) return;
    const newItem: RoomRequirement = {
      id: `req_custom_${Date.now()}`,
      name: customName.trim(),
      category: 'custom',
      count: 1,
      widthFt: 10,
      heightFt: 10,
      preset: 'custom',
      description: 'Custom user-defined room'
    };
    onUpdateRequirements([...requirements, newItem]);
    setCustomName('');
    setShowCustomModal(false);
  };

  return (
    <div className="animate-fadeIn">
      
      {/* ─── Header ───────────────────────────────────────────────────────────── */}
      <div className="step-intro-header">
        <div>
          <span className="step-pill-tag">Step 01 of 03 • Spaces & Plot</span>
        </div>
        <h2 className="step-main-title">What are you planning to build?</h2>
        <p className="step-sub-desc">
          Tell us what spaces you need and your plot dimensions. We'll help you turn them into a practical, architect-ready floor plan.
        </p>
      </div>

      {/* ─── Plot Dimensions & Visualizer Card ───────────────────────────────── */}
      <div className="plot-dim-card">
        <div className="plot-card-header">
          <div className="plot-card-title-group">
            <Compass size={18} color="#2563eb" />
            <span>Plot & Site Boundaries</span>
          </div>
          <span className="plot-area-badge">
            {plot.width} × {plot.depth} ft ({totalPlotArea.toLocaleString()} sq ft)
          </span>
        </div>

        <div className="plot-inputs-grid">
          <div className="plot-input-field">
            <label>Plot Width (Frontage ft)</label>
            <input 
              type="number"
              min={15}
              max={150}
              value={plot.width}
              onChange={(e) => onUpdatePlot({ width: Math.max(15, parseInt(e.target.value) || 15) })}
            />
          </div>

          <div className="plot-input-field">
            <label>Plot Depth (Length ft)</label>
            <input 
              type="number"
              min={20}
              max={250}
              value={plot.depth}
              onChange={(e) => onUpdatePlot({ depth: Math.max(20, parseInt(e.target.value) || 20) })}
            />
          </div>

          <div className="plot-input-field">
            <label>Road Facing</label>
            <select 
              value={plot.roadFacing}
              onChange={(e) => onUpdatePlot({ roadFacing: e.target.value as any })}
            >
              <option value="North">North (↑)</option>
              <option value="East">East (→)</option>
              <option value="South">South (↓)</option>
              <option value="West">West (←)</option>
              <option value="Corner Plot">Corner (↗)</option>
              <option value="Two-Side Road">2-Side (↕)</option>
            </select>
          </div>

          <div className="plot-input-field">
            <label>Front Setback (ft)</label>
            <input 
              type="number"
              min={0}
              max={20}
              value={plot.setbacks.front}
              onChange={(e) => onUpdatePlot({ setbacks: { ...plot.setbacks, front: Math.max(0, parseInt(e.target.value) || 0) } })}
            />
          </div>
        </div>

        <div className="plot-envelope-summary">
          <span>Usable Envelope: <strong style={{ color: '#0f172a' }}>{usableWidth} × {usableDepth} ft ({usableArea.toLocaleString()} sq ft)</strong></span>
          <span>Rear: {plot.setbacks.rear}′ • Left: {plot.setbacks.left}′ • Right: {plot.setbacks.right}′</span>
        </div>
      </div>

      {/* ─── Spaces Selection Card Grid ──────────────────────────────────────── */}
      <div className="spaces-section-header">
        <h3 className="spaces-section-title">Select Spaces for Your Home ({requirements.length} Selected)</h3>
        <button
          type="button"
          className="btn-add-custom-space"
          onClick={() => setShowCustomModal(true)}
        >
          <Plus size={14} />
          <span>Add Custom Space</span>
        </button>
      </div>

      <div className="spaces-cards-grid">
        {AVAILABLE_SPACES.map(card => {
          const selected = isSelected(card.category);
          const count = getCount(card.category);
          const IconComponent = card.icon;

          return (
            <div
              key={card.category}
              className={`space-card-item ${selected ? 'selected' : ''}`}
              onClick={() => toggleCategory(card)}
            >
              <div>
                <div className="space-card-top">
                  <div className="space-card-icon-wrap">
                    <IconComponent size={18} />
                  </div>

                  {selected && (
                    <span className="space-check-pill">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}
                </div>

                <h4 className="space-card-name">{card.name}</h4>
                <p className="space-card-desc">{card.desc}</p>
              </div>

              {/* Count Stepper if multi-count allowed and selected */}
              {selected && card.allowCount && (
                <div className="space-count-stepper" onClick={e => e.stopPropagation()}>
                  <span>Quantity:</span>
                  <div className="stepper-controls">
                    <button 
                      type="button" 
                      className="stepper-btn"
                      onClick={(e) => adjustCount(card.category, -1, e)}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="stepper-val">{count}</span>
                    <button 
                      type="button" 
                      className="stepper-btn"
                      onClick={(e) => adjustCount(card.category, 1, e)}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Add Custom Space Modal ─────────────────────────────────────────── */}
      {showCustomModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', maxWidth: '380px', width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }} className="animate-scaleUp">
            <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>Add a Custom Space</h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px' }}>Give your custom room a name (e.g. Home Theater, Gym, Library).</p>
            
            <input 
              type="text"
              autoFocus
              placeholder="e.g. Home Theater, Gym"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustomSpace()}
              style={{ width: '100%', background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '10px 14px', fontSize: '14px', fontWeight: 700, outline: 'none', marginBottom: '16px', boxSizing: 'border-box' }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                type="button" 
                className="wizard-btn-ghost"
                onClick={() => setShowCustomModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '8px 16px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
                onClick={handleAddCustomSpace}
                disabled={!customName.trim()}
              >
                Add Space
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
