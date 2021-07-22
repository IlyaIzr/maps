import { api } from './config'

export async function loginWithCreds(creds) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...creds })
  }
  try {
    const response = await fetch(api + 'auth/login', options)
    const res = await response.json()
    return res
  } catch (err) {
    return err
  }
}