import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { TEXT } from "~rest/lang";
const link = window.location.origin + '/friends/addByLink?id='

export const DefaultLayout = () => {
  const history = useHistory()
  const { id: userID, friends, requests } = useSelector(s => s.user)


  function onClick(id) {
    history.push(`/friends/item/${id}`)
  }
  function onLink(e) {
    e.target.select()
  }


  return (
    <div className="friendsDefault">
      {/* <h3>myFriends + addMeLink + addByLink</h3> */}
      {/* My friends */}
      <h4>{TEXT.friendList}</h4>
      <div className="friendList">
        {Boolean(friends?.length) ? friends.map(user => {
          return (
            <div className="friendContainer" key={user.id1 + user.id2}>
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
            </div>
          )
        }) :
          <div className="noFriendsCase">
            <h5>{TEXT.sadlyNoFriends}</h5>
            {/* <button>{TEXT.addFriends}</button> */}
          </div>}
      </div>
      {/* My requests */}
      <h4>{Boolean(requests?.length) && TEXT.friendRequests}</h4>{
        Boolean(requests?.length) &&
        <div className="friendList">
          {Boolean(requests?.length) && requests.map(user => {
            return (
              <div className="friendContainer" key={user.id1 + user.id2}>
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
              </div>
            )
          })}
        </div>}

      {/* Add me link */}
      <div className="addMeLink">
        <h4>{TEXT.addMeLink}</h4>
        <input type="text" value={link + userID} onFocus={onLink} readOnly />
      </div>
      {/* Add by link */}
      <Link to="/friends/addByLink">
        <button className="button">{TEXT.addByLink}</button>
      </Link>

    </div>
  )
}

