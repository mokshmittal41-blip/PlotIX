import { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, Building2, Landmark, IndianRupee,
  Grid, Compass, Ruler, Zap, Check, Sparkles,
  Copy
} from 'lucide-react';
import PlotBlueprintCanvas, { type PlotShapeMode } from '../components/calculator/PlotBlueprintCanvas';
import FARConstructionCalculator from '../components/calculator/FARConstructionCalculator';
import ConstructionCostEstimator from '../components/calculator/ConstructionCostEstimator';
import StampDutyCalculator from '../components/calculator/StampDutyCalculator';
import VastuAnalysisCard from '../components/calculator/VastuAnalysisCard';
import LandLoanCalculator from '../components/calculator/LandLoanCalculator';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { 
  type UnitId, 
  type DirectionFacing, 
  type Point2D,
  calculateLShapedArea,
  calculateTriangleArea,
  calculatePolygonArea,
  calculatePolygonPerimeter,
} from '../utils/landConversions';
import { 
  type RateUnitId, 
  rateToPerSqFt
} from '../utils/landValueCalculator';

type ActiveStageView = 'cad' | 'conversions' | 'far' | 'stamp_duty' | 'vastu' | 'loan';
type CalculatorMode = 'area' | 'stamp_duty' | 'loan' | 'construction' | 'advanced';

// Popular Indian Plot Presets (Front × Depth in Feet)
const PLOT_PRESETS = [
  { label: '4 Marla (100 Gaj)', front: '20', depth: '45', gaj: 100 },
  { label: '5 Marla (125 Gaj)', front: '25', depth: '45', gaj: 125 },
  { label: '6 Marla (150 Gaj)', front: '30', depth: '45', gaj: 150 },
  { label: '8 Marla (200 Gaj)', front: '30', depth: '60', gaj: 200 },
  { label: '10 Marla (250 Gaj)', front: '35', depth: '65', gaj: 250 },
  { label: '14 Marla (350 Gaj)', front: '40', depth: '79', gaj: 350 },
  { label: '1 Kanal (500 Gaj)', front: '50', depth: '90', gaj: 500 },
  { label: '2 Kanal (1000 Gaj)', front: '60', depth: '150', gaj: 1000 },
  { label: '1 Acre / Killa', front: '198', depth: '220', gaj: 4840 },
];

