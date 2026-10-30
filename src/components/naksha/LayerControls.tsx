import { Layers, CheckSquare, Square } from 'lucide-react';
import { useState } from 'react';

export type POICategory = 'School' | 'Hospital' | 'Park' | 'Market' | 'Bank' | 'Police' | 'College' | 'Transport' | 'Other';

interface LayerControlsProps {
  activeLayers: Set<POICategory>;
  toggleLayer: (category: POICategory) => void;
  poiCounts: Record<POICategory, number>;
}

const CATEGORIES: { id: POICategory, label: string, color: string }[] = [
  { id: 'School', label: 'Schools', color: 'bg-blue-500' },
  { id: 'Hospital', label: 'Hospitals', color: 'bg-red-500' },
  { id: 'College', label: 'Colleges', color: 'bg-indigo-500' },
  { id: 'Market', label: 'Markets', color: 'bg-yellow-500' },
  { id: 'Park', label: 'Parks', color: 'bg-green-500' },
  { id: 'Bank', label: 'Banks', color: 'bg-emerald-600' },
  { id: 'Police', label: 'Police', color: 'bg-slate-700' },
  { id: 'Transport', label: 'Transport', color: 'bg-gray-600' }
];

export default function LayerControls({ activeLayers, toggleLayer, poiCounts }: LayerControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/95 backdrop-blur-md shadow-lg border border-gray-200 p-2.5 rounded-xl hover:bg-white transition-all flex items-center justify-center"
        title="Map Layers"
      >
        <Layers size={20} className="text-gray-700" />
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-[200px] bg-white/95 backdrop-blur-md shadow-xl border border-gray-200 rounded-xl overflow-hidden z-50">
          <div className="px-3 py-2 bg-gray-50/80 border-b border-gray-100 font-bold text-xs text-gray-700 uppercase tracking-wider">
            Map Data Layers
          </div>
          <div className="p-2 max-h-[300px] overflow-y-auto custom-scrollbar flex flex-col gap-1">
            {CATEGORIES.map(cat => {
              const isActive = activeLayers.has(cat.id);
              const count = poiCounts[cat.id] || 0;
              
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleLayer(cat.id)}
                  className="flex items-center gap-2 w-full p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="shrink-0 text-primary">
                    {isActive ? <CheckSquare size={16} /> : <Square size={16} className="text-gray-300" />}
                  </div>
                  <div className={`w-3 h-3 rounded-full shrink-0 ${cat.color} ${isActive ? 'opacity-100' : 'opacity-30'}`} />
                  <span className={`text-sm flex-1 truncate ${isActive ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                    {cat.label}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
