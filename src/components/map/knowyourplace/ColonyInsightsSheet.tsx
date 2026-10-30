import { useState, useEffect, useMemo } from 'react';
import { useMapContext } from '../../../context/MapContext';
import { 
  Sparkles, MapPin, ChevronUp, ChevronDown, X, Navigation, 
  School, Hospital, ShoppingBag, Trees, 
  Bus, Train, Plane, Car, Loader2, Eye,
  Layers, Building2, ArrowRight
} from 'lucide-react';
import { locationService } from '../../../services/locationService';
import type { PlaceIntelligence, NearbyPlace, LocationResult } from '../../../types/location';

export default function ColonyInsightsSheet() {
  const { selectedLocation, openStreetView } = useMapContext();
  // Open directly by default so user immediately sees all features & analytics
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'connectivity' | 'amenities' | 'insights'>('overview');
  const [loading, setLoading] = useState(false);
  const [intel, setIntel] = useState<PlaceIntelligence | null>(null);
  const [nearby, setNearby] = useState<NearbyPlace[]>([]);

  // Default active location fallback
  const activeLocation: LocationResult = useMemo(() => selectedLocation || {
    id: 'default-colony',
    name: 'Chitkara University Area',
    type: 'Educational & Residential Locality',
    locality: 'Chitkara University Area',
    city: 'Rajpura',
    state: 'Punjab',
    coordinates: [30.5161, 76.6593]
  }, [selectedLocation]);

  useEffect(() => {
    let isCancelled = false;
    async function loadData() {
      setLoading(true);
      try {
        const [intelData, nearbyData] = await Promise.all([
          locationService.getPlaceIntelligence(activeLocation),
          locationService.getNearbyPlaces(activeLocation)
        ]);
        if (!isCancelled) {
          setIntel(intelData);
          setNearby(nearbyData);
        }
      } catch (err) {
        console.error("Failed to load colony intelligence", err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadData();
    setIsDismissed(false);

    return () => {
      isCancelled = true;
    };
  }, [activeLocation]);

  if (isDismissed) {
    return (
      <div className="reopen-sheet-btn-wrapper">
        <button 
          type="button"
          className="reopen-sheet-btn"
          onClick={() => setIsDismissed(false)}
          title="Open Location Intelligence"
        >
          <Sparkles size={15} className="text-accent" />
          <span>Location Intelligence</span>
        </button>
      </div>
    );
  }

  const handleOpenStreetView = () => {
    const coords = activeLocation.coordinates || [30.5161, 76.6593];
    openStreetView({
      lat: coords[0],
      lng: coords[1],
      title: `${activeLocation.locality || activeLocation.name}`,
      subtitle: `${activeLocation.city}${activeLocation.state ? `, ${activeLocation.state}` : ''}`,
      source: 'colony'
    });
  };

  const scoreLocation = (intel?.investmentScore?.total ? (intel.investmentScore.total / 10).toFixed(1) : '8.7');
  const scoreConnectivity = (intel?.investmentScore?.connectivity ? (intel.investmentScore.connectivity / 10).toFixed(1) : '9.1');
  const scoreAmenities = (intel?.investmentScore?.demand ? (intel.investmentScore.demand / 10).toFixed(1) : '8.6');
  const scoreDevelopment = (intel?.investmentScore?.development ? (intel.investmentScore.development / 10).toFixed(1) : '8.2');

  return (
    <div className="intelligence-sheet-container">
      <div className={`intelligence-sheet-card modern-place-card ${isExpanded ? 'expanded' : 'collapsed'}`}>
        
        {/* Top Header Row */}
        <div className="sheet-header" onClick={() => !isExpanded && setIsExpanded(true)}>
          <div className="sheet-header-left">
            <div className="sheet-header-badges">
              <div className="sheet-tag">
                <Sparkles size={12} className="text-accent" />
                <span>LOCATION INTELLIGENCE</span>
              </div>
              <div className="recommendation-badge-inline">
                <span className="badge-dot-green"></span>
                <span>HIGH DEMAND AREA</span>
              </div>
            </div>
            <h3 className="sheet-title">
              {activeLocation.locality || activeLocation.name}
            </h3>
            <p className="sheet-subtitle">
              <MapPin size={12} />
              <span>{activeLocation.city}{activeLocation.state ? `, ${activeLocation.state}` : ''}</span>
            </p>
          </div>

          <div className="sheet-header-actions" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button"
              className="sheet-action-btn streetview-pill-btn"
              onClick={handleOpenStreetView}
              title="Launch 360° Street Explorer"
            >
              <Eye size={13} className="text-accent" />
              <span>360° View</span>
            </button>
            <button 
              type="button"
              className="sheet-action-btn"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Collapse Sheet" : "Expand Sheet"}
            >
              {isExpanded ? <ChevronDown size={17} /> : <ChevronUp size={17} />}
            </button>
            <button 
              type="button"
              className="sheet-action-btn close-btn"
              onClick={() => setIsDismissed(true)}
              title="Close Panel"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* 3 Hero Metric Tiles */}
        <div className="sheet-hero-metrics">
          <div className="metric-tile highlight-score">
            <span className="metric-label">Location Score</span>
            <div className="metric-value-wrap">
              <span className="metric-value text-primary">{scoreLocation}</span>
              <span className="metric-denom">/ 10</span>
            </div>
          </div>

          <div className="metric-tile highlight-growth">
            <span className="metric-label">Growth Outlook</span>
            <div className="metric-value-wrap">
              <span className="metric-value text-accent font-bold">HIGH</span>
            </div>
          </div>

          <div className="metric-tile highlight-highway">
            <span className="metric-label">Highway Access</span>
            <div className="metric-value-wrap">
              <span className="metric-value font-bold">2.1</span>
              <span className="metric-unit">km</span>
            </div>
          </div>
        </div>

        {/* Main Body - Directly visible */}
        <div className="sheet-expanded-body">
          {/* Prominent Tab Buttons Bar */}
          <div className="sheet-tab-nav modern-segmented-bar" role="tablist" aria-label="Location intelligence views">
            <button 
              type="button"
              role="tab"
              aria-selected={activeTab === 'overview'}
              className={`sheet-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <Layers size={14} className="tab-btn-icon" />
              <span>Overview</span>
            </button>
            <button 
              type="button"
              role="tab"
              aria-selected={activeTab === 'connectivity'}
              className={`sheet-tab-btn ${activeTab === 'connectivity' ? 'active' : ''}`}
              onClick={() => setActiveTab('connectivity')}
            >
              <Navigation size={14} className="tab-btn-icon" />
              <span>Connectivity</span>
            </button>
            <button 
              type="button"
              role="tab"
              aria-selected={activeTab === 'amenities'}
              className={`sheet-tab-btn ${activeTab === 'amenities' ? 'active' : ''}`}
              onClick={() => setActiveTab('amenities')}
            >
              <Building2 size={14} className="tab-btn-icon" />
              <span>Amenities</span>
            </button>
            <button 
              type="button"
              role="tab"
              aria-selected={activeTab === 'insights'}
              className={`sheet-tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
              onClick={() => setActiveTab('insights')}
            >
              <Sparkles size={14} className="tab-btn-icon" />
              <span>AI Insights</span>
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="sheet-tab-content">
            {loading && (
              <div className="sheet-loading-wrap">
                <Loader2 className="animate-spin text-primary" size={24} />
                <span>Analyzing locality metrics and spatial indicators...</span>
              </div>
            )}

            {!loading && activeTab === 'overview' && (
              <div className="tab-pane overview-pane">
                <div className="info-cards-grid">
                  <div className="info-card">
                    <span className="info-label">Locality Type</span>
                    <span className="info-val">{activeLocation.type || 'Residential & Commercial Area'}</span>
                  </div>
                  <div className="info-card">
                    <span className="info-label">Development Status</span>
                    <span className="info-val text-success">Established Urban Zone</span>
                  </div>
                  <div className="info-card">
                    <span className="info-label">City / District</span>
                    <span className="info-val">{activeLocation.city}</span>
                  </div>
                  <div className="info-card">
                    <span className="info-label">State / Region</span>
                    <span className="info-val">{activeLocation.state}</span>
                  </div>
                </div>

                <div className="overview-summary-card">
                  <h5 className="summary-title">Neighborhood Profile</h5>
                  <p className="summary-text">
                    {intel?.description || `A prime, well-connected locality in ${activeLocation.city} with active residential developments, expanding transit corridors, and high rental & resale appreciation.`}
                  </p>
                </div>
              </div>
            )}

            {!loading && activeTab === 'connectivity' && (
              <div className="tab-pane connectivity-pane">
                <div className="distance-cards-grid">
                  <div className="distance-card theme-mainroad">
                    <div className="distance-icon-wrap">
                      <Navigation size={18} />
                    </div>
                    <div className="distance-info">
                      <span className="distance-type">Main Arterial Road</span>
                      <span className="distance-val font-semibold">0.3 km <span className="distance-sub">· 1 min drive</span></span>
                    </div>
                  </div>

                  <div className="distance-card theme-highway">
                    <div className="distance-icon-wrap">
                      <Car size={18} />
                    </div>
                    <div className="distance-info">
                      <span className="distance-type">Highway (NH-7 / GT Road)</span>
                      <span className="distance-val font-semibold">2.1 km <span className="distance-sub">· 4 min drive</span></span>
                    </div>
                  </div>

                  <div className="distance-card theme-bus">
                    <div className="distance-icon-wrap">
                      <Bus size={18} />
                    </div>
                    <div className="distance-info">
                      <span className="distance-type">Public Bus Stand</span>
                      <span className="distance-val font-semibold">0.8 km <span className="distance-sub">· Walking distance</span></span>
                    </div>
                  </div>

                  <div className="distance-card theme-train">
                    <div className="distance-icon-wrap">
                      <Train size={18} />
                    </div>
                    <div className="distance-info">
                      <span className="distance-type">Railway Junction</span>
                      <span className="distance-val font-semibold">4.2 km <span className="distance-sub">· 8 min drive</span></span>
                    </div>
                  </div>

                  <div className="distance-card theme-plane">
                    <div className="distance-icon-wrap">
                      <Plane size={18} />
                    </div>
                    <div className="distance-info">
                      <span className="distance-type">Nearest Airport</span>
                      <span className="distance-val font-semibold">22 km <span className="distance-sub">· Express corridor</span></span>
                    </div>
                  </div>
                </div>

                <div className="connectivity-action-row">
                  <button 
                    type="button"
                    className="btn-view-street"
                    onClick={handleOpenStreetView}
                  >
                    <Eye size={15} className="text-accent" />
                    <span>View Locality Street Level Perspective</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {!loading && activeTab === 'amenities' && (
              <div className="tab-pane amenities-pane">
                <div className="amenities-list">
                  {nearby.length > 0 ? (
                    nearby.map((place) => (
                      <div key={place.id} className="amenity-row">
                        <div className="amenity-icon-col">
                          {place.type.toLowerCase().includes('hospital') ? (
                            <Hospital size={16} className="text-error" />
                          ) : place.type.toLowerCase().includes('school') || place.type.toLowerCase().includes('college') ? (
                            <School size={16} className="text-info" />
                          ) : place.type.toLowerCase().includes('market') || place.type.toLowerCase().includes('shopping') ? (
                            <ShoppingBag size={16} className="text-accent" />
                          ) : (
                            <Trees size={16} className="text-success" />
                          )}
                        </div>
                        <div className="amenity-meta">
                          <span className="amenity-name">{place.name}</span>
                          <span className="amenity-category">{place.type}</span>
                        </div>
                        <div className="amenity-distance">
                          <span>{place.distanceKm} km</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="amenity-row">
                        <div className="amenity-icon-col amenity-hosp"><Hospital size={16} /></div>
                        <div className="amenity-meta">
                          <span className="amenity-name">Adesh Hospital & Medical Center</span>
                          <span className="amenity-category">Healthcare · 24x7 Emergency</span>
                        </div>
                        <div className="amenity-distance">0.8 km</div>
                      </div>
                      <div className="amenity-row">
                        <div className="amenity-icon-col amenity-school"><School size={16} /></div>
                        <div className="amenity-meta">
                          <span className="amenity-name">DAV Public School & College</span>
                          <span className="amenity-category">Education · CBSE Affiliated</span>
                        </div>
                        <div className="amenity-distance">1.4 km</div>
                      </div>
                      <div className="amenity-row">
                        <div className="amenity-icon-col amenity-market"><ShoppingBag size={16} /></div>
                        <div className="amenity-meta">
                          <span className="amenity-name">Central High Street Market</span>
                          <span className="amenity-category">Shopping, Banks & Groceries</span>
                        </div>
                        <div className="amenity-distance">2.1 km</div>
                      </div>
                      <div className="amenity-row">
                        <div className="amenity-icon-col amenity-park"><Trees size={16} /></div>
                        <div className="amenity-meta">
                          <span className="amenity-name">City Botanical Park & Jogging Track</span>
                          <span className="amenity-category">Recreation & Green Belt</span>
                        </div>
                        <div className="amenity-distance">0.6 km</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {!loading && activeTab === 'insights' && (
              <div className="tab-pane insights-pane">
                <div className="propwise-intelligence-card">
                  <div className="intelligence-card-header">
                    <Sparkles size={16} className="text-primary" />
                    <span className="font-bold text-sm">PROPWISE INVESTMENT INTELLIGENCE</span>
                  </div>

                  <div className="score-bars-list">
                    <div className="score-item">
                      <div className="score-item-top">
                        <span>Overall Location Score</span>
                        <span className="score-val text-primary">{scoreLocation} / 10</span>
                      </div>
                      <div className="score-track">
                        <div className="score-fill bg-primary" style={{ width: `${Math.min(100, Number(scoreLocation) * 10)}%` }} />
                      </div>
                    </div>

                    <div className="score-item">
                      <div className="score-item-top">
                        <span>Transit & Road Connectivity</span>
                        <span className="score-val text-accent">{scoreConnectivity} / 10</span>
                      </div>
                      <div className="score-track">
                        <div className="score-fill bg-accent" style={{ width: `${Math.min(100, Number(scoreConnectivity) * 10)}%` }} />
                      </div>
                    </div>

                    <div className="score-item">
                      <div className="score-item-top">
                        <span>Nearby Civic Amenities</span>
                        <span className="score-val text-info">{scoreAmenities} / 10</span>
                      </div>
                      <div className="score-track">
                        <div className="score-fill bg-info" style={{ width: `${Math.min(100, Number(scoreAmenities) * 10)}%` }} />
                      </div>
                    </div>

                    <div className="score-item">
                      <div className="score-item-top">
                        <span>5-Year Capital Appreciation Potential</span>
                        <span className="score-val text-warning">{scoreDevelopment} / 10</span>
                      </div>
                      <div className="score-track">
                        <div className="score-fill bg-warning" style={{ width: `${Math.min(100, Number(scoreDevelopment) * 10)}%` }} />
                      </div>
                    </div>
                  </div>

                  <p className="intelligence-rationale">
                    High connectivity along primary highways combined with nearby academic and commercial infrastructure gives this locality strong sustained capital growth potential.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

