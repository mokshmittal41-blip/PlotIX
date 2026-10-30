import type { 
  FloorPlanModel, 
  PlotGeometry, 
  RoomGeometry, 
  DoorGeometry, 
  WindowGeometry, 
  FurnitureGeometry, 
  RoomRequirement
} from './types';

import {
  validatePlotCapacity,
  synthesizeOption1_Balanced,
  synthesizeOption2_OpenFlow,
  synthesizeOption3_Vastu,
  roundToArchInches
} from './architecturalEngine';

import {
  extractWallGeometry,
  generateConceptualColumnGrid,
  generateArchitecturalDoors,
  generateArchitecturalWindows,
  calculateAreaStatement,
  compileScheduleOfOpenings,
  createTitleBlockInfo
} from './structuralEngine';

export interface LayoutSynthesisParams {
  plot: PlotGeometry;
  requirements: RoomRequirement[];
  roadFacing?: string;
  floorOption?: string;
  vastuPreference?: string;
}

/**
 * Creates realistic parametric furniture for a room based on its category and dimensions.
 */
export function createRoomFurniture(room: RoomGeometry): FurnitureGeometry[] {
  const f: FurnitureGeometry[] = [];
  const { id: roomId, category, width, height } = room;

  switch (category) {
    case 'master_bedroom':
      // King bed + wardrobe
      f.push({
        id: `fur_${roomId}_bed`,
        roomId,
        type: 'bed_king',
        x: Math.max(0.5, (width - 6.5) / 2),
        y: 0.5,
        width: 6.5,
        height: 6.5,
        rotation: 0
      });
      f.push({
        id: `fur_${roomId}_wardrobe`,
        roomId,
        type: 'wardrobe',
        x: 0.5,
        y: Math.max(0.5, height - 2.5),
        width: Math.min(width - 1.0, 7.0),
        height: 2.0,
        rotation: 0
      });
      break;

    case 'bedroom':
      // Queen bed + wardrobe
      f.push({
        id: `fur_${roomId}_bed`,
        roomId,
        type: 'bed_queen',
        x: Math.max(0.5, (width - 5.5) / 2),
        y: 0.5,
        width: 5.5,
        height: 6.0,
        rotation: 0
      });
      f.push({
        id: `fur_${roomId}_wardrobe`,
        roomId,
        type: 'wardrobe',
        x: 0.5,
        y: Math.max(0.5, height - 2.2),
        width: Math.min(width - 1.0, 5.0),
        height: 1.8,
        rotation: 0
      });
      break;

    case 'living':
      // Sectional sofa + coffee table + TV unit
      f.push({
        id: `fur_${roomId}_sofa`,
        roomId,
        type: 'sofa_sectional',
        x: 1.0,
        y: 1.0,
        width: Math.min(width - 2.0, 8.0),
        height: Math.min(height - 2.0, 6.0),
        rotation: 0
      });
      f.push({
        id: `fur_${roomId}_coffee`,
        roomId,
        type: 'coffee_table',
        x: 3.0,
        y: 3.0,
        width: 3.5,
        height: 2.0,
        rotation: 0
      });
      f.push({
        id: `fur_${roomId}_tv`,
        roomId,
        type: 'tv_unit',
        x: Math.max(1.0, width - 2.0),
        y: 1.5,
        width: 1.2,
        height: 5.0,
        rotation: 0
      });
      break;

    case 'dining':
      // 6-seater dining table
      f.push({
        id: `fur_${roomId}_dining`,
        roomId,
        type: 'dining_table',
        x: Math.max(0.5, (width - 6.0) / 2),
        y: Math.max(0.5, (height - 4.5) / 2),
        width: 6.0,
        height: 4.5,
        rotation: 0
      });
      break;

    case 'kitchen':
      // L-Counter + Hob + Sink
      f.push({
        id: `fur_${roomId}_counter`,
        roomId,
        type: 'kitchen_counter_l',
        x: 0.3,
        y: 0.3,
        width: Math.min(width - 0.6, 7.5),
        height: Math.min(height - 0.6, 6.5),
        rotation: 0
      });
      f.push({
        id: `fur_${roomId}_hob`,
        roomId,
        type: 'kitchen_hob',
        x: 1.5,
        y: 0.5,
        width: 2.2,
        height: 1.5,
        rotation: 0
      });
      f.push({
        id: `fur_${roomId}_sink`,
        roomId,
        type: 'kitchen_sink',
        x: Math.max(1.0, width - 3.2),
        y: 2.5,
        width: 2.2,
        height: 1.6,
        rotation: 0
      });
      break;

    case 'bathroom':
      // WC + Basin + Shower
      f.push({
        id: `fur_${roomId}_wc`,
        roomId,
        type: 'toilet_wc',
        x: 0.5,
        y: 0.5,
        width: 1.8,
        height: 2.5,
        rotation: 0
      });
      f.push({
        id: `fur_${roomId}_basin`,
        roomId,
        type: 'wash_basin',
        x: Math.max(0.5, width - 2.2),
        y: 0.5,
        width: 1.6,
        height: 1.5,
        rotation: 0
      });
      f.push({
        id: `fur_${roomId}_shower`,
        roomId,
        type: 'shower_stall',
        x: Math.max(0.5, width - 3.2),
        y: Math.max(0.5, height - 3.2),
        width: 2.8,
        height: 2.8,
        rotation: 0
      });
      break;

    case 'parking':
      f.push({
        id: `fur_${roomId}_car`,
        roomId,
        type: 'car_sedan',
        x: Math.max(0.5, (width - 6.5) / 2),
        y: Math.max(0.5, (height - 13.5) / 2),
        width: 6.5,
        height: 13.5,
        rotation: 0
      });
      break;

    case 'puja':
      f.push({
        id: `fur_${roomId}_mandir`,
        roomId,
        type: 'mandir_altar',
        x: Math.max(0.5, (width - 3.0) / 2),
        y: 0.5,
        width: 3.0,
        height: 2.0,
        rotation: 0
      });
      break;

    case 'staircase':
      f.push({
        id: `fur_${roomId}_stairs`,
        roomId,
        type: 'staircase',
        x: 0.5,
        y: 0.5,
        width: width - 1.0,
        height: height - 1.0,
        rotation: 0
      });
      break;

    case 'study':
      f.push({
        id: `fur_${roomId}_desk`,
        roomId,
        type: 'desk_study',
        x: 0.5,
        y: 0.5,
        width: 4.5,
        height: 2.2,
        rotation: 0
      });
      break;
  }

  return f;
}

