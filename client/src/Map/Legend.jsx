import React from 'react'
import { gradient } from '../rest/colors'
import { TEXT } from '../rest/lang'

export const Legend = () => {
  return (
    <div className="mapLegend">
      <div className="ratingLegend">
        <div className="ratingDescription">
          <span>{TEXT.worstRating}</span>
          <span></span>
          <span></span>
          <span></span>
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
          <div className="ratingGradient" style={{ background: `linear-gradient(90deg, ${gradient[0]}, ${gradient[5]})` }}></div>
        </div>
      </div>
    </div>
  )
}
