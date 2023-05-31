import { useHistory, useLocation } from "react-router-dom"
import { TEXT } from "~rest/lang";

export const Results = ({ searchResults }) => {
  const query = new URLSearchParams(useLocation().search).get('query')
  const history = useHistory()

  if (!searchResults) return null

  if (!searchResults.length) return (
    <div className="resultsContainer">
      <h5>{TEXT.noResults}</h5>
    </div>
  )

  function onClick(id) {
    history.push(`/friends/item/${id}?from=${query}`)
  }

  return (
    <div className="resultsContainer">
      {searchResults.map(user => {
        return (
          <div className="resultUser cursor-pointer mp-accent-hover transition-small"
            key={user.id} onClick={() => onClick(user.id)}
          >

            <div className="authorLogo mp-bg-primary">
              <span className="mp-dark" title={user.login}>{String(user.name)?.[0]?.toUpperCase()}</span>
            </div>

            <div className="resultUser-creds">
              <p className="mp-primary">{user.name}</p>
              <label className="cursor-pointer">({user.login})</label>
            </div>
          </div>
        )
      })}
    </div>
  )
}
