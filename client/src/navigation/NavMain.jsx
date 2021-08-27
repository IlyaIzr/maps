import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { TEXT } from '../rest/lang'
import { LeftMenu } from './LeftMenu'
import './Nav.css'
import { ReactComponent as Hamburger } from '../rest/svg/hamburger.svg';
import { ReactComponent as WoldIcon } from '../rest/svg/world2.svg';

export const NavMain = () => {
  const app = useSelector(state => state.app)
  const friends = useSelector(state => state.user.friends)
  const [leftMenu, setLeftMenu] = useState(false)
  const history = useHistory()

  function showLeftMenu() {
    setLeftMenu(true)
  }
  function backToMain() {
    setLeftMenu(false)
    history.push('/')
  }
  function initials() {
    const friend = friends.find(friend => friend.id === app.friendModeId)
    return friend.name + ' (' + friend.login + ')'
  }
  function modeLabel() {
    const { mode } = app
    if (mode === 'watch') return TEXT.marksOf + ' ' + initials()
    if (mode === 'draw') return TEXT.drawing
    if (mode === 'drawRoute') return TEXT.drawRouteMode
    return TEXT.defaultMode
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
        <Link to="/watchMode">
          <span className="mp-dark">{TEXT.mode + ': '} </span><span className="mp-counter">
            {modeLabel()}
          </span>
        </Link>
      </div>
    </div>
  )
}
