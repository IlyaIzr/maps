import { initialState } from "../store/app";
import { getPreferences, initLocalStorage } from "../store/localstorage";
import { initializeThemeColors, setColors } from "./colors"
import { appThemes } from "./config"

export async function initActions() {
  initLocalStorage()

  let theme = appThemes[0]
  let preferences = getPreferences()
  // console.log('%c⧭', 'color: #bfffc8', preferences);

  if (preferences.theme && appThemes.indexOf(preferences.theme) > -1) {
    theme = preferences.theme
    initialState.theme = preferences.theme
  }

  initializeThemeColors()
  document.head.insertAdjacentHTML("beforeend", `<style>:root{}</style>`)
  setColors(theme)
}