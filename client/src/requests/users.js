import { api } from './config'

export async function registerUser(data) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...data })
  }
  try {
    const response = await fetch(api + 'users/register', options)
    const res = await response.json()
    return res
  } catch (err) {
    return err
  }
}