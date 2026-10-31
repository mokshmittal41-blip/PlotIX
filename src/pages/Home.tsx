import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Building2, 
  MapPin, 
  Bookmark, 
  TrendingUp, 
  ArrowRight, 
  Calculator, 
  FileText, 
  Ruler, 
  Building, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles, 
  Percent, 
  Hammer, 
  Layers,
  ChevronLeft,
  X,
  Flame,
  ArrowUpRight,
  Navigation,
  Store,
  PlusCircle,
  UploadCloud,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/useAuth';
import { PROPERTIES, MARKET_DATA, formatPrice, formatPricePerUnit } from '../data/dummyData';
import { useApp } from '../context/AppContext';
import { locationHierarchyService } from '../services/locationHierarchyService';
import { propertyService } from '../services/propertyService';
import { getPopularLocationsForStateAndDistrict } from '../data/popularLocationsData';
import { scrollToTop } from '../utils/scrollUtils';
import type { Property } from '../types';

interface HomeProps {
  onNavigate: (page: string, propertyId?: string) => void;
}

type PropertyCategoryTab = 'recommended' | 'new' | 'popular' | 'price_drops';
type IntentType = 'buy' | 'sell' | 'rent' | 'plots' | 'commercial' | 'naksha' | 'map';
type PropertyTypeFilter = 'all' | 'Residential Plot' | 'Commercial Plot' | 'Apartment';

