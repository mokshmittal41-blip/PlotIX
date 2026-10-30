import type { 
  PlotGeometry, 
  RoomGeometry, 
  RoomRequirement, 
  CapacityReport,
  OTSGeometry
} from './types';

export interface ArchitecturalSynthResult {
  rooms: RoomGeometry[];
  ots: OTSGeometry[];
  builtUpAreaSqFt: number;
  carpetAreaSqFt: number;
  coveragePercent: number;
  highlights: string[];
  capacityReport: CapacityReport;
}

/**
 * Minimum functional dimensions (in feet) based on standard residential architectural guidelines (IS 8888 / NBC).
 */
export const MIN_PRACTICAL_DIMENSIONS: Record<string, { minW: number; minH: number; minArea: number; defaultW: number; defaultH: number }> = {
  master_bedroom: { minW: 10.0, minH: 11.0, minArea: 110, defaultW: 12.0, defaultH: 13.0 },
  bedroom:        { minW: 10.0, minH: 10.0, minArea: 100, defaultW: 11.0, defaultH: 12.0 },
  living:         { minW: 10.5, minH: 12.0, minArea: 125, defaultW: 13.0, defaultH: 15.0 },
  dining:         { minW: 8.5,  minH: 9.0,  minArea: 80,  defaultW: 10.0, defaultH: 11.0 },
  kitchen:        { minW: 6.5,  minH: 7.5,  minArea: 50,  defaultW: 8.0,  defaultH: 9.5  },
  bathroom:       { minW: 4.0,  minH: 5.0,  minArea: 20,  defaultW: 5.0,  defaultH: 7.0  },
  puja:           { minW: 3.5,  minH: 4.0,  minArea: 14,  defaultW: 4.5,  defaultH: 4.5  },
  study:          { minW: 7.5,  minH: 8.5,  minArea: 65,  defaultW: 9.0,  defaultH: 10.0 },
  store:          { minW: 4.0,  minH: 5.0,  minArea: 20,  defaultW: 5.0,  defaultH: 6.0  },
  utility:        { minW: 4.0,  minH: 5.0,  minArea: 20,  defaultW: 5.0,  defaultH: 6.0  },
  balcony:        { minW: 3.5,  minH: 6.0,  minArea: 24,  defaultW: 4.0,  defaultH: 8.0  },
  parking:        { minW: 9.0,  minH: 14.0, minArea: 130, defaultW: 10.5, defaultH: 16.5 },
  staircase:      { minW: 6.0,  minH: 9.0,  minArea: 55,  defaultW: 6.5,  defaultH: 11.0 },
  veranda:        { minW: 4.0,  minH: 6.0,  minArea: 24,  defaultW: 5.0,  defaultH: 8.0  },
  ots:            { minW: 3.0,  minH: 3.0,  minArea: 9,   defaultW: 3.5,  defaultH: 4.0  },
  custom:         { minW: 8.0,  minH: 8.0,  minArea: 64,  defaultW: 10.0, defaultH: 10.0 }
};

/**
 * Validates whether the requested room program can realistically fit within the buildable plot envelope.
 */
