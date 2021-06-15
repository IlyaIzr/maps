import React, { useEffect, useRef } from 'react'
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { getPlaces } from '../requests/map';
import { mapOnLoad } from './onLoad';
import { geoJsonFromResponse } from './filters';
import { mapOnClick } from './onClick';
import { getLocation, saveLocation } from '../rest/helperFuncs';
import { TEXT } from '../rest/lang';
import { mapAddControl } from './addControl';

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
      const { lng, lat } = getLocation()

      const res = await getPlaces()
      if (res.status !== 'OK') return console.log('bad request', res);
      if (map.current) return; // initialize map only once, dev environment optimization

      const geoJson = geoJsonFromResponse(res.data)

      setGeoData(geoJson)

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        // style: 'mapbox://styles/mapbox/streets-v11',
        // style: 'mapbox://styles/ilyaizr/ckpk75aca0hbg17ouqvzsda51',     //pale basic styles
        style: 'mapbox://styles/ilyaizr/ckpk88ybo17tn17mzmd5etst8',    //pale-ish from streets-v11     
        // center: [-122.447303, 37.753574],  // palo alto
        center: [lng || 34.354, lat || 53.235], // bryansk
        zoom: 16
      });

      map.current.addControl(
        new window.MapboxGeocoder({
          accessToken: process.env.REACT_APP_MAPBOX_T,
          mapboxgl: mapboxgl,
          placeholder: TEXT.searchPHolder
        })
      );

      mapOnLoad(map.current, geoJson)
      mapOnClick(map.current, setFeature, resetRater)
      mapAddControl(map.current, setFeature)
      window.geocoderRef = new window.google.maps.Geocoder()
    })()

    const interval = setInterval(() => {
      const loc = map.current?.getCenter?.()
      if (loc) saveLocation(loc)
    }, 10000);

    return () => clearInterval(interval)
    /* eslint-disable */
  }, []);
  /* eslint-enable */

  // Dynamic geodata
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    setMapData(map.current, geoData, 'ratedFeaturesSource')
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

      <div className="calculation-box">
        <p>Draw a polygon using the draw tools.</p>
        <div id="calculated-area"></div>
      </div>
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
  return [lng, lat]
}