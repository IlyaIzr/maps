import React, { useEffect } from 'react'
import { getAdress, postPlaceName } from '../requests/map';
import { TEXT } from "../rest/lang";

export const Featurer = ({ feature, name, setName }) => {

  useEffect(() => {
    if (feature?.name) setName(feature.properties.name)

    console.log('%c⧭', 'color: #d0bfff', feature);
  }, [feature, setName])

  // Temp - add adresses functionality
  async function onClick() {
    const { lat, lng } = feature.properties
    const name = await getAdress(lat, lng)
    console.log('%c⧭', 'color: #ff6600', name);

    const res = await postPlaceName(name, feature.id)
    console.log('%c⧭', 'color: #40fff2', res);
  }

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
      {feature.properties.name ?
        <div className="featureNameWrap">
          <p className="featureName mp-bg-counter mp-border-primary mp-primary">{feature.properties.name}</p>
        </div>
        : <></>}
      <button onClick={onClick}>add name</button>
    </div>
  )
  // Case created  
  function onInput(e) {
    setName(e.target.value)
    feature.properties.name = e.target.value
  }
  if (feature.source === 'createdPoly') return (
    <div className="featurer">
      <p className="featurerGreetings">
        {TEXT.newFeature}
      </p>

      <div className="featureNameWrap">
        <input
          type="text" value={name} onInput={onInput}
          placeholder={TEXT.newFeaturePHolder} title={TEXT.newFeaturePHolder}
          className="featureName mp-bg-counter mp-border-counter  mp-primary"
        />
      </div>
      {/* {feature.properties.name ?
        <div className="featureNameWrap">
          <p className="featureName mp-bg-counter mp-border-counter  mp-primary">{feature.properties.name}</p>
        </div>
        : <div>
          <input type="text" value={name} onInput={onInput} placeholder={'enter name or name'}/>
        </div>} */}
    </div>
  )
  // Case new feature
  return (
    <div className="featurer">
      <p className="featurerGreetings">
        {TEXT.firstTimeRate}
      </p>
      {feature.properties.name ?
        <div className="featureNameWrap">
          <p className="featureName mp-bg-counter mp-border-primary  mp-primary">{feature.properties.name}</p>
        </div>
        : <></>}
    </div>
  )
}
