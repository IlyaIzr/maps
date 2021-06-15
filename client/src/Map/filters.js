export function geoJsonFromResponse(places) {
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
        name: placeData.name
      },
      source: "composite",
      sourceLayer: "building",
    }
    // if (placeData?.polygon?.length > 1) res.geometry.type = "MultiPolygon"

    // Case multypolygon
    res.geometry.coordinates = placeData?.polygon?.map(polygon => polygon.map(polyFigure => {
      return polyFigure.map(polygon => [polygon.x, polygon.y])
    }))

    return res
  })
  return geoJson
}