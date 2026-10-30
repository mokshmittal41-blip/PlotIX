import { X, ChevronRight } from 'lucide-react';
import { useMapContext } from '../../context/MapContext';

export default function PropertyIntelligenceDrawer() {
  const { activePanel, setActivePanel, isPolygonComplete, drawingPoints } = useMapContext();

  if (activePanel !== 'intelligence' || !isPolygonComplete) return null;

  return (
    <div className="intelligence-drawer open">
      <div className="drawer-header">
        <h3>Your Property</h3>
        <button className="btn-icon" onClick={() => setActivePanel('none')}>
          <X size={20} />
        </button>
      </div>

      <div className="drawer-content">
        
        {/* Overview Section */}
        <section className="drawer-section">
          <h4>Overview</h4>
          <div className="drawer-card">
            <div className="stat-row">
              <span className="stat-label">Location</span>
              <span className="stat-value">Sector 82, Mohali</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Boundary Points</span>
              <span className="stat-value">{drawingPoints.length} points</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Land Use</span>
              <span className="stat-value text-accent">Residential</span>
            </div>
          </div>
        </section>

        {/* Development & Market Section */}
        <section className="drawer-section">
          <h4>Market Context</h4>
          <div className="drawer-card">
            <div className="stat-row">
              <span className="stat-label">Avg. Sector Rate</span>
              <span className="stat-value">₹12,500 / sq.ft.</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">1-Year Trend</span>
              <span className="stat-value text-accent">+8.4%</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Demand Index</span>
              <span className="stat-value">High</span>
            </div>
          </div>
        </section>

        {/* Regulatory */}
        <section className="drawer-section">
          <h4>Regulatory Checks</h4>
          <div className="drawer-card">
            <div className="check-item passed">
              <div className="check-icon">✓</div>
              <div className="check-text">Outside Lal Dora</div>
            </div>
            <div className="check-item passed">
              <div className="check-icon">✓</div>
              <div className="check-text">GMADA Approved Sector</div>
            </div>
            <div className="check-item warning">
              <div className="check-icon">!</div>
              <div className="check-text">Height restriction: 15m</div>
            </div>
          </div>
        </section>

        {/* Actions linking back to tools */}
        <section className="drawer-section">
          <h4>Analysis Tools</h4>
          <div className="action-links">
            <button className="action-link" onClick={() => setActivePanel('before-after')}>
              View Past & Present <ChevronRight size={16} />
            </button>
            <button className="action-link" onClick={() => setActivePanel('future')}>
              Future Potential Simulator <ChevronRight size={16} />
            </button>
          </div>
        </section>

        <div className="helper-text" style={{ textAlign: 'center', marginTop: '32px' }}>
          This is a simulated intelligence report based on the selected map boundary.
        </div>
      </div>
    </div>
  );
}
