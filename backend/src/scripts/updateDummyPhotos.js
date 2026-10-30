const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../../data/properties.json');
const dummyFile = path.join(__dirname, '../../../src/data/dummyData.ts');

const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

// Extract authentic real photos from verified listings
const realPlotImages = data
  .filter(p => p.images && p.images.length > 0 && p.images[0].includes('apollo.olx.in'))
  .map(p => p.images[0]);

console.log('Available authentic original photos:', realPlotImages.length);

if (realPlotImages.length < 10) {
  console.error('Not enough real photos found');
  process.exit(1);
}

let dummyContent = fs.readFileSync(dummyFile, 'utf8');

const realImagesBlock = `const IMAGES = {
  plot1: '${realPlotImages[0]}',
  plot2: '${realPlotImages[1]}',
  plot3: '${realPlotImages[2]}',
  plot4: '${realPlotImages[3]}',
  plot5: '${realPlotImages[4]}',
  plot6: '${realPlotImages[5]}',
  plot7: '${realPlotImages[6]}',
  plot8: '${realPlotImages[7]}',
  plot9: '${realPlotImages[8]}',
  plot10: '${realPlotImages[9]}',
};`;

dummyContent = dummyContent.replace(/const IMAGES = \{[\s\S]*?\};/, realImagesBlock);

let idx = 10;
dummyContent = dummyContent.replace(/https:\/\/images\.unsplash\.com\/[^\s'"`]+/g, () => {
  const replacement = realPlotImages[idx % realPlotImages.length];
  idx++;
  return replacement;
});

fs.writeFileSync(dummyFile, dummyContent, 'utf8');
console.log('✅ Successfully updated src/data/dummyData.ts to only use 100% authentic real photos!');
