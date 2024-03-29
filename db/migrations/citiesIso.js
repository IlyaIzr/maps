const { fetchIsoCodeFromCoordinates } = require('../../routes/cities');
const { delay } = require('../../routes/helpres');
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
    const coordinates = `${Number(place.lat).toFixed(0)},${Number(place.lng).toFixed(0)}`;
    if (cache.has(coordinates)) {
      place.iso_3166_2 = cache.get(coordinates);
    } else {
      const isoCode = await fetchIsoCodeFromCoordinates(place.lat, place.lng);
      console.log('%c⧭ isoCode fetched: ', 'color: #aa00ff', isoCode);
      await delay(2000);
      
      cache.set(coordinates, isoCode);
      place.iso_3166_2 = isoCode;
    }

    if (!place.iso_3166_2) return console.log('error no isoCode', coordinates, cache.get(coordinates))
    await dbConn.query('UPDATE places SET iso_3166_2 = ? WHERE id = ?', [place.iso_3166_2, place.id]);
    await delay(100);
  }
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




// P.s. this migration proved to be working. Don't forget to set .env vars to start connection properly