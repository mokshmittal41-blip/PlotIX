import type { ColonyRateRecord, ConstructionQualityTier, QualityTierRates } from './types';

// ─── 1. NATIONAL BASELINE RATES ──────────────────────────────────────────────
export const NATIONAL_BASELINE_RATES: Record<ConstructionQualityTier, QualityTierRates> = {
  basic: {
    minRatePerSqFt: 1450,
    maxRatePerSqFt: 1800,
    description: 'Standard red brick / AAC block masonry, Fe500 steel, local vitrified tiles, basic modular switches, standard sanitary fittings.',
    keySpecs: [
      'Structure: RCC Frame with Fe 500 TMT & OPC 43 Cement',
      'Walls: 9" Red Brick / 8" AAC Light-weight Blocks',
      'Flooring: 2x2 Vitrified Tiles (₹45–60/sqft)',
      'Doors/Windows: Flush Doors & Powder-coated Aluminium Windows',
      'Bathroom: Standard CP & Ceramic Sanitary (Cera / Parryware)',
      'Electrical: Anchor / Havells Standard Modular Switches & FRLS Wires'
    ]
  },
  standard: {
    minRatePerSqFt: 1950,
    maxRatePerSqFt: 2500,
    description: 'Fe550D TMT, Ultratech/ACC, double glazed UPVC windows, Jaquar/Hindware fittings, 4x2 GVT tiles, semi-modular kitchen, Asian Paints Tractor emulsion.',
    keySpecs: [
      'Structure: High-strength M25 RCC with Fe 550D TMT',
      'Walls: Class-1 Kiln Bricks with 12mm Waterproof Plaster',
      'Flooring: 4x2 Glazed Vitrified Tiles (GVT) (₹75–110/sqft)',
      'Doors/Windows: Teak wood main frame & UPVC 3-Track Sliding Windows',
      'Bathroom: Jaquar / Hindware Wall-hung EWC & Diverters',
      'Kitchen: Semi-modular Marine Ply with Granite Countertop',
      'Paint: Asian Paints Tractor Emulsion with 2 coats Putty'
    ]
  },
  premium: {
    minRatePerSqFt: 2700,
    maxRatePerSqFt: 3600,
    description: 'Engineered RCC structure, Italian marble accents, German UPVC/Fenesta windows, Kohler/Grohe fittings, full modular acrylic kitchen, false ceiling in all rooms, Royale Luxury Emulsion.',
    keySpecs: [
      'Structure: Seismic Zone IV Design with Ultratech Super / ACC Suraksha',
      'Flooring: Italian Marble in Living / 6x4 Large Slab Tiles (₹160–250/sqft)',
      'Doors/Windows: Fenesta / Kommerling German UPVC Double-glazed with Mesh',
      'Bathrooms: Kohler / Grohe Thermostatic Diverters & Glass Partitions',
      'Kitchen: Full Acrylic Modular Kitchen with Hafele / Blum Soft-close Hardware',
      'Ceiling: Complete Gyproc False Ceiling with Warm LED Strip & Cove Lighting',
      'Paint: Asian Paints Royale Luxury Emulsion & PU Polish on Doors'
    ]
  },
  luxury: {
    minRatePerSqFt: 4000,
    maxRatePerSqFt: 6200,
    description: 'Architect-designed luxury villa, imported Botticino/Statuario marble, smart home automation, VRV/VRF AC conduits, Hansgrohe/Toto sanitaryware, designer landscape & facade cladding.',
    keySpecs: [
      'Structure: Specialized Heavy RCC with Core Shear Walls & Waterproof Basements',
      'Flooring: Imported Italian Statuario / Botticino Marble (₹450–900/sqft)',
      'Automation: KNX / Lutron Smart Lighting, Curtain & Security Automation',
      'HVAC: Complete Daikin / Mitsubishi VRV/VRF Concealed Air-conditioning Ducting',
      'Bathrooms: Toto / Hansgrohe Axor Smart Bidets & Concealed Shower Panels',
      'Kitchen: Imported German Hacker / Nolte Modular Kitchen with Quartz / Corian Tops',
      'Exterior: Fundermax / HPL Wood Cladding, Double-height Glazing & Glass Railings'
    ]
  }
};

