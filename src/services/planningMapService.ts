import type { POI } from './geoService'; // Reuse POI type

export interface PlanningDataStatus {
  available: boolean;
  reason?: string;
  source?: string;
}

export interface PlanningAreaContext {
  id: string;
  name: string;
  type: 'TP' | 'DP' | 'Village';
  boundaryStatus: PlanningDataStatus;
  landUseStatus: PlanningDataStatus;
  documentsStatus: PlanningDataStatus;
  center: [number, number];
  bounds: [number, number, number, number] | undefined;
  pois: POI[];
}

// Since we don't have official GIS boundaries or documents yet, this service handles graceful fallback.
export async function fetchPlanningAreaContext(
  state: string,
  district: string,
  cityOrTehsil: string,
  areaName: string,
  type: 'TP' | 'DP' | 'Village'
): Promise<PlanningAreaContext | null> {
  // Use existing Nominatim geocoding via geoService to get real coordinates
  const { geocodeLocation, fetchPOIs } = await import('./geoService');
  
  // Construct a search query based on type
  let query = '';
  if (type === 'Village') {
    query = `${areaName}, ${cityOrTehsil}, ${district}, ${state}, India`;
  } else {
    // For TP/DP, usually the city/district is enough to get the map to the right area, as specific scheme boundaries won't be on Nominatim.
    query = `${cityOrTehsil}, ${district}, ${state}, India`;
  }
  
  // First, try specific query
  let geoResult = await geocodeLocation(district, query);
  
  // Fallback to broader query if not found
  if (!geoResult && type !== 'Village') {
      geoResult = await geocodeLocation(district, `${district}, ${state}, India`);
  }

  if (!geoResult) {
    return null;
  }

  // Fetch real OSM context (roads, schools, etc.)
  const pois = await fetchPOIs(geoResult.lat, geoResult.lon, 3000);

  // Return the strict data structure enforcing the rules
  return {
    id: `${type.toLowerCase()}-${Date.now()}`,
    name: areaName,
    type,
    center: [geoResult.lat, geoResult.lon],
    bounds: geoResult.boundingBox,
    pois,
    boundaryStatus: {
      available: false,
      reason: "Official planning boundary data is unavailable for this area.",
    },
    landUseStatus: {
      available: false,
      reason: "Official zoning and land-use data is unavailable for this area.",
    },
    documentsStatus: {
      available: false,
      reason: "Official documents are unavailable for this area.",
    }
  };
}
