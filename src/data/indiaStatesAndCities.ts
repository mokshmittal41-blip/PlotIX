export interface IndianState {
  code: string;
  name: string;
  type: 'state' | 'ut';
  zone: 'North' | 'South' | 'West' | 'East' | 'Central' | 'North-East';
  popularCities: string[];
  cities: string[];
}

export const INDIAN_STATES: IndianState[] = [
  // ─── North India ─────────────────────────────────────────────────────────
  {
    code: 'PB',
    name: 'Punjab',
    type: 'state',
    zone: 'North',
    popularCities: [
      'Mohali', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda',
      'Sangrur', 'Sunam', 'Hoshiarpur', 'Pathankot', 'Moga', 'Batala',
      'Abohar', 'Malerkotla', 'Khanna', 'Phagwara', 'Muktsar', 'Barnala',
      'Rajpura', 'Firozpur', 'Kapurthala', 'Faridkot', 'Zirakpur', 'Mansa'
    ],
    cities: [
      // Major Districts & Tehsils / Towns
      'Sangrur', 'Sunam', 'Dhuri', 'Lehragaga', 'Moonak', 'Bhawanigarh', 'Dirba', 'Longowal', 'Ahmedgarh',
      'Mohali', 'Kharar', 'Zirakpur', 'Dera Bassi', 'Kurali', 'Banur',
      'Ludhiana', 'Khanna', 'Jagraon', 'Samrala', 'Raikot', 'Doraha', 'Mullanpur Dakha', 'Payal', 'Sahnewal',
      'Amritsar', 'Majitha', 'Ajnala', 'Baba Bakala', 'Attari', 'Raja Sansi',
      'Jalandhar', 'Phagwara', 'Nakodar', 'Phillaur', 'Shahkot', 'Kartarpur', 'Goraya', 'Adampur',
      'Patiala', 'Rajpura', 'Nabha', 'Samana', 'Patran', 'Ghanaur', 'Sanaur',
      'Bathinda', 'Rampura Phul', 'Talwandi Sabo', 'Maur Mandi', 'Bhucho Mandi', 'Gonate',
      'Hoshiarpur', 'Dasuya', 'Mukerian', 'Garhshankar', 'Tanda Urmar', 'Mahilpur',
      'Pathankot', 'Sujanpur', 'Dinanagar', 'Narot Jaimal Singh',
      'Gurdaspur', 'Batala', 'Dera Baba Nanak', 'Qadian', 'Fatehgarh Churian', 'Kalanaur',
      'Moga', 'Bagha Purana', 'Nihal Singh Wala', 'Dharamkot', 'Badhni Kalan',
      'Sri Muktsar Sahib', 'Malout', 'Gidderbaha', 'Bariwala',
      'Barnala', 'Tapa', 'Mehal Kalan', 'Bhadaur', 'Dhanaula',
      'Mansa', 'Budhlada', 'Sardulgarh', 'Bareta', 'Bhikhi',
      'Faridkot', 'Kotkapura', 'Jaitu', 'Sadiq',
      'Firozpur', 'Zira', 'Guru Har Sahai', 'Makhu', 'Mamdot',
      'Fazilka', 'Abohar', 'Jalalabad', 'Khuian Sarwar',
      'Kapurthala', 'Sultanpur Lodhi', 'Bholath', 'Dhilwan',
      'Shaheed Bhagat Singh Nagar', 'Nawanshahr', 'Balachaur', 'Banga', 'Rahon',
      'Rupnagar', 'Ropar', 'Anandpur Sahib', 'Nangal', 'Chamkaur Sahib', 'Morinda',
      'Fatehgarh Sahib', 'Sirhind', 'Mandi Gobindgarh', 'Amloh', 'Khamanon', 'Bassia Pathana',
      'Tarn Taran', 'Patti', 'Khadoor Sahib', 'Bhikhiwind', 'Chabal Kalan', 'Goindwal Sahib',
      'Malerkotla', 'Amargarh'
    ]
  },
  {
    code: 'HR',
    name: 'Haryana',
    type: 'state',
    zone: 'North',
    popularCities: [
      'Gurugram', 'Rewari', 'Faridabad', 'Panchkula', 'Dharuhera', 'Bawal',
      'Panipat', 'Karnal', 'Ambala', 'Hisar', 'Sonipat', 'Rohtak',
      'Yamunanagar', 'Bahadurgarh', 'Sirsa', 'Kurukshetra', 'Bhiwani', 'Jind'
    ],
    cities: [
      'Rewari', 'Bawal', 'Dharuhera', 'Kosli', 'Khol', 'Manethi', 'Jatusana', 'Dahina', 'Kund',
      'Gurugram', 'Gurgaon', 'Sohna', 'Manesar', 'Pataudi', 'Farrukhnagar', 'Badshahpur', 'Wazirabad',
      'Faridabad', 'Ballabgarh', 'Old Faridabad', 'NIT Faridabad', 'Greater Faridabad',
      'Panchkula', 'Kalka', 'Pinjore', 'Raipur Rani', 'Barwala HR',
      'Ambala', 'Ambala Cantt', 'Ambala City', 'Naraingarh', 'Barara', 'Mullana',
      'Yamunanagar', 'Jagadhri', 'Chhachhrauli', 'Radaur', 'Bilaspur HR', 'Sadhaura',
      'Kurukshetra', 'Thanesar', 'Pehowa', 'Shahbad', 'Ladwa', 'Ismailabad',
      'Kaithal', 'Pundri', 'Guhla', 'Cheeka', 'Kalayat', 'Siwan HR',
      'Karnal', 'Gharaunda', 'Assandh', 'Nilokheri', 'Indri', 'Taraori', 'Nissing',
      'Panipat', 'Samalkha', 'Israna', 'Bapoli', 'Madlauda',
      'Sonipat', 'Ganaur', 'Gohana', 'Kharkhoda', 'Rai', 'Murthal', 'Kundli',
      'Rohtak', 'Sampla', 'Meham', 'Kalanaur', 'Lakhan Majra',
      'Jhajjar', 'Bahadurgarh', 'Beri', 'Badli', 'Salhawas',
      'Palwal', 'Hodal', 'Hathin', 'Hassanpur',
      'Nuh', 'Tauru', 'Ferozepur Jhirka', 'Punhana', 'Nagina',
      'Hisar', 'Hansi', 'Barwala', 'Narnaund', 'Uklana', 'Agroha', 'Adampur HR',
      'Sirsa', 'Ellenabad', 'Rania', 'Dabwali', 'Kalanwali', 'Chopta',
      'Fatehabad', 'Tohana', 'Ratia', 'Bhuna', 'Bhattukalan',
      'Jind', 'Narwana', 'Safidon', 'Uchana', 'Julana', 'Alewa',
      'Bhiwani', 'Tosham', 'Bawani Khera', 'Siwani', 'Loharu',
      'Charkhi Dadri', 'Badhra', 'Bond Kalan',
      'Mahendragarh', 'Narnaul', 'Kanina', 'Ateli', 'Nangal Chaudhry', 'Satnali'
    ]
  },
  {
    code: 'DL',
    name: 'Delhi NCR',
    type: 'ut',
    zone: 'North',
    popularCities: ['Delhi', 'New Delhi', 'South Delhi', 'Dwarka', 'Rohini', 'Noida', 'Greater Noida', 'Ghaziabad', 'Gurgaon', 'Faridabad'],
    cities: [
      'Delhi', 'New Delhi', 'South Delhi', 'North Delhi', 'East Delhi', 'West Delhi', 'Central Delhi',
      'South West Delhi', 'North West Delhi', 'North East Delhi', 'Dwarka', 'Rohini',
      'Connaught Place', 'Saket', 'Vasant Kunj', 'Janakpuri', 'Laxmi Nagar', 'Pitampura',
      'Karol Bagh', 'Hauz Khas', 'Chanakyapuri', 'Mayur Vihar', 'Paschim Vihar', 'Rajouri Garden',
      'Noida', 'Greater Noida', 'Noida Extension', 'Ghaziabad', 'Indirapuram', 'Vaishali', 'Crossings Republik'
    ]
  },
  {
    code: 'CH',
    name: 'Chandigarh',
    type: 'ut',
    zone: 'North',
    popularCities: ['Chandigarh', 'New Chandigarh', 'Manimajra', 'IT Park'],
    cities: [
      'Chandigarh', 'New Chandigarh', 'Sector 1-20', 'Sector 21-40', 'Sector 41-60',
      'Manimajra', 'IT Park', 'Industrial Area Phase 1', 'Industrial Area Phase 2', 'Sarangpur'
    ]
  },
  {
    code: 'UP',
    name: 'Uttar Pradesh',
    type: 'state',
    zone: 'North',
    popularCities: [
      'Noida', 'Greater Noida', 'Ghaziabad', 'Lucknow', 'Kanpur', 'Varanasi',
      'Agra', 'Prayagraj', 'Meerut', 'Ayodhya', 'Bareilly', 'Aligarh', 'Gorakhpur', 'Mathura'
    ],
    cities: [
      'Noida', 'Greater Noida', 'Ghaziabad', 'Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj',
      'Meerut', 'Ayodhya', 'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur', 'Firozabad',
      'Jhansi', 'Muzaffarnagar', 'Mathura', 'Budaun', 'Rampur', 'Shahjahanpur', 'Farrukhabad',
      'Maunath Bhanjan', 'Hapur', 'Etawah', 'Mirzapur', 'Bulandshahr', 'Sambhal', 'Amroha',
      'Hardoi', 'Fatehpur', 'Raebareli', 'Orai', 'Sitapur', 'Bahraich', 'Modinagar', 'Unnao',
      'Jaunpur', 'Lakhimpur', 'Hathras', 'Banda', 'Pilibhit', 'Barabanki', 'Khurja', 'Gonda',
      'Mainpuri', 'Lalitpur', 'Etah', 'Deoria', 'Ghazipur', 'Sultanpur', 'Azamgarh', 'Bijnor',
      'Sahaswan', 'Basti', 'Chandausi', 'Akbarpur', 'Ballia', 'Tanda', 'Greater Noida West', 'Vrindavan'
    ]
  },
  {
    code: 'RJ',
    name: 'Rajasthan',
    type: 'state',
    zone: 'North',
    popularCities: [
      'Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner',
      'Bhiwadi', 'Neemrana', 'Alwar', 'Bhilwara', 'Sikar', 'Sri Ganganagar'
    ],
    cities: [
      'Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner', 'Bhiwadi', 'Neemrana', 'Alwar',
      'Bhilwara', 'Sikar', 'Pali', 'Sri Ganganagar', 'Bharatpur', 'Beawar', 'Hanumangarh', 'Tonk',
      'Kishangarh', 'Churu', 'Dhaulpur', 'Sawai Madhopur', 'Jhunjhunu', 'Barmer', 'Chittorgarh',
      'Nagaur', 'Makrana', 'Sujangarh', 'Sardarshahar', 'Ladnu', 'Deshnoke', 'Pushkar', 'Mount Abu',
      'Jaisalmer', 'Banswara', 'Dungarpur', 'Pratapgarh RJ', 'Rajsamand', 'Jalore', 'Sirohi', 'Dausa'
    ]
  },
  {
    code: 'UK',
    name: 'Uttarakhand',
    type: 'state',
    zone: 'North',
    popularCities: ['Dehradun', 'Haridwar', 'Rishikesh', 'Haldwani', 'Roorkee', 'Nainital', 'Mussoorie', 'Rudrapur', 'Kashipur'],
    cities: [
      'Dehradun', 'Haridwar', 'Rishikesh', 'Haldwani', 'Roorkee', 'Nainital', 'Mussoorie',
      'Rudrapur', 'Kashipur', 'Pithoragarh', 'Kotdwar', 'Pantnagar', 'Vikasnagar', 'Ramnagar',
      'Kichha', 'Manglaur', 'Jaspur', 'Sitarganj', 'Almora', 'Champawat', 'Bageshwar', 'Chamoli',
      'Pauri Garhwal', 'Tehri Garhwal', 'Uttarkashi', 'Lansdowne', 'Ranikhet'
    ]
  },
  {
    code: 'HP',
    name: 'Himachal Pradesh',
    type: 'state',
    zone: 'North',
    popularCities: ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Kullu', 'Manali', 'Baddi', 'Palampur', 'Una', 'Bilaspur HP'],
    cities: [
      'Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Kullu', 'Manali', 'Baddi', 'Palampur',
      'Bilaspur HP', 'Hamirpur HP', 'Nahan', 'Una', 'Chamba', 'Paonta Sahib', 'Sundarnagar',
      'Kangra', 'Nurpur', 'Parwanoo', 'Nalagarh', 'Kasauli', 'Dalhousie', 'Keylong'
    ]
  },
  {
    code: 'JK',
    name: 'Jammu & Kashmir',
    type: 'ut',
    zone: 'North',
    popularCities: ['Srinagar', 'Jammu', 'Anantnag', 'Udhampur', 'Baramulla', 'Kathua', 'Sopore'],
    cities: [
      'Srinagar', 'Jammu', 'Anantnag', 'Udhampur', 'Baramulla', 'Kathua', 'Sopore',
      'Rajouri', 'Poonch', 'Kupwara', 'Pulwama', 'Shopian', 'Budgam', 'Ganderbal', 'Bandipora',
      'Reasi', 'Ramban', 'Kishtwar', 'Doda', 'Samba'
    ]
  },
  {
    code: 'LA',
    name: 'Ladakh',
    type: 'ut',
    zone: 'North',
    popularCities: ['Leh', 'Kargil', 'Nubra Valley'],
    cities: ['Leh', 'Kargil', 'Nubra Valley', 'Zanskar', 'Diskit', 'Padum']
  },

  // ─── West India ──────────────────────────────────────────────────────────
  {
    code: 'MH',
    name: 'Maharashtra',
    type: 'state',
    zone: 'West',
    popularCities: [
      'Mumbai', 'Pune', 'Nagpur', 'Thane', 'Navi Mumbai', 'Nashik',
      'Aurangabad', 'Solapur', 'Kolhapur', 'Kalyan-Dombivli', 'Vasai-Virar', 'Panvel'
    ],
    cities: [
      'Mumbai', 'Pune', 'Nagpur', 'Thane', 'Navi Mumbai', 'Nashik', 'Aurangabad', 'Solapur',
      'Kolhapur', 'Kalyan-Dombivli', 'Vasai-Virar', 'Amravati', 'Nanded', 'Sangli', 'Malegaon',
      'Akola', 'Latur', 'Dhule', 'Ahmednagar', 'Chandrapur', 'Parbhani', 'Panvel', 'Ichalkaranji',
      'Jalna', 'Ambarnath', 'Bhusawal', 'Badlapur', 'Beed', 'Gondia', 'Satara', 'Barshi', 'Yavatmal',
      'Achalpur', 'Osmanabad', 'Nandurbar', 'Wardha', 'Udgir', 'Hinganghat', 'Pimpri-Chinchwad',
      'Mira-Bhayandar', 'Ulhasnagar', 'Bhiwandi', 'Alibag', 'Ratnagiri', 'Sindhudurg', 'Lonavala', 'Mahabaleshwar'
    ]
  },
  {
    code: 'GJ',
    name: 'Gujarat',
    type: 'state',
    zone: 'West',
    popularCities: [
      'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar',
      'Bhavnagar', 'Jamnagar', 'Junagadh', 'Anand', 'Vapi', 'Navsari', 'Morbi'
    ],
    cities: [
      'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Bhavnagar', 'Jamnagar', 'Junagadh',
      'Anand', 'Navsari', 'Morbi', 'Nadiad', 'Surendranagar', 'Bharuch', 'Mehsana', 'Bhuj', 'Porbandar',
      'Valsad', 'Vapi', 'Gondal', 'Veraval', 'Godhra', 'Patan', 'Kalol', 'Dahod', 'Botad', 'Amreli',
      'Deesa', 'Jetpur', 'Palanpur', 'Anjar', 'Dhoraji', 'Keshod', 'Wadhwan', 'Ankleshwar', 'Savarkundla',
      'Kadi', 'Visnagar', 'Upleta', 'Una GJ', 'Sidhpur', 'Unjha', 'Gandhidham', 'Sanand', 'Dholera', 'Gift City'
    ]
  },
  {
    code: 'GA',
    name: 'Goa',
    type: 'state',
    zone: 'West',
    popularCities: ['Goa', 'Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Calangute', 'Candolim', 'Porvorim'],
    cities: [
      'Goa', 'Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Calangute', 'Candolim',
      'Bicholim', 'Curchorem', 'Cuncolim', 'Canacona', 'Porvorim', 'Anjuna', 'Baga', 'Colva', 'Benaulim', 'Siolim'
    ]
  },
  {
    code: 'DN',
    name: 'Dadra & Nagar Haveli and Daman & Diu',
    type: 'ut',
    zone: 'West',
    popularCities: ['Daman', 'Silvassa', 'Diu'],
    cities: ['Daman', 'Silvassa', 'Diu', 'Amli', 'Vapi Road', 'Dadra', 'Naroli']
  },

  // ─── South India ─────────────────────────────────────────────────────────
  {
    code: 'KA',
    name: 'Karnataka',
    type: 'state',
    zone: 'South',
    popularCities: [
      'Bengaluru', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru', 'Belagavi',
      'Kalaburagi', 'Ballari', 'Davanagere', 'Shivamogga', 'Tumakuru', 'Udupi'
    ],
    cities: [
      'Bengaluru', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru', 'Belagavi', 'Kalaburagi', 'Ballari',
      'Davanagere', 'Shivamogga', 'Tumakuru', 'Bidar', 'Hosapete', 'Gadag', 'Hassan', 'Bhadravati',
      'Vijayapura', 'Raichur', 'Robertsonpet', 'Chitradurga', 'Kolar', 'Mandya', 'Chikkamagaluru',
      'Udupi', 'Bagalkote', 'Ranebennuru', 'Karwar', 'Chikkaballapur', 'Ramanagara', 'Yadgir', 'Koppal', 'Madikeri'
    ]
  },
  {
    code: 'TN',
    name: 'Tamil Nadu',
    type: 'state',
    zone: 'South',
    popularCities: [
      'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
      'Tiruppur', 'Erode', 'Vellore', 'Thoothukudi', 'Hosur', 'Kanchipuram'
    ],
    cities: [
      'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tiruppur', 'Erode', 'Vellore',
      'Thoothukudi', 'Dindigul', 'Thanjavur', 'Ranipet', 'Sivakasi', 'Karur', 'Udhagamandalam', 'Hosur',
      'Nagercoil', 'Kanchipuram', 'Kumarapalayam', 'Karaikkudi', 'Neyveli', 'Cuddalore', 'Kumbakonam',
      'Tiruvannamalai', 'Pollachi', 'Rajapalayam', 'Gudiyatham', 'Pudukkottai', 'Vaniyambadi', 'Ambur',
      'Nagapattinam', 'Tirunelveli', 'Chengalpattu', 'Tambaram', 'Avadi', 'Kanyakumari'
    ]
  },
  {
    code: 'TS',
    name: 'Telangana',
    type: 'state',
    zone: 'South',
    popularCities: ['Hyderabad', 'Secunderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Ramagundam', 'Mahbubnagar'],
    cities: [
      'Hyderabad', 'Secunderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Ramagundam',
      'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet', 'Miryalaguda', 'Siddipet', 'Jagtial',
      'Mancherial', 'Kothagudem', 'Nirmal', 'Kamareddy', 'Sangareddy', 'Medak', 'Vikarabad', 'Gadwal', 'Wanaparthy'
    ]
  },
  {
    code: 'AP',
    name: 'Andhra Pradesh',
    type: 'state',
    zone: 'South',
    popularCities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati', 'Rajahmundry', 'Kakinada', 'Kadapa'],
    cities: [
      'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati', 'Rajahmundry',
      'Kakinada', 'Kadapa', 'Anantapur', 'Vizianagaram', 'Eluru', 'Ongole', 'Nandyal', 'Machilipatnam',
      'Adoni', 'Tenali', 'Proddatur', 'Chittoor', 'Hindupur', 'Bhimavaram', 'Madanapalle', 'Guntakal',
      'Srikakulam', 'Dharmavaram', 'Gudivada', 'Narasaraopet', 'Tadipatri', 'Mangalagiri', 'Amaravati'
    ]
  },
  {
    code: 'KL',
    name: 'Kerala',
    type: 'state',
    zone: 'South',
    popularCities: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Alappuzha', 'Kannur', 'Kottayam'],
    cities: [
      'Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Alappuzha',
      'Kannur', 'Kottayam', 'Malappuram', 'Thalassery', 'Ponnani', 'Kasaragod', 'Wayanad', 'Idukki',
      'Perinthalmanna', 'Tirur', 'Koyilandy', 'Neyyattinkara', 'Changanassery', 'Kayamkulam', 'Manjeri', 'Muvattupuzha'
    ]
  },
  {
    code: 'PY',
    name: 'Puducherry',
    type: 'ut',
    zone: 'South',
    popularCities: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
    cities: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam', 'Oulgaret', 'Auroville', 'Villianur', 'Ariyankuppam']
  },
  {
    code: 'AN',
    name: 'Andaman & Nicobar Islands',
    type: 'ut',
    zone: 'South',
    popularCities: ['Port Blair', 'Havelock Island'],
    cities: ['Port Blair', 'Havelock Island', 'Neil Island', 'Garacharma', 'Diglipur', 'Mayabunder']
  },
  {
    code: 'LD',
    name: 'Lakshadweep',
    type: 'ut',
    zone: 'South',
    popularCities: ['Kavaratti', 'Agatti', 'Andrott'],
    cities: ['Kavaratti', 'Agatti', 'Andrott', 'Minicoy', 'Amini', 'Kalpeni']
  },

  // ─── East & Central India ────────────────────────────────────────────────
  {
    code: 'WB',
    name: 'West Bengal',
    type: 'state',
    zone: 'East',
    popularCities: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Kharagpur', 'Bardhaman', 'New Town', 'Rajarhat', 'Darjeeling'],
    cities: [
      'Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Kharagpur', 'Bardhaman', 'New Town',
      'Rajarhat', 'Malda', 'Baharampur', 'Habra', 'Kalyani', 'Shantipur', 'Dankuni', 'Haldia',
      'Darjeeling', 'Alipurduar', 'Cooch Behar', 'Jalpaiguri', 'Balurghat', 'Raiganj', 'Bankura',
      'Purulia', 'Midnapore', 'Tamluk', 'Bishnupur WB', 'Krishnanagar', 'Ranaghat', 'Barasat'
    ]
  },
  {
    code: 'BR',
    name: 'Bihar',
    type: 'state',
    zone: 'East',
    popularCities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 'Arrah', 'Begusarai', 'Katihar'],
    cities: [
      'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 'Arrah',
      'Begusarai', 'Katihar', 'Munger', 'Chhapra', 'Danapur', 'Saharsa', 'Sasaram', 'Hajipur',
      'Dehri', 'Siwan', 'Motihari', 'Nawada', 'Buxar', 'Kishanganj', 'Sitamarhi', 'Bettiah',
      'Jamui', 'Jehanabad', 'Aurangabad BR', 'Lakhisarai', 'Samastipur', 'Madhubani', 'Supaul', 'Araria'
    ]
  },
  {
    code: 'OD',
    name: 'Odisha',
    type: 'state',
    zone: 'East',
    popularCities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri', 'Sambalpur', 'Berhampur', 'Balasore', 'Jharsuguda'],
    cities: [
      'Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri', 'Sambalpur', 'Berhampur', 'Balasore', 'Bhadrak',
      'Baripada', 'Jharsuguda', 'Jeypore', 'Angul', 'Bargarh', 'Dhenkanal', 'Kendrapara', 'Rayagada',
      'Bolangir', 'Koraput', 'Jagatsinghpur', 'Jajpur', 'Paradip', 'Keonjhar', 'Nabarangpur'
    ]
  },
  {
    code: 'JH',
    name: 'Jharkhand',
    type: 'state',
    zone: 'East',
    popularCities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro Steel City', 'Deoghar', 'Hazaribagh', 'Giridih'],
    cities: [
      'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro Steel City', 'Deoghar', 'Hazaribagh', 'Giridih',
      'Ramgarh', 'Medininagar', 'Chirkunda', 'Phusro', 'Dumka', 'Chaibasa', 'Gumia', 'Jhumri Telaiya',
      'Sahibganj', 'Pakur', 'Godda', 'Simdega', 'Khunti', 'Lohardaga', 'Chatra'
    ]
  },
  {
    code: 'MP',
    name: 'Madhya Pradesh',
    type: 'state',
    zone: 'Central',
    popularCities: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa'],
    cities: [
      'Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam',
      'Rewa', 'Murwara', 'Singrauli', 'Burhanpur', 'Khandwa', 'Morena', 'Bhind', 'Chhindwara',
      'Guna', 'Shivpuri', 'Vidisha', 'Damoh', 'Chhatarpur', 'Mandsaur', 'Khargone', 'Neemuch',
      'Pithampur', 'Narmadapuram', 'Itarsi', 'Sehore', 'Betul', 'Seoni', 'Datia', 'Nagda', 'Dhar'
    ]
  },
  {
    code: 'CG',
    name: 'Chhattisgarh',
    type: 'state',
    zone: 'Central',
    popularCities: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon', 'Jagdalpur', 'Raigarh', 'Ambikapur'],
    cities: [
      'Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon', 'Jagdalpur', 'Raigarh',
      'Ambikapur', 'Mahasamund', 'Dhamtari', 'Kanker', 'Kawardha', 'Bemetara', 'Balod', 'Janjgir', 'Champa'
    ]
  },

  // ─── North-East India ────────────────────────────────────────────────────
  {
    code: 'AS',
    name: 'Assam',
    type: 'state',
    zone: 'North-East',
    popularCities: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Bongaigaon'],
    cities: [
      'Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Bongaigaon',
      'Dhubri', 'Diphu', 'North Lakhimpur', 'Karimganj', 'Sivasagar', 'Goalpara', 'Barpeta', 'Haflong',
      'Kokrajhar', 'Mangaldai', 'Morigaon', 'Nalbari', 'Hojai', 'Golaghat', 'Dhemaji', 'Hailakandi'
    ]
  },
  {
    code: 'TR',
    name: 'Tripura',
    type: 'state',
    zone: 'North-East',
    popularCities: ['Agartala', 'Dharmanagar', 'Udaipur TR', 'Kailashahar', 'Belonia'],
    cities: ['Agartala', 'Dharmanagar', 'Udaipur TR', 'Kailashahar', 'Teliamura', 'Khowai', 'Belonia', 'Melaghar', 'Ambassa', 'Sabroom']
  },
  {
    code: 'ML',
    name: 'Meghalaya',
    type: 'state',
    zone: 'North-East',
    popularCities: ['Shillong', 'Tura', 'Jowai', 'Nongpoh'],
    cities: ['Shillong', 'Tura', 'Jowai', 'Nongpoh', 'Williamnagar', 'Baghmara', 'Resubelpara', 'Cherrapunji', 'Mairang']
  },
  {
    code: 'MN',
    name: 'Manipur',
    type: 'state',
    zone: 'North-East',
    popularCities: ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur'],
    cities: ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Kakching', 'Ukhrul', 'Senapati', 'Tamenglong', 'Chandel']
  },
  {
    code: 'NL',
    name: 'Nagaland',
    type: 'state',
    zone: 'North-East',
    popularCities: ['Dimapur', 'Kohima', 'Mokokchung', 'Tuensang'],
    cities: ['Dimapur', 'Kohima', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto', 'Mon', 'Phek', 'Chumukedima']
  },
  {
    code: 'MZ',
    name: 'Mizoram',
    type: 'state',
    zone: 'North-East',
    popularCities: ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip'],
    cities: ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib', 'Lawngtlai', 'Saitual', 'Mamit', 'Hnahthial']
  },
  {
    code: 'SK',
    name: 'Sikkim',
    type: 'state',
    zone: 'North-East',
    popularCities: ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan'],
    cities: ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan', 'Rangpo', 'Singtam', 'Jorethang', 'Ravangla', 'Pelling']
  },
  {
    code: 'AR',
    name: 'Arunachal Pradesh',
    type: 'state',
    zone: 'North-East',
    popularCities: ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang'],
    cities: ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro', 'Tezu', 'Bomdila', 'Aalo', 'Roing', 'Changlang']
  }
];

