import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { 
  FloorPlanModel, 
  RoomGeometry, 
  FurnitureGeometry, 
  AlignmentGuide 
} from './geometry/types';
import { 
  formatFeetInches, 
  snapRoomPosition, 
  snapRoomResize 
} from './geometry/constraintSolver';

interface Props {
  model: FloorPlanModel;
  onUpdateModel: (updated: FloorPlanModel) => void;
  selectedElement: {
    type: 'room' | 'door' | 'window' | 'furniture';
    id: string;
  } | null;
  onSelectElement: (elem: { type: 'room' | 'door' | 'window' | 'furniture'; id: string } | null) => void;
  scaleMultiplier?: number;
  zoomPercent?: number;
  showGrid?: boolean;
  enableSnap?: boolean;
  readOnly?: boolean;
}

export default function FloorPlanVisualizer({
  model,
  onUpdateModel,
  selectedElement,
  onSelectElement,
  showGrid = true,
  enableSnap = true,
  readOnly = false
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Interaction drag states
  const [dragState, setDragState] = useState<{
    mode: 'move_room' | 'resize_room' | 'move_furniture' | 'slide_door' | 'slide_win';
    id: string;
    handle?: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
    startPointerFt: { x: number; y: number };
    initialRoomGeom?: RoomGeometry;
    initialFurGeom?: FurnitureGeometry;
  } | null>(null);

  const [activeGuides, setActiveGuides] = useState<AlignmentGuide[]>([]);

  // ─────────────────────────────────────────────────────────────────────────────
  // SVG Canvas Scale & Dimension Metrics
  // ─────────────────────────────────────────────────────────────────────────────
  const { plot } = model;
  const canvasW = 1000;
  const canvasH = 1500;

  // Margin offsets inside SVG
  const originX = 140;
  const originY = 110;
  const targetDrawingWidth = 720;
  const scale = targetDrawingWidth / Math.max(25, plot.width); // px per foot

  const plotPxW = plot.width * scale;
  const plotPxH = plot.depth * scale;

  const toPxX = (ft: number) => originX + ft * scale;
  const toPxY = (ft: number) => originY + ft * scale;
  const toPxDim = (ft: number) => ft * scale;

  const toFtX = (px: number) => (px - originX) / scale;
  const toFtY = (px: number) => (px - originY) / scale;

  // Building Envelope Coordinates
  const bldgLeft = toPxX(plot.setbacks.left);
  const bldgTop = toPxY(plot.setbacks.rear);
  const bldgW = toPxDim(plot.width - (plot.setbacks.left + plot.setbacks.right));
  const bldgH = toPxDim(plot.depth - (plot.setbacks.front + plot.setbacks.rear));

  // ─────────────────────────────────────────────────────────────────────────────
  // Pointer Event Handlers for Direct Manipulation
  // ─────────────────────────────────────────────────────────────────────────────
  const getSvgPoint = useCallback((e: React.PointerEvent | PointerEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const pxX = ((e.clientX - rect.left) / rect.width) * canvasW;
    const pxY = ((e.clientY - rect.top) / rect.height) * canvasH;
    return {
      x: toFtX(pxX),
      y: toFtY(pxY)
    };
  }, [canvasW, canvasH, originX, originY, scale]);

  const handlePointerDownRoom = (e: React.PointerEvent, room: RoomGeometry) => {
    e.stopPropagation();
    if (readOnly) return;
    onSelectElement({ type: 'room', id: room.id });

    const pt = getSvgPoint(e);
    setDragState({
      mode: 'move_room',
      id: room.id,
      startPointerFt: pt,
      initialRoomGeom: { ...room }
    });
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerDownResize = (
    e: React.PointerEvent,
    room: RoomGeometry,
    handle: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'
  ) => {
    e.stopPropagation();
    const pt = getSvgPoint(e);
    setDragState({
      mode: 'resize_room',
      id: room.id,
      handle,
      startPointerFt: pt,
      initialRoomGeom: { ...room }
    });
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerDownFurniture = (e: React.PointerEvent, fur: FurnitureGeometry) => {
    e.stopPropagation();
    onSelectElement({ type: 'furniture', id: fur.id });
    const pt = getSvgPoint(e);
    setDragState({
      mode: 'move_furniture',
      id: fur.id,
      startPointerFt: pt,
      initialFurGeom: { ...fur }
    });
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState) return;
    const currentPt = getSvgPoint(e);
    const deltaX = currentPt.x - dragState.startPointerFt.x;
    const deltaY = currentPt.y - dragState.startPointerFt.y;

    // 1. Move Room
    if (dragState.mode === 'move_room' && dragState.initialRoomGeom) {
      const orig = dragState.initialRoomGeom;
      let targetX = orig.x + deltaX;
      let targetY = orig.y + deltaY;

      let guides: AlignmentGuide[] = [];
      if (enableSnap) {
        const snapRes = snapRoomPosition(orig.id, targetX, targetY, orig.width, orig.height, model.rooms, plot);
        targetX = snapRes.x;
        targetY = snapRes.y;
        guides = snapRes.guides;
      }

      setActiveGuides(guides);
      const updatedRooms = model.rooms.map(r => r.id === orig.id ? { ...r, x: targetX, y: targetY } : r);
      onUpdateModel({ ...model, rooms: updatedRooms });
    }

    // 2. Resize Room
    else if (dragState.mode === 'resize_room' && dragState.initialRoomGeom && dragState.handle) {
      const orig = dragState.initialRoomGeom;
      let targetX = orig.x;
      let targetY = orig.y;
      let targetW = orig.width;
      let targetH = orig.height;

      if (dragState.handle.includes('e')) targetW = orig.width + deltaX;
      if (dragState.handle.includes('w')) {
        targetX = orig.x + deltaX;
        targetW = orig.width - deltaX;
      }
      if (dragState.handle.includes('s')) targetH = orig.height + deltaY;
      if (dragState.handle.includes('n')) {
        targetY = orig.y + deltaY;
        targetH = orig.height - deltaY;
      }

      let guides: AlignmentGuide[] = [];
      if (enableSnap) {
        const snapRes = snapRoomResize(orig, dragState.handle, targetX, targetY, targetW, targetH, model.rooms, plot);
        targetX = snapRes.x;
        targetY = snapRes.y;
        targetW = snapRes.width;
        targetH = snapRes.height;
        guides = snapRes.guides;
      }

      setActiveGuides(guides);
      const updatedRooms = model.rooms.map(r => r.id === orig.id ? { ...r, x: targetX, y: targetY, width: targetW, height: targetH } : r);
      onUpdateModel({ ...model, rooms: updatedRooms });
    }

    // 3. Move Furniture
    else if (dragState.mode === 'move_furniture' && dragState.initialFurGeom) {
      const orig = dragState.initialFurGeom;
      const hostRoom = model.rooms.find(r => r.id === orig.roomId);
      let targetX = orig.x + deltaX;
      let targetY = orig.y + deltaY;

      if (hostRoom) {
        targetX = Math.max(0, Math.min(targetX, hostRoom.width - orig.width));
        targetY = Math.max(0, Math.min(targetY, hostRoom.height - orig.height));
      }

      const updatedFurniture = model.furniture.map(f => f.id === orig.id ? { ...f, x: targetX, y: targetY } : f);
      onUpdateModel({ ...model, furniture: updatedFurniture });
    }
  };

  const handlePointerUp = () => {
    setDragState(null);
    setActiveGuides([]);
  };

  // Keyboard shortcut listener (Delete key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedElement) return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElement.type === 'room') {
          onUpdateModel({
            ...model,
            rooms: model.rooms.filter(r => r.id !== selectedElement.id),
            doors: model.doors.filter(d => d.roomId !== selectedElement.id),
            windows: model.windows.filter(w => w.roomId !== selectedElement.id),
            furniture: model.furniture.filter(f => f.roomId !== selectedElement.id)
          });
          onSelectElement(null);
        } else if (selectedElement.type === 'door') {
          onUpdateModel({ ...model, doors: model.doors.filter(d => d.id !== selectedElement.id) });
          onSelectElement(null);
        } else if (selectedElement.type === 'window') {
          onUpdateModel({ ...model, windows: model.windows.filter(w => w.id !== selectedElement.id) });
          onSelectElement(null);
        } else if (selectedElement.type === 'furniture') {
          onUpdateModel({ ...model, furniture: model.furniture.filter(f => f.id !== selectedElement.id) });
          onSelectElement(null);
        }
      } else if (e.key === 'Escape') {
        onSelectElement(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, model, onUpdateModel, onSelectElement]);

  const selectedRoom = selectedElement?.type === 'room' ? model.rooms.find(r => r.id === selectedElement.id) : null;
  const selectedFurniture = selectedElement?.type === 'furniture' ? model.furniture.find(f => f.id === selectedElement.id) : null;

  return (
    <div className="cad-viewport-wrapper" style={{ width: '100%', height: '100%', position: 'relative', background: '#e2e8f0', overflow: 'auto' }}>
      
      {/* ─── SVG Canvas Frame ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${canvasW} ${canvasH}`}
          style={{
            width: '100%',
            maxWidth: '1020px',
            background: '#ffffff',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            borderRadius: '4px',
            userSelect: 'none',
            touchAction: 'none'
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onClick={() => onSelectElement(null)}
        >
          <defs>
            {/* Architectural Wall Cross-Hatch Pattern */}
            <pattern id="wallHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#334155" strokeWidth="1.2" />
            </pattern>

            {/* Setback Area Soft Diagonal Stipple */}
            <pattern id="setbackHatch" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="12" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2 3" />
            </pattern>

            {/* Road Asphalt Texture */}
            <pattern id="roadHatch" width="16" height="16" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="16" stroke="#475569" strokeWidth="0.8" />
            </pattern>

            {/* OTS Shaft Diagonal Cross Pattern */}
            <pattern id="otsHatch" width="10" height="10" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="10" y2="10" stroke="#0284c7" strokeWidth="1.0" />
              <line x1="0" y1="10" x2="10" y2="0" stroke="#0284c7" strokeWidth="1.0" />
            </pattern>

            {/* Column Cross Hatch */}
            <pattern id="colHatch" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="6" stroke="#0f172a" strokeWidth="1.5" />
            </pattern>
          </defs>

          {/* ─── Grid (1 Foot spacing in CAD coordinates) ────────────────────── */}
          {showGrid && (
            <g className="cad-grid" stroke="#f1f5f9" strokeWidth="1">
              {Array.from({ length: Math.ceil(canvasW / 30) }).map((_, i) => (
                <line key={`gx-${i}`} x1={i * 30} y1="0" x2={i * 30} y2={canvasH} />
              ))}
              {Array.from({ length: Math.ceil(canvasH / 30) }).map((_, i) => (
                <line key={`gy-${i}`} x1="0" y1={i * 30} x2={canvasW} y2={i * 30} />
              ))}
            </g>
          )}

          {/* ─── 1. Exterior Dimensions & Witness Lines ──────────────────────── */}
          {/* Top Frontage Dimension */}
          <g className="dimension-group" stroke="#475569" strokeWidth="1.2">
            <line x1={originX} y1={originY - 45} x2={originX + plotPxW} y2={originY - 45} />
            <line x1={originX} y1={originY - 55} x2={originX} y2={originY - 5} strokeDasharray="3 3" />
            <line x1={originX + plotPxW} y1={originY - 55} x2={originX + plotPxW} y2={originY - 5} strokeDasharray="3 3" />
            <line x1={originX - 6} y1={originY - 51} x2={originX + 6} y2={originY - 39} stroke="#0f172a" strokeWidth="2" />
            <line x1={originX + plotPxW - 6} y1={originY - 51} x2={originX + plotPxW + 6} y2={originY - 39} stroke="#0f172a" strokeWidth="2" />
            <rect x={originX + plotPxW / 2 - 60} y={originY - 57} width="120" height="24" fill="#ffffff" />
            <text x={originX + plotPxW / 2} y={originY - 40} textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="900" fontFamily="monospace">
              {formatFeetInches(plot.width)} ({plot.width} FT)
            </text>
          </g>

          {/* Left Depth Dimension */}
          <g className="dimension-group" stroke="#475569" strokeWidth="1.2">
            <line x1={originX - 45} y1={originY} x2={originX - 45} y2={originY + plotPxH} />
            <line x1={originX - 55} y1={originY} x2={originX - 5} y2={originY} strokeDasharray="3 3" />
            <line x1={originX - 55} y1={originY + plotPxH} x2={originX - 5} y2={originY + plotPxH} strokeDasharray="3 3" />
            <line x1={originX - 51} y1={originY - 6} x2={originX - 39} y2={originY + 6} stroke="#0f172a" strokeWidth="2" />
            <line x1={originX - 51} y1={originY + plotPxH - 6} x2={originX - 39} y2={originY + plotPxH + 6} stroke="#0f172a" strokeWidth="2" />
            <rect x={originX - 69} y={originY + plotPxH / 2 - 30} width="48" height="60" fill="#ffffff" />
            <text 
              x={originX - 45} 
              y={originY + plotPxH / 2} 
              textAnchor="middle" 
              fill="#0f172a" 
              fontSize="13" 
              fontWeight="900" 
              fontFamily="monospace"
              transform={`rotate(-90 ${originX - 45} ${originY + plotPxH / 2})`}
            >
              {formatFeetInches(plot.depth)} ({plot.depth} FT)
            </text>
          </g>

          {/* ─── 2. Plot Boundary & Setbacks ─────────────────────────────────── */}
          <rect
            x={originX}
            y={originY}
            width={plotPxW}
            height={plotPxH}
            fill="#f8fafc"
            stroke="#0f172a"
            strokeWidth="3.5"
          />

          {/* Setback Hatch outside building footprint */}
          <path
            d={`
              M ${originX} ${originY} H ${originX + plotPxW} V ${originY + plotPxH} H ${originX} Z
              M ${bldgLeft} ${bldgTop} V ${bldgTop + bldgH} H ${bldgLeft + bldgW} V ${bldgTop} Z
            `}
            fill="url(#setbackHatch)"
            fillRule="evenodd"
            opacity="0.6"
          />

          {/* Setback Labels */}
          <text x={originX + plotPxW / 2} y={originY + 20} textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="700" letterSpacing="1">
            REAR SETBACK: {plot.setbacks.rear}′-0″
          </text>
          <text x={originX + plotPxW / 2} y={originY + plotPxH - 10} textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="700" letterSpacing="1">
            FRONT SETBACK: {plot.setbacks.front}′-0″
          </text>

          {/* ─── 3. Road Designation Banner ──────────────────────────────────── */}
          <g className="road-strip-group">
            <rect 
              x={originX - 30} 
              y={originY + plotPxH + 25} 
              width={plotPxW + 60} 
              height="50" 
              fill="#1e293b" 
              rx="4"
            />
            <rect 
              x={originX - 30} 
              y={originY + plotPxH + 25} 
              width={plotPxW + 60} 
              height="50" 
              fill="url(#roadHatch)" 
              opacity="0.3"
            />
            <line 
              x1={originX - 30} 
              y1={originY + plotPxH + 50} 
              x2={originX + plotPxW + 30} 
              y2={originY + plotPxH + 50} 
              stroke="#f8fafc" 
              strokeWidth="2.5" 
              strokeDasharray="16 12" 
            />
            <rect x={originX + plotPxW / 2 - 140} y={originY + plotPxH + 37} width="280" height="26" fill="#0f172a" rx="4" />
            <text x={originX + plotPxW / 2} y={originY + plotPxH + 54} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="800" letterSpacing="1.5">
              ROAD — 30 FT WIDE ({plot.roadFacing.toUpperCase()} ACCESS)
            </text>
          </g>

          {/* ─── 4. North Compass Arrow ──────────────────────────────────────── */}
          <g className="cad-north-arrow" transform={`translate(${canvasW - 90}, 30)`}>
            <circle cx="25" cy="25" r="24" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
            <polygon points="25,6 31,25 25,22" fill="#0f172a" />
            <polygon points="25,6 19,25 25,22" fill="#94a3b8" />
            <polygon points="25,44 31,25 25,28" fill="#cbd5e1" />
            <polygon points="25,44 19,25 25,28" fill="#e2e8f0" />
            <circle cx="25" cy="25" r="3" fill="#0f172a" />
            <text x="25" y="-4" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="900">N</text>
          </g>

          {/* ─── 5. Building Outer Structural Walls (9" Double-Line) ─────────── */}
          <rect
            x={bldgLeft}
            y={bldgTop}
            width={bldgW}
            height={bldgH}
            fill="#ffffff"
            stroke="#0f172a"
            strokeWidth="9"
          />

          {/* ─── 6. Interior Rooms & Partitions ─────────────────────────────── */}
          {model.rooms.map((room) => {
            const rx = toPxX(room.x);
            const ry = toPxY(room.y);
            const rw = toPxDim(room.width);
            const rh = toPxDim(room.height);
            const isSelected = selectedRoom?.id === room.id;
            const areaSqFt = Math.round(room.width * room.height);

            let roomBg = '#ffffff';
            if (room.category === 'parking') roomBg = '#f8fafc';
            else if (room.category === 'balcony' || room.category === 'garden') roomBg = '#f0fdf4';
            else if (room.category === 'bathroom') roomBg = '#f8fafc';
            else if (room.category === 'puja') roomBg = '#fffbeb';

            return (
              <g 
                key={room.id}
                className={`cad-room-group ${isSelected ? 'selected' : ''}`}
                onPointerDown={(e) => handlePointerDownRoom(e, room)}
                style={{ cursor: 'move' }}
              >
                {/* Room Floor Fill with 4.5" Internal Wall Border */}
                <rect
                  x={rx}
                  y={ry}
                  width={rw}
                  height={rh}
                  fill={isSelected ? '#eff6ff' : roomBg}
                  stroke={isSelected ? '#2563eb' : '#1e293b'}
                  strokeWidth={isSelected ? '3.5' : '4.5'}
                />

                {/* Selected Room Highlight Border */}
                {isSelected && (
                  <rect
                    x={rx + 2}
                    y={ry + 2}
                    width={rw - 4}
                    height={rh - 4}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="5 3"
                  />
                )}

                {/* ─── Room Fixtures (Parametric Furniture) ────────────────── */}
                {model.furniture.filter(f => f.roomId === room.id).map((fix) => {
                  const fx = rx + toPxDim(fix.x);
                  const fy = ry + toPxDim(fix.y);
                  const fw = toPxDim(fix.width);
                  const fh = toPxDim(fix.height);
                  const isFurSelected = selectedFurniture?.id === fix.id;

                  return (
                    <g 
                      key={fix.id}
                      className={`cad-fixture-item ${isFurSelected ? 'selected-fixture' : ''}`}
                      onPointerDown={(e) => handlePointerDownFurniture(e, fix)}
                      style={{ cursor: 'grab' }}
                    >
                      {/* Bed King / Queen */}
                      {(fix.type === 'bed_king' || fix.type === 'bed_queen') && (
                        <g stroke="#475569" strokeWidth="1.4" fill="#ffffff">
                          <rect x={fx} y={fy} width={fw} height="6" fill="#1e293b" />
                          <rect x={fx} y={fy + 6} width={fw} height={fh - 6} rx="4" />
                          <rect x={fx + fw * 0.08} y={fy + 10} width={fw * 0.38} height={fh * 0.22} rx="2" fill="#e2e8f0" />
                          <rect x={fx + fw * 0.54} y={fy + 10} width={fw * 0.38} height={fh * 0.22} rx="2" fill="#e2e8f0" />
                          <line x1={fx + 4} y1={fy + fh * 0.55} x2={fx + fw - 4} y2={fy + fh * 0.55} stroke="#94a3b8" />
                        </g>
                      )}

                      {/* Wardrobe */}
                      {fix.type === 'wardrobe' && (
                        <g stroke="#475569" strokeWidth="1.2" fill="#f8fafc">
                          <rect x={fx} y={fy} width={fw} height={fh} rx="2" />
                          <line x1={fx} y1={fy} x2={fx + fw} y2={fy + fh} stroke="#cbd5e1" />
                          <line x1={fx + fw} y1={fy} x2={fx} y2={fy + fh} stroke="#cbd5e1" />
                          <text x={fx + fw / 2} y={fy + fh / 2 + 3} textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="700">
                            WARDROBE
                          </text>
                        </g>
                      )}

                      {/* Sofa Sectional */}
                      {fix.type === 'sofa_sectional' && (
                        <g stroke="#334155" strokeWidth="1.4" fill="#f8fafc">
                          <path d={`M ${fx} ${fy} H ${fx + fw} V ${fy + fh * 0.35} H ${fx + fw * 0.35} V ${fy + fh} H ${fx} Z`} rx="3" />
                          <line x1={fx + fw * 0.35} y1={fy} x2={fx + fw * 0.35} y2={fy + fh * 0.35} stroke="#94a3b8" />
                          <line x1={fx + fw * 0.68} y1={fy} x2={fx + fw * 0.68} y2={fy + fh * 0.35} stroke="#94a3b8" />
                          <line x1={fx} y1={fy + fh * 0.65} x2={fx + fw * 0.35} y2={fy + fh * 0.65} stroke="#94a3b8" />
                        </g>
                      )}

                      {/* Coffee Table */}
                      {fix.type === 'coffee_table' && (
                        <rect x={fx} y={fy} width={fw} height={fh} rx="3" fill="#ffffff" stroke="#64748b" strokeWidth="1.2" />
                      )}

                      {/* TV Unit */}
                      {fix.type === 'tv_unit' && (
                        <rect x={fx} y={fy} width={fw} height={fh} rx="1" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
                      )}

                      {/* Dining Table */}
                      {fix.type === 'dining_table' && (
                        <g stroke="#334155" strokeWidth="1.3" fill="#ffffff">
                          <rect x={fx + fw * 0.15} y={fy} width={fw * 0.7} height={fh} rx="4" fill="#f8fafc" />
                          <rect x={fx + fw * 0.22} y={fy - 4} width={fw * 0.22} height="4" rx="1" fill="#e2e8f0" />
                          <rect x={fx + fw * 0.56} y={fy - 4} width={fw * 0.22} height="4" rx="1" fill="#e2e8f0" />
                          <rect x={fx + fw * 0.22} y={fy + fh} width={fw * 0.22} height="4" rx="1" fill="#e2e8f0" />
                          <rect x={fx + fw * 0.56} y={fy + fh} width={fw * 0.22} height="4" rx="1" fill="#e2e8f0" />
                          <text x={fx + fw / 2} y={fy + fh / 2 + 3} textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="700">
                            DINING
                          </text>
                        </g>
                      )}

                      {/* Kitchen Counter L */}
                      {fix.type === 'kitchen_counter_l' && (
                        <g stroke="#334155" strokeWidth="1.4" fill="#f8fafc">
                          <path d={`M ${fx} ${fy} H ${fx + fw} V ${fy + fh} H ${fx + fw - 16} V ${fy + 16} H ${fx} Z`} />
                        </g>
                      )}

                      {/* Kitchen Hob */}
                      {fix.type === 'kitchen_hob' && (
                        <g stroke="#0f172a" strokeWidth="1.2" fill="#e2e8f0">
                          <rect x={fx} y={fy} width={fw} height={fh} rx="2" />
                          <circle cx={fx + fw * 0.28} cy={fy + fh * 0.5} r={fw * 0.16} fill="#334155" />
                          <circle cx={fx + fw * 0.72} cy={fy + fh * 0.35} r={fw * 0.14} fill="#334155" />
                          <circle cx={fx + fw * 0.72} cy={fy + fh * 0.7} r={fw * 0.12} fill="#334155" />
                        </g>
                      )}

                      {/* Kitchen Sink */}
                      {fix.type === 'kitchen_sink' && (
                        <g stroke="#0f172a" strokeWidth="1.2" fill="#ffffff">
                          <rect x={fx} y={fy} width={fw} height={fh} rx="2" />
                          <rect x={fx + 3} y={fy + 3} width={fw - 6} height={fh - 6} rx="2" fill="#e2e8f0" />
                          <circle cx={fx + fw / 2} cy={fy + fh / 2} r="2" fill="#0f172a" />
                        </g>
                      )}

                      {/* Toilet WC */}
                      {fix.type === 'toilet_wc' && (
                        <g stroke="#334155" strokeWidth="1.2" fill="#ffffff">
                          <rect x={fx} y={fy} width={fw} height={fh * 0.35} rx="1" fill="#e2e8f0" />
                          <ellipse cx={fx + fw / 2} cy={fy + fh * 0.7} rx={fw * 0.38} ry={fh * 0.35} />
                          <circle cx={fx + fw / 2} cy={fy + fh * 0.7} r={fw * 0.15} fill="#cbd5e1" />
                        </g>
                      )}

                      {/* Wash Basin */}
                      {fix.type === 'wash_basin' && (
                        <g stroke="#334155" strokeWidth="1.2" fill="#ffffff">
                          <rect x={fx} y={fy} width={fw} height={fh} rx="3" />
                          <ellipse cx={fx + fw / 2} cy={fy + fh * 0.55} rx={fw * 0.35} ry={fh * 0.3} fill="#e2e8f0" />
                          <circle cx={fx + fw / 2} cy={fy + 3} r="1.5" fill="#0f172a" />
                        </g>
                      )}

                      {/* Shower Stall */}
                      {fix.type === 'shower_stall' && (
                        <g stroke="#64748b" strokeWidth="1.2" fill="#f8fafc">
                          <rect x={fx} y={fy} width={fw} height={fh} />
                          <line x1={fx} y1={fy} x2={fx + fw} y2={fy + fh} strokeDasharray="3 3" stroke="#94a3b8" />
                          <line x1={fx + fw} y1={fy} x2={fx} y2={fy + fh} strokeDasharray="3 3" stroke="#94a3b8" />
                          <circle cx={fx + fw / 2} cy={fy + fh / 2} r="3" fill="#38bdf8" />
                        </g>
                      )}

                      {/* Sedan Car */}
                      {fix.type === 'car_sedan' && (
                        <g stroke="#0f172a" strokeWidth="1.4" fill="#ffffff">
                          <rect x={fx} y={fy} width={fw} height={fh} rx="12" fill="#f8fafc" stroke="#1e293b" strokeWidth="1.8" />
                          <rect x={fx + fw * 0.15} y={fy + fh * 0.32} width={fw * 0.7} height={fh * 0.38} rx="4" fill="#e2e8f0" />
                          <text x={fx + fw / 2} y={fy + fh * 0.53} textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="900">
                            CAR
                          </text>
                        </g>
                      )}

                      {/* Staircase */}
                      {fix.type === 'staircase' && (
                        <g stroke="#334155" strokeWidth="1.2" fill="#ffffff">
                          <rect x={fx} y={fy} width={fw} height={fh} fill="#f8fafc" />
                          {Array.from({ length: 8 }).map((_, sIdx) => (
                            <line key={sIdx} x1={fx} y1={fy + (sIdx * fh) / 8} x2={fx + fw} y2={fy + (sIdx * fh) / 8} />
                          ))}
                          <line x1={fx + fw / 2} y1={fy + fh - 8} x2={fx + fw / 2} y2={fy + 8} stroke="#2563eb" strokeWidth="1.6" />
                        </g>
                      )}

                      {/* Mandir Altar */}
                      {fix.type === 'mandir_altar' && (
                        <g stroke="#d97706" strokeWidth="1.3" fill="#fef3c7">
                          <rect x={fx} y={fy} width={fw} height={fh} rx="3" />
                          <circle cx={fx + fw / 2} cy={fy + fh / 2} r={fw * 0.25} fill="#f59e0b" />
                          <text x={fx + fw / 2} y={fy + fh / 2 + 3} textAnchor="middle" fill="#78350f" fontSize="9" fontWeight="900">
                            ॐ
                          </text>
                        </g>
                      )}

                      {/* Selection Box for Furniture */}
                      {isFurSelected && (
                        <rect x={fx - 2} y={fy - 2} width={fw + 4} height={fh + 4} fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="3 3" />
                      )}
                    </g>
                  );
                })}

                {/* ─── Architectural Doors ───────────────────────────────────── */}
                {model.doors.filter(d => d.roomId === room.id).map((door) => {
                  const dw = toPxDim(door.widthFt);
                  let dx = rx;
                  let dy = ry;
                  let leafX2 = rx;
                  let leafY2 = ry;
                  let arcPath = '';

                  if (door.wallSide === 'bottom') {
                    dx = rx + toPxDim(door.offsetFt);
                    dy = ry + rh;
                    leafX2 = dx;
                    leafY2 = dy - dw;
                    arcPath = `M ${dx + dw} ${dy} A ${dw} ${dw} 0 0 0 ${dx} ${dy - dw}`;
                  } else if (door.wallSide === 'top') {
                    dx = rx + toPxDim(door.offsetFt);
                    dy = ry;
                    leafX2 = dx;
                    leafY2 = dy + dw;
                    arcPath = `M ${dx + dw} ${dy} A ${dw} ${dw} 0 0 1 ${dx} ${dy + dw}`;
                  } else if (door.wallSide === 'left') {
                    dx = rx;
                    dy = ry + toPxDim(door.offsetFt);
                    leafX2 = dx + dw;
                    leafY2 = dy;
                    arcPath = `M ${dx} ${dy + dw} A ${dw} ${dw} 0 0 1 ${dx + dw} ${dy}`;
                  } else if (door.wallSide === 'right') {
                    dx = rx + rw;
                    dy = ry + toPxDim(door.offsetFt);
                    leafX2 = dx - dw;
                    leafY2 = dy;
                    arcPath = `M ${dx} ${dy + dw} A ${dw} ${dw} 0 0 0 ${dx - dw} ${dy}`;
                  }

                  const isDoorSelected = selectedElement?.id === door.id;

                  return (
                    <g 
                      key={door.id} 
                      className={`door-symbol ${isDoorSelected ? 'selected-door' : ''}`}
                      onClick={(e) => { e.stopPropagation(); onSelectElement({ type: 'door', id: door.id }); }}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Door Gap / Threshold Opening */}
                      <line 
                        x1={dx} 
                        y1={dy} 
                        x2={door.wallSide === 'bottom' || door.wallSide === 'top' ? dx + dw : dx} 
                        y2={door.wallSide === 'left' || door.wallSide === 'right' ? dy + dw : dy} 
                        stroke="#ffffff" 
                        strokeWidth="7" 
                      />
                      {/* Door Swing Arc */}
                      <path d={arcPath} fill="none" stroke="#64748b" strokeWidth="1.2" strokeDasharray="3 2" />
                      {/* Door Leaf (Straight Line) */}
                      <line x1={dx} y1={dy} x2={leafX2} y2={leafY2} stroke="#0f172a" strokeWidth="2.4" />
                      {/* Door Pivot Dot */}
                      <circle cx={dx} cy={dy} r="2.5" fill="#0f172a" />
                      {/* Door Tag */}
                      {door.tag && (
                        <text x={dx + 4} y={dy - 4} fill="#dc2626" fontSize="7.5" fontWeight="800">
                          {door.tag}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* ─── Architectural Windows ─────────────────────────────────── */}
                {model.windows.filter(w => w.roomId === room.id).map((win) => {
                  const ww = toPxDim(win.widthFt);
                  let wx = rx;
                  let wy = ry;
                  let wx2 = rx;
                  let wy2 = ry;

                  if (win.wallSide === 'top') {
                    wx = rx + toPxDim(win.offsetFt) - ww / 2;
                    wy = ry;
                    wx2 = wx + ww;
                    wy2 = ry;
                  } else if (win.wallSide === 'bottom') {
                    wx = rx + toPxDim(win.offsetFt) - ww / 2;
                    wy = ry + rh;
                    wx2 = wx + ww;
                    wy2 = wy;
                  } else if (win.wallSide === 'left') {
                    wx = rx;
                    wy = ry + toPxDim(win.offsetFt) - ww / 2;
                    wx2 = rx;
                    wy2 = wy + ww;
                  } else if (win.wallSide === 'right') {
                    wx = rx + rw;
                    wy = ry + toPxDim(win.offsetFt) - ww / 2;
                    wx2 = rx + rw;
                    wy2 = wy + ww;
                  }

                  const isWinSelected = selectedElement?.id === win.id;

                  return (
                    <g 
                      key={win.id} 
                      className={`window-symbol ${isWinSelected ? 'selected-win' : ''}`}
                      onClick={(e) => { e.stopPropagation(); onSelectElement({ type: 'window', id: win.id }); }}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Wall Opening Cutout */}
                      <line x1={wx} y1={wy} x2={wx2} y2={wy2} stroke="#ffffff" strokeWidth="8" />
                      {/* Outer Window Frame */}
                      <line x1={wx} y1={wy} x2={wx2} y2={wy2} stroke="#0f172a" strokeWidth="3" />
                      {/* Center Glazing Sash */}
                      <line 
                        x1={win.wallSide === 'top' || win.wallSide === 'bottom' ? wx : wx + 2} 
                        y1={win.wallSide === 'top' || win.wallSide === 'bottom' ? wy + 2 : wy} 
                        x2={win.wallSide === 'top' || win.wallSide === 'bottom' ? wx2 : wx2 + 2} 
                        y2={win.wallSide === 'top' || win.wallSide === 'bottom' ? wy2 + 2 : wy2} 
                        stroke="#0284c7" 
                        strokeWidth="2" 
                      />
                      {/* Window Tag */}
                      {win.tag && (
                        <text x={wx + ww / 2} y={wy - 5} textAnchor="middle" fill="#0284c7" fontSize="7.5" fontWeight="800">
                          {win.tag}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* ─── Room Typography & Dimension Schedule ─────────────────── */}
                <g className="room-labels" pointerEvents="none">
                  <rect
                    x={rx + rw / 2 - 62}
                    y={ry + rh / 2 - 16}
                    width="124"
                    height="32"
                    fill="rgba(255, 255, 255, 0.90)"
                    rx="4"
                  />
                  <text
                    x={rx + rw / 2}
                    y={ry + rh / 2 - 3}
                    textAnchor="middle"
                    fill="#0f172a"
                    fontSize="10.5"
                    fontWeight="900"
                    letterSpacing="0.3"
                  >
                    {room.name.toUpperCase()}
                  </text>
                  <text
                    x={rx + rw / 2}
                    y={ry + rh / 2 + 10}
                    textAnchor="middle"
                    fill="#475569"
                    fontSize="9"
                    fontWeight="800"
                    fontFamily="monospace"
                  >
                    {formatFeetInches(room.width)} × {formatFeetInches(room.height)} ({areaSqFt} SQ FT)
                  </text>
                </g>

                {/* ─── 8 Resize Handles for Selected Room ─────────────────────── */}
                {isSelected && (
                  <g className="resize-handles-group">
                    <rect x={rx - 4} y={ry - 4} width="8" height="8" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" style={{ cursor: 'nwse-resize' }} onPointerDown={(e) => handlePointerDownResize(e, room, 'nw')} />
                    <rect x={rx + rw / 2 - 4} y={ry - 4} width="8" height="8" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" style={{ cursor: 'ns-resize' }} onPointerDown={(e) => handlePointerDownResize(e, room, 'n')} />
                    <rect x={rx + rw - 4} y={ry - 4} width="8" height="8" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" style={{ cursor: 'nesw-resize' }} onPointerDown={(e) => handlePointerDownResize(e, room, 'ne')} />
                    <rect x={rx + rw - 4} y={ry + rh / 2 - 4} width="8" height="8" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" style={{ cursor: 'ew-resize' }} onPointerDown={(e) => handlePointerDownResize(e, room, 'e')} />
                    <rect x={rx + rw - 4} y={ry + rh - 4} width="8" height="8" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" style={{ cursor: 'nwse-resize' }} onPointerDown={(e) => handlePointerDownResize(e, room, 'se')} />
                    <rect x={rx + rw / 2 - 4} y={ry + rh - 4} width="8" height="8" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" style={{ cursor: 'ns-resize' }} onPointerDown={(e) => handlePointerDownResize(e, room, 's')} />
                    <rect x={rx - 4} y={ry + rh - 4} width="8" height="8" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" style={{ cursor: 'nesw-resize' }} onPointerDown={(e) => handlePointerDownResize(e, room, 'sw')} />
                    <rect x={rx - 4} y={ry + rh / 2 - 4} width="8" height="8" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" style={{ cursor: 'ew-resize' }} onPointerDown={(e) => handlePointerDownResize(e, room, 'w')} />
                  </g>
                )}

              </g>
            );
          })}

          {/* ─── 7. OTS (Open To Sky) Ventilation Shafts ─────────────────────── */}
          {model.ots && model.ots.map((o) => {
            const ox = toPxX(o.x);
            const oy = toPxY(o.y);
            const ow = toPxDim(o.width);
            const oh = toPxDim(o.height);
            return (
              <g key={o.id} className="ots-shaft-group">
                <rect x={ox} y={oy} width={ow} height={oh} fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
                <rect x={ox} y={oy} width={ow} height={oh} fill="url(#otsHatch)" opacity="0.4" />
                <line x1={ox} y1={oy} x2={ox + ow} y2={oy + oh} stroke="#0284c7" strokeWidth="1.2" strokeDasharray="3 3" />
                <line x1={ox} y1={oy + oh} x2={ox + ow} y2={oy} stroke="#0284c7" strokeWidth="1.2" strokeDasharray="3 3" />
                <text x={ox + ow / 2} y={oy + oh / 2 + 3} textAnchor="middle" fill="#0369a1" fontSize="8" fontWeight="800">
                  OTS SHAFT
                </text>
              </g>
            );
          })}

          {/* ─── 8. Conceptual Structural RCC Columns (9"x12") ───────────────── */}
          {model.columns && model.columns.map((c) => {
            const cx = toPxX(c.x);
            const cy = toPxY(c.y);
            const cw = toPxDim(c.widthFt);
            const ch = toPxDim(c.heightFt);
            return (
              <g key={c.id} className="conceptual-column-group">
                <rect 
                  x={cx - cw / 2} 
                  y={cy - ch / 2} 
                  width={cw} 
                  height={ch} 
                  fill="#1e293b" 
                  stroke="#ffffff" 
                  strokeWidth="1.5" 
                />
                <rect 
                  x={cx - cw / 2} 
                  y={cy - ch / 2} 
                  width={cw} 
                  height={ch} 
                  fill="url(#colHatch)" 
                  opacity="0.6" 
                />
                <text 
                  x={cx} 
                  y={cy + 3} 
                  textAnchor="middle" 
                  fill="#ffffff" 
                  fontSize="7" 
                  fontWeight="900"
                >
                  {c.tag}
                </text>
              </g>
            );
          })}

          {/* ─── 9. Alignment Snapping Guide Lines ───────────────────────────── */}
          {activeGuides.map((g, idx) => {
            if (g.type === 'x') {
              const xPx = toPxX(g.position);
              return (
                <line 
                  key={`guide-x-${idx}`}
                  x1={xPx} 
                  y1={toPxY(g.start) - 30} 
                  x2={xPx} 
                  y2={toPxY(g.end) + 30} 
                  stroke="#3b82f6" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 3" 
                />
              );
            } else {
              const yPx = toPxY(g.position);
              return (
                <line 
                  key={`guide-y-${idx}`}
                  x1={toPxX(g.start) - 30} 
                  y1={yPx} 
                  x2={toPxX(g.end) + 30} 
                  y2={yPx} 
                  stroke="#3b82f6" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 3" 
                />
              );
            }
          })}

          {/* ─── 10. Engineering Drawing Sheet Frame & Bottom Tables ─────────── */}
          <g className="drawing-sheet-frame" transform={`translate(40, ${originY + plotPxH + 95})`}>
            
            {/* Sheet Outer Border */}
            <rect x="0" y="0" width="920" height="260" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" />
            
            {/* 10.1 Area Statement Table (Left Box) */}
            <g transform="translate(15, 15)">
              <rect x="0" y="0" width="280" height="150" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="0" y="0" width="280" height="24" fill="#0f172a" />
              <text x="140" y="16" textAnchor="middle" fill="#ffffff" fontSize="10.5" fontWeight="800" letterSpacing="0.8">
                AREA STATEMENT (IS 8888)
              </text>
              
              <text x="12" y="44" fill="#475569" fontSize="9.5" fontWeight="600">Total Plot Area:</text>
              <text x="268" y="44" textAnchor="end" fill="#0f172a" fontSize="9.5" fontWeight="800" fontFamily="monospace">
                {model.areaStatement?.plotAreaSqFt || Math.round(plot.width * plot.depth)} SQ FT ({model.areaStatement?.plotAreaSqYd || Math.round((plot.width * plot.depth) / 9)} SQ YD)
              </text>

              <text x="12" y="66" fill="#475569" fontSize="9.5" fontWeight="600">Ground Coverage:</text>
              <text x="268" y="66" textAnchor="end" fill="#0f172a" fontSize="9.5" fontWeight="800" fontFamily="monospace">
                {model.areaStatement?.groundCoverageSqFt || model.builtUpAreaSqFt} SQ FT ({model.areaStatement?.groundCoveragePercent || model.coveragePercent}%)
              </text>

              <text x="12" y="88" fill="#475569" fontSize="9.5" fontWeight="600">Total Carpet Area:</text>
              <text x="268" y="88" textAnchor="end" fill="#2563eb" fontSize="9.5" fontWeight="900" fontFamily="monospace">
                {model.areaStatement?.carpetAreaSqFt || model.carpetAreaSqFt} SQ FT
              </text>

              <text x="12" y="110" fill="#475569" fontSize="9.5" fontWeight="600">Built-Up Area (Plinth):</text>
              <text x="268" y="110" textAnchor="end" fill="#0f172a" fontSize="9.5" fontWeight="800" fontFamily="monospace">
                {model.areaStatement?.builtUpAreaSqFt || model.builtUpAreaSqFt} SQ FT
              </text>

              <text x="12" y="132" fill="#475569" fontSize="9.5" fontWeight="600">Space Efficiency:</text>
              <text x="268" y="132" textAnchor="end" fill="#16a34a" fontSize="9.5" fontWeight="800" fontFamily="monospace">
                {model.areaStatement?.efficiencyPercent || 86}% (Net Habitability)
              </text>
            </g>

            {/* 10.2 Schedule of Openings Table (Center Box) */}
            <g transform="translate(310, 15)">
              <rect x="0" y="0" width="310" height="150" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="0" y="0" width="310" height="24" fill="#0f172a" />
              <text x="155" y="16" textAnchor="middle" fill="#ffffff" fontSize="10.5" fontWeight="800" letterSpacing="0.8">
                SCHEDULE OF OPENINGS
              </text>

              {/* Table Header */}
              <text x="10" y="40" fill="#64748b" fontSize="8.5" fontWeight="700">TAG</text>
              <text x="45" y="40" fill="#64748b" fontSize="8.5" fontWeight="700">TYPE</text>
              <text x="105" y="40" fill="#64748b" fontSize="8.5" fontWeight="700">SIZE (W × H)</text>
              <text x="185" y="40" fill="#64748b" fontSize="8.5" fontWeight="700">SILL / LINTEL</text>
              <text x="275" y="40" fill="#64748b" fontSize="8.5" fontWeight="700">QTY</text>
              <line x1="8" y1="46" x2="302" y2="46" stroke="#e2e8f0" />

              {(model.schedule || [
                { tag: 'D1', type: 'door', widthFt: 3.5, heightFt: 7.0, lintelHeightFt: 7.0, count: 1, description: 'Main Door' },
                { tag: 'D2', type: 'door', widthFt: 3.0, heightFt: 7.0, lintelHeightFt: 7.0, count: 2, description: 'Bed Door' },
                { tag: 'D3', type: 'door', widthFt: 2.5, heightFt: 7.0, lintelHeightFt: 7.0, count: 2, description: 'Bath Door' },
                { tag: 'W1', type: 'window', widthFt: 5.0, heightFt: 4.5, sillHeightFt: 2.5, lintelHeightFt: 7.0, count: 1, description: 'Living Win' },
                { tag: 'W2', type: 'window', widthFt: 4.0, heightFt: 4.0, sillHeightFt: 3.0, lintelHeightFt: 7.0, count: 2, description: 'Bed Win' },
                { tag: 'V1', type: 'ventilator', widthFt: 2.0, heightFt: 1.5, sillHeightFt: 5.5, lintelHeightFt: 7.0, count: 2, description: 'Ventilator' }
              ]).slice(0, 5).map((item, sIdx) => {
                const rowY = 62 + sIdx * 18;
                return (
                  <g key={sIdx}>
                    <text x="10" y={rowY} fill="#dc2626" fontSize="8.5" fontWeight="900">{item.tag}</text>
                    <text x="45" y={rowY} fill="#334155" fontSize="8.5" fontWeight="600">{item.type.toUpperCase()}</text>
                    <text x="105" y={rowY} fill="#0f172a" fontSize="8.5" fontWeight="700" fontFamily="monospace">{item.widthFt}′ × {item.heightFt}′</text>
                    <text x="185" y={rowY} fill="#64748b" fontSize="8.5" fontWeight="600">{item.sillHeightFt ? `${item.sillHeightFt}′ / ${item.lintelHeightFt}′` : `FL / ${item.lintelHeightFt}′`}</text>
                    <text x="280" y={rowY} fill="#0f172a" fontSize="8.5" fontWeight="800">{item.count}</text>
                  </g>
                );
              })}
            </g>

            {/* 10.3 Professional Title Block (Right Box) */}
            <g transform="translate(635, 15)">
              <rect x="0" y="0" width="270" height="150" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="0" y="0" width="270" height="24" fill="#0f172a" />
              <text x="135" y="16" textAnchor="middle" fill="#ffffff" fontSize="10.5" fontWeight="800" letterSpacing="0.8">
                PROPEWISE CAD DRAFTING STUDIO
              </text>

              <text x="10" y="44" fill="#64748b" fontSize="8" fontWeight="700">PROJECT:</text>
              <text x="65" y="44" fill="#0f172a" fontSize="8.5" fontWeight="800">{model.name.slice(0, 26)}</text>

              <text x="10" y="64" fill="#64748b" fontSize="8" fontWeight="700">DRAWING NO:</text>
              <text x="85" y="64" fill="#2563eb" fontSize="8.5" fontWeight="800" fontFamily="monospace">{model.titleBlock?.drawingNo || `PW-CAD-${Date.now().toString().slice(-6)}`}</text>

              <text x="10" y="84" fill="#64748b" fontSize="8" fontWeight="700">SCALE:</text>
              <text x="65" y="84" fill="#0f172a" fontSize="8.5" fontWeight="800">1:100 (Parametric CAD)</text>

              <text x="10" y="104" fill="#64748b" fontSize="8" fontWeight="700">ORIENTATION:</text>
              <text x="85" y="104" fill="#0f172a" fontSize="8.5" fontWeight="800">{plot.roadFacing} Facing</text>

              <text x="10" y="124" fill="#64748b" fontSize="8" fontWeight="700">DATE & REV:</text>
              <text x="85" y="124" fill="#0f172a" fontSize="8.5" fontWeight="800">{new Date().toLocaleDateString('en-IN')} (Rev 1.0)</text>

              <text x="10" y="142" fill="#d97706" fontSize="7.5" fontWeight="800">COLUMNS: CONCEPTUAL GRID ONLY</text>
            </g>

            {/* 10.4 Clear Senior Architectural Disclaimer Banner */}
            <g transform="translate(15, 178)">
              <rect x="0" y="0" width="890" height="68" fill="#fffbeb" stroke="#fde68a" strokeWidth="1" rx="4" />
              <text x="14" y="20" fill="#92400e" fontSize="9" fontWeight="900" letterSpacing="0.5">
                ⚠️ PRELIMINARY CONCEPTUAL ARCHITECTURAL DRAWING DISCLAIMER
              </text>
              <text x="14" y="38" fill="#78350f" fontSize="8.2" fontWeight="500">
                This document is a conceptual space planning and architectural layout generated by PropWise Studio. It does NOT constitute a certified structural engineering drawing,
              </text>
              <text x="14" y="52" fill="#78350f" fontSize="8.2" fontWeight="500">
                statutory municipal approval, or certified construction sanction. All dimensions, setbacks, column locations, and load-bearing details must be verified by a licensed architect
              </text>
              <text x="14" y="64" fill="#78350f" fontSize="8.2" fontWeight="500">
                and certified structural engineer prior to site execution, foundation excavation, or municipal submission.
              </text>
            </g>

          </g>

        </svg>
      </div>

    </div>
  );
}
