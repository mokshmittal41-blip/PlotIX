export interface LandRecordSearch {
  state: string;
  district: string;
  tehsil: string;
  village: string;
  khasraNumber?: string;
  ownerName?: string;
}

export interface LandRecord {
  id: string;
  state: string;
  district: string;
  tehsil: string;
  village: string;
  khasraNumber: string;
  recordedArea: string; // e.g. "2 Kanal 4 Marla" or "510 Sq.Yd."
  recordedAreaSqYd: number; // for comparison
  ownerName: string;
  landClassification: string; // e.g. "Agricultural", "Residential"
  recordPeriod: string; // e.g. "2023-2024"
  source: string; // e.g. "Revenue Department, Punjab"
  documentUrl?: string; // prototype preview
}

export interface LandRecordStatus {
  status: 'found' | 'not_found' | 'error' | 'pending';
  message: string;
  record?: LandRecord;
}
