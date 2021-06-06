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