import mapboxgl from "mapbox-gl";
import { getAddress } from "~requests/map";
import { TEXT } from '~rest/lang';
// eslint-disable-line no-unused-vars

// todo return remove control callback
export function mapAddDrawControl(map, setFeature, createBtn, deleteBtn, setDrawPrompt, resetRater) {

  const draw = new window.MapboxDraw({
    displayControlsDefault: false,
    controls: {
      // polygon: true,
      // trash: true
    },
    // defaultMode: 'draw_polygon'
  });

  // Create custom controls
  createBtn.onclick = function () {
    draw.changeMode('draw_polygon')
    deleteBtn.style.display = 'block'
    setDrawPrompt(true)
  }
  deleteBtn.onclick = function () {
    draw.deleteAll()
    resetRater()
    setDrawPrompt(false)
    createBtn.style.display = 'block'
    deleteBtn.style.display = 'none'
  }

  map.addControl(draw);
  createBtn.style.display = 'block'
  deleteBtn.style.display = 'none'


  map.on('draw.create', updateArea);
  map.on('draw.update', updateArea);
  // map.on('draw.delete', afterDelete);
  // map.on('draw.selectionchange', afterUnfocus);
  // function afterDelete() {
  // }
  // function afterUnfocus() {
  //   console.log('%c⧭', 'color: #cc7033', 'afterUnfocus');
  // }

  async function updateArea(e) {
    setDrawPrompt(false)
    createBtn.style.display = 'none'

    // console.log('%c⧭', 'color: #8c0038', 'update area func');

    const data = draw.getAll();

    if (data.features.length > 0) {
      // TODO if area > 30_000 show error notification, also check for too little area. Also chek if nothing inside
      // const area = window.turf.area(data);
      // restrict to area to 2 decimal points
      // const rounded_area = Math.round(area * 100) / 100;
      // console.log('%c⧭', 'color: #99adcc', rounded_area);
      const feature = { ...data.features[0] }
      feature.properties.amount = 0
      feature.properties.created = true
      feature.source = 'createdPoly'
      const [lng, lat] = window.turf.centroid(feature.geometry).geometry.coordinates
      const zoom = map.getZoom()
      // Vector tile feature calculations
      feature._vectorTileFeature = {
        _x: Math.floor((lng + 180) / 360 * Math.pow(2, zoom)),
        _y: Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))
      }

      feature.properties.name = await getAddress(lat, lng)
      console.log('%c⧭', 'color: #917399', feature.properties.name);
      setFeature(feature)
    }
    // if (e.type !== 'draw.delete')
  }

  return {
    drawControl: draw,
    removeCb: () => map.removeControl(draw)
  }
}

export function mapAddGeolocateCtrl(map, position = 'top-left') {
  const geolocateControl = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    // When active the map will receive updates to the device's location as it changes.
    trackUserLocation: true,
    // Draw an arrow next to the location dot to indicate which direction the device is heading.
    showUserHeading: true,
    showAccuracyCircle: true,
  })
  map.addControl(geolocateControl, position);

  return () => map.removeControl(geolocateControl)
}

export function mapAddSearchCtrl(map, position = 'top-right') {
  const searchCtrl = new window.MapboxGeocoder({
    accessToken: import.meta.env.VITE_MAPBOX_T,
    mapboxgl: mapboxgl,
    placeholder: TEXT.searchPHolder
  })
  map.addControl(searchCtrl, position)

  return function removeControl() {
    // this is blatant hack but i couldn't find a way around so far
    // probably happens because geocoder is an external plugin and reacts to map updates poorly (all other controls are fine)
    if (!searchCtrl.container.parenNode) {
      searchCtrl.container = document.querySelector(`div.mapboxgl-ctrl-${position} .mapboxgl-ctrl`)
    }
    map.removeControl(searchCtrl)
  }
}