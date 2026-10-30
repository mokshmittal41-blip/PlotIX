import { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Maximize2, Minimize2, ZoomIn, ZoomOut, 
  Layers, Compass, Download, Copy, Check, Grid, Ruler,
  Sun, Moon, Rotate3d, Play, Pause, Box, Sparkles
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  type Point2D, 
  type DirectionFacing, 
  VASTU_DATA
} from '../../utils/landConversions';
import { formatINRCompact } from '../../utils/landValueCalculator';

export type PlotShapeMode = 'rectangular' | 'trapezoid' | 'l_shaped' | 'triangular' | 'irregular';

interface PlotBlueprintCanvasProps {
  shape: PlotShapeMode;
  frontage: number;      // ft
  depth: number;         // ft
  rearWidth?: number;    // for trapezoid (ft)
  depthRight?: number;   // for trapezoid (ft)
  cutoutWidth?: number;  // for L-shape (ft)
  cutoutDepth?: number;  // for L-shape (ft)
  triSides?: [number, number, number]; // [a, b, c]
  polygonVertices?: Point2D[];
  onUpdateVertices?: (verts: Point2D[]) => void;
  unit: string;
  unitLabel: string;
  areaSqFt: number;
  areaGaj: number;
  perimeterFt: number;
  estimatedValue: number;
  facing: DirectionFacing;
  onFacingChange?: (facing: DirectionFacing) => void;
  roadPosition: 'front' | 'rear' | 'left' | 'right';
  roadWidthFt: number;
  frontSetbackFt: number;
  rearSetbackFt: number;
  sideSetbackFt: number;
}

// Canvas Screen Coordinate System dimensions
const CANVAS_W = 820;
const CANVAS_H = 540;

