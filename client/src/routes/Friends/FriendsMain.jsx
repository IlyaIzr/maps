import { useState } from "react";
import { Route, Switch } from "react-router-dom"
import { useSelector } from 'react-redux'
import { DefaultLayout } from "./DefaultLayout";
import { Profile } from "./Profile";
import { Results } from "./Results";
import { SearchBar } from "~components/SearchBar/SearchBar";
import "./Friends.css"
import { TEXT } from "~rest/lang";
import { AddByLink } from "./AddByLink";
import { AppLink } from '~components/Link/AppLink'


export const FriendsMain = () => {
  const app = useSelector(state => state.app)

  const [searchResults, setSearchResults] = useState(null);


  if (!app.isLogged) {
    return (
      // Styles from /Auth/Auth.css
      <div className="friendsWrap friendsNotLoggedWrap auth-container relative">
        <div className="absolute center auth-subcontainer">
          <div className="auth-action-wrap mp-border-secondary">
            <p>{TEXT.loginToUseThis}</p>
            <AppLink to="/auth">
              <button className="primary mp-border-accent loginBtn capitalize">
                {TEXT.authorization}
              </button>
            </AppLink>
          </div>
        </div>
      </div>
    )
  }

  // <AppLink to={`${url}/rendering`}>Rendering with React</AppLink>
  return (
    <div className="friendsWrap">
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
    </div>
  )
}
