import { gradients, themeColors } from "../rest/colors";

export function mapOnLoad(map, geoJson, theme) {
  map.on('load', function (e) {
    const gradient = gradients[theme]

    // Define a source before using it to create a new layer
    map.addSource('ratedFeaturesSource', {
      type: 'geojson',
      data: {
        "type": "FeatureCollection",
        "features": geoJson
      },
    });
    map.addSource('selectedFeatureSrc', {
      type: 'geojson',
      data: {
        "type": "FeatureCollection",
        "features": []
      },
    });


    // Draw data on map

    // __draw our layer underneath labels
    const layers = map.getStyle().layers;
    const firstSymbolId = layers.find(layer => layer.type === 'symbol').id;

    map.addLayer({
      'id': 'ratedFeatures',
      'source': 'ratedFeaturesSource',
      // 'source-layer': 'building',
      'minzoom': 11,
      'type': 'fill',
      paint: {
        'fill-opacity': 0.5,

        'fill-color': [
          "interpolate", ["linear"], ['get', 'rating'],

          0, gradient[0],
          1, gradient[1],
          2, gradient[2],
          3, gradient[3],
          4, gradient[4],
          5, gradient[5]
          // 1, '#eee2cc',
          // 5, gradient[5]
        ]
      }
    }, firstSymbolId)

    map.addLayer({
      'id': 'selectedFeature',
      'source': 'selectedFeatureSrc',
      'minzoom': 13,
      'type': 'fill',
      paint: {
        'fill-opacity': 0.9,
        'fill-color': themeColors[theme].accent,
        'fill-outline-color': themeColors[theme].counter
      }
    }, firstSymbolId)

  })
}