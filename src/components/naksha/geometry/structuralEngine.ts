import type {
  PlotGeometry,
  RoomGeometry,
  DoorGeometry,
  WindowGeometry,
  WallGeometry,
  ColumnGeometry,
  ScheduleEntry,
  AreaStatement,
  TitleBlockInfo
} from './types';
import { roundToArchInches } from './architecturalEngine';

/**
 * Extracts double-line walls (9" exterior, 4.5" interior) from rooms and building envelope.
 */
export function extractWallGeometry(
  plot: PlotGeometry,
  rooms: RoomGeometry[]
): WallGeometry[] {
  const walls: WallGeometry[] = [];
  const setbackL = plot.setbacks.left;
  const setbackT = plot.setbacks.rear;
  const bldgW = roundToArchInches(Math.max(16, plot.width - (setbackL + plot.setbacks.right)));
  const bldgH = roundToArchInches(Math.max(20, plot.depth - (setbackT + plot.setbacks.front)));

  // 1. Exterior Perimeter Walls (9 inches = 0.75 ft)
  walls.push({
    id: 'wall_ext_top',
    start: { x: setbackL, y: setbackT },
    end: { x: setbackL + bldgW, y: setbackT },
    thickness: 0.75,
    isExterior: true,
    sharedRoomIds: []
  });
  walls.push({
    id: 'wall_ext_bottom',
    start: { x: setbackL, y: setbackT + bldgH },
    end: { x: setbackL + bldgW, y: setbackT + bldgH },
    thickness: 0.75,
    isExterior: true,
    sharedRoomIds: []
  });
  walls.push({
    id: 'wall_ext_left',
    start: { x: setbackL, y: setbackT },
    end: { x: setbackL, y: setbackT + bldgH },
    thickness: 0.75,
    isExterior: true,
    sharedRoomIds: []
  });
  walls.push({
    id: 'wall_ext_right',
    start: { x: setbackL + bldgW, y: setbackT },
    end: { x: setbackL + bldgW, y: setbackT + bldgH },
    thickness: 0.75,
    isExterior: true,
    sharedRoomIds: []
  });

  // 2. Interior Partition Walls (4.5 inches = 0.375 ft)
  rooms.forEach((room) => {
    // Top partition wall if not on exterior boundary
    if (Math.abs(room.y - setbackT) > 0.5) {
      walls.push({
        id: `wall_intr_${room.id}_top`,
        start: { x: room.x, y: room.y },
        end: { x: room.x + room.width, y: room.y },
        thickness: 0.375,
        isExterior: false,
        sharedRoomIds: [room.id]
      });
    }
    // Left partition wall if not on exterior boundary
    if (Math.abs(room.x - setbackL) > 0.5) {
      walls.push({
        id: `wall_intr_${room.id}_left`,
        start: { x: room.x, y: room.y },
        end: { x: room.x, y: room.y + room.height },
        thickness: 0.375,
        isExterior: false,
        sharedRoomIds: [room.id]
      });
    }
  });

  return walls;
}

/**
 * Places conceptual structural RCC column markers (9"x12") at structural junctions.
 * Clearly tagged as preliminary conceptual grid only.
 */
export function generateConceptualColumnGrid(
  plot: PlotGeometry,
  rooms: RoomGeometry[]
): ColumnGeometry[] {
  const columns: ColumnGeometry[] = [];
  const colSet = new Set<string>();

  const addCol = (x: number, y: number) => {
    const rx = roundToArchInches(x);
    const ry = roundToArchInches(y);
    const key = `${rx}_${ry}`;
    if (!colSet.has(key)) {
      colSet.add(key);
      columns.push({
        id: `col_${columns.length + 1}`,
        tag: `C${columns.length + 1}`,
        x: rx,
        y: ry,
        widthFt: 0.75, // 9 inches
        heightFt: 1.0,  // 12 inches
        orientation: 'vertical',
        isConceptual: true
      });
    }
  };

  const setbackL = plot.setbacks.left;
  const setbackT = plot.setbacks.rear;
  const bldgW = roundToArchInches(Math.max(16, plot.width - (setbackL + plot.setbacks.right)));
  const bldgH = roundToArchInches(Math.max(20, plot.depth - (setbackT + plot.setbacks.front)));

  // 1. Perimeter four corners
  addCol(setbackL, setbackT);
  addCol(setbackL + bldgW, setbackT);
  addCol(setbackL, setbackT + bldgH);
  addCol(setbackL + bldgW, setbackT + bldgH);

  // 2. Intermediate nodes from room intersections
  rooms.forEach((r) => {
    addCol(r.x, r.y);
    addCol(r.x + r.width, r.y);
    addCol(r.x, r.y + r.height);
    addCol(r.x + r.width, r.y + r.height);
  });

  return columns;
}

