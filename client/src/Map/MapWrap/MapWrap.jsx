import { useSelector } from 'react-redux'
import { MapArea } from '../Map/Map'
import { Legend } from '../Legend';
import s from './MapWrap.module.css'
import { FeatureRater } from '../FeatureRater/FeatureRater';

// TODO make separate styles
import '../Map/Maps.css'

export const MapWrap = () => {
  // Store
  const app = useSelector(state => state.app)

  return (
    <div className={s.mainWrapper}>
      <MapArea />
      {app.legendShown && <Legend />}
      <FeatureRater />
    </div>
  )
}
