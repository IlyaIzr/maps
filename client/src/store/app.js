// Name consts
const LOGINUSER = 'app/log_in'
const LOGOUTUSER = 'app/log_out'
const EXPAND_COMMENTS = 'app/expand_comms'
const SHRINK_COMMENTS = 'app/shrink_comms'

// Reducer
const initialState = {
  isLogged: false,
  language: 'en',
  reviewsShown: true
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