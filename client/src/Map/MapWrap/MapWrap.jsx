import { useDispatch, useSelector } from 'react-redux'
import { MapArea } from '../Map/Map'
// TODO make separate styles
import '../Map/Maps.css'
import { Legend } from '../Legend';
import s from './MapWrap.module.css'
import { setCurrentFeature } from '~store/map';
import { FeatureRater } from '../FeatureRater/FeatureRater';

export const MapWrap = () => {
  // Store
  const app = useSelector(state => state.app)
  // Todo remove it?
  const feature = useSelector(state => state.map.currentFeature)
  const dispatch = useDispatch()

  function resetRater() {
    setCurrentFeature(dispatch, null)
  }

  return (
    <div className={s.mainWrapper}>
      <MapArea
        resetRater={resetRater}
      />
      {app.legendShown && <Legend />}
      <FeatureRater />
    </div>
  )
}
