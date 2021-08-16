import { useState } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom"
import { DefaultLayout } from "./DefaultLayout";
import { Profile } from "./Profile";
import { Results } from "./Results";
import { SearchBar } from "./SearchBar";
import "./Friends.css"


export const FriendsMain = () => {
  let { path, url } = useRouteMatch();
  const [searchResults, setSearchResults] = useState(null);
  console.log('%c⧭', 'color: #731d6d', path, url);

  // <Link to={`${url}/rendering`}>Rendering with React</Link>
  return (
    <div>
    <SearchBar setSearchResults={setSearchResults}/>

      <Switch>
        <Route exact path="/friends">
          <DefaultLayout />
        </Route>
        <Route path="/friends/user/:userId">
          <Profile />
        </Route>
        <Route path="/friends/search">
          <Results searchResults={searchResults} />
        </Route>

      </Switch>
    </div>
  )
}
