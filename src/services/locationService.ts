import type { LocationResult, PlaceIntelligence, NearbyPlace } from '../types/location';

// Top regional Punjab, Haryana, Chandigarh, and North India localities for instant offline search & fallback
const LOCAL_INDIA_LOCATIONS: LocationResult[] = [
  { id: 'loc-rajpura', name: 'Rajpura, Punjab', type: 'Industrial & Residential City', locality: 'Main City', city: 'Rajpura', state: 'Punjab', coordinates: [30.4839, 76.5939] },
  { id: 'loc-rajpura-it', name: 'IT & Industrial Area, Rajpura', type: 'Industrial Corridor', locality: 'Industrial Focal Point', city: 'Rajpura', state: 'Punjab', coordinates: [30.4950, 76.6020] },
  { id: 'loc-1', name: 'Sector 82, Mohali', type: 'Residential & IT Hub', locality: 'Sector 82', city: 'SAS Nagar (Mohali)', state: 'Punjab', coordinates: [30.6799, 76.7221] },
  { id: 'loc-2', name: 'Sector 20, Panchkula', type: 'Prime Residential', locality: 'Sector 20', city: 'Panchkula', state: 'Haryana', coordinates: [30.6865, 76.8524] },
  { id: 'loc-3', name: 'Bathinda Bypass (Growth Corridor)', type: 'Commercial Corridor', locality: 'Bypass Road', city: 'Bathinda', state: 'Punjab', coordinates: [30.2110, 74.9455] },
  { id: 'loc-4', name: 'Aerocity, Mohali', type: 'Airport Corridor', locality: 'Aerocity', city: 'SAS Nagar (Mohali)', state: 'Punjab', coordinates: [30.6385, 76.7904] },
  { id: 'loc-5', name: 'Sector 17, Chandigarh', type: 'City Center Plaza', locality: 'Sector 17', city: 'Chandigarh', state: 'Chandigarh', coordinates: [30.7415, 76.7794] },
  { id: 'loc-6', name: 'Model Town, Ludhiana', type: 'Prime Residential', locality: 'Model Town', city: 'Ludhiana', state: 'Punjab', coordinates: [30.8873, 75.8361] },
  { id: 'loc-7', name: 'Ranjit Avenue, Amritsar', type: 'Commercial Hub', locality: 'Ranjit Avenue', city: 'Amritsar', state: 'Punjab', coordinates: [31.6508, 74.8624] },
  { id: 'loc-8', name: 'Urban Estate Phase 2, Jalandhar', type: 'Residential Locality', locality: 'Urban Estate', city: 'Jalandhar', state: 'Punjab', coordinates: [31.3060, 75.5960] },
  { id: 'loc-9', name: 'Leela Bhawan, Patiala', type: 'Commercial Hub', locality: 'Leela Bhawan', city: 'Patiala', state: 'Punjab', coordinates: [30.3398, 76.3869] },
  { id: 'loc-10', name: 'New Chandigarh (Mullanpur)', type: 'Eco City Expansion', locality: 'New Chandigarh', city: 'Mohali', state: 'Punjab', coordinates: [30.8040, 76.7550] },
  { id: 'loc-11', name: 'GT Road, Bathinda', type: 'Commercial', locality: 'GT Road', city: 'Bathinda', state: 'Punjab', coordinates: [30.2120, 74.9520] },
  { id: 'loc-12', name: 'IT Park, Chandigarh', type: 'Technology Park', locality: 'Manimajra', city: 'Chandigarh', state: 'Chandigarh', coordinates: [30.7258, 76.8436] },
  { id: 'loc-zirakpur', name: 'VIP Road, Zirakpur', type: 'Commercial & High Rise', locality: 'VIP Road', city: 'Zirakpur', state: 'Punjab', coordinates: [30.6425, 76.8173] },
  { id: 'loc-kharar', name: 'Kharar, Mohali', type: 'Urban Extension', locality: 'Main Kharar', city: 'Kharar', state: 'Punjab', coordinates: [30.7450, 76.6450] },
  { id: 'loc-derabassi', name: 'Dera Bassi, Punjab', type: 'Industrial & Housing', locality: 'Main Area', city: 'Dera Bassi', state: 'Punjab', coordinates: [30.5850, 76.8450] },
  { id: 'loc-mandi-gobindgarh', name: 'Mandi Gobindgarh', type: 'Steel City', locality: 'Main Town', city: 'Fatehgarh Sahib', state: 'Punjab', coordinates: [30.6650, 76.2980] },
  { id: 'loc-sirhind', name: 'Sirhind, Punjab', type: 'Historical Town', locality: 'Sirhind', city: 'Fatehgarh Sahib', state: 'Punjab', coordinates: [30.6380, 76.3850] },
  { id: 'loc-phagwara', name: 'Phagwara, Punjab', type: 'Educational & Commercial Hub', locality: 'Phagwara', city: 'Kapurthala', state: 'Punjab', coordinates: [31.2240, 75.7708] },
  { id: 'loc-khanna', name: 'Khanna, Punjab', type: 'Asia Largest Grain Market', locality: 'Khanna', city: 'Ludhiana', state: 'Punjab', coordinates: [30.7070, 76.2160] }
];

