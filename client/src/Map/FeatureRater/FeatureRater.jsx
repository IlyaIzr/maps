import { useDispatch, useSelector } from "react-redux"
import { Featurer } from "../Featurer"
import { Rater } from "../Rater"
import { Reviews } from "../Reviews"
import { ReactComponent as CloseIcon } from '~rest/svg/close5.svg';
import { TEXT } from '~rest/lang';
import { setCurrentFeature } from "../../store/map";

export function FeatureRater() {
  const feature = useSelector(state => state.map.currentFeature)
  const dispatch = useDispatch()

  function resetRater() {
    setCurrentFeature(dispatch, null)
  }
  if (!feature) return null;

  return (
    <div className="featureContainer mp-bg-light mp-border-secondary">
      <Featurer />
      <Rater resetRater={resetRater} />
      <Reviews resetRater={resetRater} />
      <div className="closeFeature mp-bg-light mp-dark mp-border-secondary" onClick={resetRater} title={TEXT.close}>
        <CloseIcon fill="var(--dark)" className="close-legend" />
      </div>
    </div>
  )

}