export function validatePlotCapacity(plot: PlotGeometry, requirements: RoomRequirement[]): CapacityReport {
  const bldgW = Math.max(10, plot.width - (plot.setbacks.left + plot.setbacks.right));
  const bldgH = Math.max(10, plot.depth - (plot.setbacks.front + plot.setbacks.rear));
  const buildableArea = bldgW * bldgH;

  let totalMinCarpet = 0;
  let totalIdealCarpet = 0;
  let roomCount = 0;

  for (const req of requirements) {
    const minSpecs = MIN_PRACTICAL_DIMENSIONS[req.category] || MIN_PRACTICAL_DIMENSIONS.custom;
    const count = Math.max(1, req.count || 1);
    totalMinCarpet += minSpecs.minArea * count;
    totalIdealCarpet += (req.widthFt * req.heightFt) * count;
    roomCount += count;
  }

  // Account for internal circulation (12-15%) + wall thickness area (10-12%)
  const grossSpaceRequired = totalMinCarpet * 1.25;

  if (grossSpaceRequired > buildableArea * 1.15) {
    const maxRecommended = Math.max(2, Math.floor((buildableArea * 0.75) / 130));
    return {
      status: 'exceeded',
      availableBuildableSqFt: Math.round(buildableArea),
      totalRequestedCarpetSqFt: Math.round(totalIdealCarpet),
      recommendedMaxRooms: maxRecommended,
      message: `Requested rooms require approx ${Math.round(grossSpaceRequired)} sq ft (incl. circulation & walls), but buildable ground footprint is only ${Math.round(buildableArea)} sq ft.`,
      suggestions: [
        'Consider reducing to 2BHK or removing secondary utility spaces from ground floor',
        'Move bedrooms or home office to First Floor (Duplex configuration)',
        'Opt for open-concept Living+Dining to eliminate dedicated lobby area'
      ]
    };
  } else if (grossSpaceRequired > buildableArea * 0.90) {
    return {
      status: 'tight',
      availableBuildableSqFt: Math.round(buildableArea),
      totalRequestedCarpetSqFt: Math.round(totalIdealCarpet),
      recommendedMaxRooms: roomCount,
      message: `Layout is tight (${Math.round((grossSpaceRequired / buildableArea) * 100)}% coverage). Rooms will use optimized space-saving dimensions.`,
      suggestions: [
        'Combined Living + Dining recommended for optimal spaciousness',
        'Use attached/shared toilets with space-saving sliding doors'
      ]
    };
  }

  return {
    status: 'feasible',
    availableBuildableSqFt: Math.round(buildableArea),
    totalRequestedCarpetSqFt: Math.round(totalIdealCarpet),
    recommendedMaxRooms: roomCount + 2,
    message: `Plot footprint (${Math.round(buildableArea)} sq ft buildable) is well-proportioned for the requested requirements.`,
    suggestions: [
      'Generous room dimensions with dedicated dining and car porch are achievable',
      'Rear private garden and central ventilation shaft included'
    ]
  };
}

/**
 * Parametrically rounds a dimension to nearest 3 inches (0.25 ft) for clean architectural drafting.
 */
export function roundToArchInches(val: number): number {
  return Math.round(val * 4) / 4;
}

/**
 * SYNTHESIS OPTION 1: Zoned Contemporary Layout (Balanced Flow)
 */
