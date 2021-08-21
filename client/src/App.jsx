import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
// Components
import { Main } from "./Map/Main";
import './Map/Maps.css'
import { AuthMain } from './Auth/AuthMain'
import { useEffect } from "react";

import './App.css'
import { useDispatch, useSelector } from "react-redux";
import { NavMain } from "./navigation/NavMain";
import { setModal } from "./store/app";
import { Modal } from "./rest/Modal";
import { EditProfile } from "./Auth/EditProfile";
import { GoogleConfirm } from "./Auth/GoogleConfirm";
import { Toast } from "./rest/Toast";
import { AlphaReg } from "./Auth/AlphaReg";
import { TEXT } from "./rest/lang";
import { Login } from "./Auth/Login";
import { getPreferences, setPreference } from "./store/localstorage";
import { FriendsMain } from "./Friends/FriendsMain";


function App() {
  const dispatch = useDispatch()
  const app = useSelector(state => state.app)
  const children =
    <div className="auth-modal-containter mp-border-secondary">
      <Login />
    </div>

  useEffect(() => {
    if (!app.isLogged && !getPreferences().skipLogin) setModal(dispatch, {
      acceptLabel: null,
      cancelLabel: TEXT.skip,
      cancelAction() {
        setPreference('skipLogin', true)
      },
      message: TEXT.wannaAuthorize,
      children,
    })
    /* eslint-disable */
  }, [])
  /* eslint-enable */

  return (
    <Router >
      <Modal />
      <NavMain />
      {app.toast && <Toast key={app.toast?.key} />}

      <Main />

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

        <Route path="/friends">
          <div className="routeWrapper">
            <FriendsMain />
          </div>
        </Route>

      </Switch>
    </Router>
  );
}

export default App;
