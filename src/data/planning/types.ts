// Types for India-wide Planning and Land Intelligence Platform

export type MapCategory = 'TP' | 'DP' | 'Village' | 'Colony' | 'Regional';

export type ApprovalStatus =
  | 'Approved'
  | 'Master Plan Gazetted'
  | 'RERA Registered'
  | 'BhuNaksha Digitized'
  | 'Lal Lakir Demarcated'
  | 'Draft / Under Revision'
  | 'Regularized'
  | 'Official Record';

export type RegionalUnit =
  | 'Sq. Yds / Gaj'
  | 'Sq. Meters'
  | 'Sq. Feet'
  | 'Acres'
  | 'Hectares'
  | 'Bigha'
  | 'Guntha'
  | 'Kanal / Marla'
  | 'Cent'
  | 'Ground';

export interface LandUseZone {
  id: string;
  name: string;
  code: string;
  color: string;
  percentage: number;
  description: string;
  permissibleFAR?: number;
  maxGroundCoverage?: number;
  permissibleUses?: string[];
  coordinates?: [number, number][];
}

export interface CadastralParcel {
  id: string;
  khasraOrSurveyNo: string;
  murabbaOrHissaNo?: string;
  areaInUnits: string;
  landClassification: 'Chahi (Irrigated)' | 'Barani (Rainfed)' | 'Gair Mumkin (Non-Agri)' | 'Abadi Deh (Residential)' | 'Shamlat Deh (Panchayat)' | 'Commercial';
  ownerNameOrType?: string;
  coordinates?: [number, number][];
}

export interface PlanningMapRecord {
  id: string;
  title: string;
  punjabiTitle?: string;
  hindiTitle?: string;
  category: MapCategory;
  state: string;
  district: string;
  cityOrTehsil: string;
  subTehsilOrBlock?: string;
  hadbastNoOrVillageCode?: string;
  authorityId: string;
  authorityName: string;
  authorityShort: string;
  status: ApprovalStatus;
  approvalOrderNo?: string;
  approvalDate?: string;
  reraRegNo?: string;
  gazetteNotification?: string;
  horizonYear?: string;
  totalAreaText: string;
  center: [number, number]; // [lat, lon]
  bounds?: [number, number, number, number]; // [south, west, north, east]
  zoomLevel?: number;
  roadWidths?: string[];
  landUseSplit?: {
    residential: number;
    commercial: number;
    industrial?: number;
    greenParks: number;
    roadsInfra: number;
    publicSemiPublic: number;
  };
  zones?: LandUseZone[];
  cadastralParcels?: CadastralParcel[];
  phirniRoadWidth?: string;
  canalOrWaterBody?: string;
  lalLakirStatus?: string;
  sourceUrl: string;
  sourceAuthorityWebsite?: string;
  pdfUrl?: string;
  highResImageUrl?: string;
  gisTileUrl?: string;
  isCommunityUploaded?: boolean;
  uploadedAt?: string;
  verifiedBy?: string;
  tags: string[];
  highlights: string[];
  nearbyInfrastructure?: {
    name: string;
    distance: string;
    type: 'airport' | 'metro' | 'highway' | 'hospital' | 'school' | 'railway' | 'commercial';
  }[];
}

export interface IndiaState {
  code: string;
  name: string;
  hindiName: string;
  punjabiName: string;
  type: 'State' | 'UT';
  capital: string;
  center: [number, number];
  zoom: number;
  districts: string[];
  primaryAuthorities: string[];
  revenueUnit: RegionalUnit;
  revenuePortalName: string;
  revenuePortalUrl: string;
  bhuNakshaPortalUrl?: string;
  townPlanningPortalUrl?: string;
  cadastralNomenclature: {
    parcelTerm: string; // e.g. "Khasra", "Survey No", "Gat No", "Dag"
    subParcelTerm?: string; // e.g. "Killa", "Hissa", "Khatian"
    villageTerm: string; // e.g. "Mauza", "Pind", "Gram"
  };
  description: string;
}

export interface AuthorityInfo {
  id: string;
  name: string;
  shortName: string;
  state: string;
  cityOrRegion: string;
  logoUrl?: string;
  websiteUrl: string;
  gisPortalUrl?: string;
  masterPlanPortalUrl?: string;
  description: string;
  jurisdictionArea: string;
}
