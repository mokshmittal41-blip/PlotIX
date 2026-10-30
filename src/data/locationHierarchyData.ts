import type { DistrictIntelligence, LocationSearchResult } from '../types/locationHierarchy';

// ─── REWARI DISTRICT DATA (Verified Seed Dataset) ───────────────────────────
export const REWARI_DISTRICT_INTELLIGENCE: DistrictIntelligence = {
  district: 'Rewari',
  state: 'Haryana',
  coordinates: [28.1920, 76.6186],
  tehsils: [
    {
      id: 'teh-rewari',
      name: 'Rewari Tehsil',
      district: 'Rewari',
      state: 'Haryana',
      coordinates: [28.1980, 76.6190],
      villagesCount: 142,
      mandisCount: 3,
      avgPriceSqYd: '₹32,000 - ₹68,000',
      keyVillages: ['Saharanwas', 'Gokalgarh', 'Konsiwas', 'Lisana', 'Qutabpur'],
      keyLocalities: ['Model Town', 'Brass Market', 'Sector 3', 'Sector 4', 'Circular Road', 'Garhi Bolni Road'],
      isVerified: true
    },
    {
      id: 'teh-bawal',
      name: 'Bawal Tehsil',
      district: 'Rewari',
      state: 'Haryana',
      coordinates: [28.0833, 76.5833],
      villagesCount: 98,
      mandisCount: 2,
      avgPriceSqYd: '₹22,000 - ₹45,000',
      keyVillages: ['Khori', 'Majra Shekhawat', 'Pranpura', 'Nandrampur Bass', 'Suthana'],
      keyLocalities: ['Bawal IMT Sector 1', 'Bawal IMT Sector 3', 'NH-48 Industrial Belt', 'Bawal Main Chowk'],
      isVerified: true
    },
    {
      id: 'teh-dharuhera',
      name: 'Dharuhera Sub-Tehsil',
      district: 'Rewari',
      state: 'Haryana',
      coordinates: [28.2056, 76.7917],
      villagesCount: 46,
      mandisCount: 1,
      avgPriceSqYd: '₹28,000 - ₹58,000',
      keyVillages: ['Masani', 'Malpura', 'Kapriwas', 'Akera', 'Maheshwari'],
      keyLocalities: ['Sector 6 Dharuhera', 'Bestech City', 'Anandam Estate', 'NH-48 Growth Corridor'],
      isVerified: true
    },
    {
      id: 'teh-kosli',
      name: 'Kosli Tehsil',
      district: 'Rewari',
      state: 'Haryana',
      coordinates: [28.4110, 76.4780],
      villagesCount: 78,
      mandisCount: 1,
      avgPriceSqYd: '₹14,000 - ₹30,000',
      keyVillages: ['Jatusana', 'Berli Kalan', 'Dhaliawas', 'Tumna', 'Mundhal'],
      keyLocalities: ['Kosli Station Road', 'Jatusana Bypass', 'Sub-Tehsil Market'],
      isVerified: true
    },
    {
      id: 'teh-khol',
      name: 'Khol Sub-Tehsil / Block',
      district: 'Rewari',
      state: 'Haryana',
      coordinates: [28.2167, 76.4500],
      villagesCount: 52,
      mandisCount: 1,
      avgPriceSqYd: '₹12,000 - ₹26,000',
      keyVillages: ['Khol', 'Dahina', 'Kund', 'Pithrawas', 'Zainabad'],
      keyLocalities: ['Khol Main Market', 'Kund Industrial Cluster', 'Dahina-Kanina Road'],
      isVerified: true
    },
    {
      id: 'teh-manethi',
      name: 'Manethi Sub-Tehsil',
      district: 'Rewari',
      state: 'Haryana',
      coordinates: [28.1150, 76.4720],
      villagesCount: 34,
      mandisCount: 1,
      avgPriceSqYd: '₹16,000 - ₹35,000',
      keyVillages: ['Manethi', 'Majra Mustil', 'Balkhur', 'Nangal Teju'],
      keyLocalities: ['AIIMS Site Corridor', 'Manethi-Kund Road'],
      isVerified: true
    }
  ],
  villages: [
    { id: 'vil-bawal-khori', name: 'Khori', tehsil: 'Bawal', district: 'Rewari', coordinates: [28.0620, 76.5410], hadbastNumber: 'HB-42', isVerified: true, propertyCount: 6 },
    { id: 'vil-bawal-majra', name: 'Majra Shekhawat', tehsil: 'Bawal', district: 'Rewari', coordinates: [28.0950, 76.5620], hadbastNumber: 'HB-19', isVerified: true, propertyCount: 4 },
    { id: 'vil-bawal-pranpura', name: 'Pranpura', tehsil: 'Bawal', district: 'Rewari', coordinates: [28.0710, 76.6020], hadbastNumber: 'HB-88', isVerified: true, propertyCount: 3 },
    { id: 'vil-rewari-saharanwas', name: 'Saharanwas', tehsil: 'Rewari', district: 'Rewari', coordinates: [28.1820, 76.6430], hadbastNumber: 'HB-05', isVerified: true, propertyCount: 8 },
    { id: 'vil-rewari-gokalgarh', name: 'Gokalgarh', tehsil: 'Rewari', district: 'Rewari', coordinates: [28.2210, 76.6110], hadbastNumber: 'HB-12', isVerified: true, propertyCount: 5 },
    { id: 'vil-rewari-lisana', name: 'Lisana', tehsil: 'Rewari', district: 'Rewari', coordinates: [28.1630, 76.5890], hadbastNumber: 'HB-31', isVerified: true, propertyCount: 4 },
    { id: 'vil-dharuhera-masani', name: 'Masani', tehsil: 'Dharuhera', district: 'Rewari', coordinates: [28.2150, 76.7620], hadbastNumber: 'HB-64', isVerified: true, propertyCount: 7 },
    { id: 'vil-dharuhera-malpura', name: 'Malpura', tehsil: 'Dharuhera', district: 'Rewari', coordinates: [28.1980, 76.8120], hadbastNumber: 'HB-72', isVerified: true, propertyCount: 5 },
    { id: 'vil-khol-khol', name: 'Khol', tehsil: 'Khol', district: 'Rewari', coordinates: [28.2167, 76.4500], hadbastNumber: 'HB-101', isVerified: true, propertyCount: 5 },
    { id: 'vil-khol-dahina', name: 'Dahina', tehsil: 'Khol', district: 'Rewari', coordinates: [28.2540, 76.3980], hadbastNumber: 'HB-115', isVerified: true, propertyCount: 3 },
    { id: 'vil-khol-kund', name: 'Kund', tehsil: 'Khol', district: 'Rewari', coordinates: [28.1420, 76.4210], hadbastNumber: 'HB-92', isVerified: true, propertyCount: 6 },
    { id: 'vil-kosli-jatusana', name: 'Jatusana', tehsil: 'Kosli', district: 'Rewari', coordinates: [28.3120, 76.5120], hadbastNumber: 'HB-140', isVerified: true, propertyCount: 4 },
    { id: 'vil-manethi-manethi', name: 'Manethi', tehsil: 'Manethi', district: 'Rewari', coordinates: [28.1150, 76.4720], hadbastNumber: 'HB-160', isVerified: true, propertyCount: 5 }
  ],
  mandis: [
    {
      id: 'mandi-rewari-anaj',
      name: 'Rewari Main Anaj Mandi (Grain Market)',
      type: 'Grain Mandi',
      tehsil: 'Rewari',
      district: 'Rewari',
      coordinates: [28.1950, 76.6250],
      commodities: ['Mustard (Sarson)', 'Wheat (Kanak)', 'Bajra', 'Barley'],
      isVerified: true,
      notes: 'One of Haryana’s largest mustard & coarse grain trading hubs.'
    },
    {
      id: 'mandi-rewari-brass',
      name: 'Rewari Brass Market & Metal Commercial Hub',
      type: 'Commercial Market',
      tehsil: 'Rewari',
      district: 'Rewari',
      coordinates: [28.1910, 76.6150],
      commodities: ['Brass & Copper Ware', 'Hardware', 'Commercial Retail'],
      isVerified: true,
      notes: 'Historic trading district giving Rewari its title as the Brass City.'
    },
    {
      id: 'mandi-bawal-grain',
      name: 'Bawal Grain & Agro Produce Mandi',
      type: 'Grain Mandi',
      tehsil: 'Bawal',
      district: 'Rewari',
      coordinates: [28.0860, 76.5890],
      commodities: ['Mustard', 'Bajra', 'Gram (Chana)'],
      isVerified: true,
      notes: 'Serves over 90 farming villages across Bawal tehsil.'
    },
    {
      id: 'mandi-bawal-industrial',
      name: 'Bawal IMT Industrial & Logistics Hub',
      type: 'Industrial Market',
      tehsil: 'Bawal',
      district: 'Rewari',
      coordinates: [28.0720, 76.5950],
      commodities: ['Auto-ancillary Units', 'Warehousing', 'Industrial Plots'],
      isVerified: true,
      notes: 'Key anchor zone on the Delhi-Mumbai Industrial Corridor (DMIC).'
    },
    {
      id: 'mandi-dharuhera-autohub',
      name: 'Dharuhera Auto-Hub & Logistics Market',
      type: 'Auto-Hub',
      tehsil: 'Dharuhera',
      district: 'Rewari',
      coordinates: [28.2100, 76.7850],
      commodities: ['Automobile Component Distribution', 'Heavy Machinery', 'Commercial Logistics'],
      isVerified: true,
      notes: 'Located on NH-48 gateway connecting Gurugram to Rewari.'
    },
    {
      id: 'mandi-khol-krishi',
      name: 'Khol Krishi Upaj Mandi Sub-Yard',
      type: 'Vegetable / Agro Mandi',
      tehsil: 'Khol',
      district: 'Rewari',
      coordinates: [28.2190, 76.4520],
      commodities: ['Mustard', 'Millets', 'Seasonal Vegetables'],
      isVerified: true,
      notes: 'Local agricultural trading hub for western Rewari district.'
    }
  ],
  priceTrends: {
    avgResidentialPlotSqYd: 38500,
    avgAgriLandPerAcre: 6800000,
    avgCommercialSqYd: 7400000 / 100, // ₹74,000/sq.yd.
    yoyGrowthPercent: 14.8,
    demandIndex: 'High'
  },
  popularCorridors: [
    {
      name: 'NH-48 Delhi-Jaipur Expressway Belt',
      tag: 'High Appreciation',
      description: 'Major industrial and warehousing corridor connecting Dharuhera, Bawal, and Shahjahanpur.'
    },
    {
      name: 'Rewari-Pataudi-Gurugram Highway Corridor',
      tag: 'Emerging Residential',
      description: 'Rapid growth corridor benefiting from expanded 4-lane connectivity to Dwarka Expressway.'
    },
    {
      name: 'Bawal IMT Growth Ring',
      tag: 'Industrial & Rental',
      description: 'High rental yield driven by multinational auto-manufacturing and electronics workforce.'
    },
    {
      name: 'Manethi AIIMS Zone',
      tag: 'Government Infrastructure',
      description: 'Surging demand in healthcare and institutional plotted developments.'
    }
  ],
  verifiedListingsCount: 28,
  coverageNote: 'Verified seed dataset with 6 tehsils, 13 mapped villages, 6 prominent mandis/markets, and 28 verified listings in Rewari District.'
};

