import type { Property } from '../types';
import { INDIAN_STATES, getStateByName } from './indiaStatesAndCities';

export interface PopularLocationCard {
  id: string;
  name: string;
  fullName: string;
  tagline: string;
  avgPrice: string;
  growth: string;
  count: string;
  bgImage: string;
  sectors: string[];
  searchFilter: string;
  district?: string;
  state?: string;
}

// ─── CURATED STATE & DISTRICT POPULAR LOCATION CARDS ────────────────────────
export const POPULAR_LOCATIONS_REGISTRY: Record<string, PopularLocationCard[]> = {
  // ── 1. PUNJAB: SANGRUR & SUNAM DISTRICT ──
  'punjab-sangrur': [
    {
      id: 'pb-sangrur-city',
      name: 'Sangrur City & Grain Market',
      fullName: 'Sangrur City & Grain Market Hub',
      tagline: 'District HQ & Central Grain Market Hub',
      avgPrice: '₹24,500/sq.yd',
      growth: '+14.2%',
      count: '80+ listings',
      bgImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
      sectors: ['Model Town', 'Grain Market', 'Sunam Road', 'Patiala Highway'],
      searchFilter: 'Sangrur',
      district: 'Sangrur',
      state: 'Punjab'
    },
    {
      id: 'pb-sunam-corridor',
      name: 'Sunam Udham Singh Wala',
      fullName: 'Sunam (Udham Singh Wala) Mandi Corridor',
      tagline: 'Commercial & Grain Mandi Trade Corridor',
      avgPrice: '₹19,000/sq.yd',
      growth: '+12.8%',
      count: '15+ listings',
      bgImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
      sectors: ['IT City Sunam', 'Grain Mandi', 'Lehra Road', 'Court Complex'],
      searchFilter: 'Sunam',
      district: 'Sangrur',
      state: 'Punjab'
    },
    {
      id: 'pb-dhuri-mandi',
      name: 'Dhuri & Lehragaga Mandis',
      fullName: 'Dhuri Sugar Mill & Lehragaga Market',
      tagline: 'Agro Sugar & Grain Processing Hub',
      avgPrice: '₹16,500/sq.yd',
      growth: '+10.5%',
      count: '12+ listings',
      bgImage: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80',
      sectors: ['Dhuri Bypass', 'Railway Road', 'Lehragaga Mandi', 'Moonak'],
      searchFilter: 'Dhuri',
      district: 'Sangrur',
      state: 'Punjab'
    },
    {
      id: 'pb-bhawanigarh-moonak',
      name: 'Bhawanigarh & Moonak Belt',
      fullName: 'Bhawanigarh & Moonak Sub-Tehsils',
      tagline: 'Highway Corridors & Agriculture Belt',
      avgPrice: '₹15,200/sq.yd',
      growth: '+9.8%',
      count: '10+ listings',
      bgImage: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=600&q=80',
      sectors: ['Bhawanigarh Mandi', 'Moonak Bypass', 'Dirba Mandi', 'Patiala Link'],
      searchFilter: 'Bhawanigarh',
      district: 'Sangrur',
      state: 'Punjab'
    },
    {
      id: 'pb-patiala-corridor',
      name: 'Patiala Heritage & Urban Ring',
      fullName: 'Patiala Urban Estate & Ring Road',
      tagline: 'Urban Ring Road & Royal Enclaves',
      avgPrice: '₹42,000/sq.yd',
      growth: '+11.8%',
      count: '35+ listings',
      bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
      sectors: ['Urban Estate 2', 'Rajpura Road', 'Sirhind Bypass', 'Leela Bhawan'],
      searchFilter: 'Patiala',
      district: 'Patiala',
      state: 'Punjab'
    },
    {
      id: 'pb-ludhiana-khanna',
      name: 'Ludhiana GT Road & Khanna Mandi',
      fullName: 'Ludhiana & Khanna Asia Grain Market',
      tagline: "Asia's Largest Grain Market & Industrial Hub",
      avgPrice: '₹52,000/sq.yd',
      growth: '+13.6%',
      count: '120+ listings',
      bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
      sectors: ['Khanna Mandi', 'South City', 'Pakhowal Road', 'Jagraon'],
      searchFilter: 'Khanna',
      district: 'Ludhiana',
      state: 'Punjab'
    }
  ],

  // ── 2. PUNJAB GENERAL (All other districts in Punjab) ──
  'punjab': [
    {
      id: 'pb-mohali',
      name: 'Mohali (SAS Nagar)',
      fullName: 'Mohali IT & Aerocity Corridor',
      tagline: 'Airport Road & GMADA IT City Hub',
      avgPrice: '₹72,500/sq.yd',
      growth: '+15.4%',
      count: '140+ listings',
      bgImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
      sectors: ['Sector 82', 'Sector 66', 'IT City', 'Airport Road'],
      searchFilter: 'Mohali',
      district: 'SAS Nagar (Mohali)',
      state: 'Punjab'
    },
    {
      id: 'pb-ludhiana-gen',
      name: 'Ludhiana & Khanna Mandi',
      fullName: 'Ludhiana GT Road & Grain Market',
      tagline: 'GT Road Industrial & Asia Grain Capital',
      avgPrice: '₹54,000/sq.yd',
      growth: '+13.2%',
      count: '130+ listings',
      bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
      sectors: ['Khanna Mandi', 'Pakhowal Road', 'South City', 'Ferozepur Road'],
      searchFilter: 'Ludhiana',
      district: 'Ludhiana',
      state: 'Punjab'
    },
    {
      id: 'pb-sangrur-gen',
      name: 'Sangrur & Sunam Mandi',
      fullName: 'Sangrur & Sunam Udham Singh Wala',
      tagline: 'Malwa Agricultural & Mandi Corridor',
      avgPrice: '₹22,000/sq.yd',
      growth: '+13.8%',
      count: '90+ listings',
      bgImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
      sectors: ['Model Town', 'Sunam Market', 'Dhuri Bypass', 'Grain Mandi'],
      searchFilter: 'Sangrur',
      district: 'Sangrur',
      state: 'Punjab'
    },
    {
      id: 'pb-bathinda-gen',
      name: 'Bathinda Malwa Junction',
      fullName: 'Bathinda Urban & Industrial Hub',
      tagline: 'AIIMS & Refinery Industrial Corridor',
      avgPrice: '₹34,000/sq.yd',
      growth: '+9.8%',
      count: '45+ listings',
      bgImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
      sectors: ['Model Town Phase 3', 'Goniana Road', 'Rampura Phul', 'Maur Mandi'],
      searchFilter: 'Bathinda',
      district: 'Bathinda',
      state: 'Punjab'
    },
    {
      id: 'pb-amritsar-gen',
      name: 'Amritsar Heritage & Airport',
      fullName: 'Amritsar Ranjit Avenue & GT Road',
      tagline: 'Ranjit Avenue & International Corridor',
      avgPrice: '₹48,000/sq.yd',
      growth: '+10.4%',
      count: '55+ listings',
      bgImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
      sectors: ['Ranjit Avenue', 'Airport Road', 'Majitha Road', 'GT Road'],
      searchFilter: 'Amritsar',
      district: 'Amritsar',
      state: 'Punjab'
    },
    {
      id: 'pb-abohar-fazilka',
      name: 'Abohar & Fazilka Cotton Mandi',
      fullName: 'Abohar & Fazilka Agri-Trade Belt',
      tagline: "Asia's Premier Cotton & Kinnow Mandi Belt",
      avgPrice: '₹18,500/sq.yd',
      growth: '+11.6%',
      count: '25+ listings',
      bgImage: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80',
      sectors: ['Abohar Mandi', 'Fazilka Bypass', 'Malout Road', 'Kinnow Market'],
      searchFilter: 'Abohar',
      district: 'Fazilka',
      state: 'Punjab'
    }
  ],

  // ── 3. HARYANA: REWARI DISTRICT ──
  'haryana-rewari': [
    {
      id: 'hr-rewari-city',
      name: 'Rewari Model Town & Brass Market',
      fullName: 'Rewari Model Town & Commercial Core',
      tagline: 'Prime Residential & Commercial Core',
      avgPrice: '₹48,000/sq.yd',
      growth: '+11.5%',
      count: '85+ listings',
      bgImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
      sectors: ['Model Town', 'Brass Market', 'Sector 3 HSVP', 'Garhi Bolni Road'],
      searchFilter: 'Rewari',
      district: 'Rewari',
      state: 'Haryana'
    },
    {
      id: 'hr-bawal-imt',
      name: 'Bawal Industrial Township (IMT)',
      fullName: 'Bawal IMT & DMIC Industrial Cluster',
      tagline: 'DMIC & Global Auto Manufacturing Cluster',
      avgPrice: '₹28,500/sq.yd',
      growth: '+16.2%',
      count: '25+ listings',
      bgImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
      sectors: ['IMT Sector 1', 'IMT Sector 3', 'NH-48 Corridor', 'Bawal Mandi'],
      searchFilter: 'Bawal',
      district: 'Rewari',
      state: 'Haryana'
    },
    {
      id: 'hr-dharuhera-corridor',
      name: 'Dharuhera Growth Corridor',
      fullName: 'Dharuhera NH-48 Express Corridor',
      tagline: 'NH-48 Expressways & Integrated Townships',
      avgPrice: '₹36,000/sq.yd',
      growth: '+14.0%',
      count: '35+ listings',
      bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
      sectors: ['Sector 6', 'Bestech City', 'Anandam Estate', 'Kapriwas'],
      searchFilter: 'Dharuhera',
      district: 'Rewari',
      state: 'Haryana'
    },
    {
      id: 'hr-kosli-mandi',
      name: 'Kosli & Jatusana Mandi',
      fullName: 'Kosli Anaj Mandi & Sub-Division Market',
      tagline: 'Sub-Division Market & Railway Hub',
      avgPrice: '₹18,500/sq.yd',
      growth: '+8.9%',
      count: '15+ listings',
      bgImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
      sectors: ['Kosli Station Road', 'Jatusana Mandi', 'Sub-Tehsil Market', 'Berli'],
      searchFilter: 'Kosli',
      district: 'Rewari',
      state: 'Haryana'
    },
    {
      id: 'hr-khol-kund',
      name: 'Khol & Kund Slate Cluster',
      fullName: 'Khol & Kund Industrial Belt',
      tagline: 'Mining, Slate & Logistics Belt',
      avgPrice: '₹15,000/sq.yd',
      growth: '+7.8%',
      count: '12+ listings',
      bgImage: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=600&q=80',
      sectors: ['Khol Main Market', 'Kund Industrial Area', 'Dahina Road', 'Zainabad'],
      searchFilter: 'Khol',
      district: 'Rewari',
      state: 'Haryana'
    },
    {
      id: 'hr-gurugram-link',
      name: 'Gurugram Golf Course & Cyber Hub',
      fullName: 'Gurugram Expressways & Cyber City',
      tagline: 'Expressways & Mega Corporate Corridor',
      avgPrice: '₹1,45,000/sq.yd',
      growth: '+17.8%',
      count: '150+ listings',
      bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
      sectors: ['Golf Course Extn', 'Dwarka Expressway', 'Sohna Road', 'Manesar'],
      searchFilter: 'Gurugram',
      district: 'Gurugram',
      state: 'Haryana'
    }
  ],

  // ── 4. HARYANA GENERAL ──
  'haryana': [
    {
      id: 'hr-gurugram-gen',
      name: 'Gurugram Millennium Corridor',
      fullName: 'Gurugram Cyber City & Golf Course Extn',
      tagline: 'Golf Course Extn & High-Speed Expressways',
      avgPrice: '₹1,45,000/sq.yd',
      growth: '+17.8%',
      count: '150+ listings',
      bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
      sectors: ['Golf Course Extn', 'Dwarka Expressway', 'Sohna Road', 'Cyber Hub'],
      searchFilter: 'Gurugram',
      district: 'Gurugram',
      state: 'Haryana'
    },
    {
      id: 'hr-rewari-gen',
      name: 'Rewari & Bawal DMIC Hub',
      fullName: 'Rewari Model Town & Bawal IMT',
      tagline: 'Auto Hub & Prime Model Town Belt',
      avgPrice: '₹42,000/sq.yd',
      growth: '+14.2%',
      count: '95+ listings',
      bgImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
      sectors: ['Model Town', 'Bawal IMT', 'Brass Market', 'Dharuhera'],
      searchFilter: 'Rewari',
      district: 'Rewari',
      state: 'Haryana'
    },
    {
      id: 'hr-panchkula-gen',
      name: 'Panchkula HSVP Sectors',
      fullName: 'Panchkula Masterplanned Townships',
      tagline: 'Foothills Planned Townships & HSVP Grid',
      avgPrice: '₹98,000/sq.yd',
      growth: '+8.2%',
      count: '40+ listings',
      bgImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
      sectors: ['Sector 20', 'MDC Sector 4', 'Sector 6', 'Pinjore'],
      searchFilter: 'Panchkula',
      district: 'Panchkula',
      state: 'Haryana'
    },
    {
      id: 'hr-karnal-gen',
      name: 'Karnal & Taraori Basmati Belt',
      fullName: 'Karnal Smart City & Rice Mandi',
      tagline: 'World Basmati Capital & Smart City Sectors',
      avgPrice: '₹38,000/sq.yd',
      growth: '+11.4%',
      count: '35+ listings',
      bgImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
      sectors: ['Model Town', 'Taraori Mandi', 'Gharaunda', 'Sector 14'],
      searchFilter: 'Karnal',
      district: 'Karnal',
      state: 'Haryana'
    },
    {
      id: 'hr-sonipat-gen',
      name: 'Sonipat & Kharkhoda Maruti IMT',
      fullName: 'Sonipat & Kharkhoda IMT Corridor',
      tagline: 'Maruti Suzuki Global Mega Hub & Mandi',
      avgPrice: '₹45,000/sq.yd',
      growth: '+16.8%',
      count: '50+ listings',
      bgImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
      sectors: ['Kharkhoda IMT', 'Gohana Mandi', 'Kundli Belt', 'Ganaur Mandi'],
      searchFilter: 'Sonipat',
      district: 'Sonipat',
      state: 'Haryana'
    },
    {
      id: 'hr-faridabad-gen',
      name: 'Faridabad Neharpar Corridor',
      fullName: 'Greater Faridabad & Metro Corridor',
      tagline: 'Metro Connectivity & Masterplan Townships',
      avgPrice: '₹62,000/sq.yd',
      growth: '+10.5%',
      count: '45+ listings',
      bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
      sectors: ['Sector 75-89', 'Neharpar', 'Mathura Road', 'Ballabhgarh Mandi'],
      searchFilter: 'Faridabad',
      district: 'Faridabad',
      state: 'Haryana'
    }
  ],

  // ── 5. CHANDIGARH UT ──
  'chandigarh': [
    {
      id: 'ch-heritage',
      name: 'Chandigarh Heritage Core',
      fullName: 'Chandigarh UT Capital Sectors',
      tagline: 'Prime Le Corbusier Heritage Grid',
      avgPrice: '₹1,75,000/sq.yd',
      growth: '+6.4%',
      count: '80+ listings',
      bgImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
      sectors: ['Sector 17', 'Sector 35', 'Sector 8', 'Sector 9'],
      searchFilter: 'Chandigarh',
      district: 'Chandigarh',
      state: 'Chandigarh'
    },
    {
      id: 'ch-mohali-link',
      name: 'Mohali IT & Aerocity',
      fullName: 'SAS Nagar Airport Road & IT City',
      tagline: 'High Growth IT SEZ & International Airport',
      avgPrice: '₹72,500/sq.yd',
      growth: '+15.4%',
      count: '145+ listings',
      bgImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
      sectors: ['Sector 82', 'Sector 66', 'IT City', 'Sector 118'],
      searchFilter: 'Mohali',
      district: 'Mohali',
      state: 'Punjab'
    },
    {
      id: 'ch-new-chandigarh',
      name: 'New Chandigarh (Mullanpur)',
      fullName: 'New Chandigarh Eco City & Medicity',
      tagline: 'Eco City & Medicity Masterplan Enclaves',
      avgPrice: '₹74,000/sq.yd',
      growth: '+15.8%',
      count: '30+ listings',
      bgImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80',
      sectors: ['Eco City 1', 'Eco City 2', 'Medicity', 'Omaxe City'],
      searchFilter: 'New Chandigarh',
      district: 'Mohali',
      state: 'Punjab'
    },
    {
      id: 'ch-panchkula-link',
      name: 'Panchkula HSVP Townships',
      fullName: 'Panchkula Sector 20 & MDC',
      tagline: 'HSVP Established Townships',
      avgPrice: '₹98,000/sq.yd',
      growth: '+8.2%',
      count: '40+ listings',
      bgImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
      sectors: ['Sector 20', 'MDC Sector 4', 'Sector 6', 'Pinjore'],
      searchFilter: 'Panchkula',
      district: 'Panchkula',
      state: 'Haryana'
    },
    {
      id: 'ch-zirakpur-link',
      name: 'Zirakpur Highway Corridor',
      fullName: 'Zirakpur VIP Road & PR-7 Ring',
      tagline: 'High Rental Yield & Highway Retail Hub',
      avgPrice: '₹68,000/sq.yd',
      growth: '+9.6%',
      count: '60+ listings',
      bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
      sectors: ['VIP Road', 'Airport Road PR-7', 'Highland Marg', 'Gazipur'],
      searchFilter: 'Zirakpur',
      district: 'Mohali',
      state: 'Punjab'
    }
  ],

  // ── 6. DELHI NCR ──
  'delhi': [
    {
      id: 'dl-dwarka-exp',
      name: 'Dwarka Expressway Corridor',
      fullName: 'Dwarka Expressway & Diplomatic Enclave',
      tagline: 'High-Speed Airport Link & Mega Townships',
      avgPrice: '₹1,25,000/sq.yd',
      growth: '+19.2%',
      count: '90+ listings',
      bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
      sectors: ['Sector 102', 'Sector 109', 'Sector 113', 'Dwarka Sector 21'],
      searchFilter: 'Dwarka',
      district: 'South West Delhi',
      state: 'Delhi'
    },
    {
      id: 'dl-noida-exp',
      name: 'Noida Expressway & Sector 150',
      fullName: 'Noida Expressway & Sports City',
      tagline: 'Green Sports City & IT Tech SEZ',
      avgPrice: '₹88,000/sq.yd',
      growth: '+14.6%',
      count: '110+ listings',
      bgImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
      sectors: ['Sector 150', 'Sector 137', 'Sector 144', 'Sector 128'],
      searchFilter: 'Noida',
      district: 'Gautam Buddha Nagar',
      state: 'Uttar Pradesh'
    },
    {
      id: 'dl-south-delhi',
      name: 'South Delhi Heritage Colonies',
      fullName: 'South Delhi Luxury Enclaves',
      tagline: 'Elite Capital Colonies & Diplomatic Zone',
      avgPrice: '₹3,40,000/sq.yd',
      growth: '+5.8%',
      count: '60+ listings',
      bgImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
      sectors: ['Vasant Vihar', 'Greater Kailash', 'Hauz Khas', 'Saket'],
      searchFilter: 'Delhi',
      district: 'South Delhi',
      state: 'Delhi'
    },
    {
      id: 'dl-noida-extn',
      name: 'Greater Noida West (Noida Extn)',
      fullName: 'Greater Noida West Masterplan',
      tagline: 'High-Density Modern Affordable Housing',
      avgPrice: '₹56,000/sq.yd',
      growth: '+12.5%',
      count: '85+ listings',
      bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
      sectors: ['Techzone 4', 'Sector 1', 'Sector 16B', 'Gaur City'],
      searchFilter: 'Greater Noida',
      district: 'Gautam Buddha Nagar',
      state: 'Uttar Pradesh'
    }
  ],

  // ── 7. MAHARASHTRA ──
  'maharashtra': [
    {
      id: 'mh-pune-hinjewadi',
      name: 'Pune Hinjewadi & Wakad',
      fullName: 'Pune IT Park & West Corridor',
      tagline: 'IT Park & Global Tech Corridor',
      avgPrice: '₹78,000/sq.yd',
      growth: '+14.8%',
      count: '150+ listings',
      bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
      sectors: ['Hinjewadi Phase 1', 'Phase 3', 'Wakad', 'Baner'],
      searchFilter: 'Pune',
      district: 'Pune',
      state: 'Maharashtra'
    },
    {
      id: 'mh-mumbai-bkc',
      name: 'Mumbai BKC & Western Suburbs',
      fullName: 'Mumbai Financial Core & Coastal Link',
      tagline: 'Financial Capital & High Appreciation Core',
      avgPrice: '₹3,20,000/sq.yd',
      growth: '+8.4%',
      count: '160+ listings',
      bgImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
      sectors: ['Bandra West', 'BKC', 'Andheri East', 'Goregaon'],
      searchFilter: 'Mumbai',
      district: 'Mumbai',
      state: 'Maharashtra'
    },
    {
      id: 'mh-navi-mumbai',
      name: 'Navi Mumbai & Panvel Airport',
      fullName: 'Navi Mumbai Airport & Kharghar',
      tagline: 'International Airport & Trans-Harbour Link',
      avgPrice: '₹65,000/sq.yd',
      growth: '+16.2%',
      count: '95+ listings',
      bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
      sectors: ['Kharghar', 'Panvel', 'Ulwe', 'Seawoods'],
      searchFilter: 'Navi Mumbai',
      district: 'Thane',
      state: 'Maharashtra'
    },
    {
      id: 'mh-lasalgaon-nashik',
      name: 'Nashik & Lasalgaon Mandi',
      fullName: 'Nashik Industrial & Onion Mandi',
      tagline: "Wine Capital & Asia's Largest Onion Mandi",
      avgPrice: '₹28,000/sq.yd',
      growth: '+10.2%',
      count: '45+ listings',
      bgImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
      sectors: ['Gangapur Road', 'Lasalgaon Mandi', 'Indira Nagar', 'Pimpalgaon'],
      searchFilter: 'Nashik',
      district: 'Nashik',
      state: 'Maharashtra'
    },
    {
      id: 'mh-nagpur-mihan',
      name: 'Nagpur MIHAN & Logistics Hub',
      fullName: 'Nagpur MIHAN SEZ & Wardha Road',
      tagline: 'Cargo Airport & Central India Logistics',
      avgPrice: '₹26,000/sq.yd',
      growth: '+12.6%',
      count: '70+ listings',
      bgImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
      sectors: ['MIHAN SEZ', 'Wardha Road', 'Manish Nagar', 'Besur'],
      searchFilter: 'Nagpur',
      district: 'Nagpur',
      state: 'Maharashtra'
    }
  ],

  // ── 8. KARNATAKA ──
  'karnataka': [
    {
      id: 'ka-blr-whitefield',
      name: 'Bengaluru Whitefield IT Hub',
      fullName: 'Bengaluru Whitefield & ITPL Corridor',
      tagline: 'Global Tech Hub & Metro Line',
      avgPrice: '₹1,10,000/sq.yd',
      growth: '+16.4%',
      count: '135+ listings',
      bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
      sectors: ['Whitefield', 'ITPL', 'Hoodi', 'Kadugodi'],
      searchFilter: 'Bengaluru',
      district: 'Bengaluru',
      state: 'Karnataka'
    },
    {
      id: 'ka-blr-north',
      name: 'North Bengaluru Airport Belt',
      fullName: 'Hebbal, Devanahalli & Aerotropolis',
      tagline: 'International Airport & Tech Parks Corridor',
      avgPrice: '₹92,000/sq.yd',
      growth: '+18.8%',
      count: '120+ listings',
      bgImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
      sectors: ['Hebbal', 'Thanisandra', 'Devanahalli', 'Yelahanka'],
      searchFilter: 'Bengaluru',
      district: 'Bengaluru',
      state: 'Karnataka'
    },
    {
      id: 'ka-mysuru-ring',
      name: 'Mysuru Ring Road & Heritage',
      fullName: 'Mysuru Urban Ring Road & Vijayanagar',
      tagline: 'Clean City & Industrial Ring Road',
      avgPrice: '₹32,000/sq.yd',
      growth: '+9.8%',
      count: '40+ listings',
      bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
      sectors: ['Vijayanagar', 'Hebbal Industrial', 'Bogadi', 'Ring Road'],
      searchFilter: 'Mysuru',
      district: 'Mysuru',
      state: 'Karnataka'
    }
  ],

  // ── 9. RAJASTHAN ──
  'rajasthan': [
    {
      id: 'rj-jaipur-jagatpura',
      name: 'Jaipur Jagatpura & Mahal Road',
      fullName: 'Jaipur Airport Corridor & Ring Road',
      tagline: 'Airport Corridor & High Growth Townships',
      avgPrice: '₹48,000/sq.yd',
      growth: '+15.6%',
      count: '150+ listings',
      bgImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
      sectors: ['Jagatpura', 'Mahal Road', 'Pratap Nagar', 'Sitapura'],
      searchFilter: 'Jaipur',
      district: 'Jaipur',
      state: 'Rajasthan'
    },
    {
      id: 'rj-neemrana-industrial',
      name: 'Neemrana & Bhiwadi RIICO',
      fullName: 'Neemrana Japanese Zone & Industrial Hub',
      tagline: 'RIICO & DMIC Global Industrial Belt',
      avgPrice: '₹24,000/sq.yd',
      growth: '+14.8%',
      count: '35+ listings',
      bgImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
      sectors: ['Neemrana Japanese Zone', 'Bhiwadi', 'Behror', 'Kotputli'],
      searchFilter: 'Neemrana',
      district: 'Kotputli-Behror',
      state: 'Rajasthan'
    },
    {
      id: 'rj-jodhpur-mandi',
      name: 'Jodhpur Pal Road & Krishi Mandi',
      fullName: 'Jodhpur Pal Road & Commercial Belt',
      tagline: 'Sun City & Grain Trade Corridor',
      avgPrice: '₹34,000/sq.yd',
      growth: '+10.2%',
      count: '45+ listings',
      bgImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
      sectors: ['Pal Road', 'AIIMS Road', 'Krishi Mandi', 'Ratanada'],
      searchFilter: 'Jodhpur',
      district: 'Jodhpur',
      state: 'Rajasthan'
    },
    {
      id: 'rj-ganganagar-mandi',
      name: 'Sri Ganganagar & Hanumangarh Mandis',
      fullName: 'Sri Ganganagar & Hanumangarh Cotton Belt',
      tagline: 'Cotton & Kinnow Mega Grain Belt',
      avgPrice: '₹22,000/sq.yd',
      growth: '+11.2%',
      count: '30+ listings',
      bgImage: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80',
      sectors: ['Ganganagar Mandi', 'Hanumangarh Junction', 'Suratgarh', 'Padampur'],
      searchFilter: 'Sri Ganganagar',
      district: 'Sri Ganganagar',
      state: 'Rajasthan'
    }
  ],

  // ── 10. UTTAR PRADESH ──
  'uttar pradesh': [
    {
      id: 'up-noida-exp',
      name: 'Noida Expressway & Sector 150',
      fullName: 'Noida Expressway & Sports City',
      tagline: 'Sports City & Metro Connectivity',
      avgPrice: '₹88,000/sq.yd',
      growth: '+14.6%',
      count: '110+ listings',
      bgImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
      sectors: ['Sector 150', 'Sector 137', 'Sector 144', 'Sector 128'],
      searchFilter: 'Noida',
      district: 'Gautam Buddha Nagar',
      state: 'Uttar Pradesh'
    },
    {
      id: 'up-lucknow-gomti',
      name: 'Lucknow Gomti Nagar Extension',
      fullName: 'Lucknow Gomti Nagar Extn & Shaheed Path',
      tagline: 'Shaheed Path & IT City Corridor',
      avgPrice: '₹52,000/sq.yd',
      growth: '+15.8%',
      count: '125+ listings',
      bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
      sectors: ['Gomti Nagar Extn', 'Shaheed Path', 'Sultanpur Road', 'Vrindavan Colony'],
      searchFilter: 'Lucknow',
      district: 'Lucknow',
      state: 'Uttar Pradesh'
    },
    {
      id: 'up-ayodhya-corridor',
      name: 'Ayodhya Ram Mandir Corridor',
      fullName: 'Ayodhya Airport & Temple Expressway',
      tagline: 'World Heritage & International Airport Belt',
      avgPrice: '₹42,000/sq.yd',
      growth: '+24.5%',
      count: '45+ listings',
      bgImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80',
      sectors: ['Ram Mandir Highway', 'Airport Road', 'Faizabad Bypass', 'Civil Lines'],
      searchFilter: 'Ayodhya',
      district: 'Ayodhya',
      state: 'Uttar Pradesh'
    },
    {
      id: 'up-varanasi-ring',
      name: 'Varanasi Ring Road & Shivpur',
      fullName: 'Varanasi Ring Road & Airport Highway',
      tagline: 'Heritage Capital & Highway Ring Road',
      avgPrice: '₹38,000/sq.yd',
      growth: '+13.2%',
      count: '75+ listings',
      bgImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
      sectors: ['Shivpur', 'Ring Road Phase 2', 'Babatpur Airport Road', 'Pandeypur'],
      searchFilter: 'Varanasi',
      district: 'Varanasi',
      state: 'Uttar Pradesh'
    },
    {
      id: 'up-muzaffarnagar-mandi',
      name: 'Muzaffarnagar & Hapur Mandis',
      fullName: 'Muzaffarnagar Gur Mandi & Hapur',
      tagline: "Asia's Largest Gur / Jaggery & Grain Mandi",
      avgPrice: '₹26,000/sq.yd',
      growth: '+9.8%',
      count: '35+ listings',
      bgImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
      sectors: ['Muzaffarnagar Mandi', 'Hapur Anaj Mandi', 'Shamli Road', 'Baraut'],
      searchFilter: 'Muzaffarnagar',
      district: 'Muzaffarnagar',
      state: 'Uttar Pradesh'
    }
  ],

  // ── 11. GUJARAT ──
  'gujarat': [
    {
      id: 'gj-ahmedabad-gift',
      name: 'Ahmedabad SG Highway & GIFT City',
      fullName: 'Ahmedabad SG Highway & GIFT City Gandhinagar',
      tagline: 'Financial Megacity & Science City Corridor',
      avgPrice: '₹85,000/sq.yd',
      growth: '+16.2%',
      count: '145+ listings',
      bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
      sectors: ['GIFT City', 'SG Highway', 'South Bopal', 'Shela'],
      searchFilter: 'Ahmedabad',
      district: 'Ahmedabad',
      state: 'Gujarat'
    },
    {
      id: 'gj-surat-vesu',
      name: 'Surat Diamond Bourse & Vesu',
      fullName: 'Surat Diamond Bourse & VIP Road',
      tagline: 'World Diamond Trade & VIP Road Luxury',
      avgPrice: '₹74,000/sq.yd',
      growth: '+15.4%',
      count: '115+ listings',
      bgImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
      sectors: ['Vesu', 'Pal', 'Dumas Road', 'Diamond Bourse'],
      searchFilter: 'Surat',
      district: 'Surat',
      state: 'Gujarat'
    },
    {
      id: 'gj-unjha-mandi',
      name: 'Unjha, Gondal & Deesa Mandis',
      fullName: 'Unjha Jeera & Gondal Chilli APMC',
      tagline: "Asia's Top Jeera, Chilli & Potato APMC Hubs",
      avgPrice: '₹22,000/sq.yd',
      growth: '+12.0%',
      count: '40+ listings',
      bgImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
      sectors: ['Unjha Jeera Mandi', 'Gondal APMC', 'Deesa Potato Mandi', 'Mehsana'],
      searchFilter: 'Unjha',
      district: 'Mehsana',
      state: 'Gujarat'
    }
  ]
};

