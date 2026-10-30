import type { RoomGeometry, DoorGeometry, WindowGeometry } from './types';

export interface WallSegment {
  id: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  thickness: number; // 0.75 ft for exterior, 0.375 ft for interior
  isExterior: boolean;
  orientation: 'horizontal' | 'vertical';
  roomIds: string[];
  doors: DoorGeometry[];
  windows: WindowGeometry[];
}

/**
 * Extracts unique structural wall segments from the list of room geometries.
 */
export function extractWalls(
  rooms: RoomGeometry[],
  doors: DoorGeometry[] = [],
  windows: WindowGeometry[] = []
): WallSegment[] {
  const walls: WallSegment[] = [];

  // Each room has 4 edges: top, bottom, left, right
  rooms.forEach((room) => {
    // Top wall
    walls.push({
      id: `wall_${room.id}_top`,
      start: { x: room.x, y: room.y },
      end: { x: room.x + room.width, y: room.y },
      thickness: 0.375,
      isExterior: false,
      orientation: 'horizontal',
      roomIds: [room.id],
      doors: doors.filter(d => d.roomId === room.id && d.wallSide === 'top'),
      windows: windows.filter(w => w.roomId === room.id && w.wallSide === 'top')
    });

    // Bottom wall
    walls.push({
      id: `wall_${room.id}_bottom`,
      start: { x: room.x, y: room.y + room.height },
      end: { x: room.x + room.width, y: room.y + room.height },
      thickness: 0.375,
      isExterior: false,
      orientation: 'horizontal',
      roomIds: [room.id],
      doors: doors.filter(d => d.roomId === room.id && d.wallSide === 'bottom'),
      windows: windows.filter(w => w.roomId === room.id && w.wallSide === 'bottom')
    });

    // Left wall
    walls.push({
      id: `wall_${room.id}_left`,
      start: { x: room.x, y: room.y },
      end: { x: room.x, y: room.y + room.height },
      thickness: 0.375,
      isExterior: false,
      orientation: 'vertical',
      roomIds: [room.id],
      doors: doors.filter(d => d.roomId === room.id && d.wallSide === 'left'),
      windows: windows.filter(w => w.roomId === room.id && w.wallSide === 'left')
    });

    // Right wall
    walls.push({
      id: `wall_${room.id}_right`,
      start: { x: room.x + room.width, y: room.y },
      end: { x: room.x + room.width, y: room.y + room.height },
      thickness: 0.375,
      isExterior: false,
      orientation: 'vertical',
      roomIds: [room.id],
      doors: doors.filter(d => d.roomId === room.id && d.wallSide === 'right'),
      windows: windows.filter(w => w.roomId === room.id && w.wallSide === 'right')
    });
  });

  return walls;
}
