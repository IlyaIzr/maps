// Reducer
const basicState = {
  geodata: [], // Feature[]
  currentFeature: null,
  isMapLoaded: false,
};

// set of strings of feature.properties.id where id = `${osmId}${isoCode}`
let storedFeatureIds = new Set();
const initialState = { ...basicState };

export function mapReducer(state = initialState, act) {
  switch (act.type) {
    case SETGEODATA: {
      storedFeatureIds = new Set(
        act.geodata.map((feature) => feature.properties.id)
      );
      return {
        ...state,
        geodata: [...act.geodata],
      };
    }
    case ADDGEODATA: {
      const filteredGeodata = act.geodata.filter((feature) => {
        const featureId = feature.properties.id || feature.id;
        if (storedFeatureIds.has(featureId)) {
          return false;
        } else {
          storedFeatureIds.add(featureId);
          return true;
        }
      });
      if (!filteredGeodata.length) return state;
      return {
        ...state,
        geodata: [...(state.geodata || []), ...filteredGeodata],
      };
    }
    case UPSERTGEODATAFEATURE: {
      return upsertGeodataFeature(state, act.feature);
    }

    case REMOVEGEODATA: {
      const filteredGeodata = state.geodata.filter((feature) => {
        const featureId = feature.properties.id || feature.id;
        if (!featureId) {
          console.log("%c⧭ weird feature", "color: #e5de73", feature);
        }
        if (storedFeatureIds.has(featureId)) {
          storedFeatureIds.delete(featureId);
          return false;
        }
        return true;
      });
      return {
        ...state,
        geodata: filteredGeodata,
      };
    }
    case SETFEATURE: {
      return state;
      // TODO REMOVEEEEE !!!
      return { ...state, currentFeature: act.feature };
    }
    case SET_MAP_LOADING_STATE: {
      return { ...state, isMapLoaded: act.isLoaded };
    }
    default:
      return state;
  }
}

export function setAppGeodata(d, geodata = []) {
  d({ type: SETGEODATA, geodata });
}
export function addAppGeodata(d, geodata) {
  d({ type: ADDGEODATA, geodata });
}
export function upsertFeatureToAppGeodata(d, feature) {
  d({ type: UPSERTGEODATAFEATURE, feature });
}
export function removeAppGeodata(d, featureIds) {
  d({ type: REMOVEGEODATA, featureIds });
}
export function setCurrentFeature(d, feature) {
  d({ type: SETFEATURE, feature });
}
export function setMapLoadingState(d, isLoaded) {
  d({ type: SET_MAP_LOADING_STATE, isLoaded });
}

var SETGEODATA = "map/setGeodata";
var ADDGEODATA = "map/addGeodata";
var REMOVEGEODATA = "map/removeGeodata";
var UPSERTGEODATAFEATURE = "map/upsert_one_feature";
var SETFEATURE = "map/setCurrentFeature";
var SET_MAP_LOADING_STATE = "map/isLoaded";

function upsertGeodataFeature(state, feature) {
  const { geodata } = state;

  console.log("%c⧭ feature", "color: #86bf60", feature);

  console.log("%c⧭ geodata", "color: #ace2e6", [...geodata]);
  const featureId = feature.properties.id || feature.id;
  let found = false;

  const updatedGeodata = geodata.map((existingFeature) => {
    const existingFeatureId =
      existingFeature.properties.id || existingFeature.id;

    if (existingFeatureId === featureId) {
      found = true;
      return { ...existingFeature, properties: feature.properties }; // Replace existing feature with the updated props
    }

    return existingFeature; // Preserve other features
  });

  if (!found) {
    updatedGeodata.push(feature); // Add new feature if it doesn't exist already
  }

  console.log("%c⧭ updatedGeodata", "color: #9c66cc", updatedGeodata);
  return {
    ...state,
    geodata: updatedGeodata,
  };
}
