import { getFriends, getRequests } from "../requests/friends"
import { setToast } from "../store/app"
import { setUserFriends, setUserRequests } from "../store/user"
import { googleCreds } from "./config"
import { TEXT } from "./lang"

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

export async function getFriendsInfo(dispatch) {
  const res = await getFriends()
  if (res.status !== 'OK' && res.status !== 'REAUTH') return setToast(dispatch, { message: TEXT.requestError + ' #gFII1' });
  setUserFriends(dispatch, res.data)

  const reqs = await getRequests()
  if (res.status !== 'OK' && res.status !== 'REAUTH') return setToast(dispatch, { message: TEXT.requestError + ' #gFII2'});
  setUserRequests(dispatch, reqs.data)
}

export function notNaN(val) {
  if (!val && typeof val === 'number' && val !== 0) return 0
  return val
}

export function setGoogleCreds(creds) {
  for (const key in creds) {
    if (googleCreds.hasOwnProperty(key)) {
      googleCreds[key] = creds[key]
    }
  }
}