export const PAN_INDIA_ZONES = [
  'All India',
  'North',
  'South',
  'West',
  'East',
  'Central',
  'North-East'
] as const;

export type PanIndiaZone = typeof PAN_INDIA_ZONES[number];

// Comprehensive City GPS Coordinates Map
export const CITY_COORDINATES_MAP: Record<string, [number, number]> = {
  // Punjab
  'sangrur': [30.2458, 75.8421],
  'sunam': [30.1306, 75.8014],
  'dhuri': [30.3694, 75.8672],
  'lehragaga': [29.9328, 75.8167],
  'moonak': [29.8189, 75.8944],
  'bhawanigarh': [30.2742, 76.0428],
  'dirba': [30.0658, 75.9861],
  'longowal': [30.2014, 75.6881],
  'ahmedgarh': [30.6869, 75.8286],
  'mohali': [30.6799, 76.7221],
  'ludhiana': [30.9010, 75.8573],
  'amritsar': [31.6340, 74.8723],
  'jalandhar': [31.3260, 75.5762],
  'patiala': [30.3398, 76.3869],
  'bathinda': [30.2110, 74.9455],
  'hoshiarpur': [31.5273, 75.9149],
  'pathankot': [32.2684, 75.6481],
  'gurdaspur': [32.0419, 75.4053],
  'batala': [31.8186, 75.2028],
  'moga': [30.8165, 75.1717],
  'abohar': [30.1453, 74.1993],
  'malerkotla': [30.5250, 75.8900],
  'khanna': [30.7071, 76.2166],
  'phagwara': [31.2240, 75.7708],
  'muktsar': [30.4762, 74.5122],
  'sri muktsar sahib': [30.4762, 74.5122],
  'barnala': [30.3819, 75.5469],
  'mansa': [29.9871, 75.3940],
  'faridkot': [30.6769, 74.7583],
  'kotkapura': [30.5828, 74.8250],
  'firozpur': [30.9237, 74.6133],
  'fazilka': [30.4037, 74.0254],
  'rajpura': [30.4839, 76.5940],
  'zirakpur': [30.6425, 76.8173],
  'kharar': [30.7499, 76.6411],
  'dera bassi': [30.5840, 76.8440],
  'rupnagar': [30.9753, 76.5273],
  'ropar': [30.9753, 76.5273],
  'fatehgarh sahib': [30.6431, 76.3976],
  'tarn taran': [31.4520, 74.9270],
  'kapurthala': [31.3800, 75.3800],
  'nawanshahr': [31.1256, 76.1189],

  // Haryana
  'rewari': [28.1920, 76.6186],
  'bawal': [28.0837, 76.5847],
  'dharuhera': [28.2056, 76.7925],
  'gurugram': [28.4595, 77.0266],
  'gurgaon': [28.4595, 77.0266],
  'faridabad': [28.4089, 77.3178],
  'panchkula': [30.6865, 76.8526],
  'panipat': [29.3909, 76.9635],
  'karnal': [29.6857, 76.9905],
  'ambala': [30.3782, 76.7767],
  'rohtak': [28.8955, 76.6066],
  'sonipat': [28.9931, 77.0151],
  'hisar': [29.1492, 75.7217],
  'sirsa': [29.5349, 75.0290],
  'fatehabad': [29.5153, 75.4542],
  'tohana': [29.7042, 75.9011],
  'jind': [29.3160, 76.3150],
  'bhiwani': [28.7932, 76.1390],
  'charkhi dadri': [28.5921, 76.2653],
  'jhajjar': [28.6063, 76.6565],
  'bahadurgarh': [28.6924, 76.9240],
  'palwal': [28.1447, 77.3259],
  'nuh': [28.1100, 77.0000],
  'kurukshetra': [29.9695, 76.8783],
  'kaithal': [29.8015, 76.3996],
  'yamunanagar': [30.1290, 77.2674],
  'narnaul': [28.0444, 76.1089],
  'mahendragarh': [28.2819, 76.1517],

  // Delhi NCR & Chandigarh
  'delhi': [28.6139, 77.2090],
  'new delhi': [28.6139, 77.2090],
  'noida': [28.5355, 77.3910],
  'greater noida': [28.4744, 77.5040],
  'ghaziabad': [28.6692, 77.4538],
  'chandigarh': [30.7333, 76.7794],
  'new chandigarh': [30.7989, 76.7456],

  // UP & Rajasthan
  'lucknow': [26.8467, 80.9462],
  'kanpur': [26.4499, 80.3319],
  'varanasi': [25.3176, 82.9739],
  'agra': [27.1767, 78.0081],
  'prayagraj': [25.4358, 81.8463],
  'meerut': [28.9845, 77.7064],
  'ayodhya': [26.7922, 82.1998],
  'bareilly': [28.3670, 79.4304],
  'aligarh': [27.8974, 78.0880],
  'gorakhpur': [26.7606, 83.3732],
  'mathura': [27.4924, 77.6737],
  'jaipur': [26.9124, 75.7873],
  'jodhpur': [26.2389, 73.0243],
  'udaipur': [24.5854, 73.7125],
  'kota': [25.2138, 75.8648],
  'ajmer': [26.4499, 74.6399],
  'bikaner': [28.0229, 73.3119],
  'bhiwadi': [28.2104, 76.8606],
  'neemrana': [27.9888, 76.3883],
  'alwar': [27.5530, 76.6346],
  'sri ganganagar': [29.9038, 73.8772],

  // Uttarakhand & HP & J&K
  'dehradun': [30.3165, 78.0322],
  'haridwar': [29.9457, 78.1642],
  'rishikesh': [30.0869, 78.2676],
  'haldwani': [29.2183, 79.5130],
  'nainital': [29.3919, 79.4542],
  'roorkee': [29.8543, 77.8880],
  'shimla': [31.1048, 77.1734],
  'dharamshala': [32.2190, 76.3234],
  'solan': [30.9084, 77.0999],
  'mandi': [31.7087, 76.9320],
  'kullu': [31.9579, 77.1095],
  'manali': [32.2432, 77.1892],
  'baddi': [30.9578, 76.7914],
  'srinagar': [34.0837, 74.7973],
  'jammu': [32.7266, 74.8570],
  'anantnag': [33.7311, 75.1522],
  'leh': [34.1526, 77.5771],

  // West
  'mumbai': [19.0760, 72.8777],
  'pune': [18.5204, 73.8567],
  'nagpur': [21.1458, 79.0882],
  'thane': [19.2183, 72.9781],
  'navi mumbai': [19.0330, 73.0297],
  'nashik': [19.9975, 73.7898],
  'aurangabad': [19.8762, 75.3433],
  'solapur': [17.6599, 75.9064],
  'kolhapur': [16.7050, 74.2433],
  'ahmedabad': [23.0225, 72.5714],
  'surat': [21.1702, 72.8311],
  'vadodara': [22.3072, 73.1812],
  'rajkot': [22.3039, 70.8022],
  'gandhinagar': [23.2156, 72.6369],
  'bhavnagar': [21.7645, 72.1519],
  'jamnagar': [22.4707, 70.0577],
  'goa': [15.2993, 74.1240],
  'panaji': [15.4909, 73.8278],
  'margao': [15.2832, 73.9862],
  'mapusa': [15.5947, 73.8115],

  // South
  'bengaluru': [12.9716, 77.5946],
  'bangalore': [12.9716, 77.5946],
  'mysuru': [12.2958, 76.6394],
  'mangaluru': [12.9141, 74.8560],
  'hubballi-dharwad': [15.3647, 75.1240],
  'belagavi': [15.8497, 74.4977],
  'chennai': [13.0827, 80.2707],
  'coimbatore': [11.0168, 76.9558],
  'madurai': [9.9252, 78.1198],
  'tiruchirappalli': [10.7905, 78.7047],
  'salem': [11.6643, 78.1460],
  'hosur': [12.7409, 77.8253],
  'hyderabad': [17.3850, 78.4867],
  'secunderabad': [17.4399, 78.4983],
  'warangal': [17.9689, 79.5941],
  'visakhapatnam': [17.6868, 83.2185],
  'vijayawada': [16.5062, 80.6480],
  'guntur': [16.3067, 80.4365],
  'tirupati': [13.6288, 79.4192],
  'kochi': [9.9312, 76.2673],
  'thiruvananthapuram': [8.5241, 76.9366],
  'kozhikode': [11.2588, 75.7804],
  'thrissur': [10.5276, 76.2144],
  'kollam': [8.8932, 76.6141],
  'puducherry': [11.9416, 79.8083],
  'port blair': [11.6234, 92.7265],

  // East & Central
  'kolkata': [22.5726, 88.3639],
  'howrah': [22.5958, 88.2636],
  'siliguri': [26.7271, 88.3953],
  'durgapur': [23.5204, 87.3119],
  'asansol': [23.6739, 86.9524],
  'patna': [25.5941, 85.1376],
  'gaya': [24.7914, 85.0002],
  'bhagalpur': [25.2425, 86.9842],
  'muzaffarpur': [26.1209, 85.3647],
  'bhubaneswar': [20.2961, 85.8245],
  'cuttack': [20.4625, 85.8828],
  'rourkela': [22.2604, 84.8536],
  'puri': [19.8135, 85.8312],
  'ranchi': [23.3441, 85.3096],
  'jamshedpur': [22.8046, 86.2029],
  'dhanbad': [23.7957, 86.4304],
  'bokaro steel city': [23.6693, 86.1511],
  'bhopal': [23.2599, 77.4126],
  'indore': [22.7196, 75.8577],
  'gwalior': [26.2183, 78.1828],
  'jabalpur': [23.1815, 79.9864],
  'ujjain': [23.1765, 75.7885],
  'raipur': [21.2514, 81.6296],
  'bhilai': [21.1938, 81.3509],
  'bilaspur': [22.0797, 82.1409],

  // North-East
  'guwahati': [26.1445, 91.7362],
  'silchar': [24.8333, 92.7789],
  'dibrugarh': [27.4728, 94.9120],
  'jorhat': [26.7509, 94.2037],
  'agartala': [23.8315, 91.2868],
  'shillong': [25.5788, 91.8933],
  'imphal': [24.8170, 93.9368],
  'dimapur': [25.9094, 93.7270],
  'kohima': [25.6751, 94.1086],
  'aizawl': [23.7271, 92.7176],
  'gangtok': [27.3389, 88.6065],
  'itanagar': [27.0844, 93.6053]
};

