import { BrowserRouter as Router } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { lazily } from "react-lazily";

import { useDispatch } from "react-redux";
import { getFriendsInfo } from "./rest/helperFuncs";
import { MainRouteWrap } from "~components/MainRouteWrap/MainRouteWrap";
import { RoutesControl } from "~routes/RoutesControl";
// todo Why do we need them?
import "./Map/Map/Maps.css";
import "./App.css";

const { NavMain } = lazily(() => import("./navigation/NavMain"));
const { Modal } = lazily(() => import("./rest/Modal"));
const { MapRootComponent } = lazily(() => import("./Map"));
const { Banner } = lazily(() => import("~components/Banner/Banner"));
const { ToastStack } = lazily(() => import("~components/Toast/ToastStack"));

function App() {
  const dispatch = useDispatch();

  // TODO why is it here?
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
