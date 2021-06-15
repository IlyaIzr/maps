import React, { useEffect } from 'react'
import { TEXT } from "../rest/lang";

export const Featurer = ({ feature, name, setName }) => {

  useEffect(() => {
    if (feature?.adress) setName(feature.adress)
  }, [feature, setName])

  if (!feature?.source) {
    console.log('wtf feature', feature);
    return null
  }
  // Case rated before
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
  // Case created  
  function onInput(e) {
    setName(e.target.value)
  }
  if (feature.source === 'createdPoly') return (
    <div className="featurer">
      <p className="featurerGreetings">
        You created a feature
      </p>

      <div className="featureNameWrap">
        <input
          type="text" value={name} onInput={onInput} placeholder={'enter name or adress'}
          className="featureName mp-bg-counter mp-border-counter  mp-primary"
        />
      </div>
      {/* {feature.adress ?
        <div className="featureNameWrap">
          <p className="featureName mp-bg-counter mp-border-counter  mp-primary">{feature.adress}</p>
        </div>
        : <div>
          <input type="text" value={name} onInput={onInput} placeholder={'enter name or adress'}/>
        </div>} */}
    </div>
  )
  // Case new feature
  return (
    <div className="featurer">
      <p className="featurerGreetings">
        {TEXT.firstTimeRate}
      </p>
      {feature.adress ?
        <div className="featureNameWrap">
          <p className="featureName mp-bg-counter mp-border-counter  mp-primary">{feature.adress}</p>
        </div>
        : <></>}
    </div>
  )
}
