import { useState } from "react"
import { DefNav } from "./left/DefNav"
import { LangNav } from "./left/LangNav"
import { ThemeNav } from "./left/ThemeNav"
export const navStates = { default: 'default', theme: 'theme', language: 'language' }

export const LeftMenu = ({ leftMenu, setLeftMenu }) => {
  const [navState, setNavState] = useState(navStates.default) // also 'theme' and 'language'

  function hideSelf() {
    setLeftMenu(false)
  }

  const cn = "mp-bg-light mp-border-secondary"

  return (
    <div id="left-menu" className={leftMenu ? "active " + cn : cn}>

      {navState === navStates.default && <DefNav hideSelf={hideSelf} setNavState={setNavState} />}
      {navState === navStates.theme && <ThemeNav hideSelf={hideSelf} setNavState={setNavState} />}
      {navState === navStates.language && <LangNav setNavState={setNavState} />}

      <div id="closeLeftAtBottom">
        <button onClick={hideSelf}>x</button>
      </div>
    </div>
  )
}
