import { useEffect, useRef, useState } from "react"
import { DefNav } from "./left/DefNav"
import { LangNav } from "./left/LangNav"
import { ThemeNav } from "./left/ThemeNav"
import { ReactComponent as CloseIcon } from '../rest/svg/close3.svg';
import { TEXT } from "../rest/lang";
export const navStates = { default: 'default', theme: 'theme', language: 'language' }

export const LeftMenu = ({ leftMenu, setLeftMenu }) => {
  const ref = useRef(null)
  const [navState, setNavState] = useState(navStates.default) // also 'theme' and 'language'
  const [touchStart, setTouchStart] = useState(undefined)
  const [touchEnd, setTouchEnd] = useState(undefined)

  function hideSelf() {
    setLeftMenu(false)
  }

  useEffect(() => {
    const menu = ref.current
    function handleTouch(e) {
      var x = e.changedTouches[0].clientX;
      var total = this.clientWidth;
      var position = x - total;
      if (touchStart === undefined) {
        setTouchStart(start => {
          if (start === undefined) return Math.abs(position)
          return start
        })
      }
    }
    function handleTouchEnd(e) {
      var x = e.changedTouches[0].clientX;
      var total = this.clientWidth;
      var position = x - total;

      if (touchEnd === undefined) {
        setTouchEnd(Math.abs(position))
      }
    }

    menu.addEventListener('touchstart', handleTouch, false)
    menu.addEventListener('touchmove', handleTouch, false)
    menu.addEventListener('touchend', handleTouchEnd, false)
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (touchEnd > touchStart && touchEnd - touchStart > 15) {
      setTouchStart(undefined)
      setTouchEnd(undefined)
      hideSelf()
    } else if (touchEnd !== undefined) {
      setTouchStart(undefined)
      setTouchEnd(undefined)
    }
    // eslint-disable-next-line
  }, [touchEnd, touchStart])

  function onLeftClick(e) {
    e.stopPropagation()
    if (navState !== navStates.default) setNavState(navStates.default)
  }
  function doNothing(e) {
    e.stopPropagation()    
  }

  const cn = "mp-bg-light mp-border-secondary"

  return (
    <div id="left-menu" className={leftMenu ? "active " + cn : cn} ref={ref} onClick={onLeftClick}>
      <div onClick={doNothing}>
        {navState === navStates.default && <DefNav hideSelf={hideSelf} setNavState={setNavState} />}
        {navState === navStates.theme && <ThemeNav hideSelf={hideSelf} setNavState={setNavState} />}
        {navState === navStates.language && <LangNav setNavState={setNavState} />}
      </div>
      <div id="closeLeftAtBottom" onClick={hideSelf} className="cursor-pointer" title={TEXT.close}>
        <CloseIcon fill="var(--dark)" className="nav-icon" />
        <CloseIcon fill="var(--dark)" className="nav-icon" />
        <CloseIcon fill="var(--dark)" className="nav-icon" />
      </div>
    </div>
  )
}
