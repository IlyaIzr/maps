import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl';
import { getPlaces, getTagPlaces, getUserPlaces } from '~requests/map';
import { mapOnLoad } from './onLoad';
import { geoJsonFromResponse, processPlacesResponse } from './filters';
import { mapOnClick } from './onClick';
import { getLayoutCoords } from '~rest/helperFuncs';
import { TEXT } from '~rest/lang';
import { useDispatch, useSelector } from 'react-redux';
import { setMapRef, setToast } from '~store/app';
import { mapOnMove } from './onMove';
import { getDataFromUrl } from "~store/url"
import { CallbackManager } from "~rest/utils/callbackManager"
import './fixMapbox.css'
import { registerCitiesBanner } from './citiesBanner';
import { useHistory } from 'react-router-dom';
import { DEFAULT_LOCATION, DEFAULT_ZOOM, LAYOUT_ZOOM, MAPBOX_STYLES, RATED_LAYER_SRC, SELECTED_FEATURE_LAYER_SRC } from '../const';
import { getRange } from './range';
import { tileServiceInstance } from './tileService'
import { setAppGeodata } from '../../store/map';
import { Controls } from './Controls';

const themesCbStore = new CallbackManager('themes')

// Settings
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_T;

export const MapArea = ({ feature, setFeature, resetRater, featureTrigger }) => {
  const app = useSelector(state => state.app)
  const { geodata: appGeodata, isMapLoaded } = useSelector(state => state.map)
  const d = useDispatch()
  const history = useHistory()
  const mapContainer = useRef(null);

  const map = useRef(null);

  // Init map
  useEffect(() => {
    if (map.current && import.meta.env.DEV === true) return;  // initialize map only once, dev environment optimization

    const { lng, lat, zoom } = getDataFromUrl()
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_STYLES[app.theme],
      center: [lng || DEFAULT_LOCATION.lng + 2, lat || DEFAULT_LOCATION.lat],
      zoom: zoom || DEFAULT_ZOOM
    });
    setMapRef(d, map.current)

    mapOnLoad(map.current, app.theme, d, registerCitiesBanner.bind(this, d, history, themesCbStore))

    if (window.google?.maps?.Geocoder) window.geocoderRef = new window.google.maps.Geocoder()
    window.mapref = map.current
  }, []);

  // Handle theme change
  useEffect(() => {
    if (!map.current) return;
    map.current.setStyle(MAPBOX_STYLES[app.theme])
    isMapLoaded && setMapData(map.current, appGeodata, RATED_LAYER_SRC)
  }, [app.theme, map.current])


  // Handle mode change
  useEffect(() => {
    if (!isMapLoaded) return null;
    setFeature(null);
    const { lng, lat, zoom } = getDataFromUrl()

    const moveCb = mapOnMove(map.current, d, { mode: app.mode, tag: app.tagModeTag })
    themesCbStore.addCallback(moveCb);

    (async () => await storeInitPlacesEffect(lng, lat, zoom))();
    return () => {
      themesCbStore.callAllCallbacks()
      // tileServiceInstance.cleanUp()
    }
  }, [app.mode, app.tagModeTag, map.current, isMapLoaded])

  // map onClick effect
  useEffect(() => {
    if (!isMapLoaded) return null;
    const clickCb = mapOnClick(map.current, setFeature, resetRater, app.drawControl)
    themesCbStore.addCallback(clickCb)
  }, [map.current, setFeature, resetRater, app.drawControl, isMapLoaded])


  // Add appGeodata on map interactively 
  useEffect(() => {
    map.current && isMapLoaded && setMapData(map.current, appGeodata, RATED_LAYER_SRC)
    // TODO replace featureTrigger with subscription to store current feature if needed
  }, [appGeodata, featureTrigger, map.current, isMapLoaded])


  // Mark selected feature
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    setMapData(map.current, [feature || {}], SELECTED_FEATURE_LAYER_SRC)
  }, [feature]);


  useEffect(() => {
    if (!app.mapHidden && isMapLoaded) setTimeout(() => {
      map.current?.resize()      // Fix map shrinking. I'm sorry, it only works this ways
    }, 0);
  }, [app.mapHidden, map.current, isMapLoaded]);


  async function storeInitPlacesEffect(lng, lat, zoom) {
    let geoJson
    const initRange = getRange(zoom)

    const { x, y } = getLayoutCoords(lng || DEFAULT_LOCATION.lng, lat || DEFAULT_LOCATION.lat, LAYOUT_ZOOM)

    if (app.mode === 'watch') {
      const res = await getUserPlaces(app.friendModeId)
      if (res.status !== 'OK') return setToast(d, { title: TEXT.networkError, message: res.msg + '#mp1' || JSON.stringify(res) })
      geoJson = geoJsonFromResponse(res.data)
    } else if (app.mode === 'tags') {
      const res = await getTagPlaces(app.tagModeTag, x - initRange, x + initRange, y - initRange, y + initRange)
      if (res.status !== 'OK') return setToast(d, { title: TEXT.networkError, message: res.msg + '#mp2' || JSON.stringify(res) })
      geoJson = geoJsonFromResponse(res.data)
    } else {
      const res = await getPlaces(x - initRange, x + initRange, y - initRange, y + initRange)
      geoJson = processPlacesResponse(res, TEXT, d)
    }

    setAppGeodata(d, geoJson)
    return geoJson
  }

  return (
    <>
      <div ref={mapContainer} className={"map-container"} />
      <Controls resetRater={resetRater} setFeature={setFeature} />
    </>
  )
}

function setMapData(map, geoData, sourceId) {
  if (!geoData.length) return;
  // console.log('%c⧭ setting geoData', 'color: #7f2200', geoData, sourceId);
  const mapSource = map?.getSource(sourceId)
  mapSource?.setData({
    "type": "FeatureCollection",
    "features": geoData || []
  })
}

export function flyToFeature(map, feature, zoom = 16, speed = 0.5) {
  const [lng, lat] = window.turf.centroid(feature.geometry).geometry.coordinates
  map.flyTo({ center: [lng - 0.0010, lat + 0.0005], zoom, speed });
  return [lng, lat]
}