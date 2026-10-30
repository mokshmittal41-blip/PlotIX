import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  ZoomIn, ZoomOut, 
  Sun, Moon, Box, Maximize2, Minimize2, 
  Download, Play, Pause, Compass, Home, Sparkles, Layers, ArrowLeft
} from 'lucide-react';
import type { 
  FloorPlanModel
} from './geometry/types';
import { formatFeetInches } from './geometry/constraintSolver';

interface Props {
  model: FloorPlanModel;
  onSelectElement?: (elem: { type: 'room' | 'door' | 'window' | 'furniture'; id: string } | null) => void;
  selectedElement?: { type: 'room' | 'door' | 'window' | 'furniture'; id: string } | null;
  onBackTo2D?: () => void;
}

export default function Naksha3DVisualizer({
  model,
  onSelectElement,
  selectedElement,
  onBackTo2D
}: Props) {
  const { plot, rooms } = model;

  // 3D Camera Controls State
  const [rotX, setRotX] = useState(55); // Pitch (tilt angle, deg)
  const [rotY, setRotY] = useState(-35); // Yaw (horizontal orbit, deg)
  const [zoom, setZoom] = useState(1.0);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  // Feature & Display Toggles
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [wallHeightMode, setWallHeightMode] = useState<'dollhouse' | 'full' | 'low'>('dollhouse');
  const [lightingMode, setLightingMode] = useState<'daylight' | 'evening' | 'wireframe'>('daylight');
  const [showFurniture, setShowFurniture] = useState(true);
  const [activeFloorLevel, setActiveFloorLevel] = useState<'ground' | 'first' | 'terrace'>('ground');
  const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Drag interaction refs
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  // Auto-rotation turntable animation loop
  useEffect(() => {
    if (!isAutoRotating) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }
    const step = () => {
      setRotY(prev => (prev + 0.3) % 360);
      animFrameRef.current = requestAnimationFrame(step);
    };
    animFrameRef.current = requestAnimationFrame(step);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoRotating]);

  // Mouse & Touch 360° Orbit Drag Event Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    // Update 3D angles
    setRotY(y => y + dx * 0.45);
    setRotX(x => Math.max(15, Math.min(85, x - dy * 0.35)));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setZoom(z => Math.max(0.6, Math.min(2.0, z + delta)));
  };

  // Preset Camera Angles
  const setCameraPreset = (preset: 'iso' | 'top' | 'front' | 'side' | 'reset') => {
    setIsAutoRotating(false);
    setPanX(0);
    setPanY(0);
    if (preset === 'iso') {
      setRotX(55);
      setRotY(-35);
      setZoom(1.0);
    } else if (preset === 'top') {
      setRotX(85);
      setRotY(0);
      setZoom(1.05);
    } else if (preset === 'front') {
      setRotX(25);
      setRotY(0);
      setZoom(1.1);
    } else if (preset === 'side') {
      setRotX(35);
      setRotY(90);
      setZoom(1.1);
    } else {
      setRotX(55);
      setRotY(-35);
      setZoom(1.0);
    }
  };

  // Scale calculations: Map plot dimensions (ft) to 3D CSS pixels (px)
  // Target building footprint width: ~480px
  const scale = useMemo(() => {
    const maxDim = Math.max(plot.width, plot.depth);
    return Math.min(18, Math.max(8, 520 / maxDim)); // pixels per foot
  }, [plot.width, plot.depth]);

  const plotPxW = plot.width * scale;
  const plotPxD = plot.depth * scale;

  // Wall height in 3D pixels based on mode
  const wallHeightPx = wallHeightMode === 'dollhouse' ? 38 : wallHeightMode === 'low' ? 22 : 85;

  // Selected room details
  const activeRoom = useMemo(() => {
    const id = selectedElement?.type === 'room' ? selectedElement.id : hoveredRoomId;
    return rooms.find(r => r.id === id) || null;
  }, [rooms, selectedElement, hoveredRoomId]);

  // Export 3D Snapshot
  const export3DSnapshot = () => {
    window.print();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`naksha-3d-wrapper ${lightingMode} ${isFullscreen ? 'naksha-3d-fullscreen' : ''}`}
      onWheel={handleWheel}
    >
      {/* ─── Top 3D Control HUD Bar ─── */}
      <div className="naksha-3d-top-hud">
        <div className="naksha-3d-hud-left">
          {onBackTo2D && (
            <button
              type="button"
              className="naksha-3d-cam-btn"
              onClick={onBackTo2D}
              style={{ background: '#e2e8f0', color: '#0f172a', fontWeight: 800 }}
              title="Return to 2D Blueprint Canvas"
            >
              <ArrowLeft size={13} />
              <span>2D CAD</span>
            </button>
          )}

          <div className="naksha-3d-badge">
            <span className="naksha-3d-live-dot" />
            <span>3D Interactive Architecture</span>
          </div>

          <div className="naksha-3d-pill-group">
            <button 
              type="button" 
              className={`naksha-3d-pill ${activeFloorLevel === 'ground' ? 'active' : ''}`}
              onClick={() => setActiveFloorLevel('ground')}
            >
              Ground Floor
            </button>
            <button 
              type="button" 
              className={`naksha-3d-pill ${activeFloorLevel === 'first' ? 'active' : ''}`}
              onClick={() => setActiveFloorLevel('first')}
            >
              1st Floor
            </button>
            <button 
              type="button" 
              className={`naksha-3d-pill ${activeFloorLevel === 'terrace' ? 'active' : ''}`}
              onClick={() => setActiveFloorLevel('terrace')}
            >
              Terrace
            </button>
          </div>
        </div>

        {/* Center: Camera Angle Presets */}
        <div className="naksha-3d-hud-center">
          <div className="naksha-3d-camera-presets">
            <button 
              type="button" 
              className="naksha-3d-cam-btn" 
              onClick={() => setCameraPreset('iso')}
              title="Isometric 45° View"
            >
              Iso 45°
            </button>
            <button 
              type="button" 
              className="naksha-3d-cam-btn" 
              onClick={() => setCameraPreset('top')}
              title="Top-Down 3D Plan"
            >
              Top 3D
            </button>
            <button 
              type="button" 
              className="naksha-3d-cam-btn" 
              onClick={() => setCameraPreset('front')}
              title="Front Elevation"
            >
              Front
            </button>
            <button 
              type="button" 
              className="naksha-3d-cam-btn" 
              onClick={() => setCameraPreset('side')}
              title="Side Elevation"
            >
              Side
            </button>
            <button 
              type="button" 
              className={`naksha-3d-cam-btn ${isAutoRotating ? 'active-turntable' : ''}`} 
              onClick={() => setIsAutoRotating(a => !a)}
              title="360° Auto-Turntable Orbit"
            >
              {isAutoRotating ? <Pause size={12} /> : <Play size={12} />}
              <span>360° Orbit</span>
            </button>
          </div>
        </div>

        {/* Right: Wall Height, Lighting, Zoom & Export */}
        <div className="naksha-3d-hud-right">
          {/* Wall Cutaway Mode */}
          <div className="naksha-3d-btn-group" style={{ padding: '3px' }}>
            <button
              type="button"
              className={`naksha-3d-icon-btn ${wallHeightMode === 'dollhouse' ? 'active' : ''}`}
              onClick={() => setWallHeightMode('dollhouse')}
              title="Cutaway Walls (3.5 ft walls for clear interior layout viewing)"
              style={{ fontSize: '12px', fontWeight: 800, padding: '5px 10px', height: '30px' }}
            >
              <Box size={14} />
              <span className="hud-text">Cutaway 3D</span>
            </button>
            <button
              type="button"
              className={`naksha-3d-icon-btn ${wallHeightMode === 'full' ? 'active' : ''}`}
              onClick={() => setWallHeightMode('full')}
              title="Full Height Realistic Walls (9.5 ft)"
              style={{ fontSize: '12px', fontWeight: 800, padding: '5px 10px', height: '30px' }}
            >
              <Home size={14} />
              <span className="hud-text">Full 3D House</span>
            </button>
          </div>

          {/* Furniture Layer Toggle */}
          <div className="naksha-3d-btn-group" style={{ padding: '3px' }}>
            <button
              type="button"
              className={`naksha-3d-icon-btn ${showFurniture ? 'active' : ''}`}
              onClick={() => setShowFurniture(f => !f)}
              title="Toggle Interior Furniture & Decor"
              style={{ fontSize: '12px', fontWeight: 800, padding: '5px 10px', height: '30px' }}
            >
              <Layers size={14} />
              <span className="hud-text">{showFurniture ? '✓ Furniture ON' : 'Furniture OFF'}</span>
            </button>
          </div>

          {/* Lighting Mode */}
          <div className="naksha-3d-btn-group" style={{ padding: '3px' }}>
            <button
              type="button"
              className={`naksha-3d-icon-btn ${lightingMode === 'daylight' ? 'active' : ''}`}
              onClick={() => setLightingMode('daylight')}
              title="Daylight Mode"
              style={{ padding: '5px 8px', height: '30px' }}
            >
              <Sun size={14} />
            </button>
            <button
              type="button"
              className={`naksha-3d-icon-btn ${lightingMode === 'evening' ? 'active' : ''}`}
              onClick={() => setLightingMode('evening')}
              title="Evening / Golden Hour Mode"
              style={{ padding: '5px 8px', height: '30px' }}
            >
              <Moon size={14} />
            </button>
          </div>

          {/* Zoom controls */}
          <div className="naksha-3d-btn-group" style={{ padding: '3px' }}>
            <button 
              type="button" 
              className="naksha-3d-icon-btn" 
              onClick={() => setZoom(z => Math.max(0.6, z - 0.15))}
              title="Zoom Out"
              style={{ height: '30px' }}
            >
              <ZoomOut size={14} />
            </button>
            <button 
              type="button" 
              className="naksha-3d-icon-btn zoom-label" 
              onClick={() => setZoom(1.0)}
              title="Reset Zoom"
              style={{ height: '30px', fontWeight: 800 }}
            >
              {Math.round(zoom * 100)}%
            </button>
            <button 
              type="button" 
              className="naksha-3d-icon-btn" 
              onClick={() => setZoom(z => Math.min(2.0, z + 0.15))}
              title="Zoom In"
              style={{ height: '30px' }}
            >
              <ZoomIn size={14} />
            </button>
          </div>

          <button 
            type="button" 
            className="naksha-3d-action-btn"
            onClick={export3DSnapshot}
            title="Download 3D Snapshot"
            style={{ fontWeight: 800, padding: '6px 14px', height: '30px' }}
          >
            <Download size={13} /> Export
          </button>
          
          <button 
            type="button" 
            className="naksha-3d-icon-btn"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            style={{ height: '30px' }}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* ─── Floating 3D Interaction Spoon-Fed Guide ─── */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(11, 23, 38, 0.85)',
        backdropFilter: 'blur(8px)',
        color: '#ffffff',
        padding: '6px 16px',
        borderRadius: 'var(--radius-full)',
        fontSize: '12px',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: 50,
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
        pointerEvents: 'none',
        letterSpacing: '0.2px'
      }}>
        <span>💡 360° घुमाने के लिए ड्रैग करें • ज़ूम करने के लिए स्क्रॉल करें • कमरों की जानकारी के लिए क्लिक करें</span>
      </div>

      {/* ─── 3D Viewport Stage ─── */}
      <div 
        className="naksha-3d-stage"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* 3D Transform Root Scene */}
        <div 
          className="naksha-3d-scene"
          style={{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom}) rotateX(${rotX}deg) rotateZ(${rotY}deg)`,
          }}
        >
          {/* Ground Terrain Plane with Outdoor Garden & Driveway */}
          <div 
            className="naksha-3d-ground-plane"
            style={{
              width: `${plotPxW + 160}px`,
              height: `${plotPxD + 160}px`,
            }}
          >
            {/* Road on the front facing side */}
            <div 
              className="naksha-3d-road-band"
              style={{
                width: `${plotPxW + 240}px`,
                height: '70px',
                top: '-85px',
                left: '-40px',
              }}
            >
              <div className="naksha-3d-road-divider" />
              <span>30 FT SECTOR ROAD • {plot.roadFacing.toUpperCase()} ENTRANCE</span>
            </div>

            {/* Plot Boundary Wall with Footing */}
            <div 
              className="naksha-3d-plot-boundary"
              style={{
                width: `${plotPxW}px`,
                height: `${plotPxD}px`,
                top: '80px',
                left: '80px',
              }}
            >
              {/* Front Lawn / Garden Grass Texture */}
              <div className="naksha-3d-lawn-floor" />

              {/* Driveway Pavers */}
              <div 
                className="naksha-3d-driveway"
                style={{
                  width: `${(plot.setbacks.left + 12) * scale}px`,
                  height: `${plot.setbacks.front * scale + 40}px`,
                  bottom: '0px',
                  left: '0px',
                }}
              />

              {/* ─── ROOMS ARCHITECTURAL 3D MASSING ─── */}
              {rooms.map((room) => {
                const rx = room.x * scale;
                const ry = room.y * scale;
                const rw = room.width * scale;
                const rh = room.height * scale;
                const isSelected = selectedElement?.id === room.id;
                const isHovered = hoveredRoomId === room.id;

                // Determine floor material styling class
                const materialClass = 
                  room.category === 'master_bedroom' || room.category === 'bedroom' ? 'mat-hardwood' :
                  room.category === 'living' || room.category === 'dining' ? 'mat-marble' :
                  room.category === 'kitchen' || room.category === 'bathroom' ? 'mat-tile' :
                  room.category === 'puja' ? 'mat-puja' :
                  room.category === 'parking' ? 'mat-driveway' :
                  room.category === 'balcony' ? 'mat-deck' : 'mat-default';

                return (
                  <div
                    key={room.id}
                    className={`naksha-3d-room ${materialClass} ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
                    style={{
                      left: `${rx}px`,
                      top: `${ry}px`,
                      width: `${rw}px`,
                      height: `${rh}px`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectElement?.({ type: 'room', id: room.id });
                    }}
                    onMouseEnter={() => setHoveredRoomId(room.id)}
                    onMouseLeave={() => setHoveredRoomId(null)}
                  >
                    {/* Floor Slab Texture Face */}
                    <div className="naksha-3d-room-floor">
                      {/* Room Label */}
                      <div className="naksha-3d-room-label">
                        <strong>{room.name}</strong>
                        <small>{formatFeetInches(room.width)} × {formatFeetInches(room.height)}</small>
                      </div>
                    </div>

                    {/* Extruded 3D Walls */}
                    {/* North Wall */}
                    <div className="naksha-3d-wall wall-north" style={{ height: `${wallHeightPx}px` }} />
                    {/* South Wall */}
                    <div className="naksha-3d-wall wall-south" style={{ height: `${wallHeightPx}px` }} />
                    {/* East Wall */}
                    <div className="naksha-3d-wall wall-east" style={{ height: `${wallHeightPx}px` }} />
                    {/* West Wall */}
                    <div className="naksha-3d-wall wall-west" style={{ height: `${wallHeightPx}px` }} />

                    {/* Room Interior Ceiling Downlight (Glowing in Evening mode) */}
                    <div className="naksha-3d-downlight" />

                    {/* 3D Realistic Room Furniture Models */}
                    {showFurniture && (
                      <div className="naksha-3d-furniture-layer">
                        {/* Bed for Bedrooms */}
                        {(room.category === 'master_bedroom' || room.category === 'bedroom') && (
                          <div className="model-3d-bed" style={{ width: `${Math.min(rw * 0.65, 85)}px`, height: `${Math.min(rh * 0.65, 95)}px` }}>
                            <div className="bed-headboard" />
                            <div className="bed-mattress">
                              <div className="bed-pillow p1" />
                              <div className="bed-pillow p2" />
                              <div className="bed-duvet" />
                            </div>
                            <div className="bed-nightstand n1" />
                            <div className="bed-nightstand n2" />
                          </div>
                        )}

                        {/* Living Lounge: Sectional Sofa & Coffee Table */}
                        {room.category === 'living' && (
                          <div className="model-3d-living">
                            <div className="model-sofa-l">
                              <div className="sofa-seat main" />
                              <div className="sofa-seat l-side" />
                              <div className="sofa-cushions" />
                            </div>
                            <div className="model-coffee-table" />
                            <div className="model-tv-unit" />
                            <div className="model-area-rug" />
                          </div>
                        )}

                        {/* Dining Room: 6-Seater Table */}
                        {room.category === 'dining' && (
                          <div className="model-3d-dining">
                            <div className="model-dining-table">
                              <div className="table-top" />
                              <div className="chair c1" />
                              <div className="chair c2" />
                              <div className="chair c3" />
                              <div className="chair c4" />
                              <div className="chair c5" />
                              <div className="chair c6" />
                            </div>
                          </div>
                        )}

                        {/* Kitchen: L-Counter, Hob, Sink, Refrigerator */}
                        {room.category === 'kitchen' && (
                          <div className="model-3d-kitchen">
                            <div className="kitchen-counter-l" />
                            <div className="kitchen-hob" />
                            <div className="kitchen-sink" />
                            <div className="kitchen-fridge" />
                          </div>
                        )}

                        {/* Bathroom: Wall-hung WC, Glass Shower, Basin */}
                        {room.category === 'bathroom' && (
                          <div className="model-3d-bathroom">
                            <div className="bath-wc" />
                            <div className="bath-shower-glass" />
                            <div className="bath-vanity" />
                          </div>
                        )}

                        {/* Puja Mandir */}
                        {room.category === 'puja' && (
                          <div className="model-3d-mandir">
                            <div className="mandir-sanctum" />
                            <div className="mandir-dome" />
                            <div className="mandir-brass-lamp" />
                          </div>
                        )}

                        {/* Parking Porch: Sedan Car */}
                        {room.category === 'parking' && (
                          <div className="model-3d-car">
                            <div className="car-body">
                              <div className="car-roof" />
                              <div className="car-windshield" />
                              <div className="car-headlights" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Main Entrance Gate */}
              <div 
                className="naksha-3d-gate"
                style={{
                  width: '60px',
                  height: '8px',
                  top: '0px',
                  left: `${plotPxW * 0.4}px`,
                }}
              >
                <span>MAIN GATE</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Compass Orientation Rose Indicator ─── */}
        <div className="naksha-3d-compass-widget">
          <div 
            className="naksha-3d-compass-disc"
            style={{ transform: `rotate(${-rotY}deg)` }}
          >
            <span className="dir n">N</span>
            <span className="dir e">E</span>
            <span className="dir s">S</span>
            <span className="dir w">W</span>
            <div className="compass-needle" />
          </div>
          <span className="compass-sub">{plot.roadFacing} Facing</span>
        </div>

        {/* ─── Floating Room Info HUD ─── */}
        {activeRoom && (
          <div className="naksha-3d-room-card animate-slideUp">
            <div className="room-card-badge">
              <Sparkles size={13} className="text-accent" />
              <span>{activeRoom.category.replace('_', ' ').toUpperCase()}</span>
            </div>
            <h4 className="room-card-title">{activeRoom.name}</h4>
            <div className="room-card-metrics">
              <span><strong>Dimensions:</strong> {formatFeetInches(activeRoom.width)} × {formatFeetInches(activeRoom.height)}</span>
              <span>•</span>
              <span><strong>Area:</strong> {Math.round(activeRoom.width * activeRoom.height)} sq.ft ({Math.round((activeRoom.width * activeRoom.height) / 9)} Gaj)</span>
            </div>
            {activeRoom.specs?.vastuZone && (
              <div className="room-card-vastu">
                <Compass size={12} />
                <span>Vastu Zone: {activeRoom.specs.vastuZone}</span>
              </div>
            )}
          </div>
        )}

        {/* ─── Floating Live Construction Cost HUD Pill ─── */}
        <div 
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '20px',
            background: 'rgba(15, 23, 42, 0.90)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            borderRadius: '12px',
            padding: '8px 14px',
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 40,
            boxShadow: '0 4px 16px rgba(0,0,0,0.35)'
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <span>
            Est. Build Cost:{' '}
            <strong style={{ color: '#60a5fa' }}>
              ₹{Math.round((rooms.reduce((s, r) => s + (r.width * r.height), 0) * 1.18 * 2 * 2000) / 100000)}–
              {Math.round((rooms.reduce((s, r) => s + (r.width * r.height), 0) * 1.18 * 2 * 2550) / 100000)} L
            </strong>{' '}
            <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 500 }}>
              (Standard G+1 &bull; {Math.round(rooms.reduce((s, r) => s + (r.width * r.height), 0) * 1.18 * 2)} sq.ft slab)
            </span>
          </span>
        </div>

        {/* ─── Navigation Helper Pill ─── */}
        <div className="naksha-3d-drag-hint">
          <span>🖱️ <strong>360° Interactive:</strong> Click & drag to rotate freely • Scroll to zoom • Click rooms to inspect</span>
        </div>
      </div>
    </div>
  );
}
