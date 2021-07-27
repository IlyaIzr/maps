import { refresh } from "../requests/auth";
import { initialState as appInitialState } from "../store/app";
import { initialState as userInitialState } from "../store/user";
import { getPreferences, initLocalStorage } from "../store/localstorage";
import { initializeThemeColors, setColors } from "./colors"
import { appThemes } from "./config"
import { TEXT } from "./lang";

export async function initActions() {
  // Prototypes
  // eslint-disable-next-line
  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }

  initLocalStorage()

  // Set prefered theme
  let theme = appThemes[3]
  let preferences = getPreferences()
  // console.log('%c⧭', 'color: #bfffc8', preferences);

  if (preferences.theme && appThemes.indexOf(preferences.theme) > -1) {
    theme = preferences.theme
    appInitialState.theme = preferences.theme
  }

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

  else {
    appInitialState.toast = {
      message: TEXT.initConnectionErr
    }
    return 'connection_error'
  }
}