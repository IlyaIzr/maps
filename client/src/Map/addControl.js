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


  map.on('draw.create', updateArea);
  map.on('draw.delete', updateArea);
  map.on('draw.update', updateArea);

  async function updateArea(e) {
    const data = draw.getAll();

    const answer = document.getElementById('calculated-area');
    if (data.features.length > 0) {
      // const area = window.turf.area(data);
      // // restrict to area to 2 decimal points
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

      feature.properties.name = await getAdress(lat, lng)
      setFeature(feature)
    } else {
      answer.innerHTML = '';
      if (e.type !== 'draw.delete')
        alert('Use the draw tools to draw a polygon!');
    }
  }

}