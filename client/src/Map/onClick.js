import { flyToFeature } from "./Map"

export function mapOnClick(map, setFeature, resetRater) {
  function geoFromTurf(geo) {
    if (!geo[1]) return geo[0]
    let res2 = window.turf.union(geo[0], geo[1])
    if (geo[2]) for (let i = 2; i < geo.length; i++) {
      res2 = window.turf.union(res2, geo[i])
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

  map.on('click', function (e) {
    resetRater()
    function zoomOnEvent(zoom) {
      const { lng, lat } = e.lngLat
      map.flyTo({ center: [lng, lat], zoom: zoom });
    }
    // if (map.getZoom() < 16) zoomOnEvent(16)

    const features = map.queryRenderedFeatures(e.point);
    const featuresNeeded = new Set(['building', 'landuse'])

    // Case next timer
    const ratedBefore = features.find(feature => feature.source === 'ratedFeaturesSource')
    if (ratedBefore) {
      console.log('found rated feature', ratedBefore.geometry);

      
      flyToFeature(map, ratedBefore)
      setFeature(ratedBefore)
      return;
    }

    // Case first timer
    const featureToRate = features.find(feature => featuresNeeded.has(feature.sourceLayer))
    if (featureToRate?.id) {
      console.log('found feature', featureToRate);
      // console.log('%c⧭ source', 'color: #1d5673', featureToRate.geometry);


      const zoom = map.getZoom()
      flyToFeature(map, featureToRate, zoom < 16 ? 16 : zoom) //TODO make some sort of buffer 
      // flyToFeature(map, featureToRate)
      setFeature({ ...featureToRate, geometry: lesserGeometry(featureToRate) })

    } else if (featureToRate) {
      console.log('interesting, but no id', featureToRate);


      zoomOnEvent(map.getZoom() + 1)
      setFeature(null)
    }
    else {
      console.log('no interesting features', features);


      const labelTypes = new Set(['natural_label', 'place_label', 'poi_label', 'housenum_label', 'airport_label'])
      const labelFeature = features.find(feature => labelTypes.has(feature.sourceLayer))
      if (labelFeature) {
        const defaultZoom = map.getZoom() + 1
        defaultZoom < 16 && zoomOnEvent(defaultZoom)
      }
      setFeature(null)
    }

  });
}