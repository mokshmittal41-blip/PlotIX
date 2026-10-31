import React from 'react';
import { MapPin, Star, Bookmark, Phone, MessageCircle } from 'lucide-react';
import type { Property } from '../../types';
import { formatPrice, formatPricePerUnit } from '../../data/dummyData';
import Badge from './Badge';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { scrollToTop } from '../../utils/scrollUtils';

const FALLBACK_PLOT_IMAGE = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80';

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
  view?: 'grid' | 'list';
}

export default function PropertyCard({ property, onClick, view = 'grid' }: PropertyCardProps) {
  const { savedPropertyIds, toggleSave } = useApp();
  const { t, translateType, translateFacing, translateUnit } = useLanguage();
  const isSaved = savedPropertyIds.has(property.id);

  const handleClick = () => {
    scrollToTop(true);
    if (onClick) onClick();
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSave(property.id);
  };

  const localizedType = translateType(property.type);
  const localizedFacing = translateFacing(property.facing);
  const localizedUnit = translateUnit(property.areaUnit);
  const displayImage = (property.images && property.images.length > 0 && property.images[0]) || FALLBACK_PLOT_IMAGE;

  if (view === 'list') {
    return (
      <div className="property-card-list" onClick={handleClick}>
        <div className="property-card-list-image">
          <img
            src={displayImage}
            alt={property.title}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_PLOT_IMAGE;
            }}
          />
          <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4 }}>
            <Badge variant="verified">✓ PlotIX Verified</Badge>
          </div>
        </div>
        <div className="property-card-list-body">
          <div className="property-card-list-info">
            <div 
              className="property-card-location" 
              style={{ 
                marginBottom: 6, 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 5,
                padding: '2px 6px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <MapPin size={12} style={{ color: '#ef4444', flexShrink: 0 }} />
              <span style={{ fontWeight: 600 }}>{property.location}</span>
              {property.calculatedDistanceKm !== undefined && (
                <span style={{ color: '#10b981', fontWeight: 700 }}>
                  • {property.calculatedDistanceKm} km
                </span>
              )}
            </div>
            <div className="property-card-title" style={{ fontSize: 15 }}>{property.title}</div>
            <div className="property-card-type">{property.area} {localizedUnit} · {localizedType} · {localizedFacing}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
              {property.highlights.slice(0, 3).map(h => (
                <span key={h} style={{
                  padding: '3px 9px',
                  background: 'var(--color-surface-2)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                }}>
                  {h}
                </span>
              ))}
            </div>
          </div>
          <div className="property-card-list-actions">
            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', marginBottom: 8 }}>
              <button 
                className={`property-card-save ${isSaved ? 'saved' : ''}`} 
                onClick={handleSave} 
                style={{ position: 'static', boxShadow: 'var(--shadow-xs)' }}
                aria-label={isSaved ? t.common.saved : t.common.save}
              >
                <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
              </button>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="property-card-price">{formatPrice(property.price)}</div>
              <div className="property-card-per-unit">{formatPricePerUnit(property.pricePerUnit, property.areaUnit)}</div>
              <div className="property-rating" style={{ justifyContent: 'flex-end', marginTop: 6 }}>
                <Star size={11} fill="currentColor" />
                {property.rating}
                <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>({property.reviews})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="property-card" onClick={handleClick}>
      <div className="property-card-image">
        <img 
          src={displayImage} 
          alt={property.title} 
          loading="lazy" 
          onError={(e) => {
            e.currentTarget.src = FALLBACK_PLOT_IMAGE;
          }}
        />
        <div className="property-card-badge">
          <Badge variant="verified">✓ PlotIX Verified</Badge>
        </div>
        <div className="property-card-type-badge">{localizedType}</div>
        <button
          className={`property-card-save ${isSaved ? 'saved' : ''}`}
          onClick={handleSave}
          title={isSaved ? t.common.saved : t.common.save}
          aria-label={isSaved ? t.common.saved : t.common.save}
        >
          <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="property-card-body">
        <div 
          className="property-card-location" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: 4,
            padding: '2px 4px',
            margin: '-2px -4px 4px',
            borderRadius: '4px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden' }}>
            <MapPin size={12} style={{ color: '#ef4444', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{property.location}</span>
            {property.calculatedDistanceKm !== undefined && (
              <span style={{ color: '#10b981', fontWeight: 700, flexShrink: 0 }}>
                • {property.calculatedDistanceKm} km
              </span>
            )}
          </div>
        </div>
        <div className="property-card-title">{property.title}</div>
        <div className="property-card-price">{formatPrice(property.price)}</div>
        <div className="property-card-per-unit">{formatPricePerUnit(property.pricePerUnit, property.areaUnit)}</div>
        <div className="property-card-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
          <div className="property-card-area">{property.area} {localizedUnit}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div className="property-rating">
              <Star size={11} fill="currentColor" />
              {property.rating}
            </div>
          </div>
        </div>

        {/* ─── Mobile Instant Contact Bar ─── */}
        <div 
          className="property-card-contact-row" 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '8px', 
            marginTop: '10px', 
            paddingTop: '10px', 
            borderTop: '1px solid rgba(226, 232, 240, 0.8)' 
          }}
        >
          <a
            href="tel:+917658800280"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '7px 10px',
              borderRadius: '9px',
              background: 'rgba(15, 23, 42, 0.04)',
              border: '1px solid rgba(226, 232, 240, 0.95)',
              color: '#0F172A',
              fontSize: '11.5px',
              fontWeight: 750,
              textDecoration: 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Phone size={12} style={{ color: '#059669' }} />
            <span>Call</span>
          </a>
          <a
            href={`https://wa.me/917658800280?text=Hi%20PlotIX%20Team,%20I%20am%20interested%20in%20${encodeURIComponent(property.title)}%20in%20${encodeURIComponent(property.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '7px 10px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFFFFF',
              fontSize: '11.5px',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            <MessageCircle size={12} />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}

