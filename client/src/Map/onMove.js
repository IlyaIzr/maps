import { getPlacesByTiles } from "../requests/map";
import { getLayoutCoords } from "../rest/helperFuncs";
import { geoJsonFromResponse } from "./filters";

export function mapOnMove(map, setlayoutXY, setTileData, range, setGeoData, setMapData) {
  map.on('moveend', async function (e) {
    const { lng, lat } = map.getCenter()
    // const zoom = map.getZoom()
    const { x: currentX, y: currentY } = getLayoutCoords(lng, lat, 16)
    let prevXY
    setlayoutXY(prev => {
      prevXY = prev
      return { x: currentX, y: currentY }
    })

    // Check changes
    if (prevXY.x === currentX && prevXY.y === currentY) return;
    // console.log('%c⧭ prevx:', 'color: #00bf00', prevXY);
    // console.log('%c⧭ newx', 'color: #0088cc', currentX);
    // console.log('%c⧭ newy', 'color: #0088cc', currentY);

    // Case something changed

    const dataWeNeed = new Set([])
    let dataWeHave
    setTileData(reactiveData => {
      dataWeHave = reactiveData
      return reactiveData
    })


    // Go from top row to bottom
    for (let yOffset = range; yOffset > -range - 1; yOffset--) {
      // From left to right (although in Mapbox y starts from top - North)
      for (let xOffset = -range; xOffset < range + 1; xOffset++) {
        const key = 'x' + (currentX + xOffset) + 'y' + (currentY + yOffset)
        if (dataWeHave.has(key)) continue
        // Add data
        dataWeNeed.add(key)
      }
    }

    const res = await getPlacesByTiles([...dataWeNeed])
    console.log('%c⧭', 'color: #807160', res);

    if (res.status !== 'OK') return console.log('err', res);

    const geoJson = geoJsonFromResponse(res.data, dataWeHave)
    setGeoData(geoJson)
    setMapData(map, geoJson, 'ratedFeaturesSource')

  })
}
