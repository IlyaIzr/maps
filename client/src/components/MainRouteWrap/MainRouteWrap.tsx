import s from './MainRouteWrap.module.css'
import { useSelector } from 'react-redux'

export function MainRouteWrap({ children }: React.PropsWithChildren) {
  const mapHidden = useSelector(state => state.app.mapHidden)

  return (
    <div className={mapHidden ? s.hidden : s.mainWrapper}>
      {children}
    </div>
  )
}