import { supabase } from '../lib/supabaseClient';

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000/api';

/**
 * Generic fetch wrapper attaching the Supabase JWT Bearer token to backend requests
 */
async function apiRequest<T = any>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string; pagination?: any; raw?: any }> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    let response: Response;
    try {
      response = await fetch(`${BACKEND_API_URL}${cleanEndpoint}`, {
        ...options,
        headers,
        signal: options.signal || controller.signal
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const json = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        error: json?.error || `Request failed with status ${response.status}`
      };
    }

    return {
      success: true,
      data: json?.data !== undefined ? json.data : json,
      pagination: json?.pagination,
      raw: json
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Unable to connect to backend server. Ensure backend is running on port 5000.'
    };
  }
}

export const apiClient = {
  // Check backend server health
  checkHealth: () => apiRequest('/health'),

  // Get current user and database profile from Supabase PostgreSQL
  getMe: () => apiRequest('/users/me'),

  // Get user profile
  getProfile: () => apiRequest('/users/profile'),

  // Update profile
  updateProfile: (profileData: { fullName?: string; phone?: string; avatarUrl?: string }) =>
    apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    }),

  // Sync profile after signup
  syncProfile: (data: { fullName?: string; phone?: string }) =>
    apiRequest('/users/sync-profile', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // ── Properties API ────────────────────────────────────────────────────────
  getProperties: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        if (Array.isArray(val)) {
          query.set(key, val.join(','));
        } else {
          query.set(key, String(val));
        }
      }
    });
    const qs = query.toString();
    return apiRequest(`/properties${qs ? `?${qs}` : ''}`);
  },

  getPropertyById: (id: string) => apiRequest(`/properties/${id}`),

  createProperty: (propertyData: any) =>
    apiRequest('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData)
    }),

  updateProperty: (id: string, updates: any) =>
    apiRequest(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    }),

  deleteProperty: (id: string) =>
    apiRequest(`/properties/${id}`, {
      method: 'DELETE'
    }),

  getMyListings: () => apiRequest('/properties/user/my-listings'),

  uploadPropertyImage: (dataBase64: string, fileName?: string, contentType?: string) =>
    apiRequest('/properties/upload-image', {
      method: 'POST',
      body: JSON.stringify({ dataBase64, fileName, contentType })
    }),

  syncProperties: (city?: string) =>
    apiRequest('/properties/sync', {
      method: 'POST',
      body: JSON.stringify({ city })
    }),

  getSyncStatus: () => apiRequest('/properties/sync/status'),

  // ── Buyer Requirements API ────────────────────────────────────────────────
  getBuyerRequirements: (district?: string) =>
    apiRequest(`/buyer-requirements${district ? `?district=${encodeURIComponent(district)}` : ''}`),

  getMyBuyerRequirements: () => apiRequest('/buyer-requirements/my-requirements'),

  createBuyerRequirement: (reqData: any) =>
    apiRequest('/buyer-requirements', {
      method: 'POST',
      body: JSON.stringify(reqData)
    }),

  deleteBuyerRequirement: (id: string) =>
    apiRequest(`/buyer-requirements/${id}`, {
      method: 'DELETE'
    })
};


