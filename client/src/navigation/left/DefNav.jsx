import { useSelector } from 'react-redux'
import { TEXT } from '../../rest/lang'
import { navStates } from '../LeftMenu'
import { AppLink } from '~components/Link/AppLink'
// icons
import { ReactComponent as ProfileIcon } from '../../rest/svg/profile.svg'
import { ReactComponent as LoginIcon } from '../../rest/svg/login.svg'
import { ReactComponent as ThemeIcon } from '../../rest/svg/theme.svg'
import { ReactComponent as LangIcon } from '../../rest/svg/language.svg'
import { ReactComponent as FriendsIcon } from '../../rest/svg/friends.svg'
import { ReactComponent as TagIcon } from '../../rest/svg/tag.svg'
import { ReactComponent as RouteIcon } from '../../rest/svg/route.svg'
import { ReactComponent as AboutIcon } from '../../rest/svg/about.svg'

export const DefNav = ({ setNavState, hideSelf }) => {

  const user = useSelector(state => state.user)
  const app = useSelector(state => state.app)

  function hideMainMenu() {
    hideSelf()
  }
  function pickTheme() {
    setNavState(navStates.theme)
  }
  function pickLang() {
    setNavState(navStates.language)
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

      <div className="menu-items-container">
        <div>
          {app.isLogged ?
            <AppLink to="/editProfile" onClick={hideMainMenu} className="left-menu-item mp-accent-hover pick-theme-item">
              <ProfileIcon fill="var(--dark)" className="navIcon" />
              <span className="menu-text">{TEXT.profile}</span>
            </AppLink> :
            <AppLink to="/auth" onClick={hideMainMenu} className="left-menu-item mp-accent-hover pick-theme-item">
              <LoginIcon fill="var(--dark)" className="navIcon" />
              <span className="menu-text">{TEXT.login}</span>
            </AppLink>
          }
        </div>

        <div onClick={pickTheme} className="left-menu-item mp-accent-hover pick-theme-item">
          <ThemeIcon fill="var(--dark)" className="navIcon" />
          <span className="menu-text">{TEXT.theme}</span>
          <label className="little-hint">({TEXT[app.theme]})</label>
        </div>

        <div onClick={pickLang} className="left-menu-item mp-accent-hover pick-theme-item">
          <LangIcon fill="var(--dark)" className="navIcon" />
          <span className="menu-text">{TEXT.language}</span>
        </div>

        <AppLink to="/friends" onClick={hideMainMenu} className="left-menu-item mp-accent-hover pick-theme-item">
          <FriendsIcon fill="var(--dark)" className="navIcon" />
          <span className="menu-text">{TEXT.friends}</span>
          {Boolean(user.requests.length) &&
            <span className="mp-accent">{' (' + user.requests.length + ')'}</span>
          }
        </AppLink>

        <AppLink to="/tags" className="left-menu-item mp-accent-hover pick-theme-item" onClick={hideMainMenu}>
          <TagIcon fill="var(--dark)" className="navIcon" />
          <span className="menu-text">{TEXT.tags}</span>
        </AppLink>

        <div className="readonly">
          <RouteIcon fill="var(--dark)" className="navIcon" />
          <span className="menu-text">{TEXT.routes}</span>
        </div>

        <AppLink to="/about" className="left-menu-item mp-accent-hover pick-theme-item" onClick={hideMainMenu}>
          <AboutIcon fill="var(--dark)" className="navIcon" />
          <span className="menu-text">{TEXT.aboutUs}</span>
        </AppLink>
      </div>
    </div>
  )
}
