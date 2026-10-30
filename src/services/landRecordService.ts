import type { LandRecordSearch, LandRecordStatus, LandRecord } from '../types/landRecord';

/**
 * Mock Service simulating a backend Jamabandi/Land Record API.
 */

const MOCK_DELAY = 2000; // Simulated network delay for realistic loading

// Helper for Mock Data
const generateMockRecord = (overrides: Partial<LandRecord> = {}): LandRecord => ({
  id: `REC-${Date.now()}`,
  state: 'Punjab',
  district: 'S.A.S Nagar (Mohali)',
  tehsil: 'Mohali',
  village: 'Sector 82 (Demo Village)',
  khasraNumber: overrides.khasraNumber || '145/2/1',
  recordedArea: '1 Kanal 17 Marla',
  recordedAreaSqYd: 504,
  ownerName: 'Demo Owner Singh',
  landClassification: 'Gair Mumkin (Residential/Commercial)',
  recordPeriod: '2023-2024',
  source: 'Revenue Department, Punjab (Demo)',
  ...overrides,
});

export const searchLandRecord = async (
  search: LandRecordSearch
): Promise<LandRecordStatus> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock validation
      if (!search.state || !search.district || !search.village) {
        resolve({
          status: 'error',
          message: 'State, District, and Village are required fields.',
        });
        return;
      }

      // Return a successful mock record
      resolve({
        status: 'found',
        message: 'Record successfully retrieved.',
        record: generateMockRecord({
          state: search.state,
          district: search.district,
          tehsil: search.tehsil || 'Mohali',
          village: search.village,
          khasraNumber: search.khasraNumber || '145/2/1',
        }),
      });
    }, MOCK_DELAY);
  });
};

export const getLandRecordByParcel = async (
  areaSqYd: number,
  locationText?: string
): Promise<LandRecordStatus> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate finding a record that is slightly different in area (e.g. + 10 sqyd)
      // to demonstrate the Record vs Map functionality.
      const mockRecordedAreaYards = Math.round(areaSqYd + 10);
      
      resolve({
        status: 'found',
        message: 'Matched plot coordinates to land record.',
        record: generateMockRecord({
          village: locationText || 'Unknown Village',
          recordedAreaSqYd: mockRecordedAreaYards,
          recordedArea: `${mockRecordedAreaYards} Sq.Yd. (Equivalent)`,
        }),
      });
    }, MOCK_DELAY + 1500); // Take a bit longer for "parcel matching"
  });
};

export const getLandRecordExplanation = () => {
  return [
    { term: 'Khasra', meaning: 'Land parcel or survey identifier number.' },
    { term: 'Jamabandi', meaning: 'Official document containing land ownership, rights, and cultivation details.' },
    { term: 'Mutation (Inteqal)', meaning: 'The process of changing the ownership title in the revenue records.' },
    { term: 'Girdawari', meaning: 'Harvest inspection record, documenting crop details and land cultivation.' },
    { term: 'Khewat', meaning: 'Account number given to owner(s) forming a set of co-sharers.' }
  ];
};
