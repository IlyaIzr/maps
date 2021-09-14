import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import '../Friends/Friends.css'
import { SearchBar } from "../Friends/SearchBar";
import { hideMain } from "../store/app";
import { FeaturedTags } from "./FeaturedTags";
import { Results } from "./Results";
import { TagOverview } from "./TagOverview";
import './Tags.css'

export const TagsMain = () => {
  const dispatch = useDispatch()
  // const { app, user } = useSelector(state => state)

  const [searchResults, setSearchResults] = useState(null)

  
  useEffect(() => {
    hideMain(dispatch)
    // eslint-disable-next-line
  }, [])

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
      
      <div className="bottom"></div>
    </div>
  )
}
