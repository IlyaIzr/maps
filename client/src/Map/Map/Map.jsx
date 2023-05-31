import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl';
import { getPlaces, getPlacesByTiles, getTagPlaces, getTagPlacesTiles, getUserPlaces } from '~requests/map';
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
import { setBanner } from '~store/app';

const mapCallbacks = new CallbackManager('maps')

// Settings
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_T;
const range = 5
const defaultZoom = 16
const bryansk = {
  lng: 34.354, lat: 53.235
}
const mbStyles = {
  standart: 'mapbox://styles/ilyaizr/ckq2l808k0ifn17o0x0yl9qi4',
  dark: 'mapbox://styles/ilyaizr/cktd77j8u12ch18swzrqikqor',
  'b&w': 'mapbox://styles/ilyaizr/ckpk75aca0hbg17ouqvzsda51', //todo, basic map
  blueprint: 'mapbox://styles/ilyaizr/cksp4jldx0b1z17mog8wzg0jm'  //blueprint with less colors
}

export const MapArea = ({ feature, setFeature, resetRater, geoData, setGeoData, featureTrigger }) => {
  const app = useSelector(state => state.app)
  const d = useDispatch()
  const mapContainer = useRef(null);

  const map = useRef(null);
  const createBtn = useRef(null);
  const deleteBtn = useRef(null);
  const [drawPrompt, setDrawPrompt] = useState(false);
  const [compass, setCompass] = useState(false);
  // Map places data
  const [, setlayoutXY] = useState({ x: null, y: null });
  const [tiledata, setTileData] = useState(new Map())
  const [dataWeNeed, setWeDataNeed] = useState(new Set());

  useEffect(() => {
    (async function () {
      if (app.mode === 'watch') return;
      if (app.mode === 'tags' && dataWeNeed.size) {
        const res = await getTagPlacesTiles(app.tagModeTag, [...dataWeNeed])
        return processPlacesResponse(res, d, TEXT, setGeoData, tiledata, setTileData)
      }
      if (dataWeNeed.size) {
        const res = await getPlacesByTiles([...dataWeNeed]);
        console.log('%c⧭ getPlacesByTiles res', 'color: #364cd9', res.data);
        if (!res?.data.length) {
          const closeBanner = setBanner(d, {
            // TODO make text import from TEXT
            content: <div>No reviews here <br /> Do you want to see most popular cities?</div>,
            bottomControls: [
              {
                element: <div>Close</div>,
                onClick: (e, close) => close()
              },
              {                
                element: <div>To features</div>,
                onClick: () => null
              }
            ]
          })
          mapCallbacks.addCallback(closeBanner)
        }
        processPlacesResponse(res, d, TEXT, setGeoData, tiledata, setTileData)
      }
    })()
    // eslint-disable-next-line 
  }, [dataWeNeed]);


  // Init map
  useEffect(() => {

    // turns-off draw mode in development
    // if (map.current && import.meta.env.NODE_ENV === 'development') return;  // initialize map only once, dev environment optimization
    setFeature(null);

    // todo split that logic
    (async function callForGeoFeaturesAndAddControls() {
      const { lng, lat, zoom } = getDataFromUrl()
      const geoJson = await initPlacesCall(lng, lat, zoom)

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mbStyles[app.theme],   //  blueprint
        // center: [-122.447303, 37.753574],  // palo alto
        center: [lng || bryansk.lng, lat || bryansk.lat], // bryansk
        zoom: zoom || defaultZoom
      });
      setMapRef(d, map.current)

      const cb = mapAddGeolocateCtrl(map.current, 'top-left')
      mapCallbacks.addCallback(cb)

      // Add search
      if (app.mode !== 'draw') {
        const cb = mapAddSearchCtrl(map.current, 'top-right')
        mapCallbacks.addCallback(cb)
      }

      if (app.mode === 'draw') {
        var drawObject = mapAddDrawControl(map.current, setFeature, createBtn.current, deleteBtn.current, setDrawPrompt, resetRater)
      }
      mapOnLoad(map.current, geoJson, app.theme)
      mapOnClick(map.current, setFeature, resetRater, drawObject || null)
      mapOnMove(map.current, setlayoutXY, range, setWeDataNeed, setTileData, setCompass)
      if (window.google?.maps?.Geocoder) window.geocoderRef = new window.google.maps.Geocoder()
    })();

    return () => {
      mapCallbacks.callAllCallbacks()
    }
    // eslint-disable-next-line
  }, [app.theme, app.mapKey]);


  // Dynamic geodata
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    setMapData(map.current, geoData, 'ratedFeaturesSource')
    // eslint-disable-next-line
  }, [featureTrigger, geoData]);


  // Mark selected feature
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize

    setMapData(map.current, [feature || {}], 'selectedFeatureSrc')
    // eslint-disable-next-line
  }, [feature]);


  // map hider, helps to awoid extra call to Mapbox
  useEffect(() => {
    if (!app.mapHidden)       // Fix map shrinking. I'm sorry, it only works this wayzz
      setTimeout(() => {
        map.current?.resize()
      }, 0);
  }, [app.mapHidden, map.current]);


  // user maphMode
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize

    (async function () {
      const { lng, lat, zoom } = getDataFromUrl()
      await initPlacesCall(lng, lat, zoom)
    })()
  }, [app.mode, app.friendModeId, app.tagModeTag, map.current]);


  async function initPlacesCall(lng, lat, zoom) {
    let geoJson

    const { x, y } = getLayoutCoords(lng || bryansk.lng, lat || bryansk.lat, zoom || defaultZoom)
    setlayoutXY({ x, y })

    if (app.mode === 'watch') {
      const res = await getUserPlaces(app.friendModeId)
      if (res.status !== 'OK') return setToast(d, { title: TEXT.networkError, message: res.msg + '#mp1' || JSON.stringify(res) })
      geoJson = geoJsonFromResponse(res.data)
    } else if (app.mode === 'tags') {
      const res = await getTagPlaces(app.tagModeTag, x - range, x + range, y - range, y + range)
      if (res.status !== 'OK') return setToast(d, { title: TEXT.networkError, message: res.msg + '#mp2' || JSON.stringify(res) })
      geoJson = geoJsonFromResponse(res.data)
    } else {
      const res = await getPlaces(x - range, x + range, y - range, y + range)
      console.log('%c⧭ getPlaces res', 'color: #33cc99', res);
      return processPlacesResponse(res, d, TEXT, setGeoData, tiledata, setTileData)
    }

    setGeoData(geoJson)
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

export function setMapData(map, geoData, sourceId) {
  map.getSource(sourceId)?.setData({
    "type": "FeatureCollection",
    "features": geoData
  })
}

export function flyToFeature(map, feature, zoom = 16, speed = 0.5) {
  const [lng, lat] = window.turf.centroid(feature.geometry).geometry.coordinates
  map.flyTo({ center: [lng - 0.0010, lat + 0.0005], zoom, speed });
  return [lng, lat]
}