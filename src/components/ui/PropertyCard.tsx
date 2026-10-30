import React from 'react';
import { MapPin, Star, Bookmark, Navigation } from 'lucide-react';
import type { Property } from '../../types';
import { formatPrice, formatPricePerUnit } from '../../data/dummyData';
import Badge from './Badge';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { scrollToTop } from '../../utils/scrollUtils';
import { openGoogleMaps } from '../../utils/mapUtils';

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

  const handleOpenMaps = (e: React.MouseEvent) => {
    openGoogleMaps(property, e);
  };

  const localizedType = translateType(property.type);
  const localizedFacing = translateFacing(property.facing);
  const localizedUnit = translateUnit(property.areaUnit);
  const cleanSourceName = property.sourceName && property.sourceName.toLowerCase().includes('olx')
    ? 'PropWise Verified'
    : property.sourceName;

  if (view === 'list') {
    return (
      <div className="property-card-list" onClick={handleClick}>
        <div className="property-card-list-image">
          <img
            src={property.images[0]}
            alt={property.title}
            loading="lazy"
          />
          {property.isVerified && (
            <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4 }}>
              <Badge variant="verified">✓ {t.common.verified}</Badge>
              {cleanSourceName && (
                <span style={{
                  background: 'rgba(30, 41, 59, 0.85)',
                  backdropFilter: 'blur(4px)',
                  color: '#93c5fd',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: '6px',
                  border: '1px solid rgba(147, 197, 253, 0.3)'
                }}>
                  {cleanSourceName}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="property-card-list-body">
          <div className="property-card-list-info">
            <div 
              className="property-card-location" 
              onClick={handleOpenMaps}
              title="Click to open location in Google Maps"
              style={{ 
                marginBottom: 6, 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 5,
                cursor: 'pointer',
                transition: 'color 150ms ease',
                padding: '2px 6px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '')}
            >
              <MapPin size={12} style={{ color: '#ef4444', flexShrink: 0 }} />
              <span style={{ fontWeight: 600 }}>{property.location}</span>
              {property.calculatedDistanceKm !== undefined && (
                <span style={{ color: '#10b981', fontWeight: 700 }}>
                  • {property.calculatedDistanceKm} km
                </span>
              )}
              <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 700, marginLeft: 2 }}>📍 Maps</span>
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
                className="btn btn-ghost btn-sm"
                onClick={handleOpenMaps}
                title="Open location on Google Maps"
                aria-label="Open in Google Maps"
                style={{
                  padding: '4px 8px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#38bdf8',
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Navigation size={12} />
                <span>Google Maps</span>
              </button>
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
        <img src={property.images[0]} alt={property.title} loading="lazy" />
        <div className="property-card-badge">
          {property.isVerified
            ? <Badge variant="verified">✓ {t.common.verified}</Badge>
            : <Badge variant="unverified">{t.common.unverified}</Badge>
          }
          {cleanSourceName && (
            <span style={{
              background: 'rgba(30, 41, 59, 0.85)',
              backdropFilter: 'blur(4px)',
              color: '#93c5fd',
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: '6px',
              border: '1px solid rgba(147, 197, 253, 0.3)',
              marginLeft: '4px'
            }}>
              {cleanSourceName}
            </span>
          )}
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
          onClick={handleOpenMaps}
          title="Click to open location in Google Maps"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: 4,
            cursor: 'pointer',
            padding: '2px 4px',
            margin: '-2px -4px 4px',
            borderRadius: '4px',
            transition: 'background-color 150ms'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
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
          <span 
            style={{
              fontSize: '10.5px',
              color: '#38bdf8',
              fontWeight: 700,
              flexShrink: 0,
              padding: '1px 5px',
              borderRadius: '4px',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.25)'
            }}
          >
            Maps ↗
          </span>
        </div>
        <div className="property-card-title">{property.title}</div>
        <div className="property-card-price">{formatPrice(property.price)}</div>
        <div className="property-card-per-unit">{formatPricePerUnit(property.pricePerUnit, property.areaUnit)}</div>
        <div className="property-card-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
          <div className="property-card-area">{property.area} {localizedUnit}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {property.originalListingUrl && (
              <a
                href={property.originalListingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title={`View on ${property.sourceName || 'Source Portal'}`}
                style={{
                  fontSize: '11px',
                  color: '#60a5fa',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  textDecoration: 'none',
                  padding: '2px 6px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '4px',
                  border: '1px solid rgba(59, 130, 246, 0.25)'
                }}
              >
                <span>🔗 {property.sourceName || 'Source'}</span>
              </a>
            )}
            <div className="property-rating">
              <Star size={11} fill="currentColor" />
              {property.rating}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