export function synthesizeOption1_Balanced(
  plot: PlotGeometry,
  reqs: RoomRequirement[],
  capacityReport: CapacityReport
): ArchitecturalSynthResult {
  const setbackL = plot.setbacks.left;
  const setbackT = plot.setbacks.rear;
  const bldgW = roundToArchInches(Math.max(16, plot.width - (setbackL + plot.setbacks.right)));
  const bldgH = roundToArchInches(Math.max(20, plot.depth - (setbackT + plot.setbacks.front)));

  const hasParking = reqs.some(r => r.category === 'parking');
  const hasStair = reqs.some(r => r.category === 'staircase');
  const hasPuja = reqs.some(r => r.category === 'puja');
  const bedCount = reqs.filter(r => r.category === 'bedroom' || r.category === 'master_bedroom').length || 2;

  // Split into 3 Primary Depth Bands: Front (28-32%), Core (36-40%), Rear (32-36%)
  let frontBandH = roundToArchInches(Math.max(12, bldgH * (hasParking ? 0.32 : 0.26)));
  let rearBandH = roundToArchInches(Math.max(11, bldgH * 0.34));
  let coreBandH = roundToArchInches(bldgH - (frontBandH + rearBandH));

  // If building depth is tight, clamp proportions
  if (coreBandH < 12) {
    const diff = 12 - coreBandH;
    frontBandH = roundToArchInches(frontBandH - diff * 0.5);
    rearBandH = roundToArchInches(rearBandH - diff * 0.5);
    coreBandH = roundToArchInches(bldgH - (frontBandH + rearBandH));
  }

  const yFront = setbackT + (bldgH - frontBandH);
  const yCore = setbackT + rearBandH;
  const yRear = setbackT;

  const rooms: RoomGeometry[] = [];
  const ots: OTSGeometry[] = [];

  // ─── 1. FRONT ZONE ──────────────────────────────────────────────────────────
  if (hasParking) {
    const parkW = roundToArchInches(Math.min(bldgW * 0.48, Math.max(9.5, bldgW * 0.42)));
    rooms.push({
      id: 'opt1_parking',
      name: 'Car Porch / Parking',
      category: 'parking',
      x: setbackL,
      y: yFront,
      width: parkW,
      height: frontBandH,
      zone: 'outdoor',
      specs: { naturalLight: 'Direct (100%)', privacy: 'Public', ventilation: 'Open Air' }
    });

    if (hasStair) {
      const stairW = roundToArchInches(Math.min(7.0, (bldgW - parkW) * 0.45));
      const foyerW = roundToArchInches(bldgW - parkW - stairW);

      rooms.push({
        id: 'opt1_veranda',
        name: 'Entry Verandah',
        category: 'veranda',
        x: setbackL + parkW,
        y: yFront,
        width: foyerW,
        height: frontBandH,
        zone: 'circulation',
        specs: { naturalLight: 'Daylight (100%)', privacy: 'Semi-Private', ventilation: 'Direct' }
      });

      rooms.push({
        id: 'opt1_stair',
        name: 'Staircase (Dog-Leg)',
        category: 'staircase',
        x: setbackL + parkW + foyerW,
        y: yFront,
        width: stairW,
        height: frontBandH,
        zone: 'circulation',
        specs: { naturalLight: 'Side Window', privacy: 'Semi-Private', ventilation: 'Shaft' }
      });
    } else {
      rooms.push({
        id: 'opt1_veranda',
        name: 'Front Verandah & Lawn',
        category: 'veranda',
        x: setbackL + parkW,
        y: yFront,
        width: roundToArchInches(bldgW - parkW),
        height: frontBandH,
        zone: 'outdoor',
        specs: { naturalLight: 'Daylight (100%)', privacy: 'Semi-Private', ventilation: 'Open Air' }
      });
    }
  } else {
    if (hasStair) {
      const stairW = roundToArchInches(Math.min(7.0, bldgW * 0.32));
      rooms.push({
        id: 'opt1_veranda',
        name: 'Front Foyer & Sitout',
        category: 'veranda',
        x: setbackL,
        y: yFront,
        width: roundToArchInches(bldgW - stairW),
        height: frontBandH,
        zone: 'circulation',
        specs: { naturalLight: 'Direct (100%)', privacy: 'Semi-Private', ventilation: 'Open Air' }
      });
      rooms.push({
        id: 'opt1_stair',
        name: 'Staircase (Dog-Leg)',
        category: 'staircase',
        x: setbackL + (bldgW - stairW),
        y: yFront,
        width: stairW,
        height: frontBandH,
        zone: 'circulation',
        specs: { naturalLight: 'Window', privacy: 'Semi-Private', ventilation: 'Shaft' }
      });
    } else {
      rooms.push({
        id: 'opt1_veranda',
        name: 'Front Sitout & Lawn',
        category: 'veranda',
        x: setbackL,
        y: yFront,
        width: bldgW,
        height: frontBandH,
        zone: 'outdoor',
        specs: { naturalLight: 'Direct (100%)', privacy: 'Public', ventilation: 'Open Air' }
      });
    }
  }

  // ─── 2. CENTRAL CORE ZONE ───────────────────────────────────────────────────
  const livingW = roundToArchInches(Math.max(11.0, bldgW * 0.52));
  const serviceW = roundToArchInches(bldgW - livingW);

  rooms.push({
    id: 'opt1_living',
    name: 'Drawing / Living Room',
    category: 'living',
    x: setbackL,
    y: yCore,
    width: livingW,
    height: coreBandH,
    zone: 'public',
    specs: { naturalLight: 'Daylight (85%)', privacy: 'Semi-Public', ventilation: 'Cross-Vent' }
  });

  const kitchenH = roundToArchInches(Math.max(7.5, coreBandH * 0.52));
  const utilH = roundToArchInches(coreBandH - kitchenH);

  rooms.push({
    id: 'opt1_kitchen',
    name: 'Modular Kitchen',
    category: 'kitchen',
    x: setbackL + livingW,
    y: yCore + utilH,
    width: serviceW,
    height: kitchenH,
    isWetArea: true,
    zone: 'service',
    specs: { naturalLight: 'Window (SE/East)', privacy: 'Semi-Private', ventilation: 'Exterior Window' }
  });

  const bathW = roundToArchInches(Math.min(5.5, serviceW * 0.45));
  const diningW = roundToArchInches(serviceW - bathW);

  rooms.push({
    id: 'opt1_dining',
    name: 'Dining Lobby',
    category: 'dining',
    x: setbackL + livingW,
    y: yCore,
    width: diningW,
    height: utilH,
    zone: 'circulation',
    specs: { naturalLight: 'Skylight/OTS', privacy: 'Semi-Private', ventilation: 'OTS Duct' }
  });

  rooms.push({
    id: 'opt1_common_bath',
    name: 'Common Toilet',
    category: 'bathroom',
    x: setbackL + livingW + diningW,
    y: yCore,
    width: bathW,
    height: roundToArchInches(utilH * 0.7),
    isWetArea: true,
    zone: 'service',
    specs: { naturalLight: 'Ventilator (V1)', privacy: 'High', ventilation: 'OTS Shaft' }
  });

  const otsW = bathW;
  const otsH = roundToArchInches(utilH * 0.3);
  ots.push({
    id: 'ots_core',
    name: 'OTS Ventilation Shaft',
    x: setbackL + livingW + diningW,
    y: yCore + roundToArchInches(utilH * 0.7),
    width: otsW,
    height: otsH,
    servesRooms: ['opt1_common_bath', 'opt1_kitchen', 'opt1_dining']
  });

  if (hasPuja) {
    rooms.push({
      id: 'opt1_puja',
      name: 'Pooja Mandir',
      category: 'puja',
      x: setbackL + livingW - 3.5,
      y: yCore + 0.5,
      width: 3.5,
      height: 4.0,
      zone: 'private',
      specs: { naturalLight: 'Peaceful', privacy: 'Sacred', ventilation: 'OTS Shaft', vastuZone: 'Ishan (NE)' }
    });
  }

  // ─── 3. REAR PRIVATE ZONE ───────────────────────────────────────────────────
  const masterW = roundToArchInches(Math.max(11.0, bldgW * 0.52));
  const bed2W = roundToArchInches(bldgW - masterW);

  const masterBathW = roundToArchInches(Math.min(5.5, masterW * 0.42));
  const masterBedNetW = roundToArchInches(masterW - masterBathW);

  rooms.push({
    id: 'opt1_master_bed',
    name: 'Master Bedroom',
    category: 'master_bedroom',
    x: setbackL,
    y: yRear,
    width: masterBedNetW,
    height: rearBandH,
    zone: 'private',
    specs: { naturalLight: 'Daylight (80%)', privacy: 'Private', ventilation: 'Rear Breeze' }
  });

  rooms.push({
    id: 'opt1_master_bath',
    name: 'Att. Bath',
    category: 'bathroom',
    x: setbackL + masterBedNetW,
    y: yRear,
    width: masterBathW,
    height: roundToArchInches(rearBandH * 0.6),
    isWetArea: true,
    zone: 'service',
    specs: { naturalLight: 'Ventilator (V2)', privacy: 'High', ventilation: 'Rear Shaft' }
  });

  rooms.push({
    id: 'opt1_bed2',
    name: bedCount > 1 ? 'Bedroom 2 / Kids' : 'Guest Room / Study',
    category: 'bedroom',
    x: setbackL + masterW,
    y: yRear,
    width: bed2W,
    height: rearBandH,
    zone: 'private',
    specs: { naturalLight: 'Daylight (85%)', privacy: 'Private', ventilation: 'Rear Window' }
  });

  const totalCarpet = rooms.reduce((sum, r) => sum + (r.width * r.height), 0);
  const totalBuiltUp = roundToArchInches(totalCarpet * 1.15);
  const plotArea = plot.width * plot.depth;

  return {
    rooms,
    ots,
    builtUpAreaSqFt: Math.round(totalBuiltUp),
    carpetAreaSqFt: Math.round(totalCarpet),
    coveragePercent: Math.round((totalBuiltUp / plotArea) * 100),
    highlights: [
      'Strict separation of Public Living, Central Dining Hub, and Quiet Rear Bedrooms',
      'Central OTS shaft provides natural light and ventilation to interior bathroom and kitchen',
      'Dedicated Car Porch with direct access to Verandah and independent Dog-leg Staircase',
      'Master suite equipped with private attached bath and cross-ventilation'
    ],
    capacityReport
  };
}

