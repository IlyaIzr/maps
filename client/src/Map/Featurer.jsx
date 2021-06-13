import React from 'react'
import { TEXT } from "../rest/lang";

export const Featurer = ({ feature }) => {
  if (!feature?.source) {
    console.log('wtf feature', feature);
    return null
  }
  if (feature.source === 'ratedFeaturesSource') return (
    <div className="featurer">
      <p className="rateAmount">
        {TEXT.placeAmountPrefix + ' ' + feature.properties.amount + ' '}
        {String(feature.properties.amount).endsWith('1') ? TEXT.placeAmountNumberEnds1 : TEXT.placeAmountEndsMultiple}
      </p>
      <h5 className="rateValue">
        {TEXT.placeRatingPrefix}:
        <span className="rateNumber"> {feature.properties.rating}</span>
      </h5>
    </div>
  )
  return (
    <div className="featurer">
      <p className="adress">{feature.adress}</p>
      <br />
      {TEXT.firstTimeRate}
    </div>
  )
}
