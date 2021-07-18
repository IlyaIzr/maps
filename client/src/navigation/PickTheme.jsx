import { TEXT } from "../rest/lang"
import { appThemes } from "../store/app"


export const PickTheme = ({ themeN, setThemeN, tryTheme }) => {
  function onClick(e) {
    setThemeN(e.target.attributes.name.value)
    tryTheme(e.target.attributes.name.value)
  }
  return (
    <div className="pickTheme-container">
      {appThemes.map((theme, i) => {
        return (
          <div
            className={"pickTheme-item " + theme + "-theme" + (i === themeN ? ' events-none?' : '')}
            className={`pickTheme-item ${theme}-theme ${i === themeN ? ' events-none' : ''}
            mp-border-secondary mp-border-secondary mp-counter-hover`}
            name={i}
            onClick={onClick}
            key={theme + String(themeN)}
          >
            {TEXT[theme]}
          </div>
        )
      })}
    </div>
  )
}
