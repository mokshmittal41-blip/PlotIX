import { useState, useEffect } from 'react';
import { ChevronLeft, Info, TrendingUp, CheckCircle } from 'lucide-react';

import { PROPERTIES, DEVELOPMENT_TIMELINE } from '../data/dummyData';
import { propertyService } from '../services/propertyService';
import type { Property } from '../types';
import Badge from '../components/ui/Badge';

interface FuturePotentialProps {
  propertyId: string;
  onNavigate: (page: string, id?: string) => void;
}

type Tab = 'past' | 'present' | 'future';

const TIMELINE_IMAGES = {
  past: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=900&q=80',
  present: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80',
  future: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80',
};

const STATUS_BADGE: Record<string, any> = {
  Planned: 'status-planned',
  'Under Construction': 'status-construction',
  Completed: 'status-completed',
};

const DEV_ICONS: Record<string, string> = {
  metro: '🚇',
  airport: '✈️',
  it_hub: '💻',
  commercial: '🏢',
  road: '🛣️',
  hospital: '🏥',
};

export default function FuturePotential({ propertyId, onNavigate }: FuturePotentialProps) {
  const [activeTab, setActiveTab] = useState<Tab>('present');
  const [property, setProperty] = useState<Property>(() => PROPERTIES.find(p => p.id === propertyId) || PROPERTIES[0]);

  useEffect(() => {
    propertyService.getPropertyById(propertyId)
      .then(res => {
        if (res.property) setProperty(res.property);
      })
      .catch(() => {});
  }, [propertyId]);

  return (
    <div>
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: '16px' }} onClick={() => onNavigate('detail', propertyId)}>
        <ChevronLeft size={16} /> Back to Property
      </button>

      <div className="demo-banner">
        <Info size={15} style={{ flexShrink: 0 }} />
        <span>
          <strong>Demo Data Only</strong> — Development insights, timelines and projections shown here are illustrative examples for prototype demonstration.
        </span>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.3px' }}>
          Area Development Timeline
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          {property.location} · Historical & projected development
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="timeline-tabs">
        {(['past', 'present', 'future'] as Tab[]).map(tab => (
          <button
            key={tab}
            className={`timeline-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'past' ? '📅 Past' : tab === 'present' ? '📍 Present' : '🔭 Future'}
          </button>
        ))}
      </div>

      {/* Visual Area */}
      <div style={{ marginBottom: '24px', position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
        <div style={{ height: '320px', position: 'relative', overflow: 'hidden' }}>
          <img
            src={TIMELINE_IMAGES[activeTab]}
            alt={activeTab}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 400ms ease' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
          }} />
          <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px' }}>
            <div style={{ color: 'white', fontSize: '13px', fontWeight: 600, opacity: 0.8, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {activeTab === 'past' ? 'Historical Development' : activeTab === 'present' ? 'Current State' : 'Projected Future'}
            </div>
            <div style={{ color: 'white', fontSize: '22px', fontWeight: 800, letterSpacing: '-0.4px' }}>
              {activeTab === 'past' ? 'How the area developed' :
                activeTab === 'present' ? 'Where the area stands today' :
                  'What\'s coming to this area'}
            </div>
          </div>
          {/* Demo watermark */}
          <div style={{
            position: 'absolute', top: '12px', right: '12px',
            background: 'rgba(0,0,0,0.5)', color: 'white',
            padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 500,
            backdropFilter: 'blur(4px)',
          }}>
            DEMO DATA
          </div>
        </div>
      </div>

      {/* Content by tab */}
      {activeTab === 'past' && (
        <div>
          <div className="section-title" style={{ marginBottom: '16px' }}>Development Milestones</div>
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            {DEVELOPMENT_TIMELINE.past.map((event, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: '16px',
                padding: '16px 20px',
                borderBottom: i < DEVELOPMENT_TIMELINE.past.length - 1 ? '1px solid var(--color-border)' : 'none',
                alignItems: 'center',
              }}>
                <div style={{
                  width: '56px',
                  flexShrink: 0,
                  textAlign: 'center',
                  fontWeight: 800,
                  fontSize: '15px',
                  color: 'var(--color-primary)',
                }}>
                  {event.year}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>{event.event}</div>
                </div>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 600,
                  background: event.impact === 'High' ? 'var(--color-accent-bg)' : 'var(--color-surface-2)',
                  color: event.impact === 'High' ? 'var(--color-accent-dark)' : 'var(--color-text-muted)',
                }}>
                  {event.impact} Impact
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'present' && (
        <div>
          <div className="section-title" style={{ marginBottom: '16px' }}>Current Snapshot</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {DEVELOPMENT_TIMELINE.present.map((stat, i) => (
              <div key={i} className="card" style={{ padding: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '6px' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.4px' }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '12px' }}>
              Active Infrastructure
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Chandigarh Airport', status: 'Completed', distance: '8 km' },
                { label: 'Mohali IT Park Phase 1', status: 'Completed', distance: '5 km' },
                { label: 'Wave Mall', status: 'Completed', distance: '2.5 km' },
                { label: 'Fortis Hospital', status: 'Completed', distance: '3 km' },
                { label: 'NH-7 Four Lane Highway', status: 'Completed', distance: '2 km' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={15} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: '14px', color: 'var(--color-text)' }}>{item.label}</span>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{item.distance}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'future' && (
        <div>
          <div className="section-title" style={{ marginBottom: '16px' }}>Planned & Upcoming Projects</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '12px' }}>
            {DEVELOPMENT_TIMELINE.future.map((dev, i) => (
              <div key={i} className="card" style={{ padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '44px', height: '44px',
                    background: 'var(--color-accent-bg)',
                    borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px', flexShrink: 0,
                  }}>
                    {DEV_ICONS[dev.type] || '🏗️'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-text)', marginBottom: '4px' }}>
                      {dev.name}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                      {dev.distance} from property · Expected {dev.timeline}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                    <Badge variant={STATUS_BADGE[dev.status] as any}>{dev.status}</Badge>
                    <Badge variant={`impact-${dev.impact.toLowerCase()}` as any}>{dev.impact} Impact</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: '16px', marginTop: '12px', background: 'var(--color-accent-bg)', border: '1px solid var(--color-accent-light)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <TrendingUp size={18} style={{ color: 'var(--color-accent-dark)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-primary)', marginBottom: '4px' }}>
                  Demo Projection
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                  Based on prototype analysis, the combination of metro connectivity, IT hub proximity, and road expansion could drive 15–22% price appreciation over 3 years. This is demo data — always consult a certified property advisor.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
