import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { TEXT } from '../rest/lang'
import { friendModeId, hideMain, setMapMode } from '../store/app'

export const WatchMode = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { friends } = useSelector(s => s.user)
  const mode = useSelector(s => s.app.mode)

  function onClick(id) {
    history.push('/')
    friendModeId(dispatch, id)
    setMapMode(dispatch, 'watch')
  }

  function reset() {
    history.push('/')
    setMapMode(dispatch, 'default')
  }

  useEffect(() => {
    hideMain(dispatch)
    // eslint-disable-next-line
  }, [])

  function drawMode() {
    history.push('/')
    setMapMode(dispatch, 'draw')
  }

  return (
    <div className="modeSwitch">

      <h4>{TEXT.watchMode}</h4>
      <div className="modeType mp-border-secondary">
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
      </div>
      {(mode !== 'draw') &&

        <div className="modeType mp-border-secondary">
          <p className="subtitle">{TEXT.watchModeSub3}</p>
          <Link to="/">
            <button className="button drawModeButton" onClick={drawMode}>
              <img src="/icons/edit-pen.svg" alt="draw area" />
              {TEXT.drawMode}
            </button>
          </Link>
        </div>
      }

      {mode &&
        <button className="button capitalize mp-counter mp-border-counter" onClick={reset}>{TEXT.reset}</button>
      }

    </div>
  )
}
