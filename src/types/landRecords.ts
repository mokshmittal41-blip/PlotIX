// ─── TYPES FOR PROPWISE LAND RECORDS ARCHITECTURE ────────────────────────────

export interface LocationHierarchy {
  state: string;
  district: string;
  tehsil?: string;
  village?: string;
  locality?: string;
  pincode?: string;
  coordinates?: [number, number];
}

export interface LocationSuggestion {
  id: string;
  title: string;
  subtitle: string;
  state: string;
  district: string;
  tehsil?: string;
  village?: string;
  locality?: string;
  coordinates: [number, number];
  isDemo?: boolean;
}

export interface ParcelRecord {
  id: string; // e.g. "DEMO-PLOT-001"
  isDemo: boolean;
  khasraNumber: string | null;
  surveyNumber: string | null;
  khataNumber: string | null;
  ulpin: string | null;
  area: {
    value: number | null;
    unit: string;
    formatted: string;
  } | null;
  landClassification: string | null;
  landUse: string | null;
  coordinates: [number, number];
  polygonCoordinates: [number, number][];
}

export interface LandOwnership {
  ownerName: string | null;
  ownershipType: string | null;
  share: string | null;
}

export interface MutationRecord {
  status: string | null;
  mutationNumber: string | null;
  sanctionDate: string | null;
}

export interface LandRecordData {
  location: LocationHierarchy;
  parcel: ParcelRecord;
  ownership: LandOwnership;
  mutation: MutationRecord;
  encumbrance: {
    status: string | null;
    bankName: string | null;
  };
  source: string | null;
  lastUpdated: string | null;
  verificationStatus: 'unverified' | 'awaiting_data' | 'verified_source' | 'unavailable';
}

export type LandRecordStatus = 
  | 'idle'
  | 'loading'
  | 'data_available'
  | 'data_unavailable'
  | 'verification_required'
  | 'api_unavailable';
