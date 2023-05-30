import s from './Banner.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { closeBanner } from '~store/app';
import { uuidv4 } from '~rest/helperFuncs'

export type BannerData = {
  content: JSX.Element,
  bottomControls?: {
    element: JSX.Element,
    onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, closeCb: () => void) => null
  }[],
  // onOuterClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
  onCrossClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, closeCb: () => void) => void
}

export const Banner = () => {
  const data: BannerData = useSelector(state => state.app.banner)
  const dispatch = useDispatch()

  const handleDismiss = () => {
    closeBanner(dispatch)
  };

  function crossClickHandler(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    data.onCrossClick ? data.onCrossClick(e, handleDismiss) : handleDismiss()
  }


  return (
    <div className={`${s.banner} ${data.content ? s.show : ''}`}>
      <span onClick={crossClickHandler} className={s.closeCross}>&#10006;</span>
      <div className={s.bannerContent}>
        {data.content || null}
      </div>

      <div className={s.bannerControls}>
        {data.bottomControls?.length && data.bottomControls.map(({ element, onClick }) => {
          return (<div key={uuidv4()} onClick={e => onClick(e, handleDismiss)} className={s.bannerControl}>
            {element}
          </div>)
        })}
      </div>
    </div>
  );
};

export default Banner;