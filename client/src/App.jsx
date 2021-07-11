import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation
} from "react-router-dom";
// Components
import { Main } from "./Map/Main";
import { AuthMain } from './Auth/AuthMain'
import { useEffect } from "react";

import './App.css'
import './rest/colors.css'
import { logIntoApp } from "./store/user";
import { useDispatch } from "react-redux";
import { NavMain } from "./navigation/NavMain";
import { hideMain } from "./store/app";


function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    if (window.location.pathname !== '/') hideMain(dispatch) 
    const prevUser = window.localStorage.getItem('usernameTemp')
    if (prevUser) {
      logIntoApp(dispatch, prevUser, prevUser, prevUser + '-' + Math.floor(Math.random() * 1000))
    }
    /* eslint-disable */
  }, [])
  /* eslint-enable */

  return (
    <Router>

      <NavMain />

      <Main />

      {/* Extra subpages */}

      <Switch>

        <Route path="/settings">
          <div className="routeWrapper">
            Settings component will be released soon
          </div>
        </Route>

        <Route path="/auth">
          <div className="routeWrapper">
            <AuthMain />
          </div>
        </Route>

      </Switch>
    </Router>
  );
}

export default App;