// ─── 2. HIERARCHICAL ALL-INDIA COLONY & MICRO-MARKET RATE DATABASE ───────────
export const COLONY_RATES_DATABASE: ColonyRateRecord[] = [
  // ════════════════════════════════════════════════════════════════════════════
  // 1. PUNJAB (Mohali, Ludhiana, Amritsar, Jalandhar, Patiala, Bathinda, Zirakpur)
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'pb-moh-sec82',
    state: 'Punjab',
    districtOrCity: 'SAS Nagar (Mohali)',
    locality: 'Airport Road / JLPL',
    colonyOrSector: 'Sector 82 / JLPL Industrial & Plotted',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'CPWD Punjab Schedule of Rates + Mohali Builders Guild Index 2026',
    localLabourIndex: 1.12,
    materialLogisticsIndex: 1.08,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1550, maxRatePerSqFt: 1850, description: 'Standard GMADA bylaws residential build with Fe500 TMT and 2x2 vitrified tiles.', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 2000, maxRatePerSqFt: 2550, description: 'Premier Sector 82 builder kothi with Fe550D steel, 4x2 GVT tiles, UPVC windows, Jaquar fittings.', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2800, maxRatePerSqFt: 3650, description: 'High-end duplex kothi with Italian marble living, Fenesta UPVC, Kohler sanitary, modular kitchen.', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4200, maxRatePerSqFt: 6200, description: 'Architect luxury kothi with basement, imported Statuario marble, smart automation, VRV ducting.', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'pb-moh-aero',
    state: 'Punjab',
    districtOrCity: 'SAS Nagar (Mohali)',
    locality: 'Airport Road Corridor',
    colonyOrSector: 'Aerocity (Blocks A-J)',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'GMADA Approved Contractors Registry & Aerocity Resident Builders 2026',
    localLabourIndex: 1.14,
    materialLogisticsIndex: 1.09,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1580, maxRatePerSqFt: 1900, description: 'Basic GMADA bylaws compliant residential build', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 2050, maxRatePerSqFt: 2600, description: 'GMADA Aerocity standard 2-3 storey independent house', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2850, maxRatePerSqFt: 3750, description: 'Premium Aerocity kothi with front elevation cladding and Kohler fittings', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4300, maxRatePerSqFt: 6400, description: 'Luxury villa fronting 200ft Airport Road with elevator & smart automation', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'pb-moh-itcity',
    state: 'Punjab',
    districtOrCity: 'SAS Nagar (Mohali)',
    locality: 'IT City Corridor',
    colonyOrSector: 'IT City (Blocks A-F) / Sector 83',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'GMADA IT City Plotted Construction Survey 2026',
    localLabourIndex: 1.12,
    materialLogisticsIndex: 1.08,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1550, maxRatePerSqFt: 1850, description: 'Basic IT City residential structure', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 2000, maxRatePerSqFt: 2550, description: 'Standard IT City builder floor specification', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2800, maxRatePerSqFt: 3650, description: 'Premium independent house near Infosys campus', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4100, maxRatePerSqFt: 6000, description: 'Luxury modern kothi with solar rooftop and designer interior', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'pb-moh-sec70',
    state: 'Punjab',
    districtOrCity: 'SAS Nagar (Mohali)',
    locality: 'Central Mohali',
    colonyOrSector: 'Sector 70 / Sector 71 / Homeland Enclave',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'Central Mohali Redevelopment & Independent Kothi Index 2026',
    localLabourIndex: 1.15,
    materialLogisticsIndex: 1.10,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1600, maxRatePerSqFt: 1950, description: 'Standard Sector 70 floor reconstruction', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 2100, maxRatePerSqFt: 2680, description: 'High quality multi-storey independent residence', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2950, maxRatePerSqFt: 3900, description: 'Luxury designer floor with Italian marble and Fenesta UPVC', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4400, maxRatePerSqFt: 6600, description: 'Ultra-luxury Sector 70 kothi with elevator shaft and bespoke interiors', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'pb-moh-sec68',
    state: 'Punjab',
    districtOrCity: 'SAS Nagar (Mohali)',
    locality: 'Kumbra / City Centre',
    colonyOrSector: 'Sector 68 / Sector 69',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'GMADA Mohali Plotted Index 2026',
    localLabourIndex: 1.12,
    materialLogisticsIndex: 1.08,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1560, maxRatePerSqFt: 1880, description: 'Standard residential construction in Sector 68', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 2020, maxRatePerSqFt: 2580, description: 'Standard builder floor kothi construction', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2820, maxRatePerSqFt: 3700, description: 'Premium Sector 68 kothi with full false ceiling and branded bath fittings', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4200, maxRatePerSqFt: 6300, description: 'Luxury custom villa with basement & landscaped roof terrace', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'pb-moh-zrk',
    state: 'Punjab',
    districtOrCity: 'SAS Nagar (Mohali)',
    locality: 'Zirakpur / Dhakoli',
    colonyOrSector: 'VIP Road / High Ground Road / Dhakoli',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'Zirakpur Municipal Council & Builders Guild 2026',
    localLabourIndex: 1.08,
    materialLogisticsIndex: 1.05,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1480, maxRatePerSqFt: 1780, description: 'Standard Zirakpur residential construction', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 1920, maxRatePerSqFt: 2450, description: 'Standard builder floor & independent villa', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2680, maxRatePerSqFt: 3500, description: 'Premium gated colony villa with modern modular kitchen', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 3950, maxRatePerSqFt: 5800, description: 'Luxury independent villa on VIP Road with solar setup', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'pb-ldh-sbs',
    state: 'Punjab',
    districtOrCity: 'Ludhiana',
    locality: 'Pakhowal Road',
    colonyOrSector: 'Shaheed Bhagat Singh Nagar (SBS Nagar)',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'GLADA & Ludhiana Contractors Association Cost Index 2026',
    localLabourIndex: 1.10,
    materialLogisticsIndex: 1.05,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1500, maxRatePerSqFt: 1800, description: 'Standard GLADA SBS Nagar residential build', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 1950, maxRatePerSqFt: 2480, description: 'Standard Pakhowal road double-storey kothi build', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2700, maxRatePerSqFt: 3550, description: 'Premium SBS Nagar residence with teak frames and Kohler fittings', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4000, maxRatePerSqFt: 5900, description: 'Luxury Pakhowal Road bungalow with home automation and VRV air-conditioning', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'pb-ldh-brs',
    state: 'Punjab',
    districtOrCity: 'Ludhiana',
    locality: 'Ferozepur Road Environs',
    colonyOrSector: 'BRS Nagar (Bhai Randhir Singh Nagar) / Sarabha Nagar',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'LIT & GLADA Approved Rate Ledger 2026',
    localLabourIndex: 1.12,
    materialLogisticsIndex: 1.06,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1520, maxRatePerSqFt: 1820, description: 'Standard BRS Nagar residential build', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 1980, maxRatePerSqFt: 2520, description: 'Standard G+2 builder kothi in BRS Nagar', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2750, maxRatePerSqFt: 3600, description: 'Premium residential villa near Sunview Enclave', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4100, maxRatePerSqFt: 6100, description: 'Ultra luxury BRS Nagar villa with Italian marble and solar backup', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'pb-asr-ranjit',
    state: 'Punjab',
    districtOrCity: 'Amritsar',
    locality: 'Civil Lines / Airport Road',
    colonyOrSector: 'Ranjit Avenue (Blocks A-E) / Circular Road',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'ADA Amritsar & PWD Punjab Construction Benchmark 2026',
    localLabourIndex: 1.08,
    materialLogisticsIndex: 1.06,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1490, maxRatePerSqFt: 1790, description: 'Standard ADA residential build in Ranjit Avenue', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 1940, maxRatePerSqFt: 2460, description: 'Quality double-storey kothi on Ranjit Avenue', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2690, maxRatePerSqFt: 3520, description: 'High-end Ranjit Avenue kothi with imported tiles and modular kitchen', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 3980, maxRatePerSqFt: 5900, description: 'Luxury villa with basement theatre and bespoke elevation', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'pb-jal-model',
    state: 'Punjab',
    districtOrCity: 'Jalandhar',
    locality: 'Cantt Road',
    colonyOrSector: 'Model Town / Urban Estate Phase 2',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'JDA Jalandhar & PWD Punjab Cost Index 2026',
    localLabourIndex: 1.09,
    materialLogisticsIndex: 1.06,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1500, maxRatePerSqFt: 1800, description: 'Standard residential build in Jalandhar Model Town', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 1950, maxRatePerSqFt: 2480, description: 'High-quality independent residence in Urban Estate', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2720, maxRatePerSqFt: 3580, description: 'Premium kothi with Italian marble accents & Fenesta windows', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4050, maxRatePerSqFt: 6050, description: 'Ultra luxury kothi with elevator and smart home tech', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'pb-ptl-urban',
    state: 'Punjab',
    districtOrCity: 'Patiala',
    locality: 'Rajpura Road Corridor',
    colonyOrSector: 'Urban Estate Phase 1 & 2 / Punjabi Bagh',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'PDA Patiala Cost Ledger 2026',
    localLabourIndex: 1.06,
    materialLogisticsIndex: 1.04,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1460, maxRatePerSqFt: 1760, description: 'Standard PDA residential build in Patiala', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 1890, maxRatePerSqFt: 2420, description: 'Standard Urban Estate double storey kothi', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2620, maxRatePerSqFt: 3450, description: 'Premium kothi with false ceiling and branded sanitary', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 3880, maxRatePerSqFt: 5750, description: 'Luxury Patiala bungalow with classic brick & teak accents', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 2. CHANDIGARH (UT)
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'ch-chd-sec8',
    state: 'Chandigarh',
    districtOrCity: 'Chandigarh',
    locality: 'North Chandigarh (V1/V2)',
    colonyOrSector: 'Sector 8 / Sector 9 / Sector 10 / Sector 11',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'Chandigarh Administration Heritage & Urban Planning Norms 2026',
    localLabourIndex: 1.25,
    materialLogisticsIndex: 1.18,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1800, maxRatePerSqFt: 2200, description: 'Standard Chandigarh Estate Office compliant building', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 2400, maxRatePerSqFt: 3100, description: 'Standard heritage-compliant independent residence', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 3400, maxRatePerSqFt: 4500, description: 'High-end Chandigarh North Sector kothi with exposed brick & teak finish', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 5200, maxRatePerSqFt: 7800, description: 'Bespoke Sector 9/10 mansion with full basement, VRV HVAC & luxury automation', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'ch-chd-sec35',
    state: 'Chandigarh',
    districtOrCity: 'Chandigarh',
    locality: 'South-Central Chandigarh',
    colonyOrSector: 'Sector 33 / Sector 34 / Sector 35 / Sector 36',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'Chandigarh Estate Office Cost Ledger 2026',
    localLabourIndex: 1.20,
    materialLogisticsIndex: 1.15,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1720, maxRatePerSqFt: 2100, description: 'Standard Chandigarh residential build', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 2280, maxRatePerSqFt: 2950, description: 'Standard 1-2 kanal independent kothi build', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 3200, maxRatePerSqFt: 4250, description: 'Premium kothi with Italian marble and UPVC glazing', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4800, maxRatePerSqFt: 7200, description: 'Ultra luxury designer house with basement & home automation', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 3. HARYANA (Gurugram, Panchkula, Faridabad, Karnal, Sonipat, Ambala)
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'hr-ggn-dlf5',
    state: 'Haryana',
    districtOrCity: 'Gurugram',
    locality: 'Golf Course Road',
    colonyOrSector: 'DLF Phase 1-5 / Golf Course Ext / Sector 42',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'DTCP Haryana & DLF City Contractor Benchmark 2026',
    localLabourIndex: 1.28,
    materialLogisticsIndex: 1.20,
    soilFoundationComplexity: 'Medium',
    tiers: {
      basic: { minRatePerSqFt: 1850, maxRatePerSqFt: 2300, description: 'Basic DTCP approved independent floor', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 2500, maxRatePerSqFt: 3300, description: 'Standard Gurugram Stilt+4 builder floor construction', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 3600, maxRatePerSqFt: 4800, description: 'Premium luxury floor on Golf Course Extension Road', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 5500, maxRatePerSqFt: 8500, description: 'Ultra-luxury villa with private elevator, Italian marble & smart home automation', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'hr-ggn-sec57',
    state: 'Haryana',
    districtOrCity: 'Gurugram',
    locality: 'Sushant Lok 2 / Golf Course Ext',
    colonyOrSector: 'Sector 57 / Sector 56 / Sushant Lok 2 & 3',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'GMDA Gurugram Construction Index 2026',
    localLabourIndex: 1.24,
    materialLogisticsIndex: 1.18,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1780, maxRatePerSqFt: 2200, description: 'Standard HSVP/DTCP builder floor', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 2380, maxRatePerSqFt: 3100, description: 'Standard Stilt+4 luxury residential floor build', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 3400, maxRatePerSqFt: 4500, description: 'High-end builder floor with Italian marble and modular kitchen', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 5000, maxRatePerSqFt: 7800, description: 'Luxury Sector 57 villa with elevator & smart automation', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'hr-panch-sec6',
    state: 'Haryana',
    districtOrCity: 'Panchkula',
    locality: 'Old Panchkula / MDC',
    colonyOrSector: 'Sector 6 / Sector 7 / Sector 8 / MDC Sector 4',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'HSVP Panchkula & Haryana PWD Rate Schedule 2026',
    localLabourIndex: 1.16,
    materialLogisticsIndex: 1.10,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1600, maxRatePerSqFt: 1950, description: 'Standard HSVP compliant residential build', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 2100, maxRatePerSqFt: 2700, description: 'Standard Sector 6/7 kothi construction', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2950, maxRatePerSqFt: 3950, description: 'Premium MDC kothi with hill-view glazing and Italian marble', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4400, maxRatePerSqFt: 6700, description: 'Luxury Panchkula villa with basement & smart climate control', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'hr-fbd-sec14',
    state: 'Haryana',
    districtOrCity: 'Faridabad',
    locality: 'Central Faridabad / Greater Faridabad',
    colonyOrSector: 'Sector 14 / Sector 15 / Sector 16 / Greater Faridabad (Neharpar)',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'FMDA Faridabad Cost Schedule 2026',
    localLabourIndex: 1.14,
    materialLogisticsIndex: 1.09,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1560, maxRatePerSqFt: 1880, description: 'Standard Faridabad residential build', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 2050, maxRatePerSqFt: 2620, description: 'Standard Sector 14/15 builder floor', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2850, maxRatePerSqFt: 3750, description: 'Premium independent floor with Italian tiles and branded bath fixtures', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4200, maxRatePerSqFt: 6400, description: 'Luxury Neharpar villa with rooftop deck and automation', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 4. DELHI NCT (South Delhi, West Delhi, North Delhi, East Delhi, Dwarka)
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'dl-del-vkunj',
    state: 'Delhi (NCT)',
    districtOrCity: 'South Delhi',
    locality: 'South Delhi Zone',
    colonyOrSector: 'Vasant Kunj / Greater Kailash (GK 1 & 2) / Hauz Khas / Saket',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'DDA & South Delhi Master Builders Cost Index 2026',
    localLabourIndex: 1.30,
    materialLogisticsIndex: 1.22,
    soilFoundationComplexity: 'Medium',
    tiers: {
      basic: { minRatePerSqFt: 1900, maxRatePerSqFt: 2350, description: 'Standard DDA bylaws compliant floor construction', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 2600, maxRatePerSqFt: 3400, description: 'Standard South Delhi Stilt+4 luxury floor build', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 3750, maxRatePerSqFt: 5000, description: 'Premium GK/Vasant Kunj builder floor with Italian marble and Kohler fittings', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 5800, maxRatePerSqFt: 9000, description: 'Ultra-luxury South Delhi bungalow with basement theatre, VRV HVAC and elevator', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'dl-del-dwarka',
    state: 'Delhi (NCT)',
    districtOrCity: 'South West Delhi',
    locality: 'Dwarka Sub-City',
    colonyOrSector: 'Dwarka (Sectors 6-23) / Janakpuri / Uttam Nagar',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'DDA Dwarka Cost Schedule 2026',
    localLabourIndex: 1.24,
    materialLogisticsIndex: 1.18,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1750, maxRatePerSqFt: 2150, description: 'Standard DDA plotted residential build', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 2350, maxRatePerSqFt: 3050, description: 'Standard Dwarka / Janakpuri builder floor', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 3350, maxRatePerSqFt: 4400, description: 'Premium floor with modular kitchen and Italian tiles', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4900, maxRatePerSqFt: 7400, description: 'Luxury builder floor with stilt parking, elevator & smart locks', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'dl-del-rohini',
    state: 'Delhi (NCT)',
    districtOrCity: 'North West Delhi',
    locality: 'Rohini Sub-City / Pitampura',
    colonyOrSector: 'Rohini (Sectors 9-24) / Pitampura / Model Town',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'MCD North & DDA Rohini Building Index 2026',
    localLabourIndex: 1.22,
    materialLogisticsIndex: 1.16,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1720, maxRatePerSqFt: 2100, description: 'Standard Rohini residential floor', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 2300, maxRatePerSqFt: 2980, description: 'Standard Pitampura / Rohini 4-storey builder floor', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 3250, maxRatePerSqFt: 4300, description: 'Premium floor with Italian marble and UPVC double glazing', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4800, maxRatePerSqFt: 7100, description: 'Luxury Pitampura kothi with private lift & smart lighting', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 5. UTTAR PRADESH (Noida, Greater Noida, Ghaziabad, Lucknow, Kanpur, Varanasi, Agra)
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'up-noida-150',
    state: 'Uttar Pradesh',
    districtOrCity: 'Gautam Buddha Nagar (Noida)',
    locality: 'Noida Expressway / Central Noida',
    colonyOrSector: 'Sector 150 / Sector 137 / Sector 62 / Sector 50 / Sector 78',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'NOIDA Authority & CREDAI NCR Cost Ledger 2026',
    localLabourIndex: 1.18,
    materialLogisticsIndex: 1.12,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1600, maxRatePerSqFt: 1950, description: 'Standard Noida Authority bylaws compliant floor build', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 2150, maxRatePerSqFt: 2750, description: 'Standard Sector 150 sports city builder floor specification', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 3000, maxRatePerSqFt: 3950, description: 'Premium independent villa with Italian marble and UPVC glazing', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4500, maxRatePerSqFt: 6800, description: 'Ultra luxury villa with private plunge pool and smart home automation', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'up-gzb-indira',
    state: 'Uttar Pradesh',
    districtOrCity: 'Ghaziabad',
    locality: 'Trans-Hindon / NH-24',
    colonyOrSector: 'Indirapuram / Vaishali / Vasundhara / Raj Nagar Ext',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'GDA Ghaziabad Cost Schedule 2026',
    localLabourIndex: 1.14,
    materialLogisticsIndex: 1.09,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1540, maxRatePerSqFt: 1860, description: 'Standard GDA approved residential build', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 2020, maxRatePerSqFt: 2580, description: 'Standard Indirapuram / Vaishali independent floor', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2800, maxRatePerSqFt: 3680, description: 'Premium floor with modular kitchen and branded sanitary', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4100, maxRatePerSqFt: 6200, description: 'Luxury Raj Nagar villa with smart home automation', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'up-lko-gomti',
    state: 'Uttar Pradesh',
    districtOrCity: 'Lucknow',
    locality: 'East Lucknow / Shaheed Path',
    colonyOrSector: 'Gomti Nagar / Gomti Nagar Ext / Hazratganj / Sushant Golf City',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'LDA Lucknow & UP PWD Rate Schedule 2026',
    localLabourIndex: 1.08,
    materialLogisticsIndex: 1.04,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1480, maxRatePerSqFt: 1780, description: 'Standard LDA approved kothi build', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 1900, maxRatePerSqFt: 2450, description: 'Standard Gomti Nagar Extension double storey residence', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2650, maxRatePerSqFt: 3500, description: 'Premium Shaheed Path villa with false ceiling and branded bath fixtures', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 3900, maxRatePerSqFt: 5800, description: 'Luxury Sushant Golf City bungalow with imported marble and landscape deck', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'up-knp-civil',
    state: 'Uttar Pradesh',
    districtOrCity: 'Kanpur',
    locality: 'Central Kanpur',
    colonyOrSector: 'Civil Lines / Swaroop Nagar / Kakadeo / Tilak Nagar',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'KDA Kanpur & UP PWD Rates 2026',
    localLabourIndex: 1.06,
    materialLogisticsIndex: 1.03,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1460, maxRatePerSqFt: 1750, description: 'Standard KDA approved residential construction', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 1880, maxRatePerSqFt: 2400, description: 'Standard Swaroop Nagar independent kothi build', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2600, maxRatePerSqFt: 3450, description: 'Premium Civil Lines residence with modular fittings', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 3850, maxRatePerSqFt: 5600, description: 'Luxury Kanpur bungalow with Italian marble & security automation', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'up-vns-sigra',
    state: 'Uttar Pradesh',
    districtOrCity: 'Varanasi',
    locality: 'Central Varanasi / Cantt',
    colonyOrSector: 'Sigra / Lanka / Shivpur / Mahmoorganj',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'VDA Varanasi & UP PWD Cost Ledger 2026',
    localLabourIndex: 1.05,
    materialLogisticsIndex: 1.04,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1450, maxRatePerSqFt: 1740, description: 'Standard VDA approved residential home', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 1860, maxRatePerSqFt: 2380, description: 'Standard double storey home in Varanasi', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2580, maxRatePerSqFt: 3400, description: 'Premium Sigra/Mahmoorganj residence with modern finishes', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 3800, maxRatePerSqFt: 5500, description: 'Luxury residence with terrace garden and solar power', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 6. MAHARASHTRA (Mumbai, Pune, Thane, Navi Mumbai, Nagpur, Nashik)
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'mh-mum-bandra',
    state: 'Maharashtra',
    districtOrCity: 'Mumbai',
    locality: 'Western Suburbs / South Mumbai',
    colonyOrSector: 'Bandra West / Khar / Juhu / Andheri West / Worli / Colaba',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'MCGM & CREDAI-MCHI Construction Cost Ledger 2026',
    localLabourIndex: 1.38,
    materialLogisticsIndex: 1.30,
    soilFoundationComplexity: 'High',
    tiers: {
      basic: { minRatePerSqFt: 2100, maxRatePerSqFt: 2600, description: 'Basic Mumbai coastal bylaws compliant structure', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 2900, maxRatePerSqFt: 3800, description: 'Standard Western Suburbs redevelopment floor build', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 4200, maxRatePerSqFt: 5600, description: 'Premium Bandra residence with soundproof glazing and Italian marble', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 6500, maxRatePerSqFt: 10500, description: 'Ultra luxury sea-view penthouse / bungalow with German fixtures & smart automation', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'mh-pune-kothrud',
    state: 'Maharashtra',
    districtOrCity: 'Pune',
    locality: 'West / East Pune Tech Belt',
    colonyOrSector: 'Kothrud / Baner / Wakad / Hinjawadi / Viman Nagar / Koregaon Park',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'PMRDA & Pune Builders Association Index 2026',
    localLabourIndex: 1.15,
    materialLogisticsIndex: 1.10,
    soilFoundationComplexity: 'Medium',
    tiers: {
      basic: { minRatePerSqFt: 1580, maxRatePerSqFt: 1920, description: 'Standard PMRDA approved bungalow build', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 2100, maxRatePerSqFt: 2650, description: 'Standard IT corridor independent row house / villa', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2900, maxRatePerSqFt: 3800, description: 'Premium Baner/Wakad duplex villa with modular kitchen and glass facade', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4300, maxRatePerSqFt: 6500, description: 'Luxury villa with plunge pool, VRV air-conditioning and smart lighting', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'mh-nag-civil',
    state: 'Maharashtra',
    districtOrCity: 'Nagpur',
    locality: 'Central Nagpur / Wardha Road',
    colonyOrSector: 'Civil Lines / Ramdaspeth / Dharampeth / Wardha Road',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'NMC Nagpur & Maharashtra PWD Index 2026',
    localLabourIndex: 1.08,
    materialLogisticsIndex: 1.04,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1480, maxRatePerSqFt: 1780, description: 'Standard NMC approved residential build', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 1900, maxRatePerSqFt: 2450, description: 'Standard Dharampeth double storey kothi', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2650, maxRatePerSqFt: 3500, description: 'Premium Civil Lines villa with Italian marble', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 3900, maxRatePerSqFt: 5800, description: 'Luxury bungalow with solar plant & designer landscape', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 7. KARNATAKA (Bengaluru, Mysuru, Mangaluru)
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'ka-blr-indi',
    state: 'Karnataka',
    districtOrCity: 'Bengaluru',
    locality: 'East / South Bengaluru',
    colonyOrSector: 'Indiranagar / Koramangala / HSR Layout / Whitefield / Jayanagar',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'BDA & CREDAI Karnataka Residential Cost Index 2026',
    localLabourIndex: 1.24,
    materialLogisticsIndex: 1.16,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1750, maxRatePerSqFt: 2150, description: 'Basic BBMP bylaws residential construction', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 2350, maxRatePerSqFt: 3050, description: 'Standard multi-level builder home in prime Bengaluru', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 3300, maxRatePerSqFt: 4400, description: 'Premium Indiranagar duplex with Italian marble and Kohler fittings', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4900, maxRatePerSqFt: 7500, description: 'Ultra-luxury modern villa with rainwater harvesting, solar roof & smart HVAC', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'ka-mys-gokul',
    state: 'Karnataka',
    districtOrCity: 'Mysuru',
    locality: 'Central Mysuru',
    colonyOrSector: 'Gokulam / Jayalakshmipuram / Vijayanagar / Saraswathipuram',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'MUDA Mysuru Cost Schedule 2026',
    localLabourIndex: 1.08,
    materialLogisticsIndex: 1.05,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1480, maxRatePerSqFt: 1780, description: 'Standard MUDA approved residential build', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 1920, maxRatePerSqFt: 2450, description: 'Standard Gokulam double storey home', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2680, maxRatePerSqFt: 3500, description: 'Premium heritage villa with teak doors and Kohler fittings', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 3950, maxRatePerSqFt: 5800, description: 'Luxury residence with solar rooftop & smart automation', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 8. TELANGANA (Hyderabad)
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'ts-hyd-gachi',
    state: 'Telangana',
    districtOrCity: 'Hyderabad',
    locality: 'Financial District / West Hyderabad',
    colonyOrSector: 'Banjara Hills / Jubilee Hills / Gachibowli / Hitec City / Kokapet / Kondapur',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'GHMC & HMDA Builder Construction Index 2026',
    localLabourIndex: 1.20,
    materialLogisticsIndex: 1.12,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1650, maxRatePerSqFt: 2000, description: 'Standard HMDA approved residential build', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 2200, maxRatePerSqFt: 2850, description: 'Standard Gachibowli gated community villa build', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 3100, maxRatePerSqFt: 4100, description: 'Premium Jubilee Hills duplex with double-height ceiling and marble flooring', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4600, maxRatePerSqFt: 7000, description: 'Luxury Neopolis Kokapet villa with private elevator and automated home theatre', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 9. TAMIL NADU (Chennai, Coimbatore, Madurai)
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'tn-chn-anna',
    state: 'Tamil Nadu',
    districtOrCity: 'Chennai',
    locality: 'Central / South Chennai / OMR',
    colonyOrSector: 'Anna Nagar / T. Nagar / Adyar / Besant Nagar / OMR (Thoraipakkam) / Velachery',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'CMDA Chennai & CREDAI Tamil Nadu Index 2026',
    localLabourIndex: 1.22,
    materialLogisticsIndex: 1.15,
    soilFoundationComplexity: 'Medium',
    tiers: {
      basic: { minRatePerSqFt: 1700, maxRatePerSqFt: 2100, description: 'Standard CMDA approved residential build', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 2280, maxRatePerSqFt: 2950, description: 'Standard Anna Nagar / Adyar independent floor / house', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 3200, maxRatePerSqFt: 4300, description: 'Premium coastal residence with anti-corrosion finishes & Italian tiles', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4750, maxRatePerSqFt: 7200, description: 'Luxury ECR/Besant Nagar beach villa with smart automation & plunge pool', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'tn-cbe-rspuram',
    state: 'Tamil Nadu',
    districtOrCity: 'Coimbatore',
    locality: 'Central Coimbatore',
    colonyOrSector: 'RS Puram / Race Course / Peelamedu / Gandhipuram',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'LPA Coimbatore Cost Schedule 2026',
    localLabourIndex: 1.10,
    materialLogisticsIndex: 1.06,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1500, maxRatePerSqFt: 1800, description: 'Standard Coimbatore residential home', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 1950, maxRatePerSqFt: 2500, description: 'Standard RS Puram independent bungalow', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2750, maxRatePerSqFt: 3600, description: 'Premium Race Course villa with modular kitchen', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4000, maxRatePerSqFt: 6000, description: 'Luxury bungalow with solar setup & landscaped courtyard', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 10. WEST BENGAL (Kolkata, Howrah, Siliguri)
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'wb-kol-saltlake',
    state: 'West Bengal',
    districtOrCity: 'Kolkata',
    locality: 'Salt Lake / Rajarhat / South Kolkata',
    colonyOrSector: 'Salt Lake (Sectors 1-5) / New Town Rajarhat / Ballygunge / Alipore',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'KMDA Kolkata & WBHIDCO Index 2026',
    localLabourIndex: 1.18,
    materialLogisticsIndex: 1.12,
    soilFoundationComplexity: 'Medium',
    tiers: {
      basic: { minRatePerSqFt: 1650, maxRatePerSqFt: 2000, description: 'Standard KMDA/HIDCO compliant residential build', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 2200, maxRatePerSqFt: 2850, description: 'Standard Salt Lake / New Town independent house', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 3100, maxRatePerSqFt: 4100, description: 'Premium Ballygunge residence with Italian marble & UPVC windows', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4600, maxRatePerSqFt: 7000, description: 'Ultra luxury Alipore bungalow with basement, elevator and smart automation', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 11. GUJARAT (Ahmedabad, Surat, Vadodara, Rajkot)
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'gj-ahd-sg',
    state: 'Gujarat',
    districtOrCity: 'Ahmedabad',
    locality: 'West Ahmedabad',
    colonyOrSector: 'SG Highway / Bodakdev / Thaltej / Bopal / Prahlad Nagar / Satellite',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'AUDA & GIHED Ahmedabad Cost Schedule 2026',
    localLabourIndex: 1.10,
    materialLogisticsIndex: 1.05,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1500, maxRatePerSqFt: 1800, description: 'Standard AUDA TP scheme residential build', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 1950, maxRatePerSqFt: 2500, description: 'Standard Ahmedabad row house / bungalow build', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2750, maxRatePerSqFt: 3600, description: 'Premium Bodakdev bungalow with Italian tile finish and modular kitchen', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4000, maxRatePerSqFt: 6000, description: 'Luxury SG Highway farmhouse / villa with landscape garden and smart security', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'gj-sur-vesu',
    state: 'Gujarat',
    districtOrCity: 'Surat',
    locality: 'South-West Surat',
    colonyOrSector: 'Vesu / Piplod / Adajan / VIP Road Surat',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'SUDA Surat Rate Benchmark 2026',
    localLabourIndex: 1.10,
    materialLogisticsIndex: 1.05,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1500, maxRatePerSqFt: 1800, description: 'Standard SUDA approved residential bungalow', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 1950, maxRatePerSqFt: 2500, description: 'Standard Vesu / Piplod row house build', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2750, maxRatePerSqFt: 3600, description: 'Premium villa with imported tiles & designer bath fixtures', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4000, maxRatePerSqFt: 6000, description: 'Luxury Vesu bungalow with elevator and smart automation', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 12. RAJASTHAN (Jaipur, Jodhpur, Udaipur, Kota)
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'rj-jpr-vaishali',
    state: 'Rajasthan',
    districtOrCity: 'Jaipur',
    locality: 'South & West Jaipur',
    colonyOrSector: 'Vaishali Nagar / Mansarovar / Jagatpura / Malviya Nagar / C-Scheme / Raja Park',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'JDA Jaipur & Rajasthan PWD Cost Schedule 2026',
    localLabourIndex: 1.05,
    materialLogisticsIndex: 1.02,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1450, maxRatePerSqFt: 1750, description: 'Standard JDA approved residential plot build', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 1880, maxRatePerSqFt: 2400, description: 'Standard Mansarovar double storey independent house', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2600, maxRatePerSqFt: 3450, description: 'Premium Vaishali Nagar villa with Italian tile and modular kitchen', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 3850, maxRatePerSqFt: 5700, description: 'Luxury Jagatpura bungalow with rooftop deck and automated security', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 13. MADHYA PRADESH (Indore, Bhopal, Gwalior, Jabalpur)
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'mp-ind-vijay',
    state: 'Madhya Pradesh',
    districtOrCity: 'Indore',
    locality: 'Super Corridor / AB Road',
    colonyOrSector: 'Vijay Nagar / Palasia / Super Corridor / Saket Nagar / AB Road',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'IDA Indore & MP PWD Cost Schedule 2026',
    localLabourIndex: 1.06,
    materialLogisticsIndex: 1.03,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1460, maxRatePerSqFt: 1750, description: 'Standard IDA approved residential home', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 1880, maxRatePerSqFt: 2400, description: 'Standard Vijay Nagar double storey house', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2620, maxRatePerSqFt: 3480, description: 'Premium Palasia bungalow with modular kitchen', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 3880, maxRatePerSqFt: 5750, description: 'Luxury Super Corridor villa with smart tech and solar plant', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'mp-bpl-arera',
    state: 'Madhya Pradesh',
    districtOrCity: 'Bhopal',
    locality: 'Central Bhopal',
    colonyOrSector: 'Arera Colony (E1-E7) / MP Nagar / Hoshangabad Road',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'BDA Bhopal Cost Schedule 2026',
    localLabourIndex: 1.05,
    materialLogisticsIndex: 1.03,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1450, maxRatePerSqFt: 1740, description: 'Standard BDA approved home in Bhopal', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 1860, maxRatePerSqFt: 2380, description: 'Standard Arera Colony independent kothi', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2580, maxRatePerSqFt: 3420, description: 'Premium Arera villa with Italian tiles and false ceiling', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 3820, maxRatePerSqFt: 5650, description: 'Luxury lake-view bungalow with home automation', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 14. KERALA (Kochi, Thiruvananthapuram, Kozhikode)
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'kl-koc-marine',
    state: 'Kerala',
    districtOrCity: 'Kochi (Ernakulam)',
    locality: 'Central Kochi / Kakkanad IT',
    colonyOrSector: 'Marine Drive / Panampilly Nagar / Kakkanad / Edappally / Kadavanthra',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'GCDA Kochi & Kerala PWD Rate Ledger 2026',
    localLabourIndex: 1.30,
    materialLogisticsIndex: 1.18,
    soilFoundationComplexity: 'Medium',
    tiers: {
      basic: { minRatePerSqFt: 1800, maxRatePerSqFt: 2200, description: 'Standard Kerala tropical residential structure', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 2400, maxRatePerSqFt: 3100, description: 'Standard Panampilly Nagar independent home with teak finishes', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 3350, maxRatePerSqFt: 4400, description: 'Premium contemporary villa with rainwater harvesting & designer tiles', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4900, maxRatePerSqFt: 7400, description: 'Luxury waterfront villa with VRV HVAC and traditional timber accents', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 15. BIHAR & JHARKHAND (Patna, Ranchi, Jamshedpur)
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'br-pat-boring',
    state: 'Bihar',
    districtOrCity: 'Patna',
    locality: 'Central Patna',
    colonyOrSector: 'Boring Road / Patliputra Colony / Kankarbagh / Bailey Road / Danapur',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'PRDA Patna & Bihar PWD Rates 2026',
    localLabourIndex: 1.04,
    materialLogisticsIndex: 1.08,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1450, maxRatePerSqFt: 1750, description: 'Standard PRDA approved residential build', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 1880, maxRatePerSqFt: 2400, description: 'Standard Patliputra Colony double storey home', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2600, maxRatePerSqFt: 3450, description: 'Premium Bailey Road residence with modern finishes', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 3850, maxRatePerSqFt: 5650, description: 'Luxury Patna bungalow with solar plant & elevator', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'jh-rnc-mora',
    state: 'Jharkhand',
    districtOrCity: 'Ranchi',
    locality: 'Central Ranchi',
    colonyOrSector: 'Morabadi / Harmu Housing Colony / Kanke Road / Ashok Nagar',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'RRDA Ranchi Cost Schedule 2026',
    localLabourIndex: 1.04,
    materialLogisticsIndex: 1.06,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1450, maxRatePerSqFt: 1740, description: 'Standard RRDA approved residential home', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 1870, maxRatePerSqFt: 2390, description: 'Standard Morabadi double storey house', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2590, maxRatePerSqFt: 3420, description: 'Premium Kanke Road villa with modern fittings', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 3820, maxRatePerSqFt: 5600, description: 'Luxury residence with solar rooftop & automated security', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 16. ODISHA & ASSAM (Bhubaneswar, Cuttack, Guwahati)
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'or-bbsr-patia',
    state: 'Odisha',
    districtOrCity: 'Bhubaneswar',
    locality: 'North Bhubaneswar',
    colonyOrSector: 'Patia / Saheed Nagar / Chandrasekharpur / Jayadev Vihar',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'BDA Bhubaneswar Cost Index 2026',
    localLabourIndex: 1.05,
    materialLogisticsIndex: 1.05,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1460, maxRatePerSqFt: 1760, description: 'Standard BDA approved home', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 1890, maxRatePerSqFt: 2420, description: 'Standard Patia double storey independent home', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2620, maxRatePerSqFt: 3480, description: 'Premium Jayadev Vihar villa with modular fittings', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 3880, maxRatePerSqFt: 5750, description: 'Luxury bungalow with solar setup & smart locks', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'as-guw-gsrd',
    state: 'Assam',
    districtOrCity: 'Guwahati (Kamrup)',
    locality: 'GS Road Corridor',
    colonyOrSector: 'GS Road / Christian Basti / Dispur / Zoo Road / Beltola',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'GMDA Guwahati & Assam PWD Rates 2026',
    localLabourIndex: 1.12,
    materialLogisticsIndex: 1.15,
    soilFoundationComplexity: 'Medium',
    tiers: {
      basic: { minRatePerSqFt: 1560, maxRatePerSqFt: 1880, description: 'Seismic Zone V compliant basic home structure', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 2050, maxRatePerSqFt: 2620, description: 'Standard Dispur / Beltola double storey house', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2850, maxRatePerSqFt: 3750, description: 'Premium GS Road residence with reinforced RCC and modern finishes', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4200, maxRatePerSqFt: 6300, description: 'Luxury hill-view bungalow with smart automation and rainwater harvesting', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 17. UTTARAKHAND & HIMACHAL PRADESH (Dehradun, Haridwar, Shimla, Dharamshala)
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'uk-ddn-rajpur',
    state: 'Uttarakhand',
    districtOrCity: 'Dehradun',
    locality: 'North Dehradun',
    colonyOrSector: 'Rajpur Road / Sahastradhara Road / GMS Road / Clement Town',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'MDDA Dehradun Cost Ledger 2026',
    localLabourIndex: 1.10,
    materialLogisticsIndex: 1.10,
    soilFoundationComplexity: 'Medium',
    tiers: {
      basic: { minRatePerSqFt: 1520, maxRatePerSqFt: 1840, description: 'Standard MDDA compliant hill-valley build', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 1980, maxRatePerSqFt: 2540, description: 'Standard Rajpur Road cottage/kothi build', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2750, maxRatePerSqFt: 3650, description: 'Premium Mussoorie-facing villa with double glazed UPVC', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4100, maxRatePerSqFt: 6200, description: 'Luxury valley bungalow with heated floors, solar roof & smart HVAC', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },
  {
    id: 'hp-shm-mall',
    state: 'Himachal Pradesh',
    districtOrCity: 'Shimla',
    locality: 'Shimla Urban',
    colonyOrSector: 'Mall Road / Chotta Shimla / Kasumpti / Sanjauli',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'HP TCP & Shimla Municipal Corporation Rates 2026',
    localLabourIndex: 1.25,
    materialLogisticsIndex: 1.25,
    soilFoundationComplexity: 'High',
    tiers: {
      basic: { minRatePerSqFt: 1800, maxRatePerSqFt: 2200, description: 'Hill slope stepped RCC retaining wall structure', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 2400, maxRatePerSqFt: 3100, description: 'Standard Kasumpti / Chotta Shimla 2-3 storey mountain cottage', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 3350, maxRatePerSqFt: 4400, description: 'Premium mountain villa with wood finish and insulated glazing', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4950, maxRatePerSqFt: 7500, description: 'Luxury cedar wood lodge with central heating, solar backup & elevator', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 18. GOA (Panaji, Porvorim, Margao, Candolim)
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'ga-pan-mira',
    state: 'Goa',
    districtOrCity: 'North Goa (Panaji)',
    locality: 'Coastal North Goa',
    colonyOrSector: 'Miramar / Caranzalem / Porvorim / Candolim / Dona Paula',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'PDA Goa & CREDAI Goa Cost Index 2026',
    localLabourIndex: 1.22,
    materialLogisticsIndex: 1.18,
    soilFoundationComplexity: 'Medium',
    tiers: {
      basic: { minRatePerSqFt: 1720, maxRatePerSqFt: 2100, description: 'Standard Portuguese roof / coastal villa build', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 2300, maxRatePerSqFt: 3000, description: 'Standard Porvorim / Caranzalem residential villa', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 3250, maxRatePerSqFt: 4350, description: 'Premium Dona Paula sea-breeze villa with weather-resistant timber and modular kitchen', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4800, maxRatePerSqFt: 7300, description: 'Ultra luxury Portuguese heritage villa with private swimming pool and home automation', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 19. JAMMU & KASHMIR (Jammu, Srinagar)
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'jk-jmu-gandhi',
    state: 'Jammu and Kashmir',
    districtOrCity: 'Jammu',
    locality: 'South Jammu',
    colonyOrSector: 'Gandhi Nagar / Channi Himmat / Trikuta Nagar / Sainik Colony',
    level: 'Colony',
    confidence: 'High',
    lastUpdated: 'Q3 2026',
    sourceMethodology: 'JDA Jammu & J&K PWD Schedule 2026',
    localLabourIndex: 1.10,
    materialLogisticsIndex: 1.12,
    soilFoundationComplexity: 'Low',
    tiers: {
      basic: { minRatePerSqFt: 1520, maxRatePerSqFt: 1840, description: 'Standard JDA approved residential home', keySpecs: NATIONAL_BASELINE_RATES.basic.keySpecs },
      standard: { minRatePerSqFt: 1980, maxRatePerSqFt: 2540, description: 'Standard Gandhi Nagar / Channi Himmat double storey kothi', keySpecs: NATIONAL_BASELINE_RATES.standard.keySpecs },
      premium: { minRatePerSqFt: 2750, maxRatePerSqFt: 3650, description: 'Premium kothi with false ceiling and branded bath fittings', keySpecs: NATIONAL_BASELINE_RATES.premium.keySpecs },
      luxury: { minRatePerSqFt: 4100, maxRatePerSqFt: 6200, description: 'Luxury residence with solar rooftop & automated security', keySpecs: NATIONAL_BASELINE_RATES.luxury.keySpecs }
    }
  }
];

// ─── 3. TRADE COST BREAKDOWN DISTRIBUTION MATRIX (%) ─────────────────────────
export const TRADE_BREAKDOWN_PERCENTAGES: Record<string, {
  category: string;
  subTitle: string;
  percentage: number;
  materialDetails: string;
}> = {
  civil: {
    category: '1. Civil & Structural Concrete',
    subTitle: 'RCC Footings, Columns, Beams, Slabs & Excavation',
    percentage: 16.5,
    materialDetails: 'M20/M25 Ready-Mix Concrete, Shuttering Ply, Anti-termite treatment'
  },
  labour: {
    category: '2. Labour & Masonry Work',
    subTitle: 'Daily mason, bar bender, carpenter & helper wages',
    percentage: 18.0,
    materialDetails: 'Skilled masons, shuttering carpenters, steel fixers, general labour'
  },
  steel: {
    category: '3. Steel & TMT Rebars',
    subTitle: 'Fe 550D / Fe 500 High-Ductility TMT Bars',
    percentage: 11.5,
    materialDetails: 'Tata Tiscon, JSW Neosteel, Kamdhenu Fe550D (approx. 3.8–4.2 kg/sqft)'
  },
  cement: {
    category: '4. Cement (OPC / PPC)',
    subTitle: 'Grade 43/53 high early strength cement bags',
    percentage: 9.5,
    materialDetails: 'Ultratech, ACC Suraksha, Ambuja (approx. 0.40–0.45 bags/sqft)'
  },
  bricks: {
    category: '5. Bricks, AAC Blocks & Coarse Sand',
    subTitle: 'Red clay kiln bricks, river sand & blue stone aggregate',
    percentage: 6.0,
    materialDetails: 'Class-1 Red Bricks / 8" AAC Light-weight Blocks, River Sand, 20mm Aggregate'
  },
  flooring: {
    category: '6. Flooring, Tiling & Skirting',
    subTitle: 'Vitrified tiles, Italian marble, granite stairs',
    percentage: 8.5,
    materialDetails: 'Kajaria/Somany GVT tiles, Italian marble lobby, Black Galaxy granite stairs'
  },
  doors_windows: {
    category: '7. Doors, Windows & Glazing',
    subTitle: 'UPVC multi-track sliding windows & teak main door',
    percentage: 6.0,
    materialDetails: 'Fenesta/Kommerling UPVC with toughened glass, Teak wood main door & flush doors'
  },
  electrical: {
    category: '8. Electrical, Wiring & Lighting',
    subTitle: 'Concealed conduits, FRLS copper wires & modular switches',
    percentage: 5.5,
    materialDetails: 'Havells/Polycab FRLS copper wires, Schneider/Legrand modular switches, MCBs'
  },
  plumbing: {
    category: '9. Plumbing, Water Tanks & Drainage',
    subTitle: 'CPVC water lines, SWR drainage & overhead tank',
    percentage: 4.5,
    materialDetails: 'Astral/Ashirvad CPVC hot/cold pipes, Supreme SWR drainage, Sintex 1500L tank'
  },
  kitchen: {
    category: '10. Modular Kitchen & Countertops',
    subTitle: 'Marine ply cabinets, quartz/granite top & chimney setup',
    percentage: 4.0,
    materialDetails: 'BWP Marine ply cabinets, soft-close Blum hardware, Faber chimney & quartz top'
  },
  bathrooms: {
    category: '11. Bathrooms & CP Sanitaryware',
    subTitle: 'Wall-hung EWCs, vanity, diverters & shower panels',
    percentage: 3.5,
    materialDetails: 'Jaquar/Kohler thermostatic diverters, wall-hung commodes, vanity mirrors'
  },
  painting: {
    category: '12. Painting, Putty & Wall Finishes',
    subTitle: 'Acrylic putty, primer, interior & exterior emulsion',
    percentage: 3.0,
    materialDetails: 'Birla White Putty, Asian Paints Royale Luxury interior & Apex Ultima exterior'
  },
  interiors: {
    category: '13. Interior Woodwork & Wardrobes',
    subTitle: 'Built-in bedroom wardrobes, TV unit & false ceiling',
    percentage: 2.0,
    materialDetails: 'Commercial ply with 1mm laminate, Gyproc false ceiling with LED cob lights'
  },
  external: {
    category: '14. Boundary Wall, Main Gate & Elevation',
    subTitle: 'Front designer elevation, MS gate & driveway pavers',
    percentage: 1.0,
    materialDetails: 'Heavy MS sliding gate, exterior texture cladding, heavy-duty driveway pavers'
  },
  contingency: {
    category: '15. Contingency & Architecture Fees',
    subTitle: 'Architectural blueprints, site supervision & safety',
    percentage: 0.5,
    materialDetails: 'Architectural structural drawings, municipal liaison, on-site contingency'
  }
};
