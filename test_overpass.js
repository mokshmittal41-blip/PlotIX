const lat = 30.2204968;
const lng = 75.0590219;
const r = { m: 1 };

const query = `[out:json][timeout:25];
      (
        nwr["aeroway"~"aerodrome|terminal"](around:${10000 * r.m},${lat},${lng});
        nwr["railway"="station"](around:${5000 * r.m},${lat},${lng});
        nwr["amenity"~"hospital|university|college"](around:${5000 * r.m},${lat},${lng});
        nwr["highway"~"motorway|trunk|primary|secondary"](around:${3000 * r.m},${lat},${lng});
        nwr["amenity"~"school|clinic|pharmacy|bank|police|fire_station"](around:${2000 * r.m},${lat},${lng});
        nwr["shop"~"mall|supermarket"](around:${3000 * r.m},${lat},${lng});
        nwr["leisure"~"park|stadium"](around:${2000 * r.m},${lat},${lng});
        nwr["office"="government"](around:${2000 * r.m},${lat},${lng});
      );
      out center 30;`;

const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query);

fetch(url, {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'PropWise-Testing-App'
  }
})
.then(res => res.json())
.then(data => {
  console.log(`Found ${data.elements.length} total elements`);
  const valid = [];
  for (const element of data.elements) {
    if (!element.tags) continue;
    const name = element.tags.name || element.tags['name:en'] || element.tags.ref || element.tags.official_name;
    if (!name) continue;
    valid.push({ name: name, type: element.tags.amenity || element.tags.highway || element.tags.shop || "other" });
  }
  console.log(`Valid parsed places: ${valid.length}`);
  if (valid.length > 0) console.log(JSON.stringify(valid.slice(0,5), null, 2));
})
.catch(console.error);