/**
 * SYNTHESIS OPTION 2: Open-Concept Flow Layout
 */
export function synthesizeOption2_OpenFlow(
  plot: PlotGeometry,
  reqs: RoomRequirement[],
  capacityReport: CapacityReport
): ArchitecturalSynthResult {
  const setbackL = plot.setbacks.left;
  const setbackT = plot.setbacks.rear;
  const bldgW = roundToArchInches(Math.max(16, plot.width - (setbackL + plot.setbacks.right)));
  const bldgH = roundToArchInches(Math.max(20, plot.depth - (setbackT + plot.setbacks.front)));

  const hasParking = reqs.some(r => r.category === 'parking');

  const frontH = roundToArchInches(Math.max(11, bldgH * 0.28));
  const rearH = roundToArchInches(Math.max(12, bldgH * 0.35));
  const coreH = roundToArchInches(bldgH - (frontH + rearH));

  const yFront = setbackT + (bldgH - frontH);
  const yCore = setbackT + rearH;
  const yRear = setbackT;

  const rooms: RoomGeometry[] = [];
  const ots: OTSGeometry[] = [];

  if (hasParking) {
    const parkW = roundToArchInches(Math.min(11.5, bldgW * 0.44));
    rooms.push({
      id: 'opt2_parking',
      name: 'Car Parking Porch',
      category: 'parking',
      x: setbackL,
      y: yFront,
      width: parkW,
      height: frontH,
      zone: 'outdoor',
      specs: { naturalLight: 'Direct (100%)', privacy: 'Public', ventilation: 'Open Air' }
    });

    rooms.push({
      id: 'opt2_veranda',
      name: 'Grand Entry Foyer',
      category: 'veranda',
      x: setbackL + parkW,
      y: yFront,
      width: roundToArchInches(bldgW - parkW),
      height: frontH,
      zone: 'circulation',
      specs: { naturalLight: 'Glazed Façade', privacy: 'Semi-Private', ventilation: 'Direct' }
    });
  } else {
    rooms.push({
      id: 'opt2_veranda',
      name: 'Front Portico & Landscape',
      category: 'veranda',
      x: setbackL,
      y: yFront,
      width: bldgW,
      height: frontH,
      zone: 'outdoor',
      specs: { naturalLight: 'Direct (100%)', privacy: 'Public', ventilation: 'Open Air' }
    });
  }

  const greatRoomW = roundToArchInches(Math.max(12.0, bldgW * 0.62));
  const utilW = roundToArchInches(bldgW - greatRoomW);

  rooms.push({
    id: 'opt2_living',
    name: 'Open-Concept Living & Lounge',
    category: 'living',
    x: setbackL,
    y: yCore,
    width: greatRoomW,
    height: coreH,
    zone: 'public',
    specs: { naturalLight: 'Abundant Daylight (92%)', privacy: 'Open Public', ventilation: 'Cross Breeze' }
  });

  const kitchenH = roundToArchInches(coreH * 0.55);
  const bathH = roundToArchInches(coreH - kitchenH);

  rooms.push({
    id: 'opt2_kitchen',
    name: 'Open Kitchen & Breakfast Bar',
    category: 'kitchen',
    x: setbackL + greatRoomW,
    y: yCore + bathH,
    width: utilW,
    height: kitchenH,
    isWetArea: true,
    zone: 'service',
    specs: { naturalLight: 'East Daylight', privacy: 'Open-Concept', ventilation: 'Exhaust Hood' }
  });

  rooms.push({
    id: 'opt2_common_bath',
    name: 'Powder Room / Bath',
    category: 'bathroom',
    x: setbackL + greatRoomW,
    y: yCore,
    width: utilW,
    height: bathH,
    isWetArea: true,
    zone: 'service',
    specs: { naturalLight: 'Ventilator (V1)', privacy: 'High', ventilation: 'Duct' }
  });

  const masterW = roundToArchInches(bldgW * 0.54);
  const bed2W = roundToArchInches(bldgW - masterW);

  const masterBathW = roundToArchInches(Math.min(5.5, masterW * 0.38));
  const masterNetW = roundToArchInches(masterW - masterBathW);

  rooms.push({
    id: 'opt2_master_bed',
    name: 'Master Suite',
    category: 'master_bedroom',
    x: setbackL,
    y: yRear,
    width: masterNetW,
    height: rearH,
    zone: 'private',
    specs: { naturalLight: 'Garden View', privacy: 'Private', ventilation: 'Rear Garden' }
  });

  rooms.push({
    id: 'opt2_master_bath',
    name: 'Ensuite Bath',
    category: 'bathroom',
    x: setbackL + masterNetW,
    y: yRear,
    width: masterBathW,
    height: roundToArchInches(rearH * 0.6),
    isWetArea: true,
    zone: 'service',
    specs: { naturalLight: 'Ventilator (V2)', privacy: 'High', ventilation: 'Shaft' }
  });

  rooms.push({
    id: 'opt2_bed2',
    name: 'Bedroom 2 / Study',
    category: 'bedroom',
    x: setbackL + masterW,
    y: yRear,
    width: bed2W,
    height: rearH,
    zone: 'private',
    specs: { naturalLight: 'Rear Daylight', privacy: 'Private', ventilation: 'Rear Window' }
  });

  const totalCarpet = rooms.reduce((sum, r) => sum + (r.width * r.height), 0);
  const totalBuiltUp = roundToArchInches(totalCarpet * 1.14);
  const plotArea = plot.width * plot.depth;

  return {
    rooms,
    ots,
    builtUpAreaSqFt: Math.round(totalBuiltUp),
    carpetAreaSqFt: Math.round(totalCarpet),
    coveragePercent: Math.round((totalBuiltUp / plotArea) * 100),
    highlights: [
      'Modern open-concept floor plan maximizing visual volume and natural daylight',
      'Seamless transition between Living room, Dining space, and Open Island Kitchen',
      'Master suite positioned quietly at the rear with dedicated ensuite bath',
      'Optimized circulation with zero wasted corridor area'
    ],
    capacityReport
  };
}

