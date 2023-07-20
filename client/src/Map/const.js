// DB x-y values are stored according to this zoom
export const LAYOUT_ZOOM = 16;

export const RATED_LAYER_ID = "ratedFeatures";
export const RATED_LAYER_SRC = "ratedFeaturesSource";
export const SELECTED_FEATURE_ID = "selectedFeature";
export const SELECTED_FEATURE_LAYER_SRC = "selectedFeatureSrc";

export const SKIP_BANNER_LOCAL_STORAGE_KEY = "m4ps/skip_banner";
export const SKIP_AUTH_LOCAL_STORAGE_KEY = "m4ps/skip_auth";

export const MAPBOX_STYLES = {
  standart: "mapbox://styles/ilyaizr/ckq2l808k0ifn17o0x0yl9qi4",
  dark: "mapbox://styles/ilyaizr/cktd77j8u12ch18swzrqikqor",
  "b&w": "mapbox://styles/ilyaizr/ckpk75aca0hbg17ouqvzsda51", //todo, basic map
  blueprint: "mapbox://styles/ilyaizr/cksp4jldx0b1z17mog8wzg0jm", //blueprint with less colors
};

export const DEFAULT_LOCATION = {
  // Bryansk atm has the most real data
  lng: 34.354,
  lat: 53.235,
};
export const DEFAULT_ZOOM = 16;
