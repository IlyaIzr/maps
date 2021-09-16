import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { TEXT } from '../rest/lang'
import { LeftMenu } from './LeftMenu'
import './Nav.css'
import { ReactComponent as Hamburger } from '../rest/svg/hamburger.svg';
import { ReactComponent as WoldIcon } from '../rest/svg/world2.svg';
import { ReactComponent as ArrowsIcon } from '../rest/svg/arrows.svg';

export const NavMain = () => {
  const app = useSelector(state => state.app)
  const { friends, id } = useSelector(state => state.user)
  const history = useHistory()

  const [leftMenu, setLeftMenu] = useState(false)
  const [modeLabel, setModeLabel] = useState(TEXT.defaultMode)

  function showLeftMenu() {
    setLeftMenu(true)
  }
  function backToMain() {
    setLeftMenu(false)
    history.push('/')
  }

  useEffect(() => {
    (function () {
      const label = getMapModeLabel(app, friends, id)
      return setModeLabel(label)
    })()
    // eslint-disable-next-line
  }, [app.mode, app.friendModeId, app.tagModeTag])


  // swipe
  const ref = useRef(null)
  const [touchStart, setTouchStart] = useState(undefined)
  const [touchEnd, setTouchEnd] = useState(undefined)
  const [showArrows, setShowArrows] = useState(true);

  useEffect(() => {
    const bar = ref.current
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

    bar.addEventListener('touchstart', handleTouch, false)
    bar.addEventListener('touchmove', handleTouch, false)
    bar.addEventListener('touchend', handleTouchEnd, false)
    // eslint-disable-next-line
  }, [])
  useEffect(() => {
    if (touchStart < touchEnd && touchEnd - touchStart > 8) {
      setTouchStart(undefined)
      setTouchEnd(undefined)
      showLeftMenu()
      setShowArrows(false)
    } else if (touchEnd !== undefined) {
      setTouchStart(undefined)
      setTouchEnd(undefined)
    }
    // eslint-disable-next-line
  }, [touchEnd, touchStart])

  function onSideClick() {
    setTouchStart(undefined)
    setTouchEnd(undefined)
    showLeftMenu()    
    setShowArrows(false)
  }

  return (
    <div className="mainNavigation mp-bg-light mp-border-secondary mp-shadow-primary">
      <LeftMenu leftMenu={leftMenu} setLeftMenu={setLeftMenu} />
      <div className="flex-wrap nav-menu-back-wrap">
        {app.mapHidden &&
          <div id="backToMain" className="nav-icon" onClick={backToMain} title={TEXT.toMain}>
            <WoldIcon fill="var(--accent)" />
          </div>
        }
        <div id="openLeftMenu" className="nav-icon" onClick={showLeftMenu} title={TEXT.menu}>
          <Hamburger fill="var(--primary)" />
        </div>
        <Link to="/mapMode" className="currModeLabels">
          <span className="mp-dark">{TEXT.mode + ': '} </span><span className="mp-counter">
            {modeLabel}
          </span>
        </Link>
        <div className="naviFreeSpace mp-secondary relative" ref={ref} onClick={onSideClick}>&#8203;
          {showArrows && <ArrowsIcon id="arrows-icon" className="mobile" fill="var(--secondary)" />}
        </div>
      </div>
    </div>
  )
}

export function getMapModeLabel(app, friends, myId) {
  const { mode, tagModeTag, friendModeId } = app
  if (mode === 'watch' && friendModeId === myId) return TEXT.myMarks
  if (mode === 'watch') return TEXT.marksOf + ' ' + friendName(friends, app)
  if (mode === 'draw') return TEXT.drawing
  if (mode === 'drawRoute') return TEXT.drawRouteMode
  if (mode === 'tags') return TEXT.tag + ' #' + tagModeTag
  return TEXT.defaultMode
}

export function friendName(friends, app) {
  const friend = friends.find(friend => friend.id === app.friendModeId)
  if (!friend) return TEXT.error + ' #frMode#0'
  return friend.name + ' (' + friend.login + ')'
}