const Connection = require('../connection')
const dbConn = new Connection()
const { delay } = require("../../routes/helpres")

async function recalculateRating() {
  console.log('started recalculating places rating');
  try {
    // Get the existing places with their corresponding amount values
    // const getExistingPlacesQuery = `
    //   SELECT id, amount
    //   FROM places
    // `;
    // const existingPlaces = await db.query(getExistingPlacesQuery);

    // Create a map to store the places that need to recalculate from the beginning
    const recalculatingFromBeginningMap = new Map();
    // for (const place of existingPlaces) {
    //   recalculatingFromBeginningMap.set(place.id, place.amount === 1);
    // }

    // Get the reviews and recalculate the rating for each place
    const getReviewsQuery = `
      SELECT targetId, grade
      FROM reviews
    `;
    const reviews = await dbConn.query(getReviewsQuery);

    // Iterate through the reviews and update the places table accordingly
    for (const review of reviews) {
      const { targetId, grade } = review;
      await delay(2)

      if (recalculatingFromBeginningMap.get(targetId)) {
        const updatePlaceQuery = `
          UPDATE places
          SET rating = ((amount * rating) + ?) / (amount + 1),
              amount = amount + 1
          WHERE id = ?
        `;
        await dbConn.query(updatePlaceQuery, [grade, targetId]);
      } else {
        // Otherwise, recalculate from the beginning by inserting a new row for the place
        const insertNewPlaceQuery = `
          INSERT INTO places (id, rating, amount)
          VALUES (?, ?, 1)
          ON DUPLICATE KEY UPDATE
          rating = ?,
          amount = 1
        `;
        await dbConn.query(insertNewPlaceQuery, [targetId, grade, grade]);
        recalculatingFromBeginningMap.set(targetId, true); // Mark recalculation from beginning as to be done
      }
    }

    console.log('Finished recalculating places rating ✅✅');
  } catch (error) {
    console.error('Error recalculating rating:', error);
  } finally {
    // Close the database connection
    dbConn.close();
  }
}

recalculateRating()