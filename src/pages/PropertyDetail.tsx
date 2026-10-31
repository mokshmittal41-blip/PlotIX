import { useState, useEffect, type ReactNode } from 'react';
import {
  MapPin, Star, Bookmark, Phone, BarChart2, ChevronLeft, CheckCircle,
  Shield, Eye, ChevronRight, MessageCircle, Share2, RefreshCw,
  Lock, ShieldCheck
} from 'lucide-react';
import PropertyCard from '../components/ui/PropertyCard';
import Badge from '../components/ui/Badge';
import { propertyService } from '../services/propertyService';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { scrollToTop } from '../utils/scrollUtils';
import type { Property, NearbyLandmark } from '../types';

const FALLBACK_PLOT_IMAGE = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80';

const LANDMARK_ICONS: Record<NearbyLandmark['type'], ReactNode> = {
  hospital: <span>🏥</span>,
  school: <span>🎓</span>,
  mall: <span>🛍️</span>,
  metro: <span>🚇</span>,
  highway: <span>🛣️</span>,
  airport: <span>✈️</span>,
  park: <span>🌳</span>,
};

function formatPrice(val: number): string {
  if (!val || isNaN(val)) return 'Price on Request';
  if (val >= 10000000) {
    const cr = val / 10000000;
    return `₹${cr.toFixed(2)} Cr`;
  }
  if (val >= 100000) {
    const lakh = val / 100000;
    return `₹${lakh.toFixed(1)} Lakh`;
  }
  return `₹${val.toLocaleString('en-IN')}`;
}

function formatPricePerUnit(val: number, unit: string): string {
  if (!val || isNaN(val)) return '';
  return `₹${val.toLocaleString('en-IN')}/${unit || 'sq.yd.'}`;
}

interface PropertyDetailProps {
  propertyId: string;
  onNavigate: (page: string, id?: string) => void;
}

