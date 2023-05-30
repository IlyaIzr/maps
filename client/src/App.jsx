import {
  BrowserRouter as Router,
} from "react-router-dom";
import { Suspense, useEffect } from "react";
import { lazily } from 'react-lazily';

import { useDispatch, useSelector } from "react-redux";
import { setModal } from "./store/app";
import { TEXT } from "./rest/lang";
import { getPreferences, setPreference } from "./store/localstorage";
import { getFriendsInfo } from "./rest/helperFuncs";
import { MainRouteWrap } from "~components/MainRouteWrap/MainRouteWrap"
import { RoutesControl } from "~routes/RoutesControl"
// todo Why do we need them?
import './Map/Map/Maps.css'
import './App.css'

const { NavMain } = lazily(() => import('./navigation/NavMain'));
const { Login } = lazily(() => import('./Auth/Login'));
const { Modal } = lazily(() => import('./rest/Modal'));
const { MapWrap } = lazily(() => import('./Map/MapWrap/MapWrap'));
const { Toast } = lazily(() => import('./components/Toast/Toast'));
const { Banner } = lazily(() => import('~components/Banner/Banner'));

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
        <Banner />


        {/* Extra subpages */}

        <RoutesControl />

        <MainRouteWrap>
          <MapWrap />
        </MainRouteWrap>

        <NavMain />
      </Suspense>
    </Router>
  );
}

export default App;
