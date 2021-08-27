import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { TEXT } from '../../rest/lang'
import { friendModeId, setMapMode } from '../../store/app'
import { navStates } from '../LeftMenu'

export const DefNav = ({ setNavState, hideSelf }) => {

  const user = useSelector(state => state.user)
  const app = useSelector(state => state.app)
  const dispatch = useDispatch()

  function hideMainMenu() {
    hideSelf()
  }
  function pickTheme() {
    setNavState(navStates.theme)
  }
  function pickLang() {
    setNavState(navStates.language)
  }

  function drawMode() {
    hideSelf()
    friendModeId(dispatch, null)
    setMapMode(dispatch, 'draw')
  }


  return (
    <div className="left-menu-container">

      <div className="menu-user">
        <div className="menu-avatar mp-bg-counter">
          <div className="letter mp-light">{user.name?.[0] || "?"}</div>
        </div>
        <div className="menu-user-subcontainer">
          <div className="menu-username">{user.name || 'no name'}</div>
          <div className="menu-userlevel">{TEXT.level}: <span className="mp-accent">{user.level}</span>
          </div>
        </div>
      </div>

      <div>
        {app.isLogged ?
          <Link to="/editProfile" onClick={hideMainMenu} className="left-menu-item mp-dark"> {TEXT.profile}</Link> :
          <Link to="/auth" onClick={hideMainMenu} className="left-menu-item mp-dark"> {TEXT.login}</Link>
        }
      </div>

      <div onClick={pickTheme} className="left-menu-item mp-accent-hover pick-theme-item">{TEXT.theme}
        <label className="little-hint">({TEXT[app.theme]})</label>
      </div>

      <div onClick={pickLang} className="left-menu-item mp-accent-hover pick-theme-item">{TEXT.language}</div>

      <div className="left-menu-item mp-dark">
        <Link to="/friends" onClick={hideMainMenu} className="transition">{TEXT.friends}
          {Boolean(user.requests.length) &&
            <span className="mp-accent">{' (' + user.requests.length + ')'}</span>
          }
        </Link>
      </div>

      <div className="left-menu-item mp-dark">
        <Link to="/" className="transition" onClick={drawMode} >{TEXT.drawMode}</Link>
      </div>

      <div className="readonly">{TEXT.routes}</div>
      <div className="readonly">{TEXT.aboutUs}</div>
    </div>
  )
}
