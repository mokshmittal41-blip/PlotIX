import { AlertTriangle } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="lr-disclaimer-card">
      <AlertTriangle size={16} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
      <div>
        <strong>Legal &amp; Information Advisory:</strong> Information presented here is for search and visualization purposes only. PropWise does not claim legal title or ownership certification. Always consult the respective State Revenue Department, Sub-Registrar Office, and legal counsel prior to executing land purchases or agreements.
      </div>
    </div>
  );
}
