import { useState, useMemo, useEffect } from 'react';
import { ShieldCheck, Landmark } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { calculatePlotLoan, formatINR, formatINRCompact } from '../../utils/landValueCalculator';

interface LandLoanCalculatorProps {
  totalPrice?: number;
  onPriceChange?: (newPrice: number) => void;
}

export default function LandLoanCalculator({ totalPrice = 4500000, onPriceChange }: LandLoanCalculatorProps) {
  const { language } = useLanguage();
  const [loanType, setLoanType] = useState<'plot' | 'composite'>('plot');
  const [propertyPrice, setPropertyPrice] = useState<number>(totalPrice || 4500000);
  const [downPaymentPct, setDownPaymentPct] = useState(25);
  const [interestRate, setInterestRate] = useState(8.65);
  const [tenureYears, setTenureYears] = useState(20);

  useEffect(() => {
    if (totalPrice && totalPrice > 0) {
      setPropertyPrice(totalPrice);
    }
  }, [totalPrice]);

  const handlePriceChange = (val: number) => {
    setPropertyPrice(val);
    if (onPriceChange) onPriceChange(val);
  };

  // If composite (plot + construction), add estimated construction multiplier
  const effectivePrice = loanType === 'composite' ? propertyPrice * 1.8 : propertyPrice;

  const loan = useMemo(() => {
    return calculatePlotLoan(effectivePrice, downPaymentPct, interestRate, tenureYears);
  }, [effectivePrice, downPaymentPct, interestRate, tenureYears]);

  const principalPct = Math.round((loan.principal / (loan.totalPayment || 1)) * 100);
  const interestPct = 100 - principalPct;

  const COMMON_AMOUNTS = [
    { label: '₹25 Lakh', value: 2500000 },
    { label: '₹45 Lakh', value: 4500000 },
    { label: '₹75 Lakh', value: 7500000 },
    { label: '₹1 Crore', value: 10000000 },
    { label: '₹1.5 Crore', value: 15000000 },
  ];

  return (
    <div className="lc-loan-card">
      <div className="lc-loan-header">
        <div className="lc-far-title-wrap">
          <div className="lc-tab-icon-badge">
            <Landmark size={22} />
          </div>
          <div>
            <h3>
              {language === 'pa' 
                ? 'ਬੈਂਕ ਲੋਨ ਤੇ ਮਾਸਿਕ ਕਿਸ਼ਤ (EMI) ਕੈਲਕੁਲੇਟਰ' 
                : (language === 'hi' 
                  ? 'बैंक लोन एवं मासिक किस्त (EMI) कैलकुलेटर' 
                  : 'Bank Loan & EMI Calculator')}
            </h3>
            <p>
              {language === 'pa' 
                ? 'ਪਲਾਟ ਖਰੀਦ ਅਤੇ ਮਕਾਨ ਉਸਾਰੀ ਲੋਨ ਲਈ EMI, ਡਾਊਨ ਪੇਮੈਂਟ ਤੇ ਵਿਆਜ ਅੰਦਾਜ਼ਾ' 
                : (language === 'hi' 
                  ? 'प्लाट खरीद एवं मकान निर्माण लोन हेतु EMI, डाउन पेमेंट व ब्याज अनुमान' 
                  : 'Calculate monthly EMI, down payment, interest split and bank eligibility')}
            </p>
          </div>
        </div>

        {/* Loan Type Selector */}
        <div className="lc-loan-type-toggle">
          <button
            type="button"
            className={`lc-loan-type-btn ${loanType === 'plot' ? 'active' : ''}`}
            onClick={() => setLoanType('plot')}
          >
            {language === 'pa' ? 'ਪਲਾਟ ਖਰੀਦ ਲੋਨ' : (language === 'hi' ? 'प्लाट खरीद लोन' : 'Plot Purchase Loan')}
          </button>
          <button
            type="button"
            className={`lc-loan-type-btn ${loanType === 'composite' ? 'active' : ''}`}
            onClick={() => setLoanType('composite')}
          >
            {language === 'pa' ? 'ਪਲਾਟ + ਉਸਾਰੀ ਕੰਪੋਜ਼ਿਟ ਲੋਨ' : (language === 'hi' ? 'प्लाट + निर्माण कम्पोजिट लोन' : 'Composite (Land + Build)')}
          </button>
        </div>
      </div>

      {/* Property Price Input Row */}
      <div style={{
        padding: '16px 20px',
        background: 'var(--color-surface-2)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
            {language === 'pa' ? 'ਪਲਾਟ / ਪ੍ਰਾਪਰਟੀ ਦੀ ਕੁੱਲ ਕੀਮਤ (₹)' : (language === 'hi' ? 'प्लाट / प्रॉपर्टी की कुल कीमत (₹)' : 'Property / Land Valuation (₹)')}
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '12px', fontSize: '16px', fontWeight: 900, color: 'var(--color-text-muted)' }}>₹</span>
            <input
              type="number"
              step="50000"
              value={propertyPrice}
              onChange={e => handlePriceChange(Math.max(100000, parseFloat(e.target.value) || 0))}
              style={{
                width: '100%',
                padding: '10px 12px 10px 30px',
                borderRadius: 'var(--radius-lg)',
                border: '2px solid var(--color-border)',
                background: 'var(--color-surface)',
                fontSize: '18px',
                fontWeight: 900,
                color: 'var(--color-text)',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Quick Amount Tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', fontWeight: 700 }}>
            {language === 'pa' ? 'ਤੁਰੰਤ ਚੁਣੋ:' : (language === 'hi' ? 'त्वरित चुनें:' : 'Quick Select:')}
          </span>
          {COMMON_AMOUNTS.map(amt => (
            <button
              key={amt.value}
              type="button"
              onClick={() => handlePriceChange(amt.value)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                border: propertyPrice === amt.value ? '2px solid #2563eb' : '1px solid var(--color-border)',
                background: propertyPrice === amt.value ? 'rgba(37, 99, 235, 0.12)' : 'var(--color-surface)',
                color: propertyPrice === amt.value ? '#2563eb' : 'var(--color-text)',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {amt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="lc-loan-grid">
        {/* Controls Column */}
        <div className="lc-loan-controls">
          {/* Down Payment */}
          <div className="lc-control-item">
            <div className="lc-control-label-row">
              <label>
                {language === 'pa' ? 'ਡਾਊਨ ਪੇਮੈਂਟ (ਆਪਣੀ ਜਮ੍ਹਾਂ ਪੂੰਜੀ)' : (language === 'hi' ? 'डाउन पेमेंट (खुद का पैसा)' : 'Down Payment')} ({downPaymentPct}%)
              </label>
              <span className="lc-val-badge text-accent">{formatINRCompact(loan.downPaymentAmount)}</span>
            </div>
            <input
              type="range"
              min="15"
              max="50"
              step="5"
              value={downPaymentPct}
              onChange={e => setDownPaymentPct(parseInt(e.target.value))}
              className="lc-slider"
            />
            <div className="lc-slider-ticks">
              <span>15% (Min)</span>
              <span>25% (Standard)</span>
              <span>50% (High)</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div className="lc-control-item">
            <div className="lc-control-label-row">
              <label>
                {language === 'pa' ? 'ਸਾਲਾਨਾ ਬੈਂਕ ਵਿਆਜ ਦਰ' : (language === 'hi' ? 'वार्षिक बैंक ब्याज दर' : 'Annual Interest Rate (p.a.)')}
              </label>
              <span className="lc-val-badge">{interestRate.toFixed(2)}%</span>
            </div>
            <input
              type="range"
              min="7.5"
              max="12.0"
              step="0.1"
              value={interestRate}
              onChange={e => setInterestRate(parseFloat(e.target.value))}
              className="lc-slider"
            />
            <div className="lc-slider-ticks">
              <span>7.5% (SBI/HDFC)</span>
              <span>8.75% (Avg)</span>
              <span>12.0% (NBFC)</span>
            </div>
          </div>

          {/* Loan Tenure */}
          <div className="lc-control-item">
            <div className="lc-control-label-row">
              <label>
                {language === 'pa' ? 'ਲੋਨ ਦੀ ਮਿਆਦ (ਸਾਲਾਂ ਵਿੱਚ)' : (language === 'hi' ? 'लोन अवधि (वर्षों में)' : 'Loan Tenure (Duration)')}
              </label>
              <span className="lc-val-badge">{tenureYears} {language === 'pa' ? 'ਸਾਲ' : (language === 'hi' ? 'वर्ष' : 'Years')}</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={tenureYears}
              onChange={e => setTenureYears(parseInt(e.target.value))}
              className="lc-slider"
            />
            <div className="lc-slider-ticks">
              <span>5 Yrs</span>
              <span>15 Yrs</span>
              <span>20 Yrs</span>
              <span>30 Yrs</span>
            </div>
          </div>
        </div>

        {/* EMI Results Card */}
        <div className="lc-loan-results">
          <div className="lc-emi-hero-card">
            <span className="lc-emi-label">
              {language === 'pa' ? 'ਮਹੀਨਾਵਾਰ ਬੈਂਕ ਕਿਸ਼ਤ (EMI)' : (language === 'hi' ? 'मासिक बैंक किस्त (Monthly EMI)' : 'Monthly EMI Payable')}
            </span>
            <div className="lc-emi-value">{formatINR(loan.monthlyEmi)} <small>/ month</small></div>
            <div className="lc-emi-tenure">
              {language === 'pa' ? `${tenureYears} ਸਾਲਾਂ ਲਈ (${tenureYears * 12} ਮਹੀਨਾਵਾਰ ਕਿਸ਼ਤਾਂ)` : (language === 'hi' ? `${tenureYears} वर्षों के लिए (${tenureYears * 12} मासिक किश्तें)` : `For ${tenureYears} Years (${tenureYears * 12} Monthly Installments)`)}
            </div>
          </div>

          <div className="lc-loan-metrics-row">
            <div className="lc-loan-metric">
              <span>{language === 'pa' ? 'ਬੈਂਕ ਕਰਜ਼ਾ ਰਕਮ' : (language === 'hi' ? 'बैंक लोन मूलधन' : 'Loan Principal (Bank)')}</span>
              <strong>{formatINR(loan.principal)}</strong>
              <small>({formatINRCompact(loan.principal)})</small>
            </div>

            <div className="lc-loan-metric">
              <span>{language === 'pa' ? 'ਕੁੱਲ ਵਿਆਜ' : (language === 'hi' ? 'कुल ब्याज' : 'Total Interest')}</span>
              <strong className="text-warning">{formatINR(loan.totalInterest)}</strong>
              <small>({formatINRCompact(loan.totalInterest)})</small>
            </div>

            <div className="lc-loan-metric">
              <span>{language === 'pa' ? 'ਕੁੱਲ ਵਾਪਸੀ ਭੁਗਤਾਨ' : (language === 'hi' ? 'कुल भुगतान (मूल + ब्याज)' : 'Total Repayment')}</span>
              <strong>{formatINR(loan.totalPayment)}</strong>
              <small>({formatINRCompact(loan.totalPayment)})</small>
            </div>
          </div>

          {/* Principle vs Interest progress bar */}
          <div className="lc-loan-share-bar">
            <div className="lc-share-progress">
              <div className="lc-share-seg principal" style={{ width: `${principalPct}%` }} title={`Principal ${principalPct}%`} />
              <div className="lc-share-seg interest" style={{ width: `${interestPct}%` }} title={`Interest ${interestPct}%`} />
            </div>
            <div className="lc-share-legend">
              <span className="dot principal" /> {language === 'pa' ? 'ਮੂਲ ਰਕਮ' : (language === 'hi' ? 'मूलधन' : 'Principal')} ({principalPct}%)
              <span className="dot interest ml-3" /> {language === 'pa' ? 'ਵਿਆਜ' : (language === 'hi' ? 'ब्याज' : 'Interest')} ({interestPct}%)
            </div>
          </div>

          <div className="lc-loan-tip">
            <ShieldCheck size={16} />
            <span>
              {language === 'pa' 
                ? 'ਸਰਕਾਰੀ ਤਨਖਾਹਦਾਰ ਅਤੇ ਵਪਾਰੀ ਦੋਵਾਂ ਲਈ 80% ਤੱਕ ਬੈਂਕ ਵਿੱਤ ਉਪਲਬਧ ਹੈ।' 
                : (language === 'hi' 
                  ? 'प्लॉट की सरकारी रजिस्ट्री मूल्य का 75–80% तक बैंक लोन स्वीकृत होता है।' 
                  : 'Eligible for 75–80% LTV bank financing on registry values.')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
