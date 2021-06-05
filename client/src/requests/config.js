if (process.env.NODE_ENV === 'production') {
  var prodAdress = process.env.REACT_APP_PROD
}

export const host = prodAdress || process.env.REACT_APP_LOCAL
export const api = host + 'api/'