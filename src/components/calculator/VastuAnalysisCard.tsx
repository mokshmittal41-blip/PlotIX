import { Compass, CheckCircle2, AlertTriangle, Home, Flame, Droplets, Sun, Moon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { type DirectionFacing, VASTU_DATA } from '../../utils/landConversions';

interface VastuAnalysisCardProps {
  facing: DirectionFacing;
  onFacingChange: (facing: DirectionFacing) => void;
  plotShape: string;
  aspectRatio: number;
}

export default function VastuAnalysisCard({
  facing,
  onFacingChange,
  plotShape,
  aspectRatio,
}: VastuAnalysisCardProps) {
  const { language } = useLanguage();
  const currentVastu = VASTU_DATA[facing];

  // Plot shape vastu rating
  const isOptimalRatio = aspectRatio >= 0.4 && aspectRatio <= 2.5;
  const isSquareOrRect = plotShape === 'rectangular' && isOptimalRatio;

  const DIR_LABELS: Record<DirectionFacing, { hi: string; pa: string }> = {
    'North': { hi: 'उत्तर (North)', pa: 'ਉੱਤਰ (North)' },
    'North-East': { hi: 'ईशान कोण (North-East)', pa: 'ਈਸ਼ਾਨ ਕੋਣ (North-East)' },
    'East': { hi: 'पूर्व (East)', pa: 'ਪੂਰਬ (East)' },
    'South-East': { hi: 'आग्नेय कोण (South-East)', pa: 'ਅਗਨੀ ਕੋਣ (South-East)' },
    'South': { hi: 'दक्षिण (South)', pa: 'ਦੱਖਣ (South)' },
    'South-West': { hi: 'नैऋत्य कोण (South-West)', pa: 'ਨੈਰਿਤ ਕੋਣ (South-West)' },
    'West': { hi: 'पश्चिम (West)', pa: 'ਪੱਛਮ (West)' },
    'North-West': { hi: 'वायव्य कोण (North-West)', pa: 'ਵਾਇਵ ਕੋਣ (North-West)' },
  };

  return (
    <div className="lc-vastu-card">
      <div className="lc-vastu-header">
        <div className="lc-far-title-wrap">
          <div className="lc-tab-icon-badge" style={{ background: `${currentVastu.color}20`, color: currentVastu.color }}>
            <Compass size={20} />
          </div>
          <div>
            <h3>
              {language === 'pa' 
                ? 'ਵਾਸਤੂ ਸ਼ਾਸਤਰ ਤੇ ਦਿਸ਼ਾ ਊਰਜਾ ਜਾਂਚ' 
                : (language === 'hi' 
                  ? 'वास्तु शास्त्र व दिशा ऊर्जा विश्लेषण' 
                  : 'Vastu Shastra & Directional Energy Analysis')}
            </h3>
            <p>
              {language === 'pa' 
                ? 'ਮੁੱਖ ਗੇਟ, ਮੰਦਰ, ਰਸੋਈ ਅਤੇ ਬੈੱਡਰੂਮ ਲਈ ਸ਼ੁੱਭ ਵਾਸਤੂ ਨਿਯਮ' 
                : (language === 'hi' 
                  ? 'मुख्य द्वार, मंदिर, रसोई और मास्टर बेडरूम के लिए शुभ वास्तु मार्गदर्शन' 
                  : 'Traditional Vedic architectural compliance, planetary alignment and spatial zoning')}
            </p>
          </div>
        </div>

        {/* Direction Switcher Pills */}
        <div className="lc-direction-pills">
          {(Object.keys(VASTU_DATA) as DirectionFacing[]).map(d => {
            const data = VASTU_DATA[d];
            const isActive = facing === d;
            const dirText = language === 'pa' ? DIR_LABELS[d].pa : (language === 'hi' ? DIR_LABELS[d].hi : d);
            return (
              <button
                key={d}
                type="button"
                className={`lc-dir-pill ${isActive ? 'active' : ''}`}
                style={isActive ? { borderColor: data.color, color: data.color } : {}}
                onClick={() => onFacingChange(d)}
              >
                {dirText}
              </button>
            );
          })}
        </div>
      </div>

      <div className="lc-vastu-body-grid">
        {/* Left: Score & Core Alignment */}
        <div className="lc-vastu-summary-box">
          <div className="lc-vastu-score-circle" style={{ borderColor: currentVastu.color }}>
            <span className="lc-vastu-score-number" style={{ color: currentVastu.color }}>
              {currentVastu.score}
            </span>
            <span className="lc-vastu-score-label">
              {language === 'pa' ? 'ਵਾਸਤੂ ਸਕੋਰ' : (language === 'hi' ? 'वास्तु स्कोर' : 'Vastu Score')}
            </span>
          </div>

          <div className="lc-vastu-meta">
            <h4 style={{ color: currentVastu.color }}>
              {language === 'pa' ? `${DIR_LABELS[facing].pa} ਮੁਖੀ ਪਲਾਟ` : (language === 'hi' ? `${DIR_LABELS[facing].hi} मुखी प्लाट` : `${facing} Facing Plot`)}
            </h4>
            <span className="lc-auspicious-tag" style={{ background: `${currentVastu.color}15`, color: currentVastu.color }}>
              {currentVastu.auspiciousness}
            </span>
            <p className="lc-vastu-tagline">{currentVastu.title}</p>
          </div>

          <div className="lc-vedic-props">
            <div className="lc-vedic-prop">
              <span>{language === 'pa' ? 'ਮੁੱਖ ਦੇਵਤਾ:' : (language === 'hi' ? 'प्रधान देवता:' : 'Governing Deity:')}</span>
              <strong>{currentVastu.deity}</strong>
            </div>
            <div className="lc-vedic-prop">
              <span>{language === 'pa' ? 'ਗ੍ਰਹਿ:' : (language === 'hi' ? 'स्वामी ग्रह:' : 'Ruling Planet:')}</span>
              <strong>{currentVastu.governingPlanet}</strong>
            </div>
            <div className="lc-vedic-prop">
              <span>{language === 'pa' ? 'ਤੱਤ:' : (language === 'hi' ? 'मूल तत्व:' : 'Primary Element:')}</span>
              <strong>{currentVastu.element}</strong>
            </div>
          </div>
        </div>

        {/* Right: Room Zoning & Architectural Recommendations */}
        <div className="lc-vastu-guidelines">
          <h4>{language === 'pa' ? 'ਕਮਰਿਆਂ ਤੇ ਦਰਵਾਜ਼ਿਆਂ ਦੀ ਵਾਸਤੂ ਯੋਜਨਾ:' : (language === 'hi' ? 'कमरों व दरवाजों की वास्तु योजना:' : 'Vedic Architectural Zoning Plan:')}</h4>
          
          <div className="lc-zoning-grid">
            <div className="lc-zone-item">
              <div className="lc-zone-icon main-gate"><Home size={18} /></div>
              <div className="lc-zone-content">
                <strong>{language === 'pa' ? 'ਮੁੱਖ ਗੇਟ / ਪ੍ਰਵੇਸ਼ ਦੁਆਰ' : (language === 'hi' ? 'मुख्य द्वार (Entrance)' : 'Main Entrance / Gate')}</strong>
                <p>{currentVastu.tips.mainGate}</p>
              </div>
            </div>

            <div className="lc-zone-item">
              <div className="lc-zone-icon pooja"><Sun size={18} /></div>
              <div className="lc-zone-content">
                <strong>{language === 'pa' ? 'ਪੂਜਾ ਘਰ / ਮੰਦਰ (ਈਸ਼ਾਨ)' : (language === 'hi' ? 'मंदिर / पूजा घर (ईशान कोण)' : 'Mandir / Pooja Room (Ishanya)')}</strong>
                <p>{currentVastu.tips.poojaRoom}</p>
              </div>
            </div>

            <div className="lc-zone-item">
              <div className="lc-zone-icon kitchen"><Flame size={18} /></div>
              <div className="lc-zone-content">
                <strong>{language === 'pa' ? 'ਰਸੋਈ ਘਰ (ਅਗਨੀ ਕੋਣ)' : (language === 'hi' ? 'रसोई घर (आग्नेय कोण)' : 'Kitchen / Hearth (Agneya)')}</strong>
                <p>{currentVastu.tips.kitchen}</p>
              </div>
            </div>

            <div className="lc-zone-item">
              <div className="lc-zone-icon bedroom"><Moon size={18} /></div>
              <div className="lc-zone-content">
                <strong>{language === 'pa' ? 'ਮਾਸਟਰ ਬੈੱਡਰੂਮ (ਨੈਰਿਤ)' : (language === 'hi' ? 'मास्टर बेडरूम (नैऋत्य कोण)' : 'Master Bedroom Suite (Nairutya)')}</strong>
                <p>{currentVastu.tips.masterBedroom}</p>
              </div>
            </div>

            <div className="lc-zone-item">
              <div className="lc-zone-icon water"><Droplets size={18} /></div>
              <div className="lc-zone-content">
                <strong>{language === 'pa' ? 'ਬੋਰਵੈੱਲ ਤੇ ਪਾਣੀ ਦੀ ਟੈਂਕੀ' : (language === 'hi' ? 'बोरवेल व पानी की टंकी' : 'Borewell & Water Reservoirs')}</strong>
                <p>{currentVastu.tips.waterTank}</p>
              </div>
            </div>
          </div>

          {/* Plot Shape Compliance */}
          <div className="lc-shape-vastu-alert">
            {isSquareOrRect ? (
              <div className="lc-vastu-alert-box success">
                <CheckCircle2 size={18} />
                <span>
                  {language === 'pa' 
                    ? 'ਸੰਪੂਰਨ ਆਇਤਾਕਾਰ ਪਲਾਟ — ਊਰਜਾ ਦਾ ਸੰਤੁਲਨ ਬਹੁਤ ਸ਼ੁੱਭ ਹੈ।' 
                    : (language === 'hi' 
                      ? 'संपूर्ण आयताकार प्लाट — वास्तु अनुसार सकारात्मक ऊर्जा का प्रवाह उत्तम है।' 
                      : 'Rectangular plot geometry provides harmonious energy flow.')}
                </span>
              </div>
            ) : (
              <div className="lc-vastu-alert-box warning">
                <AlertTriangle size={18} />
                <span>
                  {language === 'pa' 
                    ? 'ਤਿਰਛਾ ਜਾਂ ਅਨਿਯਮਿਤ ਪਲਾਟ — ਨਕਸ਼ਾ ਬਣਾਉਣ ਵੇਲੇ ਵਾਸਤੂ ਕੰਪਾਸ ਦੀ ਵਰਤੋਂ ਕਰੋ।' 
                    : (language === 'hi' 
                      ? 'तिरछा या अनियमित प्लाट — मकान बनाते समय सही दिशा संयोजन आवश्यक है।' 
                      : 'Irregular plot geometry requires directional alignment adjustments.')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
