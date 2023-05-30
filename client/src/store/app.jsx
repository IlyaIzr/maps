import { appThemes } from "../rest/config"

/* #region Name consts  */

const LOGINUSER = 'app/log_in'
const LOGOUTUSER = 'app/log_out'
const EXPAND_COMMENTS = 'app/expand_comms'
const SHRINK_COMMENTS = 'app/shrink_comms'
const CLOSE_LEGEND = 'app/close_legend'
const SHOW_MAIN = 'app/show_main'
const HIDE_MAIN = 'app/hide_main'
const SET_MODAL = 'app/set_modal'
const CLOSE_MODAL = 'app/close_modal'
const SWITCH_THEME = 'app/switch_theme'
const SET_TOAST = 'app/set_toast'
const CLOSE_TOAST = 'app/close_toast'
const RERENDERMAP = 'app/rerender_map'
const SET_FRIEND_ID = 'app/friend_id'
const SET_TAG = 'app/set_tag'
const SET_MODE = 'app/set_mode'
const SET_MAPREF = 'app/set_mapref'
const SET_BANNER = 'app/set_banner'
const CLOSE_BANNER = 'app/close_banner'

/* #endregion */


/* #region  Init State */

export const initialState = {
  isLogged: false,
  reviewsShown: true,
  legendShown: true,
  mapHidden: false,
  modal: false,
  // modal: {
  //   message: 'sada',
  //   acceptLabel: 'YES',
  //   cancelLabel: 'NO',
  //   acceptAction: () => { },
  //   cancelAction: () => { }
  // },
  theme: appThemes[0],
  toast: false,
  // toast: {
  //   message: 'some msg',
  //   clickAction: () => { },
  //   status: 'error', // also 'warning', 'info', 'complete',
  //   title: ''
  // }
  banner: false,
  // banner: {
  //   content: JXS.Element,
  //   bottomControls?: {
  //     element: JSX.Element,
  //     onClick: () => null
  //   }[],
  //   onOuterClick?: (e) => e,
  //   onCrossClick?: (e) => e
  // },
  mapKey: 1000,
  mode: null, // special modes: 'watch', 'draw', 'drawRoute', 'tags', '?withRoutes'
  friendModeId: null,
  tagModeTag: null,
  mapRef: null
}

/* #endregion */

// Reducer

export function appReducer(state = initialState, act) {
  switch (act.type) {
    case LOGINUSER: {
      return {
        ...state, isLogged: true
      }
    }
    case LOGOUTUSER: {
      return {
        ...state, isLogged: false
      }
    }
    case SHRINK_COMMENTS: {
      return {
        ...state, reviewsShown: false
      }
    }
    case EXPAND_COMMENTS: {
      return {
        ...state, reviewsShown: true
      }
    }
    case CLOSE_LEGEND: {
      return {
        ...state, legendShown: false
      }
    }
    case SHOW_MAIN: {
      return {
        ...state, mapHidden: false
      }
    }
    case HIDE_MAIN: {
      return {
        ...state, mapHidden: true
      }
    }
    case SET_MODAL: {
      return {
        ...state, modal: act.modalInfo
      }
    }
    case CLOSE_MODAL: {
      return {
        ...state, modal: false
      }
    }
    case SWITCH_THEME: {
      return {
        ...state, theme: act.theme
      }
    }
    case SET_TOAST: {
      const key = Math.random()
      return {
        ...state, toast: { ...act.toastInfo, key }
      }
    }
    case CLOSE_TOAST: {
      return {
        ...state, toast: false
      }
    }    
    case SET_BANNER: {
      return {
        ...state, banner: { ...act.bannerInfo }
      }
    }
    case CLOSE_BANNER: {
      return {
        ...state, banner: false
      }
    }
    case RERENDERMAP: {
      return {
        ...state, mapKey: Number(state.mapKey) + 1
      }
    }
    case SET_FRIEND_ID: {
      return {
        ...state, friendModeId: act.id
      }
    }
    case SET_TAG: {
      return {
        ...state,
        tagModeTag: act.tag
      }
    }
    case SET_MODE: {
      const mode = act.mode
      const prevMode = state.mode
      if (!mode) return { ...state, mode: null, friendModeId: null, tagModeTag: null }
      
      if (mode === prevMode) return { ...state }

      const res = {
        ...state, mode
      }
      if (mode === 'draw' || prevMode === 'draw') res.mapKey += 1
      if (mode !== 'watch') res.friendModeId = null
      return res
    }
    case 'app/reset': {
      return {
        ...initialState
      }
    }
    case SET_MAPREF: {
      return {
        ...state, mapRef: act.mapRef
      }
    }

    default:
      return state
  }
}

/* #region  Actions */

export const setLoginStatus = (d, status = false) => {
  if (status) d({ type: LOGINUSER })
  else d({ type: LOGOUTUSER })
}

export const expandComments = (d) => {
  d({ type: EXPAND_COMMENTS })
}

export const shrinkComments = (d) => {
  d({ type: SHRINK_COMMENTS })
}

export const closeMapLegend = (d) => {
  d({ type: CLOSE_LEGEND })
}

export const showMain = (d) => {
  d({ type: SHOW_MAIN })
}

export const hideMain = (d) => {
  d({ type: HIDE_MAIN })
}

export const setModal = (d, modalInfo = {
  message: '',
  acceptLabel: '',
  cancelLabel: '',
  acceptAction() { },
  cancelAction() { },
  children: <></>
}) => {
  d({ type: SET_MODAL, modalInfo })
}

export const closeModal = (d) => {
  d({ type: CLOSE_MODAL })
}

export const switchTheme = (d, theme) => {
  if (appThemes.indexOf(theme) < 0) theme = appThemes[0]
  d({ type: SWITCH_THEME, theme })
}

export const setToast = (d, toastInfo = {
  message: '',
  clickAction() { },
  status: 'error', // also 'warning', 'info', 'complete',
  title: ''
}) => {
  d({ type: SET_TOAST, toastInfo })
}

export const closeToast = (d) => {
  d({ type: CLOSE_TOAST })
}

export const setBanner = (d, bannerInfo = {
    content: <></>,
    bottomControls: [],
    onOuterClick: (e) => e,
    onCrossClick: (e) => e
}) => {
  d({ type: SET_BANNER, bannerInfo })
}

export const closeBanner = (d) => {
  d({ type: CLOSE_BANNER })
}

export const rerenderMap = (d) => {
  d({ type: RERENDERMAP })
}

export const friendModeId = (d, id) => {
  d({ type: SET_FRIEND_ID, id })
}

export const tagModeTag = (d, tag) => {
  d({ type: SET_TAG, tag })
}

export const setMapMode = (d, mode) => {
  const modes = ['watch', 'draw', 'drawRoute', 'tags', '?withRoutes']
  if (!modes.includes(mode)) mode = null
  d({ type: SET_MODE, mode })
  // rerenderMap(d)
}

export const resetAppState = (d) => d({ type: 'app/reset' })

export const setMapRef = (d, mapRef) => d({ type: SET_MAPREF, mapRef })

/* #endregion */
