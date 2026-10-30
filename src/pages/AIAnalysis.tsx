import { useState, useEffect } from 'react';
import { ChevronLeft, TrendingUp, MapPin, Home, BarChart2, Zap, Info, ArrowUpRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import ScoreRing from '../components/ui/ScoreRing';
import PriceTrendChart from '../components/charts/PriceTrendChart';
import ScoreRadarChart from '../components/charts/ScoreRadarChart';
import Badge from '../components/ui/Badge';
import { PROPERTIES, AI_ANALYSES, MARKET_DATA } from '../data/dummyData';
import { propertyService } from '../services/propertyService';
import type { Property } from '../types';

interface AIAnalysisProps {
  propertyId: string;
  onNavigate: (page: string, id?: string) => void;
}

const IMPACT_STATUS: Record<string, { badge: any; icon: React.ReactNode }> = {
  Planned: { badge: 'status-planned', icon: <Clock size={13} /> },
  'Under Construction': { badge: 'status-construction', icon: <AlertCircle size={13} /> },
  Completed: { badge: 'status-completed', icon: <CheckCircle size={13} /> },
};

export default function AIAnalysis({ propertyId, onNavigate }: AIAnalysisProps) {
  const [property, setProperty] = useState<Property>(() => PROPERTIES.find(p => p.id === propertyId) || PROPERTIES[0]);

  useEffect(() => {
    propertyService.getPropertyById(propertyId)
      .then(res => {
        if (res.property) setProperty(res.property);
      })
      .catch(() => {});
  }, [propertyId]);

  const analysis = AI_ANALYSES[propertyId] || AI_ANALYSES['prop-001'];
  const marketData = MARKET_DATA[0];

  const radarData = [
    { subject: 'Price', value: 78, fullMark: 100 },
    { subject: 'Location', value: analysis.locationScore, fullMark: 100 },
    { subject: 'Rental', value: analysis.rentalDemand, fullMark: 100 },
    { subject: 'Future', value: analysis.futurePotential, fullMark: 100 },
    { subject: 'Infra', value: 80, fullMark: 100 },
    { subject: 'Legal', value: property.isVerified ? 90 : 55, fullMark: 100 },
  ];

  return (
    <div>
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: '16px' }} onClick={() => onNavigate('detail', propertyId)}>
        <ChevronLeft size={16} /> Back to Property
      </button>

      {/* Demo disclaimer */}
      <div className="demo-banner">
        <Info size={15} style={{ flexShrink: 0 }} />
        <span>
          <strong>Demo Analysis Only</strong> — All scores, projections, and insights shown here are prototype data for demonstration purposes only. Not financial or legal advice.
        </span>
      </div>

      {/* Hero Score Card */}
      <div className="card" style={{ padding: '28px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
          <ScoreRing
            score={analysis.score}
            size={160}
            strokeWidth={12}
            label="AI Property Score"
            sublabel="Demo analysis"
          />
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: 500 }}>
              {property.location}
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '8px', letterSpacing: '-0.4px' }}>
              {property.title}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <span style={{
                padding: '4px 12px',
                borderRadius: '999px',
                fontWeight: 700,
                fontSize: '13px',
                background: analysis.priceAssessment === 'Undervalued' ? 'var(--color-success-bg)' :
                  analysis.priceAssessment === 'Overvalued' ? 'var(--color-error-bg)' : 'var(--color-accent-bg)',
                color: analysis.priceAssessment === 'Undervalued' ? 'var(--color-success)' :
                  analysis.priceAssessment === 'Overvalued' ? 'var(--color-error)' : 'var(--color-accent-dark)',
              }}>
                {analysis.priceAssessment}
              </span>
              <Badge variant={property.isVerified ? 'verified' : 'unverified'}>
                {property.isVerified ? '✓ Verified' : 'Unverified'}
              </Badge>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {analysis.insights.slice(0, 3).map((insight, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  <ArrowUpRight size={14} style={{ color: 'var(--color-accent)', marginTop: '2px', flexShrink: 0 }} />
                  {insight}
                </div>
              ))}
            </div>
          </div>
          <div style={{ width: '200px' }}>
            <ScoreRadarChart data={radarData} height={180} />
          </div>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="analysis-grid">
        {/* Price Trend */}
        <div className="analysis-card">
          <div className="analysis-card-title">
            <TrendingUp size={16} style={{ color: 'var(--color-accent)' }} /> Price Trend
          </div>
          <div className="analysis-card-subtitle">Last 12 months · Mohali market (demo)</div>
          <PriceTrendChart data={marketData.priceHistory} height={180} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '12px' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Sep '25</span>
            <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>+{marketData.priceGrowth}% YoY</span>
            <span style={{ color: 'var(--color-text-muted)' }}>Aug '26</span>
          </div>
        </div>

        {/* Location Score */}
        <div className="analysis-card">
          <div className="analysis-card-title">
            <MapPin size={16} style={{ color: 'var(--color-accent)' }} /> Location Score
          </div>
          <div className="analysis-card-subtitle">Infrastructure, connectivity & amenities</div>
          {[
            { label: 'Connectivity', score: 84 },
            { label: 'Social Infrastructure', score: 78 },
            { label: 'Commercial Access', score: 72 },
            { label: 'Green Cover', score: 65 },
            { label: 'Safety Rating', score: 80 },
          ].map(item => (
            <div key={item.label} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '13px', color: 'var(--color-text)' }}>{item.label}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: item.score >= 75 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                  {item.score}/100
                </span>
              </div>
              <div className="score-bar">
                <div
                  className={`score-bar-fill ${item.score >= 75 ? 'high' : 'medium'}`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Rental Demand */}
        <div className="analysis-card">
          <div className="analysis-card-title">
            <Home size={16} style={{ color: 'var(--color-accent)' }} /> Rental Demand
          </div>
          <div className="analysis-card-subtitle">Estimated rental potential (demo)</div>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <ScoreRing score={analysis.rentalDemand} size={100} strokeWidth={9} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Est. Monthly Rental</span>
              <span style={{ fontWeight: 700 }}>₹18,000–22,000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Rental Yield</span>
              <span style={{ fontWeight: 700, color: 'var(--color-success)' }}>3.2–3.8% p.a.</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Tenant Profile</span>
              <span style={{ fontWeight: 700 }}>IT Professionals</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Vacancy Rate</span>
              <span style={{ fontWeight: 700 }}>~8% (demo)</span>
            </div>
          </div>
        </div>

        {/* Future Potential */}
        <div className="analysis-card">
          <div className="analysis-card-title">
            <Zap size={16} style={{ color: 'var(--color-accent)' }} /> Future Potential
          </div>
          <div className="analysis-card-subtitle">3-year appreciation outlook (demo)</div>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <ScoreRing score={analysis.futurePotential} size={100} strokeWidth={9} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>3-Year Appreciation</span>
              <span style={{ fontWeight: 700, color: 'var(--color-success)' }}>15–22% (demo)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Development Stage</span>
              <span style={{ fontWeight: 700 }}>Early Growth</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Risk Level</span>
              <span style={{ fontWeight: 700, color: 'var(--color-warning)' }}>Medium</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Hold Period</span>
              <span style={{ fontWeight: 700 }}>3–5 Years Ideal</span>
            </div>
          </div>
        </div>

        {/* Nearby Development */}
        <div className="analysis-card" style={{ gridColumn: '1 / -1' }}>
          <div className="analysis-card-title">
            <BarChart2 size={16} style={{ color: 'var(--color-accent)' }} /> Nearby Development Projects
          </div>
          <div className="analysis-card-subtitle">Infrastructure pipeline — demo data only</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {analysis.nearbyDevelopment.map((dev, i) => {
              const statusMeta = IMPACT_STATUS[dev.status];
              return (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 0',
                  borderBottom: i < analysis.nearbyDevelopment.length - 1 ? '1px solid var(--color-border)' : 'none',
                }}>
                  <div style={{
                    width: '36px', height: '36px',
                    background: 'var(--color-accent-bg)',
                    borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', flexShrink: 0,
                  }}>
                    {dev.type === 'metro' ? '🚇' : dev.type === 'road' ? '🛣️' : dev.type === 'it_hub' ? '💻' : dev.type === 'airport' ? '✈️' : '🏢'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>{dev.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{dev.distance} away · Expected {dev.timeline}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <Badge variant={statusMeta?.badge as any}>{dev.status}</Badge>
                    <Badge variant={`impact-${dev.impact.toLowerCase()}` as any}>{dev.impact} Impact</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Investment Outlook */}
        <div className="analysis-card" style={{ gridColumn: '1 / -1' }}>
          <div className="analysis-card-title">
            <BarChart2 size={16} style={{ color: 'var(--color-accent)' }} /> Investment Outlook
          </div>
          <div className="analysis-card-subtitle">Summary assessment — demo data only, not financial advice</div>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.7', marginBottom: '12px' }}>
            {analysis.investmentOutlook}
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {analysis.insights.map((insight, i) => (
              <div key={i} style={{
                padding: '8px 14px',
                background: 'var(--color-surface-2)',
                borderRadius: '8px',
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <ArrowUpRight size={13} style={{ color: 'var(--color-accent)' }} />
                {insight}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
