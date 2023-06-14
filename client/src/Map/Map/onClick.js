import { getAddress } from "~requests/map"
import { flyToFeature } from "./Map"
import { union as turfUnion } from '@turf/turf'
import { RATED_LAYER_SRC } from "../const"


export function mapOnClick(map, setFeature, resetRater, drawControl) {
  function geoFromTurf(geo) {
    if (!geo[1]) return geo[0]
    let res2 = turfUnion(geo[0], geo[1])
    if (geo[2]) for (let i = 2; i < geo.length; i++) {
      res2 = turfUnion(res2, geo[i])
    }

    return res2.geometry
  }
  function findFeatureClones(feature) {
    const someFeatures = map.querySourceFeatures("composite",
      {
        filter: ["any", ["==", ["id"], feature.id]],
        sourceLayer: feature.sourceLayer
      }
    )
    someFeatures.splice(someFeatures.length / 2)
    return someFeatures.map(f => f.geometry)
  }
  function lesserGeometry(feature) {
    const features = findFeatureClones(feature) || []
    return geoFromTurf(features)
  }

  async function mapClickEventHandler(e) {
    function zoomOnEvent(zoom) {
      const { lng, lat } = e.lngLat
      map.flyTo({ center: [lng, lat], zoom: zoom });
    }
    // if (map.getZoom() < 16) zoomOnEvent(16)

    const features = map.queryRenderedFeatures(e.point);
    const featuresNeeded = new Set(['building', 'landuse'])

    // Case next timer
    const ratedBefore = features.find(feature => feature.source === RATED_LAYER_SRC)
    if (ratedBefore) {
      console.log('found rated feature', ratedBefore);
      drawControl?.trash()


      flyToFeature(map, ratedBefore)
      setFeature(ratedBefore)
      return;
    }

    // Case first timer
    const featureToRate = features.find(feature => featuresNeeded.has(feature.sourceLayer))
    if (featureToRate?.id) {
      console.log('found feature', featureToRate);
      drawControl?.trash()


      const zoom = map.getZoom()
      const [lng, lat] = flyToFeature(map, featureToRate, zoom < 16 ? 16 : zoom) //TODO make some sort of buffer 
      const geometry = lesserGeometry(featureToRate)

      const geocoded = await getAddress(lat, lng)
      featureToRate.properties.name = geocoded.address

      setFeature({ ...featureToRate, geometry })
      return;

    } else if (featureToRate) {
      console.log('interesting, but no id', featureToRate);
      drawControl?.trash()

      zoomOnEvent(map.getZoom() + 1)
      setFeature(null)
      return;
    }
    else {
      if (features?.[0]?.source === 'mapbox-gl-draw-hot') return;
      console.log('no interesting features', features);


      const labelTypes = new Set(['natural_label', 'place_label', 'poi_label', 'housenum_label', 'airport_label'])
      const labelFeature = features.find(feature => labelTypes.has(feature.sourceLayer))
      if (labelFeature) {
        const defaultZoom = map.getZoom() + 1
        defaultZoom < 16 && zoomOnEvent(defaultZoom)
      }
      resetRater()
      return;
    }
  }

  map.on('click', mapClickEventHandler);
  return () => map.off('click', mapClickEventHandler);
}