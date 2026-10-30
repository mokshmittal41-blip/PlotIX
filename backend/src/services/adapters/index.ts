import { SourceAdapter, AdapterHealth, ExternalPropertyListing } from './BaseAdapter';
import { MagicBricksAdapter } from './MagicBricksAdapter';
import { OlxRealEstateAdapter } from './OlxRealEstateAdapter';
import {
  NinetyNineAcresAdapter,
  HousingAdapter,
  NoBrokerAdapter,
  ReraRegistryAdapter
} from './DisabledAdapters';

export * from './BaseAdapter';
export * from './MagicBricksAdapter';
export * from './OlxRealEstateAdapter';
export * from './DisabledAdapters';

// Instantiate singletons
export const magicBricksAdapter = new MagicBricksAdapter();
export const olxRealEstateAdapter = new OlxRealEstateAdapter();
export const ninetyNineAcresAdapter = new NinetyNineAcresAdapter();
export const housingAdapter = new HousingAdapter();
export const noBrokerAdapter = new NoBrokerAdapter();
export const reraRegistryAdapter = new ReraRegistryAdapter();

// All registered source adapters (both active and disabled)
export const allAdapters: SourceAdapter[] = [
  magicBricksAdapter,
  olxRealEstateAdapter,
  ninetyNineAcresAdapter,
  housingAdapter,
  noBrokerAdapter,
  reraRegistryAdapter
];

/**
 * Returns only actively available, functional free adapters
 */
export function getActiveAdapters(): SourceAdapter[] {
  return allAdapters.filter(a => a.isAvailable());
}

/**
 * Returns comprehensive health status for all 6 providers
 */
export function getAllAdaptersHealth(): Record<string, AdapterHealth> {
  const healthMatrix: Record<string, AdapterHealth> = {};
  for (const adapter of allAdapters) {
    healthMatrix[adapter.name] = adapter.getHealth();
  }
  return healthMatrix;
}
