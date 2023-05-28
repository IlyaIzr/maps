import { Route, Switch, useLocation } from "react-router-dom";
import { appRoutes } from "./appRoutes";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { hideMain, showMain } from "~store/app"

function checkAdditionalRoute(route: string) {
  return Boolean(appRoutes.find(({ id }) => {
    return id === route
  }))
}
export function RoutesControl() {
  const d = useDispatch()
  const location = useLocation()
  const isAdditionalRoute = checkAdditionalRoute(location.pathname.slice(1))

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