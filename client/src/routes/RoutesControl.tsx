import { Route, Switch, useLocation } from "react-router-dom";
import { appRoutes } from "./appRoutes";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { hideMain, showMain } from "~store/app"

function checkAdditionalRoute(route: string) {
  if (appRoutes[route]) return true
  return Object.values(appRoutes).find(({ path, isNested }) => {
    if (isNested) return route.startsWith(path)
  })
}
export function RoutesControl() {
  const d = useDispatch()
  const location = useLocation()
  const isAdditionalRoute = checkAdditionalRoute(location.pathname.slice(1))

  useEffect(() => {
    isAdditionalRoute ? hideMain(d) : showMain(d)
    // preserve coords in the url search because their limited anyway
    // console.log('%c⧭ location', 'color: #00a3cc', location);
    return () => {

      // console.log('%c⧭  prev location', 'color: #e50000', window.location.search);
      // console.log('%c⧭ prev location', 'color: #00cc3a', location);
    }
  }, [location])

  return (
    <Switch>
      {Object.entries(appRoutes).map(([id, { component, path }]) => {
        return <Route path={`/${path}`} key={id}>
          <div className="routeWrapper">
            {component}
          </div>
        </Route>
      })}
    </Switch>
  )
}