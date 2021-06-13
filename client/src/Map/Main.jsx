import React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { Map } from './Map'
import { Rater } from './Rater'
import { Featurer } from './Featurer';
import { formatGeodata } from './formatGeodata'
import { postInitReview, postNextReview } from '../requests/map';
import './Maps.css'
import { Legend } from './Legend';
import { Reviews } from './Reviews';


export const Main = () => {
  // Store
  const user = useSelector(state => state.user)
  // Rater
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('')
  const [feature, setFeature] = useState(null);
  // Map
  const [geoData, setGeoData] = useState(null)
  const [featureTrigger, setFeatureTrigger] = useState(0);
  function updateLayers() {
    setFeatureTrigger(featureTrigger + 1)
  }

  function resetRater() {
    setRating(0)
    setComment('')
    setFeature(null)
  }

  async function onSubmit() {
    // Calculations
    const [northEastest, southWestest, polyString] = formatGeodata(feature.geometry)
    const tempBox = new mapboxgl.LngLatBounds(northEastest, southWestest)
    const { lng, lat } = tempBox.getCenter()

    // Data to store
    const review = {
      comment,
      grade: rating,
      targetId: feature.id,
    }
    const place = {
      lng, lat,
      x: feature._vectorTileFeature._x,
      y: feature._vectorTileFeature._y,
      id: feature.id,
      name: feature.name,
      polyString
    }
    // Case next review
    if (feature.source === 'ratedFeaturesSource') {
      const res = await postNextReview({ user: user.login, review, place: { ...feature.properties, id: feature.id } })
      if (res.status !== 'OK') return console.log('%c⧭', 'color: #bf1d00', res);
      // Mutate geoData
      for (let i = 0; i < geoData.length; i++) {
        if (geoData[i].id === feature.id) {
          const { amount, rating } = feature.properties
          geoData[i].properties = {
            rating: +((amount * rating + review.grade) / (amount + 1)).toFixed(5),  //toFixed - 5 numbers after point
            amount: amount + 1
          }
          break;
        }
      } setGeoData(geoData)
      updateLayers()
      return resetRater()
    }


    // Case first time review
    // console.log(user.login, review, place);
    setGeoData([...geoData, {
      type: 'Feature',
      properties: { rating, amount: 1 },
      id: feature.id,
      // geometry: {...feature.geometry}
      geometry: feature.geometry
    }])
    updateLayers()
    const res = await postInitReview({ user: user.login, review, place })
    if (res.status !== 'OK') return console.log('%c⧭', 'color: #bf1d00', res);

    // Restore init features
    resetRater()
  }

  return (
    <div>
      <Map
        feature={feature} setFeature={setFeature}
        resetRater={resetRater}
        geoData={geoData} setGeoData={setGeoData}
        featureTrigger={featureTrigger}
      />
      <Legend />
      {feature &&
        <div className="featureContainer mp-bg-light mp-border-secondary">
          <Featurer feature={feature} />
          <Rater
            rating={rating} setRating={setRating}
            comment={comment} setComment={setComment}
            onSubmit={onSubmit}
          />
          <Reviews feature={feature} />
          <div className="closeFeature" onClick={resetRater}>&#10005;</div>
        </div>
      }
    </div>
  )
}
