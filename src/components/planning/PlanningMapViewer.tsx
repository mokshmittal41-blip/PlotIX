import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import NakshaMap from '../naksha/NakshaMap';
import PlanningInfoPanel from './PlanningInfoPanel';
import LayerControls, { type POICategory } from '../naksha/LayerControls';
import type { PlanningAreaContext } from '../../services/planningMapService';

interface PlanningMapViewerProps {
  context: PlanningAreaContext;
  onBack: () => void;
}

export default function PlanningMapViewer({ context, onBack }: PlanningMapViewerProps) {
  const [activeLayers, setActiveLayers] = useState<Set<POICategory>>(
    new Set(['School', 'Hospital', 'Market', 'Transport'])
  );

  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(true);

  const poiCounts = context.pois.reduce((acc, poi) => {
    acc[poi.category] = (acc[poi.category] || 0) + 1;
    return acc;
  }, {} as Record<POICategory, number>);

  const toggleLayer = (category: POICategory) => {
    setActiveLayers(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-50 overflow-hidden relative">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 shrink-0 z-20 shadow-sm">
        <button 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0" 
          onClick={onBack}
        >
          <ChevronLeft size={20} className="text-gray-700" />
        </button>
        <div className="min-w-0">
          <h1 className="text-lg font-extrabold text-gray-900 leading-tight truncate">
            {context.name}
          </h1>
          <p className="text-xs text-gray-500 font-medium truncate">
            {context.type} Map Viewer
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row relative min-h-0 w-full">
        
        {/* Map Area (75% on Desktop) */}
        <div className="flex-grow md:w-[75%] relative z-0 h-full">
          <div className="absolute inset-0">
            <NakshaMap 
              center={context.center} 
              bounds={context.bounds} 
              pois={context.pois} 
              activeLayers={activeLayers} 
            />
          </div>
          
          {/* Layer Controls over Map */}
          <div className="absolute top-4 right-4 z-[400]">
            <LayerControls 
              activeLayers={activeLayers} 
              toggleLayer={toggleLayer} 
              poiCounts={poiCounts} 
            />
          </div>
          
          {/* Mobile Info Button */}
          {!isMobilePanelOpen && (
            <button 
              onClick={() => setIsMobilePanelOpen(true)}
              className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl font-bold text-sm tracking-wide"
            >
              View Property Context
            </button>
          )}
        </div>

        {/* Info Panel Area (25% on Desktop) */}
        <div 
          className={`
            border-l border-gray-200 bg-white
            md:relative md:w-[25%] md:min-w-[320px] md:max-w-[380px] md:h-full md:block md:shadow-none md:translate-y-0
            ${isMobilePanelOpen ? 'absolute bottom-0 left-0 right-0 z-[500] h-[65vh] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] rounded-t-3xl transition-transform duration-300' : 'absolute bottom-0 left-0 right-0 z-[500] h-[65vh] translate-y-full transition-transform duration-300'}
          `}
        >
          {/* Mobile Handle */}
          <div 
            className="md:hidden w-full flex justify-center pt-3 pb-1 shrink-0 bg-white rounded-t-3xl border-b border-gray-100 cursor-pointer"
            onClick={() => setIsMobilePanelOpen(false)}
          >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>
          
          <div className="h-full overflow-hidden">
            <PlanningInfoPanel context={context} />
          </div>
        </div>

      </div>
    </div>
  );
}
