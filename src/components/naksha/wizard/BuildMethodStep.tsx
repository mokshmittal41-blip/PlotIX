import { Sparkles, Hand, ArrowRight, Check } from 'lucide-react';
import type { PlotGeometry, RoomRequirement } from '../geometry/types';

interface Props {
  plot: PlotGeometry;
  requirements: RoomRequirement[];
  onSelectMethod: (method: 'ai' | 'custom') => void;
  isGenerating?: boolean;
}

export default function BuildMethodStep({
  plot,
  requirements,
  onSelectMethod,
  isGenerating
}: Props) {
  const totalRooms = requirements.reduce((sum, r) => sum + (r.count || 1), 0);

  return (
    <div className="animate-fadeIn">
      
      {/* ─── Header ───────────────────────────────────────────────────────────── */}
      <div className="step-intro-header" style={{ textAlign: 'center' }}>
        <div>
          <span className="step-pill-tag">Step 03 of 03 • Ready to Design</span>
        </div>
        <h2 className="step-main-title">How would you like to arrange your space?</h2>
        <p className="step-sub-desc" style={{ maxWidth: '580px', margin: '8px auto 0' }}>
          Choose whether you want AI to generate an optimized starting layout or if you prefer to start with a blank plot canvas and arrange everything yourself.
        </p>
      </div>

      {/* ─── Summary Meta Bar ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', margin: '0 auto 28px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 20px', maxWidth: '480px', fontSize: '12px', color: '#64748b' }}>
        <span>Plot: <strong style={{ color: '#0f172a' }}>{plot.width} × {plot.depth} ft</strong></span>
        <span>•</span>
        <span>Spaces: <strong style={{ color: '#0f172a' }}>{totalRooms} Rooms</strong></span>
        <span>•</span>
        <span>Facing: <strong style={{ color: '#0f172a' }}>{plot.roadFacing}</strong></span>
      </div>

      {/* ─── Two Choice Cards ─────────────────────────────────────────────────── */}
      <div className="build-method-grid">
        
        {/* Choice 1: Build with AI */}
        <div 
          className="build-card primary"
          onClick={() => !isGenerating && onSelectMethod('ai')}
        >
          <div className="build-card-badge">
            Recommended
          </div>

          <div>
            <div className="build-card-icon">
              <Sparkles size={26} />
            </div>

            <h3 className="build-card-title">✨ Build with AI</h3>
            <p className="build-card-desc">
              Let AI calculate optimal structural zones, setbacks, circulation hallways, cross-ventilation shafts, and door swings.
            </p>

            <ul className="build-features-list">
              <li className="build-feature-item">
                <Check size={14} color="#16a34a" />
                <span>Generates 3 architecturally balanced starting options</span>
              </li>
              <li className="build-feature-item">
                <Check size={14} color="#16a34a" />
                <span>100% parametric — you can still drag & edit everything</span>
              </li>
              <li className="build-feature-item">
                <Check size={14} color="#16a34a" />
                <span>Automatic Vastu, daylight and privacy zoning</span>
              </li>
            </ul>
          </div>

          <button 
            type="button" 
            className="btn-build-action primary"
            disabled={isGenerating}
          >
            <span>{isGenerating ? 'Synthesizing 3 Layouts…' : 'Generate AI Layouts & Open Editor'}</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Choice 2: Build Custom */}
        <div 
          className="build-card custom-card"
          onClick={() => !isGenerating && onSelectMethod('custom')}
        >
          <div>
            <div className="build-card-icon">
              <Hand size={26} />
            </div>

            <h3 className="build-card-title">✋ Build Custom</h3>
            <p className="build-card-desc">
              Start with your defined plot boundary and snap grid. Drag and drop rooms, walls, doors, windows, and furniture from the library.
            </p>

            <ul className="build-features-list">
              <li className="build-feature-item">
                <Check size={14} color="#2563eb" />
                <span>Clean starting canvas matching your exact plot dimensions</span>
              </li>
              <li className="build-feature-item">
                <Check size={14} color="#2563eb" />
                <span>Full access to left room & furniture drag library</span>
              </li>
              <li className="build-feature-item">
                <Check size={14} color="#2563eb" />
                <span>AI assistant available anytime to modify the plan</span>
              </li>
            </ul>
          </div>

          <button 
            type="button" 
            className="btn-build-action secondary"
            disabled={isGenerating}
          >
            <span>Open Custom Floor Plan Editor</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>

    </div>
  );
}