// ─── GURUGRAM DISTRICT INTELLIGENCE ──────────────────────────────────────────
export const GURUGRAM_DISTRICT_INTELLIGENCE: DistrictIntelligence = {
  district: 'Gurugram',
  state: 'Haryana',
  coordinates: [28.4595, 77.0266],
  tehsils: [
    {
      id: 'teh-gurugram',
      name: 'Gurugram Tehsil',
      district: 'Gurugram',
      state: 'Haryana',
      coordinates: [28.4600, 77.0300],
      villagesCount: 85,
      mandisCount: 2,
      avgPriceSqYd: '₹95,000 - ₹2,80,000',
      keyVillages: ['Sikanderpur', 'Chakkarpur', 'Wazirabad', 'Badshahpur'],
      keyLocalities: ['Golf Course Road', 'DLF Phase 1-5', 'Sector 57', 'Sohna Road'],
      isVerified: true
    },
    {
      id: 'teh-manesar',
      name: 'Manesar Tehsil',
      district: 'Gurugram',
      state: 'Haryana',
      coordinates: [28.3580, 76.9380],
      villagesCount: 42,
      mandisCount: 1,
      avgPriceSqYd: '₹45,000 - ₹95,000',
      keyVillages: ['Nainwal', 'Kasan', 'Kankrola', 'Naurangpur'],
      keyLocalities: ['IMT Manesar Sectors 1-8', 'Sector 84', 'New Gurugram'],
      isVerified: true
    },
    {
      id: 'teh-sohna',
      name: 'Sohna Tehsil',
      district: 'Gurugram',
      state: 'Haryana',
      coordinates: [28.2470, 77.0620],
      villagesCount: 65,
      mandisCount: 1,
      avgPriceSqYd: '₹35,000 - ₹75,000',
      keyVillages: ['Khedla', 'Silani', 'Alwar Road belt'],
      keyLocalities: ['Sohna Elevated Corridor', 'Sector 33 Sohna', 'South Gurugram'],
      isVerified: true
    },
    {
      id: 'teh-pataudi',
      name: 'Pataudi Tehsil',
      district: 'Gurugram',
      state: 'Haryana',
      coordinates: [28.3240, 76.7780],
      villagesCount: 58,
      mandisCount: 1,
      avgPriceSqYd: '₹18,000 - ₹42,000',
      keyVillages: ['Haileymandi', 'Khandevla', 'Inchhapuri'],
      keyLocalities: ['Pataudi Main Market', 'Haileymandi Station Road'],
      isVerified: true
    }
  ],
  villages: [
    { id: 'vil-ggn-badshahpur', name: 'Badshahpur', tehsil: 'Gurugram', district: 'Gurugram', coordinates: [28.3960, 77.0540], isVerified: true, propertyCount: 12 },
    { id: 'vil-ggn-kasan', name: 'Kasan', tehsil: 'Manesar', district: 'Gurugram', coordinates: [28.3480, 76.9120], isVerified: true, propertyCount: 6 },
    { id: 'vil-ggn-haileymandi', name: 'Haileymandi', tehsil: 'Pataudi', district: 'Gurugram', coordinates: [28.3390, 76.7620], isVerified: true, propertyCount: 5 }
  ],
  mandis: [
    {
      id: 'mandi-ggn-khandsa',
      name: 'Khandsa Anaj & Sabzi Mandi',
      type: 'Vegetable / Agro Mandi',
      tehsil: 'Gurugram',
      district: 'Gurugram',
      coordinates: [28.4350, 77.0120],
      commodities: ['Wholesale Fruits & Vegetables', 'Grains'],
      isVerified: true
    },
    {
      id: 'mandi-haileymandi-grain',
      name: 'Haileymandi Grain Market (Pataudi)',
      type: 'Grain Mandi',
      tehsil: 'Pataudi',
      district: 'Gurugram',
      coordinates: [28.3410, 76.7680],
      commodities: ['Mustard', 'Wheat', 'Paddy'],
      isVerified: true
    }
  ],
  priceTrends: {
    avgResidentialPlotSqYd: 125000,
    avgAgriLandPerAcre: 18500000,
    avgCommercialSqYd: 210000,
    yoyGrowthPercent: 18.2,
    demandIndex: 'Very High'
  },
  popularCorridors: [
    { name: 'Dwarka Expressway (NH-248BB)', tag: 'Tier 1 Growth', description: 'Global city connectivity corridor with rapid luxury high-rise development.' },
    { name: 'Golf Course Extension Road', tag: 'Prime Luxury', description: 'Institutional and high-density commercial & luxury residence belt.' },
    { name: 'Sohna Elevated Highway Corridor', tag: 'Affordable Plotted', description: 'Direct expressway connectivity from Subhash Chowk to Sohna master plan sectors.' }
  ],
  verifiedListingsCount: 34,
  coverageNote: 'Verified dataset covering Gurugram, Manesar, Sohna, and Pataudi.'
};

// ─── SAS NAGAR (MOHALI) DISTRICT INTELLIGENCE ─────────────────────────────────
export const MOHALI_DISTRICT_INTELLIGENCE: DistrictIntelligence = {
  district: 'SAS Nagar (Mohali)',
  state: 'Punjab',
  coordinates: [30.6799, 76.7221],
  tehsils: [
    {
      id: 'teh-mohali',
      name: 'Mohali Tehsil',
      district: 'SAS Nagar (Mohali)',
      state: 'Punjab',
      coordinates: [30.6850, 76.7280],
      villagesCount: 92,
      mandisCount: 2,
      avgPriceSqYd: '₹45,000 - ₹1,10,000',
      keyVillages: ['Sohana', 'Kumbra', 'Mattran', 'Chuhar Majra'],
      keyLocalities: ['Sector 82 JLPL', 'Sector 66 IT City', 'Aerocity', 'Sector 70'],
      isVerified: true
    },
    {
      id: 'teh-kharar',
      name: 'Kharar Tehsil',
      district: 'SAS Nagar (Mohali)',
      state: 'Punjab',
      coordinates: [30.7450, 76.6450],
      villagesCount: 110,
      mandisCount: 1,
      avgPriceSqYd: '₹24,000 - ₹55,000',
      keyVillages: ['Chhajumajra', 'Desumajra', 'Bhagomajra', 'Jandpur'],
      keyLocalities: ['Kharar-Kurali Highway', 'Sector 125 Sunny Enclave', 'Landran Road'],
      isVerified: true
    },
    {
      id: 'teh-derabassi',
      name: 'Dera Bassi Tehsil',
      district: 'SAS Nagar (Mohali)',
      state: 'Punjab',
      coordinates: [30.5850, 76.8450],
      villagesCount: 125,
      mandisCount: 2,
      avgPriceSqYd: '₹18,000 - ₹42,000',
      keyVillages: ['Mubarikpur', 'Saidpura', 'Bhankharpur', 'Issapur'],
      keyLocalities: ['Zirakpur VIP Road', 'PR7 Airport Ring Road', 'Dera Bassi Industrial Zone'],
      isVerified: true
    },
    {
      id: 'teh-majri',
      name: 'Majri (New Chandigarh) Sub-Tehsil',
      district: 'SAS Nagar (Mohali)',
      state: 'Punjab',
      coordinates: [30.8040, 76.7550],
      villagesCount: 68,
      mandisCount: 1,
      avgPriceSqYd: '₹48,000 - ₹1,20,000',
      keyVillages: ['Mullanpur Garibdas', 'Ratwara', 'Sarangpur border', 'Palheri'],
      keyLocalities: ['Eco City 1 & 2', 'Medicity', 'Omaxe New Chandigarh', 'DLF Hyde Park'],
      isVerified: true
    }
  ],
  villages: [
    { id: 'vil-mohali-sohana', name: 'Sohana', tehsil: 'Mohali', district: 'SAS Nagar (Mohali)', coordinates: [30.6820, 76.7110], isVerified: true, propertyCount: 10 },
    { id: 'vil-mohali-kumbra', name: 'Kumbra', tehsil: 'Mohali', district: 'SAS Nagar (Mohali)', coordinates: [30.6970, 76.7210], isVerified: true, propertyCount: 6 },
    { id: 'vil-kharar-landran', name: 'Landran', tehsil: 'Kharar', district: 'SAS Nagar (Mohali)', coordinates: [30.6910, 76.6620], isVerified: true, propertyCount: 8 },
    { id: 'vil-majri-mullanpur', name: 'Mullanpur Garibdas', tehsil: 'Majri', district: 'SAS Nagar (Mohali)', coordinates: [30.7950, 76.7620], isVerified: true, propertyCount: 9 }
  ],
  mandis: [
    {
      id: 'mandi-mohali-phase8',
      name: 'Phase 8 Mohali Sabzi & Kisan Mandi',
      type: 'Vegetable / Agro Mandi',
      tehsil: 'Mohali',
      district: 'SAS Nagar (Mohali)',
      coordinates: [30.7100, 76.7240],
      commodities: ['Kisan Direct Produce', 'Organic Vegetables', 'Fruits'],
      isVerified: true
    },
    {
      id: 'mandi-kharar-grain',
      name: 'Kharar Anaj Mandi',
      type: 'Grain Mandi',
      tehsil: 'Kharar',
      district: 'SAS Nagar (Mohali)',
      coordinates: [30.7480, 76.6480],
      commodities: ['Wheat', 'Paddy', 'Maize'],
      isVerified: true
    },
    {
      id: 'mandi-derabassi-grain',
      name: 'Dera Bassi Main Grain & Timber Market',
      type: 'Grain Mandi',
      tehsil: 'Dera Bassi',
      district: 'SAS Nagar (Mohali)',
      coordinates: [30.5890, 76.8480],
      commodities: ['Grains', 'Timber', 'Industrial Scrap'],
      isVerified: true
    }
  ],
  priceTrends: {
    avgResidentialPlotSqYd: 68500,
    avgAgriLandPerAcre: 11000000,
    avgCommercialSqYd: 135000,
    yoyGrowthPercent: 16.4,
    demandIndex: 'Very High'
  },
  popularCorridors: [
    { name: 'PR7 Airport Road / Aerocity Corridor', tag: 'Fastest Growing', description: '200ft wide lifeline connecting Chandigarh International Airport to NH-44 and Kharar.' },
    { name: 'IT City Sector 82/83 JLPL Corridor', tag: 'Tech Hub Plotted', description: 'Anchor zone for Infosys, HCL, Ashoka University, and Plotted Residential estates.' },
    { name: 'New Chandigarh GMADA Master Plan', tag: 'Eco Master Plan', description: 'Low-density planned luxury zones, MediCity healthcare hub, and wide green corridors.' }
  ],
  verifiedListingsCount: 38,
  coverageNote: 'Verified dataset covering Mohali, Kharar, Zirakpur, Dera Bassi, and New Chandigarh.'
};

