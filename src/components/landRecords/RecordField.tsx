import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface RecordFieldProps {
  label: string;
  value: string | null | undefined;
  placeholder?: string;
  tooltip?: string;
  highlight?: boolean;
}

export default function RecordField({
  label,
  value,
  placeholder = 'Not available',
  tooltip: _tooltip,
  highlight = false
}: RecordFieldProps) {
  const [copied, setCopied] = useState(false);
  const isAvailable = value !== null && value !== undefined && value.trim() !== '' && value !== 'Not available';

  const handleCopy = () => {
    if (isAvailable && value) {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`lr-field-item ${highlight ? 'highlight' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="lr-field-label">{label}</span>
        {isAvailable && (
          <button
            type="button"
            onClick={handleCopy}
            title="Copy value"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {copied ? <Check size={12} style={{ color: '#10b981' }} /> : <Copy size={12} />}
          </button>
        )}
      </div>

      <div className={`lr-field-val ${!isAvailable ? 'muted' : ''}`}>
        {isAvailable ? value : placeholder}
      </div>

      {!isAvailable && (
        <span className="lr-field-badge">
          Awaiting official data
        </span>
      )}
    </div>
  );
}
