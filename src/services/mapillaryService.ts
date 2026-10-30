// PropWise Street Explorer Service
// Powered by Mapillary Open Street-Level Imagery Platform & MapillaryJS

export interface StreetImageResult {
  available: boolean;
  id?: string;
  lat?: number;
  lng?: number;
  capturedAt?: string;
  compassAngle?: number;
  isPano?: boolean;
  sequenceId?: string;
  error?: string;
}

export interface CoverageSegment {
  id: string;
  sequenceId: string;
  coordinates: Array<[number, number]>; // [lat, lng]
  imageCount: number;
  isPano?: boolean;
}

// Default open client token for Mapillary API v4
const DEFAULT_MAPILLARY_TOKEN = 'MLY|8254215847954930|7b752b5cb8879659b8d27771239999a4';

export function getMapillaryToken(): string {
  return import.meta.env.VITE_MAPILLARY_ACCESS_TOKEN || DEFAULT_MAPILLARY_TOKEN;
}

/**
 * Fetches actual street coverage lines for the visible bounding box from Mapillary API
 */
export async function fetchMapillaryCoverage(bbox: {
  south: number;
  west: number;
  north: number;
  east: number;
}): Promise<CoverageSegment[]> {
  const token = getMapillaryToken();
  if (!token) return [];

  try {
    const url = `https://graph.mapillary.com/images?fields=id,computed_geometry,sequence,compass_angle,is_pano,captured_at&bbox=${bbox.west},${bbox.south},${bbox.east},${bbox.north}&limit=500&access_token=${token}`;
    const res = await fetch(url);
    if (!res.ok) return [];

    const json = await res.json();
    if (!json.data || !Array.isArray(json.data) || json.data.length === 0) {
      return [];
    }

    // Group images by sequence ID to form connected road/street line segments
    const sequences: Record<
      string,
      {
        pts: Array<{ lat: number; lng: number; id: string }>;
        isPano: boolean;
      }
    > = {};

    json.data.forEach((img: any) => {
      const seqId = img.sequence || `seq-${img.id}`;
      const coords = img.computed_geometry?.coordinates;
      if (coords && coords.length >= 2) {
        if (!sequences[seqId]) {
          sequences[seqId] = {
            pts: [],
            isPano: Boolean(img.is_pano)
          };
        }
        sequences[seqId].pts.push({
          lat: coords[1],
          lng: coords[0],
          id: img.id
        });
      }
    });

    const segments: CoverageSegment[] = [];

    Object.entries(sequences).forEach(([seqId, data]) => {
      const { pts, isPano } = data;
      if (pts.length >= 2) {
        segments.push({
          id: seqId,
          sequenceId: seqId,
          coordinates: pts.map((p) => [p.lat, p.lng]),
          imageCount: pts.length,
          isPano
        });
      } else if (pts.length === 1) {
        // Render small line stub for single capture points
        const p = pts[0];
        segments.push({
          id: seqId,
          sequenceId: seqId,
          coordinates: [
            [p.lat - 0.00008, p.lng - 0.00008],
            [p.lat + 0.00008, p.lng + 0.00008]
          ],
          imageCount: 1,
          isPano
        });
      }
    });

    return segments;
  } catch (err) {
    console.warn('Could not load Mapillary coverage for bbox:', err);
    return [];
  }
}

/**
 * Finds the nearest genuine Mapillary street-level image near a coordinate.
 * STRICT: Returns available: false if no imagery exists. NEVER returns fake or random images.
 */
export async function findNearestMapillaryImage(
  lat: number,
  lng: number,
  radiusMeters = 350
): Promise<StreetImageResult> {
  const token = getMapillaryToken();
  if (!token) {
    return {
      available: false,
      error: 'Mapillary access token is missing.'
    };
  }

  try {
    const searchUrl = `https://graph.mapillary.com/images?fields=id,computed_geometry,captured_at,compass_angle,is_pano,sequence&closeto=${lng},${lat}&radius=${radiusMeters}&limit=1&access_token=${token}`;
    const res = await fetch(searchUrl);

    if (res.ok) {
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        const item = json.data[0];
        const coords = item.computed_geometry?.coordinates;
        const imgLat = coords ? coords[1] : lat;
        const imgLng = coords ? coords[0] : lng;

        return {
          available: true,
          id: item.id,
          lat: imgLat,
          lng: imgLng,
          capturedAt: item.captured_at
            ? new Date(item.captured_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })
            : undefined,
          compassAngle: item.compass_angle ? Math.round(item.compass_angle) : undefined,
          isPano: Boolean(item.is_pano),
          sequenceId: item.sequence
        };
      }
    }
  } catch (err) {
    console.warn('Mapillary search request failed:', err);
  }

  // If no genuine Mapillary imagery is found at this coordinate, return available: false
  return {
    available: false,
    error: 'No street-level imagery available nearby. Try selecting a blue-covered street.'
  };
}