export function getAllIndianStates(): IndianState[] {
  return INDIAN_STATES;
}

export function getStateByName(name: string): IndianState | undefined {
  if (!name) return undefined;
  const lower = name.toLowerCase().trim();
  return INDIAN_STATES.find(s => s.name.toLowerCase() === lower || s.code.toLowerCase() === lower);
}

export function getCitiesForState(stateName: string): string[] {
  if (!stateName || stateName === 'All India' || stateName === 'All') {
    const allPopular = new Set<string>();
    INDIAN_STATES.forEach(s => s.popularCities.forEach(c => allPopular.add(c)));
    return Array.from(allPopular);
  }
  const found = getStateByName(stateName);
  return found ? found.cities : [];
}

export function getCoordinatesForCity(city: string, state?: string): [number, number] {
  const key = (city || '').toLowerCase().trim();
  if (CITY_COORDINATES_MAP[key]) {
    return CITY_COORDINATES_MAP[key];
  }
  if (state) {
    const s = getStateByName(state);
    if (s && s.popularCities.length > 0) {
      const capitalKey = s.popularCities[0].toLowerCase();
      if (CITY_COORDINATES_MAP[capitalKey]) {
        return CITY_COORDINATES_MAP[capitalKey];
      }
    }
  }
  return [28.6139, 77.2090];
}

