import { FileText, Database, Calendar } from 'lucide-react';
import type { LandRecordData, LandRecordStatus } from '../../types/landRecords';
import RecordField from './RecordField';
import DataStatus from './DataStatus';
import VerificationCard from './VerificationCard';
import Disclaimer from './Disclaimer';

interface LandRecordPanelProps {
  record: LandRecordData | null;
  status: LandRecordStatus;
  statusMessage?: string;
  onRefresh?: () => void;
}

export default function LandRecordPanel({
  record,
  status,
  statusMessage,
  onRefresh: _onRefresh
}: LandRecordPanelProps) {
  const parcel = record?.parcel;
  const loc = record?.location;

  return (
    <div className="lr-panel-card">
      
      {/* ─── Header ─── */}
      <div className="lr-panel-header">
        <div>
          <div className="lr-panel-title-wrap">
            <FileText size={22} style={{ color: '#2563eb' }} />
            <h3 className="lr-panel-title">Land Information</h3>
          </div>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Official property attributes &amp; cadastral record sheet
          </span>
        </div>

        {parcel && (
          <div className="lr-parcel-tag">
            <Database size={13} />
            <span>{parcel.id}</span>
          </div>
        )}
      </div>

      {/* ─── Data Connection Status ─── */}
      <DataStatus status={status} customMessage={statusMessage} />

      {/* ─── Land Information Attributes Grid ─── */}
      <div className="lr-fields-grid">
        
        {/* Ownership Section */}
        <RecordField
          label="Owner Name"
          value={record?.ownership.ownerName}
          placeholder="Not available"
        />

        <RecordField
          label="Khasra Number"
          value={parcel?.khasraNumber}
          placeholder="Not available"
        />

        <RecordField
          label="Survey Number"
          value={parcel?.surveyNumber}
          placeholder="Not available"
        />

        <RecordField
          label="ULPIN (Bhudhar ID)"
          value={parcel?.ulpin}
          placeholder="Not available"
        />

        <RecordField
          label="Land Area"
          value={parcel?.area?.formatted}
          placeholder="Not available"
          highlight={true}
        />

        <RecordField
          label="Land Classification"
          value={parcel?.landClassification}
          placeholder="Not available"
        />

        <RecordField
          label="Land Use Category"
          value={parcel?.landUse}
          placeholder="Not available"
        />

        <RecordField
          label="Mutation Status"
          value={record?.mutation.status}
          placeholder="Not available"
        />

        <RecordField
          label="District"
          value={loc?.district}
          placeholder="Not available"
        />

        <RecordField
          label="Tehsil / Sub-District"
          value={loc?.tehsil}
          placeholder="Not available"
        />

        <RecordField
          label="Village / Hadbast / Locality"
          value={loc?.village || loc?.locality}
          placeholder="Not available"
        />

        <RecordField
          label="State / Union Territory"
          value={loc?.state}
          placeholder="Not available"
        />

      </div>

      {/* ─── Source & Last Updated Strip ─── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        background: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        fontSize: '11.5px',
        color: '#64748b',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Database size={13} style={{ color: '#2563eb' }} />
          <span>Source: <strong>State Revenue Department (Awaiting Connection)</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={13} style={{ color: '#0284c7' }} />
          <span>Last Updated: <strong>Awaiting official sync</strong></span>
        </div>
      </div>

      {/* ─── Official Record Verification Card ─── */}
      <VerificationCard
        stateName={loc?.state || 'India'}
      />

      {/* ─── Legal Disclaimer Notice ─── */}
      <Disclaimer />

    </div>
  );
}
