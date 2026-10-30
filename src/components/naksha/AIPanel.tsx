import { Brain, CheckCircle2, X } from 'lucide-react';
import type { PropertyAnalysisResult } from '../../services/aiPropertyAnalysisService';

interface AIPanelProps {
  analysis: PropertyAnalysisResult | null;
  locationName: string;
  onClose?: () => void;
  isMobile?: boolean;
}

const ScoreBar = ({ label, score }: { label: string, score: number }) => {
  const getColor = (s: number) => {
    if (s >= 80) return 'bg-emerald-500';
    if (s >= 60) return 'bg-blue-500';
    if (s >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">{score}/100</span>
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColor(score)} transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

export default function AIPanel({ analysis, locationName, onClose, isMobile }: AIPanelProps) {
  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-400">
        <Brain size={48} className="mb-4 opacity-20" />
        <p className="text-sm">Select a district and locality to view property intelligence.</p>
      </div>
    );
  }

  return (
    <div className={`ai-panel flex flex-col h-full bg-white relative ${isMobile ? '' : 'md:p-6 p-4'}`}>
      {onClose && (
        <div className="md:hidden absolute top-3 right-3 z-10">
          <button onClick={onClose} className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500">
            <X size={16} />
          </button>
        </div>
      )}
      
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Brain size={20} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-extrabold text-gray-900 leading-tight truncate">Property Intelligence</h2>
          <p className="text-xs font-semibold text-primary truncate">{locationName}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div className="scores-section mb-6">
          <ScoreBar label="Connectivity" score={analysis.scores.connectivity} />
          <ScoreBar label="Livability" score={analysis.scores.livability} />
          <ScoreBar label="Investment Potential" score={analysis.scores.investmentPotential} />
          <ScoreBar label="Rental Potential" score={analysis.scores.rentalPotential} />
          <ScoreBar label="Commercial Activity" score={analysis.scores.commercialActivity} />
          
          <p className="text-[10px] text-gray-400 mt-3 italic text-center leading-tight">
            AI-derived estimate based on available map data.
          </p>
        </div>

        <div className="why-section mb-6 bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
          <h3 className="text-[11px] font-bold text-blue-900 mb-3 uppercase tracking-wider">Why this area?</h3>
          <ul className="space-y-2">
            {analysis.whyThisArea.map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-blue-900/80 font-medium">
                <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <span className="leading-tight">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="recommendation-section mb-4">
          <h3 className="text-[11px] font-bold text-gray-900 mb-2 uppercase tracking-wider">AI Recommendation</h3>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm text-gray-700 leading-relaxed shadow-sm font-medium">
            "{analysis.aiRecommendation}"
          </div>
        </div>
      </div>
    </div>
  );
}
