import { setToast } from "~store/app"
import { setAppGeodata } from "../../store/map"

// export function geoJsonFromResponse(places) {
//   if (!places?.length) return []

//   const geoJson = places.map(placeData => {
//     const res = {
//       type: 'Feature',
//       geometry: {
//         type: "MultiPolygon",
//       },
//       id: placeData.id,
//       properties: {
//         rating: Number(placeData.rating),
//         amount: placeData.amount,
//         name: placeData.name,
//         lng: placeData.lng,
//         lat: placeData.lat,
//         iso_3166_2: placeData.iso_3166_2,
//         id: placeData.id,

//         x: placeData.x,
//         y: placeData.y
//       },
//       source: "composite",
//       sourceLayer: "building",
//     }
//     // if (placeData?.polygon?.length > 1) res.geometry.type = "MultiPolygon"

//     // Case multypolygon
//     res.geometry.coordinates = placeData?.polygon?.map(polygon => polygon.map(polyFigure => {
//       return polyFigure.map(polygon => [polygon.x, polygon.y])
//     }))
//     return res
//     // some async problem, althought setstate has no promise so ;)
//     // setTileData(prevState => {
//     //   console.log('%c⧭', 'color: #00e600', prevState);
//     //   if (prevState.has(key)) prevState.get(key).push(res)
//     //   else prevState.set(key, [res])
//     //   console.log('%c⧭', 'color: #0c550c', prevState);
//     // })
//   })
//   return geoJson
// }

export function geoJsonFromResponse(places) {
  if (!places?.length) return [];

  const storedIds = new Set()
  const geoJson = places.reduce((result, placeData) => {
    if (storedIds.has(String(placeData.id))) {
      // noop
    } else {
      storedIds.add(String(placeData.id))
      // idCounts[placeData.id] = 1;
      const res = {
        type: 'Feature',
        geometry: {
          type: 'MultiPolygon',
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
          y: placeData.y,
        },
        source: 'composite',
        sourceLayer: 'building',
      };

      // Case multipolygon
      res.geometry.coordinates = placeData?.polygon?.map(polygon =>
        polygon.map(polyFigure =>
          polyFigure.map(polygon => [polygon.x, polygon.y])
        )
      );

      result.push(res);
    }
    return result;
  }, []);

  return geoJson;
}



export function processPlacesResponse(res, TEXT, d) {
  if (res.status !== 'OK') return setToast(d, { title: TEXT.networkError, message: typeof res.msg === 'object' ? JSON.stringify(res.msg) : res.msg || JSON.stringify(res.smg) })
  // Pass array of places upwards, to mapbox
  const geoJson = geoJsonFromResponse(res.data)
  // setAppGeodata(d, geoJson)
  // Update current tile data


  return geoJson
}