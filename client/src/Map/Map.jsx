import { useEffect, useRef, useState } from 'react'
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { getPlaces, getPlacesByTiles } from '../requests/map';
import { mapOnLoad } from './onLoad';
import { processPlacesResponse } from './filters';
import { mapOnClick } from './onClick';
import { getLayoutCoords, getLocation, saveLocation } from '../rest/helperFuncs';
import { TEXT } from '../rest/lang';
import { mapAddControl } from './addControl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { hideMain, showMain } from '../store/app';
import { mapOnMove } from './onMove';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_T;
const range = 3

export const MapArea = ({ feature, setFeature, resetRater, geoData, setGeoData, featureTrigger }) => {
  const app = useSelector(state => state.app)
  const location = useLocation()
  const d = useDispatch()
  const mapContainer = useRef(null);

  const map = useRef(null);
  const createBtn = useRef(null);
  const deleteBtn = useRef(null);
  const [drawPrompt, setDrawPrompt] = useState(false);
  // Map places data
  const [, setlayoutXY] = useState({ x: null, y: null });
  const [tiledata, setTileData] = useState(new Map())
  const [dataWeNeed, setWeDataNeed] = useState(new Set());

  useEffect(() => {
    (async function () {
      if (dataWeNeed.size) {
        const res = await getPlacesByTiles([...dataWeNeed])
        processPlacesResponse(res, d, TEXT, setGeoData, tiledata, setTileData)
      }
    })()
    // eslint-disable-next-line 
  }, [dataWeNeed]);

  // const [zoom, setZoom] = useState(16);


  // Init map
  useEffect(() => {
    if (map.current) return; // initialize map only once, dev environment optimization
    (async function () {
      const { lng, lat } = getLocation()
      // const zoom = map.getZoom()
      const zoom = 16
      const { x, y } = getLayoutCoords(lng, lat, zoom)
      setlayoutXY({ x, y })

      const res = await getPlaces(x - range, x + range, y - range, y + range)
      const geoJson = processPlacesResponse(res, d, TEXT, setGeoData, tiledata, setTileData)

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        // style: 'mapbox://styles/mapbox/streets-v11',
        // style: 'mapbox://styles/ilyaizr/ckpk75aca0hbg17ouqvzsda51',     //pale basic styles
        // style: 'mapbox://styles/ilyaizr/ckpk88ybo17tn17mzmd5etst8',    //pale-ish from streets-v11       //pale basic styles
        // style: 'mapbox://styles/ilyaizr/ckq2l808k0ifn17o0x0yl9qi4',     //blue shades  
        style: 'mapbox://styles/ilyaizr/cks1rsp1d3jxs17qo1m3gwxf0',   //  blueprint
        // center: [-122.447303, 37.753574],  // palo alto
        center: [lng || 34.354, lat || 53.235], // bryansk
        zoom
      });

      // Add search
      map.current.addControl(
        new window.MapboxGeocoder({
          accessToken: process.env.REACT_APP_MAPBOX_T,
          mapboxgl: mapboxgl,
          placeholder: TEXT.searchPHolder
        })
      );

      const drawObject = mapAddControl(map.current, setFeature, createBtn.current, deleteBtn.current, setDrawPrompt, resetRater)
      // console.log('%c⧭', 'color: #5200cc', p.sty);
      mapOnLoad(map.current, geoJson, app.theme)
      mapOnClick(map.current, setFeature, resetRater, drawObject)
      mapOnMove(map.current, setlayoutXY, range, setWeDataNeed, setTileData)
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
  }, [featureTrigger, geoData]);
  /* eslint-enable */

  // Mark selected feature
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize

    setMapData(map.current, [feature || {}], 'selectedFeatureSrc')
    /* eslint-disable */
  }, [feature]);
  /* eslint-enable */

  // map hider, helps to awoid extra call to Mapbox
  useEffect(() => {
    if (location.pathname !== '/') hideMain(d)
    else showMain(d)
    /* eslint-disable */
  }, [location.pathname]);
  /* eslint-enable */



  return (
    <div>
      <div ref={mapContainer} className={app.mapHidden ? "hidden" : "map-container"} />
      {/* Add button */}
      <button id="createBtn" ref={createBtn} className="mp-bg-light mp-border-primary controlButton">
        <img src="/icons/edit-pen.svg" alt="draw area" />
      </button>
      {/* Delete button */}
      <button id="deleteBtn" ref={deleteBtn} className="mp-bg-light mp-border-primary controlButton">
        <img src="/icons/trash.svg" alt="cancel drawing" />
      </button>
      {/* Helper prompt */}
      {drawPrompt && <div className="controlPrompt mp-border-counter mp-bg-light">
        <h6>{TEXT.drawPromptHeader}</h6>
        <p>{TEXT.drawPrompt}</p>
      </div>
      }
    </div>
  )
}

export function setMapData(map, geoData, sourceId) {
  map.getSource(sourceId)?.setData({
    "type": "FeatureCollection",
    "features": geoData
  })
}

export function flyToFeature(map, feature, zoom = 16, speed = 0.5) {
  const [lng, lat] = window.turf.centroid(feature.geometry).geometry.coordinates
  map.flyTo({ center: [lng, lat], zoom, speed });
  return [lng, lat]
}