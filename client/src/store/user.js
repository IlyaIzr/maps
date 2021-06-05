import { setLoginStatus } from './app'
// Name consts
const WRITECREDENTIALS = 'user/set_credentials'
const CHANGELEVEL = 'user/set_level'

// Reducer
const initialState = {
  name: 'anonimus',
  login: 'anonimus',
  level: 0,
  id: 1
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
export const setCredentials = (d, name, login, id) => {
  d({ type: WRITECREDENTIALS, credentials: { name, login, id } })
}
export const logIntoApp = (d, name, login, id) => {
  setCredentials(d, name, login, id)
  setLoginStatus(d, true)
}
export const logOutOfApp = (d) => {
  setCredentials(d, '', '', '')
  setLoginStatus(d, false)
}

export const setUserLevel = (d, level) => {
  d({ type: WRITECREDENTIALS, newLevel: Number(level) })
}