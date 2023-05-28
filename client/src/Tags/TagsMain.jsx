import { useState } from "react";
import { Route, Switch } from "react-router-dom";
import '../Friends/Friends.css'
import { SearchBar } from "../Friends/SearchBar";
import { FeaturedTags } from "./FeaturedTags";
import { Results } from "./Results";
import { TagOverview } from "./TagOverview";
import './Tags.css'

export const TagsMain = () => {
  // const { app, user } = useSelector(state => state)

  const [searchResults, setSearchResults] = useState(null)


  return (
    <div className="tags">
      <SearchBar setSearchResults={setSearchResults} />

      <Switch>
        <Route exact path="/tags">
          <FeaturedTags />
        </Route>
        <Route path="/tags/item/:tag">
          <TagOverview />
        </Route>
        <Route path="/tags/search">
          <Results searchResults={searchResults} />
        </Route>

      </Switch>
    </div>
  )
}
