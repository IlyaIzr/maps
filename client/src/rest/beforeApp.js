import { initializeThemeColors, setColors } from "./colors"
import { appThemes } from "./config"

export async function initActions() {
  let theme = appThemes[0]
  // window. get theme
  // if no theme
  initializeThemeColors()
  document.head.insertAdjacentHTML("beforeend", `<style>:root{}</style>`)
  setColors(theme)
}