const express = require('express');
const router = express.Router()
const Connection = require('../db/connection')
const dbConn = new Connection()
const simplify = require('@turf/simplify')

// @ /cities/top?amount=10
router.get('/top', async (req, res) => {
  const { amount: requestedAmount } = req.query
  const amount = requestedAmount || 10

  if (!Number.isSafeInteger(amount)) throw console.error('not safe integer passed')
  if (amount < 1) return res.json({ status: 'OK', data: [] })

  const query = `SELECT * FROM cities ORDER BY amount DESC LIMIT ${amount}`
  try {
    const data = await dbConn.query(query)
    return res.json({ status: 'OK', data })
  } catch (error) {
    console.log('%c⧭', error);
    return res.json({ status: 'ERR', msg: error, query })
  }
})


// @ response: 'NL-AM' | null
async function getIsoCodeFromCoordinates(latitude, longitude) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.address) {
      const isoCode = data.address['ISO3166-2-lvl15'] ?? data.address['ISO3166-2-lvl4'];
      return isoCode;
    }
  } catch (error) {
    console.error('Error retrieving ISO code:', error, latitude, longitude, data, response);
  }
  console.log('weird error', latitude, longitude, url)
  return null;
}

// @ response: {
// en: englishName,
// ru: russianName,
// lat,
// lng
// }
async function getCityNameByIso(code, lat, lng) {
  const urlEn = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=6&accept-language=en&county=${code}`;
  const urlRu = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=6&accept-language=en&county=${code}`;

  // geography - TBD
  try {
    const responseEn = await fetch(urlEn);
    const { lat, lon, address } = await responseEn.json();
    const englishName = address.city || address.state
    await delay(1200)

    const responseRu = await fetch(urlRu);
    const russianNameData = (await responseRu.json()).address
    const russianName = russianNameData.city || russianNameData.state

    return {
      en: englishName,
      ru: russianName,
      lat,
      lng: lon
    }
  } catch (error) {
    console.error('Error retrieving names:', error, code, lat, lng);
  }
  console.log('weird error', lat, lng, urlEn, urlRu)
  return null;
}

// @ response: {
// geojson:,
// lat,
// lng
// }
async function getCityGeometryByIso(code, withCompression = true) {
  const url = `https://nominatim.openstreetmap.org/search.php?q=${code}&polygon_geojson=1&format=json`;

  try {
    const res = await fetch(url);
    const processedResponse = await res.json();
    const [place = {}, boundary = {}] = processedResponse;
    let geojson = place.geojson || boundary.geojson
    if (!geojson) {
      console.log('%c⧭ processedResponse', 'color: #408059', processedResponse);
      console.log('%c⧭ url', 'color: #99adcc', url);
      console.log('%c⧭', 'color: #cc0088', place.geojson, boundary.geojson);
      if (!boundary.geojson && !place.geojson) {
        console.log('%c⧭', 'color: #735656', place, boundary);
      }
    }
    const lat = place.lat || boundary.lat
    const lng = place.lon || boundary.lon

    if (withCompression) {
      geojson = simplify(geojson, { tolerance: 0.002, highQuality: true, mutate: true })
    }

    return { geojson, lat, lng }
  } catch (error) {
    console.error('Error retrieving geography:', error, url);
  }
  console.log('weird error', url)
  return null;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  getIsoCodeFromCoordinates: getIsoCodeFromCoordinates,
  router: router,
  getCityNameByIso: getCityNameByIso,
  delay: delay,
  getCityGeometryByIso: getCityGeometryByIso
}