/**
 * Generates architecturally positioned doors with corner offsets and swing arcs.
 */
export function generateArchitecturalDoors(rooms: RoomGeometry[]): DoorGeometry[] {
  const doors: DoorGeometry[] = [];

  rooms.forEach((room) => {
    const { id: roomId, category, width, height } = room;

    switch (category) {
      case 'living':
        // Main entrance door (D1: 3.5' or 4.0' wide)
        doors.push({
          id: `door_${roomId}_main`,
          roomId,
          tag: 'D1',
          wallSide: 'bottom',
          offsetFt: Math.max(1.0, width * 0.45),
          widthFt: 3.5,
          heightFt: 7.0,
          swing: 'in-left',
          type: 'single'
        });
        break;

      case 'master_bedroom':
        // Bedroom door (D2: 3.0' wide) positioned near corridor entry
        doors.push({
          id: `door_${roomId}_ent`,
          roomId,
          tag: 'D2',
          wallSide: 'bottom',
          offsetFt: 0.5,
          widthFt: 3.0,
          heightFt: 7.0,
          swing: 'in-left',
          type: 'single'
        });
        break;

      case 'bedroom':
        doors.push({
          id: `door_${roomId}_ent`,
          roomId,
          tag: 'D2',
          wallSide: 'bottom',
          offsetFt: Math.max(0.5, width - 3.5),
          widthFt: 3.0,
          heightFt: 7.0,
          swing: 'in-right',
          type: 'single'
        });
        break;

      case 'kitchen':
        // Kitchen opening or sliding door (D3: 2.75' wide)
        doors.push({
          id: `door_${roomId}_ent`,
          roomId,
          tag: 'D3',
          wallSide: 'left',
          offsetFt: 0.5,
          widthFt: 2.75,
          heightFt: 7.0,
          swing: 'in-left',
          type: 'opening'
        });
        break;

      case 'bathroom':
        // Toilet door (D3: 2.5' wide)
        doors.push({
          id: `door_${roomId}_ent`,
          roomId,
          tag: 'D3',
          wallSide: width < height ? 'left' : 'bottom',
          offsetFt: 0.35,
          widthFt: 2.5,
          heightFt: 7.0,
          swing: 'out-left',
          type: 'single'
        });
        break;

      case 'veranda':
        // Verandah open access
        break;

      case 'parking':
        // Open porch
        break;

      default:
        if (width >= 6 && height >= 6) {
          doors.push({
            id: `door_${roomId}_ent`,
            roomId,
            tag: 'D3',
            wallSide: 'bottom',
            offsetFt: 0.5,
            widthFt: 2.75,
            heightFt: 7.0,
            swing: 'in-left',
            type: 'single'
          });
        }
        break;
    }
  });

  return doors;
}

/**
 * Generates architectural windows and ventilators on exterior walls and OTS shafts.
 */
