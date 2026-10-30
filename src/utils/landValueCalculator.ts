/**
 * PropWise Land Value & Financial Calculation Suite
 * Stamp Duty, Construction Cost, FAR, Circle Rates, and EMI
 */

import { toSqFt, type UnitId } from './landConversions';

export const RATE_UNITS = [
  { id: 'sqyd', label: 'Per Sq. Yard (Gaj)', shortLabel: 'per Gaj' },
  { id: 'sqft', label: 'Per Sq. Feet', shortLabel: 'per sq.ft' },
  { id: 'sqm', label: 'Per Sq. Metre', shortLabel: 'per sq.m' },
  { id: 'marla', label: 'Per Marla', shortLabel: 'per Marla' },
  { id: 'kanal', label: 'Per Kanal', shortLabel: 'per Kanal' },
  { id: 'acre', label: 'Per Acre / Killa', shortLabel: 'per Acre' },
] as const;

export type RateUnitId = typeof RATE_UNITS[number]['id'];

/**
 * Convert the entered rate to a "per sq.ft" rate.
 */
export function rateToPerSqFt(rate: number, rateUnit: RateUnitId): number {
  const sqftPerUnit = toSqFt(1, rateUnit as UnitId);
  return rate / (sqftPerUnit || 1);
}

/**
 * Convert a per-sq.ft rate to any other rate unit.
 */
export function rateFromPerSqFt(ratePerSqFt: number, toUnit: RateUnitId): number {
  const sqftPerUnit = toSqFt(1, toUnit as UnitId);
  return ratePerSqFt * sqftPerUnit;
}

/**
 * Calculate total land value.
 */
export function calculateLandValue(
  area: number,
  areaUnit: UnitId,
  rate: number,
  rateUnit: RateUnitId
): number {
  const areaSqFt = toSqFt(area, areaUnit);
  const ratePerSqFt = rateToPerSqFt(rate, rateUnit);
  return areaSqFt * ratePerSqFt;
}

/**
 * Format Indian currency value with crore/lakh breakdown.
 */
export function formatINR(value: number): string {
  if (isNaN(value) || value === 0) return '₹0';
  return '₹' + Math.round(value).toLocaleString('en-IN');
}

export function formatINRCompact(value: number): string {
  if (isNaN(value) || value === 0) return '₹0';
  if (value >= 1_00_00_000) {
    return `₹${(value / 1_00_00_000).toFixed(2)} Cr`;
  }
  if (value >= 1_00_000) {
    return `₹${(value / 1_00_00_000).toFixed(2)} Lakh`;
  }
  return formatINR(value);
}

export function formatRate(rate: number): string {
  if (isNaN(rate) || rate === 0) return '₹0';
  if (rate >= 1000) return '₹' + Math.round(rate).toLocaleString('en-IN');
  if (rate >= 1) return '₹' + rate.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  return '₹' + rate.toLocaleString('en-IN', { maximumFractionDigits: 4 });
}

export interface RateComparison {
  unit: RateUnitId;
  label: string;
  shortLabel: string;
  rate: number;
}

/** Returns rate in all units from a per-sq.ft base rate */
export function calculateRateComparisons(
  rate: number,
  rateUnit: RateUnitId
): RateComparison[] {
  const perSqFt = rateToPerSqFt(rate, rateUnit);
  return RATE_UNITS.map(u => ({
    unit: u.id,
    label: u.label,
    shortLabel: u.shortLabel,
    rate: rateFromPerSqFt(perSqFt, u.id),
  }));
}

/* ─── State Stamp Duty & Registration Data ──────────────────────── */

export interface StateStampDutyInfo {
  state: string;
  maleRate: number;    // percentage, e.g. 7 for 7%
  femaleRate: number;
  jointRate: number;
  regFeePercent: number; // usually 1%
  mutationFeeFixed: number;
  cessPercent: number;
  note: string;
}

