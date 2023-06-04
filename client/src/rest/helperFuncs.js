import { getFriends, getRequests } from "../requests/friends"
import { setToast } from "../store/app"
import { setCommentsNumber, setUserFriends, setUserRequests } from "../store/user"
import { googleCreds } from "./config"
import { TEXT } from "./lang"

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
  if (res.status !== 'OK' && res.status !== 'REAUTH') return setToast(dispatch, { message: TEXT.requestError + ' #gFII2' });
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

export function uuidv4() {
  // return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function isNaN(value) {
  return Number.isNaN(value)
}

export function handleError(dispatch, res, errorCustomCode) {
  if (res.status !== 'OK') return setToast(dispatch, {
    message: `${TEXT.requestError} ${errorCustomCode}`
  })
}


export function handleNewLevel(res, commentsAmount, dispatch) {
  if (res.newLevel) {
    console.log('%c⧭ new level on response', 'color: #e5de73', res);
    setToast(dispatch, { status: 'complete', message: TEXT.nowYourLevel + ' ' + res.newLevel })
    setUserLevel(dispatch, res.newLevel)
  }
  setCommentsNumber(dispatch, commentsAmount + 1)
}