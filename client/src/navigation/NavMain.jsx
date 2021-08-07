import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { TEXT } from '../rest/lang'
import { LeftMenu } from './LeftMenu'
import './Nav.css'
import { ReactComponent as Hamburger } from '../rest/svg/hamburger.svg';
import { ReactComponent as WoldIcon } from '../rest/svg/world2.svg';

export const NavMain = () => {
  const app = useSelector(state => state.app)
  const [leftMenu, setLeftMenu] = useState(false)
  const history = useHistory()

  function showLeftMenu() {
    setLeftMenu(true)
  }
  function backToMain() {
    setLeftMenu(false)
    history.push('/')
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
      </div>

      <span>Avatar and lvl</span>
      <span>Mode</span>
      <span>Collapse</span>
    </div>
  )
}
