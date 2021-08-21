import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getFriends } from "../requests/friends";
import { TEXT } from "../rest/lang";
import { setToast } from "../store/app";

export const DefaultLayout = () => {
  const dispatch = useDispatch()

  const [friends, setFriends] = useState(null)

  useEffect(() => {
    (async function () {
      const res = getFriends()
      if (res.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError });
      setFriends(res.data)
    })()
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      DefaultLayout
      <h3>myFriends + addMeLink + addByLink</h3>
      {/* My friends */}
      <h4>{TEXT.friendList}</h4>
      {Boolean(friends?.length) ? friends.map(id => {
        return (<div className="friendList">
          <div className="friendContainer" key={id}>

          </div>
        </div>)
      }) :
        <div className="noFriendsCase">
          <h5>{TEXT.sadlyNoFriends}</h5>
          <button>{TEXT.addFriends}</button>
        </div>}
    </div>
  )
}
