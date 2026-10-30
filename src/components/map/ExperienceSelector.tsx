import { useMapContext } from '../../context/MapContext';
import { Home, MapPin, Building2, PenTool } from 'lucide-react';

export default function ExperienceSelector() {
  const { 
    exploreMode, setExploreMode, 
    placeSubMode, setPlaceSubMode,
    isPolygonComplete,
    setIsDrawingMode, setDrawingPoints
  } = useMapContext();

  const handleLandClick = () => {
    setExploreMode('land');
    if (!isPolygonComplete) {
      setIsDrawingMode(true);
    }
  };

  const handlePlaceClick = () => {
    setExploreMode('place');
    if (placeSubMode === 'plot' && !isPolygonComplete) {
      setIsDrawingMode(true);
    } else {
      setIsDrawingMode(false);
    }
  };

  const handleColonyClick = () => {
    setPlaceSubMode('colony');
    setIsDrawingMode(false);
  };

  const handlePlotClick = () => {
    setPlaceSubMode('plot');
    setIsDrawingMode(true);
    if (!isPolygonComplete) {
      setDrawingPoints([]);
    }
  };

  return (
    <div className="experience-selector-pill-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      {/* Primary Toggle: Know Your Land / Know Your Place */}
      <div className="experience-selector-pill">
        <button 
          className={`pill-btn ${exploreMode === 'land' || exploreMode === 'selection' ? 'active' : ''}`}
          onClick={handleLandClick}
        >
          <Home size={16} />
          <span>Know Your Land</span>
        </button>
        <button 
          className={`pill-btn ${exploreMode === 'place' ? 'active' : ''}`}
          onClick={handlePlaceClick}
        >
          <MapPin size={16} />
          <span>Know Your Place</span>
        </button>
      </div>

      {/* Secondary Mode Selector (Only when in Know Your Place) */}
      {exploreMode === 'place' && (
        <div className="place-submode-pill">
          <button 
            className={`submode-btn ${placeSubMode === 'colony' ? 'active' : ''}`}
            onClick={handleColonyClick}
          >
            <Building2 size={14} />
            <span>Colony Insights</span>
          </button>
          <button 
            className={`submode-btn ${placeSubMode === 'plot' ? 'active' : ''}`}
            onClick={handlePlotClick}
          >
            <PenTool size={14} />
            <span>Analyze a Plot</span>
          </button>
        </div>
      )}
    </div>
  );
}