// ─── DYNAMIC POPULAR LOCATIONS RESOLVER ──────────────────────────────────────
export function getPopularLocationsForStateAndDistrict(
  stateName?: string,
  districtName?: string,
  liveProperties?: Property[]
): PopularLocationCard[] {
  const s = (stateName || '').trim().toLowerCase();
  const d = (districtName || '').trim().toLowerCase();

  // 1. Check exact district + state match (e.g. "punjab-sangrur", "haryana-rewari")
  if (d && s) {
    const compoundKey = `${s}-${d}`;
    if (POPULAR_LOCATIONS_REGISTRY[compoundKey]) {
      return enrichCounts(POPULAR_LOCATIONS_REGISTRY[compoundKey], liveProperties);
    }
    // Also check if district starts with or contains
    for (const key in POPULAR_LOCATIONS_REGISTRY) {
      if (key.startsWith(`${s}-`) && (key.includes(d) || d.includes(key.replace(`${s}-`, '')))) {
        return enrichCounts(POPULAR_LOCATIONS_REGISTRY[key], liveProperties);
      }
    }
  }

  // 2. Check state match (e.g. "punjab", "haryana", "chandigarh", "delhi", etc.)
  if (s) {
    for (const key in POPULAR_LOCATIONS_REGISTRY) {
      if (key === s || key.includes(s) || s.includes(key)) {
        return enrichCounts(POPULAR_LOCATIONS_REGISTRY[key], liveProperties);
      }
    }
  }

  // 3. Dynamic Generator for ANY other state / district across all 28 states & UTs
  const foundState = getStateByName(stateName || 'Punjab') || INDIAN_STATES[0];
  const cities = foundState.popularCities || foundState.cities.slice(0, 6);

  const fallbackImages = [
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80'
  ];

  const cards: PopularLocationCard[] = cities.slice(0, 6).map((city, idx) => {
    return {
      id: `dyn-${foundState.code.toLowerCase()}-${city.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: `${city} City & Mandi Belt`,
      fullName: `${city}, ${foundState.name}`,
      tagline: `${foundState.name} Prime Growth & Commercial Corridor`,
      avgPrice: `₹${32 + (idx * 6)},000/sq.yd`,
      growth: `+${(10.5 + (idx * 1.3)).toFixed(1)}%`,
      count: '25+ listings',
      bgImage: fallbackImages[idx % fallbackImages.length],
      sectors: [`${city} Center`, 'Main Anaj Mandi', 'Highway Bypass', 'Model Enclave'],
      searchFilter: city,
      district: city,
      state: foundState.name
    };
  });

  return enrichCounts(cards, liveProperties);
}

function enrichCounts(cards: PopularLocationCard[], liveProperties?: Property[]): PopularLocationCard[] {
  if (!liveProperties || liveProperties.length === 0) return cards;

  return cards.map(c => {
    const term = c.searchFilter.toLowerCase();
    const count = liveProperties.filter(p => {
      const full = `${p.city || ''} ${p.district || ''} ${p.tehsil || ''} ${p.village || ''} ${p.location || ''} ${p.title || ''}`.toLowerCase();
      return full.includes(term);
    }).length;

    return {
      ...c,
      count: count > 0 ? `${count} listings` : c.count
    };
  });
}
