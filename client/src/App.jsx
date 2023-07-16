import { BrowserRouter as Router } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { lazily } from "react-lazily";

import { useDispatch, useSelector } from "react-redux";
import { getFriendsInfo } from "./rest/helperFuncs";
import { MainRouteWrap } from "~components/MainRouteWrap/MainRouteWrap";
import { RoutesControl } from "~routes/RoutesControl";
// todo Why do we need them?
import "./Map/Map/Maps.css";
import "./App.css";

const { NavMain } = lazily(() => import("./navigation/NavMain"));
const { Modal } = lazily(() => import("./rest/Modal"));
const { MapRootComponent } = lazily(() => import("./Map"));
const { Toast } = lazily(() => import("./components/Toast/Toast"));
const { Banner } = lazily(() => import("~components/Banner/Banner"));
const { ToastStack } = lazily(() => import("~components/Toast/ToastStack"));

function App() {
  const dispatch = useDispatch();
  const app = useSelector((state) => state.app);

  useEffect(() => {
    (async function () {
      await getFriendsInfo(dispatch);
    })();
  }, [getFriendsInfo]);

  return (
    <Router>
      <Suspense fallback={null}>
        <Modal />
        <ToastStack />
        <Banner />

        {/* Extra subpages */}
        <RoutesControl />

        <MainRouteWrap>
          <MapRootComponent />
        </MainRouteWrap>

        <NavMain />
      </Suspense>
    </Router>
  );
}

export default App;
