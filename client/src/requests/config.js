const isProd = import.meta.env.MODE === 'production' && location.hostname !== 'localhost';
export const host = isProd ?
  import.meta.env.VITE_PROD_BE : import.meta.env.VITE_DEV_BE
export const api = host + 'api/'


export function requestMaker(method = 'GET', meta = 'auth', path = 'refresh', body = {}, withCreds = true, query = '') {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': host
    },
    mode: "cors"
  }

  if (withCreds) options.credentials = 'include'
  if (body) options.body = JSON.stringify({ ...body })

  const url = api + meta + '/' + path + (query && '?' + query)

  return async function () {
    try {
      const response = await fetch(url, options)
      const res = await response.json()
      return res
    } catch (err) {
      return err
    }
  }
}