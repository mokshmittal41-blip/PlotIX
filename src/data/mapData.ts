// Dummy map data for the map experience
import { PROPERTIES } from './dummyData';

export const MAP_LAYERS = [
  { id: 'properties', label: 'Properties', icon: '🏠' },
  { id: 'roads', label: 'Road Network', icon: '🛣️' },
  { id: 'development', label: 'Development', icon: '🏗️' },
  { id: 'places', label: 'Nearby Places', icon: '📍' },
  { id: 'future', label: 'Future Infra', icon: '🚀' },
];

export const MAP_MARKERS = [
  { id: 'm1', propertyId: PROPERTIES[0].id, x: 450, y: 320, type: 'available' },
  { id: 'm2', propertyId: PROPERTIES[1].id, x: 780, y: 540, type: 'saved' },
  { id: 'm3', propertyId: PROPERTIES[2].id, x: 600, y: 250, type: 'recommended' },
  { id: 'm4', propertyId: PROPERTIES[3].id, x: 300, y: 700, type: 'available' },
  { id: 'm5', propertyId: PROPERTIES[4].id, x: 950, y: 400, type: 'available' },
];

// Mock before/after aerial imagery URLs (Unsplash)
export const SATELLITE_IMAGES = {
  past: [
    { year: '2018', url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=1600&q=80' },
    { year: '2021', url: 'https://images.unsplash.com/photo-1542261610-0a2d3c35f2cd?w=1600&q=80' }
  ],
  present: [
    { year: '2024', url: 'https://images.unsplash.com/photo-1506751470038-d5e4eb6511a7?w=1600&q=80' },
    { year: '2026', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80' }
  ]
};

// Location intelligence summary mock data
export const AROUND_PROPERTY_DATA = [
  { label: 'Airport Road', distance: '1.2 km', type: 'road' },
  { label: 'Amity International', distance: '2.5 km', type: 'school' },
  { label: 'Fortis Hospital', distance: '4.0 km', type: 'hospital' },
  { label: 'Aerocity Metro (Proposed)', distance: '1.5 km', type: 'metro' },
  { label: 'IT City', distance: '3.0 km', type: 'commercial' }
];
