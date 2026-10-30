import type {
  LocationHierarchy,
  LocationSuggestion,
  ParcelRecord,
  LandRecordData,
  LandRecordStatus
} from '../types/landRecords';
import { locationService } from './locationService';

// Popular demo location suggestions across India
export const DEMO_POPULAR_LOCATIONS: LocationSuggestion[] = [
  {
    id: 'loc-demo-1',
    title: 'Rajpura',
    subtitle: 'Patiala District, Punjab',
    state: 'Punjab',
    district: 'Patiala',
    tehsil: 'Rajpura',
    village: 'Rajpura Town',
    locality: 'GT Road Corridor',
    coordinates: [30.4842, 76.5936],
    isDemo: true
  },
  {
    id: 'loc-demo-2',
    title: 'Zirakpur',
    subtitle: 'SAS Nagar (Mohali), Punjab',
    state: 'Punjab',
    district: 'SAS Nagar (Mohali)',
    tehsil: 'Dera Bassi',
    village: 'Zirakpur',
    locality: 'VIP Road / High Ground',
    coordinates: [30.6425, 76.8173],
    isDemo: true
  },
  {
    id: 'loc-demo-3',
    title: 'Sector 17',
    subtitle: 'Chandigarh (UT)',
    state: 'Chandigarh',
    district: 'Chandigarh',
    tehsil: 'Chandigarh Central',
    locality: 'City Centre Sector 17',
    coordinates: [30.7398, 76.7827],
    isDemo: true
  },
  {
    id: 'loc-demo-4',
    title: 'Sector 82, Mohali',
    subtitle: 'SAS Nagar (Mohali), Punjab',
    state: 'Punjab',
    district: 'SAS Nagar (Mohali)',
    tehsil: 'Mohali',
    village: 'JLPL Industrial & Plotted',
    locality: 'Airport Road',
    coordinates: [30.6698, 76.7214],
    isDemo: true
  },
  {
    id: 'loc-demo-5',
    title: 'Patiala Urban',
    subtitle: 'Patiala District, Punjab',
    state: 'Punjab',
    district: 'Patiala',
    tehsil: 'Patiala',
    village: 'Urban Estate Phase 2',
    locality: 'Rajpura Road',
    coordinates: [30.3398, 76.3869],
    isDemo: true
  },
  {
    id: 'loc-demo-6',
    title: 'DLF Phase 5, Gurugram',
    subtitle: 'Gurugram District, Haryana',
    state: 'Haryana',
    district: 'Gurugram',
    tehsil: 'Wazirabad',
    locality: 'Golf Course Road',
    coordinates: [28.4595, 77.0988],
    isDemo: true
  },
  {
    id: 'loc-demo-7',
    title: 'Indiranagar, Bengaluru',
    subtitle: 'Bengaluru Urban, Karnataka',
    state: 'Karnataka',
    district: 'Bengaluru',
    tehsil: 'Bengaluru East',
    locality: '100 Feet Road',
    coordinates: [12.9784, 77.6408],
    isDemo: true
  },
  {
    id: 'loc-demo-8',
    title: 'Vasant Kunj, Delhi',
    subtitle: 'South Delhi, Delhi (NCT)',
    state: 'Delhi (NCT)',
    district: 'South Delhi',
    tehsil: 'Mehrauli',
    locality: 'Pocket B',
    coordinates: [28.5244, 77.1558],
    isDemo: true
  }
];

/**
 * Generate a grid of demo parcel polygons around any center coordinates.
 * Clearly marked as DEMO parcel boundaries.
 */
export function generateDemoParcels(centerLat: number, centerLng: number): ParcelRecord[] {
  const parcels: ParcelRecord[] = [];
  const delta = 0.0008; // ~80 meters per parcel

  const grid = [
    { row: -1, col: -1, id: 'DEMO-PLOT-101', gaj: 200, use: 'Residential' },
    { row: -1, col: 0,  id: 'DEMO-PLOT-102', gaj: 250, use: 'Residential' },
    { row: -1, col: 1,  id: 'DEMO-PLOT-103', gaj: 150, use: 'Residential' },
    { row: 0,  col: -1, id: 'DEMO-PLOT-104', gaj: 300, use: 'Commercial / Plotted' },
    { row: 0,  col: 0,  id: 'DEMO-PLOT-105', gaj: 200, use: 'Residential' },
    { row: 0,  col: 1,  id: 'DEMO-PLOT-106', gaj: 180, use: 'Residential' },
    { row: 1,  col: -1, id: 'DEMO-PLOT-107', gaj: 500, use: 'Plotted Kothi' },
    { row: 1,  col: 0,  id: 'DEMO-PLOT-108', gaj: 200, use: 'Residential' },
    { row: 1,  col: 1,  id: 'DEMO-PLOT-109', gaj: 250, use: 'Residential' }
  ];

  grid.forEach(cell => {
    const latMin = centerLat + cell.row * delta;
    const latMax = latMin + delta * 0.88;
    const lngMin = centerLng + cell.col * delta;
    const lngMax = lngMin + delta * 0.88;

    const polygon: [number, number][] = [
      [latMin, lngMin],
      [latMax, lngMin],
      [latMax, lngMax],
      [latMin, lngMax]
    ];

    parcels.push({
      id: cell.id,
      isDemo: true,
      khasraNumber: null, // Intentionally null (awaiting official data)
      surveyNumber: null,
      khataNumber: null,
      ulpin: null,
      area: {
        value: cell.gaj,
        unit: 'Gaj (Sq. Yards)',
        formatted: `${cell.gaj} Gaj (approx. ${(cell.gaj * 9).toLocaleString()} sq.ft)`
      },
      landClassification: 'Gair Mumkin / Abadi Deh (Demo)',
      landUse: cell.use,
      coordinates: [(latMin + latMax) / 2, (lngMin + lngMax) / 2],
      polygonCoordinates: polygon
    });
  });

  return parcels;
}

