import { getLayoutCoords } from "~rest/helperFuncs";
import { setDataToUrl } from "~store/url"
import { LAYOUT_ZOOM } from "../const";
import { tileServiceInstance } from "./tileService";


export function mapOnMove(map, d, modePayload) {
  // console.log('%c⧭ modePayload local', 'color: #5200cc', modePayload);
  function mapMoveEndHandler(e) {
    const { lng, lat } = map.getCenter()
    const zoom = map.getZoom()
    const { x: currentX, y: currentY } = getLayoutCoords(lng, lat, LAYOUT_ZOOM)

    setDataToUrl({ lat: +lat.toFixed(5), lng: +lng.toFixed(5), zoom: +zoom.toFixed(1) })
    tileServiceInstance.handleMapMove({ x: currentX, y: currentY, zoom }, { lat, lng }, d, modePayload)
  }

  map.on('moveend', mapMoveEndHandler)

  return () => {
    map.off('moveend', mapMoveEndHandler)
    tileServiceInstance.cleanUp()
  }
  // OLD WAY
  // map.on('moveend', function (e) {
  //   const { lng, lat } = map.getCenter()
  //   const zoom = map.getZoom()
  //   // const range = getRange(zoom)
  //   const range = 5

  //   setDataToUrl({ lat: +lat.toFixed(5), lng: +lng.toFixed(5), zoom: +zoom.toFixed(1) })

  //   const { x: currentX, y: currentY } = getLayoutCoords(lng, lat, LAYOUT_ZOOM)
  //   let prevXY
  //   setlayoutXY(prev => {
  //     prevXY = prev
  //     return { x: currentX, y: currentY }
  //   })
  //   // Check changes
  //   const nothingHasChanged = !prevXY || (prevXY.x === currentX && prevXY.y === currentY)
  //   if (nothingHasChanged) return;

  //   // console.log('%c⧭ prevx:', 'color: #00bf00', prevXY);
  //   // console.log('%c⧭ newx', 'color: #0088cc', currentX);
  //   // console.log('%c⧭ newy', 'color: #0088cc', currentY);

  //   // Case something changed

  //   // local variables
  //   const dataWeNeed = new Set([])
  //   let dataWeHave

  //   setTileData(reactiveData => {
  //     dataWeHave = reactiveData

  //     // Go from top row to bottom
  //     for (let yOffset = range; yOffset > -range - 1; yOffset--) {
  //       // From left to right (although in Mapbox y starts from top - North)
  //       for (let xOffset = -range; xOffset < range + 1; xOffset++) {
  //         const key = 'x' + (currentX + xOffset) + 'y' + (currentY + yOffset)
  //         if (dataWeHave.has(key)) continue
  //         // Add data
  //         dataWeNeed.add(key)
  //       }
  //     }

  //     console.log('%c⧭ range on move', 'color: #00bf00', range);
  //     console.log('%c⧭ provisional dataWeNeed', 'color: #0088cc', dataWeNeed, dataWeNeed.size);
  //     // clean if needed
  //     if (dataWeNeed.size > 10)

  //       Array.from(dataWeHave.keys()).forEach(tileKey => {
  //         // console.log('%c⧭ tileKey is', 'color: #9c66cc', tileKey);
  //         // console.log('%c⧭ DWN is', 'color: #00a3cc', dataWeNeed);
  //         // console.log('%c⧭ DWN has', 'color: #00e600', dataWeNeed.has(tileKey));
  //         if (dataWeNeed.has(tileKey)) {
  //           return console.log('%c⧭ it had tilekey', 'color: #e50000', tileKey);
  //         }
  //         dataWeHave.delete(tileKey)
  //       })

  //     return reactiveData
  //   })

  //   setWeDataNeed(dataWeNeed)
  // })
}

export function compassHandler(map, setCompass) {
  function mapMoveHandler() {
    if (map.isRotating()) setCompass(true)
  }

  map.on('move', mapMoveHandler)

  return function () {
    map.off('move', mapMoveHandler)
  }
}