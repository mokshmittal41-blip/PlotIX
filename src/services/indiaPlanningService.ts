import type { PlanningMapRecord, MapCategory, IndiaState, AuthorityInfo } from '../data/planning/types';
import { INDIA_STATES_DATA } from '../data/planning/indiaStatesData';
import { OFFICIAL_AUTHORITIES } from '../data/planning/officialAuthorities';
import { VERIFIED_MAPS_REPOSITORY } from '../data/planning/verifiedMapsRepository';

const CUSTOM_MAPS_STORAGE_KEY = 'propwise_india_custom_maps_v1';

// In-memory + LocalStorage custom uploaded maps
function getCustomUploadedMaps(): PlanningMapRecord[] {
  try {
    const raw = localStorage.getItem(CUSTOM_MAPS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load custom maps from localStorage', e);
  }
  return [];
}

export function saveCustomUploadedMap(record: PlanningMapRecord): void {
  try {
    const current = getCustomUploadedMaps();
    const updated = [record, ...current.filter(m => m.id !== record.id)];
    localStorage.setItem(CUSTOM_MAPS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save custom map to localStorage', e);
  }
}

// Get all combined maps (Verified Repository + User-uploaded)
export function getAllPlanningMaps(): PlanningMapRecord[] {
  const custom = getCustomUploadedMaps();
  return [...custom, ...VERIFIED_MAPS_REPOSITORY];
}

// Query parameters interface
export interface PlanningMapFilterParams {
  query?: string;
  category?: MapCategory | 'ALL';
  state?: string;
  district?: string;
  authorityId?: string;
  status?: string;
  tags?: string[];
}

// Advanced Search & Filter Engine
export function searchPlanningMaps(params: PlanningMapFilterParams): PlanningMapRecord[] {
  let results = getAllPlanningMaps();

  // 1. Category Filter
  if (params.category && params.category !== 'ALL') {
    results = results.filter(m => m.category === params.category);
  }

  // 2. State Filter
  if (params.state && params.state !== 'ALL') {
    results = results.filter(m => m.state.toLowerCase() === params.state?.toLowerCase());
  }

  // 3. District Filter
  if (params.district && params.district !== 'ALL') {
    results = results.filter(m => m.district.toLowerCase() === params.district?.toLowerCase());
  }

  // 4. Authority Filter
  if (params.authorityId && params.authorityId !== 'ALL') {
    results = results.filter(m => m.authorityId.toLowerCase() === params.authorityId?.toLowerCase());
  }

  // 5. Status Filter
  if (params.status && params.status !== 'ALL') {
    results = results.filter(m => m.status === params.status);
  }

  // 6. Text Query (fuzzy match across title, hindiTitle, punjabiTitle, city, tags, authority)
  if (params.query && params.query.trim()) {
    const q = params.query.toLowerCase().trim();
    const words = q.split(/\s+/);

    results = results.filter(m => {
      const corpus = [
        m.title,
        m.hindiTitle || '',
        m.punjabiTitle || '',
        m.state,
        m.district,
        m.cityOrTehsil,
        m.authorityName,
        m.authorityShort,
        m.hadbastNoOrVillageCode || '',
        m.approvalOrderNo || '',
        m.reraRegNo || '',
        ...(m.tags || []),
        ...(m.highlights || [])
      ].join(' ').toLowerCase();

      return words.every(w => corpus.includes(w));
    });
  }

  return results;
}

// Fetch single map by ID
export function getPlanningMapById(id: string): PlanningMapRecord | undefined {
  return getAllPlanningMaps().find(m => m.id === id);
}

// Get State information
export function getStateByCodeOrName(identifier: string): IndiaState | undefined {
  const clean = identifier.toLowerCase().trim();
  return INDIA_STATES_DATA.find(
    s => s.code.toLowerCase() === clean || s.name.toLowerCase() === clean
  );
}

// Get Authority information
export function getAuthorityById(authorityId: string): AuthorityInfo | undefined {
  return OFFICIAL_AUTHORITIES[authorityId];
}

// Generate dynamic Official BhuNaksha / Master Plan Context for ANY searched Indian Location
export function getOfficialPortalContextForLocation(
  stateName: string,
  districtName?: string,
  cityOrVillageName?: string,
  _category: MapCategory = 'Village'
) {
  const state = getStateByCodeOrName(stateName) || INDIA_STATES_DATA[0]; // fallback Punjab
  const primaryAuthId = state.primaryAuthorities[0] || 'PUDA';
  const authority = OFFICIAL_AUTHORITIES[primaryAuthId] || {
    id: primaryAuthId,
    name: `${state.name} Urban Development & Revenue Department`,
    shortName: primaryAuthId,
    state: state.name,
    cityOrRegion: districtName || state.capital,
    websiteUrl: state.revenuePortalUrl,
    jurisdictionArea: 'State-wide',
    description: `Official statutory authority for land records, master plans and zoning across ${state.name}.`
  };

  return {
    state,
    authority,
    bhuNakshaPortalUrl: state.bhuNakshaPortalUrl || state.revenuePortalUrl,
    revenuePortalName: state.revenuePortalName,
    revenuePortalUrl: state.revenuePortalUrl,
    townPlanningPortalUrl: state.townPlanningPortalUrl || state.revenuePortalUrl,
    cadastralTerms: state.cadastralNomenclature,
    regionalUnit: state.revenueUnit,
    locationQuery: {
      state: state.name,
      district: districtName || state.districts[0],
      cityOrVillage: cityOrVillageName || 'General Jurisdiction'
    }
  };
}

// Calculate India-wide Portal Statistics
export function getIndiaPlanningStatistics() {
  const allMaps = getAllPlanningMaps();
  return {
    totalStatesCovered: INDIA_STATES_DATA.length,
    totalDistrictsCovered: INDIA_STATES_DATA.reduce((acc, s) => acc + s.districts.length, 0),
    totalOfficialAuthorities: Object.keys(OFFICIAL_AUTHORITIES).length,
    totalIndexedMaps: allMaps.length,
    totalTPMaps: allMaps.filter(m => m.category === 'TP' || m.category === 'Colony').length,
    totalDPMaps: allMaps.filter(m => m.category === 'DP' || m.category === 'Regional').length,
    totalVillageMaps: allMaps.filter(m => m.category === 'Village').length,
    totalApprovedColonies: allMaps.filter(m => m.status === 'Approved' || m.status === 'RERA Registered').length
  };
}
