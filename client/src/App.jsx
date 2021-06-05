import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css'
// Components
import { Main } from "./Map/Main";
import { AuthMain } from './Auth/AuthMain'
import { useState } from "react";
import { TEXT } from "./rest/lang";



function App() {
  const [isMain, setIsMain] = useState(true);

  return (
    <Router>

      {/* navigation to be here */}
      <div className="mainNavigation">
        <Link to="/" onClick={() => setIsMain(true)}>{TEXT.homeLinkBtn}</Link>
        <Link to="/auth" onClick={() => setIsMain(false)}>{TEXT.authLinkBtn}</Link>
        <Link to="/settings" onClick={() => setIsMain(false)}>{TEXT.setsLinkBtn}</Link>
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
