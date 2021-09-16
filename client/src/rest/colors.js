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
const darkGradient = [
  '#850000', '#9c330d',
  '#b8740f', '#b3a700',
  '#88c70a', '#00e00b'
]
const paleGreenRed = [
  '#422424', '#723e36',
  '#866b3c', '#afb766',
  '#96ce7e', '#5fb961'
]
const dynamicGreenRed = [
  '#422424', '#723e36',
  '#866b3c', '#afb766',
  '#6bc41c', '#149f04'
]


export const gradient = brightGreenRed

export const gradients = {
  standart: brightGreenRed,
  blueprint: dynamicGreenRed,
  dark: darkGradient,
  'b&w': paleGreenRed
}


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
  'counter',
  // 'comply'?
]

export const themeColors = {
  standart: {
    primary: "#5e7ba1",
    secondary: "#99a6b8",
    accent: "#c78605",
    light: "#f2f2f2",
    dark: "#575757",
    counter: "#2f396f",
  },
  dark: {
    primary: '#dd55ab',
    secondary: '#7b4780',
    accent: '#dab11b',
    light: '#262626',
    dark: '#d8d8d8',
    counter: '#35d5e3',
    // comply: '#0383da'
  },
  
  // olddark: {
  //   primary: '#b68de7',
  //   secondary: '#755a96',
  //   accent: '#03DAC6',
  //   light: '#383736',
  //   dark: '#d8d8d8',
  //   counter: '#e4d737',
  //   // comply: '#0383da'
  // },
  'b&w': {
    primary: '#8c8c8c',
    secondary: '#999999',
    accent: '#000000',
    light: '#ffffff',
    dark: '#575757',
    counter: '#454545',
  },
  blueprint: {
    'primary': '#e49bd3',
    'secondary': '#c9abca',
    'accent': '#e9eb7d',
    'light': '#34568b',
    'dark': '#ffffff',
    'counter': '#9affd5',
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