import { setLoginStatus } from './app'
// Name consts
const WRITECREDENTIALS = 'user/set_credentials'
const CHANGELEVEL = 'user/set_level'

// Reducer
const initialState = {
  name: 'anonimus',
  login: 'anonimus',
  level: 0,
  id: 1, 
  comments: 0, 
  avatar: null
}

export function userReducer(state = initialState, act) {
  switch (act.type) {
    case WRITECREDENTIALS: {
      return {
        ...state, ...act.credentials
      }
    }
    case CHANGELEVEL: {
      return {
        ...state, level: act.newLevel
      }
    }
    default:
      return state
  }
}

// Actions
export const setCredentials = (d, creds) => {
  d({ type: WRITECREDENTIALS, credentials: { ...creds } })
}
export const logIntoApp = (d, creds) => {
  setCredentials(d, creds)
  setLoginStatus(d, true)
}
export const logOutOfApp = (d) => {
  setCredentials(d, initialState)
  setLoginStatus(d, false)
}

export const setUserLevel = (d, level) => {
  d({ type: WRITECREDENTIALS, newLevel: Number(level) })
}