// ─── PANCHKULA DISTRICT INTELLIGENCE ──────────────────────────────────────────
export const PANCHKULA_DISTRICT_INTELLIGENCE: DistrictIntelligence = {
  district: 'Panchkula',
  state: 'Haryana',
  coordinates: [30.6942, 76.8606],
  tehsils: [
    {
      id: 'teh-panchkula',
      name: 'Panchkula Tehsil',
      district: 'Panchkula',
      state: 'Haryana',
      coordinates: [30.6942, 76.8606],
      villagesCount: 64,
      mandisCount: 1,
      avgPriceSqYd: '₹60,000 - ₹1,40,000',
      keyVillages: ['Bhadroya', 'Abheypur', 'Maheshpur', 'Bir Ghaggar'],
      keyLocalities: ['Sector 20', 'Sector 4 MDC', 'Sector 14', 'Sector 25'],
      isVerified: true
    },
    {
      id: 'teh-kalka',
      name: 'Kalka & Pinjore Tehsil',
      district: 'Panchkula',
      state: 'Haryana',
      coordinates: [30.8350, 76.9380],
      villagesCount: 78,
      mandisCount: 1,
      avgPriceSqYd: '₹22,000 - ₹48,000',
      keyVillages: ['Pinjore', 'Bitna', 'Dhamala', 'Surajpur'],
      keyLocalities: ['NH-22 Himalayan Expressway', 'Pinjore Gardens belt', 'Kalka Town'],
      isVerified: true
    }
  ],
  villages: [
    { id: 'vil-pki-abheypur', name: 'Abheypur', tehsil: 'Panchkula', district: 'Panchkula', coordinates: [30.6890, 76.8520], isVerified: true, propertyCount: 5 },
    { id: 'vil-pki-pinjore', name: 'Pinjore', tehsil: 'Kalka', district: 'Panchkula', coordinates: [30.7950, 76.9180], isVerified: true, propertyCount: 6 }
  ],
  mandis: [
    {
      id: 'mandi-panchkula-sec20',
      name: 'Sector 20 Panchkula Kisan & Vegetable Mandi',
      type: 'Vegetable / Agro Mandi',
      tehsil: 'Panchkula',
      district: 'Panchkula',
      coordinates: [30.6860, 76.8560],
      commodities: ['Fresh Produce', 'Seasonal Crops'],
      isVerified: true
    }
  ],
  priceTrends: {
    avgResidentialPlotSqYd: 88000,
    avgAgriLandPerAcre: 13500000,
    avgCommercialSqYd: 160000,
    yoyGrowthPercent: 12.5,
    demandIndex: 'High'
  },
  popularCorridors: [
    { name: 'MDC Sector 4-6 Luxury Foothill Zone', tag: 'Ultra Prime', description: 'Scenic Shivalik foothill enclave adjacent to Chandigarh IT Park.' },
    { name: 'Pinjore-Kalka Urban Complex (HSVP)', tag: 'Mountain Gateway', description: 'Integrated residential township on Himalayan Expressway corridor.' }
  ],
  verifiedListingsCount: 18,
  coverageNote: 'Verified dataset covering Panchkula HSVP sectors, MDC, Pinjore, and Kalka.'
};

// ─── LUDHIANA DISTRICT INTELLIGENCE ──────────────────────────────────────────
export const LUDHIANA_DISTRICT_INTELLIGENCE: DistrictIntelligence = {
  district: 'Ludhiana',
  state: 'Punjab',
  coordinates: [30.9010, 75.8573],
  tehsils: [
    {
      id: 'teh-ludhiana-west',
      name: 'Ludhiana West Tehsil',
      district: 'Ludhiana',
      state: 'Punjab',
      coordinates: [30.9050, 75.8450],
      villagesCount: 74,
      mandisCount: 2,
      avgPriceSqYd: '₹45,000 - ₹1,25,000',
      keyVillages: ['Bhamian Kalan', 'Ayali Kalan', 'Barewal Awana', 'Sunet'],
      keyLocalities: ['Model Town', 'Sarabha Nagar', 'Ferozepur Road', 'BRS Nagar'],
      isVerified: true
    },
    {
      id: 'teh-ludhiana-east',
      name: 'Ludhiana East Tehsil',
      district: 'Ludhiana',
      state: 'Punjab',
      coordinates: [30.8950, 75.8750],
      villagesCount: 88,
      mandisCount: 2,
      avgPriceSqYd: '₹32,000 - ₹75,000',
      keyVillages: ['Mundian Kalan', 'Jandiali', 'Kohara', 'Jamalpur'],
      keyLocalities: ['Chandigarh Road', 'Focal Point', 'Sector 32 Urban Estate'],
      isVerified: true
    },
    {
      id: 'teh-khanna',
      name: 'Khanna Tehsil (Asia Largest Mandi)',
      district: 'Ludhiana',
      state: 'Punjab',
      coordinates: [30.7070, 76.2160],
      villagesCount: 95,
      mandisCount: 1,
      avgPriceSqYd: '₹22,000 - ₹48,000',
      keyVillages: ['Lalheri', 'Ikolaha', 'Bhattian', 'Rahoun'],
      keyLocalities: ['GT Road Khanna', 'Samrala Road', 'Guru Amar Dass Market'],
      isVerified: true
    }
  ],
  villages: [
    { id: 'vil-ldh-ayali', name: 'Ayali Kalan', tehsil: 'Ludhiana West', district: 'Ludhiana', coordinates: [30.9120, 75.7950], isVerified: true, propertyCount: 8 },
    { id: 'vil-ldh-barewal', name: 'Barewal Awana', tehsil: 'Ludhiana West', district: 'Ludhiana', coordinates: [30.8950, 75.8080], isVerified: true, propertyCount: 6 },
    { id: 'vil-ldh-kohara', name: 'Kohara', tehsil: 'Ludhiana East', district: 'Ludhiana', coordinates: [30.8650, 75.9850], isVerified: true, propertyCount: 7 }
  ],
  mandis: [
    {
      id: 'mandi-ldh-khanna',
      name: 'Khanna Grain Market (Asia’s Largest Mandi)',
      type: 'Grain Mandi',
      tehsil: 'Khanna',
      district: 'Ludhiana',
      coordinates: [30.7050, 76.2190],
      commodities: ['Wheat', 'Paddy', 'Basmati Grain'],
      isVerified: true
    },
    {
      id: 'mandi-ldh-salemtabri',
      name: 'Salem Tabri Sabzi & Fruit Mandi',
      type: 'Vegetable / Agro Mandi',
      tehsil: 'Ludhiana West',
      district: 'Ludhiana',
      coordinates: [30.9250, 75.8420],
      commodities: ['Vegetables', 'Fruits', 'Green Fodder'],
      isVerified: true
    }
  ],
  priceTrends: {
    avgResidentialPlotSqYd: 58000,
    avgAgriLandPerAcre: 11000000,
    avgCommercialSqYd: 145000,
    yoyGrowthPercent: 15.4,
    demandIndex: 'Very High'
  },
  popularCorridors: [
    { name: 'Ferozepur Road Smart Expressway Belt', tag: 'Luxury Plotted', description: 'Premier residential hub connecting South City, BRS Nagar, and Ayali.' },
    { name: 'Chandigarh-Ludhiana Highway Growth Ring', tag: 'Commercial Hub', description: 'Rapid industrial, logistics, and residential development corridor.' }
  ],
  verifiedListingsCount: 26,
  coverageNote: 'Verified dataset covering Ludhiana West, East, Model Town, and Khanna.'
};

// ─── CHANDIGARH UT INTELLIGENCE ───────────────────────────────────────────────
export const CHANDIGARH_DISTRICT_INTELLIGENCE: DistrictIntelligence = {
  district: 'Chandigarh',
  state: 'Chandigarh',
  coordinates: [30.7333, 76.7794],
  tehsils: [
    {
      id: 'teh-chd-urban',
      name: 'Chandigarh Sector Grid (Sec 1-63)',
      district: 'Chandigarh',
      state: 'Chandigarh',
      coordinates: [30.7415, 76.7794],
      villagesCount: 18,
      mandisCount: 1,
      avgPriceSqYd: '₹1,20,000 - ₹3,50,000',
      keyVillages: ['Burail', 'Kajheri', 'Attawa', 'Dhanas', 'Maloya'],
      keyLocalities: ['Sector 8-11 Luxury', 'Sector 17 Plaza', 'Sector 34 Commercial', 'Sector 43 Bus Stand'],
      isVerified: true
    }
  ],
  villages: [
    { id: 'vil-chd-dhanas', name: 'Dhanas', tehsil: 'Chandigarh', district: 'Chandigarh', coordinates: [30.7650, 76.7550], isVerified: true, propertyCount: 4 }
  ],
  mandis: [
    {
      id: 'mandi-chd-sec26',
      name: 'Sector 26 Grain & Vegetable Market',
      type: 'Vegetable / Agro Mandi',
      tehsil: 'Chandigarh',
      district: 'Chandigarh',
      coordinates: [30.7290, 76.8040],
      commodities: ['Wholesale Fruits', 'Vegetables', 'Grain'],
      isVerified: true
    }
  ],
  priceTrends: {
    avgResidentialPlotSqYd: 195000,
    avgAgriLandPerAcre: 28000000,
    avgCommercialSqYd: 320000,
    yoyGrowthPercent: 11.8,
    demandIndex: 'Very High'
  },
  popularCorridors: [
    { name: 'Madhya Marg Institutional & Commercial Belt', tag: 'Prime Corridor', description: 'Arterial boulevard connecting Chandigarh Capital Complex to IT Park.' }
  ],
  verifiedListingsCount: 30,
  coverageNote: 'Official master plan coverage for Chandigarh UT Sector Grid.'
};

