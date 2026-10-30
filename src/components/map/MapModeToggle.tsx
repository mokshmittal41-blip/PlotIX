import { useMapContext } from '../../context/MapContext';

export default function MapModeToggle() {
  const { exploreMode, setExploreMode } = useMapContext();

  if (exploreMode === 'selection') return null;

  return (
    <div className="map-mode-toggle-container">
      <div className="map-mode-toggle">
        <button 
          className={`mode-toggle-btn ${exploreMode === 'land' ? 'active' : ''}`}
          onClick={() => setExploreMode('land')}
        >
          🏡 Know Your Land
        </button>
        <button 
          className={`mode-toggle-btn ${exploreMode === 'place' ? 'active' : ''}`}
          onClick={() => setExploreMode('place')}
        >
          📍 Know Your Place
        </button>
      </div>
    </div>
  );
}
