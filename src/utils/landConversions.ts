/**
 * PropWise Land Unit Conversion & Geometry Utilities
 * Comprehensive Indian & International Real Estate Units
 */

export const UNITS = [
  { id: 'sqyd', label: 'Square Yard (Gaj)', shortLabel: 'Gaj', region: 'North/Central India' },
  { id: 'sqft', label: 'Square Feet', shortLabel: 'sq.ft', region: 'Standard Global' },
  { id: 'sqm', label: 'Square Metre', shortLabel: 'sq.m', region: 'SI Standard' },
  { id: 'marla', label: 'Marla (Standard)', shortLabel: 'Marla', region: 'North India' },
  { id: 'marla_pb', label: 'Marla (Punjab/Haryana)', shortLabel: 'Marla (PB)', region: 'Punjab / HR' },
  { id: 'kanal', label: 'Kanal', shortLabel: 'Kanal', region: 'Punjab / HR / J&K' },
  { id: 'bigha_pu', label: 'Bigha (Pukka/Standard)', shortLabel: 'Bigha', region: 'UP / Bihar / MP' },
  { id: 'bigha_pb', label: 'Bigha (Punjab/Haryana)', shortLabel: 'Bigha (PB)', region: 'Punjab / HR' },
  { id: 'biswa', label: 'Biswa (1/20 Bigha)', shortLabel: 'Biswa', region: 'North India' },
  { id: 'guntha', label: 'Guntha', shortLabel: 'Guntha', region: 'MH / KA / GJ' },
  { id: 'ground', label: 'Ground', shortLabel: 'Ground', region: 'Tamil Nadu' },
  { id: 'cent', label: 'Cent', shortLabel: 'Cent', region: 'Kerala / TN / AP' },
  { id: 'ankanam', label: 'Ankanam', shortLabel: 'Ankanam', region: 'Andhra Pradesh' },
  { id: 'acre', label: 'Acre / Killa', shortLabel: 'Acre', region: 'Global / India' },
  { id: 'hectare', label: 'Hectare', shortLabel: 'Hectare', region: 'Metric Global' },
] as const;

export type UnitId = typeof UNITS[number]['id'];

/** Exact conversion factors: how many sq.ft in 1 of each unit */
export const SQ_FT_PER_UNIT: Record<UnitId, number> = {
  sqft: 1,
  sqyd: 9,                     // 1 Gaj = 9 sq.ft
  sqm: 10.7639104,             // 1 sq.m ≈ 10.7639 sq.ft
  marla: 225,                  // Standard 25 sq.yd = 225 sq.ft
  marla_pb: 272.25,            // Punjab/Haryana standard (30.25 sq.yd)
  kanal: 5445,                 // 20 Marlas (Punjab standard)
  bigha_pu: 27225,             // 1 Pukka Bigha = 27,225 sq.ft (3,025 sq.yd)
  bigha_pb: 21780,             // Punjab/Haryana Bigha = 4 Kanals = 21,780 sq.ft
  biswa: 1361.25,              // 1/20 of Bigha (Punjab = 1,089 sq.ft, Standard = 1,361.25 sq.ft)
  guntha: 1089,                // Maharashtra / Karnataka / Gujarat = 121 sq.yd = 1,089 sq.ft
  ground: 2400,                // Tamil Nadu standard = 2,400 sq.ft
  cent: 435.6,                 // 1/100 of an Acre = 435.6 sq.ft
  ankanam: 72,                 // Andhra Pradesh = 8 sq.yd = 72 sq.ft
  acre: 43560,                 // 1 Acre = 4,840 sq.yd = 43,560 sq.ft
  hectare: 107639.104,         // 10,000 sq.m = 107,639.1 sq.ft
};

/** Convert value from any unit to sq.ft (base) */
export function toSqFt(value: number, fromUnit: UnitId): number {
  const factor = SQ_FT_PER_UNIT[fromUnit] ?? 1;
  return value * factor;
}

/** Convert sq.ft (base) to any unit */
export function fromSqFt(sqft: number, toUnit: UnitId): number {
  const factor = SQ_FT_PER_UNIT[toUnit] ?? 1;
  return sqft / factor;
}

