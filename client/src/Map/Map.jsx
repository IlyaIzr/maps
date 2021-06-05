import React, { useEffect, useRef } from 'react'
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { getPlaces } from '../requests/map';
import { mapOnLoad } from './onLoad';
import { geoJsonFromResponse } from './filters';
import { mapOnClick } from './onClick';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_T;

export const Map = ({ feature, setFeature, resetRater, geoData, setGeoData, featureTrigger }) => {
  const mapContainer = useRef(null);

  const map = useRef(null);
  // const [lng, setLng] = useState(-122.447303);
  // const [lat, setLat] = useState(37.753574);
  // const [zoom, setZoom] = useState(16);


  // Init map
  useEffect(() => {
    (async function () {

      const res = await getPlaces()
      if (res.status !== 'OK') return console.log('bad request', res);
      if (map.current) return; // initialize map only once, dev environment optimization

      const geoJson = geoJsonFromResponse(res.data)

      setGeoData(geoJson)

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        // style: 'mapbox://styles/mapbox/streets-v11',
        // style: 'mapbox://styles/ilyaizr/ckpk75aca0hbg17ouqvzsda51',     //pale
        style: 'mapbox://styles/ilyaizr/ckpk88ybo17tn17mzmd5etst8',         
        // center: [-122.447303, 37.753574],
        center: [34.354, 53.235],
        zoom: 16
      });

      mapOnLoad(map.current, geoJson)
      mapOnClick(map.current, setFeature, resetRater)
    })()
    /* eslint-disable */
  }, []);
  /* eslint-enable */

  // Dynamic geodata
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    setMapData(map.current, geoData, 'ratedFeaturesSource')
    // console.log('%c⧭', 'color: #73998c', 'adding data to source', geoData);
    /* eslint-disable */
  }, [featureTrigger]);
  /* eslint-enable */

  // Mark selected feature
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    setMapData(map.current, [feature || {}], 'selectedFeatureSrc')
    /* eslint-disable */
  }, [feature]);
  /* eslint-enable */


  return (
    <div>
      <div ref={mapContainer} className="map-container" />
    </div>
  )
}

export function setMapData(map, geoData, sourceId) {
  map.getSource(sourceId).setData({
    "type": "FeatureCollection",
    "features": geoData
  })
}

export function flyToFeature(map, feature, zoom = 16, speed = 0.5) {
  const [lng, lat] = window.turf.centroid(feature.geometry).geometry.coordinates
  map.flyTo({ center: [lng, lat], zoom, speed });
}