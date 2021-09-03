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
  const friends = useSelector(state => state.user.friends)
  const history = useHistory()

  const [leftMenu, setLeftMenu] = useState(false)
  const [modeLabel, setModeLabel] = useState(TEXT.defaultMode);

  function showLeftMenu() {
    setLeftMenu(true)
  }
  function backToMain() {
    setLeftMenu(false)
    history.push('/')
  }
  function friendName() {
    const friend = friends.find(friend => friend.id === app.friendModeId)
    return friend.name + ' (' + friend.login + ')'
  }

  useEffect(() => {
    console.log('%c⧭', 'color: #7f7700', app, app.tagModeTag);
    (function() {
      const { mode } = app
      if (mode === 'watch') return setModeLabel(TEXT.marksOf + ' ' + friendName())
      if (mode === 'draw') return setModeLabel(TEXT.drawing)
      if (mode === 'drawRoute') return setModeLabel(TEXT.drawRouteMode)
      if (mode === 'tags') return setModeLabel(TEXT.tag + ' ' + app.tagModeTag)
      return setModeLabel(TEXT.defaultMode)
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
        <Link to="/watchMode" className="currModeLabels">
          <span className="mp-dark">{TEXT.mode + ': '} </span><span className="mp-counter">
            {modeLabel}
          </span>
        </Link>
      </div>
    </div>
  )
}
