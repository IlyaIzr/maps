
// Reducer
const basicState = {
  // Feature[] possible
  geodata: [],
  currentFeature: null
}
export let initialState = { ...basicState }

export function mapReducer(state = initialState, act) {
  switch (act.type) {
    case SETGEODATA: {
      return {
        ...state, ...act.geodata
      }
    }
    case ADDGEODATA: {
      return {
        ...state, geodata: [...(state.geodata || []), ...act.geodata]
      }
    }
    case REMOVEGEODATA: {
      const newGeodata = state.geodata.filter(feature => {
        try {
          if (!feature.id && !feature.property.id) 
          console.log('%c⧭ wierd feature', 'color: #e5de73', feature);
          return !act.featureIds.includes(feature.id || feature.property.id)
        } catch (error) {
          console.log('%c⧭ error for deleting this feature', 'color: #994d75', feature);          
        }
      })
      return {
        ...state, geodata: newGeodata
      }
    }
    case SETFEATURE: {
      return { ...state, ...act.feature }
    }
    default: return state
  }
}

export function setAppGeodata(d, geodata) {
  d({ type: SETGEODATA, geodata })
}
export function addAppGeodata(d, geodata) {
  d({ type: ADDGEODATA, geodata })
}
export function removeAppGeodata(d, featureIds) {
  d({ type: REMOVEGEODATA, featureIds })
}
export function setCurrentFeature(d, feature) {
  d({ type: SETFEATURE, feature })
}

var SETGEODATA = 'map/setGeodata'
var ADDGEODATA = 'map/addGeodata'
var REMOVEGEODATA = 'map/removeGeodata'
var SETFEATURE = 'map/setCurrentFeature'
