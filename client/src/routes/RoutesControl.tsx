import { Route, Switch, useLocation } from "react-router-dom";
import { appRoutes } from "./appRoutes";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { hideMain, showMain } from "~store/app"

function checkAdditionalRoute(route: string) {
  return Boolean(appRoutes.find(({ id, isNested }) => {
    if (isNested) return route.startsWith(id)
    return route === id
  }))
}
export function RoutesControl() {
  const d = useDispatch()
  const location = useLocation()
  const isAdditionalRoute = checkAdditionalRoute(location.pathname.slice(1))
  console.log('%c⧭ isAdditionalRoute', 'color: #514080', isAdditionalRoute);

  useEffect(() => {
    isAdditionalRoute ? hideMain(d) : showMain(d)
  }, [location])

  return (
    <Switch>
      {appRoutes.map(({ id, component }) => {
        return <Route path={`/${id}`} key={id}>
          <div className="routeWrapper">
            {component}
          </div>
        </Route>
      })}
    </Switch>
  )
}