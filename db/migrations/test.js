const fs = require('fs');
const { geojsonExample } = require('./geojson');
const { simplifyGeojson } = require('../../routes/helpres');

// RU-SPE admin polygon
const simplifiedGeojson = simplifyGeojson(geojsonExample)

function writeJSONToFile(data) {
  const jsonString = JSON.stringify(data);

  fs.writeFile('./output.json', jsonString, 'utf8', (err) => {
    if (err) {
      console.error('Error writing JSON to file:', err);
    } else {
      console.log('JSON data written to file successfully!');
    }
  });
}

writeJSONToFile(simplifiedGeojson)

function convertToWKT(geojson) {
  if (geojson.type !== 'FeatureCollection' || !Array.isArray(geojson.features)) {
    throw new Error('Invalid GeoJSON format');
  }

  const coordinates = geojson.features.map(feature => {
    if (feature.type !== 'Feature' || feature.geometry.type !== 'MultiPolygon') {
      throw new Error('Invalid Feature or geometry type');
    }

    return feature.geometry.coordinates.map(polygon => {
      return polygon[0].map(coord => coord.join(' ')).join(',');
    }).join('),(');
  }).join(')),((');

  return `'MULTIPOLYGON(((${coordinates})))',0`;
}