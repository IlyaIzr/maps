import { friendModeId, setLoginStatus, setMapMode } from './app'
// Name consts
const WRITECREDENTIALS = 'user/set_credentials'
const CHANGELEVEL = 'user/set_level'
const SETFRIENDS = 'user/set_friends'
const SETREQUESTS = 'user/set_requests'
const COMMENT_N = 'user/comments_number'

// Reducer
const basicState = {
  name: 'anonimus',
  login: '',
  level: 0,
  id: 'anonimus',
  commentsn: 0,
  avatar: null,
  friends: [],
  requests: [],
  isRoot: false
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
    case COMMENT_N: {
      return {
        ...state, commentsn: act.number
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
export const setLogInCreds = (d, creds) => {
  setCredentials(d, creds)
  setLoginStatus(d, true)
}
export const setLogOutCreds = (d) => {
  friendModeId(d, null)
  setMapMode(d, 'default')
  setCredentials(d, basicState)
  setLoginStatus(d, false)
}

export const setUserLevel = (d, level) => {
  d({ type: CHANGELEVEL, newLevel: Number(level) })
}

export const setUserFriends = (d, friends = []) => {
  d({ type: SETFRIENDS, friendsArr: friends })
}
export const setUserRequests = (d, requests = []) => {
  d({ type: SETREQUESTS, requestsArr: requests })
}


export const setCommentsNumber = (d, number) => d({ type: COMMENT_N, number })