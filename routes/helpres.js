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
      polyPoints.push( polygonMapper(polyCoords))
    })
    const multiFormatted = 'MULTIPOLYGON(' + polyPoints.join(', ') + ')'
  
    return multiFormatted
    
  } catch (error) {
    console.log('%c⧭ err on handleGeojson', 'color: #bfffc8', error);    
    throw error
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function filterAfromB(a = [], b = []) {
  return a.filter(val => !b.includes(val))
}

module.exports = {
  handleGeojson,
  delay,
  filterAfromB
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