/** Convert value from any unit to any other unit */
export function convertUnit(value: number, fromUnit: UnitId, toUnit: UnitId): number {
  if (fromUnit === toUnit) return value;
  const sqft = toSqFt(value, fromUnit);
  return fromSqFt(sqft, toUnit);
}

export interface ConversionResult {
  unit: UnitId;
  label: string;
  shortLabel: string;
  region: string;
  value: number;
}

/** Calculate all unit conversions from a given value + unit */
export function calculateAllConversions(value: number, fromUnit: UnitId): ConversionResult[] {
  if (isNaN(value) || value <= 0) return [];
  const sqft = toSqFt(value, fromUnit);
  return UNITS.map(u => ({
    unit: u.id,
    label: u.label,
    shortLabel: u.shortLabel,
    region: u.region,
    value: fromSqFt(sqft, u.id),
  }));
}

/** Format a number for display */
export function formatArea(value: number): string {
  if (isNaN(value) || value === 0) return '0';
  if (value >= 10000) return value.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  if (value >= 100) return value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  if (value >= 1) return value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  return value.toLocaleString('en-IN', { maximumFractionDigits: 4 });
}

export function getUnitLabel(id: UnitId): string {
  return UNITS.find(u => u.id === id)?.label ?? id;
}

export function getUnitShortLabel(id: UnitId): string {
  return UNITS.find(u => u.id === id)?.shortLabel ?? id;
}

/** Popular Indian Plot Presets */
export interface PlotPreset {
  id: string;
  name: string;
  gaj: number;
  frontageFt: number;
  depthFt: number;
  category: 'Popular' | 'Standard' | 'Luxury' | 'Estate';
  description: string;
}

export const POPULAR_PLOT_PRESETS: PlotPreset[] = [
  { id: '100gaj', name: '100 Gaj (4 Marla)', gaj: 100, frontageFt: 20, depthFt: 45, category: 'Popular', description: 'Compact 2-3 BHK Townhouse' },
  { id: '150gaj', name: '150 Gaj (6 Marla)', gaj: 150, frontageFt: 25, depthFt: 54, category: 'Popular', description: 'Standard 3-4 BHK Family House' },
  { id: '200gaj', name: '200 Gaj (8 Marla)', gaj: 200, frontageFt: 30, depthFt: 60, category: 'Standard', description: 'Spacious Independent Villa Plot' },
  { id: '250gaj', name: '250 Gaj (10 Marla)', gaj: 250, frontageFt: 35, depthFt: 64.3, category: 'Standard', description: 'Luxury Bungalow / Stilt+4 Floors' },
  { id: '350gaj', name: '350 Gaj (14 Marla)', gaj: 350, frontageFt: 40, depthFt: 78.75, category: 'Luxury', description: 'Grand Corner / Premium Mansion' },
  { id: '500gaj', name: '500 Gaj (1 Kanal)', gaj: 500, frontageFt: 50, depthFt: 90, category: 'Luxury', description: '1 Kanal Estate Plot with Lawn' },
  { id: '1000gaj', name: '1000 Gaj (2 Kanal)', gaj: 1000, frontageFt: 60, depthFt: 150, category: 'Estate', description: '2 Kanal Luxury Estate with Pool' },
  { id: '1acre', name: '1 Acre Farmhouse', gaj: 4840, frontageFt: 150, depthFt: 290.4, category: 'Estate', description: '1 Acre Agricultural / Farmhouse' },
];

/** Polygon 2D Point interface */
export interface Point2D {
  x: number;
  y: number;
}

/**
 * Calculate polygon area using Shoelace formula (Gauss's area formula)
 * Coordinates should be in feet or uniform metric units.
 */
export function calculatePolygonArea(vertices: Point2D[]): number {
  const n = vertices.length;
  if (n < 3) return 0;
  let area = 0;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += vertices[i].x * vertices[j].y;
    area -= vertices[j].x * vertices[i].y;
  }
  return Math.abs(area) / 2;
}

/**
 * Calculate perimeter of polygon
 */
export function calculatePolygonPerimeter(vertices: Point2D[]): number {
  const n = vertices.length;
  if (n < 2) return 0;
  let perimeter = 0;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const dx = vertices[j].x - vertices[i].x;
    const dy = vertices[j].y - vertices[i].y;
    perimeter += Math.sqrt(dx * dx + dy * dy);
  }
  return perimeter;
}

