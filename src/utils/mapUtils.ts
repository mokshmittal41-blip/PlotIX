import type { Property } from '../types';

/**
 * Known fallback coordinates for major Indian cities & districts across all zones
 */
const CITY_COORDINATES: Record<string, [number, number]> = {
  // ─── PUNJAB ───
  'sunam': [30.1340, 75.8080],
  'sangrur': [30.2458, 75.8421],
  'samana': [30.1583, 76.1917],
  'nabha': [30.3750, 76.1528],
  'patiala': [30.3398, 76.3869],
  'bathinda': [30.2110, 74.9455],
  'ludhiana': [30.9010, 75.8573],
  'amritsar': [31.6340, 74.8723],
  'jalandhar': [31.3260, 75.5762],
  'mohali': [30.6799, 76.7221],
  'sas nagar': [30.6799, 76.7221],
  'rajpura': [30.4839, 76.5939],
  'zirakpur': [30.6425, 76.8173],
  'kharar': [30.7450, 76.6450],
  'dera bassi': [30.5850, 76.8450],
  'mandi gobindgarh': [30.6650, 76.2980],
  'sirhind': [30.6380, 76.3850],
  'phagwara': [31.2240, 75.7708],
  'khanna': [30.7070, 76.2160],
  'malerkotla': [30.5250, 75.8850],
  'barnala': [30.3819, 75.5467],
  'mansa': [29.9880, 75.3940],
  'moga': [30.8165, 75.1717],
  'faridkot': [30.6769, 74.7583],
  'muktsar': [30.4762, 74.5154],
  'sri muktsar sahib': [30.4762, 74.5154],
  'fazilka': [30.4037, 74.0254],
  'abohar': [30.1453, 74.1994],
  'ferozepur': [30.9237, 74.6065],
  'kapurthala': [31.3800, 75.3800],
  'hoshiarpur': [31.5273, 75.9142],
  'gurdaspur': [32.0419, 75.4053],
  'pathankot': [32.2686, 75.6528],
  'rupnagar': [30.9664, 76.5331],
  'ropar': [30.9664, 76.5331],
  'fatehgarh sahib': [30.6480, 76.3880],
  'tarn taran': [31.4520, 74.9270],
  'nawanshahr': [31.1256, 76.1189],
  'shaheed bhagat singh nagar': [31.1256, 76.1189],
  'dhuri': [30.3700, 75.8700],
  'lehragaga': [29.9300, 75.8200],
  'moonak': [29.8200, 75.8900],
  'dirba': [30.0600, 75.9800],
  'ahmedgarh': [30.6800, 75.8300],
  'jagraon': [30.7800, 75.4800],
  'samrala': [30.8300, 76.1900],
  'nakodar': [31.1300, 75.4800],
  'phillaur': [31.0200, 75.7800],
  'anandpur sahib': [31.2400, 76.5000],
  'chamkaur sahib': [30.8900, 76.4200],
  'morinda': [30.7900, 76.5000],
  'kurali': [30.8200, 76.5800],
  'new chandigarh': [30.8040, 76.7550],
  'mullanpur': [30.8040, 76.7550],

  // ─── HARYANA & CHANDIGARH ───
  'chandigarh': [30.7333, 76.7794],
  'panchkula': [30.6942, 76.8606],
  'rewari': [28.1920, 76.6191],
  'bawal': [28.0833, 76.5833],
  'dharuhera': [28.2050, 76.7900],
  'gurgaon': [28.4595, 77.0266],
  'gurugram': [28.4595, 77.0266],
  'manesar': [28.3516, 76.9429],
  'sohna': [28.2483, 77.0678],
  'pataudi': [28.3200, 76.7800],
  'faridabad': [28.4089, 77.3178],
  'ballabgarh': [28.3400, 77.3200],
  'palwal': [28.1447, 77.3260],
  'sonipat': [28.9931, 77.0151],
  'kundli': [28.8700, 77.1200],
  'rai': [28.9400, 77.0900],
  'murthal': [29.0300, 77.0800],
  'panipat': [29.3909, 76.9635],
  'karnal': [29.6857, 76.9905],
  'ambala': [30.3782, 76.7767],
  'ambala cantt': [30.3300, 76.8300],
  'rohtak': [28.8955, 76.6066],
  'bahadurgarh': [28.6924, 76.9240],
  'jhajjar': [28.6064, 76.6565],
  'hisar': [29.1492, 75.7217],
  'yamunanagar': [30.1290, 77.2674],
  'jagadhri': [30.1700, 77.3000],
  'kurukshetra': [29.9695, 76.8783],
  'thanesar': [29.9700, 76.8200],
  'kaithal': [29.8015, 76.3997],
  'jind': [29.3140, 76.3140],
  'fatehabad': [29.5140, 75.4540],
  'sirsa': [29.5340, 75.0300],
  'bhiwani': [28.7840, 76.1340],
  'charkhi dadri': [28.5920, 76.2690],
  'mahendragarh': [28.2700, 76.1500],
  'narnaul': [28.0440, 76.1080],
  'nuh': [28.1100, 77.0000],
  'kalka': [30.8300, 76.9300],
  'pinjore': [30.7900, 76.9100],

  // ─── DELHI NCR ───
  'delhi': [28.6139, 77.2090],
  'new delhi': [28.6139, 77.2090],
  'noida': [28.5355, 77.3910],
  'greater noida': [28.4744, 77.5040],
  'noida extension': [28.5800, 77.4400],
  'ghaziabad': [28.6692, 77.4538],
  'indirapuram': [28.6400, 77.3700],
  'vaishali': [28.6450, 77.3400],
  'dwarka': [28.5800, 77.0500],
  'rohini': [28.7100, 77.1100],
  'vasant kunj': [28.5200, 77.1500],

  // ─── RAJASTHAN ───
  'jaipur': [26.9124, 75.7873],
  'jodhpur': [26.2389, 73.0243],
  'udaipur': [24.5854, 73.7125],
  'kota': [25.2138, 75.8648],
  'bikaner': [28.0229, 73.3119],
  'ajmer': [26.4499, 74.6399],
  'alwar': [27.5530, 76.6346],
  'neemrana': [27.9800, 76.3800],
  'bhiwadi': [28.2100, 76.8600],
  'behror': [27.8900, 76.2800],
  'sri ganganagar': [29.9038, 73.8772],
  'hanumangarh': [29.5817, 74.3294],
  'sikar': [27.6094, 75.1398],
  'jhunjhunu': [28.1289, 75.3995],
  'bharatpur': [27.2152, 77.5030],
  'bhilwara': [25.3407, 74.6313],

  // ─── UTTAR PRADESH & UTTARAKHAND ───
  'lucknow': [26.8467, 80.9462],
  'kanpur': [26.4499, 80.3319],
  'varanasi': [25.3176, 82.9739],
  'prayagraj': [25.4358, 81.8463],
  'allahabad': [25.4358, 81.8463],
  'agra': [27.1767, 78.0081],
  'meerut': [28.9845, 77.7064],
  'mathura': [27.4924, 77.6737],
  'vrindavan': [27.5806, 77.7006],
  'ayodhya': [26.7922, 82.1998],
  'aligarh': [27.8974, 78.0880],
  'bareilly': [28.3670, 79.4304],
  'moradabad': [28.8386, 78.7733],
  'saharanpur': [29.9640, 77.5460],
  'gorakhpur': [26.7606, 83.3732],
  'jhansi': [25.4484, 78.5685],
  'dehradun': [30.3165, 78.0322],
  'haridwar': [29.9457, 78.1642],
  'rishikesh': [30.0869, 78.2676],
  'roorkee': [29.8543, 77.8880],
  'nainital': [29.3919, 79.4542],
  'haldwani': [29.2183, 79.5130],
  'rudrapur': [28.9800, 79.4000],

  // ─── HIMACHAL PRADESH, J&K, LADAKH ───
  'shimla': [31.1048, 77.1734],
  'solan': [30.9045, 77.0967],
  'baddi': [30.9578, 76.7914],
  'dharamshala': [32.2190, 76.3234],
  'mandi': [31.7087, 76.9320],
  'kullu': [31.9579, 77.1095],
  'manali': [32.2396, 77.1887],
  'una': [31.4685, 76.2708],
  'jammu': [32.7266, 74.8570],
  'srinagar': [34.0837, 74.7973],
  'leh': [34.1526, 77.5771],

  // ─── MAHARASHTRA & GOA ───
  'mumbai': [19.0760, 72.8777],
  'navi mumbai': [19.0330, 73.0297],
  'thane': [19.2183, 72.9781],
  'kalyan': [19.2403, 73.1305],
  'dombivli': [19.2184, 73.0867],
  'pune': [18.5204, 73.8567],
  'pimpri chinchwad': [18.6279, 73.8131],
  'nagpur': [21.1458, 79.0882],
  'nashik': [19.9975, 73.7898],
  'aurangabad': [19.8762, 75.3433],
  'chhatrapati sambhajinagar': [19.8762, 75.3433],
  'solapur': [17.6599, 75.9064],
  'kolhapur': [16.7050, 74.2433],
  'panaji': [15.4909, 73.8278],
  'margao': [15.2832, 73.9862],
  'goa': [15.2993, 74.1240],

  // ─── GUJARAT ───
  'ahmedabad': [23.0225, 72.5714],
  'gandhinagar': [23.2156, 72.6369],
  'surat': [21.1702, 72.8311],
  'vadodara': [22.3072, 73.1812],
  'rajkot': [22.3039, 70.8022],
  'bhavnagar': [21.7645, 72.1519],
  'jamnagar': [22.4707, 70.0577],

  // ─── KARNATAKA, TELANGANA, ANDHRA PRADESH ───
  'bengaluru': [12.9716, 77.5946],
  'bangalore': [12.9716, 77.5946],
  'mysore': [12.2958, 76.6394],
  'mysuru': [12.2958, 76.6394],
  'mangalore': [12.9141, 74.8560],
  'hubli': [15.3647, 75.1240],
  'belgaum': [15.8497, 74.4977],
  'hyderabad': [17.3850, 78.4867],
  'secunderabad': [17.4399, 78.4983],
  'warangal': [17.9689, 79.5941],
  'visakhapatnam': [17.6868, 83.2185],
  'vizag': [17.6868, 83.2185],
  'vijayawada': [16.5062, 80.6480],
  'guntur': [16.3067, 80.4365],
  'tirupati': [13.6288, 79.4192],
  'amaravati': [16.5131, 80.5165],

  // ─── TAMIL NADU & KERALA ───
  'chennai': [13.0827, 80.2707],
  'coimbatore': [11.0168, 76.9558],
  'madurai': [9.9252, 78.1198],
  'trichy': [10.7905, 78.7047],
  'tiruchirappalli': [10.7905, 78.7047],
  'salem': [11.6643, 78.1460],
  'kochi': [9.9312, 76.2673],
  'cochin': [9.9312, 76.2673],
  'thiruvananthapuram': [8.5241, 76.9366],
  'trivandrum': [8.5241, 76.9366],
  'kozhikode': [11.2588, 75.7804],
  'calicut': [11.2588, 75.7804],
  'thrissur': [10.5276, 76.2144],

  // ─── MADHYA PRADESH & CHHATTISGARH ───
  'bhopal': [23.2599, 77.4126],
  'indore': [22.7196, 75.8577],
  'gwalior': [26.2183, 78.1828],
  'jabalpur': [23.1815, 79.9864],
  'ujjain': [23.1765, 75.7885],
  'raipur': [21.2514, 81.6296],
  'bilaspur': [22.0797, 82.1409],
  'durg': [21.1904, 81.2849],
  'bhilai': [21.2121, 81.3733],

  // ─── EAST & NORTHEAST INDIA ───
  'kolkata': [22.5726, 88.3639],
  'howrah': [22.5958, 88.2636],
  'durgapur': [23.5204, 87.3119],
  'siliguri': [26.7271, 88.3953],
  'asansol': [23.6739, 86.9524],
  'patna': [25.5941, 85.1376],
  'gaya': [24.7914, 85.0002],
  'muzaffarpur': [26.1209, 85.3647],
  'bhagalpur': [25.2425, 86.9842],
  'ranchi': [23.3441, 85.3096],
  'jamshedpur': [22.8046, 86.2029],
  'dhanbad': [23.7957, 86.4304],
  'bhubaneswar': [20.2961, 85.8245],
  'cuttack': [20.4625, 85.8828],
  'puri': [19.8135, 85.8312],
  'rourkela': [22.2604, 84.8536],
  'guwahati': [26.1445, 91.7362],
  'dispur': [26.1433, 91.7898],
  'shillong': [25.5788, 91.8933],
  'agartala': [23.8315, 91.2868],
  'imphal': [24.8170, 93.9368],
  'aizawl': [23.7271, 92.7176],
  'kohima': [25.6751, 94.1086],
  'gangtok': [27.3389, 88.6065],
  'itanagar': [27.0844, 93.6053]
};

