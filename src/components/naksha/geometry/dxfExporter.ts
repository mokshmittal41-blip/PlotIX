import type { FloorPlanModel } from './types';

/**
 * Standard ASCII DXF Generator (AutoCAD R12/2000 AC1009 compatible).
 * Exports true vector geometry with standard layer separation.
 */
export function exportToDXF(model: FloorPlanModel): string {
  const { plot, rooms, doors, windows, furniture, columns, ots } = model;
  const lines: string[] = [];

  const add = (code: number | string, val: number | string) => {
    lines.push(code.toString());
    lines.push(val.toString());
  };

  // ─── 1. HEADER SECTION ────────────────────────────────────────────────────────
  add(0, 'SECTION');
  add(2, 'HEADER');
  add(9, '$ACADVER');
  add(1, 'AC1009'); // AutoCAD R12 standard compatible across all CAD tools
  add(9, '$INSUNITS');
  add(70, 2); // 2 = Feet
  add(0, 'ENDSEC');

  // ─── 2. TABLES SECTION (LAYERS) ──────────────────────────────────────────────
  add(0, 'SECTION');
  add(2, 'TABLES');
  add(0, 'TABLE');
  add(2, 'LAYER');
  add(70, 9); // Total layers

  const defineLayer = (name: string, color: number) => {
    add(0, 'LAYER');
    add(2, name);
    add(70, 0);
    add(62, color); // AutoCAD Color Index (ACI)
    add(6, 'CONTINUOUS');
  };

  defineLayer('A-WALL-EXTR', 7);     // 7 = White / Black (0.50mm)
  defineLayer('A-WALL-INTR', 7);     // 7 = White / Black (0.35mm)
  defineLayer('A-DOOR', 1);          // 1 = Red (Door leaf & swing)
  defineLayer('A-GLAZ', 4);          // 4 = Cyan (Windows & Glazing)
  defineLayer('S-COLS-CONCPT', 2);   // 2 = Yellow (Conceptual Columns)
  defineLayer('A-FLOR-STRS', 3);     // 3 = Green (Staircase)
  defineLayer('A-FURN', 8);          // 8 = Gray (Furniture Fixtures)
  defineLayer('A-DIMS', 2);          // 2 = Yellow (Dimensions & Room Names)
  defineLayer('0_TITLEBLOCK', 7);    // 7 = White (Title Block & Disclaimer)

  add(0, 'ENDTAB');
  add(0, 'ENDSEC');

  // ─── 3. BLOCKS SECTION ───────────────────────────────────────────────────────
  add(0, 'SECTION');
  add(2, 'BLOCKS');
  add(0, 'ENDSEC');

  // ─── 4. ENTITIES SECTION ─────────────────────────────────────────────────────
  add(0, 'SECTION');
  add(2, 'ENTITIES');

  // Utility to add a DXF LINE entity
  const addLine = (layer: string, x1: number, y1: number, x2: number, y2: number) => {
    add(0, 'LINE');
    add(8, layer);
    add(10, x1.toFixed(3));
    add(20, y1.toFixed(3));
    add(30, 0.0);
    add(11, x2.toFixed(3));
    add(21, y2.toFixed(3));
    add(31, 0.0);
  };

  // Utility to add a DXF TEXT entity
  const addText = (layer: string, x: number, y: number, height: number, text: string) => {
    add(0, 'TEXT');
    add(8, layer);
    add(10, x.toFixed(3));
    add(20, y.toFixed(3));
    add(30, 0.0);
    add(40, height.toFixed(3));
    add(1, text);
  };

  // Utility to add a DXF ARC entity
  const addArc = (layer: string, cx: number, cy: number, radius: number, startAng: number, endAng: number) => {
    add(0, 'ARC');
    add(8, layer);
    add(10, cx.toFixed(3));
    add(20, cy.toFixed(3));
    add(30, 0.0);
    add(40, radius.toFixed(3));
    add(50, startAng.toFixed(1));
    add(51, endAng.toFixed(1));
  };

  // CAD coordinate origin in DXF (Y increases upwards in CAD, so we invert Y: cadY = plot.depth - y)
  const toCadY = (y: number) => plot.depth - y;

  // ─── 4.1 PLOT BOUNDARY & SETBACKS ───────────────────────────────────────────
  addLine('0_TITLEBLOCK', 0, 0, plot.width, 0);
  addLine('0_TITLEBLOCK', plot.width, 0, plot.width, plot.depth);
  addLine('0_TITLEBLOCK', plot.width, plot.depth, 0, plot.depth);
  addLine('0_TITLEBLOCK', 0, plot.depth, 0, 0);

  // ─── 4.2 ROOM WALLS & LABELS ────────────────────────────────────────────────
  rooms.forEach((r) => {
    const x1 = r.x;
    const y1 = toCadY(r.y + r.height);
    const x2 = r.x + r.width;
    const y2 = toCadY(r.y);

    // Wall box for each room
    addLine('A-WALL-INTR', x1, y1, x2, y1);
    addLine('A-WALL-INTR', x2, y1, x2, y2);
    addLine('A-WALL-INTR', x2, y2, x1, y2);
    addLine('A-WALL-INTR', x1, y2, x1, y1);

    // Room Label & Dimensions
    const centerX = r.x + r.width / 2;
    const centerY = toCadY(r.y + r.height / 2);
    addText('A-DIMS', centerX - 2.5, centerY + 0.5, 0.65, r.name.toUpperCase());
    addText('A-DIMS', centerX - 2.5, centerY - 0.5, 0.45, `${r.width.toFixed(1)}' x ${r.height.toFixed(1)}' (${Math.round(r.width * r.height)} SQFT)`);
  });

  // ─── 4.3 DOORS (Threshold + Leaf + Swing Arc) ───────────────────────────────
  doors.forEach((d) => {
    const r = rooms.find(room => room.id === d.roomId);
    if (!r) return;

    let px = r.x;
    let py = r.y;
    if (d.wallSide === 'bottom') {
      px = r.x + d.offsetFt;
      py = r.y + r.height;
      const cadY = toCadY(py);
      addLine('A-DOOR', px, cadY, px, cadY + d.widthFt);
      addArc('A-DOOR', px, cadY, d.widthFt, 0, 90);
    } else if (d.wallSide === 'top') {
      px = r.x + d.offsetFt;
      py = r.y;
      const cadY = toCadY(py);
      addLine('A-DOOR', px, cadY, px, cadY - d.widthFt);
      addArc('A-DOOR', px, cadY, d.widthFt, 270, 360);
    } else if (d.wallSide === 'left') {
      px = r.x;
      py = r.y + d.offsetFt;
      const cadY = toCadY(py);
      addLine('A-DOOR', px, cadY, px + d.widthFt, cadY);
      addArc('A-DOOR', px, cadY, d.widthFt, 0, 90);
    } else if (d.wallSide === 'right') {
      px = r.x + r.width;
      py = r.y + d.offsetFt;
      const cadY = toCadY(py);
      addLine('A-DOOR', px, cadY, px - d.widthFt, cadY);
      addArc('A-DOOR', px, cadY, d.widthFt, 90, 180);
    }
  });

  // ─── 4.4 WINDOWS ────────────────────────────────────────────────────────────
  windows.forEach((w) => {
    const r = rooms.find(room => room.id === w.roomId);
    if (!r) return;

    if (w.wallSide === 'top' || w.wallSide === 'bottom') {
      const wx = r.x + w.offsetFt - w.widthFt / 2;
      const wy = toCadY(w.wallSide === 'top' ? r.y : r.y + r.height);
      addLine('A-GLAZ', wx, wy, wx + w.widthFt, wy);
      addLine('A-GLAZ', wx, wy + 0.2, wx + w.widthFt, wy + 0.2);
      addText('A-GLAZ', wx + w.widthFt / 2 - 0.5, wy + 0.4, 0.4, w.tag || 'W');
    } else {
      const wx = w.wallSide === 'left' ? r.x : r.x + r.width;
      const wy = toCadY(r.y + w.offsetFt - w.widthFt / 2);
      addLine('A-GLAZ', wx, wy, wx, wy - w.widthFt);
      addLine('A-GLAZ', wx + 0.2, wy, wx + 0.2, wy - w.widthFt);
      addText('A-GLAZ', wx + 0.4, wy - w.widthFt / 2, 0.4, w.tag || 'W');
    }
  });

  // ─── 4.5 CONCEPTUAL COLUMNS (9"x12" markers) ────────────────────────────────
  if (columns) {
    columns.forEach((col) => {
      const cx = col.x;
      const cy = toCadY(col.y);
      const hw = col.widthFt / 2;
      const hh = col.heightFt / 2;

      addLine('S-COLS-CONCPT', cx - hw, cy - hh, cx + hw, cy - hh);
      addLine('S-COLS-CONCPT', cx + hw, cy - hh, cx + hw, cy + hh);
      addLine('S-COLS-CONCPT', cx + hw, cy + hh, cx - hw, cy + hh);
      addLine('S-COLS-CONCPT', cx - hw, cy + hh, cx - hw, cy - hh);
      // Center cross hatch
      addLine('S-COLS-CONCPT', cx - hw, cy - hh, cx + hw, cy + hh);
      addLine('S-COLS-CONCPT', cx - hw, cy + hh, cx + hw, cy - hh);
      addText('S-COLS-CONCPT', cx + hw + 0.2, cy, 0.35, col.tag);
    });
  }

  // ─── 4.6 OTS SHAFTS ─────────────────────────────────────────────────────────
  if (ots) {
    ots.forEach((o) => {
      const ox1 = o.x;
      const oy1 = toCadY(o.y + o.height);
      const ox2 = o.x + o.width;
      const oy2 = toCadY(o.y);
      addLine('A-WALL-INTR', ox1, oy1, ox2, oy1);
      addLine('A-WALL-INTR', ox2, oy1, ox2, oy2);
      addLine('A-WALL-INTR', ox2, oy2, ox1, oy2);
      addLine('A-WALL-INTR', ox1, oy2, ox1, oy1);
      // Diagonal cross for OTS
      addLine('A-WALL-INTR', ox1, oy1, ox2, oy2);
      addLine('A-WALL-INTR', ox1, oy2, ox2, oy1);
      addText('A-DIMS', ox1 + 0.5, (oy1 + oy2) / 2, 0.4, 'OTS SHAFT');
    });
  }

  // ─── 4.7 FURNITURE PLACEHOLDERS ─────────────────────────────────────────────
  furniture.forEach((f) => {
    const r = rooms.find(room => room.id === f.roomId);
    if (!r) return;
    const fx1 = r.x + f.x;
    const fy1 = toCadY(r.y + f.y + f.height);
    const fx2 = fx1 + f.width;
    const fy2 = toCadY(r.y + f.y);

    addLine('A-FURN', fx1, fy1, fx2, fy1);
    addLine('A-FURN', fx2, fy1, fx2, fy2);
    addLine('A-FURN', fx2, fy2, fx1, fy2);
    addLine('A-FURN', fx1, fy2, fx1, fy1);
  });

  // ─── 4.8 TITLE BLOCK & DISCLAIMER ───────────────────────────────────────────
  const tbY = -3.0;
  addText('0_TITLEBLOCK', 0, tbY, 0.8, `PROJECT: ${model.name.toUpperCase()}`);
  addText('0_TITLEBLOCK', 0, tbY - 1.2, 0.5, `PLOT DIMENSIONS: ${plot.width}'-0" x ${plot.depth}'-0" (${Math.round((plot.width * plot.depth) / 9)} SQYD) | ROAD FACING: ${plot.roadFacing}`);
  addText('0_TITLEBLOCK', 0, tbY - 2.2, 0.5, `BUILT-UP AREA: ${model.builtUpAreaSqFt} SQFT | CARPET AREA: ${model.carpetAreaSqFt} SQFT | COVERAGE: ${model.coveragePercent}%`);
  addText('0_TITLEBLOCK', 0, tbY - 3.4, 0.35, 'DISCLAIMER: PRELIMINARY CONCEPTUAL SPACE PLAN. NOT A SANCTIONED OR CERTIFIED STRUCTURAL DRAWING. MUST BE VERIFIED BY A LICENSED ARCHITECT/ENGINEER.');

  add(0, 'ENDSEC');
  add(0, 'EOF');

  return lines.join('\n');
}

/**
 * Triggers a browser file download of the generated DXF.
 */
export function downloadFloorPlanDXF(model: FloorPlanModel, filename?: string): void {
  const dxfContent = exportToDXF(model);
  const blob = new Blob([dxfContent], { type: 'application/dxf;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `PropWise_CAD_${model.name.replace(/\s+/g, '_')}_${model.plot.width}x${model.plot.depth}.dxf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Triggers a browser file download of the visual SVG blueprint.
 */
export function downloadFloorPlanSVG(svgElement: SVGSVGElement, filename?: string): void {
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svgElement);
  
  if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  
  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `PropWise_Blueprint_${Date.now()}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
