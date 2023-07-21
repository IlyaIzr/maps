const { authCookieName } = require("../settings")
const simplify = require('@turf/simplify')

function handleGeojson(geoJson) {
  try {
    // Treat everyone as multiPoly
    let multiPoly
    if (geoJson.type === 'Polygon') {
      multiPoly = [geoJson.coordinates]
    }
    else multiPoly = geoJson.coordinates

    // 'MULTIPOLYGON('
    const polyPoints = []

    multiPoly.forEach((polyCoords) => {
      polyPoints.push(polygonMapper(polyCoords))
    })
    const multiFormatted = 'MULTIPOLYGON(' + polyPoints.join(', ') + ')'

    return multiFormatted

  } catch (error) {
    console.log('%c⧭ err on handleGeojson', 'color: #bfffc8', error);
    throw error
  }
}

function getRootUsername(userId = '') {
  const rootsArr = process.env.ROOTS_ARRAY?.split(',')
  if (!rootsArr || !rootsArr.length) return null
  const rootUser = rootsArr.find(username => username === userId)
  return rootUser || null
}

function clearUserCookie(res) {
  res.clearCookie(authCookieName)
  res.status(403)
  return res.json({ status: 'REAUTH' })
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function filterAfromB(a = [], b = []) {
  return a.filter(val => !b.includes(val))
}

function simplifyMultipolygon(multiPolygon, leastAmountOfPoints = 60, baseTolerance = 0.5) {
  let simplifiedGeojson
  let tolerance = baseTolerance
  // i have old node atm so that's why so much &&
  const getFirstItem = () => simplifiedGeojson?.features[0]
  const getFirstItemLength = () => getFirstItem()?.geometry?.coordinates?.[0]?.[0]?.length || 0
  const getLeastLength = () => getFirstItemLength() > leastAmountOfPoints ? getFirstItemLength() : leastAmountOfPoints

  let i = 0
  while (i < 10 && !simplifiedGeojson || getFirstItemLength() < getLeastLength()) {
    i++
    simplifiedGeojson = simplify(multiPolygon, { tolerance, highQuality: true, mutate: false })
    tolerance = tolerance > 0.01 ? tolerance / 2 : tolerance - (tolerance / 4)
    console.log(tolerance)
    console.log(getFirstItem())
  }
  return simplifiedGeojson
}

module.exports = {
  handleGeojson,
  delay,
  filterAfromB,
  getRootUsername,
  clearUserCookie,
  simplifyMultipolygon
}

// TODO why do i need this?
function polygonMapper(polyCoords) {

  let north = -90
  let east = -180
  let south = 90
  let west = 180

  const polyArray = []
  polyCoords.forEach((coordinates, shapeIndex) => {
    polyArray.push('(')
    // Map through each poly entity
    coordinates.forEach(([lon, lat], i) => {
      //    Find medium lon and lat
      // Lesser longitude = more western
      if (lon < west) west = lon
      if (lon > east) east = lon
      // Lesser latitude - more southern
      if (lat > north) north = lat
      if (lat < south) south = lat

      // Store polydata
      polyArray[shapeIndex] += (i ? ', ' : '') + String(lon) + ' ' + String(lat)
    })
    polyArray[shapeIndex] += ')'
  })

  return '(' + polyArray.join(',') + ')'
}