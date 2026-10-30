import { useState } from 'react';
import { ChevronLeft, Search, MapPin } from 'lucide-react';
import { fetchPlanningAreaContext, type PlanningAreaContext } from '../../services/planningMapService';
import PlanningMapViewer from './PlanningMapViewer';

interface VillageMapsProps {
  onBack: () => void;
  type: 'TP' | 'DP' | 'Village';
}

const PUNJAB_DISTRICTS = [
  'Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka',
  'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana',
  'Mansa', 'Moga', 'Muktsar', 'Pathankot', 'Patiala', 'Rupnagar', 'Mohali',
  'Sangrur', 'Nawanshahr', 'Tarn Taran'
];

export default function VillageMaps({ onBack, type }: VillageMapsProps) {
  const [district, setDistrict] = useState('Bathinda');
  const [cityOrTehsil, setCityOrTehsil] = useState('Bathinda');
  const [areaName, setAreaName] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [context, setContext] = useState<PlanningAreaContext | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!areaName.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchPlanningAreaContext('Punjab', district, cityOrTehsil, areaName.trim(), type);
      if (result) {
        setContext(result);
      } else {
        setError(`Could not find geographic data for ${areaName}. Please try a broader search.`);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load map data.");
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    if (type === 'TP') return 'Town Planning (TP) Maps';
    if (type === 'DP') return 'Development Plans (DP)';
    return 'Village Maps';
  };

  const getAreaLabel = () => {
    if (type === 'TP') return 'TP Scheme Name / Number';
    if (type === 'DP') return 'Development Plan Name';
    return 'Village Name';
  };

  if (context) {
    return <PlanningMapViewer context={context} onBack={() => setContext(null)} />;
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-50 overflow-hidden relative">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 shrink-0 z-20 shadow-sm">
        <button 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0" 
          onClick={onBack}
        >
          <ChevronLeft size={20} className="text-gray-700" />
        </button>
        <div className="min-w-0">
          <h1 className="text-lg font-extrabold text-gray-900 leading-tight truncate">{getTitle()}</h1>
          <p className="text-xs text-gray-500 font-medium truncate">Search and explore official property planning data.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10 flex justify-center items-start">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full max-w-md mt-10">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-50 text-blue-600 rounded-full mb-6 mx-auto">
            <MapPin size={24} />
          </div>
          <h2 className="text-2xl font-extrabold text-center text-gray-900 mb-2">Select Location</h2>
          <p className="text-center text-gray-500 text-sm mb-8">
            Enter the details below to view the available geographic and planning context.
          </p>

          <form onSubmit={handleSearch} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">District</label>
              <select 
                value={district} 
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium"
              >
                {PUNJAB_DISTRICTS.sort().map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                {type === 'Village' ? 'Tehsil' : 'City / Planning Area'}
              </label>
              <input 
                type="text" 
                value={cityOrTehsil}
                onChange={(e) => setCityOrTehsil(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">{getAreaLabel()}</label>
              <input 
                type="text" 
                placeholder={`e.g. ${type === 'Village' ? 'Phus Mandi' : 'Scheme 12'}`}
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 text-center font-medium">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading || !areaName.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {isLoading ? <span className="spinner-small border-white" /> : <Search size={18} />}
              {isLoading ? 'Locating...' : 'Explore Maps'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
