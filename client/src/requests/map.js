import { requestMaker } from './config'

export async function getPlaces(minx = 0, maxx = 99999999, miny = 0, maxy = 99999999) {
  const f = requestMaker('GET', 'maps', 'places', null, false, `minx=${minx}&miny=${miny}&maxx=${maxx}&maxy=${maxy}`)
  return await f()
}

export async function getUserPlaces(id) {
  const f = requestMaker('GET', 'maps', 'userPlaces', null, false, `id=${id}`)
  return await f()
}

export async function getTagPlaces(tag, minx = 0, maxx = 99999999, miny = 0, maxy = 99999999) {
  const f = requestMaker('GET', 'maps', 'taggedPlaces', null, false, `tag=${tag}&minx=${minx}&miny=${miny}&maxx=${maxx}&maxy=${maxy}`)
  return await f()
}

export async function getTagPlacesTiles(tag, data) {
  const f = requestMaker('POST', 'maps', 'taggedByTiles', { tag, data }, false)
  return await f()
}


export async function getPlacesByTiles(data) {
  const f = requestMaker('POST', 'maps', 'placesByTiles', { ...data }, false)
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
      // find address line for Rater component. It will be name of the feature
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