export const STATE_STAMP_DUTIES: Record<string, StateStampDutyInfo> = {
  'punjab': {
    state: 'Punjab',
    maleRate: 7,
    femaleRate: 6,
    jointRate: 6.5,
    regFeePercent: 1,
    mutationFeeFixed: 1500,
    cessPercent: 1,
    note: 'Punjab charges 6% stamp duty + 1% Social Security Fund + 1% registration fee.',
  },
  'haryana': {
    state: 'Haryana',
    maleRate: 7,
    femaleRate: 5,
    jointRate: 6,
    regFeePercent: 1,
    mutationFeeFixed: 2000,
    cessPercent: 0,
    note: 'Haryana offers 2% discount for female sole owners in urban areas.',
  },
  'delhi': {
    state: 'Delhi NCR',
    maleRate: 6,
    femaleRate: 4,
    jointRate: 5,
    regFeePercent: 1,
    mutationFeeFixed: 1000,
    cessPercent: 0,
    note: 'Delhi offers 2% rebate for female owners, 1% fixed registration charge.',
  },
  'uttar_pradesh': {
    state: 'Uttar Pradesh',
    maleRate: 7,
    femaleRate: 6,
    jointRate: 6.5,
    regFeePercent: 1,
    mutationFeeFixed: 2500,
    cessPercent: 0,
    note: 'UP offers ₹10,000 rebate on stamp duty for female owners.',
  },
  'maharashtra': {
    state: 'Maharashtra',
    maleRate: 6,
    femaleRate: 5,
    jointRate: 5.5,
    regFeePercent: 1,
    mutationFeeFixed: 1000,
    cessPercent: 1, // Metro cess
    note: 'Includes 1% Metro Cess in major municipal corporations (Mumbai/Pune).',
  },
  'rajasthan': {
    state: 'Rajasthan',
    maleRate: 6,
    femaleRate: 5,
    jointRate: 5.5,
    regFeePercent: 1,
    mutationFeeFixed: 1200,
    cessPercent: 0.5,
    note: '1% registration fee capped at ₹4 Lakhs + 0.5% surcharge.',
  },
  'karnataka': {
    state: 'Karnataka',
    maleRate: 5,
    femaleRate: 5,
    jointRate: 5,
    regFeePercent: 1,
    mutationFeeFixed: 1500,
    cessPercent: 1.1, // 10% cess on stamp duty
    note: '5% stamp duty + 10% cess on stamp duty + 2% surcharges in Bangalore BBMP.',
  },
  'gujarat': {
    state: 'Gujarat',
    maleRate: 4.9,
    femaleRate: 4.9,
    jointRate: 4.9,
    regFeePercent: 1,
    mutationFeeFixed: 800,
    cessPercent: 0,
    note: 'Female buyers are exempt from registration fee in Gujarat.',
  },
  'chandigarh': {
    state: 'Chandigarh (UT)',
    maleRate: 6,
    femaleRate: 6,
    jointRate: 6,
    regFeePercent: 1,
    mutationFeeFixed: 1000,
    cessPercent: 0,
    note: 'Uniform 6% stamp duty + 1% registration charge across Chandigarh UT.',
  },
  'himachal_pradesh': {
    state: 'Himachal Pradesh',
    maleRate: 5,
    femaleRate: 4,
    jointRate: 4.5,
    regFeePercent: 1,
    mutationFeeFixed: 1500,
    cessPercent: 0,
    note: '1% rebate on stamp duty for female sole property registrations.',
  },
  'uttarakhand': {
    state: 'Uttarakhand',
    maleRate: 5,
    femaleRate: 3.75,
    jointRate: 4.375,
    regFeePercent: 2,
    mutationFeeFixed: 1500,
    cessPercent: 0,
    note: 'Uttarakhand offers a 25% discount on stamp duty (3.75%) for women buyers.',
  },
  'madhya_pradesh': {
    state: 'Madhya Pradesh',
    maleRate: 7.5,
    femaleRate: 7.5,
    jointRate: 7.5,
    regFeePercent: 1,
    mutationFeeFixed: 1500,
    cessPercent: 0,
    note: 'MP charges 7.5% stamp duty + 1% registration fee (Total 8.5% in urban limits).',
  },
  'west_bengal': {
    state: 'West Bengal',
    maleRate: 6,
    femaleRate: 6,
    jointRate: 6,
    regFeePercent: 1,
    mutationFeeFixed: 1000,
    cessPercent: 0,
    note: '6% in municipal areas / 5% in rural panchayat areas.',
  },
  'bihar': {
    state: 'Bihar',
    maleRate: 6,
    femaleRate: 5.7,
    jointRate: 5.85,
    regFeePercent: 2,
    mutationFeeFixed: 2000,
    cessPercent: 0,
    note: 'Bihar offers 5.7% concession rate for women + 2% registration.',
  },
  'telangana': {
    state: 'Telangana',
    maleRate: 5.5,
    femaleRate: 5.5,
    jointRate: 5.5,
    regFeePercent: 0.5,
    mutationFeeFixed: 1000,
    cessPercent: 1.5, // Transfer duty
    note: '5.5% stamp duty + 1.5% transfer duty + 0.5% registration fee (Total 7.5%).',
  },
  'andhra_pradesh': {
    state: 'Andhra Pradesh',
    maleRate: 5,
    femaleRate: 5,
    jointRate: 5,
    regFeePercent: 1,
    mutationFeeFixed: 1000,
    cessPercent: 1.5,
    note: '5% stamp duty + 1.5% transfer duty + 1% registration charge.',
  },
  'kerala': {
    state: 'Kerala',
    maleRate: 8,
    femaleRate: 8,
    jointRate: 8,
    regFeePercent: 2,
    mutationFeeFixed: 2000,
    cessPercent: 0,
    note: 'Kerala charges 8% stamp duty + 2% registration fee (Total 10%).',
  },
};

