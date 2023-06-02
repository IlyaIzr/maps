import { ApiResponse, BEStoredGeometry } from "~rest/types/types"
import { requestMaker } from "./config"

export type CityInfo = {
  amount: number
  rating: number
  en: string
  ru: string
  code: string
  geometry?: BEStoredGeometry
}

// @Response: { address_components: {long_name: string, short_name: string, types: string[]} }[]
export async function getCitiesNames(isoCodes = []) {
  const apiKey = import.meta.env.VITE_GMAPKEY

  if (!isoCodes.length) {
    console.log('%c⧭', 'color: #7f2200', 'no iso codes provided', isoCodes);
    return {}
  }
  // Prepare the API request
  const url = `https://maps.googleapis.com/maps/api/geocode/json?components=${isoCodes.map((code) => `administrative_area:${code}`).join('|')}&key=${apiKey}`;

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  }
  try {
    const response = await fetch(url, options)
    const res = await response.json()
    console.log('%c⧭ cities response', 'color: #e5de73', res);

    for (const result of res) {
      let city_name = null;
      for (const component of result.address_components) {
        if (component.types.includes('locality')) {
          city_name = component.long_name;
          break;
        }
      }
      if (city_name) {
        console.log(`ISO Code: ${result.address_components[0].short_name}, City: ${city_name}`);
      }
    }
    return res
  } catch (err) {
    return err
  }
}

export async function fetchPopularCities() {
  const f = requestMaker('GET', 'cities', 'top', null, false)
  const res: ApiResponse<CityInfo[]> = await f()
  return res
}