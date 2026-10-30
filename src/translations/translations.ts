export type Language = 'en' | 'hi' | 'pa';

export interface TranslationDict {
  // Navigation & General
  nav: {
    home: string;
    map: string;
    planning: string;
    calculator: string;
    naksha: string;
    advisor: string;
    landRecords: string;
    jamabandi: string;
    saved: string;
    myProperties: string;
    messages: string;
    settings: string;
    explore: string;
    insights: string;
    discoverSection: string;
    intelligenceSection: string;
    toolsSection: string;
    personalSection: string;
    flagshipBadge: string;
    activePlotsBadge: string;
  };
  header: {
    greeting: string;
    searchPlaceholder: string;
    notifications: string;
    selectLanguage: string;
    changeLocation: string;
    listPropertyFree: string;
    searchIn: string;
    titles: Record<string, { title: string; subtitle: string }>;
  };
  home: {
    heroTitle1: string;
    heroTitleGradient: string;
    heroSubtitle: string;
    searchPlaceholder: string;
    popularCities: string;
    whatToDoTitle: string;
    whatToDoSubtitle: string;
    tools: {
      calculator: { title: string; desc: string; badge: string };
      naksha: { title: string; desc: string; badge: string };
      advisor: { title: string; desc: string; badge: string };
      jamabandi: { title: string; desc: string; badge: string };
      map: { title: string; desc: string; badge: string };
    };
    trendingTitle: string;
    recentTitle: string;
    highDemand: string;
    exploreBtn: string;
    exploreAllBtn: string;
    intents: {
      buy: string;
      rent: string;
      plots: string;
      commercial: string;
    };
    tabs: {
      recommended: string;
      new: string;
      popular: string;
      price_drops: string;
    };
    matchAssistant: {
      title: string;
      subtitle: string;
      step1: string;
      step2: string;
      step3: string;
      findMatchesBtn: string;
      matchingCount: string;
    };
    emiWidget: {
      title: string;
      subtitle: string;
      propertyPrice: string;
      loanTenure: string;
      interestRate: string;
      monthlyEmi: string;
      totalInterest: string;
      principal: string;
      totalPayable: string;
    };
    districtIntelTitle: string;
    districtIntelSubtitle: string;
    avgRate: string;
    circleRate: string;
    growth1Yr: string;
    topTehsils: string;
  };
  calculator: {
    title: string;
    subtitle: string;
    simpleMode: string;
    advancedMode: string;
    modes: {
      area: string;
      stampDuty: string;
      loan: string;
      construction: string;
      blueprint: string;
    };
    step1: string;
    step2: string;
    step3: string;
    selectPlotSize: string;
    customDimensions: string;
    frontage: string;
    depth: string;
    rearWidth: string;
    facing: string;
    ratePerGaj: string;
    ratePerMarla: string;
    ratePerSqFt: string;
    enterRate: string;
    estimatedValue: string;
    stampDuty: string;
    monthlyEmi: string;
    unitConverter: string;
    presets: {
      gaj50: string;
      gaj100: string;
      gaj150: string;
      gaj200: string;
      gaj250: string;
      gaj500: string;
      kanal1: string;
      bigha1: string;
      killa1: string;
    };
    units: {
      gaj: string;
      marla: string;
      kanal: string;
      bigha: string;
      biswa: string;
      killa: string;
      acre: string;
      sqft: string;
      sqm: string;
      karam: string;
    };
    vastuVerdict: string;
    vastuScore: string;
    maxFloors: string;
    farRules: string;
    constructionCost: string;
    roadWidth: string;
    totalArea: string;
    totalPrice: string;
    calculateBtn: string;
  };
  advisor: {
    title: string;
    subtitle: string;
    newChat: string;
    previousChats: string;
    noChats: string;
    activeContext: string;
    noContext: string;
    selectOnMap: string;
    sampleLocations: string;
    inputPlaceholder: string;
    disclaimer: string;
    modes: {
      all: string;
      valuation: string;
      naksha: string;
      legal: string;
      investment: string;
    };
    quickPrompts: {
      growth: { title: string; desc: string };
      valuation: { title: string; desc: string };
      bylaws: { title: string; desc: string };
      legal: { title: string; desc: string };
    };
    trendingQuestions: string;
    welcomeTitle: string;
    welcomeDesc: string;
    copy: string;
    copied: string;
    deepen: string;
    send: string;
    radarTitle: string;
    suggestedActions: string;
  };
  jamabandi: {
    title: string;
    subtitle: string;
    uploadTab: string;
    searchTab: string;
    demoSampleBtn: string;
    dragDropText: string;
    fileFormats: string;
    browseBtn: string;
    analyzingText: string;
    ownershipDetails: string;
    ownerName: string;
    khewatNo: string;
    khatoniNo: string;
    khasraNo: string;
    totalArea: string;
    mutationStatus: string;
    encumbranceStatus: string;
    safeToBuy: string;
    riskAlert: string;
    bankMortgage: string;
    noMortgage: string;
    viewOriginal: string;
    downloadReport: string;
    uploadAnother: string;
    fetchRecord: string;
    panelTitle: string;
    panelDesc: string;
  };
  landRecords: {
    title: string;
    subtitle: string;
    autoLocate: string;
    locating: string;
    searchPlaceholder: string;
    trendingLocations: string;
    breadcrumbState: string;
    breadcrumbDistrict: string;
    breadcrumbTehsil: string;
    breadcrumbVillage: string;
    breadcrumbParcel: string;
    selectParcelHint: string;
    noParcelSelected: string;
    officialStatus: string;
    disclaimer: string;
    khasraSearchTab: string;
    mapTab: string;
    khasraInputPlaceholder: string;
    searchKhasraBtn: string;
    useGps: string;
  };
  naksha: {
    title: string;
    subtitle: string;
    wizardSteps: {
      step1: string;
      step2: string;
      step3: string;
    };
    view2D: string;
    view3D: string;
    groundFloor: string;
    firstFloor: string;
    secondFloor: string;
    rooms: {
      living: string;
      kitchen: string;
      masterBed: string;
      bed2: string;
      bed3: string;
      bath: string;
      pooja: string;
      parking: string;
      lawn: string;
      balcony: string;
      dining: string;
    };
    presets: string;
    exportPlan: string;
    aiPromptPlaceholder: string;
    generateBtn: string;
    backToWizard: string;
    regenerate: string;
    dimensions: string;
    facingRoad: string;
  };
  marketInsights: {
    heroTitle: string;
    heroSubtitle: string;
    useGps: string;
    detectingGps: string;
    searchLocation: string;
    liveGpsActive: string;
    recalibrate: string;
    interactivePins: string;
    hidePins: string;
    avgMarketRate: string;
    circleBenchmark: string;
    indexedLocations: string;
    buyerDemand: string;
    rateTrajectory: string;
    historicalAppreciation: string;
    coloniesTitle: string;
    showingLocalities: string;
    searchPlaceholder: string;
    sortGrowth: string;
    sortPriceHigh: string;
    sortPriceLow: string;
    sortDemand: string;
    allLocalities: string;
    approvedSectors: string;
    gatedTownships: string;
    freeholdColonies: string;
    calcStampDuty: string;
    askAi: string;
  };
  myProperties: {
    title: string;
    subtitle: string;
    brokerTab: string;
    buyerTab: string;
    addNewListing: string;
    postRequirement: string;
    noListings: string;
    noRequirements: string;
    propertyTitle: string;
    propertyType: string;
    intentSale: string;
    intentRent: string;
    district: string;
    tehsil: string;
    locality: string;
    area: string;
    price: string;
    khasraNo: string;
    roadWidth: string;
    docStatus: string;
    contactName: string;
    contactPhone: string;
    agencyName: string;
    budgetMin: string;
    budgetMax: string;
    requiredSize: string;
    purpose: string;
    submitListing: string;
    submitRequirement: string;
    callContact: string;
    verifiedBadge: string;
    deleteListing: string;
    preferredArea: string;
    minBudget: string;
    maxBudget: string;
    phone: string;
    broadcastRequirement: string;
    myListings: string;
    myRequirements: string;
    brokerSellerRole: string;
    addAsBroker: string;
    buyerInvestorRole: string;
    addAsBuyer: string;
    askingPrice: string;
    roadConnectivity: string;
    registryStatus: string;
    photos: string;
    publishListing: string;
    preferredDistrict: string;
  };
  explore: {
    title: string;
    subtitle: string;
    locationFilter: string;
    typeFilter: string;
    maxBudget: string;
    verifiedOnly: string;
    resetFilters: string;
    showingProperties: string;
    noPropertiesFound: string;
    viewMap: string;
    viewGrid: string;
    viewList: string;
    sortBy: string;
  };
  saved: {
    title: string;
    subtitle: string;
    noSavedTitle: string;
    noSavedDesc: string;
    emptyTitle: string;
    emptySubtitle: string;
    browseBtn: string;
    exploreMoreBtn: string;
  };
  messages: {
    title: string;
    subtitle: string;
    unreadCount: string;
    unreadConversations: string;
    newBadge: string;
    note: string;
    secureChatNote: string;
  };
  propertyDetail: {
    backToExplore: string;
    verifiedBadge: string;
    priceBreakdown: string;
    circleRateComparison: string;
    dimensionsTitle: string;
    amenitiesTitle: string;
    landmarksTitle: string;
    legalTitle: string;
    contactDealer: string;
    saveProperty: string;
    savedProperty: string;
    similarProperties: string;
    askAiAboutThis: string;
    calculateRegistry: string;
  };
  aiAnalysis: {
    backToProperty: string;
    demoBanner: string;
    scoreTitle: string;
    fairValue: string;
    undervalued: string;
    overvalued: string;
    radarPrice: string;
    radarLocation: string;
    radarRental: string;
    radarFuture: string;
    radarInfra: string;
    radarLegal: string;
  };
  futurePotential: {
    backToProperty: string;
    timelineTitle: string;
    pastTab: string;
    presentTab: string;
    futureTab: string;
    upcomingProjects: string;
  };
  planningMaps: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    categories: {
      all: string;
      masterPlan: string;
      zoning: string;
      sectorLayout: string;
      industrial: string;
    };
    viewGis: string;
    inspectBlueprint: string;
    downloadPdf: string;
  };
  profile: {
    title: string;
    subtitle: string;
    kycVerified: string;
    savedPropertiesCount: string;
    nakshaPlansCount: string;
    verifiedFardCount: string;
    languageSection: string;
    unitSection: string;
    notificationsSection: string;
    pushAlerts: string;
    marketAlerts: string;
    supportSection: string;
    helpline: string;
    legalTerms: string;
    savedProperties: string;
    aiPlans: string;
    verifiedFard: string;
    preferredUnit: string;
    notifications: string;
    priceAlerts: string;
    auctionAlerts: string;
    workspaceEcosystem: string;
    supportLegal: string;
    consultAdvisor: string;
    aboutPropwise: string;
  };
  onboarding: {
    selectLanguageTitle: string;
    selectLanguageSubtitle: string;
    phoneDetectedBadge: string;
    continueBtn: string;
    changeLanguageTitle: string;
    smartDiscovery: string;
    locationTitle: string;
    locationSubtitle: string;
    useGpsTitle: string;
    useGpsSubtitle: string;
    orSearch: string;
    searchBoxTitle: string;
    searchPlaceholder: string;
    searching: string;
    noMatchesFound: string;
    privacyNote: string;
    detectingTitle: string;
    detectingSubtitle: string;
    searchManuallyInstead: string;
    gpsErrorTitle: string;
    gpsErrorDesc: string;
    tryAgain: string;
    searchLocationBtn: string;
    locationDetected: string;
    locationSelected: string;
    youAreExploring: string;
    verifiedPropertiesCap: string;
    localTehsilsCap: string;
    circleRatesCap: string;
    startExploringBtn: string;
    chooseDifferentLocationBtn: string;
    languages: {
      en: { name: string; nativeName: string; desc: string; script: string };
      hi: { name: string; nativeName: string; desc: string; script: string };
      pa: { name: string; nativeName: string; desc: string; script: string };
    };
  };
  common: {
    crore: string;
    lakh: string;
    thousand: string;
    perGaj: string;
    perSqFt: string;
    verified: string;
    unverified: string;
    loading: string;
    clear: string;
    close: string;
    save: string;
    saved: string;
    change: string;
    viewDetails: string;
    all: string;
    any: string;
    cancel: string;
    confirm: string;
    search: string;
    filter: string;
    apply: string;
    reset: string;
    back: string;
    next: string;
    submit: string;
    download: string;
    share: string;
    yes: string;
    no: string;
    delete: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationDict> = {
  // ─── ENGLISH ──────────────────────────────────────────────────────────────
  en: {
    nav: {
      home: 'Home',
      map: 'Interactive GIS Map',
      planning: 'Master Planning Maps',
      calculator: 'Land & Stamp Duty Calc',
      naksha: 'AI Naksha™ Studio',
      advisor: 'AI Property Advisor',
      landRecords: 'Revenue Land Records',
      jamabandi: 'Revenue Land Records',
      saved: 'Saved Properties',
      myProperties: 'My Portfolio',
      messages: 'Messages',
      settings: 'Settings',
      explore: 'Explore Properties',
      insights: 'Market Analytics',
      discoverSection: 'Discover',
      intelligenceSection: 'Intelligence & AI',
      toolsSection: 'Tools & Utilities',
      personalSection: 'Personal & Account',
      flagshipBadge: 'Flagship AI',
      activePlotsBadge: '12+ Plots',
    },
    header: {
      greeting: 'Welcome to PlotIX',
      searchPlaceholder: 'Search city, plot, sector or colony (e.g. Sector 82 Mohali)...',
      notifications: 'Notifications',
      selectLanguage: 'Language',
      changeLocation: 'Change',
      listPropertyFree: 'List Property Free',
      searchIn: 'Search in',
      titles: {
        home: { title: 'PlotIX', subtitle: 'DISCOVER.ANALYZE.INVEST' },
        explore: { title: 'Explore Properties', subtitle: 'Find verified plots and properties across Punjab & Haryana' },
        map: { title: 'Interactive Map', subtitle: 'Explore boundaries, circle rates & master plans' },
        advisor: { title: 'PlotIX Advisor', subtitle: 'Instant property valuation, PUDA bylaws & risk analysis' },
        insights: { title: 'Market Insights', subtitle: 'Real-time price trends, appreciation & demand radar' },
        'my-properties': { title: 'My Properties', subtitle: 'Track your property portfolio & saved plots' },
        saved: { title: 'Saved Properties', subtitle: 'Plots and houses bookmarked for later' },
        messages: { title: 'Messages', subtitle: 'Direct chat with verified owners and brokers' },
        detail: { title: 'Property Overview', subtitle: 'Complete area, price breakdown and legal report' },
        analysis: { title: 'AI Due Diligence', subtitle: 'Automated valuation & investment risk score' },
        'future-potential': { title: 'Future Growth Outlook', subtitle: 'Upcoming highway expansions and master plan impact' },
        'ai-design': { title: 'AI Naksha & 3D Visualizer', subtitle: 'Generate architectural floor plans according to PUDA bylaws' },
        'land-calculator': { title: 'Land & Price Calculator', subtitle: 'Instant Gaj, Marla, Bigha, Killa & Acre cost conversion' },
        'land-records': { title: 'Find Your Land Records', subtitle: 'Search property location, explore cadastral parcels & access land information' },
        jamabandi: { title: 'Find Your Land Records', subtitle: 'Search property location, explore cadastral parcels & access land information' },
        'planning-maps': { title: 'Town Planning Maps', subtitle: 'Official master plans and zoning documents' },
        settings: { title: 'Account Settings', subtitle: 'Preferences, notifications and profile' },
      },
    },
    home: {
      heroTitle1: 'Buy, Value & Plan Land.',
      heroTitleGradient: 'Simple. Intelligent. Verified.',
      heroSubtitle: 'Calculate exact land costs, generate 3D house plans, check government Jamabandi records and consult AI — all in one place.',
      searchPlaceholder: 'Search city, colony, khasra or sector...',
      popularCities: 'Popular Cities:',
      whatToDoTitle: 'What would you like to do today?',
      whatToDoSubtitle: 'Choose a tool below to get started in seconds — no technical knowledge required:',
      tools: {
        calculator: {
          title: 'Calculate Land & Price',
          desc: 'Convert Gaj, Marla, Bigha, Killa and check total price, registry cost & EMI instantly.',
          badge: 'Most Popular',
        },
        naksha: {
          title: 'Make House Naksha (3D)',
          desc: 'Create ready-to-build 2D/3D house floor plans with rooms, setbacks & PUDA rules.',
          badge: 'AI Powered',
        },
        advisor: {
          title: 'Ask AI Property Advisor',
          desc: 'Check if asking price is fair, get 3-year growth forecast & legal advice in seconds.',
          badge: 'Live Intelligence',
        },
        jamabandi: {
          title: 'Check Jamabandi & Fard',
          desc: 'Verify registry, Khasra numbers, land ownership & bank mortgage status.',
          badge: 'Legal Records',
        },
        map: {
          title: 'Explore on Live Map',
          desc: 'View master planning boundaries, sector layouts & circle rates on interactive map.',
          badge: 'Interactive',
        },
      },
      trendingTitle: '🔥 High Demand Real Estate Zones',
      recentTitle: 'Recently Viewed Properties',
      highDemand: 'High Demand',
      exploreBtn: 'Explore Area →',
      exploreAllBtn: 'Explore All Properties →',
      intents: {
        buy: 'Buy Plots & Land',
        rent: 'Rent Properties',
        plots: 'Agricultural Land',
        commercial: 'Commercial SCOs',
      },
      tabs: {
        recommended: 'Recommended For You',
        new: 'New Launches',
        popular: 'Most Popular',
        price_drops: 'Price Drops',
      },
      matchAssistant: {
        title: '🎯 10-Second Plot Match Assistant',
        subtitle: 'Tell us your location & budget to see exact verified matches instantly:',
        step1: '1. Preferred City / Tehsil',
        step2: '2. Maximum Budget',
        step3: '3. Property Type',
        findMatchesBtn: 'Find Verified Matches Now',
        matchingCount: 'Verified plots match your exact criteria',
      },
      emiWidget: {
        title: '🏦 Quick Plot Loan EMI Calculator',
        subtitle: 'Estimate your monthly installment at 8.5% interest rate:',
        propertyPrice: 'Plot Price (₹ Lakhs)',
        loanTenure: 'Loan Tenure (Years)',
        interestRate: 'Interest Rate',
        monthlyEmi: 'Monthly Loan EMI',
        totalInterest: 'Total Interest Payable',
        principal: 'Principal Loan Amount (80%)',
        totalPayable: 'Total Payable to Bank',
      },
      districtIntelTitle: 'District Market Intelligence',
      districtIntelSubtitle: 'Verified circle rates & capital appreciation across local tehsils',
      avgRate: 'Avg Market Rate',
      circleRate: 'Circle Rate',
      growth1Yr: '1-Year Growth',
      topTehsils: 'Top Sub-Divisions / Tehsils',
    },
    calculator: {
      title: 'Land Area & Price Calculator',
      subtitle: 'Easily calculate land size in Gaj, Marla, Bigha, Killa, Acre and know the total cost with registry fees.',
      simpleMode: '⚡ Simple 2-Click Mode',
      advancedMode: '📐 Advanced CAD Blueprint',
      modes: {
        area: '📐 Land Area & Rate',
        stampDuty: '📜 Stamp Duty & Registry',
        loan: '🏦 Bank Loan EMI',
        construction: '🏗️ Construction Cost',
        blueprint: '⚡ CAD Plot Blueprint',
      },
      step1: 'Step 1: Choose Plot Size',
      step2: 'Step 2: Enter Rate (Price)',
      step3: 'Step 3: Total Cost & Summary',
      selectPlotSize: 'Select Common Plot Size:',
      customDimensions: 'Or enter custom Front × Depth (Feet):',
      frontage: 'Front Width (Feet)',
      depth: 'Depth (Feet)',
      rearWidth: 'Rear Width (Feet)',
      facing: 'Road Facing Direction',
      ratePerGaj: 'Rate per Gaj (₹)',
      ratePerMarla: 'Rate per Marla (₹)',
      ratePerSqFt: 'Rate per Sq.Ft (₹)',
      enterRate: 'Enter Rate per Gaj / Marla:',
      estimatedValue: 'Total Estimated Value',
      stampDuty: 'Registry & Stamp Duty (approx 7%)',
      monthlyEmi: 'Estimated Bank Loan EMI (20 Yrs)',
      unitConverter: 'All Unit Conversions for this Plot:',
      presets: {
        gaj50: '50 Gaj (Small)',
        gaj100: '100 Gaj (Standard)',
        gaj150: '150 Gaj (Medium)',
        gaj200: '200 Gaj (Popular)',
        gaj250: '250 Gaj (Large)',
        gaj500: '500 Gaj (Kothi)',
        kanal1: '1 Kanal (20 Marla)',
        bigha1: '1 Bigha (Punjab/Haryana)',
        killa1: '1 Killa / Acre (8 Kanal)',
      },
      units: {
        gaj: 'Gaj (Sq.Yards)',
        marla: 'Marla',
        kanal: 'Kanal',
        bigha: 'Bigha',
        biswa: 'Biswa',
        killa: 'Killa / Acre',
        acre: 'Acre',
        sqft: 'Sq. Feet',
        sqm: 'Sq. Meters',
        karam: 'Karam (5.5 ft)',
      },
      vastuVerdict: 'Vastu Direction Rating',
      vastuScore: 'Vastu Score',
      maxFloors: 'Permissible Floors',
      farRules: 'PUDA / HUDA Permissible Built-up Area (FAR)',
      constructionCost: 'Estimated House Construction Cost',
      roadWidth: 'Front Road Width',
      totalArea: 'Total Calculated Area',
      totalPrice: 'Total Land Valuation',
      calculateBtn: 'Calculate Price & Blueprint',
    },
    advisor: {
      title: 'PropWise AI Advisor',
      subtitle: 'Ask any question in plain language — price valuation, building bylaws, or legal check',
      newChat: 'New Question',
      previousChats: 'Previous Inquiries',
      noChats: 'No previous inquiries',
      activeContext: 'Active Property / Plot',
      noContext: 'No plot selected. Choose a quick area below or ask general questions:',
      selectOnMap: 'Select on Live Map',
      sampleLocations: 'Quick Areas to Analyze:',
      inputPlaceholder: 'Type your question in English, Hindi, or Punjabi...',
      disclaimer: '💡 AI synthesizes official master plans & circle rates for guidance. Verify with certified advocates.',
      modes: {
        all: 'All Questions',
        valuation: 'Price & Circle Rates',
        naksha: 'House Naksha & Bylaws',
        legal: 'Legal & Jamabandi',
        investment: 'ROI & Growth Forecast',
      },
      quickPrompts: {
        growth: {
          title: 'Location & Future Growth',
          desc: 'Will this area appreciate in 3 years? Check upcoming highway & metro plans.',
        },
        valuation: {
          title: 'Fair Price & Circle Rate',
          desc: 'Is the seller asking too much? Compare with official collector rates.',
        },
        bylaws: {
          title: 'House Naksha & PUDA Rules',
          desc: 'How many floors and rooms can I build on this plot size?',
        },
        legal: {
          title: 'Legal Papers Checklist',
          desc: 'What documents should I verify before paying token money?',
        },
      },
      trendingQuestions: 'Frequently Asked Questions:',
      welcomeTitle: 'How can I assist your property decision today?',
      welcomeDesc: 'Ask about any plot, circle rate, building rules, or registry verification.',
      copy: 'Copy',
      copied: 'Copied!',
      deepen: 'Explain Deeper',
      send: 'Send',
      radarTitle: 'AI Intelligence Radar',
      suggestedActions: 'Recommended Next Steps:',
    },
    jamabandi: {
      title: 'Jamabandi & Fard Intelligence',
      subtitle: 'Upload a land record document or test with our sample to verify ownership & bank loans.',
      uploadTab: '📄 Upload Jamabandi / Fard',
      searchTab: '🔍 Manual Khasra Search',
      demoSampleBtn: '⚡ Click to Load Sample Jamabandi',
      dragDropText: 'Click or drag Jamabandi / Fard PDF here',
      fileFormats: 'Supports PDF, JPG, PNG (Max 10MB)',
      browseBtn: 'Choose File from Mobile / Computer',
      analyzingText: 'AI is reading Jamabandi records & checking Tehsil database...',
      ownershipDetails: 'Verified Ownership Records',
      ownerName: 'Registered Owner (Malik)',
      khewatNo: 'Khewat No.',
      khatoniNo: 'Khatoni No.',
      khasraNo: 'Khasra Numbers',
      totalArea: 'Total Area in Record',
      mutationStatus: 'Mutation (Intiqal / Dakhil-Kharij)',
      encumbranceStatus: 'Bank Loan / Mortgage Status',
      safeToBuy: 'Clean Title — Safe to Purchase',
      riskAlert: 'Attention — Verify Outstanding Bank Lien',
      bankMortgage: 'Active Bank Mortgage Found',
      noMortgage: 'No Active Bank Liens (Clean Title)',
      viewOriginal: 'View Original Jamabandi',
      downloadReport: 'Download Verification Report',
      uploadAnother: 'Upload Another Document',
      fetchRecord: 'Fetch & Analyze Record',
      panelTitle: 'AI Intelligence Panel',
      panelDesc: 'Upload a document or click the sample button above to extract ownership.',
    },
    landRecords: {
      title: 'Find Your Land Records',
      subtitle: 'Search property location, explore cadastral parcels & access land information',
      autoLocate: 'Auto-Locate',
      locating: 'Locating...',
      searchPlaceholder: 'Search village, tehsil, city or colony...',
      trendingLocations: 'Trending Locations:',
      breadcrumbState: 'State',
      breadcrumbDistrict: 'District',
      breadcrumbTehsil: 'Tehsil',
      breadcrumbVillage: 'Village / Colony',
      breadcrumbParcel: 'Cadastral Parcel',
      selectParcelHint: 'Tap any cadastral plot boundary on the map to inspect ownership and mutation.',
      noParcelSelected: 'No plot selected. Tap on the map to select a parcel.',
      officialStatus: 'Official cadastral data & ownership records will be retrieved when the state revenue database is connected.',
      disclaimer: '💡 Government cadastral maps are for reference. Verify in Tehsil revenue office before financial transaction.',
      khasraSearchTab: 'Search by Khasra No.',
      mapTab: 'Cadastral Map View',
      khasraInputPlaceholder: 'Enter Khasra No. (e.g. 145/2/1)',
      searchKhasraBtn: 'Search Parcel Record',
      useGps: 'Use Current Location',
    },
    naksha: {
      title: 'AI House Naksha Designer',
      subtitle: 'Generate intelligent 2D floor plans & 3D walk-throughs for your plot size.',
      wizardSteps: {
        step1: 'Spaces & Plot',
        step2: 'Dimensions',
        step3: 'Arrange & Build',
      },
      view2D: '2D Floor Plan',
      view3D: '3D Walkthrough',
      groundFloor: 'Ground Floor',
      firstFloor: 'First Floor',
      secondFloor: 'Second Floor',
      rooms: {
        living: 'Living Room (बैठक)',
        kitchen: 'Kitchen (रसोई)',
        masterBed: 'Master Bedroom',
        bed2: 'Bedroom 2',
        bed3: 'Bedroom 3',
        bath: 'Bathroom',
        pooja: 'Pooja Room',
        parking: 'Car Parking',
        lawn: 'Front Lawn',
        balcony: 'Balcony',
        dining: 'Dining Area',
      },
      presets: 'Choose Plot Preset:',
      exportPlan: 'Download PDF Naksha',
      aiPromptPlaceholder: 'e.g. Add an open kitchen and 1 car parking on the left side...',
      generateBtn: 'Update Naksha with AI',
      backToWizard: 'Back to Wizard',
      regenerate: 'Regenerate Plans',
      dimensions: 'Plot Dimensions',
      facingRoad: 'Road Facing',
    },
    marketInsights: {
      heroTitle: 'Real-Time Market Analytics & Locality Rate Index',
      heroSubtitle: 'Select your live GPS location or search any region to view market rates, circle rates, and 3-Yr ROI across all colonies.',
      useGps: 'Use My Current Location',
      detectingGps: 'Detecting GPS...',
      searchLocation: 'Select / Search Location',
      liveGpsActive: 'Live GPS Active:',
      recalibrate: 'Recalibrate',
      interactivePins: 'Interactive Map Pins',
      hidePins: 'Hide Map Pins',
      avgMarketRate: 'Average Market Rate',
      circleBenchmark: 'Collector Circle Benchmark',
      indexedLocations: 'Indexed Micro-Locations',
      buyerDemand: 'Buyer Demand Liquidity',
      rateTrajectory: '12-Month Rate Trajectory',
      historicalAppreciation: 'Historical appreciation curve per sq.yd. from Sep 2025 to Aug 2026',
      coloniesTitle: 'All Colonies, Sectors & Mohallas in',
      showingLocalities: 'Showing Localities with Live Rates',
      searchPlaceholder: 'Search colony, sector, or landmark...',
      sortGrowth: 'Sort: Highest Growth %',
      sortPriceHigh: 'Sort: Highest Price',
      sortPriceLow: 'Sort: Lowest Price',
      sortDemand: 'Sort: Buyer Demand Score',
      allLocalities: 'All Localities',
      approvedSectors: '🏛️ Approved Sectors',
      gatedTownships: '🏡 Gated Townships',
      freeholdColonies: '📜 Freehold Colonies',
      calcStampDuty: 'Calculate Stamp Duty',
      askAi: 'Ask AI About Locality',
    },
    myProperties: {
      title: 'My Portfolio & Property Listings',
      subtitle: 'Post properties for sale/rent or submit your buyer purchase requirements.',
      brokerTab: '🏢 Seller / Broker Listings',
      buyerTab: '🎯 Buyer Requirements',
      addNewListing: '+ Add New Property Listing',
      postRequirement: '+ Post Buyer Requirement',
      noListings: 'No property listings added yet. Click above to list your first plot for free.',
      noRequirements: 'No buyer requirements posted yet. Tell verified dealers what you want to buy.',
      propertyTitle: 'Property Title / Heading',
      propertyType: 'Property Type',
      intentSale: 'For Sale',
      intentRent: 'For Rent',
      district: 'District',
      tehsil: 'Tehsil / City',
      locality: 'Colony / Sector / Landmark',
      area: 'Plot Area / Size',
      price: 'Price / Expected Rate (₹)',
      khasraNo: 'Khasra Number (Optional)',
      roadWidth: 'Front Road Width',
      docStatus: 'Document Status',
      contactName: 'Contact Person Name',
      contactPhone: 'Mobile Phone Number',
      agencyName: 'Real Estate Agency (Optional)',
      budgetMin: 'Minimum Budget (₹)',
      budgetMax: 'Maximum Budget (₹)',
      requiredSize: 'Required Size (Gaj / Marla / Acre)',
      purpose: 'Purchase Purpose',
      submitListing: 'Publish Listing Free',
      submitRequirement: 'Submit Requirement',
      callContact: 'Call Contact',
      verifiedBadge: 'Verified Listing',
      deleteListing: 'Delete',
      preferredArea: 'Preferred Locality / Sector',
      minBudget: 'Min Budget',
      maxBudget: 'Max Budget',
      phone: 'Phone Number',
      broadcastRequirement: 'Post Requirement',
      myListings: 'My Listings',
      myRequirements: 'My Buyer Requests',
      brokerSellerRole: '🏢 Seller / Broker Listings',
      addAsBroker: '+ Add New Property Listing',
      buyerInvestorRole: '🎯 Buyer Requirements',
      addAsBuyer: '+ Post Buyer Requirement',
      askingPrice: 'Asking Price (₹)',
      roadConnectivity: 'Road Connectivity',
      registryStatus: 'Registry Status',
      photos: 'Property Photos',
      publishListing: 'Publish Listing Free',
      preferredDistrict: 'Target District',
    },
    explore: {
      title: 'Explore Properties',
      subtitle: 'Find verified plots and properties across Punjab & Haryana',
      locationFilter: 'Location / City',
      typeFilter: 'Property Type',
      maxBudget: 'Max Budget:',
      verifiedOnly: 'Verified Registry Only',
      resetFilters: 'Reset Filters',
      showingProperties: 'properties found',
      noPropertiesFound: 'No properties match your filter criteria. Try adjusting budget or location.',
      viewMap: 'Map View',
      viewGrid: 'Grid',
      viewList: 'List',
      sortBy: 'Sort By',
    },
    saved: {
      title: 'Saved Properties',
      subtitle: 'Plots and houses bookmarked for later comparison',
      noSavedTitle: 'No Saved Properties',
      noSavedDesc: 'Save properties while exploring to compare them later. Tap the bookmark icon on any property card to save it here.',
      emptyTitle: 'No Saved Properties Yet',
      emptySubtitle: 'Explore verified properties and bookmark your favorite plots and houses.',
      browseBtn: 'Browse Properties',
      exploreMoreBtn: 'Explore More Properties',
    },
    messages: {
      title: 'Messages & Inquiries',
      subtitle: 'Direct communication with verified plot owners and brokers',
      unreadCount: 'unread conversations',
      unreadConversations: 'unread conversations',
      newBadge: 'new',
      note: 'Full real-time messaging available when connected to live backend.',
      secureChatNote: 'Full real-time messaging available when connected to live backend.',
    },
    propertyDetail: {
      backToExplore: 'Back to Explore',
      verifiedBadge: '✓ Verified by Revenue Experts',
      priceBreakdown: 'Price & Circle Rate Breakdown',
      circleRateComparison: 'Collector Circle Rate Comparison',
      dimensionsTitle: 'Plot Dimensions & Road Access',
      amenitiesTitle: 'Nearby Amenities & Distances',
      landmarksTitle: 'Key Connectivity Hubs',
      legalTitle: 'Legal & Registry Verification',
      contactDealer: 'Call Owner / Broker',
      saveProperty: 'Bookmark Property',
      savedProperty: 'Saved in Portfolio',
      similarProperties: 'Similar Properties in this Area',
      askAiAboutThis: 'Ask AI Advisor About This Property',
      calculateRegistry: 'Calculate Registry Cost & EMI',
    },
    aiAnalysis: {
      backToProperty: 'Back to Property',
      demoBanner: 'AI Intelligence Report — Automated analysis synthesized from master plans and official circle rates.',
      scoreTitle: 'PropWise AI Due Diligence Score',
      fairValue: 'Fair Market Value',
      undervalued: 'Undervalued (Great Buy)',
      overvalued: 'Overvalued (Negotiate)',
      radarPrice: 'Price Score',
      radarLocation: 'Location',
      radarRental: 'Rental Yield',
      radarFuture: 'Future Growth',
      radarInfra: 'Infrastructure',
      radarLegal: 'Legal Cleanliness',
    },
    futurePotential: {
      backToProperty: 'Back to Property',
      timelineTitle: 'Area Development & Appreciation Timeline',
      pastTab: '📅 Past History',
      presentTab: '📍 Present State',
      futureTab: '🔭 Future 3-Yr Outlook',
      upcomingProjects: 'Upcoming Master Plan Projects',
    },
    planningMaps: {
      title: 'Town Planning & Master Maps',
      subtitle: 'Official master plans, zoning layouts, and PUDA development corridors',
      searchPlaceholder: 'Search city, master plan, or industrial zone...',
      categories: {
        all: 'All Maps',
        masterPlan: 'Master Plans',
        zoning: 'Zoning Maps',
        sectorLayout: 'Sector Layouts',
        industrial: 'Industrial Corridors',
      },
      viewGis: 'View Interactive GIS Map',
      inspectBlueprint: 'Inspect Blueprint CAD',
      downloadPdf: 'Download Official PDF',
    },
    profile: {
      title: 'Account Settings & Preferences',
      subtitle: 'Manage language, measurement units, and notifications',
      kycVerified: 'KYC Verified',
      savedPropertiesCount: 'Saved Properties',
      nakshaPlansCount: 'AI Naksha Plans',
      verifiedFardCount: 'Verified Fard',
      languageSection: 'Language & Regional Dialect',
      unitSection: 'Default Measurement Unit',
      notificationsSection: 'Notification Preferences',
      pushAlerts: 'Push Alerts on New Plots',
      marketAlerts: 'Monthly Rate Appreciation Digest',
      supportSection: 'Support & Help Desk',
      helpline: 'Toll-Free Revenue Helpline',
      legalTerms: 'Terms of Service & Privacy Policy',
      savedProperties: 'Saved Properties',
      aiPlans: 'AI Naksha Plans',
      verifiedFard: 'Verified Fard',
      preferredUnit: 'Preferred Land Unit',
      notifications: 'Notifications & Alerts',
      priceAlerts: 'Price Movement Alerts',
      auctionAlerts: 'Auction & Master Plan Updates',
      workspaceEcosystem: 'Quick Workspace Shortcuts',
      supportLegal: 'Help & Legal Support',
      consultAdvisor: 'Consult AI Advisor',
      aboutPropwise: 'About PropWise',
    },
    common: {
      crore: 'Cr',
      lakh: 'Lakh',
      thousand: 'k',
      perGaj: '/ Gaj',
      perSqFt: '/ Sq.Ft',
      verified: 'Verified',
      unverified: 'Unverified',
      loading: 'Loading...',
      clear: 'Clear',
      close: 'Close',
      save: 'Save',
      saved: 'Saved',
      change: 'Change',
      viewDetails: 'View Details',
      all: 'All',
      any: 'Any',
      cancel: 'Cancel',
      confirm: 'Confirm',
      search: 'Search',
      filter: 'Filter',
      apply: 'Apply',
      reset: 'Reset',
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
      download: 'Download',
      share: 'Share',
      yes: 'Yes',
      no: 'No',
      delete: 'Delete',
    },
    onboarding: {
      selectLanguageTitle: 'Select your preferred language',
      selectLanguageSubtitle: 'Choose how you want to experience PlotIX. You can change this anytime.',
      phoneDetectedBadge: 'Suggested for your phone',
      continueBtn: 'Continue',
      changeLanguageTitle: 'Change Language',
      smartDiscovery: 'Smart Discovery',
      locationTitle: 'Let’s find properties around you.',
      locationSubtitle: 'Where are you looking for property?',
      useGpsTitle: 'Use My Current Location',
      useGpsSubtitle: 'Detect district, tehsil, village & nearby properties',
      orSearch: 'OR SEARCH LOCATION',
      searchBoxTitle: 'Search Village, Tehsil, District',
      searchPlaceholder: 'Search village, colony, tehsil, or district...',
      searching: 'Searching locations...',
      noMatchesFound: 'No exact matches found. Try typing your District or Tehsil name.',
      privacyNote: 'Your location helps us show relevant verified properties, local markets, villages, and circle rates.',
      detectingTitle: 'Detecting Your Location...',
      detectingSubtitle: 'Please allow location access on your device. We are determining your State, District, Tehsil, and Village hierarchy.',
      searchManuallyInstead: 'Search Manually Instead',
      gpsErrorTitle: 'We couldn’t access your location',
      gpsErrorDesc: 'Location permission was denied or timed out. You can search for your location manually.',
      tryAgain: 'Try Again',
      searchLocationBtn: 'Search Location',
      locationDetected: '📍 Your Current Location Detected',
      locationSelected: '📍 Location Selected',
      youAreExploring: 'You are exploring',
      verifiedPropertiesCap: 'Verified Properties & Land',
      localTehsilsCap: 'Local Tehsils & Mandis',
      circleRatesCap: 'Circle Rates & Intelligence',
      startExploringBtn: 'Start Exploring',
      chooseDifferentLocationBtn: 'Choose Different Location',
      languages: {
        en: { name: 'English', nativeName: 'English', desc: 'Real Estate & Land Intelligence', script: 'Latin' },
        hi: { name: 'Hindi', nativeName: 'हिन्दी', desc: 'ज़मीन, रजिस्ट्री व रियल एस्टेट', script: 'Devanagari' },
        pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', desc: 'ਜ਼ਮੀਨ ਰਿਕਾਰਡ, ਨਕਸ਼ਾ ਤੇ ਰੀਅਲ ਅਸਟੇਟ', script: 'Gurmukhi' },
      },
    },
  },

  // ─── HINDI (हिंदी) ─────────────────────────────────────────────────────────
  hi: {
    nav: {
      home: 'होम (मुख्य पृष्ठ)',
      map: 'लाइव सैटेलाइट मैप',
      planning: 'टाउन प्लानिंग मास्टर मैप्स',
      calculator: 'ज़मीन नाप व रेट कैलकुलेटर',
      naksha: 'AI मकान का नक्शा (3D)',
      advisor: 'AI ज़मीन सलाहकार',
      landRecords: 'सरकारी ज़मीनी रिकॉर्ड',
      jamabandi: 'सरकारी ज़मीनी रिकॉर्ड',
      saved: 'पसंदीदा प्रॉपर्टीज़',
      myProperties: 'मेरा पोर्टफोलियो',
      messages: 'मैसेज व बातचीत',
      settings: 'खाता सेटिंग्स',
      explore: 'प्रॉपर्टी और प्लाट देखें',
      insights: 'बाजार भाव व ट्रेंड',
      discoverSection: 'खोजें व देखें',
      intelligenceSection: 'AI व बुद्धिमत्ता',
      toolsSection: 'कैलकुलेटर व टूल्स',
      personalSection: 'मेरा खाता व सेटिंग्स',
      flagshipBadge: 'खास AI',
      activePlotsBadge: '12+ प्लाट',
    },
    header: {
      greeting: 'PlotIX में आपका स्वागत है',
      searchPlaceholder: 'शहर, कॉलोनी, सेक्टर या प्लाट खोजें (जैसे: सेक्टर 82 मोहाली)...',
      notifications: 'सूचनाएं',
      selectLanguage: 'भाषा चुनें',
      changeLocation: 'बदलें',
      listPropertyFree: 'प्रॉपर्टी लिस्ट करें (मुफ़्त)',
      searchIn: 'में खोजें',
      titles: {
        home: { title: 'PlotIX', subtitle: 'DISCOVER.ANALYZE.INVEST' },
        explore: { title: 'प्रॉपर्टी और प्लाट देखें', subtitle: 'पंजाब और हरियाणा में प्रमाणित प्लाट और मकान' },
        map: { title: 'लाइव सैटेलाइट मैप', subtitle: 'ज़मीन की सीमाएं, कलेक्टर रेट और सड़कें देखें' },
        advisor: { title: 'AI ज़मीन सलाहकार', subtitle: 'प्रॉपर्टी का सही दाम, PUDA नियम और कानूनी सलाह तुरंत पाएं' },
        insights: { title: 'मार्केट के ताज़ा भाव', subtitle: 'आपके इलाके में ज़मीन की कीमतों में बढ़ोतरी का ट्रेंड' },
        'my-properties': { title: 'मेरी प्रॉपर्टीज', subtitle: 'आपके द्वारा सेव किए गए प्लाट और मकान' },
        saved: { title: 'सेव किए गए प्लाट', subtitle: 'आपकी पसंद की ज़मीन' },
        messages: { title: 'मैसेज व बातचीत', subtitle: 'प्रॉपर्टी मालिक और डीलरों से सीधा संपर्क' },
        detail: { title: 'प्रॉपर्टी की पूरी जानकारी', subtitle: 'नाप, कीमत, और कानूनी पड़ताल' },
        analysis: { title: 'AI ज़मीन पड़ताल रिपोर्ट', subtitle: 'कीमत का आकलन और मुनाफ़े का स्कोर' },
        'future-potential': { title: 'भविष्य में बढ़ोतरी का अनुमान', subtitle: 'आने वाले हाईवे, मेट्रो और विकास का प्रभाव' },
        'ai-design': { title: 'AI मकान का नक्शा व 3D मॉडल', subtitle: 'सरकारी नियमों के अनुसार कमरों और बालकनी का सटीक नक्शा' },
        'land-calculator': { title: 'ज़मीन नाप व कुल कीमत कैलकुलेटर', subtitle: 'गज, मरला, कनाल, बीघा, किला और एकड़ का आसान हिसाब' },
        'land-records': { title: 'ज़मीनी रिकॉर्ड खोजें', subtitle: 'प्रॉपर्टी की लोकेशन खोजें, कैडस्ट्रल प्लाट देखें और सरकारी जानकारी प्राप्त करें' },
        jamabandi: { title: 'ज़मीनी रिकॉर्ड खोजें', subtitle: 'प्रॉपर्टी की लोकेशन खोजें, कैडस्ट्रल प्लाट देखें और सरकारी जानकारी प्राप्त करें' },
        'planning-maps': { title: 'टाउन प्लानिंग मास्टर मैप्स', subtitle: 'सरकारी मास्टर प्लान और ज़ोनिंग मैप' },
        settings: { title: 'खाता सेटिंग्स', subtitle: 'अपनी पसंद और प्रोफाइल मैनेज करें' },
      },
    },
    home: {
      heroTitle1: 'ज़मीन खरीदें, सही भाव जानें व नक्शा बनाएं।',
      heroTitleGradient: 'बेहद आसान। भरोसेमंद। प्रमाणित।',
      heroSubtitle: 'ज़मीन का सही नाप निकालें, कुल कीमत जानें, 3D मकान का नक्शा बनाएं और जमाबंदी कागज़ात चेक करें — बिना किसी परेशानी के।',
      searchPlaceholder: 'शहर, कॉलोनी, खसरा नंबर या सेक्टर खोजें...',
      popularCities: 'प्रमुख शहर:',
      whatToDoTitle: 'आज आप क्या करना चाहते हैं?',
      whatToDoSubtitle: 'नीचे दिए गए आसान विकल्पों में से चुनें — कोई मुश्किल तकनीकी जानकारी की जरूरत नहीं:',
      tools: {
        calculator: {
          title: 'ज़मीन नापें व कुल कीमत जानें',
          desc: 'गज, मरला, कनाल, बीघा या किला का नाप निकालें और रजिस्ट्री का कुल खर्चा जानें।',
          badge: 'सबसे आसान',
        },
        naksha: {
          title: 'मकान का 2D/3D नक्शा बनाएं',
          desc: 'अपने प्लाट के नाप के अनुसार बैठक, रसोई, बेडरूम और पार्किंग का सुंदर नक्शा बनाएं।',
          badge: 'AI नक्शा',
        },
        advisor: {
          title: 'AI सलाहकार से राय लें',
          desc: 'क्या ज़मीन का मांगा गया दाम सही है? 3 साल में कितना मुनाफ़ा होगा? तुरंत पूछें।',
          badge: 'AI सलाह',
        },
        jamabandi: {
          title: 'जमाबंदी व फर्द चेक करें',
          desc: 'मालिक का असली नाम, खसरा नंबर, दाखिल-खारिज और बैंक लोन की जांच करें।',
          badge: 'सरकारी रिकॉर्ड',
        },
        map: {
          title: 'नक्शे पर ज़मीन देखें',
          desc: 'सैटेलाइट मैप पर कॉलोनियां, सड़कें, सरकारी कलेक्टर रेट व सीमाएं देखें।',
          badge: 'लाइव मैप',
        },
      },
      trendingTitle: '🔥 सबसे ज्यादा मांग वाले इलाके',
      recentTitle: 'हाल ही में देखे गए प्लाट',
      highDemand: 'जबरदस्त मांग',
      exploreBtn: 'इलाका देखें →',
      exploreAllBtn: 'सभी प्रॉपर्टी देखें →',
      intents: {
        buy: 'प्लाट व ज़मीन खरीदें',
        rent: 'किराए पर प्रॉपर्टी',
        plots: 'खेती की ज़मीन',
        commercial: 'कमर्शियल SCO / दुकानें',
      },
      tabs: {
        recommended: 'आपके लिए अनुशंसित',
        new: 'नए लॉन्च',
        popular: 'सबसे लोकप्रिय',
        price_drops: 'घटे हुए दाम',
      },
      matchAssistant: {
        title: '🎯 10-सेकंड प्लाट मैच सहायक',
        subtitle: 'अपनी लोकेशन और बजट बताएं, AI तुरंत प्रमाणित प्लाट ढूंढेगा:',
        step1: '1. पसंदीदा शहर / तहसील',
        step2: '2. अधिकतम बजट',
        step3: '3. प्रॉपर्टी का प्रकार',
        findMatchesBtn: 'प्रमाणित प्लाट खोजें',
        matchingCount: 'प्रमाणित प्लाट आपके बजट और पसंद के अनुसार उपलब्ध हैं',
      },
      emiWidget: {
        title: '🏦 तुरंत प्लाट लोन EMI कैलकुलेटर',
        subtitle: '8.5% ब्याज दर पर अपनी मासिक किश्त का हिसाब लगाएं:',
        propertyPrice: 'प्लाट की कीमत (₹ लाख में)',
        loanTenure: 'लोन की अवधि (साल)',
        interestRate: 'ब्याज दर',
        monthlyEmi: 'मासिक किश्त (EMI)',
        totalInterest: 'कुल देय ब्याज',
        principal: 'मूल लोन राशि (80%)',
        totalPayable: 'बैंक को कुल भुगतान',
      },
      districtIntelTitle: 'ज़िला मार्केट विश्लेषण',
      districtIntelSubtitle: 'सरकारी कलेक्टर रेट व सभी तहसीलों में कीमतों का रुझान',
      avgRate: 'औसत मार्केट रेट',
      circleRate: 'सरकारी सर्कल रेट',
      growth1Yr: '1 साल का उछाल',
      topTehsils: 'प्रमुख तहसीलें व उप-मंडल',
    },
    calculator: {
      title: 'ज़मीन नाप व कुल कीमत कैलकुलेटर',
      subtitle: 'गज, मरला, कनाल, बीघा, किला और एकड़ का तुरंत हिसाब करें और रजिस्ट्री के साथ कुल खर्चा जानें।',
      simpleMode: '⚡ आसान 2-क्लिक मोड',
      advancedMode: '📐 विस्तृत ब्लूप्रिंट मोड',
      modes: {
        area: '📐 ज़मीन नाप व रेट',
        stampDuty: '📜 रजिस्ट्री व स्टाम्प ड्यूटी',
        loan: '🏦 बैंक लोन किश्त (EMI)',
        construction: '🏗️ मकान बनाने का खर्चा',
        blueprint: '⚡ CAD प्लाट ब्लूप्रिंट',
      },
      step1: 'चरण 1: प्लाट का नाप चुनें',
      step2: 'चरण 2: ज़मीन का भाव (रेट) डालें',
      step3: 'चरण 3: कुल कीमत और रजिस्ट्री खर्चा',
      selectPlotSize: 'प्लाट का आम नाप चुनें:',
      customDimensions: 'या अपनी लंबाई × चौड़ाई (फुट में) लिखें:',
      frontage: 'आगे की चौड़ाई (फुट)',
      depth: 'लंबाई / गहराई (फुट)',
      rearWidth: 'पीछे की चौड़ाई (फुट)',
      facing: 'सड़क का रुख (दिशा)',
      ratePerGaj: 'रेट प्रति गज (₹)',
      ratePerMarla: 'रेट प्रति मरला (₹)',
      ratePerSqFt: 'रेट प्रति वर्ग फुट (₹)',
      enterRate: 'ज़मीन का भाव (रेट) लिखें:',
      estimatedValue: 'ज़मीन की कुल अनुमानित कीमत',
      stampDuty: 'रजिस्ट्री व स्टाम्प ड्यूटी खर्चा (लगभग 7%)',
      monthlyEmi: '20 साल के बैंक लोन की मासिक किश्त (EMI)',
      unitConverter: 'इस प्लाट का सभी इकाइयों में नाप:',
      presets: {
        gaj50: '50 गज (छोटा प्लाट)',
        gaj100: '100 गज (स्टैंडर्ड)',
        gaj150: '150 गज (मध्यम)',
        gaj200: '200 गज (लोकप्रिय)',
        gaj250: '250 गज (बड़ा प्लाट)',
        gaj500: '500 गज (कोठी साइज)',
        kanal1: '1 कनाल (20 मरला)',
        bigha1: '1 बीघा (पंजाब/हरियाणा)',
        killa1: '1 किला / एकड़ (8 कनाल)',
      },
      units: {
        gaj: 'गज (वर्ग गज)',
        marla: 'मरला',
        kanal: 'कनाल',
        bigha: 'बीघा',
        biswa: 'बिस्वा',
        killa: 'किला / एकड़',
        acre: 'एकड़',
        sqft: 'वर्ग फुट (Sq.Ft)',
        sqm: 'वर्ग मीटर',
        karam: 'करम (5.5 फुट)',
      },
      vastuVerdict: 'वास्तु दिशा परिणाम',
      vastuScore: 'वास्तु स्कोर',
      maxFloors: 'मंजिल बनाने की सीमा',
      farRules: 'सरकारी नियमों (FAR) के अनुसार कवर्ड एरिया',
      constructionCost: 'मकान निर्माण का अनुमानित खर्चा',
      roadWidth: 'आगे की सड़क की चौड़ाई',
      totalArea: 'कुल नापा गया क्षेत्रफल',
      totalPrice: 'ज़मीन की कुल कीमत',
      calculateBtn: 'कीमत व ब्लूप्रिंट निकालें',
    },
    advisor: {
      title: 'PropWise AI ज़मीन सलाहकार',
      subtitle: 'सरल भाषा में कोई भी सवाल पूछें — कीमत का सही दाम, मकान बनाने के नियम, या कानूनी जांच',
      newChat: 'नया सवाल पूछें',
      previousChats: 'पुरानी बातचीत',
      noChats: 'कोई पुरानी बातचीत नहीं है',
      activeContext: 'चुना हुआ प्लाट / इलाका',
      noContext: 'कोई प्लाट नहीं चुना है। नीचे दिए गए इलाके चुनें या सीधा सवाल पूछें:',
      selectOnMap: 'नक्शे पर प्लाट चुनें',
      sampleLocations: 'जांच के लिए लोकप्रिय इलाके:',
      inputPlaceholder: 'हिंदी, पंजाबी या इंग्लिश में अपना सवाल लिखें...',
      disclaimer: '💡 AI सरकारी मास्टर प्लान और कलेक्टर रेट के आधार पर सलाह देता है। अंतिम निर्णय से पहले वकील से जांच कराएं।',
      modes: {
        all: 'सभी सवाल',
        valuation: 'कीमत व सर्कल रेट',
        naksha: 'मकान का नक्शा व नियम',
        legal: 'कागज़ात व जमाबंदी',
        investment: 'मुनाफ़ा व भविष्य का भाव',
      },
      quickPrompts: {
        growth: {
          title: 'इलाके का विकास व भविष्य',
          desc: 'क्या 3 साल में इस इलाके में भाव बढ़ेंगे? आने वाले हाईवे और प्रोजेक्ट्स देखें।',
        },
        valuation: {
          title: 'सही कीमत व सरकारी रेट',
          desc: 'क्या मांगा गया दाम सही है? सरकारी कलेक्टर रेट से तुलना करें।',
        },
        bylaws: {
          title: 'मकान का नक्शा व सरकारी नियम',
          desc: 'इस प्लाट पर कितने कमरे, मंजिल और पार्किंग बना सकते हैं?',
        },
        legal: {
          title: 'कागज़ात व जमाबंदी जांच',
          desc: 'बयाना देने से पहले कौन-से सरकारी कागज़ चेक करने जरूरी हैं?',
        },
      },
      trendingQuestions: 'अक्सर पूछे जाने वाले सवाल:',
      welcomeTitle: 'आज मैं आपकी प्रॉपर्टी के फैसले में क्या मदद कर सकता हूँ?',
      welcomeDesc: 'किसी भी प्लाट के दाम, सरकारी नियम, नक्शे या रजिस्ट्री के बारे में पूछें।',
      copy: 'कॉपी करें',
      copied: 'कॉपी हो गया!',
      deepen: 'विस्तार से समझाएं',
      send: 'भेजें',
      radarTitle: 'AI इंटेलिजेंस रडार',
      suggestedActions: 'अगले कदम व सुझाव:',
    },
    jamabandi: {
      title: 'जमाबंदी व सरकारी फर्द पड़ताल',
      subtitle: 'अपनी जमाबंदी का फोटो/PDF अपलोड करें या सैंपल फर्द लोड करके असली मालिक और बैंक लोन जांचें।',
      uploadTab: '📄 फर्द / जमाबंदी अपलोड करें',
      searchTab: '🔍 खसरा नंबर से खोजें',
      demoSampleBtn: '⚡ सैंपल फर्द लोड करके देखें (1-क्लिक)',
      dragDropText: 'जमाबंदी PDF या फोटो यहाँ टच करें',
      fileFormats: 'PDF, JPG, PNG फाइल (अधिकतम 10MB)',
      browseBtn: 'फोन या कंप्यूटर से फाइल चुनें',
      analyzingText: 'AI जमाबंदी पढ़ रहा है और तहसील रिकॉर्ड की जांच कर रहा है...',
      ownershipDetails: 'प्रमाणित सरकारी मालिकाना रिकॉर्ड',
      ownerName: 'पंजीकृत मालिक (मालिक का नाम)',
      khewatNo: 'खेवट नंबर',
      khatoniNo: 'खतौनी नंबर',
      khasraNo: 'खसरा नंबर',
      totalArea: 'कुल दर्ज रकबा (ज़मीन का नाप)',
      mutationStatus: 'दाखिल-खारिज स्थिति (इंतकाल)',
      encumbranceStatus: 'बैंक लोन / गिरवी की स्थिति',
      safeToBuy: 'साफ़ रिकॉर्ड — खरीदने के लिए सुरक्षित',
      riskAlert: 'सावधानी — बैंक लोन या विवाद की जांच करें',
      bankMortgage: 'इस ज़मीन पर बैंक लोन दर्ज है',
      noMortgage: 'कोई बैंक लोन नहीं (साफ़ मालिकाना हक)',
      viewOriginal: 'मूल जमाबंदी देखें',
      downloadReport: 'जांच रिपोर्ट डाउनलोड करें',
      uploadAnother: 'दूसरा रिकॉर्ड चेक करें',
      fetchRecord: 'रिकॉर्ड की जांच करें',
      panelTitle: 'सरकारी रिकॉर्ड जांच पैनल',
      panelDesc: 'फर्द अपलोड करें या ऊपर दिया गया सैंपल बटन दबाएं',
    },
    landRecords: {
      title: 'सरकारी ज़मीनी रिकॉर्ड खोजें',
      subtitle: 'प्रॉपर्टी की लोकेशन खोजें, कैडस्ट्रल प्लाट देखें और सरकारी जानकारी प्राप्त करें',
      autoLocate: 'लोकेशन खोजें',
      locating: 'खोज रहा है...',
      searchPlaceholder: 'गांव, तहसील, शहर या कॉलोनी खोजें...',
      trendingLocations: 'प्रमुख इलाके:',
      breadcrumbState: 'राज्य',
      breadcrumbDistrict: 'जिला',
      breadcrumbTehsil: 'तहसील',
      breadcrumbVillage: 'गांव / कॉलोनी',
      breadcrumbParcel: 'कैडस्ट्रल प्लाट',
      selectParcelHint: 'मालिक का नाम और इंतकाल जांचने के लिए नक्शे पर किसी भी प्लाट पर टच करें।',
      noParcelSelected: 'कोई प्लाट नहीं चुना गया। नक्शे पर किसी प्लाट को चुनें।',
      officialStatus: 'राज्य के राजस्व डेटाबेस से कनेक्ट होने पर सरकारी कैडस्ट्रल डेटा और मालिकाना रिकॉर्ड प्राप्त होंगे।',
      disclaimer: '💡 सरकारी कैडस्ट्रल नक्शे केवल संदर्भ के लिए हैं। बयाना देने से पहले तहसील में मूल कागज़ात जांचें।',
      khasraSearchTab: 'खसरा नंबर से खोजें',
      mapTab: 'कैडस्ट्रल मैप व्यू',
      khasraInputPlaceholder: 'खसरा नंबर डालें (जैसे: 145/2/1)',
      searchKhasraBtn: 'रिकॉर्ड खोजें',
      useGps: 'मेरी वर्तमान लोकेशन लें',
    },
    naksha: {
      title: 'AI मकान का नक्शा (2D/3D)',
      subtitle: 'अपने प्लाट के नाप के अनुसार बैठक, रसोई, बेडरूम और बालकनी का सुंदर 3D नक्शा बनाएं।',
      wizardSteps: {
        step1: 'प्लाट व कमरे',
        step2: 'कमरों का नाप',
        step3: 'नक्शा बनाएं',
      },
      view2D: '2D फ्लैट नक्शा',
      view3D: '3D मकान वॉकथ्रू',
      groundFloor: 'ग्राउंड फ्लोर (निचली मंजिल)',
      firstFloor: 'फर्स्ट फ्लोर (पहली मंजिल)',
      secondFloor: 'सेकंड फ्लोर (दूसरी मंजिल)',
      rooms: {
        living: 'बैठक / ड्राइंग रूम',
        kitchen: 'रसोई (किचन)',
        masterBed: 'मास्टर बेडरूम',
        bed2: 'बेडरूम 2',
        bed3: 'बेडरूम 3',
        bath: 'शौचालय / बाथरूम',
        pooja: 'पूजा घर',
        parking: 'कार पार्किंग',
        lawn: 'आगे का लॉन / बगीचा',
        balcony: 'बालकनी',
        dining: 'डाइनिंग एरिया',
      },
      presets: 'प्लाट का साइज चुनें:',
      exportPlan: 'नक्शा PDF डाउनलोड करें',
      aiPromptPlaceholder: 'जैसे: खुली रसोई और बाईं तरफ कार पार्किंग जोड़ें...',
      generateBtn: 'AI से नक्शा अपडेट करें',
      backToWizard: 'वापस जाएं',
      regenerate: 'नया नक्शा बनाएं',
      dimensions: 'प्लाट का नाप',
      facingRoad: 'सड़क का रुख',
    },
    marketInsights: {
      heroTitle: 'मार्केट एनालिटिक्स व सर्कल रेट डायरेक्टरी',
      heroSubtitle: 'अपनी लाइव लोकेशन या नक्शे से क्षेत्र चुनें और सभी कालोनियों व मोहल्लों के सटीक दाम देखें।',
      useGps: 'मेरी वर्तमान लोकेशन लें',
      detectingGps: 'GPS खोज रहा है...',
      searchLocation: 'लोकेशन चुनें / खोजें',
      liveGpsActive: 'लाइव GPS सक्रिय:',
      recalibrate: 'पुनः जांचें',
      interactivePins: 'इंटरैक्टिव मैप पिन',
      hidePins: 'पिन छुपाएं',
      avgMarketRate: 'औसत मार्केट रेट',
      circleBenchmark: 'तहसील सरकारी सर्कल रेट',
      indexedLocations: 'सत्यापित कॉलोनियां',
      buyerDemand: 'खरीदारों की मांग',
      rateTrajectory: '12 महीने का भाव ट्रेंड',
      historicalAppreciation: 'सितंबर 2025 से अगस्त 2026 तक प्रति वर्ग गज बढ़ोतरी',
      coloniesTitle: 'की सभी कालोनियां, सेक्टर व मोहल्ले',
      showingLocalities: 'लाइव रेट के साथ इलाके दिखाए जा रहे हैं',
      searchPlaceholder: 'कॉलोनी, सेक्टर या लैंडमार्क खोजें...',
      sortGrowth: 'क्रम: सबसे अधिक मुनाफा %',
      sortPriceHigh: 'क्रम: सबसे महंगा रेट',
      sortPriceLow: 'क्रम: सबसे कम रेट',
      sortDemand: 'क्रम: खरीदारों की भारी मांग',
      allLocalities: 'सभी इलाके',
      approvedSectors: '🏛️ सरकारी अप्रूव्ड सेक्टर',
      gatedTownships: '🏡 गेटेड टाउनशिप्स',
      freeholdColonies: '📜 फ्रीहोल्ड कालोनियां',
      calcStampDuty: 'रजिस्ट्री खर्चा निकालें',
      askAi: 'AI से इलाके के बारे में पूछें',
    },
    myProperties: {
      title: 'मेरा पोर्टफोलियो व लिस्टिंग्स',
      subtitle: 'बिक्री/किराए के लिए प्रॉपर्टी पोस्ट करें या अपनी खरीद की जरूरत दर्ज करें।',
      brokerTab: '🏢 डीलर / विक्रेता लिस्टिंग',
      buyerTab: '🎯 खरीदार की जरूरत',
      addNewListing: '+ नई प्रॉपर्टी लिस्ट करें',
      postRequirement: '+ खरीद की मांग दर्ज करें',
      noListings: 'अभी कोई प्रॉपर्टी लिस्ट नहीं है। ऊपर दिए गए बटन से पहला प्लाट मुफ़्त में जोड़ें।',
      noRequirements: 'कोई मांग दर्ज नहीं है। प्रमाणित डीलरों को बताएं कि आप क्या खरीदना चाहते हैं।',
      propertyTitle: 'प्रॉपर्टी का नाम / शीर्षक',
      propertyType: 'प्रॉपर्टी का प्रकार',
      intentSale: 'बिक्री के लिए',
      intentRent: 'किराए के लिए',
      district: 'जिला',
      tehsil: 'तहसील / शहर',
      locality: 'कॉलोनी / सेक्टर / लैंडमार्क',
      area: 'प्लाट का नाप / क्षेत्रफल',
      price: 'कीमत / अपेक्षित रेट (₹)',
      khasraNo: 'खसरा नंबर (वैकल्पिक)',
      roadWidth: 'आगे की सड़क की चौड़ाई',
      docStatus: 'कागज़ात की स्थिति',
      contactName: 'संपर्क व्यक्ति का नाम',
      contactPhone: 'मोबाइल नंबर',
      agencyName: 'एजेंसी का नाम (वैकल्पिक)',
      budgetMin: 'न्यूनतम बजट (₹)',
      budgetMax: 'अधिकतम बजट (₹)',
      requiredSize: 'ज़रूरी नाप (गज / मरला / एकड़)',
      purpose: 'खरीदने का उद्देश्य',
      submitListing: 'मुफ़्त में प्रकाशित करें',
      submitRequirement: 'मांग दर्ज करें',
      callContact: 'कॉल करें',
      verifiedBadge: 'प्रमाणित लिस्टिंग',
      deleteListing: 'हटाएं',
      preferredArea: 'पसंदीदा इलाका / सेक्टर',
      minBudget: 'न्यूनतम बजट',
      maxBudget: 'अधिकतम बजट',
      phone: 'फ़ोन नंबर',
      broadcastRequirement: 'ज़रूरत पोस्ट करें',
      myListings: 'मेरी लिस्टिंग्स',
      myRequirements: 'मेरी खरीदार मांगें',
      brokerSellerRole: '🏢 डीलर / विक्रेता लिस्टिंग',
      addAsBroker: '+ नई प्रॉपर्टी लिस्ट करें',
      buyerInvestorRole: '🎯 खरीदार की जरूरत',
      addAsBuyer: '+ खरीद की मांग दर्ज करें',
      askingPrice: 'कीमत / अपेक्षित रेट (₹)',
      roadConnectivity: 'सड़क की कनेक्टिविटी',
      registryStatus: 'रजिस्ट्री स्थिति',
      photos: 'प्रॉपर्टी की फोटो',
      publishListing: 'मुफ़्त में प्रकाशित करें',
      preferredDistrict: 'पसंदीदा जिला',
    },
    explore: {
      title: 'प्रॉपर्टी और प्लाट देखें',
      subtitle: 'पंजाब और हरियाणा में प्रमाणित प्लाट और मकान खोजें',
      locationFilter: 'शहर / लोकेशन',
      typeFilter: 'प्रॉपर्टी का प्रकार',
      maxBudget: 'अधिकतम बजट:',
      verifiedOnly: 'केवल प्रमाणित रजिस्ट्री',
      resetFilters: 'फ़िल्टर हटाएं',
      showingProperties: 'प्रॉपर्टी उपलब्ध हैं',
      noPropertiesFound: 'इस फ़िल्टर में कोई प्रॉपर्टी नहीं मिली। बजट या लोकेशन बदलकर देखें।',
      viewMap: 'मैप व्यू',
      viewGrid: 'ग्रिड',
      viewList: 'लिस्ट',
      sortBy: 'क्रम से लगाएं',
    },
    saved: {
      title: 'सेव किए गए प्लाट',
      subtitle: 'तुलना करने के लिए पसंदीदा प्रॉपर्टीज़',
      noSavedTitle: 'कोई प्रॉपर्टी सेव नहीं है',
      noSavedDesc: 'प्रॉपर्टी देखते समय बुकमार्क आइकन पर टच करके यहाँ सेव करें ताकि बाद में तुलना कर सकें।',
      emptyTitle: 'कोई सेव की गई प्रॉपर्टी नहीं है',
      emptySubtitle: 'प्रमाणित प्रॉपर्टीज देखें और अपने पसंदीदा प्लाट और मकान बुकमार्क करें।',
      browseBtn: 'प्रॉपर्टी देखें',
      exploreMoreBtn: 'और प्रॉपर्टी देखें',
    },
    messages: {
      title: 'मैसेज व बातचीत',
      subtitle: 'प्रमाणित प्लाट मालिकों और डीलरों से सीधा संपर्क',
      unreadCount: 'अनपढ़ी बातचीत',
      unreadConversations: 'अनपढ़ी बातचीत',
      newBadge: 'नया',
      note: 'लाइव बैकएंड से कनेक्ट होने पर तुरंत मैसेजिंग उपलब्ध होगी।',
      secureChatNote: 'लाइव बैकएंड से कनेक्ट होने पर तुरंत मैसेजिंग उपलब्ध होगी।',
    },
    propertyDetail: {
      backToExplore: 'वापस जाएं',
      verifiedBadge: '✓ तहसील व राजस्व प्रमाणित',
      priceBreakdown: 'कीमत व सर्कल रेट का विवरण',
      circleRateComparison: 'सरकारी कलेक्टर रेट से तुलना',
      dimensionsTitle: 'प्लाट का नाप व सड़क का रास्ता',
      amenitiesTitle: 'आसपास की सुविधाएं व दूरी',
      landmarksTitle: 'प्रमुख कनेक्टिविटी केंद्र',
      legalTitle: 'कागज़ात व जमाबंदी जांच',
      contactDealer: 'मालिक / डीलर को कॉल करें',
      saveProperty: 'प्रॉपर्टी सेव करें',
      savedProperty: 'सेव कर लिया गया',
      similarProperties: 'इस इलाके में अन्य प्रॉपर्टीज़',
      askAiAboutThis: 'इस प्रॉपर्टी के बारे में AI से पूछें',
      calculateRegistry: 'रजिस्ट्री खर्चा व किश्त (EMI) निकालें',
    },
    aiAnalysis: {
      backToProperty: 'वापस जाएं',
      demoBanner: 'AI विश्लेषण रिपोर्ट — सरकारी मास्टर प्लान और कलेक्टर रेट के आधार पर तैयार की गई है।',
      scoreTitle: 'PropWise AI ज़मीन पड़ताल स्कोर',
      fairValue: 'उचित बाज़ार मूल्य',
      undervalued: 'सस्ता (शानदार सौदा)',
      overvalued: 'महंगा (दाम कम कराएं)',
      radarPrice: 'कीमत स्कोर',
      radarLocation: 'लोकेशन',
      radarRental: 'किराया मुनाफ़ा',
      radarFuture: 'भविष्य में बढ़ोतरी',
      radarInfra: 'सड़कें व सुविधाएं',
      radarLegal: 'साफ़ कागज़ात',
    },
    futurePotential: {
      backToProperty: 'वापस जाएं',
      timelineTitle: 'इलाके का विकास व मुनाफ़े का अनुमान',
      pastTab: '📅 पुराना इतिहास',
      presentTab: '📍 वर्तमान स्थिति',
      futureTab: '🔭 3 साल का भविष्य',
      upcomingProjects: 'आने वाले मास्टर प्लान प्रोजेक्ट्स',
    },
    planningMaps: {
      title: 'टाउन प्लानिंग मास्टर मैप्स',
      subtitle: 'सरकारी मास्टर प्लान, ज़ोनिंग और विकास कॉरिडोर',
      searchPlaceholder: 'शहर, मास्टर प्लान या औद्योगिक ज़ोन खोजें...',
      categories: {
        all: 'सभी नक्शे',
        masterPlan: 'मास्टर प्लान',
        zoning: 'ज़ोनिंग मैप',
        sectorLayout: 'सेक्टर लेआउट',
        industrial: 'औद्योगिक कॉरिडोर',
      },
      viewGis: 'लाइव GIS मैप देखें',
      inspectBlueprint: 'ब्लूप्रिंट CAD देखें',
      downloadPdf: 'सरकारी PDF डाउनलोड करें',
    },
    profile: {
      title: 'खाता सेटिंग्स व प्राथमिकताएं',
      subtitle: 'भाषा, नाप की इकाइयां और सूचनाएं मैनेज करें',
      kycVerified: 'KYC सत्यापित',
      savedPropertiesCount: 'सेव की गई प्रॉपर्टी',
      nakshaPlansCount: 'AI मकान नक्शे',
      verifiedFardCount: 'जांची गई फर्द',
      languageSection: 'भाषा व क्षेत्रीय बोली',
      unitSection: 'डिफ़ॉल्ट नाप की इकाई',
      notificationsSection: 'सूचना सेटिंग्स',
      pushAlerts: 'नए प्लाट की सूचना पाएं',
      marketAlerts: 'मासिक रेट बढ़ोतरी रिपोर्ट',
      supportSection: 'सहायता केंद्र व हेल्पलाइन',
      helpline: 'टोल-फ्री ज़मीन हेल्पलाइन',
      legalTerms: 'नियम, शर्तें व गोपनीयता नीति',
      savedProperties: 'सेव की गई प्रॉपर्टी',
      aiPlans: 'AI मकान नक्शे',
      verifiedFard: 'जांची गई फर्द',
      preferredUnit: 'पसंदीदा नाप की इकाई',
      notifications: 'सूचनाएं व अलर्ट',
      priceAlerts: 'रेट बढ़ोतरी अलर्ट',
      auctionAlerts: 'नीलामी व मास्टर प्लान अलर्ट',
      workspaceEcosystem: 'वर्कस्पेस शॉर्टकट',
      supportLegal: 'सहायता व कानूनी सहायता',
      consultAdvisor: 'AI सलाहकार से पूछें',
      aboutPropwise: 'PropWise के बारे में',
    },
    common: {
      crore: 'करोड़',
      lakh: 'लाख',
      thousand: 'हज़ार',
      perGaj: '/ गज',
      perSqFt: '/ वर्ग फुट',
      verified: 'सत्यापित',
      unverified: 'असत्यापित',
      loading: 'लोड हो रहा है...',
      clear: 'हटाएं',
      close: 'बंद करें',
      save: 'सेव करें',
      saved: 'सेव हो गया',
      change: 'बदलें',
      viewDetails: 'पूरी जानकारी देखें',
      all: 'सभी',
      any: 'कोई भी',
      cancel: 'रद्द करें',
      confirm: 'पुष्टि करें',
      search: 'खोजें',
      filter: 'फ़िल्टर',
      apply: 'लागू करें',
      reset: 'रीसेट',
      back: 'पीछे',
      next: 'आगे',
      submit: 'जमा करें',
      download: 'डाउनलोड',
      share: 'शेयर करें',
      yes: 'हाँ',
      no: 'नहीं',
      delete: 'हटाएं',
    },
    onboarding: {
      selectLanguageTitle: 'अपनी पसंदीदा भाषा चुनें',
      selectLanguageSubtitle: 'PlotIX का उपयोग करने के लिए भाषा चुनें। इसे आप कभी भी बदल सकते हैं।',
      phoneDetectedBadge: 'आपके फ़ोन के लिए सुझाया गया',
      continueBtn: 'आगे बढ़ें',
      changeLanguageTitle: 'भाषा बदलें',
      smartDiscovery: 'स्मार्ट डिस्कवरी',
      locationTitle: 'आइए आपके आस-पास संपत्तियां खोजें।',
      locationSubtitle: 'आप किस क्षेत्र या शहर में प्रॉपर्टी तलाश रहे हैं?',
      useGpsTitle: 'मेरी वर्तमान लोकेशन का उपयोग करें',
      useGpsSubtitle: 'जिला, तहसील, गांव और नजदीकी प्रॉपर्टी का स्वतः पता लगाएं',
      orSearch: 'या लोकेशन खोजें',
      searchBoxTitle: 'गांव, तहसील, जिला या शहर खोजें',
      searchPlaceholder: 'कोई भी गांव, कॉलोनी, तहसील या जिला लिखें...',
      searching: 'स्थान खोजे जा रहे हैं...',
      noMatchesFound: 'कोई सटीक परिणाम नहीं मिला। कृपया अपना जिला या तहसील नाम लिखें।',
      privacyNote: 'आपकी लोकेशन से हम प्रमाणित प्रॉपर्टीज, स्थानीय मंडियां, गांव व सरकारी सर्कल रेट दिखाते हैं।',
      detectingTitle: 'आपकी लोकेशन खोजी जा रही है...',
      detectingSubtitle: 'कृपया अपने फ़ोन पर लोकेशन की अनुमति दें। हम आपका राज्य, जिला, तहसील और गांव पहचान रहे हैं।',
      searchManuallyInstead: 'हाथ से लोकेशन खोजें',
      gpsErrorTitle: 'हम आपकी लोकेशन नहीं पा सके',
      gpsErrorDesc: 'लोकेशन की अनुमति नहीं मिली या समय समाप्त हो गया। आप हाथ से लोकेशन खोज सकते हैं।',
      tryAgain: 'पुनः प्रयास करें',
      searchLocationBtn: 'लोकेशन खोजें',
      locationDetected: '📍 आपकी वर्तमान लोकेशन मिली',
      locationSelected: '📍 लोकेशन चुनी गई',
      youAreExploring: 'आप खोज रहे हैं',
      verifiedPropertiesCap: 'प्रमाणित ज़मीन व मकान',
      localTehsilsCap: 'तहसील व अनाज मंडियां',
      circleRatesCap: 'सरकारी सर्कल रेट व बाजार भाव',
      startExploringBtn: 'शुरू करें व देखें',
      chooseDifferentLocationBtn: 'दूसरी लोकेशन चुनें',
      languages: {
        en: { name: 'English', nativeName: 'English', desc: 'Real Estate & Land Intelligence', script: 'Latin' },
        hi: { name: 'Hindi', nativeName: 'हिन्दी', desc: 'ज़मीन, रजिस्ट्री व रियल एस्टेट', script: 'Devanagari' },
        pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', desc: 'ਜ਼ਮੀਨ ਰਿਕਾਰਡ, ਨਕਸ਼ਾ ਤੇ ਰੀਅਲ ਅਸਟੇਟ', script: 'Gurmukhi' },
      },
    },
  },

  // ─── PUNJABI (ਪੰਜਾਬੀ) ───────────────────────────────────────────────────────
  pa: {
    nav: {
      home: 'ਹੋਮ (ਮੁੱਖ ਸਫ਼ਾ)',
      map: 'ਲਾਈਵ ਸੈਟੇਲਾਈਟ ਨਕਸ਼ਾ',
      planning: 'ਟਾਊਨ ਪਲਾਨਿੰਗ ਮਾਸਟਰ ਨਕਸ਼ੇ',
      calculator: 'ਜ਼ਮੀਨ ਮਿਣਤੀ ਤੇ ਰੇਟ ਕੈਲਕੁਲੇਟਰ',
      naksha: 'AI ਮਕਾਨ ਦਾ ਨਕਸ਼ਾ (3D)',
      advisor: 'AI ਜ਼ਮੀਨ ਸਲਾਹਕਾਰ',
      landRecords: 'ਸਰਕਾਰੀ ਜ਼ਮੀਨੀ ਰਿਕਾਰਡ',
      jamabandi: 'ਸਰਕਾਰੀ ਜ਼ਮੀਨੀ ਰਿਕਾਰਡ',
      saved: 'ਪਸੰਦੀਦਾ ਪਲਾਟ',
      myProperties: 'ਮੇਰਾ ਪੋਰਟਫੋਲੀਓ',
      messages: 'ਸੁਨੇਹੇ ਤੇ ਗੱਲਬਾਤ',
      settings: 'ਖਾਤਾ ਸੈਟਿੰਗਜ਼',
      explore: 'ਪ੍ਰਾਪਰਟੀਆਂ ਤੇ ਪਲਾਟ ਵੇਖੋ',
      insights: 'ਬਾਜ਼ਾਰ ਭਾਅ ਤੇ ਰੁਝਾਨ',
      discoverSection: 'ਲੱਭੋ ਤੇ ਵੇਖੋ',
      intelligenceSection: 'AI ਤੇ ਬੁੱਧੀਮਾਨ ਟੂਲ',
      toolsSection: 'ਮਿਣਤੀ ਤੇ ਕੈਲਕੁਲੇਟਰ',
      personalSection: 'ਮੇਰਾ ਖਾਤਾ ਤੇ ਸੈਟਿੰਗਾਂ',
      flagshipBadge: 'ਖ਼ਾਸ AI',
      activePlotsBadge: '12+ ਪਲਾਟ',
    },
    header: {
      greeting: 'PlotIX ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ',
      searchPlaceholder: 'ਸ਼ਹਿਰ, ਕਲੋਨੀ, ਸੈਕਟਰ ਜਾਂ ਪਲਾਟ ਲੱਭੋ (ਜਿਵੇਂ: ਸੈਕਟਰ 82 ਮੋਹਾਲੀ)...',
      notifications: 'ਸੂਚਨਾਵਾਂ',
      selectLanguage: 'ਭਾਸ਼ਾ ਚੁਣੋ',
      changeLocation: 'ਬਦਲੋ',
      listPropertyFree: 'ਪ੍ਰਾਪਰਟੀ ਲਿਸਟ ਕਰੋ (ਮੁਫ਼ਤ)',
      searchIn: 'ਵਿੱਚ ਲੱਭੋ',
      titles: {
        home: { title: 'PlotIX', subtitle: 'DISCOVER.ANALYZE.INVEST' },
        explore: { title: 'ਪ੍ਰਾਪਰਟੀਆਂ ਤੇ ਪਲਾਟ ਵੇਖੋ', subtitle: 'ਪੰਜਾਬ ਅਤੇ ਹਰਿਆਣਾ ਦੇ ਪ੍ਰਮਾਣਿਤ ਪਲਾਟ ਅਤੇ ਕੋਠੀਆਂ' },
        map: { title: 'ਲਾਈਵ ਸੈਟੇਲਾਈਟ ਨਕਸ਼ਾ', subtitle: 'ਜ਼ਮੀਨ ਦੀਆਂ ਹੱਦਾਂ, ਕਲੈਕਟਰ ਰੇਟ ਅਤੇ ਸੜਕਾਂ ਵੇਖੋ' },
        advisor: { title: 'AI ਜ਼ਮੀਨ ਸਲਾਹਕਾਰ', subtitle: 'ਸਹੀ ਮੁੱਲ, ਪੁੱਡਾ (PUDA) ਨਿਯਮ ਅਤੇ ਕਾਨੂੰਨੀ ਸਲਾਹ ਤੁਰੰਤ ਲਵੋ' },
        insights: { title: 'ਮਾਰਕੀਟ ਦੇ ਤਾਜ਼ਾ ਭਾਅ', subtitle: 'ਤੁਹਾਡੇ ਇਲਾਕੇ ਵਿੱਚ ਜ਼ਮੀਨਾਂ ਦੀਆਂ ਕੀਮਤਾਂ ਵਿੱਚ ਵਾਧਾ' },
        'my-properties': { title: 'ਮੇਰਾ ਪੋਰਟਫੋਲੀਓ', subtitle: 'ਤੁਹਾਡੇ ਸੇਵ ਕੀਤੇ ਪਲਾਟ ਅਤੇ ਕੋਠੀਆਂ' },
        saved: { title: 'ਮੇਰੇ ਪਸੰਦੀਦਾ ਪਲਾਟ', subtitle: 'ਤੁਹਾਡੀ ਪਸੰਦ ਦੀ ਜ਼ਮੀਨ' },
        messages: { title: 'ਸੁਨੇਹੇ ਤੇ ਗੱਲਬਾਤ', subtitle: 'ਮਾਲਕਾਂ ਅਤੇ ਡੀਲਰਾਂ ਨਾਲ ਸਿੱਧਾ ਸੰਪਰਕ' },
        detail: { title: 'ਪ੍ਰਾਪਰਟੀ ਦੀ ਪੂਰੀ ਜਾਣਕਾਰੀ', subtitle: 'ਮਿਣਤੀ, ਕੀਮਤ ਅਤੇ ਕਾਨੂੰਨੀ ਰਿਪੋਰਟ' },
        analysis: { title: 'AI ਜ਼ਮੀਨ ਜਾਂਚ ਰਿਪੋਰਟ', subtitle: 'ਮੁੱਲ ਦਾ ਅੰਦਾਜ਼ਾ ਅਤੇ ਮੁਨਾਫ਼ੇ ਦਾ ਸਕੋਰ' },
        'future-potential': { title: 'ਭਵਿੱਖ ਵਿੱਚ ਵਾਧੇ ਦਾ ਅੰਦਾਜ਼ਾ', subtitle: 'ਨਵੇਂ ਹਾਈਵੇਅ, ਮੈਟਰੋ ਅਤੇ ਵਿਕਾਸ ਦਾ ਅਸਰ' },
        'ai-design': { title: 'AI ਮਕਾਨ ਦਾ ਨਕਸ਼ਾ ਤੇ 3D ਮਾਡਲ', subtitle: 'ਸਰਕਾਰੀ ਨਿਯਮਾਂ ਮੁਤਾਬਕ ਕਮਰਿਆਂ ਤੇ ਬਾਲਕਨੀ ਦਾ ਸਹੀ ਨਕਸ਼ਾ' },
        'land-calculator': { title: 'ਜ਼ਮੀਨ ਮਿਣਤੀ ਤੇ ਕੁੱਲ ਮੁੱਲ ਕੈਲਕੁਲੇਟਰ', subtitle: 'ਗਜ਼, ਮਰਲੇ, ਕਨਾਲ, ਬਿੱਘੇ, ਕਿੱਲੇ ਤੇ ਏਕੜ ਦਾ ਆਸਾਨ ਹਿਸਾਬ' },
        'land-records': { title: 'ਜ਼ਮੀਨੀ ਰਿਕਾਰਡ ਲੱਭੋ', subtitle: 'ਪ੍ਰਾਪਰਟੀ ਲੋਕੇਸ਼ਨ ਖੋਜੋ, ਕੈਡਸਟਰਲ ਪਲਾਟ ਵੇਖੋ ਤੇ ਸਰਕਾਰੀ ਰਿਕਾਰਡ ਪ੍ਰਾਪਤ ਕਰੋ' },
        jamabandi: { title: 'ਜ਼ਮੀਨੀ ਰਿਕਾਰਡ ਲੱਭੋ', subtitle: 'ਪ੍ਰਾਪਰਟੀ ਲੋਕੇਸ਼ਨ ਖੋਜੋ, ਕੈਡਸਟਰਲ ਪਲਾਟ ਵੇਖੋ ਤੇ ਸਰਕਾਰੀ ਰਿਕਾਰਡ ਪ੍ਰਾਪਤ ਕਰੋ' },
        'planning-maps': { title: 'ਟਾਊਨ ਪਲਾਨਿੰਗ ਮਾਸਟਰ ਨਕਸ਼ੇ', subtitle: 'ਸਰਕਾਰੀ ਮਾਸਟਰ ਪਲਾਨ ਅਤੇ ਜ਼ੋਨਿੰਗ ਦਸਤਾਵੇਜ਼' },
        settings: { title: 'ਖਾਤਾ ਸੈਟਿੰਗਜ਼', subtitle: 'ਆਪਣੀ ਪ੍ਰੋਫਾਈਲ ਅਤੇ ਪਸੰਦ ਸੰਭਾਲੋ' },
      },
    },
    home: {
      heroTitle1: 'ਜ਼ਮੀਨ ਖਰੀਦੋ, ਸਹੀ ਭਾਅ ਜਾਣੋ ਤੇ ਨਕਸ਼ਾ ਬਣਾਓ।',
      heroTitleGradient: 'ਬਹੁਤ ਆਸਾਨ। ਭਰੋਸੇਯੋਗ। ਪ੍ਰਮਾਣਿਤ।',
      heroSubtitle: 'ਜ਼ਮੀਨ ਦੀ ਸਹੀ ਮਿਣਤੀ ਕਰੋ, ਕੁੱਲ ਰੇਟ ਜਾਣੋ, 3D ਮਕਾਨ ਦਾ ਨਕਸ਼ਾ ਤਿਆਰ ਕਰੋ ਤੇ ਜਮ੍ਹਾਂਬੰਦੀ ਚੈੱਕ ਕਰੋ — ਬਿਨਾਂ ਕਿਸੇ ਉਲਝਣ ਦੇ।',
      searchPlaceholder: 'ਸ਼ਹਿਰ, ਕਲੋਨੀ, ਖਸਰਾ ਨੰਬਰ ਜਾਂ ਸੈਕਟਰ ਲੱਭੋ...',
      popularCities: 'ਮੁੱਖ ਸ਼ਹਿਰ:',
      whatToDoTitle: 'ਅੱਜ ਤੁਸੀਂ ਕੀ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?',
      whatToDoSubtitle: 'ਹੇਠਾਂ ਦਿੱਤੇ ਆਸਾਨ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ਚੁਣੋ — ਕਿਸੇ ਤਕਨੀਕੀ ਜਾਣਕਾਰੀ ਦੀ ਲੋੜ ਨਹੀਂ:',
      tools: {
        calculator: {
          title: 'ਜ਼ਮੀਨ ਮਿਣੋ ਤੇ ਕੁੱਲ ਮੁੱਲ ਜਾਣੋ',
          desc: 'ਗਜ਼, ਮਰਲੇ, ਕਨਾਲ, ਬਿੱਘੇ ਜਾਂ ਕਿੱਲੇ ਦੀ ਮਿਣਤੀ ਕਰੋ ਤੇ ਰਜਿਸਟਰੀ ਦਾ ਕੁੱਲ ਖਰਚਾ ਜਾਣੋ।',
          badge: 'ਸਭ ਤੋਂ ਆਸਾਨ',
        },
        naksha: {
          title: 'ਮਕਾਨ ਦਾ 2D/3D ਨਕਸ਼ਾ ਬਣਾਓ',
          desc: 'ਆਪਣੇ ਪਲਾਟ ਦੇ ਸਾਈਜ਼ ਮੁਤਾਬਕ ਬੈਠਕ, ਰਸੋਈ, ਕਮਰੇ ਤੇ ਪਾਰਕਿੰਗ ਦਾ ਨਕਸ਼ਾ ਤਿਆਰ ਕਰੋ।',
          badge: 'AI ਨਕਸ਼ਾ',
        },
        advisor: {
          title: 'AI ਸਲਾਹਕਾਰ ਤੋਂ ਪੁੱਛੋ',
          desc: 'ਕੀ ਮੰਗਿਆ ਰੇਟ ਸਹੀ ਹੈ? 3 ਸਾਲਾਂ ਵਿੱਚ ਕਿੰਨਾ ਮੁਨਾਫ਼ਾ ਹੋਵੇਗਾ? ਤੁਰੰਤ ਜਾਣੋ।',
          badge: 'AI ਸਲਾਹ',
        },
        jamabandi: {
          title: 'ਜਮ੍ਹਾਂਬੰਦੀ ਤੇ ਫ਼ਰਦ ਚੈੱਕ ਕਰੋ',
          desc: 'ਅਸਲ ਮਾਲਕ ਦਾ ਨਾਂ, ਖਸਰਾ ਨੰਬਰ, ਇੰਤਕਾਲ ਅਤੇ ਬੈਂਕ ਲੋਨ ਦੀ ਪੜਤਾਲ ਕਰੋ।',
          badge: 'ਸਰਕਾਰੀ ਰਿਕਾਰਡ',
        },
        map: {
          title: 'ਨਕਸ਼ੇ ਉੱਤੇ ਜ਼ਮੀਨ ਵੇਖੋ',
          desc: 'ਸੈਟੇਲਾਈਟ ਨਕਸ਼ੇ ਉੱਤੇ ਕਲੋਨੀਆਂ, ਸੜਕਾਂ, ਸਰਕਾਰੀ ਕਲੈਕਟਰ ਰੇਟ ਤੇ ਹੱਦਾਂ ਵੇਖੋ।',
          badge: 'ਲਾਈਵ ਨਕਸ਼ਾ',
        },
      },
      trendingTitle: '🔥 ਸਭ ਤੋਂ ਵੱਧ ਮੰਗ ਵਾਲੇ ਇਲਾਕੇ',
      recentTitle: 'ਹਾਲ ਹੀ ਵਿੱਚ ਵੇਖੇ ਗਏ ਪਲਾਟ',
      highDemand: 'ਭਾਰੀ ਮੰਗ',
      exploreBtn: 'ਇਲਾਕਾ ਵੇਖੋ →',
      exploreAllBtn: 'ਸਾਰੀਆਂ ਪ੍ਰਾਪਰਟੀਆਂ ਵੇਖੋ →',
      intents: {
        buy: 'ਪਲਾਟ ਤੇ ਜ਼ਮੀਨ ਖਰੀਦੋ',
        rent: 'ਕਿਰਾਏ ਤੇ ਪ੍ਰਾਪਰਟੀ',
        plots: 'ਖੇਤੀਬਾੜੀ ਜ਼ਮੀਨ',
        commercial: 'ਕਮਰਸ਼ੀਅਲ ਦੁਕਾਨਾਂ ਤੇ SCO',
      },
      tabs: {
        recommended: 'ਤੁਹਾਡੇ ਲਈ ਸਿਫ਼ਾਰਸ਼ੀ',
        new: 'ਨਵੇਂ ਪ੍ਰੋਜੈਕਟ',
        popular: 'ਸਭ ਤੋਂ ਮਸ਼ਹੂਰ',
        price_drops: 'ਘਟੇ ਹੋਏ ਭਾਅ',
      },
      matchAssistant: {
        title: '🎯 10-ਸਕਿੰਟ ਪਲਾਟ ਮੈਚ ਸਹਾਇਕ',
        subtitle: 'ਆਪਣਾ ਇਲਾਕਾ ਅਤੇ ਬਜਟ ਦੱਸੋ, AI ਤੁਰੰਤ ਸਹੀ ਪਲਾਟ ਲੱਭ ਕੇ ਦੇਵੇਗਾ:',
        step1: '1. ਪਸੰਦੀਦਾ ਸ਼ਹਿਰ / ਤਹਿਸੀਲ',
        step2: '2. ਵੱਧ ਤੋਂ ਵੱਧ ਬਜਟ',
        step3: '3. ਪ੍ਰਾਪਰਟੀ ਦੀ ਕਿਸਮ',
        findMatchesBtn: 'ਪ੍ਰਮਾਣਿਤ ਪਲਾਟ ਲੱਭੋ',
        matchingCount: 'ਪ੍ਰਮਾਣਿਤ ਪਲਾਟ ਤੁਹਾਡੇ ਬਜਟ ਅਤੇ ਪਸੰਦ ਮੁਤਾਬਕ ਉਪਲਬਧ ਹਨ',
      },
      emiWidget: {
        title: '🏦 ਤੁਰੰਤ ਪਲਾਟ ਲੋਨ EMI ਕੈਲਕੁਲੇਟਰ',
        subtitle: '8.5% ਵਿਆਜ ਦਰ ਤੇ ਆਪਣੀ ਮਹੀਨਾਵਾਰ ਕਿਸ਼ਤ ਦਾ ਹਿਸਾਬ ਲਗਾਓ:',
        propertyPrice: 'ਪਲਾਟ ਦੀ ਕੀਮਤ (₹ ਲੱਖਾਂ ਵਿੱਚ)',
        loanTenure: 'ਲੋਨ ਦੀ ਮਿਆਦ (ਸਾਲ)',
        interestRate: 'ਵਿਆਜ ਦਰ',
        monthlyEmi: 'ਮਹੀਨਾਵਾਰ ਕਿਸ਼ਤ (EMI)',
        totalInterest: 'ਕੁੱਲ ਵਿਆਜ',
        principal: 'ਅਸਲ ਲੋਨ ਰਕਮ (80%)',
        totalPayable: 'ਬੈਂਕ ਨੂੰ ਕੁੱਲ ਭੁਗਤਾਨ',
      },
      districtIntelTitle: 'ਜ਼ਿਲ੍ਹਾ ਮਾਰਕੀਟ ਵਿਸ਼ਲੇਸ਼ਣ',
      districtIntelSubtitle: 'ਸਰਕਾਰੀ ਕਲੈਕਟਰ ਰੇਟ ਅਤੇ ਸਾਰੀਆਂ ਤਹਿਸੀਲਾਂ ਵਿੱਚ ਕੀਮਤਾਂ ਦਾ ਵਾਧਾ',
      avgRate: 'ਔਸਤ ਮਾਰਕੀਟ ਰੇਟ',
      circleRate: 'ਸਰਕਾਰੀ ਕਲੈਕਟਰ ਰੇਟ',
      growth1Yr: '1 ਸਾਲ ਦਾ ਵਾਧਾ',
      topTehsils: 'ਮੁੱਖ ਤਹਿਸੀਲਾਂ ਤੇ ਇਲਾਕੇ',
    },
    calculator: {
      title: 'ਜ਼ਮੀਨ ਮਿਣਤੀ ਤੇ ਕੁੱਲ ਮੁੱਲ ਕੈਲਕੁਲੇਟਰ',
      subtitle: 'ਗਜ਼, ਮਰਲੇ, ਕਨਾਲ, ਬਿੱਘੇ, ਕਿੱਲੇ ਤੇ ਏਕੜ ਦਾ ਤੁਰੰਤ ਹਿਸਾਬ ਲਗਾਓ ਅਤੇ ਰਜਿਸਟਰੀ ਸਮੇਤ ਕੁੱਲ ਖਰਚਾ ਜਾਣੋ।',
      simpleMode: '⚡ ਆਸਾਨ 2-ਕਲਿੱਕ ਮੋਡ',
      advancedMode: '📐 ਪੂਰਾ ਬਲੂਪ੍ਰਿੰਟ ਮੋਡ',
      modes: {
        area: '📐 ਜ਼ਮੀਨ ਮਿਣਤੀ ਤੇ ਰੇਟ',
        stampDuty: '📜 ਰਜਿਸਟਰੀ ਤੇ ਸਟੈਂਪ ਡਿਊਟੀ',
        loan: '🏦 ਬੈਂਕ ਲੋਨ ਕਿਸ਼ਤ (EMI)',
        construction: '🏗️ ਮਕਾਨ ਬਣਾਉਣ ਦਾ ਖਰਚਾ',
        blueprint: '⚡ CAD ਪਲਾਟ ਬਲੂਪ੍ਰਿੰਟ',
      },
      step1: 'ਕਦਮ 1: ਪਲਾਟ ਦਾ ਸਾਈਜ਼ ਚੁਣੋ',
      step2: 'ਕਦਮ 2: ਜ਼ਮੀਨ ਦਾ ਭਾਅ (ਰੇਟ) ਭਰੋ',
      step3: 'ਕਦਮ 3: ਕੁੱਲ ਕੀਮਤ ਤੇ ਰਜਿਸਟਰੀ ਖਰਚਾ',
      selectPlotSize: 'ਆਮ ਪਲਾਟ ਦਾ ਸਾਈਜ਼ ਚੁਣੋ:',
      customDimensions: 'ਜਾਂ ਆਪਣੀ ਲੰਬਾਈ × ਚੌੜਾਈ (ਫੁੱਟਾਂ ਵਿੱਚ) ਲਿਖੋ:',
      frontage: 'ਅਗਲਾ ਮੱਥਾ / ਚੌੜਾਈ (ਫੁੱਟ)',
      depth: 'ਲੰਬਾਈ / ਡੂੰਘਾਈ (ਫੁੱਟ)',
      rearWidth: 'ਪਿਛਲਾ ਪਾਸਾ / ਚੌੜਾਈ (ਫੁੱਟ)',
      facing: 'ਸੜਕ ਦਾ ਮੁੱਖ (ਦਿਸ਼ਾ)',
      ratePerGaj: 'ਰੇਟ ਪ੍ਰਤੀ ਗਜ਼ (₹)',
      ratePerMarla: 'ਰੇਟ ਪ੍ਰਤੀ ਮਰਲਾ (₹)',
      ratePerSqFt: 'ਰੇਟ ਪ੍ਰਤੀ ਵਰਗ ਫੁੱਟ (₹)',
      enterRate: 'ਜ਼ਮੀਨ ਦਾ ਭਾਅ (ਰੇਟ) ਲਿਖੋ:',
      estimatedValue: 'ਜ਼ਮੀਨ ਦਾ ਕੁੱਲ ਅੰਦਾਜ਼ਨ ਮੁੱਲ',
      stampDuty: 'ਰਜਿਸਟਰੀ ਤੇ ਸਟੈਂਪ ਡਿਊਟੀ ਖਰਚਾ (ਲਗਭਗ 7%)',
      monthlyEmi: '20 ਸਾਲਾਂ ਦੇ ਬੈਂਕ ਲੋਨ ਦੀ ਮਾਸਿਕ ਕਿਸ਼ਤ (EMI)',
      unitConverter: 'ਇਸ ਪਲਾਟ ਦਾ ਸਾਰੀਆਂ ਇਕਾਈਆਂ ਵਿੱਚ ਨਾਪ:',
      presets: {
        gaj50: '50 ਗਜ਼ (ਛੋਟਾ ਪਲਾਟ)',
        gaj100: '100 ਗਜ਼ (ਸਟੈਂਡਰਡ)',
        gaj150: '150 ਗਜ਼ (ਦਰਮਿਆਨਾ)',
        gaj200: '200 ਗਜ਼ (ਮਸ਼ਹੂਰ)',
        gaj250: '250 ਗਜ਼ (ਵੱਡਾ ਪਲਾਟ)',
        gaj500: '500 ਗਜ਼ (ਕੋਠੀ ਸਾਈਜ਼)',
        kanal1: '1 ਕਨਾਲ (20 ਮਰਲੇ)',
        bigha1: '1 ਬਿੱਘਾ (ਪੰਜਾਬ/ਹਰਿਆਣਾ)',
        killa1: '1 ਕਿੱਲਾ / ਏਕੜ (8 ਕਨਾਲ)',
      },
      units: {
        gaj: 'ਗਜ਼ (ਵਰਗ ਗਜ਼)',
        marla: 'ਮਰਲਾ',
        kanal: 'ਕਨਾਲ',
        bigha: 'ਬਿੱਘਾ',
        biswa: 'ਬਿਸਵਾ',
        killa: 'ਕਿੱਲਾ / ਏਕੜ',
        acre: 'ਏਕੜ',
        sqft: 'ਵਰਗ ਫੁੱਟ (Sq.Ft)',
        sqm: 'ਵਰਗ ਮੀਟਰ',
        karam: 'ਕਰਮ (5.5 ਫੁੱਟ)',
      },
      vastuVerdict: 'ਵਾਸਤੂ ਦਿਸ਼ਾ ਨਤੀਜਾ',
      vastuScore: 'ਵਾਸਤੂ ਸਕੋਰ',
      maxFloors: 'ਮੰਜ਼ਿਲਾਂ ਬਣਾਉਣ ਦੀ ਹੱਦ',
      farRules: 'ਪੁੱਡਾ/ਹੁਡਾ ਨਿਯਮਾਂ ਮੁਤਾਬਕ ਕਵਰਡ ਏਰੀਆ (FAR)',
      constructionCost: 'ਮਕਾਨ ਦੀ ਉਸਾਰੀ ਦਾ ਅੰਦਾਜ਼ਨ ਖਰਚਾ',
      roadWidth: 'ਅਗਲੀ ਸੜਕ ਦੀ ਚੌੜਾਈ',
      totalArea: 'ਕੁੱਲ ਮਿਣਿਆ ਰਕਬਾ',
      totalPrice: 'ਜ਼ਮੀਨ ਦੀ ਕੁੱਲ ਕੀਮਤ',
      calculateBtn: 'ਮੁੱਲ ਤੇ ਬਲੂਪ੍ਰਿੰਟ ਕੱਢੋ',
    },
    advisor: {
      title: 'PropWise AI ਜ਼ਮੀਨ ਸਲਾਹਕਾਰ',
      subtitle: 'ਸਿੱਧੀ ਸਾਦੀ ਬੋਲੀ ਵਿੱਚ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛੋ — ਰੇਟ ਦੀ ਪੜਤਾਲ, ਮਕਾਨ ਦੇ ਨਿਯਮ, ਜਾਂ ਕਾਨੂੰਨੀ ਸਲਾਹ',
      newChat: 'ਨਵਾਂ ਸਵਾਲ ਪੁੱਛੋ',
      previousChats: 'ਪਿਛਲੀ ਗੱਲਬਾਤ',
      noChats: 'ਕੋਈ ਪਿਛਲੀ ਗੱਲਬਾਤ ਨਹੀਂ ਹੈ',
      activeContext: 'ਚੁਣਿਆ ਹੋਇਆ ਪਲਾਟ / ਇਲਾਕਾ',
      noContext: 'ਕੋਈ ਪਲਾਟ ਨਹੀਂ ਚੁਣਿਆ। ਹੇਠਾਂ ਦਿੱਤੇ ਇਲਾਕੇ ਚੁਣੋ ਜਾਂ ਸਿੱਧਾ ਸਵਾਲ ਪੁੱਛੋ:',
      selectOnMap: 'ਨਕਸ਼ੇ ਉੱਤੇ ਪਲਾਟ ਚੁਣੋ',
      sampleLocations: 'ਪੜਤਾਲ ਲਈ ਮੁੱਖ ਇਲਾਕੇ:',
      inputPlaceholder: 'ਪੰਜਾਬੀ, ਹਿੰਦੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਆਪਣਾ ਸਵਾਲ ਲਿਖੋ...',
      disclaimer: '💡 AI ਸਰਕਾਰੀ ਮਾਸਟਰ ਪਲਾਨ ਅਤੇ ਕਲੈਕਟਰ ਰੇਟਾਂ ਦੇ ਆਧਾਰ ਤੇ ਸਲਾਹ ਦਿੰਦਾ ਹੈ। ਅੰਤਿਮ ਫੈਸਲੇ ਤੋਂ ਪਹਿਲਾਂ ਵਕੀਲ ਤੋਂ ਤਸਦੀਕ ਕਰਵਾਓ।',
      modes: {
        all: 'ਸਾਰੇ ਸਵਾਲ',
        valuation: 'ਰੇਟ ਤੇ ਸਰਕਾਰੀ ਭਾਅ',
        naksha: 'ਮਕਾਨ ਦਾ ਨਕਸ਼ਾ ਤੇ ਨਿਯਮ',
        legal: 'ਕਾਗਜ਼ਾਤ ਤੇ ਜਮ੍ਹਾਂਬੰਦੀ',
        investment: 'ਮੁਨਾਫ਼ਾ ਤੇ ਭਵਿੱਖ ਦਾ ਵਾਧਾ',
      },
      quickPrompts: {
        growth: {
          title: 'ਇਲਾਕੇ ਦਾ ਵਿਕਾਸ ਤੇ ਭਵਿੱਖ',
          desc: 'ਕੀ 3 ਸਾਲਾਂ ਵਿੱਚ ਇਸ ਇਲਾਕੇ ਵਿੱਚ ਰੇਟ ਵਧਣਗੇ? ਆਉਣ ਵਾਲੇ ਹਾਈਵੇਅ ਤੇ ਪ੍ਰੋਜੈਕਟ ਵੇਖੋ।',
        },
        valuation: {
          title: 'ਸਹੀ ਰੇਟ ਤੇ ਸਰਕਾਰੀ ਭਾਅ',
          desc: 'ਕੀ ਮੰਗਿਆ ਰੇਟ ਜਾਇਜ਼ ਹੈ? ਸਰਕਾਰੀ ਕਲੈਕਟਰ ਰੇਟ ਨਾਲ ਮੁਕਾਬਲਾ ਕਰੋ।',
        },
        bylaws: {
          title: 'ਮਕਾਨ ਦਾ ਨਕਸ਼ਾ ਤੇ ਨਿਯਮ',
          desc: 'ਇਸ ਪਲਾਟ ਉੱਤੇ ਕਿੰਨੇ ਕਮਰੇ, ਮੰਜ਼ਿਲਾਂ ਤੇ ਪਾਰਕਿੰਗ ਬਣ ਸਕਦੀ ਹੈ?',
        },
        legal: {
          title: 'ਕਾਗਜ਼ਾਤ ਤੇ ਜਮ੍ਹਾਂਬੰਦੀ ਜਾਂਚ',
          desc: 'ਬਿਆਨਾ ਦੇਣ ਤੋਂ ਪਹਿਲਾਂ ਕਿਹੜੇ ਸਰਕਾਰੀ ਕਾਗਜ਼ ਚੈੱਕ ਕਰਨੇ ਜ਼ਰੂਰੀ ਹਨ?',
        },
      },
      trendingQuestions: 'ਅਕਸਰ ਪੁੱਛੇ ਜਾਣ ਵਾਲੇ ਸਵਾਲ:',
      welcomeTitle: 'ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਜਾਇਦਾਦ ਦੇ ਫੈਸਲੇ ਵਿੱਚ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?',
      welcomeDesc: 'ਕਿਸੇ ਵੀ ਪਲਾਟ ਦੇ ਭਾਅ, ਸਰਕਾਰੀ ਨਿਯਮਾਂ, ਨਕਸ਼ੇ ਜਾਂ ਰਜਿਸਟਰੀ ਬਾਰੇ ਪੁੱਛੋ।',
      copy: 'ਕਾਪੀ ਕਰੋ',
      copied: 'ਕਾਪੀ ਹੋ ਗਿਆ!',
      deepen: 'ਵਿਸਥਾਰ ਨਾਲ ਸਮਝਾਓ',
      send: 'ਭੇਜੋ',
      radarTitle: 'AI ਇੰਟੈਲੀਜੈਂਸ ਰਡਾਰ',
      suggestedActions: 'ਅਗਲੇ ਕਦਮ ਤੇ ਸੁਝਾਅ:',
    },
    jamabandi: {
      title: 'ਜਮ੍ਹਾਂਬੰਦੀ ਤੇ ਸਰਕਾਰੀ ਫ਼ਰਦ ਪੜਤਾਲ',
      subtitle: 'ਆਪਣੀ ਜਮ੍ਹਾਂਬੰਦੀ ਦੀ ਫੋਟੋ/PDF ਅੱਪਲੋਡ ਕਰੋ ਜਾਂ ਸੈਂਪਲ ਫ਼ਰਦ ਲੋਡ ਕਰਕੇ ਅਸਲ ਮਾਲਕ ਤੇ ਬੈਂਕ ਲੋਨ ਚੈੱਕ ਕਰੋ।',
      uploadTab: '📄 ਫ਼ਰਦ / ਜਮ੍ਹਾਂਬੰਦੀ ਅੱਪਲੋਡ ਕਰੋ',
      searchTab: '🔍 ਖਸਰਾ ਨੰਬਰ ਨਾਲ ਲੱਭੋ',
      demoSampleBtn: '⚡ ਸੈਂਪਲ ਫ਼ਰਦ ਲੋਡ ਕਰਕੇ ਵੇਖੋ (1-ਕਲਿੱਕ)',
      dragDropText: 'ਜਮ੍ਹਾਂਬੰਦੀ PDF ਜਾਂ ਫੋਟੋ ਇੱਥੇ ਟੱਚ ਕਰੋ',
      fileFormats: 'PDF, JPG, PNG ਫ਼ਾਈਲ (ਵੱਧ ਤੋਂ ਵੱਧ 10MB)',
      browseBtn: 'ਫ਼ੋਨ ਜਾਂ ਕੰਪਿਊਟਰ ਵਿੱਚੋਂ ਫ਼ਾਈਲ ਚੁਣੋ',
      analyzingText: 'AI ਜਮ੍ਹਾਂਬੰਦੀ ਪੜ੍ਹ ਰਿਹਾ ਹੈ ਅਤੇ ਤਹਿਸੀਲ ਰਿਕਾਰਡ ਦੀ ਜਾਂਚ ਕਰ ਰਿਹਾ ਹੈ...',
      ownershipDetails: 'ਪ੍ਰਮਾਣਿਤ ਸਰਕਾਰੀ ਮਾਲਕੀ ਰਿਕਾਰਡ',
      ownerName: 'ਦਰਜ ਮਾਲਕ ਦਾ ਨਾਂ (ਮਾਲਕ)',
      khewatNo: 'ਖੇਵਟ ਨੰਬਰ',
      khatoniNo: 'ਖਤੌਨੀ ਨੰਬਰ',
      khasraNo: 'ਖਸਰਾ ਨੰਬਰ',
      totalArea: 'ਕੁੱਲ ਦਰਜ ਰਕਬਾ (ਜ਼ਮੀਨ ਦਾ ਨਾਪ)',
      mutationStatus: 'ਇੰਤਕਾਲ ਸਥਿਤੀ (ਦਾਖ਼ਲ-ਖ਼ਾਰਜ)',
      encumbranceStatus: 'ਬੈਂਕ ਲੋਨ / ਗਹਿਣੇ ਦੀ ਸਥਿਤੀ',
      safeToBuy: 'ਸਾਫ਼ ਰਿਕਾਰਡ — ਖਰੀਦਣ ਲਈ ਸੁਰੱਖਿਅਤ',
      riskAlert: 'ਸਾਵਧਾਨ — ਬੈਂਕ ਲੋਨ ਜਾਂ ਰੋਕ ਦੀ ਜਾਂਚ ਕਰੋ',
      bankMortgage: 'ਇਸ ਜ਼ਮੀਨ ਉੱਤੇ ਬੈਂਕ ਲੋਨ ਦਰਜ ਹੈ',
      noMortgage: 'ਕੋਈ ਬੈਂਕ ਲੋਨ ਨਹੀਂ (ਸਾਫ਼ ਮਾਲਕੀ ਹੱਕ)',
      viewOriginal: 'ਅਸਲ ਜਮ੍ਹਾਂਬੰਦੀ ਵੇਖੋ',
      downloadReport: 'ਜਾਂਚ ਰਿਪੋਰਟ ਡਾਊਨਲੋਡ ਕਰੋ',
      uploadAnother: 'ਦੂਜਾ ਰਿਕਾਰਡ ਚੈੱਕ ਕਰੋ',
      fetchRecord: 'ਰਿਕਾਰਡ ਦੀ ਪੜਤਾਲ ਕਰੋ',
      panelTitle: 'ਸਰਕਾਰੀ ਰਿਕਾਰਡ ਜਾਂਚ ਪੈਨਲ',
      panelDesc: 'ਫ਼ਰਦ ਅੱਪਲੋਡ ਕਰੋ ਜਾਂ ਉੱਪਰ ਦਿੱਤਾ ਸੈਂਪਲ ਬਟਨ ਦਬਾਓ',
    },
    landRecords: {
      title: 'ਸਰਕਾਰੀ ਜ਼ਮੀਨੀ ਰਿਕਾਰਡ ਲੱਭੋ',
      subtitle: 'ਪ੍ਰਾਪਰਟੀ ਲੋਕੇਸ਼ਨ ਖੋਜੋ, ਕੈਡਸਟਰਲ ਪਲਾਟ ਵੇਖੋ ਤੇ ਸਰਕਾਰੀ ਰਿਕਾਰਡ ਪ੍ਰਾਪਤ ਕਰੋ',
      autoLocate: 'ਲੋਕੇਸ਼ਨ ਲੱਭੋ',
      locating: 'ਲੱਭ ਰਿਹਾ ਹੈ...',
      searchPlaceholder: 'ਪਿੰਡ, ਤਹਿਸੀਲ, ਸ਼ਹਿਰ ਜਾਂ ਕਲੋਨੀ ਲੱਭੋ...',
      trendingLocations: 'ਮੁੱਖ ਇਲਾਕੇ:',
      breadcrumbState: 'ਸੂਬਾ',
      breadcrumbDistrict: 'ਜ਼ਿਲ੍ਹਾ',
      breadcrumbTehsil: 'ਤਹਿਸੀਲ',
      breadcrumbVillage: 'ਪਿੰਡ / ਕਲੋਨੀ',
      breadcrumbParcel: 'ਕੈਡਸਟਰਲ ਪਲਾਟ',
      selectParcelHint: 'ਮਾਲਕ ਦਾ ਨਾਂ ਅਤੇ ਇੰਤਕਾਲ ਵੇਖਣ ਲਈ ਨਕਸ਼ੇ ਉੱਤੇ ਕਿਸੇ ਵੀ ਪਲਾਟ ਉੱਤੇ ਟੱਚ ਕਰੋ।',
      noParcelSelected: 'ਕੋਈ ਪਲਾਟ ਨਹੀਂ ਚੁਣਿਆ। ਨਕਸ਼ੇ ਉੱਤੇ ਕਿਸੇ ਪਲਾਟ ਨੂੰ ਚੁਣੋ।',
      officialStatus: 'ਸੂਬੇ ਦੇ ਮਾਲ ਰਿਕਾਰਡ ਡਾਟਾਬੇਸ ਨਾਲ ਜੁੜਨ ਤੇ ਸਰਕਾਰੀ ਕੈਡਸਟਰਲ ਡਾਟਾ ਅਤੇ ਮਾਲਕੀ ਰਿਕਾਰਡ ਮਿਲਣਗੇ।',
      disclaimer: '💡 ਸਰਕਾਰੀ ਕੈਡਸਟਰਲ ਨਕਸ਼ੇ ਸਿਰਫ਼ ਜਾਣਕਾਰੀ ਲਈ ਹਨ। ਬਿਆਨਾ ਦੇਣ ਤੋਂ ਪਹਿਲਾਂ ਤਹਿਸੀਲ ਵਿੱਚ ਅਸਲ ਕਾਗਜ਼ਾਤ ਚੈੱਕ ਕਰੋ।',
      khasraSearchTab: 'ਖਸਰਾ ਨੰਬਰ ਨਾਲ ਲੱਭੋ',
      mapTab: 'ਕੈਡਸਟਰਲ ਨਕਸ਼ਾ',
      khasraInputPlaceholder: 'ਖਸਰਾ ਨੰਬਰ ਭਰੋ (ਜਿਵੇਂ: 145/2/1)',
      searchKhasraBtn: 'ਰਿਕਾਰਡ ਲੱਭੋ',
      useGps: 'ਮੇਰੀ ਮੌਜੂਦਾ ਲੋਕੇਸ਼ਨ ਲਵੋ',
    },
    naksha: {
      title: 'AI ਮਕਾਨ ਦਾ ਨਕਸ਼ਾ (2D/3D)',
      subtitle: 'ਆਪਣੇ ਪਲਾਟ ਦੇ ਸਾਈਜ਼ ਮੁਤਾਬਕ ਬੈਠਕ, ਰਸੋਈ, ਕਮਰੇ ਤੇ ਬਾਲਕਨੀ ਦਾ ਸੋਹਣਾ 3D ਨਕਸ਼ਾ ਤਿਆਰ ਕਰੋ।',
      wizardSteps: {
        step1: 'ਪਲਾਟ ਤੇ ਕਮਰੇ',
        step2: 'ਕਮਰਿਆਂ ਦਾ ਸਾਈਜ਼',
        step3: 'ਨਕਸ਼ਾ ਤਿਆਰ ਕਰੋ',
      },
      view2D: '2D ਫਲੈਟ ਨਕਸ਼ਾ',
      view3D: '3D ਮਕਾਨ ਵਾਕਥਰੂ',
      groundFloor: 'ਗਰਾਊਂਡ ਫਲੋਰ (ਹੇਠਲੀ ਮੰਜ਼ਿਲ)',
      firstFloor: 'ਫਸਟ ਫਲੋਰ (ਪਹਿਲੀ ਮੰਜ਼ਿਲ)',
      secondFloor: 'ਸੈਕੰਡ ਫਲੋਰ (ਦੂਜੀ ਮੰਜ਼ਿਲ)',
      rooms: {
        living: 'ਬੈਠਕ / ਡਰਾਇੰਗ ਰੂਮ',
        kitchen: 'ਰਸੋਈ (ਕਿਚਨ)',
        masterBed: 'ਮਾਸਟਰ ਬੈੱਡਰੂਮ',
        bed2: 'ਕਮਰਾ 2',
        bed3: 'ਕਮਰਾ 3',
        bath: 'ਗੁਸਲਖਾਨਾ / ਬਾਥਰੂਮ',
        pooja: 'ਪੂਜਾ ਘਰ / ਪਾਠ ਕਮਰਾ',
        parking: 'ਕਾਰ ਪਾਰਕਿੰਗ',
        lawn: 'ਅਗਲਾ ਲਾਅਨ / ਬਗੀਚਾ',
        balcony: 'ਬਾਲਕਨੀ',
        dining: 'ਡਾਇਨਿੰਗ ਏਰੀਆ',
      },
      presets: 'ਪਲਾਟ ਦਾ ਸਾਈਜ਼ ਚੁਣੋ:',
      exportPlan: 'ਨਕਸ਼ਾ PDF ਡਾਊਨਲੋਡ ਕਰੋ',
      aiPromptPlaceholder: 'ਜਿਵੇਂ: ਖੁੱਲ੍ਹੀ ਰਸੋਈ ਅਤੇ ਖੱਬੇ ਪਾਸੇ ਕਾਰ ਪਾਰਕਿੰਗ ਜੋੜੋ...',
      generateBtn: 'AI ਨਾਲ ਨਕਸ਼ਾ ਅੱਪਡੇਟ ਕਰੋ',
      backToWizard: 'ਵਾਪਸ ਜਾਓ',
      regenerate: 'ਨਵਾਂ ਨਕਸ਼ਾ ਬਣਾਓ',
      dimensions: 'ਪਲਾਟ ਦਾ ਨਾਪ',
      facingRoad: 'ਸੜਕ ਦਾ ਮੁੱਖ',
    },
    marketInsights: {
      heroTitle: 'ਮਾਰਕੀਟ ਵਿਸ਼ਲੇਸ਼ਣ ਤੇ ਕਲੈਕਟਰ ਰੇਟ ਡਾਇਰੈਕਟਰੀ',
      heroSubtitle: 'ਆਪਣੀ ਲਾਈਵ ਲੋਕੇਸ਼ਨ ਜਾਂ ਨਕਸ਼ੇ ਤੋਂ ਖੇਤਰ ਚੁਣੋ ਅਤੇ ਸਾਰੀਆਂ ਕਾਲੋਨੀਆਂ ਦੇ ਰੇਟ ਦੇਖੋ।',
      useGps: 'ਮੇਰੀ ਮੌਜੂਦਾ ਲੋਕੇਸ਼ਨ ਲਵੋ',
      detectingGps: 'GPS ਲੱਭ ਰਿਹਾ ਹੈ...',
      searchLocation: 'ਲੋਕੇਸ਼ਨ ਚੁਣੋ / ਲੱਭੋ',
      liveGpsActive: 'ਲਾਈਵ GPS ਚਾਲੂ:',
      recalibrate: 'ਦੁਬਾਰਾ ਜਾਂਚੋ',
      interactivePins: 'ਨਕਸ਼ੇ ਦੀਆਂ ਪਿੰਨਾਂ',
      hidePins: 'ਪਿੰਨਾਂ ਲੁਕਾਓ',
      avgMarketRate: 'ਔਸਤ ਮਾਰਕੀਟ ਰੇਟ',
      circleBenchmark: 'ਤਹਿਸੀਲ ਸਰਕਾਰੀ ਕਲੈਕਟਰ ਰੇਟ',
      indexedLocations: 'ਸੂਚੀਬੱਧ ਕਲੋਨੀਆਂ',
      buyerDemand: 'ਖਰੀਦਦਾਰਾਂ ਦੀ ਮੰਗ',
      rateTrajectory: '12 ਮਹੀਨਿਆਂ ਦਾ ਰੇਟ ਰੁਝਾਨ',
      historicalAppreciation: 'ਸਤੰਬਰ 2025 ਤੋਂ ਅਗਸਤ 2026 ਤੱਕ ਪ੍ਰਤੀ ਵਰਗ ਗਜ਼ ਵਾਧਾ',
      coloniesTitle: 'ਦੀਆਂ ਸਾਰੀਆਂ ਕਾਲੋਨੀਆਂ, ਸੈਕਟਰ ਤੇ ਮੁਹੱਲੇ',
      showingLocalities: 'ਲਾਈਵ ਰੇਟਾਂ ਵਾਲੇ ਇਲਾਕੇ ਵਿਖਾਏ ਜਾ ਰਹੇ ਹਨ',
      searchPlaceholder: 'ਕਾਲੋਨੀ, ਸੈਕਟਰ ਜਾਂ ਲੈਂਡਮਾਰਕ ਲੱਭੋ...',
      sortGrowth: 'ਲੜੀ: ਸਭ ਤੋਂ ਵੱਧ ਮੁਨਾਫ਼ਾ %',
      sortPriceHigh: 'ਲੜੀ: ਸਭ ਤੋਂ ਵੱਧ ਰੇਟ',
      sortPriceLow: 'ਲੜੀ: ਸਭ ਤੋਂ ਘੱਟ ਰੇਟ',
      sortDemand: 'ਲੜੀ: ਖਰੀਦਦਾਰਾਂ ਦੀ ਭਾਰੀ ਮੰਗ',
      allLocalities: 'ਸਾਰੇ ਇਲਾਕੇ',
      approvedSectors: '🏛️ ਸਰਕਾਰੀ ਅਪਰੂਵਡ ਸੈਕਟਰ',
      gatedTownships: '🏡 ਗੇਟਡ ਟਾਊਨਸ਼ਿਪਾਂ',
      freeholdColonies: '📜 ਫ੍ਰੀਹੋਲਡ ਕਲੋਨੀਆਂ',
      calcStampDuty: 'ਰਜਿਸਟਰੀ ਖਰਚਾ ਕੱਢੋ',
      askAi: 'AI ਤੋਂ ਇਲਾਕੇ ਬਾਰੇ ਪੁੱਛੋ',
    },
    myProperties: {
      title: 'ਮੇਰਾ ਪੋਰਟਫੋਲੀਓ ਤੇ ਲਿਸਟਿੰਗਾਂ',
      subtitle: 'ਵੇਚਣ/ਕਿਰਾਏ ਲਈ ਪ੍ਰਾਪਰਟੀ ਪਾਓ ਜਾਂ ਆਪਣੀ ਖਰੀਦ ਦੀ ਮੰਗ ਦਰਜ ਕਰੋ।',
      brokerTab: '🏢 ਡੀਲਰ / ਵਿਕਰੇਤਾ ਲਿਸਟਿੰਗ',
      buyerTab: '🎯 ਖਰੀਦਦਾਰ ਦੀ ਮੰਗ',
      addNewListing: '+ ਨਵੀਂ ਪ੍ਰਾਪਰਟੀ ਲਿਸਟ ਕਰੋ',
      postRequirement: '+ ਖਰੀਦ ਦੀ ਮੰਗ ਪਾਓ',
      noListings: 'ਅਜੇ ਕੋਈ ਪ੍ਰਾਪਰਟੀ ਲਿਸਟ ਨਹੀਂ ਹੈ। ਉੱਪਰ ਦਿੱਤੇ ਬਟਨ ਨਾਲ ਪਹਿਲਾ ਪਲਾਟ ਮੁਫ਼ਤ ਸ਼ਾਮਲ ਕਰੋ।',
      noRequirements: 'ਕੋਈ ਮੰਗ ਦਰਜ ਨਹੀਂ ਹੈ। ਪ੍ਰਮਾਣਿਤ ਡੀਲਰਾਂ ਨੂੰ ਦੱਸੋ ਕਿ ਤੁਸੀਂ ਕੀ ਖਰੀਦਣਾ ਚਾਹੁੰਦੇ ਹੋ।',
      propertyTitle: 'ਪ੍ਰਾਪਰਟੀ ਦਾ ਨਾਂ / ਸਿਰਲੇਖ',
      propertyType: 'ਪ੍ਰਾਪਰਟੀ ਦੀ ਕਿਸਮ',
      intentSale: 'ਵੇਚਣ ਲਈ',
      intentRent: 'ਕਿਰਾਏ ਲਈ',
      district: 'ਜ਼ਿਲ੍ਹਾ',
      tehsil: 'ਤਹਿਸੀਲ / ਸ਼ਹਿਰ',
      locality: 'ਕਲੋਨੀ / ਸੈਕਟਰ / ਲੈਂਡਮਾਰਕ',
      area: 'ਪਲਾਟ ਦਾ ਸਾਈਜ਼ / ਰਕਬਾ',
      price: 'ਕੀਮਤ / ਮੰਗਿਆ ਰੇਟ (₹)',
      khasraNo: 'ਖਸਰਾ ਨੰਬਰ (ਚੋਣਵਾਂ)',
      roadWidth: 'ਅਗਲੀ ਸੜਕ ਦੀ ਚੌੜਾਈ',
      docStatus: 'ਕਾਗਜ਼ਾਤ ਦੀ ਸਥਿਤੀ',
      contactName: 'ਸੰਪਰਕ ਵਿਅਕਤੀ ਦਾ ਨਾਂ',
      contactPhone: 'ਮੋਬਾਈਲ ਨੰਬਰ',
      agencyName: 'ਏਜੰਸੀ ਦਾ ਨਾਂ (ਚੋਣਵਾਂ)',
      budgetMin: 'ਘੱਟੋ-ਘੱਟ ਬਜਟ (₹)',
      budgetMax: 'ਵੱਧ ਤੋਂ ਵੱਧ ਬਜਟ (₹)',
      requiredSize: 'ਲੋੜੀਂਦਾ ਸਾਈਜ਼ (ਗਜ਼ / ਮਰਲੇ / ਏਕੜ)',
      purpose: 'ਖਰੀਦਣ ਦਾ ਮਕਸਦ',
      submitListing: 'ਮੁਫ਼ਤ ਵਿੱਚ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ',
      submitRequirement: 'ਮੰਗ ਦਰਜ ਕਰੋ',
      callContact: 'ਕਾਲ ਕਰੋ',
      verifiedBadge: 'ਪ੍ਰਮਾਣਿਤ ਲਿਸਟਿੰਗ',
      deleteListing: 'ਹਟਾਓ',
      preferredArea: 'ਪਸੰਦੀਦਾ ਇਲਾਕਾ / ਸੈਕਟਰ',
      minBudget: 'ਘੱਟੋ-ਘੱਟ ਬਜਟ',
      maxBudget: 'ਵੱਧ ਤੋਂ ਵੱਧ ਬਜਟ',
      phone: 'ਫ਼ੋਨ ਨੰਬਰ',
      broadcastRequirement: 'ਲੋੜ ਪੋਸਟ ਕਰੋ',
      myListings: 'ਮੇਰੀਆਂ ਲਿਸਟਿੰਗਾਂ',
      myRequirements: 'ਮੇਰੀਆਂ ਖਰੀਦਦਾਰ ਮੰਗਾਂ',
      brokerSellerRole: '🏢 ਡੀਲਰ / ਵੇਚਣ ਵਾਲੇ ਦੀਆਂ ਲਿਸਟਿੰਗਾਂ',
      addAsBroker: '+ ਨਵੀਂ ਪ੍ਰਾਪਰਟੀ ਲਿਸਟ ਕਰੋ',
      buyerInvestorRole: '🎯 ਖਰੀਦਦਾਰ ਦੀ ਲੋੜ',
      addAsBuyer: '+ ਖਰੀਦ ਦੀ ਮੰਗ ਦਰਜ ਕਰੋ',
      askingPrice: 'ਮੁੱਲ / ਮੰਗਿਆ ਰੇਟ (₹)',
      roadConnectivity: 'ਸੜਕ ਦਾ ਰਸਤਾ',
      registryStatus: 'ਰਜਿਸਟਰੀ ਸਥਿਤੀ',
      photos: 'ਪ੍ਰਾਪਰਟੀ ਦੀਆਂ ਫੋਟੋਆਂ',
      publishListing: 'ਮੁਫ਼ਤ ਵਿੱਚ ਲਿਸਟ ਕਰੋ',
      preferredDistrict: 'ਪਸੰਦੀਦਾ ਜ਼ਿਲ੍ਹਾ',
    },
    explore: {
      title: 'ਪ੍ਰਾਪਰਟੀਆਂ ਤੇ ਪਲਾਟ ਵੇਖੋ',
      subtitle: 'ਪੰਜਾਬ ਅਤੇ ਹਰਿਆਣਾ ਵਿੱਚ ਪ੍ਰਮਾਣਿਤ ਪਲਾਟ ਅਤੇ ਕੋਠੀਆਂ ਲੱਭੋ',
      locationFilter: 'ਸ਼ਹਿਰ / ਇਲਾਕਾ',
      typeFilter: 'ਪ੍ਰਾਪਰਟੀ ਕਿਸਮ',
      maxBudget: 'ਵੱਧ ਤੋਂ ਵੱਧ ਬਜਟ:',
      verifiedOnly: 'ਸਿਰਫ਼ ਪ੍ਰਮਾਣਿਤ ਰਜਿਸਟਰੀ',
      resetFilters: 'ਫ਼ਿਲਟਰ ਹਟਾਓ',
      showingProperties: 'ਪ੍ਰਾਪਰਟੀਆਂ ਮਿਲੀਆਂ',
      noPropertiesFound: 'ਇਸ ਫ਼ਿਲਟਰ ਵਿੱਚ ਕੋਈ ਪ੍ਰਾਪਰਟੀ ਨਹੀਂ ਮਿਲੀ। ਬਜਟ ਜਾਂ ਇਲਾਕਾ ਬਦਲ ਕੇ ਵੇਖੋ।',
      viewMap: 'ਨਕਸ਼ਾ ਵੇਖੋ',
      viewGrid: 'ਗ੍ਰਿਡ',
      viewList: 'ਲਿਸਟ',
      sortBy: 'ਤਰਤੀਬ ਦਿਓ',
    },
    saved: {
      title: 'ਮੇਰੇ ਪਸੰਦੀਦਾ ਪਲਾਟ',
      subtitle: 'ਮੁਕਾਬਲਾ ਕਰਨ ਲਈ ਸੇਵ ਕੀਤੀਆਂ ਪ੍ਰਾਪਰਟੀਆਂ',
      noSavedTitle: 'ਕੋਈ ਪ੍ਰਾਪਰਟੀ ਸੇਵ ਨਹੀਂ ਕੀਤੀ',
      noSavedDesc: 'ਪ੍ਰਾਪਰਟੀ ਵੇਖਦੇ ਸਮੇਂ ਬੁੱਕਮਾਰਕ ਆਈਕਨ ਤੇ ਟੱਚ ਕਰਕੇ ਇੱਥੇ ਸੇਵ ਕਰੋ ਤਾਂ ਜੋ ਬਾਅਦ ਵਿੱਚ ਤੁਲਨਾ ਕਰ ਸਕੋ।',
      emptyTitle: 'ਕੋਈ ਸੇਵ ਕੀਤੀ ਪ੍ਰਾਪਰਟੀ ਨਹੀਂ ਹੈ',
      emptySubtitle: 'ਤਸਦੀਕਸ਼ੁਦਾ ਪ੍ਰਾਪਰਟੀਆਂ ਵੇਖੋ ਅਤੇ ਆਪਣੇ ਪਸੰਦੀਦਾ ਪਲਾਟ ਸੇਵ ਕਰੋ।',
      browseBtn: 'ਪ੍ਰਾਪਰਟੀਆਂ ਵੇਖੋ',
      exploreMoreBtn: 'ਹੋਰ ਪ੍ਰਾਪਰਟੀਆਂ ਵੇਖੋ',
    },
    messages: {
      title: 'ਸੁਨੇਹੇ ਤੇ ਗੱਲਬਾਤ',
      subtitle: 'ਪ੍ਰਮਾਣਿਤ ਮਾਲਕਾਂ ਅਤੇ ਡੀਲਰਾਂ ਨਾਲ ਸਿੱਧਾ ਸੰਪਰਕ',
      unreadCount: 'ਅਣਪੜ੍ਹੀ ਗੱਲਬਾਤ',
      unreadConversations: 'ਅਣਪੜ੍ਹੀ ਗੱਲਬਾਤ',
      newBadge: 'ਨਵਾਂ',
      note: 'ਲਾਈਵ ਬੈਕਐਂਡ ਨਾਲ ਜੁੜਨ ਤੇ ਤੁਰੰਤ ਮੈਸੇਜਿੰਗ ਉਪਲਬਧ ਹੋਵੇਗੀ।',
      secureChatNote: 'ਲਾਈਵ ਬੈਕਐਂਡ ਨਾਲ ਜੁੜਨ ਤੇ ਤੁਰੰਤ ਮੈਸੇਜਿੰਗ ਉਪਲਬਧ ਹੋਵੇਗੀ।',
    },
    propertyDetail: {
      backToExplore: 'ਵਾਪਸ ਜਾਓ',
      verifiedBadge: '✓ ਤਹਿਸੀਲ ਤੇ ਮਾਲ ਰਿਕਾਰਡ ਪ੍ਰਮਾਣਿਤ',
      priceBreakdown: 'ਕੀਮਤ ਤੇ ਕਲੈਕਟਰ ਰੇਟ ਦਾ ਵੇਰਵਾ',
      circleRateComparison: 'ਸਰਕਾਰੀ ਕਲੈਕਟਰ ਰੇਟ ਨਾਲ ਮੁਕਾਬਲਾ',
      dimensionsTitle: 'ਪਲਾਟ ਦਾ ਨਾਪ ਤੇ ਸੜਕ ਦਾ ਰਸਤਾ',
      amenitiesTitle: 'ਨੇੜਲੀਆਂ ਸਹੂਲਤਾਂ ਤੇ ਦੂਰੀ',
      landmarksTitle: 'ਮੁੱਖ ਕਨੈਕਟੀਵਿਟੀ ਕੇਂਦਰ',
      legalTitle: 'ਕਾਗਜ਼ਾਤ ਤੇ ਜਮ੍ਹਾਂਬੰਦੀ ਜਾਂਚ',
      contactDealer: 'ਮਾਲਕ / ਡੀਲਰ ਨੂੰ ਕਾਲ ਕਰੋ',
      saveProperty: 'ਪ੍ਰਾਪਰਟੀ ਸੇਵ ਕਰੋ',
      savedProperty: 'ਸੇਵ ਹੋ ਗਈ',
      similarProperties: 'ਇਸ ਇਲਾਕੇ ਵਿੱਚ ਹੋਰ ਪ੍ਰਾਪਰਟੀਆਂ',
      askAiAboutThis: 'ਇਸ ਪ੍ਰਾਪਰਟੀ ਬਾਰੇ AI ਤੋਂ ਪੁੱਛੋ',
      calculateRegistry: 'ਰਜਿਸਟਰੀ ਖਰਚਾ ਤੇ ਕਿਸ਼ਤ (EMI) ਕੱਢੋ',
    },
    aiAnalysis: {
      backToProperty: 'ਵਾਪਸ ਜਾਓ',
      demoBanner: 'AI ਵਿਸ਼ਲੇਸ਼ਣ ਰਿਪੋਰਟ — ਸਰਕਾਰੀ ਮਾਸਟਰ ਪਲਾਨ ਅਤੇ ਕਲੈਕਟਰ ਰੇਟਾਂ ਦੇ ਆਧਾਰ ਤੇ ਤਿਆਰ ਕੀਤੀ ਗਈ ਹੈ।',
      scoreTitle: 'PropWise AI ਜ਼ਮੀਨ ਜਾਂਚ ਸਕੋਰ',
      fairValue: 'ਸਹੀ ਬਾਜ਼ਾਰ ਮੁੱਲ',
      undervalued: 'ਸਸਤਾ (ਲਾਭਦਾਇਕ ਸੌਦਾ)',
      overvalued: 'ਮਹਿੰਗਾ (ਰੇਟ ਘਟਾਓ)',
      radarPrice: 'ਕੀਮਤ ਸਕੋਰ',
      radarLocation: 'ਲੋਕੇਸ਼ਨ',
      radarRental: 'ਕਿਰਾਇਆ ਮੁਨਾਫ਼ਾ',
      radarFuture: 'ਭਵਿੱਖ ਵਿੱਚ ਵਾਧਾ',
      radarInfra: 'ਸੜਕਾਂ ਤੇ ਸਹੂਲਤਾਂ',
      radarLegal: 'ਸਾਫ਼ ਕਾਗਜ਼ਾਤ',
    },
    futurePotential: {
      backToProperty: 'ਵਾਪਸ ਜਾਓ',
      timelineTitle: 'ਇਲਾਕੇ ਦਾ ਵਿਕਾਸ ਤੇ ਮੁਨਾਫ਼ੇ ਦਾ ਅੰਦਾਜ਼ਾ',
      pastTab: '📅 ਪਿਛਲਾ ਇਤਿਹਾਸ',
      presentTab: '📍 ਮੌਜੂਦਾ ਹਾਲਤ',
      futureTab: '🔭 3 ਸਾਲਾਂ ਦਾ ਭਵਿੱਖ',
      upcomingProjects: 'ਆਉਣ ਵਾਲੇ ਮਾਸਟਰ ਪਲਾਨ ਪ੍ਰੋਜੈਕਟ',
    },
    planningMaps: {
      title: 'ਟਾਊਨ ਪਲਾਨਿੰਗ ਮਾਸਟਰ ਨਕਸ਼ੇ',
      subtitle: 'ਸਰਕਾਰੀ ਮਾਸਟਰ ਪਲਾਨ, ਜ਼ੋਨਿੰਗ ਅਤੇ ਵਿਕਾਸ ਕੋਰੀਡੋਰ',
      searchPlaceholder: 'ਸ਼ਹਿਰ, ਮਾਸਟਰ ਪਲਾਨ ਜਾਂ ਇੰਡਸਟਰੀਅਲ ਜ਼ੋਨ ਲੱਭੋ...',
      categories: {
        all: 'ਸਾਰੇ ਨਕਸ਼ੇ',
        masterPlan: 'ਮਾਸਟਰ ਪਲਾਨ',
        zoning: 'ਜ਼ੋਨਿੰਗ ਨਕਸ਼ਾ',
        sectorLayout: 'ਸੈਕਟਰ ਲੇਆਊਟ',
        industrial: 'ਇੰਡਸਟਰੀਅਲ ਕੋਰੀਡੋਰ',
      },
      viewGis: 'ਲਾਈਵ GIS ਨਕਸ਼ਾ ਵੇਖੋ',
      inspectBlueprint: 'ਬਲੂਪ੍ਰਿੰਟ CAD ਵੇਖੋ',
      downloadPdf: 'ਸਰਕਾਰੀ PDF ਡਾਊਨਲੋਡ ਕਰੋ',
    },
    profile: {
      title: 'ਖਾਤਾ ਸੈਟਿੰਗਜ਼ ਤੇ ਪਸੰਦ',
      subtitle: 'ਭਾਸ਼ਾ, ਮਿਣਤੀ ਇਕਾਈਆਂ ਅਤੇ ਸੂਚਨਾਵਾਂ ਸੰਭਾਲੋ',
      kycVerified: 'KYC ਤਸਦੀਕਸ਼ੁਦਾ',
      savedPropertiesCount: 'ਸੇਵ ਕੀਤੀਆਂ ਪ੍ਰਾਪਰਟੀਆਂ',
      nakshaPlansCount: 'AI ਮਕਾਨ ਨਕਸ਼ੇ',
      verifiedFardCount: 'ਜਾਂਚੀ ਗਈ ਫ਼ਰਦ',
      languageSection: 'ਭਾਸ਼ਾ ਤੇ ਖੇਤਰੀ ਬੋਲੀ',
      unitSection: 'ਮੁੱਖ ਮਿਣਤੀ ਇਕਾਈ',
      notificationsSection: 'ਸੂਚਨਾ ਸੈਟਿੰਗਜ਼',
      pushAlerts: 'ਨਵੇਂ ਪਲਾਟਾਂ ਦੀ ਸੂਚਨਾ ਪ੍ਰਾਪਤ ਕਰੋ',
      marketAlerts: 'ਮਹੀਨਾਵਾਰ ਰੇਟ ਵਾਧਾ ਰਿਪੋਰਟ',
      supportSection: 'ਸਹਾਇਤਾ ਕੇਂਦਰ ਤੇ ਹੈਲਪਲਾਈਨ',
      helpline: 'ਟੋਲ-ਫ੍ਰੀ ਜ਼ਮੀਨ ਹੈਲਪਲਾਈਨ',
      legalTerms: 'ਨਿਯਮ, ਸ਼ਰਤਾਂ ਤੇ ਪਰਦੇਦਾਰੀ ਨੀਤੀ',
      savedProperties: 'ਸੰਭਾਲੀਆਂ ਜਾਇਦਾਦਾਂ',
      aiPlans: 'AI ਮਕਾਨ ਨਕਸ਼ੇ',
      verifiedFard: 'ਜਾਂਚੀ ਗਈ ਫ਼ਰਦ',
      preferredUnit: 'ਪਸੰਦੀਦਾ ਮਿਣਤੀ ਇਕਾਈ',
      notifications: 'ਸੂਚਨਾਵਾਂ ਤੇ ਅਲਰਟ',
      priceAlerts: 'ਭਾਅ ਵਾਧਾ ਅਲਰਟ',
      auctionAlerts: 'ਬੋਲੀ ਤੇ ਮਾਸਟਰ ਪਲਾਨ ਅਲਰਟ',
      workspaceEcosystem: 'ਵਰਕਸਪੇਸ ਸ਼ਾਰਟਕੱਟ',
      supportLegal: 'ਸਹਾਇਤਾ ਤੇ ਕਾਨੂੰਨੀ ਮਦਦ',
      consultAdvisor: 'AI ਸਲਾਹਕਾਰ ਤੋਂ ਪੁੱਛੋ',
      aboutPropwise: 'PropWise ਬਾਰੇ',
    },
    common: {
      crore: 'ਕਰੋੜ',
      lakh: 'ਲੱਖ',
      thousand: 'ਹਜ਼ਾਰ',
      perGaj: '/ ਗਜ਼',
      perSqFt: '/ ਵਰਗ ਫੁੱਟ',
      verified: 'ਤਸਦੀਕਸ਼ੁਦਾ',
      unverified: 'ਗ਼ੈਰ-ਤਸਦੀਕਸ਼ੁਦਾ',
      loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
      clear: 'ਹਟਾਓ',
      close: 'ਬੰਦ ਕਰੋ',
      save: 'ਸੇਵ ਕਰੋ',
      saved: 'ਸੇਵ ਹੋ ਗਿਆ',
      change: 'ਬਦਲੋ',
      viewDetails: 'ਪੂਰੀ ਜਾਣਕਾਰੀ ਵੇਖੋ',
      all: 'ਸਾਰੇ',
      any: 'ਕੋਈ ਵੀ',
      cancel: 'ਰੱਦ ਕਰੋ',
      confirm: 'ਪੁਸ਼ਟੀ ਕਰੋ',
      search: 'ਲੱਭੋ',
      filter: 'ਫ਼ਿਲਟਰ',
      apply: 'ਲਾਗੂ ਕਰੋ',
      reset: 'ਰੀਸੈਟ',
      back: 'ਪਿੱਛੇ',
      next: 'ਅੱਗੇ',
      submit: 'ਜਮ੍ਹਾਂ ਕਰੋ',
      download: 'ਡਾਊਨਲੋਡ',
      share: 'ਸਾਂਝਾ ਕਰੋ',
      yes: 'ਹਾਂ',
      no: 'ਨਹੀਂ',
      delete: 'ਮਿਟਾਓ',
    },
    onboarding: {
      selectLanguageTitle: 'ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ',
      selectLanguageSubtitle: 'PlotIX ਵਰਤਣ ਲਈ ਭਾਸ਼ਾ ਚੁਣੋ। ਤੁਸੀਂ ਇਸਨੂੰ ਕਿਸੇ ਵੀ ਵੇਲੇ ਬਦਲ ਸਕਦੇ ਹੋ।',
      phoneDetectedBadge: 'ਤੁਹਾਡੇ ਫ਼ੋਨ ਲਈ ਸੁਝਾਇਆ ਗਿਆ',
      continueBtn: 'ਅੱਗੇ ਵਧੋ',
      changeLanguageTitle: 'ਭਾਸ਼ਾ ਬਦਲੋ',
      smartDiscovery: 'ਸਮਾਰਟ ਖੋਜ',
      locationTitle: 'ਆਓ ਤੁਹਾਡੇ ਆਸ-ਪਾਸ ਪ੍ਰਾਪਰਟੀਆਂ ਲੱਭੀਏ।',
      locationSubtitle: 'ਤੁਸੀਂ ਕਿਹੜੇ ਇਲਾਕੇ ਜਾਂ ਸ਼ਹਿਰ ਵਿੱਚ ਜ਼ਮੀਨ/ਮਕਾਨ ਲੱਭ ਰਹੇ ਹੋ?',
      useGpsTitle: 'ਮੇਰੀ ਮੌਜੂਦਾ ਲੋਕੇਸ਼ਨ ਵਰਤੋ',
      useGpsSubtitle: 'ਜ਼ਿਲ੍ਹਾ, ਤਹਿਸੀਲ, ਪਿੰਡ ਅਤੇ ਨੇੜਲੇ ਪਲਾਟ ਆਟੋ-ਡਿਟੈਕਟ ਕਰੋ',
      orSearch: 'ਜਾਂ ਇਲਾਕਾ ਖੋਜੋ',
      searchBoxTitle: 'ਪਿੰਡ, ਤਹਿਸੀਲ, ਜ਼ਿਲ੍ਹਾ ਜਾਂ ਸ਼ਹਿਰ ਲੱਭੋ',
      searchPlaceholder: 'ਕੋਈ ਵੀ ਪਿੰਡ, ਕਲੋਨੀ, ਤਹਿਸੀਲ ਜਾਂ ਸ਼ਹਿਰ ਲਿਖੋ...',
      searching: 'ਇਲਾਕੇ ਲੱਭ ਰਹੇ ਹਾਂ...',
      noMatchesFound: 'ਕੋਈ ਨਤੀਜਾ ਨਹੀਂ ਮਿਲਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਜ਼ਿਲ੍ਹੇ ਜਾਂ ਤਹਿਸੀਲ ਦਾ ਨਾਂ ਲਿਖੋ।',
      privacyNote: 'ਤੁਹਾਡੀ ਲੋਕੇਸ਼ਨ ਨਾਲ ਅਸੀਂ ਤਸਦੀਕਸ਼ੁਦਾ ਜ਼ਮੀਨਾਂ, ਪਿੰਡ, ਮੰਡੀਆਂ ਅਤੇ ਸਰਕਾਰੀ ਕਲੈਕਟਰ ਰੇਟ ਦਿਖਾਉਂਦੇ ਹਾਂ।',
      detectingTitle: 'ਤੁਹਾਡੀ ਲੋਕੇਸ਼ਨ ਲੱਭ ਰਹੇ ਹਾਂ...',
      detectingSubtitle: 'ਕਿਰਪਾ ਕਰਕੇ ਫ਼ੋਨ ਉੱਤੇ ਲੋਕੇਸ਼ਨ ਦੀ ਆਗਿਆ ਦਿਓ। ਅਸੀਂ ਸੂਬਾ, ਜ਼ਿਲ੍ਹਾ, ਤਹਿਸੀਲ ਅਤੇ ਪਿੰਡ ਦੀ ਪਛਾਣ ਕਰ ਰਹੇ ਹਾਂ।',
      searchManuallyInstead: 'ਆਪਣੇ ਆਪ ਇਲਾਕਾ ਲੱਭੋ',
      gpsErrorTitle: 'ਅਸੀਂ ਤੁਹਾਡੀ ਲੋਕੇਸ਼ਨ ਨਹੀਂ ਲੈ ਸਕੇ',
      gpsErrorDesc: 'ਲੋਕੇਸ਼ਨ ਦੀ ਆਗਿਆ ਨਹੀਂ ਮਿਲੀ। ਤੁਸੀਂ ਖੋਜ ਬਾਕਸ ਰਾਹੀਂ ਆਪਣਾ ਇਲਾਕਾ ਚੁਣ ਸਕਦੇ ਹੋ।',
      tryAgain: 'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ',
      searchLocationBtn: 'ਇਲਾਕਾ ਲੱਭੋ',
      locationDetected: '📍 ਤੁਹਾਡੀ ਮੌਜੂਦਾ ਲੋਕੇਸ਼ਨ ਲੱਭੀ',
      locationSelected: '📍 ਇਲਾਕਾ ਚੁਣਿਆ ਗਿਆ',
      youAreExploring: 'ਤੁਸੀਂ ਵੇਖ ਰਹੇ ਹੋ',
      verifiedPropertiesCap: 'ਤਸਦੀਕਸ਼ੁਦਾ ਪਲਾਟ ਤੇ ਕੋਠੀਆਂ',
      localTehsilsCap: 'ਤਹਿਸੀਲਾਂ ਤੇ ਅਨਾਜ ਮੰਡੀਆਂ',
      circleRatesCap: 'ਸਰਕਾਰੀ ਕਲੈਕਟਰ ਰੇਟ ਤੇ ਬਾਜ਼ਾਰ ਭਾਅ',
      startExploringBtn: 'ਸ਼ੁਰੂ ਕਰੋ ਤੇ ਵੇਖੋ',
      chooseDifferentLocationBtn: 'ਹੋਰ ਇਲਾਕਾ ਚੁਣੋ',
      languages: {
        en: { name: 'English', nativeName: 'English', desc: 'Real Estate & Land Intelligence', script: 'Latin' },
        hi: { name: 'Hindi', nativeName: 'हिन्दी', desc: 'ज़मीन, रजिस्ट्री व रियल एस्टेट', script: 'Devanagari' },
        pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', desc: 'ਜ਼ਮੀਨ ਰਿਕਾਰਡ, ਨਕਸ਼ਾ ਤੇ ਰੀਅਲ ਅਸਟੇਟ', script: 'Gurmukhi' },
      },
    },
  },
};

// ─── DOMAIN TRANSLATION HELPERS ─────────────────────────────────────────────

const PROPERTY_TYPE_MAP: Record<string, { hi: string; pa: string }> = {
  'Residential Plot': { hi: 'आवासीय प्लाट', pa: 'ਰਿਹਾਇਸ਼ੀ ਪਲਾਟ' },
  'Commercial Plot': { hi: 'कमर्शियल प्लाट', pa: 'ਕਮਰਸ਼ੀਅਲ ਪਲਾਟ' },
  'Villa': { hi: 'विला / कोठी', pa: 'ਕੋਠੀ / ਵਿਲਾ' },
  'Apartment': { hi: 'अपार्टमेंट / फ्लैट', pa: 'ਅਪਾਰਟਮੈਂਟ / ਫਲੈਟ' },
  'Builder Floor': { hi: 'बिल्डर फ्लोर', pa: 'ਬਿਲਡਰ ਫਲੋਰ' },
  'Agricultural Land': { hi: 'खेती की ज़मीन (कृषि)', pa: 'ਖੇਤੀਬਾੜੀ ਜ਼ਮੀਨ' },
  'Industrial Plot': { hi: 'औद्योगिक प्लाट', pa: 'ਇੰਡਸਟਰੀਅਲ ਪਲਾਟ' },
};

export function translatePropertyType(type: string, lang: Language): string {
  if (lang === 'en' || !type) return type;
  return PROPERTY_TYPE_MAP[type]?.[lang] || type;
}

const FACING_MAP: Record<string, { hi: string; pa: string }> = {
  'East': { hi: 'पूर्व मुखी (East)', pa: 'ਚੜ੍ਹਦਾ / ਪੂਰਬ ਮੁਖੀ' },
  'West': { hi: 'पश्चिम मुखी (West)', pa: 'ਲਹਿੰਦਾ / ਪੱਛਮ ਮੁਖੀ' },
  'North': { hi: 'उत्तर मुखी (North)', pa: 'ਉੱਤਰ ਮੁਖੀ (ਪਹਾੜ ਵੱਲ)' },
  'South': { hi: 'दक्षिण मुखी (South)', pa: 'ਦੱਖਣ ਮੁਖੀ' },
  'North-East': { hi: 'ईशान कोण (North-East)', pa: 'ਈਸ਼ਾਨ ਕੋਣ (ਉੱਤਰ-ਪੂਰਬ)' },
  'North-West': { hi: 'वायव्य कोण (North-West)', pa: 'ਵਾਇਵ ਕੋਣ (ਉੱਤਰ-ਪੱਛਮ)' },
  'South-East': { hi: 'आग्नेय कोण (South-East)', pa: 'ਅਗਨੀ ਕੋਣ (ਦੱਖਣ-ਪੂਰਬ)' },
  'South-West': { hi: 'नैऋत्य कोण (South-West)', pa: 'ਨੈਰਿਤ ਕੋਣ (ਦੱਖਣ-ਪੱਛਮ)' },
  'Any': { hi: 'कोई भी दिशा', pa: 'ਕੋਈ ਵੀ ਦਿਸ਼ਾ' },
};

export function translateFacing(facing: string, lang: Language): string {
  if (lang === 'en' || !facing) return facing;
  return FACING_MAP[facing]?.[lang] || facing;
}

const UNIT_MAP: Record<string, { hi: string; pa: string }> = {
  'gaj': { hi: 'गज (वर्ग गज)', pa: 'ਗਜ਼ (ਵਰਗ ਗਜ਼)' },
  'sqyd': { hi: 'वर्ग गज', pa: 'ਵਰਗ ਗਜ਼' },
  'sqft': { hi: 'वर्ग फुट', pa: 'ਵਰਗ ਫੁੱਟ' },
  'marla': { hi: 'मरला', pa: 'ਮਰਲਾ' },
  'kanal': { hi: 'कनाल', pa: 'ਕਨਾਲ' },
  'bigha': { hi: 'बीघा', pa: 'ਬਿੱਘਾ' },
  'biswa': { hi: 'बिस्वा', pa: 'ਬਿਸਵਾ' },
  'killa': { hi: 'किला / एकड़', pa: 'ਕਿੱਲਾ / ਏਕੜ' },
  'acre': { hi: 'एकड़', pa: 'ਏਕੜ' },
  'Acre': { hi: 'एकड़', pa: 'ਏਕੜ' },
  'ft': { hi: 'फुट', pa: 'ਫੁੱਟ' },
  'karam': { hi: 'करम', pa: 'ਕਰਮ' },
};

export function translateUnit(unit: string, lang: Language): string {
  if (lang === 'en' || !unit) return unit;
  return UNIT_MAP[unit]?.[lang] || unit;
}

const INTENT_MAP: Record<string, { hi: string; pa: string }> = {
  'sale': { hi: 'बिक्री के लिए', pa: 'ਵੇਚਣ ਲਈ' },
  'rent': { hi: 'किराए के लिए', pa: 'ਕਿਰਾਏ ਲਈ' },
  'buy': { hi: 'खरीदना है', pa: 'ਖਰੀਦਣਾ ਹੈ' },
};

export function translateIntent(intent: string, lang: Language): string {
  if (lang === 'en' || !intent) return intent;
  return INTENT_MAP[intent]?.[lang] || intent;
}

const DOC_STATUS_MAP: Record<string, { hi: string; pa: string }> = {
  'Clear Registry Verified': { hi: 'साफ़ रजिस्ट्री प्रमाणित', pa: 'ਸਾਫ਼ ਰਜਿਸਟਰੀ ਤਸਦੀਕਸ਼ੁਦਾ' },
  'Intiqal Sanctioned': { hi: 'इंतकाल मंजूरशुदा', pa: 'ਇੰਤਕਾਲ ਮਨਜ਼ੂਰਸ਼ੁਦਾ' },
  'GPA / Power of Attorney': { hi: 'जीपीए (GPA)', pa: 'ਜੀ.ਪੀ.ਏ (GPA)' },
  'Under Verification': { hi: 'पड़ताल जारी', pa: 'ਪੜਤਾਲ ਅਧੀਨ' },
  'Court Stay Clean': { hi: 'कोई अदालती रोक नहीं', pa: 'ਕੋਈ ਅਦਾਲਤੀ ਰੋਕ ਨਹੀਂ' },
};

export function translateDocStatus(status: string, lang: Language): string {
  if (lang === 'en' || !status) return status;
  return DOC_STATUS_MAP[status]?.[lang] || status;
}

const CATEGORY_MAP: Record<string, { hi: string; pa: string }> = {
  'Approved Sector': { hi: '🏛️ सरकारी अप्रूव्ड सेक्टर', pa: '🏛️ ਸਰਕਾਰੀ ਅਪਰੂਵਡ ਸੈਕਟਰ' },
  'Gated Township': { hi: '🏡 गेटेड टाउनशिप्स', pa: '🏡 ਗੇਟਡ ਟਾਊਨਸ਼ਿਪਾਂ' },
  'Freehold Colony': { hi: '📜 फ्रीहोल्ड कालोनियां', pa: '📜 ਫ੍ਰੀਹੋਲਡ ਕਲੋਨੀਆਂ' },
  'Commercial Hub': { hi: '🏢 कमर्शियल हब', pa: '🏢 ਕਮਰਸ਼ੀਅਲ ਹੱਬ' },
  'Industrial Zone': { hi: '🏭 औद्योगिक क्षेत्र', pa: '🏭 ਇੰਡਸਟਰੀਅਲ ਜ਼ੋਨ' },
};

export function translateCategory(cat: string, lang: Language): string {
  if (lang === 'en' || !cat) return cat;
  return CATEGORY_MAP[cat]?.[lang] || cat;
}
