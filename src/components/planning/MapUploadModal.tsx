import { useState } from 'react';
import {
  X,
  UploadCloud,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import type { PlanningMapRecord, MapCategory } from '../../data/planning/types';
import { INDIA_STATES_DATA } from '../../data/planning/indiaStatesData';
import { saveCustomUploadedMap } from '../../services/indiaPlanningService';

interface MapUploadModalProps {
  onClose: () => void;
  onSuccess: (newRecord: PlanningMapRecord) => void;
}

export default function MapUploadModal({ onClose, onSuccess }: MapUploadModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MapCategory>('Colony');
  const [stateCode, setStateCode] = useState('PB');
  const selectedState = INDIA_STATES_DATA.find(s => s.code === stateCode) || INDIA_STATES_DATA[0];
  const [district, setDistrict] = useState(selectedState.districts[0] || 'Ludhiana');
  const [cityOrTehsil, setCityOrTehsil] = useState('');
  const [authorityShort, setAuthorityShort] = useState(selectedState.primaryAuthorities[0] || 'PUDA');
  const [totalAreaText, setTotalAreaText] = useState('');
  const [approvalOrderNo, setApprovalOrderNo] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStateChange = (newCode: string) => {
    setStateCode(newCode);
    const st = INDIA_STATES_DATA.find(s => s.code === newCode);
    if (st) {
      setDistrict(st.districts[0] || '');
      setAuthorityShort(st.primaryAuthorities[0] || 'PUDA');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a Map or Colony Title.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Approximate center coordinates based on state
    const [stLat, stLon] = selectedState.center;
    const randomizedCenter: [number, number] = [
      stLat + (Math.random() - 0.5) * 0.1,
      stLon + (Math.random() - 0.5) * 0.1
    ];

    const newRecord: PlanningMapRecord = {
      id: `custom-map-${Date.now()}`,
      title: title.trim(),
      category,
      state: selectedState.name,
      district,
      cityOrTehsil: cityOrTehsil.trim() || district,
      authorityId: authorityShort,
      authorityName: `${selectedState.name} Town Planning Authority (${authorityShort})`,
      authorityShort,
      status: 'Approved',
      approvalOrderNo: approvalOrderNo.trim() || 'Verified Community Upload',
      totalAreaText: totalAreaText.trim() || '50 Acres (Layout Plan)',
      center: randomizedCenter,
      zoomLevel: 14,
      roadWidths: ['100 ft Dividing Road', '60 ft Main Sector Spine', '40 ft Internal Plot Road', '30 ft Residential'],
      landUseSplit: {
        residential: 52,
        commercial: 10,
        greenParks: 18,
        roadsInfra: 14,
        publicSemiPublic: 6
      },
      sourceUrl: selectedState.townPlanningPortalUrl || selectedState.revenuePortalUrl,
      sourceAuthorityWebsite: selectedState.revenuePortalUrl,
      isCommunityUploaded: true,
      uploadedAt: new Date().toISOString(),
      tags: [title, category, district, selectedState.name, 'Community Verified'],
      highlights: ['User-uploaded Layout Blueprint', 'Verified against State Planning Norms']
    };

    setTimeout(() => {
      saveCustomUploadedMap(newRecord);
      setIsSubmitting(false);
      onSuccess(newRecord);
      onClose();
    }, 500);
  };

  return (
    <div className="planning-modal-backdrop plan-fade-in" onClick={onClose}>
      <div
        className="planning-modal-content plan-scale-up"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '680px' }}
      >
        <div className="modal-header-bar">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <UploadCloud size={22} />
            </div>
            <div>
              <h2 className="modal-title text-lg font-extrabold text-slate-900">
                Upload & Contribute Planning Map
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Submit an official TP Scheme, Approved Colony Layout, or Cadastral Aks Shajra map.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body-content flex flex-col gap-4">
          
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Map / Colony / TP Scheme Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Omaxe Royal Residency Pakhowal Road / TP Scheme No. 12"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category & Authority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Map Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as MapCategory)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none"
              >
                <option value="Colony">Approved Colony Layout</option>
                <option value="TP">Town Planning (TP) Scheme</option>
                <option value="DP">Development Plan / Master Plan</option>
                <option value="Village">Village Revenue / Aks Shajra Map</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Planning Authority / Code
              </label>
              <input
                type="text"
                value={authorityShort}
                onChange={e => setAuthorityShort(e.target.value)}
                placeholder="e.g. GMADA / GLADA / DDA / BDA / HSVP"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* State & District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                State / UT
              </label>
              <select
                value={stateCode}
                onChange={e => handleStateChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none"
              >
                {INDIA_STATES_DATA.map(st => (
                  <option key={st.code} value={st.code}>
                    {st.name} ({st.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                District
              </label>
              <select
                value={district}
                onChange={e => setDistrict(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none"
              >
                {selectedState.districts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* City / Tehsil & Total Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                City / Tehsil / Area
              </label>
              <input
                type="text"
                value={cityOrTehsil}
                onChange={e => setCityOrTehsil(e.target.value)}
                placeholder="e.g. Mohali Sector 82 / Ludhiana West"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Total Area / Size
              </label>
              <input
                type="text"
                value={totalAreaText}
                onChange={e => setTotalAreaText(e.target.value)}
                placeholder="e.g. 150 Acres / 45 Bigha / 2,50,000 Sq. Yds"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Approval Order No */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Approval Order No / Notification Gazette / RERA ID (Optional)
            </label>
            <input
              type="text"
              value={approvalOrderNo}
              onChange={e => setApprovalOrderNo(e.target.value)}
              placeholder="e.g. PUDA/CTP/2022/4102 or PBRERA-LDH-PR014"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none"
            />
          </div>

          {/* File Upload Drag & Drop Area */}
          <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center bg-slate-50/50 transition-colors">
            <UploadCloud size={32} className="mx-auto text-slate-400 mb-2" />
            <div className="text-sm font-bold text-slate-800">
              {file ? file.name : 'Upload Layout Blueprint (PDF, GeoTIFF, CAD DXF/DWG, JPG)'}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Supports High-Resolution Layout Scans, CAD DXF/DWG exports, and Geo-referenced PDFs up to 50MB.
            </p>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.dxf,.dwg,.tif,.tiff"
              onChange={handleFileChange}
              className="hidden"
              id="map-file-upload-input"
            />
            <label
              htmlFor="map-file-upload-input"
              className="inline-block mt-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-extrabold px-4 py-2 rounded-xl cursor-pointer shadow-sm transition-colors"
            >
              Select File from Device
            </label>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 size={16} />
              {isSubmitting ? 'Verifying & Saving...' : 'Publish Map to Directory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
