import { useState, useEffect, useRef } from 'react';
import { 
  Layers, Download, RefreshCw, ZoomIn, 
  ZoomOut, Columns, Sliders,
  Undo2, Redo2, Grid, Magnet, Plus,
  ArrowLeft, Compass, Sun, Wind, Car, Box, Building2,
  FileCode, Image, AlertTriangle, ChevronDown
} from 'lucide-react';
import type { 
  FloorPlanModel, 
  RoomCategory, 
  FurnitureType,
  AIChangeProposal
} from './geometry/types';
import { HistoryManager } from './geometry/historyManager';
import { applyNaturalLanguageEdit } from './geometry/nlpEditor';
import { downloadFloorPlanDXF, downloadFloorPlanSVG } from './geometry/dxfExporter';

import FloorPlanVisualizer from './FloorPlanVisualizer';
import Naksha3DVisualizer from './Naksha3DVisualizer';
import ConstructionCostEstimator from '../calculator/ConstructionCostEstimator';
import ElementLibrary from './editor/ElementLibrary';
import PropertyInspector from './editor/PropertyInspector';
import AICommandBar from './editor/AICommandBar';

interface Props {
  plans: FloorPlanModel[];
  onBackToWizard?: () => void;
  onRegeneratePlans?: () => void;
}