/**
 * Calculate distance between two 2D points
 */
export function getDistance(p1: Point2D, p2: Point2D): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Trapezoid Area Calculation (Tapered Plots)
 * A = ((front + rear) / 2) * depth (or avg depth if left/right differ)
 */
export function calculateTrapezoidArea(
  front: number,
  rear: number,
  depthLeft: number,
  depthRight: number
): { area: number; perimeter: number } {
  const avgWidth = (front + rear) / 2;
  const avgDepth = (depthLeft + depthRight) / 2;
  const area = avgWidth * avgDepth;
  // Side lengths: front, rear, depthLeft, depthRight (approx perimeter)
  const perimeter = front + rear + depthLeft + depthRight;
  return { area, perimeter };
}

/**
 * L-Shaped Plot Area
 * (front * depth) - (cutoutWidth * cutoutDepth)
 */
export function calculateLShapedArea(
  front: number,
  depth: number,
  cutoutWidth: number,
  cutoutDepth: number
): { area: number; perimeter: number } {
  const mainArea = front * depth;
  const cutArea = Math.max(0, cutoutWidth * cutoutDepth);
  const area = Math.max(0, mainArea - cutArea);
  const perimeter = (front + depth) * 2; // Perimeter remains similar or (front + depth + (front-cw) + (depth-cd) + cw + cd)
  return { area, perimeter };
}

/**
 * Triangular Plot Area using Heron's formula
 */
export function calculateTriangleArea(
  a: number,
  b: number,
  c: number
): { area: number; perimeter: number; isValid: boolean } {
  if (a + b <= c || a + c <= b || b + c <= a) {
    return { area: 0, perimeter: a + b + c, isValid: false };
  }
  const s = (a + b + c) / 2;
  const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
  return { area, perimeter: a + b + c, isValid: true };
}

/** Vastu Directions and Auspiciousness */
export type DirectionFacing = 'North' | 'North-East' | 'East' | 'South-East' | 'South' | 'South-West' | 'West' | 'North-West';

export interface VastuDetails {
  facing: DirectionFacing;
  score: number; // 0 - 100
  title: string;
  auspiciousness: 'Highly Auspicious' | 'Auspicious' | 'Neutral' | 'Challenging';
  color: string;
  governingPlanet: string;
  deity: string;
  element: string;
  tips: {
    mainGate: string;
    masterBedroom: string;
    kitchen: string;
    poojaRoom: string;
    waterTank: string;
  };
}

