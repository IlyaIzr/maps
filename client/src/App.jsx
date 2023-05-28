import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Suspense, useEffect } from "react";
import { lazily } from 'react-lazily';

import { useDispatch, useSelector } from "react-redux";
import { setModal } from "./store/app";
import { TEXT } from "./rest/lang";
import { getPreferences, setPreference } from "./store/localstorage";
import { getFriendsInfo } from "./rest/helperFuncs";
import { MainRouteWrap } from "~components/MainRouteWrap/MainRouteWrap"
import './Map/Maps.css'
import './App.css'

const { NavMain } = lazily(() => import('./navigation/NavMain'));
const { Login } = lazily(() => import('./Auth/Login'));
const { Modal } = lazily(() => import('./rest/Modal'));
const { About } = lazily(() => import('./navigation/About'));
const { Main } = lazily(() => import('./Map/Main/Main'));
const { AuthMain } = lazily(() => import('./Auth/AuthMain'));
const { EditProfile } = lazily(() => import('./Auth/EditProfile'));
const { GoogleConfirm } = lazily(() => import('./Auth/GoogleConfirm'));
const { FriendsMain } = lazily(() => import('./Friends/FriendsMain'));
const { MapMode } = lazily(() => import('./navigation/MapMode'));
const { Toast } = lazily(() => import('./rest/Toast'));
const { AlphaReg } = lazily(() => import('./Auth/AlphaReg'));
const { TagsMain } = lazily(() => import('./Tags/TagsMain'));

function App() {
  const dispatch = useDispatch()
  const app = useSelector(state => state.app)
  const children =
    <div className="auth-modal-containter mp-border-secondary">
      <Login />
    </div>

  useEffect(() => {
    if (!app.isLogged && !getPreferences().skipLogin) {
      setModal(dispatch, {
        acceptLabel: null,
        cancelLabel: TEXT.skip,
        cancelAction() {
          setPreference('skipLogin', true)
        },
        message: TEXT.wannaAuthorize,
        children,
      })
    }
    (async function () {
      await getFriendsInfo(dispatch)
    })()
    /* eslint-disable */
  }, [])
  /* eslint-enable */

  return (
    <Router >
      <Suspense fallback={null}>
        <Modal />
        {app.toast && <Toast key={app.toast?.key} />}


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

          <Route path="/mapMode">
            <div className="routeWrapper">
              <MapMode />
            </div>
          </Route>

          <Route path="/tags">
            <div className="routeWrapper">
              <TagsMain />
            </div>
          </Route>

          <Route path="/about">
            <div className="routeWrapper">
              <About />
            </div>
          </Route>

        </Switch>
        <MainRouteWrap isHidden={app.mapHidden}>
          <Main />
        </MainRouteWrap>


        <NavMain />
      </Suspense>
    </Router>
  );
}

export default App;
