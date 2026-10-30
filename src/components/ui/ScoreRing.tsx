import { useEffect, useRef } from 'react';

interface ScoreRingProps {
  score: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

export default function ScoreRing({
  score,
  max = 100,
  size = 140,
  strokeWidth = 10,
  color,
  label,
  sublabel,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = score / max;
  const strokeDashoffset = circumference * (1 - percentage);

  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.style.strokeDashoffset = String(circumference);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (circleRef.current) {
            circleRef.current.style.transition = 'stroke-dashoffset 1200ms cubic-bezier(0.4, 0, 0.2, 1)';
            circleRef.current.style.strokeDashoffset = String(strokeDashoffset);
          }
        });
      });
    }
  }, [score, strokeDashoffset, circumference]);

  const scoreColor =
    score >= 80 ? '#38a169' : score >= 60 ? '#d69e2e' : '#e53e3e';

  return (
    <div className="score-ring-wrapper">
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={strokeWidth}
          />
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color || scoreColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: size * 0.22, fontWeight: 800, color: scoreColor, letterSpacing: '-1px', lineHeight: 1 }}>
            {score}
          </span>
          <span style={{ fontSize: size * 0.09, color: 'var(--color-text-muted)', fontWeight: 600 }}>
            /{max}
          </span>
        </div>
      </div>
      {label && <div className="score-label">{label}</div>}
      {sublabel && <div className="score-sublabel">{sublabel}</div>}
    </div>
  );
}
