export interface Property {
  id: string;
  userId?: string | null;
  title: string;
  location: string;
  sector: string;
  city: string;
  district?: string;
  tehsil?: string;
  village?: string;
  state: string;
  type: PropertyType;
  listingType?: 'sale' | 'rent' | 'lease';
  area: number;
  areaUnit: string;
  price: number;
  pricePerUnit: number;
  images: string[];
  facing: Facing;
  roadWidth: number;
  rating: number;
  reviews: number;
  isVerified: boolean;
  isSaved: boolean;
  status?: 'active' | 'sold' | 'rented' | 'expired' | 'deleted';
  approvals: string[];
  nearbyLandmarks: NearbyLandmark[];
  description: string;
  dealer: Dealer;
  postedDate: string;
  highlights: string[];
  coordinates?: [number, number]; // [lat, lng]
  calculatedDistanceKm?: number;
  khasraNo?: string;
  registryStatus?: string;
  viewsCount?: number;
  source?: string;
  externalId?: string;
  sourceName?: string;
  sourceUrl?: string;
  originalListingUrl?: string;
  lastSeenAt?: string;
  lastSyncedAt?: string;
}

export type PropertyType =
  | 'Residential Plot'
  | 'Commercial Plot'
  | 'Agricultural Land'
  | 'Villa'
  | 'Apartment'
  | 'Builder Floor'
  | 'Commercial SCO'
  | 'Industrial Land'
  | 'Villa / House'
  | string;

export type Facing = 'East' | 'West' | 'North' | 'South' | 'North-East' | 'North-West' | 'Any' | string;

export interface NearbyLandmark {
  name: string;
  distance: string;
  type: 'hospital' | 'school' | 'mall' | 'metro' | 'highway' | 'airport' | 'park';
}

export interface Dealer {
  id: string;
  name: string;
  phone: string;
  company: string;
  verified: boolean;
}

export interface MarketData {
  area: string;
  avgPrice: number;
  priceGrowth: number;
  demand: 'High' | 'Medium' | 'Low';
  trend: 'Rising' | 'Stable' | 'Declining';
  priceHistory: PricePoint[];
}

export interface PricePoint {
  month: string;
  price: number;
}

export interface AIAnalysis {
  propertyId: string;
  score: number;
  priceAssessment: 'Undervalued' | 'Fair Value' | 'Overvalued';
  locationScore: number;
  rentalDemand: number;
  futurePotential: number;
  nearbyDevelopment: DevelopmentItem[];
  investmentOutlook: string;
  insights: string[];
}

export interface DevelopmentItem {
  name: string;
  type: 'metro' | 'road' | 'commercial' | 'airport' | 'it_hub' | 'hospital';
  status: 'Planned' | 'Under Construction' | 'Completed';
  distance: string;
  impact: 'High' | 'Medium' | 'Low';
  timeline: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type NavItem = {
  id: string;
  label: string;
  icon: string;
  path: string;
};

export interface AdvisorContext {
  selectedLocation?: { name: string; city: string; coordinates: number[] };
  plot?: { areaSqYd: number; perimeter: number; boundary: [number, number][] };
  property?: { id: string; title: string; price: number; area: number };
  calculatorResult?: { areaSqYd: number; estimatedValue: number };
}

export interface AdvisorAction {
  label: string;
  type: 'navigate' | 'followup' | 'external';
  target: string;
}

export type AdvisorResponseType = 
  | 'text' 
  | 'score' 
  | 'location_analysis' 
  | 'property_analysis' 
  | 'bylaws_analysis'
  | 'valuation_analysis'
  | 'investment' 
  | 'checklist' 
  | 'comparison';

export interface AdvisorResponse {
  id: string;
  type: AdvisorResponseType;
  message: string;
  data?: any; // Contains structured data like score, pros/cons, etc.
  actions?: AdvisorAction[];
}
