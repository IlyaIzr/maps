import { projectPrefix } from "../rest/config";

export function getPreferences() {
  const prefs = window.localStorage.getItem(projectPrefix + '/preferences')
  if (prefs) return JSON.parse(prefs)
  return null
}

export function getPreference(preference = '') {
  const prefs = getPreferences()
  return prefs?.[preference] || null
}

export function initLocalStorage() {
  if (!getPreferences()) window.localStorage.setItem(projectPrefix + '/preferences', '{}')
}

export function setPreference(preference, value) {
  const prefs = getPreferences() || {}
  prefs[preference] = value
  window.localStorage.setItem(projectPrefix + '/preferences', JSON.stringify(prefs))
}