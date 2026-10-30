export type PlotShape = 'Rectangle' | 'Square' | 'Irregular';
export type RoadFacing = 'North' | 'South' | 'East' | 'West' | 'Corner Plot' | 'Two-Side Road';

export interface Setbacks {
  front: number; // in feet
  rear: number;  // in feet
  left: number;  // in feet
  right: number; // in feet
}

export interface PlotGeometry {
  width: number;  // in feet (frontage)
  depth: number;  // in feet (depth)
  unit: 'ft';
  shape: PlotShape;
  roadFacing: RoadFacing;
  orientation: number; // degrees, 0 = North
  setbacks: Setbacks;
}

export type RoomCategory = 
  | 'master_bedroom'
  | 'bedroom'
  | 'living'
  | 'dining'
  | 'kitchen'
  | 'bathroom'
  | 'puja'
  | 'study'
  | 'store'
  | 'utility'
  | 'balcony'
  | 'parking'
  | 'entrance'
  | 'staircase'
  | 'garden'
  | 'veranda'
  | 'ots'
  | 'custom';

export interface RoomGeometry {
  id: string;
  name: string;
  category: RoomCategory;
  x: number;      // in feet, relative to building origin (or plot origin)
  y: number;      // in feet
  width: number;  // in feet
  height: number; // in feet
  wallThickness?: number; // default 0.375 ft (4.5")
  isWetArea?: boolean;
  zone?: 'public' | 'private' | 'service' | 'circulation' | 'outdoor';
  specs?: {
    naturalLight: string;
    privacy: string;
    ventilation: string;
    vastuZone?: string;
  };
  color?: string;
}

export interface DoorGeometry {
  id: string;
  roomId: string;
  targetRoomId?: string;
  tag?: string; // e.g. 'D1', 'D2', 'D3'
  wallSide: 'top' | 'bottom' | 'left' | 'right';
  offsetFt: number; // Distance in feet from wall start
  widthFt: number;  // Door opening width in feet (e.g. 2.5, 3.0, 3.5, 4.0)
  heightFt?: number; // e.g. 7.0
  swing: 'in-left' | 'in-right' | 'out-left' | 'out-right';
  openAngle?: number; // default 90 degrees
  type: 'single' | 'double' | 'sliding' | 'opening';
}

export interface WindowGeometry {
  id: string;
  roomId: string;
  tag?: string; // e.g. 'W1', 'W2', 'V1'
  wallSide: 'top' | 'bottom' | 'left' | 'right';
  offsetFt: number; // Distance in feet from wall start to window center/start
  widthFt: number;  // Window width in feet (e.g. 2.0, 3.0, 4.0, 5.0)
  heightFt?: number; // e.g. 4.0, 1.5
  sillHeightFt?: number; // e.g. 3.0, 5.5
  type: 'standard' | 'french' | 'ventilator';
}

export type FurnitureType =
  | 'bed_king'
  | 'bed_queen'
  | 'bed_single'
  | 'wardrobe'
  | 'sofa_sectional'
  | 'sofa_3seater'
  | 'coffee_table'
  | 'tv_unit'
  | 'dining_table'
  | 'kitchen_counter_l'
  | 'kitchen_counter_straight'
  | 'kitchen_hob'
  | 'kitchen_sink'
  | 'refrigerator'
  | 'toilet_wc'
  | 'wash_basin'
  | 'shower_stall'
  | 'car_sedan'
  | 'staircase'
  | 'mandir_altar'
  | 'desk_study'
  | 'plant_pot';

export interface FurnitureGeometry {
  id: string;
  roomId: string;
  type: FurnitureType;
  x: number;      // in feet, relative to room top-left corner
  y: number;      // in feet, relative to room top-left corner
  width: number;  // in feet
  height: number; // in feet
  rotation: number; // 0, 90, 180, 270 degrees
}

export interface WallGeometry {
  id: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  thickness: number; // e.g. 0.75 ft (9") for exterior, 0.375 ft (4.5") for interior
  isExterior: boolean;
  sharedRoomIds: string[];
}

export interface ColumnGeometry {
  id: string;
  tag: string; // e.g. 'C1', 'C2'
  x: number;   // center x in feet
  y: number;   // center y in feet
  widthFt: number; // e.g. 0.75 (9")
  heightFt: number; // e.g. 1.0 (12") or 1.25 (15")
  orientation: 'horizontal' | 'vertical';
  isConceptual: true;
}

export interface OTSGeometry {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  servesRooms: string[];
}

export interface DimensionMarker {
  id: string;
  type: 'linear' | 'room' | 'setback';
  start: { x: number; y: number };
  end: { x: number; y: number };
  text: string;
  offset: number;
  orientation: 'horizontal' | 'vertical';
}

export interface ScheduleEntry {
  tag: string;
  type: 'door' | 'window' | 'ventilator';
  widthFt: number;
  heightFt: number;
  sillHeightFt?: number;
  lintelHeightFt: number;
  count: number;
  description: string;
}

export interface AreaStatement {
  plotAreaSqFt: number;
  plotAreaSqYd: number;
  groundCoverageSqFt: number;
  groundCoveragePercent: number;
  carpetAreaSqFt: number;
  builtUpAreaSqFt: number;
  setbackAreaSqFt: number;
  efficiencyPercent: number;
}

export interface TitleBlockInfo {
  projectTitle: string;
  clientName: string;
  location: string;
  roadFacing: string;
  scale: string;
  date: string;
  drawingNo: string;
  disclaimer: string;
}

export interface CapacityReport {
  status: 'feasible' | 'tight' | 'exceeded';
  availableBuildableSqFt: number;
  totalRequestedCarpetSqFt: number;
  recommendedMaxRooms: number;
  message: string;
  suggestions: string[];
}

export interface FloorPlanModel {
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
  plot: PlotGeometry;
  rooms: RoomGeometry[];
  doors: DoorGeometry[];
  windows: WindowGeometry[];
  furniture: FurnitureGeometry[];
  walls?: WallGeometry[];
  columns?: ColumnGeometry[];
  ots?: OTSGeometry[];
  dimensions?: DimensionMarker[];
  schedule?: ScheduleEntry[];
  areaStatement?: AreaStatement;
  titleBlock?: TitleBlockInfo;
  capacityReport?: CapacityReport;
}

export interface RoomRequirement {
  id: string;
  name: string;
  category: RoomCategory;
  count: number;
  widthFt: number;
  heightFt: number;
  preset: 'compact' | 'standard' | 'spacious' | 'custom';
  description?: string;
  icon?: string;
}

export interface SpacePreset {
  compact: { width: number; height: number };
  standard: { width: number; height: number };
  spacious: { width: number; height: number };
}

export interface AIChangeProposal {
  id: string;
  summary: string;
  explanation: string;
  affectedRoomNames: string[];
  proposedModel: FloorPlanModel;
  diffSummary: Array<{
    target: string;
    changeType: 'move' | 'resize' | 'add' | 'remove' | 'door' | 'window' | 'furniture';
    before?: string;
    after: string;
  }>;
}

export interface ValidationIssue {
  id: string;
  type: 'error' | 'warning';
  title: string;
  message: string;
  elementId?: string;
}

export interface AlignmentGuide {
  type: 'x' | 'y';
  position: number; // ft
  start: number;    // ft
  end: number;      // ft
}
