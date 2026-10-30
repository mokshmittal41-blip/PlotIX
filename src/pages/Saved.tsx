import { useState, useEffect } from 'react';
import { Bookmark, Search, RefreshCw } from 'lucide-react';
import PropertyCard from '../components/ui/PropertyCard';
import { propertyService } from '../services/propertyService';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import type { Property } from '../types';

interface SavedProps {
  onNavigate: (page: string, id?: string) => void;
}

export default function Saved({ onNavigate }: SavedProps) {
  const { savedPropertyIds } = useApp();
  const { t, language } = useLanguage();
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadSaved = async () => {
      setIsLoading(true);
      try {
        if (savedPropertyIds.size === 0) {
          if (isMounted) {
            setSavedProperties([]);
            setIsLoading(false);
          }
          return;
        }

        const ids = Array.from(savedPropertyIds);
        const results = await Promise.all(
          ids.map(id => propertyService.getPropertyById(id).then(r => r.property).catch(() => null))
        );

        if (isMounted) {
          setSavedProperties(results.filter(Boolean) as Property[]);
        }
      } catch (err) {
        console.error('[Saved] Error loading saved properties:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadSaved();
    return () => { isMounted = false; };
  }, [savedPropertyIds]);

  if (isLoading) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        <RefreshCw size={26} className="spin" style={{ margin: '0 auto 12px', color: 'var(--color-accent)' }} />
        <p>Loading your saved real estate bookmarks...</p>
      </div>
    );
  }

  if (savedProperties.length === 0) {
    return (
      <div>
        <div className="card empty-state" style={{ minHeight: 400 }}>
          <div className="empty-state-icon" style={{ background: 'var(--color-accent-bg)', color: 'var(--color-accent)' }}>
            <Bookmark size={26} />
          </div>
          <h3>{t.saved.emptyTitle}</h3>
          <p>{t.saved.emptySubtitle}</p>
          <button className="btn btn-primary" onClick={() => onNavigate('explore')}>
            <Search size={15} /> {t.saved.browseBtn}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.3px', marginBottom: 2 }}>{t.saved.title}</h2>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
            {savedProperties.length} {language === 'pa' ? 'ਸੰਭਾਲੀਆਂ ਜਾਇਦਾਦਾਂ' : (language === 'hi' ? 'सहेजी गई प्रॉपर्टी' : (savedProperties.length === 1 ? 'property saved' : 'properties saved'))}
          </div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'var(--color-accent-bg)', borderRadius: 'var(--radius-full)', fontSize: 13, fontWeight: 700, color: 'var(--color-accent)' }}>
          <Bookmark size={13} fill="currentColor" />
          {savedProperties.length}
        </div>
      </div>

      <div className="properties-grid">
        {savedProperties.map(p => (
          <PropertyCard key={p.id} property={p} onClick={() => onNavigate('detail', p.id)} />
        ))}
      </div>

      {savedProperties.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button className="btn btn-outline btn-sm" onClick={() => onNavigate('explore')}>
            <Search size={14} /> {t.saved.browseBtn}
          </button>
        </div>
      )}
    </div>
  );
}