// ─── BATHINDA DISTRICT INTELLIGENCE ──────────────────────────────────────────
export const BATHINDA_DISTRICT_INTELLIGENCE: DistrictIntelligence = {
  district: 'Bathinda',
  state: 'Punjab',
  coordinates: [30.2110, 74.9455],
  tehsils: [
    {
      id: 'teh-bathinda',
      name: 'Bathinda Tehsil',
      district: 'Bathinda',
      state: 'Punjab',
      coordinates: [30.2150, 74.9500],
      villagesCount: 72,
      mandisCount: 2,
      avgPriceSqYd: '₹22,000 - ₹58,000',
      keyVillages: ['Bhartana', 'Kothe Amarpura', 'Balianwali', 'Goniana'],
      keyLocalities: ['Model Town Phase 1-3', 'GT Road Bypass', 'AIIMS Bathinda Zone', 'Barnala Road'],
      isVerified: true
    }
  ],
  villages: [
    { id: 'vil-btd-goniana', name: 'Goniana', tehsil: 'Bathinda', district: 'Bathinda', coordinates: [30.3150, 74.9050], isVerified: true, propertyCount: 5 }
  ],
  mandis: [
    {
      id: 'mandi-btd-main',
      name: 'Bathinda Main Grain & Cotton Mandi',
      type: 'Grain Mandi',
      tehsil: 'Bathinda',
      district: 'Bathinda',
      coordinates: [30.2220, 74.9480],
      commodities: ['Cotton (White Gold)', 'Wheat', 'Mustard'],
      isVerified: true
    }
  ],
  priceTrends: {
    avgResidentialPlotSqYd: 36000,
    avgAgriLandPerAcre: 5200000,
    avgCommercialSqYd: 62000,
    yoyGrowthPercent: 13.6,
    demandIndex: 'High'
  },
  popularCorridors: [
    { name: 'AIIMS Bathinda - Dabwali Road Corridor', tag: 'Healthcare Hub', description: 'Booming medical, institutional and plotted housing expansion.' }
  ],
  verifiedListingsCount: 15,
  coverageNote: 'Verified dataset covering Bathinda Urban, Model Town, and AIIMS Growth Corridor.'
};

// ─── DELHI CAPITAL DISTRICT INTELLIGENCE ──────────────────────────────────────
export const DELHI_DISTRICT_INTELLIGENCE: DistrictIntelligence = {
  district: 'Delhi',
  state: 'Delhi',
  coordinates: [28.6139, 77.2090],
  tehsils: [
    {
      id: 'teh-del-southwest',
      name: 'South West Delhi (Dwarka Zone)',
      district: 'Delhi',
      state: 'Delhi',
      coordinates: [28.5921, 77.0460],
      villagesCount: 42,
      mandisCount: 1,
      avgPriceSqYd: '₹85,000 - ₹2,40,000',
      keyVillages: ['Bijwasan', 'Kanganheri', 'Dhulsiras', 'Chhawla'],
      keyLocalities: ['Dwarka Sector 1-24', 'Dwarka Expressway', 'Najafgarh Road'],
      isVerified: true
    }
  ],
  villages: [
    { id: 'vil-del-dhulsiras', name: 'Dhulsiras', tehsil: 'South West Delhi', district: 'Delhi', coordinates: [28.5750, 77.0320], isVerified: true, propertyCount: 8 }
  ],
  mandis: [
    {
      id: 'mandi-del-azadpur',
      name: 'Azadpur Mandi (Asia Largest Fruit & Veg Mandi)',
      type: 'Vegetable / Agro Mandi',
      tehsil: 'North Delhi',
      district: 'Delhi',
      coordinates: [28.7120, 77.1750],
      commodities: ['National Fruits Import', 'Vegetables', 'Potatoes & Onions'],
      isVerified: true
    }
  ],
  priceTrends: {
    avgResidentialPlotSqYd: 145000,
    avgAgriLandPerAcre: 35000000,
    avgCommercialSqYd: 260000,
    yoyGrowthPercent: 13.8,
    demandIndex: 'Very High'
  },
  popularCorridors: [
    { name: 'Dwarka Expressway Global City Zone', tag: 'NCR Gateway', description: 'Direct 8-lane expressway connecting IGI Airport to Gurugram.' }
  ],
  verifiedListingsCount: 32,
  coverageNote: 'Capital Master Plan GIS dataset covering Dwarka Expressway, South West, and Central Delhi.'
};

// ─── MASTER DISTRICTS REGISTRY ───────────────────────────────────────────────

// ─── SANGRUR DISTRICT DATA (Verified Seed Dataset) ──────────────────────────
export const SANGRUR_DISTRICT_INTELLIGENCE: DistrictIntelligence = {
  district: 'Sangrur',
  state: 'Punjab',
  coordinates: [30.2458, 75.8421],
  tehsils: [
    {
      id: 'teh-sunam',
      name: 'Sunam Tehsil (Sunam Udham Singh Wala)',
      district: 'Sangrur',
      state: 'Punjab',
      coordinates: [30.1293, 75.8010],
      villagesCount: 68,
      mandisCount: 2,
      avgPriceSqYd: '₹22,000 - ₹52,000',
      keyVillages: ['Chathe Nakte', 'Tibri', 'Khadial', 'Ghabdan', 'Mehlan', 'Bigarwal', 'Dhandoli Kalan', 'Kularan'],
      keyLocalities: ['Mata Modi Road', 'Station Road', 'ITI Chowk', 'Jakhal Road', 'Peeran Wala Gate', 'Model Town Sunam', 'Sangrur-Patran Highway', 'Anaj Mandi Belt'],
      isVerified: true
    },
    {
      id: 'teh-sangrur',
      name: 'Sangrur Central Tehsil',
      district: 'Sangrur',
      state: 'Punjab',
      coordinates: [30.2458, 75.8421],
      villagesCount: 94,
      mandisCount: 3,
      avgPriceSqYd: '₹28,000 - ₹62,000',
      keyVillages: ['Badrukhan', 'Mangwal', 'Ubhawal', 'Balian', 'Ladda', 'Kanoi', 'Phaguwala'],
      keyLocalities: ['Nankiana Chowk', 'Patiala Gate', 'Dhuri Road', 'Punpunia Colony', 'Model Town Sangrur', 'Civil Lines', 'Sunder Basti'],
      isVerified: true
    },
    {
      id: 'teh-dhuri',
      name: 'Dhuri Tehsil',
      district: 'Sangrur',
      state: 'Punjab',
      coordinates: [30.3700, 75.8700],
      villagesCount: 62,
      mandisCount: 2,
      avgPriceSqYd: '₹18,000 - ₹44,000',
      keyVillages: ['Babanpur', 'Ranike', 'Ladda', 'Ghanaur Rajputan', 'Mulowal'],
      keyLocalities: ['Dhuri Grain Market Road', 'Ludhiana Bypass', 'Station Road', 'Sugar Mill Area'],
      isVerified: true
    },
    {
      id: 'teh-lehragaga',
      name: 'Lehragaga Tehsil',
      district: 'Sangrur',
      state: 'Punjab',
      coordinates: [29.9333, 75.8167],
      villagesCount: 52,
      mandisCount: 2,
      avgPriceSqYd: '₹14,000 - ₹34,000',
      keyVillages: ['Changaliwala', 'Gagga', 'Moonak Border', 'Gurne Kalan'],
      keyLocalities: ['Main Grain Market Lehra', 'Railway Station Road', 'Sunam-Lehra Road'],
      isVerified: true
    },
    {
      id: 'teh-bhawanigarh',
      name: 'Bhawanigarh Tehsil',
      district: 'Sangrur',
      state: 'Punjab',
      coordinates: [30.2667, 76.0333],
      villagesCount: 48,
      mandisCount: 2,
      avgPriceSqYd: '₹18,000 - ₹42,000',
      keyVillages: ['Balad Kalan', 'Bakra', 'Fatehgarh Chhanna', 'Gharachon'],
      keyLocalities: ['Patiala-Sangrur Highway Corridor', 'Bhawanigarh Mandi Chowk'],
      isVerified: true
    },
    {
      id: 'teh-dirba',
      name: 'Dirba Sub-Tehsil',
      district: 'Sangrur',
      state: 'Punjab',
      coordinates: [30.0667, 75.9833],
      villagesCount: 42,
      mandisCount: 1,
      avgPriceSqYd: '₹12,000 - ₹30,000',
      keyVillages: ['Khanal Kalan', 'Ghabdan Rural', 'Kauharian'],
      keyLocalities: ['Dirba Main Market', 'Patran Road'],
      isVerified: true
    },
    {
      id: 'teh-moonak',
      name: 'Moonak Tehsil',
      district: 'Sangrur',
      state: 'Punjab',
      coordinates: [29.8167, 75.8833],
      villagesCount: 38,
      mandisCount: 1,
      avgPriceSqYd: '₹11,000 - ₹26,000',
      keyVillages: ['Hamirgarh', 'Mandvi', 'Surjan Bhaini'],
      keyLocalities: ['Moonak Mandi Road', 'Ghaggar Belt Corridor'],
      isVerified: true
    }
  ],
  villages: [
    { id: 'vil-sunam-chathe', name: 'Chathe Nakte', tehsil: 'Sunam', district: 'Sangrur', coordinates: [30.1410, 75.8120], isVerified: true, propertyCount: 14 },
    { id: 'vil-sunam-tibri', name: 'Tibri', tehsil: 'Sunam', district: 'Sangrur', coordinates: [30.1180, 75.7890], isVerified: true, propertyCount: 11 },
    { id: 'vil-sunam-khadial', name: 'Khadial', tehsil: 'Sunam', district: 'Sangrur', coordinates: [30.1550, 75.8340], isVerified: true, propertyCount: 9 },
    { id: 'vil-sunam-mehlan', name: 'Mehlan Chowk Belt', tehsil: 'Sunam', district: 'Sangrur', coordinates: [30.1760, 75.8620], isVerified: true, propertyCount: 16 },
    { id: 'vil-sangrur-badrukhan', name: 'Badrukhan', tehsil: 'Sangrur', district: 'Sangrur', coordinates: [30.2290, 75.8190], isVerified: true, propertyCount: 18 },
    { id: 'vil-dhuri-ladda', name: 'Ladda', tehsil: 'Dhuri', district: 'Sangrur', coordinates: [30.3450, 75.8590], isVerified: true, propertyCount: 12 }
  ],
  mandis: [
    {
      id: 'mandi-sunam-grain',
      name: 'Sunam Main Grain Market (Anaj Mandi)',
      tehsil: 'Sunam',
      district: 'Sangrur',
      coordinates: [30.1340, 75.8080],
      type: 'Grain Mandi',
      distanceKm: 0.8,
      notes: 'Major Malwa Wheat & Paddy Mandi; High commercial SCO activity around Jakhal Road',
      isVerified: true
    },
    {
      id: 'mandi-sunam-sabzi',
      name: 'Sunam Vegetable & Fruit Mandi',
      tehsil: 'Sunam',
      district: 'Sangrur',
      coordinates: [30.1310, 75.7990],
      type: 'Vegetable / Agro Mandi',
      distanceKm: 1.2,
      notes: 'Daily wholesale agricultural trade',
      isVerified: true
    },
    {
      id: 'mandi-sangrur-main',
      name: 'Sangrur Principal Grain & Cotton Market',
      tehsil: 'Sangrur',
      district: 'Sangrur',
      coordinates: [30.2480, 75.8390],
      type: 'Grain Mandi',
      distanceKm: 1.5,
      notes: 'Premier agricultural and commercial hub of Sangrur district',
      isVerified: true
    },
    {
      id: 'mandi-dhuri-grain',
      name: 'Dhuri Grain Mandi',
      tehsil: 'Dhuri',
      district: 'Sangrur',
      coordinates: [30.3720, 75.8680],
      type: 'Grain Mandi',
      distanceKm: 1.1,
      notes: 'Active Agro-processing & Trading Mandi',
      isVerified: true
    },
    {
      id: 'mandi-lehra-grain',
      name: 'Lehragaga Main Grain Market',
      tehsil: 'Lehragaga',
      district: 'Sangrur',
      coordinates: [29.9350, 75.8190],
      type: 'Grain Mandi',
      distanceKm: 0.9,
      notes: 'Southern Malwa grain hub',
      isVerified: true
    }
  ],
  priceTrends: {
    avgResidentialPlotSqYd: 36000,
    avgAgriLandPerAcre: 5500000,
    avgCommercialSqYd: 68000,
    yoyGrowthPercent: 12.4,
    demandIndex: 'High'
  },
  popularCorridors: [
    { name: 'Sunam - Sangrur Highway Corridor', tag: 'Fast Appreciation', description: 'Four-lane highway connecting Sunam ITI Chowk to Sangrur Nankiana bypass.' },
    { name: 'Sunam - Jakhal - Mansa Road Belt', tag: 'Commercial Plotted', description: 'Commercial godowns, petrol pumps, residential colonies, and warehouse belt.' },
    { name: 'Sangrur - Patiala NH-7 Corridor (Bhawanigarh)', tag: 'Highway Commercial', description: 'High-speed national highway connecting Sangrur to Patiala & Chandigarh.' }
  ],
  verifiedListingsCount: 80,
  coverageNote: 'Verified land records, Jamabandi survey, circle rates, and mandi listings across Sunam, Sangrur, and Dhuri.'
};

