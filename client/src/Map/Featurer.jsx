import { useEffect } from 'react'
import { TEXT } from "../rest/lang";
import { RATED_LAYER_SRC } from './const';
import { useSelector } from 'react-redux';

export const Featurer = () => {
  const { currentFeature: feature } = useSelector(state => state.map)
  const name = feature.properties.name


  if (!feature?.source) {
    console.log('wtf feature', feature);
    return null
  }
  // Case rated before
  if (feature.source === RATED_LAYER_SRC) return (
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
    // I think mutating is okay... Let's check this with Todo
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
