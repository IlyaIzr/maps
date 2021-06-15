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

export async function getAdress(lat, lng) {
  const typesNeeded = new Set(
    ['street_address', 'natural_feature', 'airport', 'park', 'point_of_interest', "establishment", "food", "store"]
  )
  
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