import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { TEXT } from '../../rest/lang'
import { hideMain } from '../../store/app'

export const DefNav = ({ setNavState, hideSelf }) => {

  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const app = useSelector(state => state.app)

  function hideMainMenu() {
    hideMain(dispatch)
    hideSelf()
  }
  function pickTheme() {
    setNavState('theme')
  }


  return (
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
  )
}
