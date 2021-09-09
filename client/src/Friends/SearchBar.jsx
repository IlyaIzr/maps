import { useState } from "react"
import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import { searchUsers } from "../requests/friends"
import { searchTags } from "../requests/tags"
import { TEXT } from "../rest/lang"
import { setToast } from "../store/app"
import { ReactComponent as SearchIcon } from '../rest/svg/search.svg';

// Used both for friends and tags
export const SearchBar = ({ setSearchResults }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const [input, setInput] = useState('')


  function onInput(e) {
    setInput(e.target.value)
  }

  async function submitEnter() {
    const chapter = history.location.pathname.split('/')[1]
    let res
    if (chapter === 'friends') { res = await searchUsers(input) }
    else { res = await searchTags(input) }

    if (res.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError });
    setSearchResults(res.data)
    history.push(`/${chapter}/search?query=${input}`)
  }

  function onKeyDown(e) {
    if (e.key !== 'Enter') return;
    submitEnter()
  }

  function onBack() {
    history.goBack()
  }

  return (
    <div className="searchContainer transition">

      <div onClick={onBack} className="backButton">
        <button className="button mp-primary">{"<<"}</button>
      </div>

      <input type="text" name="search" value={input} onInput={onInput} onKeyDown={onKeyDown} />
      <div className="searchButton relative">
        <button onClick={submitEnter} className="button">&#8203;<SearchIcon fill="var(--accent)" /></button>
      </div>
    </div>
  )
}
