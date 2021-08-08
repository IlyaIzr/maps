export function saveLocation({ lng, lat }) {
  window.localStorage.setItem('lastLocation', JSON.stringify({ lng, lat }))
}

export function getLocation() {
  let loc = window.localStorage.getItem('lastLocation')
  if (!loc) return {}
  loc = JSON.parse(loc)
  const { lng, lat } = loc
  return { lng, lat }
}

export function getLayoutCoords(lng, lat, zoom) {
  const x = Math.floor((lng + 180) / 360 * Math.pow(2, zoom))
  const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))
  return { x, y }
}