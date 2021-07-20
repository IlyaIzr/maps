// Map rating colors
// const draftYellowPurple = ['#e9d5b8', '#e9c5ae', '#dfb7b6', '#d59dbd', '#c379cd', '#f729f6']
// const linearYellowPurpleMeak = ['#e9d1ba', '#edacc6', '#ef8fd1', '#f173db', '#f354e6', '#f729f6']
// const blackToPuplre = ['#170f11', '#2e122e', '#4a1c4a', '#6f2a6f', '#993a99', '#e262c9']
// const redGoldExperiment = ['#5b263c', '#a74b2f',  '#e2734a', '#d5aa83', '#e49b3b', 'gold']
// const linearYellowPurpleBright = ['#eedd71', '#efc682', '#f1a69a', '#f28faa', '#f469c6', '#f729f6']
// const greenRedClassics = ['#712d2d', '#a74b2f', '#e2734a', '#e1b87a', '#8bd38b', '#18a019']

import { appThemes } from "./config"

// const lightGreenRed = ['#712d2d', '#a74b2f', '#e2734a', '#e8c337', '#abff38', '#88ff45']
const brightGreenRed = ['#cd0c0c', '#e14612', '#e1922c', '#e8c337', '#94c52f', '#0aa112']

export const gradient = brightGreenRed


// Some green
// export const accentColor = '#a5ec37'
// pale red
// export const accentColor = '#ffadad'

export const accentColor = '#ffc900'
// export const counterAccent = '#bcbfff' //good color that doesn't shown. TODO implemetation https://stackoverflow.com/questions/52162989/mapbox-gl-js-changing-polygon-border-width
export const counterAccent = 'blue'

// const colors = {
//   primary: 'primary',
//   secondary: 'secondary',
//   accent: 'accent',
//   light: 'light',
//   dark: 'dark',
//   counter: 'counter',
// }
const colors = [
  'primary',
  'secondary',
  'accent',
  'light',
  'dark',
  'counter'
]

export const themeColors = {
  standart: {
    primary: "aliceblue",
    secondary: "#b3b0ae",
    accent: "#ffc900",
    light: "#e6e4e0",
    dark: "#555",
    counter: "#3e69db",
  },
  dark: {
    primary: '#BB86FC',
    secondary: '#392452',
    accent: '#03DAC6',
    light: '#383736',
    dark: '#d8d8d8',
    counter: '#0383da',
  },
  'b&w': {
    primary: '#444444',
    secondary: '#747474',
    accent: '#313131',
    light: '#f1f1f1',
    dark: '#0f0f0f',
    counter: '#cccccc',
  },
  blueprint: {
    'primary': '#1937e4',
    'secondary': '#199CE4',
    'accent': '#9de419',
    'light': '#d4d4d4',
    'dark': '#353535',
    'counter': '#e46119',
  }
}

export function setColors(theme = appThemes[0]) {
  const styleRoot = document.querySelector(":root").style
  Object.entries(themeColors[theme]).forEach(([colName, colValue]) => styleRoot.setProperty('--' + colName, colValue))
}

export function initializeThemeColors() {
  let styleString = ""
  const mp = '.mp'

  colors.forEach(color => {
    styleString += `
    ${mp}-${color}{color: var(--${color})}
    ${mp}-${color}-hover:hover{color: var(--${color})}

    ${mp}-bg-${color}{background-color: var(--${color})}
    ${mp}-bg-${color}-hover:hover{background-color: var(--${color})}

    ${mp}-border-${color}{border-color: var(--${color})}
    ${mp}-shadow-${color}{ box-shadow: var(--${color}) 2px 2px 4px }
    `
  })


  document.head.insertAdjacentHTML("beforeend", `<style>${styleString}</style>`)
}