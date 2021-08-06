import { setLoginStatus } from './app'
// Name consts
const WRITECREDENTIALS = 'user/set_credentials'
const CHANGELEVEL = 'user/set_level'

// Reducer
const basicState = {
  name: 'anonimus',
  login: '',
  level: 0,
  id: 'anonimus',
  comments: 0,
  avatar: null
}
export let initialState = { ...basicState }

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
  setCredentials(d, basicState)
  setLoginStatus(d, false)
}

export const setUserLevel = (d, level) => {
  d({ type: WRITECREDENTIALS, newLevel: Number(level) })
}