/**
 * SYNTHESIS OPTION 3: Vastu-Oriented Layout
 */
export function synthesizeOption3_Vastu(
  plot: PlotGeometry,
  reqs: RoomRequirement[],
  capacityReport: CapacityReport
): ArchitecturalSynthResult {
  const setbackL = plot.setbacks.left;
  const setbackT = plot.setbacks.rear;
  const bldgW = roundToArchInches(Math.max(16, plot.width - (setbackL + plot.setbacks.right)));
  const bldgH = roundToArchInches(Math.max(20, plot.depth - (setbackT + plot.setbacks.front)));

  const hasParking = reqs.some(r => r.category === 'parking');

  const frontH = roundToArchInches(Math.max(11, bldgH * 0.30));
  const rearH = roundToArchInches(Math.max(11.5, bldgH * 0.34));
  const coreH = roundToArchInches(bldgH - (frontH + rearH));

  const yFront = setbackT + (bldgH - frontH);
  const yCore = setbackT + rearH;
  const yRear = setbackT;

  const rooms: RoomGeometry[] = [];
  const ots: OTSGeometry[] = [];

  const parkW = roundToArchInches(Math.min(11.0, bldgW * 0.44));
  const foyerW = roundToArchInches(bldgW - parkW);

  if (hasParking) {
    rooms.push({
      id: 'opt3_parking',
      name: 'Car Parking Porch',
      category: 'parking',
      x: setbackL,
      y: yFront,
      width: parkW,
      height: frontH,
      zone: 'outdoor',
      specs: { naturalLight: 'Daylight', privacy: 'Public', ventilation: 'Open Air', vastuZone: 'Vayu (NW)' }
    });

    rooms.push({
      id: 'opt3_veranda',
      name: 'Auspicious Foyer (Ishan Entrance)',
      category: 'veranda',
      x: setbackL + parkW,
      y: yFront,
      width: foyerW,
      height: frontH,
      zone: 'circulation',
      specs: { naturalLight: 'NE Sunlight (95%)', privacy: 'Semi-Private', ventilation: 'Direct', vastuZone: 'Ishan (NE)' }
    });
  } else {
    rooms.push({
      id: 'opt3_veranda',
      name: 'North-East Entry Portico',
      category: 'veranda',
      x: setbackL,
      y: yFront,
      width: bldgW,
      height: frontH,
      zone: 'circulation',
      specs: { naturalLight: 'NE Sunlight (100%)', privacy: 'Semi-Private', ventilation: 'Direct', vastuZone: 'Ishan (NE)' }
    });
  }

  const livingW = roundToArchInches(bldgW * 0.54);
  const agniW = roundToArchInches(bldgW - livingW);

  rooms.push({
    id: 'opt3_living',
    name: 'Living Room & Brahmasthan Core',
    category: 'living',
    x: setbackL,
    y: yCore,
    width: livingW,
    height: coreH,
    zone: 'public',
    specs: { naturalLight: 'Daylight (90%)', privacy: 'Semi-Public', ventilation: 'Cross-Vent', vastuZone: 'Brahmasthan' }
  });

  const kitchenH = roundToArchInches(coreH * 0.6);
  const pujaH = roundToArchInches(coreH - kitchenH);

  rooms.push({
    id: 'opt3_kitchen',
    name: 'Kitchen (Agni Zone)',
    category: 'kitchen',
    x: setbackL + livingW,
    y: yCore + pujaH,
    width: agniW,
    height: kitchenH,
    isWetArea: true,
    zone: 'service',
    specs: { naturalLight: 'East Morning Sunlight', privacy: 'Semi-Private', ventilation: 'Exterior Window', vastuZone: 'Agni (SE)' }
  });

  rooms.push({
    id: 'opt3_puja',
    name: 'Pooja Room (Ishan)',
    category: 'puja',
    x: setbackL + livingW,
    y: yCore,
    width: roundToArchInches(agniW * 0.55),
    height: pujaH,
    zone: 'private',
    specs: { naturalLight: 'Morning Sun', privacy: 'Sacred', ventilation: 'OTS Shaft', vastuZone: 'Ishan (NE)' }
  });

  rooms.push({
    id: 'opt3_common_bath',
    name: 'Common Toilet (NW Shaft)',
    category: 'bathroom',
    x: setbackL + livingW + roundToArchInches(agniW * 0.55),
    y: yCore,
    width: roundToArchInches(agniW * 0.45),
    height: pujaH,
    isWetArea: true,
    zone: 'service',
    specs: { naturalLight: 'Ventilator (V1)', privacy: 'High', ventilation: 'OTS Shaft', vastuZone: 'Vayu (NW)' }
  });

  const masterW = roundToArchInches(bldgW * 0.52);
  const bed2W = roundToArchInches(bldgW - masterW);

  const masterBathW = roundToArchInches(Math.min(5.5, masterW * 0.4));
  const masterNetW = roundToArchInches(masterW - masterBathW);

  rooms.push({
    id: 'opt3_master_bed',
    name: 'Master Bedroom (Nairuthi)',
    category: 'master_bedroom',
    x: setbackL,
    y: yRear,
    width: masterNetW,
    height: rearH,
    zone: 'private',
    specs: { naturalLight: 'SW Ventilation', privacy: 'Private', ventilation: 'Cross-Vent', vastuZone: 'Nairuthi (SW)' }
  });

  rooms.push({
    id: 'opt3_master_bath',
    name: 'Attached Bath',
    category: 'bathroom',
    x: setbackL + masterNetW,
    y: yRear,
    width: masterBathW,
    height: roundToArchInches(rearH * 0.6),
    isWetArea: true,
    zone: 'service',
    specs: { naturalLight: 'Ventilator (V2)', privacy: 'High', ventilation: 'Rear Shaft', vastuZone: 'West' }
  });

  rooms.push({
    id: 'opt3_bed2',
    name: 'Bedroom 2 / Kids (Vayu)',
    category: 'bedroom',
    x: setbackL + masterW,
    y: yRear,
    width: bed2W,
    height: rearH,
    zone: 'private',
    specs: { naturalLight: 'Daylight', privacy: 'Private', ventilation: 'Rear Window', vastuZone: 'Vayu (NW)' }
  });

  const totalCarpet = rooms.reduce((sum, r) => sum + (r.width * r.height), 0);
  const totalBuiltUp = roundToArchInches(totalCarpet * 1.15);
  const plotArea = plot.width * plot.depth;

  return {
    rooms,
    ots,
    builtUpAreaSqFt: Math.round(totalBuiltUp),
    carpetAreaSqFt: Math.round(totalCarpet),
    coveragePercent: Math.round((totalBuiltUp / plotArea) * 100),
    highlights: [
      'Master bedroom positioned strictly in South-West (Nairuthi) quadrant for stability and rest',
      'Kitchen located in South-East (Agni) quadrant for optimal morning sunlight and positive energy',
      'Dedicated Pooja room placed in sacred North-East (Ishan) quadrant',
      'Central open Brahmasthan core ensures uninterrupted positive energy flow and cross-ventilation'
    ],
    capacityReport
  };
}
