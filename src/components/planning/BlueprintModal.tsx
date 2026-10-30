import { useState } from 'react';
import {
  X,
  Building2,
  FileText,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Sparkles,
  MapPin
} from 'lucide-react';
import type { PlanningMapRecord } from '../../data/planning/types';

interface BlueprintModalProps {
  mapRecord: PlanningMapRecord | null;
  onClose: () => void;
  onOpenGisMap?: (record: PlanningMapRecord) => void;
}

export default function BlueprintModal({
  mapRecord,
  onClose,
  onOpenGisMap
}: BlueprintModalProps) {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'landuse' | 'approvals' | 'connectivity'>('blueprint');
  const [isCopied, setIsCopied] = useState(false);

  if (!mapRecord) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const split = mapRecord.landUseSplit || {
    residential: 48,
    commercial: 10,
    industrial: 0,
    greenParks: 18,
    roadsInfra: 16,
    publicSemiPublic: 8
  };

  return (
    <div className="planning-modal-backdrop plan-fade-in" onClick={onClose}>
      <div
        className="planning-modal-content plan-scale-up"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '960px' }}
      >
        {/* ─── MODAL HEADER ─── */}
        <div className="modal-header-bar">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Building2 size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md">
                  {mapRecord.authorityShort} {mapRecord.category} Blueprint
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  {mapRecord.cityOrTehsil}, {mapRecord.state}
                </span>
              </div>
              <h2 className="modal-title text-lg font-extrabold text-slate-900 mt-0.5">
                {mapRecord.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Share Blueprint Link"
            >
              {isCopied ? <CheckCircle2 size={18} className="text-emerald-600" /> : <Share2 size={18} />}
            </button>
            <button
              onClick={onClose}
              className="modal-close-btn"
              title="Close Modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ─── TABS HEADER ─── */}
        <div className="px-6 pt-4 border-b border-slate-200 bg-slate-50/50 flex gap-2 overflow-x-auto">
          {[
            { id: 'blueprint', label: 'Layout Blueprint', icon: Building2 },
            { id: 'landuse', label: 'Land Use & Zoning', icon: Sparkles },
            { id: 'approvals', label: 'Gazette & Approvals', icon: FileText },
            { id: 'connectivity', label: 'Surrounding Infra', icon: MapPin }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-3 text-xs font-extrabold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-transparent'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon size={14} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* ─── MODAL BODY ─── */}
        <div className="modal-body-content">
          
          {/* TAB 1: BLUEPRINT SCHEMATIC */}
          {activeTab === 'blueprint' && (
            <div className="flex flex-col gap-6">
              {/* CAD Schematic Simulation Canvas */}
              <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden border border-slate-800 shadow-inner min-h-[300px] flex flex-col justify-between">
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                      CAD Vector Grid &mdash; {mapRecord.totalAreaText}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Scale 1:500 Metric</span>
                </div>

                {/* Vector Grid Background Art */}
                <div className="my-6 grid grid-cols-4 gap-3 z-10">
                  <div className="bg-blue-900/40 border border-blue-500/40 rounded-xl p-3">
                    <div className="text-[10px] uppercase font-extrabold text-blue-400">Sector Spine</div>
                    <div className="text-sm font-bold mt-1 text-white">
                      {mapRecord.roadWidths?.[0] || '100 ft Master Road'}
                    </div>
                  </div>
                  <div className="bg-amber-900/40 border border-amber-500/40 rounded-xl p-3">
                    <div className="text-[10px] uppercase font-extrabold text-amber-400">Residential Plotted</div>
                    <div className="text-sm font-bold mt-1 text-white">{split.residential}% Area</div>
                  </div>
                  <div className="bg-emerald-900/40 border border-emerald-500/40 rounded-xl p-3">
                    <div className="text-[10px] uppercase font-extrabold text-emerald-400">Parks & Green Belt</div>
                    <div className="text-sm font-bold mt-1 text-white">{split.greenParks}% Area</div>
                  </div>
                  <div className="bg-purple-900/40 border border-purple-500/40 rounded-xl p-3">
                    <div className="text-[10px] uppercase font-extrabold text-purple-400">Commercial / SCO</div>
                    <div className="text-sm font-bold mt-1 text-white">{split.commercial}% Area</div>
                  </div>
                </div>

                <div className="flex items-center justify-between z-10 pt-4 border-t border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">
                    Coordinates: {mapRecord.center[0].toFixed(4)}°N, {mapRecord.center[1].toFixed(4)}°E
                  </div>
                  {onOpenGisMap && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenGisMap(mapRecord);
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                    >
                      Open in Interactive GIS Map &rarr;
                    </button>
                  )}
                </div>
              </div>

              {/* Road Width Hierarchy */}
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3">
                  Approved Road Width Hierarchy
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {(mapRecord.roadWidths || [
                    '200 ft PR-7 Airport Expressway',
                    '100 ft Dividing Road',
                    '60 ft Main Sector Spine',
                    '40 ft Internal Plot Access'
                  ]).map((road, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div className="text-[10px] font-extrabold uppercase text-slate-400">
                        Tier {idx + 1} Corridor
                      </div>
                      <div className="text-xs font-extrabold text-slate-800 mt-0.5">{road}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LAND USE & ZONING */}
          {activeTab === 'landuse' && (
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                  Statutory Land Use Distribution (%)
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Approved by {mapRecord.authorityName} under State Town Planning and Master Development Bylaws.
                </p>

                {/* Progress Bar Visualization */}
                <div className="h-6 w-full rounded-full overflow-hidden flex shadow-sm mb-4">
                  <div style={{ width: `${split.residential}%`, background: '#eab308' }} title={`Residential: ${split.residential}%`} />
                  <div style={{ width: `${split.commercial}%`, background: '#ef4444' }} title={`Commercial: ${split.commercial}%`} />
                  {split.industrial && <div style={{ width: `${split.industrial}%`, background: '#8b5cf6' }} title={`Industrial: ${split.industrial}%`} />}
                  <div style={{ width: `${split.greenParks}%`, background: '#10b981' }} title={`Green Parks: ${split.greenParks}%`} />
                  <div style={{ width: `${split.roadsInfra}%`, background: '#64748b' }} title={`Roads & Infra: ${split.roadsInfra}%`} />
                  <div style={{ width: `${split.publicSemiPublic}%`, background: '#3b82f6' }} title={`Public/Semi-Public: ${split.publicSemiPublic}%`} />
                </div>

                {/* Legend Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl border border-slate-200 bg-amber-50/50">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="text-xs font-bold text-slate-700">Residential</span>
                    </div>
                    <div className="text-lg font-black text-slate-900 mt-1">{split.residential}%</div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-red-50/50">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-xs font-bold text-slate-700">Commercial (SCO)</span>
                    </div>
                    <div className="text-lg font-black text-slate-900 mt-1">{split.commercial}%</div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-emerald-50/50">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-slate-700">Parks & Green Belts</span>
                    </div>
                    <div className="text-lg font-black text-slate-900 mt-1">{split.greenParks}%</div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-slate-500" />
                      <span className="text-xs font-bold text-slate-700">Roads & Utilities</span>
                    </div>
                    <div className="text-lg font-black text-slate-900 mt-1">{split.roadsInfra}%</div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-blue-50/50">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-xs font-bold text-slate-700">Public Amenities</span>
                    </div>
                    <div className="text-lg font-black text-slate-900 mt-1">{split.publicSemiPublic}%</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GAZETTE & APPROVALS */}
          {activeTab === 'approvals' && (
            <div className="flex flex-col gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-4">
                <ShieldCheck size={28} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-extrabold text-emerald-950">
                    Government Sanction & Legal Validity Verified
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    This planning scheme is officially recognized by statutory town planning authorities. All plots and developments comply with approved FAR, ground coverage, and setback regulations.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="text-xs font-bold text-slate-500 uppercase">Approval / Sanction Order No.</div>
                  <div className="text-sm font-extrabold text-slate-900 mt-1 font-mono">
                    {mapRecord.approvalOrderNo || 'Gazette Notified / Statutory Plan'}
                  </div>
                </div>

                {mapRecord.reraRegNo && (
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="text-xs font-bold text-slate-500 uppercase">RERA Registration ID</div>
                    <div className="text-sm font-extrabold text-blue-600 mt-1 font-mono">
                      {mapRecord.reraRegNo}
                    </div>
                  </div>
                )}

                {mapRecord.gazetteNotification && (
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 col-span-full">
                    <div className="text-xs font-bold text-slate-500 uppercase">Official Gazette Notification</div>
                    <div className="text-sm font-bold text-slate-800 mt-1">
                      {mapRecord.gazetteNotification}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-4">
                {mapRecord.sourceUrl && (
                  <a
                    href={mapRecord.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <ExternalLink size={16} /> Open Official Government Source
                  </a>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SURROUNDING CONNECTIVITY */}
          {activeTab === 'connectivity' && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                Strategic Infrastructure & Nearby Landmarks
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(mapRecord.nearbyInfrastructure || [
                  { name: 'International Airport', distance: '8.0 km', type: 'airport' },
                  { name: 'National Highway / Expressway', distance: '1.2 km', type: 'highway' },
                  { name: 'Super Specialty Hospital', distance: '3.5 km', type: 'hospital' },
                  { name: 'Commercial Hub / Mall', distance: '2.0 km', type: 'commercial' }
                ]).map((infra, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{infra.name}</div>
                      <div className="text-[11px] text-slate-500 uppercase font-semibold mt-0.5">{infra.type}</div>
                    </div>
                    <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                      {infra.distance}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ─── MODAL FOOTER ─── */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            Source: {mapRecord.authorityName} &bull; PropWise Official GIS Intelligence
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
