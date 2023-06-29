import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setColors } from '../../rest/colors';
import { appThemes } from '../../rest/config';
import { TEXT } from '../../rest/lang';
import { switchTheme } from '../../store/app';
import { setPreference } from '../../store/localstorage';
import { navStates } from '../LeftMenu';
import { ReactComponent as BackIcon } from '../../rest/svg/back2.svg';
import { useHistory } from 'react-router-dom'
import { withUrlSearch } from "~store/url";

export const ThemeNav = ({ setNavState, hideSelf }) => {
  const app = useSelector(state => state.app)
  const dispatch = useDispatch()
  const history = useHistory()

  const [themeN, setThemeN] = useState(appThemes.indexOf(app.theme));

  function onClick(e) {
    const themeNumber = e.target.attributes.name.value
    setThemeN(themeNumber)
    switchTheme(dispatch, appThemes[themeNumber])
    setColors(appThemes[themeNumber])
    setPreference('theme', appThemes[themeNumber])
    hideSelf()
    history.push(withUrlSearch('/'))
  }
  function onBack() {
    setNavState(navStates.default)
  }

  return (
    <div className="left-menu-container">

      {/* Avatar area */}
      <div className="menu-user theme-menu">
        <div onClick={onBack} className="
          back-icon-container cursor-pointer 
          transition"
        >
          <BackIcon fill="var(--accent)" className="nav-icon" />
        </div>
        <div className="menu-user-subcontainer">
          <div className="menu-username">{TEXT.pickTheme}</div>
          <div className="menu-userlevel">{TEXT.theme}: <span className="mp-accent">{TEXT[appThemes[themeN]]}</span>
          </div>
        </div>
      </div>

      <div className="pickTheme-container">
        {appThemes.map((theme, i) => {
          return (
            <div
              className={`
              pickTheme-item ${theme}-theme mp-border-secondary mp-counter-hover transition-small
              ${+i === +themeN ? ' current-theme mp-accent mp-border-accent events-none' : ''}
              `}
              name={i}
              onClick={onClick}
              key={theme + String(themeN)}
            >
              {TEXT[theme]}
            </div>
          )
        })}
      </div>

    </div>
  )
}
