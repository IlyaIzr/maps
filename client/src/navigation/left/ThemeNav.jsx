import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { appThemes } from '../../rest/config';
import { TEXT } from '../../rest/lang';
import { switchTheme } from '../../store/app';
import { navStates } from '../LeftMenu';

export const ThemeNav = ({ setNavState }) => {
  const app = useSelector(state => state.app)
  const dispatch = useDispatch()

  const [themeN, setThemeN] = useState(appThemes.indexOf(app.theme));

  function onClick(e) {
    const themeNumber = e.target.attributes.name.value
    setThemeN(themeNumber)
    switchTheme(dispatch, appThemes[themeNumber])
    document.querySelector(":root").style.setProperty('--accent', '#33ff00');
  }
  function onBack() {
    setNavState(navStates.default)
  }

  return (
    <div className="left-menu-container">

      {/* Avatar area */}
      <div className="menu-user theme-menu">
        <div className="
        menu-avatar cursor-pointer 
        mp-bg-accent  mp-bg-dark-hover  mp-counter mp-accent-hover
        transition">
          <div className="letter" onClick={onBack}>{"<"}</div>
        </div>
        <div className="menu-user-subcontainer">
          <div className="menu-username">{TEXT.pickTheme}</div>
          <div className="menu-userlevel">{TEXT.theme}: <span className="mp-counter">{TEXT[appThemes[themeN]]}</span>
          </div>
        </div>
      </div>

      <div className="pickTheme-container">
        {appThemes.map((theme, i) => {
          return (
            <div
              className={`
              pickTheme-item ${theme}-theme mp-border-secondary mp-counter-hover transition-small
              ${+i === +themeN ? ' current-theme mp-bg-dark mp-primary events-none' : ''}
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
