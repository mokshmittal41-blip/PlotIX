import { useMapContext } from '../context/MapContext';
import MapBaseView from '../components/map/MapBaseView';
import MapSearch from '../components/map/MapSearch';
import MapControls from '../components/map/MapControls';
import DrawPropertyTool from '../components/map/DrawPropertyTool';
import SelectedPropertyPanel from '../components/map/SelectedPropertyPanel';
import BeforeAfterView from '../components/map/BeforeAfterView';
import FuturePotentialFlow from '../components/map/FuturePotentialFlow';
import PropertyIntelligenceDrawer from '../components/map/PropertyIntelligenceDrawer';
import OnboardingOverlay from '../components/map/OnboardingOverlay';

import ExperienceSelector from '../components/map/ExperienceSelector';
import KnowYourPlacePanel from '../components/map/KnowYourPlacePanel';
import StreetViewViewer from '../components/map/streetview/StreetViewViewer';
import { Sparkles, Eye, ArrowLeft } from 'lucide-react';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

function MapContent() {
  const { 
    exploreMode, placeSubMode, 
    isStreetViewMode, isStreetViewActive, exitStreetViewMode
  } = useMapContext();

  return (
    <div className={`map-page-wrapper ${isStreetViewActive ? 'street-view-split' : ''} ${isStreetViewMode ? 'street-exploration-mode' : ''}`}>
      {/* 55% Left Pane: PropWise Street Explorer Viewer */}
      {isStreetViewActive && (
        <div className="streetview-viewer-pane">
          <StreetViewViewer />
        </div>
      )}

      {/* Right Pane (or full screen): Primary Leaflet Map with Blue Coverage */}
      <div className="map-view-column">
        <MapBaseView />
        <MapSearch />
        <MapControls />

        {/* Floating Street Exploration Mode Guidance Header */}
        {isStreetViewMode && (
          <div className="streetview-top-bar">
            <div className="top-bar-left">
              <div className="top-bar-badge">
                <Sparkles size={13} className="text-accent" />
                <span>STREET EXPLORER</span>
              </div>
              <span className="top-bar-instruction">
                <Eye size={13} className="text-primary" />
                Click any <strong style={{ color: '#38bdf8' }}>blue street line</strong> to explore
              </span>
            </div>

            <div className="top-bar-actions">
              <button 
                className="top-bar-btn exit-btn"
                onClick={exitStreetViewMode}
                title="Exit Street Explorer and return to normal map"
              >
                <ArrowLeft size={14} />
                <span>Exit Street Explorer</span>
              </button>
            </div>
          </div>
        )}

        <div className="map-center-ui">
          <ExperienceSelector />
          
          {/* Draw toolbar — positioned directly below Know Your Land */}
          {(exploreMode === 'land' ||
            exploreMode === 'selection' ||
            (exploreMode === 'place' && placeSubMode === 'plot')) && (
            <DrawPropertyTool />
          )}

          <OnboardingOverlay />
        </div>

        {(exploreMode === 'land' ||
          exploreMode === 'selection' ||
          (exploreMode === 'place' && placeSubMode === 'plot')) && (
          <>
            <SelectedPropertyPanel />
            <BeforeAfterView />
            <FuturePotentialFlow />
            <PropertyIntelligenceDrawer />
          </>
        )}

        {exploreMode === 'place' && (
          <KnowYourPlacePanel />
        )}
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <ErrorBoundary fallbackTitle="Map View Unavailable">
      <MapContent />
    </ErrorBoundary>
  );
}
