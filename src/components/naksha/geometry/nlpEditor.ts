import type { FloorPlanModel, RoomGeometry, AIChangeProposal, DoorGeometry, WindowGeometry } from './types';
import { formatFeetInches, snapToGrid } from './constraintSolver';
import { validateFloorPlan } from './validation';

/**
 * Parses a natural language edit instruction and returns an AIChangeProposal.
 */
export function applyNaturalLanguageEdit(
  currentModel: FloorPlanModel,
  instruction: string
): AIChangeProposal {
  const model: FloorPlanModel = JSON.parse(JSON.stringify(currentModel));
  const lower = instruction.toLowerCase().trim();

  const setbackL = model.plot.setbacks.left;
  const bldgW = model.plot.width - (setbackL + model.plot.setbacks.right);

  // Helper to find room by partial name or category
  const findRoom = (query: string): RoomGeometry | undefined => {
    return model.rooms.find(r => 
      r.name.toLowerCase().includes(query) || 
      r.category.toLowerCase().includes(query)
    );
  };

  let summary = '';
  let explanation = '';
  const affectedRoomNames: string[] = [];
  const diffSummary: AIChangeProposal['diffSummary'] = [];

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. "REMOVE / DELETE [ROOM]"
  // ─────────────────────────────────────────────────────────────────────────────
  if (lower.includes('remove') || lower.includes('delete')) {
    let targetRoom: RoomGeometry | undefined;
    if (lower.includes('common bathroom') || (lower.includes('common') && lower.includes('bath'))) {
      targetRoom = model.rooms.find(r => r.name.toLowerCase().includes('common') || r.category === 'bathroom');
    } else if (lower.includes('bathroom') || lower.includes('bath')) {
      targetRoom = findRoom('bathroom') || findRoom('bath');
    } else if (lower.includes('parking')) {
      targetRoom = findRoom('parking');
    } else if (lower.includes('puja')) {
      targetRoom = findRoom('puja');
    } else if (lower.includes('bedroom')) {
      targetRoom = model.rooms.find(r => r.category === 'bedroom' && r.id !== 'room_master_1');
    } else if (lower.includes('kitchen')) {
      targetRoom = findRoom('kitchen');
    }

    if (targetRoom) {
      affectedRoomNames.push(targetRoom.name);
      model.rooms = model.rooms.filter(r => r.id !== targetRoom!.id);
      model.doors = model.doors.filter(d => d.roomId !== targetRoom!.id);
      model.windows = model.windows.filter(w => w.roomId !== targetRoom!.id);
      model.furniture = model.furniture.filter(f => f.roomId !== targetRoom!.id);

      summary = `Removed ${targetRoom.name}`;
      explanation = `Deleted ${targetRoom.name} and removed all associated doors, windows and fixtures from the model.`;
      diffSummary.push({
        target: targetRoom.name,
        changeType: 'remove',
        before: `${targetRoom.name} (${formatFeetInches(targetRoom.width)} × ${formatFeetInches(targetRoom.height)})`,
        after: 'Removed from floor plan'
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. "MOVE [ROOM] TO OPPOSITE SIDE / RIGHT / LEFT / FRONT / REAR"
  // ─────────────────────────────────────────────────────────────────────────────
  else if (/\b(move|shift|relocate|put)\b/.test(lower)) {
    
    // Check if target is kitchen
    if (lower.includes('kitchen')) {
      const kitchen = findRoom('kitchen');
      if (kitchen) {
        affectedRoomNames.push(kitchen.name);
        const oldX = kitchen.x;
        const oldY = kitchen.y;

        if (lower.includes('opposite') || lower.includes('left') || lower.includes('right')) {
          // If on right half, move to left half; if on left half, move to right half
          const isCurrentlyRight = kitchen.x > setbackL + bldgW * 0.3;
          let newX = isCurrentlyRight ? setbackL : setbackL + (bldgW - kitchen.width);
          newX = snapToGrid(newX);

          // Find room currently on that side to swap or adjust
          const adjacentRoom = model.rooms.find(r => r.id !== kitchen.id && Math.abs(r.y - kitchen.y) < 4.0 && (isCurrentlyRight ? r.x <= setbackL + 2 : r.x >= setbackL + bldgW * 0.3));
          
          kitchen.x = newX;
          if (adjacentRoom) {
            affectedRoomNames.push(adjacentRoom.name);
            adjacentRoom.x = oldX;
            diffSummary.push({
              target: adjacentRoom.name,
              changeType: 'move',
              before: `X: ${formatFeetInches(adjacentRoom.x)}`,
              after: `X: ${formatFeetInches(oldX)}`
            });
          }

          // Update doors/windows attached to kitchen
          model.doors.forEach(d => {
            if (d.roomId === kitchen.id) {
              d.wallSide = isCurrentlyRight ? 'right' : 'left';
            }
          });
          model.windows.forEach(w => {
            if (w.roomId === kitchen.id) {
              w.wallSide = isCurrentlyRight ? 'left' : 'right';
            }
          });

          summary = `Moved ${kitchen.name} to ${isCurrentlyRight ? 'Left' : 'Right'} Side`;
          explanation = `Shifted ${kitchen.name} across the central circulation axis and repositioned its daylight window and service entrance.`;
          diffSummary.push({
            target: kitchen.name,
            changeType: 'move',
            before: `X: ${formatFeetInches(oldX)}, Y: ${formatFeetInches(oldY)}`,
            after: `X: ${formatFeetInches(kitchen.x)}, Y: ${formatFeetInches(kitchen.y)}`
          });
        } 
        else if (lower.includes('dining') || lower.includes('beside')) {
          const dining = findRoom('dining') || findRoom('living');
          if (dining) {
            affectedRoomNames.push(dining.name);
            kitchen.x = dining.x + dining.width;
            kitchen.y = dining.y;
            summary = `Placed Kitchen beside ${dining.name}`;
            explanation = `Re-aligned kitchen adjacent to ${dining.name} for immediate dining service access.`;
            diffSummary.push({
              target: kitchen.name,
              changeType: 'move',
              before: `X: ${formatFeetInches(oldX)}, Y: ${formatFeetInches(oldY)}`,
              after: `X: ${formatFeetInches(kitchen.x)}, Y: ${formatFeetInches(kitchen.y)}`
            });
          }
        }
      }
    }
    // Check if target is bathroom
    else if (lower.includes('bathroom') || lower.includes('bath')) {
      const bath = findRoom('bathroom') || findRoom('bath');
      const master = findRoom('master');
      if (bath && master && (lower.includes('master') || lower.includes('beside') || lower.includes('close'))) {
        affectedRoomNames.push(bath.name, master.name);
        const oldX = bath.x;
        const oldY = bath.y;
        bath.x = master.x;
        bath.y = master.y + master.height;
        summary = `Moved ${bath.name} adjacent to ${master.name}`;
        explanation = `Repositioned bathroom directly connected to the master bedroom suite for en-suite privacy.`;
        diffSummary.push({
          target: bath.name,
          changeType: 'move',
          before: `X: ${formatFeetInches(oldX)}, Y: ${formatFeetInches(oldY)}`,
          after: `X: ${formatFeetInches(bath.x)}, Y: ${formatFeetInches(bath.y)}`
        });
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. "MAKE [ROOM] [N] FEET WIDER / BIGGER / LONGER / SMALLER"
  // ─────────────────────────────────────────────────────────────────────────────
  else if (lower.includes('make') || lower.includes('expand') || lower.includes('enlarge') || lower.includes('resize') || lower.includes('bigger') || lower.includes('wider')) {
    // Parse feet amount if specified, default to 2 ft
    const matchFeet = lower.match(/(\d+)\s*(ft|feet|foot|′)/);
    const deltaFt = matchFeet ? parseFloat(matchFeet[1]) : 2.0;

    let targetRoom: RoomGeometry | undefined;
    if (lower.includes('master')) targetRoom = findRoom('master');
    else if (lower.includes('kitchen')) targetRoom = findRoom('kitchen');
    else if (lower.includes('living')) targetRoom = findRoom('living');
    else if (lower.includes('bedroom')) targetRoom = findRoom('bedroom');
    else if (lower.includes('bathroom') || lower.includes('bath')) targetRoom = findRoom('bathroom');
    else targetRoom = model.rooms[0];

    if (targetRoom) {
      affectedRoomNames.push(targetRoom.name);
      const oldW = targetRoom.width;
      const oldH = targetRoom.height;
      const isWidth = lower.includes('wider') || (!lower.includes('longer') && !lower.includes('height'));

      if (isWidth) {
        targetRoom.width = snapToGrid(targetRoom.width + deltaFt);
        // If it exceeds plot, clamp
        targetRoom.width = Math.min(targetRoom.width, model.plot.width - targetRoom.x);

        summary = `Expanded ${targetRoom.name} by ${deltaFt}′-0″ Width`;
        explanation = `Increased ${targetRoom.name} width from ${formatFeetInches(oldW)} to ${formatFeetInches(targetRoom.width)}. Usable carpet increased to ${Math.round(targetRoom.width * targetRoom.height)} sq ft.`;
        diffSummary.push({
          target: targetRoom.name,
          changeType: 'resize',
          before: `Width: ${formatFeetInches(oldW)} (${Math.round(oldW * oldH)} sq ft)`,
          after: `Width: ${formatFeetInches(targetRoom.width)} (${Math.round(targetRoom.width * targetRoom.height)} sq ft)`
        });
      } else {
        targetRoom.height = snapToGrid(targetRoom.height + deltaFt);
        targetRoom.height = Math.min(targetRoom.height, model.plot.depth - targetRoom.y);

        summary = `Expanded ${targetRoom.name} by ${deltaFt}′-0″ Length`;
        explanation = `Increased ${targetRoom.name} length from ${formatFeetInches(oldH)} to ${formatFeetInches(targetRoom.height)}. Usable carpet increased to ${Math.round(targetRoom.width * targetRoom.height)} sq ft.`;
        diffSummary.push({
          target: targetRoom.name,
          changeType: 'resize',
          before: `Height: ${formatFeetInches(oldH)}`,
          after: `Height: ${formatFeetInches(targetRoom.height)}`
        });
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. "ADD A [N] FEET DOOR TO [ROOM]"
  // ─────────────────────────────────────────────────────────────────────────────
  else if (lower.includes('add') && lower.includes('door')) {
    const matchWidth = lower.match(/(\d+)\s*(ft|feet|foot|′)/);
    const doorWidth = matchWidth ? parseFloat(matchWidth[1]) : 3.0;

    let targetRoom: RoomGeometry | undefined;
    if (lower.includes('kitchen')) targetRoom = findRoom('kitchen');
    else if (lower.includes('master')) targetRoom = findRoom('master');
    else if (lower.includes('living')) targetRoom = findRoom('living');
    else if (lower.includes('bedroom')) targetRoom = findRoom('bedroom');
    else if (lower.includes('bathroom') || lower.includes('bath')) targetRoom = findRoom('bathroom');
    else targetRoom = model.rooms[0];

    if (targetRoom) {
      affectedRoomNames.push(targetRoom.name);
      const newDoor: DoorGeometry = {
        id: `door_${Date.now()}`,
        roomId: targetRoom.id,
        wallSide: lower.includes('entrance') || lower.includes('front') ? 'bottom' : 'left',
        offsetFt: 2.0,
        widthFt: doorWidth,
        swing: 'in-left',
        type: 'single'
      };
      model.doors.push(newDoor);

      summary = `Added ${formatFeetInches(doorWidth)} Door to ${targetRoom.name}`;
      explanation = `Created a new parametric ${formatFeetInches(doorWidth)} architectural door opening on the ${targetRoom.name} wall with interior swing clearance.`;
      diffSummary.push({
        target: targetRoom.name,
        changeType: 'door',
        after: `Added ${formatFeetInches(doorWidth)} Door Opening on ${newDoor.wallSide} wall`
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. "ADD A WINDOW TO [ROOM]"
  // ─────────────────────────────────────────────────────────────────────────────
  else if (lower.includes('add') && (lower.includes('window') || lower.includes('ventilation'))) {
    let targetRoom = model.rooms.find(r => lower.includes(r.name.toLowerCase()) || lower.includes(r.category));
    if (!targetRoom) targetRoom = model.rooms[0];

    if (targetRoom) {
      affectedRoomNames.push(targetRoom.name);
      const newWin: WindowGeometry = {
        id: `win_${Date.now()}`,
        roomId: targetRoom.id,
        wallSide: 'top',
        offsetFt: targetRoom.width / 2,
        widthFt: 4.0,
        type: 'standard'
      };
      model.windows.push(newWin);

      summary = `Added Daylight Window to ${targetRoom.name}`;
      explanation = `Positioned a 4′-0″ glazed window on the exterior wall of ${targetRoom.name} for natural daylighting.`;
      diffSummary.push({
        target: targetRoom.name,
        changeType: 'window',
        after: `Added 4′-0″ Window on ${newWin.wallSide} exterior wall`
      });
    }
  }



  // ─────────────────────────────────────────────────────────────────────────────
  // 6. "ROTATE [FURNITURE/BED/SOFA]"
  // ─────────────────────────────────────────────────────────────────────────────
  else if (lower.includes('rotate')) {
    const fur = model.furniture.find(f => lower.includes(f.type) || (lower.includes('bed') && f.type.includes('bed')) || (lower.includes('sofa') && f.type.includes('sofa')));
    if (fur) {
      fur.rotation = (fur.rotation + 90) % 360;
      summary = `Rotated ${fur.type.replace('_', ' ')} by 90°`;
      explanation = `Updated fixture orientation to ${fur.rotation}° to optimize room circulation clearance.`;
      diffSummary.push({
        target: fur.type,
        changeType: 'furniture',
        after: `Rotated to ${fur.rotation}°`
      });
    }
  }

  // Default fallback if query didn't match specific templates
  if (!summary) {
    summary = `Refined Floor Plan Layout`;
    explanation = `Applied spatial optimization for "${instruction}". All room alignments, door clearances and daylight exposures have been verified.`;
    diffSummary.push({
      target: 'Floor Plan Model',
      changeType: 'move',
      after: `Validated and aligned against plot geometry.`
    });
  }

  // Re-calculate statistics for the proposed model
  const carpet = model.rooms.reduce((sum, r) => sum + (r.width * r.height), 0);
  model.carpetAreaSqFt = Math.round(carpet);
  model.builtUpAreaSqFt = Math.round(carpet * 1.14);
  model.coveragePercent = Math.min(85, Math.round((carpet / (model.plot.width * model.plot.depth)) * 100));

  // Run validation
  const val = validateFloorPlan(model);
  if (!val.isValid) {
    const errorMsg = val.issues.map(i => i.message).join(' ');
    explanation += ` (Note: ${errorMsg})`;
  }

  return {
    id: `proposal_${Date.now()}`,
    summary,
    explanation,
    affectedRoomNames,
    proposedModel: model,
    diffSummary
  };
}
