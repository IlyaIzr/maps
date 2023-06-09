import { setToast } from "~store/app"
import { setAppGeodata } from "../../store/map"

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
        iso_3166_2: placeData.iso_3166_2,
        id: placeData.id,

        x: placeData.x,
        y: placeData.y
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


export function processPlacesResponse(res, d, TEXT, tiledata, setTileData) {
  if (res.status !== 'OK') return setToast(d, { title: TEXT.networkError, message: typeof res.msg === 'object' ? JSON.stringify(res.msg) : res.msg || JSON.stringify(res.smg) })
  // Pass array of places upwards, to mapbox
  const geoJson = geoJsonFromResponse(res.data)
  console.log('%c⧭ set geoJson', 'color: #807160', geoJson);
  setAppGeodata(d, geoJson)
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
        iso_3166_2: placeData.iso_3166_2,
        id: placeData.id,
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