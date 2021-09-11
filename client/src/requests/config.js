if (process.env.NODE_ENV === 'production') {
  var prodAdress = process.env.REACT_APP_PROD
}

export const host = prodAdress || process.env.REACT_APP_LOCAL
export const api = host + 'api/'


export function requsetMaker(method = 'GET', meta = 'auth', path = 'refresh', body = {}, withCreds = true, query = '') {
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