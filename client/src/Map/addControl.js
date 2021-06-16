import { getAdress } from "../requests/map";

export function mapAddControl(map, setFeature) {

  const draw = new window.MapboxDraw({
    displayControlsDefault: false,
    controls: {
      polygon: true,
      trash: true
    },
    // defaultMode: 'draw_polygon'
  });
  map.addControl(draw);
  document.querySelector('.mapbox-gl-draw_polygon').style.display = 'block'
  document.querySelector('.mapbox-gl-draw_trash').style.display = 'none'


  map.on('draw.create', updateArea);
  map.on('draw.update', updateArea);
  map.on('draw.delete', afterDelete);
  // map.on('draw.selectionchange', afterUnfocus);
  function afterDelete() {
    document.querySelector('.mapbox-gl-draw_polygon').style.display = 'block'
    document.querySelector('.mapbox-gl-draw_trash').style.display = 'none'
  }
  // function afterUnfocus() {
  //   draw.trash()
  // }

  async function updateArea(e) {    
    document.querySelector('.mapbox-gl-draw_polygon').style.display = 'none'
    document.querySelector('.mapbox-gl-draw_trash').style.display = 'block'

    console.log('%c⧭', 'color: #8c0038', 'update area func');

    const data = draw.getAll();

    if (data.features.length > 0) {
      const area = window.turf.area(data);
      // restrict to area to 2 decimal points
      const rounded_area = Math.round(area * 100) / 100;
      console.log('%c⧭', 'color: #99adcc', rounded_area);
      // TODO if area > 30_000 show error notification
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

      // feature.properties.name = await getAdress(lat, lng)
      setFeature(feature)
    }
    // if (e.type !== 'draw.delete')
  }

  return draw
}