export type LocationSource = 'gps' | 'ip' | 'wifi' | 'search' | 'recent' | 'preset' | 'manual';

export type LocationScope = 'local' | 'radius' | 'district' | 'tehsil' | 'village' | 'city';

export interface ActiveLocation {
  id: string;
  name: string;
  displayName: string;
  shortName: string;
  coordinates: [number, number]; // [lat, lng]
  latitude: number;
  longitude: number;
  placeName: string;
  locality?: string;
  village?: string;
  tehsil?: string;
  district: string;
  state: string;
  country: string;
  source: LocationSource;
  scope: LocationScope;
  hierarchy: string[]; // e.g. ["India", "Haryana", "Rewari District", "Bawal Tehsil", "Bawal Town"]
  accuracy?: number; // meters from GPS
  detectedAt?: string;
  isVerified?: boolean;
}

export interface MandiMarket {
  id: string;
  name: string;
  type: 'Grain Mandi' | 'Vegetable / Agro Mandi' | 'Industrial Market' | 'Commercial Market' | 'Auto-Hub';
  tehsil: string;
  district: string;
  coordinates: [number, number];
  commodities?: string[];
  distanceKm?: number;
  isVerified: boolean;
  notes?: string;
}

export interface VillageData {
  id: string;
  name: string;
  tehsil: string;
  district: string;
  coordinates: [number, number];
  hadbastNumber?: string;
  isVerified: boolean;
  propertyCount: number;
}

export interface TehsilData {
  id: string;
  name: string;
  district: string;
  state: string;
  coordinates: [number, number];
  villagesCount: number;
  mandisCount: number;
  avgPriceSqYd: string;
  keyVillages: string[];
  keyLocalities: string[];
  isVerified: boolean;
}

export interface DistrictIntelligence {
  district: string;
  state: string;
  coordinates: [number, number];
  tehsils: TehsilData[];
  villages: VillageData[];
  mandis: MandiMarket[];
  priceTrends: {
    avgResidentialPlotSqYd: number;
    avgAgriLandPerAcre: number;
    avgCommercialSqYd: number;
    yoyGrowthPercent: number;
    demandIndex: 'High' | 'Very High' | 'Moderate';
  };
  popularCorridors: { name: string; tag: string; description: string }[];
  verifiedListingsCount: number;
  coverageNote: string;
}

export interface LocationSearchResult {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  hierarchyBreadcrumb: string; // e.g. "Haryana → Rewari District → Bawal Tehsil"
  level: 'village' | 'locality' | 'town' | 'city' | 'tehsil' | 'district' | 'state';
  village?: string;
  locality?: string;
  tehsil?: string;
  district: string;
  state: string;
  coordinates: [number, number];
  source: LocationSource;
  defaultScope: LocationScope;
  isVerified: boolean;
  matchScore?: number;
}
