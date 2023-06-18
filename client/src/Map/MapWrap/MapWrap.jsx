import { useDispatch, useSelector } from 'react-redux'
import { MapArea } from '../Map/Map'
import { Rater } from '../Rater'
import { Featurer } from '../Featurer';
// TODO make separate styles
import '../Map/Maps.css'
import { Legend } from '../Legend';
import { Reviews } from '../Reviews';
import { TEXT } from '~rest/lang';
import { ReactComponent as CloseIcon } from '~rest/svg/close5.svg';
import s from './MapWrap.module.css'
import { setCurrentFeature } from '~store/map';

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
      {
        app.legendShown && <Legend />
      }
      {feature &&
        <div className="featureContainer mp-bg-light mp-border-secondary">
          <Featurer />
          <Rater resetRater={resetRater}/>
          <Reviews resetRater={resetRater} />
          <div className="closeFeature mp-bg-light mp-dark mp-border-secondary" onClick={resetRater} title={TEXT.close}>
            <CloseIcon fill="var(--dark)" className="close-legend" />
          </div>
        </div>
      }
    </div>
  )
}
