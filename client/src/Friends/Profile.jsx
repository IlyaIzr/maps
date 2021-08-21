import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getProfileDetails, addFriend as addFriendReq, acceptRequest, removeFriend as removeFriendReq } from '../requests/friends';
import { TEXT } from '../rest/lang';
import { Loading } from '../rest/Loading';
import { setToast } from '../store/app';

export const Profile = ({ setFrom }) => {
  const from = new URLSearchParams(useLocation().search).get('from')
  const { userId } = useParams();
  const dispatch = useDispatch()
  const curUser = useSelector(store => store.user)

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [friendButton, setFriendButton] = useState(
    // user.friendStatus === 'init'
    <button className="button" onClick={addFriend}>{TEXT.addFriend}</button>
  )


  useEffect(() => {
    setFrom(from);
    (async function () {

      // Case it's client wathing hos profile
      if (curUser.id === userId) {
        setUser({ ...curUser })
        setFriendButton(
          <Link to="/editProfile"><button className="button">{TEXT.profile}</button></Link>
        )
        return setLoading(false)
      }

      const res = await getProfileDetails(userId)

      if (res.status !== 'OK') setToast(dispatch, { message: 'seabob' + TEXT.requestError })
      else setUser(res.data)
      setLoading(false)
    })()
    return () => {
      setFrom(null)
    };
    // eslint-disable-next-line 
  }, [userId])

  useEffect(() => {
    // Friend statuses
    if (user.friendStatus === 'friends') setFriendButton(
      <div>
        <Link to="/friends">
          <button className="button" >{TEXT.inFriendlist}</button>
        </Link>
        <button className="button mp-border-counter" onClick={removeFriend}>{TEXT.removeFriend}</button>
      </div>
    )
    else if (user.friendStatus === 'youRequested') setFriendButton(
      <button className="button mp-border-secondary mp-secondary" >{TEXT.youRequested}</button>
    )
    else if (user.friendStatus === 'youAsked') setFriendButton(
      <button className="button mp-border-accent" onClick={confirmRequest}>{TEXT.confirmRequest}</button>
    )
  }, [user?.friendStatus]);

  if (loading) return (
    <div className="profileContainer">
      <Loading loading={loading} />
    </div>
  )

  async function addFriend() {
    const res = await addFriendReq(userId)
    if (res.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError });
    setFriendButton(
      <button className="button">{TEXT.sent}</button>
    )
  }

  async function removeFriend() {
    const res = await removeFriendReq(userId)
    if (res.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError });
    setUser({ ...user, friendStatus: 'youAsked' })
  }

  async function confirmRequest() {
    const res = await acceptRequest(userId)
    if (res.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError });
    setUser({ ...user, friendStatus: 'friends' })
  }



  return (
    <div className="profileContainer">
      <div className="userProfile mp-border-dark">
        {Boolean(user.avatar) && <div className="avatar"><img src={user.avatar} alt={TEXT.avatar} /></div>}
        <div className="mp-primary credentials " title={TEXT.userName}>{user.name} <label
          className="mp-dark" title={TEXT.login}>({user.login})
        </label>
        </div>
        {Boolean(user.commentsn + 1) && <div className="commentsn">{TEXT.commentsn}: {user.commentsn}</div>}
        <div className="level capitalize">{TEXT.level}: <label className="mp-dark">{user.level}</label></div>
      </div>
      <div className="friends-actionButton">
        {
          friendButton
        }
      </div>
    </div>
  )
}