/**
 * Synthesizes 3 distinct architectural floor-plan options for the given plot and requirements.
 */
export function synthesizeFloorPlans(params: LayoutSynthesisParams): FloorPlanModel[] {
  const { plot, requirements } = params;

  // 1. Run Pre-flight Capacity Validation
  const capacityReport = validatePlotCapacity(plot, requirements);

  // 2. Synthesize Layout 1 (Balanced Contemporary)
  const synth1 = synthesizeOption1_Balanced(plot, requirements, capacityReport);
  const doors1 = generateArchitecturalDoors(synth1.rooms);
  const wins1 = generateArchitecturalWindows(plot, synth1.rooms);
  const furn1: FurnitureGeometry[] = [];
  synth1.rooms.forEach(r => furn1.push(...createRoomFurniture(r)));
  const walls1 = extractWallGeometry(plot, synth1.rooms);
  const cols1 = generateConceptualColumnGrid(plot, synth1.rooms);
  const area1 = calculateAreaStatement(plot, synth1.rooms);
  const sched1 = compileScheduleOfOpenings(doors1, wins1);
  const tb1 = createTitleBlockInfo(plot, 'Option 01: Balanced Space Planning');

  const plan1: FloorPlanModel = {
    id: 'plan_opt_1',
    name: 'Option 01: Balanced Zoned Naksha',
    tagline: 'Practical zoning with private master suite, central ventilation shaft & car porch',
    badge: 'RECOMMENDED',
    score: 95,
    builtUpAreaSqFt: synth1.builtUpAreaSqFt,
    carpetAreaSqFt: synth1.carpetAreaSqFt,
    coveragePercent: synth1.coveragePercent,
    scoreBreakdown: {
      spaceEfficiency: 96,
      naturalLight: 94,
      ventilation: 95,
      circulation: 97,
      privacy: 96,
      parking: 92
    },
    highlights: synth1.highlights,
    plot,
    rooms: synth1.rooms,
    doors: doors1,
    windows: wins1,
    furniture: furn1,
    walls: walls1,
    columns: cols1,
    ots: synth1.ots,
    schedule: sched1,
    areaStatement: area1,
    titleBlock: tb1,
    capacityReport
  };

  // 3. Synthesize Layout 2 (Open Flow)
  const synth2 = synthesizeOption2_OpenFlow(plot, requirements, capacityReport);
  const doors2 = generateArchitecturalDoors(synth2.rooms);
  const wins2 = generateArchitecturalWindows(plot, synth2.rooms);
  const furn2: FurnitureGeometry[] = [];
  synth2.rooms.forEach(r => furn2.push(...createRoomFurniture(r)));
  const walls2 = extractWallGeometry(plot, synth2.rooms);
  const cols2 = generateConceptualColumnGrid(plot, synth2.rooms);
  const area2 = calculateAreaStatement(plot, synth2.rooms);
  const sched2 = compileScheduleOfOpenings(doors2, wins2);
  const tb2 = createTitleBlockInfo(plot, 'Option 02: Open-Concept Flow');

  const plan2: FloorPlanModel = {
    id: 'plan_opt_2',
    name: 'Option 02: Open-Concept Living Flow',
    tagline: 'Modern open great room integrating Living, Dining & Island Kitchen',
    badge: 'SPACIOUS LIVING',
    score: 92,
    builtUpAreaSqFt: synth2.builtUpAreaSqFt,
    carpetAreaSqFt: synth2.carpetAreaSqFt,
    coveragePercent: synth2.coveragePercent,
    scoreBreakdown: {
      spaceEfficiency: 94,
      naturalLight: 97,
      ventilation: 92,
      circulation: 95,
      privacy: 88,
      parking: 90
    },
    highlights: synth2.highlights,
    plot,
    rooms: synth2.rooms,
    doors: doors2,
    windows: wins2,
    furniture: furn2,
    walls: walls2,
    columns: cols2,
    ots: synth2.ots,
    schedule: sched2,
    areaStatement: area2,
    titleBlock: tb2,
    capacityReport
  };

  // 4. Synthesize Layout 3 (Vastu Harmonized)
  const synth3 = synthesizeOption3_Vastu(plot, requirements, capacityReport);
  const doors3 = generateArchitecturalDoors(synth3.rooms);
  const wins3 = generateArchitecturalWindows(plot, synth3.rooms);
  const furn3: FurnitureGeometry[] = [];
  synth3.rooms.forEach(r => furn3.push(...createRoomFurniture(r)));
  const walls3 = extractWallGeometry(plot, synth3.rooms);
  const cols3 = generateConceptualColumnGrid(plot, synth3.rooms);
  const area3 = calculateAreaStatement(plot, synth3.rooms);
  const sched3 = compileScheduleOfOpenings(doors3, wins3);
  const tb3 = createTitleBlockInfo(plot, 'Option 03: Vastu Shastra Harmonized');

  const plan3: FloorPlanModel = {
    id: 'plan_opt_3',
    name: 'Option 03: Vastu Shastra Harmonized',
    tagline: 'Master bedroom in SW, Kitchen in SE Agni zone, Pooja in NE Ishan corner',
    badge: 'VASTU COMPLIANT',
    score: 94,
    builtUpAreaSqFt: synth3.builtUpAreaSqFt,
    carpetAreaSqFt: synth3.carpetAreaSqFt,
    coveragePercent: synth3.coveragePercent,
    scoreBreakdown: {
      spaceEfficiency: 92,
      naturalLight: 95,
      ventilation: 94,
      circulation: 93,
      privacy: 95,
      parking: 92
    },
    highlights: synth3.highlights,
    plot,
    rooms: synth3.rooms,
    doors: doors3,
    windows: wins3,
    furniture: furn3,
    walls: walls3,
    columns: cols3,
    ots: synth3.ots,
    schedule: sched3,
    areaStatement: area3,
    titleBlock: tb3,
    capacityReport
  };

  return [plan1, plan2, plan3];
}

