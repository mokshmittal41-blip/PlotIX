import { useState } from 'react';
import { 
  Sparkles, ArrowLeft, ArrowRight, 
  CheckCircle, RotateCcw
} from 'lucide-react';
import type { PlotGeometry, RoomRequirement, FloorPlanModel } from '../components/naksha/geometry/types';
import { synthesizeFloorPlans, createCustomStarterModel } from '../components/naksha/geometry/layoutEngine';
import { useLanguage } from '../context/LanguageContext';

import SpaceSelectionStep from '../components/naksha/wizard/SpaceSelectionStep';
import SpaceAllocationStep from '../components/naksha/wizard/SpaceAllocationStep';
import BuildMethodStep from '../components/naksha/wizard/BuildMethodStep';
import LiveNakshaCanvas from '../components/naksha/LiveNakshaCanvas';
import '../components/naksha/naksha.css';

interface AIDesignProps {
  onNavigate?: (page: string, id?: string) => void;
}

const INITIAL_PLOT: PlotGeometry = {
  width: 30,
  depth: 50,
  unit: 'ft',
  shape: 'Rectangle',
  roadFacing: 'North',
  orientation: 0,
  setbacks: {
    front: 5,
    rear: 3,
    left: 2.5,
    right: 2.5
  }
};

const INITIAL_REQUIREMENTS: RoomRequirement[] = [
  { id: 'req_master', name: 'Master Bedroom', category: 'master_bedroom', count: 1, widthFt: 14, heightFt: 12, preset: 'standard', description: 'Primary suite' },
  { id: 'req_bed2', name: 'Bedroom 02', category: 'bedroom', count: 1, widthFt: 12, heightFt: 11, preset: 'standard', description: 'Secondary bedroom' },
  { id: 'req_living', name: 'Living Room', category: 'living', count: 1, widthFt: 16, heightFt: 14, preset: 'standard', description: 'Main family lounge' },
  { id: 'req_dining', name: 'Dining Room', category: 'dining', count: 1, widthFt: 12, heightFt: 10, preset: 'standard', description: 'Family dining area' },
  { id: 'req_kitchen', name: 'Kitchen', category: 'kitchen', count: 1, widthFt: 10, heightFt: 10, preset: 'standard', description: 'Modular kitchen' },
  { id: 'req_bath', name: 'Bathroom', category: 'bathroom', count: 2, widthFt: 7, heightFt: 5.5, preset: 'standard', description: 'Attached & common' },
  { id: 'req_puja', name: 'Puja Room', category: 'puja', count: 1, widthFt: 6, heightFt: 6, preset: 'standard', description: 'Spiritual prayer altar' },
  { id: 'req_parking', name: 'Car Parking', category: 'parking', count: 1, widthFt: 12, heightFt: 16, preset: 'standard', description: 'Driveway porch' }
];