export const VASTU_DATA: Record<DirectionFacing, VastuDetails> = {
  'North': {
    facing: 'North',
    score: 95,
    title: 'Kubera (Wealth & Prosperity)',
    auspiciousness: 'Highly Auspicious',
    color: '#10B981',
    governingPlanet: 'Mercury (Budh)',
    deity: 'Lord Kubera',
    element: 'Water',
    tips: {
      mainGate: 'Place the main entrance in 3rd, 4th, or 5th pada (North to NE quadrant) for continuous financial influx.',
      masterBedroom: 'Best placed in South-West (Nairutya) to anchor stability and authority.',
      kitchen: 'Position in South-East (Agneya) fire corner; never in North-East.',
      poojaRoom: 'Ideal in North-East (Ishanya) corner with ample natural morning light.',
      waterTank: 'Underground water storage or borewell in North-East brings auspicious prosperity.',
    },
  },
  'North-East': {
    facing: 'North-East',
    score: 98,
    title: 'Ishanya (Spiritual & Mental Growth)',
    auspiciousness: 'Highly Auspicious',
    color: '#059669',
    governingPlanet: 'Jupiter (Brihaspati)',
    deity: 'Lord Shiva / Ishana',
    element: 'Water / Ether',
    tips: {
      mainGate: 'Prime entrance zone. Keep open, clean, uncluttered and brightly lit.',
      masterBedroom: 'Keep South-West. Never place master bedroom or heavy storage in NE.',
      kitchen: 'Locate strictly in South-East (Agni kon). Kitchen in NE causes mental distress.',
      poojaRoom: 'Supreme location for Mandir / Meditation center.',
      waterTank: 'Rainwater harvesting and underground reservoir in NE maximize positive cosmic vibes.',
    },
  },
  'East': {
    facing: 'East',
    score: 92,
    title: 'Surya (Health, Energy & Fame)',
    auspiciousness: 'Highly Auspicious',
    color: '#10B981',
    governingPlanet: 'Sun (Surya)',
    deity: 'Lord Indra',
    element: 'Air / Fire',
    tips: {
      mainGate: 'Placing the entry in the Jayanta or Indra padas (East side) invites fame and social stature.',
      masterBedroom: 'South-West corner gives commanding presence and peaceful sleep.',
      kitchen: 'South-East or North-West quadrant.',
      poojaRoom: 'North-East quadrant ensures divine morning rays.',
      waterTank: 'Borewell in East or NE.',
    },
  },
  'South-East': {
    facing: 'South-East',
    score: 74,
    title: 'Agneya (Energy & Passion)',
    auspiciousness: 'Neutral',
    color: '#F59E0B',
    governingPlanet: 'Venus (Shukra)',
    deity: 'Lord Agni',
    element: 'Fire',
    tips: {
      mainGate: 'If facing SE, place entrance closer to East side and keep a Vastu copper pyramid/swastik.',
      masterBedroom: 'South-West or South direction.',
      kitchen: 'Natural prime corner for kitchen & hearth.',
      poojaRoom: 'Keep in East or North-East.',
      waterTank: 'Overhead tank in South-West. Strictly avoid water bodies in South-East.',
    },
  },
  'South': {
    facing: 'South',
    score: 72,
    title: 'Yama (Fame & Administration)',
    auspiciousness: 'Neutral',
    color: '#F59E0B',
    governingPlanet: 'Mars (Mangal)',
    deity: 'Lord Yama',
    element: 'Earth / Fire',
    tips: {
      mainGate: 'Place main gate strictly in 3rd or 4th pada (Grihakshata or Vitatha). Avoid SW corner entry.',
      masterBedroom: 'South-West corner with thickest walls on the South/West sides.',
      kitchen: 'South-East corner.',
      poojaRoom: 'North-East zone, ensuring facing East or North while praying.',
      waterTank: 'Overhead water tank on South-West roof helps balance energy.',
    },
  },
  'South-West': {
    facing: 'South-West',
    score: 65,
    title: 'Nairutya (Stability & Grounding)',
    auspiciousness: 'Challenging',
    color: '#EF4444',
    governingPlanet: 'Rahu',
    deity: 'Nirriti',
    element: 'Earth',
    tips: {
      mainGate: 'Avoid SW entrance if possible. If unavoidable, use lead energy stabilizers and offset entry toward West/South.',
      masterBedroom: 'Perfect for Master Bedroom — heaviest furniture and master suite.',
      kitchen: 'Strictly in South-East.',
      poojaRoom: 'North-East or North quadrant.',
      waterTank: 'Overhead storage tank in SW gives required physical weight and grounding.',
    },
  },
  'West': {
    facing: 'West',
    score: 82,
    title: 'Varuna (Gains & Social Network)',
    auspiciousness: 'Auspicious',
    color: '#3B82F6',
    governingPlanet: 'Saturn (Shani)',
    deity: 'Lord Varuna',
    element: 'Water / Air',
    tips: {
      mainGate: 'Entrance in Pushpadanta or Sugriva pada (3rd/4th quadrant) brings high prosperity.',
      masterBedroom: 'South-West corner.',
      kitchen: 'South-East or North-West.',
      poojaRoom: 'North-East zone.',
      waterTank: 'Overhead tank in West/South-West.',
    },
  },
  'North-West': {
    facing: 'North-West',
    score: 78,
    title: 'Vayavya (Movement & Relationships)',
    auspiciousness: 'Auspicious',
    color: '#6366F1',
    governingPlanet: 'Moon (Chandra)',
    deity: 'Lord Vayu',
    element: 'Air',
    tips: {
      mainGate: 'Place entry slightly toward North side of NW for continuous positive mobility.',
      masterBedroom: 'South-West zone.',
      kitchen: 'South-East (Primary) or North-West (Secondary).',
      poojaRoom: 'North-East quadrant.',
      waterTank: 'Overhead tank in SW; avoid underground storage directly in NW.',
    },
  },
};

