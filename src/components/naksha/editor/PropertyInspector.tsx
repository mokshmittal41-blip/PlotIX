import { 
  Sliders, Trash2, Copy, RotateCw, 
  X, Sun, Wind, Shield
} from 'lucide-react';
import type { 
  FloorPlanModel, 
  RoomGeometry, 
  DoorGeometry, 
  WindowGeometry, 
  FurnitureGeometry 
} from '../geometry/types';
import { formatFeetInches } from '../geometry/constraintSolver';

interface Props {
  model: FloorPlanModel;
  selectedElement: {
    type: 'room' | 'door' | 'window' | 'furniture';
    id: string;
  } | null;
  onUpdateModel: (updated: FloorPlanModel) => void;
  onDeselect: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function PropertyInspector({
  model,
  selectedElement,
  onUpdateModel,
  onDeselect,
  isCollapsed = false,
  onToggleCollapse
}: Props) {
  
  // Find selected item if any
  const selectedRoom = selectedElement?.type === 'room' 
    ? model.rooms.find(r => r.id === selectedElement.id) 
    : undefined;

  const selectedDoor = selectedElement?.type === 'door'
    ? model.doors.find(d => d.id === selectedElement.id)
    : undefined;

  const selectedWindow = selectedElement?.type === 'window'
    ? model.windows.find(w => w.id === selectedElement.id)
    : undefined;

  const selectedFurniture = selectedElement?.type === 'furniture'
    ? model.furniture.find(f => f.id === selectedElement.id)
    : undefined;

  // Handlers for Room
  const handleUpdateRoom = (updates: Partial<RoomGeometry>) => {
    if (!selectedRoom) return;
    const updatedRooms = model.rooms.map(r => 
      r.id === selectedRoom.id ? { ...r, ...updates } : r
    );
    onUpdateModel({ ...model, rooms: updatedRooms });
  };

  const handleDeleteRoom = () => {
    if (!selectedRoom) return;
    const updatedRooms = model.rooms.filter(r => r.id !== selectedRoom.id);
    const updatedDoors = model.doors.filter(d => d.roomId !== selectedRoom.id);
    const updatedWindows = model.windows.filter(w => w.roomId !== selectedRoom.id);
    const updatedFurniture = model.furniture.filter(f => f.roomId !== selectedRoom.id);
    onUpdateModel({
      ...model,
      rooms: updatedRooms,
      doors: updatedDoors,
      windows: updatedWindows,
      furniture: updatedFurniture
    });
    onDeselect();
  };

  const handleDuplicateRoom = () => {
    if (!selectedRoom) return;
    const newRoom: RoomGeometry = {
      ...selectedRoom,
      id: `room_${selectedRoom.category}_${Date.now()}`,
      name: `${selectedRoom.name} Copy`,
      x: selectedRoom.x + 2,
      y: selectedRoom.y + 2
    };
    onUpdateModel({ ...model, rooms: [...model.rooms, newRoom] });
  };

  // Handlers for Door
  const handleUpdateDoor = (updates: Partial<DoorGeometry>) => {
    if (!selectedDoor) return;
    const updatedDoors = model.doors.map(d => 
      d.id === selectedDoor.id ? { ...d, ...updates } : d
    );
    onUpdateModel({ ...model, doors: updatedDoors });
  };

  const handleDeleteDoor = () => {
    if (!selectedDoor) return;
    onUpdateModel({
      ...model,
      doors: model.doors.filter(d => d.id !== selectedDoor.id)
    });
    onDeselect();
  };

  // Handlers for Window
  const handleUpdateWindow = (updates: Partial<WindowGeometry>) => {
    if (!selectedWindow) return;
    const updatedWindows = model.windows.map(w => 
      w.id === selectedWindow.id ? { ...w, ...updates } : w
    );
    onUpdateModel({ ...model, windows: updatedWindows });
  };

  const handleDeleteWindow = () => {
    if (!selectedWindow) return;
    onUpdateModel({
      ...model,
      windows: model.windows.filter(w => w.id !== selectedWindow.id)
    });
    onDeselect();
  };

  // Handlers for Furniture
  const handleUpdateFurniture = (updates: Partial<FurnitureGeometry>) => {
    if (!selectedFurniture) return;
    const updatedFurniture = model.furniture.map(f => 
      f.id === selectedFurniture.id ? { ...f, ...updates } : f
    );
    onUpdateModel({ ...model, furniture: updatedFurniture });
  };

  const handleDeleteFurniture = () => {
    if (!selectedFurniture) return;
    onUpdateModel({
      ...model,
      furniture: model.furniture.filter(f => f.id !== selectedFurniture.id)
    });
    onDeselect();
  };

  if (isCollapsed) {
    return (
      <div className="property-inspector-collapsed-bar" style={{ width: '48px', background: '#ffffff', borderLeft: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', gap: '12px' }}>
        <button 
          type="button" 
          className="cad-icon-btn"
          onClick={onToggleCollapse}
          title="Expand Properties & Overview"
        >
          <Sliders size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="property-inspector-panel">
      
      {/* Inspector Header */}
      <div className="inspector-header">
        <div className="inspector-title">
          <Sliders size={15} color="#2563eb" />
          <span>{selectedElement ? 'Properties' : 'Plan Overview'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {selectedElement && (
            <button 
              type="button" 
              className="cad-icon-btn"
              style={{ width: '26px', height: '26px' }}
              onClick={onDeselect}
              title="Deselect"
            >
              <X size={14} />
            </button>
          )}
          {onToggleCollapse && (
            <button 
              type="button" 
              className="cad-icon-btn"
              style={{ width: '26px', height: '26px' }}
              onClick={onToggleCollapse}
              title="Close Properties"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="inspector-content-scrollable">
        
        {/* ─── 1. SELECTED ROOM INSPECTION ──────────────────────────────────────── */}
        {selectedRoom && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Header Badge */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
                  {selectedRoom.category.replace('_', ' ')}
                </span>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                  ID: {selectedRoom.id.substring(0, 10)}
                </span>
              </div>
              <input 
                type="text"
                value={selectedRoom.name}
                onChange={(e) => handleUpdateRoom({ name: e.target.value })}
                style={{ width: '100%', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '8px', padding: '6px 10px', fontSize: '13px', fontWeight: 800, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Position Controls */}
            <div>
              <span className="inspector-section-label">Position & Coordinates</span>
              <div className="inspector-inputs-pair">
                <div className="inspector-input-box">
                  <label>X Position (ft)</label>
                  <input 
                    type="number" 
                    step={0.5}
                    value={selectedRoom.x}
                    onChange={(e) => handleUpdateRoom({ x: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="inspector-input-box">
                  <label>Y Position (ft)</label>
                  <input 
                    type="number" 
                    step={0.5}
                    value={selectedRoom.y}
                    onChange={(e) => handleUpdateRoom({ y: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>

            {/* Dimensions Controls */}
            <div>
              <span className="inspector-section-label">Room Dimensions</span>
              <div className="inspector-inputs-pair">
                <div className="inspector-input-box">
                  <label>Width (ft)</label>
                  <input 
                    type="number" 
                    min={4}
                    max={50}
                    step={0.5}
                    value={selectedRoom.width}
                    onChange={(e) => handleUpdateRoom({ width: Math.max(4, parseFloat(e.target.value) || 4) })}
                  />
                </div>
                <div className="inspector-input-box">
                  <label>Height / Depth (ft)</label>
                  <input 
                    type="number" 
                    min={4}
                    max={50}
                    step={0.5}
                    value={selectedRoom.height}
                    onChange={(e) => handleUpdateRoom({ height: Math.max(4, parseFloat(e.target.value) || 4) })}
                  />
                </div>
              </div>
            </div>

            {/* Area & Perimeter Pill */}
            <div className="inspector-stat-pill">
              <div>
                <div style={{ fontSize: '10.5px', color: '#64748b' }}>Floor Area</div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#1e3a8a' }}>
                  {Math.round(selectedRoom.width * selectedRoom.height)} sq ft
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10.5px', color: '#64748b' }}>Perimeter</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>
                  {2 * (selectedRoom.width + selectedRoom.height)} ft
                </div>
              </div>
            </div>

            {/* Environmental Scores */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span className="inspector-section-label" style={{ marginBottom: '2px' }}>Performance & Zoning</span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#475569' }}>
                  <Sun size={13} color="#f59e0b" /> Natural Daylight:
                </span>
                <span style={{ fontWeight: 800, color: '#16a34a' }}>92% Optimal</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#475569' }}>
                  <Wind size={13} color="#06b6d4" /> Cross Ventilation:
                </span>
                <span style={{ fontWeight: 800, color: '#16a34a' }}>Direct Exterior</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#475569' }}>
                  <Shield size={13} color="#8b5cf6" /> Privacy Zone:
                </span>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>Zone A (Private)</span>
              </div>
            </div>

            {/* Actions */}
            <div className="inspector-actions-row">
              <button 
                type="button" 
                className="inspector-btn-action"
                onClick={handleDuplicateRoom}
              >
                <Copy size={13} />
                <span>Duplicate</span>
              </button>
              <button 
                type="button" 
                className="inspector-btn-action delete"
                onClick={handleDeleteRoom}
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            </div>

          </div>
        )}

        {/* ─── 2. SELECTED DOOR INSPECTION ──────────────────────────────────────── */}
        {selectedDoor && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
                Wall Door ({selectedDoor.type})
              </span>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                Width: {formatFeetInches(selectedDoor.widthFt)}
              </div>
            </div>

            <div className="inspector-input-box">
              <label>Host Wall Side</label>
              <select 
                value={selectedDoor.wallSide}
                onChange={(e) => handleUpdateDoor({ wallSide: e.target.value as any })}
              >
                <option value="bottom">Front / South Wall</option>
                <option value="top">Rear / North Wall</option>
                <option value="left">Left / West Wall</option>
                <option value="right">Right / East Wall</option>
              </select>
            </div>

            <div className="inspector-input-box">
              <label>Swing Orientation</label>
              <select 
                value={selectedDoor.swing}
                onChange={(e) => handleUpdateDoor({ swing: e.target.value as any })}
              >
                <option value="in-left">Inward Left (Standard)</option>
                <option value="in-right">Inward Right</option>
                <option value="out-left">Outward Left</option>
                <option value="out-right">Outward Right</option>
              </select>
            </div>

            <div className="inspector-actions-row">
              <button 
                type="button" 
                className="inspector-btn-action delete"
                onClick={handleDeleteDoor}
              >
                <Trash2 size={13} />
                <span>Delete Door</span>
              </button>
            </div>
          </div>
        )}

        {/* ─── 3. SELECTED WINDOW INSPECTION ────────────────────────────────────── */}
        {selectedWindow && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
                Glazed Window ({selectedWindow.type})
              </span>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                Width: {formatFeetInches(selectedWindow.widthFt)}
              </div>
            </div>

            <div className="inspector-input-box">
              <label>Host Wall Side</label>
              <select 
                value={selectedWindow.wallSide}
                onChange={(e) => handleUpdateWindow({ wallSide: e.target.value as any })}
              >
                <option value="top">Rear / North Wall</option>
                <option value="bottom">Front / South Wall</option>
                <option value="left">Left / West Wall</option>
                <option value="right">Right / East Wall</option>
              </select>
            </div>

            <div className="inspector-actions-row">
              <button 
                type="button" 
                className="inspector-btn-action delete"
                onClick={handleDeleteWindow}
              >
                <Trash2 size={13} />
                <span>Delete Window</span>
              </button>
            </div>
          </div>
        )}

        {/* ─── 4. SELECTED FURNITURE INSPECTION ─────────────────────────────────── */}
        {selectedFurniture && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
                Architectural Fixture
              </span>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                {selectedFurniture.type.replace('_', ' ').toUpperCase()}
              </div>
            </div>

            <div className="inspector-inputs-pair">
              <div className="inspector-input-box">
                <label>Width (ft)</label>
                <input 
                  type="number" 
                  step={0.5}
                  value={selectedFurniture.width}
                  onChange={(e) => handleUpdateFurniture({ width: parseFloat(e.target.value) || 1 })}
                />
              </div>
              <div className="inspector-input-box">
                <label>Height (ft)</label>
                <input 
                  type="number" 
                  step={0.5}
                  value={selectedFurniture.height}
                  onChange={(e) => handleUpdateFurniture({ height: parseFloat(e.target.value) || 1 })}
                />
              </div>
            </div>

            <div className="inspector-input-box">
              <label>Rotation Angle</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 900, color: '#0f172a' }}>
                  {selectedFurniture.rotation}°
                </span>
                <button
                  type="button"
                  className="inspector-btn-action"
                  onClick={() => handleUpdateFurniture({ rotation: (selectedFurniture.rotation + 90) % 360 })}
                >
                  <RotateCw size={13} />
                  <span>Rotate 90°</span>
                </button>
              </div>
            </div>

            <div className="inspector-actions-row">
              <button 
                type="button" 
                className="inspector-btn-action delete"
                onClick={handleDeleteFurniture}
              >
                <Trash2 size={13} />
                <span>Delete Fixture</span>
              </button>
            </div>
          </div>
        )}

        {/* ─── 5. DEFAULT: PLAN & PLOT OVERVIEW ─────────────────────────────────── */}
        {!selectedElement && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Plot Stats Card */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 900, color: '#0f172a', marginBottom: '10px' }}>
                📐 Site & Plot Geometry
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Plot Dimensions:</span>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>{model.plot.width} × {model.plot.depth} ft</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Total Plot Area:</span>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>{(model.plot.width * model.plot.depth).toLocaleString()} sq ft</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Road Facing:</span>
                  <span style={{ fontWeight: 800, color: '#2563eb' }}>{model.plot.roadFacing}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Built-Up Area:</span>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>{model.builtUpAreaSqFt} sq ft</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Carpet Area:</span>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>{model.carpetAreaSqFt} sq ft</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Ground Coverage:</span>
                  <span style={{ fontWeight: 800, color: '#16a34a' }}>{model.coveragePercent}%</span>
                </div>
              </div>
            </div>

            {/* Setbacks Summary */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>
                Mandatory Setbacks
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11.5px' }}>
                <span style={{ color: '#64748b' }}>Front: <strong>{model.plot.setbacks.front} ft</strong></span>
                <span style={{ color: '#64748b' }}>Rear: <strong>{model.plot.setbacks.rear} ft</strong></span>
                <span style={{ color: '#64748b' }}>Left: <strong>{model.plot.setbacks.left} ft</strong></span>
                <span style={{ color: '#64748b' }}>Right: <strong>{model.plot.setbacks.right} ft</strong></span>
              </div>
            </div>

            {/* Tip */}
            <div style={{ fontSize: '11.5px', color: '#64748b', lineHeight: 1.4, padding: '4px' }}>
              ✦ Click any room, door, window or fixture on the canvas to inspect and edit its CAD parameters.
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