export default function AIDesign({ onNavigate }: AIDesignProps) {
  const { t, language } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const [plot, setPlot] = useState<PlotGeometry>(INITIAL_PLOT);
  const [requirements, setRequirements] = useState<RoomRequirement[]>(INITIAL_REQUIREMENTS);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlans, setGeneratedPlans] = useState<FloorPlanModel[] | null>(null);

  const wizardSteps = [
    { stepNum: '01', title: language === 'pa' ? 'ਪਲਾਟ ਤੇ ਕਮਰੇ' : (language === 'hi' ? 'प्लाट व कमरे' : 'Spaces & Plot') },
    { stepNum: '02', title: language === 'pa' ? 'ਕਮਰਿਆਂ ਦਾ ਸਾਈਜ਼' : (language === 'hi' ? 'कमरों का नाप' : 'Dimensions') },
    { stepNum: '03', title: language === 'pa' ? 'ਨਕਸ਼ਾ ਤਿਆਰ ਕਰੋ' : (language === 'hi' ? 'नक्शा बनाएं' : 'Arrange & Build') }
  ];

  const handleUpdatePlot = (updates: Partial<PlotGeometry>) => {
    setPlot(prev => ({ ...prev, ...updates }));
  };

  const handleSelectBuildMethod = (method: 'ai' | 'custom') => {
    setIsGenerating(true);

    setTimeout(() => {
      if (method === 'ai') {
        const plans = synthesizeFloorPlans({
          plot,
          requirements,
          roadFacing: plot.roadFacing
        });
        setGeneratedPlans(plans);
      } else {
        const customPlan = createCustomStarterModel(plot, requirements);
        setGeneratedPlans([customPlan]);
      }
      setIsGenerating(false);
    }, 1200);
  };

  const handleReset = () => {
    setPlot(INITIAL_PLOT);
    setRequirements(INITIAL_REQUIREMENTS);
    setGeneratedPlans(null);
    setActiveStep(0);
  };

  // If plans are generated, render the Fullscreen Interactive CAD Floor Plan Workspace
  if (generatedPlans) {
    return (
      <LiveNakshaCanvas 
        plans={generatedPlans}
        onBackToWizard={() => setGeneratedPlans(null)}
        onRegeneratePlans={() => handleSelectBuildMethod('ai')}
      />
    );
  }

  return (
    <div className="ai-naksha-wizard-page">
      
      {/* ─── Header Bar ────────────────────────────────────────────────── */}
      <header className="wizard-top-header">
        <div className="wizard-brand-cluster">
          <div className="wizard-brand-icon">
            <Sparkles size={18} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="wizard-brand-tag-row">
              <span className="wizard-brand-tag">PropWise</span>
              <span className="wizard-brand-sub">• {t.naksha.title}</span>
            </div>
            <h1 className="wizard-main-title">{t.naksha.title}</h1>
          </div>
        </div>

        <div className="wizard-header-actions">
          {activeStep > 0 && (
            <button 
              type="button" 
              className="wizard-btn-ghost"
              onClick={handleReset}
            >
              <RotateCcw size={13} />
              <span>{t.common.clear}</span>
            </button>
          )}

          {onNavigate && (
            <button 
              type="button" 
              className="wizard-btn-ghost"
              onClick={() => onNavigate('map')}
            >
              {t.nav.map}
            </button>
          )}
        </div>
      </header>

      {/* ─── Step Progress Tracker Ribbon ─────────────────────────────────────── */}
      <div className="wizard-ribbon-bar">
        <div className="wizard-ribbon-inner">
          {wizardSteps.map((step, idx) => {
            const isCurrent = activeStep === idx;
            const isPassed = activeStep > idx;

            return (
              <div key={step.stepNum} style={{ display: 'flex', alignItems: 'center', flex: idx < wizardSteps.length - 1 ? 1 : 'none' }}>
                <button
                  type="button"
                  className={`wizard-step-tab ${isCurrent ? 'current' : ''} ${isPassed ? 'passed' : ''}`}
                  onClick={() => setActiveStep(idx)}
                >
                  <div className="wizard-step-tab-badge">
                    {isPassed ? <CheckCircle size={14} /> : step.stepNum}
                  </div>
                  <span>{step.title}</span>
                </button>
                {idx < wizardSteps.length - 1 && (
                  <div className="wizard-ribbon-divider" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Main Wizard Content Container ────────────────────────────────────── */}
      <main className="wizard-main-content">
        
        <div>
          {activeStep === 0 && (
            <SpaceSelectionStep 
              plot={plot}
              onUpdatePlot={handleUpdatePlot}
              requirements={requirements}
              onUpdateRequirements={setRequirements}
            />
          )}

          {activeStep === 1 && (
            <SpaceAllocationStep 
              plot={plot}
              requirements={requirements}
              onUpdateRequirements={setRequirements}
            />
          )}

          {activeStep === 2 && (
            <BuildMethodStep 
              isGenerating={isGenerating}
              onSelectMethod={handleSelectBuildMethod}
              plot={plot}
              requirements={requirements}
            />
          )}
        </div>

        {/* Bottom Wizard Footer Navigation */}
        <footer className="wizard-footer-bar">
          <div>
            {activeStep > 0 && (
              <button 
                type="button" 
                className="wizard-nav-btn secondary"
                onClick={() => setActiveStep(prev => prev - 1)}
              >
                <ArrowLeft size={16} />
                <span>{language === 'pa' ? 'ਪਿੱਛੇ' : (language === 'hi' ? 'पिछला चरण' : 'Back')}</span>
              </button>
            )}
          </div>

          <div>
            {activeStep < 2 ? (
              <button 
                type="button" 
                className="wizard-nav-btn primary"
                onClick={() => setActiveStep(prev => prev + 1)}
              >
                <span>{language === 'pa' ? 'ਅਗਲਾ ਕਦਮ' : (language === 'hi' ? 'अगला चरण' : 'Next Step')}</span>
                <ArrowRight size={16} />
              </button>
            ) : null}
          </div>
        </footer>

      </main>

    </div>
  );
}
