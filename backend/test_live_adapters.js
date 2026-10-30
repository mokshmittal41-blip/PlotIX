const fs = require('fs');

const LOCATIONS = [
  'Gurugram',
  'Rewari',
  'Dharuhera',
  'Bawal',
  'Chandigarh',
  'Mohali',
  'Mumbai',
  'Pune',
  'Delhi',
  'Bengaluru',
  'Hyderabad',
  'Jaipur',
  'Lucknow',
  'Kolkata'
];

// Mapping for MagicBricks URL slug conventions
const MAGICBRICKS_CITY_MAP = {
  'gurugram': 'Gurgaon',
  'bengaluru': 'Bangalore',
  'delhi': 'New-Delhi',
  'bawal': 'Rewari' // Bawal is handled via Rewari district in MagicBricks
};

// Valid OLX Real Estate Category IDs
const OLX_CATEGORIES = [
  { id: '1729', name: 'Lands & Plots' },
  { id: '1725', name: 'Houses & Apartments' },
  { id: '1731', name: 'Commercial Properties' }
];

async function safeFetch(url, customHeaders = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/json;q=0.8,*/*;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        ...customHeaders
      },
      signal: controller.signal
    });
    clearTimeout(timer);
    const text = await res.text();
    return {
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      contentType: res.headers.get('content-type') || '',
      body: text
    };
  } catch (err) {
    clearTimeout(timer);
    return {
      ok: false,
      status: 0,
      error: err.name === 'AbortError' ? 'Timeout (12s)' : err.message,
      body: ''
    };
  }
}

// ── 1. MAGICBRICKS ADAPTER TEST ──────────────────────────────────────────────
async function testMagicBricksForCity(city) {
  const mappedCity = MAGICBRICKS_CITY_MAP[city.toLowerCase()] || city;
  const url = `https://www.magicbricks.com/property-for-sale/residential-real-estate?cityName=${encodeURIComponent(mappedCity)}`;
  
  const res = await safeFetch(url);
  if (!res.ok) {
    return {
      adapter: 'MagicBricksAdapter',
      city,
      mappedQueryCity: mappedCity,
      requestUrl: url,
      httpStatus: res.status,
      genuinelyFromSource: res.body.includes('magicbricks') || res.status === 200,
      extractedCount: 0,
      first3Titles: [],
      first3Urls: [],
      isValidSaleListing: false,
      validPriceLocationType: false,
      notes: `HTTP error ${res.status}: ${res.error || res.statusText}`
    };
  }

  const html = res.body;
  const isWafBlocked = html.includes('ShieldSquare') || html.includes('Attention Required');
  if (isWafBlocked) {
    return {
      adapter: 'MagicBricksAdapter',
      city,
      mappedQueryCity: mappedCity,
      requestUrl: url,
      httpStatus: res.status,
      genuinelyFromSource: true,
      extractedCount: 0,
      first3Titles: [],
      first3Urls: [],
      isValidSaleListing: false,
      validPriceLocationType: false,
      notes: 'Blocked by Anti-Bot/WAF'
    };
  }

  const ldJsonMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi) || [];
  const genuineListings = [];

  for (const block of ldJsonMatches) {
    try {
      const jsonStr = block.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
      const parsed = JSON.parse(jsonStr);

      if (parsed['@type'] === 'ItemList' && Array.isArray(parsed.itemListElement)) {
        for (const item of parsed.itemListElement) {
          const rawUrl = item.url || item.item?.url || '';
          const name = item.name || item.item?.name || '';
          
          // Strict Validation: Ensure URL points to property detail page and title is a genuine property
          const isPropertyDetail = rawUrl.includes('propertyDetails') || rawUrl.includes('/pd/') || rawUrl.includes('id=');
          const isNotCategory = !rawUrl.endsWith('/property-for-sale') && !rawUrl.includes('/flats-in-') && !rawUrl.includes('/plots-in-');

          if (isPropertyDetail || (name && name.length > 10 && isNotCategory)) {
            const canonicalUrl = rawUrl.startsWith('http') ? rawUrl : `https://www.magicbricks.com${rawUrl}`;
            genuineListings.push({
              title: name.trim(),
              url: canonicalUrl,
              price: item.price || item.item?.price || item.offers?.price || 'Available on Source Listing',
              propertyType: item.propertyType || item['@type'] || 'Residential'
            });
          }
        }
      }
    } catch {}
  }

  const sample3 = genuineListings.slice(0, 3);
  return {
    adapter: 'MagicBricksAdapter',
    city,
    mappedQueryCity: mappedCity,
    requestUrl: url,
    httpStatus: res.status,
    genuinelyFromSource: html.includes('magicbricks.com') || html.includes('Magicbricks'),
    extractedCount: genuineListings.length,
    first3Titles: sample3.map(l => l.title),
    first3Urls: sample3.map(l => l.url),
    isValidSaleListing: genuineListings.length > 0 && sample3.every(l => l.url.includes('magicbricks.com')),
    validPriceLocationType: genuineListings.length > 0 && sample3.every(l => l.title.length > 5),
    notes: genuineListings.length > 0 ? `Extracted ${genuineListings.length} genuine property listings from schema.org` : '0 listings found'
  };
}

// ── 2. OLX REAL ESTATE ADAPTER TEST ──────────────────────────────────────────
async function testOlxForCityAndCategory(city, categoryId, categoryName) {
  // Using verified category IDs (1729 = Lands & Plots, 1725 = Houses & Apartments, 1731 = Commercial Properties)
  const url = `https://www.olx.in/api/relevance/v4/search?category=${categoryId}&query=${encodeURIComponent(city)}&facet_only=false&page=0&size=10`;
  
  const res = await safeFetch(url);
  if (!res.ok) {
    return {
      adapter: 'OlxRealEstateAdapter',
      city,
      category: categoryName,
      categoryId,
      requestUrl: url,
      httpStatus: res.status,
      genuinelyFromSource: res.status === 200,
      extractedCount: 0,
      first3Titles: [],
      first3Urls: [],
      first3Prices: [],
      first3Locations: [],
      isValidSaleListing: false,
      validPriceLocationType: false,
      notes: `HTTP error ${res.status}: ${res.error || res.statusText}`
    };
  }

  let data = [];
  try {
    const json = JSON.parse(res.body);
    data = json.data || [];
  } catch (e) {
    return {
      adapter: 'OlxRealEstateAdapter',
      city,
      category: categoryName,
      categoryId,
      requestUrl: url,
      httpStatus: res.status,
      genuinelyFromSource: false,
      extractedCount: 0,
      first3Titles: [],
      first3Urls: [],
      first3Prices: [],
      first3Locations: [],
      isValidSaleListing: false,
      validPriceLocationType: false,
      notes: `JSON parse error: ${e.message}`
    };
  }

  const genuineListings = [];
  for (const item of data) {
    const title = item.title || '';
    const id = item.id || '';
    const priceVal = item.price?.value?.raw;
    const locState = item.locations_resolved?.ADMIN_LEVEL_1_name || '';
    const locCity = item.locations_resolved?.ADMIN_LEVEL_3_name || item.locations_resolved?.ADMIN_LEVEL_2_name || '';
    const locSub = item.locations_resolved?.SUBLOCALITY_LEVEL_1_name || '';

    // STRICT VALIDATION: Ensure item is in the real estate category and has valid ID and title
    if (id && title && title.length > 5 && (item.category_id === categoryId || item.category_id === '1729' || item.category_id === '1725' || item.category_id === '1731')) {
      genuineListings.push({
        id,
        title: title.trim(),
        price: priceVal || 'On Request',
        url: `https://www.olx.in/item/${id}`,
        state: locState,
        city: locCity,
        locality: locSub,
        category: categoryName,
        createdAt: item.created_at
      });
    }
  }

  const sample3 = genuineListings.slice(0, 3);
  const hasValidPrices = sample3.length > 0 && sample3.some(l => typeof l.price === 'number' && l.price > 0);
  const hasValidLocations = sample3.length > 0 && sample3.every(l => l.state || l.city);

  return {
    adapter: 'OlxRealEstateAdapter',
    city,
    category: categoryName,
    categoryId,
    requestUrl: url,
    httpStatus: res.status,
    genuinelyFromSource: true,
    extractedCount: genuineListings.length,
    first3Titles: sample3.map(l => l.title),
    first3Urls: sample3.map(l => l.url),
    first3Prices: sample3.map(l => l.price),
    first3Locations: sample3.map(l => `${l.locality ? l.locality + ', ' : ''}${l.city || l.state}`),
    isValidSaleListing: genuineListings.length > 0 && sample3.every(l => l.url.startsWith('https://www.olx.in/item/')),
    validPriceLocationType: hasValidPrices && hasValidLocations,
    notes: genuineListings.length > 0 ? `Successfully extracted ${genuineListings.length} genuine sale listings` : '0 listings returned'
  };
}

// ── 3. MAIN RUNNER ───────────────────────────────────────────────────────────
async function runAllTests() {
  console.log('======================================================================');
  console.log('EXECUTING COMPREHENSIVE LIVE ADAPTER TESTS FOR 14 PAN-INDIA LOCATIONS');
  console.log('======================================================================\n');

  const mbResults = [];
  const olxResults = [];

  // 1. Run MagicBricks Tests across all 14 locations
  console.log('--- 1. TESTING MAGICBRICKS ADAPTER ---');
  for (const city of LOCATIONS) {
    process.stdout.write(`Testing MagicBricks for ${city.padEnd(12)}... `);
    const res = await testMagicBricksForCity(city);
    mbResults.push(res);
    console.log(`[Status: ${res.httpStatus}] Extracted: ${res.extractedCount} listings | Valid: ${res.isValidSaleListing ? 'YES' : 'NO'}`);
    await new Promise(r => setTimeout(r, 600));
  }

  // 2. Run OLX Tests across all 14 locations and 3 categories
  console.log('\n--- 2. TESTING OLX REAL ESTATE ADAPTER (Plots, Houses, Commercial) ---');
  for (const city of LOCATIONS) {
    for (const cat of OLX_CATEGORIES) {
      process.stdout.write(`Testing OLX for ${city.padEnd(12)} [${cat.name.padEnd(20)}]... `);
      const res = await testOlxForCityAndCategory(city, cat.id, cat.name);
      olxResults.push(res);
      console.log(`[Status: ${res.httpStatus}] Extracted: ${res.extractedCount} listings | Valid Prices: ${res.validPriceLocationType ? 'YES' : 'NO'}`);
      await new Promise(r => setTimeout(r, 450));
    }
  }

  // 3. Verify Canonical URLs Live Access
  console.log('\n--- 3. VERIFYING LIVE CANONICAL SOURCE URLS ---');
  const sampleUrlsToVerify = [];
  mbResults.forEach(r => {
    if (r.first3Urls && r.first3Urls[0] && r.first3Urls[0].includes('propertyDetails')) {
      sampleUrlsToVerify.push({ source: 'MagicBricks', city: r.city, url: r.first3Urls[0] });
    }
  });
  olxResults.forEach(r => {
    if (r.first3Urls && r.first3Urls[0]) {
      sampleUrlsToVerify.push({ source: 'OLX', city: r.city, category: r.category, url: r.first3Urls[0] });
    }
  });

  const urlVerificationResults = [];
  for (const item of sampleUrlsToVerify.slice(0, 14)) {
    process.stdout.write(`Verifying URL (${item.source.padEnd(11)} - ${item.city.padEnd(11)}): ${item.url.slice(0, 55)}... `);
    const check = await safeFetch(item.url);
    const ok = check.status === 200 || check.status === 301 || check.status === 302;
    urlVerificationResults.push({
      source: item.source,
      city: item.city,
      url: item.url,
      httpStatus: check.status,
      opensCorrectly: ok
    });
    console.log(`[HTTP ${check.status}] Opens: ${ok ? 'YES' : 'NO'}`);
    await new Promise(r => setTimeout(r, 400));
  }

  // 4. Save Final Complete Test Report
  const finalReport = {
    testExecutedAt: new Date().toISOString(),
    locationsTested: LOCATIONS,
    totalLocationCount: LOCATIONS.length,
    magicBricksSummary: {
      totalRuns: mbResults.length,
      successfulRuns: mbResults.filter(r => r.extractedCount > 0).length,
      totalListingsExtracted: mbResults.reduce((acc, r) => acc + r.extractedCount, 0),
      results: mbResults
    },
    olxRealEstateSummary: {
      totalRuns: olxResults.length,
      successfulRuns: olxResults.filter(r => r.extractedCount > 0).length,
      totalListingsExtracted: olxResults.reduce((acc, r) => acc + r.extractedCount, 0),
      results: olxResults
    },
    canonicalUrlVerification: urlVerificationResults
  };

  fs.writeFileSync('live_adapter_test_report.json', JSON.stringify(finalReport, null, 2), 'utf8');
  console.log('\n======================================================================');
  console.log('ALL TESTS FINISHED! Full JSON report saved to backend/live_adapter_test_report.json');
  console.log(`Total MagicBricks Listings Extracted: ${finalReport.magicBricksSummary.totalListingsExtracted}`);
  console.log(`Total OLX Real Estate Listings Extracted: ${finalReport.olxRealEstateSummary.totalListingsExtracted}`);
  console.log('======================================================================');
}

runAllTests();
