interface PropWiseLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'auto';
  showText?: boolean;
  showBadge?: boolean;
  animated?: boolean;
  className?: string;
}

export default function PropWiseLogo({
  size = 'md',
  variant = 'auto',
  showText = true,
  animated = false,
  className = '',
}: PropWiseLogoProps) {
  // Dimension scale calibrated for PlotIX typography and icon proportions
  const sizeMap = {
    xs: { icon: 24, text: 15, sub: 7.5, badge: 8.5 },
    sm: { icon: 30, text: 17, sub: 8.5, badge: 9.5 },
    md: { icon: 40, text: 21, sub: 9.5, badge: 10.5 },
    lg: { icon: 50, text: 26, sub: 11.5, badge: 11.5 },
    xl: { icon: 66, text: 34, sub: 13.5, badge: 13 },
  };

  const dim = sizeMap[size] || sizeMap.md;
  const isDark = variant === 'dark';

  return (
    <div
      className={`propwise-logo-root plotix-brand-root ${className} ${animated ? 'pw-logo-animated' : ''}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'xs' ? '8px' : size === 'sm' ? '10px' : '12px',
        userSelect: 'none',
        textDecoration: 'none',
      }}
    >
      {/* ─── PlotIX Flagship Cadastral-Laser Emblem ─── */}
      <svg
        width={dim.icon}
        height={dim.icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          flexShrink: 0,
          filter: 'drop-shadow(0 4px 14px rgba(16, 185, 129, 0.40)) drop-shadow(0 2px 6px rgba(6, 182, 212, 0.25))',
        }}
      >
        <defs>
          {/* Emerald Land Facet Gradient */}
          <linearGradient id="pix-em-facet" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="45%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Cyan/Sapphire High-Tech Facet Gradient */}
          <linearGradient id="pix-sp-facet" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="45%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          {/* Laser Beams Gradient for "X" */}
          <linearGradient id="pix-laser-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          <linearGradient id="pix-laser-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="50%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          {/* Cadastral Plot Diamond Surface */}
          <linearGradient id="pix-surface" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0.4" />
          </linearGradient>

          {/* Gold Intelligence Beacon */}
          <linearGradient id="pix-gold-star" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Ambient Glow Filter */}
          <filter id="pix-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── 1. Outer Cadastral Hexagon Shield (Base) ── */}
        <polygon
          points="50,6 88,26 88,74 50,94 12,74 12,26"
          fill="#0B132B"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* ── 2. Left Emerald Facet (Land & Geometry) ── */}
        <polygon
          points="50,6 12,26 12,74 50,52"
          fill="url(#pix-em-facet)"
          opacity="0.92"
        />

        {/* ── 3. Right Sapphire Facet (Intelligence & Data) ── */}
        <polygon
          points="50,6 88,26 88,74 50,52"
          fill="url(#pix-sp-facet)"
          opacity="0.90"
        />

        {/* ── 4. Bottom Foundation Shadow ── */}
        <polygon
          points="12,74 50,52 88,74 50,94"
          fill="#060C16"
          opacity="0.85"
        />

        {/* ── 5. Cadastral Survey Topographic Contour Lines ── */}
        <line x1="24" y1="42" x2="50" y2="28" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="2 3" />
        <line x1="76" y1="42" x2="50" y2="28" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="2 3" />
        <line x1="20" y1="58" x2="50" y2="75" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="2 3" />
        <line x1="80" y1="58" x2="50" y2="75" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="2 3" />

        {/* ── 6. Elevated Isometric Land Parcel Diamond ("Plot") ── */}
        <polygon
          points="50,16 78,32 50,48 22,32"
          fill="url(#pix-surface)"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* ── 7. The Iconic "IX" Monogram Integration ── */}
        {/* Vertical Axis "I" Structural Pillar */}
        <line x1="50" y1="16" x2="50" y2="78" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.95" />
        <polygon points="47,48 50,50 50,78 47,76" fill="#10B981" opacity="0.9" />
        <polygon points="50,50 53,48 53,76 50,78" fill="#06B6D4" opacity="0.9" />

        {/* The Bold Laser "X" Crossing the Plot */}
        {/* Diagonal 1: NW to SE */}
        <line
          x1="26"
          y1="23"
          x2="74"
          y2="57"
          stroke="url(#pix-laser-1)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#pix-glow)"
        />
        <line
          x1="26"
          y1="23"
          x2="74"
          y2="57"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Diagonal 2: NE to SW */}
        <line
          x1="74"
          y1="23"
          x2="26"
          y2="57"
          stroke="url(#pix-laser-2)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#pix-glow)"
        />
        <line
          x1="74"
          y1="23"
          x2="26"
          y2="57"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* ── 8. Precision Cadastral Boundary Corner Pegs (Survey Nodes) ── */}
        {/* West Peg */}
        <circle cx="22" cy="32" r="3.2" fill="#10B981" />
        <circle cx="22" cy="32" r="1.4" fill="#FFFFFF" />

        {/* East Peg */}
        <circle cx="78" cy="32" r="3.2" fill="#06B6D4" />
        <circle cx="78" cy="32" r="1.4" fill="#FFFFFF" />

        {/* North Apex Peg */}
        <circle cx="50" cy="16" r="3.5" fill="#34D399" />
        <circle cx="50" cy="16" r="1.5" fill="#FFFFFF" />

        {/* South Interior Peg */}
        <circle cx="50" cy="48" r="3.2" fill="#38BDF8" />
        <circle cx="50" cy="48" r="1.4" fill="#FFFFFF" />

        {/* ── 9. Epicenter Intelligence Beacon (AI Diamond Star) ── */}
        <g filter="url(#pix-glow)">
          {/* Pulsing Beacon Core */}
          <circle cx="50" cy="40" r="5" fill="url(#pix-gold-star)" />
          {/* 4-Point High-Precision Star */}
          <polygon
            points="50,29 52.4,37.6 61,40 52.4,42.4 50,51 47.6,42.4 39,40 47.6,37.6"
            fill="#FFFFFF"
          />
          {/* Brilliant Central Coordinate Spark */}
          <circle cx="50" cy="40" r="1.8" fill="#FEF08A" />
        </g>
      </svg>

      {/* ─── Brand Wordmark & Tagline ─── */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                fontSize: `${dim.text}px`,
                fontWeight: 900,
                letterSpacing: '-0.035em',
                color: isDark ? '#FFFFFF' : 'var(--color-primary, #0B1420)',
                fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
                lineHeight: 1.05,
                display: 'inline-flex',
                alignItems: 'baseline',
              }}
            >
              Plot
              <span
                style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 45%, #2563EB 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 950,
                  letterSpacing: '-0.02em',
                  marginLeft: '1px',
                  filter: 'drop-shadow(0 2px 6px rgba(16, 185, 129, 0.20))',
                }}
              >
                IX
              </span>
            </span>
          </div>

          {/* Official Tagline: DISCOVER.ANALYZE.INVEST */}
          <div
            style={{
              fontSize: `${dim.sub}px`,
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: isDark ? '#94A3B8' : '#64748B',
              marginTop: '3.5px',
              fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ color: isDark ? '#CBD5E1' : '#334155' }}>DISCOVER</span>
            <span style={{ color: '#10B981', fontWeight: 900, fontSize: '0.9em' }}>•</span>
            <span style={{ color: isDark ? '#CBD5E1' : '#334155' }}>ANALYZE</span>
            <span style={{ color: '#06B6D4', fontWeight: 900, fontSize: '0.9em' }}>•</span>
            <span style={{ color: isDark ? '#CBD5E1' : '#334155' }}>INVEST</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Named alias export for modern referencing
export { PropWiseLogo as PlotIXLogo };
