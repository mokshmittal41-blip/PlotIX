import { Loader2, CheckCircle2, AlertCircle, AlertTriangle, CloudOff } from 'lucide-react';
import type { LandRecordStatus } from '../../types/landRecords';

interface DataStatusProps {
  status: LandRecordStatus;
  customMessage?: string;
}

export default function DataStatus({ status, customMessage }: DataStatusProps) {
  if (status === 'idle') return null;

  switch (status) {
    case 'loading':
      return (
        <div className="lr-status-box loading">
          <Loader2 size={16} className="animate-spin" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Fetching land records...</strong>
            <div style={{ fontSize: '12px', marginTop: '2px' }}>
              {customMessage || 'Connecting to land registry simulation...'}
            </div>
          </div>
        </div>
      );

    case 'data_available':
      return (
        <div className="lr-status-box verified">
          <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Official data available</strong>
            <div style={{ fontSize: '12px', marginTop: '2px' }}>
              {customMessage || 'Land records retrieved from connected state repository.'}
            </div>
          </div>
        </div>
      );

    case 'data_unavailable':
      return (
        <div className="lr-status-box unavailable">
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Land records are currently unavailable for this location.</strong>
            <div style={{ fontSize: '12px', marginTop: '2px' }}>
              {customMessage || 'Official cadastral maps and ownership records will appear once the state backend API is connected.'}
            </div>
          </div>
        </div>
      );

    case 'verification_required':
      return (
        <div className="lr-status-box unavailable">
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Please verify this information on the official government portal.</strong>
            <div style={{ fontSize: '12px', marginTop: '2px' }}>
              {customMessage || 'Always verify critical title and encumbrance information before making transactions.'}
            </div>
          </div>
        </div>
      );

    case 'api_unavailable':
      return (
        <div className="lr-status-box error">
          <CloudOff size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Unable to retrieve records right now. Please try again later.</strong>
            <div style={{ fontSize: '12px', marginTop: '2px' }}>
              {customMessage || 'The land registry backend service is currently offline for scheduled maintenance.'}
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
