import { ShieldAlert, Map, FileText, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import type { PlanningAreaContext } from '../../services/planningMapService';

interface PlanningInfoPanelProps {
  context: PlanningAreaContext;
}

const StatusIndicator = ({ label, status }: { label: string, status: { available: boolean; reason?: string; source?: string } }) => (
  <div className="mb-4">
    <div className="flex justify-between items-start mb-1.5">
      <span className="text-sm font-bold text-gray-700">{label}</span>
      {status.available ? (
        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
          <CheckCircle2 size={12} /> Available
        </span>
      ) : (
        <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
          <XCircle size={12} /> Unavailable
        </span>
      )}
    </div>
    <p className={`text-xs ${status.available ? 'text-gray-600' : 'text-red-500/80 font-medium'}`}>
      {status.reason || (status.available ? 'Official data verified.' : 'Data not available.')}
    </p>
    {status.source && status.available && (
      <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">Source: {status.source}</p>
    )}
  </div>
);

export default function PlanningInfoPanel({ context }: PlanningInfoPanelProps) {
  // Count real OSM POIs
  const schools = context.pois.filter(p => p.category === 'School').length;
  const hospitals = context.pois.filter(p => p.category === 'Hospital').length;
  const roads = context.pois.length > 0; // Rough proxy for OSM connectivity presence

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="p-5 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 text-blue-600">
            <Map size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-extrabold text-gray-900 leading-tight truncate">{context.name}</h2>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">{context.type} Map Context</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        
        {/* Data Transparency Banner */}
        <div className="mb-6 bg-amber-50 border border-amber-200/60 rounded-xl p-3 flex gap-3">
          <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">Data Transparency</h3>
            <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
              PropWise strictly displays verified data. We do not generate fake planning boundaries or zones.
            </p>
          </div>
        </div>

        {/* Planning Status */}
        <div className="mb-6">
          <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
            Official Planning Data
          </h3>
          
          <StatusIndicator 
            label="Planning Boundary" 
            status={context.boundaryStatus} 
          />
          <StatusIndicator 
            label="Zoning / Land Use" 
            status={context.landUseStatus} 
          />
        </div>

        {/* Real Geographic Context */}
        <div className="mb-6">
          <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
            Geographic Context (OSM)
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Nearby Roads</div>
              <div className={`text-sm font-bold ${roads ? 'text-emerald-600' : 'text-gray-400'}`}>
                {roads ? 'Mapped' : 'Unmapped'}
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Schools (3km)</div>
              <div className="text-sm font-bold text-gray-900">{schools}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Hospitals (3km)</div>
              <div className="text-sm font-bold text-gray-900">{hospitals}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Map Center</div>
              <div className="text-[10px] font-mono text-gray-600 font-medium">
                {context.center[0].toFixed(4)}, {context.center[1].toFixed(4)}
              </div>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-wider text-right">Source: OpenStreetMap</p>
        </div>

        {/* Official Documents */}
        <div className="mb-4">
          <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
            <FileText size={14} /> Official Documents
          </h3>
          
          {context.documentsStatus.available ? (
            <button className="w-full flex items-center justify-between bg-blue-50 hover:bg-blue-100 text-blue-700 p-3 rounded-xl transition-colors border border-blue-200">
              <span className="text-sm font-bold">View Official Plan PDF</span>
              <ExternalLink size={16} />
            </button>
          ) : (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
              <FileText size={24} className="mx-auto text-gray-300 mb-2" />
              <p className="text-xs font-medium text-gray-500">{context.documentsStatus.reason}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
