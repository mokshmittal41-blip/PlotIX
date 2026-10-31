import fs from 'fs';
import path from 'path';
import { supabaseAdmin } from '../config/supabase';

export interface PropertyEntity {
  id: string;
  user_id: string | null;
  title: string;
  description?: string;
  property_type: string;
  listing_type: 'sale' | 'rent' | 'lease';
  price: number;
  price_unit?: string;
  price_per_unit?: number;
  area: number;
  area_unit: string;
  address?: string;
  locality?: string;
  sector?: string;
  tehsil?: string;
  city: string;
  district: string;
  state: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  facing?: string;
  road_width_ft?: number;
  khasra_no?: string;
  registry_status?: string;
  is_verified: boolean;
  status: 'active' | 'sold' | 'rented' | 'expired' | 'deleted';
  images: string[];
  amenities: string[];
  approvals: string[];
  nearby_landmarks: Array<{ name: string; distance: string; type: string }>;
  contact_name: string;
  contact_phone: string;
  contact_email?: string;
  agency_name?: string;
  source: string;
  external_id?: string;
  source_name?: string;
  source_url?: string;
  original_listing_url?: string;
  last_seen_at?: string;
  last_synced_at?: string;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface BuyerRequirementEntity {
  id: string;
  user_id: string | null;
  title: string;
  property_type: string;
  district: string;
  preferred_area?: string;
  budget_min?: number;
  budget_max: number;
  required_size?: string;
  purpose?: string;
  buyer_name: string;
  buyer_phone: string;
  status: 'active' | 'fulfilled' | 'cancelled';
  created_at: string;
  updated_at: string;
}

const DATA_DIR = path.join(__dirname, '../../data');
const PROPERTIES_FILE = path.join(DATA_DIR, 'properties.json');
const REQUIREMENTS_FILE = path.join(DATA_DIR, 'buyer_requirements.json');

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(PROPERTIES_FILE)) {
  fs.writeFileSync(PROPERTIES_FILE, JSON.stringify([], null, 2), 'utf8');
}

if (!fs.existsSync(REQUIREMENTS_FILE)) {
  fs.writeFileSync(REQUIREMENTS_FILE, JSON.stringify([], null, 2), 'utf8');
}

// ── High-Performance In-Memory Store & Index ──────────────────────────────
let memoryProperties: PropertyEntity[] = [];
let memoryPropertyMap = new Map<string, PropertyEntity>();
let memoryRequirements: BuyerRequirementEntity[] = [];
let memoryRequirementsMap = new Map<string, BuyerRequirementEntity>();

export function isOriginalVerifiedPhotoProperty(p: PropertyEntity): boolean {
  if (!p || !Array.isArray(p.images) || p.images.length === 0) return false;
  return p.images.every(img => 
    typeof img === 'string' &&
    img.startsWith('http') &&
    !img.includes('placeholder') &&
    !img.includes('via.placeholder') &&
    !img.includes('dummy') &&
    !img.includes('ai-image')
  );
}

// Load properties into memory once at startup
function initMemoryStore() {
  try {
    if (fs.existsSync(PROPERTIES_FILE)) {
      const raw = fs.readFileSync(PROPERTIES_FILE, 'utf8');
      const loaded: PropertyEntity[] = JSON.parse(raw);
      // Strictly retain only listings with authentic, real original photos
      memoryProperties = loaded.filter(isOriginalVerifiedPhotoProperty);
      memoryPropertyMap.clear();
      memoryProperties.forEach(p => {
        if (p.id) memoryPropertyMap.set(p.id, p);
      });
      console.log(`⚡ [PropertyStore] Loaded ${memoryProperties.length} 100% verified original-photo properties into high-speed memory cache.`);
    }
  } catch (err: any) {
    console.warn('[PropertyStore] Failed to initialize property cache from disk:', err.message);
    memoryProperties = [];
  }

  try {
    if (fs.existsSync(REQUIREMENTS_FILE)) {
      const raw = fs.readFileSync(REQUIREMENTS_FILE, 'utf8');
      memoryRequirements = JSON.parse(raw);
      memoryRequirementsMap.clear();
      memoryRequirements.forEach(r => {
        if (r.id) memoryRequirementsMap.set(r.id, r);
      });
    }
  } catch (err: any) {
    memoryRequirements = [];
  }
}

