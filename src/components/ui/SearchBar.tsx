import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
  onSearch?: () => void;
  size?: 'default' | 'large';
}

export default function SearchBar({
  placeholder = 'Search by location, sector, area or property...',
  value = '',
  onChange,
  onSearch,
  size = 'default',
}: SearchBarProps) {
  return (
    <div className="search-bar">
      <Search size={18} className="search-bar-icon" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onSearch?.()}
        style={size === 'large' ? { height: '56px', fontSize: '15px', paddingLeft: '52px' } : {}}
      />
      <button className="btn btn-accent btn-sm search-bar-btn" onClick={onSearch}>
        Search
      </button>
    </div>
  );
}
