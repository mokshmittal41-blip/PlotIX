import { 
  CheckCircle2, Edit2, Sparkles, MapPin, Building, 
  Layout, HeartHandshake, Compass, IndianRupee, ArrowRight 
} from 'lucide-react';
import type { NakshaConfiguration } from '../types';

interface Props {
  config: NakshaConfiguration;
  onGoToStep: (stepIndex: number) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export default function ReviewStep({ config, onGoToStep, onGenerate, isGenerating }: Props) {
  const { plot, home, spaces, lifestyle } = config;
  const totalSqFt = (plot.frontageFt || 0) * (plot.depthFt || 0);

  return (
    <div className="naksha-step-body animate-fadeIn">
      <div className="step-intro-header">
        <span className="step-tag success">
          <CheckCircle2 size={13} />
          READY TO DESIGN
        </span>
        <h2 className="step-main-title">Your home brief is ready.</h2>
        <p className="step-sub-title">Review your requirements. Our AI engine will balance structural efficiency, vastu, and airflow.</p>
      </div>

      {/* Summary Cards List */}
      <div className="review-cards-stack">
        
        {/* 1. Plot Brief */}
        <div className="review-card">
          <div className="review-card-header">
            <div className="review-title-wrap">
              <MapPin size={16} className="text-primary" />
              <h4>01. Plot Information</h4>
            </div>
            <button type="button" className="review-edit-btn" onClick={() => onGoToStep(0)}>
              <Edit2 size={12} /> Edit
            </button>
          </div>
          <div className="review-grid-2">
            <div className="review-item">
              <span className="item-k">Dimensions:</span>
              <span className="item-v">{plot.frontageFt} × {plot.depthFt} ft ({totalSqFt.toLocaleString()} sq ft)</span>
            </div>
            <div className="review-item">
              <span className="item-k">Road Facing:</span>
              <span className="item-v">{plot.roadFacing}</span>
            </div>
            <div className="review-item">
              <span className="item-k">Shape:</span>
              <span className="item-v">{plot.shape}</span>
            </div>
            <div className="review-item">
              <span className="item-k">Plot Area:</span>
              <span className="item-v">{plot.areaSqYd} sq yd</span>
            </div>
          </div>
        </div>

        {/* 2. Home Scale Brief */}
        <div className="review-card">
          <div className="review-card-header">
            <div className="review-title-wrap">
              <Building size={16} className="text-primary" />
              <h4>02. Scale & Structure</h4>
            </div>
            <button type="button" className="review-edit-btn" onClick={() => onGoToStep(1)}>
              <Edit2 size={12} /> Edit
            </button>
          </div>
          <div className="review-grid-2">
            <div className="review-item">
              <span className="item-k">Floors:</span>
              <span className="item-v">{home.floors}</span>
            </div>
            <div className="review-item">
              <span className="item-k">Future Expansion:</span>
              <span className="item-v">{home.futureExpansion}</span>
            </div>
            <div className="review-item">
              <span className="item-k">Staircase:</span>
              <span className="item-v">{home.staircaseType}</span>
            </div>
          </div>
        </div>

        {/* 3. Spaces Brief */}
        <div className="review-card">
          <div className="review-card-header">
            <div className="review-title-wrap">
              <Layout size={16} className="text-primary" />
              <h4>03. Spaces & Rooms</h4>
            </div>
            <button type="button" className="review-edit-btn" onClick={() => onGoToStep(2)}>
              <Edit2 size={12} /> Edit
            </button>
          </div>
          
          <div className="review-tags-wrap">
            <span className="feature-pill highlight">{spaces.bedroomsCount} BHK ({spaces.attachedBathsCount} Attached Baths)</span>
            <span className="feature-pill highlight">{spaces.bathroomsCount} Total Bathrooms</span>
            <span className="feature-pill">{spaces.kitchenStyle} Kitchen</span>
            {spaces.utilityArea && <span className="feature-pill">+ Utility Wash Area</span>}
            {spaces.carParkingCount > 0 && <span className="feature-pill">{spaces.carParkingCount} Car Porch</span>}
            {spaces.bikeParkingCount > 0 && <span className="feature-pill">{spaces.bikeParkingCount} Bikes</span>}
          </div>

          <div className="selected-spaces-mini-list mt-2">
            <span className="text-xs text-muted">Included functional spaces:</span>
            <div className="mini-chips-flow">
              {spaces.selectedSpaces.map(s => (
                <span key={s} className="mini-chip">{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Lifestyle & Planning Brief */}
        <div className="review-card">
          <div className="review-card-header">
            <div className="review-title-wrap">
              <HeartHandshake size={16} className="text-primary" />
              <h4>04. Lifestyle & Budget</h4>
            </div>
            <button type="button" className="review-edit-btn" onClick={() => onGoToStep(3)}>
              <Edit2 size={12} /> Edit
            </button>
          </div>
          
          <div className="review-grid-2">
            <div className="review-item">
              <span className="item-k"><Compass size={13} className="mr-1 inline text-primary" /> Planning:</span>
              <span className="item-v">{lifestyle.vastu}</span>
            </div>
            <div className="review-item">
              <span className="item-k"><IndianRupee size={13} className="mr-1 inline text-accent" /> Budget Range:</span>
              <span className="item-v">{lifestyle.budget}</span>
            </div>
          </div>

          <div className="priorities-summary-row mt-2">
            <span className="text-xs text-muted">Optimized around:</span>
            <div className="mini-chips-flow">
              {lifestyle.priorities.map(p => (
                <span key={p} className="mini-chip priority-chip">✦ {p}</span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Main Generate Button CTA */}
      <div className="generate-cta-box mt-4">
        <button
          type="button"
          className={`btn-primary-generate ${isGenerating ? 'loading' : ''}`}
          onClick={onGenerate}
          disabled={isGenerating}
        >
          <div className="btn-content-flex">
            <Sparkles size={20} className="sparkle-icon" />
            <div className="btn-text-group">
              <span className="btn-title-text">
                {isGenerating ? 'Designing Your Home with AI…' : 'Generate My Naksha'}
              </span>
              <span className="btn-subtitle-text">
                Create 3 tailored, architecturally optimized floor plan options
              </span>
            </div>
            <ArrowRight size={18} className="arrow-icon ml-auto" />
          </div>
        </button>
      </div>
    </div>
  );
}
