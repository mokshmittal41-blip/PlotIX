import { useState } from 'react';
import { ShieldCheck, ExternalLink, AlertCircle } from 'lucide-react';

interface VerificationCardProps {
  stateName: string;
  portalName?: string;
  portalUrl?: string;
}

export default function VerificationCard({ stateName, portalName: _portalName, portalUrl: _portalUrl }: VerificationCardProps) {
  const [showNotice, setShowNotice] = useState(false);

  const handleVerifyClick = () => {
    setShowNotice(true);
    setTimeout(() => setShowNotice(false), 5000);
  };

  return (
    <div className="lr-verification-card">
      <div className="lr-verification-top">
        <div className="lr-verification-icon">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h4 className="lr-verification-title">Official Record Verification</h4>
          <span style={{ fontSize: '11.5px', color: '#64748b' }}>
            State: {stateName || 'India'}
          </span>
        </div>
      </div>

      <p className="lr-verification-text">
        Land information is retrieved from official government sources when available. Always verify important property information with the relevant government authority before making a transaction.
      </p>

      <div>
        <button
          type="button"
          onClick={handleVerifyClick}
          className="lr-verify-btn"
          title="Direct link to official state revenue department will be available upon backend connection."
        >
          <span>Verify on Official Portal</span>
          <ExternalLink size={14} />
        </button>
      </div>

      {showNotice && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11.5px',
          color: '#b45309',
          background: '#fef3c7',
          padding: '6px 10px',
          borderRadius: '8px'
        }}>
          <AlertCircle size={13} style={{ flexShrink: 0 }} />
          <span>Official portal verification links will be enabled when the state API connector is activated.</span>
        </div>
      )}
    </div>
  );
}
