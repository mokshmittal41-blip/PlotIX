import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ToastItem } from '../types';
import type { ActiveLocation } from '../types/locationHierarchy';

export const DEFAULT_ACTIVE_LOCATION: ActiveLocation = {
  id: 'loc-rewari-district',
  name: 'Rewari District',
  displayName: 'Rewari District, Haryana',
  shortName: 'Rewari, HR',
  coordinates: [28.1920, 76.6186],
  latitude: 28.1920,
  longitude: 76.6186,
  placeName: 'Rewari District',
  district: 'Rewari',
  state: 'Haryana',
  country: 'India',
  source: 'preset',
  scope: 'district',
  hierarchy: ['India', 'Haryana', 'Rewari District'],
  isVerified: true
};

interface AppContextType {
  // Location Architecture
  activeLocation: ActiveLocation;
  setActiveLocation: (loc: ActiveLocation) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;
  activeRadiusKm: number | 'district';
  setActiveRadiusKm: (radius: number | 'district') => void;
  recentLocations: ActiveLocation[];
  addRecentLocation: (loc: ActiveLocation) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  switchLocation: (newLocation: ActiveLocation) => void;

  // Existing App State
  savedPropertyIds: Set<string>;
  toggleSave: (id: string) => void;
  toasts: ToastItem[];
  addToast: (message: string, type?: ToastItem['type']) => void;
  removeToast: (id: string) => void;
  currentPropertyId: string | null;
  setCurrentPropertyId: (id: string | null) => void;
  importedPlot: { areaSqYd: number; perimeter: number; polygon: [number, number][]; location?: string } | null;
  setImportedPlot: (plot: { areaSqYd: number; perimeter: number; polygon: [number, number][]; location?: string } | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY_LOCATION = 'propwise_active_location';
const STORAGE_KEY_ONBOARDED = 'propwise_has_onboarded_location';
const STORAGE_KEY_RECENT = 'propwise_recent_locations';
const STORAGE_KEY_RADIUS = 'propwise_active_radius';

export function AppProvider({ children }: { children: React.ReactNode }) {
  // ── 1. Onboarding & Active Location State ──
  // Always start with false on each app load / refresh so that the district selection option appears every time the app loads
  const [hasCompletedOnboarding, setHasCompletedOnboardingState] = useState<boolean>(false);

  // Clean up any previously persisted onboarding flag
  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY_ONBOARDED);
      }
    } catch {}
  }, []);

  const [activeLocation, setActiveLocationState] = useState<ActiveLocation>(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY_LOCATION);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.coordinates && Array.isArray(parsed.coordinates) && parsed.name) {
            return parsed;
          }
        }
      }
    } catch {}
    return DEFAULT_ACTIVE_LOCATION;
  });

  const [activeRadiusKm, setActiveRadiusKmState] = useState<number | 'district'>(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY_RADIUS);
        if (stored) {
          if (stored === 'district') return 'district';
          const num = parseInt(stored, 10);
          if (!isNaN(num)) return num;
        }
      }
    } catch {}
    return 'district';
  });

  const [recentLocations, setRecentLocations] = useState<ActiveLocation[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY_RECENT);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed.slice(0, 5);
        }
      }
    } catch {}
    return [];
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // ── 2. Existing State ──
  const [savedPropertyIds, setSavedPropertyIds] = useState<Set<string>>(
    new Set(['prop-002', 'prop-005'])
  );
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [currentPropertyId, setCurrentPropertyId] = useState<string | null>('prop-001');
  const [importedPlot, setImportedPlot] = useState<{ areaSqYd: number; perimeter: number; polygon: [number, number][]; location?: string } | null>(null);

  // ── Sync to localStorage ──
  const setHasCompletedOnboarding = useCallback((completed: boolean) => {
    setHasCompletedOnboardingState(completed);
    try {
      localStorage.removeItem(STORAGE_KEY_ONBOARDED);
    } catch {}
  }, []);

  const addRecentLocation = useCallback((loc: ActiveLocation) => {
    setRecentLocations(prev => {
      const filtered = prev.filter(item => item.name.toLowerCase() !== loc.name.toLowerCase());
      const updated = [loc, ...filtered].slice(0, 6);
      try {
        localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const setActiveLocation = useCallback((loc: ActiveLocation) => {
    setActiveLocationState(loc);
    try {
      localStorage.setItem(STORAGE_KEY_LOCATION, JSON.stringify(loc));
    } catch {}
    addRecentLocation(loc);
  }, [addRecentLocation]);

  const setActiveRadiusKm = useCallback((radius: number | 'district') => {
    setActiveRadiusKmState(radius);
    try {
      localStorage.setItem(STORAGE_KEY_RADIUS, String(radius));
    } catch {}
  }, []);

  const switchLocation = useCallback((newLocation: ActiveLocation) => {
    setActiveLocation(newLocation);
    // Set appropriate default radius based on scope
    if (newLocation.scope === 'district') {
      setActiveRadiusKm('district');
    } else if (newLocation.scope === 'tehsil') {
      setActiveRadiusKm(10);
    } else if (newLocation.scope === 'village') {
      setActiveRadiusKm(5);
    } else {
      setActiveRadiusKm(10);
    }
    setIsLocationModalOpen(false);
  }, [setActiveLocation, setActiveRadiusKm]);

  // Existing helpers
  const toggleSave = useCallback((id: string) => {
    setSavedPropertyIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        addToast('Property removed from saved', 'info');
      } else {
        next.add(id);
        addToast('Property saved!', 'success');
      }
      return next;
    });
  }, []);

  const addToast = useCallback((message: string, type: ToastItem['type'] = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeLocation,
        setActiveLocation,
        hasCompletedOnboarding,
        setHasCompletedOnboarding,
        activeRadiusKm,
        setActiveRadiusKm,
        recentLocations,
        addRecentLocation,
        isLocationModalOpen,
        setIsLocationModalOpen,
        switchLocation,

        savedPropertyIds,
        toggleSave,
        toasts,
        addToast,
        removeToast,
        currentPropertyId,
        setCurrentPropertyId,
        importedPlot,
        setImportedPlot,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