export function searchIndianLocations(query: string): { city: string; state: string; zone: string; coordinates: [number, number] }[] {
  const q = (query || '').toLowerCase().trim();
  if (!q) return [];

  const results: { city: string; state: string; zone: string; coordinates: [number, number] }[] = [];
  const seen = new Set<string>();

  // 1. Exact or prefix match in cities
  for (const s of INDIAN_STATES) {
    for (const c of s.cities) {
      const cLower = c.toLowerCase();
      if (cLower === q || cLower.startsWith(q) || cLower.includes(q)) {
        const uniqueKey = `${cLower}-${s.name.toLowerCase()}`;
        if (!seen.has(uniqueKey)) {
          seen.add(uniqueKey);
          results.push({
            city: c,
            state: s.name,
            zone: s.zone,
            coordinates: getCoordinatesForCity(c, s.name)
          });
        }
      }
    }
  }

  // 2. Match in state names
  for (const s of INDIAN_STATES) {
    if (s.name.toLowerCase().includes(q)) {
      for (const c of s.popularCities.slice(0, 4)) {
        const uniqueKey = `${c.toLowerCase()}-${s.name.toLowerCase()}`;
        if (!seen.has(uniqueKey)) {
          seen.add(uniqueKey);
          results.push({
            city: c,
            state: s.name,
            zone: s.zone,
            coordinates: getCoordinatesForCity(c, s.name)
          });
        }
      }
    }
  }

  return results.slice(0, 25);
}