export type OwnershipType = 'male' | 'female' | 'joint';

export interface StampDutyCalculation {
  stampDutyPercent: number;
  stampDutyAmount: number;
  regFeePercent: number;
  regFeeAmount: number;
  cessAmount: number;
  mutationFee: number;
  totalGovtFees: number;
  stateInfo: StateStampDutyInfo;
}

export function calculateStampDuty(
  propertyValue: number,
  stateKey: string,
  ownership: OwnershipType
): StampDutyCalculation {
  const stateInfo = STATE_STAMP_DUTIES[stateKey] || STATE_STAMP_DUTIES['punjab'];
  
  let stampDutyPercent = stateInfo.maleRate;
  if (ownership === 'female') stampDutyPercent = stateInfo.femaleRate;
  else if (ownership === 'joint') stampDutyPercent = stateInfo.jointRate;

  const stampDutyAmount = (propertyValue * stampDutyPercent) / 100;
  const regFeePercent = (stateKey === 'gujarat' && ownership === 'female') ? 0 : stateInfo.regFeePercent;
  const regFeeAmount = (propertyValue * regFeePercent) / 100;
  const cessAmount = (propertyValue * stateInfo.cessPercent) / 100;
  const mutationFee = stateInfo.mutationFeeFixed;
  const totalGovtFees = stampDutyAmount + regFeeAmount + cessAmount + mutationFee;

  return {
    stampDutyPercent,
    stampDutyAmount,
    regFeePercent,
    regFeeAmount,
    cessAmount,
    mutationFee,
    totalGovtFees,
    stateInfo,
  };
}

/* ─── FAR & Construction Cost Engine ─────────────────────────────── */

export interface ConstructionTier {
  id: string;
  name: string;
  ratePerSqFt: number;
  description: string;
  materials: {
    steelPct: number;
    cementPct: number;
    brickSandPct: number;
    finishingPct: number;
    laborPct: number;
  };
}

