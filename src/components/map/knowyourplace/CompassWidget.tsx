interface CompassWidgetProps {
  bearingDegrees?: number; // 0 = North, 90 = East, 180 = South, 270 = West
  directionLabel?: string;
  roadFacingLabel?: string;
  className?: string;
}

export default function CompassWidget({
  bearingDegrees = 90, // Default to East
  directionLabel = 'East',
  roadFacingLabel = 'East',
  className = ''
}: CompassWidgetProps) {
  return (
    <div className={`compass-widget-card ${className}`}>
      <div className="compass-visual-wrap">
        <svg
          viewBox="0 0 100 100"
          className="compass-svg"
          aria-label={`Compass showing front facing ${directionLabel}`}
        >
          {/* Outer ring */}
          <circle cx="50" cy="50" r="46" className="compass-ring-outer" />
          <circle cx="50" cy="50" r="42" className="compass-ring-inner" />

          {/* Tick marks */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = ((deg - 90) * Math.PI) / 180;
            const x1 = 50 + 38 * Math.cos(rad);
            const y1 = 50 + 38 * Math.sin(rad);
            const x2 = 50 + 42 * Math.cos(rad);
            const y2 = 50 + 42 * Math.sin(rad);
            return (
              <line
                key={deg}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={deg % 90 === 0 ? "compass-tick-major" : "compass-tick-minor"}
              />
            );
          })}

          {/* Cardinal Labels */}
          <text x="50" y="16" className="compass-label north" textAnchor="middle">N</text>
          <text x="88" y="53" className="compass-label" textAnchor="middle">E</text>
          <text x="50" y="90" className="compass-label" textAnchor="middle">S</text>
          <text x="12" y="53" className="compass-label" textAnchor="middle">W</text>

          {/* Rotating Needle */}
          <g
            transform={`rotate(${bearingDegrees}, 50, 50)`}
            className="compass-needle-group"
            style={{ transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          >
            {/* North pointing (colored) tip */}
            <polygon points="50,18 45,50 50,47" className="needle-north-dark" />
            <polygon points="50,18 55,50 50,47" className="needle-north-light" />
            {/* South pointing tip */}
            <polygon points="50,82 45,50 50,53" className="needle-south-dark" />
            <polygon points="50,82 55,50 50,53" className="needle-south-light" />
            {/* Center Pivot */}
            <circle cx="50" cy="50" r="4.5" className="needle-pivot" />
            <circle cx="50" cy="50" r="2" className="needle-pivot-dot" />
          </g>
        </svg>
      </div>

      <div className="compass-details">
        <div className="compass-stat-row">
          <span className="compass-detail-label">Front Facing</span>
          <span className="compass-detail-val text-primary font-bold">{directionLabel}</span>
        </div>
        {roadFacingLabel && (
          <div className="compass-stat-row">
            <span className="compass-detail-label">Road-facing side</span>
            <span className="compass-detail-val text-accent font-semibold">{roadFacingLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
