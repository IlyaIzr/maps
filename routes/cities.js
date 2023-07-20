const express = require('express');
const router = express.Router()
const Connection = require('../db/connection')
const dbConn = new Connection()
const simplify = require('@turf/simplify')
const axios = require('axios');

const { filterAfromB, handleGeojson, delay } = require('./helpres');

const citiesTableKeys = ['code', 'rating', 'amount', 'lat', 'lng', 'en', 'ru', 'geometry']

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

// @ /cities/cityInfo?code=RU-SPE
// @ response: {data: type CityInfo}
router.get('/cityInfo', async (req, res) => {
  const { code } = req.query
  const data = await getCityInfo(code)
  if (data.status === 'ERR') return res.json(data)
  return (res.json({ status: 'OK', data: data ?? null }))
})

// @ response: type CityInfo
async function getCityInfo(isoCode, exclude = []) {
  let selector = '*'
  if (exclude.length) {
    const includes = filterAfromB(citiesTableKeys, exclude)
    selector = includes.join(', ')
  }
  const query = `SELECT ${selector} FROM cities WHERE code = ?`

  try {
    const res = await dbConn.query(query, isoCode)
    return res[0]
  } catch (error) {
    console.log('%c⧭', error);
    return { status: 'ERR', msg: error, query }
  }
}

// @ response: 'NL-AM' | null
async function fetchIsoCodeFromCoordinates(latitude, longitude) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2`;

  try {
    var response = await axios.get(url);
    var data = response.data;
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
async function fetchCityNameByIso(code, lat, lng) {
  const urlEn = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=6&accept-language=en&county=${code}`;
  const urlRu = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=6&accept-language=ru&county=${code}`;

  // geography - TBD
  try {
    var responseEn = await axios.get(urlEn);
    var { lat, lon, address } = responseEn.data;
    const englishName = address.city || address.state
    if (!lat || !lon || !englishName) console.log(`no data fetched by url ${urlEn}`)
    await delay(1200)

    var responseRu = await axios.get(urlRu);
    var russianNameData = responseRu.data.address;
    const russianName = russianNameData.city || russianNameData.state
    if (!russianName) console.log(`no name fetched by url ${urlRu}`)

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
async function fetchCityGeometryByIso(code, withCompression = true) {
  const url = `https://nominatim.openstreetmap.org/search.php?q=${code}&polygon_geojson=1&format=json`;

  try {
    var response = await axios.get(url);
    var processedResponse = response.data;
    const [place = {}, boundary = {}] = processedResponse;
    let geojson = place.geojson || boundary.geojson
    if (!geojson) {
      console.log('%c⧭ processedResponse', 'color: #408059', processedResponse);
      console.log('%c⧭ url on error was', 'color: #99adcc', url);
      console.log('%c⧭', 'color: #cc0088', place.geojson, boundary.geojson);
      if (!boundary.geojson && !place.geojson) {
        console.log('%c⧭', 'color: #735656', place, boundary);
      }
    }
    const lat = place.lat || boundary.lat
    const lng = place.lon || boundary.lon

    if (withCompression) {
      geojson = simplify(geojson, { tolerance: 0.0005, highQuality: true, mutate: true })
    }

    return { geojson, lat, lng }
  } catch (error) {
    console.error('Error retrieving geography:', error, url);
  }
  console.log('weird error', url)
  return null;
}

async function fetchCityData(iso_3166_2, lat, lng) {
  try {

    const { en, ru } = await fetchCityNameByIso(iso_3166_2, lat, lng);
    await delay(1300)
    const { geojson } = await fetchCityGeometryByIso(iso_3166_2)

    const polyString = handleGeojson(geojson)
    await delay(1300)

    return {
      // add coords of the review. Because cities are large and we want to zoom where some reviews are happening
      // TBD - store coords of the most reviewed place
      en,
      ru,
      polyString
    }
  } catch (error) {
    console.log('%c⧭ error for fetching city data', 'color: #cc0036', error);
  }
}


module.exports = {
  fetchIsoCodeFromCoordinates,
  router: router,
  fetchCityNameByIso: fetchCityNameByIso,
  fetchCityGeometryByIso: fetchCityGeometryByIso,
  getCityInfo,
  fetchCityData
}