const { getCityNameByIso, getCityGeometryByIso } = require("../../routes/cities");
const { handleGeojson, delay } = require("../../routes/helpres")
const Connection = require('../connection')
const dbConn = new Connection()

// Main function to generate cities and calculate their ratings
async function generateCities() {
  console.log('Cities generation started.');

  try {
    // Retrieve places from the 'places' table
    const placesQuery = 'SELECT * FROM places';
    const places = await dbConn.query(placesQuery);

    // Cache object to store unique ISO codes and their corresponding data
    const cache = {};

    // Process each place
    for (const place of places) {
      const { iso_3166_2, lat, lng, amount, rating } = place;
      await delay(1)

      // Check if the ISO code is already in the cache
      if (cache[iso_3166_2]) {
        // If it is, accumulate reviews and update the rating
        const { amount: accumulatedReviewsAmount, rating: accumulatedRating } = cache[iso_3166_2];

        const updatedAmount = accumulatedReviewsAmount + amount;
        const updatedRating = (accumulatedRating * accumulatedReviewsAmount + rating * amount) / updatedAmount;

        cache[iso_3166_2].amount = updatedAmount;
        cache[iso_3166_2].rating = updatedRating;
      } else {
        // If it's a new ISO code, get city names by ISO code
        const { en, ru } = await getCityNameByIso(iso_3166_2, lat, lng);
        await delay(1300)
        const { geojson, lat: newLat, lng: newLng } = await getCityGeometryByIso(iso_3166_2)
        console.log('%c⧭ geojson: ', 'color: #997326', geojson);
        const polyString = handleGeojson(geojson)
        await delay(1300)

        // Add the ISO code to the cache with initial values
        cache[iso_3166_2] = {
          amount,
          rating,
          en,
          ru,
          lat: newLat,
          lng: newLng,
          polyString
        };
      }
    }

    // Process the cities in the cache and save the data to the 'cities' table
    for (const isoCode of Object.keys(cache)) {
      const { amount, rating, en, ru, lat, lng, polyString } = cache[isoCode];

      const saveCityQuery = `
        INSERT INTO cities (code, rating, amount, lat, lng, en, ru, geometry)
        VALUES ('${isoCode}', ${rating}, ${amount}, ${lat}, ${lng}, '${en}', '${ru}', ST_MPointFromText('${polyString}'))
        ON DUPLICATE KEY UPDATE rating=${rating}, amount=${amount}, lat=${lat}, lng=${lng}, en='${en}', ru='${ru}'
      `;

      await dbConn.query(saveCityQuery);
      await delay(100)
    }

    console.log('Cities generation completed.');
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    // Close the MySQL connection
    dbConn.close();
  }
}

// Call the main function to generate cities
generateCities();