// ─── PATIALA DISTRICT DATA (Verified Seed Dataset) ──────────────────────────
export const PATIALA_DISTRICT_INTELLIGENCE: DistrictIntelligence = {
  district: 'Patiala',
  state: 'Punjab',
  coordinates: [30.3398, 76.3869],
  tehsils: [
    {
      id: 'teh-patiala',
      name: 'Patiala Central Tehsil',
      district: 'Patiala',
      state: 'Punjab',
      coordinates: [30.3398, 76.3869],
      villagesCount: 112,
      mandisCount: 3,
      avgPriceSqYd: '₹34,000 - ₹78,000',
      keyVillages: ['Dhablan', 'Kalyan', 'Chuharpur', 'Jhill', 'Langroya'],
      keyLocalities: ['Urban Estate Phase 1 & 2', 'Model Town Patiala', 'Sirhind Road', 'Leela Bhawan', 'Baradari Gardens', 'Samana Road Corridor'],
      isVerified: true
    },
    {
      id: 'teh-samana',
      name: 'Samana Tehsil',
      district: 'Patiala',
      state: 'Punjab',
      coordinates: [30.1583, 76.1917],
      villagesCount: 74,
      mandisCount: 2,
      avgPriceSqYd: '₹18,000 - ₹46,000',
      keyVillages: ['Gajewas', 'Dallanpur', 'Kakrala', 'Fatehpur Samana'],
      keyLocalities: ['Anaj Mandi Road Samana', 'Patiala-Samana Highway', 'Grain Market Chowk', 'Waraich Colony'],
      isVerified: true
    },
    {
      id: 'teh-nabha',
      name: 'Nabha Tehsil',
      district: 'Patiala',
      state: 'Punjab',
      coordinates: [30.3750, 76.1500],
      villagesCount: 88,
      mandisCount: 2,
      avgPriceSqYd: '₹22,000 - ₹52,000',
      keyVillages: ['Bhadson', 'Mehas', 'Alhoran', 'Duladdi'],
      keyLocalities: ['Circular Road Nabha', 'Cinema Road', 'Patiala Gate', 'Bhadson Road Corridor'],
      isVerified: true
    },
    {
      id: 'teh-rajpura',
      name: 'Rajpura Tehsil',
      district: 'Patiala',
      state: 'Punjab',
      coordinates: [30.4833, 76.5833],
      villagesCount: 96,
      mandisCount: 2,
      avgPriceSqYd: '₹28,000 - ₹65,000',
      keyVillages: ['Jansui', 'Neelpur', 'Shamdo', 'Kasturba'],
      keyLocalities: ['GT Road NH-44', 'Focal Point Industrial Belt', 'ITM City', 'Old Rajpura Market'],
      isVerified: true
    },
    {
      id: 'teh-patran',
      name: 'Patran Tehsil',
      district: 'Patiala',
      state: 'Punjab',
      coordinates: [29.9500, 76.0833],
      villagesCount: 64,
      mandisCount: 2,
      avgPriceSqYd: '₹16,000 - ₹38,000',
      keyVillages: ['Duggal', 'Shutrana', 'Nial', 'Dhanauri'],
      keyLocalities: ['Patran Grain Market', 'Delhi-Sangrur Highway Chowk', 'Cinema Road'],
      isVerified: true
    }
  ],
  villages: [
    { id: 'vil-pat-urban', name: 'Urban Estate Sector', tehsil: 'Patiala', district: 'Patiala', coordinates: [30.3520, 76.4120], isVerified: true, propertyCount: 28 },
    { id: 'vil-pat-samana-gajewas', name: 'Gajewas', tehsil: 'Samana', district: 'Patiala', coordinates: [30.1710, 76.2120], isVerified: true, propertyCount: 15 },
    { id: 'vil-pat-nabha-bhadson', name: 'Bhadson Sub-Center', tehsil: 'Nabha', district: 'Patiala', coordinates: [30.4120, 76.1820], isVerified: true, propertyCount: 12 },
    { id: 'vil-pat-rajpura-neelpur', name: 'Neelpur Industrial Hub', tehsil: 'Rajpura', district: 'Patiala', coordinates: [30.4910, 76.5920], isVerified: true, propertyCount: 22 }
  ],
  mandis: [
    {
      id: 'mandi-patiala-sirhind',
      name: 'Patiala Sirhind Road Grain Market',
      tehsil: 'Patiala',
      district: 'Patiala',
      coordinates: [30.3540, 76.3980],
      type: 'Grain Mandi',
      distanceKm: 2.1,
      notes: 'State-of-the-art agricultural market complex with direct truck bypass',
      isVerified: true
    },
    {
      id: 'mandi-samana-grain',
      name: 'Samana Principal Grain Market',
      tehsil: 'Samana',
      district: 'Patiala',
      coordinates: [30.1610, 76.1950],
      type: 'Grain Mandi',
      distanceKm: 0.9,
      notes: 'High-volume paddy and mustard trading mandi in south Patiala',
      isVerified: true
    },
    {
      id: 'mandi-nabha-grain',
      name: 'Nabha Grain Market',
      tehsil: 'Nabha',
      district: 'Patiala',
      coordinates: [30.3780, 76.1540],
      type: 'Grain Mandi',
      distanceKm: 1.0,
      notes: 'Key agro-industrial and combine-harvester trade center',
      isVerified: true
    },
    {
      id: 'mandi-rajpura-grain',
      name: 'Rajpura Main Mandi',
      tehsil: 'Rajpura',
      district: 'Patiala',
      coordinates: [30.4870, 76.5890],
      type: 'Grain Mandi',
      distanceKm: 1.4,
      notes: 'Major transit and logistics node on NH-44',
      isVerified: true
    }
  ],
  priceTrends: {
    avgResidentialPlotSqYd: 48000,
    avgAgriLandPerAcre: 6800000,
    avgCommercialSqYd: 95000,
    yoyGrowthPercent: 13.5,
    demandIndex: 'High'
  },
  popularCorridors: [
    { name: 'Patiala - Samana Highway', tag: 'High Growth', description: 'Emerging residential plotted belt with rapid educational and commercial infrastructure.' },
    { name: 'Rajpura - Chandigarh Expressway Belt', tag: 'Industrial & Logistic', description: 'Prime logistics, industrial parks, and mega residential townships.' },
    { name: 'Sirhind Road Commercial Strip', tag: 'Prime Commercial', description: 'Showrooms, automobile dealerships, and PUDA approved residential sectors.' }
  ],
  verifiedListingsCount: 76,
  coverageNote: 'Complete cadastral revenue and land valuation dataset for Patiala, Samana, Nabha, Rajpura, and Patran.'
};

