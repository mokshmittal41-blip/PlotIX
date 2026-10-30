import { useState } from 'react';
import {
  Building2,
  Map as MapIcon,
  TreePine,
  Search,
  ArrowRight,
  ShieldCheck,
  Compass,
  PlusCircle,
  Sparkles
} from 'lucide-react';
import type { MapCategory, PlanningMapRecord } from '../../data/planning/types';
import { getIndiaPlanningStatistics } from '../../services/indiaPlanningService';
import { useLanguage } from '../../context/LanguageContext';

interface PlanningHomeProps {
  onSelectCategory: (category: MapCategory | 'ALL', state?: string, query?: string) => void;
  onOpenGisMap: (record: PlanningMapRecord) => void;
  onInspectBlueprint: (record: PlanningMapRecord) => void;
  onOpenUploadModal: () => void;
}

export default function PlanningHome({
  onSelectCategory,
  onOpenGisMap: _onOpenGisMap,
  onInspectBlueprint: _onInspectBlueprint,
  onOpenUploadModal
}: PlanningHomeProps) {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const stats = getIndiaPlanningStatistics();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSelectCategory('ALL', undefined, searchQuery.trim());
    }
  };

  const handleQuickChip = (term: string, stateName?: string) => {
    onSelectCategory('ALL', stateName, term);
  };

  return (
    <div className="planning-platform-container custom-scrollbar">
      <div className="planning-inner-wrapper">

        {/* ─── 1. HERO BANNER SECTION ─── */}
        <div className="planning-hero-banner plan-fade-in">
          
          <div className="planning-hero-top">
            <div>
              <div className="planning-hero-badge">
                <Compass size={14} className="animate-spin" style={{ animationDuration: '10s' }} />
                <span>India-Wide Statutory GIS & Planning Intelligence</span>
              </div>
              <h1 className="planning-hero-title">
                {language === 'pa'
                  ? 'ਭਾਰਤ ਦੇ ਮਾਸਟਰ ਪਲਾਨ, ਟੀ.ਪੀ. ਸਕੀਮਾਂ ਤੇ ਮਾਲੀਆ ਨਕਸ਼ੇ'
                  : language === 'hi'
                  ? 'भारत के मास्टर प्लान, टाउन प्लानिंग एवं भू-नक्शा पोर्टल'
                  : 'India Planning Maps & Cadastral GIS Platform'}
              </h1>
              <p className="planning-hero-subtitle">
                {language === 'pa'
                  ? 'ਪੰਜਾਬ, ਚੰਡੀਗੜ੍ਹ, ਦਿੱਲੀ, ਮਹਾਰਾਸ਼ਟਰ, ਕਰਨਾਟਕ ਸਮੇਤ ਸਮੁੱਚੇ ਭਾਰਤ ਦੇ ਅਧਿਕਾਰਤ ਵਿਕਾਸ ਪਲਾਨ, ਪ੍ਰਵਾਨਿਤ ਕਲੋਨੀਆਂ ਅਤੇ ਪਿੰਡਾਂ ਦੇ ਅਕਸ ਸ਼ਜਰਾ ਨਕਸ਼ੇ।'
                  : language === 'hi'
                  ? 'दिल्ली, मुंबई, बेंगलुरु, पंजाब, हरियाणा, यूपी, गुजरात सहित समस्त भारत के प्रमाणित मास्टर प्लान, अनुमोदित लेआउट एवं डिजिटल भू-नक्शे खोजें।'
                  : 'Explore official Town Planning (TP) schemes, Master Plans (DP 2031/41), approved sector blueprints, and Cadastral Aks Shajra maps across all 28 States and 8 UTs.'}
              </p>
            </div>

            {/* Live National Stats Ticker */}
            <div className="planning-stats-ticker">
              <div className="stat-item">
                <span className="stat-number">{stats.totalStatesCovered}</span>
                <span className="stat-label">States & UTs</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.totalDistrictsCovered}+</span>
                <span className="stat-label">Districts</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.totalOfficialAuthorities}</span>
                <span className="stat-label">Planning Authorities</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.totalIndexedMaps}+</span>
                <span className="stat-label">Verified Maps</span>
              </div>
            </div>
          </div>

          {/* ─── HERO SEARCH BAR ─── */}
          <div className="planning-search-box-wrap">
            <form onSubmit={handleSearch} className="search-input-field-group">
              <Search size={20} className="search-icon-svg" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search any Indian City, Master Plan, Sector, TP Scheme, or Village (e.g. Mohali Aerocity, Delhi MPD 2041, Mumbai DP, Sohana Aks Shajra)..."
                className="planning-hero-input"
              />
            </form>
            <button
              type="button"
              onClick={handleSearch}
              className="hero-search-action-btn"
            >
              <span>Search Maps</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* ─── QUICK STATE & SEARCH PILLS ─── */}
          <div className="quick-state-pills">
            <span className="quick-pills-label">Popular Hubs:</span>
            {[
              { label: 'Mohali / New Chd (GMADA)', term: 'Mohali', state: 'Punjab' },
              { label: 'Delhi MPD 2041 (DDA)', term: 'Delhi Master Plan', state: 'Delhi (NCT)' },
              { label: 'Ludhiana GLADA', term: 'Ludhiana', state: 'Punjab' },
              { label: 'Mumbai DP 2034 (BMC)', term: 'Mumbai', state: 'Maharashtra' },
              { label: 'Bengaluru BDA 2031', term: 'Bengaluru', state: 'Karnataka' },
              { label: 'Hyderabad HMDA 2031', term: 'Hyderabad', state: 'Telangana' },
              { label: 'Ahmedabad AUDA TP', term: 'Ahmedabad', state: 'Gujarat' },
              { label: 'Noida / Jewar (YEIDA)', term: 'Noida', state: 'Uttar Pradesh' },
              { label: 'Jaipur JDA 2025', term: 'Jaipur', state: 'Rajasthan' },
              { label: 'Gurugram GMDA / HSVP', term: 'Gurugram', state: 'Haryana' }
            ].map(pill => (
              <button
                key={pill.label}
                type="button"
                onClick={() => handleQuickChip(pill.term, pill.state)}
                className="quick-pill-btn"
              >
                {pill.label}
              </button>
            ))}
          </div>

        </div>

        {/* ─── 2. CORE 3 PRIMARY CATEGORY CARDS ─── */}
        <div className="category-cards-grid plan-fade-in">
          
          {/* CARD 1: TP MAPS */}
          <div
            onClick={() => onSelectCategory('TP')}
            className="plan-category-card card-tp"
          >
            <div className="cat-card-header">
              <div className="cat-card-icon icon-tp">
                <Building2 size={26} />
              </div>
              <span className="cat-card-count-badge">Town Planning</span>
            </div>
            <div className="cat-card-tag">Approved Sectors & Layouts</div>
            <h2 className="cat-card-title">TP Maps (ਟਾਊਨ ਪਲਾਨਿੰਗ ਸਕੀਮਾਂ)</h2>
            <p className="cat-card-desc">
              Explore official Town Planning schemes, approved private colony layout plans, sector grids, road hierarchies, and RERA verified blueprints across Indian cities.
            </p>
            <div className="cat-card-action">
              <span>Explore TP Schemes</span>
              <ArrowRight size={16} />
            </div>
          </div>

          {/* CARD 2: DP MAPS */}
          <div
            onClick={() => onSelectCategory('DP')}
            className="plan-category-card card-dp"
          >
            <div className="cat-card-header">
              <div className="cat-card-icon icon-dp">
                <MapIcon size={26} />
              </div>
              <span className="cat-card-count-badge">Master Development</span>
            </div>
            <div className="cat-card-tag">Statutory Zoning 2031 / 2041</div>
            <h2 className="cat-card-title">DP Maps (ਮਾਸਟਰ ਪਲਾਨ / मास्टर प्लान)</h2>
            <p className="cat-card-desc">
              Comprehensive Master Plans, Land-Use zoning policies (Residential, Commercial, Industrial, Green Belts), proposed ring roads, metro corridors, and FAR regulations.
            </p>
            <div className="cat-card-action">
              <span>Explore Master Plans</span>
              <ArrowRight size={16} />
            </div>
          </div>

          {/* CARD 3: VILLAGE REVENUE & AKS SHAJRA */}
          <div
            onClick={() => onSelectCategory('Village')}
            className="plan-category-card card-vil"
          >
            <div className="cat-card-header">
              <div className="cat-card-icon icon-vil">
                <TreePine size={26} />
              </div>
              <span className="cat-card-count-badge">Cadastral & Revenue</span>
            </div>
            <div className="cat-card-tag">Aks Shajra & BhuNaksha</div>
            <h2 className="cat-card-title">Village Maps (ਪਿੰਡਾਂ ਦੇ ਨਕਸ਼ੇ / भू-नक्शा)</h2>
            <p className="cat-card-desc">
              Revenue village cadastral maps with Khasra & Murabba grids, Mission Lal Lakir / SVAMITVA demarcations, circular Phirni roads, canals, and Jamabandi integration.
            </p>
            <div className="cat-card-action">
              <span>Explore Village Cadastre</span>
              <ArrowRight size={16} />
            </div>
          </div>

        </div>

        {/* ─── 3. COMMUNITY / BROKER MAP SUBMISSION CTA BANNER ─── */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md mb-8 border border-blue-800/60 plan-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/40 text-blue-300 flex items-center justify-center font-bold shrink-0">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white mb-1">
                Have an Official Blueprint, CAD Layout, or Aks Shajra Map?
              </h3>
              <p className="text-xs text-blue-200 max-w-2xl leading-relaxed">
                Contribute official approved colony plans, TP schemes, or village maps to India’s open planning directory.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenUploadModal}
            className="bg-white hover:bg-blue-50 text-blue-900 font-extrabold text-xs py-3 px-6 rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0"
          >
            <PlusCircle size={16} /> Upload & Publish Map
          </button>
        </div>

        {/* ─── 4. DATA TRANSPARENCY & STATUTORY COMPLIANCE ─── */}
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 flex items-start gap-4 plan-fade-in">
          <ShieldCheck size={26} className="text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider mb-1">
              Statutory Government Data Integrity Policy
            </h4>
            <p className="text-xs text-emerald-900/80 leading-relaxed font-medium">
              PropWise indexes verified planning maps directly from statutory development authorities (DDA, MMRDA, BDA, HMDA, AUDA, GMADA, GLADA, HSVP, etc.) and state land revenue departments. When an official map is not digitized, we provide direct official government portal links rather than generating fictional data.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
