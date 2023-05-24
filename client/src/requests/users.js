import { requestMaker } from "./config"

export async function registerUser(data) {
  const f = requestMaker('POST', 'users', 'register', { ...data }, true)
  return await f()
}

export async function registerGUser(data) {
  const f = requestMaker('POST', 'users', 'gregister', { ...data }, true)
  return await f()
}

export async function updateUser(data) {
  const f = requestMaker('POST', 'users', 'update', { ...data }, true)
  return await f()
}

export async function updateUserPword(data) {
  const f = requestMaker('POST', 'users', 'updatePword', { ...data }, true)
  return await f()
}

export async function setLanguage(lang) {
  const f = requestMaker('GET', 'settings', 'setLang', null, true, 'lang=' + lang)
  return await f()
}