/**
 * Normalizes and extracts accurate GPS coordinates for any property
 */
export function getAccurateCoordinates(property: Partial<Property>): [number, number] {
  // 1. Check if explicit coordinates exist on property
  if (
    property.coordinates &&
    Array.isArray(property.coordinates) &&
    property.coordinates.length >= 2 &&
    typeof property.coordinates[0] === 'number' &&
    typeof property.coordinates[1] === 'number' &&
    !isNaN(property.coordinates[0]) &&
    !isNaN(property.coordinates[1]) &&
    property.coordinates[0] !== 0 &&
    property.coordinates[1] !== 0
  ) {
    return [property.coordinates[0], property.coordinates[1]];
  }

  // 2. City or district fallback lookup
  const cityKey = (property.city || '').toLowerCase().trim();
  if (CITY_COORDINATES[cityKey]) {
    return CITY_COORDINATES[cityKey];
  }

  const districtKey = (property.district || '').toLowerCase().trim();
  if (CITY_COORDINATES[districtKey]) {
    return CITY_COORDINATES[districtKey];
  }

  const tehsilKey = (property.tehsil || '').toLowerCase().trim();
  if (CITY_COORDINATES[tehsilKey]) {
    return CITY_COORDINATES[tehsilKey];
  }

  const locationKey = (property.location || '').toLowerCase().trim();
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (locationKey.includes(key)) {
      return coords;
    }
  }

  // Default coordinate (Rewari / Delhi NCR regional centroid)
  return [28.1920, 76.6191];
}

