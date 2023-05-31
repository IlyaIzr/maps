import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom"
import { TEXT } from "~rest/lang";
import { TagItem } from "./TagItem";

export const Results = ({ searchResults }) => {
  const query = new URLSearchParams(useLocation().search).get('query')
  const history = useHistory()

  const [formatted, setFormatted] = useState([]);

  useEffect(() => {
    if (!searchResults) return;
    // () => { }
    const tagsObj = {}
    searchResults.forEach(tagObj => {
      // first time
      if (!tagsObj[tagObj.tag]) return tagsObj[tagObj.tag] = { amount: tagObj.amount, places: [tagObj.placeId], tag: tagObj.tag }
      // next time
      tagsObj[tagObj.tag].amount += tagObj.amount
      tagsObj[tagObj.tag].places.push(tagObj.placeId)
    })
    setFormatted(Object.values(tagsObj))
    // eslint-disable-next-line 
  }, [searchResults])

  if (!searchResults) return null


  if (!searchResults.length) return (
    <div className="resultsContainer">
      <h5>{TEXT.noResults}</h5>
    </div>
  )

  function onClick(tag) {
    history.push(`/tags/item/${tag}?from=${query}`)
  }

  return (
    <div className="resultsContainer">
      {formatted.map(tagObj => {
        return <TagItem tagInfo={tagObj} key={tagObj.key} onClick={onClick} />
      })}
    </div>
  )
}
