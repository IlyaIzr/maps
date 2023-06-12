const { fetchCityData } = require("../../routes/cities");
const { delay } = require("../../routes/helpres")
const Connection = require('../connection')
const dbConn = new Connection()

// Main function to generate cities and calculate their ratings
// Places DB must already be filled with ISO codes for this migration to happend
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
        const { en, ru, polyString } = await fetchCityData(iso_3166_2, lat, lng)
        console.log('%c⧭ fetched', 'color: #99adcc',  en, ru, polyString?.length);
        console.log('%c⧭ for data of', 'color: #f279ca', iso_3166_2, lat, lng);

        // Add the ISO code to the cache with initial values
        cache[iso_3166_2] = {
          amount,
          rating,
          en,
          ru,
          // add coords of the review. Because cities are large and we want to zoom where some reviews are happening
          // TBD - store coords of the most reviewed place
          lat,
          lng,
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
