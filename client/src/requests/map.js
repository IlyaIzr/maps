import { api } from './config'


export async function getPlaces(minx, maxx, miny, maxy) {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }
  try {
    let response
    if (minx) response = await fetch(api + `maps/places?minx=${minx}&miny=${miny}&maxx=${maxx}&maxy=${maxy}`, options)
    else response = await fetch(api + `maps/places`, options)
    const res = await response.json()
    return res
  } catch (err) {
    return err
  }
}

export async function getPlaceInfo(lon, lat) {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${process.env.REACT_APP_MAPBOX_T}`,
      options
    )
    const res = await response.json()
    return res
  } catch (err) {
    return err
  }
}


export async function getReviews(placeId) {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }
  try {
    const response = await fetch(api + `maps/reviews?targetId=${placeId}`, options)
    const res = await response.json()
    return res
  } catch (err) {
    return err
  }
}


export async function postInitReview(data) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...data })
  }
  try {
    const response = await fetch(api + 'maps/postInitReview', options)
    const res = await response.json()
    return res
  } catch (err) {
    return err
  }
}

export async function postNextReview(data) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...data })
  }
  try {
    const response = await fetch(api + 'maps/postNextReview', options)
    const res = await response.json()
    return res
  } catch (err) {
    return err
  }
}