export const locationService = {
  /**
   * Search for a location using Komoot Photon API (CORS-friendly, no rate limits) with local fast-index fallback.
   */
  async searchLocation(query: string): Promise<LocationResult[]> {
    if (!query.trim() || query.length < 2) return [];

    const lowerQuery = query.toLowerCase().trim();

    // 1. Check local indexed matches first
    const localMatches = LOCAL_INDIA_LOCATIONS.filter(
      loc => loc.name.toLowerCase().includes(lowerQuery) ||
             loc.city.toLowerCase().includes(lowerQuery) ||
             loc.locality.toLowerCase().includes(lowerQuery) ||
             loc.state.toLowerCase().includes(lowerQuery)
    );

    // 2. Try Komoot Photon API (Official OSM Open Search API with full CORS header support: Access-Control-Allow-Origin: *)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=8&lang=en`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.features) && data.features.length > 0) {
          const photonResults: LocationResult[] = data.features.map((feature: any, idx: number) => {
            const props = feature.properties || {};
            const coords = feature.geometry?.coordinates || [76.7221, 30.6799]; // [lon, lat] in GeoJSON
            const name = props.name || query;
            const city = props.city || props.district || props.county || props.town || '';
            const state = props.state || 'Punjab';
            const locality = props.street || props.locality || props.suburb || city || name;
            const displayName = [name, city, state].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(', ');

            let type = 'Location';
            if (props.type === 'city' || props.type === 'town') type = 'City / Town';
            else if (props.type === 'locality' || props.type === 'suburb') type = 'Locality';
            else if (props.type === 'street' || props.osm_key === 'highway') type = 'Road';
            else if (props.osm_key === 'amenity' || props.osm_key === 'building') type = 'Landmark';

            return {
              id: `photon-${props.osm_id || idx}-${Date.now()}`,
              name: displayName,
              type,
              locality,
              city: city || 'Punjab',
              state,
              coordinates: [coords[1], coords[0]] // Convert [lon, lat] to [lat, lon]
            };
          });

          if (photonResults.length > 0) {
            return photonResults;
          }
        }
      }
    } catch {
      // Ignore network timeout silently
    }

    if (localMatches.length > 0) return localMatches;

    return [
      {
        id: `loc-custom-${Date.now()}`,
        name: query,
        type: 'Searched Area',
        locality: query,
        city: 'Punjab',
        state: 'Punjab',
        coordinates: [30.6799, 76.7221]
      }
    ];
  },

  /**
   * High-accuracy multi-tier reverse geocode using coordinates (Fast, CORS-free, zero rate limit).
   * Cascade: BigDataCloud -> Komoot Photon -> OpenStreetMap JSONv2 -> Dynamic Coordinates Fallback.
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<{
    locality: string;
    city: string;
    district?: string;
    tehsil?: string;
    state: string;
    country: string;
    displayName: string;
  }> {
    // 1. Tier 1: Try BigDataCloud reverse geocode (fast, 100% CORS-friendly, zero rate limit)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const country = data.countryName || 'India';
        const state = data.principalSubdivision || 
          data.localityInfo?.administrative?.find((a: any) => a.adminLevel === 4)?.name || 
          'Haryana';
        
        // Find district from administrative levels (adminLevel 5 or 6, or city)
        const districtAdmin = data.localityInfo?.administrative?.find(
          (a: any) => (a.adminLevel === 5 || a.adminLevel === 6) && 
                      (a.description?.toLowerCase().includes('district') || a.name?.toLowerCase().includes('district'))
        );
        const rawDistrict = districtAdmin?.name || 
          data.localityInfo?.administrative?.find((a: any) => a.adminLevel === 5)?.name || 
          data.city || 
          data.locality;
        const district = rawDistrict ? rawDistrict.replace(/\s+district/i, '').trim() : (data.city || 'District Area');

        // Find tehsil from administrative levels
        const tehsilAdmin = data.localityInfo?.administrative?.find(
          (a: any) => a.adminLevel === 6 && a.description?.toLowerCase().includes('tehsil')
        );
        const tehsil = tehsilAdmin?.name ? tehsilAdmin.name.replace(/\s+tehsil/i, '').trim() : district;

        // Locality / Town / Village
        const locality = data.locality || 
          data.localityInfo?.administrative?.find((a: any) => a.adminLevel >= 7)?.name || 
          data.city || 
          district;

        const city = data.city || district || locality;

        const parts = [locality, district !== locality ? district : '', state].filter(Boolean);
        const displayName = parts.filter((v, i, a) => a.indexOf(v) === i).join(', ');

        return {
          locality,
          city,
          district,
          tehsil,
          state,
          country,
          displayName: displayName || `${district}, ${state}`
        };
      }
    } catch {
      // Fall through to Tier 2
    }

    // 2. Tier 2: Try Komoot Photon Reverse API (OpenStreetMap-based, fast, CORS-supported)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(
        `https://photon.komoot.io/reverse?lat=${latitude}&lon=${longitude}`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.features) && data.features.length > 0) {
          const props = data.features[0].properties || {};
          const state = props.state || props.county || 'Haryana';
          const city = props.city || props.town || props.district || props.county || 'City';
          const district = props.district || props.city || props.county || city;
          const locality = props.name || props.street || props.locality || props.suburb || city;
          const country = props.country || 'India';

          const parts = [locality, city !== locality ? city : '', state].filter(Boolean);
          const displayName = parts.filter((v, i, a) => a.indexOf(v) === i).join(', ');

          return {
            locality,
            city,
            district,
            tehsil: district,
            state,
            country,
            displayName: displayName || `${city}, ${state}`
          };
        }
      }
    } catch {
      // Fall through to Tier 3
    }

    // 3. Tier 3: Try OpenStreetMap Nominatim reverse
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const state = addr.state || 'Haryana';
        const district = (addr.state_district || addr.county || addr.district || addr.city || 'District').replace(/\s+district/i, '').trim();
        const city = addr.city || addr.town || addr.municipality || district;
        const locality = addr.suburb || addr.neighbourhood || addr.village || addr.road || data.name || city;
        const country = addr.country || 'India';

        const parts = [locality, city !== locality ? city : '', state].filter(Boolean);
        const displayName = parts.filter((v, i, a) => a.indexOf(v) === i).join(', ');

        return {
          locality,
          city,
          district,
          tehsil: addr.subdistrict || district,
          state,
          country,
          displayName: displayName || `${city}, ${state}`
        };
      }
    } catch {
      // Fall through
    }

    // 4. Tier 4: Fallback based on coordinates without fake hardcoded city names
    const latFixed = latitude.toFixed(4);
    const lngFixed = longitude.toFixed(4);
    return {
      locality: `Location (${latFixed}, ${lngFixed})`,
      city: 'Current Area',
      district: 'Local Region',
      tehsil: 'Local Area',
      state: latitude > 29.5 ? 'Punjab' : (latitude > 27.5 ? 'Haryana' : 'India'),
      country: 'India',
      displayName: `GPS (${latFixed}, ${lngFixed})`
    };
  },

  /**
   * Resilient IP-based location detection cascade (ipwho.is -> freeipapi.com -> ipapi.co).
   */
  async detectLocationByIP(): Promise<{
    city: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
  }> {
    // 1. Try ipwho.is (CORS enabled, highly accurate in India, zero rate limits)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch('https://ipwho.is/', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && typeof data.latitude === 'number') {
          return {
            city: data.city || 'Regional Center',
            state: data.region || 'Haryana',
            country: data.country || 'India',
            latitude: data.latitude,
            longitude: data.longitude
          };
        }
      }
    } catch {
      // Fall through to second IP provider
    }

    // 2. Try freeipapi.com (CORS enabled, fast fallback)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch('https://freeipapi.com/api/json', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.latitude === 'number' && data.latitude !== 0) {
          return {
            city: data.cityName || 'Regional Center',
            state: data.regionName || 'Haryana',
            country: data.countryName || 'India',
            latitude: data.latitude,
            longitude: data.longitude
          };
        }
      }
    } catch {
      // Fall through to third IP provider
    }

    // 3. Try ipapi.co (Third fallback)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.latitude === 'number') {
          return {
            city: data.city || 'Regional Center',
            state: data.region || 'Haryana',
            country: data.country_name || 'India',
            latitude: data.latitude,
            longitude: data.longitude
          };
        }
      }
    } catch {
      // Fall through
    }

    // Default regional coordinate center if network is completely down
    return {
      city: 'Rewari',
      state: 'Haryana',
      country: 'India',
      latitude: 28.1920,
      longitude: 76.6186
    };
  },

  /**
   * High-level unified current location detector.
   * Runs High Accuracy GPS -> Low Accuracy WiFi GPS -> IP Geolocation -> Reverse Geocoder.
   */
  async getUnifiedCurrentLocation(): Promise<{
    coordinates: [number, number];
    locality: string;
    city: string;
    district: string;
    tehsil?: string;
    state: string;
    country: string;
    displayName: string;
    source: 'gps' | 'ip';
    accuracy?: number;
  }> {
    // Helper to get browser position with configurable options
    const getPos = (opts: PositionOptions): Promise<GeolocationPosition> => {
      return new Promise((resolve, reject) => {
        if (typeof window === 'undefined' || !navigator.geolocation) {
          return reject(new Error('Geolocation not supported'));
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, opts);
      });
    };

    let lat: number | null = null;
    let lng: number | null = null;
    let accuracy: number | undefined;
    let source: 'gps' | 'ip' = 'gps';

    // 1. Try GPS High Accuracy
    try {
      const pos = await getPos({ enableHighAccuracy: true, timeout: 6000, maximumAge: 30000 });
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
      accuracy = pos.coords.accuracy;
      source = 'gps';
    } catch {
      // 2. Try GPS Low Accuracy (WiFi / Cellular quick triangulation)
      try {
        const pos = await getPos({ enableHighAccuracy: false, timeout: 5000, maximumAge: 120000 });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        accuracy = pos.coords.accuracy;
        source = 'gps';
      } catch {
        // 3. Fallback to IP-based Geolocation
        const ipLoc = await this.detectLocationByIP();
        lat = ipLoc.latitude;
        lng = ipLoc.longitude;
        source = 'ip';
      }
    }

    // Reverse geocode the resolved coordinates
    const geo = await this.reverseGeocode(lat, lng);

    return {
      coordinates: [lat, lng],
      locality: geo.locality,
      city: geo.city,
      district: geo.district || geo.city,
      tehsil: geo.tehsil || geo.district || geo.city,
      state: geo.state,
      country: geo.country,
      displayName: geo.displayName,
      source,
      accuracy
    };
  },

  /**
   * Mock service to get place intelligence based on the selected location.
   */
  async getPlaceIntelligence(location: LocationResult): Promise<PlaceIntelligence> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const isCity = location.type.toLowerCase().includes('city');
    const isHospital = location.type.toLowerCase().includes('hospital') || location.type.toLowerCase().includes('amenity');

    return {
      locationName: location.name,
      locality: location.locality || location.name,
      city: location.city || 'Unknown City',
      state: location.state || 'Unknown State',
      description: isCity 
        ? `A major urban center known for its growing infrastructure and diverse real estate options.`
        : isHospital
        ? `A prominent healthcare landmark in ${location.city}, driving local residential demand for medical professionals and convenient living.`
        : `A prominent locality in ${location.city} known for its connectivity and balanced lifestyle. Ideal for families and long-term investment.`,
      connectivity: [
        'Direct access to major arterial roads',
        'Public transport available within walking distance',
        'Highway connectivity nearby'
      ],
      education: 'Reputed schools and educational institutions within a 3-5 km radius.',
      healthcare: 'Multi-specialty hospitals and clinics available locally.',
      dailyLife: ['Local Markets', 'Supermarkets', 'Banks & ATMs', 'Parks'],
      shopping: ['High street retail', 'Neighborhood convenience stores'],
      recreation: ['Community parks', 'Fitness centers'],
      propertyMarket: {
        avgPrice: '₹4,500 - ₹6,500 / sq.ft',
        trend: '+8.4%',
        rentalYield: '3.2%',
        isDemo: true
      },
      futurePotential: [
        'Upcoming commercial hub planned within 2km.',
        'Proposed infrastructure upgrades to ease traffic.'
      ],
      investmentScore: {
        total: 78,
        connectivity: 85,
        development: 70,
        demand: 90,
        isDemo: true
      },
      pros: [
        'Well-connected to major hubs',
        'Strong community presence',
        'Good educational institutions nearby'
      ],
      considerations: [
        'Traffic during peak hours',
        'Ongoing construction in some pockets'
      ]
    };
  },

  /**
   * Mock service to get nearby places.
   */
  async getNearbyPlaces(location: LocationResult): Promise<NearbyPlace[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // Dynamic but deterministic mock data based on coordinates
    const baseLat = location.coordinates[0];
    const hash = Math.abs(Math.floor(baseLat * 100)) % 3;

    const mockSets: NearbyPlace[][] = [
      [
        { id: '1', name: 'Adesh Hospital', type: 'Hospital', distanceKm: 0.8 },
        { id: '2', name: 'DAV Public School', type: 'School', distanceKm: 1.4 },
        { id: '3', name: 'Central Market', type: 'Market', distanceKm: 2.1 },
        { id: '4', name: 'City Park', type: 'Park', distanceKm: 0.5 },
      ],
      [
        { id: '5', name: 'Max Super Speciality', type: 'Hospital', distanceKm: 1.2 },
        { id: '6', name: 'DPS International', type: 'School', distanceKm: 2.0 },
        { id: '7', name: 'Metro Station', type: 'Public Transport', distanceKm: 1.8 },
        { id: '8', name: 'Shopping Mall', type: 'Shopping', distanceKm: 3.5 },
      ],
      [
        { id: '9', name: 'Fortis Clinic', type: 'Hospital', distanceKm: 0.9 },
        { id: '10', name: 'Govt College', type: 'College', distanceKm: 2.5 },
        { id: '11', name: 'Railway Station', type: 'Public Transport', distanceKm: 4.2 },
        { id: '12', name: 'Local Grocers', type: 'Market', distanceKm: 0.3 },
      ]
    ];

    return mockSets[hash];
  }
};
