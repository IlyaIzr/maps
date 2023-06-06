import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { setLanguage } from '../../requests/users';
import { appLanguages } from '../../rest/config';
import { DOCUMENT_LANG, TEXT } from '../../rest/lang';
import { setToast } from '../../store/app';
import { navStates } from '../LeftMenu';
import { ReactComponent as BackIcon } from '../../rest/svg/back2.svg';

export const LangNav = ({ setNavState }) => {
  const d = useDispatch()

  const [lang, setLang] = useState();

  async function onClick(e) {
    const lang = e.target.attributes.name.value
    const res = await setLanguage(lang)
    if (res.status === 'OK') return window.location.reload();
    else setToast(d, {
      message: JSON.stringify(res),
      title: TEXT.error,
      status: 'error',
    })
  }

  useEffect(() => {
    // this is server side logic that works for completed build only
    // if you need to test app with different lang - change the variable - DOCUMENT_LANG
    setLang(DOCUMENT_LANG)
  }, [])

  function onBack() {
    setNavState(navStates.default)
  }

  return (
    <div className="left-menu-container lang-nav">

      {/* Avatar area */}
      <div className="menu-user theme-menu">
        <div onClick={onBack} className="
          back-icon-container cursor-pointer 
          transition"
        >
          <BackIcon fill="var(--accent)" className="nav-icon"/>
        </div>
        <div className="menu-user-subcontainer">
          <div className="menu-username">{TEXT.pickLanguage}</div>
          <div className="menu-userlevel">{TEXT.language}: <span className="mp-accent">{TEXT[lang]}</span>
          </div>
        </div>
      </div>

      <div className="pickTheme-container">
        {Object.keys(appLanguages).map((lng, i) => {
          return (
            <div
              className={`
              pickTheme-item mp-border-secondary mp-counter-hover transition-small
              ${lng === lang ? ' current-theme mp-accent mp-border-accent events-none' : ''}
              `}
              name={lng}
              onClick={onClick}
              key={lng + i}
            >
              {TEXT[lng]}
            </div>
          )
        })}
      </div>

    </div>
  )
}
