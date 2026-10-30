import { useState, useMemo } from 'react';
import { Building2, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  CONSTRUCTION_TIERS, 
  calculateFARAndCost, 
  formatINR, 
  formatINRCompact 
} from '../../utils/landValueCalculator';

interface FARConstructionCalculatorProps {
  plotAreaSqFt: number;
  plotAreaGaj: number;
}

export default function FARConstructionCalculator({
  plotAreaSqFt,
  plotAreaGaj,
}: FARConstructionCalculatorProps) {
  const { language } = useLanguage();
  const [far, setFar] = useState(2.0);
  const [groundCoveragePct, setGroundCoveragePct] = useState(70);
  const [tierId, setTierId] = useState('premium');
  const [floors, setFloors] = useState(3);

  const calc = useMemo(() => {
    return calculateFARAndCost(plotAreaSqFt, far, groundCoveragePct, tierId, floors);
  }, [plotAreaSqFt, far, groundCoveragePct, tierId, floors]);

  const selectedTier = calc.tier;

  return (
    <div className="lc-far-card">
      <div className="lc-far-header">
        <div className="lc-far-title-wrap">
          <div className="lc-tab-icon-badge">
            <Building2 size={20} />
          </div>
          <div>
            <h3>
              {language === 'pa' 
                ? 'ਪੁੱਡਾ/ਗਮਾਡਾ FAR ਅਤੇ ਉਸਾਰੀ ਖਰਚਾ ਅੰਦਾਜ਼ਾ' 
                : (language === 'hi' 
                  ? 'PUDA FAR, मंजिलें व मकान निर्माण लागत' 
                  : 'FAR & Permissible Construction Estimator')}
            </h3>
            <p>
              {language === 'pa' 
                ? 'ਸਰਕਾਰੀ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਕਵਰਡ ਏਰੀਆ, ਮੰਜ਼ਿਲਾਂ ਅਤੇ ਮਟੀਰੀਅਲ ਖਰਚਾ ਜਾਣੋ' 
                : (language === 'hi' 
                  ? 'सरकारी नियमों के अनुसार कवर एरिया, मंजिलों की संख्या व कुल निर्माण बजट जानें' 
                  : 'Calculate permissible built-up footprint, floors, and construction cost')}
            </p>
          </div>
        </div>
        <div className="lc-far-pill">
          <span>{language === 'pa' ? 'ਪਲਾਟ ਰਕਬਾ:' : (language === 'hi' ? 'प्लाट क्षेत्रफल:' : 'Base Area:')}</span>{' '}
          <strong>{Math.round(plotAreaGaj)} Gaj ({Math.round(plotAreaSqFt).toLocaleString()} sq.ft)</strong>
        </div>
      </div>

      <div className="lc-far-grid">
        {/* Controls Column */}
        <div className="lc-far-controls">
          {/* FAR Slider */}
          <div className="lc-control-item">
            <div className="lc-control-label-row">
              <label>Floor Area Ratio (FAR / एफ.ए.आर)</label>
              <span className="lc-val-badge">{far.toFixed(2)}x</span>
            </div>
            <input 
              type="range" 
              min="1.0" 
              max="3.5" 
              step="0.25" 
              value={far} 
              onChange={e => setFar(parseFloat(e.target.value))}
              className="lc-slider"
            />
            <div className="lc-slider-ticks">
              <span>1.0 (Low-Rise)</span>
              <span>2.0 (Standard)</span>
              <span>3.0 (High FAR)</span>
            </div>
          </div>

          {/* Ground Coverage Slider */}
          <div className="lc-control-item">
            <div className="lc-control-label-row">
              <label>
                {language === 'pa' ? 'ਜ਼ਮੀਨ ਉੱਤੇ ਕਵਰਡ ਏਰੀਆ (%)' : (language === 'hi' ? 'जमीन पर कवर एरिया (%)' : 'Max Ground Coverage')}
              </label>
              <span className="lc-val-badge">{groundCoveragePct}%</span>
            </div>
            <input 
              type="range" 
              min="40" 
              max="85" 
              step="5" 
              value={groundCoveragePct} 
              onChange={e => setGroundCoveragePct(parseInt(e.target.value))}
              className="lc-slider"
            />
            <div className="lc-slider-ticks">
              <span>40% (Lawn)</span>
              <span>70% (Standard)</span>
              <span>85% (Max)</span>
            </div>
          </div>

          {/* Number of Floors */}
          <div className="lc-control-item">
            <label>
              {language === 'pa' ? 'ਕੁੱਲ ਮੰਜ਼ਿਲਾਂ (Floors)' : (language === 'hi' ? 'मंजिलों की संख्या (Floors)' : 'Proposed Structure Height')}
            </label>
            <div className="lc-floors-toggle">
              {[
                { val: 2, label: language === 'pa' ? 'G + 1 (2 ਮੰਜ਼ਿਲਾਂ)' : (language === 'hi' ? 'G + 1 (2 मंजिल)' : 'G + 1 (2 Floors)') },
                { val: 3, label: language === 'pa' ? 'ਸਟਿਲਟ + 3 ਮੰਜ਼ਿਲਾਂ' : (language === 'hi' ? 'स्टिल्ट + 3 मंजिल' : 'G + 2 / Stilt+3') },
                { val: 4, label: language === 'pa' ? 'ਸਟਿਲਟ + 4 ਮੰਜ਼ਿਲਾਂ' : (language === 'hi' ? 'स्टिल्ट + 4 मंजिल' : 'Stilt + 4 Floors') },
                { val: 5, label: language === 'pa' ? 'G + 4 ਕਮਰਸ਼ੀਅਲ' : (language === 'hi' ? 'G + 4 कमर्शियल' : 'G + 4 Commercial') },
              ].map(f => (
                <button
                  key={f.val}
                  type="button"
                  className={`lc-floor-btn ${floors === f.val ? 'active' : ''}`}
                  onClick={() => setFloors(f.val)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Construction Quality Tier */}
          <div className="lc-control-item">
            <label>
              {language === 'pa' ? 'ਉਸਾਰੀ ਮਟੀਰੀਅਲ ਕੁਆਲਿਟੀ' : (language === 'hi' ? 'निर्माण फिनिशिंग व क्वालिटी' : 'Construction Finishing Tier')}
            </label>
            <div className="lc-tier-selector">
              {CONSTRUCTION_TIERS.map(t => (
                <div 
                  key={t.id}
                  className={`lc-tier-card ${tierId === t.id ? 'active' : ''}`}
                  onClick={() => setTierId(t.id)}
                >
                  <div className="lc-tier-card-header">
                    <strong>{t.name}</strong>
                    <span className="lc-tier-rate">₹{t.ratePerSqFt}/sqft</span>
                  </div>
                  <p>{t.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Output & Breakdown Column */}
        <div className="lc-far-results">
          {/* Key Metrics Grid */}
          <div className="lc-metric-row">
            <div className="lc-metric-box">
              <span className="lc-metric-label">
                {language === 'pa' ? 'ਹੇਠਲੀ ਮੰਜ਼ਿਲ ਕਵਰੇਜ' : (language === 'hi' ? 'ग्राउंड फ्लोर फुटप्रिंट' : 'Max Ground Footprint')}
              </span>
              <div className="lc-metric-val">{Math.round(calc.maxGroundCoverageSqFt).toLocaleString()} <small>sq.ft</small></div>
              <span className="lc-metric-sub">{Math.round(calc.maxGroundCoverageSqFt / 9)} Gaj coverage</span>
            </div>

            <div className="lc-metric-box primary">
              <span className="lc-metric-label">
                {language === 'pa' ? 'ਕੁੱਲ ਬਣਨ ਵਾਲਾ ਏਰੀਆ' : (language === 'hi' ? 'कुल निर्माण क्षेत्रफल' : 'Permissible Built-Up Area')}
              </span>
              <div className="lc-metric-val text-primary">{Math.round(calc.permissibleBuiltUpSqFt).toLocaleString()} <small>sq.ft</small></div>
              <span className="lc-metric-sub">Across {floors} storeys</span>
            </div>

            <div className="lc-metric-box">
              <span className="lc-metric-label">
                {language === 'pa' ? 'ਖੁੱਲ੍ਹਾ ਲਾਅਨ / ਪਾਰਕਿੰਗ' : (language === 'hi' ? 'खुला लॉन / ग्रीनरी' : 'Mandatory Open / Lawn')}
              </span>
              <div className="lc-metric-val text-success">{Math.round(calc.openSpaceSqFt).toLocaleString()} <small>sq.ft</small></div>
              <span className="lc-metric-sub">{(100 - groundCoveragePct)}% open green</span>
            </div>
          </div>

          {/* Total Construction Budget Card */}
          <div className="lc-construction-budget-card">
            <div className="lc-budget-header">
              <div>
                <span className="lc-budget-label">
                  {language === 'pa' ? 'ਕੁੱਲ ਅਨੁਮਾਨਿਤ ਉਸਾਰੀ ਖਰਚਾ' : (language === 'hi' ? 'कुल अनुमानित मकान निर्माण लागत' : 'Estimated Construction Cost')}
                </span>
                <div className="lc-budget-value">{formatINR(calc.estimatedConstructionCost)}</div>
                <div className="lc-budget-compact">{formatINRCompact(calc.estimatedConstructionCost)} total budget</div>
              </div>
              <div className="lc-budget-tier-tag">
                <Sparkles size={16} />
                <span>{selectedTier.name}</span>
              </div>
            </div>

            {/* Material & Labor Breakdown Progress Bars */}
            <div className="lc-materials-section">
              <span className="lc-materials-title">
                {language === 'pa' ? 'ਮਟੀਰੀਅਲ ਤੇ ਲੇਬਰ ਖਰਚਾ ਵੰਡ:' : (language === 'hi' ? 'सामग्री व लेबर लागत का ब्यौरा:' : 'Estimated Cost Breakdown:')}
              </span>
              <div className="lc-material-bar-wrapper">
                <div className="lc-bar-segment steel" style={{ width: `${selectedTier.materials.steelPct}%` }} title={`Steel (TMT) ${selectedTier.materials.steelPct}%`} />
                <div className="lc-bar-segment cement" style={{ width: `${selectedTier.materials.cementPct}%` }} title={`Cement ${selectedTier.materials.cementPct}%`} />
                <div className="lc-bar-segment brick" style={{ width: `${selectedTier.materials.brickSandPct}%` }} title={`Brick & Aggregates ${selectedTier.materials.brickSandPct}%`} />
                <div className="lc-bar-segment finishing" style={{ width: `${selectedTier.materials.finishingPct}%` }} title={`Finishing & Plumbing ${selectedTier.materials.finishingPct}%`} />
                <div className="lc-bar-segment labor" style={{ width: `${selectedTier.materials.laborPct}%` }} title={`Labor & Contractor ${selectedTier.materials.laborPct}%`} />
              </div>

              <div className="lc-material-legend">
                <div className="lc-legend-item"><span className="dot steel" /> Steel ({selectedTier.materials.steelPct}%)</div>
                <div className="lc-legend-item"><span className="dot cement" /> Cement ({selectedTier.materials.cementPct}%)</div>
                <div className="lc-legend-item"><span className="dot brick" /> Masonry ({selectedTier.materials.brickSandPct}%)</div>
                <div className="lc-legend-item"><span className="dot finishing" /> Finishing ({selectedTier.materials.finishingPct}%)</div>
                <div className="lc-legend-item"><span className="dot labor" /> Labor ({selectedTier.materials.laborPct}%)</div>
              </div>
            </div>

            <div className="lc-far-tip">
              <ShieldCheck size={16} />
              <span>
                {language === 'pa' 
                  ? 'ਇਸ ਵਿੱਚ RCC ਢਾਂਚਾ, ਬਿਜਲੀ ਫਿਟਿੰਗ, ਪਲੰਬਿੰਗ, ਪਲਾਸਟਰ ਅਤੇ ਟਾਈਲਾਂ ਸ਼ਾਮਲ ਹਨ।' 
                  : (language === 'hi' 
                    ? 'इसमें RCC ढांचा, बिजली फिटिंग, प्लंबिंग, प्लास्टर और टाइल्स का खर्च शामिल है।' 
                    : 'Includes structure RCC, MEP electrical conduits, CP fittings, wall plastering, and floor tiling.')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
