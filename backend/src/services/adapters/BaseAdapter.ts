export interface ExternalPropertyListing {
  externalId: string;
  sourceName: string;
  sourceUrl: string;
  originalListingUrl: string;
  title: string;
  description?: string;
  propertyType: string;
  listingType: 'sale' | 'rent';
  price: number;
  priceUnit: string;
  area: number;
  areaUnit: string;
  locality?: string;
  city: string;
  district?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  facing?: string;
  roadWidthFt?: number;
  images: string[];
  contactName: string;
  contactPhone?: string;
  agencyName: string;
  isVerified: boolean;
  fetchedAt: string;
  lastSeenAt?: string;
  lastSyncedAt?: string;
}

export interface AdapterHealth {
  sourceName: string;
  isAvailable: boolean;
  status: 'ACTIVE' | 'UNAVAILABLE' | 'BLOCKED' | 'PAUSED';
  statusMessage: string;
  lastCheckedAt: string;
  supportedCategories: string[];
}

export interface SourceAdapter {
  readonly name: string;
  readonly baseUrl: string;
  isAvailable(): boolean;
  getHealth(): AdapterHealth;
  fetchListings(params: {
    city: string;
    state?: string;
    category?: string;
    limit?: number;
  }): Promise<ExternalPropertyListing[]>;
}
