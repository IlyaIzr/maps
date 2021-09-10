import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { TEXT } from '../rest/lang'
import { LeftMenu } from './LeftMenu'
import './Nav.css'
import { ReactComponent as Hamburger } from '../rest/svg/hamburger.svg';
import { ReactComponent as WoldIcon } from '../rest/svg/world2.svg';

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
  return friend.name + ' (' + friend.login + ')'
}