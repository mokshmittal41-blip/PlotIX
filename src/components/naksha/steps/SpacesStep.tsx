import { 
  Check, Plus, Minus, Bed, Utensils, Bath, Car, 
  Sparkles, Flower2, Laptop, Store, 
  Sun, LayoutList, Tv, Armchair
} from 'lucide-react';
import type { NakshaConfiguration, KitchenStyle, ParkingPreference } from '../types';

interface Props {
  config: NakshaConfiguration;
  onChange: (updates: Partial<NakshaConfiguration>) => void;
}

const AVAILABLE_SPACES: Array<{ id: string; title: string; subtitle: string; icon: any }> = [
  { id: 'Living Room', title: 'Living Room', subtitle: 'Formal social & guest area', icon: Armchair },
  { id: 'Dining', title: 'Dining Area', subtitle: 'Family meal space', icon: Utensils },
  { id: 'Kitchen', title: 'Kitchen', subtitle: 'Modular cooking zone', icon: Utensils },
  { id: 'Master Bedroom', title: 'Master Suite', subtitle: 'Primary private bedroom', icon: Bed },
  { id: 'Bedroom', title: 'Bedrooms', subtitle: 'Additional family rooms', icon: Bed },
  { id: 'Puja Room', title: 'Puja Room', subtitle: 'Sacred prayer corner', icon: Sparkles },
  { id: 'Family Lounge', title: 'Family Lounge', subtitle: 'Informal gathering area', icon: Tv },
  { id: 'Home Office', title: 'Home Office / Study', subtitle: 'Quiet productivity space', icon: Laptop },
  { id: 'Guest Room', title: 'Guest Room', subtitle: 'Dedicated visitor suite', icon: Bed },
  { id: 'Balcony', title: 'Balcony / Verandah', subtitle: 'Semi-open sit-out', icon: Sun },
  { id: 'Parking', title: 'Vehicle Parking', subtitle: 'Car & two-wheeler porch', icon: Car },
  { id: 'Garden', title: 'Lawn / Garden', subtitle: 'Green courtyard or lawn', icon: Flower2 },
  { id: 'Store', title: 'Store Room', subtitle: 'Dedicated storage space', icon: Store },
  { id: 'Walk-in Closet', title: 'Walk-in Closet', subtitle: 'Dressing & wardrobe zone', icon: LayoutList }
];

