import { useState } from 'react';
import { Sparkles, Send, Check, X } from 'lucide-react';
import type { AIChangeProposal } from '../geometry/types';

interface Props {
  onExecuteCommand: (prompt: string) => void;
  isProcessing?: boolean;
  activeProposal: AIChangeProposal | null;
  onApplyProposal: () => void;
  onDiscardProposal: () => void;
}

export default function AICommandBar({
  onExecuteCommand,
  isProcessing = false,
  activeProposal,
  onApplyProposal,
  onDiscardProposal
}: Props) {
  const [inputVal, setInputVal] = useState('');

  const QUICK_SUGGESTIONS = [
    'Move the kitchen to the opposite side',
    'Make the master bedroom 2 ft wider',
    'Add a 3-foot door on kitchen',
    'Move bathroom beside master bedroom',
    'Remove the common bathroom',
    'Rotate bed in master bedroom 90°'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isProcessing) return;
    onExecuteCommand(inputVal.trim());
    setInputVal('');
  };

  const handleChipClick = (suggestion: string) => {
    if (isProcessing) return;
    onExecuteCommand(suggestion);
  };

  return (
    <div className="ai-bottom-bar-container">
      
      {/* ─── Legend & Snap Status Bar ────────────────────────────────────────── */}
      <div className="ai-legend-status-row">
        <div className="ai-legend-items">
          <span><span className="ai-legend-dot" style={{ background: '#0f172a' }}></span>9″ Ext Wall</span>
          <span><span className="ai-legend-dot" style={{ background: '#64748b' }}></span>4.5″ Int Wall</span>
          <span><span className="ai-legend-dot" style={{ background: '#0ea5e9' }}></span>Glazed Window</span>
          <span><span className="ai-legend-dot" style={{ background: '#2563eb' }}></span>Door Leaf & Swing</span>
        </div>
        <div>
          <span>✦ Drag rooms to move • Drag corner handles to resize</span>
        </div>
      </div>

      {/* ─── AI Active Change Proposal Card (Before / After Preview) ─────────── */}
      {activeProposal && (
        <div className="ai-proposal-card animate-pop">
          <div className="ai-proposal-header">
            <div className="ai-proposal-title">
              <Sparkles size={15} color="#2563eb" />
              <span>AI Proposed Architectural Change: {activeProposal.summary}</span>
            </div>
          </div>

          <div className="ai-proposal-desc">
            {activeProposal.explanation}
          </div>

          {activeProposal.diffSummary.length > 0 && (
            <table className="ai-diff-table">
              <tbody>
                {activeProposal.diffSummary.map((diff, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 800, width: '120px' }}>{diff.target}</td>
                    {diff.before && <td className="ai-diff-before">{diff.before}</td>}
                    <td className="ai-diff-after">{diff.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="ai-proposal-actions">
            <button 
              type="button" 
              className="btn-cancel-change"
              onClick={onDiscardProposal}
            >
              <X size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              <span>Discard</span>
            </button>
            <button 
              type="button" 
              className="btn-apply-change"
              onClick={onApplyProposal}
            >
              <Check size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              <span>Apply Modification</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── Suggestion Chips ────────────────────────────────────────────────── */}
      <div className="ai-suggestions-row">
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563eb', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={12} /> Suggestions:
        </span>
        {QUICK_SUGGESTIONS.map((sug, idx) => (
          <button
            key={idx}
            type="button"
            className="ai-suggestion-chip"
            onClick={() => handleChipClick(sug)}
            disabled={isProcessing}
          >
            {sug}
          </button>
        ))}
      </div>

      {/* ─── Natural Language Input Bar ──────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="ai-input-form">
        <Sparkles size={16} color="#2563eb" style={{ flexShrink: 0 }} />
        <input 
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={
            isProcessing 
              ? 'AI Architect is calculating parametric geometry...' 
              : 'Ask AI to modify the plan (e.g. "Move kitchen to opposite side", "Make master bedroom 2 ft wider")'
          }
          disabled={isProcessing}
          className="ai-input-field"
        />
        <button 
          type="submit" 
          disabled={!inputVal.trim() || isProcessing}
          className="ai-btn-send"
        >
          <span>Send</span>
          <Send size={13} />
        </button>
      </form>

    </div>
  );
}
