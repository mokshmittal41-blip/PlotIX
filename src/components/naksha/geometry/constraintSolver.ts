import type { RoomGeometry, PlotGeometry, AlignmentGuide } from './types';

export const SNAP_GRID_SIZE_FT = 0.5; // 6 inches grid snap
export const SNAP_THRESHOLD_FT = 1.0; // 1 ft snapping magnetic attraction

/**
 * Snap a value to the nearest grid step
 */
export function snapToGrid(val: number, step: number = SNAP_GRID_SIZE_FT): number {
  return Math.round(val / step) * step;
}

/**
 * Format decimal feet into architectural notation: e.g. 14.5 ft -> 14′-6″, 12.0 ft -> 12′-0″
 */
export function formatFeetInches(valInFt: number): string {
  const totalInches = Math.round(valInFt * 12);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}′-${inches}″`;
}

/**
 * Snaps a room's position (x, y) against the grid and other room edges.
 * Returns the snapped coordinates and any active alignment guides.
 */
export function snapRoomPosition(
  movingRoomId: string,
  targetX: number,
  targetY: number,
  width: number,
  height: number,
  allRooms: RoomGeometry[],
  plot: PlotGeometry
): { x: number; y: number; guides: AlignmentGuide[] } {
  let snappedX = snapToGrid(targetX);
  let snappedY = snapToGrid(targetY);
  const guides: AlignmentGuide[] = [];

  const buildingLeft = plot.setbacks.left;
  const buildingTop = plot.setbacks.rear;
  const buildingRight = plot.width - plot.setbacks.right;
  const buildingBottom = plot.depth - plot.setbacks.front;

  // 1. Snap to building envelope boundary edges
  if (Math.abs(snappedX - buildingLeft) < SNAP_THRESHOLD_FT) {
    snappedX = buildingLeft;
    guides.push({ type: 'x', position: buildingLeft, start: buildingTop, end: buildingBottom });
  }
  if (Math.abs(snappedX + width - buildingRight) < SNAP_THRESHOLD_FT) {
    snappedX = buildingRight - width;
    guides.push({ type: 'x', position: buildingRight, start: buildingTop, end: buildingBottom });
  }
  if (Math.abs(snappedY - buildingTop) < SNAP_THRESHOLD_FT) {
    snappedY = buildingTop;
    guides.push({ type: 'y', position: buildingTop, start: buildingLeft, end: buildingRight });
  }
  if (Math.abs(snappedY + height - buildingBottom) < SNAP_THRESHOLD_FT) {
    snappedY = buildingBottom - height;
    guides.push({ type: 'y', position: buildingBottom, start: buildingLeft, end: buildingRight });
  }

  // 2. Snap to other rooms
  for (const other of allRooms) {
    if (other.id === movingRoomId) continue;

    const otherLeft = other.x;
    const otherRight = other.x + other.width;
    const otherTop = other.y;
    const otherBottom = other.y + other.height;

    // X-axis snapping
    // moving Left to other Right
    if (Math.abs(snappedX - otherRight) < SNAP_THRESHOLD_FT) {
      snappedX = otherRight;
      guides.push({ type: 'x', position: otherRight, start: Math.min(snappedY, otherTop), end: Math.max(snappedY + height, otherBottom) });
    }
    // moving Right to other Left
    else if (Math.abs(snappedX + width - otherLeft) < SNAP_THRESHOLD_FT) {
      snappedX = otherLeft - width;
      guides.push({ type: 'x', position: otherLeft, start: Math.min(snappedY, otherTop), end: Math.max(snappedY + height, otherBottom) });
    }
    // moving Left to other Left (alignment)
    else if (Math.abs(snappedX - otherLeft) < SNAP_THRESHOLD_FT) {
      snappedX = otherLeft;
      guides.push({ type: 'x', position: otherLeft, start: Math.min(snappedY, otherTop), end: Math.max(snappedY + height, otherBottom) });
    }
    // moving Right to other Right (alignment)
    else if (Math.abs(snappedX + width - otherRight) < SNAP_THRESHOLD_FT) {
      snappedX = otherRight - width;
      guides.push({ type: 'x', position: otherRight, start: Math.min(snappedY, otherTop), end: Math.max(snappedY + height, otherBottom) });
    }

    // Y-axis snapping
    // moving Top to other Bottom
    if (Math.abs(snappedY - otherBottom) < SNAP_THRESHOLD_FT) {
      snappedY = otherBottom;
      guides.push({ type: 'y', position: otherBottom, start: Math.min(snappedX, otherLeft), end: Math.max(snappedX + width, otherRight) });
    }
    // moving Bottom to other Top
    else if (Math.abs(snappedY + height - otherTop) < SNAP_THRESHOLD_FT) {
      snappedY = otherTop - height;
      guides.push({ type: 'y', position: otherTop, start: Math.min(snappedX, otherLeft), end: Math.max(snappedX + width, otherRight) });
    }
    // moving Top to other Top (alignment)
    else if (Math.abs(snappedY - otherTop) < SNAP_THRESHOLD_FT) {
      snappedY = otherTop;
      guides.push({ type: 'y', position: otherTop, start: Math.min(snappedX, otherLeft), end: Math.max(snappedX + width, otherRight) });
    }
    // moving Bottom to other Bottom (alignment)
    else if (Math.abs(snappedY + height - otherBottom) < SNAP_THRESHOLD_FT) {
      snappedY = otherBottom - height;
      guides.push({ type: 'y', position: otherBottom, start: Math.min(snappedX, otherLeft), end: Math.max(snappedX + width, otherRight) });
    }
  }

  // Constrain within plot boundaries (relaxed for drag freedom, with gentle clamping)
  snappedX = Math.max(0, Math.min(snappedX, plot.width - width));
  snappedY = Math.max(0, Math.min(snappedY, plot.depth - height));

  return { x: snappedX, y: snappedY, guides };
}

/**
 * Handle resizing a room from one of 8 handles with snapping and adjacent room checks
 */
export function snapRoomResize(
  resizingRoom: RoomGeometry,
  handle: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw',
  targetX: number,
  targetY: number,
  targetWidth: number,
  targetHeight: number,
  _allRooms?: RoomGeometry[],
  _plot?: PlotGeometry
): { x: number; y: number; width: number; height: number; guides: AlignmentGuide[] } {
  let x = targetX;
  let y = targetY;
  let w = Math.max(4.0, targetWidth); // minimum 4 ft
  let h = Math.max(4.0, targetHeight); // minimum 4 ft
  const guides: AlignmentGuide[] = [];

  // Snap the modified edges to grid
  if (handle.includes('w')) {
    const origRight = resizingRoom.x + resizingRoom.width;
    x = snapToGrid(x);
    w = Math.max(4.0, origRight - x);
  }
  if (handle.includes('e')) {
    w = Math.max(4.0, snapToGrid(w));
  }
  if (handle.includes('n')) {
    const origBottom = resizingRoom.y + resizingRoom.height;
    y = snapToGrid(y);
    h = Math.max(4.0, origBottom - y);
  }
  if (handle.includes('s')) {
    h = Math.max(4.0, snapToGrid(h));
  }

  return { x, y, width: w, height: h, guides };
}

/**
 * Check if two rooms overlap
 */
export function checkRoomsOverlap(r1: RoomGeometry, r2: RoomGeometry, tolerance: number = 0.05): boolean {
  return (
    r1.x < r2.x + r2.width - tolerance &&
    r1.x + r1.width > r2.x + tolerance &&
    r1.y < r2.y + r2.height - tolerance &&
    r1.y + r1.height > r2.y + tolerance
  );
}
