import type { NakshaConfiguration } from './types';

export interface ArchitecturalDoor {
  id: string;
  wall: 'top' | 'bottom' | 'left' | 'right';
  posPercent: number; // 0 to 100% along the wall
  widthFt: number;
  swing: 'in-left' | 'in-right' | 'out-left' | 'out-right';
}

export interface ArchitecturalWindow {
  id: string;
  wall: 'top' | 'bottom' | 'left' | 'right';
  posPercent: number;
  widthFt: number;
}

export interface ArchitecturalFixture {
  type: 
    | 'bed_king'
    | 'bed_queen'
    | 'wardrobe'
    | 'sofa_sectional'
    | 'coffee_table'
    | 'tv_unit'
    | 'dining_table'
    | 'kitchen_counter_l'
    | 'kitchen_hob'
    | 'kitchen_sink'
    | 'toilet_wc'
    | 'wash_basin'
    | 'shower_stall'
    | 'car_sedan'
    | 'staircase'
    | 'mandir_altar';
  x: number; // percent within room
  y: number; // percent within room
  w: number; // percent width
  h: number; // percent height
  rot?: number;
}

export interface ArchitecturalRoom {
  id: string;
  name: string;
  category: 'master_bedroom' | 'bedroom' | 'living' | 'dining' | 'kitchen' | 'bathroom' | 'puja' | 'staircase' | 'parking' | 'garden' | 'balcony' | 'utility';
  x: number;      // % of plot interior
  y: number;      // % of plot interior
  width: number;  // % width
  height: number; // % height
  dimW_ft: number;
  dimH_ft: number;
  areaSqFt: number;
  doors: ArchitecturalDoor[];
  windows: ArchitecturalWindow[];
  fixtures: ArchitecturalFixture[];
  specs: {
    naturalLight: string;
    privacy: string;
    ventilation: string;
    vastuZone?: string;
  };
}

export interface ArchitecturalPlan {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  score: number;
  builtUpAreaSqFt: number;
  carpetAreaSqFt: number;
  coveragePercent: number;
  scoreBreakdown: {
    spaceEfficiency: number;
    naturalLight: number;
    ventilation: number;
    circulation: number;
    privacy: number;
    parking: number;
  };
  highlights: string[];
  setbacks: {
    frontFt: number;
    rearFt: number;
    leftFt: number;
    rightFt: number;
  };
  rooms: ArchitecturalRoom[];
}

