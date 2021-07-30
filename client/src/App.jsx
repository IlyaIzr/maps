import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link,
  // useLocation
} from "react-router-dom";
// Components
// import { Main } from "./Map/Main";
import { AuthMain } from './Auth/AuthMain'
import { useEffect } from "react";

import './App.css'
import { logIntoApp } from "./store/user";
import { useDispatch } from "react-redux";
import { NavMain } from "./navigation/NavMain";
import { hideMain } from "./store/app";
import { Modal } from "./rest/Modal";
import { EditProfile } from "./Auth/EditProfile";
import { GoogleConfirm } from "./Auth/GoogleConfirm";
import { Toast } from "./rest/Toast";
import { AlphaReg } from "./Auth/AlphaReg";


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
    <Router >
      <Modal />
      <NavMain />
      <Toast />
      {/* <div id="mapplaceholder"></div> */}

      {/* <Main /> */}

      {/* Extra subpages */}

      <Switch>

        <Route path="/auth">
          <div className="routeWrapper">
            <AuthMain />
          </div>
        </Route>
        {/* TODO alpha only */}
        <Route path="/alphaReg">
          <div className="routeWrapper">
            <AlphaReg />
          </div>
        </Route>

        <Route path="/editProfile">
          <div className="routeWrapper">
            <EditProfile />
          </div>
        </Route>
        <Route path="/googleConfirm">
          <div className="routeWrapper">
            <GoogleConfirm />
          </div>
        </Route>
        
      </Switch>
    </Router>
  );
}

export default App;
