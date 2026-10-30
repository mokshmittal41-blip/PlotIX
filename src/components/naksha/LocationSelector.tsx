import { useState, useEffect } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';

interface LocationSelectorProps {
  onExplore: (district: string, locality: string) => void;
  isLoading: boolean;
  currentLocationName: string;
}

const PUNJAB_DISTRICTS = [
  'Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka',
  'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana',
  'Mansa', 'Moga', 'Muktsar', 'Pathankot', 'Patiala', 'Rupnagar', 'Mohali',
  'Sangrur', 'Nawanshahr', 'Tarn Taran'
];

export default function LocationSelector({ onExplore, isLoading, currentLocationName }: LocationSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [district, setDistrict] = useState('Ludhiana');
  const [locality, setLocality] = useState('');

  // Update local state if external locationName changes and we are collapsed
  useEffect(() => {
    if (!isExpanded) {
      // Just a visual sync if needed, but the current location is shown in the header
    }
  }, [currentLocationName, isExpanded]);

  const handleExplore = (e: React.FormEvent) => {
    e.preventDefault();
    if (district && locality.trim()) {
      onExplore(district, locality.trim());
      setIsExpanded(false);
    }
  };

  if (!isExpanded) {
    return (
      <button 
        onClick={() => setIsExpanded(true)}
        className="bg-white/95 backdrop-blur-md shadow-lg border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-white transition-all text-left max-w-sm"
      >
        <div className="bg-primary/10 p-2 rounded-lg">
          <MapPin size={18} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Current Area</div>
          <div className="text-sm font-bold text-gray-900 truncate">{currentLocationName}</div>
        </div>
        <Search size={16} className="text-gray-400 ml-2" />
      </button>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-md shadow-xl border border-gray-200 rounded-xl w-[320px] overflow-hidden">
      <div 
        className="px-4 py-3 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(false)}
      >
        <div className="flex items-center gap-2 font-bold text-gray-800 text-sm">
          <MapPin size={16} className="text-primary" />
          Change Location
        </div>
        <ChevronDown size={16} className="text-gray-500" />
      </div>
      
      <form onSubmit={handleExplore} className="p-4">
        <div className="mb-3">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">District</label>
          <select 
            value={district} 
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium"
            disabled={isLoading}
          >
            {PUNJAB_DISTRICTS.sort().map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Locality / Colony</label>
          <input 
            type="text" 
            placeholder="e.g. Model Town"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium"
            disabled={isLoading}
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm"
          disabled={!district || !locality.trim() || isLoading}
        >
          {isLoading ? <span className="spinner-small" /> : <Search size={16} />}
          {isLoading ? 'Searching Map...' : 'Explore Area'}
        </button>
      </form>
    </div>
  );
}
