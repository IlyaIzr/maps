import React, { useEffect } from 'react'
// import { useSelector } from 'react-redux';
// import { gradients } from '../rest/colors';
import { TEXT } from "../rest/lang";

export const Featurer = ({ feature, name, setName }) => {

  // const { theme } = useSelector(s => s.app)

  // function color() {
  //   if (!feature?.properties?.rating) return gradients[theme][0]
  //   for (let i = 0; i < gradients[theme].length; i++) {
  //     if (feature.properties.rating <= i) return gradients[theme][i]
  //   }
  // }

  useEffect(() => {
    if (feature?.name) setName(feature.properties.name)

    console.log('%c⧭', 'color: #d0bfff', feature);
  }, [feature, setName])

  if (!feature?.source) {
    console.log('wtf feature', feature);
    return null
  }
  // Case rated before
  if (feature.source === 'ratedFeaturesSource') return (
    <div className="featurer">
      {feature.properties.name ?
        <div className="featureNameWrap">
          <p className="featureName mp-bg-light mp-border-primary mp-dark">{feature.properties.name}</p>
        </div>
        : <></>}
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


      {feature.properties.name ?
        <div className="featureNameWrap">
          <p className="featureName mp-bg-light mp-border-primary mp-dark">{feature.properties.name}</p>
        </div>
        : <div className="featureNameWrap">
          <input
            type="text" value={name} onInput={onInput}
            placeholder={TEXT.newFeaturePHolder} title={TEXT.newFeaturePHolder}
            className="featureName mp-bg-light mp-border-primary mp-dark"
          />
        </div>}
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
          <p className="featureName mp-bg-light mp-border-primary mp-dark">{feature.properties.name}</p>
        </div>
        : <></>}
    </div>
  )
}
