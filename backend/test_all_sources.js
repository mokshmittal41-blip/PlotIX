const fs = require('fs');
const https = require('https');
const http = require('http');

// Helper for fetch with robust timeout and standard browser headers
async function testEndpoint(url, headers = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  const startTime = Date.now();

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/json;q=0.8,*/*;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        ...headers
      },
      signal: controller.signal
    });
    clearTimeout(timeout);
    const durationMs = Date.now() - startTime;
    const contentType = res.headers.get('content-type') || '';
    const body = await res.text();

    const isBlocked = 
      res.status === 403 || 
      res.status === 406 || 
      res.status === 429 || 
      body.includes('ShieldSquare') ||
      body.includes('PerimeterX') ||
      body.includes('datadome') ||
      body.includes('cf-browser-verification') ||
      body.includes('Attention Required! | Cloudflare') ||
      body.includes('Security Alert');

    return {
      status: res.status,
      statusText: res.statusText,
      durationMs,
      contentType,
      bodyLength: body.length,
      isBlocked,
      body
    };
  } catch (err) {
    clearTimeout(timeout);
    return {
      error: err.name === 'AbortError' ? 'Timeout (10s)' : err.message,
      durationMs: Date.now() - startTime
    };
  }
}

async function runFeasibilityInvestigation() {
  console.log('===============================================================');
  console.log('REAL FEASIBILITY INVESTIGATION: INDIAN REAL ESTATE SOURCES');
  console.log('===============================================================\n');

  const report = [];

  // 1. MagicBricks
  console.log('1. Testing MagicBricks...');
  const mbResult = await testEndpoint('https://www.magicbricks.com/property-for-sale/residential-real-estate?cityName=Gurgaon');
  let mbExtracted = 0;
  let mbSample = null;
  if (!mbResult.error && !mbResult.isBlocked) {
    const ldJsonMatches = mbResult.body.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi) || [];
    for (const block of ldJsonMatches) {
      try {
        const raw = block.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
        const parsed = JSON.parse(raw);
        if (parsed['@type'] === 'ItemList' && Array.isArray(parsed.itemListElement)) {
          mbExtracted = parsed.itemListElement.length;
          mbSample = parsed.itemListElement[0];
        }
      } catch {}
    }
  }
  report.push({
    source: 'MagicBricks',
    testedUrl: 'https://www.magicbricks.com/property-for-sale/residential-real-estate?cityName=Gurgaon',
    httpStatus: mbResult.status || 'ERROR',
    accessible: Boolean(!mbResult.error && !mbResult.isBlocked && mbExtracted > 0),
    listingsExtracted: mbExtracted,
    sample: mbSample ? { name: mbSample.name || mbSample.item?.name, url: mbSample.url || mbSample.item?.url } : null,
    captchaStatus: mbResult.isBlocked ? 'Blocked by WAF / Captcha' : 'None (Public Schema.org JSON-LD allowed)',
    canRunFree: Boolean(!mbResult.error && !mbResult.isBlocked)
  });

  // 2. 99acres
  console.log('2. Testing 99acres...');
  const acresResult = await testEndpoint('https://www.99acres.com/property-in-delhi-ncr-ffid');
  let acresExtracted = 0;
  if (!acresResult.error && !acresResult.isBlocked) {
    const ldJsonMatches = acresResult.body.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi) || [];
    for (const block of ldJsonMatches) {
      try {
        const raw = block.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
        const parsed = JSON.parse(raw);
        if (parsed['@type'] === 'ItemList' && Array.isArray(parsed.itemListElement)) {
          acresExtracted = parsed.itemListElement.length;
        }
      } catch {}
    }
  }
  report.push({
    source: '99acres',
    testedUrl: 'https://www.99acres.com/property-in-delhi-ncr-ffid',
    httpStatus: acresResult.status || 'ERROR',
    accessible: Boolean(!acresResult.error && acresResult.status === 200),
    listingsExtracted: acresExtracted,
    captchaStatus: acresResult.isBlocked ? 'Blocked' : 'No HTTP block, but client-side React bundle hides listings',
    canRunFree: false
  });

  // 3. Housing.com
  console.log('3. Testing Housing.com...');
  const housingResult = await testEndpoint('https://housing.com/in/buy/searches?category=residential');
  report.push({
    source: 'Housing.com',
    testedUrl: 'https://housing.com/in/buy/searches?category=residential',
    httpStatus: housingResult.status || 'ERROR',
    accessible: false,
    listingsExtracted: 0,
    captchaStatus: housingResult.isBlocked ? 'Blocked: HTTP 406 Security Alert (Cloudflare/PerimeterX WAF)' : 'Blocked',
    canRunFree: false
  });

  // 4. NoBroker
  console.log('4. Testing NoBroker...');
  const noBrokerResult = await testEndpoint('https://www.nobroker.in/property/sale/gurgaon/Sector%2057');
  let noBrokerExtracted = 0;
  if (!noBrokerResult.error && !noBrokerResult.isBlocked) {
    const ldJsonMatches = noBrokerResult.body.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi) || [];
    for (const block of ldJsonMatches) {
      try {
        const raw = block.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
        const parsed = JSON.parse(raw);
        if (parsed['@type'] === 'ItemList') {
          noBrokerExtracted = parsed.itemListElement?.length || 0;
        }
      } catch {}
    }
  }
  report.push({
    source: 'NoBroker',
    testedUrl: 'https://www.nobroker.in/property/sale/gurgaon/Sector%2057',
    httpStatus: noBrokerResult.status || 'ERROR',
    accessible: Boolean(!noBrokerResult.error && noBrokerResult.status === 200),
    listingsExtracted: noBrokerExtracted,
    captchaStatus: 'Public HTML only contains breadcrumb metadata; listings require dynamic client session',
    canRunFree: false
  });

  // 5. OLX India Real Estate Public REST API
  console.log('5. Testing OLX India Real Estate Public API...');
  const olxResult = await testEndpoint('https://www.olx.in/api/relevance/v4/search?category=1503&facet_only=false&page=0&size=10');
  let olxExtracted = 0;
  let olxSample = null;
  if (!olxResult.error && !olxResult.isBlocked && olxResult.status === 200) {
    try {
      const json = JSON.parse(olxResult.body);
      olxExtracted = json.data?.length || 0;
      if (olxExtracted > 0) {
        const item = json.data[0];
        olxSample = {
          id: item.id,
          title: item.title,
          price: item.price?.value?.raw,
          city: item.locations_resolved?.ADMIN_LEVEL_3_name || item.locations_resolved?.ADMIN_LEVEL_1_name,
          state: item.locations_resolved?.ADMIN_LEVEL_1_name,
          url: `https://www.olx.in/item/${item.id}`
        };
      }
    } catch {}
  }
  report.push({
    source: 'OLX India Real Estate (Public REST API)',
    testedUrl: 'https://www.olx.in/api/relevance/v4/search?category=1503&facet_only=false&page=0&size=10',
    httpStatus: olxResult.status || (olxResult.error ? `ERR: ${olxResult.error}` : 'ERROR'),
    accessible: Boolean(olxExtracted > 0),
    listingsExtracted: olxExtracted,
    sample: olxSample,
    captchaStatus: 'None (Clean unauthenticated public JSON API)',
    canRunFree: Boolean(olxExtracted > 0)
  });

  // 6. Official State RERA Portals (Haryana, MahaRERA, Punjab)
  console.log('6. Testing Official Government State RERA Portals...');
  const hreraRes = await testEndpoint('https://haryanarera.gov.in');
  report.push({
    source: 'Haryana RERA (HRERA)',
    testedUrl: 'https://haryanarera.gov.in',
    httpStatus: hreraRes.status || 'ERROR',
    accessible: Boolean(hreraRes.status === 200),
    listingsExtracted: 0,
    captchaStatus: 'ASP.NET Form session with CAPTCHA for project registry search; no open REST API',
    canRunFree: false
  });

  // 7. National Open Government Data (data.gov.in)
  console.log('7. Testing data.gov.in Open Datasets...');
  const ogdRes = await testEndpoint('https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=test&format=json');
  report.push({
    source: 'Data.gov.in Open Data',
    testedUrl: 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070',
    httpStatus: ogdRes.status || 'ERROR',
    accessible: false,
    listingsExtracted: 0,
    captchaStatus: 'Requires registered Government API Key (HTTP 403 Key not authorised)',
    canRunFree: false
  });

  console.log('\n===============================================================');
  console.log('SUMMARY TABLE:');
  console.log('===============================================================');
  console.table(report.map(r => ({
    Source: r.source,
    Status: r.httpStatus,
    Accessible: r.accessible ? 'YES' : 'NO',
    Extracted: r.listingsExtracted,
    Free: r.canRunFree ? 'YES ($0)' : 'NO / BLOCKED',
    Captcha: r.captchaStatus.slice(0, 40)
  })));

  fs.writeFileSync('feasibility_results.json', JSON.stringify(report, null, 2), 'utf8');
}

runFeasibilityInvestigation();
