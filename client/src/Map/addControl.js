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

      console.log('%c⧭', 'color: #ffa280', feature);
      // feature.properties.name = await getAdress(lat, lng)
      setFeature(feature)
    } else {
      answer.innerHTML = '';
      if (e.type !== 'draw.delete')
        alert('Use the draw tools to draw a polygon!');
    }
  }

}