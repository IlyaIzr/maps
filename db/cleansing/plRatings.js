const Connection = require('../connection')
const dbConn = new Connection()
const { delay } = require("../../routes/helpres")

// This function recalculates places ratings based on reviews that might've been changed
// It also collects unaffected places who's reviews were probably lost.
// What to do about them is a question for the future
async function recalculateRating(closeConnection = false) {
  console.log('started recalculating places rating');
  try {
    // Get the existing places with their corresponding amount values
    const existingPlaces = await dbConn.query(`SELECT * FROM places`);
    const unAffectedPlaces = new Map()
    const unCountedReviews = new Map()
    for (const place of existingPlaces) {
      unAffectedPlaces.set(place.id, place);
    }

    // Create a map to store the places that need to recalculate from the beginning
    const recalculatingFromBeginningMap = new Map();

    // Get the reviews and recalculate the rating for each place
    const getReviewsQuery = `
      SELECT targetId, grade
      FROM reviews
    `;
    const reviews = await dbConn.query(getReviewsQuery);

    // Iterate through the reviews and update the places table accordingly
    for (const review of reviews) {
      const { targetId, grade } = review;

      if (recalculatingFromBeginningMap.get(targetId)) {
        const updatePlaceQuery = `
          UPDATE places
          SET rating = ((amount * rating) + ?) / (amount + 1),
              amount = amount + 1
          WHERE id = ?
        `;
        await dbConn.query(updatePlaceQuery, [grade, targetId]);
      } else {
        // Otherwise, recalculate from the beginning by reseting the ratings as it were first one 
        const insertNewPlaceQuery = `
          UPDATE places
          SET rating = ?,
              amount = 1
          WHERE id = ?
        `;
        const result = await dbConn.query(insertNewPlaceQuery, [grade, targetId]);
        if (result.affectedRows) {
          recalculatingFromBeginningMap.set(targetId, true); // Mark recalculation from beginning as started
          unAffectedPlaces.delete(targetId)
        } else {
          unCountedReviews.set(targetId, review)
        }
      }

      await delay(2)
    }

    console.log('Finished recalculating places rating ✅✅');    
    console.log('places that weren`t affected: ', unAffectedPlaces);
    console.log('reviews that weren`t counted: ', unCountedReviews);
  } catch (error) {
    console.error('Error recalculating rating:', error);
  } finally {
    // Close the database connection
    closeConnection && dbConn.close();
  }
}

// recalculateRating(true)

module.exports = {
  runScript: recalculateRating
};
