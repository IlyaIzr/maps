const fetch = require('node-fetch');
const Connection = require('../connection')
const dbConn = new Connection()


async function addCityCodeToPlaceMigration() {
  const allPlaces = await dbConn.query('SELECT * FROM places');

  // Create a map to cache latitude and longitude pairs with their ISO-3166-2 codes
  const cache = new Map();

  for (const place of allPlaces) {
    // If the place already has an ISO-3166-2 code, move to the next iteration
    if (place.iso_3166_2) {
      continue;
    }

    // Check if the coordinates are already cached
    const coordinates = `${place.lat.toFixed(0)},${place.lng.toFixed(0)}`;
    if (cache.has(coordinates)) {
      place.iso_3166_2 = cache.get(coordinates);
    } else {
      const isoCode = await getIsoCodeFromCoordinates(place.latitude, place.longitude);
      await delay(1500);
      
      cache.set(coordinates, isoCode);
      place.iso_3166_2 = isoCode;
    }

    if (!place.iso_3166_2) return console.log('error no isoCode', coordinates, cache.get(coordinates))
    await dbConn.query('UPDATE places SET iso_3166_2 = ? WHERE id = ?', [place.iso_3166_2, place.id]);
    await delay(100);
  }
}

async function getIsoCodeFromCoordinates(latitude, longitude) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.address) {

      const isoCode = data.address['ISO3166-2-lvl15'] || data.address['ISO3166-2-lvl14'];
      return isoCode;
    }
  } catch (error) {
    console.error('Error retrieving ISO code:', error);
  }
  return null;
}

// Call the migration function
console.log('Migration started');
addCityCodeToPlaceMigration()
  .then(() => {
    console.log('Migration completed');
    // Continue with any other tasks
  })
  .catch(error => {
    console.error('Migration failed:', error);
  });



function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}