export const CONSTRUCTION_TIERS: ConstructionTier[] = [
  {
    id: 'basic',
    name: 'Economy / Standard',
    ratePerSqFt: 1650,
    description: 'Good quality standard RCC structure, local branded tiles, standard CP fittings, modular electricals.',
    materials: { steelPct: 24, cementPct: 16, brickSandPct: 14, finishingPct: 26, laborPct: 20 },
  },
  {
    id: 'premium',
    name: 'Premium Deluxe',
    ratePerSqFt: 2500,
    description: 'Fe550D TMT steel, Ultratech/ACC, double-glazed UPVC windows, Jaquar/Kohler, Italian tile accents, false ceilings.',
    materials: { steelPct: 22, cementPct: 15, brickSandPct: 12, finishingPct: 31, laborPct: 20 },
  },
  {
    id: 'luxury',
    name: 'Ultra-Luxury Villa',
    ratePerSqFt: 3800,
    description: 'Imported Italian marble, full home automation, VRV/VRF AC conduits, Grohe/Hansgrohe fittings, landscaped terrace & solar.',
    materials: { steelPct: 20, cementPct: 13, brickSandPct: 10, finishingPct: 37, laborPct: 20 },
  },
  {
    id: 'commercial',
    name: 'Commercial / SCO',
    ratePerSqFt: 2900,
    description: 'Heavy structural loads, glass curtain façade, high-traffic commercial flooring, central lift shaft & fire safety compliance.',
    materials: { steelPct: 28, cementPct: 18, brickSandPct: 10, finishingPct: 24, laborPct: 20 },
  },
];

export interface FARCalculation {
  plotAreaSqFt: number;
  far: number;
  groundCoveragePct: number;
  maxGroundCoverageSqFt: number;
  permissibleBuiltUpSqFt: number;
  openSpaceSqFt: number;
  floorsCount: number;
  estimatedConstructionCost: number;
  tier: ConstructionTier;
}

export function calculateFARAndCost(
  plotAreaSqFt: number,
  far: number = 2.0,
  groundCoveragePct: number = 70,
  tierId: string = 'premium',
  floors: number = 3
): FARCalculation {
  const maxGroundCoverageSqFt = (plotAreaSqFt * groundCoveragePct) / 100;
  const permissibleBuiltUpSqFt = plotAreaSqFt * far;
  const openSpaceSqFt = Math.max(0, plotAreaSqFt - maxGroundCoverageSqFt);
  const tier = CONSTRUCTION_TIERS.find(t => t.id === tierId) || CONSTRUCTION_TIERS[1];
  const estimatedConstructionCost = permissibleBuiltUpSqFt * tier.ratePerSqFt;

  return {
    plotAreaSqFt,
    far,
    groundCoveragePct,
    maxGroundCoverageSqFt,
    permissibleBuiltUpSqFt,
    openSpaceSqFt,
    floorsCount: floors,
    estimatedConstructionCost,
    tier,
  };
}

/* ─── Loan & EMI Financial Calculations ──────────────────────────── */

export interface LoanCalculation {
  totalPrice: number;
  downPaymentPct: number;
  downPaymentAmount: number;
  principal: number;
  annualInterestRate: number;
  tenureYears: number;
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
}

export function calculatePlotLoan(
  totalPrice: number,
  downPaymentPct: number = 25,
  annualInterestRate: number = 8.75,
  tenureYears: number = 20
): LoanCalculation {
  const downPaymentAmount = (totalPrice * downPaymentPct) / 100;
  const principal = Math.max(0, totalPrice - downPaymentAmount);
  const monthlyRate = (annualInterestRate / 12) / 100;
  const totalMonths = tenureYears * 12;

  let monthlyEmi = 0;
  if (principal > 0 && monthlyRate > 0) {
    monthlyEmi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  } else if (principal > 0) {
    monthlyEmi = principal / totalMonths;
  }

  const totalPayment = (monthlyEmi * totalMonths) + downPaymentAmount;
  const totalInterest = Math.max(0, (monthlyEmi * totalMonths) - principal);

  return {
    totalPrice,
    downPaymentPct,
    downPaymentAmount,
    principal,
    annualInterestRate,
    tenureYears,
    monthlyEmi: Math.round(monthlyEmi),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
  };
}
