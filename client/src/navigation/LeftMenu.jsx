import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { TEXT } from '../rest/lang'
import { appThemes, hideMain, setModal, switchTheme } from '../store/app'
import { PickTheme } from './PickTheme'

export const LeftMenu = ({ leftMenu, setLeftMenu }) => {
  const app = useSelector(state => state.app)
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  function hideSelf() {
    setLeftMenu(false)
  }
  function hideMainMenu() {
    hideMain(dispatch)
    hideSelf()
  }
  const [themeN, setThemeN] = useState(appThemes.indexOf(app.theme));
  function pickTheme() {
    function tryTheme(themeN = 0) {
      switchTheme(dispatch, appThemes[themeN])
    }
    setModal(dispatch, {
      message: TEXT.pickTheme,
      acceptLabel: TEXT.apply,
      // acceptAction() {
      //   switchTheme(dispatch, themeN)
      // },
      cancelAction() {
        switchTheme(dispatch, themeN)
      },
      childComponent: PickTheme({ themeN, setThemeN, tryTheme })
    })
  }

  const cn = "mp-bg-light mp-border-secondary"

  return (
    <div id="left-menu" className={leftMenu ? "active " + cn : cn}>
      <div className="left-menu-container">
        <div className="menu-user">
          <div className="menu-avatar mp-bg-dark">
            <div className="letter mp-primary">{user.name?.[0] || "?"}</div>
          </div>
          <div className="menu-user-subcontainer">
            <div className="menu-username">{user.name || 'no name'}</div>
            <div className="menu-userlevel">{TEXT.level}: <span className="mp-counter">{user.level}</span>
            </div>
          </div>
        </div>
        <div>
          <Link to="/auth" onClick={hideMainMenu} className="left-menu-item"> {app.isLogged ? TEXT.profile : TEXT.login}</Link>
        </div>
        <div onClick={pickTheme} className="left-menu-item mp-counter-hover pick-theme-item">{TEXT.theme}
          <label className="little-hint">({TEXT[app.theme]})</label>
        </div>
        <div className="readonly">{TEXT.friends}</div>
        <div className="readonly">{TEXT.routes}</div>
        <div className="readonly">{TEXT.language}</div>
        <div className="readonly">{TEXT.aboutUs}</div>
      </div>
      <div id="closeLeftAtBottom">
        <button onClick={hideSelf}>x</button>
      </div>
    </div>
  )
}
