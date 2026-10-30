import { SourceAdapter, ExternalPropertyListing, AdapterHealth } from './BaseAdapter';

/**
 * 99acres Source Adapter - Disabled
 * Reason: Client-side single page app (SPA); Schema.org ItemList contains 0 properties without executing client JavaScript bundle.
 */
export class NinetyNineAcresAdapter implements SourceAdapter {
  readonly name = '99acres';
  readonly baseUrl = 'https://www.99acres.com';

  isAvailable(): boolean {
    return false;
  }

  getHealth(): AdapterHealth {
    return {
      sourceName: this.name,
      isAvailable: false,
      status: 'UNAVAILABLE',
      statusMessage: 'Client-side rendered React SPA; unauthenticated public schema endpoint does not return listings.',
      lastCheckedAt: new Date().toISOString(),
      supportedCategories: []
    };
  }

  async fetchListings(): Promise<ExternalPropertyListing[]> {
    return [];
  }
}

/**
 * Housing.com Source Adapter - Disabled
 * Reason: Protected by PerimeterX / Cloudflare Bot Management WAF; direct HTTP requests return 406 Not Acceptable.
 */
export class HousingAdapter implements SourceAdapter {
  readonly name = 'Housing.com';
  readonly baseUrl = 'https://housing.com';

  isAvailable(): boolean {
    return false;
  }

  getHealth(): AdapterHealth {
    return {
      sourceName: this.name,
      isAvailable: false,
      status: 'BLOCKED',
      statusMessage: 'PerimeterX / Cloudflare WAF bot-protection blocks unauthenticated crawlers (HTTP 406).',
      lastCheckedAt: new Date().toISOString(),
      supportedCategories: []
    };
  }

  async fetchListings(): Promise<ExternalPropertyListing[]> {
    return [];
  }
}

/**
 * NoBroker Source Adapter - Disabled
 * Reason: Public HTML contains breadcrumbs and navigation only; individual property metadata requires active user session.
 */
export class NoBrokerAdapter implements SourceAdapter {
  readonly name = 'NoBroker';
  readonly baseUrl = 'https://www.nobroker.in';

  isAvailable(): boolean {
    return false;
  }

  getHealth(): AdapterHealth {
    return {
      sourceName: this.name,
      isAvailable: false,
      status: 'BLOCKED',
      statusMessage: 'Public endpoints provide navigational breadcrumbs only without authenticated customer session.',
      lastCheckedAt: new Date().toISOString(),
      supportedCategories: []
    };
  }

  async fetchListings(): Promise<ExternalPropertyListing[]> {
    return [];
  }
}

/**
 * State RERA Portals & Open Government Data Adapter - Disabled
 * Reason: State portals (HRERA, PRERA, MahaRERA) require digital session tokens or official authorized API bridge.
 */
export class ReraRegistryAdapter implements SourceAdapter {
  readonly name = 'RERA State Portals';
  readonly baseUrl = 'https://haryanarera.gov.in';

  isAvailable(): boolean {
    return false;
  }

  getHealth(): AdapterHealth {
    return {
      sourceName: this.name,
      isAvailable: false,
      status: 'UNAVAILABLE',
      statusMessage: 'Official statutory portals (HRERA/MahaRERA/PRERA) require state department credentials or digital session tokens.',
      lastCheckedAt: new Date().toISOString(),
      supportedCategories: []
    };
  }

  async fetchListings(): Promise<ExternalPropertyListing[]> {
    return [];
  }
}
