import { useMapContext } from '../../context/MapContext';
import { Map, MapPin, PenTool, Sparkles, ArrowRight, X } from 'lucide-react';

export default function OnboardingOverlay() {
  const { 
    onboardingDismissed, setOnboardingDismissed,
    setExploreMode, setIsDrawingMode, setDrawingPoints, setIsPolygonComplete, setActivePanel
  } = useMapContext();

  if (onboardingDismissed) return null;

  const handleFindLocation = () => {
    setOnboardingDismissed(true);
  };

  const handleDrawProperty = () => {
    // Activate the existing property drawing flow
    setExploreMode('land');
    setIsDrawingMode(true);
    setDrawingPoints([]);
    setIsPolygonComplete(false);
    setActivePanel('none');
    setOnboardingDismissed(true);
  };

  const handleExplorePotential = () => {
    setExploreMode('place');
    setIsDrawingMode(false);
    setOnboardingDismissed(true);
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card">
        <div className="onboarding-header" style={{ position: 'relative' }}>
          <div className="onboarding-icon-wrap">
            <Map size={24} className="text-primary" />
          </div>
          <div style={{ textAlign: 'left', flex: 1, paddingRight: '24px' }}>
            <h3 className="onboarding-title" style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px', color: 'var(--color-text)' }}>
              Explore your property
            </h3>
            <p className="onboarding-subtitle" style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>
              Search a location or draw your plot to get started.
            </p>
          </div>
          <button 
            type="button"
            onClick={() => setOnboardingDismissed(true)}
            style={{ position: 'absolute', top: 0, right: 0, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="onboarding-actions" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
          
          <button 
            className="onboarding-action-btn"
            onClick={handleFindLocation}
          >
            <div className="action-icon" style={{ background: 'rgba(30, 43, 56, 0.05)', color: 'var(--color-text-secondary)' }}>
              <MapPin size={18} />
            </div>
            <span style={{ flex: 1, textAlign: 'left', fontWeight: 500 }}>Find your location</span>
            <ArrowRight size={16} className="text-muted" />
          </button>

          <button 
            className="onboarding-action-btn primary-action"
            onClick={handleDrawProperty}
          >
            <div className="action-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <PenTool size={18} />
            </div>
            <span style={{ flex: 1, textAlign: 'left', fontWeight: 600, color: 'var(--color-text)' }}>Draw Property</span>
            <ArrowRight size={16} className="text-primary" />
          </button>

          <button 
            className="onboarding-action-btn"
            onClick={handleExplorePotential}
          >
            <div className="action-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
              <Sparkles size={18} />
            </div>
            <span style={{ flex: 1, textAlign: 'left', fontWeight: 500 }}>Explore Property Potential</span>
            <ArrowRight size={16} className="text-muted" />
          </button>

        </div>
      </div>
    </div>
  );
}
