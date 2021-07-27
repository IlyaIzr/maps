import { appThemes } from "../rest/config"

// Name consts
const LOGINUSER = 'app/log_in'
const LOGOUTUSER = 'app/log_out'
const EXPAND_COMMENTS = 'app/expand_comms'
const SHRINK_COMMENTS = 'app/shrink_comms'
const SHOW_MAIN = 'app/show_main'
const HIDE_MAIN = 'app/hide_main'
const SET_MODAL = 'app/set_modal'
const CLOSE_MODAL = 'app/close_modal'
const SWITCH_THEME = 'app/switch_theme'
const SET_TOAST = 'app/set_toast'
const CLOSE_TOAST = 'app/close_toast'

// Reducer
export const initialState = {
  isLogged: false,
  language: 'ru',
  reviewsShown: true,
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
  // {
  //   message: 'some msg',
  //   clickAction: () => { },
  //   status: 'error', // also 'warning', 'info', 'complete',
  //   title: ''
  // }
}

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
      return {
        ...state, toast: act.toastInfo
      }
    }
    case CLOSE_TOAST: {
      return {
        ...state, toast: false
      }
    }
    default:
      return state
  }
}

// Actions
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
  status: 'error',
  title: ''
}) => {
  d({ type: SET_TOAST, toastInfo })
}

export const closeToast = (d) => {
  d({ type: CLOSE_TOAST })
}