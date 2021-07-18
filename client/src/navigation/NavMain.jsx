import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { TEXT } from '../rest/lang'
import { showMain } from '../store/app'
import { LeftMenu } from './LeftMenu'
import './Nav.css'

export const NavMain = () => {
  const app = useSelector(state => state.app)
  const [leftMenu, setLeftMenu] = useState(false)
  const history = useHistory()
  const d = useDispatch()

  function showLeftMenu() {
    setLeftMenu(true)
  }
  function backToMain() {
    setLeftMenu(false)
    showMain(d)
    history.push('/')
  }

  return (
    <div id="mainNavigation" className="mp-bg-light mp-border-secondary">
      <LeftMenu leftMenu={leftMenu} setLeftMenu={setLeftMenu} />
      <div className="flex-wrap nav-menu-back-wrap">
        {app.mapHidden &&
          <div id="backToMain" className="nav-icon" onClick={backToMain} title={TEXT.toMain}>
            <img src="/icons/world2.svg" alt="schematic globe icon" />
          </div>
        }
        <div id="openLeftMenu" className="nav-icon" onClick={showLeftMenu} title={TEXT.menu}>
          <img src="/icons/hamburger.svg" alt="menu icon" />
        </div>
      </div>

      <span>Avatar and lvl</span>
      <span>Mode</span>
      <span>Collapse</span>
    </div>
  )
}
