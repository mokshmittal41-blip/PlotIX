import { useState } from 'react';
import type { PlanningMapRecord, MapCategory } from '../data/planning/types';
import PlanningHome from '../components/planning/PlanningHome';
import PlanningExplorer from '../components/planning/PlanningExplorer';
import PlanningMapViewerPro from '../components/planning/PlanningMapViewerPro';
import BlueprintModal from '../components/planning/BlueprintModal';
import MapUploadModal from '../components/planning/MapUploadModal';
import '../components/planning/planning.css';

interface PlanningMapsProps {
  onNavigate?: (page: string, id?: string) => void;
}

type ViewState = 'HOME' | 'EXPLORER' | 'GIS_VIEWER';

export default function PlanningMaps({ onNavigate: _onNavigate }: PlanningMapsProps) {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [selectedCategory, setSelectedCategory] = useState<MapCategory | 'ALL'>('ALL');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active map for full GIS viewer
  const [activeGisMap, setActiveGisMap] = useState<PlanningMapRecord | null>(null);

  // Active map for blueprint inspection modal
  const [inspectingBlueprintMap, setInspectingBlueprintMap] = useState<PlanningMapRecord | null>(null);

  // Upload modal visibility
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Category selection handler from Home
  const handleSelectCategory = (category: MapCategory | 'ALL', state?: string, query?: string) => {
    setSelectedCategory(category);
    if (state) setSelectedState(state);
    if (query) setSearchQuery(query);
    setCurrentView('EXPLORER');
  };

  // Open interactive full-screen GIS map viewer
  const handleOpenGisMap = (record: PlanningMapRecord) => {
    setActiveGisMap(record);
    setCurrentView('GIS_VIEWER');
  };

  // Inspect CAD Blueprint in Modal
  const handleInspectBlueprint = (record: PlanningMapRecord) => {
    setInspectingBlueprintMap(record);
  };

  // Upload success handler
  const handleUploadSuccess = (newRecord: PlanningMapRecord) => {
    setActiveGisMap(newRecord);
    setCurrentView('EXPLORER');
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 overflow-hidden relative font-sans">
      
      {/* View 1: Home Landing Page */}
      {currentView === 'HOME' && (
        <PlanningHome
          onSelectCategory={handleSelectCategory}
          onOpenGisMap={handleOpenGisMap}
          onInspectBlueprint={handleInspectBlueprint}
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
        />
      )}

      {/* View 2: India-Wide Planning Explorer Directory */}
      {currentView === 'EXPLORER' && (
        <PlanningExplorer
          initialCategory={selectedCategory}
          initialState={selectedState}
          initialQuery={searchQuery}
          onOpenGisMap={handleOpenGisMap}
          onInspectBlueprint={handleInspectBlueprint}
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
          onBackToHome={() => setCurrentView('HOME')}
        />
      )}

      {/* View 3: Full-Screen Interactive Leaflet GIS Viewer */}
      {currentView === 'GIS_VIEWER' && activeGisMap && (
        <PlanningMapViewerPro
          mapRecord={activeGisMap}
          onBack={() => setCurrentView('EXPLORER')}
          onInspectBlueprint={handleInspectBlueprint}
        />
      )}

      {/* Blueprint Inspection Modal */}
      {inspectingBlueprintMap && (
        <BlueprintModal
          mapRecord={inspectingBlueprintMap}
          onClose={() => setInspectingBlueprintMap(null)}
          onOpenGisMap={handleOpenGisMap}
        />
      )}

      {/* Map Upload Modal */}
      {isUploadModalOpen && (
        <MapUploadModal
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={handleUploadSuccess}
        />
      )}

    </div>
  );
}
