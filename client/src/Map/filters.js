export function geoJsonFromResponse(places, tileData) {
  if (!places?.length) return []

  const geoJson = places.map(placeData => {
    const res = {
      type: 'Feature',
      geometry: {
        type: "MultiPolygon",
      },
      id: placeData.id,
      properties: {
        rating: Number(placeData.rating),
        amount: placeData.amount,
        name: placeData.name,
        lng: placeData.lng,
        lat: placeData.lat,
        // x: placeData.x,
        // y: placeData.y
      },
      source: "composite",
      sourceLayer: "building",
    }
    // if (placeData?.polygon?.length > 1) res.geometry.type = "MultiPolygon"

    // Case multypolygon
    res.geometry.coordinates = placeData?.polygon?.map(polygon => polygon.map(polyFigure => {
      return polyFigure.map(polygon => [polygon.x, polygon.y])
    }))

    if (!tileData) 
    return res

    const key = 'x' + placeData.x + 'y' + placeData.y
    if (tileData.has(key)) tileData.get(key).push(res)
    else tileData.set(key, [res])


    // some async problem, althought setstate has no promise so ;)
    // setTileData(prevState => {
    //   console.log('%c⧭', 'color: #00e600', prevState);
    //   if (prevState.has(key)) prevState.get(key).push(res)
    //   else prevState.set(key, [res])
    //   console.log('%c⧭', 'color: #0c550c', prevState);
    // })
    return res
  })
  return geoJson
}