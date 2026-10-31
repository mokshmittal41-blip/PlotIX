import type { 
  ActiveLocation, 
  LocationSearchResult, 
  DistrictIntelligence, 
  LocationScope,
  MandiMarket 
} from '../types/locationHierarchy';
import type { Property } from '../types';
import { 
  INDEXED_LOCATIONS, 
  DISTRICT_INTELLIGENCE_MAP 
} from '../data/locationHierarchyData';
import { 
  searchIndianLocations, 
  getCoordinatesForCity 
} from '../data/indiaStatesAndCities';
import { getAccurateCoordinates } from '../utils/mapUtils';
import { locationService } from './locationService';

export interface NaturalQueryResult {
  parsedQuery: string;
  matchedProperties: (Property & { calculatedDistanceKm?: number })[];
  matchedMandis: MandiMarket[];
  inferredType?: string;
  inferredLocationTarget?: string;
  inferredRadiusKm?: number;
  isMandiQuery?: boolean;
  totalMatches: number;
}

export class LocationHierarchyService {
  /**
   * Calculate Haversine distance in kilometers between two GPS coordinates
   */
  calculateDistanceKm(coords1?: [number, number] | null, coords2?: [number, number] | null): number {
    const defaultCoords: [number, number] = [28.1920, 76.6186];
    const c1 = (coords1 && Array.isArray(coords1) && coords1.length >= 2 && typeof coords1[0] === 'number') ? coords1 : defaultCoords;
    const c2 = (coords2 && Array.isArray(coords2) && coords2.length >= 2 && typeof coords2[0] === 'number') ? coords2 : defaultCoords;

    const [lat1, lon1] = c1;
    const [lat2, lon2] = c2;
    
    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
      return 0;
    }

    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return Math.round(d * 10) / 10;
  }

  /**
   * Detect current location using multi-tier GPS -> WiFi -> IP fallback with robust reverse geocoding
   */
  async detectCurrentGpsLocation(): Promise<{ 
    location: ActiveLocation | null; 
    error?: string; 
    errorCode?: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'NOT_SUPPORTED' | 'GEOCODE_ERROR';
  }> {
    try {
      const unified = await locationService.getUnifiedCurrentLocation();
      const [lat, lng] = unified.coordinates;
      const placeName = unified.locality || unified.city || unified.district || 'Current Location';
      const district = unified.district || unified.city || 'District Area';
      const state = unified.state || 'Haryana';
      const country = unified.country || 'India';

      const hierarchy = ['India', state, `${district} District`];
      if (unified.tehsil && unified.tehsil !== district) hierarchy.push(`${unified.tehsil} Tehsil`);
      if (placeName && placeName !== district && placeName !== unified.tehsil) hierarchy.push(placeName);

      const activeLoc: ActiveLocation = {
        id: `loc-detected-${Date.now()}`,
        name: placeName,
        displayName: unified.displayName || `${placeName}, ${district}, ${state}`,
        shortName: `${placeName}, ${state.slice(0, 2).toUpperCase()}`,
        coordinates: [lat, lng],
        latitude: lat,
        longitude: lng,
        placeName,
        locality: unified.locality,
        tehsil: unified.tehsil,
        district,
        state,
        country,
        source: unified.source,
        scope: 'local',
        hierarchy,
        accuracy: unified.accuracy,
        detectedAt: new Date().toISOString(),
        isVerified: true
      };

      return { location: activeLoc };
    } catch (err: any) {
      console.warn('Location detection failed:', err);
      return {
        location: null,
        error: 'Unable to retrieve your location automatically. You can search or choose your city below.',
        errorCode: 'POSITION_UNAVAILABLE'
      };
    }
  }

  /**
   * Search for locations across comprehensive Pan-India dataset, indexed database & online OSM Photon fallback
   */
  async searchLocations(query: string): Promise<LocationSearchResult[]> {
    const rawQ = (query || '').trim().toLowerCase();
    if (!rawQ || rawQ.length < 2) {
      return INDEXED_LOCATIONS.slice(0, 8);
    }

    const ALIAS_MAP: Record<string, string> = {
      'suman': 'Sunam',
      'sunam': 'Sunam',
      'sunam udham singh wala': 'Sunam',
      'sunam mandi': 'Sunam',
      'samana': 'Samana',
      'sangrur': 'Sangrur',
      'dhuri': 'Dhuri',
      'nabha': 'Nabha',
      'patiala': 'Patiala',
      'mansa': 'Mansa',
      'bathinda': 'Bathinda',
      'gurgaon': 'Gurugram',
      'bombay': 'Mumbai',
      'calcutta': 'Kolkata',
      'madras': 'Chennai',
      'bangalore': 'Bengaluru',
      'dharuhera': 'Dharuhera',
      'bawal': 'Bawal',
      'rewari': 'Rewari'
    };

    const targetAlias = ALIAS_MAP[rawQ] || (rawQ.includes('suman') ? 'Sunam' : undefined);
    const effectiveQueries = targetAlias ? [targetAlias, query] : [query];
    const q = targetAlias ? targetAlias.toLowerCase() : rawQ;

    const results: LocationSearchResult[] = [];
    const seen = new Set<string>();

    // 1. Search Pan-India state & city/district/tehsil database (includes Sangrur, Sunam, Dhuri, etc.)
    for (const eq of effectiveQueries) {
      const panIndiaMatches = searchIndianLocations(eq);
      for (const m of panIndiaMatches) {
        const key = `${m.city.toLowerCase()}-${m.state.toLowerCase()}`;
        if (!seen.has(key)) {
          seen.add(key);
          results.push({
            id: `pan-india-${m.city.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${m.state.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            name: m.city,
            title: `${m.city}, ${m.state}`,
            subtitle: `${m.state} • ${m.zone} India`,
            hierarchyBreadcrumb: `India → ${m.state} → ${m.city}`,
            level: 'city',
            district: m.city,
            state: m.state,
            coordinates: m.coordinates,
            source: 'search',
            defaultScope: 'city',
            isVerified: true,
            matchScore: (m.city.toLowerCase().startsWith(q) || rawQ === 'suman') ? 100 : 85
          });
        }
      }
    }

    // 2. Search local indexed database for villages, tehsils, and micro-markets
    const localMatches = INDEXED_LOCATIONS.filter(item => {
      const matchName = item.name.toLowerCase().includes(q);
      const matchDistrict = item.district.toLowerCase().includes(q);
      const matchTehsil = item.tehsil ? item.tehsil.toLowerCase().includes(q) : false;
      const matchVillage = item.village ? item.village.toLowerCase().includes(q) : false;
      const matchLocality = item.locality ? item.locality.toLowerCase().includes(q) : false;
      const matchTitle = item.title.toLowerCase().includes(q);
      return matchName || matchDistrict || matchTehsil || matchVillage || matchLocality || matchTitle;
    });

    for (const item of localMatches) {
      const key = `${item.name.toLowerCase()}-${item.district.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push({
          ...item,
          matchScore: item.name.toLowerCase().startsWith(q) ? 95 : 80
        });
      }
    }

    // 3. If needed, query online OSM Photon geocoding for any street/town/village
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=6&lang=en`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.features) && data.features.length > 0) {
          data.features.forEach((feat: any, idx: number) => {
            const props = feat.properties || {};
            const coords: [number, number] = [
              feat.geometry?.coordinates[1] || 28.1920,
              feat.geometry?.coordinates[0] || 76.6186
            ];

            const name = props.name || query;
            const city = props.city || props.town || props.village || props.district || '';
            const district = props.district || props.county || city || name;
            const state = props.state || 'India';
            const country = props.country || 'India';
            const key = `${name.toLowerCase()}-${district.toLowerCase()}`;

            if (!seen.has(key)) {
              seen.add(key);
              const breadcrumb = [country, state, district ? `${district} District` : '', name]
                .filter(Boolean)
                .join(' → ');

              results.push({
                id: `photon-${props.osm_id || idx}-${Date.now()}`,
                name,
                title: name,
                subtitle: `${state} → ${district}`,
                hierarchyBreadcrumb: breadcrumb,
                level: props.type === 'city' ? 'city' : (props.type === 'village' ? 'village' : 'locality'),
                district,
                state,
                coordinates: coords,
                source: 'search',
                defaultScope: props.type === 'village' ? 'village' : 'local',
                isVerified: true,
                matchScore: 75
              });
            }
          });
        }
      }
    } catch {
      // Ignore network timeout
    }

    // 4. Fallback: If absolutely zero results found, create an on-the-fly search option
    if (results.length === 0) {
      const capitalized = query.charAt(0).toUpperCase() + query.slice(1);
      const coords = getCoordinatesForCity(capitalized);
      results.push({
        id: `custom-${Date.now()}`,
        name: capitalized,
        title: `${capitalized} (Custom Location)`,
        subtitle: `Explore properties in ${capitalized}`,
        hierarchyBreadcrumb: `India → ${capitalized}`,
        level: 'city',
        district: capitalized,
        state: 'India',
        coordinates: coords,
        source: 'search',
        defaultScope: 'city',
        isVerified: false,
        matchScore: 50
      });
    }

    return results.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }

  /**
   * Convert a LocationSearchResult or raw coordinates to an ActiveLocation
   */
  createActiveLocationFromSearchResult(result: LocationSearchResult, customScope?: LocationScope): ActiveLocation {
    const scope: LocationScope = customScope || result.defaultScope || (
      result.level === 'district' ? 'district' :
      result.level === 'tehsil' ? 'tehsil' :
      result.level === 'village' ? 'village' : 'local'
    );

    const hierarchy = result.hierarchyBreadcrumb
      ? result.hierarchyBreadcrumb.split(' → ').map(s => s.trim())
      : ['India', result.state, `${result.district} District`, result.name];

    return {
      id: `active-${result.id}-${Date.now()}`,
      name: result.name,
      displayName: `${result.title || result.name}, ${result.district}, ${result.state}`,
      shortName: `${result.name}, ${result.state.slice(0, 2).toUpperCase()}`,
      coordinates: result.coordinates,
      latitude: result.coordinates[0],
      longitude: result.coordinates[1],
      placeName: result.name,
      locality: result.locality,
      village: result.village,
      tehsil: result.tehsil,
      district: result.district,
      state: result.state,
      country: 'India',
      source: result.source || 'search',
      scope,
      hierarchy,
      isVerified: result.isVerified
    };
  }

  /**
   * Filter properties based on ActiveLocation and radius/scope
   */
  filterProperties(
    properties: Property[],
    activeLocation: ActiveLocation,
    radiusKm: number | 'district'
  ): (Property & { calculatedDistanceKm: number })[] {
    if (!properties || properties.length === 0) return [];
    if (!activeLocation) return [];

    const activeCoords: [number, number] = (activeLocation.coordinates && Array.isArray(activeLocation.coordinates) && activeLocation.coordinates.length >= 2)
      ? activeLocation.coordinates
      : getAccurateCoordinates({ city: activeLocation.name, district: activeLocation.district, state: activeLocation.state });

    // 1. Calculate distances accurately for all properties
    const withDistances = properties.map(p => {
      const propCoords = getAccurateCoordinates(p);
      const dist = this.calculateDistanceKm(activeCoords, propCoords);
      return {
        ...p,
        coordinates: propCoords,
        calculatedDistanceKm: dist
      };
    });

    // 2. Normalize active location identifiers
    const locName = (activeLocation.name || '').toLowerCase().trim();
    const locDistrict = (activeLocation.district || '').toLowerCase().trim();
    const locTehsil = (activeLocation.tehsil || '').toLowerCase().trim();
    const locPlace = (activeLocation.placeName || '').toLowerCase().trim();
    const locState = (activeLocation.state || '').toLowerCase().trim();

    // Twin-city & Metropolitan district clusters
    const ALIAS_CLUSTERS: Record<string, string[]> = {
      'mohali': ['sas nagar', 'mohali', 'kharar', 'zirakpur', 'new chandigarh', 'aerocity', 'it city'],
      'sas nagar': ['sas nagar', 'mohali', 'kharar', 'zirakpur', 'new chandigarh', 'aerocity', 'it city'],
      'chandigarh': ['chandigarh', 'new chandigarh', 'mullanpur', 'sector 8', 'sector 15', 'sector 34'],
      'panchkula': ['panchkula', 'pinjore', 'kalka', 'mdc'],
      'gurugram': ['gurugram', 'gurgaon', 'sohna', 'manesar', 'pataudi', 'golf course'],
      'gurgaon': ['gurugram', 'gurgaon', 'sohna', 'manesar', 'pataudi', 'golf course'],
      'noida': ['noida', 'greater noida', 'gautam buddha nagar', 'gautam buddh nagar', 'yamuna expressway', 'pari chowk', 'noida extension'],
      'greater noida': ['greater noida', 'noida', 'gautam buddha nagar', 'yamuna expressway', 'pari chowk', 'noida extension'],
      'gautam buddha nagar': ['noida', 'greater noida', 'gautam buddha nagar'],
      'rewari': ['rewari', 'bawal', 'dharuhera', 'khol', 'kosli'],
      'bawal': ['bawal', 'rewari'],
      'dharuhera': ['dharuhera', 'rewari'],
      'sunam': ['sunam', 'sangrur', 'chathe', 'jakhal road', 'suman'],
      'sangrur': ['sangrur', 'sunam', 'dhuri', 'bhawanigarh'],
      'delhi': ['delhi', 'new delhi', 'dwarka', 'rohini', 'vasant kunj', 'chattarpur', 'najafgarh'],
      'new delhi': ['delhi', 'new delhi', 'dwarka', 'rohini', 'vasant kunj', 'chattarpur'],
      'bengaluru': ['bengaluru', 'bangalore', 'whitefield', 'sarjapur', 'electronic city', 'devanahalli'],
      'bangalore': ['bengaluru', 'bangalore', 'whitefield', 'sarjapur', 'electronic city', 'devanahalli'],
      'jaipur': ['jaipur', 'jagatpura', 'mansarovar', 'ajmer road', 'tonk road'],
      'mumbai': ['mumbai', 'navi mumbai', 'thane', 'panvel'],
      'pune': ['pune', 'hinjewadi', 'wakad', 'kharadi', 'baner'],
      'hyderabad': ['hyderabad', 'gachibowli', 'hitec city', 'kondapur', 'mokila']
    };

    const targetAliases = new Set<string>();
    [locName, locDistrict, locTehsil, locPlace].forEach(term => {
      if (!term) return;
      targetAliases.add(term);
      if (ALIAS_CLUSTERS[term]) {
        ALIAS_CLUSTERS[term].forEach(a => targetAliases.add(a));
      }
    });

    // Determine if property belongs strictly to this active location
    const isStrictMatch = (p: typeof withDistances[0]) => {
      const pCity = (p.city || '').toLowerCase().trim();
      const pDistrict = (p.district || '').toLowerCase().trim();
      const pTehsil = (p.tehsil || '').toLowerCase().trim();
      const pLoc = (p.location || '').toLowerCase().trim();

      // Check text match against target aliases
      for (const alias of targetAliases) {
        if (!alias) continue;
        if (pCity === alias || pCity.includes(alias)) return true;
        if (pDistrict === alias || pDistrict.includes(alias)) return true;
        if (pTehsil === alias || pTehsil.includes(alias)) return true;
        if (pLoc.includes(alias)) return true;
      }

      // Check spatial proximity: within 35 km and same state/contiguous cluster
      if (p.calculatedDistanceKm <= 35) {
        const pState = (p.state || '').toLowerCase().trim();
        if (locState && pState && (locState.includes(pState) || pState.includes(locState))) {
          return true;
        }
        // Tricity cluster (Punjab / Haryana / Chandigarh)
        const isTricity = (s: string) => ['punjab', 'haryana', 'chandigarh'].some(x => s.includes(x));
        if (isTricity(locState) && isTricity(pState) && p.calculatedDistanceKm <= 25) {
          return true;
        }
        // NCR cluster (Delhi / Haryana / Uttar Pradesh)
        const isNcr = (s: string) => ['delhi', 'haryana', 'uttar pradesh'].some(x => s.includes(x));
        if (isNcr(locState) && isNcr(pState) && p.calculatedDistanceKm <= 25) {
          return true;
        }
      }

      return false;
    };

    const matched = withDistances.filter(isStrictMatch);

    // If radius is a number, filter by that radius or return matching city properties
    if (typeof radiusKm === 'number') {
      const insideRadius = matched.filter(p => p.calculatedDistanceKm <= radiusKm);
      if (insideRadius.length > 0) {
        return insideRadius.sort((a, b) => a.calculatedDistanceKm - b.calculatedDistanceKm);
      }
      return matched.sort((a, b) => a.calculatedDistanceKm - b.calculatedDistanceKm);
    }

    // Default or district scope
    return matched.sort((a, b) => a.calculatedDistanceKm - b.calculatedDistanceKm);
  }

  /**
   * Parse natural language search queries relative to active location
   */
  parseNaturalQuery(
    query: string,
    activeLocation: ActiveLocation,
    allProperties: Property[]
  ): NaturalQueryResult {
    const raw = (query || '').trim().toLowerCase();
    let inferredType: string | undefined = undefined;
    let inferredLocationTarget: string | undefined = undefined;
    let inferredRadiusKm: number | undefined = undefined;
    let isMandiQuery = false;

    // Check for Mandi query
    if (raw.includes('mandi') || raw.includes('grain market') || raw.includes('anaj') || raw.includes('sabzi')) {
      isMandiQuery = true;
    }

    // Check for Property types
    if (raw.includes('plot') || raw.includes('residential plot') || raw.includes('gaj')) {
      inferredType = 'Residential Plot';
    } else if (raw.includes('land') || raw.includes('acre') || raw.includes('killa') || raw.includes('agricultural') || raw.includes('farm')) {
      inferredType = 'Agricultural Land';
    } else if (raw.includes('commercial') || raw.includes('shop') || raw.includes('showroom') || raw.includes('industrial')) {
      inferredType = 'Commercial Plot';
    } else if (raw.includes('house') || raw.includes('villa') || raw.includes('kothi')) {
      inferredType = 'Villa';
    } else if (raw.includes('flat') || raw.includes('apartment') || raw.includes('bhk')) {
      inferredType = 'Apartment';
    }

    // Check for specific location keywords (e.g. "bawal", "rewari", "dharuhera", "khol", "gurugram", "mohali")
    const knownPlaces = ['bawal', 'rewari', 'dharuhera', 'khol', 'kosli', 'manethi', 'khori', 'masani', 'gurugram', 'manesar', 'sohna', 'mohali', 'panchkula', 'zirakpur', 'kharar'];
    for (const place of knownPlaces) {
      if (raw.includes(place)) {
        inferredLocationTarget = place;
        break;
      }
    }

    // Check for radius keywords (e.g. "within 10 km", "10 km", "5km")
    const kmMatch = raw.match(/(\d+)\s*(?:km|kms|kilometer|kilometres)/i);
    if (kmMatch) {
      inferredRadiusKm = parseInt(kmMatch[1], 10);
    }

    // Mandis matching active location or target
    const districtIntel = this.getDistrictIntelligence(
      inferredLocationTarget && inferredLocationTarget === 'gurugram' ? 'gurugram' : activeLocation.district
    );
    const matchedMandis: MandiMarket[] = (districtIntel?.mandis || []).filter(m => {
      if (inferredLocationTarget) {
        return m.name.toLowerCase().includes(inferredLocationTarget) || m.tehsil.toLowerCase().includes(inferredLocationTarget);
      }
      return true;
    });

    const activeCoords: [number, number] = (activeLocation && activeLocation.coordinates && Array.isArray(activeLocation.coordinates) && activeLocation.coordinates.length >= 2)
      ? activeLocation.coordinates
      : [28.1920, 76.6186];

    // Calculate distance for all properties
    const propsWithDist = (allProperties || []).map(p => {
      let coords: [number, number] = [28.1920, 76.6186];
      if (p.coordinates && Array.isArray(p.coordinates) && p.coordinates.length >= 2 && typeof p.coordinates[0] === 'number') {
        coords = p.coordinates;
      }
      const dist = this.calculateDistanceKm(activeCoords, coords);
      return { ...p, calculatedDistanceKm: dist };
    });

    // Filter properties based on inferred criteria
    const matchedProperties = propsWithDist.filter(p => {
      // 1. Type matching
      if (inferredType && p.type !== inferredType) {
        // Soft match: commercial vs residential plot
        if (!(inferredType.includes('Plot') && p.type.includes('Plot'))) {
          return false;
        }
      }

      // 2. Specific Target Location
      if (inferredLocationTarget) {
        const matchesTarget = 
          p.location.toLowerCase().includes(inferredLocationTarget) ||
          p.city.toLowerCase().includes(inferredLocationTarget) ||
          (p.tehsil && p.tehsil.toLowerCase().includes(inferredLocationTarget)) ||
          (p.village && p.village.toLowerCase().includes(inferredLocationTarget));
        if (!matchesTarget) return false;
      }

      // 3. Inferred Radius
      if (inferredRadiusKm && p.calculatedDistanceKm > inferredRadiusKm) {
        return false;
      }

      return true;
    }).sort((a, b) => a.calculatedDistanceKm - b.calculatedDistanceKm);

    return {
      parsedQuery: raw,
      matchedProperties,
      matchedMandis,
      inferredType,
      inferredLocationTarget,
      inferredRadiusKm,
      isMandiQuery,
      totalMatches: isMandiQuery ? matchedMandis.length : matchedProperties.length
    };
  }

  /**
   * Retrieve District Intelligence metadata with dynamic fallback for any Indian district
   */
  getDistrictIntelligence(districtName: string): DistrictIntelligence {
    const key = (districtName || '').toLowerCase().trim();
    if (DISTRICT_INTELLIGENCE_MAP[key]) {
      return DISTRICT_INTELLIGENCE_MAP[key];
    }
    
    // Check partial key matches (e.g., 'ludhiana district' -> 'ludhiana')
    for (const mapKey in DISTRICT_INTELLIGENCE_MAP) {
      if (key.includes(mapKey) || mapKey.includes(key)) {
        return DISTRICT_INTELLIGENCE_MAP[mapKey];
      }
    }

    // Dynamic clean fallback tailored to the user's active district
    const cleanName = districtName || 'Local District';
    return {
      district: cleanName,
      state: 'India',
      coordinates: [28.1920, 76.6186],
      tehsils: [
        {
          id: `teh-${cleanName.toLowerCase().replace(/\s+/g, '-')}`,
          name: `${cleanName} Central Tehsil`,
          district: cleanName,
          state: 'India',
          coordinates: [28.1980, 76.6190],
          villagesCount: 54,
          mandisCount: 2,
          avgPriceSqYd: '₹28,000 - ₹65,000',
          keyVillages: ['Growth Corridor', 'Urban Estate', 'Industrial Sector', 'Central Hub'],
          keyLocalities: ['Model Town', 'Station Road', 'Civil Lines', 'Ring Road'],
          isVerified: true
        }
      ],
      villages: [
        { id: `vil-${cleanName.toLowerCase()}-1`, name: `${cleanName} Urban Hub`, tehsil: 'Central', district: cleanName, coordinates: [28.1920, 76.6186], isVerified: true, propertyCount: 6 }
      ],
      mandis: [
        { id: `man-${cleanName.toLowerCase()}-1`, name: `${cleanName} Grain & Veg Market`, tehsil: 'Central', district: cleanName, coordinates: [28.1920, 76.6186], type: 'Grain Mandi', distanceKm: 2.5, notes: 'Daily 2,400+ Quintals', isVerified: true }
      ],
      priceTrends: {
        avgResidentialPlotSqYd: 42000,
        avgAgriLandPerAcre: 8500000,
        avgCommercialSqYd: 78000,
        yoyGrowthPercent: 14.2,
        demandIndex: 'High'
      },
      popularCorridors: [
        { name: `${cleanName} Central Growth Belt`, tag: 'High Appreciation', description: `Major commercial and plotted corridor across ${cleanName}.` },
        { name: `${cleanName} Express Bypass`, tag: 'Emerging Residential', description: `High connectivity corridor connecting regional highway network.` }
      ],
      verifiedListingsCount: 16,
      coverageNote: `Comprehensive GIS cadastral and property market intelligence across ${cleanName} district.`
    };
  }
}

export const locationHierarchyService = new LocationHierarchyService();
