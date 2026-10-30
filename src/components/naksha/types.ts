export type PlotShape = 'Rectangle' | 'Square' | 'Irregular';
export type RoadFacing = 'North' | 'South' | 'East' | 'West' | 'Corner Plot' | 'Two-Side Road';
export type FloorOption = 'Single Floor' | 'G+1' | 'G+2' | 'G+3';
export type FutureExpansion = 'Yes' | 'No' | 'Let AI decide';
export type KitchenStyle = 'Open' | 'Semi-Open' | 'Closed';
export type ParkingPreference = 'Front' | 'Side' | 'Basement' | 'AI decides';
export type VastuPreference = 'No preference' | 'Vastu-friendly' | 'Strong Vastu preference';
export type LightLevel = 'Standard' | 'Balanced' | 'Maximum';
export type VentilationLevel = 'Standard' | 'Cross Ventilation' | 'Maximum';
export type BudgetRange = '₹20–30L' | '₹30–50L' | '₹50–75L' | '₹75L–1Cr' | '₹1Cr+' | 'Not decided';

export type PriorityOption = 'Low' | 'Medium' | 'High' | 'Compact' | 'Balanced' | 'Spacious' | 'Normal' | 'Yes' | 'No' | 'Maybe';
export type VastuOption = 'Follow Vastu' | 'No Vastu Preference' | 'Custom';
export type ZoneOption = 'Bedroom' | 'Living' | 'Drawing Room' | 'Dining' | 'Kitchen' | 'Parking' | 'Garden' | 'Staircase' | 'Bathroom' | 'Utility' | 'Pooja' | 'Open Space' | 'AI Decide';

export interface RoomPlacement {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  area: number;
  zone: string;
}

export interface GeneratedPlanOption {
  id: string;
  name: string;
  tagline: string;
  score: number;
  builtUpAreaSqFt: number;
  carpetAreaSqFt: number;
  groundCoveragePercent: number;
  scoreBreakdown: {
    spaceEfficiency: number;
    naturalLight: number;
    ventilation: number;
    parking: number;
    privacy: number;
  };
  highlights: string[];
  rooms: RoomPlacement[];
}

export interface NakshaConfiguration {
  // Step 1: Plot
  plot: {
    shape: PlotShape;
    frontageFt: number;
    depthFt: number;
    areaSqYd: number;
    roadFacing: RoadFacing;
  };

  // Step 2: Home Scale
  home: {
    floors: FloorOption;
    futureExpansion: FutureExpansion;
    staircaseType: 'Internal' | 'External' | 'AI decides';
  };

  // Step 3: Spaces
  spaces: {
    selectedSpaces: string[];
    bedroomsCount: number;
    attachedBathsCount: number;
    walkInClosetsCount: number;
    bathroomsCount: number;
    kitchenStyle: KitchenStyle;
    utilityArea: boolean;
    carParkingCount: number;
    bikeParkingCount: number;
    parkingPreference: ParkingPreference;
  };

  // Step 4: Lifestyle & Planning
  lifestyle: {
    priorities: string[]; // max 4
    vastu: VastuPreference;
    naturalLight: LightLevel;
    ventilation: VentilationLevel;
    budget: BudgetRange;
    aiAutoOptimize: boolean;
  };
}

export const INITIAL_NAKSHA_CONFIG: NakshaConfiguration = {
  plot: {
    shape: 'Rectangle',
    frontageFt: 30,
    depthFt: 50,
    areaSqYd: 166.6,
    roadFacing: 'North'
  },
  home: {
    floors: 'G+1',
    futureExpansion: 'Yes',
    staircaseType: 'AI decides'
  },
  spaces: {
    selectedSpaces: [
      'Living Room',
      'Dining',
      'Kitchen',
      'Master Bedroom',
      'Bedroom',
      'Puja Room',
      'Balcony',
      'Parking'
    ],
    bedroomsCount: 3,
    attachedBathsCount: 2,
    walkInClosetsCount: 1,
    bathroomsCount: 3,
    kitchenStyle: 'Semi-Open',
    utilityArea: true,
    carParkingCount: 1,
    bikeParkingCount: 2,
    parkingPreference: 'Front'
  },
  lifestyle: {
    priorities: ['Natural Light', 'Cross Ventilation', 'Privacy'],
    vastu: 'Vastu-friendly',
    naturalLight: 'Maximum',
    ventilation: 'Cross Ventilation',
    budget: '₹50–75L',
    aiAutoOptimize: true
  }
};

export interface NakshaState {
  plot: {
    areaSqYd: number | '';
    frontageFt: number | '';
    depthFt: number | '';
    shape: PlotShape;
    importedFromMap: boolean;
    polygon?: [number, number][];
    location?: string;
  };
  floors: string;
  requirements: {
    bedrooms: number;
    bathrooms: number;
    kitchens: number;
    drawingRoom: boolean;
    livingRoom: boolean;
    dining: boolean;
    store: boolean;
    lobby: boolean;
    washingArea: boolean;
    poojaRoom: boolean;
    studyRoom: boolean;
    guestRoom: boolean;
    balcony: boolean;
    garden: boolean;
    parking: string;
    servantRoom: boolean;
    utility: boolean;
  };
  preferences: {
    style: string;
    parkingPriority: PriorityOption;
    openSpacePriority: PriorityOption;
    roomSizePriority: PriorityOption;
    naturalLight: PriorityOption;
    ventilation: PriorityOption;
    futureExpansion: PriorityOption;
    rentalPotential: PriorityOption;
    vastu: VastuOption;
  };
  zones: Record<string, ZoneOption>;
  additionalRequirements: string;
}