/**
 * Constructs a high-precision search query string for Google Maps
 */
export function getFullAddressQuery(property: Partial<Property>): string {
  const parts: string[] = [];

  if (property.location && property.location.trim()) {
    parts.push(property.location.trim());
  }

  if (property.sector && property.sector.trim() && !parts.some(p => p.toLowerCase().includes(property.sector!.toLowerCase()))) {
    parts.push(property.sector.trim());
  }

  if (property.city && property.city.trim() && !parts.some(p => p.toLowerCase().includes(property.city!.toLowerCase()))) {
    parts.push(property.city.trim());
  }

  if (
    property.district &&
    property.district.trim() &&
    property.district.toLowerCase() !== property.city?.toLowerCase() &&
    !parts.some(p => p.toLowerCase().includes(property.district!.toLowerCase()))
  ) {
    parts.push(property.district.trim());
  }

  if (property.state && property.state.trim() && !parts.some(p => p.toLowerCase().includes(property.state!.toLowerCase()))) {
    parts.push(property.state.trim());
  }

  parts.push('India');
  return parts.join(', ');
}

/**
 * Returns a high-accuracy direct Google Maps link for the property listing
 * (Uses GPS coordinates if available, or structured full address)
 */
export function getGoogleMapsUrl(property: Partial<Property>): string {
  if (
    property.coordinates &&
    Array.isArray(property.coordinates) &&
    property.coordinates.length >= 2 &&
    typeof property.coordinates[0] === 'number' &&
    typeof property.coordinates[1] === 'number' &&
    !isNaN(property.coordinates[0]) &&
    !isNaN(property.coordinates[1]) &&
    property.coordinates[0] !== 0
  ) {
    const [lat, lng] = property.coordinates;
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  const coords = getAccurateCoordinates(property);
  if (coords && coords[0] !== 0) {
    return `https://www.google.com/maps/search/?api=1&query=${coords[0]},${coords[1]}`;
  }

  const addressQuery = getFullAddressQuery(property);
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressQuery)}`;
}

/**
 * Returns a turn-by-turn navigation Directions URL in Google Maps
 */
export function getGoogleMapsDirectionsUrl(property: Partial<Property>): string {
  if (
    property.coordinates &&
    Array.isArray(property.coordinates) &&
    property.coordinates.length >= 2 &&
    typeof property.coordinates[0] === 'number' &&
    typeof property.coordinates[1] === 'number' &&
    !isNaN(property.coordinates[0]) &&
    property.coordinates[0] !== 0
  ) {
    const [lat, lng] = property.coordinates;
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }

  const coords = getAccurateCoordinates(property);
  if (coords && coords[0] !== 0) {
    return `https://www.google.com/maps/dir/?api=1&destination=${coords[0]},${coords[1]}`;
  }

  const addressQuery = getFullAddressQuery(property);
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressQuery)}`;
}

/**
 * Returns an embeddable Google Maps iframe URL with pin marker
 */
export function getGoogleMapsEmbedUrl(property: Partial<Property>): string {
  if (
    property.coordinates &&
    Array.isArray(property.coordinates) &&
    property.coordinates.length >= 2 &&
    typeof property.coordinates[0] === 'number' &&
    typeof property.coordinates[1] === 'number' &&
    !isNaN(property.coordinates[0]) &&
    property.coordinates[0] !== 0
  ) {
    const [lat, lng] = property.coordinates;
    return `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=15&output=embed`;
  }

  const coords = getAccurateCoordinates(property);
  if (coords && coords[0] !== 0) {
    return `https://maps.google.com/maps?q=${coords[0]},${coords[1]}&hl=en&z=15&output=embed`;
  }

  const addressQuery = getFullAddressQuery(property);
  return `https://maps.google.com/maps?q=${encodeURIComponent(addressQuery)}&hl=en&z=15&output=embed`;
}

/**
 * Safely opens Google Maps in a new tab without bubbling parent click handlers
 */
export function openGoogleMaps(property: Partial<Property>, e?: React.MouseEvent | Event): void {
  if (e) {
    e.stopPropagation();
    if (typeof (e as any).preventDefault === 'function') {
      (e as any).preventDefault();
    }
  }
  const url = getGoogleMapsUrl(property);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Copies coordinates to clipboard with feedback
 */
export async function copyCoordinatesToClipboard(
  coords?: [number, number],
  onSuccess?: () => void
): Promise<boolean> {
  if (!coords || !Array.isArray(coords) || coords.length < 2) return false;
  const str = `${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`;
  try {
    await navigator.clipboard.writeText(str);
    if (onSuccess) onSuccess();
    return true;
  } catch {
    return false;
  }
}
