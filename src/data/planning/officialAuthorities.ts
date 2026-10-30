import type { AuthorityInfo } from './types';

export const OFFICIAL_AUTHORITIES: Record<string, AuthorityInfo> = {
  // Punjab Authorities
  GMADA: {
    id: 'GMADA',
    name: 'Greater Mohali Area Development Authority',
    shortName: 'GMADA',
    state: 'Punjab',
    cityOrRegion: 'SAS Nagar (Mohali), New Chandigarh, Kharar, Zirakpur, Dera Bassi',
    websiteUrl: 'https://gmada.gov.in/',
    gisPortalUrl: 'https://gmada.gov.in/en/master-plans',
    masterPlanPortalUrl: 'https://gmada.gov.in/en/master-plans',
    jurisdictionArea: '1,165 Sq. Km.',
    description: 'Statutory urban development body established under the Punjab Regional and Town Planning and Development Act, 1995.'
  },
  GLADA: {
    id: 'GLADA',
    name: 'Greater Ludhiana Area Development Authority',
    shortName: 'GLADA',
    state: 'Punjab',
    cityOrRegion: 'Ludhiana, Khanna, Samrala, Jagraon',
    websiteUrl: 'https://glada.gov.in/',
    gisPortalUrl: 'https://glada.gov.in/master-plan/',
    masterPlanPortalUrl: 'https://glada.gov.in/master-plan/',
    jurisdictionArea: '3,767 Sq. Km.',
    description: 'Governs master plans, TP schemes, and industrial growth in Punjab’s commercial capital.'
  },
  JDA: {
    id: 'JDA',
    name: 'Jalandhar Development Authority',
    shortName: 'JDA',
    state: 'Punjab',
    cityOrRegion: 'Jalandhar, Kapurthala, Hoshiarpur',
    websiteUrl: 'https://jda.punjab.gov.in/',
    gisPortalUrl: 'https://puda.punjab.gov.in/master-plans',
    masterPlanPortalUrl: 'https://puda.punjab.gov.in/master-plans',
    jurisdictionArea: '2,632 Sq. Km.',
    description: 'Responsible for planned urban estates, sports city corridors, and TP schemes in the Doaba region.'
  },
  ADA: {
    id: 'ADA',
    name: 'Amritsar Development Authority',
    shortName: 'ADA',
    state: 'Punjab',
    cityOrRegion: 'Amritsar, Tarn Taran, Gurdaspur',
    websiteUrl: 'https://ada.punjab.gov.in/',
    gisPortalUrl: 'https://puda.punjab.gov.in/master-plans',
    masterPlanPortalUrl: 'https://puda.punjab.gov.in/master-plans',
    jurisdictionArea: '2,683 Sq. Km.',
    description: 'Drives the holy city urban master plan 2031, heritage corridors, and ring road expansions.'
  },
  PDA: {
    id: 'PDA',
    name: 'Patiala Development Authority',
    shortName: 'PDA',
    state: 'Punjab',
    cityOrRegion: 'Patiala, Fatehgarh Sahib, Sangrur',
    websiteUrl: 'https://pda.punjab.gov.in/',
    gisPortalUrl: 'https://pda.punjab.gov.in/master-plans',
    masterPlanPortalUrl: 'https://pda.punjab.gov.in/master-plans',
    jurisdictionArea: '3,218 Sq. Km.',
    description: 'Oversees planned urban estates, heritage bypass corridors, and institutional development in Malwa East.'
  },
  BDA: {
    id: 'BDA',
    name: 'Bathinda Development Authority',
    shortName: 'BDA',
    state: 'Punjab',
    cityOrRegion: 'Bathinda, Mansa, Sri Muktsar Sahib, Faridkot, Fazilka',
    websiteUrl: 'https://bdabathinda.in/',
    gisPortalUrl: 'https://bdabathinda.in/master-plans',
    masterPlanPortalUrl: 'https://bdabathinda.in/master-plans',
    jurisdictionArea: '3,385 Sq. Km.',
    description: 'Apex planning authority for petrochemical hub, AIIMS corridor, and southwest Punjab master plans.'
  },
  PUDA: {
    id: 'PUDA',
    name: 'Punjab Urban Planning and Development Authority',
    shortName: 'PUDA',
    state: 'Punjab',
    cityOrRegion: 'Entire State of Punjab',
    websiteUrl: 'https://puda.punjab.gov.in/',
    gisPortalUrl: 'https://puda.punjab.gov.in/master-plans',
    masterPlanPortalUrl: 'https://puda.punjab.gov.in/master-plans',
    jurisdictionArea: '50,362 Sq. Km.',
    description: 'Apex state planning agency overseeing regional plans, approved colonies directory, and CLU regulations.'
  },

  // Chandigarh & Haryana Authorities
  UT_TP: {
    id: 'UT_TP',
    name: 'Department of Urban Planning, Chandigarh Administration',
    shortName: 'UT Urban Planning',
    state: 'Chandigarh',
    cityOrRegion: 'UT of Chandigarh (Sectors 1-63)',
    websiteUrl: 'https://urbanplanning.chd.gov.in/',
    gisPortalUrl: 'https://chandigarh.gov.in/know-chandigarh/master-plan-2031',
    masterPlanPortalUrl: 'https://urbanplanning.chd.gov.in/master-plan-2031/',
    jurisdictionArea: '114 Sq. Km.',
    description: 'Custodians of the world-renowned Le Corbusier Chandigarh Master Plan 2031.'
  },
  HSVP: {
    id: 'HSVP',
    name: 'Haryana Shehri Vikas Pradhikaran (HUDA)',
    shortName: 'HSVP',
    state: 'Haryana',
    cityOrRegion: 'Panchkula, Gurugram, Faridabad, Sonipat, Panipat, Ambala, Rohtak',
    websiteUrl: 'https://hsvphry.org.in/',
    gisPortalUrl: 'https://tcpharyana.gov.in/',
    masterPlanPortalUrl: 'https://tcpharyana.gov.in/MasterPlan.htm',
    jurisdictionArea: 'Entire State of Haryana',
    description: 'Premier planned urbanization body developing sectors, commercial hubs, and institutional complexes in Haryana.'
  },
  GMDA_HR: {
    id: 'GMDA_HR',
    name: 'Gurugram Metropolitan Development Authority',
    shortName: 'GMDA Gurugram',
    state: 'Haryana',
    cityOrRegion: 'Gurugram, Manesar, Sohna',
    websiteUrl: 'https://gmda.gov.in/',
    gisPortalUrl: 'https://gis.gmda.gov.in/',
    masterPlanPortalUrl: 'https://gmda.gov.in/master-plan',
    jurisdictionArea: '675 Sq. Km.',
    description: 'Integrated GIS planning authority for millennium city Gurugram with live GIS infrastructure portals.'
  },
  DTCP_HR: {
    id: 'DTCP_HR',
    name: 'Department of Town & Country Planning, Haryana',
    shortName: 'DTCP Haryana',
    state: 'Haryana',
    cityOrRegion: 'All Urban Areas in Haryana',
    websiteUrl: 'https://tcpharyana.gov.in/',
    gisPortalUrl: 'https://tcpharyana.gov.in/MasterPlan.htm',
    masterPlanPortalUrl: 'https://tcpharyana.gov.in/MasterPlan.htm',
    jurisdictionArea: '44,212 Sq. Km.',
    description: 'Licenses private colonies, affordable housing schemes, and publishes statutory final development plans.'
  },

  // Delhi NCT
  DDA: {
    id: 'DDA',
    name: 'Delhi Development Authority',
    shortName: 'DDA',
    state: 'Delhi (NCT)',
    cityOrRegion: 'National Capital Territory of Delhi',
    websiteUrl: 'https://dda.gov.in/',
    gisPortalUrl: 'https://dda.gov.in/gis-portal',
    masterPlanPortalUrl: 'https://dda.gov.in/master-plan-2041',
    jurisdictionArea: '1,483 Sq. Km.',
    description: 'Formulates Master Plan for Delhi (MPD 2041), zonal development plans, and Land Pooling Policy.'
  },

  // Maharashtra
  MMRDA: {
    id: 'MMRDA',
    name: 'Mumbai Metropolitan Region Development Authority',
    shortName: 'MMRDA',
    state: 'Maharashtra',
    cityOrRegion: 'Mumbai, Thane, Navi Mumbai, Kalyan-Dombivli, Mira-Bhayandar, Vasai-Virar, Raigad',
    websiteUrl: 'https://mmrda.maharashtra.gov.in/',
    gisPortalUrl: 'https://mmrda.maharashtra.gov.in/regional-plan',
    masterPlanPortalUrl: 'https://mmrda.maharashtra.gov.in/regional-plan',
    jurisdictionArea: '6,328 Sq. Km.',
    description: 'Apex regional planning body for India’s largest metropolitan region and metro/trans-harbour infrastructure.'
  },
  MCGM: {
    id: 'MCGM',
    name: 'Municipal Corporation of Greater Mumbai (BMC)',
    shortName: 'BMC / MCGM',
    state: 'Maharashtra',
    cityOrRegion: 'Greater Mumbai Island City & Suburbs',
    websiteUrl: 'https://portal.mcgm.gov.in/',
    gisPortalUrl: 'https://autodcr.mcgm.gov.in/dp2034/',
    masterPlanPortalUrl: 'https://portal.mcgm.gov.in/irj/portal/anonymous/qldp2034',
    jurisdictionArea: '437 Sq. Km.',
    description: 'Administers Development Plan 2034 (DP 2034) with GIS parcel land use and accommodation reservation policy.'
  },
  PMRDA: {
    id: 'PMRDA',
    name: 'Pune Metropolitan Region Development Authority',
    shortName: 'PMRDA',
    state: 'Maharashtra',
    cityOrRegion: 'Pune, Pimpri-Chinchwad, Haveli, Mulshi, Maval',
    websiteUrl: 'https://pmrda.gov.in/',
    gisPortalUrl: 'https://pmrda.gov.in/development-plan',
    masterPlanPortalUrl: 'https://pmrda.gov.in/development-plan',
    jurisdictionArea: '6,984 Sq. Km.',
    description: 'Governs Pune Metropolitan Region Draft Development Plan 2041 with 18 Town Planning schemes.'
  },

  // Karnataka
  BDA_BLR: {
    id: 'BDA_BLR',
    name: 'Bengaluru Development Authority',
    shortName: 'BDA Bengaluru',
    state: 'Karnataka',
    cityOrRegion: 'Bengaluru Urban & Conurbation',
    websiteUrl: 'https://bdabangalore.org/',
    gisPortalUrl: 'https://bdabangalore.org/masterplan',
    masterPlanPortalUrl: 'https://bdabangalore.org/masterplan',
    jurisdictionArea: '1,219 Sq. Km.',
    description: 'Responsible for Revised Master Plan 2031 (RMP 2031), layout approvals, and peripheral ring road corridors.'
  },
  BMRDA: {
    id: 'BMRDA',
    name: 'Bangalore Metropolitan Region Development Authority',
    shortName: 'BMRDA',
    state: 'Karnataka',
    cityOrRegion: 'Bengaluru Rural, Ramanagara, Kanakapura, Hoskote, Nelamangala',
    websiteUrl: 'https://bmrda.karnataka.gov.in/',
    gisPortalUrl: 'https://bmrda.karnataka.gov.in/structure-plan',
    masterPlanPortalUrl: 'https://bmrda.karnataka.gov.in/structure-plan',
    jurisdictionArea: '8,005 Sq. Km.',
    description: 'Coordinates structure plans and satellite town ring roads around Bengaluru metropolitan area.'
  },

  // Telangana
  HMDA: {
    id: 'HMDA',
    name: 'Hyderabad Metropolitan Development Authority',
    shortName: 'HMDA',
    state: 'Telangana',
    cityOrRegion: 'Hyderabad, Medchal-Malkajgiri, Rangareddy, Sangareddy, Siddipet, Yadadri Bhuvanagiri',
    websiteUrl: 'https://www.hmda.gov.in/',
    gisPortalUrl: 'https://www.hmda.gov.in/master-plans/',
    masterPlanPortalUrl: 'https://www.hmda.gov.in/master-plans/',
    jurisdictionArea: '7,257 Sq. Km.',
    description: 'Administers Hyderabad Metropolitan Master Plan 2031, Outer Ring Road (ORR), and Regional Ring Road (RRR).'
  },

  // Tamil Nadu
  CMDA: {
    id: 'CMDA',
    name: 'Chennai Metropolitan Development Authority',
    shortName: 'CMDA Chennai',
    state: 'Tamil Nadu',
    cityOrRegion: 'Chennai, Chengalpattu, Kanchipuram, Tiruvallur',
    websiteUrl: 'https://www.cmdachennai.gov.in/',
    gisPortalUrl: 'https://www.cmdachennai.gov.in/masterplan.html',
    masterPlanPortalUrl: 'https://www.cmdachennai.gov.in/ThirdMasterPlan.html',
    jurisdictionArea: '5,904 Sq. Km.',
    description: 'Prepares the visionary Third Master Plan (2026-2046) for the expanded Chennai Metropolitan Area.'
  },

  // Gujarat
  AUDA: {
    id: 'AUDA',
    name: 'Ahmedabad Urban Development Authority',
    shortName: 'AUDA',
    state: 'Gujarat',
    cityOrRegion: 'Ahmedabad, Gandhinagar peri-urban, Sanand, Kalol',
    websiteUrl: 'https://auda.org.in/',
    gisPortalUrl: 'https://auda.org.in/development-plan',
    masterPlanPortalUrl: 'https://auda.org.in/development-plan-2031',
    jurisdictionArea: '1,866 Sq. Km.',
    description: 'Global benchmark for Town Planning (TP) Schemes and Comprehensive Development Plan (DP 2031).'
  },
  SUDA: {
    id: 'SUDA',
    name: 'Surat Urban Development Authority',
    shortName: 'SUDA Surat',
    state: 'Gujarat',
    cityOrRegion: 'Surat, Olpad, Kamrej, Palsana, Choryasi',
    websiteUrl: 'https://sudaonline.org/',
    gisPortalUrl: 'https://sudaonline.org/development-plan/',
    masterPlanPortalUrl: 'https://sudaonline.org/development-plan/',
    jurisdictionArea: '722 Sq. Km.',
    description: 'Coordinates diamond city expansion, Dream City Khajod, and 80+ TP scheme layouts.'
  },

  // Uttar Pradesh
  NOIDA: {
    id: 'NOIDA',
    name: 'New Okhla Industrial Development Authority',
    shortName: 'NOIDA',
    state: 'Uttar Pradesh',
    cityOrRegion: 'Noida (Sectors 1 to 168)',
    websiteUrl: 'https://noidaauthorityonline.in/',
    gisPortalUrl: 'https://noidaauthorityonline.in/en/master-plan',
    masterPlanPortalUrl: 'https://noidaauthorityonline.in/en/master-plan-2031',
    jurisdictionArea: '203 Sq. Km.',
    description: 'Master Plan 2031 for one of Asia’s largest systematically planned industrial and residential hubs.'
  },
  GNIDA: {
    id: 'GNIDA',
    name: 'Greater Noida Industrial Development Authority',
    shortName: 'Greater Noida',
    state: 'Uttar Pradesh',
    cityOrRegion: 'Greater Noida, Greater Noida West (Noida Extension)',
    websiteUrl: 'https://www.greaternoidaauthority.in/',
    gisPortalUrl: 'https://www.greaternoidaauthority.in/masterplan',
    masterPlanPortalUrl: 'https://www.greaternoidaauthority.in/masterplan-2041',
    jurisdictionArea: '380 Sq. Km.',
    description: 'Master Plan 2041 governing planned sectors (Alpha, Beta, Gamma, Ecotech, Knowledge Parks).'
  },
  YEIDA: {
    id: 'YEIDA',
    name: 'Yamuna Expressway Industrial Development Authority',
    shortName: 'YEIDA',
    state: 'Uttar Pradesh',
    cityOrRegion: 'Yamuna Expressway, Jewar Noida International Airport Region',
    websiteUrl: 'https://www.yamunaexpresswayauthority.com/',
    gisPortalUrl: 'https://www.yamunaexpresswayauthority.com/master-plan-2041/',
    masterPlanPortalUrl: 'https://www.yamunaexpresswayauthority.com/master-plan-2041/',
    jurisdictionArea: '2,688 Sq. Km.',
    description: 'Noida International Airport Jewar aerotropolis, film city, and industrial sector zoning Master Plan 2041.'
  },
  LDA: {
    id: 'LDA',
    name: 'Lucknow Development Authority',
    shortName: 'LDA Lucknow',
    state: 'Uttar Pradesh',
    cityOrRegion: 'Lucknow, Mohanlalganj, Gomti Nagar, Shaheed Path, Sultanpur Road',
    websiteUrl: 'https://ldaonline.co.in/',
    gisPortalUrl: 'https://ldaonline.co.in/master-plan-2031/',
    masterPlanPortalUrl: 'https://ldaonline.co.in/master-plan-2031/',
    jurisdictionArea: '1,010 Sq. Km.',
    description: 'Administers Lucknow Master Plan 2031, Gomti Nagar schemes, and IT City Sultanpur Road corridor.'
  },

  // Rajasthan
  JDA_JPR: {
    id: 'JDA_JPR',
    name: 'Jaipur Development Authority',
    shortName: 'JDA Jaipur',
    state: 'Rajasthan',
    cityOrRegion: 'Jaipur, Sanganer, Amer, Jagatpura, Mansarovar, Ajmer Road',
    websiteUrl: 'https://urban.rajasthan.gov.in/jda',
    gisPortalUrl: 'https://urban.rajasthan.gov.in/jda-master-plan-2025',
    masterPlanPortalUrl: 'https://urban.rajasthan.gov.in/jda-master-plan-2025',
    jurisdictionArea: '3,000 Sq. Km.',
    description: 'Formulates Master Development Plan 2025 (MDP 2025), Ring Road project, and 60+ sector schemes.'
  },

  // West Bengal
  KMDA: {
    id: 'KMDA',
    name: 'Kolkata Metropolitan Development Authority',
    shortName: 'KMDA Kolkata',
    state: 'West Bengal',
    cityOrRegion: 'Kolkata, Howrah, Salt Lake, New Town, Hooghly, North/South 24 Parganas',
    websiteUrl: 'https://kmda.wb.gov.in/',
    gisPortalUrl: 'https://kmda.wb.gov.in/land-use-development-plan',
    masterPlanPortalUrl: 'https://kmda.wb.gov.in/land-use-development-plan',
    jurisdictionArea: '1,886 Sq. Km.',
    description: 'Prepares Land Use and Development Control Plans (LUDCP) across Kolkata Metropolitan Area.'
  }
};
