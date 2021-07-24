import { api } from './config'

export async function loginWithCreds(creds) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...creds }),
    credentials: 'include'
  }
  try {
    const response = await fetch(api + 'auth/login', options)
    const res = await response.json()
    return res
  } catch (err) {
    return err
  }
}


export async function refresh() {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  }
  try {
    const response = await fetch(api + 'auth/refresh', options)
    const res = await response.json()
    return res
  } catch (err) {
    return err
  }
}

export async function logout() {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  }
  try {
    const response = await fetch(api + 'auth/logout', options)
    const res = await response.json()
    return res
  } catch (err) {
    return err
  }
}