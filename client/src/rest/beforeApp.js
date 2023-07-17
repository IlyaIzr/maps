import { refresh } from "../requests/auth";
import { initialState as appInitialState } from "../store/app";
import { initialState as userInitialState } from "../store/user";
import { getPreferences, initLocalStorage } from "../store/localstorage";
import { initializeThemeColors, setColors } from "./colors"
import { appThemes } from "./config"
import { TEXT } from "./lang";

export async function initActions() {
  // Prototypes
  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }

  initLocalStorage()

  // Set preferred theme
  let theme = appThemes.at(import.meta.env.VITE_INIT_APPTHEME_INDEX)
  // Set default theme light if user prefers it
  if (window.matchMedia('prefers-color-scheme: light').matches) theme = appThemes[0]
  
  let preferences = getPreferences()
  // console.log('%c⧭', 'color: #bfffc8', preferences)
  // Rewrite theme if any
  if (preferences.theme && appThemes.indexOf(preferences.theme) > -1) theme = preferences.theme

  appInitialState.theme = theme

  initializeThemeColors()
  document.head.insertAdjacentHTML("beforeend", `<style>:root{}</style>`)
  setColors(theme)

  // Refresh cookie and info
  const res = await refresh()
  if (res.status === 'OK') {
    if (res.data) {
      Object.entries(res.data).forEach(([key, val]) => userInitialState[key] = val)
      appInitialState.isLogged = true
    }
  }
  else if (res.status === 'REAUTH') {
    return;// do nothing
  }

  else {
    appInitialState.toast = {
      message: TEXT.initConnectionErr
    }
    return 'connection_error'
  }
}