import { useDispatch, useSelector } from 'react-redux'
import { gradients } from '../rest/colors'
import { TEXT } from '../rest/lang'
import { ReactComponent as CloseIcon } from '../rest/svg/close5.svg';
import { closeMapLegend } from '../store/app';

export const Legend = () => {
  const theme = useSelector(s => s.app.theme)
  const gradient = gradients[theme]
  const dispatch = useDispatch()

  function closeLegend() {
    closeMapLegend(dispatch)
  }

  return (
    <div className="mapLegend mp-bg-light mp-border-secondary mp-shadow-light">
      <div className="ratingLegend">
        <div className="ratingDescription">
          <span>{TEXT.worstRating}</span>
          <span>{TEXT.bestRating}</span>
        </div>
        <div className="ratingUnitsWrap">
          {gradient.map((color, i) => {
            return (
              <div className="ratingUnit" key={color + i}>
                <span className="ratingColor" style={{ backgroundColor: color }}></span>
              </div>
            )
          })}
        </div>
        <div className="ratingGradientWrap">
          <div className="ratingGradient" style={{ background: `linear-gradient(90deg, ${gradient[0]}, ${gradient[3]}, ${gradient[5]})` }}></div>
        </div>
      </div>
      <div className="close-legend-wrap mp-border-secondary mp-bg-light" onClick={closeLegend}>
        <CloseIcon fill="var(--dark)" className="close-legend" />
      </div>
    </div>
  )
}
