import { setToast } from "../store/app"

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
    return res
    // some async problem, althought setstate has no promise so ;)
    // setTileData(prevState => {
    //   console.log('%c⧭', 'color: #00e600', prevState);
    //   if (prevState.has(key)) prevState.get(key).push(res)
    //   else prevState.set(key, [res])
    //   console.log('%c⧭', 'color: #0c550c', prevState);
    // })
  })
  return geoJson
}


export function processPlacesResponse(res, d, TEXT, setGeoData, tiledata, setTileData) {
  if (res.status !== 'OK') return setToast(d, { title: TEXT.networkError, message: res.msg || JSON.stringify(res) })
  // Pass array of places upwards, to mapbox
  const geoJson = geoJsonFromResponse(res.data)
  setGeoData(geoJson)
  // Update current tile data

  const localTileData = new Map([...tiledata])

  res.data.forEach(placeData => {
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

    const key = 'x' + placeData.x + 'y' + placeData.y
    if (localTileData.has(key)) localTileData.get(key).set(placeData.id, res)
    else {
      const featureList = new Map()
      featureList.set(placeData.id, res)
      localTileData.set(key, featureList)
    }
  })

  setTileData(localTileData)

  return geoJson
}