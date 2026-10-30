import type { IndiaState } from './types';

export const INDIA_STATES_DATA: IndiaState[] = [
  {
    code: 'PB',
    name: 'Punjab',
    hindiName: 'पंजाब',
    punjabiName: 'ਪੰਜਾਬ',
    type: 'State',
    capital: 'Chandigarh',
    center: [30.9010, 75.8573],
    zoom: 8,
    districts: [
      'Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka',
      'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana',
      'Malerkotla', 'Mansa', 'Moga', 'Sri Muktsar Sahib', 'Pathankot', 'Patiala',
      'Rupnagar (Ropar)', 'SAS Nagar (Mohali)', 'SBS Nagar (Nawanshahr)', 'Sangrur', 'Tarn Taran'
    ],
    primaryAuthorities: ['GMADA', 'GLADA', 'PDA', 'BDA', 'JDA', 'ADA', 'PUDA'],
    revenueUnit: 'Kanal / Marla',
    revenuePortalName: 'PLRS (Punjab Land Records Society) / Jamabandi',
    revenuePortalUrl: 'https://plrs.org.in/',
    bhuNakshaPortalUrl: 'https://revenue.punjab.gov.in/',
    townPlanningPortalUrl: 'https://puda.punjab.gov.in/',
    cadastralNomenclature: {
      parcelTerm: 'Khasra',
      subParcelTerm: 'Killa / Murabba',
      villageTerm: 'Pind / Hadbast'
    },
    description: 'Punjab Urban Planning and Development Authority (PUDA) and specialized authorities (GMADA, GLADA, PDA, BDA, JDA, ADA) govern urban planning across 23 districts.'
  },
  {
    code: 'CH',
    name: 'Chandigarh',
    hindiName: 'चंडीगढ़',
    punjabiName: 'ਚੰਡੀਗੜ੍ਹ',
    type: 'UT',
    capital: 'Chandigarh',
    center: [30.7333, 76.7794],
    zoom: 12,
    districts: ['Chandigarh'],
    primaryAuthorities: ['UT_TP', 'CHB'],
    revenueUnit: 'Sq. Yds / Gaj',
    revenuePortalName: 'Chandigarh Estate Office',
    revenuePortalUrl: 'https://estateoffice.chd.gov.in/',
    bhuNakshaPortalUrl: 'https://chandigarh.gov.in/',
    townPlanningPortalUrl: 'https://urbanplanning.chd.gov.in/',
    cadastralNomenclature: {
      parcelTerm: 'Plot / Sector',
      subParcelTerm: 'Block',
      villageTerm: 'Rehabilitated Village / Abadi'
    },
    description: 'Le Corbusier Master Plan 2031 grid system covering Sectors 1 to 63 and industrial areas administered by UT Chandigarh Department of Urban Planning.'
  },
  {
    code: 'HR',
    name: 'Haryana',
    hindiName: 'हरियाणा',
    punjabiName: 'ਹਰਿਆਣਾ',
    type: 'State',
    capital: 'Chandigarh',
    center: [29.0588, 76.0856],
    zoom: 8,
    districts: [
      'Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram',
      'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra',
      'Mahendragarh', 'Nuh', 'Palwal', 'Panchkula', 'Panipat', 'Rewari',
      'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar'
    ],
    primaryAuthorities: ['HSVP', 'GMDA_HR', 'FMDA', 'DTCP_HR'],
    revenueUnit: 'Sq. Yds / Gaj',
    revenuePortalName: 'Jamabandi Haryana / Revenue Records',
    revenuePortalUrl: 'https://jamabandi.nic.in/',
    bhuNakshaPortalUrl: 'https://revenueharyana.gov.in/',
    townPlanningPortalUrl: 'https://tcpharyana.gov.in/',
    cadastralNomenclature: {
      parcelTerm: 'Khasra',
      subParcelTerm: 'Killa / Murabba',
      villageTerm: 'Mauza / Hadbast'
    },
    description: 'Haryana Shehri Vikas Pradhikaran (HSVP), GMDA Gurugram, FMDA Faridabad, and Town & Country Planning Haryana govern planned sectors and DP 2031.'
  },
  {
    code: 'DL',
    name: 'Delhi (NCT)',
    hindiName: 'दिल्ली',
    punjabiName: 'ਦਿੱਲੀ',
    type: 'UT',
    capital: 'New Delhi',
    center: [28.6139, 77.2090],
    zoom: 11,
    districts: [
      'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi',
      'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'
    ],
    primaryAuthorities: ['DDA', 'MCD', 'NDMC'],
    revenueUnit: 'Sq. Meters',
    revenuePortalName: 'Delhi Bhulekh / Revenue Department',
    revenuePortalUrl: 'https://dlrc.delhi.gov.in/',
    bhuNakshaPortalUrl: 'https://dda.gov.in/gis-portal',
    townPlanningPortalUrl: 'https://dda.gov.in/master-plan-2041',
    cadastralNomenclature: {
      parcelTerm: 'Khasra / Plot',
      subParcelTerm: 'Zone Division',
      villageTerm: 'Urbanized Village / Lal Dora'
    },
    description: 'Delhi Development Authority (DDA) Master Plan for Delhi (MPD 2041 & MPD 2021) with Land Pooling Policy zones A through P.'
  },
  {
    code: 'MH',
    name: 'Maharashtra',
    hindiName: 'महाराष्ट्र',
    punjabiName: 'ਮਹਾਰਾਸ਼ਟਰ',
    type: 'State',
    capital: 'Mumbai',
    center: [19.7515, 75.7139],
    zoom: 7,
    districts: [
      'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad (Chhatrapati Sambhaji Nagar)', 'Beed', 'Bhandara',
      'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli',
      'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban',
      'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad (Dharashiv)', 'Palghar',
      'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara',
      'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'
    ],
    primaryAuthorities: ['MMRDA', 'MCGM', 'PMRDA', 'PMC', 'CIDCO', 'MIDC', 'NIT_NAGPUR'],
    revenueUnit: 'Guntha',
    revenuePortalName: 'Mahabhulekh (7/12 & 8A Records)',
    revenuePortalUrl: 'https://bhulekh.mahabhumi.gov.in/',
    bhuNakshaPortalUrl: 'https://mahabhunaksha.mahabhumi.gov.in/',
    townPlanningPortalUrl: 'https://dtp.maharashtra.gov.in/',
    cadastralNomenclature: {
      parcelTerm: 'Gat No / Survey No',
      subParcelTerm: 'Hissa No',
      villageTerm: 'Gaon / Mauje'
    },
    description: 'MMRDA, MCGM (DP 2034), PMRDA, CIDCO Navi Mumbai, and Town Planning Maharashtra administer comprehensive development and zoning plans.'
  },
  {
    code: 'KA',
    name: 'Karnataka',
    hindiName: 'कर्नाटक',
    punjabiName: 'ਕਰਨਾਟਕ',
    type: 'State',
    capital: 'Bengaluru',
    center: [15.3173, 75.7139],
    zoom: 7,
    districts: [
      'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar',
      'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada',
      'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu',
      'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga',
      'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayanagara', 'Yadgir'
    ],
    primaryAuthorities: ['BDA_BLR', 'BMRDA', 'BBMP', 'MUDA_MYS', 'BIAAPA'],
    revenueUnit: 'Sq. Feet',
    revenuePortalName: 'Bhoomi (Karnataka Land Records RTC)',
    revenuePortalUrl: 'https://landrecords.karnataka.gov.in/',
    bhuNakshaPortalUrl: 'https://bhoomi.karnataka.gov.in/bhu-bharti',
    townPlanningPortalUrl: 'https://bdabangalore.org/',
    cadastralNomenclature: {
      parcelTerm: 'Survey No',
      subParcelTerm: 'Hissa / Podi',
      villageTerm: 'Dakhale / Grama'
    },
    description: 'Bengaluru Development Authority (BDA Master Plan 2031), BMRDA, BBMP, and Directorate of Town & Country Planning govern layout approvals and zoning.'
  },
  {
    code: 'TS',
    name: 'Telangana',
    hindiName: 'तेलंगाना',
    punjabiName: 'ਤੇਲੰਗਾਨਾ',
    type: 'State',
    capital: 'Hyderabad',
    center: [18.1124, 79.0193],
    zoom: 7,
    districts: [
      'Adilabad', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon', 'Jayashankar Bhupalpally',
      'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 'Khammam', 'Komaram Bheem', 'Mahabubabad',
      'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool',
      'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla',
      'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal', 'Yadadri Bhuvanagiri'
    ],
    primaryAuthorities: ['HMDA', 'GHMC', 'KUDA', 'DTCP_TS'],
    revenueUnit: 'Sq. Yds / Gaj',
    revenuePortalName: 'Dharani Telangana Land Record Portal',
    revenuePortalUrl: 'https://dharani.telangana.gov.in/',
    bhuNakshaPortalUrl: 'https://ccla.telangana.gov.in/',
    townPlanningPortalUrl: 'https://www.hmda.gov.in/',
    cadastralNomenclature: {
      parcelTerm: 'Survey No',
      subParcelTerm: 'Sub-Division',
      villageTerm: 'Gramam / Rev Village'
    },
    description: 'Hyderabad Metropolitan Development Authority (HMDA Master Plan 2031) covers 7,257 sq km across 7 districts with comprehensive ORR and RRR planning.'
  },
  {
    code: 'TN',
    name: 'Tamil Nadu',
    hindiName: 'तमिलनाडु',
    punjabiName: 'ਤਾਮਿਲਨਾਡੂ',
    type: 'State',
    capital: 'Chennai',
    center: [11.1271, 78.6569],
    zoom: 7,
    districts: [
      'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri',
      'Dindigul', 'Erode', 'Kallakurichi', 'Kancheepuram', 'Karur', 'Krishnagiri',
      'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur',
      'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi',
      'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur',
      'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
    ],
    primaryAuthorities: ['CMDA', 'DTCP_TN', 'GCC'],
    revenueUnit: 'Cent',
    revenuePortalName: 'Anytime Anywhere e-Services (Patta / Chitta)',
    revenuePortalUrl: 'https://eservices.tn.gov.in/eservicesnew/',
    bhuNakshaPortalUrl: 'https://eservices.tn.gov.in/eservicesnew/land/chitta.html',
    townPlanningPortalUrl: 'https://www.cmdachennai.gov.in/',
    cadastralNomenclature: {
      parcelTerm: 'Survey No / RS No',
      subParcelTerm: 'Sub-division No',
      villageTerm: 'Grama / Revenue Village'
    },
    description: 'Chennai Metropolitan Development Authority (CMDA Third Master Plan) and Directorate of Town & Country Planning govern land use and layout approvals.'
  },
  {
    code: 'GJ',
    name: 'Gujarat',
    hindiName: 'गुजरात',
    punjabiName: 'ਗੁਜਰਾਤ',
    type: 'State',
    capital: 'Gandhinagar',
    center: [22.2587, 71.1924],
    zoom: 7,
    districts: [
      'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch',
      'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka',
      'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch',
      'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal',
      'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar',
      'Tapi', 'Vadodara', 'Valsad'
    ],
    primaryAuthorities: ['AUDA', 'AMC', 'SUDA', 'VUDA', 'RUDA', 'GUDA'],
    revenueUnit: 'Sq. Meters',
    revenuePortalName: 'AnyRoR Gujarat (7/12 & 8A VF Records)',
    revenuePortalUrl: 'https://anyror.gujarat.gov.in/',
    bhuNakshaPortalUrl: 'https://iora.gujarat.gov.in/',
    townPlanningPortalUrl: 'https://auda.org.in/',
    cadastralNomenclature: {
      parcelTerm: 'Survey No / Block No',
      subParcelTerm: 'Final Plot (FP) No / Original Plot (OP) No',
      villageTerm: 'Gaam / Moje'
    },
    description: 'Pioneers of the Town Planning (TP) Scheme model under Gujarat Town Planning & Urban Development Act (GTPUDA) administered by AUDA, SUDA, VUDA, and RUDA.'
  },
  {
    code: 'UP',
    name: 'Uttar Pradesh',
    hindiName: 'उत्तर प्रदेश',
    punjabiName: 'ਉੱਤਰ ਪ੍ਰਦੇਸ਼',
    type: 'State',
    capital: 'Lucknow',
    center: [26.8467, 80.9462],
    zoom: 7,
    districts: [
      'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya',
      'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki',
      'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli',
      'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad',
      'Gautam Buddha Nagar (Noida)', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur',
      'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj',
      'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kheri', 'Kushinagar',
      'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau',
      'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh',
      'Prayagraj', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar',
      'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra',
      'Sultanpur', 'Unnao', 'Varanasi'
    ],
    primaryAuthorities: ['NOIDA', 'GNIDA', 'YEIDA', 'GDA', 'LDA', 'KDA', 'ADA_UP', 'MVDA'],
    revenueUnit: 'Bigha',
    revenuePortalName: 'UP Bhulekh (Khatoni & Khasra)',
    revenuePortalUrl: 'https://upbhulekh.gov.in/',
    bhuNakshaPortalUrl: 'https://upbhunaksha.gov.in/',
    townPlanningPortalUrl: 'https://upavp.com/',
    cadastralNomenclature: {
      parcelTerm: 'Khasra / Gata No',
      subParcelTerm: 'Khata / Khatoni No',
      villageTerm: 'Gram / Mauza'
    },
    description: 'Industrial development authorities (NOIDA, Greater Noida, YEIDA) and city authorities (LDA Lucknow, GDA Ghaziabad, KDA Kanpur) govern mega master plans.'
  },
  {
    code: 'RJ',
    name: 'Rajasthan',
    hindiName: 'राजस्थान',
    punjabiName: 'ਰਾਜਸਥਾਨ',
    type: 'State',
    capital: 'Jaipur',
    center: [27.0238, 74.2179],
    zoom: 7,
    districts: [
      'Ajmer', 'Alwar', 'Anupgarh', 'Balotra', 'Banswara', 'Baran', 'Barmer', 'Beawar',
      'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa',
      'Deeg', 'Didwana-Kuchaman', 'Dholpur', 'Dungarpur', 'Ganganagar', 'Gangapur City',
      'Hanumangarh', 'Jaipur', 'Jaipur Rural', 'Jaisalmer', 'Jalore', 'Jhalawar',
      'Jhunjhunu', 'Jodhpur', 'Jodhpur Rural', 'Karauli', 'Kekri', 'Khairthal-Tijara',
      'Kota', 'Kotputli-Behror', 'Nagaur', 'Neem Ka Thana', 'Pali', 'Phalodi',
      'Pratapgarh', 'Rajsamand', 'Salumbar', 'Sanchore', 'Sawai Madhopur', 'Shahpura',
      'Sikar', 'Sirohi', 'Tonk', 'Udaipur'
    ],
    primaryAuthorities: ['JDA_JPR', 'JDA_JDH', 'UIT_KOTA', 'UIT_UDR', 'RHB'],
    revenueUnit: 'Bigha',
    revenuePortalName: 'Apna Khata Rajasthan (Jamabandi & Namantran)',
    revenuePortalUrl: 'https://apnakhata.rajasthan.gov.in/',
    bhuNakshaPortalUrl: 'https://bhunaksha.rajasthan.gov.in/',
    townPlanningPortalUrl: 'https://urban.rajasthan.gov.in/jda',
    cadastralNomenclature: {
      parcelTerm: 'Khasra No',
      subParcelTerm: 'Khewat / Khata No',
      villageTerm: 'Gram / Patwar Circle'
    },
    description: 'Jaipur Development Authority (JDA Master Plan 2025), Jodhpur JDA, and Urban Improvement Trusts (UITs) manage sector schemes and TP layouts.'
  },
  {
    code: 'MP',
    name: 'Madhya Pradesh',
    hindiName: 'मध्य प्रदेश',
    punjabiName: 'ਮੱਧ ਪ੍ਰਦੇਸ਼',
    type: 'State',
    capital: 'Bhopal',
    center: [22.9734, 78.6569],
    zoom: 7,
    districts: [
      'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani', 'Betul',
      'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia',
      'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda', 'Hoshangabad (Narmadapuram)',
      'Indore', 'Jabalpur', 'Jhabua', 'Katni', 'Khandwa', 'Khargone', 'Mandla',
      'Mandsaur', 'Morena', 'Narsinghpur', 'Neemuch', 'Niwari', 'Panna', 'Raisen',
      'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore', 'Seoni',
      'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh',
      'Ujjain', 'Umaria', 'Vidisha'
    ],
    primaryAuthorities: ['IDA_IND', 'BDA_BPL', 'JDA_JBP', 'GDA_GWL', 'T&CP_MP'],
    revenueUnit: 'Bigha',
    revenuePortalName: 'MP Bhulekh (Khasra, Khatauni & Naksha)',
    revenuePortalUrl: 'https://mpbhulekh.gov.in/',
    bhuNakshaPortalUrl: 'https://mpbhunaksha.gov.in/',
    townPlanningPortalUrl: 'https://mptownplan.gov.in/',
    cadastralNomenclature: {
      parcelTerm: 'Khasra No',
      subParcelTerm: 'Bataankan No',
      villageTerm: 'Gram / Patwari Halka'
    },
    description: 'Indore Development Authority (IDA), Bhopal BDA, and Directorate of Town & Country Planning MP manage master planning and scheme execution.'
  },
  {
    code: 'WB',
    name: 'West Bengal',
    hindiName: 'पश्चिम बंगाल',
    punjabiName: 'ਪੱਛਮੀ ਬੰਗਾਲ',
    type: 'State',
    capital: 'Kolkata',
    center: [22.9868, 87.8550],
    zoom: 7,
    districts: [
      'Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur', 'Darjeeling',
      'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata',
      'Malda', 'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Bardhaman',
      'Paschim Medinipur', 'Purba Bardhaman', 'Purba Medinipur', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur'
    ],
    primaryAuthorities: ['KMDA', 'HIDCO', 'NKDA', 'ADDA', 'SJDA'],
    revenueUnit: 'Sq. Feet',
    revenuePortalName: 'Banglarbhumi (ROR & Plot Information)',
    revenuePortalUrl: 'https://banglarbhumi.gov.in/',
    bhuNakshaPortalUrl: 'https://banglarbhumi.gov.in/BanglarBhumi/PlotMap',
    townPlanningPortalUrl: 'https://kmda.wb.gov.in/',
    cadastralNomenclature: {
      parcelTerm: 'Dag No (Plot)',
      subParcelTerm: 'Khatian No (Record of Rights)',
      villageTerm: 'Mouza / JL No'
    },
    description: 'Kolkata Metropolitan Development Authority (KMDA) and WBHIDCO (New Town Kolkata) oversee spatial planning and infrastructure blueprints.'
  },
  {
    code: 'KL',
    name: 'Kerala',
    hindiName: 'केरल',
    punjabiName: 'ਕੇਰਲ',
    type: 'State',
    capital: 'Thiruvananthapuram',
    center: [10.8505, 76.2711],
    zoom: 8,
    districts: [
      'Alappuzha', 'Ernakulam (Kochi)', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam',
      'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram',
      'Thrissur', 'Wayanad'
    ],
    primaryAuthorities: ['GCDA_KOC', 'TRIDA', 'TCP_KL'],
    revenueUnit: 'Cent',
    revenuePortalName: 'e-Rekha (Kerala Land Information System)',
    revenuePortalUrl: 'https://erekha.kerala.gov.in/',
    bhuNakshaPortalUrl: 'https://revenue.kerala.gov.in/',
    townPlanningPortalUrl: 'https://townplanning.kerala.gov.in/',
    cadastralNomenclature: {
      parcelTerm: 'Re-Survey No',
      subParcelTerm: 'Sub-division No',
      villageTerm: 'Village / Desam'
    },
    description: 'Greater Cochin Development Authority (GCDA) and Department of Town and Country Planning Kerala administer master plans for urban centers.'
  },
  {
    code: 'AP',
    name: 'Andhra Pradesh',
    hindiName: 'आंध्र प्रदेश',
    punjabiName: 'ਆਂਧਰਾ ਪ੍ਰਦੇਸ਼',
    type: 'State',
    capital: 'Amaravati',
    center: [15.9129, 79.7400],
    zoom: 7,
    districts: [
      'Alluri Sitharama Raju', 'Anakapalli', 'Ananthapuramu', 'Annamayya', 'Bapatla',
      'Chittoor', 'Dr. B.R. Ambedkar Konaseema', 'East Godavari', 'Eluru', 'Guntur',
      'Kakinada', 'Krishna', 'Kurnool', 'Nandyal', 'NTR', 'Palnadu',
      'Parvathipuram Manyam', 'Prakasam', 'Sri Potti Sriramulu Nellore', 'Sri Sathya Sai',
      'Srikakulam', 'Tirupati', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'
    ],
    primaryAuthorities: ['APCRDA', 'VMRDA', 'TUDA_AP', 'DTCP_AP'],
    revenueUnit: 'Cent',
    revenuePortalName: 'Meebhoomi (Andhra Pradesh Adangal & 1-B)',
    revenuePortalUrl: 'https://meebhoomi.ap.gov.in/',
    bhuNakshaPortalUrl: 'https://bhunaksha.ap.gov.in/',
    townPlanningPortalUrl: 'https://crda.ap.gov.in/',
    cadastralNomenclature: {
      parcelTerm: 'Survey No / LP No',
      subParcelTerm: 'Sub-division',
      villageTerm: 'Gramam / Revenue Village'
    },
    description: 'APCRDA (Amaravati Capital Region) and VMRDA (Visakhapatnam Metropolitan Region) manage master plans and zoning development.'
  },
  {
    code: 'OD',
    name: 'Odisha',
    hindiName: 'ओडिशा',
    punjabiName: 'ਓਡੀਸ਼ਾ',
    type: 'State',
    capital: 'Bhubaneswar',
    center: [20.9517, 85.0985],
    zoom: 7,
    districts: [
      'Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack', 'Deogarh',
      'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 'Kalahandi',
      'Kandhamal', 'Kendrapara', 'Kendujhar', 'Khordha (Bhubaneswar)', 'Koraput', 'Malkangiri',
      'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 'Rayagada', 'Sambalpur',
      'Subarnapur', 'Sundargarh'
    ],
    primaryAuthorities: ['BDA_BBS', 'CDA_CTC', 'PKDA_PURI', 'T&CP_OD'],
    revenueUnit: 'Sq. Feet',
    revenuePortalName: 'Bhulekh Odisha (ROR & BhuNaksha Map)',
    revenuePortalUrl: 'https://bhulekh.ori.nic.in/',
    bhuNakshaPortalUrl: 'https://bhunakshaodisha.nic.in/',
    townPlanningPortalUrl: 'https://bda.gov.in/',
    cadastralNomenclature: {
      parcelTerm: 'Plot No (Chaka)',
      subParcelTerm: 'Khata No',
      villageTerm: 'Mouza'
    },
    description: 'Bhubaneswar Development Authority (BDA Master Plan 2030) and Cuttack CDA direct comprehensive metropolitan master planning.'
  },
  {
    code: 'BR',
    name: 'Bihar',
    hindiName: 'बिहार',
    punjabiName: 'ਬਿਹਾਰ',
    type: 'State',
    capital: 'Patna',
    center: [25.0961, 85.3131],
    zoom: 7,
    districts: [
      'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar',
      'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur',
      'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger',
      'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa',
      'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul',
      'Vaishali', 'West Champaran'
    ],
    primaryAuthorities: ['PRDA_PAT', 'UD&HD_BR'],
    revenueUnit: 'Bigha',
    revenuePortalName: 'Bihar Bhumi (Dakhil Kharij & Jamabandi Panji)',
    revenuePortalUrl: 'https://biharbhumi.bihar.gov.in/',
    bhuNakshaPortalUrl: 'https://bhunaksha.bihar.gov.in/',
    townPlanningPortalUrl: 'https://urban.bih.nic.in/',
    cadastralNomenclature: {
      parcelTerm: 'Khesra No',
      subParcelTerm: 'Khata No',
      villageTerm: 'Mauza / Thana No'
    },
    description: 'Patna Regional Development Authority & Urban Development & Housing Department oversee Patna Master Plan 2031 and municipal GIS.'
  },
  {
    code: 'UK',
    name: 'Uttarakhand',
    hindiName: 'उत्तराखंड',
    punjabiName: 'ਉੱਤਰਾਖੰਡ',
    type: 'State',
    capital: 'Dehradun',
    center: [30.0668, 79.0193],
    zoom: 8,
    districts: [
      'Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar',
      'Nainital', 'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal',
      'Udham Singh Nagar', 'Uttarkashi'
    ],
    primaryAuthorities: ['MDDA_DDN', 'HRDA_HWR', 'T&CP_UK'],
    revenueUnit: 'Bigha',
    revenuePortalName: 'Bhulekh Uttarakhand (Devbhoomi)',
    revenuePortalUrl: 'https://bhulekh.uk.gov.in/',
    bhuNakshaPortalUrl: 'https://revenue.uk.gov.in/',
    townPlanningPortalUrl: 'https://mddaonline.in/',
    cadastralNomenclature: {
      parcelTerm: 'Khasra No',
      subParcelTerm: 'Khata / Khatoni',
      villageTerm: 'Gram'
    },
    description: 'Mussoorie Dehradun Development Authority (MDDA) and Haridwar HRDA govern master planning across eco-sensitive Himalayan foothills.'
  },
  {
    code: 'HP',
    name: 'Himachal Pradesh',
    hindiName: 'हिमाचल प्रदेश',
    punjabiName: 'ਹਿਮਾਚਲ ਪ੍ਰਦੇਸ਼',
    type: 'State',
    capital: 'Shimla',
    center: [31.1048, 77.1734],
    zoom: 8,
    districts: [
      'Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu',
      'Lahaul and Spiti', 'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una'
    ],
    primaryAuthorities: ['HIMUDA', 'SDA_SHM', 'TCP_HP'],
    revenueUnit: 'Bigha',
    revenuePortalName: 'Himbhoomi (Land Records HP)',
    revenuePortalUrl: 'https://lpr.hp.nic.in/',
    bhuNakshaPortalUrl: 'https://bhunakshahp.nic.in/',
    townPlanningPortalUrl: 'https://tcp.hp.gov.in/',
    cadastralNomenclature: {
      parcelTerm: 'Khasra No',
      subParcelTerm: 'Khatauni / Khewat',
      villageTerm: 'Mauza / Mohal'
    },
    description: 'Himachal Pradesh Housing and Urban Development Authority (HIMUDA) and Town & Country Planning HP manage Shimla Master Plan 2041 and hill zoning.'
  },
  {
    code: 'JK',
    name: 'Jammu and Kashmir',
    hindiName: 'जम्मू और कश्मीर',
    punjabiName: 'ਜੰਮੂ ਅਤੇ ਕਸ਼ਮੀਰ',
    type: 'UT',
    capital: 'Srinagar / Jammu',
    center: [33.7782, 76.5762],
    zoom: 7,
    districts: [
      'Anantnag', 'Bandipora', 'Baramulla', 'Budgam', 'Doda', 'Ganderbal',
      'Jammu', 'Kathua', 'Kishtwar', 'Kulgam', 'Kupwara', 'Poonch',
      'Pulwama', 'Rajouri', 'Ramban', 'Reasi', 'Samba', 'Shopian', 'Srinagar', 'Udhampur'
    ],
    primaryAuthorities: ['JDA_JAM', 'SDA_SXR', 'T&CP_JK'],
    revenueUnit: 'Kanal / Marla',
    revenuePortalName: 'Aapki Zameen Aapki Nigrani (Land Records J&K)',
    revenuePortalUrl: 'https://landrecords.jk.gov.in/',
    bhuNakshaPortalUrl: 'https://jkrevenue.nic.in/',
    townPlanningPortalUrl: 'https://jamsda.jk.gov.in/',
    cadastralNomenclature: {
      parcelTerm: 'Khasra No',
      subParcelTerm: 'Khewat / Khatoni',
      villageTerm: 'Deh / Mauza'
    },
    description: 'Jammu Development Authority (JDA) and Srinagar Development Authority (SDA Master Plan 2035) guide spatial urban expansion.'
  },
  {
    code: 'CG',
    name: 'Chhattisgarh',
    hindiName: 'छत्तीसगढ़',
    punjabiName: 'ਛੱਤੀਸਗੜ੍ਹ',
    type: 'State',
    capital: 'Raipur',
    center: [21.2787, 81.8661],
    zoom: 7,
    districts: [
      'Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur', 'Bilaspur',
      'Dantewada', 'Dhamtari', 'Durg', 'Gariaband', 'Gaurela-Pendra-Marwahi', 'Janjgir-Champa',
      'Jashpur', 'Kabirdham', 'Kanker', 'Khairagarh-Chhuikhadan-Gandai', 'Kondagaon',
      'Korba', 'Koriya', 'Mahasamund', 'Manendragarh-Chirmiri-Bharatpur', 'Mohla-Manpur-Ambagarh Chowki',
      'Mungeli', 'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Sarangarh-Bilaigarh',
      'Sakti', 'Sukma', 'Surajpur', 'Surguja'
    ],
    primaryAuthorities: ['NRDA_NRAIPUR', 'RDA_RAIPUR', 'T&CP_CG'],
    revenueUnit: 'Bigha',
    revenuePortalName: 'Bhuiyan Chhattisgarh (Khasra & Khatauni)',
    revenuePortalUrl: 'https://bhuiyan.cg.nic.in/',
    bhuNakshaPortalUrl: 'https://bhunaksha.cg.nic.in/',
    townPlanningPortalUrl: 'https://navaraipuratalnagar.com/',
    cadastralNomenclature: {
      parcelTerm: 'Khasra No',
      subParcelTerm: 'Khata No',
      villageTerm: 'Gram'
    },
    description: 'Nava Raipur Atal Nagar Development Authority (NRDA) manages India\'s first greenfield planned smart capital city master plan.'
  },
  {
    code: 'JH',
    name: 'Jharkhand',
    hindiName: 'झारखंड',
    punjabiName: 'ਝਾਰਖੰਡ',
    type: 'State',
    capital: 'Ranchi',
    center: [23.6102, 85.2799],
    zoom: 7,
    districts: [
      'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum (Jamshedpur)',
      'Garhwa', 'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara', 'Khunti',
      'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Palamu', 'Ramgarh', 'Ranchi',
      'Sahebganj', 'Seraikela Kharsawan', 'Simdega', 'West Singhbhum'
    ],
    primaryAuthorities: ['RRDA_RNC', 'UD&HD_JH'],
    revenueUnit: 'Bigha',
    revenuePortalName: 'Jharbhoomi (Jharkhand Land Record ROR)',
    revenuePortalUrl: 'https://jharbhoomi.jharkhand.gov.in/',
    bhuNakshaPortalUrl: 'https://jharbhunaksha.jharkhand.gov.in/',
    townPlanningPortalUrl: 'https://udhd.jharkhand.gov.in/',
    cadastralNomenclature: {
      parcelTerm: 'Plot / Khesra No',
      subParcelTerm: 'Khata No',
      villageTerm: 'Mauza / Thana'
    },
    description: 'Ranchi Regional Development Authority (RRDA) and Urban Development & Housing Department govern master plan zoning and industrial corridor maps.'
  },
  {
    code: 'GA',
    name: 'Goa',
    hindiName: 'गोवा',
    punjabiName: 'ਗੋਆ',
    type: 'State',
    capital: 'Panaji',
    center: [15.2993, 74.1240],
    zoom: 9,
    districts: ['North Goa', 'South Goa'],
    primaryAuthorities: ['TCP_GOA', 'PDA_NG', 'PDA_SG'],
    revenueUnit: 'Sq. Meters',
    revenuePortalName: 'Directorate of Settlement & Land Records Goa (Form I & XIV)',
    revenuePortalUrl: 'https://dslr.goa.gov.in/',
    bhuNakshaPortalUrl: 'https://dslr.goa.gov.in/',
    townPlanningPortalUrl: 'https://tcp.goa.gov.in/',
    cadastralNomenclature: {
      parcelTerm: 'Survey No / Chalta No',
      subParcelTerm: 'Sub-division No / P.T. Sheet',
      villageTerm: 'Village / Comunidade'
    },
    description: 'Town and Country Planning Department Goa (Regional Plan Goa 2021) and Planning & Development Authorities (PDAs) enforce coastal zone regulations.'
  },
  {
    code: 'AS',
    name: 'Assam',
    hindiName: 'असम',
    punjabiName: 'ਅਸਾਮ',
    type: 'State',
    capital: 'Dispur / Guwahati',
    center: [26.2006, 92.9376],
    zoom: 7,
    districts: [
      'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo', 'Chirang',
      'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao', 'Goalpara', 'Golaghat',
      'Hailakandi', 'Hojai', 'Jorhat', 'Kamrup', 'Kamrup Metropolitan (Guwahati)', 'Karbi Anglong',
      'Karimganj', 'Kokrajhar', 'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari',
      'Sivasagar', 'Sonitpur', 'South Salmara-Mankachar', 'Tinsukia', 'Udalguri', 'West Karbi Anglong'
    ],
    primaryAuthorities: ['GMDA_GHY', 'TCP_ASM'],
    revenueUnit: 'Bigha',
    revenuePortalName: 'Dharitree (Integrated Land Records Management Assam)',
    revenuePortalUrl: 'https://revenueassam.nic.in/ILRMS/',
    bhuNakshaPortalUrl: 'https://landrecords.assam.gov.in/',
    townPlanningPortalUrl: 'https://gmda.assam.gov.in/',
    cadastralNomenclature: {
      parcelTerm: 'Dag No',
      subParcelTerm: 'Patta No',
      villageTerm: 'Gaon / Mouza'
    },
    description: 'Guwahati Metropolitan Development Authority (GMDA Master Plan 2025) and Directorate of Town & Country Planning Assam guide regional growth.'
  },
  {
    code: 'TR',
    name: 'Tripura',
    hindiName: 'त्रिपुरा',
    punjabiName: 'ਤ੍ਰਿਪੁਰਾ',
    type: 'State',
    capital: 'Agartala',
    center: [23.9408, 91.9882],
    zoom: 8,
    districts: ['Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala', 'South Tripura', 'Unakoti', 'West Tripura'],
    primaryAuthorities: ['TCP_TRP', 'AMC_AGT'],
    revenueUnit: 'Sq. Meters',
    revenuePortalName: 'Jami Tripura (e-Land Records)',
    revenuePortalUrl: 'https://jami.tripura.gov.in/',
    bhuNakshaPortalUrl: 'https://jami.tripura.gov.in/',
    townPlanningPortalUrl: 'https://urban.tripura.gov.in/',
    cadastralNomenclature: {
      parcelTerm: 'Plot / Dag No',
      subParcelTerm: 'Khatian No',
      villageTerm: 'Mouza'
    },
    description: 'Urban Development Department Tripura & Agartala Smart City manage Agartala Master Plan 2031.'
  },
  {
    code: 'ML',
    name: 'Meghalaya',
    hindiName: 'मेघालय',
    punjabiName: 'ਮੇਘਾਲਿਆ',
    type: 'State',
    capital: 'Shillong',
    center: [25.4670, 91.3662],
    zoom: 8,
    districts: ['East Garo Hills', 'East Jaintia Hills', 'East Khasi Hills', 'Eastern West Khasi Hills', 'North Garo Hills', 'Ri Bhoi', 'South Garo Hills', 'South West Garo Hills', 'South West Khasi Hills', 'West Garo Hills', 'West Jaintia Hills', 'West Khasi Hills'],
    primaryAuthorities: ['MUDA_SHL', 'TCP_MEG'],
    revenueUnit: 'Sq. Feet',
    revenuePortalName: 'Meghalaya Land Records Management',
    revenuePortalUrl: 'https://megrevenue.gov.in/',
    bhuNakshaPortalUrl: 'https://megrevenue.gov.in/',
    townPlanningPortalUrl: 'https://muda.gov.in/',
    cadastralNomenclature: {
      parcelTerm: 'Holding / Plot No',
      subParcelTerm: 'Clan / Syiem land',
      villageTerm: 'Shnong / Village'
    },
    description: 'Meghalaya Urban Development Authority (MUDA) guides Greater Shillong Master Plan.'
  },
  {
    code: 'PY',
    name: 'Puducherry',
    hindiName: 'पुदुच्चेरी',
    punjabiName: 'ਪੁਡੂਚੇਰੀ',
    type: 'UT',
    capital: 'Puducherry',
    center: [11.9416, 79.8083],
    zoom: 11,
    districts: ['Karaikal', 'Mahe', 'Puducherry', 'Yanam'],
    primaryAuthorities: ['PPA_PDY', 'TCP_PDY'],
    revenueUnit: 'Sq. Feet',
    revenuePortalName: 'Nilamagal Puducherry Land Records',
    revenuePortalUrl: 'https://nilamagal.py.gov.in/',
    bhuNakshaPortalUrl: 'https://nilamagal.py.gov.in/',
    townPlanningPortalUrl: 'https://tcpd.py.gov.in/',
    cadastralNomenclature: {
      parcelTerm: 'Cadastre / RS No',
      subParcelTerm: 'Sub-division',
      villageTerm: 'Commune / Revenue Village'
    },
    description: 'Puducherry Planning Authority (PPA Comprehensive Development Plan 2036) manages heritage zoning and coastal layouts.'
  },
  {
    code: 'LA',
    name: 'Ladakh',
    hindiName: 'लद्दाख',
    punjabiName: 'ਲਦਾਖ',
    type: 'UT',
    capital: 'Leh',
    center: [34.1526, 77.5771],
    zoom: 7,
    districts: ['Leh', 'Kargil'],
    primaryAuthorities: ['LDA_LEH', 'KDA_KRG'],
    revenueUnit: 'Kanal / Marla',
    revenuePortalName: 'Ladakh Land Records Information',
    revenuePortalUrl: 'https://ladakh.nic.in/',
    bhuNakshaPortalUrl: 'https://ladakh.nic.in/',
    townPlanningPortalUrl: 'https://leh.nic.in/',
    cadastralNomenclature: {
      parcelTerm: 'Khasra No',
      subParcelTerm: 'Khatauni',
      villageTerm: 'Yul / Village'
    },
    description: 'Leh and Kargil Development Authorities govern sustainable master planning in high-altitude cold desert regions.'
  }
];
