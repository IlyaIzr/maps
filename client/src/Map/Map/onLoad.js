import { gradients, themeColors } from "~rest/colors";
import { RATED_LAYER_SRC, SELECTED_FEATURE_LAYER_SRC } from "../const";
import { setMapLoadingState } from "../../store/map";
import { tileServiceInstance } from "./tileService";

const MIN_ZOOM = 8;

export function mapOnLoad(map, theme, dispatch, noDataCb) {
  console.log("%c⧭ mapOnLoads", "color: #00b300", theme);
  // Register cities banner
  tileServiceInstance.registerNoDataCallback(noDataCb);

  map.on("load", function (e) {
    const gradient = gradients[theme];

    // Define a source before using it to create a new layer
    map.addSource(RATED_LAYER_SRC, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });
    map.addSource(SELECTED_FEATURE_LAYER_SRC, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });

    // Draw data on map

    // __draw our layer underneath labels
    const layers = map.getStyle().layers;
    const firstSymbolId = layers.find((layer) => layer.type === "symbol").id;

    const fallbackColor = themeColors[theme].accent;

    const fillColor = [
      "interpolate",
      ["linear"],
      ["coalesce", ["get", "rating"], -1],
      -1,
      fallbackColor,
      0,
      gradient[0],
      1,
      gradient[1],
      2,
      gradient[2],
      3,
      gradient[3],
      4,
      gradient[4],
      5,
      gradient[5],
    ];

    map.addLayer(
      {
        id: "ratedFeatures",
        source: RATED_LAYER_SRC,
        // 'source-layer': 'building',
        minzoom: MIN_ZOOM,
        type: "fill",
        paint: {
          // TODO opacity formula
          // 'fill-opacity': [
          //   "interpolate", ["linear"], ['get', 'amount'],

          //   0, 0,
          //   1, 0.3,
          //   2, 0.4,
          //   3, 0.5,
          //   4, 0.6,
          //   5, 0.7,
          //   10, 0.8,
          //   15, 0.9
          // ],
          "fill-opacity": [
            "interpolate",
            ["linear"],
            ["get", "amount"],

            0,
            0.1,
            1,
            0.25,
            3,
            0.5,
            5,
            0.8,
          ],
          // 'fill-opacity': 0.9,

          "fill-color": fillColor,
        },
      },
      firstSymbolId
    );

    map.addLayer(
      {
        id: "selectedFeature",
        source: SELECTED_FEATURE_LAYER_SRC,
        minzoom: MIN_ZOOM,
        type: "fill",
        paint: {
          "fill-opacity": 0.9,
          "fill-color": fillColor,
          "fill-outline-color": themeColors[theme].counter,
        },
      },
      firstSymbolId
    );
    // combine ^ with outline layer
    map.addLayer(
      {
        id: "selectedFeatureOutline",
        source: SELECTED_FEATURE_LAYER_SRC,
        minzoom: MIN_ZOOM,
        type: "line",
        paint: {
          "line-color": themeColors[theme].accent,
          "line-width": 4,
        },
      },
      firstSymbolId
    );

    setMapLoadingState(dispatch, true);
    // map.addSource("satelliteImagerySource", {
    //   type: "raster",
    //   tiles: [
    //     `https://{switch:a,b,c,d}.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg?access_token=${
    //       import.meta.env.VITE_MAPBOX_T
    //     }`,
    //   ],
    //   tileSize: 256,
    // });

    // map.addLayer({
    //   id: "sateliteImagery",
    //   type: "raster",
    //   source: "satelliteImagerySource",
    //   minzoom: 0,
    //   maxzoom: 22,
    //   layout: {
    //     visibility: "visible",
    //   },

    //   paint: {
    //     "raster-opacity": 0.5,
    //   },
    // });
  });
}
