import { SearchBar } from "~components/SearchBar/SearchBar";
import s from './Cities.module.css'
import { useState, useEffect } from "react";
import { CityItem } from "./CityItem";
import { CityInfo, fetchPopularCities } from "~requests/cities";
import { geoJsonFromResponse } from "~rest/utils/helperFuncs";
// import { multiPolygon, feature } from '@turf/turf'


export const ZOOM_ON_CITY = 14


// Example GeoJSON data
// const geojsonExample = {
//   type: 'Polygon',
//   "coordinates": [
//     [
//       [
//         42.83136353870785,
//         12.169750328167808
//       ],
//       [
//         42.98022394064453,
//         12.273016955319687
//       ],
//       [
//         43.04671172984085,
//         12.168827041003432
//       ],
//       [
//         43.132208583515414,
//         12.248874928382651
//       ],
//       [
//         43.262059920973854,
//         12.167903753839056
//       ],
//       [
//         43.10400379222585,
//         12.370903345157132
//       ],
//       [
//         43.09960426801376,
//         12.564619003209543
//       ],
//       [
//         42.9805327460726,
//         12.3571268028874
//       ],
//       [
//         42.83136353870785,
//         12.169750328167808
//       ]
//     ]
//   ],
// };

// Featured cities so far
// All cities with search - later: alpha 3.3
export function Cities() {
  const [featuredCities, setFeaturedCities] = useState<CityInfo[]>([])

  // const g = feature(multiPolygon(city.geometry))
  const content = featuredCities.length ?
    featuredCities.map(city => <CityItem {...city} key={city.code} />)
    : <h3>{'TEXT.no cities yet'}</h3>

  useEffect(() => {
    // TODO call for features here
    (async function fetchCities() {
      const res = await fetchPopularCities()
      if (res.data) setFeaturedCities(res.data)
      // else setFeaturedCities([
      //   {
      //     amount: 100,
      //     code: 'ru-br',
      //     name: 'Bryansk',
      //     rating: 3.4,
      //     geojsonForPreview: geojsonExample
      //   },
      //   {
      //     amount: 100,
      //     code: 'ru-mo',
      //     name: 'Moscow',
      //     rating: 3.2,
      //     geojsonForPreview: geojsonExample
      //   }
      // ])
    })();
  }, [])


  return (
    <div className="cities">
      {/* Optional */}
      <SearchBar />

      {/* List of cities */}
      <div className={s.container}>
        {content}
      </div>

    </div>
  )
}