export function generateArchitecturalWindows(
  plot: PlotGeometry,
  rooms: RoomGeometry[]
): WindowGeometry[] {
  const windows: WindowGeometry[] = [];
  const setbackL = plot.setbacks.left;
  const setbackT = plot.setbacks.rear;
  const bldgW = roundToArchInches(Math.max(16, plot.width - (setbackL + plot.setbacks.right)));
  const bldgH = roundToArchInches(Math.max(20, plot.depth - (setbackT + plot.setbacks.front)));

  rooms.forEach((room) => {
    const { id: roomId, category, x, y, width, height } = room;

    const isOnTopEdge = Math.abs(y - setbackT) < 0.5;
    const isOnBottomEdge = Math.abs(y + height - (setbackT + bldgH)) < 0.5;
    const isOnLeftEdge = Math.abs(x - setbackL) < 0.5;
    const isOnRightEdge = Math.abs(x + width - (setbackL + bldgW)) < 0.5;

    switch (category) {
      case 'living':
        // Large panoramic window on exterior side or front
        if (isOnLeftEdge) {
          windows.push({
            id: `win_${roomId}_1`,
            roomId,
            tag: 'W1',
            wallSide: 'left',
            offsetFt: roundToArchInches(height * 0.5),
            widthFt: 5.0,
            heightFt: 4.5,
            sillHeightFt: 2.5,
            type: 'standard'
          });
        } else if (isOnBottomEdge) {
          windows.push({
            id: `win_${roomId}_1`,
            roomId,
            tag: 'W1',
            wallSide: 'bottom',
            offsetFt: roundToArchInches(width * 0.5),
            widthFt: 5.0,
            heightFt: 4.5,
            sillHeightFt: 2.5,
            type: 'standard'
          });
        }
        break;

      case 'master_bedroom':
        if (isOnTopEdge) {
          windows.push({
            id: `win_${roomId}_1`,
            roomId,
            tag: 'W2',
            wallSide: 'top',
            offsetFt: roundToArchInches(width * 0.5),
            widthFt: 4.0,
            heightFt: 4.0,
            sillHeightFt: 3.0,
            type: 'standard'
          });
        } else if (isOnLeftEdge) {
          windows.push({
            id: `win_${roomId}_1`,
            roomId,
            tag: 'W2',
            wallSide: 'left',
            offsetFt: roundToArchInches(height * 0.5),
            widthFt: 4.0,
            heightFt: 4.0,
            sillHeightFt: 3.0,
            type: 'standard'
          });
        }
        break;

      case 'bedroom':
        if (isOnTopEdge) {
          windows.push({
            id: `win_${roomId}_1`,
            roomId,
            tag: 'W2',
            wallSide: 'top',
            offsetFt: roundToArchInches(width * 0.5),
            widthFt: 4.0,
            heightFt: 4.0,
            sillHeightFt: 3.0,
            type: 'standard'
          });
        } else if (isOnRightEdge) {
          windows.push({
            id: `win_${roomId}_1`,
            roomId,
            tag: 'W2',
            wallSide: 'right',
            offsetFt: roundToArchInches(height * 0.5),
            widthFt: 4.0,
            heightFt: 4.0,
            sillHeightFt: 3.0,
            type: 'standard'
          });
        }
        break;

      case 'kitchen':
        if (isOnRightEdge) {
          windows.push({
            id: `win_${roomId}_1`,
            roomId,
            tag: 'W3',
            wallSide: 'right',
            offsetFt: roundToArchInches(height * 0.5),
            widthFt: 3.5,
            heightFt: 3.5,
            sillHeightFt: 3.5,
            type: 'standard'
          });
        }
        break;

      case 'bathroom':
        // High ventilator
        windows.push({
          id: `win_${roomId}_vent`,
          roomId,
          tag: 'V1',
          wallSide: isOnTopEdge ? 'top' : isOnRightEdge ? 'right' : 'top',
          offsetFt: roundToArchInches(width * 0.5),
          widthFt: 2.0,
          heightFt: 1.5,
          sillHeightFt: 5.5,
          type: 'ventilator'
        });
        break;
    }
  });

  return windows;
}

/**
 * Calculates Area Statement conforming to standard architectural presentation.
 */
export function calculateAreaStatement(
  plot: PlotGeometry,
  rooms: RoomGeometry[]
): AreaStatement {
  const plotAreaSqFt = roundToArchInches(plot.width * plot.depth);
  const plotAreaSqYd = roundToArchInches(plotAreaSqFt / 9.0);

  const carpetAreaSqFt = roundToArchInches(
    rooms.reduce((acc, r) => acc + (r.width * r.height), 0)
  );

  const builtUpAreaSqFt = roundToArchInches(carpetAreaSqFt * 1.15);
  const setbackAreaSqFt = roundToArchInches(plotAreaSqFt - builtUpAreaSqFt);
  const groundCoveragePercent = roundToArchInches((builtUpAreaSqFt / plotAreaSqFt) * 100);
  const efficiencyPercent = roundToArchInches((carpetAreaSqFt / builtUpAreaSqFt) * 100);

  return {
    plotAreaSqFt,
    plotAreaSqYd,
    groundCoverageSqFt: builtUpAreaSqFt,
    groundCoveragePercent,
    carpetAreaSqFt,
    builtUpAreaSqFt,
    setbackAreaSqFt,
    efficiencyPercent
  };
}