export default function LandCalculator() {
  const { language } = useLanguage();
  const { importedPlot, addToast } = useApp();

  // Mode Selector: Area vs Stamp Duty vs Loan vs Construction vs Advanced CAD
  const [calcMode, setCalcMode] = useState<CalculatorMode>('area');

  // Input dimension unit
  const [inputUnit, setInputUnit] = useState<'ft' | 'm' | 'yd' | 'karam'>('ft');

  // Shape & Dimensions
  const [shape, setShape] = useState<PlotShapeMode>('rectangular');
  const [frontage, setFrontage] = useState('30');
  const [depth, setDepth] = useState('60');
  const [unit] = useState<UnitId>('sqft');

  // Additional dimensions for 4-sided trapezoid, L-shape, and triangle
  const [rearWidth, setRearWidth] = useState('30');
  const [depthLeft, setDepthLeft] = useState('60');
  const [depthRight, setDepthRight] = useState('60');
  const [cutoutWidth, setCutoutWidth] = useState('10');
  const [cutoutDepth, setCutoutDepth] = useState('20');
  const [triA, setTriA] = useState('30');
  const [triB, setTriB] = useState('60');
  const [triC, setTriC] = useState('67.08');
  
  // Irregular polygon vertices
  const [polygonVertices, setPolygonVertices] = useState<Point2D[]>([
    { x: 0, y: 0 },
    { x: 30, y: 0 },
    { x: 35, y: 60 },
    { x: 0, y: 55 },
  ]);

  // Road & Direction
  const [facing, setFacing] = useState<DirectionFacing>('North');
  const roadPosition = 'front';
  const [roadWidthFt] = useState<number>(30);

  // Valuation Rate
  const [rate] = useState('35000');
  const [rateUnit] = useState<RateUnitId>('sqyd');

  // Active Stage View in Advanced CAD
  const [activeStageView, setActiveStageView] = useState<ActiveStageView>('cad');

  // Load imported plot from Map page if present
  useEffect(() => {
    if (importedPlot && importedPlot.areaSqYd > 0) {
      // Set reasonable rectangle front & depth approximating imported area
      const approxSide = Math.sqrt(importedPlot.areaSqYd * 9);
      setFrontage((approxSide * 0.7).toFixed(1));
      setDepth((approxSide * 1.4).toFixed(1));
      if (addToast) {
        addToast(`Imported ${importedPlot.areaSqYd} Gaj plot from map!`, 'info');
      }
    }
  }, [importedPlot, addToast]);

  // Multiplier to convert input unit to FEET
  const unitToFeetMultiplier = useMemo(() => {
    switch (inputUnit) {
      case 'm': return 3.28084;
      case 'yd': return 3.0;
      case 'karam': return 5.5; // Traditional Karam = 5.5 feet (66 inches)
      default: return 1.0;
    }
  }, [inputUnit]);

  // Numeric parsing converted to feet
  const rawF = Math.max(0.1, parseFloat(frontage) || 0);
  const rawD = Math.max(0.1, parseFloat(depth) || 0);
  const rawRW = Math.max(0.1, parseFloat(rearWidth) || rawF);
  const rawDL = Math.max(0.1, parseFloat(depthLeft) || rawD);
  const rawDR = Math.max(0.1, parseFloat(depthRight) || rawD);
  const rawCW = parseFloat(cutoutWidth) || 0;
  const rawCD = parseFloat(cutoutDepth) || 0;
  const rawTA = Math.max(0.1, parseFloat(triA) || 1);
  const rawTB = Math.max(0.1, parseFloat(triB) || 1);
  const rawTC = Math.max(0.1, parseFloat(triC) || 1);

  const f = rawF * unitToFeetMultiplier;
  const d = rawD * unitToFeetMultiplier;
  const rw = rawRW * unitToFeetMultiplier;
  const dl = rawDL * unitToFeetMultiplier;
  const dr = rawDR * unitToFeetMultiplier;
  const cw = rawCW * unitToFeetMultiplier;
  const cd = rawCD * unitToFeetMultiplier;
  const ta = rawTA * unitToFeetMultiplier;
  const tb = rawTB * unitToFeetMultiplier;
  const tc = rawTC * unitToFeetMultiplier;

  // Calculate Base Area in Sq.Ft and Perimeter in Ft
  const { areaSqFt, perimeterFt } = useMemo(() => {
    let sqft = 0;
    let peri = 0;

    if (shape === 'rectangular') {
      sqft = f * d;
      peri = 2 * (f + d);
    } else if (shape === 'trapezoid') {
      const avgFrontRear = (f + rw) / 2;
      const avgDepths = (dl + dr) / 2;
      sqft = avgFrontRear * avgDepths;
      peri = f + rw + dl + dr;
    } else if (shape === 'l_shaped') {
      const lshape = calculateLShapedArea(f, d, cw, cd);
      sqft = lshape.area;
      peri = lshape.perimeter;
    } else if (shape === 'triangular') {
      const tri = calculateTriangleArea(ta, tb, tc);
      sqft = tri.area;
      peri = tri.perimeter;
    } else if (shape === 'irregular') {
      sqft = calculatePolygonArea(polygonVertices);
      peri = calculatePolygonPerimeter(polygonVertices);
    }

    return { areaSqFt: Math.max(1, sqft), perimeterFt: Math.max(1, peri) };
  }, [shape, f, d, rw, dl, dr, cw, cd, ta, tb, tc, polygonVertices]);

  // Derived Conversions
  const gajVal = areaSqFt / 9;
  const marlaVal = areaSqFt / 225; // 225 sq.ft standard (25 Gaj)
  const marlaPbVal = areaSqFt / 272.25; // 272.25 sq.ft (30.25 Gaj)
  const kanalVal = areaSqFt / 5445; // 20 Marla = 605 Gaj
  const killaVal = areaSqFt / 43560; // 8 Kanal = 4,840 Gaj
  const bighaPbVal = areaSqFt / 21780; // 4 Kanals = 2,420 Gaj
  const bighaPukkaVal = areaSqFt / 27225; // 3,025 Gaj (UP/Rajasthan)
  const biswaVal = areaSqFt / 1089; // 1/20 Bigha
  const sarsahiVal = areaSqFt / 25; // 1/9 Marla = 25 sq.ft
  const hectareVal = areaSqFt / 107639.1;
  const sqMetreVal = areaSqFt / 10.7639;

  // Valuation for passing default price
  const numericRate = parseFloat(rate) || 35000;
  const ratePerSqFt = rateToPerSqFt(numericRate, rateUnit);
  const totalEstimatedValue = areaSqFt * ratePerSqFt;

  // Diagonal calculation for right-angled corners (Guniya test)
  const diagonalFt = Math.sqrt((f * f) + (d * d));

  const handleApplyPreset = (preset: typeof PLOT_PRESETS[0]) => {
    setShape('rectangular');
    setInputUnit('ft');
    setFrontage(preset.front);
    setDepth(preset.depth);
  };

  const handleCopyValue = (text: string) => {
    navigator.clipboard?.writeText(text);
    if (addToast) addToast(`Copied ${text} to clipboard!`, 'info');
  };

  return (
    <div className="calc-dashboard-container" style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* ─── Top Header & Title Bar (Clean Light Aesthetic) ─────────────────────── */}
      <div className="calc-top-header-card">
        <div className="header-badge-row">
          <div className="calc-title-icon-box">
            <Calculator size={22} />
          </div>
          <div>
            <h1 className="calc-main-title">
              {language === 'pa' 
                ? 'ਜ਼ਮੀਨ ਮਾਪ ਤੇ ਸਟੈਂਪ ਡਿਊਟੀ ਕੈਲਕੁਲੇਟਰ' 
                : (language === 'hi' 
                  ? 'जमीन नाप एवं स्टाम्प ड्यूटी कैलकुलेटर' 
                  : 'Land Area & Stamp Duty Suite')}
            </h1>
            <p className="calc-main-subtitle">
              {language === 'pa'
                ? 'ਪਲਾਟ ਦੇ ਸਾਰੇ ਮਾਪ (ਗਜ਼, ਮਰਲਾ, ਕਨਾਲ, ਏਕੜ), ਸਰਕਾਰੀ ਰਜਿਸਟਰੀ ਖਰਚਾ, ਲੋਨ EMI ਤੇ ਉਸਾਰੀ ਲਾਗਤ'
                : (language === 'hi'
                  ? 'प्लाट के सभी नाप (गज, मरला, कनाल, एकड़), सरकारी रजिस्ट्री खर्च, बैंक लोन EMI व निर्माण लागत'
                  : 'Instant Gaj, Marla & Acre conversions, official state stamp duty, loan EMI & construction estimates')}
            </p>
          </div>
        </div>

        <div className="calc-header-extra-tag">
          <Sparkles size={14} className="text-emerald" />
          <span>Official 2026-27 Revenue & Tehsil Standards</span>
        </div>
      </div>

      {/* ─── PROMINENT 5-CARD MODE SELECTOR (Light & Vibrant Design) ─── */}
      <div className="calc-mode-selector-grid-5">
        
        {/* Card 1: Land Area & Gaj */}
        <div
          onClick={() => setCalcMode('area')}
          className={`calc-mode-pill-card ${calcMode === 'area' ? 'active-area' : ''}`}
        >
          <div className="mode-icon-circle area">
            <Zap size={20} />
          </div>
          <div className="mode-text-wrap">
            <div className="mode-title-row">
              <span className="mode-title-text">
                {language === 'pa' ? '📐 ਜ਼ਮੀਨ ਮਾਪ ਤੇ ਗਜ਼' : (language === 'hi' ? '📐 जमीन नाप व गज' : '📐 Land Area & Gaj')}
              </span>
            </div>
            <p className="mode-desc-text">
              {language === 'pa' ? 'ਫਰੰਟ × ਲੰਬਾਈ → ਗਜ਼, ਮਰਲਾ, ਕਨਾਲ ਤੇ ਏਕੜ' : (language === 'hi' ? 'फ्रंट × लंबाई → गज, मरला, कनाल व एकड़' : 'Custom Dimensions → Gaj, Marla & Acre')}
            </p>
          </div>
          {calcMode === 'area' && <div className="mode-active-dot" />}
        </div>

        {/* Card 2: Stamp Duty & Registry Charges */}
        <div
          onClick={() => setCalcMode('stamp_duty')}
          className={`calc-mode-pill-card ${calcMode === 'stamp_duty' ? 'active-stamp' : ''}`}
        >
          <div className="mode-icon-circle stamp">
            <Landmark size={20} />
          </div>
          <div className="mode-text-wrap">
            <div className="mode-title-row">
              <span className="mode-title-text">
                {language === 'pa' ? '🏛️ ਸਟੈਂਪ ਡਿਊਟੀ ਤੇ ਰਜਿਸਟਰੀ' : (language === 'hi' ? '🏛️ स्टाम्प ड्यूटी व रजिस्ट्री' : '🏛️ Stamp Duty & Registry')}
              </span>
            </div>
            <p className="mode-desc-text">
              {language === 'pa' ? 'ਤਹਿਸੀਲ ਸਰਕਾਰੀ ਫੀਸ, ਮਹਿਲਾ ਛੋਟ ਤੇ ਸੈੱਸ' : (language === 'hi' ? 'तहसील रजिस्ट्री फीस, महिला छूट व सेस' : 'State-wise conveyance deed & registration fees')}
            </p>
          </div>
          {calcMode === 'stamp_duty' && <div className="mode-active-dot" />}
        </div>

        {/* Card 3: Bank Loan & EMI */}
        <div
          onClick={() => setCalcMode('loan')}
          className={`calc-mode-pill-card ${calcMode === 'loan' ? 'active-loan' : ''}`}
        >
          <div className="mode-icon-circle loan">
            <IndianRupee size={20} />
          </div>
          <div className="mode-text-wrap">
            <div className="mode-title-row">
              <span className="mode-title-text">
                {language === 'pa' ? '🏦 ਬੈਂਕ ਲੋਨ ਤੇ EMI' : (language === 'hi' ? '🏦 बैंक लोन व EMI' : '🏦 Bank Loan & EMI')}
              </span>
            </div>
            <p className="mode-desc-text">
              {language === 'pa' ? 'ਪਲਾਟ ਖਰੀਦ ਤੇ ਮਕਾਨ ਲੋਨ ਕਿਸ਼ਤ' : (language === 'hi' ? 'प्लाट खरीद व होम लोन किस्त' : 'Plot purchase & home loan interest calculator')}
            </p>
          </div>
          {calcMode === 'loan' && <div className="mode-active-dot" />}
        </div>

        {/* Card 4: Construction Cost Estimator */}
        <div
          onClick={() => setCalcMode('construction')}
          className={`calc-mode-pill-card ${calcMode === 'construction' ? 'active-construction' : ''}`}
        >
          <div className="mode-icon-circle construction">
            <Building2 size={20} />
          </div>
          <div className="mode-text-wrap">
            <div className="mode-title-row">
              <span className="mode-title-text">
                {language === 'pa' ? '🏗️ ਮਕਾਨ ਉਸਾਰੀ ਖਰਚਾ' : (language === 'hi' ? '🏗️ मकान निर्माण लागत' : '🏗️ Construction Cost')}
              </span>
            </div>
            <p className="mode-desc-text">
              {language === 'pa' ? '4 ਕੁਆਲਿਟੀ ਪੱਧਰ ਤੇ 15 ਸਮੱਗਰੀ ਖਰਚੇ' : (language === 'hi' ? '4 क्वालिटी टियर व 15 सामग्री खर्च' : 'Quality tiers, materials & colony rates')}
            </p>
          </div>
          {calcMode === 'construction' && <div className="mode-active-dot" />}
        </div>

        {/* Card 5: CAD Blueprint Studio */}
        <div
          onClick={() => setCalcMode('advanced')}
          className={`calc-mode-pill-card ${calcMode === 'advanced' ? 'active-cad' : ''}`}
        >
          <div className="mode-icon-circle cad">
            <Ruler size={20} />
          </div>
          <div className="mode-text-wrap">
            <div className="mode-title-row">
              <span className="mode-title-text">
                {language === 'pa' ? '📐 ਨਕਸ਼ਾ ਤੇ ਪੁੱਡਾ ਨਿਯਮ' : (language === 'hi' ? '📐 नक्शा व PUDA नियम' : '📐 CAD & PUDA Bylaws')}
              </span>
            </div>
            <p className="mode-desc-text">
              {language === 'pa' ? '2D ਬਲੂਪ੍ਰਿੰਟ, ਸੈੱਟਬੈਕ, FAR ਤੇ ਵਾਸਤੂ' : (language === 'hi' ? '2D ब्लूप्रिंट, सेटबैक, FAR व वास्तु' : '2D blueprint, setbacks, FAR & Vastu analysis')}
            </p>
          </div>
          {calcMode === 'advanced' && <div className="mode-active-dot" />}
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          MODE 1: CUSTOM DIMENSION INPUT -> COMPLETE CONVERSIONS IN ALL UNITS
      ══════════════════════════════════════════════════════════════════════ */}
      {calcMode === 'area' ? (
        <>
          {/* Quick Plot Presets Row */}
          <div className="plot-presets-strip">
            <div className="presets-label">
              <Sparkles size={13} className="text-emerald" />
              <span>Standard Presets:</span>
            </div>
            <div className="presets-buttons-scroll">
              {PLOT_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`preset-pill-btn ${frontage === preset.front && depth === preset.depth ? 'active' : ''}`}
                  onClick={() => handleApplyPreset(preset)}
                >
                  <span>{preset.label}</span>
                  <span className="preset-dims">({preset.front}×{preset.depth} ft)</span>
                </button>
              ))}
            </div>
          </div>

          <div className="calc-mode1-grid">
            
            {/* LEFT: CUSTOM PLOT INPUTS & SHAPES */}
            <div className="calc-inputs-column">
              
              <div className="calc-card-white">
                
                {/* Header with Unit Switch */}
                <div className="card-top-header">
                  <div>
                    <h3 className="section-heading">
                      {language === 'pa' ? 'ਪਲਾਟ ਦਾ ਮਾਪ ਦਰਜ ਕਰੋ' : (language === 'hi' ? 'प्लाट का नाप दर्ज करें' : 'Enter Custom Plot Dimensions')}
                    </h3>
                    <span className="section-subheading">
                      {language === 'pa' ? 'ਸਾਈਡਾਂ ਦਾ ਮਾਪ ਲਿਖੋ, ਸਿਸਟਮ ਸਾਰੀਆਂ ਇਕਾਈਆਂ ਕੱਢੇਗਾ' : (language === 'hi' ? 'भुजाओं का नाप लिखें, सिस्टम सभी इकाइयों में बदलेगा' : 'Enter side lengths to calculate area across all Indian land units')}
                    </span>
                  </div>

                  {/* Input Unit Switch */}
                  <div className="unit-switch-group">
                    {[
                      { id: 'ft', label: 'Feet (ਫੁੱਟ)' },
                      { id: 'm', label: 'Metres (ਮੀ.)' },
                      { id: 'yd', label: 'Gaj (ਗਜ਼)' },
                      { id: 'karam', label: 'Karam (ਕਰਮ)' },
                    ].map(u => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setInputUnit(u.id as any)}
                        className={`unit-switch-btn ${inputUnit === u.id ? 'active' : ''}`}
                      >
                        {u.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Plot Shape Tabs */}
                <div className="shape-tabs-row">
                  {[
                    { id: 'rectangular', label: language === 'pa' ? 'ਆਇਤਾਕਾਰ (Standard)' : (language === 'hi' ? 'आयताकार (Standard)' : 'Standard Rectangle') },
                    { id: 'trapezoid', label: language === 'pa' ? 'ਤਿਰਛਾ 4 ਭੁਜਾਵਾਂ (Tilted)' : (language === 'hi' ? 'तिरछा 4 भुजाएँ (Tilted)' : '4-Sided Tilted') },
                    { id: 'l_shaped', label: language === 'pa' ? 'ਐਲ-ਆਕਾਰ (L-Shape)' : (language === 'hi' ? 'एल-आकार (L-Shape)' : 'L-Shaped Corner') },
                    { id: 'triangular', label: language === 'pa' ? 'ਤਿਕੋਣਾ (Triangle)' : (language === 'hi' ? 'त्रिकोण (Triangle)' : 'Triangular') },
                  ].map(sh => (
                    <button
                      key={sh.id}
                      type="button"
                      onClick={() => setShape(sh.id as PlotShapeMode)}
                      className={`shape-tab-btn ${shape === sh.id ? 'active' : ''}`}
                    >
                      {sh.label}
                    </button>
                  ))}
                </div>

                {/* Dimension Inputs Based on Selected Shape */}
                {shape === 'rectangular' && (
                  <div className="dimension-inputs-grid">
                    {/* Frontage */}
                    <div className="input-field-card">
                      <div className="input-label-row">
                        <label className="input-title">
                          {language === 'pa' ? 'ਫਰੰਟ / ਚੌੜਾਈ (Frontage)' : (language === 'hi' ? 'फ्रंट / चौड़ाई (Frontage)' : 'Frontage (Width)')}
                        </label>
                        <span className="input-badge">{rawF} {inputUnit}</span>
                      </div>

                      <div className="input-control-wrap">
                        <input
                          type="number"
                          step="0.5"
                          min="1"
                          value={frontage}
                          onChange={e => setFrontage(e.target.value)}
                          placeholder="e.g. 30"
                          className="main-dim-input"
                        />
                        <span className="unit-tag">{inputUnit}</span>
                      </div>

                      <input 
                        type="range" 
                        min="10" 
                        max="200" 
                        step="1"
                        value={rawF} 
                        onChange={e => setFrontage(e.target.value)} 
                        className="dim-slider"
                      />
                    </div>

                    {/* Depth */}
                    <div className="input-field-card">
                      <div className="input-label-row">
                        <label className="input-title">
                          {language === 'pa' ? 'ਲੰਬਾਈ / ਡੂੰਘਾਈ (Depth / Length)' : (language === 'hi' ? 'लंबाई / गहराई (Depth / Length)' : 'Depth (Length)')}
                        </label>
                        <span className="input-badge">{rawD} {inputUnit}</span>
                      </div>

                      <div className="input-control-wrap">
                        <input
                          type="number"
                          step="0.5"
                          min="1"
                          value={depth}
                          onChange={e => setDepth(e.target.value)}
                          placeholder="e.g. 60"
                          className="main-dim-input"
                        />
                        <span className="unit-tag">{inputUnit}</span>
                      </div>

                      <input 
                        type="range" 
                        min="10" 
                        max="300" 
                        step="1"
                        value={rawD} 
                        onChange={e => setDepth(e.target.value)} 
                        className="dim-slider"
                      />
                    </div>
                  </div>
                )}

                {shape === 'trapezoid' && (
                  <div className="trapezoid-grid">
                    <div>
                      <label className="sub-input-label">Front Width ({inputUnit}):</label>
                      <input type="number" value={frontage} onChange={e => setFrontage(e.target.value)} className="sub-dim-input" />
                    </div>
                    <div>
                      <label className="sub-input-label">Rear/Back Width ({inputUnit}):</label>
                      <input type="number" value={rearWidth} onChange={e => setRearWidth(e.target.value)} className="sub-dim-input" />
                    </div>
                    <div>
                      <label className="sub-input-label">Left Side Length ({inputUnit}):</label>
                      <input type="number" value={depthLeft} onChange={e => setDepthLeft(e.target.value)} className="sub-dim-input" />
                    </div>
                    <div>
                      <label className="sub-input-label">Right Side Length ({inputUnit}):</label>
                      <input type="number" value={depthRight} onChange={e => setDepthRight(e.target.value)} className="sub-dim-input" />
                    </div>
                  </div>
                )}

                {shape === 'l_shaped' && (
                  <div className="trapezoid-grid">
                    <div>
                      <label className="sub-input-label">Main Front ({inputUnit}):</label>
                      <input type="number" value={frontage} onChange={e => setFrontage(e.target.value)} className="sub-dim-input" />
                    </div>
                    <div>
                      <label className="sub-input-label">Main Depth ({inputUnit}):</label>
                      <input type="number" value={depth} onChange={e => setDepth(e.target.value)} className="sub-dim-input" />
                    </div>
                    <div>
                      <label className="sub-input-label">Cutout Width ({inputUnit}):</label>
                      <input type="number" value={cutoutWidth} onChange={e => setCutoutWidth(e.target.value)} className="sub-dim-input" />
                    </div>
                    <div>
                      <label className="sub-input-label">Cutout Depth ({inputUnit}):</label>
                      <input type="number" value={cutoutDepth} onChange={e => setCutoutDepth(e.target.value)} className="sub-dim-input" />
                    </div>
                  </div>
                )}

                {shape === 'triangular' && (
                  <div className="triangle-grid">
                    <div>
                      <label className="sub-input-label">Side A ({inputUnit}):</label>
                      <input type="number" value={triA} onChange={e => setTriA(e.target.value)} className="sub-dim-input" />
                    </div>
                    <div>
                      <label className="sub-input-label">Side B ({inputUnit}):</label>
                      <input type="number" value={triB} onChange={e => setTriB(e.target.value)} className="sub-dim-input" />
                    </div>
                    <div>
                      <label className="sub-input-label">Side C ({inputUnit}):</label>
                      <input type="number" value={triC} onChange={e => setTriC(e.target.value)} className="sub-dim-input" />
                    </div>
                  </div>
                )}

                {/* Engineering & Technical Stats Card */}
                <div className="engineering-stats-card">
                  <div className="eng-stat-row">
                    <span className="eng-stat-label">📐 {language === 'pa' ? 'ਚਾਰੇ ਪਾਸੇ ਦਾ ਘੇਰਾ (Perimeter):' : (language === 'hi' ? 'चारों तरफ का घेरा (Perimeter):' : 'Boundary Perimeter:')}</span>
                    <strong className="eng-stat-val">{Math.round(perimeterFt)} ft ({(perimeterFt * 0.3048).toFixed(1)} m)</strong>
                  </div>

                  {shape === 'rectangular' && (
                    <div className="eng-stat-row">
                      <span className="eng-stat-label">📐 {language === 'pa' ? 'ਕਰਣ / ਡਾਇਗਨਲ (Guniya Check):' : (language === 'hi' ? 'गुनिया / कर्ण (Guniya Check):' : '90° Diagonal (Guniya):')}</span>
                      <strong className="eng-stat-val">{diagonalFt.toFixed(2)} ft</strong>
                    </div>
                  )}

                  <div className="eng-stat-row">
                    <span className="eng-stat-label">🌾 {language === 'pa' ? 'ਕਰਮਾਂ ਵਿੱਚ ਮਾਪ (1 ਕਰਮ = 5.5 ਫੁੱਟ):' : (language === 'hi' ? 'करम में नाप (1 करम = 5.5 फुट):' : 'Measurement in Karams (5.5 ft):')}</span>
                    <strong className="eng-stat-val">{(f / 5.5).toFixed(1)} × {(d / 5.5).toFixed(1)} Karams</strong>
                  </div>
                </div>

                {/* Live Mini-Canvas Blueprint Preview */}
                <div className="mini-blueprint-visualizer">
                  <div className="blueprint-header-row">
                    <span className="blueprint-title">Live 2D Plot Preview</span>
                    <span className="blueprint-tag">{f.toFixed(1)} ft × {d.toFixed(1)} ft</span>
                  </div>

                  <div className="svg-canvas-container">
                    <svg width="100%" height="160" viewBox="0 0 300 160" className="blueprint-svg">
                      {/* Grid background */}
                      <defs>
                        <pattern id="lightGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#lightGrid)" rx="8" />

                      {/* Main Drawn Plot Rect */}
                      <rect 
                        x="50" 
                        y="25" 
                        width="200" 
                        height="100" 
                        fill="rgba(16, 185, 129, 0.12)" 
                        stroke="#10b981" 
                        strokeWidth="2.5"
                        strokeDasharray="4 4"
                        rx="4"
                      />

                      {/* Diagonal line */}
                      <line x1="50" y1="25" x2="250" y2="125" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                      <text x="135" y="70" fill="#64748b" fontSize="10" fontWeight="600">Guniya {diagonalFt.toFixed(1)} ft</text>

                      {/* Dimension Labels */}
                      <text x="150" y="18" textAnchor="middle" fill="#047857" fontSize="11" fontWeight="800">Front: {f.toFixed(1)} ft</text>
                      <text x="258" y="80" textAnchor="start" fill="#047857" fontSize="11" fontWeight="800">Depth: {d.toFixed(1)} ft</text>
                      
                      {/* Center Area Badge */}
                      <rect x="100" y="80" width="100" height="28" rx="6" fill="#ffffff" stroke="#10b981" strokeWidth="1.5" />
                      <text x="150" y="98" textAnchor="middle" fill="#047857" fontSize="12" fontWeight="800">{gajVal.toFixed(2)} Gaj</text>

                      {/* North Arrow */}
                      <g transform="translate(20, 30)">
                        <circle cx="0" cy="0" r="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                        <path d="M 0 -8 L 4 3 L 0 1 L -4 3 Z" fill="#ef4444" />
                        <text x="0" y="10" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="800">N</text>
                      </g>
                    </svg>
                  </div>
                </div>

              </div>

            </div>

            {/* RIGHT: COMPLETE REGIONAL REVENUE UNITS CONVERSION */}
            <div className="calc-results-column">
              
              {/* PRIMARY TOTAL GAJ HIGHLIGHT HERO CARD (Light Emerald Finish) */}
              <div className="land-hero-result-card-light">
                <div className="hero-top-badge-row">
                  <div className="result-check-badge">
                    <Check size={14} strokeWidth={3} />
                    <span>Calculated Total Land Area</span>
                  </div>
                  <span className="dims-pill">
                    {f.toFixed(1)} ft × {d.toFixed(1)} ft
                  </span>
                </div>

                <div className="gaj-hero-number-wrap">
                  <div className="gaj-hero-label">
                    {language === 'pa' ? 'ਕੁੱਲ ਗਜ਼ (Total Gaj / Sq.Yards):' : (language === 'hi' ? 'कुल कितने गज (Total Gaj / Sq.Yards):' : 'Total Plot Area (Gaj / Sq.Yards):')}
                  </div>
                  <div className="gaj-number-display">
                    {gajVal.toFixed(2)} <span className="gaj-unit-text">{language === 'pa' ? 'ਗਜ਼ (Gaj)' : (language === 'hi' ? 'गज (Gaj)' : 'Gaj')}</span>
                  </div>
                  <div className="sqft-secondary-text">
                    ≈ {Math.round(areaSqFt).toLocaleString()} sq.ft &bull; {sqMetreVal.toFixed(2)} sq.m
                  </div>
                </div>

                {/* Prominent North India 3-Pill Summary */}
                <div className="revenue-pills-row">
                  <div className="revenue-pill-box marla">
                    <div className="pill-title">{language === 'pa' ? 'ਮਰਲਾ (Marla)' : (language === 'hi' ? 'मरला (Marla)' : 'Marla')}</div>
                    <div className="pill-val">{marlaVal.toFixed(2)}</div>
                    <div className="pill-sub">225 sq.ft std</div>
                  </div>

                  <div className="revenue-pill-box kanal">
                    <div className="pill-title">{language === 'pa' ? 'ਕਨਾਲ (Kanal)' : (language === 'hi' ? 'कनाल (Kanal)' : 'Kanal')}</div>
                    <div className="pill-val">{kanalVal.toFixed(3)}</div>
                    <div className="pill-sub">20 Marlas</div>
                  </div>

                  <div className="revenue-pill-box acre">
                    <div className="pill-title">{language === 'pa' ? 'ਕਿੱਲਾ / ਏਕੜ' : (language === 'hi' ? 'किल्ला / एकड़' : 'Killa / Acre')}</div>
                    <div className="pill-val">{killaVal.toFixed(4)}</div>
                    <div className="pill-sub">4,840 Gaj</div>
                  </div>
                </div>

                {/* Direct CTA to calculate Stamp Duty for this exact plot */}
                <button
                  type="button"
                  className="hero-stamp-duty-cta-btn"
                  onClick={() => setCalcMode('stamp_duty')}
                  title="Open Official Stamp Duty & Registry Calculation for this Plot"
                >
                  <Landmark size={17} />
                  <span>Calculate Govt Stamp Duty for this Plot ({gajVal.toFixed(1)} Gaj) →</span>
                </button>
              </div>

              {/* ALL LOCAL REVENUE CONVERSION UNITS (EXHAUSTIVE TABLE) */}
              <div className="calc-card-white">
                <div className="conversions-card-header">
                  <h4 className="conversions-card-title">
                    <Grid size={17} className="text-emerald" /> 
                    <span>{language === 'pa' ? 'ਸਾਰੀਆਂ ਸਰਕਾਰੀ ਇਕਾਈਆਂ ਵਿੱਚ ਨਾਪ' : (language === 'hi' ? 'सभी सरकारी इकाइयों में संपूर्ण रूपांतरण' : 'All Revenue Unit Conversions')}</span>
                  </h4>
                  <span className="unit-count-badge">
                    12 Standard Units
                  </span>
                </div>

                <div className="conversions-grid-2col">
                  {/* Gaj */}
                  <div className="conversion-unit-box highlight" onClick={() => handleCopyValue(`${gajVal.toFixed(2)} Gaj`)}>
                    <div className="unit-name">ਗਜ਼ / गज (Gaj / Sq.Yards)</div>
                    <div className="unit-val-row">
                      <span className="unit-val">{gajVal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                      <Copy size={13} className="copy-icon" />
                    </div>
                  </div>

                  {/* Square Feet */}
                  <div className="conversion-unit-box" onClick={() => handleCopyValue(`${Math.round(areaSqFt)} sq.ft`)}>
                    <div className="unit-name">ਵਰਗ ਫੁੱਟ (Square Feet)</div>
                    <div className="unit-val-row">
                      <span className="unit-val">{Math.round(areaSqFt).toLocaleString()}</span>
                      <Copy size={13} className="copy-icon" />
                    </div>
                  </div>

                  {/* Marla Standard */}
                  <div className="conversion-unit-box" onClick={() => handleCopyValue(`${marlaVal.toFixed(2)} Marla`)}>
                    <div className="unit-name">ਮਰਲਾ (Standard 225 sq.ft / 25 Gaj)</div>
                    <div className="unit-val-row">
                      <span className="unit-val">{marlaVal.toFixed(2)}</span>
                      <Copy size={13} className="copy-icon" />
                    </div>
                  </div>

                  {/* Marla Punjab */}
                  <div className="conversion-unit-box" onClick={() => handleCopyValue(`${marlaPbVal.toFixed(2)} Marla (PB)`)}>
                    <div className="unit-name">ਮਰਲਾ (PB/HR 272.25 sq.ft)</div>
                    <div className="unit-val-row">
                      <span className="unit-val">{marlaPbVal.toFixed(2)}</span>
                      <Copy size={13} className="copy-icon" />
                    </div>
                  </div>

                  {/* Kanal */}
                  <div className="conversion-unit-box" onClick={() => handleCopyValue(`${kanalVal.toFixed(3)} Kanal`)}>
                    <div className="unit-name">ਕਨਾਲ (Kanal = 20 Marla = 605 Gaj)</div>
                    <div className="unit-val-row">
                      <span className="unit-val">{kanalVal.toFixed(3)}</span>
                      <Copy size={13} className="copy-icon" />
                    </div>
                  </div>

                  {/* Killa / Acre */}
                  <div className="conversion-unit-box" onClick={() => handleCopyValue(`${killaVal.toFixed(4)} Acre`)}>
                    <div className="unit-name">ਕਿੱਲਾ / ਏਕੜ (Killa / Acre = 8 Kanal)</div>
                    <div className="unit-val-row">
                      <span className="unit-val">{killaVal.toFixed(4)}</span>
                      <Copy size={13} className="copy-icon" />
                    </div>
                  </div>

                  {/* Bigha Punjab */}
                  <div className="conversion-unit-box" onClick={() => handleCopyValue(`${bighaPbVal.toFixed(3)} Bigha (PB)`)}>
                    <div className="unit-name">ਬਿੱਘਾ (Punjab/HR = 4 Kanals)</div>
                    <div className="unit-val-row">
                      <span className="unit-val">{bighaPbVal.toFixed(3)}</span>
                      <Copy size={13} className="copy-icon" />
                    </div>
                  </div>

                  {/* Pukka Bigha */}
                  <div className="conversion-unit-box" onClick={() => handleCopyValue(`${bighaPukkaVal.toFixed(3)} Pukka Bigha`)}>
                    <div className="unit-name">ਪੱਕਾ ਬਿੱਘਾ (Pukka Bigha = 3,025 Gaj)</div>
                    <div className="unit-val-row">
                      <span className="unit-val">{bighaPukkaVal.toFixed(3)}</span>
                      <Copy size={13} className="copy-icon" />
                    </div>
                  </div>

                  {/* Biswa */}
                  <div className="conversion-unit-box" onClick={() => handleCopyValue(`${biswaVal.toFixed(2)} Biswa`)}>
                    <div className="unit-name">ਬਿਸਵਾ (Biswa = 1/20 Bigha)</div>
                    <div className="unit-val-row">
                      <span className="unit-val">{biswaVal.toFixed(2)}</span>
                      <Copy size={13} className="copy-icon" />
                    </div>
                  </div>

                  {/* Sarsahi */}
                  <div className="conversion-unit-box" onClick={() => handleCopyValue(`${sarsahiVal.toFixed(1)} Sarsahi`)}>
                    <div className="unit-name">ਸਰਸਾਹੀ (Sarsahi = 1/9 Marla)</div>
                    <div className="unit-val-row">
                      <span className="unit-val">{sarsahiVal.toFixed(1)}</span>
                      <Copy size={13} className="copy-icon" />
                    </div>
                  </div>

                  {/* Square Metres */}
                  <div className="conversion-unit-box" onClick={() => handleCopyValue(`${sqMetreVal.toFixed(2)} sq.m`)}>
                    <div className="unit-name">ਵਰਗ ਮੀਟਰ (Square Metres)</div>
                    <div className="unit-val-row">
                      <span className="unit-val">{sqMetreVal.toFixed(2)}</span>
                      <Copy size={13} className="copy-icon" />
                    </div>
                  </div>

                  {/* Hectare */}
                  <div className="conversion-unit-box" onClick={() => handleCopyValue(`${hectareVal.toFixed(4)} Hectare`)}>
                    <div className="unit-name">ਹੈਕਟੇਅਰ (Hectare = 10,000 sq.m)</div>
                    <div className="unit-val-row">
                      <span className="unit-val">{hectareVal.toFixed(4)}</span>
                      <Copy size={13} className="copy-icon" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS TO NAVIGATE TO CONSTRUCTION & LOAN */}
              <div className="calc-action-buttons-grid">
                <button
                  type="button"
                  className="calc-nav-action-btn construction"
                  onClick={() => setCalcMode('construction')}
                >
                  <Building2 size={16} />
                  <span>{language === 'pa' ? 'ਇਸ ਪਲਾਟ ਦਾ ਉਸਾਰੀ ਖਰਚਾ ਵੇਖੋ →' : (language === 'hi' ? 'इस प्लाट का निर्माण बजट देखें →' : 'Estimate Construction Cost →')}</span>
                </button>

                <button
                  type="button"
                  className="calc-nav-action-btn loan"
                  onClick={() => setCalcMode('loan')}
                >
                  <IndianRupee size={16} />
                  <span>{language === 'pa' ? 'ਬੈਂਕ ਲੋਨ ਤੇ EMI ਕੱਢੋ →' : (language === 'hi' ? 'बैंक लोन व EMI निकालें →' : 'Calculate Bank Loan EMI →')}</span>
                </button>
              </div>

            </div>

          </div>
        </>
      ) : calcMode === 'stamp_duty' ? (
        /* ══════════════════════════════════════════════════════════════════════
            MODE 2: STANDALONE STAMP DUTY & REGISTRATION CALCULATOR
        ══════════════════════════════════════════════════════════════════════ */
        <div>
          <StampDutyCalculator
            propertyValue={totalEstimatedValue > 0 ? totalEstimatedValue : 5000000}
            plotAreaGaj={gajVal}
            onNavigateToArea={() => setCalcMode('area')}
          />
        </div>
      ) : calcMode === 'loan' ? (
        /* ══════════════════════════════════════════════════════════════════════
            MODE 3: STANDALONE BANK LOAN & EMI CALCULATOR
        ══════════════════════════════════════════════════════════════════════ */
        <div>
          <LandLoanCalculator
            totalPrice={totalEstimatedValue > 0 ? totalEstimatedValue : 4500000}
          />
        </div>
      ) : calcMode === 'construction' ? (
        /* ══════════════════════════════════════════════════════════════════════
            MODE 4: SMART INDIA-WIDE CONSTRUCTION COST ESTIMATOR
        ══════════════════════════════════════════════════════════════════════ */
        <div>
          <ConstructionCostEstimator
            initialPlotArea={Math.round(gajVal)}
            initialPlotUnit="sqyd"
            initialFloors={2}
          />
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════════════
            MODE 5: ADVANCED CAD BLUEPRINT & BYLAWS (FOR ARCHITECTS/PROFESSIONALS)
        ══════════════════════════════════════════════════════════════════════ */
        <div>
          {/* Quick Back to Area Mode Bar */}
          <div className="cad-top-back-bar">
            <button
              onClick={() => setCalcMode('area')}
              className="cad-back-btn"
            >
              {language === 'pa' ? '👈 ਜ਼ਮੀਨ ਮਾਪ ਕੈਲਕੁਲੇਟਰ ਉੱਤੇ ਵਾਪਸ ਜਾਓ' : (language === 'hi' ? '👈 जमीन नाप मोड पर वापस लौटें' : '👈 Back to Land Area Calculator')}
            </button>
            <span className="cad-mode-hint">
              {language === 'pa' ? 'ਤੁਸੀਂ ਪ੍ਰੋਫੈਸ਼ਨਲ CAD ਬਲੂਪ੍ਰਿੰਟ ਸਟੂਡੀਓ ਵਿੱਚ ਹੋ' : (language === 'hi' ? 'आप प्रोफेशनल CAD ब्लूप्रिंट स्टूडियो में हैं' : 'You are in Professional CAD Blueprint Studio')}
            </span>
          </div>

          <div className="calc-mode4-grid">
            {/* Controls */}
            <div className="calc-card-white" style={{ padding: '18px' }}>
              <h3 className="section-heading" style={{ marginBottom: '14px' }}>
                {language === 'pa' ? 'ਪਲਾਟ ਦੇ ਮਾਪਦੰਡ' : (language === 'hi' ? 'प्लाट के नाप व दिशा' : 'CAD Parameters')}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label className="sub-input-label">Shape (ਆਕਾਰ / आकार)</label>
                  <select
                    value={shape}
                    onChange={e => setShape(e.target.value as PlotShapeMode)}
                    className="sub-dim-input"
                  >
                    <option value="rectangular">{language === 'pa' ? 'ਆਇਤਾਕਾਰ (Rectangular)' : (language === 'hi' ? 'आयताकार (Rectangular)' : 'Rectangular')}</option>
                    <option value="trapezoid">{language === 'pa' ? 'ਤਿਰਛਾ ਪਲਾਟ (Trapezoid)' : (language === 'hi' ? 'तिरछा प्लाट (Trapezoid)' : 'Trapezoid')}</option>
                    <option value="l_shaped">{language === 'pa' ? 'ਐਲ-ਆਕਾਰ (L-Shaped)' : (language === 'hi' ? 'एल-आकार (L-Shaped)' : 'L-Shaped')}</option>
                    <option value="triangular">{language === 'pa' ? 'ਤਿਕੋਣਾ (Triangular)' : (language === 'hi' ? 'त्रिकोणीय (Triangular)' : 'Triangular')}</option>
                    <option value="irregular">{language === 'pa' ? 'ਅਨਿਯਮਿਤ (Irregular)' : (language === 'hi' ? 'अनियमित (Irregular)' : 'Irregular Polygon')}</option>
                  </select>
                </div>

                <div>
                  <label className="sub-input-label">Road Facing (ਸੜਕ ਦੀ ਦਿਸ਼ਾ)</label>
                  <select
                    value={facing}
                    onChange={e => setFacing(e.target.value as DirectionFacing)}
                    className="sub-dim-input"
                  >
                    <option value="North">{language === 'pa' ? 'ਉੱਤਰ (North)' : (language === 'hi' ? 'उत्तर (North)' : 'North')}</option>
                    <option value="East">{language === 'pa' ? 'ਪੂਰਬ - ਸ਼ੁੱਭ (East)' : (language === 'hi' ? 'पूर्व - शुभ (East)' : 'East')}</option>
                    <option value="South">{language === 'pa' ? 'ਦੱਖਣ (South)' : (language === 'hi' ? 'दक्षिण (South)' : 'South')}</option>
                    <option value="West">{language === 'pa' ? 'ਪੱਛਮ (West)' : (language === 'hi' ? 'पश्चिम (West)' : 'West')}</option>
                    <option value="North-East">{language === 'pa' ? 'ਈਸ਼ਾਨ ਕੋਣ - ਉੱਤਮ (North-East)' : (language === 'hi' ? 'ईशान कोण - उत्तम (North-East)' : 'North-East')}</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label className="sub-input-label">Front (Ft)</label>
                    <input type="number" value={frontage} onChange={e => setFrontage(e.target.value)} className="sub-dim-input" />
                  </div>
                  <div>
                    <label className="sub-input-label">Depth (Ft)</label>
                    <input type="number" value={depth} onChange={e => setDepth(e.target.value)} className="sub-dim-input" />
                  </div>
                </div>
              </div>
            </div>

            {/* CAD Stage Visualizer */}
            <div className="calc-card-white" style={{ padding: '20px' }}>
              <div className="cad-stage-tabs-row">
                {[
                  { id: 'cad', label: language === 'pa' ? 'ਬਲੂਪ੍ਰਿੰਟ CAD' : (language === 'hi' ? 'ब्लूप्रिंट नक्शा' : 'Blueprint CAD'), icon: <Ruler size={13} /> },
                  { id: 'far', label: language === 'pa' ? 'ਪੁੱਡਾ FAR ਤੇ ਮੰਜ਼ਿਲਾਂ' : (language === 'hi' ? 'PUDA FAR व मंजिलें' : 'PUDA FAR & Floors'), icon: <Building2 size={13} /> },
                  { id: 'stamp_duty', label: language === 'pa' ? 'ਰਜਿਸਟਰੀ ਖਰਚਾ' : (language === 'hi' ? 'स्टाम्प व रजिस्ट्री' : 'Stamp Duty'), icon: <Landmark size={13} /> },
                  { id: 'vastu', label: language === 'pa' ? 'ਵਾਸਤੂ ਰੇਟਿੰਗ' : (language === 'hi' ? 'वास्तु रेटिंग' : 'Vastu Rating'), icon: <Compass size={13} /> },
                  { id: 'loan', label: language === 'pa' ? 'ਬੈਂਕ ਲੋਨ' : (language === 'hi' ? 'बैंक लोन EMI' : 'Bank Loan'), icon: <IndianRupee size={13} /> },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveStageView(tab.id as ActiveStageView)}
                    className={`cad-stage-tab-btn ${activeStageView === tab.id ? 'active' : ''}`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {activeStageView === 'cad' && (
                <PlotBlueprintCanvas
                  shape={shape}
                  frontage={f}
                  depth={d}
                  rearWidth={rw}
                  depthRight={dr}
                  cutoutWidth={cw}
                  cutoutDepth={cd}
                  triSides={[ta, tb, tc]}
                  polygonVertices={polygonVertices}
                  facing={facing}
                  onFacingChange={setFacing}
                  roadPosition={roadPosition}
                  roadWidthFt={roadWidthFt}
                  areaSqFt={areaSqFt}
                  areaGaj={gajVal}
                  perimeterFt={perimeterFt}
                  estimatedValue={totalEstimatedValue}
                  unit={unit}
                  unitLabel={inputUnit === 'yd' ? 'Gaj' : (inputUnit === 'm' ? 'sq.m' : 'sq.ft')}
                  onUpdateVertices={setPolygonVertices}
                  frontSetbackFt={5}
                  rearSetbackFt={3}
                  sideSetbackFt={2.5}
                />
              )}
              {activeStageView === 'far' && (
                <FARConstructionCalculator plotAreaSqFt={areaSqFt} plotAreaGaj={gajVal} />
              )}
              {activeStageView === 'stamp_duty' && (
                <StampDutyCalculator propertyValue={totalEstimatedValue} plotAreaGaj={gajVal} />
              )}
              {activeStageView === 'vastu' && (
                <VastuAnalysisCard facing={facing} onFacingChange={setFacing} plotShape={shape} aspectRatio={f / (d || 1)} />
              )}
              {activeStageView === 'loan' && (
                <LandLoanCalculator totalPrice={totalEstimatedValue} />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
