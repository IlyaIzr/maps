// Clean places first.
// Make sure .env is in this folder

const Connection = require('../connection') // Replace with the path to your connection file

// Create an instance of the Database class
const db = new Connection();

// Function to clean places and cities based on id and grade
async function cleanPlacesAndCities(id, grade, iso_3166_2) {  // Update place
  const placeQuery = `
    UPDATE places SET 
    rating = ((amount * rating - ${grade}) / (amount - 1)), 
    amount = (amount - 1)
    WHERE id='${id}'
    `
  try {
    const result = await db.query(placeQuery)
    if (!result.affectedRows) console.log('nothing was deleted', ...arguments)
  } catch (error) {
    console.log(error)
  }

  // Update city rating
  citiesQuery = `
    INSERT INTO cities
    (code, rating, amount)  
    VALUES 
    ('${iso_3166_2}', ${grade}, ${1})
    ON DUPLICATE KEY UPDATE 
    rating = ((amount * rating - ${grade}) / (amount - 1)), 
    amount = (amount - 1)
  `
  try {
    if (iso_3166_2) await db.query(citiesQuery)
  } catch (error) {
    console.log(error)
    return res.json({ status: 'ERR', msg: error, query: citiesQuery })
  }
}

async function cleanReviewsTable() {
  try {
    // Select duplicate rows that have the same author, targetId, and timestamp
    const selectDuplicatesQuery = `
      SELECT author, grade, targetId, timestamp, COUNT(*) as count
      FROM reviews
      GROUP BY author, targetId, timestamp
      HAVING COUNT(*) > 1
    `;
    const duplicateRows = await db.query(selectDuplicatesQuery);

    // Iterate through the duplicate rows and keep one instance of each duplicate
    for (const row of duplicateRows) {
      const { author, grade, targetId, timestamp, count, iso_3166_2 } = row;
      console.log('Deleted row:', row);

      // Perform async function "cleanPlacesAndCities" for each deleted row
      await cleanPlacesAndCities(targetId, grade, iso_3166_2);

      // Delete all but one row for each duplicate occurrence
      const deleteDuplicateRowsQuery = `
        DELETE FROM reviews
        WHERE author = ? AND targetId = ? AND timestamp = ?
        LIMIT ?
      `;
      await db.query(deleteDuplicateRowsQuery, [author, targetId, timestamp, count - 1]);
    }

    const deletedRowsCount = duplicateRows.reduce((total, row) => total + row.count - 1, 0);
    console.log(`Deleted ${deletedRowsCount} duplicate row(s) from the reviews table.`);

    console.log('Cleaning reviews table completed.');
  } catch (error) {
    console.error('Error cleaning reviews table:', error);
  } finally {
    // Close the database connection
    db.close();
  }
}

// Call the function to clean the reviews table
cleanReviewsTable();