export function buildArchitecturalPlans(config: NakshaConfiguration, modifier?: string): ArchitecturalPlan[] {
  const { plot, spaces, home } = config;
  const frontage = plot.frontageFt || 30;
  const depth = plot.depthFt || 50;
  const isMultiFloor = home.floors !== 'Single Floor';
  const hasParking = spaces.carParkingCount > 0;

  const totalPlotArea = frontage * depth;
  const isEnlargedMaster = modifier?.toLowerCase().includes('master bedroom');
  const isEnlargedLiving = modifier?.toLowerCase().includes('living');
  const isExtraBath = modifier?.toLowerCase().includes('bathroom');
  const isEnlargedParking = modifier?.toLowerCase().includes('parking');

  // Master bedroom dimensions
  const mbW = isEnlargedMaster ? 16 : 14;
  const mbH = isEnlargedMaster ? 14 : 12;

  // ─────────────────────────────────────────────────────────────────────────────
  // OPTION 1: BALANCED FLOW (Best Overall Circulation & Natural Light)
  // ─────────────────────────────────────────────────────────────────────────────
  const roomsOpt1: ArchitecturalRoom[] = [
    // 1. Master Suite (Rear Left)
    {
      id: 'r1',
      name: 'MASTER BEDROOM',
      category: 'master_bedroom',
      x: 3,
      y: 3,
      width: 44,
      height: 30,
      dimW_ft: mbW,
      dimH_ft: mbH,
      areaSqFt: mbW * mbH,
      doors: [
        { id: 'd1', wall: 'bottom', posPercent: 75, widthFt: 3, swing: 'in-left' },
        { id: 'd2', wall: 'right', posPercent: 30, widthFt: 2.5, swing: 'in-right' }
      ],
      windows: [
        { id: 'w1', wall: 'top', posPercent: 50, widthFt: 5 },
        { id: 'w2', wall: 'left', posPercent: 40, widthFt: 4 }
      ],
      fixtures: [
        { type: 'bed_king', x: 20, y: 15, w: 45, h: 50 },
        { type: 'wardrobe', x: 5, y: 70, w: 80, h: 20 }
      ],
      specs: {
        naturalLight: 'Direct Morning Light (NW/North)',
        privacy: 'High (Isolated Private Zone)',
        ventilation: 'Dual-Window Cross Breeze',
        vastuZone: 'South-West Zone'
      }
    },

    // 2. Master Attached Bath
    {
      id: 'r2',
      name: 'M. BATH',
      category: 'bathroom',
      x: 47,
      y: 3,
      width: 18,
      height: 18,
      dimW_ft: 6,
      dimH_ft: 8,
      areaSqFt: 48,
      doors: [
        { id: 'd3', wall: 'left', posPercent: 50, widthFt: 2.5, swing: 'in-left' }
      ],
      windows: [
        { id: 'w3', wall: 'top', posPercent: 50, widthFt: 2.5 }
      ],
      fixtures: [
        { type: 'toilet_wc', x: 20, y: 20, w: 30, h: 35 },
        { type: 'wash_basin', x: 60, y: 20, w: 30, h: 25 },
        { type: 'shower_stall', x: 20, y: 60, w: 60, h: 35 }
      ],
      specs: {
        naturalLight: 'Shaft / O.T.S. Ventilation',
        privacy: 'Ensuite Attached',
        ventilation: 'High-Level Ventilator Window'
      }
    },

    // 3. Bedroom 2 / Kids Room (Rear Right)
    {
      id: 'r3',
      name: spaces.bedroomsCount >= 3 ? 'BEDROOM 02' : 'GUEST SUITE',
      category: 'bedroom',
      x: 65,
      y: 3,
      width: 32,
      height: 30,
      dimW_ft: 11,
      dimH_ft: 13,
      areaSqFt: 143,
      doors: [
        { id: 'd4', wall: 'bottom', posPercent: 30, widthFt: 3, swing: 'in-right' }
      ],
      windows: [
        { id: 'w4', wall: 'top', posPercent: 50, widthFt: 4 },
        { id: 'w5', wall: 'right', posPercent: 50, widthFt: 4 }
      ],
      fixtures: [
        { type: 'bed_queen', x: 25, y: 15, w: 50, h: 55 },
        { type: 'wardrobe', x: 10, y: 75, w: 80, h: 18 }
      ],
      specs: {
        naturalLight: 'North-East Morning Exposure',
        privacy: 'Semi-Private Family Zone',
        ventilation: 'Direct Exterior Airflow'
      }
    },

    // 4. Common Bathroom
    {
      id: 'r4',
      name: isExtraBath ? 'COMMON BATH 2' : 'COMMON BATH',
      category: 'bathroom',
      x: 47,
      y: 21,
      width: 18,
      height: 12,
      dimW_ft: 6,
      dimH_ft: 5,
      areaSqFt: 30,
      doors: [
        { id: 'd5', wall: 'bottom', posPercent: 50, widthFt: 2.5, swing: 'in-left' }
      ],
      windows: [],
      fixtures: [
        { type: 'toilet_wc', x: 20, y: 20, w: 30, h: 40 },
        { type: 'wash_basin', x: 60, y: 20, w: 30, h: 30 }
      ],
      specs: {
        naturalLight: 'Duct Connected',
        privacy: 'Guest & Common Access',
        ventilation: 'Exhaust Shaft'
      }
    },

    // 5. Living & Dining Hall (Central Social Core)
    {
      id: 'r5',
      name: isEnlargedLiving ? 'GRAND LIVING & DINING' : 'LIVING & DINING',
      category: 'living',
      x: 3,
      y: 33,
      width: 60,
      height: 35,
      dimW_ft: 18,
      dimH_ft: 16,
      areaSqFt: 288,
      doors: [
        { id: 'd_main', wall: 'bottom', posPercent: 30, widthFt: 3.5, swing: 'in-left' }
      ],
      windows: [
        { id: 'w6', wall: 'left', posPercent: 30, widthFt: 6 },
        { id: 'w7', wall: 'left', posPercent: 70, widthFt: 5 }
      ],
      fixtures: [
        { type: 'sofa_sectional', x: 10, y: 15, w: 40, h: 45 },
        { type: 'coffee_table', x: 22, y: 30, w: 18, h: 18 },
        { type: 'tv_unit', x: 5, y: 75, w: 35, h: 12 },
        { type: 'dining_table', x: 55, y: 35, w: 38, h: 45 }
      ],
      specs: {
        naturalLight: 'Continuous West-South Daylight',
        privacy: 'Social Foyer & Lounge',
        ventilation: 'Cross Breezeway Through Courtyard',
        vastuZone: 'Brahmasthan Harmony'
      }
    },

    // 6. Kitchen & Utility (South-East Agni Zone)
    {
      id: 'r6',
      name: 'KITCHEN & UTILITY',
      category: 'kitchen',
      x: 63,
      y: 33,
      width: 34,
      height: 35,
      dimW_ft: 10,
      dimH_ft: 12,
      areaSqFt: 120,
      doors: [
        { id: 'd6', wall: 'left', posPercent: 40, widthFt: 3, swing: 'in-left' },
        { id: 'd7', wall: 'right', posPercent: 70, widthFt: 2.5, swing: 'out-right' }
      ],
      windows: [
        { id: 'w8', wall: 'right', posPercent: 30, widthFt: 5 }
      ],
      fixtures: [
        { type: 'kitchen_counter_l', x: 20, y: 10, w: 70, h: 80 },
        { type: 'kitchen_hob', x: 45, y: 15, w: 25, h: 18 },
        { type: 'kitchen_sink', x: 75, y: 50, w: 18, h: 25 }
      ],
      specs: {
        naturalLight: 'Direct East Sun for Food Prep',
        privacy: 'Semi-Open with Breakfast Ledge',
        ventilation: 'Dedicated Exterior Range Hood & Utility Vent',
        vastuZone: 'Agni (SE) Compliant'
      }
    },

    // 7. Staircase (if multi-floor) or Puja Room
    ...(isMultiFloor ? [{
      id: 'r_stairs',
      name: 'STAIRCASE (TO L2)',
      category: 'staircase' as const,
      x: 3,
      y: 68,
      width: 25,
      height: 29,
      dimW_ft: 7,
      dimH_ft: 14,
      areaSqFt: 98,
      doors: [
        { id: 'd_st', wall: 'top' as const, posPercent: 50, widthFt: 3, swing: 'in-left' as const }
      ],
      windows: [
        { id: 'w_st', wall: 'left' as const, posPercent: 50, widthFt: 3 }
      ],
      fixtures: [
        { type: 'staircase' as const, x: 10, y: 10, w: 80, h: 80 }
      ],
      specs: {
        naturalLight: 'Mid-Landing Window',
        privacy: 'Independent Vertical Transit',
        ventilation: 'Thermal Chimney Effect'
      }
    } satisfies ArchitecturalRoom] : [{
      id: 'r_puja',
      name: 'PUJA MANDIR',
      category: 'puja' as const,
      x: 3,
      y: 68,
      width: 20,
      height: 29,
      dimW_ft: 6,
      dimH_ft: 8,
      areaSqFt: 48,
      doors: [
        { id: 'd_p', wall: 'right' as const, posPercent: 50, widthFt: 2.5, swing: 'in-left' as const }
      ],
      windows: [
        { id: 'w_p', wall: 'left' as const, posPercent: 50, widthFt: 2.5 }
      ],
      fixtures: [
        { type: 'mandir_altar' as const, x: 20, y: 20, w: 60, h: 40 }
      ],
      specs: {
        naturalLight: 'North-East Sacred Light',
        privacy: 'Peaceful Sanctum',
        ventilation: 'Soft Draft'
      }
    } satisfies ArchitecturalRoom]),

    // 8. Parking Porch & Driveway Entry (Front Right)
    ...(hasParking ? [{
      id: 'r8',
      name: isEnlargedParking ? 'EXTENDED CAR PORCH' : 'CAR PORCH',
      category: 'parking' as const,
      x: isMultiFloor ? 28 : 23,
      y: 68,
      width: isMultiFloor ? 48 : 52,
      height: 29,
      dimW_ft: isEnlargedParking ? 15 : 12,
      dimH_ft: 18,
      areaSqFt: 216,
      doors: [] as ArchitecturalDoor[],
      windows: [] as ArchitecturalWindow[],
      fixtures: [
        { type: 'car_sedan' as const, x: 25, y: 15, w: 55, h: 70 }
      ],
      specs: {
        naturalLight: 'Open Driveway Clearance',
        privacy: 'External Vehicular Zone',
        ventilation: 'Fully Ventilated Porch'
      }
    } satisfies ArchitecturalRoom] : [{
      id: 'r8_lawn',
      name: 'FRONT GARDEN & SITOUT',
      category: 'garden' as const,
      x: isMultiFloor ? 28 : 23,
      y: 68,
      width: isMultiFloor ? 48 : 52,
      height: 29,
      dimW_ft: 14,
      dimH_ft: 14,
      areaSqFt: 196,
      doors: [] as ArchitecturalDoor[],
      windows: [] as ArchitecturalWindow[],
      fixtures: [] as ArchitecturalFixture[],
      specs: {
        naturalLight: 'Full Direct Sunlight',
        privacy: 'Semi-Open Landscape',
        ventilation: 'Unrestricted Green Air'
      }
    } satisfies ArchitecturalRoom]),

    // 9. Verandah / Front Entrance Sitout
    {
      id: 'r9',
      name: 'ENTRANCE VERANDAH',
      category: 'balcony',
      x: hasParking ? (isMultiFloor ? 76 : 75) : (isMultiFloor ? 76 : 75),
      y: 68,
      width: hasParking ? (isMultiFloor ? 21 : 22) : 22,
      height: 29,
      dimW_ft: 7,
      dimH_ft: 12,
      areaSqFt: 84,
      doors: [] as ArchitecturalDoor[],
      windows: [] as ArchitecturalWindow[],
      fixtures: [] as ArchitecturalFixture[],
      specs: {
        naturalLight: 'Road-Facing Morning Welcome',
        privacy: 'Arrival Foyer',
        ventilation: 'Ambient Airflow'
      }
    }
  ];

  // ─────────────────────────────────────────────────────────────────────────────
  // OPTION 2: SPACIOUS SOCIAL FLOW (Grand Open-Concept Living & Expanded Suite)
  // ─────────────────────────────────────────────────────────────────────────────
  const roomsOpt2: ArchitecturalRoom[] = [
    {
      id: 'opt2_r1',
      name: 'GRAND MASTER SUITE',
      category: 'master_bedroom',
      x: 3,
      y: 3,
      width: 48,
      height: 32,
      dimW_ft: 15,
      dimH_ft: 14,
      areaSqFt: 210,
      doors: [
        { id: 'o2_d1', wall: 'bottom', posPercent: 60, widthFt: 3, swing: 'in-left' },
        { id: 'o2_d2', wall: 'right', posPercent: 35, widthFt: 2.5, swing: 'in-right' }
      ],
      windows: [
        { id: 'o2_w1', wall: 'top', posPercent: 40, widthFt: 5 },
        { id: 'o2_w2', wall: 'left', posPercent: 50, widthFt: 4.5 }
      ],
      fixtures: [
        { type: 'bed_king', x: 25, y: 15, w: 45, h: 50 },
        { type: 'wardrobe', x: 5, y: 70, w: 85, h: 20 }
      ],
      specs: {
        naturalLight: 'Dual-Aspect North & West Windows',
        privacy: 'Premium Secluded Suite',
        ventilation: 'High Air Displacement'
      }
    },
    {
      id: 'opt2_r2',
      name: 'ENSUITE BATH',
      category: 'bathroom',
      x: 51,
      y: 3,
      width: 17,
      height: 18,
      dimW_ft: 6,
      dimH_ft: 8,
      areaSqFt: 48,
      doors: [{ id: 'o2_d3', wall: 'left', posPercent: 50, widthFt: 2.5, swing: 'in-left' }],
      windows: [{ id: 'o2_w3', wall: 'top', posPercent: 50, widthFt: 2.5 }],
      fixtures: [
        { type: 'toilet_wc', x: 20, y: 20, w: 30, h: 35 },
        { type: 'wash_basin', x: 60, y: 20, w: 30, h: 25 },
        { type: 'shower_stall', x: 20, y: 60, w: 60, h: 35 }
      ],
      specs: { naturalLight: 'Shaft Ventilation', privacy: 'Master Private', ventilation: 'Exhaust Louvers' }
    },
    {
      id: 'opt2_r3',
      name: 'BEDROOM 02',
      category: 'bedroom',
      x: 68,
      y: 3,
      width: 29,
      height: 32,
      dimW_ft: 11,
      dimH_ft: 13,
      areaSqFt: 143,
      doors: [{ id: 'o2_d4', wall: 'bottom', posPercent: 30, widthFt: 3, swing: 'in-right' }],
      windows: [
        { id: 'o2_w4', wall: 'top', posPercent: 50, widthFt: 4 },
        { id: 'o2_w5', wall: 'right', posPercent: 50, widthFt: 4 }
      ],
      fixtures: [
        { type: 'bed_queen', x: 25, y: 15, w: 50, h: 55 },
        { type: 'wardrobe', x: 10, y: 75, w: 80, h: 18 }
      ],
      specs: { naturalLight: 'North-East Morning Exposure', privacy: 'Semi-Private', ventilation: 'Corner Airflow' }
    },
    {
      id: 'opt2_r4',
      name: 'POWDER ROOM',
      category: 'bathroom',
      x: 51,
      y: 21,
      width: 17,
      height: 14,
      dimW_ft: 5,
      dimH_ft: 6,
      areaSqFt: 30,
      doors: [{ id: 'o2_d5', wall: 'bottom', posPercent: 50, widthFt: 2.5, swing: 'in-left' }],
      windows: [],
      fixtures: [
        { type: 'toilet_wc', x: 25, y: 20, w: 30, h: 40 },
        { type: 'wash_basin', x: 60, y: 20, w: 30, h: 30 }
      ],
      specs: { naturalLight: 'Duct Access', privacy: 'Guest Access', ventilation: 'Mechanical Exhaust' }
    },
    {
      id: 'opt2_r5',
      name: 'EXPANSIVE LIVING HALL',
      category: 'living',
      x: 3,
      y: 35,
      width: 65,
      height: 33,
      dimW_ft: 20,
      dimH_ft: 16,
      areaSqFt: 320,
      doors: [{ id: 'o2_main', wall: 'bottom', posPercent: 35, widthFt: 3.5, swing: 'in-left' }],
      windows: [
        { id: 'o2_w6', wall: 'left', posPercent: 40, widthFt: 7 }
      ],
      fixtures: [
        { type: 'sofa_sectional', x: 12, y: 15, w: 45, h: 45 },
        { type: 'coffee_table', x: 25, y: 30, w: 18, h: 18 },
        { type: 'dining_table', x: 60, y: 30, w: 35, h: 45 }
      ],
      specs: { naturalLight: 'Expansive Glazing', privacy: 'Central Gathering', ventilation: 'Through-Breeze' }
    },
    {
      id: 'opt2_r6',
      name: 'OPEN MODULAR KITCHEN',
      category: 'kitchen',
      x: 68,
      y: 35,
      width: 29,
      height: 33,
      dimW_ft: 10,
      dimH_ft: 13,
      areaSqFt: 130,
      doors: [{ id: 'o2_d6', wall: 'left', posPercent: 50, widthFt: 3, swing: 'in-left' }],
      windows: [{ id: 'o2_w7', wall: 'right', posPercent: 40, widthFt: 5 }],
      fixtures: [
        { type: 'kitchen_counter_l', x: 20, y: 15, w: 70, h: 75 },
        { type: 'kitchen_hob', x: 45, y: 20, w: 25, h: 18 },
        { type: 'kitchen_sink', x: 75, y: 55, w: 18, h: 25 }
      ],
      specs: { naturalLight: 'Breakfast Bar Sunlight', privacy: 'Open Concept', ventilation: 'High Flow Extraction' }
    },
    {
      id: 'opt2_r7',
      name: 'CAR PORCH & LANDSCAPE',
      category: 'parking',
      x: 3,
      y: 68,
      width: 60,
      height: 29,
      dimW_ft: 18,
      dimH_ft: 15,
      areaSqFt: 270,
      doors: [],
      windows: [],
      fixtures: [
        { type: 'car_sedan', x: 20, y: 15, w: 50, h: 70 }
      ],
      specs: { naturalLight: 'Full Street Sun', privacy: 'Driveway Front', ventilation: 'Unobstructed' }
    },
    {
      id: 'opt2_r8',
      name: 'FRONT FOYER & SITOUT',
      category: 'balcony',
      x: 63,
      y: 68,
      width: 34,
      height: 29,
      dimW_ft: 11,
      dimH_ft: 14,
      areaSqFt: 154,
      doors: [],
      windows: [],
      fixtures: [],
      specs: { naturalLight: 'Morning Road View', privacy: 'Welcoming Portico', ventilation: 'Fresh Air Corridor' }
    }
  ];

  // ─────────────────────────────────────────────────────────────────────────────
  // OPTION 3: VASTU HARMONIZED (Strict Quadrant & Elemental Alignment)
  // ─────────────────────────────────────────────────────────────────────────────
  const roomsOpt3: ArchitecturalRoom[] = [
    {
      id: 'opt3_r1',
      name: 'MASTER SUITE (SW)',
      category: 'master_bedroom',
      x: 3,
      y: 3,
      width: 44,
      height: 30,
      dimW_ft: mbW,
      dimH_ft: mbH,
      areaSqFt: mbW * mbH,
      doors: [{ id: 'o3_d1', wall: 'bottom', posPercent: 75, widthFt: 3, swing: 'in-left' }],
      windows: [{ id: 'o3_w1', wall: 'left', posPercent: 40, widthFt: 4 }],
      fixtures: [
        { type: 'bed_king', x: 20, y: 15, w: 45, h: 50 },
        { type: 'wardrobe', x: 5, y: 70, w: 80, h: 20 }
      ],
      specs: {
        naturalLight: 'South-West Stability Light',
        privacy: 'Master Nairuthi Zone (SW)',
        ventilation: 'Cross-Wall Venting',
        vastuZone: 'Earth Element / Nairuthi'
      }
    },
    {
      id: 'opt3_r2',
      name: 'PUJA ROOM (NE)',
      category: 'puja',
      x: 65,
      y: 3,
      width: 32,
      height: 20,
      dimW_ft: 10,
      dimH_ft: 8,
      areaSqFt: 80,
      doors: [{ id: 'o3_d_p', wall: 'bottom', posPercent: 50, widthFt: 2.5, swing: 'in-right' }],
      windows: [
        { id: 'o3_w_p1', wall: 'top', posPercent: 50, widthFt: 4 },
        { id: 'o3_w_p2', wall: 'right', posPercent: 50, widthFt: 4 }
      ],
      fixtures: [{ type: 'mandir_altar', x: 30, y: 20, w: 45, h: 45 }],
      specs: {
        naturalLight: 'Ishan (NE) Sacred Morning Light',
        privacy: 'Peaceful Spiritual Sanctum',
        ventilation: 'Pure Northeast Draft',
        vastuZone: 'Water / Ishan Corner'
      }
    },
    {
      id: 'opt3_r3',
      name: 'GUEST BEDROOM (NW)',
      category: 'bedroom',
      x: 65,
      y: 23,
      width: 32,
      height: 22,
      dimW_ft: 10,
      dimH_ft: 10,
      areaSqFt: 100,
      doors: [{ id: 'o3_d2', wall: 'left', posPercent: 50, widthFt: 3, swing: 'in-right' }],
      windows: [{ id: 'o3_w2', wall: 'right', posPercent: 50, widthFt: 4 }],
      fixtures: [
        { type: 'bed_queen', x: 20, y: 15, w: 55, h: 55 }
      ],
      specs: {
        naturalLight: 'Vayavya (NW) Light',
        privacy: 'Guest Zone',
        ventilation: 'North-West Airflow',
        vastuZone: 'Air / Vayavya Corner'
      }
    },
    {
      id: 'opt3_r4',
      name: 'ATTACHED & COMMON BATH',
      category: 'bathroom',
      x: 47,
      y: 3,
      width: 18,
      height: 30,
      dimW_ft: 6,
      dimH_ft: 12,
      areaSqFt: 72,
      doors: [
        { id: 'o3_d3', wall: 'left', posPercent: 30, widthFt: 2.5, swing: 'in-left' },
        { id: 'o3_d4', wall: 'bottom', posPercent: 50, widthFt: 2.5, swing: 'in-left' }
      ],
      windows: [{ id: 'o3_w3', wall: 'top', posPercent: 50, widthFt: 2.5 }],
      fixtures: [
        { type: 'toilet_wc', x: 20, y: 15, w: 30, h: 25 },
        { type: 'wash_basin', x: 60, y: 15, w: 30, h: 20 },
        { type: 'shower_stall', x: 20, y: 55, w: 60, h: 35 }
      ],
      specs: {
        naturalLight: 'Duct Exhaust',
        privacy: 'Dual Entry Split Bath',
        ventilation: 'High Level Vent'
      }
    },
    {
      id: 'opt3_r5',
      name: 'BRAHMASTHAN LIVING HALL',
      category: 'living',
      x: 3,
      y: 33,
      width: 60,
      height: 35,
      dimW_ft: 18,
      dimH_ft: 15,
      areaSqFt: 270,
      doors: [{ id: 'o3_main', wall: 'bottom', posPercent: 30, widthFt: 3.5, swing: 'in-left' }],
      windows: [{ id: 'o3_w6', wall: 'left', posPercent: 40, widthFt: 6 }],
      fixtures: [
        { type: 'sofa_sectional', x: 10, y: 15, w: 40, h: 45 },
        { type: 'coffee_table', x: 22, y: 30, w: 18, h: 18 },
        { type: 'dining_table', x: 55, y: 35, w: 38, h: 45 }
      ],
      specs: {
        naturalLight: 'Open Cosmic Center Light',
        privacy: 'Core Family Gathering',
        ventilation: 'Central Column Free Airflow',
        vastuZone: 'Brahmasthan Openness'
      }
    },
    {
      id: 'opt3_r6',
      name: 'AGNI KITCHEN (SE)',
      category: 'kitchen',
      x: 63,
      y: 45,
      width: 34,
      height: 23,
      dimW_ft: 10,
      dimH_ft: 10,
      areaSqFt: 100,
      doors: [{ id: 'o3_d6', wall: 'left', posPercent: 40, widthFt: 3, swing: 'in-left' }],
      windows: [{ id: 'o3_w8', wall: 'right', posPercent: 40, widthFt: 4.5 }],
      fixtures: [
        { type: 'kitchen_counter_l', x: 15, y: 10, w: 75, h: 80 },
        { type: 'kitchen_hob', x: 45, y: 15, w: 25, h: 18 } // East-facing cooking
      ],
      specs: {
        naturalLight: 'East-Facing Sun for Auspicious Cooking',
        privacy: 'Semi-Partitioned Agni Corner',
        ventilation: 'Direct Southeast Exhaust',
        vastuZone: 'Agni (SE) Compliant'
      }
    },
    {
      id: 'opt3_r7',
      name: 'NORTH ENTRY PARKING PORCH',
      category: 'parking',
      x: 3,
      y: 68,
      width: 58,
      height: 29,
      dimW_ft: 16,
      dimH_ft: 14,
      areaSqFt: 224,
      doors: [],
      windows: [],
      fixtures: [
        { type: 'car_sedan', x: 20, y: 15, w: 50, h: 70 }
      ],
      specs: {
        naturalLight: 'North Prosperity Entrance',
        privacy: 'Front Porch',
        ventilation: 'Clean Flow',
        vastuZone: 'Kubera (North) Entrance'
      }
    },
    {
      id: 'opt3_r8',
      name: 'ISHAN SITOUT & FOYER',
      category: 'balcony',
      x: 61,
      y: 68,
      width: 36,
      height: 29,
      dimW_ft: 11,
      dimH_ft: 14,
      areaSqFt: 154,
      doors: [],
      windows: [],
      fixtures: [],
      specs: {
        naturalLight: 'Sunrise Illumination',
        privacy: 'Auspicious Foyer',
        ventilation: 'Pure Breeze Entry',
        vastuZone: 'Northeast Verandah'
      }
    }
  ];

  return [
    {
      id: 'opt-1',
      name: 'OPTION 01: Balanced Flow',
      tagline: 'Balanced circulation, natural daylight and optimal space distribution',
      badge: 'Best Overall',
      score: 94,
      builtUpAreaSqFt: Math.round(totalPlotArea * 0.72),
      carpetAreaSqFt: Math.round(totalPlotArea * 0.62),
      coveragePercent: 72,
      scoreBreakdown: {
        spaceEfficiency: 95,
        naturalLight: 93,
        ventilation: 92,
        circulation: 96,
        privacy: 94,
        parking: 90
      },
      highlights: [
        'Central living-dining connectivity with 0% corridor wastage',
        'Direct morning daylight into kitchen and private master suite',
        'Dual-side cross ventilation channels across all bedrooms'
      ],
      setbacks: { frontFt: 5, rearFt: 3, leftFt: 2.5, rightFt: 2.5 },
      rooms: roomsOpt1
    },
    {
      id: 'opt-2',
      name: 'OPTION 02: Grand Social Flow',
      tagline: 'Expansive open-concept living hall with integrated breakfast counter',
      badge: 'Spacious Living',
      score: 91,
      builtUpAreaSqFt: Math.round(totalPlotArea * 0.76),
      carpetAreaSqFt: Math.round(totalPlotArea * 0.65),
      coveragePercent: 76,
      scoreBreakdown: {
        spaceEfficiency: 93,
        naturalLight: 96,
        ventilation: 89,
        circulation: 92,
        privacy: 88,
        parking: 92
      },
      highlights: [
        '320 sq ft expansive living hall with floor-to-ceiling glazing',
        'Seamless indoor-outdoor sightline to front landscape sitout',
        'Enlarged master suite with dedicated wardrobe walk-through'
      ],
      setbacks: { frontFt: 5, rearFt: 3, leftFt: 2.5, rightFt: 2.5 },
      rooms: roomsOpt2
    },
    {
      id: 'opt-3',
      name: 'OPTION 03: Vastu Harmonized',
      tagline: 'Strict quadrant alignment: Master in SW, Kitchen in SE, Puja in NE',
      badge: 'Vastu Aligned',
      score: 95,
      builtUpAreaSqFt: Math.round(totalPlotArea * 0.70),
      carpetAreaSqFt: Math.round(totalPlotArea * 0.60),
      coveragePercent: 70,
      scoreBreakdown: {
        spaceEfficiency: 91,
        naturalLight: 95,
        ventilation: 94,
        circulation: 94,
        privacy: 96,
        parking: 93
      },
      highlights: [
        'Master Suite in South-West (Nairuthi) Earth quadrant for stability',
        'Kitchen positioned in South-East (Agni) with East-facing cooking',
        'North-East (Ishan corner) preserved for spiritual light and purity'
      ],
      setbacks: { frontFt: 5, rearFt: 3, leftFt: 2.5, rightFt: 2.5 },
      rooms: roomsOpt3
    }
  ];
}
