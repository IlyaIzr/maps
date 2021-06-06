import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
// Components
import { Main } from "./Map/Main";
import { AuthMain } from './Auth/AuthMain'
import { useEffect, useState } from "react";
import { TEXT } from "./rest/lang";

import './App.css'
import './rest/colors.css'
import { logIntoApp } from "./store/user";
import { useDispatch } from "react-redux";


function App() {
  const [isMain, setIsMain] = useState(true);
  const dispatch = useDispatch()
  
  useEffect(() => {
    const prevUser = window.localStorage.getItem('usernameTemp')
    if (prevUser) {
      logIntoApp(dispatch, prevUser, prevUser, prevUser + '-' + Math.floor(Math.random() * 1000))
    }
  }, [])

  return (
    <Router>

      {/* navigation to be here */}
      <div className="mainNavigation mp-bg-light mp-border-secondary">
        <Link className="mp-border-secondary" to="/" onClick={() => setIsMain(true)}>
          {TEXT.homeLinkBtn}
        </Link>
        <Link className="mp-border-secondary" to="/auth" onClick={() => setIsMain(false)}>
          {TEXT.authLinkBtn}
        </Link>
        <Link className="mp-border-secondary" to="/settings" onClick={() => setIsMain(false)}>
          {TEXT.setsLinkBtn}
        </Link>
      </div>
      {/* navigation to be here */}

      <div className={isMain ? "mainWrapper" : "hidden"}>
        <Main />
      </div>

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
