import { MapPin, ChevronRight, Compass } from 'lucide-react';
import type { LocationHierarchy } from '../../types/landRecords';

interface LocationBreadcrumbProps {
  location: LocationHierarchy;
  onEditLocation?: () => void;
}

export default function LocationBreadcrumb({ location, onEditLocation: _onEditLocation }: LocationBreadcrumbProps) {
  return (
    <div className="lr-breadcrumb-bar">
      <div className="lr-breadcrumb-trail">
        <MapPin size={15} style={{ color: '#2563eb' }} />
        <span>India</span>
        <ChevronRight size={14} style={{ color: '#94a3b8' }} />
        <span>{location.state}</span>
        <ChevronRight size={14} style={{ color: '#94a3b8' }} />
        <span>{location.district}</span>
        {location.tehsil && (
          <>
            <ChevronRight size={14} style={{ color: '#94a3b8' }} />
            <span>Tehsil: {location.tehsil}</span>
          </>
        )}
        {location.village && (
          <>
            <ChevronRight size={14} style={{ color: '#94a3b8' }} />
            <span className="lr-breadcrumb-active">{location.village}</span>
          </>
        )}
        {location.locality && !location.village && (
          <>
            <ChevronRight size={14} style={{ color: '#94a3b8' }} />
            <span className="lr-breadcrumb-active">{location.locality}</span>
          </>
        )}
      </div>

      <div className="lr-breadcrumb-badge">
        <Compass size={13} style={{ color: '#0284c7' }} />
        <span>Pan-India Ready Structure</span>
      </div>
    </div>
  );
}
