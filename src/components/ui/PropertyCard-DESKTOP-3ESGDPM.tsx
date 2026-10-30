import React, { useState } from 'react';
import { MapPin, Star, Bookmark, ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Property } from '../../types';
import { formatPrice, formatPricePerUnit } from '../../data/dummyData';
import { useApp } from '../../context/AppContext';

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
  view?: 'grid' | 'list';
}

export default function PropertyCard({ property, onClick, view = 'grid' }: PropertyCardProps) {
  const { savedPropertyIds, toggleSave } = useApp();
  const isSaved = savedPropertyIds.has(property.id);
  const [imageIndex, setImageIndex] = useState(0);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSave(property.id);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  // Fake trend for demo purposes based on rating
  const isTrendingUp = property.rating > 4.2;

  if (view === 'list') {
    return (
      <div className="propwise-card-new" style={{ display: 'flex', cursor: 'pointer', height: '180px' }} onClick={onClick}>
        <div style={{ width: '240px', flexShrink: 0, position: 'relative' }}>
          <img
            src={property.images[0]}
            alt={property.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {property.isVerified && (
            <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
              <div className="propwise-badge-verified">
                <span style={{ color: 'var(--color-primary-new)', fontSize: '14px' }}>✓</span> Verified
              </div>
            </div>
          )}
        </div>
        <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary-new)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                <MapPin size={12} color="var(--color-primary-new)" />
                {property.location}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary-new)', marginBottom: '4px', fontFamily: '"Inter", sans-serif' }}>
                {property.title}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted-new)' }}>
                {property.area} {property.areaUnit} · {property.type}
              </div>
            </div>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              style={{
                width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-surface-white)',
                border: '1px solid var(--border-color-new)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)', color: isSaved ? 'var(--color-accent-new)' : 'var(--text-muted-new)'
              }}
              onClick={handleSave}
            >
              <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
            </motion.button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid var(--border-color-new)', paddingTop: '12px', marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 500 }}>
                <Star size={14} fill="var(--color-accent-new)" color="var(--color-accent-new)" />
                {property.rating} <span style={{ color: 'var(--text-muted-new)', fontWeight: 400 }}>({property.reviews})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: isTrendingUp ? 'var(--color-success)' : 'var(--color-error)' }}>
                {isTrendingUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {isTrendingUp ? '+2.4%' : '-1.1%'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-primary-new)', letterSpacing: '-0.5px' }}>
                {formatPrice(property.price)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted-new)' }}>
                {formatPricePerUnit(property.pricePerUnit, property.areaUnit)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="propwise-card-new" onClick={onClick}>
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={imageIndex}
            src={property.images[imageIndex]}
            alt={property.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
          />
        </AnimatePresence>
        
        {/* Badges & Save Button Overlay */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {property.isVerified ? (
            <div className="propwise-badge-verified">
              <span style={{ color: 'var(--color-primary-new)', fontSize: '14px' }}>✓</span> Verified
            </div>
          ) : <div />}
          
          <motion.button 
            whileTap={{ scale: 0.85 }}
            style={{
              width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)', color: isSaved ? 'var(--color-accent-new)' : 'var(--text-muted-new)',
              border: 'none', cursor: 'pointer'
            }}
            onClick={handleSave}
          >
            <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
          </motion.button>
        </div>

        {/* Carousel Controls */}
        {property.images.length > 1 && (
          <div style={{ position: 'absolute', bottom: '12px', left: '0', right: '0', display: 'flex', justifyContent: 'space-between', padding: '0 8px' }}>
            <button onClick={prevImage} style={{ background: 'rgba(0,0,0,0.3)', color: 'white', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}>
              <ChevronLeft size={16} />
            </button>
            <button onClick={nextImage} style={{ background: 'rgba(0,0,0,0.3)', color: 'white', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary-new)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={12} color="var(--color-primary-new)" />
            {property.location}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: isTrendingUp ? 'var(--color-success)' : 'var(--color-error)' }}>
            {isTrendingUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {isTrendingUp ? '+2.4%' : '-1.1%'}
          </div>
        </div>

        <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary-new)', marginBottom: '4px', lineHeight: '1.3' }}>
          {property.title}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted-new)', marginBottom: '16px' }}>
          {property.type}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid var(--border-color-new)', paddingTop: '12px' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-primary-new)', letterSpacing: '-0.5px' }}>
              {formatPrice(property.price)}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted-new)', marginTop: '2px' }}>
              {formatPricePerUnit(property.pricePerUnit, property.areaUnit)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary-new)', marginBottom: '4px' }}>
              {property.area} {property.areaUnit}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', fontSize: '12px' }}>
              <Star size={12} fill="var(--color-accent-new)" color="var(--color-accent-new)" />
              <span style={{ fontWeight: 600 }}>{property.rating}</span>
              <span style={{ color: 'var(--text-muted-new)' }}>({property.reviews})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
