import { useState, useRef } from 'react';
import { X } from 'lucide-react';
import { useMapContext } from '../../context/MapContext';
import { SATELLITE_IMAGES } from '../../data/mapData';

export default function BeforeAfterView() {
  const { activePanel, setActivePanel } = useMapContext();
  const [pastYear, setPastYear] = useState(0); // index 0 or 1
  const [presentYear, setPresentYear] = useState(0); // index 0 or 1
  const [sliderPosition, setSliderPosition] = useState(50); // percentage
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  if (activePanel !== 'before-after') return null;

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    let clientX = 0;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }
    
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  return (
    <div className="before-after-overlay">
      <div className="before-after-header">
        <h3>Historical Analysis</h3>
        <button className="btn-icon" onClick={() => setActivePanel('none')}>
          <X size={20} />
        </button>
      </div>

      <div className="year-selectors">
        <div className="year-selector-group">
          <span className="year-label">PAST</span>
          <div className="year-tabs">
            {SATELLITE_IMAGES.past.map((img, i) => (
              <button 
                key={img.year}
                className={`year-tab ${pastYear === i ? 'active' : ''}`}
                onClick={() => setPastYear(i)}
              >
                {img.year}
              </button>
            ))}
          </div>
        </div>
        
        <div className="year-selector-group right">
          <span className="year-label">PRESENT</span>
          <div className="year-tabs">
            {SATELLITE_IMAGES.present.map((img, i) => (
              <button 
                key={img.year}
                className={`year-tab ${presentYear === i ? 'active' : ''}`}
                onClick={() => setPresentYear(i)}
              >
                {img.year}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div 
        className="comparison-container" 
        ref={containerRef}
        onMouseMove={handleDrag}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchMove={handleDrag}
        onTouchEnd={() => setIsDragging(false)}
      >
        {/* Present Image (Background) */}
        <div className="comparison-image-container present">
          <img 
            src={SATELLITE_IMAGES.present[presentYear].url} 
            alt="Present" 
            className="comparison-img"
          />
        </div>

        {/* Past Image (Clipped Foreground) */}
        <div 
          className="comparison-image-container past"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img 
            src={SATELLITE_IMAGES.past[pastYear].url} 
            alt="Past" 
            className="comparison-img"
          />
        </div>

        {/* Polygon Overlay (Simulated context) */}
        <div className="comparison-overlay-svg">
          <svg viewBox="0 0 1400 900" width="100%" height="100%">
             {/* Just a dummy poly in center to show "your property" context */}
             <polygon 
                points="600,400 700,400 750,550 620,520" 
                fill="rgba(123, 158, 135, 0.4)"
                stroke="var(--color-primary)"
                strokeWidth="4"
             />
          </svg>
        </div>

        {/* Drag Handle */}
        <div 
          className="comparison-handle"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
        >
          <div className="handle-line"></div>
          <div className="handle-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
