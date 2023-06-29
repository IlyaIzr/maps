const simplify = require('@turf/simplify')

const fs = require('fs');
const { geojsonExample } = require('./geojson');

// RU-SPE admin polygon
var simplified = simplify(geojsonExample, { tolerance: 0.002, highQuality: true, mutate: true })

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

writeJSONToFile(simplified)