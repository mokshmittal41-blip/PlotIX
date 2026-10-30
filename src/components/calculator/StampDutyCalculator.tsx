import { useState, useMemo, useEffect } from 'react';
import { 
  User, Users, Info, Sparkles, Check, 
  Printer, ShieldCheck, TrendingDown
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  STATE_STAMP_DUTIES, 
  calculateStampDuty, 
  formatINR, 
  formatINRCompact, 
  type OwnershipType 
} from '../../utils/landValueCalculator';

interface StampDutyCalculatorProps {
  propertyValue?: number;
  plotAreaGaj?: number;
  onNavigateToArea?: () => void;
}

export default function StampDutyCalculator({ 
  propertyValue: initialPropertyValue = 5000000,
  plotAreaGaj,
  onNavigateToArea: _onNavigateToArea
}: StampDutyCalculatorProps) {
  const { language } = useLanguage();
  const { activeLocation } = useApp();

  // Mode: Direct Property Value vs Plot Area × Rate
  const [inputMode, setInputMode] = useState<'value' | 'area'>(plotAreaGaj ? 'area' : 'value');
  const [customValue, setCustomValue] = useState<string>(initialPropertyValue ? String(initialPropertyValue) : '5000000');
  
  // Area-based inputs
  const [areaGaj, setAreaGaj] = useState<string>(plotAreaGaj ? String(Math.round(plotAreaGaj)) : '200');
  const [ratePerGaj, setRatePerGaj] = useState<string>('25000');

  // State selection synced to user's detected location
  const [selectedState, setSelectedState] = useState<string>(() => {
    if (activeLocation?.state) {
      const s = activeLocation.state.toLowerCase();
      if (s.includes('haryana')) return 'haryana';
      if (s.includes('delhi')) return 'delhi';
      if (s.includes('punjab')) return 'punjab';
      if (s.includes('uttar') || s.includes('up')) return 'uttar-pradesh';
      if (s.includes('rajasthan')) return 'rajasthan';
      if (s.includes('maharashtra')) return 'maharashtra';
      if (s.includes('chandigarh')) return 'chandigarh';
    }
    return 'haryana';
  });
  const [ownership, setOwnership] = useState<OwnershipType>('male');

  useEffect(() => {
    if (activeLocation?.state) {
      const s = activeLocation.state.toLowerCase();
      if (s.includes('haryana')) setSelectedState('haryana');
      else if (s.includes('delhi')) setSelectedState('delhi');
      else if (s.includes('punjab')) setSelectedState('punjab');
      else if (s.includes('uttar') || s.includes('up')) setSelectedState('uttar-pradesh');
      else if (s.includes('rajasthan')) setSelectedState('rajasthan');
      else if (s.includes('maharashtra')) setSelectedState('maharashtra');
      else if (s.includes('chandigarh')) setSelectedState('chandigarh');
    }
  }, [activeLocation]);

  // Circle Rate Ratio benchmark (typically 80-85% of market value in major cities)
  const circleRateRatio = 0.85;

  // Compute active property value based on mode
  const activePropertyValue = useMemo(() => {
    if (inputMode === 'area') {
      const gaj = parseFloat(areaGaj) || 0;
      const rate = parseFloat(ratePerGaj) || 0;
      return Math.max(100000, gaj * rate);
    }
    return Math.max(100000, parseFloat(customValue) || 100000);
  }, [inputMode, customValue, areaGaj, ratePerGaj]);

  const circleRateValue = activePropertyValue * circleRateRatio;

  // Calculate duty on Market Value and Circle Rate
  const marketCalc = useMemo(() => {
    return calculateStampDuty(activePropertyValue, selectedState, ownership);
  }, [activePropertyValue, selectedState, ownership]);

  const circleCalc = useMemo(() => {
    return calculateStampDuty(circleRateValue, selectedState, ownership);
  }, [circleRateValue, selectedState, ownership]);

  // Calculate Male vs Female savings
  const maleCalcForSavings = useMemo(() => {
    return calculateStampDuty(activePropertyValue, selectedState, 'male');
  }, [activePropertyValue, selectedState]);

  const femaleCalcForSavings = useMemo(() => {
    return calculateStampDuty(activePropertyValue, selectedState, 'female');
  }, [activePropertyValue, selectedState]);

  const potentialFemaleSavings = Math.max(0, maleCalcForSavings.totalGovtFees - femaleCalcForSavings.totalGovtFees);

  // Quick Value Presets
  const valuePresets = [
    { label: '₹25 L', value: 2500000 },
    { label: '₹50 L', value: 5000000 },
    { label: '₹75 L', value: 7500000 },
    { label: '₹1 Cr', value: 10000000 },
    { label: '₹1.5 Cr', value: 15000000 },
    { label: '₹2.5 Cr', value: 25000000 },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="stamp-duty-light-container">
      
      {/* ─── Top Header Card (Crisp Light Theme) ────────────────────────── */}
      <div className="stamp-duty-hero-card">
        <div className="stamp-duty-hero-content">
          <div className="hero-badge-pill">
            <Sparkles size={14} className="text-emerald" />
            <span>Official 2026-27 Revenue Rates</span>
          </div>

          <h2 className="stamp-duty-title">
            {language === 'pa' 
              ? 'ਸਰਕਾਰੀ ਸਟੈਂਪ ਡਿਊਟੀ ਤੇ ਰਜਿਸਟਰੀ ਖਰਚਾ ਕੈਲਕੁਲੇਟਰ' 
              : (language === 'hi' 
                ? 'सरकारी स्टाम्प ड्यूटी व रजिस्ट्री खर्च कैलकुलेटर' 
                : 'Govt Stamp Duty & Property Registry Calculator')}
          </h2>
          <p className="stamp-duty-desc">
            {language === 'pa' 
              ? 'ਸਾਰੇ ਸੂਬਿਆਂ ਦੇ ਸਰਕਾਰੀ ਰੇਟ, ਮਹਿਲਾ ਛੋਟ, ਤਹਿਸੀਲ ਫੀਸ ਤੇ ਕੁੱਲ ਸਰਕਾਰੀ ਖਰਚੇ ਦਾ ਸਹੀ ਹਿਸਾਬ' 
              : (language === 'hi' 
                ? 'सभी राज्यों के सरकारी रेट, महिला छूट, तहसील फीस व कुल सरकारी खर्चे का सटीक हिसाब' 
                : 'Calculate state-wise conveyance deed stamp duty, registration cess, women concessions & mutation fees')}
          </p>
        </div>

        <div className="stamp-duty-hero-actions">
          <button 
            type="button" 
            className="stamp-print-btn"
            onClick={handlePrint}
            title="Print or Save PDF Receipt"
          >
            <Printer size={15} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* ─── Two-Column Interactive Calculator Layout ──────────────────── */}
      <div className="stamp-calculator-grid">
        
        {/* LEFT COLUMN: Controls & Input Parameters */}
        <div className="stamp-input-panel">
          
          {/* 1. Valuation Input Mode Switch */}
          <div className="stamp-card-box">
            <div className="stamp-section-label">
              <span>Step 1: Property Valuation Method</span>
            </div>

            <div className="stamp-mode-toggle-bar">
              <button
                type="button"
                className={`stamp-toggle-btn ${inputMode === 'value' ? 'active' : ''}`}
                onClick={() => setInputMode('value')}
              >
                <span>Total Property Price (₹)</span>
              </button>
              <button
                type="button"
                className={`stamp-toggle-btn ${inputMode === 'area' ? 'active' : ''}`}
                onClick={() => setInputMode('area')}
              >
                <span>Plot Area × Rate per Gaj</span>
              </button>
            </div>

            {inputMode === 'value' ? (
              <div className="stamp-input-group">
                <label className="input-label-text">
                  Enter Total Property / Plot Market Value (₹):
                </label>
                <div className="price-input-wrapper">
                  <span className="currency-prefix">₹</span>
                  <input
                    type="number"
                    step="50000"
                    min="100000"
                    value={customValue}
                    onChange={e => setCustomValue(e.target.value)}
                    placeholder="50,00,000"
                    className="price-number-input"
                  />
                  <span className="compact-value-hint">
                    {formatINRCompact(activePropertyValue)}
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="presets-chips-row">
                  {valuePresets.map(preset => (
                    <button
                      key={preset.value}
                      type="button"
                      className={`preset-chip ${parseFloat(customValue) === preset.value ? 'selected' : ''}`}
                      onClick={() => setCustomValue(String(preset.value))}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="stamp-area-input-grid">
                <div>
                  <label className="input-label-text">Plot Area (Gaj / Sq.Yards):</label>
                  <div className="price-input-wrapper">
                    <input
                      type="number"
                      step="10"
                      min="10"
                      value={areaGaj}
                      onChange={e => setAreaGaj(e.target.value)}
                      placeholder="200"
                      className="price-number-input"
                    />
                    <span className="unit-suffix-hint">Gaj</span>
                  </div>
                </div>

                <div>
                  <label className="input-label-text">Rate per Gaj (₹):</label>
                  <div className="price-input-wrapper">
                    <span className="currency-prefix">₹</span>
                    <input
                      type="number"
                      step="1000"
                      min="1000"
                      value={ratePerGaj}
                      onChange={e => setRatePerGaj(e.target.value)}
                      placeholder="25,000"
                      className="price-number-input"
                    />
                    <span className="unit-suffix-hint">/Gaj</span>
                  </div>
                </div>

                <div className="area-calculated-total-bar">
                  <span>Calculated Property Value:</span>
                  <strong>{formatINR(activePropertyValue)} ({formatINRCompact(activePropertyValue)})</strong>
                </div>
              </div>
            )}
          </div>

          {/* 2. State & Tehsil Selector */}
          <div className="stamp-card-box">
            <div className="stamp-section-label">
              <span>Step 2: Select State / Union Territory</span>
            </div>

            <div className="state-select-wrapper">
              <select
                value={selectedState}
                onChange={e => setSelectedState(e.target.value)}
                className="state-dropdown-select"
              >
                {Object.entries(STATE_STAMP_DUTIES).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.state} — Male {info.maleRate}% / Female {info.femaleRate}% {info.femaleRate < info.maleRate ? '(Women Concession)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="state-rule-info-box">
              <Info size={15} className="info-icon" />
              <span>{marketCalc.stateInfo.note}</span>
            </div>
          </div>

          {/* 3. Ownership Selection (Male, Female, Joint) */}
          <div className="stamp-card-box">
            <div className="stamp-section-label">
              <span>Step 3: Registry Ownership Category</span>
            </div>

            <div className="ownership-selection-grid">
              {/* Male Option */}
              <button
                type="button"
                className={`ownership-card-btn ${ownership === 'male' ? 'active-male' : ''}`}
                onClick={() => setOwnership('male')}
              >
                <div className="owner-card-top">
                  <div className="owner-icon-circle male">
                    <User size={18} />
                  </div>
                  <span className="owner-rate-tag">{marketCalc.stateInfo.maleRate}%</span>
                </div>
                <div className="owner-card-title">
                  {language === 'pa' ? 'ਪੁਰਸ਼ (ਆਮ)' : (language === 'hi' ? 'पुरुष (सामान्य)' : 'Male (Individual)')}
                </div>
                <div className="owner-card-sub">Standard State Rate</div>
              </button>

              {/* Female Option with Discount Highlight */}
              <button
                type="button"
                className={`ownership-card-btn ${ownership === 'female' ? 'active-female' : ''}`}
                onClick={() => setOwnership('female')}
              >
                <div className="owner-card-top">
                  <div className="owner-icon-circle female">
                    <User size={18} />
                  </div>
                  <span className="owner-rate-tag female">{marketCalc.stateInfo.femaleRate}%</span>
                </div>
                <div className="owner-card-title">
                  {language === 'pa' ? 'ਮਹਿਲਾ (ਛੋਟ)' : (language === 'hi' ? 'महिला (छूट सहित)' : 'Female (Sole Owner)')}
                </div>
                <div className="owner-card-sub">
                  {marketCalc.stateInfo.femaleRate < marketCalc.stateInfo.maleRate 
                    ? `Save ${marketCalc.stateInfo.maleRate - marketCalc.stateInfo.femaleRate}% on Duty!` 
                    : 'Standard Rate'}
                </div>
                {marketCalc.stateInfo.femaleRate < marketCalc.stateInfo.maleRate && (
                  <span className="female-discount-ribbon">Rebate</span>
                )}
              </button>

              {/* Joint Option */}
              <button
                type="button"
                className={`ownership-card-btn ${ownership === 'joint' ? 'active-joint' : ''}`}
                onClick={() => setOwnership('joint')}
              >
                <div className="owner-card-top">
                  <div className="owner-icon-circle joint">
                    <Users size={18} />
                  </div>
                  <span className="owner-rate-tag">{marketCalc.stateInfo.jointRate}%</span>
                </div>
                <div className="owner-card-title">
                  {language === 'pa' ? 'ਸਾਂਝੀ (ਪੁਰਸ਼ + ਮਹਿਲਾ)' : (language === 'hi' ? 'संयुक्त (पति + पत्नी)' : 'Joint (Co-Owners)')}
                </div>
                <div className="owner-card-sub">Co-Ownership Rate</div>
              </button>
            </div>

            {/* Savings Callout Banner if Female Discount Available */}
            {potentialFemaleSavings > 0 && ownership !== 'female' && (
              <div className="female-savings-alert-box">
                <TrendingDown size={18} className="savings-icon" />
                <div>
                  <strong>Tip for Extra Savings:</strong> Registering in a woman's name saves{' '}
                  <span className="savings-amount">{formatINR(potentialFemaleSavings)}</span> in {marketCalc.stateInfo.state}!
                </div>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Results & Comprehensive Registry Breakdown */}
        <div className="stamp-results-panel">
          
          {/* Hero Total Payable Card */}
          <div className="total-payable-hero-card">
            <div className="hero-top-row">
              <div className="badge-tag">
                <Check size={13} />
                <span>Total Govt Payable</span>
              </div>
              <span className="state-name-badge">{marketCalc.stateInfo.state}</span>
            </div>

            <div className="total-amount-display">
              <span className="currency-sign">₹</span>
              <span className="amount-number">{Math.round(marketCalc.totalGovtFees).toLocaleString('en-IN')}</span>
            </div>

            <div className="total-subtext">
              Approx. <strong>{((marketCalc.totalGovtFees / activePropertyValue) * 100).toFixed(2)}%</strong> of total property value ({formatINRCompact(activePropertyValue)})
            </div>

            {/* Visual Segmented Progress Bar */}
            <div className="segmented-cost-bar">
              <div 
                className="segment duty" 
                style={{ width: `${(marketCalc.stampDutyAmount / marketCalc.totalGovtFees) * 100}%` }}
                title={`Stamp Duty: ${formatINR(marketCalc.stampDutyAmount)}`}
              />
              <div 
                className="segment reg" 
                style={{ width: `${(marketCalc.regFeeAmount / marketCalc.totalGovtFees) * 100}%` }}
                title={`Registration Fee: ${formatINR(marketCalc.regFeeAmount)}`}
              />
              {marketCalc.cessAmount > 0 && (
                <div 
                  className="segment cess" 
                  style={{ width: `${(marketCalc.cessAmount / marketCalc.totalGovtFees) * 100}%` }}
                  title={`Cess: ${formatINR(marketCalc.cessAmount)}`}
                />
              )}
            </div>

            <div className="bar-legend-row">
              <span className="legend-item duty">
                <span className="legend-dot" /> Stamp Duty ({marketCalc.stampDutyPercent}%)
              </span>
              <span className="legend-item reg">
                <span className="legend-dot" /> Reg. Fee ({marketCalc.regFeePercent}%)
              </span>
              {marketCalc.cessAmount > 0 && (
                <span className="legend-item cess">
                  <span className="legend-dot" /> Infra Cess ({marketCalc.stateInfo.cessPercent}%)
                </span>
              )}
            </div>
          </div>

          {/* Itemized Fee Breakdown Table */}
          <div className="itemized-fee-card">
            <h4 className="itemized-title">Complete Registry Fee Breakdown</h4>

            <div className="fee-items-list">
              <div className="fee-line-item">
                <div className="fee-item-left">
                  <span className="fee-name">Stamp Duty ({marketCalc.stampDutyPercent}%)</span>
                  <span className="fee-desc">Conveyance Deed Duty on Market Value</span>
                </div>
                <span className="fee-item-amount">{formatINR(marketCalc.stampDutyAmount)}</span>
              </div>

              <div className="fee-line-item">
                <div className="fee-item-left">
                  <span className="fee-name">Registration Charge ({marketCalc.regFeePercent}%)</span>
                  <span className="fee-desc">Sub-Registrar / Tehsil Documentation Fee</span>
                </div>
                <span className="fee-item-amount">{formatINR(marketCalc.regFeeAmount)}</span>
              </div>

              {marketCalc.cessAmount > 0 && (
                <div className="fee-line-item">
                  <div className="fee-item-left">
                    <span className="fee-name">Infrastructure / Social Security Cess ({marketCalc.stateInfo.cessPercent}%)</span>
                    <span className="fee-desc">State Development & Urban Cess</span>
                  </div>
                  <span className="fee-item-amount">{formatINR(marketCalc.cessAmount)}</span>
                </div>
              )}

              <div className="fee-line-item">
                <div className="fee-item-left">
                  <span className="fee-name">Mutation & E-Filing Legal Charges</span>
                  <span className="fee-desc">Intaqal, PLRS / NGDRS Computerization Fee</span>
                </div>
                <span className="fee-item-amount">{formatINR(marketCalc.mutationFee)}</span>
              </div>

              <div className="fee-total-highlight-row">
                <span className="total-label">Grand Total Govt Registry Fees:</span>
                <span className="total-val">{formatINR(marketCalc.totalGovtFees)}</span>
              </div>
            </div>
          </div>

          {/* Market Value vs Circle Rate Registry Comparison */}
          <div className="circle-rate-comparison-card">
            <h4 className="comparison-title">Market Value vs Collector Circle Rate</h4>
            
            <div className="comparison-cols-grid">
              <div className="comparison-col market">
                <div className="col-header">
                  <span className="col-type">Market Price Registry</span>
                  <span className="col-badge">Recommended</span>
                </div>
                <div className="col-price">{formatINRCompact(activePropertyValue)}</div>
                <div className="col-duty-val">{formatINR(marketCalc.totalGovtFees)}</div>
                <span className="col-note">Standard transparent registry based on agreed sale consideration</span>
              </div>

              <div className="comparison-col circle">
                <div className="col-header">
                  <span className="col-type">Min Circle Rate Base</span>
                  <span className="col-sub">≈85% Baseline</span>
                </div>
                <div className="col-price">{formatINRCompact(circleRateValue)}</div>
                <div className="col-duty-val">{formatINR(circleCalc.totalGovtFees)}</div>
                <span className="col-note">Minimum legally allowable registry value set by District Collector</span>
              </div>
            </div>
          </div>

          {/* Required Documents Checklist */}
          <div className="registry-docs-checklist-card">
            <div className="docs-header">
              <ShieldCheck size={18} className="text-emerald" />
              <h4>Essential Documents for Tehsil Registry</h4>
            </div>

            <div className="docs-grid">
              <div className="doc-item">
                <CheckCircle2 size={14} className="doc-check" />
                <span>Original Title Deed / Fard Jamabandi</span>
              </div>
              <div className="doc-item">
                <CheckCircle2 size={14} className="doc-check" />
                <span>Buyer & Seller Aadhaar & PAN Card</span>
              </div>
              <div className="doc-item">
                <CheckCircle2 size={14} className="doc-check" />
                <span>E-Stamping Certificate & Challan Receipt</span>
              </div>
              <div className="doc-item">
                <CheckCircle2 size={14} className="doc-check" />
                <span>2 Local Witnesses with Govt ID Proofs</span>
              </div>
              <div className="doc-item">
                <CheckCircle2 size={14} className="doc-check" />
                <span>NOC from Municipal Authority / PUDA / GMADA</span>
              </div>
              <div className="doc-item">
                <CheckCircle2 size={14} className="doc-check" />
                <span>Passbook / Cheque Copy for TDS & Payment Proof</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg 
      width={props.size || 16} 
      height={props.size || 16} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
      style={{ color: '#10b981' }}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
