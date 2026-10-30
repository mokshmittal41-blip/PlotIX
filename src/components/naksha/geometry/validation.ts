import type { FloorPlanModel, ValidationIssue } from './types';
import { checkRoomsOverlap, formatFeetInches } from './constraintSolver';

/**
 * Validates a complete FloorPlanModel and returns any errors or warnings.
 */
export function validateFloorPlan(model: FloorPlanModel): { isValid: boolean; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];

  const { plot, rooms, doors, windows, furniture } = model;
  const buildingLeft = plot.setbacks.left;
  const buildingTop = plot.setbacks.rear;
  const buildingRight = plot.width - plot.setbacks.right;
  const buildingBottom = plot.depth - plot.setbacks.front;

  // 1. Minimum room dimensions & Plot containment
  rooms.forEach((room) => {
    if (room.width < 4.0 || room.height < 4.0) {
      issues.push({
        id: `min_dim_${room.id}`,
        type: 'error',
        title: 'Room Too Small',
        message: `${room.name} dimension is ${formatFeetInches(room.width)} × ${formatFeetInches(room.height)}. Minimum allowed size is 4′-0″ × 4′-0″.`,
        elementId: room.id
      });
    }

    // Check plot boundary
    if (room.x < 0 || room.y < 0 || room.x + room.width > plot.width || room.y + room.height > plot.depth) {
      issues.push({
        id: `plot_bound_${room.id}`,
        type: 'error',
        title: 'Plot Boundary Breach',
        message: `${room.name} extends outside the plot boundaries.`,
        elementId: room.id
      });
    }

    // Setback warning (except for parking, garden, balcony, porch)
    const isOutdoorOrService = ['parking', 'garden', 'balcony', 'veranda', 'entrance'].includes(room.category);
    if (!isOutdoorOrService) {
      if (room.x < buildingLeft || room.y < buildingTop || room.x + room.width > buildingRight || room.y + room.height > buildingBottom) {
        issues.push({
          id: `setback_${room.id}`,
          type: 'warning',
          title: 'Setback Encroachment',
          message: `${room.name} extends into mandatory setbacks (Front: ${plot.setbacks.front}′, Rear: ${plot.setbacks.rear}′, Side: ${plot.setbacks.left}′).`,
          elementId: room.id
        });
      }
    }
  });

  // 2. Room Overlap Check
  for (let i = 0; i < rooms.length; i++) {
    for (let j = i + 1; j < rooms.length; j++) {
      const r1 = rooms[i];
      const r2 = rooms[j];
      if (checkRoomsOverlap(r1, r2, 0.1)) {
        issues.push({
          id: `overlap_${r1.id}_${r2.id}`,
          type: 'error',
          title: 'Room Collision',
          message: `${r1.name} overlaps with ${r2.name}. Please separate them or align their shared boundary.`,
          elementId: r1.id
        });
      }
    }
  }

  // 3. Furniture containment check
  furniture.forEach((item) => {
    const hostRoom = rooms.find(r => r.id === item.roomId);
    if (!hostRoom) {
      issues.push({
        id: `furniture_orphan_${item.id}`,
        type: 'warning',
        title: 'Orphaned Fixture',
        message: `Furniture item (${item.type}) is not associated with an existing room.`,
        elementId: item.id
      });
    } else {
      if (item.x < 0 || item.y < 0 || item.x + item.width > hostRoom.width || item.y + item.height > hostRoom.height) {
        issues.push({
          id: `furniture_bounds_${item.id}`,
          type: 'warning',
          title: 'Fixture Outside Room',
          message: `Fixture in ${hostRoom.name} extends past room walls.`,
          elementId: item.id
        });
      }
    }
  });

  // 4. Doors attachment check
  doors.forEach((door) => {
    const hostRoom = rooms.find(r => r.id === door.roomId);
    if (!hostRoom) {
      issues.push({
        id: `door_orphan_${door.id}`,
        type: 'error',
        title: 'Detached Door',
        message: `Door opening is not attached to any room.`,
        elementId: door.id
      });
    }
  });

  // 5. Windows attachment check
  windows.forEach((win) => {
    const hostRoom = rooms.find(r => r.id === win.roomId);
    if (!hostRoom) {
      issues.push({
        id: `win_orphan_${win.id}`,
        type: 'error',
        title: 'Detached Window',
        message: `Window opening is not attached to any room.`,
        elementId: win.id
      });
    }
  });

  const hasErrors = issues.some(i => i.type === 'error');
  return {
    isValid: !hasErrors,
    issues
  };
}