/**
 * Compiles the Schedule of Openings table.
 */
export function compileScheduleOfOpenings(
  doors: DoorGeometry[],
  windows: WindowGeometry[]
): ScheduleEntry[] {
  const schedule: ScheduleEntry[] = [
    {
      tag: 'D1',
      type: 'door',
      widthFt: 3.5,
      heightFt: 7.0,
      lintelHeightFt: 7.0,
      count: doors.filter(d => d.tag === 'D1').length || 1,
      description: 'Main Entrance Teak Wood / Flush Door'
    },
    {
      tag: 'D2',
      type: 'door',
      widthFt: 3.0,
      heightFt: 7.0,
      lintelHeightFt: 7.0,
      count: doors.filter(d => d.tag === 'D2').length || 2,
      description: 'Internal Bedroom Timber Panel Door'
    },
    {
      tag: 'D3',
      type: 'door',
      widthFt: 2.5,
      heightFt: 7.0,
      lintelHeightFt: 7.0,
      count: doors.filter(d => d.tag === 'D3').length || 2,
      description: 'Toilet / Kitchen Moisture-Resistant Door'
    },
    {
      tag: 'W1',
      type: 'window',
      widthFt: 5.0,
      heightFt: 4.5,
      sillHeightFt: 2.5,
      lintelHeightFt: 7.0,
      count: windows.filter(w => w.tag === 'W1').length || 1,
      description: 'Living Room UPVC Glazed Sliding Window'
    },
    {
      tag: 'W2',
      type: 'window',
      widthFt: 4.0,
      heightFt: 4.0,
      sillHeightFt: 3.0,
      lintelHeightFt: 7.0,
      count: windows.filter(w => w.tag === 'W2').length || 2,
      description: 'Bedroom 2-Track Glazed Casement Window'
    },
    {
      tag: 'W3',
      type: 'window',
      widthFt: 3.5,
      heightFt: 3.5,
      sillHeightFt: 3.5,
      lintelHeightFt: 7.0,
      count: windows.filter(w => w.tag === 'W3').length || 1,
      description: 'Kitchen Counter Glazed Louvered Window'
    },
    {
      tag: 'V1',
      type: 'ventilator',
      widthFt: 2.0,
      heightFt: 1.5,
      sillHeightFt: 5.5,
      lintelHeightFt: 7.0,
      count: windows.filter(w => w.tag === 'V1').length || 2,
      description: 'Toilet High Ventilator with Exhaust Provision'
    }
  ];

  return schedule.filter(s => s.count > 0);
}

/**
 * Creates standard architectural drawing title block metadata.
 */
export function createTitleBlockInfo(
  plot: PlotGeometry,
  planName: string
): TitleBlockInfo {
  const plotDimText = `${roundToArchInches(plot.width)}'-0" × ${roundToArchInches(plot.depth)}'-0" (${Math.round((plot.width * plot.depth) / 9)} Sq. Yd.)`;

  return {
    projectTitle: `RESIDENTIAL NAKSHA — ${planName.toUpperCase()}`,
    clientName: 'PREPARED FOR PROVEWISE CLIENT',
    location: `${plotDimText} | ${plot.roadFacing} Road Facing`,
    roadFacing: plot.roadFacing,
    scale: '1:100 (Conceptual CAD Drafting)',
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    drawingNo: `PW-ARCH-${Date.now().toString().slice(-6)}`,
    disclaimer: 'DISCLAIMER: This drawing is a preliminary conceptual space planning layout. It is not an engineered structural design, sanctioned municipal approval, or certified construction drawing. Sizing, setbacks, and RCC details must be verified by a licensed architect or structural engineer prior to site execution.'
  };
}
