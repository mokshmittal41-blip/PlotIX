import { useState, useMemo } from 'react';
import {
  Search,
  Grid,
  List,
  Map as MapIcon,
  Building2,
  TreePine,
  ExternalLink,
  PlusCircle,
  ShieldAlert,
  Compass
} from 'lucide-react';
import type { PlanningMapRecord, MapCategory } from '../../data/planning/types';
import { INDIA_STATES_DATA } from '../../data/planning/indiaStatesData';
import { searchPlanningMaps, getOfficialPortalContextForLocation } from '../../services/indiaPlanningService';
import PlanningMapViewerPro from './PlanningMapViewerPro';

interface PlanningExplorerProps {
  initialCategory?: MapCategory | 'ALL';
  initialState?: string;
  initialQuery?: string;
  onOpenGisMap: (record: PlanningMapRecord) => void;
  onInspectBlueprint: (record: PlanningMapRecord) => void;
  onOpenUploadModal: () => void;
  onBackToHome?: () => void;
}

export default function PlanningExplorer({
  initialCategory = 'ALL',
  initialState = 'ALL',
  initialQuery = '',
  onOpenGisMap,
  onInspectBlueprint,
  onOpenUploadModal,
  onBackToHome: _onBackToHome
}: PlanningExplorerProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<MapCategory | 'ALL'>(initialCategory);
  const [selectedState, setSelectedState] = useState<string>(initialState);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedAuthority] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'split'>('grid');

  // Selected item for split-view GIS
  const [splitSelectedMap, setSplitSelectedMap] = useState<PlanningMapRecord | null>(null);

  // Available districts based on selected state
  const availableDistricts = useMemo(() => {
    if (selectedState === 'ALL') return [];
    const st = INDIA_STATES_DATA.find(s => s.name.toLowerCase() === selectedState.toLowerCase());
    return st ? st.districts : [];
  }, [selectedState]);

  // Query results from service
  const filteredMaps = useMemo(() => {
    return searchPlanningMaps({
      query: searchQuery,
      category: selectedCategory,
      state: selectedState,
      district: selectedDistrict,
      authorityId: selectedAuthority,
      status: selectedStatus
    });
  }, [searchQuery, selectedCategory, selectedState, selectedDistrict, selectedAuthority, selectedStatus]);

  // Set default split map when list changes
  useMemo(() => {
    if (filteredMaps.length > 0 && !splitSelectedMap) {
      setSplitSelectedMap(filteredMaps[0]);
    }
  }, [filteredMaps, splitSelectedMap]);

  // Handle state change & reset district
  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    setSelectedDistrict('ALL');
  };

  // Get official fallback context when no local vector maps match
  const fallbackContext = useMemo(() => {
    if (filteredMaps.length === 0) {
      return getOfficialPortalContextForLocation(
        selectedState !== 'ALL' ? selectedState : 'Punjab',
        selectedDistrict !== 'ALL' ? selectedDistrict : undefined,
        searchQuery.trim() || undefined,
        selectedCategory !== 'ALL' ? selectedCategory : 'Village'
      );
    }
    return null;
  }, [filteredMaps, selectedState, selectedDistrict, searchQuery, selectedCategory]);

  return (
    <div className="planning-platform-container custom-scrollbar">
      <div className="planning-inner-wrapper">

        {/* ─── EXPLORER HEADER BAR ─── */}
        <div className="planning-explorer-header plan-fade-in">
          
          <div className="explorer-top-row">
            {/* Category Tabs */}
            <div className="explorer-category-tabs">
              {[
                { id: 'ALL', label: 'All Maps & Schemes', count: filteredMaps.length },
                { id: 'TP', label: 'TP Schemes & Sectors', icon: Building2 },
                { id: 'DP', label: 'DP Master Plans 2031/41', icon: MapIcon },
                { id: 'Village', label: 'Village Aks Shajra', icon: TreePine }
              ].map(cat => {
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`cat-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* View Mode Toggle & Upload Button */}
            <div className="flex items-center gap-2.5">
              <div className="explorer-view-toggle">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  title="Grid View"
                >
                  <Grid size={15} /> Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  title="List View"
                >
                  <List size={15} /> List
                </button>
                <button
                  onClick={() => setViewMode('split')}
                  className={`view-btn ${viewMode === 'split' ? 'active' : ''}`}
                  title="Interactive Split GIS View"
                >
                  <Compass size={15} /> GIS Split
                </button>
              </div>

              <button
                onClick={onOpenUploadModal}
                className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs py-2 px-3.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <PlusCircle size={15} /> Upload Map
              </button>
            </div>
          </div>

          {/* ─── FILTERS ROW ─── */}
          <div className="explorer-filters-row">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search city, scheme, village, khasra, colony..."
                className="filter-select pl-9"
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* State Selector */}
            <div>
              <select
                value={selectedState}
                onChange={e => handleStateChange(e.target.value)}
                className="filter-select"
              >
                <option value="ALL">All States & UTs (India)</option>
                {INDIA_STATES_DATA.map(st => (
                  <option key={st.code} value={st.name}>
                    {st.name} ({st.type})
                  </option>
                ))}
              </select>
            </div>

            {/* District Selector */}
            <div>
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                disabled={selectedState === 'ALL'}
                className="filter-select disabled:opacity-50"
              >
                <option value="ALL">All Districts</option>
                {availableDistricts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Approval Status */}
            <div>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="filter-select"
              >
                <option value="ALL">All Approval Status</option>
                <option value="Master Plan Gazetted">Master Plan Gazetted</option>
                <option value="Approved">Approved Colony / Scheme</option>
                <option value="BhuNaksha Digitized">BhuNaksha Digitized</option>
                <option value="RERA Registered">RERA Registered</option>
              </select>
            </div>
          </div>

        </div>

        {/* ─── VIEW MODE: SPLIT GIS VIEW ─── */}
        {viewMode === 'split' && filteredMaps.length > 0 && (
          <div className="split-view-gis-wrapper plan-fade-in">
            {/* Left Sidebar List */}
            <div className="split-sidebar-pane custom-scrollbar p-3 space-y-2.5">
              <div className="px-2 py-1 text-xs font-black uppercase tracking-wider text-slate-400">
                {filteredMaps.length} Verified Planning Maps Found
              </div>
              {filteredMaps.map(map => (
                <div
                  key={map.id}
                  onClick={() => setSplitSelectedMap(map)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    splitSelectedMap?.id === map.id
                      ? 'bg-blue-50/80 border-blue-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {map.authorityShort}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700">{map.status}</span>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1 mb-1">{map.title}</h4>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {map.cityOrTehsil}, {map.state} &bull; {map.totalAreaText}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Interactive GIS Map */}
            <div className="split-map-viewport-pane">
              {splitSelectedMap && (
                <PlanningMapViewerPro
                  mapRecord={splitSelectedMap}
                  onInspectBlueprint={onInspectBlueprint}
                />
              )}
            </div>
          </div>
        )}

        {/* ─── VIEW MODE: GRID / LIST VIEW ─── */}
        {viewMode !== 'split' && filteredMaps.length > 0 && (
          <div className={viewMode === 'grid' ? 'map-cards-grid plan-fade-in' : 'space-y-3.5 plan-fade-in'}>
            {filteredMaps.map(map => (
              <div key={map.id} className="planning-map-item-card">
                {/* Card Top Bar */}
                <div className="map-card-top-bar">
                  <div className="map-authority-pill">
                    <Building2 size={13} className="text-blue-600" />
                    <span>{map.authorityShort}</span>
                  </div>
                  <div className={`map-status-pill status-${map.status.toLowerCase().includes('gazetted') ? 'gazetted' : map.status.toLowerCase().includes('rera') ? 'rera' : 'approved'}`}>
                    <span className="status-dot" />
                    <span>{map.status}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="map-card-body">
                  <div className="map-card-location-row">
                    <span>{map.cityOrTehsil}, {map.district}, {map.state}</span>
                  </div>

                  <h3 className="map-card-title">
                    {map.title}
                  </h3>

                  {/* Highlights / Tags */}
                  <div className="map-card-tags-row">
                    <span className="map-micro-tag">{map.category} Map</span>
                    {map.horizonYear && <span className="map-micro-tag">Horizon {map.horizonYear}</span>}
                    {map.hadbastNoOrVillageCode && <span className="map-micro-tag">{map.hadbastNoOrVillageCode}</span>}
                    {map.isCommunityUploaded && <span className="map-micro-tag bg-blue-50 text-blue-700 font-bold">Community Contributed</span>}
                  </div>

                  {/* Details Grid */}
                  <div className="map-card-details-grid">
                    <div className="detail-cell">
                      <span className="detail-cell-label">Total Area</span>
                      <span className="detail-cell-value">{map.totalAreaText}</span>
                    </div>
                    <div className="detail-cell">
                      <span className="detail-cell-label">Authority</span>
                      <span className="detail-cell-value">{map.authorityName}</span>
                    </div>
                    <div className="detail-cell">
                      <span className="detail-cell-label">Primary Road</span>
                      <span className="detail-cell-value">{map.roadWidths?.[0] || 'Approved Sector Road'}</span>
                    </div>
                    <div className="detail-cell">
                      <span className="detail-cell-label">Gazette / Order</span>
                      <span className="detail-cell-value">{map.approvalOrderNo || 'Statutory Master Plan'}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="map-card-actions">
                    <button
                      onClick={() => onOpenGisMap(map)}
                      className="btn-open-gis-map"
                    >
                      <Compass size={14} /> Open GIS Map
                    </button>
                    <button
                      onClick={() => onInspectBlueprint(map)}
                      className="btn-inspect-blueprint"
                    >
                      <Building2 size={14} /> Blueprint
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── ZERO FAKE DATA FALLBACK NOTICE ─── */}
        {filteredMaps.length === 0 && fallbackContext && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-2xl mx-auto my-8 shadow-md plan-fade-in">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <ShieldAlert size={28} />
            </div>
            
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              Official Map Not Openly Digitized For This Location
            </h3>
            
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              PropWise strictly complies with Government Planning Regulations &mdash; we <strong>never generate fake boundaries, fictitious khasra numbers, or artificial planning maps</strong>.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">State Planning Authority</span>
                <span className="text-xs font-extrabold text-slate-900">{fallbackContext.authority.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">State Revenue Portal</span>
                <span className="text-xs font-extrabold text-blue-600">{fallbackContext.revenuePortalName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Cadastral Terminology</span>
                <span className="text-xs font-bold text-slate-800">
                  {fallbackContext.cadastralTerms.parcelTerm} / {fallbackContext.cadastralTerms.subParcelTerm} ({fallbackContext.regionalUnit})
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={fallbackContext.bhuNakshaPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <ExternalLink size={15} /> Open Official State BhuNaksha Portal
              </a>

              <button
                onClick={onOpenUploadModal}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-300"
              >
                <PlusCircle size={15} /> Upload Official Map for this Area
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
