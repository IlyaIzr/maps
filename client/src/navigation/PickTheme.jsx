// import { TEXT } from "../rest/lang"
// import { appThemes } from "../store/app"


export const PickTheme = (props) => {
  console.log('%c%s', 'color: #807160', props, typeof props);
  console.dir(props);
  // function onClick(e) {
  //   setThemeN(e.target.attributes.name.value)
  //   tryTheme(e.target.attributes.name.value)
  // }
  return (
    <div className="pickTheme-container pps">
    1j2jsnafs
      {/* {appThemes.map((theme, i) => {
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
      })} */}
    </div>
  )
}
