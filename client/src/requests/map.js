import { api, requsetMaker } from './config'

export async function getPlaces(minx = 0, maxx = 99999999, miny = 0, maxy = 99999999) {
  const f = requsetMaker('GET', 'maps', 'places', null, false, `minx=${minx}&miny=${miny}&maxx=${maxx}&maxy=${maxy}`)
  return await f()
}

export async function getUserPlaces(id) {
  const f = requsetMaker('GET', 'maps', 'userPlaces', null, false, `id=${id}`)
  return await f()
}

export async function getReviews(placeId) {
  const f = requsetMaker('GET', 'maps', 'reviews', null, false, `targetId=${placeId}`)
  return await f()
}

export async function getPlacesByTiles(data) {
  const f = requsetMaker('POST', 'maps', 'placesByTiles', { ...data }, false)
  return await f()
}

export async function postInitReview(data) {
  const f = requsetMaker('POST', 'maps', 'postInitReview', { ...data }, false)
  return await f()
}

export async function postNextReview(data) {
  const f = requsetMaker('POST', 'maps', 'postNextReview', { ...data }, false)
  return await f()
}

export async function deleteReview(timestamp, place) {
  const f = requsetMaker('DELETE', 'maps', 'reviews', { timestamp, place }, true)
  return await f()
}



export async function getAdress(lat, lng) {
  const typesNeeded = new Set(
    ['street_address', 'natural_feature', 'airport', 'park', 'point_of_interest', "establishment", "food", "store"]
  )
  lat = Number(lat)
  lng = Number(lng)

  // Get decent adress from geocoder
  const res = await window.geocoderRef.geocode({ 'location': { lat, lng } });

  let adress = ""
  if (res.results) {
    for (let i = 0; i < res.results.length; i++) {
      const obj = res.results[i];
      if (obj.types[0] === 'premise') {
        adress = obj.formatted_address.split(', ')[0] + ', ' + obj.formatted_address.split(', ')[1];
        break
      }
      if (obj.types.find(type => typesNeeded.has(type))) {
        adress = obj.address_components[1].long_name + ', ' + obj.address_components[0].long_name
        break
      }
    }
    // TODO error handling
  }
  return adress
}

// TMP

export async function postPlaceName(name, id) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, id })
  }
  try {
    const response = await fetch(api + 'maps/postPlaceName', options)
    const res = await response.json()
    return res
  } catch (err) {
    return err
  }
}