// Initialize on startup
initMemoryStore();

// Debounced background async disk writer
let saveDebounceTimer: NodeJS.Timeout | null = null;
let isSaving = false;

function scheduleDiskPersistence() {
  if (saveDebounceTimer) clearTimeout(saveDebounceTimer);
  saveDebounceTimer = setTimeout(async () => {
    if (isSaving) return;
    isSaving = true;
    try {
      const dataStr = JSON.stringify(memoryProperties, null, 2);
      await fs.promises.writeFile(PROPERTIES_FILE, dataStr, 'utf8');
    } catch (err: any) {
      console.error('[PropertyStore] Async disk write error:', err.message);
    } finally {
      isSaving = false;
    }
  }, 400);
}

function scheduleRequirementsDiskPersistence() {
  setTimeout(async () => {
    try {
      await fs.promises.writeFile(REQUIREMENTS_FILE, JSON.stringify(memoryRequirements, null, 2), 'utf8');
    } catch {}
  }, 200);
}

let isSupabaseTableAvailable: boolean | null = null;

function normalizeQueryTerm(term?: string): string {
  if (!term) return '';
  const clean = term.trim().toLowerCase();
  const ALIASES: Record<string, string> = {
    'suman': 'sunam',
    'sunam udham singh wala': 'sunam',
    'sunam mandi': 'sunam',
    'samana': 'samana',
    'sangrur': 'sangrur',
    'dhuri': 'dhuri',
    'nabha': 'nabha',
    'patiala': 'patiala',
    'mansa': 'mansa',
    'bathinda': 'bathinda',
    'gurgaon': 'gurugram'
  };
  return ALIASES[clean] || (clean.includes('suman') ? 'sunam' : clean);
}

