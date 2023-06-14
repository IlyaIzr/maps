import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProfileDetails, addFriend as addFriendReq, acceptRequest, removeFriend as removeFriendReq } from '~requests/friends';
import { getFriendsInfo } from '~rest/helperFuncs';
import { TEXT } from '~rest/lang';
import { Loading } from '~rest/Loading';
import { setToast } from '~store/app';
import { AppLink } from '~components/Link/AppLink'

export const Profile = () => {
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
    (async function () {

      // Case it's client wathing hos profile
      if (curUser.id === userId) {
        setUser({ ...curUser })
        setFriendButton(
          <AppLink to="/editProfile"><button className="button">{TEXT.profile}</button></AppLink>
        )
        return setLoading(false)
      }

      const res = await getProfileDetails(userId)

      if (res.status !== 'OK') setToast(dispatch, { message: TEXT.requestError + ' #profEr1' })
      else setUser(res.data)
      setLoading(false)
    })()
    // eslint-disable-next-line 
  }, [userId])

  useEffect(() => {
    if (!user?.friendStatus) { }
    // Friend statuses
    else if (user.friendStatus === 'friends') setFriendButton(
      <div>
        <AppLink to="/friends">
          <button className="button" >{TEXT.inFriendlist}</button>
        </AppLink>
        <button className="button mp-border-counter" onClick={removeFriend}>{TEXT.removeFriend}</button>
      </div>
    )
    else if (user.friendStatus === 'youRequested') setFriendButton(
      <button className="button mp-border-secondary mp-secondary" >{TEXT.youRequested}</button>
    )
    else if (user.friendStatus === 'youAsked') setFriendButton(
      <button className="button mp-border-accent" onClick={confirmRequest}>{TEXT.confirmRequest}</button>
    )
    // eslint-disable-next-line
  }, [user?.friendStatus]);

  if (loading) return (
    <div className="profileContainer">
      <Loading loading={loading} />
    </div>
  )

  async function addFriend() {
    const res = await addFriendReq(userId)
    if (res.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError + ' #profEr2' });
    await getFriendsInfo(dispatch)
    setFriendButton(
      <button className="button">{TEXT.sent}</button>
    )
  }

  async function removeFriend() {
    const res = await removeFriendReq(userId)
    if (res.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError + ' #profEr3' });
    await getFriendsInfo(dispatch)
    setUser({ ...user, friendStatus: 'youAsked' })
  }

  async function confirmRequest() {
    const res = await acceptRequest(userId)
    if (res.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError + ' #profEr4' });
    await getFriendsInfo(dispatch)
    setUser({ ...user, friendStatus: 'friends' })
  }

  if (!user) return (
    <div className="profileContainer">
      <div className="userProfile mp-border-dark">
        <p>{TEXT.noResults}</p>
      </div>
    </div>
  )

  return (
    <div className="profileContainer">
      <div className="userProfile mp-border-dark">
        {Boolean(user.avatar) && <div className="avatar"><img src={user.avatar} alt={TEXT.avatar} /></div>}
        <div className="mp-primary credentials " title={TEXT.userName}>{user.name} <label
          className="mp-dark" title={TEXT.login}>({user.login})
        </label>
        </div>
        {Boolean(user.commentsn) && <div className="commentsAmount">{TEXT.commentsAmount}: {user.commentsn}</div>}
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
