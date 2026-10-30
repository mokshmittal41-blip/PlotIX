export interface LocationResult {
  id: string;
  name: string;
  type: string;
  locality: string;
  city: string;
  state: string;
  coordinates: [number, number];
  boundingBox?: [[number, number], [number, number]];
}

export interface NearbyPlace {
  id: string;
  name: string;
  type: string;
  distanceKm: number;
  coordinates?: [number, number];
}

export interface PlaceIntelligence {
  locationName: string;
  locality: string;
  city: string;
  state: string;
  description: string;
  connectivity: string[];
  education: string;
  healthcare: string;
  dailyLife: string[];
  shopping: string[];
  recreation: string[];
  propertyMarket: {
    avgPrice: string;
    trend: string;
    rentalYield: string;
    isDemo: boolean;
  };
  futurePotential: string[];
  investmentScore: {
    total: number;
    connectivity: number;
    development: number;
    demand: number;
    isDemo: boolean;
  };
  pros: string[];
  considerations: string[];
}