// ─── MANSA DISTRICT DATA (Verified Seed Dataset) ────────────────────────────
export const MANSA_DISTRICT_INTELLIGENCE: DistrictIntelligence = {
  district: 'Mansa',
  state: 'Punjab',
  coordinates: [29.9880, 75.3980],
  tehsils: [
    {
      id: 'teh-mansa',
      name: 'Mansa Central Tehsil',
      district: 'Mansa',
      state: 'Punjab',
      coordinates: [29.9880, 75.3980],
      villagesCount: 72,
      mandisCount: 2,
      avgPriceSqYd: '₹18,000 - ₹42,000',
      keyVillages: ['Khiala Kalan', 'Mansa Khurd', 'Tamkot', 'Moosa', 'Jawaharke', 'Matti'],
      keyLocalities: ['Cinema Road Mansa', 'Court Road', 'Grain Market Road', 'Barnala Road Corridor', 'Model Town Mansa'],
      isVerified: true
    },
    {
      id: 'teh-budhlada',
      name: 'Budhlada Tehsil',
      district: 'Mansa',
      state: 'Punjab',
      coordinates: [29.9333, 75.5667],
      villagesCount: 68,
      mandisCount: 2,
      avgPriceSqYd: '₹15,000 - ₹36,000',
      keyVillages: ['Bareta', 'Boha', 'Kulrian', 'Ahmadpur'],
      keyLocalities: ['Budhlada Grain Market', 'Station Road', 'Mansa-Budhlada Road'],
      isVerified: true
    },
    {
      id: 'teh-sardulgarh',
      name: 'Sardulgarh Tehsil',
      district: 'Mansa',
      state: 'Punjab',
      coordinates: [29.7000, 75.2500],
      villagesCount: 54,
      mandisCount: 1,
      avgPriceSqYd: '₹12,000 - ₹28,000',
      keyVillages: ['Jhunir', 'Fatta Maluka', 'Kot Dharmu'],
      keyLocalities: ['Sardulgarh Mandi Chowk', 'Sirsa-Mansa Highway Belt'],
      isVerified: true
    }
  ],
  villages: [
    { id: 'vil-mansa-moosa', name: 'Moosa Village Belt', tehsil: 'Mansa', district: 'Mansa', coordinates: [29.9650, 75.4210], isVerified: true, propertyCount: 12 },
    { id: 'vil-mansa-bareta', name: 'Bareta Sub-Mandi Hub', tehsil: 'Budhlada', district: 'Mansa', coordinates: [29.8710, 75.7020], isVerified: true, propertyCount: 9 }
  ],
  mandis: [
    {
      id: 'mandi-mansa-cotton',
      name: 'Mansa Cotton & Grain Market (White Gold Belt)',
      tehsil: 'Mansa',
      district: 'Mansa',
      coordinates: [29.9910, 75.4020],
      type: 'Grain Mandi',
      distanceKm: 1.1,
      notes: 'Famous cotton and wheat exchange with extensive commercial warehousing',
      isVerified: true
    },
    {
      id: 'mandi-budhlada-grain',
      name: 'Budhlada Grain Mandi',
      tehsil: 'Budhlada',
      district: 'Mansa',
      coordinates: [29.9360, 75.5710],
      type: 'Grain Mandi',
      distanceKm: 0.8,
      notes: 'Active agricultural trade hub connecting south Punjab & Haryana border',
      isVerified: true
    }
  ],
  priceTrends: {
    avgResidentialPlotSqYd: 28000,
    avgAgriLandPerAcre: 4800000,
    avgCommercialSqYd: 52000,
    yoyGrowthPercent: 11.2,
    demandIndex: 'Moderate'
  },
  popularCorridors: [
    { name: 'Mansa - Barnala Highway', tag: 'Commercial Plotted', description: 'Four-lane highway connecting Mansa to Barnala and Ludhiana.' },
    { name: 'Mansa - Sunam - Sangrur Belt', tag: 'Regional Trade', description: 'Key agricultural transit and plotted expansion corridor.' }
  ],
  verifiedListingsCount: 26,
  coverageNote: 'Revenue land data, collector rates, and agricultural parcel metrics across Mansa, Budhlada, and Sardulgarh.'
};

export const DISTRICT_INTELLIGENCE_MAP: Record<string, DistrictIntelligence> = {
  'sangrur': SANGRUR_DISTRICT_INTELLIGENCE,
  'sunam': SANGRUR_DISTRICT_INTELLIGENCE,
  'suman': SANGRUR_DISTRICT_INTELLIGENCE,
  'sunam udham singh wala': SANGRUR_DISTRICT_INTELLIGENCE,
  'dhuri': SANGRUR_DISTRICT_INTELLIGENCE,
  'patiala': PATIALA_DISTRICT_INTELLIGENCE,
  'samana': PATIALA_DISTRICT_INTELLIGENCE,
  'nabha': PATIALA_DISTRICT_INTELLIGENCE,
  'rajpura': PATIALA_DISTRICT_INTELLIGENCE,
  'patran': PATIALA_DISTRICT_INTELLIGENCE,
  'mansa': MANSA_DISTRICT_INTELLIGENCE,
  'budhlada': MANSA_DISTRICT_INTELLIGENCE,
  'rewari': REWARI_DISTRICT_INTELLIGENCE,
  'gurugram': GURUGRAM_DISTRICT_INTELLIGENCE,
  'sas nagar (mohali)': MOHALI_DISTRICT_INTELLIGENCE,
  'mohali': MOHALI_DISTRICT_INTELLIGENCE,
  'panchkula': PANCHKULA_DISTRICT_INTELLIGENCE,
  'ludhiana': LUDHIANA_DISTRICT_INTELLIGENCE,
  'chandigarh': CHANDIGARH_DISTRICT_INTELLIGENCE,
  'bathinda': BATHINDA_DISTRICT_INTELLIGENCE,
  'delhi': DELHI_DISTRICT_INTELLIGENCE,
  'new delhi': DELHI_DISTRICT_INTELLIGENCE,
};

