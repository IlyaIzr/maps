export function formatGeodata(geometry) {
  // Treat everyone as multiPoly
  let multiPoly
  if (geometry.type === 'Polygon') {
    multiPoly = [geometry.coordinates]
  }
  else multiPoly = geometry.coordinates

  let north = -90
  let east = -180
  let south = 90
  let west = 180

  // 'MULTIPOLYGON('
  const polyPoints = []

  multiPoly.forEach((polyCoords) => {
    polyPoints.push( polygonMapper(polyCoords))
  })
  const multiFormatted = 'MULTIPOLYGON(' + polyPoints.join(', ') + ')'

  function polygonMapper(polyCoords) {
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


  return [
    [east, north],
    [west, south],
    multiFormatted
  ]
}
