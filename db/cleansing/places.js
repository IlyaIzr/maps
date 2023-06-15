const Connection = require('../connection')
const dbConn = new Connection()

// Main function to generate cities and calculate their ratings
// Places DB must already be filled with ISO codes for this migration to happend
async function cleanPlaces() {
  console.log('started cleaning places');
  try {
    const removeAmountZeroQuery = `DELETE FROM places WHERE amount = 0`;
    const removeXYZeroQuery = `DELETE FROM places WHERE x = 0 AND y = 0`;
    await dbConn.query(removeAmountZeroQuery);
    await dbConn.query(removeXYZeroQuery);

    console.log('cleaning places completed ✅');
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    dbConn.close();
  }
}

cleanPlaces()