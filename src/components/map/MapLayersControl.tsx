import { X } from 'lucide-react';
import { useMapContext } from '../../context/MapContext';
import { MAP_LAYERS } from '../../data/mapData';

interface MapLayersControlProps {
  onClose: () => void;
}

export default function MapLayersControl({ onClose }: MapLayersControlProps) {
  const { activeLayers, toggleLayer } = useMapContext();

  return (
    <div className="map-layers-panel">
      <div className="map-layers-header">
        <h4>Map Layers</h4>
        <button className="btn-icon" onClick={onClose}><X size={14} /></button>
      </div>
      <div className="map-layers-list">
        {MAP_LAYERS.map(layer => {
          const isActive = activeLayers.has(layer.id);
          return (
            <button 
              key={layer.id}
              className={`map-layer-item ${isActive ? 'active' : ''}`}
              onClick={() => toggleLayer(layer.id)}
            >
              <span className="layer-icon">{layer.icon}</span>
              <span className="layer-label">{layer.label}</span>
              <div className={`layer-checkbox ${isActive ? 'checked' : ''}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
