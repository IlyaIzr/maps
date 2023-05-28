import s from './MainRouteWrap.module.css'
import { useSelector } from 'react-redux'

export function MainRouteWrap({ children }: React.PropsWithChildren) {
  const app = useSelector(state => state.app)

  return (
    <div className={app.mapHidden ? s.hidden : s.mainWrapper}>
      {children}
    </div>
  )
}