// ─── INDEXED SEARCHABLE LOCATIONS FOR FAST AUTOCOMPLETE ──────────────────────
export const INDEXED_LOCATIONS: LocationSearchResult[] = [
  // ── SANGRUR & SUNAM LOCATIONS ──
  {
    id: 'loc-sangrur-district',
    name: 'Sangrur District',
    title: 'Sangrur District',
    subtitle: 'Punjab (Complete District & Mandis Coverage)',
    hierarchyBreadcrumb: 'Punjab → Sangrur District',
    level: 'district',
    district: 'Sangrur',
    state: 'Punjab',
    coordinates: [30.2458, 75.8421],
    source: 'search',
    defaultScope: 'district',
    isVerified: true,
    matchScore: 100
  },
  {
    id: 'loc-sunam-tehsil',
    name: 'Sunam (Sunam Udham Singh Wala)',
    title: 'Sunam Tehsil & City',
    subtitle: 'Punjab → Sangrur District → Sunam Tehsil',
    hierarchyBreadcrumb: 'Punjab → Sangrur District → Sunam Tehsil (Sunam Udham Singh Wala)',
    level: 'city',
    tehsil: 'Sunam',
    district: 'Sangrur',
    state: 'Punjab',
    coordinates: [30.1293, 75.8010],
    source: 'search',
    defaultScope: 'city',
    isVerified: true,
    matchScore: 100
  },
  {
    id: 'loc-sunam-mandi',
    name: 'Sunam Grain Mandi (Anaj Mandi)',
    title: 'Sunam Main Grain Market',
    subtitle: 'Punjab → Sangrur District → Sunam',
    hierarchyBreadcrumb: 'Punjab → Sangrur District → Sunam Tehsil → Jakhal Road Grain Mandi',
    level: 'locality',
    locality: 'Anaj Mandi Jakhal Road',
    tehsil: 'Sunam',
    district: 'Sangrur',
    state: 'Punjab',
    coordinates: [30.1340, 75.8080],
    source: 'search',
    defaultScope: 'local',
    isVerified: true,
    matchScore: 99
  },
  {
    id: 'loc-sunam-modeltown',
    name: 'Model Town, Sunam',
    title: 'Model Town Sunam',
    subtitle: 'Punjab → Sangrur District → Sunam City',
    hierarchyBreadcrumb: 'Punjab → Sangrur District → Sunam Tehsil → Model Town',
    level: 'locality',
    locality: 'Model Town',
    tehsil: 'Sunam',
    district: 'Sangrur',
    state: 'Punjab',
    coordinates: [30.1320, 75.8050],
    source: 'search',
    defaultScope: 'local',
    isVerified: true,
    matchScore: 97
  },
  {
    id: 'loc-sunam-matamodi',
    name: 'Mata Modi Road, Sunam',
    title: 'Mata Modi Road',
    subtitle: 'Punjab → Sangrur District → Sunam City',
    hierarchyBreadcrumb: 'Punjab → Sangrur District → Sunam Tehsil → Mata Modi Road',
    level: 'locality',
    locality: 'Mata Modi Road',
    tehsil: 'Sunam',
    district: 'Sangrur',
    state: 'Punjab',
    coordinates: [30.1270, 75.8020],
    source: 'search',
    defaultScope: 'local',
    isVerified: true,
    matchScore: 96
  },
  {
    id: 'loc-sangrur-city',
    name: 'Sangrur',
    title: 'Sangrur City',
    subtitle: 'Punjab → Sangrur District',
    hierarchyBreadcrumb: 'Punjab → Sangrur District → Sangrur Central Tehsil',
    level: 'city',
    tehsil: 'Sangrur',
    district: 'Sangrur',
    state: 'Punjab',
    coordinates: [30.2458, 75.8421],
    source: 'search',
    defaultScope: 'city',
    isVerified: true,
    matchScore: 99
  },
  {
    id: 'loc-dhuri-city',
    name: 'Dhuri',
    title: 'Dhuri Tehsil & City',
    subtitle: 'Punjab → Sangrur District → Dhuri Tehsil',
    hierarchyBreadcrumb: 'Punjab → Sangrur District → Dhuri Tehsil',
    level: 'city',
    tehsil: 'Dhuri',
    district: 'Sangrur',
    state: 'Punjab',
    coordinates: [30.3700, 75.8700],
    source: 'search',
    defaultScope: 'city',
    isVerified: true,
    matchScore: 98
  },

  // ── PATIALA & SAMANA LOCATIONS ──
  {
    id: 'loc-patiala-district',
    name: 'Patiala District',
    title: 'Patiala District',
    subtitle: 'Punjab (Complete District & Mandis Coverage)',
    hierarchyBreadcrumb: 'Punjab → Patiala District',
    level: 'district',
    district: 'Patiala',
    state: 'Punjab',
    coordinates: [30.3398, 76.3869],
    source: 'search',
    defaultScope: 'district',
    isVerified: true,
    matchScore: 100
  },
  {
    id: 'loc-samana-city',
    name: 'Samana',
    title: 'Samana Tehsil & Mandi',
    subtitle: 'Punjab → Patiala District → Samana Tehsil',
    hierarchyBreadcrumb: 'Punjab → Patiala District → Samana Tehsil',
    level: 'city',
    tehsil: 'Samana',
    district: 'Patiala',
    state: 'Punjab',
    coordinates: [30.1583, 76.1917],
    source: 'search',
    defaultScope: 'city',
    isVerified: true,
    matchScore: 98
  },
  {
    id: 'loc-samana-mandi',
    name: 'Samana Grain Mandi (Anaj Mandi)',
    title: 'Samana Grain Market',
    subtitle: 'Punjab → Patiala District → Samana',
    hierarchyBreadcrumb: 'Punjab → Patiala District → Samana Tehsil → Anaj Mandi',
    level: 'locality',
    locality: 'Anaj Mandi Samana',
    tehsil: 'Samana',
    district: 'Patiala',
    state: 'Punjab',
    coordinates: [30.1610, 76.1950],
    source: 'search',
    defaultScope: 'local',
    isVerified: true,
    matchScore: 97
  },
  {
    id: 'loc-nabha-city',
    name: 'Nabha',
    title: 'Nabha Tehsil & City',
    subtitle: 'Punjab → Patiala District → Nabha Tehsil',
    hierarchyBreadcrumb: 'Punjab → Patiala District → Nabha Tehsil',
    level: 'city',
    tehsil: 'Nabha',
    district: 'Patiala',
    state: 'Punjab',
    coordinates: [30.3750, 76.1500],
    source: 'search',
    defaultScope: 'city',
    isVerified: true,
    matchScore: 98
  },
  {
    id: 'loc-mansa-district',
    name: 'Mansa',
    title: 'Mansa District & Mandi',
    subtitle: 'Punjab → Mansa District',
    hierarchyBreadcrumb: 'Punjab → Mansa District → Mansa Central',
    level: 'district',
    district: 'Mansa',
    state: 'Punjab',
    coordinates: [29.9880, 75.3980],
    source: 'search',
    defaultScope: 'district',
    isVerified: true,
    matchScore: 97
  },

  // ── REWARI DISTRICT PLACES ──
  {
    id: 'loc-rewari-district',
    name: 'Rewari District',
    title: 'Rewari District',
    subtitle: 'Haryana (Complete District Coverage)',
    hierarchyBreadcrumb: 'Haryana → Rewari District',
    level: 'district',
    district: 'Rewari',
    state: 'Haryana',
    coordinates: [28.1920, 76.6186],
    source: 'search',
    defaultScope: 'district',
    isVerified: true,
    matchScore: 100
  },
  {
    id: 'loc-rewari-city',
    name: 'Rewari',
    title: 'Rewari City',
    subtitle: 'Haryana → Rewari District',
    hierarchyBreadcrumb: 'Haryana → Rewari District → Rewari Tehsil',
    level: 'city',
    tehsil: 'Rewari',
    district: 'Rewari',
    state: 'Haryana',
    coordinates: [28.1980, 76.6190],
    source: 'search',
    defaultScope: 'city',
    isVerified: true,
    matchScore: 98
  },
  {
    id: 'loc-bawal',
    name: 'Bawal',
    title: 'Bawal',
    subtitle: 'Haryana → Rewari District → Bawal Tehsil',
    hierarchyBreadcrumb: 'Haryana → Rewari District → Bawal Tehsil',
    level: 'tehsil',
    tehsil: 'Bawal',
    district: 'Rewari',
    state: 'Haryana',
    coordinates: [28.0833, 76.5833],
    source: 'search',
    defaultScope: 'tehsil',
    isVerified: true,
    matchScore: 99
  },
  {
    id: 'loc-dharuhera',
    name: 'Dharuhera',
    title: 'Dharuhera',
    subtitle: 'Haryana → Rewari District → Dharuhera Sub-Tehsil',
    hierarchyBreadcrumb: 'Haryana → Rewari District → Dharuhera Sub-Tehsil',
    level: 'town',
    tehsil: 'Dharuhera',
    district: 'Rewari',
    state: 'Haryana',
    coordinates: [28.2056, 76.7917],
    source: 'search',
    defaultScope: 'local',
    isVerified: true,
    matchScore: 97
  },
  {
    id: 'loc-khol',
    name: 'Khol',
    title: 'Khol',
    subtitle: 'Haryana → Rewari District → Khol Block / Sub-Tehsil',
    hierarchyBreadcrumb: 'Haryana → Rewari District → Khol Sub-Tehsil',
    level: 'tehsil',
    tehsil: 'Khol',
    district: 'Rewari',
    state: 'Haryana',
    coordinates: [28.2167, 76.4500],
    source: 'search',
    defaultScope: 'tehsil',
    isVerified: true,
    matchScore: 96
  },
  {
    id: 'loc-kosli',
    name: 'Kosli',
    title: 'Kosli',
    subtitle: 'Haryana → Rewari District → Kosli Tehsil',
    hierarchyBreadcrumb: 'Haryana → Rewari District → Kosli Tehsil',
    level: 'tehsil',
    tehsil: 'Kosli',
    district: 'Rewari',
    state: 'Haryana',
    coordinates: [28.4110, 76.4780],
    source: 'search',
    defaultScope: 'tehsil',
    isVerified: true,
    matchScore: 95
  },
  {
    id: 'loc-manethi',
    name: 'Manethi',
    title: 'Manethi (AIIMS Site)',
    subtitle: 'Haryana → Rewari District → Manethi Sub-Tehsil',
    hierarchyBreadcrumb: 'Haryana → Rewari District → Manethi Sub-Tehsil',
    level: 'village',
    village: 'Manethi',
    tehsil: 'Manethi',
    district: 'Rewari',
    state: 'Haryana',
    coordinates: [28.1150, 76.4720],
    source: 'search',
    defaultScope: 'village',
    isVerified: true,
    matchScore: 94
  },
  {
    id: 'loc-bawal-khori',
    name: 'Khori',
    title: 'Khori Village',
    subtitle: 'Haryana → Rewari District → Bawal Tehsil',
    hierarchyBreadcrumb: 'Haryana → Rewari District → Bawal Tehsil → Khori Village',
    level: 'village',
    village: 'Khori',
    tehsil: 'Bawal',
    district: 'Rewari',
    state: 'Haryana',
    coordinates: [28.0620, 76.5410],
    source: 'search',
    defaultScope: 'village',
    isVerified: true,
    matchScore: 92
  },
  {
    id: 'loc-bawal-majra',
    name: 'Majra Shekhawat',
    title: 'Majra Shekhawat',
    subtitle: 'Haryana → Rewari District → Bawal Tehsil',
    hierarchyBreadcrumb: 'Haryana → Rewari District → Bawal Tehsil → Majra Shekhawat',
    level: 'village',
    village: 'Majra Shekhawat',
    tehsil: 'Bawal',
    district: 'Rewari',
    state: 'Haryana',
    coordinates: [28.0950, 76.5620],
    source: 'search',
    defaultScope: 'village',
    isVerified: true,
    matchScore: 91
  },
  {
    id: 'loc-dharuhera-masani',
    name: 'Masani',
    title: 'Masani Barrage / Village',
    subtitle: 'Haryana → Rewari District → Dharuhera',
    hierarchyBreadcrumb: 'Haryana → Rewari District → Dharuhera → Masani Village',
    level: 'village',
    village: 'Masani',
    tehsil: 'Dharuhera',
    district: 'Rewari',
    state: 'Haryana',
    coordinates: [28.2150, 76.7620],
    source: 'search',
    defaultScope: 'village',
    isVerified: true,
    matchScore: 90
  },
  {
    id: 'loc-khol-kund',
    name: 'Kund',
    title: 'Kund Industrial Area',
    subtitle: 'Haryana → Rewari District → Khol Block',
    hierarchyBreadcrumb: 'Haryana → Rewari District → Khol Sub-Tehsil → Kund',
    level: 'locality',
    locality: 'Kund',
    tehsil: 'Khol',
    district: 'Rewari',
    state: 'Haryana',
    coordinates: [28.1420, 76.4210],
    source: 'search',
    defaultScope: 'local',
    isVerified: true,
    matchScore: 90
  },
  {
    id: 'loc-rewari-modeltown',
    name: 'Model Town, Rewari',
    title: 'Model Town',
    subtitle: 'Haryana → Rewari District → Rewari City',
    hierarchyBreadcrumb: 'Haryana → Rewari District → Rewari Tehsil → Model Town',
    level: 'locality',
    locality: 'Model Town',
    tehsil: 'Rewari',
    district: 'Rewari',
    state: 'Haryana',
    coordinates: [28.2010, 76.6120],
    source: 'search',
    defaultScope: 'local',
    isVerified: true,
    matchScore: 93
  },
  {
    id: 'loc-rewari-brassmarket',
    name: 'Brass Market, Rewari',
    title: 'Brass Market',
    subtitle: 'Haryana → Rewari District → Commercial Sector',
    hierarchyBreadcrumb: 'Haryana → Rewari District → Rewari City → Brass Market',
    level: 'locality',
    locality: 'Brass Market',
    tehsil: 'Rewari',
    district: 'Rewari',
    state: 'Haryana',
    coordinates: [28.1910, 76.6150],
    source: 'search',
    defaultScope: 'local',
    isVerified: true,
    matchScore: 92
  },

  // ── GURUGRAM DISTRICT PLACES ──
  {
    id: 'loc-gurugram-district',
    name: 'Gurugram District',
    title: 'Gurugram District',
    subtitle: 'Haryana (Complete District Coverage)',
    hierarchyBreadcrumb: 'Haryana → Gurugram District',
    level: 'district',
    district: 'Gurugram',
    state: 'Haryana',
    coordinates: [28.4595, 77.0266],
    source: 'search',
    defaultScope: 'district',
    isVerified: true,
    matchScore: 98
  },
  {
    id: 'loc-gurugram-city',
    name: 'Gurugram',
    title: 'Gurugram City',
    subtitle: 'Haryana → Gurugram District',
    hierarchyBreadcrumb: 'Haryana → Gurugram District → Cyber City / Golf Course',
    level: 'city',
    district: 'Gurugram',
    state: 'Haryana',
    coordinates: [28.4595, 77.0266],
    source: 'search',
    defaultScope: 'city',
    isVerified: true,
    matchScore: 99
  },
  {
    id: 'loc-manesar',
    name: 'Manesar',
    title: 'Manesar (IMT)',
    subtitle: 'Haryana → Gurugram District → Manesar Tehsil',
    hierarchyBreadcrumb: 'Haryana → Gurugram District → Manesar Tehsil',
    level: 'tehsil',
    tehsil: 'Manesar',
    district: 'Gurugram',
    state: 'Haryana',
    coordinates: [28.3580, 76.9380],
    source: 'search',
    defaultScope: 'tehsil',
    isVerified: true,
    matchScore: 96
  },
  {
    id: 'loc-sohna',
    name: 'Sohna',
    title: 'Sohna (South Gurugram)',
    subtitle: 'Haryana → Gurugram District → Sohna Tehsil',
    hierarchyBreadcrumb: 'Haryana → Gurugram District → Sohna Tehsil',
    level: 'tehsil',
    tehsil: 'Sohna',
    district: 'Gurugram',
    state: 'Haryana',
    coordinates: [28.2470, 77.0620],
    source: 'search',
    defaultScope: 'tehsil',
    isVerified: true,
    matchScore: 95
  },
  {
    id: 'loc-pataudi',
    name: 'Pataudi',
    title: 'Pataudi',
    subtitle: 'Haryana → Gurugram District → Pataudi Tehsil',
    hierarchyBreadcrumb: 'Haryana → Gurugram District → Pataudi Tehsil',
    level: 'tehsil',
    tehsil: 'Pataudi',
    district: 'Gurugram',
    state: 'Haryana',
    coordinates: [28.3240, 76.7780],
    source: 'search',
    defaultScope: 'tehsil',
    isVerified: true,
    matchScore: 94
  },

  // ── MOHALI & CHANDIGARH TRI-CITY PLACES ──
  {
    id: 'loc-mohali-district',
    name: 'SAS Nagar (Mohali) District',
    title: 'SAS Nagar (Mohali) District',
    subtitle: 'Punjab (Complete District Coverage)',
    hierarchyBreadcrumb: 'Punjab → SAS Nagar (Mohali) District',
    level: 'district',
    district: 'SAS Nagar (Mohali)',
    state: 'Punjab',
    coordinates: [30.6799, 76.7221],
    source: 'search',
    defaultScope: 'district',
    isVerified: true,
    matchScore: 98
  },
  {
    id: 'loc-mohali-sector82',
    name: 'Sector 82, Mohali',
    title: 'Sector 82 (JLPL)',
    subtitle: 'Punjab → SAS Nagar (Mohali) → Mohali Tehsil',
    hierarchyBreadcrumb: 'Punjab → SAS Nagar (Mohali) → Mohali Tehsil → Sector 82',
    level: 'locality',
    locality: 'Sector 82',
    tehsil: 'Mohali',
    district: 'SAS Nagar (Mohali)',
    state: 'Punjab',
    coordinates: [30.6698, 76.7214],
    source: 'search',
    defaultScope: 'local',
    isVerified: true,
    matchScore: 99
  },
  {
    id: 'loc-mohali-aerocity',
    name: 'Aerocity, Mohali',
    title: 'Aerocity (Airport Road)',
    subtitle: 'Punjab → SAS Nagar (Mohali) → Mohali Tehsil',
    hierarchyBreadcrumb: 'Punjab → SAS Nagar (Mohali) → Mohali Tehsil → Aerocity',
    level: 'locality',
    locality: 'Aerocity',
    tehsil: 'Mohali',
    district: 'SAS Nagar (Mohali)',
    state: 'Punjab',
    coordinates: [30.6385, 76.7904],
    source: 'search',
    defaultScope: 'local',
    isVerified: true,
    matchScore: 97
  },
  {
    id: 'loc-kharar',
    name: 'Kharar',
    title: 'Kharar',
    subtitle: 'Punjab → SAS Nagar (Mohali) → Kharar Tehsil',
    hierarchyBreadcrumb: 'Punjab → SAS Nagar (Mohali) → Kharar Tehsil',
    level: 'tehsil',
    tehsil: 'Kharar',
    district: 'SAS Nagar (Mohali)',
    state: 'Punjab',
    coordinates: [30.7450, 76.6450],
    source: 'search',
    defaultScope: 'tehsil',
    isVerified: true,
    matchScore: 96
  },
  {
    id: 'loc-zirakpur',
    name: 'Zirakpur',
    title: 'Zirakpur',
    subtitle: 'Punjab → SAS Nagar (Mohali) → Dera Bassi Tehsil',
    hierarchyBreadcrumb: 'Punjab → SAS Nagar (Mohali) → Dera Bassi Tehsil → Zirakpur',
    level: 'town',
    tehsil: 'Dera Bassi',
    district: 'SAS Nagar (Mohali)',
    state: 'Punjab',
    coordinates: [30.6425, 76.8173],
    source: 'search',
    defaultScope: 'local',
    isVerified: true,
    matchScore: 96
  },
  {
    id: 'loc-new-chandigarh',
    name: 'New Chandigarh (Mullanpur)',
    title: 'New Chandigarh',
    subtitle: 'Punjab → SAS Nagar (Mohali) → Majri Tehsil',
    hierarchyBreadcrumb: 'Punjab → SAS Nagar (Mohali) → Majri Tehsil → New Chandigarh',
    level: 'town',
    tehsil: 'Majri',
    district: 'SAS Nagar (Mohali)',
    state: 'Punjab',
    coordinates: [30.8040, 76.7550],
    source: 'search',
    defaultScope: 'local',
    isVerified: true,
    matchScore: 97
  },
  {
    id: 'loc-panchkula-district',
    name: 'Panchkula District',
    title: 'Panchkula District',
    subtitle: 'Haryana (Complete District Coverage)',
    hierarchyBreadcrumb: 'Haryana → Panchkula District',
    level: 'district',
    district: 'Panchkula',
    state: 'Haryana',
    coordinates: [30.6942, 76.8606],
    source: 'search',
    defaultScope: 'district',
    isVerified: true,
    matchScore: 97
  },
  {
    id: 'loc-panchkula-sec20',
    name: 'Sector 20, Panchkula',
    title: 'Sector 20',
    subtitle: 'Haryana → Panchkula District → Panchkula Tehsil',
    hierarchyBreadcrumb: 'Haryana → Panchkula District → Panchkula Tehsil → Sector 20',
    level: 'locality',
    locality: 'Sector 20',
    tehsil: 'Panchkula',
    district: 'Panchkula',
    state: 'Haryana',
    coordinates: [30.6865, 76.8524],
    source: 'search',
    defaultScope: 'local',
    isVerified: true,
    matchScore: 98
  },
  {
    id: 'loc-chandigarh-ut',
    name: 'Chandigarh',
    title: 'Chandigarh (UT)',
    subtitle: 'Chandigarh Capital Region',
    hierarchyBreadcrumb: 'India → Chandigarh UT → Sector 1-63 Grid',
    level: 'city',
    district: 'Chandigarh',
    state: 'Chandigarh',
    coordinates: [30.7333, 76.7794],
    source: 'search',
    defaultScope: 'city',
    isVerified: true,
    matchScore: 98
  },
  {
    id: 'loc-ludhiana',
    name: 'Ludhiana',
    title: 'Ludhiana District',
    subtitle: 'Punjab → Ludhiana District',
    hierarchyBreadcrumb: 'Punjab → Ludhiana District → Model Town / GT Road',
    level: 'district',
    district: 'Ludhiana',
    state: 'Punjab',
    coordinates: [30.9010, 75.8573],
    source: 'search',
    defaultScope: 'district',
    isVerified: true,
    matchScore: 95
  },
  {
    id: 'loc-bathinda',
    name: 'Bathinda',
    title: 'Bathinda District',
    subtitle: 'Punjab → Bathinda District',
    hierarchyBreadcrumb: 'Punjab → Bathinda District → Bathinda Bypass',
    level: 'district',
    district: 'Bathinda',
    state: 'Punjab',
    coordinates: [30.2110, 74.9455],
    source: 'search',
    defaultScope: 'district',
    isVerified: true,
    matchScore: 94
  }
];

