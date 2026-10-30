// Types for India-wide Construction Cost Estimator

export type ConstructionQualityTier = 'basic' | 'standard' | 'premium' | 'luxury';

export type RateResolutionLevel =
  | 'Colony'
  | 'Locality'
  | 'City'
  | 'Regional'
  | 'National Baseline';

export type ConfidenceIndicator = 'High' | 'Medium' | 'Baseline';

export interface QualityTierRates {
  minRatePerSqFt: number;
  maxRatePerSqFt: number;
  description: string;
  keySpecs: string[];
}

export interface ColonyRateRecord {
  id: string;
  state: string;
  districtOrCity: string;
  locality?: string;
  colonyOrSector?: string;
  level: RateResolutionLevel;
  confidence: ConfidenceIndicator;
  lastUpdated: string;
  sourceMethodology: string;
  tiers: Record<ConstructionQualityTier, QualityTierRates>;
  localLabourIndex: number; // multiplier, 1.0 = national average
  materialLogisticsIndex: number;
  soilFoundationComplexity: 'Low' | 'Medium' | 'High';
}

export interface CostBreakdownItem {
  id: string;
  category: string;
  subTitle: string;
  percentage: number;
  minAmount: number;
  maxAmount: number;
  materialDetails: string;
}

export interface ConstructionInputParams {
  plotAreaValue: number;
  plotAreaUnit: 'sqft' | 'sqyd' | 'marla' | 'kanal' | 'bigha' | 'acre';
  builtUpAreaSqFt: number;
  floorsCount: number;
  hasBasement: 'none' | 'partial' | 'full';
  qualityTier: ConstructionQualityTier;
  state: string;
  city: string;
  locality?: string;
  colonyOrSector?: string;
  customPreferences?: {
    flooringType?: 'vitrified' | 'marble' | 'granite' | 'wooden';
    kitchenType?: 'semi_modular' | 'premium_modular' | 'luxury_imported';
    bathFittingTier?: 'standard' | 'premium' | 'luxury';
    smartHome?: boolean;
    solarPanels?: boolean;
    elevationCladding?: boolean;
  };
}

export interface ConstructionCostEstimate {
  locationLabel: string;
  resolvedLevel: RateResolutionLevel;
  confidence: ConfidenceIndicator;
  lastUpdated: string;
  sourceMethodology: string;
  builtUpAreaSqFt: number;
  plotAreaSqFt: number;
  floorsCount: number;
  selectedTier: ConstructionQualityTier;
  
  // Rate range for selected tier
  minRatePerSqFt: number;
  maxRatePerSqFt: number;
  avgRatePerSqFt: number;

  // Cost range for selected tier
  minEstimatedCost: number;
  maxEstimatedCost: number;
  avgEstimatedCost: number;

  // Comparison across all 4 tiers
  allTiersComparison: Record<ConstructionQualityTier, {
    name: string;
    badgeColor: string;
    minCost: number;
    maxCost: number;
    minRate: number;
    maxRate: number;
    formattedRange: string;
    formattedRateRange: string;
    description: string;
    specs: string[];
  }>;

  // Detailed 15-Item Cost Breakdown
  breakdown: CostBreakdownItem[];

  // Disclaimer
  disclaimer: string;
}
