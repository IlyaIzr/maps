import { friendModeId, setLoginStatus, setMapMode } from './app'
// Name consts
const WRITECREDENTIALS = 'user/set_credentials'
const CHANGELEVEL = 'user/set_level'
const SETFRIENDS = 'user/set_friends'
const SETREQUESTS = 'user/set_requests'

// Reducer
const basicState = {
  name: 'anonimus',
  login: '',
  level: 0,
  id: 'anonimus',
  comments: 0,
  avatar: null,
  friends: [],
  requests: []
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
    case SETFRIENDS: {
      return {
        ...state, friends: [...act.friendsArr]
      }
    }
    case SETREQUESTS: {
      return {
        ...state, requests: [...act.requestsArr]
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
  friendModeId(d, null)
  setMapMode(d, 'default')
  setCredentials(d, basicState)
  setLoginStatus(d, false)
}

export const setUserLevel = (d, level) => {
  d({ type: WRITECREDENTIALS, newLevel: Number(level) })
}

export const setUserFriends = (d, friends = []) => {
  d({ type: SETFRIENDS, friendsArr: friends })
}
export const setUserRequests = (d, requests = []) => {
  d({ type: SETREQUESTS, requestsArr: requests })
}