// ─── POPULAR QUICK-PICK CHIPS FOR ONBOARDING SCREEN ──────────────────────────
export const POPULAR_ONBOARDING_CHIPS = [
  { id: 'sunam', label: 'Sunam (Sangrur)', short: 'Sunam', tag: 'Punjab' },
  { id: 'sangrur', label: 'Sangrur Mandi', short: 'Sangrur', tag: 'Punjab' },
  { id: 'samana', label: 'Samana (Patiala)', short: 'Samana', tag: 'Punjab' },
  { id: 'rewari-dist', label: 'Rewari District', short: 'Rewari', tag: 'Haryana' },
  { id: 'bawal', label: 'Bawal (IMT)', short: 'Bawal', tag: 'Rewari, HR' },
  { id: 'dharuhera', label: 'Dharuhera', short: 'Dharuhera', tag: 'Rewari, HR' },
  { id: 'khol', label: 'Khol', short: 'Khol', tag: 'Rewari, HR' },
  { id: 'gurugram', label: 'Gurugram', short: 'Gurugram', tag: 'Haryana' },
  { id: 'mohali', label: 'Mohali (Sec 82)', short: 'Mohali', tag: 'Punjab' },
  { id: 'panchkula', label: 'Panchkula (Sec 20)', short: 'Panchkula', tag: 'Haryana' },
  { id: 'chandigarh', label: 'Chandigarh', short: 'Chandigarh', tag: 'UT' },
  { id: 'ludhiana', label: 'Ludhiana', short: 'Ludhiana', tag: 'Punjab' },
  { id: 'bathinda', label: 'Bathinda', short: 'Bathinda', tag: 'Punjab' },
];