/**
 * Clean Land Records Service Abstraction (Frontend-only Mock ready for real Backend APIs).
 */
export const landRecordsService = {
  /**
   * Search for locations with suggestions.
   */
  async searchLocations(query: string): Promise<LocationSuggestion[]> {
    if (!query || query.trim().length < 2) {
      return DEMO_POPULAR_LOCATIONS.slice(0, 5);
    }

    const q = query.toLowerCase().trim();

    // 1. Check local demo locations
    const localMatches = DEMO_POPULAR_LOCATIONS.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.district.toLowerCase().includes(q) ||
      item.state.toLowerCase().includes(q)
    );

    // 2. Fetch live Nominatim results
    try {
      const osmResults = await locationService.searchLocation(query);
      const onlineMatches: LocationSuggestion[] = osmResults.slice(0, 5).map(r => ({
        id: `osm-${r.id}`,
        title: r.name,
        subtitle: `${r.locality ? r.locality + ', ' : ''}${r.city || ''}, ${r.state || 'India'}`,
        state: r.state || 'India',
        district: r.city || r.locality || 'District',
        locality: r.locality || r.name,
        coordinates: r.coordinates,
        isDemo: false
      }));

      // Combine local demo and online matches
      const combined = [...localMatches];
      for (const item of onlineMatches) {
        if (!combined.some(c => c.title.toLowerCase() === item.title.toLowerCase())) {
          combined.push(item);
        }
      }
      return combined.slice(0, 8);
    } catch {
      return localMatches;
    }
  },

  /**
   * Retrieve demo parcels for a given location.
   */
  async getParcelsByLocation(location: LocationHierarchy): Promise<ParcelRecord[]> {
    const lat = location.coordinates ? location.coordinates[0] : 30.6698;
    const lng = location.coordinates ? location.coordinates[1] : 76.7214;
    return generateDemoParcels(lat, lng);
  },

  /**
   * Retrieve Land Record Information for a parcel.
   * Returns a standard structure where official data is "Not available / Awaiting official data".
   */
  async getLandRecordByParcel(parcel: ParcelRecord, location: LocationHierarchy): Promise<LandRecordData> {
    // Simulate brief network delay
    await new Promise(resolve => setTimeout(resolve, 400));

    return {
      location: {
        state: location.state,
        district: location.district,
        tehsil: location.tehsil || 'Not available',
        village: location.village || location.locality || 'Not available',
        locality: location.locality,
        coordinates: parcel.coordinates
      },
      parcel: {
        id: parcel.id,
        isDemo: true,
        khasraNumber: null,
        surveyNumber: null,
        khataNumber: null,
        ulpin: null,
        area: parcel.area,
        landClassification: null,
        landUse: parcel.landUse,
        coordinates: parcel.coordinates,
        polygonCoordinates: parcel.polygonCoordinates
      },
      ownership: {
        ownerName: null, // Strictly null for demo compliance
        ownershipType: null,
        share: null
      },
      mutation: {
        status: null,
        mutationNumber: null,
        sanctionDate: null
      },
      encumbrance: {
        status: null,
        bankName: null
      },
      source: null,
      lastUpdated: null,
      verificationStatus: 'awaiting_data'
    };
  },

  /**
   * Lookup land record by Khasra or Survey Number.
   */
  async getLandRecordByKhasra(khasraNumber: string, location: LocationHierarchy): Promise<{
    status: LandRecordStatus;
    record?: LandRecordData;
    message: string;
  }> {
    await new Promise(resolve => setTimeout(resolve, 600));

    if (!khasraNumber || khasraNumber.trim().length === 0) {
      return {
        status: 'idle',
        message: 'Please enter a valid Khasra or Survey number.'
      };
    }

    // Since real backend is not connected yet, return a clean "Awaiting official data" response
    const mockParcel: ParcelRecord = {
      id: `DEMO-KHASRA-${khasraNumber.trim()}`,
      isDemo: true,
      khasraNumber: khasraNumber.trim(),
      surveyNumber: null,
      khataNumber: null,
      ulpin: null,
      area: {
        value: 200,
        unit: 'Gaj',
        formatted: 'Awaiting official measurement'
      },
      landClassification: null,
      landUse: 'Residential (Awaiting official records)',
      coordinates: location.coordinates || [30.6698, 76.7214],
      polygonCoordinates: []
    };

    const record: LandRecordData = {
      location: {
        state: location.state,
        district: location.district,
        tehsil: location.tehsil || 'Awaiting official data',
        village: location.village || 'Awaiting official data',
        locality: location.locality,
        coordinates: location.coordinates
      },
      parcel: mockParcel,
      ownership: {
        ownerName: null,
        ownershipType: null,
        share: null
      },
      mutation: {
        status: null,
        mutationNumber: null,
        sanctionDate: null
      },
      encumbrance: {
        status: null,
        bankName: null
      },
      source: null,
      lastUpdated: null,
      verificationStatus: 'awaiting_data'
    };

    return {
      status: 'data_unavailable',
      record,
      message: 'Official land records for this Khasra will be retrieved when the state revenue database is connected.'
    };
  }
};
