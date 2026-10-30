import { useState } from 'react';
import { 
  Bed, Sofa, UtensilsCrossed, Bath, Sparkles, 
  BookOpen, Car, Maximize, DoorClosed, 
  Plus, ChevronLeft, ChevronRight,
  Layers, Columns
} from 'lucide-react';
import type { RoomCategory, FurnitureType } from '../geometry/types';

interface Props {
  onAddRoom: (category: RoomCategory, name: string, w: number, h: number) => void;
  onAddOpening: (type: 'door' | 'window', widthFt: number, subType?: string) => void;
  onAddFurniture: (type: FurnitureType, w: number, h: number) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function ElementLibrary({
  onAddRoom,
  onAddOpening,
  onAddFurniture,
  isCollapsed = false,
  onToggleCollapse
}: Props) {
  const [activeTab, setActiveTab] = useState<'rooms' | 'openings' | 'furniture'>('rooms');

  const ROOM_TEMPLATES: Array<{ category: RoomCategory; name: string; w: number; h: number; icon: any }> = [
    { category: 'master_bedroom', name: 'Master Bedroom', w: 14, h: 12, icon: Bed },
    { category: 'bedroom', name: 'Bedroom', w: 12, h: 11, icon: Bed },
    { category: 'living', name: 'Living Room', w: 16, h: 14, icon: Sofa },
    { category: 'dining', name: 'Dining Room', w: 12, h: 10, icon: UtensilsCrossed },
    { category: 'kitchen', name: 'Kitchen', w: 10, h: 10, icon: UtensilsCrossed },
    { category: 'bathroom', name: 'Bathroom', w: 7, h: 5, icon: Bath },
    { category: 'puja', name: 'Puja Room', w: 6, h: 6, icon: Sparkles },
    { category: 'study', name: 'Study / Office', w: 10, h: 10, icon: BookOpen },
    { category: 'parking', name: 'Car Porch', w: 12, h: 16, icon: Car },
    { category: 'balcony', name: 'Balcony', w: 10, h: 4, icon: Maximize },
    { category: 'staircase', name: 'Staircase', w: 8, h: 14, icon: Columns }
  ];

  const OPENING_TEMPLATES = [
    { type: 'door' as const, label: 'Single Door 3′-0″', widthFt: 3.0, sub: 'single' },
    { type: 'door' as const, label: 'Double Door 4′-0″', widthFt: 4.0, sub: 'double' },
    { type: 'door' as const, label: 'Sliding Door 4′-0″', widthFt: 4.0, sub: 'sliding' },
    { type: 'window' as const, label: 'Standard Window 4′-0″', widthFt: 4.0, sub: 'standard' },
    { type: 'window' as const, label: 'French Window 6′-0″', widthFt: 6.0, sub: 'french' },
    { type: 'window' as const, label: 'Ventilator 2′-0″', widthFt: 2.0, sub: 'ventilator' }
  ];

  const FURNITURE_TEMPLATES: Array<{ type: FurnitureType; label: string; w: number; h: number; category: string }> = [
    { type: 'bed_king', label: 'King Bed (6.5 × 6.5′)', w: 6.5, h: 6.5, category: 'Bedroom' },
    { type: 'bed_queen', label: 'Queen Bed (5.5 × 6.0′)', w: 5.5, h: 6.0, category: 'Bedroom' },
    { type: 'wardrobe', label: 'Wardrobe (6.0 × 2.0′)', w: 6.0, h: 2.0, category: 'Bedroom' },
    { type: 'sofa_sectional', label: 'L-Sectional Sofa (8 × 6′)', w: 8.0, h: 6.0, category: 'Living' },
    { type: 'coffee_table', label: 'Coffee Table (3.5 × 2.0′)', w: 3.5, h: 2.0, category: 'Living' },
    { type: 'tv_unit', label: 'TV Media Unit (5.0 × 1.2′)', w: 5.0, h: 1.2, category: 'Living' },
    { type: 'dining_table', label: 'Dining Set (6 × 4.5′)', w: 6.0, h: 4.5, category: 'Dining' },
    { type: 'kitchen_counter_l', label: 'L-Kitchen Counter (7.5 × 6.5′)', w: 7.5, h: 6.5, category: 'Kitchen' },
    { type: 'kitchen_hob', label: 'Gas Stove / Hob (2.2 × 1.5′)', w: 2.2, h: 1.5, category: 'Kitchen' },
    { type: 'kitchen_sink', label: 'Kitchen Sink (2.2 × 1.6′)', w: 2.2, h: 1.6, category: 'Kitchen' },
    { type: 'toilet_wc', label: 'Toilet WC (1.8 × 2.5′)', w: 1.8, h: 2.5, category: 'Bathroom' },
    { type: 'wash_basin', label: 'Wash Basin (1.6 × 1.5′)', w: 1.6, h: 1.5, category: 'Bathroom' },
    { type: 'shower_stall', label: 'Shower Stall (3.0 × 3.0′)', w: 3.0, h: 3.0, category: 'Bathroom' },
    { type: 'car_sedan', label: 'Sedan Car (6.5 × 13.5′)', w: 6.5, h: 13.5, category: 'Parking' },
    { type: 'mandir_altar', label: 'Mandir Altar (3.0 × 2.0′)', w: 3.0, h: 2.0, category: 'Puja' },
    { type: 'desk_study', label: 'Study Desk (4.5 × 2.2′)', w: 4.5, h: 2.2, category: 'Study' }
  ];

  if (isCollapsed) {
    return (
      <div className="element-library-collapsed-bar" style={{ width: '48px', background: '#ffffff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', gap: '12px' }}>
        <button 
          type="button" 
          className="cad-icon-btn"
          onClick={onToggleCollapse}
          title="Expand Element Library"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="element-library-panel">
      
      {/* Pane Header */}
      <div className="library-header">
        <div className="library-title">
          <Layers size={15} color="#2563eb" />
          <span>Element Library</span>
        </div>
        {onToggleCollapse && (
          <button 
            type="button" 
            className="cad-icon-btn"
            style={{ width: '26px', height: '26px' }}
            onClick={onToggleCollapse}
            title="Collapse Panel"
          >
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {/* Segmented Category Tabs */}
      <div className="library-tabs-bar">
        <button
          type="button"
          className={`library-tab-item ${activeTab === 'rooms' ? 'active' : ''}`}
          onClick={() => setActiveTab('rooms')}
        >
          Rooms
        </button>
        <button
          type="button"
          className={`library-tab-item ${activeTab === 'openings' ? 'active' : ''}`}
          onClick={() => setActiveTab('openings')}
        >
          Openings
        </button>
        <button
          type="button"
          className={`library-tab-item ${activeTab === 'furniture' ? 'active' : ''}`}
          onClick={() => setActiveTab('furniture')}
        >
          Fixtures
        </button>
      </div>

      {/* Scrollable Templates List */}
      <div className="library-items-scrollable">
        
        {/* ROOMS TAB */}
        {activeTab === 'rooms' && (
          <>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, padding: '4px 6px' }}>
              Click or drag to add room to canvas:
            </div>
            {ROOM_TEMPLATES.map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.category}
                  className="library-item-card"
                  onClick={() => onAddRoom(item.category, item.name, item.w, item.h)}
                >
                  <div className="library-item-left">
                    <div className="library-item-icon-box">
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="library-item-name">{item.name}</div>
                      <div className="library-item-dim">{item.w}′ × {item.h}′ ({item.w * item.h} sq ft)</div>
                    </div>
                  </div>
                  <div className="library-item-add-btn">
                    <Plus size={13} />
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* OPENINGS TAB */}
        {activeTab === 'openings' && (
          <>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, padding: '4px 6px' }}>
              Wall-hosted doors & windows:
            </div>
            {OPENING_TEMPLATES.map((item, idx) => (
              <div
                key={idx}
                className="library-item-card"
                onClick={() => onAddOpening(item.type, item.widthFt, item.sub)}
              >
                <div className="library-item-left">
                  <div className="library-item-icon-box">
                    <DoorClosed size={16} />
                  </div>
                  <div>
                    <div className="library-item-name">{item.label}</div>
                    <div className="library-item-dim">
                      {item.type === 'door' ? 'Wall Opening & 90° Swing' : 'Glazed Window Frame'}
                    </div>
                  </div>
                </div>
                <div className="library-item-add-btn">
                  <Plus size={13} />
                </div>
              </div>
            ))}
          </>
        )}

        {/* FURNITURE TAB */}
        {activeTab === 'furniture' && (
          <>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, padding: '4px 6px' }}>
              Parametric architectural fixtures:
            </div>
            {FURNITURE_TEMPLATES.map((item, idx) => (
              <div
                key={idx}
                className="library-item-card"
                onClick={() => onAddFurniture(item.type, item.w, item.h)}
              >
                <div className="library-item-left">
                  <div className="library-item-icon-box">
                    <Bed size={16} />
                  </div>
                  <div>
                    <div className="library-item-name">{item.label}</div>
                    <div className="library-item-dim">{item.category} • {item.w} × {item.h} ft</div>
                  </div>
                </div>
                <div className="library-item-add-btn">
                  <Plus size={13} />
                </div>
              </div>
            ))}
          </>
        )}

      </div>

    </div>
  );
}
