import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { TEXT } from '../rest/lang'
import { hideMain } from '../store/app'

export const LeftMenu = ({ leftMenu, setLeftMenu }) => {
  const app = useSelector(state => state.app)
  const dispatch = useDispatch()

  function hideSelf() {
    setLeftMenu(false)
  }
  function hideMainMenu() {
    hideMain(dispatch)
    hideSelf()
  }
  const cn = "mp-bg-light mp-border-secondary"
  return (
    <div id="left-menu" className={leftMenu ? "active " + cn : cn}>
      <div className="left-menu-container">
        <div>
          <Link to="/auth" onClick={hideMainMenu}> {app.isLogged ? TEXT.profile : TEXT.login}</Link>
        </div>
        <div>{TEXT.theme}</div>
        <div>{TEXT.friends}</div>
        <div>{TEXT.routes}</div>
        <div>{TEXT.language}</div>
        <div>{TEXT.aboutUs}</div>
      </div>
      <div id="closeLeftAtBottom">
        <button onClick={hideSelf}>x</button>
      </div>
    </div>
  )
}