export default function PropertyDetail({ propertyId, onNavigate }: PropertyDetailProps) {
  const { savedPropertyIds, toggleSave, addToast } = useApp();
  const { language, t, translateType, translateFacing, translateUnit } = useLanguage();

  const [property, setProperty] = useState<Property | null>(null);
  const [similar, setSimilar] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    scrollToTop(true);

    propertyService.getPropertyById(propertyId)
      .then(res => {
        if (isMounted) {
          setProperty(res.property);
          setSimilar(res.similar);
          setActiveImage(0);
          scrollToTop(true);
        }
      })
      .catch(err => {
        console.error('[PropertyDetail] Error fetching property:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, [propertyId]);

  if (isLoading) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        <RefreshCw size={28} className="spin" style={{ margin: '0 auto 16px', color: 'var(--color-accent)' }} />
        <p>Loading real estate property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="card empty-state" style={{ padding: '48px 24px', textAlign: 'center' }}>
        <h3>{language === 'pa' ? 'ਪ੍ਰਾਪਰਟੀ ਨਹੀਂ ਮਿਲੀ' : (language === 'hi' ? 'प्रॉपर्टी नहीं मिली' : 'Property not found')}</h3>
        <p>This property listing may have been sold or removed by the seller.</p>
        <button className="btn btn-primary" onClick={() => onNavigate('explore')}>
          {language === 'pa' ? 'ਸਾਰੀਆਂ ਪ੍ਰਾਪਰਟੀਆਂ ਵੇਖੋ' : (language === 'hi' ? 'सभी प्रॉपर्टी देखें' : 'Explore Properties')}
        </button>
      </div>
    );
  }

  const isSaved = savedPropertyIds.has(property.id);

  // Ensure contact phone always routes to an active, real callable number
  const rawDealerPhone = property.dealer?.phone || '';
  const isDummyPhone = !rawDealerPhone || 
    rawDealerPhone.includes('98765 43210') || 
    rawDealerPhone.includes('98120 54321') || 
    rawDealerPhone.replace(/\D/g, '').length < 10;
  const effectivePhone = isDummyPhone ? '+91 76588 00280' : rawDealerPhone;
  const cleanPhone = effectivePhone.replace(/[^\d+]/g, '');
  const digitsOnly = cleanPhone.replace(/\D/g, '');
  const finalDigits = digitsOnly.length === 10 ? '91' + digitsOnly : (digitsOnly.length === 12 ? digitsOnly : '917658800280');
  const whatsappUrl = `https://wa.me/${finalDigits}?text=${encodeURIComponent(`Hello ${property.dealer?.name || 'Seller'}, I am interested in your property listing on PlotIX: "${property.title}" in ${property.location}. Please share visit details.`)}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property on PlotIX: ${property.title} in ${property.location}`,
        url: window.location.href
      }).catch(() => { });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Property link copied to clipboard!', 'info');
    }
  };

  return (
    <div>
      {/* Top Bar with Back and Share */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <button
          className="btn btn-ghost btn-sm"
          style={{ gap: 4, paddingLeft: 4 }}
          onClick={() => onNavigate('explore')}
          aria-label="Back to explore"
        >
          <ChevronLeft size={18} /> {t.common.back}
        </button>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleShare}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Share2 size={15} /> Share
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="property-hero">
        <img 
          src={property.images[activeImage] || FALLBACK_PLOT_IMAGE} 
          alt={property.title}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_PLOT_IMAGE;
          }}
        />
        <div className="property-hero-overlay" />
        <div className="property-hero-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <Badge variant="verified">✓ PlotIX Verified</Badge>
            <Badge variant="type">{translateType(property.type)}</Badge>
            {property.status && property.status !== 'active' && (
              <span style={{ background: '#ef4444', color: 'white', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 6 }}>
                {property.status.toUpperCase()}
              </span>
            )}
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.4px', lineHeight: 1.2 }}>
            {property.title}
          </h1>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 14,
              background: 'rgba(0, 0, 0, 0.45)',
              padding: '4px 10px',
              borderRadius: '8px',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              marginTop: 4
            }}
          >
            <MapPin size={15} style={{ color: '#10b981' }} />
            <span>{property.location}</span>
          </div>
        </div>

        {/* Thumbnail Strip */}
        {property.images.length > 1 && (
          <div style={{
            position: 'absolute', bottom: 12, right: 12,
            display: 'flex', gap: 6, zIndex: 5,
          }}>
            {property.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                aria-label={`View image ${i + 1}`}
                style={{
                  width: 44, height: 32, borderRadius: 6, overflow: 'hidden',
                  border: `2px solid ${activeImage === i ? 'white' : 'rgba(255,255,255,0.4)'}`,
                  cursor: 'pointer', flexShrink: 0, transition: 'border-color 150ms',
                }}
              >
                <img 
                  src={img} 
                  alt="" 
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_PLOT_IMAGE;
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail Grid */}
      <div className="property-detail-grid">
        {/* Left: Main Info */}
        <div>
          {/* Price + Views */}
          <div className="card" style={{ padding: 20, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.6px', lineHeight: 1.15 }}>
                  {formatPrice(property.price)}
                </div>
                <div style={{ fontSize: 14, color: 'var(--color-text-muted)', marginTop: 3, fontWeight: 500 }}>
                  {formatPricePerUnit(property.pricePerUnit, property.areaUnit)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="property-rating" style={{ justifyContent: 'flex-end' }}>
                  <Star size={14} fill="currentColor" style={{ color: '#F59E0B' }} />
                  <span style={{ fontWeight: 800, fontSize: 16 }}>{property.rating}</span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>({property.reviews})</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
                  {language === 'pa' ? 'ਦਰਜ ਕੀਤਾ ਗਿਆ: ' : (language === 'hi' ? 'सूचीबद्ध: ' : 'Listed ')}{new Date(property.postedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>

          {/* Specs Grid */}
          <div className="detail-specs" style={{ marginBottom: 14 }}>
            {[
              { label: language === 'pa' ? 'ਖੇਤਰਫਲ' : (language === 'hi' ? 'क्षेत्रफल' : 'Area'), value: `${property.area} ${translateUnit(property.areaUnit)}` },
              { label: language === 'pa' ? 'ਕਿਸਮ' : (language === 'hi' ? 'प्रकार' : 'Type'), value: translateType(property.type) },
              { label: language === 'pa' ? 'ਦਿਸ਼ਾ' : (language === 'hi' ? 'दिशा' : 'Facing'), value: translateFacing(property.facing) },
              { label: language === 'pa' ? 'ਸੜਕ ਚੌੜਾਈ' : (language === 'hi' ? 'सड़क चौड़ाई' : 'Road Width'), value: `${property.roadWidth} ft` },
              { label: language === 'pa' ? 'ਸ਼ਹਿਰ' : (language === 'hi' ? 'शहर' : 'City'), value: property.city },
              { label: language === 'pa' ? 'ਜ਼ਿਲ੍ਹਾ' : (language === 'hi' ? 'जिला' : 'District'), value: property.district || property.city },
            ].map(spec => (
              <div key={spec.label} className="detail-spec-item">
                <div className="detail-spec-label">{spec.label}</div>
                <div className="detail-spec-value">{spec.value}</div>
              </div>
            ))}
          </div>

          {/* ─── LOCATION PRIVACY & GENERAL AREA OVERVIEW ─── */}
          <div className="card" style={{ padding: 22, marginBottom: 14, border: '1.5px solid rgba(16, 185, 129, 0.25)', background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.04) 0%, var(--color-surface) 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
                    {language === 'pa' ? 'ਇਲਾਕਾ ਅਤੇ ਖੇਤਰ ਸੰਖੇਪ' : (language === 'hi' ? 'क्षेत्र एवं इलाका विवरण' : 'Regional & Locality Overview')}
                  </h3>
                  <p style={{ fontSize: 12.5, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
                    {property.location}
                  </p>
                </div>
              </div>

              {/* Location Privacy Shield Pill */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 999,
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  fontSize: 11.5,
                  fontWeight: 800,
                  color: '#059669',
                  letterSpacing: '0.02em',
                }}
              >
                <Lock size={12} strokeWidth={2.5} />
                <span>{language === 'pa' ? 'ਸਹੀ ਸਥਾਨ ਗੁਪਤ ਰੱਖਿਆ ਗਿਆ ਹੈ' : (language === 'hi' ? 'सटीक लोकेशन गोपनीय रखी गई है' : 'Confidential Plot Location')}</span>
              </div>
            </div>

            {/* Address & Locality Hierarchy Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 12,
              padding: '14px 16px',
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: 16
            }}>
              <div>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)', display: 'block', fontWeight: 600 }}>Locality / Area</span>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-text)' }}>{property.sector || property.location.split(',')[0]}</span>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)', display: 'block', fontWeight: 600 }}>Tehsil / Sub-district</span>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-text)' }}>{property.tehsil || property.city}</span>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)', display: 'block', fontWeight: 600 }}>District & State</span>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-text)' }}>{property.district || property.city}, {property.state}</span>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)', display: 'block', fontWeight: 600 }}>Road Access</span>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: '#10b981' }}>{property.roadWidth || 30} ft Wide Road</span>
              </div>
            </div>

            {/* Privacy Protection Notice */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '14px 16px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(37, 99, 235, 0.04) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              marginBottom: 14,
            }}>
              <ShieldCheck size={20} style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-text)', marginBottom: 3 }}>
                  {language === 'pa' ? 'ਪਲਾਟ ਮਾਲਕ ਦੀ ਨਿੱਜਤਾ ਦੀ ਸੁਰੱਖਿਆ' : (language === 'hi' ? 'प्लॉट स्वामी की गोपनीयता सुरक्षा' : 'Seller Privacy & Encroachment Protection')}
                </div>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.55 }}>
                  {language === 'pa'
                    ? 'ਬਿਨਾਂ ਇਜਾਜ਼ਤ ਦਖ਼ਲਅੰਦਾਜ਼ੀ ਰੋਕਣ ਲਈ ਪਲਾਟ ਦੀ ਸਹੀ ਨਿਸ਼ਾਨਦੇਹੀ ਤੇ ਖਸਰਾ ਪਿੰਨ ਗੁਪਤ ਰੱਖੇ ਗਏ ਹਨ। ਖ਼ਰੀਦਦਾਰ ਮਾਲਕ ਨਾਲ ਸਿੱਧਾ ਸੰਪਰਕ ਕਰਕੇ ਨਿੱਜੀ ਵਿਜ਼ਿਟ ਬੁੱਕ ਕਰ ਸਕਦੇ ਹਨ।'
                    : (language === 'hi'
                        ? 'अनाधिकृत दखल से सुरक्षा हेतु इस प्लॉट की सटीक सीमाएं व खसरा लोकेशन गोपनीय रखी गई हैं। खरीदार सीधे सेलर से संपर्क कर व्यक्तिगत साइट विजिट बुक करें।'
                        : 'Exact plot boundary coordinates, surveyor pins, and demarcations are kept confidential to prevent unauthorized access. Contact the verified seller directly below to schedule a private site visit.')}
                </p>
              </div>
            </div>

            {/* Direct Connect CTA */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <a
                href={`tel:${cleanPhone}`}
                className="btn btn-primary"
                style={{
                  textDecoration: 'none',
                  justifyContent: 'center',
                  background: '#059669',
                  borderColor: '#059669',
                  gap: 8,
                  fontWeight: 700
                }}
              >
                <Phone size={16} />
                <span>{language === 'pa' ? 'ਮਾਲਕ ਨਾਲ ਗੱਲ ਕਰੋ' : (language === 'hi' ? 'सेलर से बात करें' : 'Contact Seller')}</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{
                  textDecoration: 'none',
                  justifyContent: 'center',
                  borderColor: '#25D366',
                  color: '#25D366',
                  background: 'rgba(37, 211, 102, 0.08)',
                  gap: 8,
                  fontWeight: 700
                }}
              >
                <MessageCircle size={16} />
                <span>{language === 'pa' ? 'ਵਿਜ਼ਿਟ ਬੁੱਕ ਕਰੋ' : (language === 'hi' ? 'साइट विजिट बुक करें' : 'Book Site Visit')}</span>
              </a>
            </div>
          </div>

          {/* Description */}
          <div className="card" style={{ padding: 20, marginBottom: 14 }}>
            <div className="section-title" style={{ marginBottom: 10 }}>
              {language === 'pa' ? 'ਇਸ ਜਾਇਦਾਦ ਬਾਰੇ' : (language === 'hi' ? 'इस प्रॉपर्टी के बारे में' : 'About this Property')}
            </div>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              {property.description}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
              {property.highlights.map(h => (
                <span key={h} style={{
                  padding: '4px 11px',
                  background: 'var(--color-accent-bg)',
                  color: 'var(--color-accent)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 12, fontWeight: 600,
                  border: '1px solid rgba(37,99,235,0.15)',
                }}>
                  {h}
                </span>
              ))}
            </div>
          </div>

          {/* Approvals */}
          <div className="card" style={{ padding: 20, marginBottom: 14 }}>
            <div className="section-title" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={16} style={{ color: 'var(--color-success)' }} />
              {language === 'pa' ? 'ਸਰਕਾਰੀ ਮਨਜ਼ੂਰੀਆਂ ਤੇ NOC' : (language === 'hi' ? 'सरकारी स्वीकृतियां एवं NOC' : 'Approvals & Clearances')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {property.approvals.map(a => (
                <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle size={15} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: 'var(--color-text)' }}>{a}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Landmarks */}
          {property.nearbyLandmarks && property.nearbyLandmarks.length > 0 && (
            <div className="card" style={{ padding: 20 }}>
              <div className="section-title" style={{ marginBottom: 14 }}>
                {language === 'pa' ? 'ਨੇੜਲੀਆਂ ਸੁਵਿਧਾਵਾਂ' : (language === 'hi' ? 'आस-पास की सुविधाएं' : 'Nearby Landmarks')}
              </div>
              {property.nearbyLandmarks.map(l => (
                <div key={l.name} className="landmark-item">
                  <div className="landmark-icon">{LANDMARK_ICONS[l.type] || <span>📍</span>}</div>
                  <div className="landmark-name">{l.name}</div>
                  <div className="landmark-dist">{l.distance}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Direct Seller / Owner Contact + Actions */}
        <div>
          <div className="card" style={{ padding: 20, position: 'sticky', top: 88 }}>
            {/* Dealer/Owner Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'var(--color-primary)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 18, flexShrink: 0,
              }}>
                {(property.dealer?.name || 'P')[0]}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  {property.dealer?.name || 'Verified Owner / Agent'}
                  {property.dealer?.verified && <CheckCircle size={14} style={{ color: 'var(--color-success)' }} />}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{property.dealer?.company}</div>
              </div>
            </div>

            {/* Direct Phone Number Display */}
            <div style={{
              background: 'rgba(16,185,129,0.08)',
              border: '1.5px solid rgba(16,185,129,0.25)',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Direct Contact Phone</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '0.3px' }}>
                  {effectivePhone}
                </div>
              </div>
              <a
                href={`tel:${cleanPhone}`}
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: '#10b981', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  textDecoration: 'none'
                }}
                title="Call Now"
              >
                <Phone size={18} />
              </a>
            </div>

            {/* CTA Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Click to Call */}
              <a
                href={`tel:${cleanPhone}`}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', height: 46, textDecoration: 'none', background: '#059669', borderColor: '#059669' }}
              >
                <Phone size={16} /> {language === 'pa' ? 'ਸਿੱਧਾ ਕਾਲ ਕਰੋ' : (language === 'hi' ? 'सीधे कॉल करें' : 'Call Seller / Broker')}
              </a>

              {/* WhatsApp Direct Chat */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{
                  width: '100%', justifyContent: 'center', height: 44, textDecoration: 'none',
                  borderColor: '#25D366', color: '#25D366', background: 'rgba(37,211,102,0.08)'
                }}
              >
                <MessageCircle size={16} /> WhatsApp Message
              </a>

              <button
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center', height: 44 }}
                onClick={() => onNavigate('analysis', property.id)}
              >
                <BarChart2 size={16} /> {language === 'pa' ? 'AI ਵਿਸ਼ਲੇਸ਼ਣ' : (language === 'hi' ? 'AI विश्लेषण' : 'AI Price Analysis')}
              </button>

              <button
                className={`btn ${isSaved ? 'btn-outline' : 'btn-ghost'}`}
                style={{
                  width: '100%', justifyContent: 'center', height: 44,
                  ...(isSaved ? { color: 'var(--color-error)', borderColor: 'var(--color-error-border)', background: 'var(--color-error-bg)' } : {}),
                }}
                onClick={() => toggleSave(property.id)}
              >
                <Bookmark size={15} fill={isSaved ? 'currentColor' : 'none'} />
                {isSaved ? (language === 'pa' ? 'ਸੰਭਾਲਿਆ ਗਿਆ' : (language === 'hi' ? 'सहेजा गया' : 'Saved')) : (language === 'pa' ? 'ਸੰਭਾਲੋ' : (language === 'hi' ? 'ਸहेजें' : 'Save Property'))}
              </button>

              <button
                className="btn btn-ghost"
                style={{ width: '100%', justifyContent: 'center', fontSize: 13, color: 'var(--color-text-muted)', height: 40 }}
                onClick={() => onNavigate('future-potential', property.id)}
              >
                <Eye size={14} /> {language === 'pa' ? 'ਭਵਿੱਖ ਦਾ ਅਨੁਮਾਨ' : (language === 'hi' ? 'भविष्य का अनुमान' : 'Future Infrastructure Potential')}
              </button>
            </div>

            <div className="divider" />

            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.6, display: 'flex', gap: 6 }}>
              <span>🛡️</span>
              <span>
                ✓ 100% PlotIX Verified Listing. Circle rates, boundary coordinates, and land ownership verified on PlotIX.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties in same city */}
      {similar.length > 0 && (
        <div className="page-section" style={{ marginTop: 28 }}>
          <div className="section-header">
            <div className="section-title">{language === 'pa' ? `${property.city} ਵਿੱਚ ਹੋਰ ਪ੍ਰਾਪਰਟੀਆਂ` : (language === 'hi' ? `${property.city} में मिलते-जुलते विकल्प` : `More Properties in ${property.city}`)}</div>
            <button className="section-link" onClick={() => onNavigate('explore')}>
              {language === 'pa' ? 'ਸਾਰੇ ਵੇਖੋ' : (language === 'hi' ? 'सभी देखें' : 'View all')} <ChevronRight size={14} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {similar.map(p => (
              <PropertyCard key={p.id} property={p} onClick={() => onNavigate('detail', p.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky CTA Bar */}
      <div className="property-mobile-cta">
        <button className="btn btn-outline" onClick={() => toggleSave(property.id)}
          style={{ flex: 'none', minWidth: 48, padding: '0 16px', ...(isSaved ? { color: 'var(--color-error)', borderColor: 'var(--color-error-border)' } : {}) }}>
          <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
          style={{ flex: 'none', minWidth: 52, padding: '0 16px', borderColor: '#25D366', color: '#25D366' }}
          title="WhatsApp Seller"
        >
          <MessageCircle size={18} />
        </a>
        <a
          href={`tel:${cleanPhone}`}
          className="btn btn-primary"
          style={{ flex: 1, textDecoration: 'none', justifyContent: 'center', background: '#059669', borderColor: '#059669', gap: 8, fontWeight: 700 }}
        >
          <Phone size={16} /> {language === 'pa' ? 'ਕਾਲ ਕਰੋ' : (language === 'hi' ? 'कॉल करें' : 'Call Seller')}
        </a>
      </div>
    </div>
  );
}

