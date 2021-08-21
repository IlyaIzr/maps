import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import { searchUsers } from "../requests/friends"
import { TEXT } from "../rest/lang"
import { setToast } from "../store/app"

export const SearchBar = ({ setSearchResults, from }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const [input, setInput] = useState('')


  function onInput(e) {
    setInput(e.target.value)
  }

  async function submitEnter() {
    const res = await searchUsers(input)
    if (res.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError });
    setSearchResults(res.data)
    history.push('/friends/search?query=' + input)
  }

  function onKeyDown(e) {
    if (e.key !== 'Enter') return;
    submitEnter()
  }

  function onBack() {
    history.push(`/friends/search?query=${from}`)
  }

  return (
    <div className="searchContainer transition">
      {from &&
        <div onClick={onBack} className="backButton">
          <button className="button mp-primary">{"<<"}</button>
        </div>}

      <label htmlFor="search"></label>
      <input type="text" name="search" value={input} onInput={onInput} onKeyDown={onKeyDown} />
      <button onClick={submitEnter}>searchPH</button>
    </div>
  )
}
