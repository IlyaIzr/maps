import { useState } from "react";
import { Link, Route, Switch } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { DefaultLayout } from "./DefaultLayout";
import { Profile } from "./Profile";
import { Results } from "./Results";
import { SearchBar } from "./SearchBar";
import "./Friends.css"
import { useEffect } from "react";
import { hideMain } from "../store/app";
import { TEXT } from "../rest/lang";
import { AddByLink } from "./AddByLink";


export const FriendsMain = () => {
  const dispatch = useDispatch()
  const app = useSelector(state => state.app)

  const [searchResults, setSearchResults] = useState(null);



  useEffect(() => {
    hideMain(dispatch)
    // eslint-disable-next-line
  }, [])

  if (!app.isLogged) {
    return (
      // Styles from /Auth/Auth.css
      <div className="friendsNotLoggedWrap auth-container relative">
        <div className="absolute center auth-subcontainer">
          <div className="auth-action-wrap mp-border-secondary">
            <p>{TEXT.loginToUseThis}</p>
            <Link to="/auth">
              <button className="primary mp-border-accent loginBtn capitalize">
                {TEXT.authorization}
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // <Link to={`${url}/rendering`}>Rendering with React</Link>
  return (
    <div>
      <SearchBar setSearchResults={setSearchResults} />

      <Switch>
        <Route exact path="/friends">
          <DefaultLayout />
        </Route>
        <Route path="/friends/item/:userId">
          <Profile />
        </Route>
        <Route path="/friends/search">
          <Results searchResults={searchResults} />
        </Route>
        <Route path="/friends/addByLink">
          <AddByLink />
        </Route>

      </Switch>
      
      <div className="bottom"></div>
    </div>
  )
}
