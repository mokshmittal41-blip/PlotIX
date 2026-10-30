import { useState } from 'react';
import { Hash } from 'lucide-react';

interface SearchByKhasraProps {
  onSearch: (khasra: string) => void;
  isLoading?: boolean;
}

export default function SearchByKhasra({ onSearch, isLoading = false }: SearchByKhasraProps) {
  const [khasra, setKhasra] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (khasra.trim()) {
      onSearch(khasra.trim());
    }
  };

  return (
    <div className="lr-khasra-search-card">
      <div className="lr-khasra-title">
        <Hash size={15} style={{ color: '#2563eb' }} />
        <span>Search by Khasra / Survey Number</span>
      </div>

      <form onSubmit={handleSubmit} className="lr-khasra-input-row">
        <input
          type="text"
          placeholder="Enter Khasra or Survey Number (e.g. 145/2, 280, 42)..."
          value={khasra}
          onChange={e => setKhasra(e.target.value)}
          className="lr-khasra-input"
        />
        <button
          type="submit"
          disabled={isLoading || !khasra.trim()}
          className="lr-khasra-btn"
        >
          {isLoading ? 'Searching...' : 'Lookup Record'}
        </button>
      </form>
      <div style={{ fontSize: '11px', color: '#64748b' }}>
        Frontend lookup ready • Connects to state cadastral index when backend is configured.
      </div>
    </div>
  );
}
