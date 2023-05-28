import { useLocation } from "react-router-dom";
import s from './MainRouteWrap.module.css'
import { appRoutes } from "~rest/appRoutes";
import { useEffect } from "react";
import { useDispatch } from 'react-redux'
import { hideMain, showMain } from "~store/app"

function checkAdditionalRoute(route: string) {
  return Boolean(appRoutes.find(({ id }) => {
    return id === route
  }))
}

export function MainRouteWrap({ children }: React.PropsWithChildren) {
  const d = useDispatch()
  const location = useLocation()
  const isAdditionalRoute = checkAdditionalRoute(location.pathname.slice(1))
  console.log('%c⧭ isAdditionalRoute', 'color: #e57373', isAdditionalRoute);

  useEffect(() => {
    isAdditionalRoute ? hideMain(d) : showMain(d)
  }, [location])


  return (
    <div className={isAdditionalRoute ? s.hidden : s.mainWrapper}>
      {children}
    </div>
  )
}