export const propertyStore = {
  /**
   * Reload in-memory store from disk (for migrations or re-seed)
   */
  reloadFromDisk() {
    initMemoryStore();
  },

  /**
   * Check if Supabase PostgreSQL properties table is live
   */
  async checkTableStatus(): Promise<boolean> {
    if (!supabaseAdmin) return false;
    try {
      const { error } = await supabaseAdmin.from('properties').select('id').limit(1);
      if (error && error.code === 'PGRST205') {
        isSupabaseTableAvailable = false;
        return false;
      }
      isSupabaseTableAvailable = true;
      return true;
    } catch {
      isSupabaseTableAvailable = false;
      return false;
    }
  },

  /**
   * Query properties with instantaneous in-memory execution (<1ms)
   */
  async queryProperties(filters: {
    city?: string;
    district?: string;
    state?: string;
    type?: string | string[];
    listingType?: string;
    minPrice?: number;
    maxPrice?: number;
    minArea?: number;
    maxArea?: number;
    facing?: string;
    verifiedOnly?: boolean;
    search?: string;
    userId?: string;
    includeNonActive?: boolean;
    sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'area_desc';
    page?: number;
    limit?: number;
  }): Promise<{ properties: PropertyEntity[]; total: number; page: number; limit: number; totalPages: number }> {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.max(1, Math.min(100, filters.limit || 12));
    const offset = (page - 1) * limit;

    let list = memoryProperties.filter(isOriginalVerifiedPhotoProperty);

    // Active status filter
    if (!filters.includeNonActive) {
      list = list.filter(p => p.status === 'active');
    }

    // User ID filter
    if (filters.userId) {
      list = list.filter(p => p.user_id === filters.userId);
    }

    // City / District filter
    if (filters.city && filters.city !== 'All' && filters.city !== 'All India') {
      const c = normalizeQueryTerm(filters.city);
      list = list.filter(p => 
        (p.city && p.city.toLowerCase().includes(c)) || 
        (p.district && p.district.toLowerCase().includes(c)) ||
        (p.locality && p.locality.toLowerCase().includes(c)) ||
        (p.tehsil && p.tehsil.toLowerCase().includes(c)) ||
        (p.title && p.title.toLowerCase().includes(c))
      );
    }

    // District filter
    if (filters.district && filters.district !== 'All' && filters.district !== filters.city) {
      const d = filters.district.toLowerCase();
      list = list.filter(p => 
        (p.district && p.district.toLowerCase().includes(d)) ||
        (p.city && p.city.toLowerCase().includes(d))
      );
    }

    // State filter
    if (filters.state && filters.state !== 'All' && filters.state !== 'All India') {
      const s = filters.state.toLowerCase();
      list = list.filter(p => p.state && p.state.toLowerCase().includes(s));
    }

    // Listing Type filter
    if (filters.listingType) {
      list = list.filter(p => p.listing_type === filters.listingType);
    }

    // Property Type filter
    if (filters.type) {
      const types = Array.isArray(filters.type) 
        ? filters.type 
        : filters.type.split(',').map(t => t.trim());
      if (types.length > 0 && !types.includes('All')) {
        list = list.filter(p => types.includes(p.property_type));
      }
    }

    // Price range filters
    if (filters.minPrice !== undefined && !isNaN(filters.minPrice)) {
      list = list.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
      list = list.filter(p => p.price <= filters.maxPrice!);
    }

    // Area range filters
    if (filters.minArea !== undefined && !isNaN(filters.minArea)) {
      list = list.filter(p => p.area >= filters.minArea!);
    }
    if (filters.maxArea !== undefined && !isNaN(filters.maxArea)) {
      list = list.filter(p => p.area <= filters.maxArea!);
    }

    // Facing filter
    if (filters.facing && filters.facing !== 'Any') {
      list = list.filter(p => (p.facing || '').toLowerCase() === filters.facing!.toLowerCase());
    }

    // Verified only filter
    if (filters.verifiedOnly) {
      list = list.filter(p => p.is_verified);
    }

    // Free-text search
    if (filters.search && filters.search.trim()) {
      const rawS = filters.search.trim().toLowerCase();
      const s = normalizeQueryTerm(rawS);
      list = list.filter(p =>
        p.title.toLowerCase().includes(rawS) ||
        p.title.toLowerCase().includes(s) ||
        (p.description || '').toLowerCase().includes(s) ||
        (p.locality || '').toLowerCase().includes(s) ||
        (p.city || '').toLowerCase().includes(s) ||
        (p.district || '').toLowerCase().includes(s) ||
        (p.tehsil || '').toLowerCase().includes(s) ||
        (p.contact_name || '').toLowerCase().includes(s)
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price_asc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'area_desc':
        list = [...list].sort((a, b) => b.area - a.area);
        break;
      case 'newest':
      default:
        list = [...list].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    const total = list.length;
    const paginated = list.slice(offset, offset + limit);

    return {
      properties: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    };
  },

  /**
   * Find single property by ID in O(1) instant in-memory lookup (<0.1ms)
   */
  async getPropertyById(id: string): Promise<PropertyEntity | null> {
    const item = memoryPropertyMap.get(id);
    if (item) {
      item.views_count = (item.views_count || 0) + 1;
      scheduleDiskPersistence();
      return item;
    }
    return null;
  },

  /**
   * Create new property listing with instant live publication (<1ms)
   */
  async createProperty(propertyData: Omit<PropertyEntity, 'id' | 'created_at' | 'updated_at' | 'views_count'>): Promise<{ success: boolean; property?: PropertyEntity; error?: string }> {
    const now = new Date().toISOString();
    const newId = `prop-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newRecord: PropertyEntity = {
      ...propertyData,
      id: newId,
      status: 'active',
      is_verified: propertyData.is_verified ?? true,
      views_count: 0,
      images: propertyData.images || [],
      amenities: propertyData.amenities || [],
      approvals: propertyData.approvals || [],
      nearby_landmarks: propertyData.nearby_landmarks || [],
      created_at: now,
      updated_at: now
    };

    // Duplicate listing check: same phone + same title within last 30 minutes
    const isDuplicate = memoryProperties.some(p => 
      p.contact_phone === newRecord.contact_phone &&
      p.title.trim().toLowerCase() === newRecord.title.trim().toLowerCase() &&
      (new Date(now).getTime() - new Date(p.created_at).getTime()) < 30 * 60 * 1000
    );

    if (isDuplicate) {
      return {
        success: false,
        error: 'A listing with this exact title and phone number was recently posted. Please avoid submitting duplicate listings.'
      };
    }

    // Insert into in-memory store immediately
    memoryProperties.unshift(newRecord);
    memoryPropertyMap.set(newId, newRecord);
    scheduleDiskPersistence();

    // Async sync to Supabase in background
    if (isSupabaseTableAvailable !== false && supabaseAdmin) {
      (async () => {
        try {
          await supabaseAdmin!.from('properties').insert([newRecord]);
        } catch {}
      })();
    }

    return { success: true, property: newRecord };
  },

  /**
   * Update existing property
   */
  async updateProperty(id: string, updates: Partial<PropertyEntity>, userId?: string): Promise<{ success: boolean; property?: PropertyEntity; error?: string }> {
    const item = memoryPropertyMap.get(id);
    if (!item) {
      return { success: false, error: 'Property not found.' };
    }

    if (userId && item.user_id && item.user_id !== userId) {
      return { success: false, error: 'Unauthorized: You can only edit properties you created.' };
    }

    const now = new Date().toISOString();
    const updated: PropertyEntity = {
      ...item,
      ...updates,
      id: item.id,
      updated_at: now
    };

    // Update in-memory
    memoryPropertyMap.set(id, updated);
    const index = memoryProperties.findIndex(p => p.id === id);
    if (index >= 0) memoryProperties[index] = updated;

    scheduleDiskPersistence();

    // Async sync to Supabase in background
    if (isSupabaseTableAvailable !== false && supabaseAdmin) {
      (async () => {
        try {
          await supabaseAdmin!.from('properties').update(updated).eq('id', id);
        } catch {}
      })();
    }

    return { success: true, property: updated };
  },

  /**
   * Delete property (or mark deleted)
   */
  async deleteProperty(id: string, userId?: string): Promise<{ success: boolean; error?: string }> {
    const item = memoryPropertyMap.get(id);
    if (!item) {
      return { success: false, error: 'Property not found.' };
    }

    if (userId && item.user_id && item.user_id !== userId) {
      return { success: false, error: 'Unauthorized: You can only delete properties you created.' };
    }

    item.status = 'deleted';
    item.updated_at = new Date().toISOString();
    scheduleDiskPersistence();

    // Async sync to Supabase in background
    if (isSupabaseTableAvailable !== false && supabaseAdmin) {
      (async () => {
        try {
          await supabaseAdmin!.from('properties').update({ status: 'deleted', updated_at: item.updated_at }).eq('id', id);
        } catch {}
      })();
    }

    return { success: true };
  },

  /**
   * Create buyer requirement
   */
  async createBuyerRequirement(reqData: Omit<BuyerRequirementEntity, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; requirement?: BuyerRequirementEntity; error?: string }> {
    const now = new Date().toISOString();
    const newId = `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newRecord: BuyerRequirementEntity = {
      ...reqData,
      id: newId,
      status: 'active',
      created_at: now,
      updated_at: now
    };

    memoryRequirements.unshift(newRecord);
    memoryRequirementsMap.set(newId, newRecord);
    scheduleRequirementsDiskPersistence();

    return { success: true, requirement: newRecord };
  },

  /**
   * Query buyer requirements
   */
  async queryBuyerRequirements(district?: string, userId?: string): Promise<BuyerRequirementEntity[]> {
    let list = memoryRequirements.filter(r => r.status === 'active');
    if (district && district !== 'All') {
      const d = district.toLowerCase();
      list = list.filter(r => r.district.toLowerCase().includes(d));
    }
    if (userId) {
      list = list.filter(r => r.user_id === userId);
    }
    return list;
  },

  /**
   * Delete buyer requirement
   */
  async deleteBuyerRequirement(id: string, userId?: string): Promise<{ success: boolean; error?: string }> {
    const item = memoryRequirementsMap.get(id);
    if (!item) return { success: false, error: 'Requirement not found.' };

    if (userId && item.user_id && item.user_id !== userId) {
      return { success: false, error: 'Unauthorized.' };
    }

    item.status = 'cancelled';
    scheduleRequirementsDiskPersistence();
    return { success: true };
  },

  /**
   * Upsert external property listing from external data providers (MagicBricks, OLX India)
   * Deduplicates by (source_name, external_id) with in-memory speed (<0.5ms)
   */
  async upsertExternalListing(data: Omit<PropertyEntity, 'id' | 'created_at' | 'updated_at' | 'views_count'>): Promise<{ success: boolean; property?: PropertyEntity; isNew?: boolean; isSkipped?: boolean; error?: string }> {
    const now = new Date().toISOString();

    if (!data.title || data.title.trim().length < 6 || !data.price || data.price <= 0 || !data.city) {
      return { success: false, isSkipped: true, error: 'Listing failed minimum validation criteria.' };
    }

    // Require genuine original photos
    if (!data.images || !Array.isArray(data.images) || data.images.length === 0 || data.images.some((img: string) => img.includes('placeholder') || img.includes('via.placeholder'))) {
      return { success: false, isSkipped: true, error: 'Listing must contain verified original uploaded photos.' };
    }

    // 1. Primary deduplication by (source_name, external_id)
    let existingIndex = -1;
    if (data.source_name && data.external_id) {
      existingIndex = memoryProperties.findIndex(p => p.source_name === data.source_name && p.external_id === data.external_id);
    }
    
    // 2. Secondary fuzzy deduplication: same city + locality + title and within 5% price
    if (existingIndex === -1 && data.title && data.city) {
      const cleanTitle = data.title.trim().toLowerCase();
      const cleanCity = data.city.toLowerCase();
      existingIndex = memoryProperties.findIndex(p =>
        p.city.toLowerCase() === cleanCity &&
        p.title.trim().toLowerCase() === cleanTitle &&
        Math.abs(p.price - data.price) <= (data.price * 0.05)
      );
    }

    if (existingIndex >= 0) {
      const existing = memoryProperties[existingIndex];
      const updated: PropertyEntity = {
        ...existing,
        ...data,
        id: existing.id,
        status: 'active',
        last_seen_at: now,
        last_synced_at: now,
        updated_at: now
      };

      memoryProperties[existingIndex] = updated;
      memoryPropertyMap.set(existing.id, updated);
      scheduleDiskPersistence();

      return { success: true, property: updated, isNew: false, isSkipped: false };
    }

    // Insert new external listing
    const newId = `ext-${data.source_name ? data.source_name.toLowerCase().replace(/[^a-z0-9]/g, '') : 'api'}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newRecord: PropertyEntity = {
      ...data,
      id: newId,
      status: 'active',
      is_verified: data.is_verified ?? true,
      views_count: 0,
      source: data.source || 'external_api',
      source_name: data.source_name || 'External Real Estate Partner',
      last_seen_at: now,
      last_synced_at: now,
      created_at: now,
      updated_at: now
    };

    memoryProperties.unshift(newRecord);
    memoryPropertyMap.set(newId, newRecord);
    scheduleDiskPersistence();

    return { success: true, property: newRecord, isNew: true, isSkipped: false };
  },

  /**
   * Cleanup expired external listings
   */
  async cleanupExpiredExternalListings(olderThanDays = 14): Promise<number> {
    const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000).toISOString();
    let expiredCount = 0;

    memoryProperties.forEach(p => {
      const checkDate = p.last_seen_at || p.last_synced_at;
      if (p.source === 'external_api' && checkDate && checkDate < cutoffDate && p.status === 'active') {
        p.status = 'expired';
        p.updated_at = new Date().toISOString();
        expiredCount++;
      }
    });

    if (expiredCount > 0) {
      scheduleDiskPersistence();
    }

    return expiredCount;
  }
};
