import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl';
import { getPlaces, getTagPlaces, getUserPlaces } from '~requests/map';
import { mapOnLoad } from './onLoad';
import { geoJsonFromResponse, processPlacesResponse } from './filters';
import { mapOnClick } from './onClick';
import { getLayoutCoords } from '~rest/helperFuncs';
import { TEXT } from '~rest/lang';
import { mapAddDrawControl, mapAddGeolocateCtrl, mapAddSearchCtrl } from './addControl';
import { useDispatch, useSelector } from 'react-redux';
import { setMapRef, setToast } from '~store/app';
import { mapOnMove } from './onMove';
import { ReactComponent as DrawIcon } from '~rest/svg/draw.svg'
import { ReactComponent as TrashIcon } from '~rest/svg/trash.svg'
import { ReactComponent as CompassIcon } from '~rest/svg/compass.svg'
import { getDataFromUrl } from "~store/url"
import { CallbackManager } from "~rest/utils/callbackManager"
import './fixMapbox.css'
import { registerCitiesBanner } from './citiesBanner';
import { useHistory } from 'react-router-dom';
import { DEFAULT_LOCATION, DEFAULT_ZOOM, LAYOUT_ZOOM, MAPBOX_STYLES, RATED_LAYER_SRC, SELECTED_FEATURE_LAYER_SRC } from '../const';
import { getRange } from './range';
import { tileServiceInstance } from './tileService'
import { setAppGeodata } from '../../store/map';

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
  const createBtn = useRef(null);
  const deleteBtn = useRef(null);
  const [drawPrompt, setDrawPrompt] = useState(false);
  const [compass, setCompass] = useState(false);

  // Init map
  useEffect(() => {
    if (map.current && import.meta.env.DEV === true) return;  // initialize map only once, dev environment optimization
    // setFeature(null);

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
    const { lng, lat, zoom } = getDataFromUrl()
    // On mode change
    const mode = app.mode
    console.log('%c⧭', 'color: #00ff88', mode);

    if (mode !== 'draw') {
      const cb = mapAddSearchCtrl(map.current, 'top-right')
      themesCbStore.addCallback(cb)
    }

    if (mode === 'draw') {
      var { drawControl, removeCb } = mapAddDrawControl(map.current, setFeature, createBtn.current, deleteBtn.current, setDrawPrompt, resetRater)
      themesCbStore.addCallback(removeCb)
    }

    // Univarsal actions applicable per each mode
    const clickCb = mapOnClick(map.current, setFeature, resetRater, drawControl || null)
    themesCbStore.addCallback(clickCb)
    // TODO check if modes change works
    const moveCb = mapOnMove(map.current, d, setCompass, { mode: mode, tag: app.tagModeTag })
    themesCbStore.addCallback(moveCb)

    const locateMeCb = mapAddGeolocateCtrl(map.current, 'top-left')
    themesCbStore.addCallback(locateMeCb);

    (async () => await storeInitPlacesEffect(lng, lat, zoom))();
    return () => {
      themesCbStore.callAllCallbacks()
      // tileServiceInstance.cleanUp()
    }
  }, [app.mode, map.current, isMapLoaded])


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


  // TODO handle init calls and mapOnMove on mode change
  // user mapMode
  // useEffect(() => {
  //   if (!map.current) return; // wait for map to initialize

  //   (async function () {
  //     const { lng, lat, zoom } = getDataFromUrl()
  //     // await storeInitPlacesEffect(lng, lat, zoom)
  //   })()
  // }, [app.mode, app.friendModeId, app.tagModeTag, map.current]);


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

    console.log('%c⧭', 'color: #99614d', 'setting app geodata', geoJson);
    setAppGeodata(d, geoJson)
    return geoJson
  }

  function compassClick() {
    const bearing = Math.abs(map.current.getBearing())
    if (!bearing) return setCompass(false)
    const duration = bearing > 30 ? 1200 : (bearing * 30 + 300)
    map.current.rotateTo(0, { duration, animate: true })
    setTimeout(() => {
      setCompass(false)
    }, 1500 + duration / 4);
  }

  return (
    <>
      <div ref={mapContainer} className={"map-container"} />

      {/* Add button */}
      {(app.mode === 'draw') &&
        <button id="createBtn" ref={createBtn} className="mp-bg-light mp-border-accent controlButton">
          <DrawIcon fill="var(--accent)" className="nav-icon" />
        </button>}

      {/* Delete button */}
      {(app.mode === 'draw') &&
        <button id="deleteBtn" ref={deleteBtn} className="mp-bg-light mp-border-accent controlButton">
          <TrashIcon fill="var(--accent)" className="nav-icon" />
        </button>}

      {/* Delete button */}
      {(compass && app.mode !== 'draw') &&
        <CompassIcon
          onClick={compassClick}
          fill="var(--secondary)" className="compass-icon mp-bg-light mp-border-secondary cursor-pointer"
        />
      }

      {/* Helper prompt */}
      {(drawPrompt && app.mode === 'draw') && <div className="controlPrompt mp-border-secondary mp-bg-light">
        <h6>{TEXT.drawMode}</h6>
        <p>{TEXT.drawPrompt}</p>
      </div>
      }
    </>
  )
}

function setMapData(map, geoData, sourceId) {
  if (!geoData.length) return;
  console.log('%c⧭ setting geoData', 'color: #7f2200', geoData, sourceId);
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