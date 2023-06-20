const Connection = require('../connection')
const dbConn = new Connection()

// Main function to generate cities and calculate their ratings
// Places DB must already be filled with ISO codes for this migration to happend
async function cleanPlaces(closeConnection = false) {
  console.log('started cleaning places');
  try {
    const removeAmountZeroQuery = `DELETE FROM places WHERE amount = 0`;
    const removeXYZeroQuery = `DELETE FROM places WHERE x = 0 AND y = 0`;
    const removeNoCoordsQuery = `DELETE FROM places WHERE lng = 0.000000 AND lat = 0.000000`;
    const removeEmptyPolygon = `DELETE FROM places WHERE polygon = NULL`;
    await dbConn.query(removeAmountZeroQuery);
    await dbConn.query(removeXYZeroQuery);
    await dbConn.query(removeNoCoordsQuery);
    await dbConn.query(removeEmptyPolygon);

    console.log('cleaning places completed ✅');
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    closeConnection && dbConn.close();
  }
}

// cleanPlaces(true)
module.exports = {
  runScript: cleanPlaces
};
