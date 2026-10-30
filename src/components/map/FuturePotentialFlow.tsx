import { useState } from 'react';
import { X, ArrowRight, Home, Building2, Trees, Sparkles } from 'lucide-react';
import { useMapContext } from '../../context/MapContext';

const BUILD_TYPES = [
  { id: 'house', label: 'House', icon: <Home size={20} /> },
  { id: 'villa', label: 'Villa', icon: <Home size={20} /> },
  { id: 'commercial', label: 'Commercial', icon: <Building2 size={20} /> },
  { id: 'apartments', label: 'Apartments', icon: <Building2 size={20} /> },
  { id: 'farmhouse', label: 'Farmhouse', icon: <Trees size={20} /> },
  { id: 'custom', label: 'Custom', icon: <Sparkles size={20} /> },
];

export default function FuturePotentialFlow() {
  const { activePanel, setActivePanel } = useMapContext();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState('house');
  const [isGenerating, setIsGenerating] = useState(false);

  if (activePanel !== 'future') return null;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStep(3);
    }, 2000);
  };

  return (
    <div className="future-flow-panel card">
      <div className="panel-header">
        <h4>What do you want to make here?</h4>
        <button className="btn-icon" onClick={() => setActivePanel('none')}>
          <X size={16} />
        </button>
      </div>

      {step === 1 && (
        <div className="flow-step">
          <p className="helper-text mb-4">Explore what could be built on this property.</p>
          <div className="build-type-grid">
            {BUILD_TYPES.map(type => (
              <button 
                key={type.id}
                className={`build-type-btn ${selectedType === type.id ? 'active' : ''}`}
                onClick={() => setSelectedType(type.id)}
              >
                {type.icon}
                <span>{type.label}</span>
              </button>
            ))}
          </div>
          <button 
            className="btn btn-primary w-full mt-4 justify-center"
            onClick={() => setStep(2)}
          >
            Next Step <ArrowRight size={16} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flow-step">
          <p className="helper-text mb-4">Tell PropWise what you want</p>
          
          <div className="preferences-form">
            <div className="form-group">
              <label>Number of Floors</label>
              <select className="form-select">
                <option>Single Story (G)</option>
                <option>Double Story (G+1)</option>
                <option>Three Story (G+2)</option>
                <option>High Rise (G+3+)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Style Preferences</label>
              <select className="form-select">
                <option>Modern Minimalist</option>
                <option>Traditional Indian</option>
                <option>Contemporary</option>
                <option>Eco-Friendly</option>
              </select>
            </div>

            <div className="form-group">
              <label>Key Features (Optional)</label>
              <input type="text" className="form-input" placeholder="e.g. Large garden, home office..." />
            </div>
          </div>

          <div className="flow-actions mt-4">
            <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
            <button 
              className="btn btn-accent flex-1 justify-center"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : (
                <><Sparkles size={16} /> Create Future Concept</>
              )}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flow-step result-step">
          <div className="concept-image">
            <img 
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80" 
              alt="Generated Concept" 
            />
            <div className="concept-badge"><Sparkles size={12}/> AI Concept</div>
          </div>
          
          <div className="concept-details">
            <h5>Modern {BUILD_TYPES.find(t => t.id === selectedType)?.label}</h5>
            <p>G+1 structure optimizing natural light with a 20% green area footprint.</p>
            
            <div className="concept-stats">
              <div className="stat"><span>Max Built-up</span><span>3,200 sq.ft.</span></div>
              <div className="stat"><span>Est. Timeline</span><span>12-14 months</span></div>
              <div className="stat"><span>Est. Cost</span><span>₹1.2 Cr - 1.5 Cr</span></div>
            </div>
          </div>

          <button className="btn btn-outline w-full mt-4 justify-center" onClick={() => setStep(1)}>
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}