export default function PlotBlueprintCanvas({
  shape,
  frontage,
  depth,
  rearWidth = frontage,
  depthRight = depth,
  cutoutWidth = frontage * 0.4,
  cutoutDepth = depth * 0.4,
  triSides = [frontage, depth, Math.hypot(frontage, depth)],
  polygonVertices,
  onUpdateVertices,
  unit,
  areaSqFt,
  areaGaj,
  perimeterFt,
  estimatedValue,
  facing,
  onFacingChange,
  roadPosition = 'front',
  roadWidthFt = 30,
  frontSetbackFt = 5,
  rearSetbackFt = 5,
  sideSetbackFt = 3,
}: PlotBlueprintCanvasProps) {
  const { language } = useLanguage();
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [themeMode, setThemeMode] = useState<'blueprint' | 'light'>('blueprint');
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [showSetbacks, setShowSetbacks] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [showVastu, setShowVastu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [draggingVertexIndex, setDraggingVertexIndex] = useState<number | null>(null);

  // 3D Isometric View State
  const [floors3D, setFloors3D] = useState<number>(3);
  const [rotX, setRotX] = useState<number>(60);
  const [rotZ, setRotZ] = useState<number>(-35);
  const [is3DOrbiting, setIs3DOrbiting] = useState<boolean>(false);
  const [lighting3D, setLighting3D] = useState<'day' | 'evening'>('day');
  const [isDragging3D, setIsDragging3D] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; rotX: number; rotZ: number }>({ x: 0, y: 0, rotX: 60, rotZ: -35 });
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Responsive container width tracking for phone support
  const [viewportWidth, setViewportWidth] = useState<number>(() => (typeof window !== 'undefined' ? window.innerWidth : 800));
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setViewportWidth(containerRef.current.clientWidth || window.innerWidth);
      } else {
        setViewportWidth(window.innerWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobileView = viewportWidth < 640;
  const isNarrowPhone = viewportWidth < 400;

  // Fluid 3D scale so isometric house fits all phone screen sizes (from 320px to 480px)
  const dynamic3DScale = useMemo(() => {
    if (viewportWidth < 340) return zoom * 0.54;
    if (viewportWidth < 380) return zoom * 0.62;
    if (viewportWidth < 430) return zoom * 0.70;
    if (viewportWidth < 520) return zoom * 0.78;
    if (viewportWidth < 680) return zoom * 0.86;
    if (viewportWidth < 768) return zoom * 0.92;
    return zoom;
  }, [viewportWidth, zoom]);

  // Correct linear unit (feet / yard / meter)
  const lengthUnitLabel = unit === 'sqyd' ? 'Gaj' : (unit === 'sqm' ? 'm' : 'ft');

  // Auto-Orbit animation
  useEffect(() => {
    let animFrame: number;
    if (is3DOrbiting && viewMode === '3d') {
      const loop = () => {
        setRotZ(prev => (prev + 0.4) % 360);
        animFrame = requestAnimationFrame(loop);
      };
      animFrame = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(animFrame);
  }, [is3DOrbiting, viewMode]);

  // Default irregular polygon in feet units
  const rawVertices = useMemo<Point2D[]>(() => {
    if (shape === 'irregular' && polygonVertices && polygonVertices.length >= 3) {
      return polygonVertices;
    }
    if (shape === 'trapezoid') {
      const w1 = Math.max(10, frontage);
      const w2 = Math.max(10, rearWidth);
      const d1 = Math.max(10, depth);
      const d2 = Math.max(10, depthRight);
      const offset = (w2 - w1) / 2;
      return [
        { x: 0, y: 0 },
        { x: w1, y: 0 },
        { x: w1 + offset, y: d2 },
        { x: -offset, y: d1 },
      ];
    }
    if (shape === 'l_shaped') {
      const w = Math.max(15, frontage);
      const d = Math.max(15, depth);
      const cw = Math.min(w * 0.7, Math.max(5, cutoutWidth));
      const cd = Math.min(d * 0.7, Math.max(5, cutoutDepth));
      return [
        { x: 0, y: 0 },
        { x: w, y: 0 },
        { x: w, y: d - cd },
        { x: w - cw, y: d - cd },
        { x: w - cw, y: d },
        { x: 0, y: d },
      ];
    }
    if (shape === 'triangular') {
      const a = triSides[0] || frontage || 40;
      const b = triSides[1] || depth || 50;
      const c = triSides[2] || 60;
      const cosA = (b * b + a * a - c * c) / (2 * a * b);
      const angleA = Math.acos(Math.max(-1, Math.min(1, cosA)));
      const x3 = b * Math.cos(angleA);
      const y3 = b * Math.sin(angleA);
      return [
        { x: 0, y: 0 },
        { x: a, y: 0 },
        { x: Math.max(0, x3), y: Math.max(10, y3) },
      ];
    }
    // Default rectangular
    const w = Math.max(10, frontage);
    const d = Math.max(10, depth);
    return [
      { x: 0, y: 0 },
      { x: w, y: 0 },
      { x: w, y: d },
      { x: 0, y: d },
    ];
  }, [shape, frontage, depth, rearWidth, depthRight, cutoutWidth, cutoutDepth, triSides, polygonVertices]);

  // Compute 2D Bounding Box in feet
  const bbox = useMemo(() => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    rawVertices.forEach(v => {
      if (v.x < minX) minX = v.x;
      if (v.x > maxX) maxX = v.x;
      if (v.y < minY) minY = v.y;
      if (v.y > maxY) maxY = v.y;
    });
    const width = Math.max(1, maxX - minX);
    const height = Math.max(1, maxY - minY);
    return { minX, maxX, minY, maxY, width, height, centerX: minX + width / 2, centerY: minY + height / 2 };
  }, [rawVertices]);

  // Viewport mapping: Scale and center the plot in SVG
  const PADDING = 100;
  const availW = CANVAS_W - PADDING * 2;
  const availH = CANVAS_H - PADDING * 2 - 40; // reserve room for road banner
  const scale = Math.min(availW / bbox.width, availH / bbox.height, 9.0);

  const centerScreenX = CANVAS_W / 2;
  const centerScreenY = CANVAS_H / 2 + 15;

  const project = (pt: Point2D): Point2D => ({
    x: centerScreenX + (pt.x - bbox.centerX) * scale,
    y: centerScreenY + (pt.y - bbox.centerY) * scale,
  });

  const unproject = (pt: Point2D): Point2D => ({
    x: bbox.centerX + (pt.x - centerScreenX) / scale,
    y: bbox.centerY + (pt.y - centerScreenY) / scale,
  });

  const screenVertices = useMemo(() => rawVertices.map(project), [rawVertices, centerScreenX, centerScreenY, bbox, scale]);

  // Setback Polygon
  const screenSetbackVertices = useMemo<Point2D[]>(() => {
    if (shape === 'rectangular') {
      const left = frontSetbackFt ? sideSetbackFt : 0;
      const right = frontage - sideSetbackFt;
      const top = frontSetbackFt;
      const bottom = depth - rearSetbackFt;
      if (right > left && bottom > top) {
        return [
          project({ x: left, y: top }),
          project({ x: right, y: top }),
          project({ x: right, y: bottom }),
          project({ x: left, y: bottom }),
        ];
      }
    }
    return [];
  }, [shape, frontage, depth, frontSetbackFt, rearSetbackFt, sideSetbackFt, centerScreenX, centerScreenY, bbox, scale]);

  // Screen bounding box
  const screenBounds = useMemo(() => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    screenVertices.forEach(v => {
      if (v.x < minX) minX = v.x;
      if (v.x > maxX) maxX = v.x;
      if (v.y < minY) minY = v.y;
      if (v.y > maxY) maxY = v.y;
    });
    return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
  }, [screenVertices]);

  // Dragging vertex handlers (Mouse & Touch for all phone screens)
  const handleSvgMouseDown = (index: number) => (e: React.MouseEvent) => {
    if (shape !== 'irregular') return;
    e.stopPropagation();
    setDraggingVertexIndex(index);
  };

  const handleSvgTouchStart = (index: number) => (e: React.TouchEvent) => {
    if (shape !== 'irregular') return;
    e.stopPropagation();
    setDraggingVertexIndex(index);
  };

  useEffect(() => {
    const updatePtFromClientXY = (clientX: number, clientY: number) => {
      if (draggingVertexIndex === null || !svgRef.current || !onUpdateVertices) return;
      const svg = svgRef.current;
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
      
      const feetPt = unproject({ x: svgP.x, y: svgP.y });
      const newVerts = [...rawVertices];
      newVerts[draggingVertexIndex] = {
        x: Math.round(feetPt.x * 2) / 2,
        y: Math.round(feetPt.y * 2) / 2,
      };
      onUpdateVertices(newVerts);
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePtFromClientXY(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        e.preventDefault();
        updatePtFromClientXY(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleDragEnd = () => {
      setDraggingVertexIndex(null);
    };

    if (draggingVertexIndex !== null) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
      window.addEventListener('touchcancel', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleDragEnd);
      window.removeEventListener('touchcancel', handleDragEnd);
    };
  }, [draggingVertexIndex, rawVertices, onUpdateVertices, centerScreenX, centerScreenY, bbox, scale]);

  // 3D Pointer Drag Handlers for 360° rotation (touch & mouse)
  const handle3DPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging3D(true);
    setIs3DOrbiting(false);
    try {
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    } catch {}
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotX,
      rotZ
    };
  };

  const handle3DPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging3D) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setRotZ((dragStartRef.current.rotZ + dx * 0.6) % 360);
    setRotX(Math.min(85, Math.max(15, dragStartRef.current.rotX - dy * 0.4)));
  };

  const handle3DPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging3D(false);
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Copy specifications
  const copySpecsToClipboard = () => {
    const text = `PropWise CAD Plot Specs:
Shape: ${shape.toUpperCase()}
Dimensions: ${frontage} × ${depth} ft (${areaGaj.toFixed(1)} Gaj / ${Math.round(areaSqFt)} sq.ft)
Facing: ${facing} Facing (Road ${roadWidthFt} ft)
Setbacks: Front ${frontSetbackFt}ft, Rear ${rearSetbackFt}ft, Side ${sideSetbackFt}ft
Estimated Value: ₹${Math.round(estimatedValue).toLocaleString()}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportBlueprintPng = () => {
    if (!svgRef.current) return;
    const svgElement = svgRef.current;
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const blobURL = URL.createObjectURL(svgBlob);
    
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = CANVAS_W * 2;
      canvas.height = CANVAS_H * 2;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(2, 2);
        ctx.fillStyle = themeMode === 'blueprint' ? '#0B1726' : '#FFFFFF';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.drawImage(image, 0, 0);
        const pngURL = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngURL;
        downloadLink.download = `PropWise_CAD_Blueprint_${shape}_${Math.round(areaGaj)}Gaj.png`;
        downloadLink.click();
      }
    };
    image.src = blobURL;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const currentVastu = VASTU_DATA[facing];

  return (
    <div 
      ref={containerRef}
      className={`cad-blueprint-wrapper ${themeMode === 'blueprint' ? 'cad-theme-blueprint' : 'cad-theme-light'} ${isFullscreen ? 'cad-fullscreen' : ''}`}
    >
      {/* ─── Top Clean CAD Toolbar (Responsive for all phones) ─── */}
      <div className="cad-toolbar">
        <div className="cad-toolbar-left">
          <div className="cad-badge-group">
            <span className="cad-status-pill">
              <span className="cad-live-pulse" />
              {isNarrowPhone ? 'CAD' : 'CAD Engine'}
            </span>
            <span className="cad-badge-primary">
              {shape.toUpperCase()}
            </span>
            <span className="cad-badge-accent">
              {Math.round(areaGaj)} Gaj {isNarrowPhone ? '' : `· ${Math.round(areaSqFt).toLocaleString()} sq.ft`}
            </span>
          </div>
        </div>

        <div className="cad-toolbar-right">
          {/* 2D / 3D Mode Toggle with Glow */}
          <div className="cad-btn-group" style={{ padding: '3px' }}>
            <button 
              className={`cad-tool-btn ${viewMode === '2d' ? 'active' : ''}`}
              onClick={() => setViewMode('2d')}
              style={{ fontWeight: 800, padding: isMobileView ? '4px 8px' : '4px 12px' }}
            >
              {isMobileView ? '📐 2D' : '📐 2D Plan'}
            </button>
            <button 
              className={`cad-tool-btn ${viewMode === '3d' ? 'active' : ''}`}
              onClick={() => setViewMode('3d')}
              style={{
                fontWeight: 800,
                padding: isMobileView ? '4px 8px' : '4px 12px',
                background: viewMode === '3d' ? '#2563eb' : 'transparent',
                color: viewMode === '3d' ? '#ffffff' : undefined
              }}
            >
              <Sparkles size={13} style={{ display: 'inline', marginRight: isMobileView ? '2px' : '4px' }} />
              {isMobileView ? '3D' : '3D Iso & House'}
            </button>
          </div>

          {/* Theme Toggle */}
          <div className="cad-btn-group">
            <button 
              className={`cad-tool-btn ${themeMode === 'blueprint' ? 'active' : ''}`}
              onClick={() => setThemeMode('blueprint')}
              style={{ padding: isMobileView ? '4px 6px' : '4px 10px' }}
            >
              {isMobileView ? 'Dark' : 'Dark CAD'}
            </button>
            <button 
              className={`cad-tool-btn ${themeMode === 'light' ? 'active' : ''}`}
              onClick={() => setThemeMode('light')}
              style={{ padding: isMobileView ? '4px 6px' : '4px 10px' }}
            >
              {isMobileView ? 'Light' : 'Drafting'}
            </button>
          </div>

          {/* Quick Layer Toggles */}
          <button 
            className={`cad-icon-btn ${showDimensions ? 'active' : ''}`}
            onClick={() => setShowDimensions(!showDimensions)}
            title="Toggle Dimension Lines"
          >
            <Ruler size={15} />
          </button>
          <button 
            className={`cad-icon-btn ${showGrid ? 'active' : ''}`}
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Grid"
          >
            <Grid size={15} />
          </button>
          <button 
            className={`cad-icon-btn ${showSetbacks ? 'active' : ''}`}
            onClick={() => setShowSetbacks(!showSetbacks)}
            title="Toggle Setbacks"
          >
            <Layers size={15} />
          </button>
          <button 
            className={`cad-icon-btn ${showVastu ? 'active' : ''}`}
            onClick={() => setShowVastu(!showVastu)}
            title="Toggle Vastu Compass"
          >
            <Compass size={15} />
          </button>

          {/* Zoom controls */}
          <div className="cad-btn-group">
            <button 
              className="cad-icon-btn" 
              onClick={() => setZoom(z => Math.max(0.7, z - 0.15))}
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <button 
              className="cad-tool-btn cad-zoom-label" 
              onClick={() => setZoom(1)}
              title="Reset Zoom"
              style={{ padding: '4px 6px', fontSize: '10.5px' }}
            >
              {Math.round(zoom * 100)}%
            </button>
            <button 
              className="cad-icon-btn" 
              onClick={() => setZoom(z => Math.min(1.8, z + 0.15))}
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
          </div>

          <button 
            className="cad-icon-btn" 
            onClick={copySpecsToClipboard}
            title="Copy Specs"
          >
            {copied ? <Check size={15} className="text-success" /> : <Copy size={15} />}
          </button>
          <button 
            className="cad-btn-action" 
            onClick={exportBlueprintPng}
            title="Export Blueprint PNG"
          >
            {isNarrowPhone ? <Download size={14} /> : <><Download size={14} /> {isMobileView ? 'PNG' : 'Export PNG'}</>}
          </button>
          <button 
            className="cad-icon-btn" 
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* ─── Main Viewport Area ─── */}
      <div className="cad-viewport">
        {viewMode === '2d' ? (
          <div className="cad-svg-container" style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}>
            <svg
              ref={svgRef}
              className="cad-svg-canvas"
              viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Diagonal hatch pattern for building setbacks */}
                <pattern id="cad-hatch-clean" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="12" stroke={themeMode === 'blueprint' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(37, 99, 235, 0.2)'} strokeWidth="1.5" />
                </pattern>
                
                {/* Background grid pattern */}
                <pattern id="cad-dots-clean" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 32 0 L 0 0 0 32" fill="none" stroke={themeMode === 'blueprint' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'} strokeWidth="0.8" />
                  <circle cx="0" cy="0" r="1.5" fill={themeMode === 'blueprint' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'} />
                </pattern>

                {/* Dimension Arrowhead Markers */}
                <marker id="cad-arrow-start" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 5 L 8 1.5 L 6 5 L 8 8.5 z" fill={themeMode === 'blueprint' ? '#38BDF8' : '#0B1726'} />
                </marker>
                <marker id="cad-arrow-end" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 5 L 8 1.5 L 6 5 L 8 8.5 z" fill={themeMode === 'blueprint' ? '#38BDF8' : '#0B1726'} />
                </marker>
              </defs>

              {/* Architectural Grid */}
              {showGrid && (
                <rect x="0" y="0" width={CANVAS_W} height={CANVAS_H} fill="url(#cad-dots-clean)" />
              )}

              {/* Site Landscaping / Grass Background around Plot */}
              <rect
                x={screenBounds.minX - 50}
                y={screenBounds.minY - 20}
                width={screenBounds.width + 100}
                height={screenBounds.height + 60}
                fill={themeMode === 'blueprint' ? 'rgba(16, 185, 129, 0.04)' : '#F0FDF4'}
                rx="12"
                stroke={themeMode === 'blueprint' ? 'rgba(16, 185, 129, 0.15)' : '#DCFCE7'}
                strokeWidth="1"
                strokeDasharray="6 4"
              />

              {/* ─── ROAD INDICATOR (Clean Top Banner) ─── */}
              {roadPosition === 'front' && (
                <g className="cad-road-group">
                  {/* Road strip */}
                  <rect
                    x={screenBounds.minX - 80}
                    y={screenBounds.minY - 58}
                    width={screenBounds.width + 160}
                    height="38"
                    fill={themeMode === 'blueprint' ? '#162335' : '#1E293B'}
                    stroke={themeMode === 'blueprint' ? '#334155' : '#0F172A'}
                    strokeWidth="1.5"
                    rx="6"
                  />
                  {/* Road center dash */}
                  <line
                    x1={screenBounds.minX - 70}
                    y1={screenBounds.minY - 39}
                    x2={screenBounds.maxX + 70}
                    y2={screenBounds.minY - 39}
                    stroke="#F59E0B"
                    strokeWidth="2"
                    strokeDasharray="10 8"
                  />
                  {/* Road Label */}
                  <text
                    x={CANVAS_W / 2}
                    y={screenBounds.minY - 44}
                    textAnchor="middle"
                    fill="#F8FAFC"
                    fontSize="11.5"
                    fontWeight="800"
                    letterSpacing="1.5"
                  >
                    {roadWidthFt} FT SECTOR ROAD ({facing.toUpperCase()} FACING)
                  </text>
                  {/* Clean Entry Gate Marker */}
                  <rect
                    x={CANVAS_W / 2 - 36}
                    y={screenBounds.minY - 6}
                    width="72"
                    height="12"
                    fill="#10B981"
                    rx="3"
                    stroke="#ffffff"
                    strokeWidth="1"
                  />
                  <text
                    x={CANVAS_W / 2}
                    y={screenBounds.minY + 3}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="8.5"
                    fontWeight="900"
                    letterSpacing="1"
                  >
                    MAIN GATE (प्रवेश)
                  </text>
                </g>
              )}

              {/* ─── MAIN PLOT POLYGON ─── */}
              <polygon
                points={screenVertices.map(v => `${v.x},${v.y}`).join(' ')}
                fill={themeMode === 'blueprint' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.95)'}
                stroke={themeMode === 'blueprint' ? '#38BDF8' : '#0B1726'}
                strokeWidth="3"
                strokeLinejoin="round"
              />

              {/* Front Lawn Grass Hatch Area */}
              {showSetbacks && screenSetbackVertices.length >= 3 && (
                <rect
                  x={screenBounds.minX + 4}
                  y={screenBounds.minY + 4}
                  width={screenBounds.width - 8}
                  height={Math.max(16, frontSetbackFt * scale)}
                  fill="rgba(16, 185, 129, 0.18)"
                  stroke="none"
                />
              )}

              {/* ─── SETBACKS ENVELOPE (PERMISSIBLE BUILDING FOOTPRINT) ─── */}
              {showSetbacks && screenSetbackVertices.length >= 3 && (
                <g className="cad-setback-group">
                  <polygon
                    points={screenSetbackVertices.map(v => `${v.x},${v.y}`).join(' ')}
                    fill="url(#cad-hatch-clean)"
                    stroke="#2563EB"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                  />
                  {screenBounds.height > 90 && (
                    <text
                      x={CANVAS_W / 2}
                      y={screenBounds.minY + Math.max(26, frontSetbackFt * scale + 16)}
                      textAnchor="middle"
                      fill="#2563EB"
                      fontSize="10.5"
                      fontWeight="800"
                      letterSpacing="1"
                    >
                      🏛️ PERMISSIBLE BUILT-UP AREA
                    </text>
                  )}
                </g>
              )}

              {/* Suggested Room Zoning Layout Annotations */}
              {screenBounds.height > 160 && (
                <g className="cad-zoning-hints" opacity={themeMode === 'blueprint' ? 0.7 : 0.85}>
                  {/* Front: Living & Parking */}
                  <text x={screenBounds.minX + 24} y={screenBounds.minY + frontSetbackFt * scale + 35} fontSize="9.5" fontWeight="700" fill={themeMode === 'blueprint' ? '#94A3B8' : '#475569'}>
                    🚗 Porch / Lawn
                  </text>
                  <text x={screenBounds.maxX - 60} y={screenBounds.minY + frontSetbackFt * scale + 35} fontSize="9.5" fontWeight="700" fill={themeMode === 'blueprint' ? '#94A3B8' : '#475569'}>
                    🛋️ Drawing Room
                  </text>
                  {/* Center: Kitchen & Dining */}
                  <text x={screenBounds.minX + 24} y={centerScreenY + 28} fontSize="9.5" fontWeight="700" fill={themeMode === 'blueprint' ? '#94A3B8' : '#475569'}>
                    🍳 Kitchen (Agneya)
                  </text>
                  <text x={screenBounds.maxX - 60} y={centerScreenY + 28} fontSize="9.5" fontWeight="700" fill={themeMode === 'blueprint' ? '#94A3B8' : '#475569'}>
                    🛏️ Master Bedroom
                  </text>
                </g>
              )}

              {/* ─── CLEAN CENTER PLOT BADGE ─── */}
              <g className="cad-center-tag">
                <rect
                  x={CANVAS_W / 2 - 85}
                  y={centerScreenY - 22}
                  width="170"
                  height="44"
                  rx="10"
                  fill={themeMode === 'blueprint' ? '#0B1726' : '#FFFFFF'}
                  stroke={themeMode === 'blueprint' ? 'rgba(56, 189, 248, 0.8)' : '#2563EB'}
                  strokeWidth="2"
                  filter="drop-shadow(0 4px 10px rgba(0,0,0,0.15))"
                />
                <text
                  x={CANVAS_W / 2}
                  y={centerScreenY - 2}
                  textAnchor="middle"
                  fill={themeMode === 'blueprint' ? '#38BDF8' : '#2563EB'}
                  fontSize="16"
                  fontWeight="900"
                  letterSpacing="-0.3px"
                >
                  {Math.round(areaGaj)} Gaj
                </text>
                <text
                  x={CANVAS_W / 2}
                  y={centerScreenY + 14}
                  textAnchor="middle"
                  fill={themeMode === 'blueprint' ? '#94A3B8' : '#64748B'}
                  fontSize="10"
                  fontWeight="700"
                >
                  {Math.round(areaSqFt).toLocaleString()} sq.ft ({frontage}×{depth} {lengthUnitLabel})
                </text>
              </g>

              {/* ─── DIMENSION LINES & EXTENSIONS (CORRECTED LINEAR UNITS) ─── */}
              {showDimensions && (
                <g className="cad-dimension-lines">
                  {/* Top Dimension (Frontage) */}
                  <line
                    x1={screenBounds.minX}
                    y1={screenBounds.minY - 14}
                    x2={screenBounds.maxX}
                    y2={screenBounds.minY - 14}
                    stroke={themeMode === 'blueprint' ? '#38BDF8' : '#2563EB'}
                    strokeWidth="1.5"
                    markerStart="url(#cad-arrow-start)"
                    markerEnd="url(#cad-arrow-end)"
                  />
                  <line x1={screenBounds.minX} y1={screenBounds.minY - 6} x2={screenBounds.minX} y2={screenBounds.minY - 22} stroke={themeMode === 'blueprint' ? '#38BDF8' : '#94A3B8'} strokeWidth="1" />
                  <line x1={screenBounds.maxX} y1={screenBounds.minY - 6} x2={screenBounds.maxX} y2={screenBounds.minY - 22} stroke={themeMode === 'blueprint' ? '#38BDF8' : '#94A3B8'} strokeWidth="1" />

                  {/* Top Dimension Text Pill */}
                  <rect
                    x={(screenBounds.minX + screenBounds.maxX) / 2 - 32}
                    y={screenBounds.minY - 25}
                    width="64"
                    height="20"
                    rx="4"
                    fill={themeMode === 'blueprint' ? '#0B1726' : '#2563EB'}
                    stroke={themeMode === 'blueprint' ? '#38BDF8' : '#2563EB'}
                    strokeWidth="1"
                  />
                  <text
                    x={(screenBounds.minX + screenBounds.maxX) / 2}
                    y={screenBounds.minY - 11}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="11"
                    fontWeight="800"
                  >
                    {frontage} {lengthUnitLabel}
                  </text>

                  {/* Right Dimension (Depth) */}
                  <line
                    x1={screenBounds.maxX + 18}
                    y1={screenBounds.minY}
                    x2={screenBounds.maxX + 18}
                    y2={screenBounds.maxY}
                    stroke={themeMode === 'blueprint' ? '#38BDF8' : '#2563EB'}
                    strokeWidth="1.5"
                    markerStart="url(#cad-arrow-start)"
                    markerEnd="url(#cad-arrow-end)"
                  />
                  <line x1={screenBounds.maxX + 8} y1={screenBounds.minY} x2={screenBounds.maxX + 26} y2={screenBounds.minY} stroke={themeMode === 'blueprint' ? '#38BDF8' : '#94A3B8'} strokeWidth="1" />
                  <line x1={screenBounds.maxX + 8} y1={screenBounds.maxY} x2={screenBounds.maxX + 26} y2={screenBounds.maxY} stroke={themeMode === 'blueprint' ? '#38BDF8' : '#94A3B8'} strokeWidth="1" />

                  {/* Right Dimension Text Pill */}
                  <rect
                    x={screenBounds.maxX + 24}
                    y={(screenBounds.minY + screenBounds.maxY) / 2 - 11}
                    width="60"
                    height="22"
                    rx="4"
                    fill={themeMode === 'blueprint' ? '#0B1726' : '#2563EB'}
                    stroke={themeMode === 'blueprint' ? '#38BDF8' : '#2563EB'}
                    strokeWidth="1"
                  />
                  <text
                    x={screenBounds.maxX + 54}
                    y={(screenBounds.minY + screenBounds.maxY) / 2 + 4}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="11"
                    fontWeight="800"
                  >
                    {depth} {lengthUnitLabel}
                  </text>
                </g>
              )}

              {/* Corner Vertex Nodes */}
              {screenVertices.map((v, i) => {
                const label = String.fromCharCode(65 + i);
                const isDragging = draggingVertexIndex === i;
                return (
                  <g key={i} className="cad-node-point">
                    <circle
                      cx={v.x}
                      cy={v.y}
                      r={shape === 'irregular' ? (isMobileView ? '10' : '8') : '5'}
                      fill={isDragging ? '#F59E0B' : (shape === 'irregular' ? '#38BDF8' : '#2563EB')}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      cursor={shape === 'irregular' ? 'grab' : 'default'}
                      onMouseDown={handleSvgMouseDown(i)}
                      onTouchStart={handleSvgTouchStart(i)}
                    />
                    {shape === 'irregular' && (
                      <text
                        x={v.x + (v.x > CANVAS_W / 2 ? 14 : -14)}
                        y={v.y + (v.y > centerScreenY ? 16 : -8)}
                        textAnchor="middle"
                        fill={themeMode === 'blueprint' ? '#E2E8F0' : '#1E293B'}
                        fontSize="11"
                        fontWeight="800"
                      >
                        {label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Clean Vastu Compass Rose */}
              <g className="cad-compass-badge" transform="translate(740, 60)">
                <circle cx="0" cy="0" r="28" fill={themeMode === 'blueprint' ? '#162335' : '#FFFFFF'} stroke={themeMode === 'blueprint' ? '#334155' : '#CBD5E1'} strokeWidth="1.5" />
                <path d="M 0 -22 L 6 -4 L 0 0 L -6 -4 z" fill="#EF4444" />
                <path d="M 0 22 L 6 4 L 0 0 L -6 4 z" fill="#94A3B8" />
                <text x="0" y="-24" textAnchor="middle" fill="#EF4444" fontSize="10" fontWeight="900">N</text>
                <text x="0" y="32" textAnchor="middle" fill="#94A3B8" fontSize="9" fontWeight="800">S</text>
                <text x="26" y="3" textAnchor="middle" fill="#94A3B8" fontSize="9" fontWeight="800">E</text>
                <text x="-26" y="3" textAnchor="middle" fill="#94A3B8" fontSize="9" fontWeight="800">W</text>
              </g>
            </svg>
          </div>
        ) : (
          /* ══════════════════════════════════════════════════════════════════
              FULL INTERACTIVE 3D ISOMETRIC HOUSE & SITE VISUALIZER
          ══════════════════════════════════════════════════════════════════ */
          <div 
            className={`cad-3d-rich-stage ${lighting3D === 'evening' ? 'evening-mode' : 'day-mode'}`}
            onPointerDown={handle3DPointerDown}
            onPointerMove={handle3DPointerMove}
            onPointerUp={handle3DPointerUp}
            style={{
              width: '100%',
              height: '100%',
              minHeight: isMobileView ? '390px' : '520px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              perspective: '1400px',
              overflow: 'hidden',
              touchAction: 'none',
              background: lighting3D === 'evening' 
                ? 'radial-gradient(circle at 50% 30%, #172554 0%, #090d16 100%)' 
                : (themeMode === 'blueprint' ? 'radial-gradient(circle at 50% 30%, #0f2744 0%, #060e1a 100%)' : 'radial-gradient(circle at 50% 30%, #e0f2fe 0%, #cbd5e1 100%)'),
              cursor: isDragging3D ? 'grabbing' : 'grab'
            }}
          >
            {/* Top 3D Control HUD Bar (Fluid & Mobile Optimized) */}
            <div style={{
              position: 'absolute',
              top: isMobileView ? '8px' : '12px',
              left: isMobileView ? '8px' : '16px',
              right: isMobileView ? '8px' : '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '6px',
              zIndex: 30,
              pointerEvents: 'auto'
            }}>
              {/* Floors Selector */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                background: 'rgba(11, 23, 38, 0.88)',
                backdropFilter: 'blur(10px)',
                padding: '3px 5px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}>
                <span style={{ fontSize: isNarrowPhone ? '10px' : '11px', fontWeight: 800, color: '#94a3b8', padding: '0 4px' }}>
                  {language === 'pa' ? 'ਮੰਜ਼ਿਲਾਂ:' : (language === 'hi' ? 'मंजिल:' : 'Storeys:')}
                </span>
                {[
                  { count: 1, label: '1 Floor', shortLabel: '1F' },
                  { count: 2, label: 'G + 1 Duplex', shortLabel: 'G+1' },
                  { count: 3, label: 'G + 2 Triplex', shortLabel: 'G+2' },
                  { count: 4, label: 'Stilt + 4', shortLabel: 'S+4' },
                ].map(fl => (
                  <button
                    key={fl.count}
                    onClick={() => setFloors3D(fl.count)}
                    style={{
                      padding: isNarrowPhone ? '3px 6px' : (isMobileView ? '3px 8px' : '4px 10px'),
                      borderRadius: 'var(--radius-full)',
                      border: 'none',
                      background: floors3D === fl.count ? '#2563eb' : 'transparent',
                      color: floors3D === fl.count ? '#ffffff' : '#cbd5e1',
                      fontSize: isNarrowPhone ? '10.5px' : '11.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    {isMobileView ? fl.shortLabel : fl.label}
                  </button>
                ))}
              </div>

              {/* Lighting & Camera Presets */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(11, 23, 38, 0.88)',
                backdropFilter: 'blur(10px)',
                padding: '3px 6px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}>
                {/* Sun / Evening Toggle */}
                <button
                  onClick={() => setLighting3D(l => l === 'day' ? 'evening' : 'day')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: isNarrowPhone ? '3px 6px' : '4px 8px',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    background: lighting3D === 'evening' ? '#4f46e5' : '#f59e0b',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                  title="Toggle Day / Evening Lighting"
                >
                  {lighting3D === 'evening' ? <Moon size={12} /> : <Sun size={12} />}
                  <span>{isNarrowPhone ? '' : (lighting3D === 'evening' ? 'Evening' : 'Daylight')}</span>
                </button>

                {/* Auto Turntable Orbit */}
                <button
                  onClick={() => setIs3DOrbiting(o => !o)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: isNarrowPhone ? '3px 6px' : '4px 8px',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    background: is3DOrbiting ? '#10b981' : 'rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                  title="360° Auto Turntable"
                >
                  {is3DOrbiting ? <Pause size={12} /> : <Play size={12} />}
                  <span>{isNarrowPhone ? '360°' : '360° Orbit'}</span>
                </button>

                {/* Reset Camera Angle */}
                <button
                  onClick={() => { setRotX(60); setRotZ(-35); setZoom(1); }}
                  style={{
                    padding: '4px 6px',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                  title="Reset 3D View"
                >
                  <Rotate3d size={12} />
                </button>
              </div>
            </div>

            {/* 3D Root Transform Scene (Dynamically Scaled for all phone screens) */}
            <div 
              style={{
                width: '420px',
                height: '420px',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transform: `scale(${dynamic3DScale}) rotateX(${rotX}deg) rotateZ(${rotZ}deg)`,
                transition: isDragging3D ? 'none' : 'transform 0.15s ease-out'
              }}
            >
              {/* 3D Ground Terrain & Lawn */}
              <div 
                style={{
                  position: 'absolute',
                  width: '560px',
                  height: '560px',
                  left: '-70px',
                  top: '-70px',
                  borderRadius: '24px',
                  background: lighting3D === 'evening' ? '#143026' : '#22c55e',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.4), inset 0 0 100px rgba(0,0,0,0.2)',
                  border: '6px solid rgba(255,255,255,0.2)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* 3D Sector Road with Asphalt & Markings */}
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  left: '-20px',
                  width: '600px',
                  height: '80px',
                  background: '#1e293b',
                  borderRadius: '8px',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
                  borderBottom: '3px solid #f1f5f9'
                }}>
                  {/* Road Center Stripe */}
                  <div style={{
                    position: 'absolute',
                    top: '38px',
                    left: 0,
                    right: 0,
                    borderTop: '2px dashed #f59e0b',
                    height: 0
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '1px',
                    whiteSpace: 'nowrap'
                  }}>
                    🛣️ 30 FT SECTOR ROAD • {facing.toUpperCase()} ENTRANCE
                  </div>
                </div>

                {/* 3D Driveway / Cobblestone Car Parking Path */}
                <div style={{
                  position: 'absolute',
                  top: '40px',
                  left: '100px',
                  width: '90px',
                  height: '140px',
                  background: '#94a3b8',
                  backgroundImage: 'radial-gradient(#64748b 15%, transparent 16%)',
                  backgroundSize: '8px 8px',
                  borderRadius: '4px',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)'
                }}>
                  {/* 3D Sedan Car Model in Parking */}
                  <div style={{
                    position: 'absolute',
                    top: '35px',
                    left: '15px',
                    width: '60px',
                    height: '100px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.35)',
                    border: '2px solid rgba(255,255,255,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 4px'
                  }}>
                    <div style={{ width: '40px', height: '14px', background: '#93c5fd', borderRadius: '4px' }} />
                    <div style={{ fontSize: '8px', fontWeight: 900, color: '#ffffff' }}>SEDAN</div>
                    <div style={{ width: '40px', height: '12px', background: '#93c5fd', borderRadius: '4px' }} />
                  </div>
                </div>

                {/* 3D Front Garden Trees & Shrubs */}
                {[
                  { top: 50, left: 240 },
                  { top: 75, left: 320 },
                  { top: 50, left: 400 },
                  { top: 380, left: 80 },
                  { top: 400, left: 420 },
                ].map((t, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      top: `${t.top}px`,
                      left: `${t.left}px`,
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle at 30% 30%, #4ade80 0%, #15803d 100%)',
                      boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
                      border: '2px solid #86efac'
                    }}
                  />
                ))}

                {/* 3D Boundary Wall with Entrance Gate */}
                <div style={{
                  position: 'absolute',
                  top: '30px',
                  left: '60px',
                  width: '440px',
                  height: '460px',
                  border: '4px solid #e2e8f0',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                  pointerEvents: 'none'
                }}>
                  {/* Gate Pillar Lights */}
                  <div style={{ position: 'absolute', top: '-10px', left: '100px', width: '12px', height: '12px', background: '#f59e0b', borderRadius: '50%', boxShadow: '0 0 10px #f59e0b' }} />
                  <div style={{ position: 'absolute', top: '-10px', left: '200px', width: '12px', height: '12px', background: '#f59e0b', borderRadius: '50%', boxShadow: '0 0 10px #f59e0b' }} />
                  {/* Front Sliding Gate */}
                  <div style={{ position: 'absolute', top: '-6px', left: '105px', width: '90px', height: '6px', background: '#334155', borderRadius: '2px' }} />
                </div>
              </div>

              {/* ─── 3D MULTI-STOREY RESIDENTIAL / COMMERCIAL BUILDING MASS ─── */}
              <div 
                style={{
                  position: 'absolute',
                  top: '120px',
                  left: '110px',
                  width: '260px',
                  height: '240px',
                  transformStyle: 'preserve-3d',
                  transform: 'translateZ(0px)'
                }}
              >
                {/* Render Storeys based on floors3D */}
                {Array.from({ length: floors3D }).map((_, fIdx) => {
                  const zHeight = fIdx * 65;
                  const isTopFloor = fIdx === floors3D - 1;
                  return (
                    <div 
                      key={fIdx}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '260px',
                        height: '240px',
                        transformStyle: 'preserve-3d',
                        transform: `translateZ(${zHeight}px)`
                      }}
                    >
                      {/* Floor Slab / Roof Base */}
                      <div style={{
                        position: 'absolute',
                        width: '260px',
                        height: '240px',
                        background: fIdx === 0 
                          ? '#f8fafc' 
                          : (lighting3D === 'evening' ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : '#ffffff'),
                        border: '3px solid #94a3b8',
                        borderRadius: '6px',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.25)',
                        transform: 'translateZ(55px)'
                      }}>
                        {/* Floor Label */}
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          left: '12px',
                          fontSize: '11px',
                          fontWeight: 900,
                          color: '#2563eb',
                          background: 'rgba(37, 99, 235, 0.1)',
                          padding: '2px 8px',
                          borderRadius: '4px'
                        }}>
                          {fIdx === 0 ? 'FLOOR 1 (LIVING + KITCHEN)' : (fIdx === 1 ? 'FLOOR 2 (BEDROOM SUITES)' : `FLOOR ${fIdx + 1}`)}
                        </div>

                        {/* Modern Cantilever Balcony Glass Railing */}
                        <div style={{
                          position: 'absolute',
                          top: '-15px',
                          left: '30px',
                          width: '120px',
                          height: '20px',
                          background: 'rgba(56, 189, 248, 0.45)',
                          border: '1.5px solid #38bdf8',
                          borderRadius: '4px',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                        }} />

                        {/* Glowing Windows */}
                        <div style={{
                          position: 'absolute',
                          bottom: '20px',
                          right: '20px',
                          width: '70px',
                          height: '50px',
                          background: lighting3D === 'evening' ? '#fef08a' : '#bae6fd',
                          boxShadow: lighting3D === 'evening' ? '0 0 20px #fde047' : 'none',
                          border: '2px solid #64748b',
                          borderRadius: '4px'
                        }} />
                      </div>

                      {/* 3D Vertical Wall Blocks (Elevation Faces) */}
                      {/* Front Facade Wall */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '260px',
                        height: '55px',
                        background: lighting3D === 'evening' ? '#334155' : '#e2e8f0',
                        border: '1.5px solid #cbd5e1',
                        transform: 'rotateX(-90deg) translateZ(-27px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        padding: '0 10px'
                      }}>
                        <div style={{ width: '40px', height: '35px', background: lighting3D === 'evening' ? '#fef08a' : '#93c5fd', borderRadius: '3px', boxShadow: lighting3D === 'evening' ? '0 0 10px #fde047' : 'none' }} />
                        <div style={{ width: '50px', height: '45px', background: '#78350f', borderRadius: '3px' }} />
                        <div style={{ width: '40px', height: '35px', background: lighting3D === 'evening' ? '#fef08a' : '#93c5fd', borderRadius: '3px', boxShadow: lighting3D === 'evening' ? '0 0 10px #fde047' : 'none' }} />
                      </div>

                      {/* Right Facade Wall */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '240px',
                        height: '55px',
                        background: lighting3D === 'evening' ? '#1e293b' : '#cbd5e1',
                        border: '1.5px solid #94a3b8',
                        transform: 'rotateY(90deg) translateZ(120px) rotateX(-90deg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-around'
                      }}>
                        <div style={{ width: '50px', height: '35px', background: lighting3D === 'evening' ? '#fde047' : '#93c5fd', borderRadius: '3px' }} />
                        <div style={{ width: '50px', height: '35px', background: lighting3D === 'evening' ? '#fde047' : '#93c5fd', borderRadius: '3px' }} />
                      </div>

                      {/* Rooftop Amenities (on Top Floor) */}
                      {isTopFloor && (
                        <div style={{
                          position: 'absolute',
                          top: '20px',
                          right: '20px',
                          transform: 'translateZ(60px)',
                          transformStyle: 'preserve-3d',
                          display: 'flex',
                          gap: '12px'
                        }}>
                          {/* Solar PV Panels */}
                          <div style={{
                            width: '70px',
                            height: '50px',
                            background: '#1e3a8a',
                            border: '2px solid #60a5fa',
                            borderRadius: '4px',
                            backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
                            backgroundSize: '12px 12px',
                            boxShadow: '0 6px 12px rgba(0,0,0,0.3)'
                          }} title="Rooftop Solar PV Array" />

                          {/* Water Tank */}
                          <div style={{
                            width: '35px',
                            height: '35px',
                            borderRadius: '50%',
                            background: '#0284c7',
                            border: '2px solid #ffffff',
                            boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontSize: '8px',
                            fontWeight: 900
                          }}>
                            TANK
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Bottom 3D Floating Guide & Naksha Studio Callout (Responsive on Phones) */}
            <div style={{
              position: 'absolute',
              bottom: isMobileView ? '8px' : '14px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: isMobileView ? '6px' : '12px',
              background: 'rgba(11, 23, 38, 0.92)',
              backdropFilter: 'blur(10px)',
              padding: isMobileView ? '6px 12px' : '8px 18px',
              borderRadius: 'var(--radius-full)',
              color: '#ffffff',
              boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              zIndex: 40,
              width: isMobileView ? 'calc(100% - 20px)' : 'auto',
              maxWidth: '460px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: isMobileView ? '10.5px' : '12px', fontWeight: 700, color: '#e2e8f0', textAlign: 'center' }}>
                {language === 'pa' 
                  ? '💡 ਉਂਗਲੀ / ਮਾਊਸ ਨਾਲ 360° ਘੁਮਾਓ' 
                  : (language === 'hi' 
                    ? '💡 उंगली / माउस से 360° घुमाएं • 3D सिमुलेशन' 
                    : '💡 Touch / Drag to rotate 360° • 3D House')}
              </span>
              <div style={{
                background: '#2563eb',
                color: '#ffffff',
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                fontSize: isMobileView ? '10px' : '11px',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Box size={12} />
                <span>{floors3D} Storeys • {Math.round(areaGaj)} Gaj</span>
              </div>
            </div>
          </div>
        )}

        {/* ─── Optional Vastu Compass Drawer Overlay ─── */}
        {showVastu && (
          <div className="cad-vastu-overlay">
            <div className="cad-vastu-header">
              <Compass size={16} style={{ color: currentVastu.color }} />
              <span className="cad-vastu-name">{facing} Facing</span>
              <span 
                className="cad-vastu-badge" 
                style={{ background: `${currentVastu.color}20`, color: currentVastu.color, borderColor: currentVastu.color }}
              >
                {currentVastu.score}/100 Score
              </span>
            </div>

            {onFacingChange && (
              <div className="cad-compass-quick-pills">
                {(['North', 'East', 'South', 'West'] as DirectionFacing[]).map(d => (
                  <button
                    key={d}
                    type="button"
                    className={`cad-compass-pill ${facing === d ? 'active' : ''}`}
                    onClick={() => onFacingChange(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}

            <div className="cad-vastu-tip">
              <strong>{currentVastu.title}:</strong> {currentVastu.tips.mainGate}
            </div>
          </div>
        )}

        {shape === 'irregular' && viewMode === '2d' && (
          <div className="cad-drag-instruction">
            <span>👆 <strong>Interactive:</strong> Click & drag vertices (A, B, C, D) on the blueprint to reshape the plot live.</span>
          </div>
        )}
      </div>

      {/* ─── Clean Bottom Status Bar ─── */}
      <div className="cad-statusbar">
        <div className="cad-status-item">
          <span>{language === 'pa' ? 'ਲੰਬਾਈ × ਚੌੜਾਈ:' : (language === 'hi' ? 'नाप (लंबाई × चौड़ाई):' : 'Dimensions:')}</span>
          <strong>{frontage} × {depth} {lengthUnitLabel}</strong>
        </div>
        <div className="cad-status-divider" />
        <div className="cad-status-item">
          <span>{language === 'pa' ? 'ਰਕਬਾ:' : (language === 'hi' ? 'क्षेत्रफल:' : 'Area:')}</span>
          <strong>{Math.round(areaGaj)} Gaj ({Math.round(areaSqFt).toLocaleString()} sq.ft)</strong>
        </div>
        <div className="cad-status-divider" />
        <div className="cad-status-item">
          <span>{language === 'pa' ? 'ਘੇਰਾ (Perimeter):' : (language === 'hi' ? 'घेरा (Perimeter):' : 'Perimeter:')}</span>
          <strong>{Math.round(perimeterFt)} ft</strong>
        </div>
        <div className="cad-status-divider" />
        <div className="cad-status-item">
          <span>{language === 'pa' ? 'ਅਨੁਮਾਨਿਤ ਮੁੱਲ:' : (language === 'hi' ? 'अनुमानित कीमत:' : 'Estimated Valuation:')}</span>
          <strong className="text-accent">{formatINRCompact(estimatedValue)}</strong>
        </div>
      </div>
    </div>
  );
}