/**
 * Creates a clean starter FloorPlanModel for "Build Custom" mode.
 */
export function createCustomStarterModel(plot: PlotGeometry, _requirements?: RoomRequirement[]): FloorPlanModel {
  const setbackL = plot.setbacks.left;
  const setbackT = plot.setbacks.rear;
  const bldgW = roundToArchInches(Math.max(16, plot.width - (setbackL + plot.setbacks.right)));
  const bldgH = roundToArchInches(Math.max(20, plot.depth - (setbackT + plot.setbacks.front)));

  const rooms: RoomGeometry[] = [];
  const doors: DoorGeometry[] = [];
  const windows: WindowGeometry[] = [];
  const furniture: FurnitureGeometry[] = [];

  // Place 2 initial starter anchor rooms
  rooms.push({
    id: 'custom_living',
    name: 'Drawing / Living Room',
    category: 'living',
    x: setbackL,
    y: setbackT + roundToArchInches(bldgH * 0.4),
    width: roundToArchInches(bldgW * 0.6),
    height: roundToArchInches(bldgH * 0.4),
    zone: 'public',
    specs: { naturalLight: 'Daylight (90%)', privacy: 'Public', ventilation: 'Cross-Vent' }
  });
  doors.push({
    id: 'door_cust_main',
    roomId: 'custom_living',
    tag: 'D1',
    wallSide: 'bottom',
    offsetFt: 3.0,
    widthFt: 3.5,
    swing: 'in-left',
    type: 'single'
  });
  windows.push({
    id: 'win_cust_liv',
    roomId: 'custom_living',
    tag: 'W1',
    wallSide: 'left',
    offsetFt: roundToArchInches(bldgH * 0.2),
    widthFt: 5.0,
    heightFt: 4.5,
    type: 'standard'
  });

  rooms.push({
    id: 'custom_master',
    name: 'Master Bedroom',
    category: 'master_bedroom',
    x: setbackL,
    y: setbackT,
    width: roundToArchInches(bldgW * 0.5),
    height: roundToArchInches(bldgH * 0.38),
    zone: 'private',
    specs: { naturalLight: 'Daylight (95%)', privacy: 'Private', ventilation: 'Breeze' }
  });
  doors.push({
    id: 'door_cust_master',
    roomId: 'custom_master',
    tag: 'D2',
    wallSide: 'bottom',
    offsetFt: 2.0,
    widthFt: 3.0,
    swing: 'in-left',
    type: 'single'
  });

  rooms.forEach(r => furniture.push(...createRoomFurniture(r)));

  const carpet = roundToArchInches(rooms.reduce((sum, r) => sum + (r.width * r.height), 0));
  const walls = extractWallGeometry(plot, rooms);
  const cols = generateConceptualColumnGrid(plot, rooms);
  const area = calculateAreaStatement(plot, rooms);
  const sched = compileScheduleOfOpenings(doors, windows);
  const tb = createTitleBlockInfo(plot, 'Custom Architectural Canvas');

  return {
    id: 'plan_custom',
    name: 'Custom Architectural Canvas',
    tagline: 'Interactive workspace — Drag rooms, resize walls and place fixtures freely',
    badge: 'CUSTOM BLUEPRINT',
    score: 90,
    builtUpAreaSqFt: Math.round(carpet * 1.15),
    carpetAreaSqFt: Math.round(carpet),
    coveragePercent: Math.round((carpet / (plot.width * plot.depth)) * 100),
    scoreBreakdown: {
      spaceEfficiency: 90,
      naturalLight: 90,
      ventilation: 90,
      circulation: 90,
      privacy: 90,
      parking: 90
    },
    highlights: [
      'Custom blank plot boundary with active setbacks and snap grid',
      'Drag any room from the left library onto the canvas to place it',
      'Use the 8 resize handles to adjust dimensions live'
    ],
    plot,
    rooms,
    doors,
    windows,
    furniture,
    walls,
    columns: cols,
    schedule: sched,
    areaStatement: area,
    titleBlock: tb
  };
}
