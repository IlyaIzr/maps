import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { TEXT } from '../rest/lang'
import { friendModeId, hideMain } from '../store/app'

export const WatchMode = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { friends } = useSelector(s => s.user)

  function onClick(id) {
    history.push('/')
    friendModeId(dispatch, id)
  }

  function reset() {
    history.push('/')
    friendModeId(dispatch, null)
  }

  useEffect(() => {
    hideMain(dispatch)
    // eslint-disable-next-line
  }, [])

  return (
    <div className="watchMode">

      <h4>{TEXT.watchMode}</h4>
      <p className="subtitle">{TEXT.watchModeSub1}</p>
      <div className="friendList">
        {Boolean(friends?.length) ? friends.map(user => {
          return (
            <div className="friendContainer" key={user.id1 + user.id2}>
              <div className="resultUser cursor-pointer mp-accent-hover transition-small"
                key={user.id} onClick={() => onClick(user.id)}
              >

                <div className="authorLogo mp-bg-secondary">
                  <span className="mp-dark" title={user.login}>{String(user.name)?.[0]?.toUpperCase()}</span>
                </div>

                <div className="resultUser-creds">
                  <p className="mp-secondary">{user.name}</p>
                  <label className="cursor-pointer">({user.login})</label>
                </div>
              </div>
            </div>
          )
        }) :
          <div className="noFriendsCase">
            <h5>{TEXT.watchModeSub2}</h5>
            <Link to="/friends">
              <button>{TEXT.addFriends}</button>
            </Link>
          </div>}
      </div>
      <button className="button capitalize mp-counter mp-border-counter" onClick={reset}>{TEXT.reset}</button>
    </div>
  )
}