export default function LiveNakshaCanvas({
  plans: initialPlans,
  onBackToWizard,
  onRegeneratePlans
}: Props) {
  const [plans, setPlans] = useState<FloorPlanModel[]>(initialPlans);
  const [selectedPlanIdx, setSelectedPlanIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'2d' | '3d' | 'compare' | 'score' | 'cost'>('2d');
  const [zoomPercent, setZoomPercent] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [enableSnap, setEnableSnap] = useState(true);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showCapacityBanner, setShowCapacityBanner] = useState(true);

  // On mobile (< 900px), collapse sidebars by default so Naksha Blueprint is front & center
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 900 : false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 900 : false);

  const [selectedElement, setSelectedElement] = useState<{
    type: 'room' | 'door' | 'window' | 'furniture';
    id: string;
  } | null>(null);

  const handleSelectElement = (elem: { type: 'room' | 'door' | 'window' | 'furniture'; id: string } | null) => {
    setSelectedElement(elem);
    if (elem && typeof window !== 'undefined' && window.innerWidth < 900) {
      setIsRightCollapsed(false);
      setIsLeftCollapsed(true);
    }
  };

  // History Manager
  const historyRef = useRef<HistoryManager>(new HistoryManager(plans[0]));
  const [, setHistoryTick] = useState(0);

  // AI Command processing
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [activeAIProposal, setActiveAIProposal] = useState<AIChangeProposal | null>(null);

  const activePlan = plans[selectedPlanIdx] || plans[0];

  // Update plan with history snapshot
  const updateActivePlan = (updated: FloorPlanModel, pushToHistory = true) => {
    if (pushToHistory) {
      historyRef.current.pushState(updated);
      setHistoryTick(t => t + 1);
    }
    setPlans(prev => prev.map((p, i) => i === selectedPlanIdx ? updated : p));
  };

  const handleUndo = () => {
    const prev = historyRef.current.undo();
    if (prev) {
      setPlans(all => all.map((p, i) => i === selectedPlanIdx ? prev : p));
      setHistoryTick(t => t + 1);
      setSelectedElement(null);
    }
  };

  const handleRedo = () => {
    const next = historyRef.current.redo();
    if (next) {
      setPlans(all => all.map((p, i) => i === selectedPlanIdx ? next : p));
      setHistoryTick(t => t + 1);
      setSelectedElement(null);
    }
  };

  // Keyboard shortcut listener (Ctrl+Z, Ctrl+Y, Delete)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Library Action: Add Room
  const handleAddRoom = (cat: RoomCategory, name: string, w: number, h: number) => {
    const newRoom = {
      id: `room_${cat}_${Date.now()}`,
      name: name || cat.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      category: cat,
      x: activePlan.plot.setbacks.left + 2,
      y: activePlan.plot.setbacks.rear + 2,
      width: w,
      height: h,
      zone: (cat === 'master_bedroom' || cat === 'bedroom' || cat === 'study' ? 'private' : cat === 'living' || cat === 'dining' ? 'public' : 'service') as any,
      specs: { naturalLight: 'Daylight', privacy: 'Standard', ventilation: 'Direct' }
    };
    updateActivePlan({
      ...activePlan,
      rooms: [...activePlan.rooms, newRoom]
    });
    setSelectedElement({ type: 'room', id: newRoom.id });
  };

  // Library Action: Add Opening
  const handleAddOpening = (type: 'door' | 'window', widthFt: number, subType?: string) => {
    if (type === 'door') {
      const newDoor = {
        id: `door_${Date.now()}`,
        roomId: activePlan.rooms[0]?.id || 'room_master_1',
        tag: 'D3',
        wallSide: 'bottom' as const,
        offsetFt: 2.0,
        widthFt,
        swing: 'in-left' as const,
        type: (subType as any) || 'single'
      };
      updateActivePlan({
        ...activePlan,
        doors: [...activePlan.doors, newDoor]
      });
      setSelectedElement({ type: 'door', id: newDoor.id });
    } else {
      const newWin = {
        id: `win_${Date.now()}`,
        roomId: activePlan.rooms[0]?.id || 'room_master_1',
        tag: 'W2',
        wallSide: 'top' as const,
        offsetFt: 2.0,
        widthFt,
        type: (subType as any) || 'standard'
      };
      updateActivePlan({
        ...activePlan,
        windows: [...activePlan.windows, newWin]
      });
      setSelectedElement({ type: 'window', id: newWin.id });
    }
  };

  // Library Action: Add Furniture
  const handleAddFurniture = (type: FurnitureType, w: number, h: number) => {
    const firstRoom = activePlan.rooms[0];
    const newFur = {
      id: `fur_${type}_${Date.now()}`,
      roomId: firstRoom?.id || 'room_master_1',
      type,
      x: 2,
      y: 2,
      width: w,
      height: h,
      rotation: 0
    };
    updateActivePlan({
      ...activePlan,
      furniture: [...activePlan.furniture, newFur]
    });
    setSelectedElement({ type: 'furniture', id: newFur.id });
  };

  // AI Command Execution -> Produces Proposal with Diff
  const handleExecuteAICommand = (prompt: string) => {
    setIsAIProcessing(true);
    setTimeout(() => {
      const proposal = applyNaturalLanguageEdit(activePlan, prompt);
      setActiveAIProposal(proposal);
      setIsAIProcessing(false);
    }, 600);
  };

  const handleApplyAIProposal = () => {
    if (!activeAIProposal) return;
    updateActivePlan(activeAIProposal.proposedModel, true);
    setActiveAIProposal(null);
  };

  const handleDiscardAIProposal = () => {
    setActiveAIProposal(null);
  };

  const handleExportDXF = () => {
    downloadFloorPlanDXF(activePlan);
    setShowExportMenu(false);
  };

  const handleExportSVG = () => {
    const svgElem = document.querySelector('.cad-viewport-wrapper svg') as SVGSVGElement;
    if (svgElem) {
      downloadFloorPlanSVG(svgElem, `PropWise_${activePlan.name.replace(/\s+/g, '_')}.svg`);
    } else {
      downloadFloorPlanDXF(activePlan);
    }
    setShowExportMenu(false);
  };

  return (
    <div className="cad-workspace-container">
      
      {/* ─── Top Header Toolbar ────────────────────────────────────────────────── */}
      <header className="cad-header">
        
        {/* Left: Back + Plan Option Switcher */}
        <div className="cad-header-left">
          {onBackToWizard && (
            <button 
              type="button" 
              className="cad-btn-back"
              onClick={onBackToWizard}
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
          )}

          <div className="cad-project-title">
            PropWise CAD Studio
          </div>

          {/* Plan Options */}
          {plans.length > 1 && (
            <div className="cad-plan-tabs-group">
              {plans.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  className={`cad-plan-tab-btn ${selectedPlanIdx === idx ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedPlanIdx(idx);
                    setSelectedElement(null);
                    historyRef.current = new HistoryManager(plans[idx]);
                  }}
                >
                  <span>0{idx + 1}</span>
                  <span>{idx === 0 ? 'Balanced' : idx === 1 ? 'Spacious' : 'Vastu'}</span>
                  <span className="cad-score-pill">{p.score}%</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center: View Mode Switcher */}
        <div className="cad-header-center">
          <div className="cad-view-modes-group">
            <button
              type="button"
              className={`cad-view-mode-btn ${viewMode === '2d' ? 'active' : ''}`}
              onClick={() => setViewMode('2d')}
              style={{ fontWeight: 800 }}
            >
              <Layers size={14} />
              <span>2D CAD Blueprint</span>
            </button>
            <button
              type="button"
              className={`cad-view-mode-btn ${viewMode === '3d' ? 'active' : ''}`}
              onClick={() => setViewMode('3d')}
              title="Interactive 360° 3D Architectural Naksha"
              style={{
                fontWeight: 800,
                background: viewMode === '3d' ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : '#f8fafc',
                color: viewMode === '3d' ? '#ffffff' : '#0f172a',
                border: viewMode === '3d' ? '1.5px solid #0f172a' : '1px solid #e2e8f0',
                boxShadow: viewMode === '3d' ? '0 2px 8px rgba(15, 23, 42, 0.25)' : 'none'
              }}
            >
              <Box size={14} />
              <span>✨ 3D Naksha (360°)</span>
            </button>
            {plans.length > 1 && (
              <button
                type="button"
                className={`cad-view-mode-btn ${viewMode === 'compare' ? 'active' : ''}`}
                onClick={() => setViewMode('compare')}
              >
                <Columns size={13} />
                <span>Compare 3</span>
              </button>
            )}
            <button
              type="button"
              className={`cad-view-mode-btn ${viewMode === 'score' ? 'active' : ''}`}
              onClick={() => setViewMode('score')}
            >
              <Sliders size={13} />
              <span>Scorecard</span>
            </button>
            <button
              type="button"
              className={`cad-view-mode-btn ${viewMode === 'cost' ? 'active' : ''}`}
              onClick={() => setViewMode('cost')}
              style={{
                fontWeight: 800,
                background: viewMode === 'cost' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#f8fafc',
                color: viewMode === 'cost' ? '#ffffff' : '#047857',
                border: viewMode === 'cost' ? '1.5px solid #059669' : '1px solid #e2e8f0',
                boxShadow: viewMode === 'cost' ? '0 2px 8px rgba(16, 185, 129, 0.3)' : 'none'
              }}
            >
              <Building2 size={13} />
              <span>💰 Construction Cost</span>
            </button>
          </div>
        </div>

        {/* Right: Undo/Redo, Tools, Zoom, Export */}
        <div className="cad-header-right" style={{ position: 'relative' }}>
          
          {/* Undo / Redo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: '#f1f5f9', padding: '2px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <button
              type="button"
              className="cad-icon-btn"
              style={{ width: '28px', height: '28px', border: 'none' }}
              onClick={handleUndo}
              disabled={!historyRef.current.canUndo}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={14} />
            </button>
            <button
              type="button"
              className="cad-icon-btn"
              style={{ width: '28px', height: '28px', border: 'none' }}
              onClick={handleRedo}
              disabled={!historyRef.current.canRedo}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={14} />
            </button>
          </div>

          {/* Grid & Snap */}
          <button
            type="button"
            className={`cad-icon-btn ${showGrid ? 'active' : ''}`}
            onClick={() => setShowGrid(g => !g)}
            title="Toggle Grid (1 ft)"
          >
            <Grid size={15} />
          </button>
          <button
            type="button"
            className={`cad-icon-btn ${enableSnap ? 'active' : ''}`}
            onClick={() => setEnableSnap(s => !s)}
            title="Toggle Magnetic Snapping"
          >
            <Magnet size={15} />
          </button>

          {/* Zoom */}
          <div className="cad-zoom-pill">
            <button 
              type="button" 
              onClick={() => setZoomPercent(z => Math.max(60, z - 10))}
              title="Zoom Out"
            >
              <ZoomOut size={13} />
            </button>
            <span className="cad-zoom-text">{zoomPercent}%</span>
            <button 
              type="button" 
              onClick={() => setZoomPercent(z => Math.min(150, z + 10))}
              title="Zoom In"
            >
              <ZoomIn size={13} />
            </button>
          </div>

          {onRegeneratePlans && (
            <button
              type="button"
              className="cad-icon-btn"
              onClick={onRegeneratePlans}
              title="Regenerate Layouts"
            >
              <RefreshCw size={14} />
            </button>
          )}

          {/* Export CAD Dropdown Trigger */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="cad-btn-export"
              onClick={() => setShowExportMenu(m => !m)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={13} />
              <span>Export CAD</span>
              <ChevronDown size={12} />
            </button>

            {/* Export Dropdown Menu */}
            {showExportMenu && (
              <div 
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '6px',
                  width: '260px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  border: '1px solid #e2e8f0',
                  padding: '8px',
                  zIndex: 1000,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <button
                  type="button"
                  onClick={handleExportDXF}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#f8fafc',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: '#0f172a',
                    fontWeight: 700,
                    fontSize: '12px',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#eff6ff')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#f8fafc')}
                >
                  <FileCode size={18} color="#2563eb" />
                  <div>
                    <div style={{ fontWeight: 800 }}>AutoCAD Vector (.DXF)</div>
                    <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 500 }}>Layer-separated CAD standard</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleExportSVG}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#f8fafc',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: '#0f172a',
                    fontWeight: 700,
                    fontSize: '12px',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#eff6ff')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#f8fafc')}
                >
                  <Image size={18} color="#16a34a" />
                  <div>
                    <div style={{ fontWeight: 800 }}>Vector Blueprint (.SVG)</div>
                    <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 500 }}>High-resolution printable sheet</div>
                  </div>
                </button>
              </div>
            )}
          </div>

        </div>

      </header>

      {/* ─── Mobile CAD Quick Action Bar ──────────────────────────────────────── */}
      <div className="cad-mobile-action-bar">
        <button
          type="button"
          className={`cad-mobile-btn ${!isLeftCollapsed ? 'active' : ''}`}
          onClick={() => {
            setIsLeftCollapsed(c => !c);
            setIsRightCollapsed(true);
          }}
        >
          <Plus size={14} />
          <span>➕ Add Room</span>
        </button>

        <button
          type="button"
          className={`cad-mobile-btn ${viewMode === '2d' ? 'active' : ''}`}
          onClick={() => {
            setViewMode('2d');
            setIsLeftCollapsed(true);
            setIsRightCollapsed(true);
          }}
        >
          <Layers size={14} />
          <span>📐 Naksha</span>
        </button>

        <button
          type="button"
          className={`cad-mobile-btn ${viewMode === '3d' ? 'active' : ''}`}
          onClick={() => {
            setViewMode(v => v === '3d' ? '2d' : '3d');
            setIsLeftCollapsed(true);
            setIsRightCollapsed(true);
          }}
        >
          <Box size={14} />
          <span>✨ 3D</span>
        </button>

        <button
          type="button"
          className={`cad-mobile-btn ${viewMode === 'cost' ? 'active' : ''}`}
          onClick={() => {
            setViewMode(v => v === 'cost' ? '2d' : 'cost');
            setIsLeftCollapsed(true);
            setIsRightCollapsed(true);
          }}
        >
          <Building2 size={14} />
          <span>💰 Cost</span>
        </button>

        <button
          type="button"
          className={`cad-mobile-btn ${!isRightCollapsed ? 'active' : ''}`}
          onClick={() => {
            setIsRightCollapsed(c => !c);
            setIsLeftCollapsed(true);
          }}
        >
          <Sliders size={14} />
          <span>Site Info</span>
        </button>
      </div>

      {/* ─── Main 3-Column Workspace Body ─────────────────────────────────────── */}
      <div className="cad-body-layout" onClick={() => setShowExportMenu(false)}>
        
        {/* Mobile Backdrop when side drawer is open */}
        {(!isLeftCollapsed || !isRightCollapsed) && (
          <div 
            className="cad-mobile-backdrop"
            onClick={() => {
              setIsLeftCollapsed(true);
              setIsRightCollapsed(true);
            }}
          />
        )}

        {/* Left: Element Library */}
        <ElementLibrary 
          onAddRoom={handleAddRoom}
          onAddOpening={handleAddOpening}
          onAddFurniture={handleAddFurniture}
          isCollapsed={isLeftCollapsed}
          onToggleCollapse={() => setIsLeftCollapsed(c => !c)}
        />

        {/* Center: Canvas Viewport & Bottom AI Command Dock */}
        <div className="cad-center-canvas-area" style={{ display: 'flex', flexDirection: 'column' }}>
          
          {/* Capacity Notice Banner if tight or exceeded */}
          {activePlan.capacityReport && activePlan.capacityReport.status !== 'feasible' && showCapacityBanner && (
            <div 
              style={{
                margin: '12px 16px 0',
                padding: '10px 16px',
                borderRadius: '8px',
                background: activePlan.capacityReport.status === 'exceeded' ? '#fef2f2' : '#fffbeb',
                border: activePlan.capacityReport.status === 'exceeded' ? '1px solid #fecaca' : '1px solid #fde68a',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <AlertTriangle 
                  size={16} 
                  color={activePlan.capacityReport.status === 'exceeded' ? '#dc2626' : '#d97706'} 
                  style={{ marginTop: '2px', flexShrink: 0 }} 
                />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: activePlan.capacityReport.status === 'exceeded' ? '#991b1b' : '#92400e' }}>
                    Plot Capacity Notice: {activePlan.capacityReport.message}
                  </div>
                  {activePlan.capacityReport.suggestions && activePlan.capacityReport.suggestions.length > 0 && (
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                      💡 Suggestion: {activePlan.capacityReport.suggestions[0]}
                    </div>
                  )}
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowCapacityBanner(false)}
                style={{ background: 'none', border: 'none', fontSize: '14px', color: '#94a3b8', cursor: 'pointer', padding: '0 4px' }}
              >
                ✕
              </button>
            </div>
          )}

          {/* 1. 2D CAD VIEW */}
          {viewMode === '2d' && (
            <div className="cad-canvas-viewport">
              <FloorPlanVisualizer 
                model={activePlan}
                onUpdateModel={updateActivePlan}
                selectedElement={selectedElement}
                onSelectElement={handleSelectElement}
                scaleMultiplier={zoomPercent / 100}
                showGrid={showGrid}
                enableSnap={enableSnap}
              />
            </div>
          )}

          {/* 2. 3D INTERACTIVE 360° NAKSHA VIEW */}
          {viewMode === '3d' && (
            <div className="cad-canvas-viewport" style={{ padding: 0, overflow: 'hidden' }}>
              <Naksha3DVisualizer 
                model={activePlan}
                selectedElement={selectedElement}
                onSelectElement={setSelectedElement}
                onBackTo2D={() => setViewMode('2d')}
              />
            </div>
          )}

          {/* 3. COMPARE ALL 3 OPTIONS VIEW */}
          {viewMode === 'compare' && (
            <div style={{ flex: 1, overflow: 'auto', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {plans.map((p, idx) => (
                <div 
                  key={p.id} 
                  style={{ background: '#ffffff', borderRadius: '16px', border: selectedPlanIdx === idx ? '2px solid #2563eb' : '1px solid #334155', padding: '16px', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                  onClick={() => { setSelectedPlanIdx(idx); setViewMode('2d'); }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 900, color: '#0f172a' }}>{p.name}</span>
                    <span style={{ fontSize: '11px', fontWeight: 800, background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '6px' }}>{p.score}% Match</span>
                  </div>
                  <div style={{ flex: 1, minHeight: '340px', background: '#f8fafc', borderRadius: '10px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FloorPlanVisualizer 
                      model={p} 
                      onUpdateModel={() => {}} 
                      selectedElement={null} 
                      onSelectElement={() => {}} 
                      scaleMultiplier={0.65} 
                      readOnly 
                    />
                  </div>
                  <button 
                    type="button" 
                    className="cad-btn-export" 
                    style={{ marginTop: '12px', justifyContent: 'center', width: '100%' }}
                  >
                    Select & Edit in CAD
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 4. SCORECARD & ARCHITECTURAL REPORT */}
          {viewMode === 'score' && (
            <div style={{ flex: 1, overflow: 'auto', padding: '32px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ maxWidth: '680px', width: '100%', background: '#ffffff', borderRadius: '20px', padding: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>
                  Architectural Evaluation Scorecard
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px' }}>
                  Parametric zoning and compliance evaluation for {activePlan.name}.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                      <Sun size={16} color="#f59e0b" /> Natural Daylight Access
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: '#16a34a' }}>96%</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>All habitable rooms receive direct exterior windows</div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                      <Wind size={16} color="#06b6d4" /> Cross Ventilation Flow
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: '#16a34a' }}>92%</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Opposing openings enable passive thermal cooling</div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                      <Compass size={16} color="#8b5cf6" /> Vastu Alignment Score
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: '#2563eb' }}>94%</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Master bed in SW, Kitchen in SE/NW zone</div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                      <Car size={16} color="#0f172a" /> Circulation & Parking Clearance
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: '#16a34a' }}>100%</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Zero corridor pinch points; direct driveway approach</div>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="cad-btn-export" 
                  style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                  onClick={() => setViewMode('2d')}
                >
                  Return to 2D CAD Editor
                </button>
              </div>
            </div>
          )}

          {/* 5. DYNAMIC CONSTRUCTION COST ESTIMATOR */}
          {viewMode === 'cost' && (
            <div style={{ flex: 1, overflow: 'auto', padding: '24px', background: '#f8fafc' }}>
              <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                      🏗️ AI Naksha Live Construction Budget
                    </h2>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>
                      Automatically calculated from your current <strong>{activePlan.name}</strong> layout ({activePlan.rooms.length} rooms &bull; {Math.round(activePlan.rooms.reduce((acc, r) => acc + (r.width * r.height), 0) * 1.18)} sq.ft estimated slab)
                    </p>
                  </div>
                  <button
                    type="button"
                    className="cad-btn-export"
                    onClick={() => setViewMode('2d')}
                  >
                    ← Back to 2D CAD Editor
                  </button>
                </div>

                <ConstructionCostEstimator
                  initialPlotArea={Math.round((activePlan.plot.width * activePlan.plot.depth) / 9)}
                  initialPlotUnit="sqyd"
                  initialBuiltUpArea={Math.round(activePlan.rooms.reduce((acc, r) => acc + (r.width * r.height), 0) * 1.18 * 2)}
                  initialFloors={2}
                />
              </div>
            </div>
          )}

          {/* Bottom AI Natural Language Command Bar */}
          <AICommandBar 
            onExecuteCommand={handleExecuteAICommand}
            isProcessing={isAIProcessing}
            activeProposal={activeAIProposal}
            onApplyProposal={handleApplyAIProposal}
            onDiscardProposal={handleDiscardAIProposal}
          />

        </div>

        {/* Right: Property Inspector */}
        <PropertyInspector 
          model={activePlan}
          selectedElement={selectedElement}
          onUpdateModel={updateActivePlan}
          onDeselect={() => setSelectedElement(null)}
          isCollapsed={isRightCollapsed}
          onToggleCollapse={() => setIsRightCollapsed(c => !c)}
        />

      </div>

    </div>
  );
}
