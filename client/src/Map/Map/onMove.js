import { getLayoutCoords } from "~rest/helperFuncs";

export function mapOnMove(map, setlayoutXY, range, setWeDataNeed, setTileData, setCompass) {
  map.on('move', function () {
    if (map.isRotating()) setCompass(true)
  })

  map.on('moveend', function (e) {
    const { lng, lat } = map.getCenter()
    // const zoom = map.getZoom()
    const { x: currentX, y: currentY } = getLayoutCoords(lng, lat, 16)
    let prevXY
    setlayoutXY(prev => {
      prevXY = prev
      return { x: currentX, y: currentY }
    })

    // Check changes
    if (!prevXY || (prevXY.x === currentX && prevXY.y === currentY)) return;
    // console.log('%c⧭ prevx:', 'color: #00bf00', prevXY);
    // console.log('%c⧭ newx', 'color: #0088cc', currentX);
    // console.log('%c⧭ newy', 'color: #0088cc', currentY);

    // Case something changed

    // local variables
    const dataWeNeed = new Set([])
    let dataWeHave

    setTileData(reactiveData => {
      dataWeHave = reactiveData

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

      // clean if needed
      if (dataWeNeed.size > 10)

        Array.from(dataWeHave.keys()).forEach(tileKey => {
          // console.log('%c⧭ tileKey is', 'color: #9c66cc', tileKey);
          // console.log('%c⧭ DWN is', 'color: #00a3cc', dataWeNeed);
          // console.log('%c⧭ DWN has', 'color: #00e600', dataWeNeed.has(tileKey));
          if (dataWeNeed.has(tileKey)) {
            return console.log('%c⧭ it had tilekey', 'color: #e50000', tileKey);
          }
          dataWeHave.delete(tileKey)
        })

      return reactiveData
    })

    setWeDataNeed(dataWeNeed)
  })
}