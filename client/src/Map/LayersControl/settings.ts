import { TEXT } from "~rest/lang";

const MAPBOX_SATELITE_LAYER = {
  type: "raster",
  tiles: [
    `https://{switch:a,b,c,d}.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg?access_token=${
      import.meta.env.VITE_MAPBOX_T
    }`,
  ],
  tileSize: 256,
  minzoom: 0,
  maxzoom: 22,
  name: TEXT.mapboxSatelite.capitalize(),
  id: "mapboxSatelite",
};

export const layersToAdd = [{ ...MAPBOX_SATELITE_LAYER }];

export const SOURCE_POSTFIX = "Source";
export const INITIAL_OPACITY = 0.5;
