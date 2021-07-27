import { api, requsetMaker } from './config'

export async function loginWithCreds(creds) {
  const f = requsetMaker('POST', 'auth', 'login', { ...creds }, true)
  return await f()
}

export const refresh = requsetMaker('GET', 'auth', 'refresh', null, true)

export const logout = requsetMaker('GET', 'auth', 'logout', null, true)

export async function loginbyGoogle(creds, token) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ ...creds }),
    credentials: 'include'
  }
  try {
    const response = await fetch(api + 'auth/glogin', options)
    const res = await response.json()
    return res
  } catch (err) {
    return err
  }
}