export default function SpacesStep({ config, onChange }: Props) {
  const spaces = config.spaces;

  const updateSpaces = (updates: Partial<typeof spaces>) => {
    onChange({ spaces: { ...spaces, ...updates } });
  };

  const toggleSpace = (spaceId: string) => {
    const isSelected = spaces.selectedSpaces.includes(spaceId);
    let nextList: string[];
    if (isSelected) {
      nextList = spaces.selectedSpaces.filter(s => s !== spaceId);
    } else {
      nextList = [...spaces.selectedSpaces, spaceId];
    }
    updateSpaces({ selectedSpaces: nextList });
  };

  const hasBedrooms = spaces.selectedSpaces.includes('Master Bedroom') || spaces.selectedSpaces.includes('Bedroom');
  const hasKitchen = spaces.selectedSpaces.includes('Kitchen');
  const hasParking = spaces.selectedSpaces.includes('Parking');

  return (
    <div className="naksha-step-body animate-fadeIn">
      <div className="step-intro-header">
        <span className="step-tag">STEP 03</span>
        <h2 className="step-main-title">What spaces should your home have?</h2>
        <p className="step-sub-title">Select the rooms and functional areas you want in your floor plan.</p>
      </div>

      {/* Selectable Spaces Grid */}
      <div className="spaces-catalog-grid">
        {AVAILABLE_SPACES.map(space => {
          const isSelected = spaces.selectedSpaces.includes(space.id);
          const Icon = space.icon;
          return (
            <div 
              key={space.id}
              className={`space-card-item ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleSpace(space.id)}
            >
              <div className="space-icon-box">
                <Icon size={18} />
              </div>
              <div className="space-meta-info">
                <h4 className="space-title">{space.title}</h4>
                <p className="space-subtitle">{space.subtitle}</p>
              </div>
              <span className={`space-check-badge ${isSelected ? 'active' : ''}`}>
                {isSelected ? <Check size={12} /> : <Plus size={12} />}
              </span>
            </div>
          );
        })}
      </div>

      {/* Smart Sub-Configurations */}
      
      {/* 1. Bedrooms & Attached Baths Configuration */}
      {hasBedrooms && (
        <div className="form-section-card animate-fadeIn">
          <label className="section-label">
            <Bed size={15} className="text-primary mr-1" />
            Bedrooms Configuration
          </label>

          <div className="stepper-row">
            <div className="stepper-item">
              <span className="stepper-label">Total Bedrooms</span>
              <div className="stepper-control">
                <button 
                  type="button"
                  className="stepper-btn" 
                  onClick={() => updateSpaces({ bedroomsCount: Math.max(1, spaces.bedroomsCount - 1) })}
                  disabled={spaces.bedroomsCount <= 1}
                >
                  <Minus size={14} />
                </button>
                <span className="stepper-value">{spaces.bedroomsCount} BHK</span>
                <button 
                  type="button"
                  className="stepper-btn" 
                  onClick={() => updateSpaces({ bedroomsCount: Math.min(8, spaces.bedroomsCount + 1) })}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="stepper-item">
              <span className="stepper-label">Attached Bathrooms</span>
              <div className="stepper-control">
                <button 
                  type="button"
                  className="stepper-btn" 
                  onClick={() => updateSpaces({ attachedBathsCount: Math.max(1, spaces.attachedBathsCount - 1) })}
                  disabled={spaces.attachedBathsCount <= 1}
                >
                  <Minus size={14} />
                </button>
                <span className="stepper-value">{spaces.attachedBathsCount} Attached</span>
                <button 
                  type="button"
                  className="stepper-btn" 
                  onClick={() => updateSpaces({ attachedBathsCount: Math.min(spaces.bedroomsCount, spaces.attachedBathsCount + 1) })}
                  disabled={spaces.attachedBathsCount >= spaces.bedroomsCount}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Total Bathrooms */}
      <div className="form-section-card animate-fadeIn">
        <label className="section-label">
          <Bath size={15} className="text-primary mr-1" />
          Bathrooms Total
        </label>
        <div className="stepper-control-compact">
          <button 
            type="button"
            className="stepper-btn" 
            onClick={() => updateSpaces({ bathroomsCount: Math.max(1, spaces.bathroomsCount - 1) })}
            disabled={spaces.bathroomsCount <= 1}
          >
            <Minus size={14} />
          </button>
          <span className="stepper-value">{spaces.bathroomsCount} Bathrooms</span>
          <button 
            type="button"
            className="stepper-btn" 
            onClick={() => updateSpaces({ bathroomsCount: Math.min(6, spaces.bathroomsCount + 1) })}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* 3. Kitchen Style */}
      {hasKitchen && (
        <div className="form-section-card animate-fadeIn">
          <label className="section-label">
            <Utensils size={15} className="text-primary mr-1" />
            How should your kitchen feel?
          </label>

          <div className="choice-trio-grid">
            {([
              { id: 'Open', title: 'Open Concept', desc: 'Integrated with living & dining' },
              { id: 'Semi-Open', title: 'Semi-Open', desc: 'Partitioned with breakfast counter' },
              { id: 'Closed', title: 'Closed / Traditional', desc: 'Completely private cooking zone' }
            ] as const).map(style => {
              const isSelected = spaces.kitchenStyle === style.id;
              return (
                <div 
                  key={style.id}
                  className={`kitchen-style-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => updateSpaces({ kitchenStyle: style.id as KitchenStyle })}
                >
                  <h5 className="kitchen-title">{style.title}</h5>
                  <p className="kitchen-desc">{style.desc}</p>
                  {isSelected && <Check size={13} className="check-icon-top" />}
                </div>
              );
            })}
          </div>

          <div className="checkbox-toggle-row mt-3">
            <label className="custom-checkbox-wrap">
              <input 
                type="checkbox" 
                checked={spaces.utilityArea}
                onChange={(e) => updateSpaces({ utilityArea: e.target.checked })}
              />
              <span className="checkbox-custom" />
              <span className="checkbox-label-text">Include dedicated Utility / Washing balcony</span>
            </label>
          </div>
        </div>
      )}

      {/* 4. Parking Vehicles */}
      {hasParking && (
        <div className="form-section-card animate-fadeIn">
          <label className="section-label">
            <Car size={15} className="text-primary mr-1" />
            Parking Requirements
          </label>

          <div className="stepper-row">
            <div className="stepper-item">
              <span className="stepper-label">Cars</span>
              <div className="stepper-control">
                <button 
                  type="button"
                  className="stepper-btn" 
                  onClick={() => updateSpaces({ carParkingCount: Math.max(0, spaces.carParkingCount - 1) })}
                >
                  <Minus size={14} />
                </button>
                <span className="stepper-value">{spaces.carParkingCount} Car</span>
                <button 
                  type="button"
                  className="stepper-btn" 
                  onClick={() => updateSpaces({ carParkingCount: Math.min(4, spaces.carParkingCount + 1) })}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="stepper-item">
              <span className="stepper-label">Two-Wheelers / Bikes</span>
              <div className="stepper-control">
                <button 
                  type="button"
                  className="stepper-btn" 
                  onClick={() => updateSpaces({ bikeParkingCount: Math.max(0, spaces.bikeParkingCount - 1) })}
                >
                  <Minus size={14} />
                </button>
                <span className="stepper-value">{spaces.bikeParkingCount} Bikes</span>
                <button 
                  type="button"
                  className="stepper-btn" 
                  onClick={() => updateSpaces({ bikeParkingCount: Math.min(6, spaces.bikeParkingCount + 1) })}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="parking-placement-row mt-3">
            <span className="sub-label">Porch Location</span>
            <div className="segmented-control-4">
              {(['Front', 'Side', 'Basement', 'AI decides'] as const).map(pref => {
                const isSelected = spaces.parkingPreference === pref;
                return (
                  <button
                    key={pref}
                    type="button"
                    className={`segment-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => updateSpaces({ parkingPreference: pref as ParkingPreference })}
                  >
                    {pref}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