export default function Home({ onNavigate }: HomeProps) {
  const { language, translateType, translateFacing, translateUnit } = useLanguage();
  const { user } = useAuth();
  const { 
    savedPropertyIds, 
    toggleSave, 
    activeLocation, 
    activeRadiusKm, 
    setActiveRadiusKm, 
    setIsLocationModalOpen
  } = useApp();

  // Dynamic live properties from database
  const [liveProperties, setLiveProperties] = useState<Property[]>(PROPERTIES);

  // Quick Sell Property Modal State ("Ham Apni Property Dalna Chahte Hain")
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellTitle, setSellTitle] = useState('');
  const [sellType, setSellType] = useState('Residential Plot');
  const [sellListingType, setSellListingType] = useState<'sale' | 'rent'>('sale');
  const [sellDistrict, setSellDistrict] = useState(activeLocation?.district || 'Mohali');
  const [sellLocality, setSellLocality] = useState('');
  const [sellArea, setSellArea] = useState('');
  const [sellAreaUnit, setSellAreaUnit] = useState('Sq. Yards');
  const [sellPrice, setSellPrice] = useState('');
  const [sellPhone, setSellPhone] = useState(user?.type === 'phone' ? user.identifier : '');
  const [sellName, setSellName] = useState(user?.name || '');
  const [isSubmittingSell, setIsSubmittingSell] = useState(false);
  const [sellSubmittedSuccess, setSellSubmittedSuccess] = useState(false);

  // Sync user info when available
  useEffect(() => {
    if (user?.name && !sellName) setSellName(user.name);
    if (user?.type === 'phone' && user.identifier && !sellPhone) setSellPhone(user.identifier);
  }, [user]);

  // Sync active district
  useEffect(() => {
    if (activeLocation?.district) {
      setSellDistrict(activeLocation.district);
    }
  }, [activeLocation]);

  const handleQuickSellSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellTitle.trim() || !sellPrice.trim() || !sellPhone.trim()) {
      alert('Please fill property title, price, and contact phone.');
      return;
    }
    setIsSubmittingSell(true);
    try {
      const res = await propertyService.createProperty({
        title: sellTitle,
        description: `Verified listing in ${sellLocality || activeLocation?.name || 'Tricity'}, ${sellDistrict}. Listed via PlotIX Direct Portal.`,
        propertyType: sellType,
        listingType: sellListingType,
        price: sellPrice,
        area: sellArea || '150',
        areaUnit: sellAreaUnit,
        city: sellLocality || sellDistrict,
        district: sellDistrict,
        locality: sellLocality,
        contactName: sellName || 'Property Owner',
        contactPhone: sellPhone,
        address: `${sellLocality ? sellLocality + ', ' : ''}${sellDistrict}`
      });

      if (res.success) {
        setSellSubmittedSuccess(true);
        // Refresh live properties list
        propertyService.getProperties({ limit: 150 }).then(data => {
          if (data?.properties?.length) setLiveProperties(data.properties);
        });
      } else {
        alert(res.error || 'Failed to submit property listing.');
      }
    } catch (err) {
      console.error('Error submitting quick sell:', err);
      alert('Failed to submit listing. Please try again.');
    } finally {
      setIsSubmittingSell(false);
    }
  };

  useEffect(() => {
    propertyService.getProperties({ limit: 150 })
      .then(res => {
        if (res.properties && res.properties.length > 0) {
          setLiveProperties(res.properties);
        }
      })
      .catch(() => {});
  }, []);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState<IntentType>('buy');
  const [activePropertyTab, setActivePropertyTab] = useState<PropertyCategoryTab>('recommended');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<PropertyTypeFilter>('all');
  const [selectedBudgetRange, setSelectedBudgetRange] = useState<string>('all');
  const [selectedTehsilFilter, setSelectedTehsilFilter] = useState<string>('all');

  // Property card active image indices (cardId -> index)
  const [cardImageIndices, setCardImageIndices] = useState<Record<string, number>>({});

  // District Intelligence for active district
  const districtIntel = useMemo(() => {
    return locationHierarchyService.getDistrictIntelligence(activeLocation.district);
  }, [activeLocation.district]);

  // Location-aware filtered properties based on active location and active radius
  const locationFilteredProperties = useMemo(() => {
    const sourceList = liveProperties.length > 0 ? liveProperties : PROPERTIES;
    let list = locationHierarchyService.filterProperties(sourceList, activeLocation, activeRadiusKm);
    if (selectedTehsilFilter !== 'all') {
      list = list.filter(p => 
        (p.tehsil && p.tehsil.toLowerCase() === selectedTehsilFilter.toLowerCase()) ||
        p.location.toLowerCase().includes(selectedTehsilFilter.toLowerCase())
      );
    }
    return list;
  }, [liveProperties, activeLocation, activeRadiusKm, selectedTehsilFilter]);

  // Natural query result for search input (e.g. "2 acre land near Bawal", "mandi near me")
  const naturalQueryResult = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const sourceList = liveProperties.length > 0 ? liveProperties : PROPERTIES;
    return locationHierarchyService.parseNaturalQuery(searchQuery, activeLocation, sourceList);
  }, [searchQuery, activeLocation, liveProperties]);

  // Interactive Live EMI Widget State
  const [propertyPriceLakhs, setPropertyPriceLakhs] = useState<number>(85);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(20);
  const interestRate = 8.5; // Benchmark loan interest rate

  // Interactive 10-Second Match Assistant State
  const [matchCity, setMatchCity] = useState<string>(activeLocation.name || 'Rewari');
  const [matchBudget, setMatchBudget] = useState<string>('all');
  const [matchType, setMatchType] = useState<string>('plot');

  // Calculate live EMI & total loan breakdown
  const liveEmiCalculation = useMemo(() => {
    const propertyTotal = propertyPriceLakhs * 100000;
    const loanPrincipal = propertyTotal * 0.8; // 80% loan
    const downPayment = propertyTotal * 0.2;
    const monthlyRate = (interestRate / 100) / 12;
    const totalMonths = loanTenureYears * 12;
    
    const emi = Math.round(
      (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
    );
    const totalPayable = emi * totalMonths;
    const totalInterest = totalPayable - loanPrincipal;

    return {
      propertyTotal,
      principal: loanPrincipal,
      downPayment,
      emi,
      totalInterest,
      totalPayable,
    };
  }, [propertyPriceLakhs, loanTenureYears, interestRate]);

  // Handle cycle card image
  const handleNextImage = (e: React.MouseEvent, propId: string, totalImages: number) => {
    e.stopPropagation();
    setCardImageIndices(prev => ({
      ...prev,
      [propId]: ((prev[propId] || 0) + 1) % totalImages
    }));
  };

  const handlePrevImage = (e: React.MouseEvent, propId: string, totalImages: number) => {
    e.stopPropagation();
    setCardImageIndices(prev => ({
      ...prev,
      [propId]: ((prev[propId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  // Live filtered search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const sourceList = liveProperties.length > 0 ? liveProperties : PROPERTIES;
    return sourceList.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.sector.toLowerCase().includes(q)
    ).slice(0, 4);
  }, [searchQuery, liveProperties]);

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('explore');
  };

  // 1. Sleek 4-Tile Quick Action Grid (Mobile-First Flagship)
  const intentOptions = [
    {
      id: 'buy' as IntentType,
      title: language === 'pa' ? 'ਖਰੀਦੋ' : (language === 'hi' ? 'खरीदें' : 'BUY PLOTS'),
      subtitle: language === 'pa' ? '੫੦+ ਪ੍ਰਮਾਣਿਤ ਪਲਾਟ' : (language === 'hi' ? '५०+ सत्यापित प्लाट' : '50+ Verified Land Plots'),
      icon: <Building2 size={24} strokeWidth={2.4} />,
      color: '#10B981',
      bgLight: 'rgba(16, 185, 129, 0.12)',
      tag: language === 'pa' ? 'ਪ੍ਰਾਪਰਟੀਆਂ ਲੱਭੋ' : (language === 'hi' ? 'प्रॉपर्टी खोजें' : 'Explore'),
      action: () => {
        setSelectedIntent('buy');
        onNavigate('explore');
      }
    },
    {
      id: 'sell' as IntentType,
      title: language === 'pa' ? 'ਵੇਚੋ' : (language === 'hi' ? 'बेचें' : 'SELL / POST'),
      subtitle: language === 'pa' ? 'ਮੁਫ਼ਤ ਲਿਸਟਿੰਗ • ੦% ਕਮਿਸ਼ਨ' : (language === 'hi' ? 'मुफ्त लिस्टिंग • ०% कमीशन' : 'Post in 2 Mins • 0% Brokerage'),
      icon: <PlusCircle size={24} strokeWidth={2.4} />,
      color: '#F59E0B',
      bgLight: 'rgba(245, 158, 11, 0.12)',
      tag: language === 'pa' ? 'ਮੁਫ਼ਤ ਲਿਸਟਿੰਗ' : (language === 'hi' ? 'फ्री पोस्टिंग' : 'Free Post'),
      action: () => {
        setSelectedIntent('sell');
        setShowSellModal(true);
      }
    },
    {
      id: 'naksha' as IntentType,
      title: 'AI NAKSHA™',
      subtitle: language === 'pa' ? '੨D/੩D ਤੇ ਵਾਸਤੂ ਨਕਸ਼ੇ' : (language === 'hi' ? '२D/३D व वास्तु नक्शे' : '2D, 3D & Vastu Plans'),
      icon: <Sparkles size={24} strokeWidth={2.4} />,
      color: '#8B5CF6',
      bgLight: 'rgba(139, 92, 246, 0.12)',
      tag: 'AI Studio',
      action: () => {
        onNavigate('ai-design');
      }
    },
    {
      id: 'map' as IntentType,
      title: language === 'pa' ? 'ਨਕਸ਼ਾ' : (language === 'hi' ? 'GIS मैप' : 'GIS MAP'),
      subtitle: language === 'pa' ? 'ਮਾਸਟਰ ਪਲਾਨ ਤੇ ਸੈਟੇਲਾਈਟ ਨਕਸ਼ਾ' : (language === 'hi' ? 'मास्टर प्लान व सैटेलाइट नक्शा' : 'Interactive Cadastral GIS & Maps'),
      icon: <Navigation size={24} strokeWidth={2.4} />,
      color: '#3B82F6',
      bgLight: 'rgba(59, 130, 246, 0.12)',
      tag: 'Interactive GIS',
      action: () => {
        onNavigate('map');
      }
    },
  ];

  // Filtered properties for explore section (location-prioritized)
  const filteredProperties = useMemo(() => {
    let list = [...locationFilteredProperties];

    // Category filter
    if (activePropertyTab === 'popular') {
      list = list.filter(p => p.rating >= 4.4);
    } else if (activePropertyTab === 'price_drops') {
      list = list.filter(p => p.isVerified);
    }

    // Type filter
    if (selectedTypeFilter !== 'all') {
      list = list.filter(p => p.type === selectedTypeFilter);
    }

    // Budget filter
    if (selectedBudgetRange === 'under_1cr') {
      list = list.filter(p => p.price < 10000000);
    } else if (selectedBudgetRange === '1_2cr') {
      list = list.filter(p => p.price >= 10000000 && p.price <= 20000000);
    } else if (selectedBudgetRange === 'above_2cr') {
      list = list.filter(p => p.price > 20000000);
    }

    return list.slice(0, 8);
  }, [locationFilteredProperties, activePropertyTab, selectedTypeFilter, selectedBudgetRange]);

  // Match Assistant calculated count
  const matchingPropertiesCount = useMemo(() => {
    const sourceList = liveProperties.length > 0 ? liveProperties : PROPERTIES;
    return sourceList.filter(p => {
      const matchLoc = p.city.toLowerCase().includes(matchCity.toLowerCase());
      const matchTypeCond = matchType === 'plot' 
        ? p.type.toLowerCase().includes('plot') 
        : (matchType === 'commercial' ? p.type.toLowerCase().includes('commercial') : !p.type.toLowerCase().includes('plot'));
      const matchBudgetCond = matchBudget === 'under_1cr'
        ? p.price < 10000000
        : matchBudget === '1_2cr'
          ? p.price >= 10000000 && p.price <= 20000000
          : matchBudget === 'above_2cr'
            ? p.price > 20000000
            : true;
      return matchLoc && matchTypeCond && matchBudgetCond;
    }).length || 2;
  }, [matchCity, matchBudget, matchType, liveProperties]);

  // Dynamic Popular Locations derived from active state, district, and live properties
  const locationCards = useMemo(() => {
    return getPopularLocationsForStateAndDistrict(
      activeLocation?.state,
      activeLocation?.district,
      liveProperties
    );
  }, [activeLocation?.state, activeLocation?.district, liveProperties]);

  // Current active region display name for Section 5 & links
  const currentRegionName = useMemo(() => {
    if (activeLocation?.district && activeLocation.district !== 'District Area') {
      return activeLocation.district;
    }
    if (activeLocation?.state) {
      return activeLocation.state;
    }
    return 'India';
  }, [activeLocation?.district, activeLocation?.state]);

  // New & upcoming projects
  const upcomingProjects = [
    {
      id: 'proj-001',
      title: 'Eco City Phase 2',
      developer: 'GMADA Masterplanned',
      location: 'New Chandigarh, Mullanpur',
      priceRange: 'Plots from ₹72 Lakh',
      status: 'Ready to Register',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80',
      tag: 'GMADA Allotted',
    },
    {
      id: 'proj-002',
      title: 'Aerocity Tech Enclave',
      developer: 'Punjab Realty Partners',
      location: 'Sector 82, Airport Road, Mohali',
      priceRange: '₹1.42 Cr – ₹3.20 Cr',
      status: 'Under Construction',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
      tag: 'RERA Approved',
    },
    {
      id: 'proj-003',
      title: 'Trimurti Greens',
      developer: 'HSVP Approved Township',
      location: 'Sector 20, Panchkula',
      priceRange: '₹2.25 Cr – ₹4.50 Cr',
      status: 'Registry Ready',
      image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
      tag: 'HSVP Clear Title',
    },
    {
      id: 'proj-004',
      title: 'Airport Boulevard Commercial',
      developer: 'Highway Retail Group',
      location: 'NH-7 Airport Corridor, Zirakpur',
      priceRange: 'Showrooms from ₹1.12 Cr',
      status: 'New Launch',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
      tag: '100-Ft Frontage',
    },
  ];

  // Real estate news & guides
  const realEstateGuides = [
    {
      id: 'guide-001',
      category: 'Legal Due Diligence',
      title: 'Things to check before buying a plot: Land Title, Registry & Legal Verification',
      readTime: '5 min read',
      date: 'Aug 2026',
      image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&q=80',
    },
    {
      id: 'guide-002',
      category: 'Master Planning & FAR',
      title: 'GMADA vs HSVP: Understanding permissible Floor Area Ratio & setback bylaws',
      readTime: '4 min read',
      date: 'Jul 2026',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80',
    },
    {
      id: 'guide-003',
      category: 'Finance & Taxation',
      title: 'How to calculate total acquisition cost: Stamp duty, circle rate vs market value',
      readTime: '6 min read',
      date: 'Aug 2026',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
    },
    {
      id: 'guide-004',
      category: 'Corridor Analysis',
      title: 'Tricity Real Estate Outlook: Mohali IT Corridor vs New Chandigarh Eco City',
      readTime: '5 min read',
      date: 'Jul 2026',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
    },
  ];

  // Real Calculators in the codebase
  const propertyCalculators = [
    {
      id: 'loan',
      title: 'EMI & Land Loan',
      purpose: 'Monthly payment, amortization & interest breakdown',
      icon: <Percent size={17} />,
      color: '#2563eb',
      bgLight: 'rgba(37, 99, 235, 0.08)',
      badge: 'Interactive',
    },
    {
      id: 'construction',
      title: 'Construction Cost',
      purpose: 'G+1 / G+2 material & turnkey labor build estimator',
      icon: <Hammer size={17} />,
      color: '#059669',
      bgLight: 'rgba(5, 150, 105, 0.08)',
      badge: 'Punjab & HR',
    },
    {
      id: 'stamp_duty',
      title: 'Stamp Duty & Registry',
      purpose: 'State revenue & registry fee calculation',
      icon: <FileText size={17} />,
      color: '#d97706',
      bgLight: 'rgba(217, 119, 6, 0.08)',
      badge: 'Govt. Rates',
    },
    {
      id: 'area',
      title: 'Land & Gaj Converter',
      purpose: 'Convert Gaj, Sq.Yds, Marla, Kanal & Acres',
      icon: <Ruler size={17} />,
      color: '#7c3aed',
      bgLight: 'rgba(124, 58, 237, 0.08)',
      badge: 'All Units',
    },
    {
      id: 'far',
      title: 'FAR & Coverage Planner',
      purpose: 'Permissible building floors & zoning coverage',
      icon: <Building size={17} />,
      color: '#0284c7',
      bgLight: 'rgba(2, 132, 199, 0.08)',
      badge: 'GMADA / HSVP',
    },
    {
      id: 'circle_rates',
      title: 'Collector & Circle Rates',
      purpose: 'Live official rates for Mohali, Chandigarh & Zirakpur',
      icon: <TrendingUp size={17} />,
      color: '#4f46e5',
      bgLight: 'rgba(79, 70, 229, 0.08)',
      badge: '2026 Rates',
    },
  ];

  return (
    <div className="home-flagship-root">
      
      {/* ─── 1. INTERACTIVE SMART SEARCH HERO ──────────────────────────────────── */}
      <section className="home-search-hero-wrap" style={{
        background: 'linear-gradient(135deg, #0A0F1D 0%, #0F172A 60%, #064E3B 100%)',
        border: '1px solid rgba(16, 185, 129, 0.28)',
        borderRadius: '24px',
        padding: '22px 16px 20px',
        boxShadow: '0 20px 48px -12px rgba(10, 15, 29, 0.5), 0 0 0 1px rgba(16, 185, 129, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Ambient emerald flare */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
          borderRadius: '50%',
          filter: 'blur(30px)'
        }} />

        <div className="home-search-hero-content" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-top-badge-row" style={{ justifyContent: 'center', marginBottom: '10px' }}>
            <button 
              type="button"
              className="hero-location-active-pill"
              onClick={() => setIsLocationModalOpen(true)}
              title="Click to switch your PlotIX active location"
              id="btn-hero-change-location"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1.5px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '999px',
                color: '#F8FAFC',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <span style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#10B981',
                color: '#FFFFFF'
              }}>
                <MapPin size={11} strokeWidth={2.5} />
                <span className="live-dot" style={{ position: 'absolute', top: -1, right: -1 }} />
              </span>
              <span style={{ color: '#E2E8F0', fontWeight: 600 }}>
                Active: <strong style={{ color: '#34D399', fontWeight: 800 }}>{activeLocation.name}</strong> <span style={{ color: '#94A3B8', fontWeight: 500 }}>({activeLocation.district})</span>
              </span>
              <span style={{ 
                fontSize: '10px', 
                color: '#FFFFFF', 
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', 
                padding: '2px 8px', 
                borderRadius: '999px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                marginLeft: '4px'
              }}>
                Switch
              </span>
            </button>
          </div>

          <h1 className="home-hero-headline" style={{
            fontSize: '22px',
            fontWeight: 900,
            letterSpacing: '-0.4px',
            color: '#FFFFFF',
            margin: '4px 0 8px',
            textAlign: 'center',
            lineHeight: 1.25
          }}>
            {language === 'pa' 
              ? `${activeLocation.name} ਵਿੱਚ ਪ੍ਰਮਾਣਿਤ ਪਲਾਟ ਅਤੇ ਜ਼ਮੀਨ` 
              : (language === 'hi' 
                ? `${activeLocation.name} में सत्यापित प्लाट व ज़मीन` 
                : (
                  <>
                    Find Verified Plots & Land in{' '}
                    <span style={{
                      background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 900
                    }}>
                      {activeLocation.name}
                    </span>
                  </>
                ))}
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: '0 auto 16px', textAlign: 'center', maxWidth: '540px', lineHeight: 1.45 }}>
            Geographic discovery across {activeLocation.district} district, verified sub-tehsils, mandis, and master plans.
          </p>

          {/* Interactive Search Input with Natural Language Parser */}
          <div className="home-search-interactive-wrapper" style={{ maxWidth: '780px', margin: '0 auto', width: '100%' }}>
            <form className="home-smart-search-bar" onSubmit={handleSearchSubmit} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: '#FFFFFF',
              border: '1.5px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '20px',
              padding: '6px 8px 6px 18px',
              boxShadow: '0 8px 28px -6px rgba(16, 185, 129, 0.16), 0 2px 6px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <div className="search-bar-icon-wrap">
                <Search size={20} color="#059669" strokeWidth={2.4} />
              </div>
              <input
                type="text"
                className="search-bar-input-field"
                placeholder={`Search e.g. "2 acre land near Bawal", "plots in ${activeLocation.name}", "mandi"...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                id="input-home-hero-search"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '14.5px',
                  fontWeight: 500,
                  color: '#0F172A',
                  background: 'transparent'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
              <button type="submit" className="search-bar-submit-btn" aria-label="Search" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '14px',
                padding: '11px 22px',
                fontSize: '13.5px',
                fontWeight: 800,
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                transition: 'all 0.2s'
              }}>
                <span>{language === 'pa' ? 'ਖੋਜੋ' : (language === 'hi' ? 'खोजें' : 'Search')}</span>
                <ArrowRight size={15} strokeWidth={2.5} />
              </button>
            </form>

            {/* Instant Search Autocomplete Drawer with Natural Query & Mandis */}
            <AnimatePresence>
              {isSearchFocused && (searchSuggestions.length > 0 || (naturalQueryResult && naturalQueryResult.totalMatches > 0)) && (
                <motion.div 
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="search-suggestions-dropdown"
                >
                  <div className="suggestions-header">
                    <span>
                      {naturalQueryResult?.isMandiQuery ? '🌾 Matching Mandis & Grain Markets' : 'Matching Verified Properties'}
                    </span>
                    <button type="button" onClick={() => setIsSearchFocused(false)}><X size={12} /></button>
                  </div>

                  {/* Matching Mandis */}
                  {naturalQueryResult?.matchedMandis && naturalQueryResult.matchedMandis.length > 0 && (
                    <div className="suggestions-mandis-group" style={{ padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', marginBottom: '6px' }}>
                        🌾 Agricultural Mandis & Markets ({activeLocation.district}):
                      </div>
                      {naturalQueryResult.matchedMandis.slice(0, 3).map(m => (
                        <div 
                          key={m.id} 
                          className="suggestion-item-row"
                          onClick={() => {
                            setIsSearchFocused(false);
                            onNavigate('explore');
                          }}
                        >
                          <div style={{ width: 28, height: 28, background: 'rgba(16,185,129,0.15)', color: '#10b981', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Store size={14} />
                          </div>
                          <div className="suggestion-info">
                            <div className="suggestion-title">{m.name}</div>
                            <div className="suggestion-meta">
                              <span>{m.type} • {m.tehsil}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Matching Properties */}
                  {(naturalQueryResult?.matchedProperties || searchSuggestions).slice(0, 4).map(s => (
                    <div 
                      key={s.id} 
                      className="suggestion-item-row"
                      onClick={() => {
                        setIsSearchFocused(false);
                        onNavigate('detail', s.id);
                      }}
                    >
                      <img src={s.images[0]} alt={s.title} className="suggestion-thumb" />
                      <div className="suggestion-info">
                        <div className="suggestion-title">{s.title}</div>
                        <div className="suggestion-meta">
                          <MapPin size={11} />
                          <span>{s.location}</span>
                          {s.calculatedDistanceKm !== undefined && (
                            <span style={{ color: '#10b981', fontWeight: 700 }}>• {s.calculatedDistanceKm} km</span>
                          )}
                          <strong>{formatPrice(s.price)}</strong>
                        </div>
                      </div>
                      <ArrowUpRight size={14} color="#059669" />
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ─── DYNAMIC "AROUND ME" RADIUS SELECTOR (Mobile-First Single Row Horizontal Scroll) ─── */}
          <div className="home-dynamic-radius-bar" style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            gap: '8px',
            marginTop: '16px',
            padding: '6px 10px',
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '999px',
            maxWidth: '100%',
            width: '100%',
            boxSizing: 'border-box',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', fontWeight: 800, color: '#94A3B8', paddingLeft: '4px', flexShrink: 0 }}>
              <Navigation size={13} style={{ color: '#10B981' }} />
              <span>Radius:</span>
            </div>
            {[1, 5, 10, 25, 50].map((r) => {
              const isActive = activeRadiusKm === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setActiveRadiusKm(r)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '999px',
                    border: isActive ? '1.5px solid #10B981' : '1px solid rgba(255, 255, 255, 0.12)',
                    background: isActive ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'rgba(255, 255, 255, 0.08)',
                    color: isActive ? '#FFFFFF' : '#E2E8F0',
                    fontSize: '12px',
                    fontWeight: 750,
                    cursor: 'pointer',
                    flexShrink: 0,
                    boxShadow: isActive ? '0 2px 10px rgba(16, 185, 129, 0.4)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {r} km
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setActiveRadiusKm('district')}
              style={{
                padding: '5px 14px',
                borderRadius: '999px',
                border: activeRadiusKm === 'district' ? '1.5px solid #10B981' : '1px solid rgba(255, 255, 255, 0.12)',
                background: activeRadiusKm === 'district' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'rgba(255, 255, 255, 0.08)',
                color: activeRadiusKm === 'district' ? '#FFFFFF' : '#34D399',
                fontSize: '12px',
                fontWeight: 750,
                cursor: 'pointer',
                flexShrink: 0,
                whiteSpace: 'nowrap',
                boxShadow: activeRadiusKm === 'district' ? '0 2px 10px rgba(16, 185, 129, 0.4)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              🌐 Entire {activeLocation.district} District
            </button>
          </div>
        </div>
      </section>

      {/* ─── 2. SLEEK COMPACT "WHAT ARE YOU LOOKING FOR?" ──────────────────────── */}
      <section className="home-section-container">
        <div className="home-section-header-row">
          <div>
            <h2 className="home-section-title">
              {language === 'pa' ? 'ਤੁਸੀਂ ਕੀ ਲੱਭ ਰਹੇ ਹੋ?' : (language === 'hi' ? 'आप क्या खोज रहे हैं?' : 'What are you looking for?')}
            </h2>
            <p className="home-section-subtitle">
              {language === 'pa' ? 'ਖਰੀਦਣ ਲਈ ਪ੍ਰਾਪਰਟੀਆਂ ਲੱਭੋ ਜਾਂ ਆਪਣੀ ਪ੍ਰਾਪਰਟੀ ਵੇਚਣ ਲਈ ਲਿਸਟ ਕਰੋ' : (language === 'hi' ? 'प्रॉपर्टी खरीदें या अपनी प्रॉपर्टी बेचने के लिए पोस्ट करें' : 'Choose BUY to explore verified properties or SELL to list your property')}
            </p>
          </div>
        </div>

        {/* Compact, Sleek 2-Pill Grid (BUY & SELL ONLY) */}
        <div className="home-sleek-intents-grid">
          {intentOptions.map((item) => (
            <motion.div
              key={item.id}
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -3 }}
              className={`sleek-intent-pill-card ${selectedIntent === item.id ? 'active' : ''}`}
              onClick={item.action}
              role="button"
              tabIndex={0}
              id={`btn-intent-${item.id}`}
            >
              <div className="sleek-intent-icon-wrap" style={{ background: item.bgLight, color: item.color }}>
                {item.icon}
              </div>
              <div className="sleek-intent-text-col">
                <div className="sleek-intent-title-row">
                  <span className="sleek-intent-title">{item.title}</span>
                  <span 
                    className="sleek-intent-tag"
                    style={{ 
                      background: item.bgLight, 
                      color: item.color,
                      border: `1px solid ${item.color}35`
                    }}
                  >
                    {item.tag}
                  </span>
                </div>
                <span className="sleek-intent-sub">{item.subtitle}</span>
              </div>
              <ChevronRight size={18} className="sleek-intent-arrow" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── 3. 10-SECOND INTERACTIVE PROPERTY MATCH ASSISTANT ─────────────────── */}
      <section className="home-section-container">
        <div className="home-interactive-match-widget">
          <div className="match-widget-header">
            <div className="match-widget-title-box">
              <Sparkles size={16} color="#10b981" />
              <h3>
                {language === 'pa' ? '10 ਸਕਿੰਟਾਂ ਵਿੱਚ ਆਪਣੀ ਮਨਪਸੰਦ ਪ੍ਰਾਪਰਟੀ ਲੱਭੋ' : (language === 'hi' ? '10 सेकंड में अपनी मनपसंद प्रॉपर्टी खोजें' : 'Find your ideal property in 10 seconds')}
              </h3>
            </div>
            <span className="match-count-badge">
              <Flame size={12} />
              <span>
                {matchingPropertiesCount} {language === 'pa' ? 'ਮਿਲਦੇ ਪਲਾਟ ਉਪਲਬਧ' : (language === 'hi' ? 'प्रमाणित प्लाट उपलब्ध' : 'Matching Properties')}
              </span>
            </span>
          </div>

          <div className="match-selectors-row">
            {/* 1. City Select */}
            <div className="match-step-box">
              <span className="step-num-lbl">
                {language === 'pa' ? '1. ਇਲਾਕਾ / ਸ਼ਹਿਰ' : (language === 'hi' ? '1. लोकेशन / शहर' : '1. Location')}
              </span>
              <div className="step-chips-group">
                {['Mohali', 'Chandigarh', 'Panchkula', 'New Chd'].map(city => (
                  <button
                    key={city}
                    type="button"
                    className={`step-choice-chip ${matchCity === city ? 'active' : ''}`}
                    onClick={() => setMatchCity(city)}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Type Select */}
            <div className="match-step-box">
              <span className="step-num-lbl">
                {language === 'pa' ? '2. ਪ੍ਰਾਪਰਟੀ ਦੀ ਕਿਸਮ' : (language === 'hi' ? '2. प्रॉपर्टी का प्रकार' : '2. Property Type')}
              </span>
              <div className="step-chips-group">
                {[
                  { id: 'plot', label: language === 'pa' ? 'ਪਲਾਟ / ਜ਼ਮੀਨ' : (language === 'hi' ? 'प्लाट / ज़मीन' : 'Plots / Land') },
                  { id: 'home', label: language === 'pa' ? 'ਮਕਾਨ / ਫਲੈਟ' : (language === 'hi' ? 'मकान / फ्लैट' : 'Apartment/Villa') },
                  { id: 'commercial', label: language === 'pa' ? 'ਵਪਾਰਕ (SCO)' : (language === 'hi' ? 'कमर्शियल (दुकान)' : 'Commercial') },
                ].map(t => (
                  <button
                    key={t.id}
                    type="button"
                    className={`step-choice-chip ${matchType === t.id ? 'active' : ''}`}
                    onClick={() => setMatchType(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Budget Select */}
            <div className="match-step-box">
              <span className="step-num-lbl">
                {language === 'pa' ? '3. ਬਜਟ' : (language === 'hi' ? '3. बजट' : '3. Budget')}
              </span>
              <div className="step-chips-group">
                {[
                  { id: 'all', label: language === 'pa' ? 'ਕੋਈ ਵੀ ਬਜਟ' : (language === 'hi' ? 'सभी बजट' : 'All Budgets') },
                  { id: 'under_1cr', label: language === 'pa' ? '< ₹1 ਕਰੋੜ' : (language === 'hi' ? '< ₹1 करोड़' : '< ₹1 Cr') },
                  { id: '1_2cr', label: language === 'pa' ? '₹1 - 2 ਕਰੋੜ' : (language === 'hi' ? '₹1 - 2 करोड़' : '₹1 - 2 Cr') },
                  { id: 'above_2cr', label: language === 'pa' ? '₹2 ਕਰੋੜ+' : (language === 'hi' ? '₹2 करोड़+' : '₹2 Cr+') },
                ].map(b => (
                  <button
                    key={b.id}
                    type="button"
                    className={`step-choice-chip ${matchBudget === b.id ? 'active' : ''}`}
                    onClick={() => setMatchBudget(b.id)}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="match-widget-bottom-action">
            <button
              type="button"
              className="match-launch-btn"
              onClick={() => onNavigate('explore')}
            >
              <span>
                {language === 'pa' 
                  ? `${activeLocation.name} ਵਿੱਚ ${locationFilteredProperties.length} ਪ੍ਰਮਾਣਿਤ ਪਲਾਟ ਵੇਖੋ →` 
                  : (language === 'hi' 
                    ? `${activeLocation.name} में ${locationFilteredProperties.length} प्रमाणित प्लाट देखें →` 
                    : `Explore ${locationFilteredProperties.length} Verified Listings in ${activeLocation.name} →`)}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── 3.5 DEDICATED DISTRICT & TEHSIL INTELLIGENCE HUB (Requirement 4 & 9) ─── */}
      <section className="home-section-container district-hub-section">
        <div className="district-hub-card" style={{
          background: '#FFFFFF',
          border: '1.5px solid rgba(226, 232, 240, 0.95)',
          borderRadius: '22px',
          padding: '24px',
          boxShadow: '0 10px 30px -8px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(15, 23, 42, 0.02)'
        }}>
          <div className="district-hub-header" style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.08) 100%)',
                color: '#059669',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)'
              }}>
                <Building size={22} strokeWidth={2.4} />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 850, color: '#0F172A', margin: 0, letterSpacing: '-0.3px' }}>
                  📍 {activeLocation.district} District Property Intelligence
                </h2>
                <p style={{ fontSize: '12.5px', color: '#64748B', margin: '3px 0 0', fontWeight: 500 }}>
                  Complete Geographic Coverage • {districtIntel.tehsils.length} Tehsils • {districtIntel.villages.length} Mapped Villages • {districtIntel.mandis.length} Mandis & Markets
                </p>
              </div>
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '999px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1.5px solid rgba(16, 185, 129, 0.25)',
              color: '#047857',
              fontSize: '11.5px',
              fontWeight: 800
            }}>
              <ShieldCheck size={14} strokeWidth={2.5} />
              <span>Verified Seed Dataset</span>
            </div>
          </div>

          {/* Key District Benchmark Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ padding: '14px', background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '14px' }}>
              <span style={{ display: 'block', fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Avg. Residential Plot</span>
              <span style={{ display: 'block', fontSize: '16px', fontWeight: 900, color: '#0F172A', marginTop: '4px' }}>
                ₹{(districtIntel?.priceTrends?.avgResidentialPlotSqYd || 42000).toLocaleString()}/sq.yd
              </span>
              <span style={{ fontSize: '11px', color: '#059669', fontWeight: 750 }}>+{(districtIntel?.priceTrends?.yoyGrowthPercent || 14.2)}% YoY</span>
            </div>

            <div style={{ padding: '14px', background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '14px' }}>
              <span style={{ display: 'block', fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Avg. Agricultural Land</span>
              <span style={{ display: 'block', fontSize: '16px', fontWeight: 900, color: '#0F172A', marginTop: '4px' }}>
                ₹{(((districtIntel?.priceTrends?.avgAgriLandPerAcre || 8500000)) / 100000).toFixed(0)} Lakh/acre
              </span>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Sweet water zone</span>
            </div>

            <div style={{ padding: '14px', background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '14px' }}>
              <span style={{ display: 'block', fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Market Demand</span>
              <span style={{ display: 'block', fontSize: '16px', fontWeight: 900, color: '#059669', marginTop: '4px' }}>
                {districtIntel?.priceTrends?.demandIndex || 'High'} Demand
              </span>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>High acquisition rate</span>
            </div>

            <div style={{ padding: '14px', background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '14px' }}>
              <span style={{ display: 'block', fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Verified Listings</span>
              <span style={{ display: 'block', fontSize: '16px', fontWeight: 900, color: '#0F172A', marginTop: '4px' }}>
                {locationFilteredProperties.length} Properties
              </span>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Clear title / Verified Deeds</span>
            </div>
          </div>

          {/* Sub-District / Tehsil Drill-Down (Requirement 3 & 4) */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 750, color: '#64748B', marginBottom: '10px' }}>
              <Layers size={14} style={{ color: '#059669' }} />
              <span>Explore Tehsils in {activeLocation.district} District:</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setSelectedTehsilFilter('all')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  border: selectedTehsilFilter === 'all' ? '1.5px solid #059669' : '1px solid #E2E8F0',
                  background: selectedTehsilFilter === 'all' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : '#F8FAFC',
                  color: selectedTehsilFilter === 'all' ? '#FFFFFF' : '#334155',
                  fontSize: '12px',
                  fontWeight: 750,
                  cursor: 'pointer',
                  boxShadow: selectedTehsilFilter === 'all' ? '0 2px 8px rgba(16, 185, 129, 0.35)' : 'none',
                  transition: 'all 0.15s'
                }}
              >
                All Tehsils ({districtIntel.tehsils.length})
              </button>
              {districtIntel.tehsils.map((teh) => {
                const isSelected = selectedTehsilFilter.toLowerCase() === teh.name.toLowerCase();
                return (
                  <button
                    key={teh.id}
                    type="button"
                    onClick={() => setSelectedTehsilFilter(isSelected ? 'all' : teh.name)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '999px',
                      border: isSelected ? '1.5px solid #059669' : '1px solid #E2E8F0',
                      background: isSelected ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : '#F8FAFC',
                      color: isSelected ? '#FFFFFF' : '#334155',
                      fontSize: '12px',
                      fontWeight: 750,
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 2px 8px rgba(16, 185, 129, 0.35)' : 'none',
                      transition: 'all 0.15s'
                    }}
                  >
                    <span>{teh.name}</span>
                    <span style={{ fontSize: '10.5px', color: isSelected ? '#FFFFFF' : '#64748B', opacity: 0.85, fontWeight: 600 }}>
                      {teh.avgPriceSqYd}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Local Mandis & Commercial Markets in District (Requirement 4) */}
          {districtIntel.mandis.length > 0 && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 750, color: '#64748B', marginBottom: '10px' }}>
                <Store size={14} style={{ color: '#059669' }} />
                <span>Agricultural Mandis & Key Markets in {activeLocation.district}:</span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '10px'
              }}>
                {districtIntel.mandis.map((mandi) => {
                  const dist = locationHierarchyService.calculateDistanceKm(activeLocation.coordinates, mandi.coordinates);
                  return (
                    <div
                      key={mandi.id}
                      style={{
                        padding: '12px 14px',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>{mandi.name}</span>
                        <span style={{ fontSize: '11px', color: '#059669', fontWeight: 800 }}>📍 {dist} km</span>
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '8px' }}>
                        {mandi.type} • {mandi.tehsil} Tehsil
                      </div>
                      {mandi.commodities && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {mandi.commodities.slice(0, 3).map((c, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: '10px',
                                background: 'rgba(16, 185, 129, 0.1)',
                                color: '#047857',
                                padding: '2px 7px',
                                borderRadius: '4px',
                                fontWeight: 700
                              }}
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── 4. EXPLORE PROPERTIES (INTERACTIVE FEED) ──────────────────────────── */}
      <section className="home-section-container">
        <div className="home-section-header-row">
          <div>
            <h2 className="home-section-title">
              {language === 'pa' ? 'ਜਾਇਦਾਦਾਂ ਦੇਖੋ' : (language === 'hi' ? 'प्रॉपर्टी देखें' : 'Explore properties')}
            </h2>
            <p className="home-section-subtitle">
              {language === 'pa' ? 'ਤੁਹਾਡੀਆਂ ਲੋੜਾਂ ਮੁਤਾਬਕ ਪ੍ਰਮਾਣਿਤ ਜਾਇਦਾਦਾਂ' : (language === 'hi' ? 'आपकी आवश्यकताओं से मेल खाती सत्यापित संपत्तियां' : `Browse verified listings in and around ${activeLocation.name} (${activeLocation.district} District)`)}
            </p>
          </div>
          <button 
            type="button" 
            className="home-section-view-all-btn"
            onClick={() => onNavigate('explore')}
          >
            <span>View all ({locationFilteredProperties.length})</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Interactive Filter Pills Row */}
        <div className="home-filter-controls-strip">
          <div className="home-category-tabs-row">
            <button
              type="button"
              className={`home-cat-tab-btn ${activePropertyTab === 'recommended' ? 'active' : ''}`}
              onClick={() => setActivePropertyTab('recommended')}
            >
              {language === 'pa' ? 'ਸਿਫ਼ਾਰਸ਼ੀ' : (language === 'hi' ? 'अनुशंसित' : 'Recommended')}
            </button>
            <button
              type="button"
              className={`home-cat-tab-btn ${activePropertyTab === 'new' ? 'active' : ''}`}
              onClick={() => setActivePropertyTab('new')}
            >
              {language === 'pa' ? 'ਨਵੇਂ ਪਲਾਟ' : (language === 'hi' ? 'नई लिस्टिंग्स' : 'New Listings')}
            </button>
            <button
              type="button"
              className={`home-cat-tab-btn ${activePropertyTab === 'popular' ? 'active' : ''}`}
              onClick={() => setActivePropertyTab('popular')}
            >
              {language === 'pa' ? 'ਚੋਟੀ ਦੇ ਰੇਟਿੰਗ ਵਾਲੇ' : (language === 'hi' ? 'टॉप रेटेड' : 'Top Rated')}
            </button>
            <button
              type="button"
              className={`home-cat-tab-btn ${activePropertyTab === 'price_drops' ? 'active' : ''}`}
              onClick={() => setActivePropertyTab('price_drops')}
            >
              {language === 'pa' ? 'ਸਿਰਫ਼ ਪ੍ਰਮਾਣਿਤ' : (language === 'hi' ? 'केवल प्रमाणित' : 'Verified Only')}
            </button>
          </div>

          {/* Interactive Property Type & Budget Chips */}
          <div className="home-subfilter-chips-row">
            {[
              { id: 'all' as PropertyTypeFilter, label: language === 'pa' ? 'ਸਾਰੀਆਂ ਕਿਸਮਾਂ' : (language === 'hi' ? 'सभी प्रकार' : 'All Types') },
              { id: 'Residential Plot' as PropertyTypeFilter, label: language === 'pa' ? 'ਪਲਾਟ ਤੇ ਜ਼ਮੀਨ' : (language === 'hi' ? 'प्लाट व ज़मीन' : 'Plots & Land') },
              { id: 'Apartment' as PropertyTypeFilter, label: language === 'pa' ? 'ਫਲੈਟ ਤੇ ਕੋਠੀਆਂ' : (language === 'hi' ? 'फ्लैट व कोठियां' : 'Flats & Villas') },
              { id: 'Commercial Plot' as PropertyTypeFilter, label: language === 'pa' ? 'ਵਪਾਰਕ (SCO)' : (language === 'hi' ? 'कमर्शियल' : 'Commercial') },
            ].map(typePill => (
              <button
                key={typePill.id}
                type="button"
                className={`home-subfilter-chip ${selectedTypeFilter === typePill.id ? 'active' : ''}`}
                onClick={() => setSelectedTypeFilter(typePill.id)}
              >
                {typePill.label}
              </button>
            ))}
          </div>

          <div className="home-subfilter-chips-row">
            {[
              { id: 'all', label: language === 'pa' ? 'ਸਾਰੇ ਬਜਟ' : (language === 'hi' ? 'सभी बजट' : 'All Budgets') },
              { id: 'under_1cr', label: language === 'pa' ? '< ₹1 ਕਰੋੜ' : (language === 'hi' ? '₹1 करोड़ से कम' : 'Under ₹1 Cr') },
              { id: '1_2cr', label: language === 'pa' ? '₹1 - 2 ਕਰੋੜ' : (language === 'hi' ? '₹1 - 2 करोड़' : '₹1 Cr - ₹2 Cr') },
              { id: 'above_2cr', label: language === 'pa' ? '₹2 ਕਰੋੜ+' : (language === 'hi' ? '₹2 करोड़+' : '₹2 Cr+') },
            ].map(budgetPill => (
              <button
                key={budgetPill.id}
                type="button"
                className={`home-subfilter-chip ${selectedBudgetRange === budgetPill.id ? 'active' : ''}`}
                onClick={() => setSelectedBudgetRange(budgetPill.id)}
              >
                {budgetPill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Property Cards Carousel / Responsive Grid */}
        {filteredProperties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)', margin: '16px 0' }}>
            <p style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-text)', marginBottom: '6px' }}>
              No verified listings found in {activeLocation.name} matching your active filters
            </p>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: 0 }}>
              Try selecting "All Types" or searching nearby areas.
            </p>
          </div>
        ) : (
          <div className="home-properties-cards-scroll">
            {filteredProperties.map((property) => {
              const isSaved = savedPropertyIds.has(property.id);
              const activeImgIdx = cardImageIndices[property.id] || 0;
              const currentImg = property.images[activeImgIdx] || property.images[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80';
              const estEmiMonthly = Math.round((property.price * 0.8 * 0.085) / 12);

              return (
                <div 
                  key={property.id} 
                  className="home-property-editorial-card"
                  onClick={() => onNavigate('detail', property.id)}
                >
                  <div className="prop-editorial-image-wrap">
                    <img 
                      src={currentImg} 
                      alt={property.title} 
                      className="prop-editorial-img" 
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="prop-image-badge-overlay">
                      {property.isVerified && (
                        <span className="prop-verified-pill">
                          <ShieldCheck size={12} />
                          <span>PlotIX Verified</span>
                        </span>
                      )}
                      <span className="prop-type-pill">{translateType(property.type)}</span>
                    </div>

                    {/* Multi-Image Interactive Controls */}
                    {property.images.length > 1 && (
                      <div className="card-image-nav-controls">
                        <button 
                          type="button" 
                          className="img-nav-btn left" 
                          onClick={(e) => handlePrevImage(e, property.id, property.images.length)}
                          aria-label="Previous photo"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <div className="img-nav-dots">
                          {property.images.map((_, idx) => (
                            <span key={idx} className={`dot ${idx === activeImgIdx ? 'active' : ''}`} />
                          ))}
                        </div>
                        <button 
                          type="button" 
                          className="img-nav-btn right" 
                          onClick={(e) => handleNextImage(e, property.id, property.images.length)}
                          aria-label="Next photo"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      className={`prop-card-save-icon-btn ${isSaved ? 'saved' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSave(property.id);
                      }}
                      aria-label="Save property"
                    >
                      <Bookmark size={16} fill={isSaved ? '#2563eb' : 'none'} color={isSaved ? '#2563eb' : '#ffffff'} />
                    </button>
                  </div>

                  <div className="prop-editorial-body">
                    <div className="prop-price-row">
                      <span className="prop-editorial-price">{formatPrice(property.price)}</span>
                      <span className="prop-rate-sub">{formatPricePerUnit(property.pricePerUnit, property.areaUnit)}</span>
                    </div>

                    <h4 className="prop-editorial-title">{property.title}</h4>

                    <div className="prop-editorial-meta-row">
                      <span 
                        className="prop-meta-item" 
                        style={{ 
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <MapPin size={11} style={{ color: '#ef4444' }} />
                        <span style={{ color: 'var(--color-text)' }}>{property.location}</span>
                      </span>
                      <span className="prop-meta-bullet">•</span>
                      <span className="prop-meta-item">{property.area} {translateUnit(property.areaUnit)}</span>
                    </div>

                    <div className="prop-card-emi-tag-row">
                      <span className="emi-tag">Est. EMI: ₹{estEmiMonthly.toLocaleString('en-IN')}/mo</span>
                      <span className="prop-facing-tag">{translateFacing(property.facing)}</span>
                    </div>

                    <div className="prop-editorial-footer-bar">
                      <span>{language === 'pa' ? 'ਵੇਰਵੇ ਵੇਖੋ' : (language === 'hi' ? 'विवरण देखें' : 'View Details')}</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="home-section-bottom-link-row">
          <button 
            type="button" 
            className="home-full-width-action-btn"
            onClick={() => {
              onNavigate('explore');
              scrollToTop();
            }}
          >
            <span>
              {language === 'pa' 
                ? `${currentRegionName} ਦੀਆਂ ਸਾਰੀਆਂ ਪ੍ਰਾਪਰਟੀਆਂ ਵੇਖੋ (${locationFilteredProperties.length || liveProperties.length}) →` 
                : (language === 'hi' 
                  ? `${currentRegionName} की सभी प्रॉपर्टी देखें (${locationFilteredProperties.length || liveProperties.length}) →` 
                  : `View all properties in ${currentRegionName} (${locationFilteredProperties.length || liveProperties.length}) →`)}
            </span>
          </button>
        </div>
      </section>

      {/* ─── 5. EXPLORE POPULAR LOCATIONS (INTERACTIVE CORRIDOR CARDS) ──────────── */}
      <section className="home-section-container">
        <div className="home-section-header-row">
          <div>
            <h2 className="home-section-title">
              {language === 'pa' 
                ? `${currentRegionName} ਦੇ ਪ੍ਰਮੁੱਖ ਇਲਾਕੇ ਦੇਖੋ` 
                : (language === 'hi' 
                  ? `${currentRegionName} के प्रमुख इलाके व ग्रोथ कॉरिडोर` 
                  : `Explore popular locations in ${currentRegionName}`)}
            </h2>
            <p className="home-section-subtitle">
              {language === 'pa' 
                ? `${currentRegionName} ਦੇ ਮੁੱਖ ਵਿਕਾਸ ਕਾਰੀਡੋਰ, ਮੰਡੀਆਂ ਅਤੇ ਲਾਈਵ ਸੈਕਟਰ ਰੇਟ` 
                : (language === 'hi' 
                  ? `${currentRegionName} के सबसे लोकप्रिय, तेजी से बढ़ते इलाके, मंडियां व सेक्टर रेट्स` 
                  : `Key growth corridors, mandis & sectors in ${currentRegionName} with live benchmark rates`)}
            </p>
          </div>
          <button 
            type="button" 
            className="home-section-view-all-btn"
            onClick={() => {
              onNavigate('explore');
              scrollToTop();
            }}
          >
            <span>{language === 'pa' ? 'ਸਾਰੇ ਇਲਾਕੇ' : (language === 'hi' ? 'सभी इलाके' : 'All locations')}</span>
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="home-locations-cards-scroll">
          {locationCards.map((loc) => (
            <div
              key={loc.id || loc.name}
              className="home-location-feature-card"
              onClick={() => {
                setSearchQuery(loc.searchFilter || loc.name);
                onNavigate('explore');
                scrollToTop();
              }}
            >
              <div 
                className="location-card-bg-image" 
                style={{ backgroundImage: `url(${loc.bgImage})` }} 
              />
              <div className="location-card-gradient-overlay" />
              <div className="location-card-content-wrap">
                <div className="location-card-top-chips">
                  <span className="loc-growth-pill">
                    <TrendingUp size={11} />
                    <span>{loc.growth} {language === 'pa' ? 'ਸਾਲਾਨਾ' : (language === 'hi' ? 'सालाना' : 'p.a.')}</span>
                  </span>
                  <span className="loc-count-pill">{loc.count}</span>
                </div>
                <div className="location-card-bottom-info">
                  <h3 className="location-name-heading">{loc.name}</h3>
                  <p className="location-tagline-txt">{loc.tagline}</p>
                  
                  {/* Interactive Sector Badges */}
                  <div className="location-sectors-mini-row">
                    {loc.sectors.slice(0, 4).map(sec => (
                      <span 
                        key={sec} 
                        className="mini-sector-chip"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSearchQuery(sec);
                          onNavigate('explore');
                          scrollToTop();
                        }}
                      >
                        {sec}
                      </span>
                    ))}
                  </div>

                  <div className="location-avg-rate-box">
                    <span className="loc-rate-lbl">{language === 'pa' ? 'ਔਸਤ ਰੇਟ:' : (language === 'hi' ? 'औसत रेट:' : 'Avg Benchmark:')}</span>
                    <span className="loc-rate-val">{loc.avgPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 6. NEW & UPCOMING PROJECTS ────────────────────────────────────────── */}
      <section className="home-section-container">
        <div className="home-section-header-row">
          <div>
            <h2 className="home-section-title">
              {language === 'pa' ? 'ਨਵੇਂ ਅਤੇ ਆਗਾਮੀ ਪ੍ਰੋਜੈਕਟ' : (language === 'hi' ? 'नए व आगामी प्रोजेक्ट्स' : 'New & upcoming projects')}
            </h2>
            <p className="home-section-subtitle">
              {language === 'pa' ? 'ਮਾਸਟਰਪਲਾਨ ਟਾਊਨਸ਼ਿਪਾਂ ਤੇ ਪ੍ਰਮੁੱਖ ਪ੍ਰੋਜੈਕਟ' : (language === 'hi' ? 'मास्टरप्लान टाउनशिप्स व नए प्रोजेक्ट्स' : 'Masterplanned townships and premier developments')}
            </p>
          </div>
          <button 
            type="button" 
            className="home-section-view-all-btn"
            onClick={() => onNavigate('explore')}
          >
            <span>{language === 'pa' ? 'ਸਾਰੇ ਵੇਖੋ' : (language === 'hi' ? 'सभी देखें' : 'View all')}</span>
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="home-projects-cards-scroll">
          {upcomingProjects.map((proj) => (
            <div 
              key={proj.id} 
              className="home-project-card"
              onClick={() => onNavigate('explore')}
            >
              <div className="project-card-image-wrap">
                <img src={proj.image} alt={proj.title} className="project-card-img" loading="lazy" />
                <span className="project-status-tag">{proj.tag}</span>
              </div>
              <div className="project-card-body">
                <span className="project-developer-lbl">{proj.developer}</span>
                <h4 className="project-title-heading">{proj.title}</h4>
                <div className="project-location-row">
                  <MapPin size={13} />
                  <span>{proj.location}</span>
                </div>
                <div className="project-price-status-row">
                  <span className="project-price-txt">{proj.priceRange}</span>
                  <span className="project-badge-status">{proj.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 7. MARKET AT A GLANCE (COMPACT TEASER) ────────────────────────────── */}
      <section className="home-section-container">
        <div className="home-section-header-row">
          <div>
            <h2 className="home-section-title">
              {language === 'pa' ? 'ਬਜ਼ਾਰ ਦੀ ਸਥਿਤੀ ਇਕ ਨਜ਼ਰ ਵਿੱਚ' : (language === 'hi' ? 'मार्केट ट्रेंड्स एक नज़र में' : 'Market at a glance')}
            </h2>
            <p className="home-section-subtitle">
              {language === 'pa' ? 'ਟ੍ਰਾਈਸਿਟੀ ਦੇ ਮੌਜੂਦਾ ਰੇਟ ਅਤੇ ਸਾਲਾਨਾ ਵਾਧਾ' : (language === 'hi' ? 'ट्राइसिटी के वर्तमान रेट व वार्षिक मूल्य वृद्धि' : 'Real-time benchmark rates and 12-month capital appreciation')}
            </p>
          </div>
          <button 
            type="button" 
            className="home-section-view-all-btn"
            onClick={() => onNavigate('insights')}
          >
            <span>{language === 'pa' ? 'ਪੂਰਾ ਵਿਸ਼ਲੇਸ਼ਣ' : (language === 'hi' ? 'पूरा विश्लेषण' : 'Full analytics')}</span>
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="home-market-teaser-grid">
          {MARKET_DATA.map((item) => (
            <div 
              key={item.area} 
              className="market-teaser-stat-card"
              onClick={() => onNavigate('insights')}
            >
              <div className="market-card-top-row">
                <span className="market-area-name">{item.area}</span>
                <span className="market-growth-badge">
                  <TrendingUp size={12} />
                  <span>+{item.priceGrowth}%</span>
                </span>
              </div>
              <div className="market-price-big">
                ₹{item.avgPrice.toLocaleString('en-IN')}
                <small>{language === 'pa' ? '/ਗਜ਼' : (language === 'hi' ? '/गज' : '/sq.yd')}</small>
              </div>
              <div className="market-card-meta-row">
                <span className="market-demand-tag">{language === 'pa' ? 'ਮੰਗ:' : (language === 'hi' ? 'मांग:' : 'Demand:')} {item.demand}</span>
                <span className="market-trend-link">{language === 'pa' ? 'ਟ੍ਰੈਂਡ ਵੇਖੋ →' : (language === 'hi' ? 'ट्रेंड देखें →' : 'View trend →')}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 8. CALCULATE BEFORE YOU BUY (FLAGSHIP CALCULATOR HUB) ─────────────── */}
      <section className="home-section-container home-calculator-hub-section">
        <div className="home-section-header-row">
          <div>
            <div className="calculator-section-pill">
              <Calculator size={14} />
              <span>{language === 'pa' ? 'ਵਿੱਤੀ ਤੇ ਨਿਰਮਾਣ ਗਣਨਾ' : (language === 'hi' ? 'वित्तीय व निर्माण कैलकुलेटर' : 'Financial & Build Intelligence')}</span>
            </div>
            <h2 className="home-section-title">
              {language === 'pa' ? 'ਖਰੀਦਣ ਤੋਂ ਪਹਿਲਾਂ ਗਣਨਾ ਕਰੋ' : (language === 'hi' ? 'खरीदने से पहले कैलकुलेट करें' : 'Calculate before you buy')}
            </h2>
            <p className="home-section-subtitle">
              {language === 'pa' ? 'ਸਹੀ ਫੈਸਲਾ ਲੈਣ ਲਈ ਲੋਨ ਤੇ ਲਾਗਤ ਜਾਣੋ' : (language === 'hi' ? 'सटीक निर्णय के लिए लोन EMI व रजिस्ट्री शुल्क जानें' : 'Know the numbers before you make a property decision.')}
            </p>
          </div>
          <button 
            type="button" 
            className="home-section-view-all-btn"
            onClick={() => onNavigate('land-calculator')}
          >
            <span>{language === 'pa' ? 'ਸਾਰੇ ਟੂਲ' : (language === 'hi' ? 'सभी टूल्स' : 'All tools')}</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Highlight: Interactive Live EMI Quick Calculator */}
        <div className="home-live-calculator-card">
          <div className="live-calc-left-col">
            <div className="live-calc-badge">
              <Sparkles size={14} />
              <span>{language === 'pa' ? 'ਤੁਰੰਤ ਹੋਮ ਲੋਨ ਅੰਦਾਜ਼ਾ' : (language === 'hi' ? 'तुरंत होम लोन कैलकुलेटर' : 'Instant Home Loan Estimator')}</span>
            </div>
            <h3 className="live-calc-title">
              {language === 'pa' ? 'ਮਕਾਨ ਜਾਂ ਪਲਾਟ ਖਰੀਦਣ ਦੀ ਯੋਜਨਾ ਹੈ?' : (language === 'hi' ? 'मकान या प्लाट खरीदने की योजना है?' : 'Planning to buy a home or plot?')}
            </h3>
            <p className="live-calc-desc">
              {language === 'pa' ? 'ਪਲਾਟ ਦੀ ਕੀਮਤ ਅਤੇ ਸਾਲ ਚੁਣੋ ਅਤੇ ਮਹੀਨਾਵਾਰ ਕਿਸ਼ਤ ਵੇਖੋ।' : (language === 'hi' ? 'प्लाट की कीमत और अवधि चुनें और तुरंत मासिक किश्त का हिसाब देखें।' : 'Adjust property value and tenure to see your instant monthly payment breakdown.')}
            </p>

            {/* Quick Presets */}
            <div className="calc-presets-row">
              {[50, 85, 150, 250].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`preset-btn ${propertyPriceLakhs === preset ? 'active' : ''}`}
                  onClick={() => setPropertyPriceLakhs(preset)}
                >
                  {preset >= 100 ? `₹${(preset/100).toFixed(1)} Cr` : `₹${preset} L`}
                </button>
              ))}
            </div>

            {/* Slider Control */}
            <div className="live-calc-controls-wrap">
              <div className="calc-slider-label-row">
                <span className="slider-label-txt">{language === 'pa' ? 'ਪਲਾਟ ਦੀ ਕੀਮਤ' : (language === 'hi' ? 'प्रॉपर्टी की कीमत' : 'Property Price')}</span>
                <span className="slider-val-txt">
                  {propertyPriceLakhs >= 100 
                    ? `₹${(propertyPriceLakhs / 100).toFixed(2)} Cr` 
                    : `₹${propertyPriceLakhs} Lakhs`}
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="300"
                step="5"
                value={propertyPriceLakhs}
                onChange={(e) => setPropertyPriceLakhs(Number(e.target.value))}
                className="live-calc-range-slider"
                aria-label="Property Price in Lakhs"
              />
              <div className="calc-slider-ticks-row">
                <span>₹20 L</span>
                <span>₹1.5 Cr</span>
                <span>₹3.0 Cr</span>
              </div>
            </div>

            <div className="live-calc-tenure-row">
              <span className="tenure-label-txt">{language === 'pa' ? 'ਮਿਆਦ:' : (language === 'hi' ? 'अवधि:' : 'Tenure:')}</span>
              {[15, 20, 25].map((yrs) => (
                <button
                  key={yrs}
                  type="button"
                  className={`tenure-pill-btn ${loanTenureYears === yrs ? 'active' : ''}`}
                  onClick={() => setLoanTenureYears(yrs)}
                >
                  {yrs} {language === 'pa' ? 'ਸਾਲ' : (language === 'hi' ? 'साल' : 'Years')}
                </button>
              ))}
            </div>
          </div>

          <div className="live-calc-right-result-col">
            <div className="result-metric-card">
              <span className="result-metric-caption">{language === 'pa' ? 'ਅੰਦਾਜ਼ਨ ਮਹੀਨਾਵਾਰ ਕਿਸ਼ਤ (EMI)' : (language === 'hi' ? 'अनुमानित मासिक किश्त (EMI)' : 'Estimated Monthly EMI')}</span>
              <div className="result-emi-amount">
                ₹{liveEmiCalculation.emi.toLocaleString('en-IN')}
                <small>/{language === 'pa' ? 'ਮਹੀਨਾ' : (language === 'hi' ? 'माह' : 'month')}</small>
              </div>
              <div className="result-breakdown-strip">
                <div className="breakdown-item">
                  <span>{language === 'pa' ? 'ਡਾਊਨ ਪੇਮੈਂਟ (20%)' : (language === 'hi' ? 'डाउन पेमेंट (20%)' : 'Down Payment (20%)')}</span>
                  <strong>₹{(liveEmiCalculation.downPayment / 100000).toFixed(1)} L</strong>
                </div>
                <div className="breakdown-item">
                  <span>{language === 'pa' ? 'ਲੋਨ ਰਕਮ (80%)' : (language === 'hi' ? 'लोन राशि (80%)' : 'Loan Amount (80%)')}</span>
                  <strong>₹{(liveEmiCalculation.principal / 100000).toFixed(1)} L</strong>
                </div>
              </div>
              <button
                type="button"
                className="live-calc-full-launch-btn"
                onClick={() => onNavigate('land-calculator')}
              >
                <span>{language === 'pa' ? 'ਪੂਰਾ ਲੋਨ ਕੈਲਕੁਲੇਟਰ ਖੋਲ੍ਹੋ →' : (language === 'hi' ? 'पूरा लोन कैलकुलेटर खोलें →' : 'Open Full Loan & Bank Calculator →')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Surfaced Real Calculators Compact Minimal List */}
        <div className="home-calculators-grid">
          {propertyCalculators.map((calc) => (
            <div
              key={calc.id}
              className="home-calculator-item-card"
              onClick={() => onNavigate('land-calculator')}
              role="button"
              tabIndex={0}
            >
              <div className="calc-item-icon-box" style={{ background: calc.bgLight, color: calc.color }}>
                {calc.icon}
              </div>
              <div className="calc-item-text-col">
                <div className="calc-item-title-row">
                  <h4 className="calc-item-title">{calc.title}</h4>
                  <span className="calc-item-badge">{calc.badge}</span>
                </div>
                <p className="calc-item-purpose">{calc.purpose}</p>
              </div>
              <div className="calc-item-arrow-btn">
                <ChevronRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 9. REAL ESTATE NEWS & GUIDES ──────────────────────────────────────── */}
      <section className="home-section-container">
        <div className="home-section-header-row">
          <div>
            <h2 className="home-section-title">
              {language === 'pa' ? 'ਜਾਇਦਾਦ ਗਾਈਡ ਅਤੇ ਜਾਣਕਾਰੀ' : (language === 'hi' ? 'प्रॉपर्टी गाइड्स व जानकारी' : 'Real estate news & guides')}
            </h2>
            <p className="home-section-subtitle">
              {language === 'pa' ? 'ਕਾਨੂੰਨੀ ਜਾਂਚ ਅਤੇ ਮਾਸਟਰਪਲਾਨ ਸੰਬੰਧੀ ਜਾਣਕਾਰੀ' : (language === 'hi' ? 'कानूनी जांच व मास्टरप्लान से जुड़े उपयोगी गाइड्स' : 'Practical guides on legal checks, approvals and circle rates.')}
            </p>
          </div>
          <button 
            type="button" 
            className="home-section-view-all-btn"
            onClick={() => onNavigate('advisor')}
          >
            <span>{language === 'pa' ? 'ਸਾਰੇ ਲੇਖ' : (language === 'hi' ? 'सभी लेख' : 'All articles')}</span>
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="home-guides-cards-grid">
          {realEstateGuides.map((guide) => (
            <div 
              key={guide.id} 
              className="home-guide-article-card"
              onClick={() => onNavigate('advisor')}
            >
              <div className="guide-card-image-wrap">
                <img src={guide.image} alt={guide.title} className="guide-card-img" loading="lazy" />
                <span className="guide-category-badge">{guide.category}</span>
              </div>
              <div className="guide-card-body">
                <h4 className="guide-card-title">{guide.title}</h4>
                <div className="guide-card-meta-row">
                  <span>{guide.date}</span>
                  <span>•</span>
                  <span>{guide.readTime}</span>
                  <span className="guide-read-link">{language === 'pa' ? 'ਗਾਈਡ ਪੜ੍ਹੋ →' : (language === 'hi' ? 'गाइड पढ़ें →' : 'Read guide →')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 11. WHY PLOTIX / TRUST & VALUE PROPOSITION ─────────────────────── */}
      <section className="home-section-container">
        <div className="home-trust-value-card">
          <div className="trust-header-center">
            <h3 className="trust-headline">
              {language === 'pa' ? 'ਸਮਝਦਾਰੀ ਨਾਲ ਪ੍ਰਾਪਰਟੀ ਦਾ ਫੈਸਲਾ ਲਵੋ' : (language === 'hi' ? 'सटीक व समझदारी से लें प्रॉपर्टी का फैसला' : 'Make a smarter property decision')}
            </h3>
            <p className="trust-subtext">
              {language === 'pa' 
                ? 'PlotIX ਪ੍ਰਮਾਣਿਤ ਜਾਇਦਾਦਾਂ, ਸਰਕਾਰੀ ਰਿਕਾਰਡ ਅਤੇ ਮਾਸਟਰ ਪਲਾਨ ਨੂੰ ਇਕੱਠਾ ਕਰਦਾ ਹੈ।' 
                : (language === 'hi' 
                  ? 'PlotIX प्रमाणित प्रॉपर्टी लिस्टिंग्स, सरकारी रिकॉर्ड और मास्टर प्लान को एक साथ लाता है।' 
                  : 'PlotIX combines verified local real estate listings with algorithmic due diligence and planning intelligence.')}
            </p>
          </div>

          <div className="trust-pillars-grid">
            <div className="trust-pillar-item">
              <div className="trust-pillar-icon-box">
                <ShieldCheck size={20} color="#2563eb" />
              </div>
              <h4 className="trust-pillar-title">
                {language === 'pa' ? 'ਪ੍ਰਮਾਣਿਤ ਰਿਕਾਰਡ' : (language === 'hi' ? 'सत्यापित खोज' : 'Verified Discovery')}
              </h4>
              <p className="trust-pillar-desc">
                {language === 'pa' ? 'ਸਾਫ਼ ਰਜਿਸਟਰੀ ਅਤੇ ਪੁੱਡਾ/ਹੁਡਾ ਪਾਸ ਕੀਤੇ ਪਲਾਟ।' : (language === 'hi' ? 'साफ़ रजिस्ट्री व सरकारी अप्रूव्ड आवासीय व कमर्शियल प्लाट।' : 'Clear-title residential and commercial listings backed by GMADA, HSVP, and RERA approval records.')}
              </p>
            </div>

            <div className="trust-pillar-item">
              <div className="trust-pillar-icon-box">
                <TrendingUp size={20} color="#059669" />
              </div>
              <h4 className="trust-pillar-title">
                {language === 'pa' ? 'ਸਥਾਨਕ ਬਾਜ਼ਾਰ ਵਿਸ਼ਲੇਸ਼ਣ' : (language === 'hi' ? 'लोकल मार्केट ट्रेंड' : 'Local Market Context')}
              </h4>
              <p className="trust-pillar-desc">
                {language === 'pa' ? 'ਸਰਕਾਰੀ ਕਲੈਕਟਰ ਰੇਟ ਅਤੇ ਇਲਾਕੇ ਦੇ ਵਿਕਾਸ ਦੀ ਜਾਣਕਾਰੀ।' : (language === 'hi' ? 'सरकारी कलेक्टर रेट व इलाके में कीमतों की बढ़ोतरी का सटीक डेटा।' : 'Transparent circle rates, historical sector price trends, and infrastructure pipeline analysis.')}
              </p>
            </div>

            <div className="trust-pillar-item">
              <div className="trust-pillar-icon-box">
                <Calculator size={20} color="#d97706" />
              </div>
              <h4 className="trust-pillar-title">
                {language === 'pa' ? 'ਸਟੀਕ ਕੈਲਕੁਲੇਟਰ' : (language === 'hi' ? 'सटीक कैलकुलेटर' : 'Actionable Calculators')}
              </h4>
              <p className="trust-pillar-desc">
                {language === 'pa' ? 'ਲੋਨ EMI, ਰਜਿਸਟਰੀ ਫੀਸ ਅਤੇ ਮਕਾਨ ਬਣਾਉਣ ਦਾ ਖਰਚਾ।' : (language === 'hi' ? 'लोन EMI, रजिस्ट्री खर्चा और मकान निर्माण की लागत का सटीक अनुमान।' : 'Interactive loan EMI calculators, construction cost estimations, and state stamp duty computations.')}
              </p>
            </div>

            <div className="trust-pillar-item">
              <div className="trust-pillar-icon-box">
                <Layers size={20} color="#7c3aed" />
              </div>
              <h4 className="trust-pillar-title">
                {language === 'pa' ? 'ਬੁੱਧੀਮਾਨ ਫੈਸਲੇ' : (language === 'hi' ? 'सटीक निर्णय' : 'Smarter Decision-Making')}
              </h4>
              <p className="trust-pillar-desc">
                {language === 'pa' ? 'ਮਾਸਟਰ ਪਲਾਨ, ਮਕਾਨ ਦਾ ਨਕਸ਼ਾ ਅਤੇ ਜਮ੍ਹਾਂਬੰਦੀ ਜਾਂਚ ਟੂਲ।' : (language === 'hi' ? 'मास्टर प्लान, 3D मकान का नक्शा और जमाबंदी पड़ताल की सुविधा।' : 'Integrated master planning, architectural guidance, and revenue land record verification tools.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SELL PROPERTY MODAL ("Ham Apni Property Dalna Chahte Hain") ─────── */}
      <AnimatePresence>
        {showSellModal && (
          <div className="sell-modal-backdrop" onClick={() => setShowSellModal(false)}>
            <motion.div 
              className="sell-modal-card"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Modal Header */}
              <div className="sell-modal-header">
                <div className="sell-modal-title-row">
                  <div className="sell-modal-icon-badge">
                    <PlusCircle size={24} />
                  </div>
                  <div>
                    <div className="sell-modal-kicker">
                      {language === 'pa' ? 'ਪ੍ਰਾਪਰਟੀ ਲਿਸਟਿੰਗ' : (language === 'hi' ? 'हम अपनी प्रॉपर्टी डालना चाहते हैं' : 'POST PROPERTY FOR SALE')}
                    </div>
                    <h3 className="sell-modal-title">
                      {language === 'pa' 
                        ? 'ਆਪਣੀ ਪ੍ਰਾਪਰਟੀ ਵੇਚਣ ਲਈ ਪਾਓ' 
                        : (language === 'hi' 
                            ? 'अपनी प्रॉपर्टी बेचने के लिए लिस्ट करें' 
                            : 'Sell / List Your Property Free')}
                    </h3>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="sell-modal-close-btn"
                  onClick={() => {
                    setShowSellModal(false);
                    setSellSubmittedSuccess(false);
                  }}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {sellSubmittedSuccess ? (
                /* Celebratory Success View */
                <div className="sell-modal-success-view">
                  <div className="sell-success-icon-wrap">
                    <CheckCircle2 size={54} className="sell-success-check" />
                  </div>
                  <h4 className="sell-success-title">
                    {language === 'pa' 
                      ? 'ਤੁਹਾਡੀ ਪ੍ਰਾਪਰਟੀ ਸਫਲਤਾਪੂਰਵਕ ਲਿਸਟ ਹੋ ਗਈ ਹੈ!' 
                      : (language === 'hi' 
                          ? 'आपकी प्रॉपर्टी सफलतापूर्वक लिस्ट हो गई है!' 
                          : 'Property Successfully Listed Live!')}
                  </h4>
                  <p className="sell-success-desc">
                    {language === 'pa'
                      ? 'ਤੁਹਾਡੀ ਲਿਸਟਿੰਗ ਹੁਣ PlotIX ਉੱਤੇ ਸਰਗਰਮ ਹੈ। ਖਰੀਦਦਾਰ ਤੁਹਾਡੇ ਦਿੱਤੇ ਨੰਬਰ ਤੇ ਸਿੱਧਾ ਸੰਪਰਕ ਕਰ ਸਕਣਗੇ।'
                      : (language === 'hi'
                          ? 'आपकी लिस्टिंग अब PlotIX पर लाइव है। इच्छुक खरीदार सीधे आपके दिए फोन नंबर पर संपर्क कर सकेंगे।'
                          : 'Your property is now active on PlotIX. Genuine verified buyers across Tricity and Punjab can discover and contact you directly.')}
                  </p>
                  <div className="sell-success-actions">
                    <button
                      type="button"
                      className="sell-btn-primary"
                      onClick={() => {
                        setShowSellModal(false);
                        setSellSubmittedSuccess(false);
                        onNavigate('my-properties');
                      }}
                    >
                      <span>{language === 'pa' ? 'ਮੇਰੇ ਪੋਰਟਫੋਲੀਓ ਵਿੱਚ ਵੇਖੋ' : (language === 'hi' ? 'मेरे पोर्टफोलियो में देखें' : 'View in My Portfolio')}</span>
                      <ArrowRight size={16} />
                    </button>
                    <button
                      type="button"
                      className="sell-btn-secondary"
                      onClick={() => {
                        setShowSellModal(false);
                        setSellSubmittedSuccess(false);
                      }}
                    >
                      {language === 'pa' ? 'ਬੰਦ ਕਰੋ' : (language === 'hi' ? 'बंद करें' : 'Done & Close')}
                    </button>
                  </div>
                </div>
              ) : (
                /* Quick Listing Form */
                <form className="sell-modal-form" onSubmit={handleQuickSellSubmit}>
                  {/* Transaction Type Radio Pill (Sale vs Rent) */}
                  <div className="sell-intent-segmented">
                    <button
                      type="button"
                      className={`sell-segment-btn ${sellListingType === 'sale' ? 'active' : ''}`}
                      onClick={() => setSellListingType('sale')}
                    >
                      {language === 'pa' ? 'ਵੇਚਣ ਲਈ (For Sale)' : (language === 'hi' ? 'बिक्री हेतु (For Sale)' : 'For Sale')}
                    </button>
                    <button
                      type="button"
                      className={`sell-segment-btn ${sellListingType === 'rent' ? 'active' : ''}`}
                      onClick={() => setSellListingType('rent')}
                    >
                      {language === 'pa' ? 'ਕਿਰਾਏ ਲਈ (For Rent)' : (language === 'hi' ? 'किराए हेतु (For Rent)' : 'For Rent')}
                    </button>
                  </div>

                  {/* Property Title */}
                  <div className="sell-form-group">
                    <label className="sell-form-label">
                      {language === 'pa' ? 'ਪ੍ਰਾਪਰਟੀ ਦਾ ਨਾਮ / ਵੇਰਵਾ' : (language === 'hi' ? 'प्रॉपर्टी का शीर्षक / विवरण' : 'Property Title')} *
                    </label>
                    <input
                      type="text"
                      className="sell-form-input"
                      placeholder="e.g. 200 Sq. Yd. Residential Plot in Sector 82 / 3 BHK Villa in Aerocity"
                      value={sellTitle}
                      onChange={(e) => setSellTitle(e.target.value)}
                      required
                    />
                  </div>

                  {/* 2-Col Grid: Property Type & District */}
                  <div className="sell-form-grid-2">
                    <div className="sell-form-group">
                      <label className="sell-form-label">
                        {language === 'pa' ? 'ਪ੍ਰਾਪਰਟੀ ਦੀ ਕਿਸਮ' : (language === 'hi' ? 'प्रॉपर्टी का प्रकार' : 'Property Type')}
                      </label>
                      <select
                        className="sell-form-select"
                        value={sellType}
                        onChange={(e) => setSellType(e.target.value)}
                      >
                        <option value="Residential Plot">Residential Plot (ਰਿਹਾਇਸ਼ੀ ਪਲਾਟ)</option>
                        <option value="House / Villa / Kothi">House / Villa / Kothi (ਕੋਠੀ / ਮਕਾਨ)</option>
                        <option value="Agricultural Land">Agricultural Land (ਖੇਤੀਬਾੜੀ ਜ਼ਮੀਨ)</option>
                        <option value="Commercial SCO / Shop">Commercial SCO / Shop (ਦੁਕਾਨ / ਸ਼ੋਅਰੂਮ)</option>
                        <option value="Flat / Apartment">Flat / Apartment (ਫਲੈਟ)</option>
                        <option value="Industrial Plot">Industrial Plot (ਇੰਡਸਟ੍ਰੀਅਲ ਪਲਾਟ)</option>
                      </select>
                    </div>

                    <div className="sell-form-group">
                      <label className="sell-form-label">
                        {language === 'pa' ? 'ਜ਼ਿਲ੍ਹਾ' : (language === 'hi' ? 'जिला / शहर' : 'District')}
                      </label>
                      <select
                        className="sell-form-select"
                        value={sellDistrict}
                        onChange={(e) => setSellDistrict(e.target.value)}
                      >
                        <option value="Mohali">Mohali (ਮੋਹਾਲੀ / SAS Nagar)</option>
                        <option value="Chandigarh">Chandigarh (ਚੰਡੀਗੜ੍ਹ)</option>
                        <option value="Panchkula">Panchkula (ਪੰਚਕੂਲਾ)</option>
                        <option value="Patiala">Patiala (ਪਟਿਆਲਾ)</option>
                        <option value="Zirakpur">Zirakpur (ਜ਼ੀਰਕਪੁਰ)</option>
                        <option value="Kharar">Kharar (ਖਰੜ)</option>
                        <option value="New Chandigarh">New Chandigarh / Mullanpur</option>
                        <option value="Ludhiana">Ludhiana (ਲੁਧਿਆਣਾ)</option>
                        <option value="Fatehgarh Sahib">Fatehgarh Sahib</option>
                        <option value="Ambala">Ambala</option>
                      </select>
                    </div>
                  </div>

                  {/* Locality & Sector */}
                  <div className="sell-form-group">
                    <label className="sell-form-label">
                      {language === 'pa' ? 'ਸੈਕਟਰ, ਇਲਾਕਾ ਜਾਂ ਪਿੰਡ' : (language === 'hi' ? 'सेक्टर, कॉलोनी या गांव' : 'Locality, Sector or Village')}
                    </label>
                    <input
                      type="text"
                      className="sell-form-input"
                      placeholder="e.g. Sector 82 JLPL / Aerocity Block C / Bawal / Mullanpur"
                      value={sellLocality}
                      onChange={(e) => setSellLocality(e.target.value)}
                    />
                  </div>

                  {/* 2-Col Grid: Area & Asking Price */}
                  <div className="sell-form-grid-2">
                    <div className="sell-form-group">
                      <label className="sell-form-label">
                        {language === 'pa' ? 'ਖੇਤਰਫਲ (ਸਾਈਜ਼)' : (language === 'hi' ? 'क्षेत्रफल (साइज)' : 'Size / Area')}
                      </label>
                      <div className="sell-input-with-select">
                        <input
                          type="text"
                          className="sell-form-input"
                          placeholder="e.g. 150, 250, 1"
                          value={sellArea}
                          onChange={(e) => setSellArea(e.target.value)}
                        />
                        <select
                          className="sell-unit-select"
                          value={sellAreaUnit}
                          onChange={(e) => setSellAreaUnit(e.target.value)}
                        >
                          <option value="Sq. Yards">Sq. Yards (ਗਜ਼)</option>
                          <option value="Acre">Acre (ਕਿੱਲਾ)</option>
                          <option value="Marla">Marla (ਮਰਲਾ)</option>
                          <option value="Sq. Feet">Sq. Feet</option>
                          <option value="Kanal">Kanal (ਕਨਾਲ)</option>
                        </select>
                      </div>
                    </div>

                    <div className="sell-form-group">
                      <label className="sell-form-label">
                        {language === 'pa' ? 'ਮੰਗੀ ਗਈ ਕੀਮਤ' : (language === 'hi' ? 'मांगी गई कीमत' : 'Asking Price')} *
                      </label>
                      <input
                        type="text"
                        className="sell-form-input"
                        placeholder="e.g. ₹85 Lakh / ₹1.45 Cr"
                        value={sellPrice}
                        onChange={(e) => setSellPrice(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* 2-Col Grid: Contact Name & Phone */}
                  <div className="sell-form-grid-2">
                    <div className="sell-form-group">
                      <label className="sell-form-label">
                        {language === 'pa' ? 'ਤੁਹਾਡਾ ਨਾਮ' : (language === 'hi' ? 'आपका नाम' : 'Your Name')}
                      </label>
                      <input
                        type="text"
                        className="sell-form-input"
                        placeholder="e.g. Gurpreet Singh / Amit Gupta"
                        value={sellName}
                        onChange={(e) => setSellName(e.target.value)}
                      />
                    </div>

                    <div className="sell-form-group">
                      <label className="sell-form-label">
                        {language === 'pa' ? 'ਫ਼ੋਨ ਨੰਬਰ' : (language === 'hi' ? 'संपर्क फोन नंबर' : 'Contact Phone')} *
                      </label>
                      <input
                        type="tel"
                        className="sell-form-input"
                        placeholder="e.g. 98765 43210"
                        value={sellPhone}
                        onChange={(e) => setSellPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="sell-form-footer">
                    <button
                      type="submit"
                      className="sell-btn-primary"
                      disabled={isSubmittingSell}
                      id="btn-submit-quick-sell"
                    >
                      <UploadCloud size={18} />
                      <span>
                        {isSubmittingSell 
                          ? (language === 'pa' ? 'ਲਿਸਟ ਹੋ ਰਿਹਾ ਹੈ...' : 'लिस्ट किया जा रहा है...') 
                          : (language === 'pa' ? 'ਪ੍ਰਾਪਰਟੀ ਵੇਚਣ ਲਈ ਲਿਸਟ ਕਰੋ' : (language === 'hi' ? 'प्रॉपर्टी बेचने के लिए पोस्ट करें' : 'Post Property Listing Free'))}
                      </span>
                    </button>

                    <button
                      type="button"
                      className="sell-link-advanced"
                      onClick={() => {
                        setShowSellModal(false);
                        onNavigate('my-properties');
                      }}
                    >
                      <span>
                        {language === 'pa' 
                          ? 'ਫੋਟੋਆਂ ਅਤੇ ਫਰਦ ਦਸਤਾਵੇਜ਼ ਅੱਪਲੋਡ ਕਰਨ ਲਈ ਪੂਰਾ ਸਟੂਡੀਓ ਖੋਲ੍ਹੋ →' 
                          : (language === 'hi' 
                              ? 'फोटो व फर्द दस्तावेज अपलोड करने हेतु फुल प्रॉपर्टी स्टूडियो खोलें →' 
                              : 'Want to upload photos & cadastral documents? Open Full Studio →')}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
